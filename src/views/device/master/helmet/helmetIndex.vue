<!--
 * @Author: hjy
 * @CreateTime: 2018-09-08 22:31:23 
 * @Desc: 安全帽管理主页面
-->
<template>
    <div class="app-container list-container">
        <div class="container-box condition-box">
            <div class="conditionBar">
                <el-form :inline="true" class="condition-form">
                    <el-form-item>
                        <!-- <el-input size="mini" placeholder="工程名称" v-model="keyword" clearable class="toolbar-search"></el-input> -->
                        <el-select size="mini" v-model="projectId" filterable clearable placeholder="工程名称">
                            <el-option v-for="item in projectList" :label="item.name" :value="item.id"
                                       :key="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-input size="mini" placeholder="请输入IMEI编号" v-model="keyword" clearable
                                  class="toolbar-search"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button class="searchBtn" type="primary" size="mini" icon="el-icon-search"
                                   @click="handleSearchButton">查询
                        </el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button v-if="validateOperation('projectTransfers')" class="updateBtn" type="primary" size="mini"
                                   icon="el-icon-dagou" :disabled="disabledFlag" @click="projectTransfers">项目调拨
                        </el-button>
                        <el-button v-if="validateOperation('personTransfers')" class="updateBtn" type="primary" size="mini"
                                   icon="el-icon-dagou" :disabled="disabledFlag" @click="personTransfers">人员调拨
                        </el-button>

                        <el-button v-if="validateOperation('close')" class="updateBtn" type="danger" size="mini"
                                   icon="el-icon-xx" :disabled="checkDisabled('status=0')" @click="handleClose">停用
                        </el-button>
                        <el-button v-if="validateOperation('open')" class="updateBtn" type="primary" size="mini"
                                   icon="el-icon-dagou" :disabled="checkDisabled('status=1')" @click="handleOpen">启用
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>

        <div class="container-box list-box">
            <div class="table-box">
                <el-table size="small" :data="listData" style="width: 100%" height="100%" highlight-current-row
                          @selection-change="listSelectionChange" header-row-class-name="xyTableHeader">
                    <el-table-column type="selection" :width="selectionWidth"></el-table-column>
                    <el-table-column type="index" :width="indexWidth"></el-table-column>
                    <el-table-column label="工程名称" align="center" prop="projectName"
                                     show-overflow-tooltip></el-table-column>
                    <el-table-column label="IMEI编号" prop="imei" align="center" show-overflow-tooltip></el-table-column>
                    <!--<el-table-column label="名称" prop="name" show-overflow-tooltip></el-table-column>-->
                    <el-table-column label="在线状态" prop="isOnline" align="center"
                                     :formatter="handleIsOnline"></el-table-column>
                    <el-table-column label="状态" prop="status" align="center"
                                     :formatter="handleStatus"></el-table-column>
                    <el-table-column label="证件类型" prop="idCardType" align="center"
                                     :formatter="handleIdCardType"></el-table-column>
                    <el-table-column label="证件编号" prop="idCardNumber" align="center" width="150px"
                                     show-overflow-tooltip></el-table-column>
                    <el-table-column label="备注" prop="comments" align="center" show-overflow-tooltip></el-table-column>
                    <!--<el-table-column label="创建日期" prop="createTime" :formatter="handleDate"
                                     :width="dateWidth"></el-table-column>
                    <el-table-column label="创建人" prop="createUserName" :width="userWidth"
                                     show-overflow-tooltip></el-table-column>-->
                    <!--<el-table-column label="操作" :width="operateWidth" align="center" fixed="right">
                        <template slot-scope="scope">
                            <rightButton :operationPrex="operationPrex" :hasView="true" :hasUpdate="true"
                                         @clickView="handleView" @clickUpdate="handleUpdate" @clickDelate="handleDelete"
                                         :disUpdate="scope.row.status=='1'?true:false"
                                         :disDelete="scope.row.status=='1'?true:false" :row="scope.row"></rightButton>
                        </template>
                    </el-table-column>-->
                </el-table>
            </div>
            <div class="pagination-box">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                               :current-page="pageIndex" :page-sizes="pageSizes" :page-size="pageSize"
                               :total="pageTotal" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
            </div>
        </div>

        <personTransfersDialog v-if="personTransfersVisible" :visible.sync="personTransfersVisible"
                               @close="closeDialog" :detailIds="detailIds">
        </personTransfersDialog>
        <projectTransfersDialog v-if="projectTransfersVisible" :visible.sync="projectTransfersVisible"
                                @close="closeDialog" :selsData="sels">
        </projectTransfersDialog>
    </div>
</template>

<script>
    import {
        getListApi,
        getProjectListApi,
        updateStatusApi,
    } from "../../api/helmet.js";
    import detailsDialog from "./helmetDetails";
    import personTransfersDialog from "./helmetPersonTransfersDialog";
    import projectTransfersDialog from "./helmetProjectTransfersDialog.vue";
    import moment from "moment";

    export default {
        components: {
            detailsDialog,
            personTransfersDialog,
            projectTransfersDialog,
        },
        data() {
            return {
                operationPrex: "helmet:device:manage",
                listData: [],
                projectId: "",
                keyword: "",
                pageIndex: 1,
                pageSizes: [10, 20, 30],
                pageSize: 10,
                pageTotal: 0,
                disabled: false,
                disabledFlag: true,
                sels: [],
                visible: false,
                personTransfersVisible: false,
                projectTransfersVisible: false,
                detailsType: null,
                activeCode: 0,
                detailIds: null,
                projectList: []
            };
        },
        computed: {
            params() {
                let param = {
                    id: this.projectId,
                    pageNum: this.pageIndex,
                    key: this.keyword,
                    pageSize: this.pageSize
                };
                return param;
            }
        },
        mounted() {
            this.handleSearch();
            this.getProjectList();
        },
        methods: {
            //默认查询
            handleSearch() {
                this.getListData();
            },
            //查询项目列表
            getProjectList() {
                getProjectListApi({}).then(res => {
                    this.projectList = res.data;
                });
            },
            //查询一览
            getListData() {
                getListApi(this.params).then(res => {
                    this.listData = res.data.list;
                    this.pageTotal = res.data.total;
                });
            },
            handleSearchButton() {
                this.pageIndex = 1;
                this.getListData();
            },
            //日期格式转换
            handleDate(row, column, cellValue, index) {
                if (cellValue) {
                    return moment(cellValue).format("YYYY-MM-DD");
                } else {
                    return "";
                }
            },
            //项目调拨
            projectTransfers() {
                this.projectTransfersVisible = true;
            },
            //人员调拨
            personTransfers() {
                if (this.sels.length !== 1) {
                    this.$message({
                        message: "人员调拨时只能选择一条数据",
                        type: "error"
                    });
                    return;
                }
                this.detailIds = this.sels[0].id;
                this.personTransfersVisible = true;
            },
            //启用
            handleOpen() {
                let params = {ids: this.sels.map(item => item.id), key: "use"};
                let flag = false;
                this.$confirm("确认启用选中记录吗？", "提示", {
                    type: "warning"
                }).then(() => {
                    this.sels.forEach(element => {
                        console.log(element.status);

                        if (element.status === 1 || element.status == "已启用") {
                            flag = true;
                            this.$message({
                                message: "已启用的不可再启用",
                                type: "error"
                            });
                            return;
                        }
                    });
                    if (!flag) {
                        updateStatusApi(params).then(res => {
                            this.$message({
                                message: res.message,
                                type: res.success ? "success" : "error"
                            });
                            this.handleSearch();
                        });
                    }
                });
            },
            //条数变更
            handleSizeChange(val) {
                this.pageSize = val;
                this.getListData();
            },
            //页数变更
            handleCurrentChange(val) {
                this.pageIndex = val;
                this.getListData();
            },

            //选中的行数据
            listSelectionChange(sels) {
                this.sels = sels;
                if (this.sels.length > 0) {
                    this.disabledFlag = false;
                } else {
                    this.disabledFlag = true;
                }

            },
            //停用方法
            handleClose() {
                let params = {ids: this.sels.map(item => item.id), key: "stop"};
                let flag = false;
                //console.log(params.ids.length);
                if (params.ids.length > 0) {
                    this.$confirm("确认停用选中记录吗？", "提示", {
                        type: "warning"
                    }).then(() => {
                        this.sels.forEach(element => {
                            //console.log(element.status);
                            if (element.status === 0 || element.status == "已停用") {
                                flag = true;
                                this.$message({
                                    message: "已停用的不可再停用",
                                    type: "error"
                                });
                                return;
                            }
                        });
                        if (!flag) {
                            updateStatusApi(params).then(res => {
                                this.$message({
                                    message: res.message,
                                    type: res.success ? "success" : "error"
                                });
                                this.handleSearch();
                            });
                        }
                    });
                } else {
                    this.$message({
                        message: "请选择要启用的记录！",
                        type: "warning"
                    });
                }
            },
            //设备状态
            handleIsOnline(row) {
                return row.isOnline == 1 ? "在线" : "离线";
            },
            //启用状态
            handleStatus(row) {
                return row.status == 1 ? "已启用" : "未启用";
            },
            handleIdCardType(row) {
                if (row.idCardType === 1) {
                    return "身份证";
                } else if (row.idCardType === null) {
                    return "";
                } else {
                    return "其他";
                }
            },
            //关闭弹窗
            closeDialog() {
                this.visible = false;
                this.personTransfersVisible = false;
                this.projectTransfersVisible = false;
                this.pageIndex = 1;
                this.pageSize = 10;
                this.handleSearch();
            }
        }
    };
</script>

<style lang="scss" scoped>
</style>

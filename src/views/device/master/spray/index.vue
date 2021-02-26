<!--
 * @Author: zhouyujie
 * @CreateTime: 2018-09-08 22:31:23
 * @Desc: 绿色施工主页面
-->
<template>
    <div class="app-container list-container">
        <div class="container-box condition-box">
            <div class="conditionBar">
                <el-form :inline="true" class="condition-form">
                    <el-form-item>
                        <el-select size="mini" v-model="projectId" filterable clearable placeholder="工程名称">
                            <el-option v-for="item in projectList" :label="item.name" :value="item.id"
                                       :key="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button class="searchBtn" type="primary" size="mini" icon="el-icon-search"
                                   @click="handleSearch">查询
                        </el-button>
                    </el-form-item>
                    <topButton :operationPrex="operationPrex" @clickInsert="handleInsert" @clickUpdate="handleUpdate"
                               @clickDelate="handleDelete" check="status=1" :sels="sels"></topButton>
                    <el-form-item>
                        <el-button v-if="validateOperation('reboot')" class="updateBtn" type="primary" size="mini"
                                   icon="" :disabled="disabledStatus" @click="handleReboot">设备重启
                        </el-button>
                        <el-button v-if="validateOperation('open')" class="updateBtn" type="primary" size="mini"
                                   icon="el-icon-dagou" :disabled="checkOpenDisabled" @click="handleDeviceOpen">开启
                        </el-button>
                        <el-button v-if="validateOperation('close')" class="updateBtn" type="danger" size="mini"
                                   icon="el-icon-xx" :disabled="checkDisabledClose" @click="handleDeviceClose">关闭
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
                    <el-table-column label="工程名称" prop="projectName" show-overflow-tooltip></el-table-column>
                    <el-table-column label="黑匣子编号" prop="deviceNo" show-overflow-tooltip></el-table-column>
                    <el-table-column label="在线状态" prop="onlineName"></el-table-column>
                    <el-table-column label="状态" prop="statusName"></el-table-column>
                    <el-table-column label="创建人" prop="createUserName" :width="userWidth"
                                     show-overflow-tooltip></el-table-column>
                    <el-table-column label="操作" :width="400" align="center" fixed="right">
                        <template slot-scope="scope">
                            <rightButton :operationPrex="operationPrex" :hasView="true" :hasUpdate="true"
                                         @clickView="handleView" @clickUpdate="handleUpdate" @clickDelate="handleDelete"
                                         :disUpdate="scope.row.status=='1'?true:false"
                                         :disDelete="scope.row.status=='1'?true:false" :row="scope.row">
                                <el-button v-if="validateOperation('log')" class="updateBtn" type="primary" size="mini"
                                           icon="el-icon-edit" @click="showLog(scope.row)">日志
                                </el-button>
                            </rightButton>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="pagination-box">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                               :current-page="pageIndex" :page-sizes="pageSizes" :page-size="pageSize"
                               :total="pageTotal" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
            </div>
        </div>

        <detailsDialog v-if="visible" :visible.sync="visible" @close="closeDialog" :routeType="detailsType"
                       :activeCode="activeCode" :detailsId="detailsId"></detailsDialog>

        <el-dialog title="喷淋日志" :visible.sync="dialogVisible" width="80%" :close-on-click-modal="false">
            <el-table size="small" :data="detailData" style="width: 100% ; height:100%">
                <el-table-column type="selection" :width="selectionWidth"></el-table-column>
                <el-table-column type="index" :width="indexWidth"></el-table-column>
                <el-table-column label="黑匣子编号" prop="deviceNo" show-overflow-tooltip></el-table-column>
                <el-table-column label="操作类型" prop="operationType" :formatter="handleType"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column label="控制模式" prop="controlMode" :formatter="handleMode"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column label="详情" prop="detail" show-overflow-tooltip></el-table-column>
            </el-table>
            <el-pagination @size-change="sizeChange" @current-change="currentChange"
                           :current-page="detailPageIndex" :page-sizes="detailPageSizes" :page-size="detailPageSize"
                           :total="detailTotal" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
        </el-dialog>
    </div>
</template>

<script>
    import {
        getListApi,
        deleteInfoApi,
        handleRebootApi,
        getProjectListApi,
        handleDeviceOpenCloseApi,
        getBySprayId
    } from "../../api/spray.js";
    import detailsDialog from "./details";

    export default {
        components: {
            detailsDialog
        },
        data() {
            return {
                operationPrex: "dust:spray:device",
                listData: [],
                cameraInfo: [],
                monitorDetails: [],
                sprayMessage: [],
                sprayList: [],
                rowSelected: [],
                detailTotal: 0,
                detailData: [],
                dialogVisible: false,
                projectId: "",
                rowId: "",
                keyword: "",
                mapVisible: false,
                bindVisible: false,
                pageIndex: 1,
                pageSizes: [10, 20, 30],
                detailPageSizes: [10, 20, 30],
                detailPageSize: 10,
                detailPageIndex: 1,
                pageSize: 10,
                pageTotal: 0,
                pageIndex1: 1,
                pageSizes1: [10, 20, 30],
                pageSize1: 10,
                pageTotal1: 0,
                sels: [],
                visible: false,
                sprayVisible: false,
                detailsType: null,
                bindType: null,
                activeCode: 0,
                detailsId: null,
                projectList: [],
                disabledStatus: true,
                checkOpenDisabled: true,
                checkDisabledClose: true
            };
        },
        computed: {
            params() {
                let param = {
                    id: this.projectId,
                    pageNum: this.pageIndex,
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
                if (this.params.id != "" && this.params.id != null) {
                    this.pageIndex = 1;
                    this.pageSize = 10;
                }
                getListApi(this.params).then(res => {
                    this.listData = res.data.list;
                    this.pageTotal = res.data.total;
                });
            },
            //重启
            handleReboot() {
                this.$confirm("确认重启选中的设备吗？", "提示", {
                    type: "warning"
                }).then(() => {
                    handleRebootApi({body: this.sels}).then(res => {
                        this.$message({
                            message: res.message,
                            type: res.success ? "success" : "error"
                        });
                        this.handleSearch();
                    });
                });
            },
            //关闭
            handleDeviceClose() {
                this.$confirm("确认关闭选中的设备吗？", "提示", {
                    type: "warning"
                }).then(() => {
                    handleDeviceOpenCloseApi({body: this.sels, type: 0}).then(res => {
                        this.$message({
                            message: res.message,
                            type: res.success ? "success" : "error"
                        });
                        this.handleSearch();
                    });
                });
            },
            handleMode(row) {
                if (row.controlMode == 1) {
                    return "平台手动操作";
                }
                if (row.controlMode == 0) {
                    return "系统自动操作";
                }
            },
            handleType(row) {
                if (row.controlMode == 1) {
                    return "开启喷淋";
                }
                if (row.controlMode == 0) {
                    return "关闭喷淋";
                }
                if (row.controlMode == 2) {
                    return "重启设备";
                }
            },

            showLog(row) {
                this.dialogVisible = true;
                this.rowId = row.id;
                this.detailPageIndex= 1;
                this.detailPageSize =10;
                this.getLogData();
            },
            getLogData() {
                let para = {
                    pageNum: this.detailPageIndex,
                    pageSize: this.detailPageSize,
                    id: this.rowId
                };
                getBySprayId(para).then(res => {
                    this.detailData = res.data.list;
                    this.detailTotal = res.data.total;
                });
            },
            //打开
            handleDeviceOpen() {
                this.$confirm("确认关闭选中的设备吗？", "提示", {
                    type: "warning"
                }).then(() => {
                    handleDeviceOpenCloseApi({body: this.sels, type: 1}).then(res => {
                        this.$message({
                            message: res.message,
                            type: res.success ? "success" : "error"
                        });
                        this.handleSearch();
                    });
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
            currentChange(val) {
                this.detailPageIndex = val;
                this.getLogData();
            },
            sizeChange(val) {
                this.detailPageSize = val;
                this.getLogData();
            },
            //选中的行数据
            listSelectionChange(sels) {
                this.checkOpenDisabled = true;
                this.checkDisabledClose = true;
                this.sels = sels;
                this.disabledStatus = sels.length <= 0;
                if (sels.length > 0) {
                    let checkOpenDisabledFlag = true;
                    let checkDisabledCloseFlag = true;
                    sels.forEach(el => {
                        debugger;
                        if (el.isOnline === 0) {
                            checkOpenDisabledFlag = false;
                            checkDisabledCloseFlag = false;
                        } else {
                            if (el.status === 1) {
                                checkOpenDisabledFlag = false;
                            }
                            if (el.status === 0) {
                                checkDisabledCloseFlag = false;
                            }
                        }
                    });
                    if (checkOpenDisabledFlag) {
                        this.checkOpenDisabled = false;
                    }
                    if (checkDisabledCloseFlag) {
                        this.checkDisabledClose = false;
                    }
                }
            },
            //删除
            handleDelete(sels) {
                let params = {ids: sels.map(item => item.id)};

                this.$confirm("确认删除选中记录吗？", "提示", {
                    type: "warning"
                }).then(() => {
                    deleteInfoApi(params).then(res => {
                        this.$message({
                            message: res.message,
                            type: res.success ? "success" : "error"
                        });
                        this.handleSearch();
                    });
                });
            },
            handleClose() {
                this.sprayVisible = false;
            },
            //查看
            handleView(row) {
                this.activeCode = 0;
                this.visible = true;
                this.detailsType = "view";
                this.detailsId = row.id;
            },
            //跳转编辑
            handleUpdate(row) {
                this.visible = true;
                this.detailsType = "update";
                this.detailsId = row.id;
            },
            //跳转新增
            handleInsert() {
                this.visible = true;
                this.detailsType = "insert";
                this.detailsId = null;
            },

            //关闭弹窗
            closeDialog() {
                this.detailPageIndex = 1;
                this.detailPageSize = 10;
                this.visible = false;
                this.pageIndex = 1;
                this.pageSize = 10;
                this.handleSearch();
            }
        }
    };
</script>

<style lang="scss" scoped>
</style>

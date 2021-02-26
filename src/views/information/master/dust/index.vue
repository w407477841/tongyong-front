<template>
    <div class="app-container list-container">
        <div class="container-box condition-box">
            <div class="conditionBar">
                <el-form :inline="true" class="condition-form">
                    <el-form-item label="">
                        <el-select v-model="projectId" filterable clearable placeholder="工程名称" size="mini">
                            <el-option v-for="item in projectList" :label="item.name" :value="item.id"
                                       :key="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="">
                        <el-select v-model="isOnline" clearable placeholder="状态" size="mini">
                            <el-option v-for="item in statusList" :label="item.label" :value="item.value"
                                       :key="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button class="searchBtn" type="primary" size="mini" icon="el-icon-search"
                                   @click="handleSearchButton">查询
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
                    <el-table-column label="黑匣子编号" prop="deviceNo"></el-table-column>
                    <el-table-column label="制造厂家" prop="manufactor"></el-table-column>
                    <el-table-column label="状态" prop="isOnline" :formatter="isOnlineCheck"></el-table-column>
                    <el-table-column label="工程名称" prop="projectName" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label="操作" width="300" align="center" fixed="right">
                        <template slot-scope="scope">
                            <dustButton @monitorStatus="monitorStatus" @operationData="operationData"
                                        @warningMessage="warningMessage" :row="scope.row"></dustButton>
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
    </div>
</template>

<script>
    import {getListApi} from "@/views/information/api/dust.js";
    import {getProjectListApi} from "@/views/device/api/crane.js";
    import dustButton from "./dustButton";

    export default {
        components: {dustButton},
        data() {
            return {
                listData: [],
                isDangerous: "",
                keyword: "",
                isOnline: null,
                projectId: null,
                pageIndex: 1,
                pageSizes: [10, 20, 30],
                pageSize: 10,
                pageTotal: 0,
                sels: [],
                visible: false,
                detailsType: null,
                projectList: [],
                statusList: [
                    {label: "离线", value: 0},
                    {label: "在线", value: 1}
                ],
                detailsId: null
            };
        },
        computed: {
            params() {
                let param = {
                    key: this.keyword,
                    pageNum: this.pageIndex,
                    pageSize: this.pageSize,
                    body: {
                        isOnline: this.isOnline,
                        projectId: this.projectId,
                        projectName: this.projectName
                    }
                };
                return param;
            }
        },
        mounted() {
            this.getOtherInfo();
            this.getListData();
        },
        methods: {
            handleSearch() {
                this.getListData();

            },
            handleSearchButton() {
                this.pageIndex = 1;
                this.getListData();
            },
            //加载项目下拉框数据
            getOtherInfo() {
                getProjectListApi({}).then(res => {
                    this.projectList = res.data;
                });
            },
            //获取列表
            getListData() {
                getListApi(this.params).then(res => {
                    this.listData = res.data.list;
                    this.pageTotal = res.data.total;
                });
            },
            //每页多少条
            handleSizeChange(val) {
                this.pageSize = val;
                this.handleSearch();
            },
            //当前页
            handleCurrentChange(val) {
                this.pageIndex = val;
                this.handleSearch();
            },
            listSelectionChange(sels) {
                this.sels = sels;
            },
            //监控状态
            monitorStatus(sels) {
                this.$router.push({
                    path: this.$route.path + "/monitorStatus",
                    query: {
                        id: sels.id,
                        deviceNo: sels.deviceNo
                    }
                });
            },
            isOnlineCheck(row) {
                if (row.isOnline === 0) {
                    return "离线";
                } else if (row.isOnline === 1) {
                    return "在线";
                } else {
                    return "未知";
                }
            },
            //运行数据
            operationData(sels) {
                this.$router.push({
                    path: this.$route.path + "/operationData",
                    query: {id: sels.id}
                });
            },
            //报警信息
            warningMessage(sels) {
                this.$router.push({
                    path: this.$route.path + "/warningMessage",
                    query: {
                        id: sels.id,
                        projectName: sels.projectName
                    }
                });
            },
        }
    };
</script>

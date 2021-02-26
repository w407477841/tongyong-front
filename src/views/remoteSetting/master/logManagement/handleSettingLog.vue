<!--
 * @Author: hjy
 * @CreateTime: 2018-11-08 09:30:40
 * @Desc: 塔吊设置日志履历
-->
<template>
    <el-dialog width="80%" :title="title" :visible.sync="visHandleSettingLog" :close-on-click-modal="false"
               append-to-body>
        <div class="details-container">
            <div class="container-box details-box">
                <div class="details-body">
                    <el-tabs type="border-card" style="height:100%" v-model="activeName2">
                        <el-tab-pane label="校准设置履历" name="first">
                            <div class="container-box condition-box">
                                <div class="conditionBar">
                                </div>
                            </div>

                            <div class="container-box list-box">
                                <div class="table-box">
                                    <el-table size="small" :data="listData1" style="width: 100%" highlight-current-row
                                              @selection-change="listSelectionChange"
                                              header-row-class-name="xyTableHeader">
                                        <el-table-column type="selection" :width="selectionWidth"></el-table-column>
                                        <el-table-column type="index" :width="indexWidth"></el-table-column>
                                        <el-table-column label="黑匣子编号" prop="deviceNo" width="130px"></el-table-column>
                                        <el-table-column label="命令功能" prop="command" width="150px"
                                                         show-overflow-tooltip
                                                         :formatter="handleCommand"></el-table-column>
                                        <!--<el-table-column label="项目名称" prop="createUserName"></el-table-column>-->
                                        <el-table-column label="设置内容" prop="content"
                                                         show-overflow-tooltip></el-table-column>
                                        <el-table-column label="操作时间" prop="createTime" :formatter="handleDate"
                                                         width="140px"></el-table-column>
                                    </el-table>
                                </div>
                                <div class="pagination-box">
                                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                                                   :current-page="pageIndex" :page-sizes="pageSizes"
                                                   :page-size="pageSize"
                                                   :total="pageTotal"
                                                   layout="total, sizes, prev, pager, next, jumper"></el-pagination>
                                </div>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="单机防碰撞设置履历" name="second">
                            <div class="container-box condition-box">
                                <div class="conditionBar">
                                </div>
                            </div>

                            <div class="container-box list-box">
                                <div class="table-box">
                                    <el-table size="small" :data="listData2" style="width: 100%" highlight-current-row
                                              @selection-change="listSelectionChange2"
                                              header-row-class-name="xyTableHeader">
                                        <el-table-column type="selection" :width="selectionWidth"></el-table-column>
                                        <el-table-column type="index" :width="indexWidth"></el-table-column>
                                        <el-table-column label="黑匣子编号" prop="deviceNo" width="130px"></el-table-column>
                                        <el-table-column label="区域编号" prop="pageRange"></el-table-column>
                                        <!-- <el-table-column label="项目名称" prop="createUserName"></el-table-column>-->
                                        <el-table-column label="起始角度" prop="startAngle"></el-table-column>
                                        <el-table-column label="终止角度" prop="endAngle"></el-table-column>
                                        <el-table-column label="起始高度(m)" prop="startHeight" width="90px"></el-table-column>
                                        <el-table-column label="终止高度(m)" prop="endHeight" width="90px"></el-table-column>
                                        <el-table-column label="起始幅度(m)" prop="startRange" width="90px"></el-table-column>
                                        <el-table-column label="终止幅度(m)" prop="endRange" width="90px"></el-table-column>
                                        <el-table-column label="操作时间" prop="createTime" :formatter="handleDate"
                                                         width="140px"></el-table-column>
                                        <el-table-column label="设置状态" prop="status"
                                                         :formatter="handleStatus"></el-table-column>
                                    </el-table>
                                </div>
                                <div class="pagination-box">
                                    <el-pagination @size-change="handleSizeChange2"
                                                   @current-change="handleCurrentChange2"
                                                   :current-page="pageIndex2" :page-sizes="pageSizes2"
                                                   :page-size="pageSize2"
                                                   :total="pageTotal2"
                                                   layout="total, sizes, prev, pager, next, jumper"></el-pagination>
                                </div>
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                </div>

            </div>
        </div>
    </el-dialog>
</template>

<script>
    import {
        getCalibrationSetApi,
        getCraneSingleCollisionAvoidanceSetApi
    } from "@/views/remoteSetting/api/logManagement.js";
    import moment from 'moment';

    export default {
        components: {},
        data() {
            return {
                activeName2: 'first',
                labelWidth: "100px",
                listData1: [],
                listData2: [],
                isDangerous: "",
                keyword: "",
                isOnline: null,
                projectId: null,
                pageIndex: 1,
                pageSizes: [10, 20, 30],
                pageSize: 10,
                pageTotal: 0,
                pageIndex2: 1,
                pageSizes2: [10, 20, 30],
                pageSize2: 10,
                pageTotal2: 0,
                checkTime: '',
                sels: [],
                sels2: [],
                status: null,
                beginTime: '',
                endTime: '',
                title: '设备设置履历详情',
                visHandleSettingLog: false,
                deviceTypeValue: "",
                deviceNoValue: "",
                projectIdValue: ""

            };
        },
        props: {
            //dialog模式
            visible: {
                type: Boolean,
                default: function () {
                    return true;
                }
            },
            deviceType: {
                type: String,
                default: function () {
                    return true;
                }
            },
            deviceNo: {
                type: String,
                default: function () {
                    return true;
                }
            },
            projectIdVal: {
                type: Number,
                default: function () {
                    return true;
                }
            },
        },
        watch: {
            //dialog模式
            deviceType: {
                handler: function (val, oldVal) {
                    this.deviceTypeValue = val;
                },
                immediate: true
            },
            deviceNo: {
                handler: function (val, oldVal) {
                    this.deviceNoValue = val;
                },
                immediate: true
            },
            projectIdVal: {
                handler: function (val, oldVal) {
                    this.projectIdValue = val;
                },
                immediate: true
            },
            visible: {
                handler: function (val, oldVal) {
                    this.visHandleSettingLog = val;
                },
                immediate: true
            },
            visHandleSettingLog(val) {
                if (!val) {
                    this.$emit('close', {});
                }
            }
        },
        computed: {
            params() {
                let param = {
                    key: this.keyword,
                    pageNum: this.pageIndex,
                    pageSize: this.pageSize,
                    body: {
                        beginTime: this.beginTime,
                        endTime: this.endTime,
                        deviceNo: this.deviceNoValue,
                        type: this.deviceTypeValue,
                        projectId: this.projectIdValue
                    }
                };
                return param;
            },
            params2() {
                let param2 = {
                    key: this.keyword,
                    pageNum: this.pageIndex2,
                    pageSize: this.pageSize2,
                    body: {
                        beginTime: this.beginTime,
                        endTime: this.endTime,
                        deviceNo: this.deviceNoValue,
                        type: this.deviceTypeValue,
                        projectId: this.projectIdValue
                    }
                };
                return param2;
            },
            beginPicker() {
                let endTime = this.endTime;
                return {
                    disabledDate(time) {
                        return time.getTime() > new Date(endTime);
                    }
                };
            },
            endPicker() {
                let beginTime = this.$moment(this.beginTime);
                return {
                    disabledDate(time) {
                        return time.getTime() < new Date(beginTime);
                    }
                };
            },
        },
        mounted() {
            this.getCalibrationSet();
            this.getCraneSingleCollisionAvoidanceSet();
        },
        methods: {
            //页面搜索
            handleSearch() {
                //this.pageIndex = 1;
                this.getCalibrationSet();
            },
            //条件搜索
            handleSearchButton() {
                this.pageIndex = 1;
                this.getCalibrationSet();
            },
            //页面搜索
            handleSearch2() {
                //this.pageIndex = 1;
                this.getCraneSingleCollisionAvoidanceSet();
            },
            //条件搜索
            handleSearchButton2() {
                this.pageIndex2 = 1;
                this.getCraneSingleCollisionAvoidanceSet();
            },
            //获取校准日志数据列表
            getCalibrationSet() {
                getCalibrationSetApi(this.params).then(res => {
                    this.listData1 = res.data.list;
                    this.pageTotal = res.data.total;
                });
            },
            //获取单区防碰撞设置
            getCraneSingleCollisionAvoidanceSet() {
                getCraneSingleCollisionAvoidanceSetApi(this.params2).then(res => {
                    this.listData2 = res.data.list;
                    this.pageTotal2 = res.data.total;
                });
            },
            handleSizeChange(val) {
                this.pageSize = val;
                this.handleSearch();
            },
            handleCurrentChange(val) {
                this.pageIndex = val;
                this.handleSearch();
            },
            listSelectionChange(sels) {
                this.sels = sels;
            },
            handleSizeChange2(val) {
                this.pageSize2 = val;
                this.handleSearch2();
            },
            handleCurrentChange2(val) {
                this.pageIndex2 = val;
                this.handleSearch2();
            },
            listSelectionChange2(sels) {
                this.sels2 = sels;
            },
            //日期格式变换
            handleDate(row, column, cellValue, index) {
                if (cellValue) {
                    return moment(cellValue).format('YYYY-MM-DD HH:mm:ss');
                } else {
                    return '';
                }
            },
            //设置命令转换
            handleCommand(row, column, cellValue, index) {
                if (cellValue === "000C") {
                    return "塔机幅度校准信息设置";
                } else if (cellValue === "000D") {
                    return "塔机高度校准信息设置";
                } else if (cellValue === "000E") {
                    return "塔机角度校准信息设置";
                } else if (cellValue === "000F") {
                    return "塔机起重量校准信息设置";
                } else {
                    return '未知命令';
                }
            },
            handleStatus(row, column, cellValue, index) {
                if (cellValue === 1) {
                    return "已启用";
                } else {
                    return "未启用";
                }
            }
        }
    };
</script>
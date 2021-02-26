<template>
    <el-dialog width="80%" :title="title" :visible.sync="visibleExceptionLog" append-to-body>
        <div class="details-container">
            <div class="container-box condition-box">
                <!--<div class="conditionBar">
                    <el-form :inline="true" class="condition-form">
                        <el-form-item>
                            <el-date-picker v-model="beginTime"   type="date" placeholder="选择日期"
                                            value-format="yyyy-MM-dd"   :picker-options="beginPicker" size="mini"></el-date-picker>
                            <i>-</i>
                            <el-date-picker v-model="endTime"  type="date" placeholder="选择日期"
                                            value-format="yyyy-MM-dd"  :picker-options="endPicker" size="mini"></el-date-picker>
                        </el-form-item>
                        <el-form-item>
                            <el-button class="searchBtn" type="primary" size="mini" icon="el-icon-search" @click="handleSearchButton">查询</el-button>
                        </el-form-item>
                    </el-form>
                </div>-->
            </div>

            <div class="container-box list-box">
                <div class="table-box">
                    <el-table size="small" :data="listData" style="width: 100%" highlight-current-row
                              @selection-change="listSelectionChange" header-row-class-name="xyTableHeader">
                        <el-table-column type="selection" :width="selectionWidth"></el-table-column>
                        <el-table-column type="index" :width="indexWidth"></el-table-column>
                        <el-table-column label="异常时间" prop="errorTime" :formatter="handleDate"></el-table-column>
                        <el-table-column label="异常信息" prop="content"></el-table-column>
                    </el-table>
                </div>
                <div class="pagination-box">
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                                   :current-page="pageIndex" :page-sizes="pageSizes" :page-size="pageSize"
                                   :total="pageTotal" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<script>
    import {getExceptionLogApi} from "@/views/remoteSetting/api/logManagement.js";
    import moment from 'moment';
    export default {
        components: {},
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
                checkTime: '',
                sels: [],
                status: null,
                beginTime: '',
                endTime: '',
                title: '异常日志详情',
                visibleExceptionLog: false,
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
                    this.visibleExceptionLog = val;
                },
                immediate: true
            },
            visibleExceptionLog(val) {
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
            this.getListData();
        },
        methods: {
            //页面搜索
            handleSearch() {
                //this.pageIndex = 1;
                this.getListData();
            },
            //条件搜索
            handleSearchButton() {
                this.pageIndex = 1;
                this.getListData();
            },
            //获取数据列表
            getListData() {
                getExceptionLogApi(this.params).then(res => {
                    this.listData = res.data.list;
                    this.pageTotal = res.data.total;
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
            //日期格式变换
            handleDate(row, column, cellValue, index) {
                if (cellValue) {
                    return this.$moment(cellValue).format('YYYY-MM-DD HH:mm:ss');
                } else {
                    return '';
                }
            },
        }
    };
</script>

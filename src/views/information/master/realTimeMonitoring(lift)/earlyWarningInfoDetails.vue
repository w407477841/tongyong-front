<template>
    <el-dialog width="80%" :title="title" :visible.sync="earlyWarningInfoDetails" append-to-body>
        <div class="details-container">
            <div class="container-box condition-box">
                <div class="conditionBar">
                    <el-form :inline="true" class="condition-form">
                        <el-form-item >
                            <el-select v-model="checkTime" placeholder="查询时间" @change="dateChange" size="mini" >
                                <el-option v-for="item in checkTimeList" :label="item.label" :value="item.value" :key="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-date-picker v-model="beginTime" :picker-options="beginPicker" :disabled="dateShow"  type="date" placeholder="选择日期" format="yyyy-MM-dd"  size="mini"></el-date-picker>
                            <i>-</i>
                            <el-date-picker v-model="endTime" :picker-options="endPicker"  :disabled="dateShow" type="date" placeholder="选择日期" format="yyyy-MM-dd"  size="mini"></el-date-picker>
                        </el-form-item>
                        <el-form-item>
                            <el-button class="searchBtn" type="primary" size="mini" icon="el-icon-search" @click="handleSearch">查询</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>

            <div class="container-box list-box">
                <div class="table-box">
                    <el-table size="small" :data="listData" style="width: 100%"  highlight-current-row
                              @selection-change="listSelectionChange" header-row-class-name="xyTableHeader">
                        <el-table-column type="selection" :width="selectionWidth"></el-table-column>
                        <el-table-column type="index" :width="indexWidth"></el-table-column>
                        <el-table-column label="预警时间" prop="createTime"></el-table-column>
                        <el-table-column label="预警详情" prop="alarmInfo"></el-table-column>
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
    import {earlyWarningDetail} from "@/views/information/api/lift.js";
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
                checkTime:'',
                sels: [],
                status: null,
                detailsType: null,
                selectStatus: [
                    {label: "全部", value: null},
                    {label: "离线", value: 0},
                    {label: "在线", value: 1}
                ],
                checkTimeList: [
                    {label : "7天内",value : 1},
                    {label : "15天内",value : 2},
                    {label : "30天内",value : 3},
                    {label : "自定义",value : 4}
                ],
                beginTime: '',
                endTime: '',
                title: '详情',
                earlyWarningInfoDetails: false,
                dateShow : true
            };
        },
        props: {
            //dialog模式
            visible: {
                type: Boolean,
                default: function() {
                    return true;
                }
            },
            routeType: {
                type: String,
                default: function() {
                    return null;
                }
            },
            detailsId: {
                type: Number || String,
                default: function() {
                    return null;
                }
            }
        },
        watch: {
            //dialog模式
            routeType: {
                handler: function(val, oldVal) {
                    this.edit = true;
                },
                immediate: true
            },
            visible: {
                handler: function(val, oldVal) {
                    this.earlyWarningInfoDetails = val;
                },
                immediate: true
            },
            earlyWarningInfoDetails(val) {
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
                        deviceTimeBegin: this.beginTime,
                        deviceTimeEnd: this.endTime,
                        status: this.status,
                        id:this.detailsId,
                        alarmType:1
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
            }
        },
        mounted() {
            this.getListData();
        },
        methods: {
                           //选择查询条件时改变日期选择器的可用性
    dateChange : function() {
      if(this.checkTime == 1) {
        this.dateShow = true;
        let begin = new Date(this.$moment(new Date()).format('YYYY-MM-DD'));
        this.endTime = new Date();
        this.beginTime = new Date(begin.setDate(begin.getDate() - 7));
      }else if (this.checkTime == 2) {
        this.dateShow = true;
        let begin = new Date(this.$moment(new Date()).format('YYYY-MM-DD'));
        this.endTime = new Date();
        this.beginTime = new Date(begin.setDate(begin.getDate() - 15));
      }else if (this.checkTime == 3) {
        this.dateShow = true;
        let begin = new Date(this.$moment(new Date()).format('YYYY-MM-DD'));
        this.endTime = new Date();
        this.beginTime = new Date(begin.setDate(begin.getDate() - 30));
      }else if (this.checkTime == 4) {
        this.dateShow = false;
      }
    },
            handleSearch() {
                this.pageIndex = 1;
                this.getListData();
            },
            getListData() {
                earlyWarningDetail(this.params).then(res => {
                    this.listData = res.data.list;
                    this.pageTotal = res.data.total;
                });
            },
            handleSizeChange(val) {
                this.pageSize = val;
                this.getListData();
            },
            handleCurrentChange(val) {
                this.pageIndex = val;
                this.getListData();
            },
            listSelectionChange(sels) {
                this.sels = sels;
            },
        }
    };
</script>

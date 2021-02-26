<template>
    <el-dialog width="80%" :title="title" :visible.sync="warningViewDetails" append-to-body>
        <div class="details-container">
            <div class="container-box condition-box">
                <div class="conditionBar">
                    <el-form :inline="true" class="condition-form">
                        <el-form-item label="">
                            <el-select v-model="checkTime" placeholder="查询时间" size="mini"  @change="chooseShortcutDate()">
                                <el-option v-for="item in checkTimeList" :label="item.label" :value="item.value" :key="item.value"></el-option>
                            </el-select>
                        </el-form-item>
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
                </div>
            </div>

            <div class="container-box list-box">
                <div class="table-box">
                    <el-table size="small" :data="listData" style="width: 100%"  highlight-current-row
                              @selection-change="listSelectionChange" header-row-class-name="xyTableHeader">
                        <el-table-column type="selection" :width="selectionWidth"></el-table-column>
                        <el-table-column type="index" :width="indexWidth"></el-table-column>
                        <el-table-column label="报警时间" prop="alarmTime"></el-table-column>
                        <el-table-column label="报警详情" prop="alarmInfo"></el-table-column>
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
    import {countAlarmByDeviceNoDetail} from "@/views/information/api/electric.js";

    export default {
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
                checkTimeList: [
                    {label : "7天内",value : 1},
                    {label : "15天内",value : 2},
                    {label : "30天内",value : 3},
                    {label : "自定义",value : 4}
                ],
                beginTime: '',
                endTime: '',
                title: '详情',
                warningViewDetails: false,
                monitorId:null

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
            monitorId: {
                type: Number || String,
                default: function() {
                    return null;
                }
            }
        },
        watch: {
            //dialog模式
            monitorId: {
                handler: function(val, oldVal) {
                    this.monitorId=val;
                    this.edit = true;
                },
                immediate: true
            },
            visible: {
                handler: function(val, oldVal) {
                    this.warningViewDetails = val;
                },
                immediate: true
            },
            warningViewDetails(val) {
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
                        monitorId: this.monitorId
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
            handleSearchButton(){
                this.pageIndex = 1;
                this.getListData();
            } ,
            //获取数据列表
            getListData() {
                countAlarmByDeviceNoDetail(this.params).then(res => {
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
        }
    };
</script>

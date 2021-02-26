<template>
    <div class="app-container list-container">
        <div class="container-box condition-box">
            <div class="conditionBar">
                <el-form :inline="true" class="condition-form">
                    <el-form-item >
                        <el-select v-model="checkTime" placeholder="查询时间" @change="dateChange" :clearable="true" :filterable="true" size="mini">
                            <el-option v-for="item in checkTimeList" :label="item.label" :value="item.value"
                                       :key="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-date-picker v-model="beginDate"  :disabled="dateShow" type="date"
                                        placeholder="选择日期" format="yyyy-MM-dd" size="mini"></el-date-picker>
                        <i>-</i>
                        <el-date-picker v-model="endDate"  :disabled="dateShow" type="date"
                                        placeholder="选择日期" format="yyyy-MM-dd" size="mini"></el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button class="searchBtn" type="primary" size="mini" icon="el-icon-search"
                                   @click="handleSearch">查询
                        </el-button>
                         <el-button size="mini" @click="handleCancel">取 消</el-button>
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
                   <el-table-column label="总报警" prop="alarmAll"></el-table-column>
                   <el-table-column label="重量报警" prop="alarmWeight"></el-table-column>
                   <el-table-column label="速度报警" prop="alarmSpeed"></el-table-column>
                   <el-table-column label="前门报警" prop="alarmFrontDoor"></el-table-column>
                   <el-table-column label="后门报警" prop="alarmBackDoor"></el-table-column>
                    <el-table-column label="操作" width="200" align="center" fixed="right">
                        <template slot-scope="scope">
                            <liftWarningButton @viewDetails="viewDetails" @SMSRemind="SMSRemind" :row="scope.row"></liftWarningButton>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="pagination-box">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                               :current-page="pageIndex" :page-sizes="pageSizes" :page-size="pageSize"
                               :total="pageTotal" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
            </div>

            <warningViewDetails v-if="warningViewDetails" :visible.sync="warningViewDetails" @close="closeDialog"
                                :routeType="detailsType" :detailsId="detailsId"></warningViewDetails>
            <warningSMSRemind v-if="warningSMSRemind" :visible.sync="warningSMSRemind" @close="closeDialog"
                              :routeType="detailsType" :detailsId="detailsId"></warningSMSRemind>
        </div>
    </div>
</template>

<script>
    import {countCallWarning} from "@/views/information/api/lift.js";
    import liftWarningButton from "./liftWarningButton";
    import warningSMSRemind from './warningSMSRemind';
    import warningViewDetails from './warningViewDetails';

    export default {
        components: {
            liftWarningButton,
            warningSMSRemind,
            warningViewDetails
        },
        data() {
            return {
                listData: [],
                isDangerous: "",
                keyword: "",
                isOnline: null,
                projectId: null,
                warningViewDetails: false,
                warningSMSRemind: false,
                pageIndex: 1,
                pageSizes: [10, 20, 30],
                pageSize: 10,
                pageTotal: 0,
                sels: [],
                detailsType: null,
                detailsId:null,
                checkTime: null,
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
                beginDate: '',
                endDate: '',
                edit: false,
                dateShow : true


            };
        },
        computed: {
            params() {
                let param = {
                   
                    body: {
                        deviceTimeBegin: this.beginDate,
                        deviceTimeEnd: this.endDate,
                        id: this.$route.query.id,
                    }
                };
                return param;
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
        this.endDate = new Date();
        this.beginDate = new Date(begin.setDate(begin.getDate() - 7));
      }else if (this.checkTime == 2) {
        this.dateShow = true;
        let begin = new Date(this.$moment(new Date()).format('YYYY-MM-DD'));
        this.endDate = new Date();
        this.beginDate = new Date(begin.setDate(begin.getDate() - 15));
      }else if (this.checkTime == 3) {
        this.dateShow = true;
        let begin = new Date(this.$moment(new Date()).format('YYYY-MM-DD'));
        this.endDate = new Date();
        this.beginDate = new Date(begin.setDate(begin.getDate() - 30));
      }else if (this.checkTime == 4) {
        this.dateShow = false;
      }
    },
             //取消
            handleCancel() {
                this.$router.back(-1);
            },
            handleSearch() {
                this.pageIndex = 1;
                this.getListData();
            },
            getListData() {
                countCallWarning(this.params).then(res => {
                    this.detailsId = res.data.liftId;
                    if(res.data.alarmAll!=0){
                    var ddList = [];
                    ddList[0] = res.data;
                    this.listData = ddList;
                    this.pageTotal = 1;
                    }
                    else{
                       this.listData=[];
                       this.pageTotal = 0;
                    }

                   
                    
                   
                    
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
            //查看详情弹窗
            viewDetails() {
                this.warningViewDetails = true;
            },
            //短信告警弹窗
            SMSRemind() {
                this.warningSMSRemind = true;
            },
            closeDialog() {
                this.warningViewDetails = false;
                this.warningSMSRemind = false;
                //this.handelGet() ;
            }
        }
    };
</script>

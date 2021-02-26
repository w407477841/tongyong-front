<template>
    <div class="app-container list-container">
        <div class="container-box condition-box">
            <div class="conditionBar">
                <el-form :inline="true" class="condition-form">
                    <el-form-item label="">
                        <el-select v-model="checkTime" placeholder="查询时间" size="mini"  @change="chooseShortcutDate">
                            <el-option v-for="item in checkTimeList" :label="item.label" :value="item.value"
                                       :key="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-date-picker v-model="beginTime"  :disabled="dateShow" type="date" :picker-options="beginPicker"
                                        placeholder="选择日期" value-format="yyyy-MM-dd" size="mini" ></el-date-picker>
                        <i>-</i>
                        <el-date-picker v-model="endTime"  :disabled="dateShow" type="date" :picker-options="endPicker"
                                        placeholder="选择日期" value-format="yyyy-MM-dd" size="mini" ></el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button class="searchBtn" type="primary" size="mini" icon="el-icon-search"
                                   @click="handleSearchButton">查询
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
                    <el-table-column type="index" :width="indexWidth"></el-table-column>
                    <el-table-column label="总报警" prop="alarmAll"></el-table-column>
                    <el-table-column label="每小时耗电量报警" prop="alarmDissipation"></el-table-column>
                    <el-table-column label="操作" width="200" align="center" fixed="right">
                        <template slot-scope="scope">
                            <electricWarningButton @viewDetails="viewDetails" @SMSRemind="SMSRemind" :row="scope.row"></electricWarningButton>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

            <warningViewDetails v-if="warningViewDetails" :visible.sync="warningViewDetails" @close="closeDialog"
                                :monitorId="monitorId"></warningViewDetails>
            <warningSMSRemind v-if="warningSMSRemind" :visible.sync="warningSMSRemind" @close="closeDialog"
                              :monitorIdSMS="monitorIdSMS" :content="content"></warningSMSRemind>

        </div>
    </div>
</template>

<script>
    import {countWarningMessageList} from "@/views/information/api/electric.js";
    import electricWarningButton from "./electricWarningButton";
    import warningSMSRemind from './warningSMSRemind';
    import warningViewDetails from './warningViewDetails';
    import moment from 'moment';
    export default {
        components: {
            electricWarningButton,
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
                checkTime: null,
                checkTimeList: [
                    {label : "7天内",value : 1},
                    {label : "15天内",value : 2},
                    {label : "30天内",value : 3},
                    {label : "自定义",value : 4}
                ],
                beginTime: '',
                endTime: '',
                edit: false,
                monitorId:null,
                monitorIdSMS:null,
                projectName:'',
                content:"",
                dateShow:true

            };
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
                        monitorId:this.monitorId
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
            //接收父页面传来的值
            this.monitorId=this.$route.query.id;
            this.monitorIdSMS=this.$route.query.id;
            this.projectName=this.$route.query.projectName;
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
                countWarningMessageList(this.params).then(res => {
                    this.listData = res.data;
                    this.pageTotal = res.total;
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
            SMSRemind(row) {
                this.content=
                    "工程名称:"+this.projectName+","
                    +"时间:"+(row.beginTime==null ?"":row.beginTime) +" "+(row.endTime==null?"":row.endTime)+","
                    +"总报警:"+row.alarmAll+","
                    +"每小时耗电量报警:"+row.alarmDissipation+",";
                this.warningSMSRemind = true;
            },
            //弹窗关闭
            closeDialog() {
                this.warningViewDetails = false;
                this.warningSMSRemind = false;
                //this.handelGet() ;
            },
             //选择查询条件时改变日期选择器的可用性
            chooseShortcutDate () {
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
            //取消
            handleCancel(){
                this.$router.back(-1);
            },
        }
    };
</script>

<template>
    <div class="app-container list-container">
        <div class="container-box condition-box">
            <div class="conditionBar">
                <el-form :inline="true" class="condition-form">
                    <el-form-item label="">
                        <el-select v-model="checkTime" placeholder="查询时间" size="mini"  @change="chooseShortcutDate()">
                            <el-option v-for="item in checkTimeList" :label="item.label" :value="item.value"
                                       :key="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-date-picker   v-if="beginTime" key   v-model="beginTime"  :disabled="edit" type="date" :picker-options="beginPicker"
                                          placeholder="选择日期" value-format="yyyy-MM-dd" size="mini" ></el-date-picker>
                        <el-date-picker   v-else     v-model="beginTime"  :disabled="edit" type="date" :picker-options="beginPicker"
                                          placeholder="选择日期" value-format="yyyy-MM-dd" size="mini" ></el-date-picker>
                        <i>-</i>
                        <el-date-picker   v-if="beginTime" key  v-model="endTime"  :disabled="edit" type="date" :picker-options="endPicker"
                                          placeholder="选择日期" value-format="yyyy-MM-dd" size="mini" ></el-date-picker>
                        <el-date-picker   v-else    v-model="endTime"  :disabled="edit" type="date" :picker-options="endPicker"
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
                   <!-- <el-table-column type="selection" :width="selectionWidth"></el-table-column>-->
                    <el-table-column type="index" :width="indexWidth"></el-table-column>
                    <el-table-column label="设备" prop="deviceNo"></el-table-column>
                    <el-table-column label="总次数(次)" prop="total"></el-table-column>
                    <el-table-column label="温度(次)" prop="temperature"></el-table-column>
                    <el-table-column label="湿度(次)" prop="humidity"></el-table-column>
                    <el-table-column label="PM2.5(次)" prop="pm25"></el-table-column>
                    <el-table-column label="PM10(次)" prop="pm10"></el-table-column>
                    <el-table-column label="风速(次)" prop="windSpeed"></el-table-column>
                    <el-table-column label="噪音(次)" prop="noise"></el-table-column>
                    <el-table-column label="TSP(次)" prop="tsp"></el-table-column>
                    <el-table-column label="操作" width="200" align="center" fixed="right">
                        <template slot-scope="scope">
                            <dustWarningButton @viewDetails="viewDetails" @SMSRemind="SMSRemind" :row="scope.row"></dustWarningButton>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!--<div class="pagination-box">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                               :current-page="pageIndex" :page-sizes="pageSizes" :page-size="pageSize"
                               :total="pageTotal" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
            </div>-->

            <warningViewDetails v-if="warningViewDetails" :visible.sync="warningViewDetails" @close="closeDialog"
                                :monitorId="monitorId"></warningViewDetails>
            <warningSMSRemind v-if="warningSMSRemind" :visible.sync="warningSMSRemind" @close="closeDialog"
                              :monitorIdSMS="monitorIdSMS" :content="content"></warningSMSRemind>

            <!--<div class="details-footer"  style="text-align: right;">
                <el-button size="mini" @click="handleCancel">取 消</el-button>
            </div>-->
        </div>
    </div>
</template>

<script>
import { countWarningMessageList } from "@/views/information/api/dust.js";
import dustWarningButton from "./dustWarningButton";
import warningSMSRemind from "./warningSMSRemind";
import warningViewDetails from "./warningViewDetails";
import moment from "moment";
export default {
  components: {
    dustWarningButton,
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
        { label: "7天内", value: 1 },
        { label: "15天内", value: 2 },
        { label: "30天内", value: 3 },
        { label: "自定义", value: 4 }
      ],
      beginTime: "",
      endTime: "",
      edit: false,
      monitorId: null,
      monitorIdSMS: null,
      projectName: "",
      content: ""
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
    }
  },
  mounted() {
    //接收父页面传来的值
    this.monitorId = this.$route.query.id;
    this.monitorIdSMS = this.$route.query.id;
    this.projectName = this.$route.query.projectName;
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
      this.content =
        "工程名称:" +
        this.projectName +
        "," +
        "黑匣子编号:" +
        row.deviceNo +
        "," +
        "时间:" +
        (row.beginTime == null ? "" : row.beginTime) +
        " " +
        (row.endTime == null ? "" : row.endTime) +
        "," +
        "总次数:" +
        row.total +
        "," +
        "温度:" +
        row.temperature +
        "," +
        "湿度:" +
        row.humidity +
        "," +
        "pm2.5:" +
        row.pm25 +
        "," +
        "pm10:" +
        row.pm10 +
        "," +
        "风速:" +
        row.windSpeed +
        "," +
        "噪音:" +
        row.noise +
        "," +
        "tsp:" +
        row.tsp;
      this.warningSMSRemind = true;
    },
    //弹窗关闭
    closeDialog() {
      this.warningViewDetails = false;
      this.warningSMSRemind = false;
      //this.handelGet() ;
    },
    //取消
    handleCancel() {
      this.$router.back(-1);
    }
  }
};
</script>

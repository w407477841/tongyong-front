<template>
  <div class="app-container list-container">
    <div class="container-box condition-box">
      <div class="conditionBar">
        <el-form :inline="true" class="condition-form">
          <el-form-item>
            <el-select v-model="checkTime" placeholder="查询时间" @change="dateChange" :clearable="true" :filterable="true" size="mini">
              <el-option v-for="item in checkTimeList" :label="item.label" :value="item.value" :key="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-date-picker size="mini" v-model="beginDate" :editable="false" :picker-options="beginPicker" :disabled="dateShow" type="date" placeholder="选择日期" format="yyyy-MM-dd"></el-date-picker>
            <i>-</i>
            <el-date-picker size="mini" v-model="endDate" :editable="false" :picker-options="endPicker" :disabled="dateShow" type="date" placeholder="选择日期" format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button class="searchBtn" type="primary" size="mini" icon="el-icon-search" @click="handleSearch">查询</el-button>
            <el-button size="mini" @click="goBack">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <div class="container-box list-box">
      <div class="table-box">
        <el-table size="small" :data="listData" style="width: 100%" height="100%" highlight-current-row @selection-change="listSelectionChange" header-row-class-name="xyTableHeader">
          <el-table-column type="selection" :width="selectionWidth"></el-table-column>
          <el-table-column type="index" :width="indexWidth"></el-table-column>
          <el-table-column label="每小时耗水量报警" prop="alarmDissipation"></el-table-column>
          <el-table-column label="操作" align="center" width="200">
            <template slot-scope="scope">
              <el-button type="primary" plain size="small" @click="goToCheckDetail(scope.row)">查看详情</el-button>
              <el-button type="primary" plain size="small" @click="goToMessageAlarm(scope.row)">短信提醒</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination-box">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageIndex" :page-sizes="pageSizes" :page-size="pageSize" :total="pageTotal" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>
    </div>

    <el-dialog title="报警详情" :visible.sync="warningDetailVisible" :close-on-click-modal="false" width="80%" v-if="warningDetailVisible">
      <warning-message-detail :id="this.id" @setShow="setShow" :keyword="this.keyword"></warning-message-detail>
    </el-dialog>

    <el-dialog title="发送短信" :visible.sync="warningAlarmVisible" :close-on-click-modal="false" width="80%" v-if="warningAlarmVisible">
      <warning-message-alarm :id="this.id" @setShow="setShow" :content="this.content"></warning-message-alarm>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment';
import {selectWarningAlarm} from '@/views/information/api/water.js';
import WarningMessageDetail from './warningMessageDetail';
import WarningMessageAlarm from './warningMessageAlarm';

export default {
  data() {
    return {
      listData: [],
      checkTime: '',
      pageIndex: 1,
      pageSizes: [10, 20, 30],
      pageSize: 10,
      pageTotal: 0,
      sels: [],
      checkTimeList : [
        {label : "7天内",value : 1},
        {label : "15天内",value : 2},
        {label : "30天内",value : 3},
        {label : "自定义",value : 4}
      ],
      beginDate : '',
      endDate : '',
      edit : false,
      warningDetailVisible : false,
      warningAlarmVisible : false,
      id : '',
      content : '',
      mainInfo : '',
      dateShow : true,
      keyword : ''
    };
  },
  computed: {
    params() {
      let param = {
        id : this.$route.query.row.id,
        pageNum: this.pageIndex,
        pageSize: this.pageSize,
        body : {
          beginDate : this.beginDate,
          endDate : this.endDate,
          checkTime : this.checkTime
        }
      };
      return param;
    },
    beginPicker() {
      let endTime = this.endDate;
      if(endTime == null) {
        endTime = '';
      }
      if(endTime != '') {
        return {
          disabledDate(time) {
            return (time.getTime() > new Date(endTime) || time.getTime() < new Date(moment(endTime).format("YYYY-MM") + "-01"));
          }
        };
      }else {
        return {
          disabledDate(time) {
            return time.getTime() > new Date(endTime);
          }
        };
      }
    },
    endPicker() {
      let begin = this.beginDate;
      if(begin == null) {
        begin = '';
      }
      let date = "";
      //开始时间非空计算开始时间所在月份的最后一天
      if(begin != '') {
        let beginTime = this.$moment(begin);
        let year = "" + new Date(beginTime).getFullYear();
        let month = "";
        if((new Date(beginTime).getMonth()+1)<10){
          month = "0"+(new Date(beginTime).getMonth()+2);
        }else{
          month = ""+(new Date(beginTime).getMonth()+2);
        }
        let newDate = new Date(year + "-" + month + "-01");
        date = new Date(newDate.setDate(newDate.getDate() - 1));
        return {
          disabledDate(time) {
            return (time.getTime() < new Date(begin) || time.getTime() > new Date(date));
          }
        };
      }else {
        return {
          disabledDate(time) {
            return time.getTime() < new Date(begin);
          }
        }
      }
    }
  },
  mounted() {
    this.mainInfo = this.$route.query.row;
    this.getListData();
  },
  methods: {
    //条件查询
    handleSearch() {
      this.pageIndex = 1;
      this.getListData();
    },
    //获取列表
    getListData() {
      selectWarningAlarm(this.params).then(res => {
        if(res.data.list[0].alarmDissipation == 0) {
          this.listData = [];
        }else {
          this.listData = res.data.list;
          this.pageTotal = Number(res.data.total);
          if (this.pageTotal == 0 && this.pageIndex > 1) {
            this.pageIndex--;
            this.getListData();
          }
        }
      });
    },
    //改变页面显示条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.getListData();
    },
    //改变页数
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.getListData();
    },
    //勾选复选框时给sels赋值
    listSelectionChange(sels) {
      this.sels = sels;
    },
    //点击查看详情按钮弹出详情页
    goToCheckDetail : function(row) {
      this.id = this.$route.query.row.id;
      this.keyword = "报警";
      this.warningDetailVisible = true;
    },
    //点击短信提醒按钮弹出短信页面
    goToMessageAlarm : function(row) {
      this.id = row.id;
      this.content = "工程名称：" + this.mainInfo.projectName + ",黑匣子编号：" + this.mainInfo.deviceNo + ",每小时耗水量报警：" + row.alarmDissipation;
      this.warningAlarmVisible = true;
    },
    //子组件向父组件传值
    setShow : function(data) {
      if(data.sign == "关闭信息") {
        this.warningAlarmVisible = false;
      }
    },
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
    goBack : function() {
      this.$router.push({ path:  '/realTimeMonitoringWater' });
    }
  },
  components : {
    WarningMessageDetail,
    WarningMessageAlarm
  }
};
</script>

<style lang="scss" scoped>
</style>

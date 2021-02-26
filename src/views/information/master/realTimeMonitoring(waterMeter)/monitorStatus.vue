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
          <el-table-column label="开始时间" prop="deviceTimeBegin" :formatter="getBegin"></el-table-column>
          <el-table-column label="截止时间" prop="deviceTimeEnd" :formatter="getEnd"></el-table-column>
          <el-table-column label="持续时间" prop="duration" :formatter="getDate"></el-table-column>
          <el-table-column label="监控状态" prop="status" :formatter="getStatus"></el-table-column>
        </el-table>
      </div>
      <div class="pagination-box">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageIndex" :page-sizes="pageSizes" :page-size="pageSize" :total="pageTotal" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>
    </div>

  </div>
</template>

<script>
import moment from 'moment';
import {selectMonitorStatus} from '@/views/information/api/water.js';

export default {
  data() {
    return {
      listData: [],
      checkTime : '',
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
      dateShow : true
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
      selectMonitorStatus(this.params).then(res => {
        this.listData = res.data.list;
        this.pageTotal = Number(res.data.total);
        if (this.pageTotal == 0 && this.pageIndex > 1) {
          this.pageIndex--;
          this.getListData();
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
    //日期格式化
    getBegin : function(row) {
      return this.$moment(row.deviceTimeBegin).format('YYYY-MM-DD HH:mm:ss');
    },
    //日期格式化
    getEnd : function(row) {
      return this.$moment(row.deviceTimeEnd).format('YYYY-MM-DD HH:mm:ss');
    },
    //计算日期的时间差
    getDate : function(row) {
      let begin = new Date(row.deviceTimeBegin);
      let end = new Date(row.deviceTimeEnd);
      let date = end.getTime() - begin.getTime(); //时间差的毫秒数
      //计算出相差天数
      let days = Math.floor(date/(24*3600*1000))
       
      //计算出小时数

      let leave1 = date%(24*3600*1000)    //计算天数后剩余的毫秒数
      let hours = Math.floor(leave1/(3600*1000))
      //计算相差分钟数
      let leave2 = leave1%(3600*1000)        //计算小时数后剩余的毫秒数
      let minutes = Math.floor(leave2/(60*1000))
       

      //计算相差秒数
      let leave3 = leave2%(60*1000)      //计算分钟数后剩余的毫秒数
      let seconds = Math.round(leave3/1000)
       
      
      return days+"天 "+hours+"小时 "+minutes+"分钟 "+seconds+"秒"
    },
    //状态格式化
    getStatus : function(row) {
      if(row.status == 0) {
        return '未受控';
      }else if(row.status == 1) {
        return '受控';
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
  }
};
</script>

<style lang="scss" scoped>
</style>

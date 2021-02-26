<template>
  <div class="app-container list-container">
    <div class="container-box condition-box">
      <div class="conditionBar">
        <el-form :inline="true" class="condition-form">
          <el-form-item >
        
            <el-select v-model="checkTime" placeholder="查询时间" @change="dateChange" :clearable="true" :filterable="true" size="mini">
              <el-option v-for="item in checkTimeList" :label="item.label" :value="item.value" :key="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-date-picker v-model="beginDate" :picker-options="beginPicker" :disabled="dateShow" type="date" placeholder="选择日期" format="yyyy-MM-dd" size="mini" ></el-date-picker>
            <i>-</i>
            <el-date-picker v-model="endDate" :picker-options="endPicker" :disabled="dateShow" type="date" placeholder="选择日期" format="yyyy-MM-dd" size="mini"></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button class="searchBtn" type="primary" size="mini" icon="el-icon-search" @click="handleSearch">查询</el-button>
             <el-button size="mini" @click="handleCancel">取 消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <div class="container-box list-box">
      <div class="table-box">
        <el-table size="small" :data="listData" style="width: 100%" height="100%" highlight-current-row @selection-change="listSelectionChange" header-row-class-name="xyTableHeader">
          <el-table-column type="selection" :width="selectionWidth"></el-table-column>
          <el-table-column type="index" :width="indexWidth"></el-table-column>
          <el-table-column label="开始时间" prop="createTime"></el-table-column>
          <el-table-column label="截止时间" prop="endTime"></el-table-column>
          <el-table-column label="持续时间" prop="duration"></el-table-column>
          <el-table-column label="监控状态" prop="status"></el-table-column>
        </el-table>
      </div>
      <div class="pagination-box">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageIndex" :page-sizes="pageSizes" :page-size="pageSize" :total="pageTotal" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>
    </div>

  </div>
</template>

<script>
import {selectMonitorStatus} from "@/views/information/api/lift.js"

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
       body:{
        deviceTimeBegin: this.beginDate,
        deviceTimeEnd: this.endDate,
        id : this.$route.query.id
       
        },
        pageNum: this.pageIndex,
        pageSize: this.pageSize
      };
      return param;
    },
    beginPicker() {
      let endTime = this.endDate;
      return {
        disabledDate(time) {
          return time.getTime() > new Date(endTime);
        }
      };
    },
    endPicker() {
      let beginTime = this.$moment(this.beginDate);
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
      selectMonitorStatus(this.params).then(res => {
        this.listData = res.data.list;
        this.pageTotal = Number(res.data.total);
        if (this.pageTotal == 0 && this.pageIndex > 1) {
          this.pageIndex--;
          this.getListData();
        }
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
    handleInsert() {
      this.$router.push({ path: this.detailsPath, query: { type: 'insert' } });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>

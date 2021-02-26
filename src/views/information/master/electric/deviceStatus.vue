<template>
    <div class="app-container list-container">
        <div class="container-box condition-box">
            <div class="conditionBar">
                <el-form :inline="true" class="condition-form">
                    <el-form-item label="">
                        <el-select v-model="checkTime" placeholder="查询时间" size="mini" @change="chooseShortcutDate()">
                            <el-option v-for="item in checkTimeList" :label="item.label" :value="item.value"
                                       :key="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-date-picker v-model="beginTime" :disabled="edit" type="date" :picker-options="beginPicker"
                                        placeholder="选择日期" value-format="yyyy-MM-dd" size="mini"></el-date-picker>
                        <i>-</i>
                        <el-date-picker v-model="endTime" :disabled="edit" type="date" :picker-options="endPicker"
                                        placeholder="选择日期" value-format="yyyy-MM-dd" size="mini"></el-date-picker>
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
                    <el-table-column type="selection" :width="selectionWidth"></el-table-column>
                    <el-table-column type="index" :width="indexWidth"></el-table-column>
                    <el-table-column label="开始时间" prop="createTimeStr"></el-table-column>
                    <el-table-column label="截止时间" prop="endTime"></el-table-column>
                    <el-table-column label="持续时间" prop="duration"  :formatter="getDate"></el-table-column>
                    <el-table-column label="监控状态" prop="status" :formatter="checkStatus"></el-table-column>
                </el-table>
            </div>
            <div class="pagination-box">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                               :current-page="pageIndex" :page-sizes="pageSizes" :page-size="pageSize"
                               :total="pageTotal" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
            </div>
            <!--<div class="details-footer" style="text-align: right;">
                <el-button size="mini" @click="handleCancel">取 消</el-button>
            </div>-->
        </div>
    </div>
</template>

<script>
import { getMonitorStatusListApi } from "@/views/information/api/electric.js";
export default {
  data() {
    return {
      listData: [],
      checkTime: "",
      pageIndex: 1,
      pageSizes: [10, 20, 30],
      pageSize: 10,
      pageTotal: 0,
      sels: [],
      checkTimeList: [
        { label: "7天内", value: 1 },
        { label: "15天内", value: 2 },
        { label: "30天内", value: 3 },
        { label: "自定义", value: 4 }
      ],
      monitorId: null,
      beginTime: "",
      endTime: "",
      edit: false
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
          electricId: this.monitorId
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
    this.getListData();
  },
  methods: {
    //加载列表
    handleSearch() {
      //this.pageIndex = 1;
      this.getListData();
    },
    handleSearchButton() {
      this.pageIndex = 1;
      this.getListData();
    },
    getListData() {
      //获取监控状态列表
      getMonitorStatusListApi(this.params).then(res => {
        this.listData = res.data.list;
        this.pageTotal = res.data.total;
      });
    },
    //分页条件
    handleSizeChange(val) {
      this.pageSize = val;
      this.handleSearch();
    },
    //分页条件
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.handleSearch();
    },
    //分页条件
    listSelectionChange(sels) {
      this.sels = sels;
    },
    //取消
    handleCancel() {
      this.$router.back(-1);
    },
    //转换
    checkStatus(row) {
      if (row.status === 1) {
        return "可控";
      } else {
        return "不可控";
      }
    },
    //持续时间转换
    //计算日期的时间差
    getDate: function(row) {
      let begin = new Date(row.createTimeStr);
      let end = new Date(row.endTime);
      let date = end.getTime() - begin.getTime(); //时间差的毫秒数
      //计算出相差天数
      let days = Math.floor(date / (24 * 3600 * 1000));

      //计算出小时数

      let leave1 = date % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
      let hours = Math.floor(leave1 / (3600 * 1000));
      //计算相差分钟数
      let leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
      let minutes = Math.floor(leave2 / (60 * 1000));

      //计算相差秒数
      let leave3 = leave2 % (60 * 1000); //计算分钟数后剩余的毫秒数
      let seconds = Math.round(leave3 / 1000);

      return (
        days + "天 " + hours + "小时 " + minutes + "分钟 " + seconds + "秒"
      );
    }
    // timeDuration(row){
    //     var time =row.duration;
    //     if (null != time && "" !== time) {
    //         if (time > 60 && time < 60 * 60) {
    //             time = parseInt(time / 60.0) + "分钟" + parseInt((parseFloat(time / 60.0) -
    //                 parseInt(time / 60.0)) * 60) + "秒";
    //         }
    //         else if (time >= 60 * 60 && time < 60 * 60 * 24) {
    //             time = parseInt(time / 3600.0) + "小时" + parseInt((parseFloat(time / 3600.0) -
    //                 parseInt(time / 3600.0)) * 60) + "分钟" +
    //                 parseInt((parseFloat((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) -
    //                     parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60)) * 60) + "秒";
    //         } else if (time >= 60 * 60 * 24) {
    //             time = parseInt(time / 3600.0/24) + "天" +parseInt((parseFloat(time / 3600.0/24)-
    //                 parseInt(time / 3600.0/24))*24) + "小时" + parseInt((parseFloat(time / 3600.0) -
    //                 parseInt(time / 3600.0)) * 60) + "分钟" +
    //                 parseInt((parseFloat((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) -
    //                     parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60)) * 60) + "秒";
    //         }
    //         else {
    //             time = parseInt(time) + "秒";
    //         }
    //     }
    //     return time;
    // }
  }
};
</script>

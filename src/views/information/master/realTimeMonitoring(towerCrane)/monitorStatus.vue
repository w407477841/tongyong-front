<template>
  <div class="app-container list-container">
    <div class="container-box condition-box">
      <div class="conditionBar">
        <el-form :inline="true" class="condition-form" size="mini">
          <el-form-item>
            <el-date-picker
              v-model="daterange"
              type="daterange"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions"
              :clearable="false"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button
              class="searchBtn"
              type="primary"
              size="mini"
              icon="el-icon-search"
              @click="handleSearch"
            >查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-checkbox-group v-model="status" @change="statusChange">
              <el-checkbox-button true-label="0" false-label>未受控</el-checkbox-button>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <div class="container-box list-box">
      <div class="table-box">
        <div :class="['table',status==='0'?'table-reason':'']">
          <el-table
            size="small"
            :data="listData"
            style="width: 100%"
            height="100%"
            highlight-current-row
            @selection-change="listSelectionChange"
            header-row-class-name="xyTableHeader"
          >
            <el-table-column type="selection" :width="selectionWidth"></el-table-column>
            <el-table-column type="index" :width="indexWidth"></el-table-column>
            <el-table-column
              label="开始时间"
              prop="deviceTimeBegin"
              min-width="140"
              :formatter="getBegin"
            ></el-table-column>
            <el-table-column label="截止时间" prop="deviceTimeEnd" min-width="140" :formatter="getEnd"></el-table-column>
            <el-table-column label="持续时间" prop="duration" min-width="150" :formatter="getDate"></el-table-column>
            <el-table-column v-if="status==='0'" label="原因" min-width="140" prop="reason"></el-table-column>
            <el-table-column
              v-else
              label="监控状态"
              min-width="140"
              prop="status"
              :formatter="getStatus"
            ></el-table-column>
          </el-table>
        </div>
        <div class="charts" v-if="status==='0'" ref="chart"></div>
      </div>
      <div class="pagination-box">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageIndex"
          :page-sizes="pageSizes"
          :page-size="pageSize"
          :total="pageTotal"
          layout="total, sizes, prev, pager, next, jumper"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import { selectMonitorStatus } from "@/views/api/equipmentApi.js";
import { selectOfflineReasonPie } from "@/views/crane/api/craneReport.js";

export default {
  data() {
    return {
      listData: [],
      pageIndex: 1,
      pageSizes: [10, 20, 30],
      pageSize: 10,
      pageTotal: 0,
      sels: [],
      edit: false,
      dateShow: true,
      //时间
      daterange: "",
      pickerOptions: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近十五天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 15);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      status: ""
    };
  },
  computed: {
    params() {
      let [startTime, endTime] = this.daterange || ["", ""];
      let param = {
        status: this.status,
        id: this.$route.query.id,
        pageNum: this.pageIndex,
        pageSize: this.pageSize,
        startTime: `${startTime} 00:00:00`,
        endTime: `${endTime} 23:59:59`,
        body: {
          checkTime: 4
        }
      };
      return param;
    }
  },
  mounted() {
    let startTime = this.$moment()
      .startOf("month")
      .format("YYYY-MM-DD");
    let endTime = this.$moment().format("YYYY-MM-DD");
    this.daterange = [startTime, endTime];
    this.getListData();
  },
  methods: {
    statusChange() {
      this.handleSearch();
    },
    setCharts() {
      if (this.status === "0") {
        let [startTime, endTime] = this.daterange || ["", ""];
        let param = {
          id: this.$route.query.id,
          startTime: `${startTime} 00:00:00`,
          endTime: `${endTime} 23:59:59`
        };
        selectOfflineReasonPie(param).then(res => {
          let pie = (res.data || []).map(item => {
            return {
              name: item.reason,
              value: item.account
            };
          });
          this.$nextTick(() => {
            if (this.chart) {
              this.chart.clear();
            }
            this.chart = this.$echarts.init(this.$refs.chart);
            this.chart.setOption({
              tooltip: {
                show: true,
                formatter: "{b} : {c} ({d}%)"
              },
              series: [
                {
                  type: "pie",
                  radius: "55%",
                  center: ["50%", "50%"],
                  data: pie
                }
              ]
            });
          });
        });
      }
    },
    //条件查询
    handleSearch() {
      this.pageIndex = 1;
      this.getListData();
      this.setCharts();
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
    getBegin: function(row) {
      return this.$moment(row.deviceTimeBegin).format("YYYY-MM-DD HH:mm:ss");
    },
    //日期格式化
    getEnd: function(row) {
      return this.$moment(row.deviceTimeEnd).format("YYYY-MM-DD HH:mm:ss");
    },
    //计算日期的时间差
    getDate: function(row) {
      let begin = new Date(row.deviceTimeBegin);
      let end = new Date(row.deviceTimeEnd);
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
    },
    //状态格式化
    getStatus: function(row) {
      if (row.status == 0) {
        return "未受控";
      } else if (row.status == 1) {
        return "受控";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.table-box {
  display: flex;
  .table {
    width: 100%;
  }
  .table-reason {
    width: calc(100% - 400px);
  }
  .charts {
    width: 400px;
    height: 400px;
  }
}
</style>

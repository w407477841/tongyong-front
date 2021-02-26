<template>
  <div class="work__day-item">
    <div v-show="tab==1">
      <div class="top">
        <!-- <span class="title">工程名称</span> -->
        <span class="val">{{projectName}}工作量统计表({{timeIntervalMin}}~{{timeIntervalMax}})</span>
      </div>
      <el-table
        size="small"
        :data="listData1"
        style="width: 100%"
        highlight-current-row
        header-row-class-name="xyTableHeader"
      >
        <el-table-column type="index" :width="indexWidth"></el-table-column>
        <el-table-column label="日期" prop="workDate"></el-table-column>
        <el-table-column
          v-for="item in columns"
          :key="item"
          :label="item"
          :prop="item"
          :formatter="colFormat"
        ></el-table-column>
      </el-table>
    </div>
    <div v-show="tab==2">
      <div class="top">
        <!-- <span class="title">工程名称</span> -->
        <span class="val">{{projectName}}平均工作量统计表({{timeIntervalMin}}~{{timeIntervalMax}})</span>
      </div>
      <el-table
        size="small"
        :data="listData2"
        style="width: 100%"
        highlight-current-row
        header-row-class-name="xyTableHeader"
      >
        <el-table-column type="index" :width="indexWidth"></el-table-column>
        <el-table-column label="黑匣子编号" prop="deviceNo"></el-table-column>
        <el-table-column label="总吊重次数" prop="liftFrequency"></el-table-column>
        <el-table-column label="平均吊重次数" prop="liftFrequencyAvg" :formatter="toFixedFormat"></el-table-column>
        <el-table-column label="最大吊重次数/日" prop="liftFrequencyMax"></el-table-column>
        <el-table-column label="最小吊重次数/日" prop="liftFrequencyMin"></el-table-column>
      </el-table>
    </div>
    <div v-show="tab==3">
      <div class="top">
        <!-- <span class="title">工程名称</span> -->
        <span class="val">{{projectName}}平均工作量统计图({{timeIntervalMin}}~{{timeIntervalMax}})</span>
      </div>
      <div class="work__day-charts">
        <div class="charts" ref="chart"></div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  selectAnalysisListByDate,
  selectAnalysisListAvg
} from "@/views/crane/api/craneReport.js";
import _ from "lodash";
export default {
  name: "time-Share",
  props: {
    projectId: {
      type: [String, Number],
      default() {
        return null;
      }
    },
    type: {
      type: [String, Number],
      default() {
        return null;
      }
    },
    startTime: {
      type: String,
      default() {
        return null;
      }
    },
    endTime: {
      type: String,
      default() {
        return null;
      }
    },
    tab: {
      type: [String, Number],
      default() {
        return null;
      }
    },
    projectName: {
      type: String,
      default() {
        return null;
      }
    },
    time: {
      type: [String, Number],
      default() {
        return null;
      }
    },
    timeIntervalMin: {
      type: String,
      default() {
        return null;
      }
    },
    timeIntervalMax: {
      type: String,
      default() {
        return null;
      }
    }
  },
  data() {
    return {
      columns: [],
      listData1: [],
      listData2: [],
      chart: null,
      xAxisData: [],
      series: []
    };
  },
  watch: {
    tab(val) {
      this.setCharts();
    },
    time(val) {
      if (val) {
        this.selectAnalysisListByDate();
        if (this.type == 1) {
          this.selectAnalysisListAvg();
        }
      }
    }
  },
  mounted() {
    if (this.type) {
      this.selectAnalysisListByDate();
      if (this.type == 1) {
        this.selectAnalysisListAvg();
      }
    }
  },
  methods: {
    colFormat(row, column, cellValue, index) {
      return cellValue ? cellValue : 0;
    },
    selectAnalysisListByDate() {
      let diff = this.$moment(this.endTime).diff(this.$moment(this.startTime), "days")+1;
      let dayList = [];
      for(let i=0;i<diff;i++){
        dayList.push(this.$moment(this.startTime).add(i, 'day').format("YYYY-MM-DD"))
      }
      let params = {
        startTime: this.startTime,
        endTime: this.endTime,
        body: {
          projectId: this.projectId,
          type: this.type,
          timeIntervalMin: this.timeIntervalMin,
          timeIntervalMax: this.timeIntervalMax=="24:00:00"?"23:59:59":this.timeIntervalMax,
          dayList:dayList
        }
      };
      selectAnalysisListByDate(params).then(res => {
        let listData1 = [];
        let columns = [];
        let xAxisData = [];
        (res.data.list || []).forEach(item => {
          let row = {};
          xAxisData.push(item.workDate);
          row.workDate = item.workDate;
          (item.deviceList || []).forEach(device => {
            row[device.craneNo] = device.liftFrequency;
            columns.push(device.craneNo);
          });
          listData1.push(row);
        });
        this.listData1 = listData1;
        this.columns = _.uniq(columns);
        let series = [];
        this.columns.forEach(col => {
          let serie = { name: col, type: "line", data: [] };
          this.listData1.forEach(row => {
            serie.data.push(row[col] ? row[col] : 0);
          });
          series.push(serie);
        });
        this.xAxisData = xAxisData;
        this.series = series;
        this.setCharts();
      });
    },
    selectAnalysisListAvg() {
      let params = {
        startTime: this.startTime,
        endTime: this.endTime,
        body: {
          projectId: this.projectId,
          days:
            this.$moment(this.endTime).diff(
              this.$moment(this.startTime),
              "days"
            ) + 1
        }
      };
      selectAnalysisListAvg(params).then(res => {
        this.listData2 = res.data.list || [];
      });
    },
    setCharts() {
      if (this.tab == 3) {
        this.$nextTick(() => {
          this.chart = this.$echarts.init(this.$refs.chart);
          this.chart.setOption({
            tooltip: {
              trigger: "axis"
            },
            grid: {
              top: 20
            },
            legend: {
              bottom: 0,
              data: this.columns
            },
            xAxis: {
              type: "category",
              boundaryGap: false,
              data: this.xAxisData
            },
            yAxis: {
              type: "value"
            },
            series: this.series
          });
        });
      }
    }
  }
};
</script>

<style lang="scss">
.work__day-item {
  margin-bottom: 30px;
  .top {
    font-size: 18px;
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #ebeef5;
    .title {
      color: #828282;
    }
    .val {
      color: #0698d6;
    }
  }
}
.work__day-charts {
  .charts {
    height: 300px;
  }
}
</style>

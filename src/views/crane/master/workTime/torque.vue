<!--
 * @Description: 工作时长-力矩
 * @Author: pangyu
 * @Date: 2019-06-17 17:46:19
 * @LastEditors: pangyu
 * @LastEditTime: 2019-07-03 10:40:15
 -->

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
              icon="el-icon-search"
              @click="handleSearch"
            >查询</el-button>
          </el-form-item>
          <el-form-item style="float: right;">
            <el-radio-group v-model="tab" @change="setCharts">
              <el-radio-button label="1">饼图</el-radio-button>
              <el-radio-button label="2">柱图</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="container-box list-box">
      <div class="torqueTablebox">
        <div class="torqueTable">
          <el-table
            size="small"
            :data="listData"
            style="width: 100%"
            highlight-current-row
            header-row-class-name="xyTableHeader"
          >
            <el-table-column label="力矩百分比" prop="d1"></el-table-column>
            <el-table-column label="总次数" prop="d2"></el-table-column>
            <el-table-column label="所占比重(%)" prop="d3"></el-table-column>
          </el-table>
        </div>
        <div class="torqueCharts" ref="chart"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { getMomentInfo } from "@/views/crane/api/craneReport.js";
export default {
  name: "crane-time-torque",
  data() {
    return {
      deviceNo: "",
      listData: [],
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
      chart: null,
      legend: [],
      bar: [],
      pie: [],
      tab: 1
    };
  },
  mounted() {
    this.deviceNo = this.$route.params.deviceNo;
    let startTime = this.$route.query.startTime
      ? this.$route.query.startTime.replace(" 00:00:00","")
      : this.$moment()
          .startOf("month")
          .format("YYYY-MM-DD");
    let endTime = this.$route.query.endTime
      ? this.$route.query.endTime
      : this.$moment().format("YYYY-MM-DD");
    this.daterange = [startTime, endTime];
    this.handleSearch();
  },
  methods: {
    handleSearch() {
      this.getListData();
    },
    getListData() {
      let [startTime, endTime] = this.daterange || ["", ""];
      let params = {
        startTime: `${startTime} 00:00:00`,
        endTime: `${endTime} 23:59:59`,
        body: {
          deviceNo: this.deviceNo
        }
      };
      getMomentInfo(params).then(res => {
        let data = {
          liftFrequency: res.data.liftFrequency || 1,
          percentage0: res.data.percentage0 || 0,
          percentage40: res.data.percentage40 || 0,
          percentage60: res.data.percentage60 || 0,
          percentage80: res.data.percentage80 || 0,
          percentage90: res.data.percentage90 || 0,
          percentage110: res.data.percentage110 || 0,
          percentage120: res.data.percentage120 || 0
        };
        this.listData = [
          {
            d1: "40%以下",
            d2: data.percentage0,
            d3: ((data.percentage0 / data.liftFrequency) * 100).toFixed(2)
          },
          {
            d1: "40%~60%",
            d2: data.percentage40,
            d3: ((data.percentage40 / data.liftFrequency) * 100).toFixed(2)
          },
          {
            d1: "60%~80%",
            d2: data.percentage60,
            d3: ((data.percentage60 / data.liftFrequency) * 100).toFixed(2)
          },
          {
            d1: "80%~90%",
            d2: data.percentage80,
            d3: ((data.percentage80 / data.liftFrequency) * 100).toFixed(2)
          },
          {
            d1: "90%~110%",
            d2: data.percentage90,
            d3: ((data.percentage90 / data.liftFrequency) * 100).toFixed(2)
          },
          {
            d1: "110%~120%",
            d2: data.percentage110,
            d3: ((data.percentage110 / data.liftFrequency) * 100).toFixed(2)
          },
          {
            d1: "120%以上",
            d2: data.percentage120,
            d3: ((data.percentage120 / data.liftFrequency) * 100).toFixed(2)
          }
        ];
        let legend = [];
        let bar = [];
        let pie = [];
        this.listData.forEach(item => {
          legend.push(item.d1);
          bar.push(item.d2);
          pie.push({
            name: item.d1,
            value: item.d2
          });
        });
        this.legend = legend;
        this.bar = bar;
        this.pie = pie;
        this.setCharts();
      });
    },
    setCharts() {
      this.$nextTick(() => {
        this.chart = this.$echarts.init(this.$refs.chart);
        this.chart.clear();
        if (this.tab == 1) {
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
                data: this.pie
              }
            ]
          });
        } else {
          this.chart.setOption({
            tooltip: {
              show: true,
              formatter: "{b} : {c}"
            },
            xAxis: [
              {
                type: "category",
                data: this.legend
              }
            ],
            yAxis: [
              {
                type: "value"
              }
            ],
            series: [
              {
                type: "bar",
                barWidth: "60%",
                data: this.bar
              }
            ]
          });
        }
      });
    }
  }
};
</script>

<style lang="scss">
.torqueTablebox {
  height: 100%;
  display: flex;
  .torqueTable {
    flex: 1;
  }
  .torqueCharts {
    width: 400px;
    height: 400px;
  }
}
</style>

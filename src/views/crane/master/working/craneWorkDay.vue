<!--
 * @Description: 设备在线全天统计
 * @Author: zhangzhenya
 * @Date: 2019-06-18 09:20:19
 * @LastEditors: pangyu
 * @LastEditTime: 2019-06-27 17:17:17
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
              size="mini"
              icon="el-icon-search"
              @click="handleSearch"
            >查询</el-button>
          </el-form-item>
          <el-form-item style="float: right;">
            <el-radio-group v-model="tab">
              <el-radio-button label="1">日期排序</el-radio-button>
              <el-radio-button label="2" v-if="type!=2">综合平均数</el-radio-button>
              <el-radio-button label="3">图表展示</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="container-box working-box">
      <div class="workingMain">
        <template v-for="(item,index) in timesList">
          <time-share
            v-if="type&&item.active"
            v-bind="shareInfo"
            :tab="tab"
            :timeIntervalMin="item.timeIntervalMin"
            :timeIntervalMax="item.timeIntervalMax"
            :key="index"
          ></time-share>
        </template>
      </div>
      <div class="workingTimeTab" v-if="type==2">
        <template v-for="(item,index) in timesList">
          <div
            @click="handleTab(index)"
            :class="['item',item.active?'active':'']"
            :key="index"
          >{{item.timeIntervalMin}}~{{item.timeIntervalMax}}</div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import timeShare from "./timeShare.vue";
export default {
  name: "crane-day",
  components: {
    timeShare
  },
  data() {
    return {
      projectId: "",
      projectName: "",
      type: "",
      pageIndex: 1, //
      listData: [],
      pageSizes: [10, 20, 30],
      pageSize: 10,
      pageTotal: 0,
      sels: [],
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
      tab: "1",
      shareInfo: {},
      timesList: [
        {
          timeIntervalMin: "00:00:00",
          timeIntervalMax: "24:00:00",
          active: true
        }
      ]
    };
  },
  mounted() {
    this.projectId = this.$route.params.id;
    this.projectName = this.$route.query.name;
    this.type = this.$route.query.type;
    if (this.type == 2) {
      this.timesList = [
        {
          timeIntervalMin: "00:00:00",
          timeIntervalMax: "06:00:00",
          active: true
        },
        {
          timeIntervalMin: "06:00:00",
          timeIntervalMax: "12:00:00",
          active: true
        },
        {
          timeIntervalMin: "12:00:00",
          timeIntervalMax: "18:00:00",
          active: true
        },
        {
          timeIntervalMin: "18:00:00",
          timeIntervalMax: "24:00:00",
          active: true
        }
      ];
    }
    let startTime = this.$moment()
      .startOf("month")
      .format("YYYY-MM-DD");
    let endTime = this.$moment().format("YYYY-MM-DD");
    this.daterange = [startTime, endTime];
    setTimeout(() => {
      this.handleSearch();
    }, 0);
  },
  methods: {
    //查询
    handleSearch() {
      let [startTime, endTime] = this.daterange || ["", ""];
      this.shareInfo = {
        projectId: this.projectId,
        projectName: this.projectName,
        type: this.type,
        startTime: `${startTime}`,
        endTime: `${endTime}`,
        time: new Date().getTime()
      };
    },
    handleTab(index) {
      let timesList = [...this.timesList];
      timesList[index].active = timesList[index].active ? false : true;
      this.timesList = timesList;
    }
  }
};
</script>

<style lang="scss">
.working-box {
  flex: 1;
  overflow-y: auto;
  display: flex;
  .workingMain {
    flex: 1;
  }
  .workingTimeTab {
    width: 180px;
    margin-left: 15px;
    .item {
      height: 36px;
      line-height: 36px;
      text-align: center;
      color: #d1d1d1;
      border: 1px solid #d1d1d1;
      cursor: pointer;
      margin-bottom: 10px;
      &.active {
        color: #0698d6;
        border: 1px solid #0698d6;
      }
    }
  }
}
</style>

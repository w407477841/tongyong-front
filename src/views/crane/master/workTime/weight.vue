<!--
 * @Description: 设备循环工作时长 - 吊重次数
 * @Author: pangyu
 * @Date: 2019-06-17 17:46:19
 * @LastEditors: pangyu
 * @LastEditTime: 2019-07-02 18:30:35
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
            <el-select v-model="type" clearable placeholder="力矩百分比">
              <el-option
                v-for="item in typeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="status" clearable placeholder="状态">
              <el-option
                v-for="item in statusList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              class="searchBtn"
              type="primary"
              icon="el-icon-search"
              @click="handleSearch"
            >查询</el-button>
            <!-- <el-button class="searchBtn" type="primary" icon="el-icon-download">导出</el-button> -->
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="container-box condition-box deviceTopInfo">
      <span>塔机编号：{{craneNo}}</span>
      <span>黑匣子编号：{{deviceNo}}</span>
    </div>
    <div class="container-box list-box">
      <div class="table-box">
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
            prop="beginTime"
            min-width="140"
            :formatter="dateTimeFormat"
          ></el-table-column>
          <el-table-column label="结束时间" prop="endTime" min-width="140" :formatter="dateTimeFormat"></el-table-column>
          <el-table-column label="起始幅度(m)" prop="beginRange" min-width="100"></el-table-column>
          <el-table-column label="终止幅度(m)" prop="endRange" min-width="100"></el-table-column>
          <el-table-column label="起始高度(m)" prop="beginHeight" min-width="100"></el-table-column>
          <el-table-column label="终止高度(m)" prop="endHeight" min-width="100"></el-table-column>
          <el-table-column label="起始角度(°)" prop="beginAngle" min-width="100"></el-table-column>
          <el-table-column label="终止角度(°)" prop="endAngle" min-width="100"></el-table-column>
          <el-table-column label="力矩百分比(%)" prop="momentPercentage" min-width="120"></el-table-column>
          <el-table-column label="安全吊重(t)" prop="safetyWeight"></el-table-column>
          <el-table-column label="吊绳倍率" prop="multipleRate"></el-table-column>
          <el-table-column label="报警内容" prop="alarmInfo" min-width="250">
            <template slot-scope="scope">
              <div :class="[scope.row.alarmInfo=='无'?'':'red']">{{scope.row.alarmInfo}}</div>
            </template>
          </el-table-column>
        </el-table>
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
import { getMomentPercentInfo } from "@/views/crane/api/craneReport.js";
export default {
  name: "crane-flow",
  data() {
    return {
      listData: [],
      pageIndex: 1,
      pageSizes: [10, 20, 30],
      pageSize: 10,
      pageTotal: 0,
      sels: [],
      //时间
      daterange: [],
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
      deviceNo: "",
      craneNo: "",
      type: "",
      status: "",
      typeList: [
        { label: "90%以下", value: 1 },
        { label: "90%-110%", value: 2 },
        { label: "110%-120%", value: 3 },
        { label: "120%以上", value: 4 }
      ],
      statusList: [
        { label: "正常", value: 1 },
        { label: "报警", value: 2 },
        { label: "预警", value: 3 },
        { label: "违章", value: 4 }
      ]
    };
  },
  mounted() {
    let startTime = this.$route.query.startTime
      ? this.$route.query.startTime.replace(" 00:00:00", "")
      : this.$moment()
          .startOf("month")
          .format("YYYY-MM-DD");
    let endTime = this.$route.query.endTime
      ? this.$route.query.endTime
      : this.$moment().format("YYYY-MM-DD");

    this.daterange = [startTime, endTime];
    this.deviceNo = this.$route.params.deviceNo;
    this.craneNo = this.$route.query.craneNo;
    this.handleSearch();
  },
  methods: {
    handleSearch() {
      this.pageIndex = 1;
      this.getListData();
    },
    getListData() {
      let [startTime, endTime] = this.daterange || ["", ""];
      let params = {
        pageSize: this.pageSize,
        pageNum: this.pageIndex,
        startTime: `${startTime} 00:00:00`,
        endTime: `${endTime} 23:59:59`,
        body: {
          deviceNo: this.deviceNo,
          type: this.type,
          status: this.status
        }
      };
      getMomentPercentInfo(params).then(res => {
        this.listData = res.data.list || [];
        this.pageTotal = res.data.total;
      });
    },
    //条数变更
    handleSizeChange(val) {
      this.pageSize = val;
      this.getListData();
    },
    //页数变更
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.getListData();
    },
    listSelectionChange(sels) {
      this.sels = sels;
    }
  }
};
</script>

<style scoped>
.red {
  color: #f56c6c;
}
</style>

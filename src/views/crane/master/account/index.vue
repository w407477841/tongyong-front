<!--
 * @Description: 设备台帐
 * @Author: pangyu
 * @Date: 2019-06-17 17:46:19
 * @LastEditors: pangyu
 * @LastEditTime: 2019-07-02 09:53:23
 -->

<template>
  <div class="app-container list-container">
    <div class="container-box condition-box">
      <div class="conditionBar">
        <el-form :inline="true" class="condition-form" size="mini">
          <el-form-item>
            <el-select v-model="projectId" filterable clearable placeholder="工程名称">
              <el-option
                v-for="item in projectList"
                :label="item.name"
                :value="item.id"
                :key="item.id"
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
            <el-button
              class="searchBtn"
              type="primary"
              icon="el-icon-download"
              @click="handleDown"
            >导出</el-button>
          </el-form-item>
        </el-form>
      </div>
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
          <el-table-column label="工程名称" prop="projectName" show-overflow-tooltip></el-table-column>
          <el-table-column label="塔机编号" prop="craneNo" show-overflow-tooltip></el-table-column>
          <el-table-column label="黑匣子编号" prop="deviceNo" show-overflow-tooltip></el-table-column>
          <el-table-column label="在线状态" prop="isOnline" :formatter="isOnlineFormat"></el-table-column>
          <el-table-column label="总运行时长" prop="timeSum" :formatter="timeSumFormat"></el-table-column>
          <el-table-column label="总吊重次数" prop="liftFrequency">
            <template slot-scope="scope">
              <span class="pointer" @click="routeToWeight(scope.row)">{{scope.row.liftFrequency}}</span>
            </template>
          </el-table-column>
          <el-table-column label="总违章次数" prop="weightAlarm">
            <template slot-scope="scope">
              <span class="pointer" @click="routeToProcess(scope.row)">{{scope.row.weightAlarm}}</span>
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
import { getProjectListApi } from "@/views/device/api/crane.js";
import { getDeviceAccount, createURL } from "@/views/crane/api/craneReport.js";
export default {
  name: "crane-flow",
  data() {
    return {
      sim: "",
      projectId: "",
      projectList: [],
      listData: [],
      pageIndex: 1,
      pageSizes: [10, 20, 30],
      pageSize: 10,
      pageTotal: 0,
      sels: []
    };
  },
  mounted() {
    this.getProjectList();
    this.handleSearch();
  },
  methods: {
    handleDown() {
      let params = {
        projectId: this.projectId
      };
      window.location.href = createURL(
        "/device/projectCrane/getDeviceAccountExcel",
        params
      );
    },
    getProjectList() {
      getProjectListApi({}).then(res => {
        this.projectList = res.data;
      });
    },
    routeToWeight(row) {
      this.$router.push({
        name: "craneWeight",
        params: { deviceNo: row.deviceNo },
        query: {
          id: row.id,
          startTime: row.startTime,
          endTime: this.$moment().format("YYYY-MM-DD")
        }
      });
    },
    routeToProcess(row) {
      this.$router.push({
        name: "craneProcess",
        params: { deviceNo: row.deviceNo },
        query: {
          craneNo: row.craneNo,
          type: 3,
          startTime: row.startTime,
          endTime: this.$moment().format("YYYY-MM-DD")
        }
      });
    },
    handleSearch() {
      this.pageIndex = 1;
      this.getListData();
    },
    getListData() {
      let params = {
        pageSize: this.pageSize,
        pageNum: this.pageIndex,
        body: {
          projectId: this.projectId
        }
      };
      getDeviceAccount(params).then(res => {
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
    },
    isOnlineFormat(row, column, cellValue, index) {
      return cellValue == 1 ? "在线" : "离线";
    },
    timeSumFormat(row, column, cellValue, index) {
      if (cellValue) {
        return `${this.$moment
          .duration(cellValue)
          .days()}天${this.$moment
          .duration(cellValue)
          .hours()}小时${this.$moment.duration(cellValue).minutes()}分钟`;
      } else {
        return "0天0小时0分钟";
      }
    }
  }
};
</script>
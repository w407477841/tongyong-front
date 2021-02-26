<!--
 * @Description: 设备流量统计
 * @Author: pangyu
 * @Date: 2019-06-17 17:46:19
 * @LastEditors: pangyu
 * @LastEditTime: 2019-06-29 18:53:24
 -->

<template>
  <div class="app-container list-container">
    <div class="container-box condition-box">
      <div class="conditionBar">
        <el-form :inline="true" class="condition-form" size="mini">
          <el-form-item>
            <el-select v-model="projectId" filterable placeholder="工程名称">
              <el-option
                v-for="item in projectList"
                :label="item.name"
                :value="item.id"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input v-model="keyWord" clearable placeholder="塔机/黑匣子编号"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="sim" placeholder="SIM卡号" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              class="searchBtn"
              type="primary"
              icon="el-icon-search"
              @click="handleSearch"
            >查询</el-button>
            <el-button class="searchBtn" type="primary" icon="el-icon-download" @click="handleDown">导出</el-button>
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
          <el-table-column label="塔机编号" prop="craneNo" show-overflow-tooltip></el-table-column>
          <el-table-column label="黑匣子编号" prop="deviceNo" show-overflow-tooltip></el-table-column>
          <el-table-column label="SIM卡号" prop="gprs" width="160"></el-table-column>
          <el-table-column label="工程名称" prop="projectName" show-overflow-tooltip></el-table-column>
          <el-table-column label="卡状态" prop="status"></el-table-column>
          <el-table-column label="累计用量(MB)" prop="cumulativeFlow"></el-table-column>
          <el-table-column label="流量上限(MB)" prop="toplimitFlow">
            <template>100</template>
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
import { getDeviceFlowList, createURL } from "@/views/crane/api/craneReport.js";
export default {
  name: "crane-flow",
  data() {
    return {
      keyWord:"",
      sim: "",
      projectId: null,
      projectList: [],
      listData: [],
      pageIndex: 1,
      pageSizes: [10, 20, 30],
      pageSize: 10,
      pageTotal: 0,
      sels: []
    };
  },
  async mounted() {
    await this.getProjectList();
  },
  methods: {
    async getProjectList() {
      let res = await getProjectListApi({});
      this.projectList = res.data;
      if (this.projectList.length > 0) {
        this.projectId = this.projectList[0].id;
        this.handleSearch();
      }
    },
    handleSearch() {
      if (this.projectId) {
        this.pageIndex = 1;
        this.getListData();
      }
    },
    handleDown() {
      let params = {
        keyWord:this.keyWord,
        projectId: this.projectId,
        gprs: this.sim
      };
      window.location.href = createURL(
        "/craneData/api/getDeviceFlowExcel",
        params
      );
    },
    getListData() {
      let params = {
        pageSize: this.pageSize,
        pageNum: this.pageIndex,
        body: {
          keyWord:this.keyWord,
          projectId: this.projectId,
          gprs: this.sim
        }
      };
      getDeviceFlowList(params).then(res => {
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
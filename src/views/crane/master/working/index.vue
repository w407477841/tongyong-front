<!--
 * @Description: 设备工作统计
 * @Author: zhangzhenya
 * @Date: 2019-06-18 09:20:19
 * @LastEditors: pangyu
 * @LastEditTime: 2019-06-27 16:21:08
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
              size="mini"
              icon="el-icon-search"
              @click="handleSearch"
            >查询</el-button>
            <el-button
              class="searchBtn"
              type="primary"
              size="mini"
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
          <el-table-column label="施工单位" prop="builderName" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" fixed="right" width="240" align="center">
            <template slot-scope="scope">
              <el-button
                type="primary"
                plain
                size="small"
                icon="el-icon-day"
                @click="handleClickToAllDay(scope.row)"
              >全天统计</el-button>
              <el-button
                type="primary"
                plain
                size="small"
                icon="el-icon-division-timer"
                @click="handleClickToTimeSharing(scope.row)"
              >分时统计</el-button>
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
import { getAnalysisList, createURL } from "@/views/crane/api/craneReport.js";
export default {
  name: "crane-working",
  data() {
    return {
      projectId: "",
      projectList: [],
      listData: [],
      pageIndex: 1,
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
      }
    };
  },
  mounted() {
    this.getProjectList();
    this.handleSearch();
  },
  methods: {
    getProjectList() {
      getProjectListApi({}).then(res => {
        this.projectList = res.data;
      });
    },
    handleClickToTimeSharing(row) {
      this.$router.push({
        name: "craneWorkDay",
        params: { id: row.projectId },
        query: { name: row.projectName, type: 2 }
      });
    },
    handleClickToAllDay(row) {
      this.$router.push({
        name: "craneWorkDay",
        params: { id: row.projectId },
        query: { name: row.projectName, type: 1 }
      });
    },
    //查询
    handleSearch() {
      this.pageIndex = 1;
      this.getListData();
    },
    handleDown() {
      let params = {
        projectId: this.projectId
      };
      window.location.href = createURL(
        "/device/projectCrane/getAnalysisListExcel",
        params
      );
    },
    //获取数据
    getListData() {
      let params = {
        pageSize: this.pageSize,
        pageNum: this.pageIndex,
        body: {
          projectId: this.projectId
        }
      };
      getAnalysisList(params).then(res => {
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
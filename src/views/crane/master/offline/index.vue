<!--
 * @Description: 设备离线统计
 * @Author: zhangzhenya
 * @Date: 2019-06-18 14:20:19
 * @LastEditors: pangyu
 * @LastEditTime: 2019-06-29 13:30:03
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
            <el-input v-model="keyWord" clearable placeholder="塔机/黑匣子编号"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              class="searchBtn"
              type="primary"
              size="mini"
              icon="el-icon-search"
              @click="handleSearch"
            >查询</el-button>
            <el-button class="searchBtn" type="primary" size="mini" icon="el-icon-download" @click="handleDown">导出</el-button>
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
          <!-- <el-table-column type="selection" :width="selectionWidth"></el-table-column> -->
          <el-table-column type="index" :width="indexWidth"></el-table-column>
          <el-table-column label="工程名称" prop="projectName" show-overflow-tooltip></el-table-column>
          <el-table-column label="塔机编号" prop="craneNo" show-overflow-tooltip></el-table-column>
          <el-table-column label="黑匣子编号" prop="deviceNo"></el-table-column>
          <el-table-column label="离线时间" prop="timeOff"></el-table-column>
          <el-table-column label="离线时长" prop="durationOff"></el-table-column>
          <el-table-column fixed="right" label="操作" width="120" align="center">
            <template slot-scope="scope">
              <el-button
                type="primary"
                plain
                size="small"
                icon="el-icon-dxtx"
                @click="handleSms(scope.row)"
              >短信提醒</el-button>
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
    <message :dialogVisible="dialogVisible" v-if="dialogVisible" :sms="sms" @dialogFormVisibleChange="dialogFormVisibleChange"></message>
  </div>
</template>

<script>
import { getProjectListApi } from "@/views/device/api/crane.js";
import { deviceOffline,createURL } from "@/views/crane/api/craneReport.js";
import message from "@/components/dialog/message.vue";
import { truncateSync } from "fs";
export default {
  name: "crane-offline",
  components: {
    message
  },
  data() {
    return {
      keyWord:"",
      sms:null,
      dialogVisible: false,
      projectId: "",
      projectList: [],
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
      }
    };
  },
  mounted() {
    this.getProjectList();
    this.handleSearch();
  },
  methods: {
    handleDown() {
      let params = {
        keyWord:this.keyWord,
        projectId: this.projectId
      };
      window.location.href = createURL(
        "/craneData/api/deviceOfflineExcel",
        params
      );
    },
    //关闭弹框
    dialogFormVisibleChange() {
      this.dialogVisible = false;
    },
    //呼出短信弹框
    handleSms(row) {
      this.sms=`工程名称：${row.projectName}，塔机编号：${row.craneNo}，黑匣子编号：${row.deviceNo}，离线时间：${row.timeOff}，离线时长：${row.durationOff}`;
      this.dialogVisible = true;
    },
    getProjectList() {
      getProjectListApi({}).then(res => {
        this.projectList = res.data;
      });
    },
    //查询
    handleSearch() {
      this.pageIndex = 1;
      this.getListData();
    },
    //获取数据
    getListData() {
      let params = {
        pageSize: this.pageSize,
        pageNum: this.pageIndex,
        body: {
          keyWord:this.keyWord,
          projectId: this.projectId
        }
      };
      deviceOffline(params).then(res => {
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
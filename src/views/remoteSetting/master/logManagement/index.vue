<!--
 * @Author: hjy
 * @CreateTime: 2018-10-17 10:30:40
 * @Desc: 日志发送人员配置
-->
<template>
  <div class="app-container list-container">
    <div class="container-box condition-box">
      <div class="conditionBar">
        <el-form :inline="true" class="condition-form">
          <!-- <el-form-item label prop="type">
            <el-select v-model="type" filterable clearable size="mini" placeholder="设备类型">
              <el-option
                v-for="item in typeList"
                :label="item.name"
                :value="item.id"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item>
            <el-input
              size="mini"
              placeholder="项目名称/黑匣子编号"
              v-model="keyword"
              clearable
              class="toolbar-search"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              class="searchBtn"
              type="primary"
              size="mini"
              icon="el-icon-search"
              @click="handleSearchButton"
            >查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button
              class="searchBtn"
              type="primary"
              size="mini"
              :disabled="editReboot"
              @click="handleDeviceReboot"
            >设备重启</el-button>
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
          <el-table-column label="项目名称" prop="projectName" show-overflow-tooltip></el-table-column>
          <!-- <el-table-column label="类型" prop="deviceType" :formatter="typeTransform"></el-table-column> -->
          <el-table-column label="黑匣子编号" prop="deviceNo" show-overflow-tooltip></el-table-column>
          <el-table-column label="版本号" prop="version"></el-table-column>
          <el-table-column label="设置履历" show-overflow-tooltip>
            <template slot-scope="scope">
              <span
                style="text-decoration: underline;color:blue;cursor: pointer;"
                @click="handleSetLog(scope.row)"
              >详情</span>
            </template>
          </el-table-column>
          <el-table-column label="异常日志履历" show-overflow-tooltip>
            <template slot-scope="scope">
              <span
                style="text-decoration: underline;color:blue;cursor: pointer;"
                @click="handleExceptionLog(scope.row)"
              >详情</span>
            </template>
          </el-table-column>
          <el-table-column label="日志发送履历" show-overflow-tooltip>
            <template slot-scope="scope">
              <span
                style="text-decoration: underline;color:blue;cursor: pointer;"
                @click="handleExceptionSMSLog(scope.row)"
              >详情</span>
            </template>
          </el-table-column>
          <el-table-column label="重启履历" show-overflow-tooltip>
            <template slot-scope="scope">
              <span
                style="text-decoration: underline;color:blue;cursor: pointer;"
                @click="handleRebootLog(scope.row)"
              >详情</span>
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
    <handleExceptionLog
      v-if="visibleExceptionLog"
      :visible.sync="visibleExceptionLog"
      @close="closeDialog"
      :deviceType="deviceType"
      :projectIdVal="projectId"
      :deviceNo="deviceNo"
    ></handleExceptionLog>

    <handleExceptionSMSLog
      v-if="visibleExceptionSMSLog"
      :visible.sync="visibleExceptionSMSLog"
      @close="closeDialog"
      :deviceType="deviceType"
      :projectIdVal="projectId"
      :deviceNo="deviceNo"
    ></handleExceptionSMSLog>

    <handleRebootLog
      v-if="visibleRebootLog"
      :visible.sync="visibleRebootLog"
      @close="closeDialog"
      :deviceType="deviceType"
      :projectIdVal="projectId"
      :deviceNo="deviceNo"
    ></handleRebootLog>

    <handleSettingLog
      v-if="visHandleSettingLog"
      :visible.sync="visHandleSettingLog"
      @close="closeDialog"
      :deviceType="deviceType"
      :projectIdVal="projectId"
      :deviceNo="deviceNo"
    ></handleSettingLog>
  </div>
</template>
<script>
import {
  getListApi,
  deviceReboot
} from "@/views/remoteSetting/api/logManagement.js";
import { getDeviceTypeListApi } from "../../api/version.js";
import handleExceptionLog from "./handleExceptionLog";
import handleExceptionSMSLog from "./handleExceptionSMSLog";
import handleRebootLog from "./handleRebootLog";
import handleSettingLog from "./handleSettingLog";

export default {
  components: {
    handleExceptionLog,
    handleExceptionSMSLog,
    handleRebootLog,
    handleSettingLog
  },
  data() {
    return {
      operationPrex: "logManagement:index",
      listData: [],
      isDangerous: "",
      typeList: [],
      type: "",
      keyword: "",
      pageIndex: 1,
      editReboot: true,
      pageSizes: [10, 20, 30],
      pageSize: 10,
      pageTotal: 0,
      sels: [],
      visibleExceptionLog: false,
      visibleExceptionSMSLog: false,
      visibleRebootLog: false,
      visHandleSettingLog: false,
      deviceType: null,
      deviceNo: null,
      projectId: null
    };
  },
  computed: {
    params() {
      let param = {
        key: this.keyword,
        pageNum: this.pageIndex,
        pageSize: this.pageSize,
        type: this.type
      };
      return param;
    }
  },
  mounted() {
    //加载设备类型
    getDeviceTypeListApi().then(res => {
      this.typeList = res.data;
    });
    this.getListData();
  },
  methods: {
    //分页改变时
    handleSearch() {
      this.getListData();
    },
    //点击搜索按钮时
    handleSearchButton() {
      this.pageIndex = 1;
      this.getListData();
    },
    //加载列表
    getListData() {
      getListApi(this.params).then(res => {
        this.listData = res.data.list;
        this.pageTotal = res.data.total;
      });
    },
    //显示条数改变
    handleSizeChange(val) {
      this.pageSize = val;
      this.handleSearch();
    },
    //页码跳转
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.handleSearch();
    },
    //重启设备
    handleDeviceReboot() {
      let paramReboot = { body: this.sels };
      deviceReboot(paramReboot).then(res => {
        this.$message({
          message: res.message,
          type: res.success ? "success" : "error"
        });
        this.handleSearch();
      });
    },
    //复选框选择事件
    listSelectionChange(sels) {
      this.sels = sels;
      this.editReboot = sels.length <= 0;
    },
    //关闭模态框
    closeDialog() {
      this.visibleExceptionLog = false;
      this.visibleExceptionSMSLog = false;
      this.visibleRebootLog = false;
      this.visHandleSettingLog = false;
      this.handleSearch();
    },
    //异常日志履历
    handleExceptionLog(row) {
      this.deviceType = row.deviceType;
      this.deviceNo = row.deviceNo;
      this.projectId = row.projectId;
      this.visibleExceptionLog = true;
      //alert(row.id + " " + row.projectName + " " + row.deviceType + " " + row.deviceNo);
    },
    //异常日志短信发送履历
    handleExceptionSMSLog(row) {
      this.visibleExceptionSMSLog = true;
      this.deviceType = row.deviceType;
      this.deviceNo = row.deviceNo;
      this.projectId = row.projectId;
      //alert(row.id + " " + row.projectName + " " + row.deviceType + " " + row.deviceNo);
    },
    //重启履历
    handleRebootLog(row) {
      this.visibleRebootLog = true;
      this.deviceType = row.deviceType;
      this.deviceNo = row.deviceNo;
      this.projectId = row.projectId;
      //alert(row.id + " " + row.projectName + " " + row.deviceType + " " + row.deviceNo);
    },
    //设置履历
    handleSetLog(row) {
      this.deviceType = row.deviceType;
      if (row.deviceType === "2" || row.deviceType === "3") {
        this.$message({
          showClose: true,
          message: "该类型设备暂不支持查看设置履历"
        });
      } else {
        this.visHandleSettingLog = true;
        this.deviceType = row.deviceType;
        this.deviceNo = row.deviceNo;
        this.projectId = row.projectId;
      }
    },
    typeTransform(row) {
      if (row.deviceType === "1") {
        return "塔吊";
      } else if (row.deviceType === "2") {
        return "升降机";
      } else if (row.deviceType === "3") {
        return "扬尘";
      } else {
        return "未知";
      }
    }
  }
};
</script>


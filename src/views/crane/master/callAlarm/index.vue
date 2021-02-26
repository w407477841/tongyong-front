<!--
 * @Description: 报警信息一览
 * @Author: pangyu
 * @Date: 2019-06-17 17:46:19
 * @LastEditors: pangyu
 * @LastEditTime: 2019-07-02 08:15:22
 -->

<template>
  <div class="app-container list-container">
    <div class="container-box condition-box">
      <div class="conditionBar">
        <el-form :inline="true" class="condition-form" size="mini">
          <el-form-item v-if="!deviceNo">
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
          <el-table-column label="塔机编号" prop="craneNo" min-width="150" show-overflow-tooltip></el-table-column>
          <el-table-column label="黑匣子编号" prop="deviceNo" min-width="150" show-overflow-tooltip></el-table-column>
          <el-table-column label="工程名称" prop="projectName" min-width="150" show-overflow-tooltip></el-table-column>
          <el-table-column label="总报警">
            <template
              slot-scope="scope"
            >{{scope.row.rangeAlarm+scope.row.limitAlarm+scope.row.momentAlarm+scope.row.collisionAlarm+scope.row.windSpeedAlarm+scope.row.tiltAlarm}}</template>
          </el-table-column>
          <el-table-column label="幅度报警" prop="rangeAlarm"></el-table-column>
          <el-table-column label="高度报警" prop="limitAlarm"></el-table-column>
          <el-table-column label="力矩报警" prop="momentAlarm"></el-table-column>
          <el-table-column label="碰撞报警" prop="collisionAlarm"></el-table-column>
          <el-table-column label="风速报警" prop="windSpeedAlarm"></el-table-column>
          <el-table-column label="倾角报警" prop="tiltAlarm"></el-table-column>
          <el-table-column label="操作" fixed="right" width="340" align="center">
            <template slot-scope="scope">
              <el-button
                type="primary"
                plain
                size="small"
                icon="el-icon-search"
                @click="handleView(scope.row)"
              >查看</el-button>
              <el-button
                type="primary"
                plain
                size="small"
                icon="el-icon-dxtx"
                @click="handleSms(scope.row)"
              >短信提醒</el-button>
               <el-button
                type="primary"
                plain
                size="small"
                icon="el-icon-download"
                @click="handleReport(scope.row)"
              >打印整改单</el-button>
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
    <message
      :dialogVisible="dialogVisible"
      v-if="dialogVisible"
      :sms="sms"
      @dialogFormVisibleChange="dialogFormVisibleChange"
    ></message>
     <pdf
      :contentVisible="contentVisible"
      v-if="contentVisible"
      :startTime="startTime"
      :endTime="endTime"
      :deviceNo="deviceNo1"
      :craneNo="craneNo"
      :projectId="projectId1"
      @dialogContentVisibleChange="dialogContentVisibleChange"
    ></pdf>
  </div>
</template>

<script>
import message from "@/components/dialog/message.vue";
import pdf from "@/components/pdfContent/content.vue";
import { getProjectListApi } from "@/views/device/api/crane.js";
import { getWarnInfo, createURL } from "@/views/crane/api/craneReport.js";
export default {
  name: "crane-call",
  components: {
    message,
    pdf
  },
  data() {
    return {
      keyWord: "",
      sms: null,
      dialogVisible: false,
      contentVisible: false,
      deviceNo: "",
      projectId: "",
      projectList: [],
      listData: [],
      pageIndex: 1,
      pageSizes: [10, 20, 30],
      pageSize: 10,
      pageTotal: 0,
      startTime:"",
      endTime:"",
      craneNo:"",
      deviceNo1: "",
      projectId1: "",
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
    if (this.$route.params.deviceNo) {
      this.deviceNo = this.$route.params.deviceNo;
    }
    let startTime = this.$moment()
      .startOf("month")
      .format("YYYY-MM-DD");
    let endTime = this.$moment().format("YYYY-MM-DD");
    this.daterange = [startTime, endTime];
    this.handleSearch();
  },
  methods: {
    //关闭弹框
    dialogFormVisibleChange() {
      this.dialogVisible = false;
    },
    dialogContentVisibleChange(){
      this.contentVisible =false;
    },
    //呼出短信弹框
    handleSms(row) {
      this.sms = `工程名称：${row.projectName}，塔机编号：${row.craneNo}，黑匣子编号：${row.deviceNo}，幅度报警：${row.rangeAlarm}，高度报警：${row.limitAlarm}，力矩报警：${row.momentAlarm}，碰撞报警：${row.collisionAlarm}，风速报警：${row.windSpeedAlarm}，倾角报警：${row.tiltAlarm}`;
      this.dialogVisible = true;
    },
    handleDown() {
      let [startTime, endTime] = this.daterange || ["", ""];
      let params = {
        keyWord: this.keyWord,
        startTime: `${startTime}%2000:00:00`,
        endTime: `${endTime}%2023:59:59`,
        deviceNo: this.deviceNo,
        projectId: this.projectId,
        type: 2
      };
      window.location.href = createURL(
        "/craneData/api/getWarnInfoExcel",
        params
      );
    },
    getProjectList() {
      getProjectListApi({}).then(res => {
        this.projectList = res.data;
      });
    },
    handleSearch() {
      this.pageIndex = 1;
      this.getListData();
    },
     handleReport(row){
    this.startTime = this.daterange[0];
    this.endTime =this.daterange[1];
    this.craneNo = row.craneNo;
    this.deviceNo1 = row.deviceNo;
    this.projectId1 = row.projectId;
     this.contentVisible = true;
    },
    handleView(row) {
      let [startTime, endTime] = this.daterange || ["", ""];
      this.$router.push({
        name: "craneProcess",
        params: { deviceNo: row.deviceNo },
        query: {
          craneNo: row.craneNo,
          type: 2,
          startTime: startTime,
          endTime: endTime
        }
      });
    },
    getListData() {
      let [startTime, endTime] = this.daterange || ["", ""];
      let params = {
        pageSize: this.pageSize,
        pageNum: this.pageIndex,
        startTime: `${startTime} 00:00:00`,
        endTime: `${endTime} 23:59:59`,
        body: {
          keyWord: this.keyWord,
          deviceNo: this.deviceNo,
          projectId: this.projectId,
          type: 2
        }
      };
      getWarnInfo(params).then(res => {
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
<!--
 * @Description: 处理单公共页
 * @Author: pangyu
 * @Date: 2019-06-17 17:46:19
 * @LastEditors: pangyu
 * @LastEditTime: 2019-07-02 18:27:48
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
            <el-select v-model="isHandle" placeholder="处理状态" clearable>
              <el-option label="已处理" :value="1"></el-option>
              <el-option label="未处理" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              class="searchBtn"
              type="primary"
              icon="el-icon-search"
              @click="handleSearch"
            >查询</el-button>
            <!-- <el-button
              class="searchBtn"
              type="primary"
              icon="el-icon-download"
              @click="handleDown"
            >导出</el-button>-->
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="container-box condition-box deviceTopInfo">
      <span>塔机编号：{{craneNo}}</span>
      <span>黑匣子编号：{{deviceNo}}</span>
      <span>已处理：{{handled}}</span>
      <span>未处理：{{unHandled}}</span>
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
          <el-table-column label="开始时间" prop="beginTime" width="140"></el-table-column>
          <el-table-column label="结束时间" prop="endTime" width="140"></el-table-column>
          <el-table-column label="报警详情" prop="alarmInfo" min-width="150" show-overflow-tooltip></el-table-column>
          <el-table-column label="是否处理" prop="isHandle" :formatter="isHandleFormat"></el-table-column>
          <el-table-column label="处理人" prop="modifyUserName"></el-table-column>
          <el-table-column label="处理时间" prop="modifyTime" width="140"></el-table-column>
          <el-table-column label="处理意见" prop="comments" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" fixed="right" width="200" align="center">
            <template slot-scope="scope">
              <el-button
                type="primary"
                plain
                size="small"
                icon="el-icon-huifang"
                @click="handBack(scope.row)"
              >回放</el-button>
              <el-button
                type="primary"
                plain
                size="small"
                icon="el-icon-chuli"
                :disabled="scope.row.isHandle==1"
                @click="handProcess(scope.row)"
              >处理</el-button>
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
    <el-dialog
      title="处理"
      :visible.sync="dialogVisible"
      width="700px"
      :close-on-click-modal="false"
      append-to-body
    >
      <div class="details-container">
        <div class="container-box details-box">
          <div class="details-body">
            <el-collapse v-model="activeNames">
              <el-collapse-item title="基本信息" name="1">
                <el-form size="small" label-width="80px" :model="formDatas" ref="editForm">
                  <el-row>
                    <el-col :xs="24" :sm="12" :md="12">
                      <el-form-item label="处理人">
                        <el-input v-model="formDatas.modifyUserName" disabled></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :md="12">
                      <el-form-item label="处理时间">
                        <el-input v-model="formDatas.modifyTime" disabled></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </el-collapse-item>
              <el-collapse-item title="处理意见" name="2">
                <el-input type="textarea" :rows="5" v-model="formDatas.comments" maxlength="200"></el-input>
              </el-collapse-item>
            </el-collapse>
          </div>
          <div class="details-footer">
            <el-button size="small" @click="handleCancel">取 消</el-button>
            <el-button size="small" type="primary" @click="handleSubmit">提交</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      title="动画回放"
      :visible.sync="visible"
      :append-to-body="true"
      :close-on-click-modal="false"
      width="800px"
    >
      <tower-back v-if="visible" v-bind="towerInfo"></tower-back>
    </el-dialog>
  </div>
</template>

<script>
import {
  selectAlarmInfo,
  selectAlarmInfoCount,
  updateHandle,
  createURL
} from "@/views/crane/api/craneReport.js";
import towerBack from "@/components/animation/towerBack.vue";

export default {
  components: {
    towerBack
  },
  name: "crane-process",
  data() {
    return {
      handled: 0,
      unHandled: 0,
      deviceNo: "",
      craneNo: "",
      type: "",
      projectId: "",
      projectList: [],
      listData: [],
      pageIndex: 1,
      pageSizes: [10, 20, 30],
      pageSize: 10,
      pageTotal: 0,
      sels: [],
      //处理状态
      isHandle: "",
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
      //处理
      dialogVisible: false,
      activeNames: ["1", "2"],
      formDatas: {},
      //动画回放
      visible: false,
      towerInfo: null
    };
  },
  mounted() {
    this.deviceNo = this.$route.params.deviceNo;
    this.craneNo = this.$route.query.craneNo;
    this.type = this.$route.query.type;
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
    handleDown() {
      let [startTime, endTime] = this.daterange || ["", ""];
      let params = {
        startTime: `${startTime}%2000:00:00`,
        endTime: `${endTime}%2023:59:59`,
        deviceNo: this.deviceNo,
        isHandle: this.isHandle,
        type: this.type
      };
      window.location.href = createURL(
        "/craneData/api/selectAlarmInfoExcel",
        params
      );
    },
    handleSearch() {
      this.pageIndex = 1;
      this.getListData();
    },
    //处理
    handProcess(row) {
      this.activeNames = ["1", "2"];
      this.formDatas = {
        id: row.id,
        modifyUser: JSON.parse(sessionStorage.getItem("user")).id,
        modifyUserName: JSON.parse(sessionStorage.getItem("user")).name,
        modifyTime: this.$moment().format("YYYY-MM-DD HH:mm:ss"),
        comments: row.comments,
        createTime: row.beginTime
      };
      this.dialogVisible = true;
    },
    //回放
    handBack(row) {
      this.towerInfo = row;
      this.visible = true;
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
          isHandle: this.isHandle,
          type: this.type
        }
      };
      selectAlarmInfoCount(params).then(res => {
        this.handled = res.data.handled;
        this.unHandled = res.data.unHandled;
      });
      selectAlarmInfo(params).then(res => {
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

    //提交
    handleSubmit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            let params = { body: this.formDatas };
            updateHandle(params).then(res => {
              this.dialogVisible = false;
              this.getListData();
            });
          });
        }
      });
    },
    //取消
    handleCancel() {
      this.$confirm("提交内容将不被保存，是否确认取消？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.dialogVisible = false;
      });
    },
    isHandleFormat(row, column, cellValue, index) {
      return cellValue == 1 ? "是" : "否";
    }
  }
};
</script>

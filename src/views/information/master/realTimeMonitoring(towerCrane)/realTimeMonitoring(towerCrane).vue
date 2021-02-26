<template>
  <div class="app-container list-container">
    <div class="container-box condition-box">
      <div class="conditionBar">
        <el-form :inline="true" class="condition-form" size="mini">
          <el-form-item>
            <el-select
              v-model="keyword"
              placeholder="工程名称"
              :clearable="true"
              :filterable="true"
              size="mini"
            >
              <el-option
                v-for="item in projectList"
                :label="item.label"
                :value="item.value"
                :key="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input v-model="deviceNo" placeholder="黑匣子编号" clearable></el-input>
          </el-form-item>
          <!-- <el-form-item>
            <el-select
              v-model="status"
              placeholder="状态"
              :clearable="true"
              :filterable="true"
              size="mini"
            >
              <el-option
                v-for="item in statusList"
                :label="item.label"
                :value="item.value"
                :key="item.value"
              ></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item>
            <el-button
              class="searchBtn"
              type="primary"
              size="mini"
              icon="el-icon-search"
              @click="handleSearch"
            >查询</el-button>
          </el-form-item>
          <el-form-item style="float:right">
            <div class="typeGroup">
              <div :class="['btn',type===1?'active':'']" @click="typeChange(1)">
                <span class="icon icon1">违章({{typeInfo.weizhang}})</span>
              </div>
              <div :class="['btn',type===2?'active':'']" @click="typeChange(2)">
                <span class="icon icon2">报警({{typeInfo.baojing}})</span>
              </div>
              <div :class="['btn',type===3?'active':'']" @click="typeChange(3)">
                <span class="icon icon3">提醒({{typeInfo.tixing}})</span>
              </div>
              <div :class="['btn',type===4?'active':'']" @click="typeChange(4)">
                <span class="icon icon4">正常({{typeInfo.zaixian}})</span>
              </div>
              <div :class="['btn',type===5?'active':'']" @click="typeChange(5)">
                <span class="icon icon5">离线({{typeInfo.lixian}})</span>
              </div>
            </div>
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
          <el-table-column label="黑匣子编号" prop="deviceNo" min-width="150"></el-table-column>
          <el-table-column label="制造厂家" prop="manufactor" min-width="150" show-overflow-tooltip></el-table-column>
          <el-table-column label="状态" prop="status" min-width="100" :formatter="getStatus"></el-table-column>
          <el-table-column label="工程名称" prop="projectName" min-width="150" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" align="center" width="400" fixed="right">
            <template slot-scope="scope">
              <div class="btnGroup">
                <el-button
                  type="primary"
                  plain
                  size="small"
                  @click="goToMonitorState(scope.row)"
                >监控状态</el-button>
                <el-button type="primary" plain size="small" @click="goToRunData(scope.row)">运行数据</el-button>
                <el-button type="primary" plain size="small" @click="goToRunTime(scope.row)">运行时间</el-button>
                <el-button
                  type="primary"
                  plain
                  size="small"
                  @click="goToHoistingData(scope.row)"
                >吊重数据</el-button>
                <el-button
                  type="primary"
                  plain
                  size="small"
                  @click="goToPromptingMessage(scope.row)"
                >预警信息</el-button>
                <el-button
                  type="primary"
                  plain
                  size="small"
                  @click="goToWarningMessage(scope.row)"
                >报警信息</el-button>
                <el-button
                  type="primary"
                  plain
                  size="small"
                  @click="goToViolationInformation(scope.row)"
                >违章信息</el-button>
                <el-button type="primary" plain size="small" @click="handTower(scope.row)">实时动画</el-button>
              </div>
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
      title="实时动画"
      :visible.sync="visible"
      :append-to-body="true"
      :close-on-click-modal="false"
      width="800px"
    >
      <tower-on v-if="visible" v-bind="towerInfo"></tower-on>
    </el-dialog>
  </div>
</template>

<script>
import { selectCrane, selectProjectInfo } from "@/views/api/equipmentApi.js";
import {
  getDeviceList,
  selectCraneStatus
} from "@/views/crane/api/craneReport.js";
import towerOn from "@/components/animation/towerOn.vue";
export default {
  components: {
    towerOn
  },
  data() {
    return {
      type: "",
      listData: [],
      keyword: "",
      deviceNo: "",
      status: "",
      pageIndex: 1,
      pageSizes: [10, 20, 30],
      pageSize: 10,
      pageTotal: 0,
      sels: [],
      hoistingDataPath: this.$route.path + "/hoistingData",
      promptingMessagePath: this.$route.path + "/promptingMessage",
      runDataPath: this.$route.path + "/runData",
      runTimePath: this.$route.path + "/runTime",
      violationInformationPath: this.$route.path + "/violationInformation",
      warningMessagePath: this.$route.path + "/warningMessage",
      statusList: [{ label: "离线", value: 0 }, { label: "在线", value: 1 }],
      projectList: [],
      visible: false,
      towerInfo: null,
      typeInfo:{}
    };
  },
  computed: {
    params() {
      let param = {
        projectId: this.keyword,
        body: {
          status: this.status,
          deviceNo: this.deviceNo,
          alarmStatus: this.type
        },
        pageNum: this.pageIndex,
        pageSize: this.pageSize
      };
      return param;
    }
  },
  mounted() {
    if (this.$route.query.deviceNo) {
      this.deviceNo = this.$route.query.deviceNo;
    }
    this.handleSearch();
    this.getProject();
  },
  methods: {
    selectCraneStatus() {
      let params = {
        projectId: this.keyword,
        body: { status: this.status, deviceNo: this.deviceNo }
      };
      selectCraneStatus(params).then(res => {
        this.typeInfo = res.data;
      });
    },
    typeChange(val) {
      this.type = this.type == val ? "" : val;
      this.handleSearch();
    },
    handTower(row) {
      this.towerInfo = row;
      this.visible = true;
    },
    //条件查询
    handleSearch() {
      this.pageIndex = 1;
      this.getListData();
      this.selectCraneStatus();
    },
    //获取列表
    getListData() {
      selectCrane(this.params).then(res => {
        this.listData = res.data.list;
        this.pageTotal = Number(res.data.total);
        if (this.pageTotal == 0 && this.pageIndex > 1) {
          this.pageIndex--;
          this.getListData();
        }
      });
    },
    //改变页面显示条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.getListData();
    },
    //改变页数
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.getListData();
    },
    //勾选复选框时给sels赋值
    listSelectionChange(sels) {
      this.sels = sels;
    },
    //点击监控状态按钮跳转到监控状态页面

    goToMonitorState: function(row) {
      this.$router.push({
        name: "craneStatus",
        params: { deviceNo: row.deviceNo },
        query: { id: row.id }
      });
    },
    //点击运行数据按钮跳转到运行数据页面
    goToRunData: function(row) {
      this.$router.push({
        name: "craneData",
        params: { deviceNo: row.deviceNo },
        query: { id: row.id }
      });
    },
    //点击运行时间按钮跳转到运行时间页面
    goToRunTime: function(row) {
      this.$router.push({
        name: "craneRunTime",
        params: { deviceNo: row.deviceNo },
        query: { id: row.id }
      });
    },
    //点击吊重数据按钮跳转到吊重数据页面
    goToHoistingData: function(row) {
      this.$router.push({
        name: "craneWeight",
        params: { deviceNo: row.deviceNo },
        query: { id: row.id }
      });
    },
    //点击预警信息按钮跳转到预警信息页面
    goToPromptingMessage: function(row) {
      //this.$router.push({ path: this.promptingMessagePath, query: { row : row } });
      this.$router.push({
        name: "craneEarly",
        params: { deviceNo: row.deviceNo }
      });
    },
    //点击报警信息按钮跳转到报警信息页面
    goToWarningMessage: function(row) {
      // this.$router.push({ path: this.warningMessagePath, query: { row : row } });
      this.$router.push({
        name: "craneCall",
        params: { deviceNo: row.deviceNo }
      });
      //this.$router.push({ name: 'craneCall', params: { id : row.id } });
    },
    //点击违章信息按钮跳转到违章信息页面
    goToViolationInformation: function(row) {
      // this.$router.push({ path: this.violationInformationPath, query: { row : row } });
      this.$router.push({
        name: "craneViolation",
        params: { deviceNo: row.deviceNo }
      });
    },
    //格式化状态
    getStatus: function(row) {
      if (row.status == 0) {
        return "离线";
      } else if (row.status == 1) {
        return "在线";
      }
    },
    //获取项目
    getProject: function() {
      let para = {};
      selectProjectInfo(para).then(res => {
        this.projectList = res.data;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.btnGroup .el-button {
  margin: 3px;
}
.typeGroup {
  display: flex;
  align-items: center;
  text-align: center;
  border: 1px solid #c3c7d3;
  border-radius: 3px;
  font-size: 12px;
  color: #6d7587;
  .btn {
    width: 70px;
    height: 26px;
    line-height: 26px;
    border-right: 1px solid #c3c7d3;
    cursor: pointer;
    &:last-child {
      border-right: 0;
    }
    &.active {
      background-color: #409eff;
      color: #fff;
    }
    .icon {
      padding-left: 16px;
      position: relative;
      &::before {
        position: absolute;
        content: " ";
        width: 12px;
        height: 12px;
        left: 0;
        top: 0.2px;
      }
    }
    .icon5 {
      &::before {
        background-color: #999999;
      }
    }
    .icon4 {
      &::before {
        background-color: #00a450;
      }
    }
    .icon3 {
      &::before {
        background-color: #e3de09;
      }
    }
    .icon2 {
      &::before {
        background-color: #fd9316;
      }
    }
    .icon1 {
      &::before {
        background-color: #e23636;
      }
    }
  }
}
</style>

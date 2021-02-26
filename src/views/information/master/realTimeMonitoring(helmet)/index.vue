<!--
 * @Author: xss
 * @CreateTime: 2018-09-08 22:30:40
 * @Desc: 升降机指标设置一览
-->
<template>
    <div class="app-container list-container">
        <div class="container-box condition-box">
            <div class="conditionBar">
                <el-form :inline="true" class="condition-form">                 
                    <el-form-item>
                      <el-select v-model="keyword" filterable  clearable   placeholder="工程名称" size="mini">
                         <el-option v-for="item in projectList" :label="item.name" :value="item.id" :key="item.id"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button class="searchBtn" type="primary" size="mini" icon="el-icon-search" @click="handleSearch">查询</el-button>
                    </el-form-item>
                    <!-- <topButton :operationPrex="operationPrex" @clickInsert="handleInsert" @clickUpdate="handleUpdate" @clickDelate="handleDelete" check="callTimes=1" :sels="sels"></topButton> -->
                </el-form>
            </div>
        </div>

        <div class="container-box list-box">
            <div class="table-box">
                <el-table size="small" :data="listData" style="width: 100%" height="100%"  highlight-current-row @selection-change="listSelectionChange"  header-row-class-name="xyTableHeader">
                    <el-table-column type="selection" :width="selectionWidth"></el-table-column>
                    <el-table-column type="index" :width="indexWidth"></el-table-column>
                    <el-table-column label="工程名称" prop="projectName" show-overflow-tooltip></el-table-column>
                    <el-table-column label="IMEI编号" prop="imei" show-overflow-tooltip width="200px"></el-table-column>
                    <el-table-column label="身份证号码" prop="idCardNumber" width="300px"></el-table-column>
                    <el-table-column label="在线状态" prop="standardHeight" :formatter="handleStatus"></el-table-column>
                    <el-table-column label="启用状态" prop="standardHeight" :formatter="handleStatus1"></el-table-column>
                    <el-table-column label="操作"  align="center" width="300" fixed="right">
                    <template slot-scope="scope" >
                      <el-button type="primary" plain size="small" @click="goToMonitorState(scope.row)">监控状态</el-button>
                      <el-button type="primary" plain size="small" @click="goToRunData(scope.row)">运行数据</el-button>
                      <!-- <el-button type="primary" plain size="small" @click="goToRunTime(scope.row)">运行时间</el-button> -->
                      <!-- <el-button type="primary" plain size="small" @click="goToHoistingData(scope.row)">吊重数据</el-button> -->
                      <el-button type="primary" plain size="small" @click="goToPromptingMessage(scope.row)">报警信息</el-button>
                      <!-- <el-button type="primary" plain size="small" @click="goToWarningMessage(scope.row)">报警信息</el-button> -->
                      <!-- <el-button type="primary" plain size="small" @click="goToViolationInformation(scope.row)">违章信息</el-button> -->
                        <!-- <rightButton :operationPrex="operationPrex"  @clickView="handleView" @clickUpdate="handleUpdate" @clickDelate="handleDelete" :row="scope.row" :disDelete="scope.row.callTimes>'0'?true:false"></rightButton> -->
                    </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="pagination-box">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageIndex" :page-sizes="pageSizes" :page-size="pageSize" :total="pageTotal" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
            </div>
        </div>
        <!-- <detailsDialog v-if="visible" :visible.sync="visible" @close="closeDialog" :routeType="detailsType" :detailsId="detailsId"></detailsDialog> -->
    </div>
</template>
<script>
import {
  getListApi,
  deleteInfoApi,
  getProjectListApi
} from "@/views/information/api/realTimeMonitoring(helmet).js";
//import detailsDialog from "./details";
export default {
  components: {
    //detailsDialog
  },
  data() {
    return {
      operationPrex: "helmet:device:manage",
      listData: [],
      isDangerous: "",
      keyword: "",
      projectList: [],
      pageIndex: 1,
      pageSizes: [10, 20, 30],
      pageSize: 10,
      pageTotal: 0,
      sels: [],
      visible: false,
      detailsType: null,
      detailsId: null,
      monitorStatusPath: this.$route.path + "/monitorStatus",
      runDataPath: this.$route.path + "/runData",
      promptingMessagePath: this.$route.path + "/promptingMessage"
    };
  },
  computed: {
    params() {
      let param = {
        id: this.keyword,
        pageNum: this.pageIndex,
        pageSize: this.pageSize
      };
      return param;
    }
  },
  mounted() {
    this.getListData();
    getProjectListApi({}).then(res => {
      this.projectList = res.data;
    });
  },
  methods: {
    //条件查询
    handleSearch() {
      //this.pageIndex = 1;
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
    //状态转换
    handleStatus(row) {
      return row.isOnline == 1 ? "在线" : "离线";
    },
    //状态转换
    handleStatus1(row) {
      return row.status == 1 ? "启用" : "未启用";
    },
    //点击监控状态按钮跳转到监控状态页面
    goToMonitorState: function(row) {
      this.$router.push({ path: this.monitorStatusPath, query: { row: row } });
    },
    //点击运行数据按钮跳转到运行数据页面
    goToRunData: function(row) {
      this.$router.push({ path: this.runDataPath, query: { row: row } });
    },
    //点击预警信息按钮跳转到预警信息页面
    goToPromptingMessage: function(row) {
      this.$router.push({
        path: this.promptingMessagePath,
        query: { row: row }
      });
    },
    //新增
    handleInsert() {
      this.visible = true;
      this.detailsType = "insert";
      this.detailsId = null;
    },
    handleView(row) {
      this.visible = true;
      this.detailsType = "view";
      this.detailsId = row.id;
    },
    //更新
    handleUpdate(row) {
      this.visible = true;
      this.detailsType = "update";
      this.detailsId = row.id;
    },
    //删除方法
    handleDelete(sels) {
      let params = { ids: sels.map(item => item.id) };
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning"
      }).then(() => {
        deleteInfoApi(params).then(res => {
          this.$message({
            message: res.message,
            type: res.success ? "success" : "error"
          });
          this.handleSearch();
        });
      });
    },
    //删除时验证是否选中
    listSelectionChange(sels) {
      this.sels = sels;
    },
    //关闭模态框
    closeDialog() {
      this.visible = false;
      this.handleSearch();
    }
  }
};
</script>


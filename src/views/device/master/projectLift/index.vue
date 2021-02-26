<template>
    <div class="app-container list-container">
        <div class="container-box condition-box">
            <div class="conditionBar">
                <el-form :inline="true" class="condition-form">
                    <el-form-item>
                        <!-- <el-input size="mini" placeholder="工程名称" v-model="keyword" clearable class="toolbar-search"></el-input> -->
                         <el-select size="mini"  v-model="projectId" filterable  clearable   placeholder="工程名称">
                                            <el-option v-for="item in projectList" :label="item.name" :value="item.id" :key="item.id"></el-option>
                                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button class="searchBtn" type="primary" size="mini" icon="el-icon-search" @click="handleSearch">查询</el-button>
                    </el-form-item>
                    <topButton @clickInsert="handleInsert" @clickUpdate="handleUpdate" @clickDelate="handleDelete" check="status=1" :sels="sels" :operationPrex="operationPrex"></topButton>
                    <el-form-item>
                        <!-- <el-button  v-if="validateOperation('handleOpen')" class="updateBtn" type="primary" size="mini" icon="el-icon-dagou" :disabled="checkDisabled('status=1')"  @click="handleOpen">启用</el-button>
                        <el-button v-if="validateOperation('close')" class="updateBtn" type="danger" size="mini" icon="el-icon-xx" :disabled="checkDisabled('status=0')" @click="handleClose">停用</el-button>
                        -->
                        <el-button v-if="validateOperation('handleOpen')" class="updateBtn" type="primary" size="mini" icon="el-icon-dagou" :disabled="checkDisabled('status=1')"  @click="handleOpen">启用</el-button>
                        <el-button v-if="validateOperation('close')" class="updateBtn" type="danger" size="mini" icon="el-icon-xx" :disabled="checkDisabled('status=0')" @click="handleClose">停用</el-button>
                   
                    
                    </el-form-item>
                </el-form>
            </div>
        </div>

        <div class="container-box list-box">
            <div class="table-box">
                <el-table size="small" :data="listData" style="width: 100%" height="100%"  highlight-current-row @selection-change="listSelectionChange"  header-row-class-name="xyTableHeader">
                    <el-table-column type="selection" :width="selectionWidth"></el-table-column>
                    <el-table-column type="index" :width="indexWidth"></el-table-column>
                    <el-table-column label="工程名称" :show-overflow-tooltip="true" prop="projectName"></el-table-column>
                    <el-table-column label="黑匣子编号" :show-overflow-tooltip="true" prop="deviceNo"></el-table-column>
                    <el-table-column label="设备名称" :show-overflow-tooltip="true" prop="name"></el-table-column>
                    <el-table-column label="产权单位" :show-overflow-tooltip="true" prop="owner"></el-table-column>
                    <el-table-column label="制造厂家" :show-overflow-tooltip="true" prop="manufactor"></el-table-column>
                    <el-table-column label="最大载重量(t)" prop="maxWeight"></el-table-column>
                    <el-table-column label="标准高度(m)" prop="standardHeight"></el-table-column>
                    <el-table-column label="最大载人数(人)" prop="maxPeople"></el-table-column>
                    <el-table-column label="运行速度(m/s)" prop="speed"></el-table-column>
                    <el-table-column label="在线状态" prop="statusName" ></el-table-column>
                    <el-table-column label="状态" prop="status" :formatter="handleStatus"></el-table-column>
                    <el-table-column label="视频">
                        <template slot-scope="scope">
                            <span style="text-decoration: underline;color:blue;" @click="handleHerf(scope.row)">视频</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="创建日期"  prop="createTime" :formatter="handleDate" :width="dateWidth"></el-table-column>
                    <el-table-column label="创建人" prop="createUserName" :width="userWidth"></el-table-column>
                    <el-table-column label="操作" :width="operateWidth" align="center" fixed="right">
                        <template slot-scope="scope">
                            <rightButton  :disUpdate="scope.row.status=='1'?true:false" :disDelete="scope.row.status=='1'?true:false"  @clickView="handleView" @clickUpdate="handleUpdate" @clickDelate="handleDelete" :row="scope.row" :operationPrex="operationPrex"></rightButton>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="pagination-box">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageIndex" :page-sizes="pageSizes" :page-size="pageSize" :total="pageTotal" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
            </div>
        </div>
        <detailsDialog v-if="visible" :visible.sync="visible" @close="closeDialog" :activeCode="activeCode" :routeType="detailsType" :detailsId="detailsId"></detailsDialog>
    </div>
</template>

<script>
import {
  getListApi,
  deleteInfoApi,
  updateStatusApi,
  getProjectListApi,
  getInfoApi
} from "../../api/projectLift.js";
import detailsDialog from "./details";
import moment from "moment";
export default {
  components: {
    detailsDialog
  },
  data() {
    return {
      listData: [],
      monitorDetails: [],
      projectId: null,
      keyword: "",

      pageIndex: 1,
      pageSizes: [10, 20, 30],
      pageSize: 10,
      pageTotal: 0,
      pageIndex1: 1,
      pageSizes1: [10, 20, 30],
      pageSize1: 10,
      pageTotal1: 0,
      sels: [],
      visible: false,
      detailsType: null,
      activeCode: 0,
      detailsId: null,
      projectList: [],
      operationPrex: "lift:deviceMain:projectLift"
    };
  },
  computed: {
    params() {
      let param = {
        id: this.projectId,
        pageNum: this.pageIndex,
        pageSize: this.pageSize
      };
      return param;
    }
  },
  mounted() {
    this.handleSearch();
    this.getProjectList();
  },
  methods: {
    //默认查询
    handleSearch() {
      this.getListData();
    },
    //查询项目列表
    getProjectList() {
      getProjectListApi({}).then(res => {
        this.projectList = res.data;
      });
    },
    //查询一览
    getListData() {
      if (this.params.id != "" && this.params.id != null) {
        this.pageIndex = 1;
        this.pageSize = 10;
      }
      getListApi(this.params).then(res => {
        this.listData = res.data.list;
        this.listData.forEach(el => {
          el.video = "视频";
        });
        this.pageTotal = res.data.total;
      });
    },

    //日期格式转换
    handleDate(row, column, cellValue, index) {
      if (cellValue) {
        return moment(cellValue).format("YYYY-MM-DD");
      } else {
        return "";
      }
    },
    //启用
    handleOpen() {
      let params = { ids: this.sels.map(item => item.id) };
      let flag = false;
      this.$confirm("确认启用选中记录吗？", "提示", {
        type: "warning"
      }).then(() => {
        this.sels.forEach(element => {
          //console.log(element.status);

          if (element.status === 1 || element.status == "已启用") {
            flag = true;
            this.$message({
              message: "已启用的不可再启用",
              type: "error"
            });
            return;
          }
        });
        if (!flag) {
          updateStatusApi(params).then(res => {
            this.$message({
              message: res.message,
              type: res.success ? "success" : "error"
            });
            this.handleSearch();
          });
        }
      });
    },
    //停用方法
    handleClose() {
      let params = { ids: this.sels.map(item => item.id), key: "stop" };
      let flag = false;
      //console.log(params.ids.length);
      if (params.ids.length > 0) {
        this.$confirm("确认停用选中记录吗？", "提示", {
          type: "warning"
        }).then(() => {
          this.sels.forEach(element => {
            //console.log(element.status);
            if (element.status === 0 || element.status == "已停用") {
              flag = true;
              this.$message({
                message: "已停用的不可再停用",
                type: "error"
              });
              return;
            }
          });
          if (!flag) {
            updateStatusApi(params).then(res => {
              this.$message({
                message: res.message,
                type: res.success ? "success" : "error"
              });
              this.handleSearch();
            });
          }
        });
      } else {
        this.$message({
          message: "请选择要停用的记录！",
          type: "warning"
        });
      }
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

    //选中的行数据
    listSelectionChange(sels) {
      this.sels = sels;
    },
    //设备状态
    handleSIsOnline(row) {
      return row.isOnline == 1 ? "在线" : "离线";
    },
    //启用状态
    handleStatus(row) {
      return row.status == 1 ? "已启用" : "未启用";
    },

    //删除
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
    //视频标签跳转
    handleHerf(row) {
      //console.log("206", row);
      let param = { id: row.id };
      getInfoApi(param).then(res => {
        this.cameraInfo = res.data.videos;
        sessionStorage.setItem("ip", this.cameraInfo[0].ipAddress);
        sessionStorage.setItem("port", this.cameraInfo[0].port);
        sessionStorage.setItem("loginName", this.cameraInfo[0].loginName);
        sessionStorage.setItem("password", this.cameraInfo[0].password);
        sessionStorage.setItem("projectName", row.projectName);
        sessionStorage.setItem("projectId", row.projectId);
        sessionStorage.setItem("platformType", this.cameraInfo[0].platformType);
        sessionStorage.setItem("area", this.cameraInfo[0].area);
        sessionStorage.setItem("appkey", this.cameraInfo[0].appkey);
        sessionStorage.setItem("secret", this.cameraInfo[0].secret);
        sessionStorage.setItem("tunnel",this.cameraInfo[0].tunnel);
        this.$router.push("/projectLift/video");
      });
    },
    //查看
    handleView(row) {
      this.activeCode = 0;
      this.visible = true;
      this.detailsType = "view";
      this.detailsId = row.id;
    },
    //跳转编辑
    handleUpdate(row) {
      this.activeCode = 0;
      this.visible = true;
      this.detailsType = "update";
      this.detailsId = row.id;
    },
    //跳转新增
    handleInsert() {
      this.activeCode = 0;
      this.visible = true;
      this.detailsType = "insert";
      this.detailsId = null;
    },
    //关闭弹窗
    closeDialog() {
      this.visible = false;
      this.pageIndex = 1;
      this.pageSize = 10;
      this.handleSearch();
    }
  }
};
</script>

<style>
</style>

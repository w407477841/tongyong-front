<!--
 * @Author: zhouyujie
 * @CreateTime: 2018-09-08 22:31:23
 * @Desc: 绿色施工主页面
-->
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
                    <topButton :operationPrex="operationPrex" @clickInsert="handleInsert" @clickUpdate="handleUpdate" @clickDelate="handleDelete" check="status=1" :sels="sels"></topButton>
                    <el-form-item>
                    <el-button v-if="validateOperation('open')" class="updateBtn" type="primary" size="mini" icon="el-icon-dagou" :disabled="checkDisabled('status=1')"  @click="handleOpen">启用</el-button>
                    <el-button v-if="validateOperation('close')" class="updateBtn" type="danger" size="mini" icon="el-icon-xx" :disabled="checkDisabled('status=0')" @click="handleClose1">停用</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>

        <div class="container-box list-box">
            <div class="table-box">
                <el-table size="small" :data="listData" style="width: 100%" height="100%"  highlight-current-row @selection-change="listSelectionChange"  header-row-class-name="xyTableHeader">
                    <el-table-column type="selection" :width="selectionWidth"></el-table-column>
                    <el-table-column type="index" :width="indexWidth"></el-table-column>
                    <el-table-column label="工程名称" prop="projectName" show-overflow-tooltip></el-table-column>
                    <el-table-column label="黑匣子编号" prop="deviceNo" show-overflow-tooltip></el-table-column>
                    <el-table-column label="设备名称" prop="name" show-overflow-tooltip></el-table-column>
                   <el-table-column label="产权单位" prop="owner" show-overflow-tooltip></el-table-column>
                    <el-table-column label="制造厂家" prop="manufactor" show-overflow-tooltip></el-table-column>
                     <el-table-column label="PM2.5(μg/m³)" prop="pm25" width="100"  show-overflow-tooltip></el-table-column>
                     <el-table-column label="PM10(μg/m³)" prop="pm10" width="100"  show-overflow-tooltip></el-table-column>
                    <el-table-column label="风速(m/s)" prop="windSpeed" show-overflow-tooltip></el-table-column>
                      <el-table-column label="最小温度(℃)" width="100" prop="temperatureMin" show-overflow-tooltip></el-table-column>
                    <el-table-column label="最大温度(℃)" width="100" prop="temperatureMax" show-overflow-tooltip></el-table-column>
                    <el-table-column label="最小湿度(%rh)" width="100"  prop="humidityMin" show-overflow-tooltip></el-table-column>
                    <el-table-column label="最大湿度(%rh)" width="100" prop="humidityMax" show-overflow-tooltip></el-table-column>
                    <el-table-column label="噪音(分贝)" prop="noise"  show-overflow-tooltip></el-table-column>
                    <el-table-column label="风力(级)" prop="windForce"  show-overflow-tooltip></el-table-column>
                    <el-table-column label="TSP(μg/m³)" prop="tsp" width="100"  show-overflow-tooltip></el-table-column>
                    <el-table-column label="在线状态" prop="statusName" ></el-table-column>
                    <el-table-column label="状态" prop="status" :formatter="handleStatus"></el-table-column>
                    <el-table-column label="视频">
                      <template slot-scope="scope">
                        <span style="text-decoration: underline;color:blue;" @click="handleHerf(scope.row)">视频</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="创建日期" prop="createTime" :formatter="handleDate" :width="dateWidth"></el-table-column>
                    <el-table-column label="创建人" prop="createUserName" :width="userWidth" show-overflow-tooltip></el-table-column>
                    <el-table-column label="操作" :width="400" align="center" fixed="right">
                        <template slot-scope="scope">
                            <rightButton :operationPrex="operationPrex" :hasView="true" :hasUpdate="true" @clickView="handleView" @clickUpdate="handleUpdate" @clickDelate="handleDelete" :disUpdate="scope.row.status=='1'?true:false" :disDelete="scope.row.status=='1'?true:false" :row="scope.row">
                                <el-button v-if="validateOperation('bind')" class="updateBtn" type="primary" size="mini" icon="el-icon-edit"  @click="handleBind(scope.row)">绑定</el-button>
                            </rightButton>

                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="pagination-box">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageIndex" :page-sizes="pageSizes" :page-size="pageSize" :total="pageTotal" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
            </div>
        </div>

       <el-dialog title="工程地点" :visible.sync="mapVisible" :close-on-click-modal="false" width="80%" v-if="mapVisible">
      <map-baidu @setShow="setShow"></map-baidu>
    </el-dialog>

<detailsDialog v-if="visible" :visible.sync="visible" @close="closeDialog" :routeType="detailsType" :activeCode="activeCode" :detailsId="detailsId"></detailsDialog>
<bindDialog v-if="bindVisible" :visible.sync="bindVisible" @close="closeBindDialog" :routeType="bindType" :detailsId="detailsId" :projectId="projectId"></bindDialog>

    </div>
</template>

<script>
import {
  getListApi,
  deleteInfoApi,
  updateStatusApi,
  getProjectListApi,
  getInfoApi
} from "../../api/monitor.js";
import detailsDialog from "./details";
import bindDialog from "./sprayBind";
import moment from "moment";
import MapBaidu from "./mapBaidu";
export default {
  components: {
    detailsDialog,
    bindDialog
  },
  data() {
    return {
      operationPrex: "dust:monitor:device",
      listData: [],
      cameraInfo: [],
      monitorDetails: [],
      sprayMessage: [],
      sprayList: [],
      rowSelected: [],
      projectId: "",
      keyword: "",
      mapVisible: false,
      bindVisible: false,
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
      sprayVisible: false,
      detailsType: null,
      bindType: null,
      activeCode: 0,
      detailsId: null,
      projectList: []
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
   /* rowClick(row) {
      this.detailsId = row.id;
      this.projectId = row.projectId;
    },*/
    //默认查询
    handleSearch() {
      this.getListData();
    },
    //展示
    setShow: function(data) {
      if (data.sign == "打开地图") {
        this.mapVisible = true;
      } else if (data.sign == "关闭地图") {
        this.placePoint =
          "{lng:" + data.data.point.lng + ",lat:" + data.data.point.lat + "}";
        this.mapVisible = false;
      }
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
          console.log(element.status);

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
    //停用方法
    handleClose1() {
      console.log("停用方法");
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
          message: "请选择要启用的记录！",
          type: "warning"
        });
      }
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
    //绑定
    handleBind(row) {
      this.bindVisible = true;
      this.detailsId = row.id;
    },
    handleClose() {
      this.sprayVisible = false;
    },
    //视频标签跳转
    handleHerf(row) {
      console.log("206", row);
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
        sessionStorage.setItem("tunnel", this.cameraInfo[0].tunnel);
        this.$router.push("/monitor/video");
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
    closeBindDialog() {
      this.bindVisible = false;
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

<style lang="scss" scoped>
</style>

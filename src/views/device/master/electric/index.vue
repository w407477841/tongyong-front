
<!--
 * @Author: hy
 * @CreateTime: 2018-09-08 22:30:40
 * @Desc: 电表管理一览
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
                        <el-button class="updateBtn" type="primary" size="mini" icon="el-icon-dagou" :disabled="checkDisabled('status=1')"  @click="handleOpen(1)">启用</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button class="updateBtn" type="danger" size="mini" icon="el-icon-xx" :disabled="checkDisabled('status=0')"  @click="handleOpen(0)">停用</el-button>
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
                    <el-table-column label="设备名称" :show-overflow-tooltip="true" prop="name"></el-table-column>
                    <el-table-column label="黑匣子编号" :show-overflow-tooltip="true" prop="deviceNo"></el-table-column>
                    <el-table-column label="制造厂家" prop="manufactor"></el-table-column>
                    <el-table-column label="规格型号" prop="specification"></el-table-column>
                    <el-table-column label="GPRS" prop="gprs"></el-table-column>
                    <el-table-column label="每秒耗电量(千瓦时)" prop="dissipation" width="130px" ></el-table-column>
                    <el-table-column label="位置" prop="placePoint" width="150px" ></el-table-column>
                    <el-table-column label="在线状态" prop="isOnline" :formatter="handleSIsOnline"></el-table-column>
                    <el-table-column label="状态" prop="status" :formatter="handleStatus"></el-table-column>
                    <el-table-column label="采集器编号" prop="collecterNo"></el-table-column>
                    <el-table-column label="采集器状态" prop="isOnlineCollecter" :formatter="handleSIsOnline"></el-table-column>
                    <el-table-column label="互感系数" prop="ratio" ></el-table-column>
                    <el-table-column label="创建日期"  prop="createTime" :formatter="handleDate" width="90px"></el-table-column>
                    <el-table-column label="创建人" prop="createUserName" :width="userWidth"></el-table-column>
                    <el-table-column label="操作" :width="operateWidth" align="center" fixed="right">
                        <template slot-scope="scope">
                            <rightButton :operationPrex="operationPrex" :disUpdate="scope.row.status=='1'?true:false" :disDelete="scope.row.status=='1'?true:false"  @clickView="handleView" @clickUpdate="handleUpdate" @clickDelate="handleDelete" :row="scope.row"></rightButton>
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
  getProjectListApi
} from "../../api/electric.js";
import detailsDialog from "./details";
import moment from "moment";
export default {
  components: {
    detailsDialog
  },
  data() {
    return {
      operationPrex: "electric:device:device",
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
        //console.log(res.data.list,"列表");
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
    handleOpen(status) {
      let params = { ids: this.sels.map(item => item.id), status: status };
      let flag = false;
      let text = "";
      if (status == 0) {
        text = "停用";
      }
      if (status == 1) {
        text = "启用";
      }
      this.$confirm("确认" + text + "选中记录吗？", "提示", {
        type: "warning"
      }).then(() => {
        this.sels.forEach(element => {
          //console.log(element.status);

          if (
            status == 1 &&
            (element.status === 1 || element.status == "已启用")
          ) {
            flag = true;
            this.$message({
              message: "已启用的不可再启用",
              type: "error"
            });
            return;
          }
          if (
            status == 0 &&
            (element.status === 0 || element.status == "已停用")
          ) {
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
      //console.log(this.activeCode);
      this.activeCode = 1;
      this.visible = true;
      this.detailsType = "view";
      this.detailsId = row.id;
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

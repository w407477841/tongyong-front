<template>
    <div class="app-container list-container">
        <div class="container-box condition-box">
            <div class="conditionBar">
                <el-form :inline="true" class="condition-form">                 
                    <el-form-item>
                      <el-select v-model="keyword" filterable  clearable   placeholder="工程名称" size="mini">
                         <el-option v-for="item in projectList" :label="item.label" :value="item.value" :key="item.value"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button class="searchBtn" type="primary" size="mini" icon="el-icon-search" @click="handleSearch">查询</el-button>
                    </el-form-item>
                    <topButton :operationPrex="operationPrex" @clickInsert="handleInsert" @clickUpdate="handleUpdate" @clickDelate="handleDelete" check="status=1" :sels="sels"></topButton>
                    <el-form-item>
                    <el-button v-if="validateOperation('setUse')" class="updateBtn" type="primary" size="mini" icon="el-icon-dagou" :disabled="checkDisabled('status=1') || isRepetition" @click="handleOpen">启用</el-button>
                    <el-button v-if="validateOperation('setDis')" class="updateBtn" type="danger" size="mini" icon="el-icon-close" :disabled="checkDisabled('status=0')" @click="handleClose">停用</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>

        <div class="container-box list-box">
            <div class="table-box">
                <el-table size="small" :data="listData" style="width: 100%" height="100%"  highlight-current-row @selection-change="listSelectionChange" header-row-class-name="xyTableHeader">
                    <el-table-column type="selection" :width="selectionWidth"></el-table-column>
                    <el-table-column type="index" :width="indexWidth"></el-table-column>
                    <el-table-column label="工程名称" prop="projectName" show-overflow-tooltip></el-table-column>
                    <el-table-column label="设备名称" prop="name" show-overflow-tooltip></el-table-column>
                    <el-table-column label="黑匣子编号" prop="deviceNo" show-overflow-tooltip width="150"></el-table-column>
                    <el-table-column label="制造厂家" prop="manufactor" show-overflow-tooltip></el-table-column>
                    <el-table-column label="规格型号" prop="specification" show-overflow-tooltip></el-table-column>
                    <el-table-column label="GPRS" prop="gprs" width="110px"></el-table-column>
                    <el-table-column label="每秒耗水量(立方米)" prop="dissipation" width="150"></el-table-column>
                    <el-table-column label="互感系数" prop="ratio"></el-table-column>
                    <el-table-column label="位置" prop="placePoint" width="110px" show-overflow-tooltip></el-table-column>
                    <el-table-column label="在线状态" prop="isOnline" :formatter="getLine"></el-table-column>
                    <el-table-column label="状态" prop="status" :formatter="getStatus"></el-table-column>
                    <el-table-column label="采集器编号" prop="collecterNo" show-overflow-tooltip></el-table-column>
                    <el-table-column label="采集器状态" prop="isOnlineCollecter" :formatter="getCollecterStatus"></el-table-column>
                    <el-table-column label="创建日期" prop="createTime" :width="dateWidth" :formatter="handleDate"></el-table-column>
                    <el-table-column label="创建人" prop="createUserName"></el-table-column>
                    <el-table-column label="操作" :width="operateWidth" align="center" fixed="right">
                    <template slot-scope="scope">
                        <rightButton :operationPrex="operationPrex" @clickView="handleView" @clickUpdate="handleUpdate" @clickDelate="handleDelete" :row="scope.row" :disUpdate="scope.row.status=='1'?true:false" :disDelete="scope.row.status=='1'?true:false" ></rightButton>
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
import {selectWater,deletesWater,setUse,setDis} from "@/views/device/api/water.js";
import {selectProjectInfo} from "@/views/api/equipmentApi.js";
import detailsDialog from "./details";
import moment from "moment";
export default {
  components: {
    detailsDialog
  },
  data() {
    return {
      operationPrex: "electric:device:water",
      listData: [],
      isDangerous: "",
      keyword: "",
      pageIndex: 1,
      pageSizes: [10, 20, 30],
      pageSize: 10,
      pageTotal: 0,
      sels: [],
      projectList: [],
      activeCode: 0,
      visible: false,
      detailsType: null,
      detailsId: null,
      isRepetition : false
    };
  },
  computed: {
    params() {
      let param = {
        key: this.keyword,
        pageNum: this.pageIndex,
        pageSize: this.pageSize
      };
      return param;
    }
  },
  mounted() {
    this.getListData();
    this.getProject();
  },
  methods: {
    //条件查询方法
    handleSearch() {
      this.pageIndex = 1;
      this.getListData();
    },
    //查询list列表
    getListData() {
      selectWater(this.params).then(res => {
        this.listData = res.data.list;
        this.pageTotal = res.data.total;
      });
    },
    getProject : function() {
      selectProjectInfo({}).then((res) => {
        this.projectList = res.data;
      });
    },
    //单页数据条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.getListData();
    },
    //页码跳转
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.getListData();
    },
    //查看方法
    handleView(row) {
      this.activeCode = 0;
      this.visible = true;
      this.detailsType = "view";
      this.detailsId = row.id;
    },
    //修改方法
    handleUpdate(row) {
      this.activeCode = 0;
      this.visible = true;
      this.detailsType = "update";
      this.detailsId = row.id;
    },
    //新增方法
    handleInsert() {
      this.activeCode = 0;
      this.visible = true;
      this.detailsType = "insert";
      this.detailsId = null;
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
      if (params.ids.length > 0) {
        this.$confirm("确认启用选中记录吗？", "提示", {
          type: "warning"
        }).then(() => {
          setUse(params).then(res => {
            if(res.code == 200) {
              this.$message({
                type : 'success',
                message : res.message
              });
              this.handleSearch();
            }else {
              this.$message({
                type : 'error',
                message : res.message
              });
            }
          });
        });
      }
    },
    //删除方法
    handleDelete(sels) {
      let params = { ids: sels.map(item => item.id) };
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning"
      }).then(() => {
        deletesWater(params).then(res => {
          this.$message({
            message: res.message,
            type: res.success ? "success" : "error"
          });
          this.handleSearch();
        });
      });
    },
    //删除时验证是否已选中数据
    listSelectionChange(sels) {
      this.sels = sels;
      /*for(let i = 0;i < sels.length;i++) {
        for(let j = 0;j < sels.length;j++) {
          if(sels[i].deviceNo == sels[j].deviceNo && sels[i].id != sels[j].id) {
            this.isRepetition = true;
            return;
          }else {
            this.isRepetition = false;
          }
        }
      }
      for(let i = 0;i < sels.length;i++) {
        for(let j = 0;j < this.listData.length;j++) {
          if(this.listData[j].deviceNo == sels[i].deviceNo && this.listData[j].status == 1) {
            this.isRepetition = true;
            return;
          }else {
            this.isRepetition = false;
          }
        }
      }*/
    },
    //关闭模态框
    closeDialog() {
      this.visible = false;
      this.pageIndex = 1;
      this.pageSize = 10;
      this.handleSearch();
    },
    getLine : function(row) {
      if(row.isOnline == 0) {
        return '离线';
      }else {
        return '在线';
      }
    },
    getStatus : function(row) {
      if(row.status == 0) {
        return '未启用';
      }else {
        return '已启用';
      }
    },
    getCollecterStatus : function(row) {
      if(row.isOnlineCollecter == 0) {
        return '离线';
      }else {
        return '在线';
      }
    },
    handleClose : function() {
      let params = { ids: this.sels.map(item => item.id) };
      let flag = false;
      if (params.ids.length > 0) {
        this.$confirm("确认停用选中记录吗？", "提示", {
          type: "warning"
        }).then(() => {
          setDis(params).then(res => {
            if(res.code == 200) {
              this.$message({
                type : 'success',
                message : res.message
              });
              this.handleSearch();
            }else {
              this.$message({
                type : 'error',
                message : res.message
              });
            }
          });
        });
      }
    }
  }
};
</script>

<style>
</style>

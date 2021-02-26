<!--
 * @Author: xss
 * @CreateTime: 2018-09-08 22:30:40
 * @Desc: 塔吊一览
-->
<template>
  <div class="app-container list-container">
    <div class="container-box condition-box">
      <div class="conditionBar">
        <el-form :inline="true" class="condition-form">
          <el-form-item>
            <el-select v-model="keyword" filterable clearable placeholder="工程名称" size="mini">
              <el-option
                v-for="item in projectList"
                :label="item.name"
                :value="item.id"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              class="searchBtn"
              type="primary"
              size="mini"
              icon="el-icon-search"
              @click="handleSearch"
            >查询</el-button>
          </el-form-item>
          <topButton
            :operationPrex="operationPrex"
            @clickInsert="handleInsert"
            @clickUpdate="handleUpdate"
            @clickDelate="handleDelete"
            check="status=1"
            :sels="sels"
          ></topButton>
          <el-form-item>
            <el-button
              v-if="validateOperation('open')"
              class="updateBtn"
              type="primary"
              size="mini"
              icon="el-icon-dagou"
              :disabled="checkDisabled('status=1')"
              @click="handleOpen"
            >启用</el-button>
            <el-button
              v-if="validateOperation('close')"
              class="updateBtn"
              type="danger"
              size="mini"
              icon="el-icon-xx"
              :disabled="checkDisabled('status=0')"
              @click="handleClose"
            >停用</el-button>
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
          <el-table-column label="工程名称" prop="projectName" min-width="150" show-overflow-tooltip></el-table-column>
          <el-table-column label="黑匣子编号" prop="deviceNo" min-width="150" show-overflow-tooltip></el-table-column>
          <el-table-column label="设备名称" prop="name" min-width="150" show-overflow-tooltip></el-table-column>
          <el-table-column label="产权单位" prop="owner" min-width="150" show-overflow-tooltip></el-table-column>
          <el-table-column label="制造厂家" prop="manufactor" min-width="150" show-overflow-tooltip></el-table-column>
          <el-table-column label="累计循环工作时长" prop="timeSum" width="130" :formatter="timeSumFormat"></el-table-column>
          <el-table-column label="在线状态" prop="statusName"></el-table-column>
          <el-table-column label="状态" prop="status" :formatter="handleStatus"></el-table-column>
          <el-table-column label="视频" prop>
            <template slot-scope="scope">
              <span
                style="text-decoration: underline;color:blue;cursor: pointer;"
                @click="handleHerf(scope.row)"
              >视频</span>
            </template>
          </el-table-column>
          <el-table-column
            label="创建日期"
            prop="createTime"
            :width="dateWidth"
            :formatter="handleDate"
          ></el-table-column>
          <el-table-column label="创建人" prop="createUserName"></el-table-column>
          <el-table-column label="操作" width="360" align="center" fixed="right">
            <template slot-scope="scope">
              <rightButton
                :operationPrex="operationPrex"
                @clickView="handleView"
                @clickUpdate="handleUpdate"
                @clickDelate="handleDelete"
                :row="scope.row"
                :disUpdate="scope.row.status=='1'?true:false"
                :disDelete="scope.row.status=='1'?true:false"
              >
                <el-button
                  class="searchBtn"
                  type="primary"
                  plain
                  size="small"
                  icon="el-icon-download"
                  @click="handleDown(scope.row)"
                >导出</el-button>
              </rightButton>
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
    <detailsDialog
      v-if="visible"
      :visible.sync="visible"
      @close="closeDialog"
      :activeCode="activeCode"
      :routeType="detailsType"
      :detailsId="detailsId"
    ></detailsDialog>
  </div>
</template>

<script>
import {
  getListApi,
  deleteInfoApi,
  updateStatusApi,
  getProjectListApi,
  getInfoApi
} from "@/views/device/api/crane.js";
import detailsDialog from "./details";
import { createURL } from "@/views/crane/api/craneReport.js";

export default {
  components: {
    detailsDialog
  },
  data() {
    return {
      operationPrex: "crane:device:crane",
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
      detailsId: null
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
    },
    delParams() {
      let arr = [];
      this.sels.forEach(item => {
        arr.push(item.id);
      });
      if (arr.length > 0) {
        return {
          ids: arr.join(",")
        };
      }
    },
    params1() {
      let param = {
        id: this.id,
        pageNum: this.pageIndex1,
        pageSize: this.pageSize1
      };
      return param;
    }
  },
  mounted() {
    this.getListData();
    this.getOtherInfo();
  },
  methods: {
    handleDown(row) {
      let params = {
        deviceNo: row.deviceNo
      };
      window.location.href = createURL("/word/download", params);
    },
    timeSumFormat(row, column, cellValue, index) {
      if (cellValue) {
        return `${this.$moment
          .duration(cellValue)
          .days()}天${this.$moment
          .duration(cellValue)
          .hours()}小时${this.$moment.duration(cellValue).minutes()}分钟`;
      } else {
        return "0天0小时0分钟";
      }
    },
    //条件查询方法
    handleSearch() {
      //this.pageIndex = 1;
      this.getListData();
    },
    //加载下拉框数据
    getOtherInfo() {
      getProjectListApi({}).then(res => {
        this.projectList = res.data;
      });
    },
    //查询list列表
    getListData() {
      getListApi(this.params).then(res => {
        this.listData = res.data.list;
        this.pageTotal = res.data.total;
      });
    },
    //单页数据条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.handleSearch();
    },
    //页码跳转
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.handleSearch();
    },
    //点击视频跳转
    handleHerf(row) {
      let param = { id: row.id };
      getInfoApi(param).then(res => {
        this.cameraInfo = res.data.videos;
        if (this.cameraInfo.length > 0) {
          sessionStorage.setItem("ip", this.cameraInfo[0].ipAddress);
          sessionStorage.setItem("port", this.cameraInfo[0].port);
          sessionStorage.setItem("loginName", this.cameraInfo[0].loginName);
          sessionStorage.setItem("password", this.cameraInfo[0].password);
          sessionStorage.setItem("projectName", row.projectName);

          sessionStorage.setItem("projectId", row.projectId);
          sessionStorage.setItem(
            "platformType",
            this.cameraInfo[0].platformType
          );
          sessionStorage.setItem("area", this.cameraInfo[0].area);
          sessionStorage.setItem("appkey", this.cameraInfo[0].appkey);
          sessionStorage.setItem("secret", this.cameraInfo[0].secret);
          sessionStorage.setItem("tunnel", this.cameraInfo[0].tunnel);
          sessionStorage.setItem("httpAddress", this.cameraInfo[0].httpAddress);
          this.$router.push("/crane/video");
        } else {
          this.$message({
            type: "warning",
            message: "暂无视频！"
          });
        }
      });
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
        return this.$moment(cellValue).format("YYYY-MM-DD");
      } else {
        return "";
      }
    },
    //在线状态转换
    handleSIsOnline(row) {
      return row.isOnline == 1 ? "在线" : "离线";
    },
    //状态转换
    handleStatus(row) {
      return row.status == 1 ? "已启用" : "未启用";
    },
    //启用
    handleOpen() {
      let params = { ids: this.sels.map(item => item.id) };
      let flag = false;
      if (params.ids.length > 0) {
        this.$confirm("确认启用选中记录吗？", "提示", {
          type: "warning"
        }).then(() => {
          this.sels.forEach(element => {
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
      } else {
        this.$message({
          message: "请选择要启用的记录！",
          type: "warning"
        });
      }
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
          message: "请选择要启用的记录！",
          type: "warning"
        });
      }
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
    //删除时验证是否已选中数据
    listSelectionChange(sels) {
      this.sels = sels;
    },
    //关闭模态框
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

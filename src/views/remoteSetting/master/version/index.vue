<!--
 * @Author: xss
 * @CreateTime: 2018-09-29 22:30:40
 * @Desc: 版本升级一览
-->
<template>
  <div class="app-container list-container">
    <div class="container-box condition-box">
      <div class="conditionBar">
        <el-form :inline="true" class="condition-form">
          <el-form-item>
            <el-input
              size="mini"
              placeholder="版本号"
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
              @click="handleSearch"
            >查询</el-button>
          </el-form-item>
          <topButton
            :operationPrex="operationPrex"
            @clickInsert="handleInsert"
            @clickDelate="handleDelete"
            check="callTimes=1"
            :sels="sels"
          ></topButton>
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
          <el-table-column label="升级包" prop="name" show-overflow-tooltip></el-table-column>
          <el-table-column label="版本号" prop="version" show-overflow-tooltip></el-table-column>
          <el-table-column label="类型" prop="typeName" show-overflow-tooltip></el-table-column>
          <el-table-column label="备注" prop="comments" show-overflow-tooltip></el-table-column>
          <el-table-column label="创建时间" width="135px" prop="createTime" :formatter="handleDate"></el-table-column>
          <el-table-column label="创建人" prop="createUserName"></el-table-column>
          <el-table-column label="操作" width="200px" align="center" fixed="right">
            <template slot-scope="scope">
              <settingButton
                :operationPrex="operationPrex"
                @handleDelete="handleDelete"
                @handleUpgrade="handleUpgrade"
                :row="scope.row"
              ></settingButton>
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
      :routeType="detailsType"
      :detailsId="detailsId"
    ></detailsDialog>

    <upgradeDevice
      v-if="upgradeDevice"
      :visible.sync="upgradeDevice"
      @close="closeDialog"
      :upgradeId="upgradeId"
      :upgradeType="upgradeType"
    ></upgradeDevice>
  </div>
</template>
<script>
import {
  getListApi,
  deleteInfoApi
} from "@/views/remoteSetting/api/version.js";
import settingButton from "./settingButton";
import upgradeDevice from "./upgradeDevice";
import detailsDialog from "./details";
import moment from "moment";

export default {
  components: {
    detailsDialog,
    settingButton,
    settingButton,
    upgradeDevice
  },
  data() {
    return {
      operationPrex: "setting:index",
      listData: [],
      isDangerous: "",
      keyword: "",
      pageIndex: 1,
      pageSizes: [10, 20, 30],
      pageSize: 10,
      pageTotal: 0,
      sels: [],
      visible: false,
      upgradeDevice: false,
      detailsType: null,
      detailsId: null,
      upgradeId: null,
      upgradeType: ""
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
    //新增
    handleInsert() {
      this.visible = true;
      this.detailsType = "insert";
      this.detailsId = null;
    },
    //点击升级
    handleUpgrade(sels) {
      this.upgradeId = sels.id;
      this.upgradeType = sels.type;
      this.upgradeDevice = true;
    },
    //删除方法
    handleDelete(sels) {
      let ids = [];
      if (typeof sels.length === "undefined") {
        ids.push(sels.id);
      } else {
        for (let i = 0; i < sels.length; i++) {
          ids.push(sels[i].id);
        }
      }
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning"
      }).then(() => {
        deleteInfoApi({ ids: ids }).then(res => {
          this.$message({
            message: res.message,
            type: res.success ? "success" : "error"
          });
          this.handleSearch();
        });
      });
    },
    //监听table中selectbox选中
    listSelectionChange(sels) {
      this.sels = sels;
    },
    //日期格式变换
    handleDate(row, column, cellValue, index) {
      if (cellValue) {
        return moment(cellValue).format("YYYY-MM-DD HH:mm:ss");
      } else {
        return "";
      }
    },
    //关闭模态框
    closeDialog() {
      this.visible = false;
      this.upgradeDevice = false;
      this.handleSearch();
    }
  }
};
</script>


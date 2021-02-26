<template>
    <div class="app-container list-container">
        <div class="container-box condition-box">
            <div class="conditionBar">
                <el-form :inline="true" class="condition-form">
                    <el-form-item>
                        <el-input size="mini" placeholder="规格型号" v-model="keyword" clearable class="toolbar-search"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button class="searchBtn" type="primary" size="mini" icon="el-icon-search" @click="handleSearch">查询</el-button>
                    </el-form-item>
                    <topButton :operationPrex="operationPrex" @clickInsert="handleInsert" @clickUpdate="handleUpdate" @clickDelate="handleDelete" :sels="sels"></topButton>
                </el-form>
            </div>
        </div>

        <div class="container-box list-box">
            <div class="table-box">
                <el-table size="small" :data="listData" style="width: 100%" height="100%"  highlight-current-row @selection-change="listSelectionChange"  header-row-class-name="xyTableHeader">
                    <el-table-column type="selection" :width="selectionWidth"></el-table-column>
                    <el-table-column type="index" :width="indexWidth"></el-table-column>
                    <el-table-column label="规格型号" :show-overflow-tooltip="true" prop="specification"></el-table-column>
                    <el-table-column label="制造厂家" :show-overflow-tooltip="true" prop="manufactor"></el-table-column>
                    <el-table-column label="司机" :show-overflow-tooltip="true" prop="driver"></el-table-column>
                    <el-table-column label="时间" :show-overflow-tooltip="true" prop="deviceTime"></el-table-column>
                    <el-table-column label="状态" :show-overflow-tooltip="true" prop="status"></el-table-column>
                    <el-table-column label="重量(t)" :show-overflow-tooltip="true" prop="weight"></el-table-column>
                    <el-table-column label="力矩(N·m)" :show-overflow-tooltip="true" prop="moment"></el-table-column>
                    <el-table-column label="高度(m)" :show-overflow-tooltip="true" prop="height"></el-table-column>
                    <el-table-column label="幅度(m)" :show-overflow-tooltip="true" prop="range"></el-table-column>
                    <el-table-column label="力矩百分比(%)" :show-overflow-tooltip="true" prop="momentPercentage"></el-table-column>
                    <el-table-column label="回转角度(°)" :show-overflow-tooltip="true" prop="rotaryAngle"></el-table-column>
                    <el-table-column label="倾斜角度(°)" :show-overflow-tooltip="true" prop="tiltAngle"></el-table-column>
                    <el-table-column label="风速(m/s)" :show-overflow-tooltip="true" prop="windSpeed"></el-table-column>
                    <el-table-column label="操作" :width="operateWidth" align="center" fixed="right">
                        <template slot-scope="scope">
                            <rightButton :operationPrex="operationPrex"  @clickView="handleView" @clickUpdate="handleUpdate" @clickDelate="handleDelete" :row="scope.row"></rightButton>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="pagination-box">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageIndex" :page-sizes="pageSizes" :page-size="pageSize" :total="pageTotal" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
            </div>
        </div>
        <detailsDialog v-if="visible" :visible.sync="visible" @close="closeDialog" :routeType="detailsType" :detailsId="detailsId"></detailsDialog>
    </div>
</template>
<script>
import {
  getListApi,
  deleteInfoApi
} from "@/views/information/api/craneDataModel.js";
import detailsDialog from "./details";
export default {
  components: {
    detailsDialog
  },
  data() {
    return {
      operationPrex: "crane:infoMain:craneDataModel",
      listData: [],
      isDangerous: "",
      keyword: "",
      pageIndex: 1,
      pageSizes: [10, 20, 30],
      pageSize: 10,
      pageTotal: 0,
      sels: [],
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
    }
  },
  mounted() {
    this.getListData();
  },
  methods: {
    //查询
    handleSearch() {
      this.pageIndex = 1;
      this.getListData();
    },
    //获取列表
    getListData() {
      getListApi(this.params).then(res => {
        this.listData = res.data.list;
        this.pageTotal = res.data.total;
      });
    },
    //翻页
    handleSizeChange(val) {
      this.pageSize = val;
      this.handleSearch();
    },
    //翻页
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
    //查看
    handleView(row) {
      this.visible = true;
      this.detailsType = "view";
      this.detailsId = row.id;
    },
    //编辑
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
    //选中
    listSelectionChange(sels) {
      this.sels = sels;
    },
    //关闭弹窗
    closeDialog() {
      this.visible = false;
      this.handleSearch();
    }
  }
};
</script>


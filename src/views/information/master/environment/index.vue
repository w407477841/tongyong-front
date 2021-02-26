<!--
 * @Author: xss
 * @CreateTime: 2018-09-08 22:30:40
 * @Desc: 扬尘指标设置一览
-->
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
                    <topButton :operationPrex="operationPrex" @clickInsert="handleInsert" @clickUpdate="handleUpdate" @clickDelate="handleDelete" check="callTimes=1" :sels="sels"></topButton>
                </el-form>
            </div>
        </div>

        <div class="container-box list-box">
            <div class="table-box">
                <el-table size="small" :data="listData" style="width: 100%" height="100%"  highlight-current-row @selection-change="listSelectionChange"  header-row-class-name="xyTableHeader">
                    <el-table-column type="selection" :width="selectionWidth"></el-table-column>
                    <el-table-column type="index" :width="indexWidth"></el-table-column>
                    <el-table-column label="规格型号" prop="specification" show-overflow-tooltip></el-table-column>
                    <el-table-column label="PM10(μg/m³)" prop="pm10" show-overflow-tooltip></el-table-column>
                    <el-table-column label="PM2.5(μg/m³)" prop="pm25" show-overflow-tooltip></el-table-column>
                    <el-table-column label="噪音(分贝)" prop="noise" show-overflow-tooltip></el-table-column>
                    <el-table-column label="风速(m/s)" prop="windSpeed" show-overflow-tooltip></el-table-column>

                    <el-table-column label="最小温度(℃)" prop="temperatureMin" show-overflow-tooltip></el-table-column>
                    <el-table-column label="最大温度(℃)" prop="temperatureMax" show-overflow-tooltip></el-table-column>
                    <el-table-column label="最小湿度(%rh)" prop="humidityMin" show-overflow-tooltip></el-table-column>
                    <el-table-column label="最大湿度(%rh)" prop="humidityMax" show-overflow-tooltip></el-table-column>
                    <el-table-column label="TSP(μg/m³)"  prop="tsp" show-overflow-tooltip></el-table-column>
                    <el-table-column label="风力" prop="windForce" show-overflow-tooltip></el-table-column>
                    <el-table-column label="大气压(pa)"  prop="atmospheric" show-overflow-tooltip></el-table-column>
                    <el-table-column label="操作" :width="operateWidth" align="center" fixed="right">
                        <template slot-scope="scope">
                            <rightButton :operationPrex="operationPrex"  @clickView="handleView" @clickUpdate="handleUpdate" @clickDelate="handleDelete" :row="scope.row" :disDelete="scope.row.callTimes>'0'?true:false"></rightButton>
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
} from "@/views/information/api/environment.js";
import detailsDialog from "./details";
export default {
  components: {
    detailsDialog
  },
  data() {
    return {
      operationPrex: "dust:infoMain:targetSet",
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
    //页面显示数据改变
    handleSizeChange(val) {
      this.pageSize = val;
      this.handleSearch();
    },
    //页码跳转
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.handleSearch();
    },
    //删除时验证选中
    listSelectionChange(sels) {
      this.sels = sels;
    },
    //新增方法
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
    //关闭模态框
    closeDialog() {
      this.visible = false;
      this.handleSearch();
    }
  }
};
</script>

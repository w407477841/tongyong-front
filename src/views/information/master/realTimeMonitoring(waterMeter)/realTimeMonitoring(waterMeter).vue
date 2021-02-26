<template>
  <div class="app-container list-container">
    <div class="container-box condition-box">
      <div class="conditionBar">
        <el-form :inline="true" class="condition-form">
          <el-form-item>
            <el-select v-model="keyword" placeholder="工程名称" :clearable="true" :filterable="true" size="mini">
                <el-option v-for="item in projectList" :label="item.label" :value="item.value" :key="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="status" placeholder="状态" :clearable="true" :filterable="true" size="mini">
              <el-option v-for="item in statusList" :label="item.label" :value="item.value" :key="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button class="searchBtn" type="primary" size="mini" icon="el-icon-search" @click="handleSearch">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <div class="container-box list-box">
      <div class="table-box">
        <el-table size="small" :data="listData" style="width: 100%" height="100%" highlight-current-row @selection-change="listSelectionChange" header-row-class-name="xyTableHeader">
          <el-table-column type="selection" :width="selectionWidth"></el-table-column>
          <el-table-column type="index" :width="indexWidth"></el-table-column>
          <el-table-column label="黑匣子编号" prop="deviceNo"></el-table-column>
          <el-table-column label="制造厂家" prop="manufactor"></el-table-column>
          <el-table-column label="状态" prop="status" :formatter="getStatus"></el-table-column>
          <el-table-column label="工程名称" :show-overflow-tooltip="true" prop="projectName"></el-table-column>
          <el-table-column label="操作" align="center" width="350" fixed="right">
            <template slot-scope="scope">
              <el-button type="primary" plain size="small" @click="goToMonitorState(scope.row)">监控状态</el-button>
              <el-button type="primary" plain size="small" @click="goToRunData(scope.row)">运行数据</el-button>
              <el-button type="primary" plain size="small" @click="goToWarningMessage(scope.row)">报警信息</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination-box">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageIndex" :page-sizes="pageSizes" :page-size="pageSize" :total="pageTotal" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>
    </div>

  </div>
</template>

<script>
import {selectWaterData,selectProjectInfo} from '@/views/information/api/water.js';

export default {
  data() {
    return {
      listData: [],
      keyword: '',
      status : '',
      pageIndex: 1,
      pageSizes: [10, 20, 30],
      pageSize: 10,
      pageTotal: 0,
      sels: [],
      monitorStatusPath: this.$route.path + '/monitorStatus',
      runDataPath: this.$route.path + '/runData',
      warningMessagePath: this.$route.path + '/warningMessage',
      statusList : [
        {label : "离线",value : 0},
        {label : "在线",value : 1}
      ],
      projectList : []
    };
  },
  computed: {
    params() {
      let param = {
        key: this.keyword,
        body: {status : this.status},
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
    //条件查询
    handleSearch() {
      this.pageIndex = 1;
      this.getListData();
    },
    //获取列表
    getListData() {
      selectWaterData(this.params).then(res => {
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
    goToMonitorState : function(row) {
      this.$router.push({ path: this.monitorStatusPath, query: { row : row } });
    },
    //点击运行数据按钮跳转到运行数据页面
    goToRunData : function(row) {
      this.$router.push({ path: this.runDataPath, query: { row : row } });
    },
    //点击报警信息按钮跳转到报警信息页面
    goToWarningMessage : function(row) {
      this.$router.push({ path: this.warningMessagePath, query: { row : row } });
    },
    //格式化状态
    getStatus : function(row) {
      if(row.status == 0) {
        return '离线';
      }else if(row.status == 1) {
        return '在线';
      }
    },
    //获取项目
    getProject : function() {
      let para = {};
      selectProjectInfo(para).then((res) => {
        this.projectList = res.data;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>

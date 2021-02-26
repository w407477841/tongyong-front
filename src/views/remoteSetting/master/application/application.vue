<template>

  <div class="app-container list-container">
    <div class="container-box condition-box">
      <div class="conditionBar">
        <el-form :inline="true" class="condition-form">
          <el-form-item>
            <el-input v-model="keyword" :clearable="true" size="mini" placeholder="平台名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="searchBtn" type="primary" size="mini" icon="el-icon-search" @click="handleSearch">查询</el-button>
          </el-form-item>
          <topButton @clickInsert="handleInsert" @clickDelate="handleDelete" :sels="sels" :operationPrex="operationPrex" check="uuid=0"></topButton>
        </el-form>
      </div>
    </div>

    <div class="container-box list-box">
      <div class="table-box">
        <el-table size="small" :data="listData" style="width: 100%" height="100%" highlight-current-row @selection-change="listSelectionChange" header-row-class-name="xyTableHeader">
          <el-table-column type="selection" :width="selectionWidth"></el-table-column>
          <el-table-column type="index" :width="indexWidth"></el-table-column>
          <el-table-column label="平台名称" :show-overflow-tooltip="true" prop="name"></el-table-column>
          <el-table-column label="Topic" :show-overflow-tooltip="true" prop="topic"></el-table-column>
          <el-table-column label="操作" :width="operateWidth" align="center" fixed="right">
            <template slot-scope="scope">
              <rightButton @clickView="handleView" @clickUpdate="handleUpdate" @clickDelate="handleDelete" :row="scope.row" :operationPrex="operationPrex" :disDelete="(scope.row.uuid!=null&&scope.row.uuid!=''&&scope.row.uuid!=undefined)||(scope.row.status=='1')?true:false" :disUpdate="scope.row.status=='1'?true:false"></rightButton>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination-box">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageIndex" :page-sizes="pageSizes" :page-size="pageSize" :total="pageTotal" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>
    </div>

    <el-dialog :title="this.title" :visible.sync="applicationDetailVisible" :close-on-click-modal="false" width="50%" v-if="applicationDetailVisible">
      <project-detail :edit="this.edit" @setShow="setShow" :openType="this.openType" :id="this.id"></project-detail>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment';
import ProjectDetail from './applicationDetail';
import {selectAppList,deleteApp} from '../../api/application.js';

export default {
  data() {
    return {
      listData: [],
      keyword: '',
      pageIndex: 1,
      pageSizes: [10, 20, 30],
      pageSize: 10,
      pageTotal: 0,
      sels: [],
      edit : false,
      id : '',
      applicationDetailVisible : false,
      title : '',
      openType : '',
      operationPrex : 'remote:application',
      projectScope : []
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
      this.pageIndex = 1;
      this.getListData();
    },
    //获取列表
    getListData() {
      selectAppList(this.params).then(res => {
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
    //勾选复选框给sels赋值
    listSelectionChange(sels) {
      this.sels = sels;
    },
    //删除
    handleDelete(sels) {
      this.$confirm("确认删除选中记录吗？","提示", {type: "warning"}).then(() => {
        let ids = sels.map(item => item.id);
        let para = {
          ids : ids
        };
        deleteApp(para).then((res) => {
          if(res.code == 200) {
            this.$message({
              type : 'success',
              message : res.message
            });
            this.getListData();
          }
        });
      });
    },
    //点击查看按钮弹出详情页
    handleView(row) {
      this.title = "查看";
      this.openType = "view";
      this.edit = true;
      this.applicationDetailVisible = true;
      this.id = row.id;
    },
    //点击编辑按钮弹出详情页
    handleUpdate(row) {
      this.title = "编辑";
      this.openType = "update";
      this.edit = false;
      this.applicationDetailVisible = true;
      this.id = row.id;
    },
    //点击新增按钮弹出详情页
    handleInsert() {
      this.title = "新增";
      this.openType = "insert";
      this.edit = false;
      this.applicationDetailVisible = true;
    },
    setShow : function(data) {
      if(data.sign == '关闭应用管理') {
        this.applicationDetailVisible = false;
        this.getListData();
      }
    }
  },
  components : {
    ProjectDetail
  }
};
</script>

<style lang="scss" scoped>
</style>

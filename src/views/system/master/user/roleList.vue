<template>
  <section>
    <div class="container-box condition-box">
      <div class="conditionBar">
        <el-form :inline="true" class="condition-form">
          <el-form-item>
            <el-input size="mini" v-model="keyword" placeholder="角色编号/角色名称">
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="searchBtn" type="primary" size="mini" icon="el-icon-search" @click="handleSearch">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  <div class="list-container">
    <div class="container-box">
      <div class="table-box">
        <el-table size="small" :data="listData" style="width: 100%" highlight-current-row @selection-change="listSelectionChange" header-row-class-name="xyTableHeader">
          <el-table-column type="selection" :width="selectionWidth"></el-table-column>
          <el-table-column type="index" :width="indexWidth"></el-table-column>
          <el-table-column label="角色编号" prop="code" width="200"></el-table-column>
          <el-table-column label="角色名称" prop="name" width="200"></el-table-column>
          <el-table-column label="角色描述" :show-overflow-tooltip="true" prop="instroction" width="300"></el-table-column>
        </el-table>
      </div>
      <div class="pagination-box">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageIndex" :page-sizes="pageSizes" :page-size="pageSize" :total="pageTotal" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>
      <div class="details-footer" style="text-align : right">
        <el-button size="small" type="primary" @click="handleSubmit">确 定</el-button>
      </div>
    </div>
  </div>
</section>
</template>

<script>
import {getRole} from '@/views/system/api/systemApi.js';

export default {
  data() {
    return {
      listData: [],
      pageIndex: 1,
      pageSizes: [10, 20, 30],
      pageSize: 10,
      pageTotal: 0,
      sels: [],
      keyword : ''
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
      getRole(this.params).then(res => {
        this.listData = res.data.list;
        this.pageTotal = Number(res.data.total);
        if (this.pageTotal == 0 && this.pageIndex > 1) {
          this.pageIndex--;
          this.getListData();
        }
      });
    },
    //改名页面显示条数
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
    //保存
    handleSubmit : function() {
      if(this.sels.length < 1) {
        this.$message({
          type : "error",
          message : "请选择一条数据"
        });
        return;
      }
      this.$emit("setShow",{data : this.sels,sign : "关闭设置角色"});
    },
    //取消
    handleCancel : function() {
      this.$emit("setShow",{sign : "关闭设置角色"});
    }
  },
  components : {
    
  }
};
</script>

<style lang="scss" scoped>
</style>

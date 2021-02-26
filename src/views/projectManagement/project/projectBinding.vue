<template>

  <div class="list-container">
    <div class="container-box condition-box">
      <div class="conditionBar">
        <el-form :inline="true" class="condition-form">
          <el-form-item>
            <el-input v-model="keyword" size="mini" placeholder="工程名称">
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="searchBtn" type="primary" size="mini" icon="el-icon-search" @click="handleSearch">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <div class="container-box">
      <div>
        <el-table size="small" :data="listData" style="width: 100%" highlight-current-row @selection-change="listSelectionChange" header-row-class-name="xyTableHeader">
          <el-table-column type="selection" :width="selectionWidth"></el-table-column>
          <el-table-column type="index" :width="indexWidth"></el-table-column>
          <el-table-column label="工程名称" :show-overflow-tooltip="true" prop="name"></el-table-column>
          <el-table-column label="项目区域" prop="districtName"></el-table-column>
          <el-table-column label="施工单位" prop="builderName"></el-table-column>
        </el-table>
      </div>

      <div class="pagination-box">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageIndex" :page-sizes="pageSizes" :page-size="pageSize" :total="pageTotal" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>
      <div class="details-footer" style="text-align : right">
        <el-button size="small" type="primary" @click="handleSubmit">保 存</el-button>
        <el-button size="small" @click="handleCancel">取 消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import {bindingProject,getSmartProject} from '@/views/api/equipmentApi.js';

export default {
  data() {
    return {
      listData: [],
      pageIndex: 1,
      pageSizes: [10, 20, 30],
      pageSize: 10,
      pageTotal: 0,
      sels: [],
      edit : '',
      keyword : ''
    };
  },
  computed: {
    params() {
      let param = {
        key : this.keyword,
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
      getSmartProject(this.params).then(res => {
        if(res.data != '') {
          this.listData = JSON.parse(res.data).data.list;
          this.pageTotal = JSON.parse(res.data).data.total;
        }else {
          this.listData = [];
          this.pageTotal = 0;
        } 
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
    //保存
    handleSubmit : function() {
      if(this.sels.length > 1) {
        this.$message({
          type : "error",
          message : "只能选择一条数据"
        });
        return;
      }
      if(this.sels.length < 1) {
        this.$message({
          type : "error",
          message : "请选择一条数据"
        });
        return;
      }
      let para = {
        body : {
          uuid : this.sels[0].uuid,
          projectId : this.projectId,
          smartProjectId : this.sels[0].id
        }
      };
      this.$confirm('确认保存吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        bindingProject(para).then((res) => {
          if(res.code == 200) {
            this.$message({
              type : 'success',
              message : res.message
            });
            this.$emit("setShow",{sign : "关闭绑定"});
          }
        });
      });
    },
    //取消
    handleCancel : function() {
      this.$emit("setShow",{sign : "关闭绑定"});
    }
  },
  props : ['projectId']
};
</script>

<style lang="scss" scoped>
</style>

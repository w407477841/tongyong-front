<template>

  <div class="list-container">
    <div class="container-box condition-box">
      <div class="conditionBar">
        <el-form :inline="true" class="condition-form">
          <el-form-item>
            <el-input size="mini" v-model="keyword" placeholder="姓名">
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="searchBtn" type="primary" size="mini" icon="el-icon-search" @click="handleSearch">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <div class="container-box">
      <div class="table-box">
        <el-table size="small" :data="listData" style="width: 100%" highlight-current-row @selection-change="listSelectionChange" header-row-class-name="xyTableHeader">
          <el-table-column type="selection" :width="selectionWidth"></el-table-column>
          <el-table-column type="index" :width="indexWidth"></el-table-column>
          <el-table-column label="姓名" prop="name" width="180"></el-table-column>
          <el-table-column label="登录名" prop="code" width="150"></el-table-column>
          <el-table-column label="手机号" prop="phone" width="150"></el-table-column>
        </el-table>
      </div>
      <div class="pagination-box">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageIndex" :page-sizes="pageSizes" :page-size="pageSize" :total="pageTotal" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>
      <div class="details-footer" style="text-align : right">
        <el-button size="small" @click="cancel">取 消</el-button>
        <el-button size="small" type="primary" @click="handleSubmit">确 定</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import {selectUserNotInOrg,insertOrgUser} from '@/views/system/api/systemApi.js';

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
      openType : '',
      userDetailVisible : false,
      roleVisible : false,
      id : '',
      userRoles : [],
      roleIds : []
    };
  },
  computed: {
    params() {
      let param = {
        key: this.keyword,
        pageNum: this.pageIndex,
        pageSize: this.pageSize,
        body : {
          orgId : this.orgId
        }
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
      selectUserNotInOrg(this.params).then(res => {
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
    handleSubmit : function() {
      if(this.sels.length == 0) {
        this.$message({
          type : 'error',
          message : '请选择人员'
        });
        return;
      }
      this.$confirm('确认保存吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
        let orgUser = [];
        for(let i = 0;i < this.sels.length;i++) {
          this.$set(orgUser,i,{
            orgId : this.orgId,
            groupId : this.groupId,
            userId : this.sels[i].id
          });
        }
        let para = {
          body : {
            orgUsers : orgUser
          }
        };
        insertOrgUser(para).then((res) => {
          if(res.code == 200) {
            this.$message({
              type : 'success',
              message : res.message
            });
            this.getListData();
            this.$emit("setShow",{data : this.sels,sign : "关闭用户列表"});
          }else {
            this.$message({
              type : 'error',
              message : res.message
            });
          }
        });
      });
    },
    cancel : function() {
      this.$confirm("新增内容将不被保存，是否确认取消？","提示",{
        type : 'warning'
      }).then(() => {
        this.$emit("setShow",{data : this.sels,sign : "关闭用户列表"});
      });
    }
  },
  props : ['orgId','groupId']
};
</script>

<style lang="scss" scoped>
</style>

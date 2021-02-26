<template>
  <section>
    <div class="app-container list-container">
        <div class="container-box list-box">
            <el-row style="margin-top:8px;height:100%">
                <el-col :span="12" style="padding-bottom: 10px;    position: relative;height:100%; ">
                    <el-tree size="mini" class="sysTree" :data="orgTreeData" highlight-current v-loading="treeLoading" node-key="id" :props="props" default-expand-all @node-click="clickTreeNode" :expand-on-click-node="false" style="overflow-y:scroll;max-height:100%;" ref="tree">
                      <span class="custom-tree-node" slot-scope="{ node, data }">
                        <span>{{ node.label }}</span>
                        <span>
                          <el-button type="text" size="mini" @click="handleInsert(data)">添加下级</el-button>
                          <el-button type="text" size="mini" @click="handleDelete(node,data)">删除</el-button>
                        </span>
                      </span>
                    </el-tree>
                </el-col>
                <el-col :span="12" style="padding-bottom: 10px;    position: relative;height:100%; ">
                    <div class="app-container list-container">
                        <div class="container-box condition-box">
                            <div class="conditionBar">
                                <el-form :inline="true" class="condition-form">
                                    <el-form-item>
                                        <el-input size="mini" placeholder="姓名" v-model="keyword" clearable class="toolbar-search"></el-input>
                                    </el-form-item>
                                    <el-form-item>
                                        <el-button type="primary" size="mini" icon="el-icon-search" @click="handleSearch">查询</el-button>
                                    </el-form-item>
                                    <el-form-item>
                                        <el-button type="primary" size="mini" icon="el-icon-plus" @click="addUser">新增人员</el-button>
                                    </el-form-item>
                                    <topButton :hasInsert="false" @clickDelate="batchRemove" :sels="sels" :operationPrex="operationPrex"></topButton>
                                </el-form>
                            </div>
                        </div>
                        <!-- 数据列表 -->

                        <div class="container-box list-box">
                            <div class="table-box">
                                <el-table :data="listData" highlight-current-row @selection-change="listSelectionChange" height="100%" style="width:100%;" size="small">
                                    <el-table-column type="selection" width="55"></el-table-column>
                                    <el-table-column type="index" width="60"></el-table-column>
                                    <el-table-column prop="name" label="姓名" :show-overflow-tooltip="true" mini-width="120"></el-table-column>
                                    <el-table-column prop="code" label="登录名" :show-overflow-tooltip="true" mini-width="120"></el-table-column>
                                    <el-table-column prop="phone" label="手机号" :show-overflow-tooltip="true" mini-width="100"></el-table-column>
                                    <el-table-column label="操作" width="100" align="center">
                                        <template slot-scope="scope">
                                            <el-button @click="handleDel(scope.$index, scope.row)" type="danger" size="small" plain icon="el-icon-delete">删除</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                                <!--工具条-->
                            </div>
                            <div class="pagination-box">
                                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageIndex" :page-sizes="pageSizes" :page-size="pageSize" :total="pageTotal" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
                            </div>
                        </div>

                    </div>
                </el-col>
            </el-row>
        </div>
    </div>

    <el-dialog title="新增" :visible.sync="organizationDetailVisible" :close-on-click-modal="false" width="50%" v-if="organizationDetailVisible">
      <organization-detail @setShow="setShow" :groupId="this.groupId" :level="this.level" :id="this.id"></organization-detail>
    </el-dialog>

    <el-dialog title="用户列表" :visible.sync="userListVisible" :close-on-click-modal="false" width="50%" v-if="userListVisible">
      <user-list @setShow="setShow" :orgId="this.orgId" :groupId="this.groupId"></user-list>
    </el-dialog>
  </section>

</template>

<script>
import {selectTreeOrganization,deleteOrganization,selectUserByOrgId,deleteOrgUser} from '@/views/system/api/systemApi.js';
import OrganizationDetail from './organizationDetail';
import UserList from './userList';

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
      organizationDetailVisible : false,
      userListVisible : false,
      id : '',
      data : [],
      props : {
        label : 'name',
        children : 'children'
      },
      roleId : '',
      userData : [],
      orgTreeData : [],
      treeLoading : false,
      groupId : '',
      level : '',
      orgId : '',
      operationPrex : 'system:org'
    };
  },
  computed: {
    params() {
      let param = {
        id: this.id,
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
      this.clickTreeNode();
    },
    //获取列表
    getListData() {
      selectTreeOrganization(this.params).then(res => {
        this.orgTreeData = res.data;
        if (this.pageTotal == 0 && this.pageIndex > 1) {
          this.pageIndex--;
          this.getListData();
        }
      });
    },
    //改名页面显示条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.clickTreeNode();
    },
    //改变页数
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.clickTreeNode();
    },
    //勾选复选框给sels赋值
    listSelectionChange(sels) {
      this.sels = sels;
    },
    //删除
    handleDelete(data) {
      this.$confirm("确认删除当前部门及其下级部门吗？","提示", {type: "warning"}).then(() => {
        let para = {
          id : data.data.id
        };
        deleteOrganization(para).then((res) => {
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
    handleDel : function(index,row) {
      this.$confirm("确认删除选中记录吗？","提示", {type: "warning"}).then(() => {
        let para = {
          ids : [row.id]
        };
        deleteOrgUser(para).then((res) => {
          if(res.code == 200) {
            this.$message({
              type : 'success',
              message : res.message
            });
            this.clickTreeNode();
          }
        });
      });
    },
    //点击新增按钮弹出详情页
    handleInsert(data) {
      // if (data.level == 4) {
      //     this.$message({
      //         message: "不能再建下级部门",
      //         type: "error"
      //     });
      //     return;
      // }
      this.groupId = data.groupId;
      this.id = data.id;
      this.level = data.level + 1;
      this.organizationDetailVisible = true;
    },
    //子组件向父组件传值
    setShow : function(data) {
      if(data.sign == '关闭部门信息') {
        this.organizationDetailVisible = false;
        this.getListData();
      }else if(data.sign == '关闭用户列表') {
        this.userData = data.data;
        this.userListVisible = false;
        this.clickTreeNode();
      }
    },
    clickTreeNode : function() {
      this.id = this.$refs.tree.getCurrentNode().id;
      selectUserByOrgId(this.params).then((res) => {
        if(res.code == 200) {
          this.listData = res.data.list;
          this.pageTotal = res.data.total;
        }
      });
    },
    addUser : function() {
      let data = this.$refs.tree.getCurrentNode();
      if(data == null) {
        this.$message({
          type : 'error',
          message : "请先选择部门"
        });
        return;
      }
      this.orgId = data.id;
      this.groupId = data.groupId;
      this.userListVisible = true;
    },
    batchRemove : function() {
      this.$confirm("确认删除选中记录吗？","提示", {type: "warning"}).then(() => {
        
        let ids = this.sels.map(item => item.id);
        let para = {
          ids : ids
        };
        deleteOrgUser(para).then((res) => {
          if(res.code == 200) {
            this.$message({
              type : 'success',
              message : res.message
            });
            this.clickTreeNode();
          }
        });
      });
    }
  },
  components : {
    UserList,
    OrganizationDetail
  }
};
</script>

<style lang="scss" scoped>
.sysRole_box,
.sysRole_left,
.sysRole_right {
    height: 100%;
}
.sysRole_left {
    display: flex;
    flex-direction: column;
}
.sysTree {
    .custom-tree-node {
        width: calc(100% - 24px);
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
        & > span:first-child {
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
}
.dialog-box .el-form-item {
    margin-bottom: 0;
}
</style>

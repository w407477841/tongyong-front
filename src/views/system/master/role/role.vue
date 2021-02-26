<template>
  <section>
    <div class="app-container list-container">
      <div class="container-box list-box">
        <div class="container-box condition-box">
          <div class="conditionBar">
            <el-form :inline="true" class="condition-form">
              <el-row>
                <el-col :span="16" style="padding-bottom: 0px;">
                  <el-form-item>
                    <el-input size="mini" v-model="keyword" placeholder="角色编号/角色名称" :clearable="true"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button class="searchBtn" type="primary" size="mini" icon="el-icon-search" @click="handleSearch">查询</el-button>
                  </el-form-item>
                  <topButton @clickInsert="handleInsert" @clickDelate="handleDelete" :sels="sels" :operationPrex="operationPrex"></topButton>
                </el-col>
                <el-form-item>
                  <el-button class="searchBtn" type="primary" size="mini" @click="submitOperation">提交修改</el-button>
                </el-form-item>
              </el-row>
            </el-form>
          </div>
        </div>
        <!-- 左边角色维护 -->

        <div class="container-box list-box">
          <el-row class="sysRole_box">
            <el-col class="sysRole_left" :span="16" style>
              <div class="table-box">
                <el-table size="small" :data="listData" height="100%" style="width: 100%;" highlight-current-row @selection-change="listSelectionChange" @row-dblclick="getRoleId">
                  <el-table-column type="selection" :width="selectionWidth"></el-table-column>
                  <el-table-column type="index" :width="indexWidth"></el-table-column>
                  <el-table-column label="角色编号" prop="code" width="200"></el-table-column>
                  <el-table-column label="角色名称" prop="name" width="200"></el-table-column>
                  <el-table-column label="角色描述" :show-overflow-tooltip="true" prop="instroction" width="300"></el-table-column>
                  <el-table-column label="操作" width="200" align="center" fixed="right">
                    <template slot-scope="scope">
                      <rightButton @clickUpdate="handleUpdate" @clickDelate="handleDelete" :row="scope.row" :hasView="false" :operationPrex="operationPrex"></rightButton>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <!--工具条-->
              <div class="pagination-box">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageIndex" :page-sizes="pageSizes" :page-size="pageSize" :total="pageTotal" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
              </div>
            </el-col>
            <el-col class="sysRole_right" :span="8">
               <!-- <el-tree :data="data" :default-expand-all="true" :show-checkbox="true" node-key="id" :props="props" ref="tree" class="toolbar" style=""></el-tree> -->
             <el-tree :data="data" :default-expand-all="true" :show-checkbox="true" node-key="id" :props="props" ref="tree" class="toolbar" style="overflow-y:scroll;max-height:500px;min-height:400px;"></el-tree>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>

    <el-dialog :title="this.title" :visible.sync="roleDetailVisible" :close-on-click-modal="false" width="50%" v-if="roleDetailVisible">
      <role-detail @setShow="setShow" :edit="this.edit" :openType="this.openType" :id="this.id"></role-detail>
    </el-dialog>
  </section>

</template>

<script>
import {getRole,deleteRoles,selectTreeOperation,insertRoleOperation,selectRoleOwnedOperation} from '@/views/system/api/systemApi.js';
import RoleDetail from './roleDetail';

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
      roleDetailVisible : false,
      id : '',
      data : [],
      props : {
        label : 'name',
        children : 'children'
      },
      roleId : '',
      operationPrex : 'system:role',
      height : ''
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
    this.getOperation();
    this.setHeight();
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
    //删除
    handleDelete(sels) {
      this.$confirm("确认删除选中记录吗？","提示", {type: "warning"}).then(() => {
        let ids = sels.map(item => item.id);
        let para = {
          ids : ids
        };
        deleteRoles(para).then((res) => {
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
    //点击编辑按钮弹出详情页
    handleUpdate(row) {
      this.title = "编辑";
      this.edit = false;
      this.openType = "update";
      this.id = row.id;
      this.roleDetailVisible = true;
    },
    //点击新增按钮弹出详情页
    handleInsert() {
      this.title = "新增";
      this.edit = false;
      this.openType = "insert";
      this.roleDetailVisible = true;
    },
    //日期格式化
    changeDate : function(row) {
      let date = row.createTime;
      return this.$moment(date).format('YYYY-MM-DD');
    },
    //状态格式化
    getStatus : function(row) {
      let status = row.status;
      if(status == 1) {
        return '未工作';
      }else if(status == 2) {
        return '已工作';
      }
    },
    //子组件向父组件传值
    setShow : function(data) {
      if(data.sign == '关闭人员信息') {
        this.roleDetailVisible = false;
        this.getListData();
      }else if(data.sign == '关闭加入项目') {
        this.inputPprojectVisible = false;
        this.getListData();
      }
    },
    //给角色分配权限
    submitOperation : function() {
      if(this.roleId == '') {
        this.$message({
          type : 'error',
          message : '保存失败，请双击需要编辑的角色'
        });
        return;
      }
      this.$confirm("确认保存吗？","提示", {type: "warning"}).then(() => {
        let data = this.$refs.tree.getCheckedNodes(false,true);
        let bodyList = [{
          roleId : '',
          operId : ''
        }];
        for(let i = 0;i < data.length;i++) {
          this.$set(bodyList,i,Object.assign({},{
            roleId : this.roleId,
            operId : data[i].id
          }));
        }
        let para = {
          id : this.roleId,
          body : {
            roleOperations : bodyList
          }
        };
        insertRoleOperation(para).then((res) => {
          if(res.code == 200) {
            this.$message({
              type : 'success',
              message : res.message
            });
            this.getListData();
            this.getOperation();
          }else {
            this.$message({
              type : 'error',
              message : res.message
            });
          }
        });
      });
    },
    //获取权限数据
    getOperation : function() {
      let para = {};
      selectTreeOperation(para).then((res) => {
        this.$refs.tree.setCheckedKeys([]);
        this.data = res.data;
      });
    },
    //获取当前角色拥有权限
    getRoleId : function(row) {
      this.roleId = row.id;
      let para = {
        body : {
          roleId : row.id
        }
      };
      selectRoleOwnedOperation(para).then((res) => {
        this.$refs.tree.setCheckedKeys(res.data);
      });
    },
    setHeight : function() {
        this.height = "height:" + (window.innerHeight - 247) + "px";
    }
  },
  components : {
    RoleDetail
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
</style>

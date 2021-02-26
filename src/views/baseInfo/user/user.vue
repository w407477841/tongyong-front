<template>

  <div class="app-container list-container">
    <div class="container-box condition-box">
      <div class="conditionBar">
        <el-form :inline="true" class="condition-form">
          <el-form-item>
            <el-select size="mini" v-model="keyword" placeholder="证书类型" :clearable="true" :filterable="true">
              <el-option v-for="item in certificateTypeList" :label="item.label" :value="item.value" :key="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button class="searchBtn" type="primary" size="mini" icon="el-icon-search" @click="handleSearch">查询</el-button>
          </el-form-item>
          <topButton @clickInsert="handleInsert" @clickDelate="handleDelete" :sels="sels" :operationPrex="operationPrex"></topButton>
        </el-form>
      </div>
    </div>

    <div class="container-box list-box">
      <div class="table-box">
        <el-table size="small" :data="listData" style="width: 100%" height="100%" highlight-current-row @selection-change="listSelectionChange" header-row-class-name="xyTableHeader">
          <el-table-column type="selection" :width="selectionWidth"></el-table-column>
          <el-table-column type="index" :width="indexWidth"></el-table-column>
          <el-table-column label="姓名" prop="name" width="180"></el-table-column>
          <el-table-column label="身份证号" prop="identityCode" width="150"></el-table-column>
          <el-table-column label="手机号码" prop="phone" width="150"></el-table-column>
          <el-table-column label="证书类型" prop="certificateTypeName" width="200"></el-table-column>
          <el-table-column label="证书编号" prop="certificateNo" width="180"></el-table-column>
          <el-table-column label="工作状态" prop="status" :formatter="getStatus"></el-table-column>
          <el-table-column label="当前所属工程" :show-overflow-tooltip="true" prop="projectName" width="150"></el-table-column>
          <el-table-column label="创建日期" :width="dateWidth" prop="createTime" :formatter="changeDate"></el-table-column>
          <el-table-column label="创建人" :width="userWidth" prop="createUserName"></el-table-column>
          <el-table-column label="操作" :width="380" align="center" fixed="right">
            <template slot-scope="scope">
              <rightButton @clickView="handleView" @clickUpdate="handleUpdate" @clickDelate="handleDelete" @clickPutIn="putInProject" :row="scope.row" :hasPutIn="true" :operationPrex="operationPrex"></rightButton>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination-box">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageIndex" :page-sizes="pageSizes" :page-size="pageSize" :total="pageTotal" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>
    </div>

    <el-dialog :title="this.title" :visible.sync="userDetailVisible" :close-on-click-modal="false" width="60%" v-if="userDetailVisible">
      <user-detail @setShow="setShow" :edit="this.edit" :openType="this.openType" :id="this.id"></user-detail>
    </el-dialog>

    <el-dialog title="加入项目" :visible.sync="inputPprojectVisible" :close-on-click-modal="false" width="60%" v-if="inputPprojectVisible">
      <user-input-project @setShow="setShow" :id="this.id"></user-input-project>
    </el-dialog>
  </div>
</template>

<script>
import {getUser,deleteUsers,selectProjectInfo,selectCetificateType} from '@/views/api/equipmentApi.js';
import UserDetail from './userDetail';
import UserInputProject from './userInputProject';

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
      inputPprojectVisible : false,
      id : '',
      certificateTypeList : [],
      operationPrex : 'project:user'
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
    this.getCetificateType();
  },
  methods: {
    //条件查询
    handleSearch() {
      this.pageIndex = 1;
      this.getListData();
    },
    //获取列表
    getListData() {
      getUser(this.params).then(res => {
        this.listData = res.data.list;
        this.pageTotal = Number(res.data.total);
        if(this.pageTotal == 0 && this.pageIndex > 1) {
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
        deleteUsers(para).then((res) => {
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
      this.edit = true;
      this.openType = "view";
      this.id = row.id;
      this.userDetailVisible = true;
    },
    //点击编辑按钮弹出详情页
    handleUpdate(row) {
      this.title = "编辑";
      this.edit = false;
      this.openType = "update";
      this.id = row.id;
      this.userDetailVisible = true;
    },
    //点击新增按钮弹出详情页
    handleInsert() {
      this.title = "新增";
      this.edit = false;
      this.openType = "insert";
      this.userDetailVisible = true;
    },
    //点击加入项目按钮弹出详情页
    putInProject : function(row) {
      this.inputPprojectVisible = true;
      this.id = row.id;
    },
    //时间格式化
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
        this.userDetailVisible = false;
        this.getListData();
      }else if(data.sign == '关闭加入项目') {
        this.inputPprojectVisible = false;
        this.getListData();
      }
    },
    //获取证书类型
    getCetificateType : function() {
      let para = {};
      selectCetificateType(para).then((res) => {
        this.certificateTypeList = res.data;
      });
    }
  },
  components : {
    UserDetail,
    UserInputProject
  }
};
</script>

<style lang="scss" scoped>
</style>

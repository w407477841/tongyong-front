<template>

  <div class="app-container list-container">
    <div class="container-box condition-box">
      <div class="conditionBar">
        <el-form :inline="true" class="condition-form">
          <el-form-item>
            <el-select v-model="keyword" :clearable="true" :filterable="true" size="mini" placeholder="工程名称">
              <el-option v-for="item in projectList" :label="item.label" :value="item.value" :key="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button class="searchBtn" type="primary" size="mini" icon="el-icon-search" @click="handleSearch">查询</el-button>
          </el-form-item>
          <topButton @clickInsert="handleInsert" @clickDelate="handleDelete" @clickBinding="handleBinding" :sels="sels" :hasBinding="true" :operationPrex="operationPrex" check="status=1"></topButton>
          <el-form-item>
            <el-button v-if="validateOperation('approve')" class="updateBtn" type="primary" size="mini" icon="el-icon-dagou" :disabled="checkDisabled('status=1')" @click="handleOpen">审批</el-button>
          </el-form-item>
          <el-form-item>
            <el-button v-if="validateOperation('change')" class="updateBtn" type="primary" size="mini" icon="el-icon-refresh" :disabled="this.sels.length === 0" @click="changeOrg">修改组织</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <div class="container-box list-box">
      <div class="table-box">
        <el-table size="small" :data="listData" style="width: 100%" height="100%" highlight-current-row @selection-change="listSelectionChange" header-row-class-name="xyTableHeader">
          <el-table-column type="selection" :width="selectionWidth"></el-table-column>
          <el-table-column type="index" :width="indexWidth"></el-table-column>
          <el-table-column label="工程名称" :show-overflow-tooltip="true" prop="name"></el-table-column>
          <el-table-column label="状态" prop="status" :formatter="getStatus"></el-table-column>
          <el-table-column label="项目类别" prop="type" :formatter="getType"></el-table-column>
          <el-table-column label="项目区域" prop="positionName"></el-table-column>
          <el-table-column label="开工日期" prop="beginDate" :width="dateWidth" :formatter="dateChange"></el-table-column>
          <el-table-column label="建设单位" :show-overflow-tooltip="true" prop="constructionUnit"></el-table-column>
          <el-table-column label="施工单位" prop="builderName"></el-table-column>
          <el-table-column label="项目经理" prop="manager"></el-table-column>
          <el-table-column label="创建日期" :width="dateWidth" prop="createTime" :formatter="changeDate"></el-table-column>
          <el-table-column label="创建人" :width="userWidth" prop="createUserName"></el-table-column>
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

    <el-dialog :title="this.title" :visible.sync="projectDetailVisible" :close-on-click-modal="false" width="80%" v-if="projectDetailVisible">
      <project-detail :edit="this.edit" @setShow="setShow" :openType="this.openType" :id="this.id" :placePoint="this.placePoint" :projectScope="projectScope"></project-detail>
    </el-dialog>

    <el-dialog title="绑定智慧工地" :visible.sync="projectBindingVisible" :close-on-click-modal="false" width="60%" v-if="projectBindingVisible" height="600px">
      <project-binding :projectId="this.projectId" @setShow="setShow"></project-binding>
    </el-dialog>

    <el-dialog title="工程地点" :visible.sync="mapVisible" :close-on-click-modal="false" width="80%" v-if="mapVisible">
      <map-baidu @setShow="setShow" :isClose="isClose" :projectScope="projectScope"></map-baidu>
    </el-dialog>

    <el-dialog title="修改组织" :visible.sync="orgVisible" :close-on-click-modal="false" width="30%" v-if="orgVisible">
      <change-org @setShow="setShow" :ids="this.sels.map(item => item.id)"></change-org>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment';
import ProjectDetail from './projectDetail';
import ProjectBinding from './projectBinding';
import MapBaidu from './mapBaidu';
import ChangeOrg from './changeOrg';
import {getPorject,deletePorjects,selectProjectInfo,approve} from '@/views/api/equipmentApi.js';

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
      projectDetailVisible : false,
      projectBindingVisible : false,
      title : '',
      openType : '',
      positionList : [],
      builderList : [],
      mapVisible : false,
      placePoint : '',
      projectList : [],
      projectId : '',
      operationPrex : 'project:info',
      isClose : false,
      projectScope : [],
      orgVisible : false
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
    this.selectProjectInfo();
  },
  methods: {
    //条件查询
    handleSearch() {
      this.pageIndex = 1;
      this.getListData();
    },
    //获取列表
    getListData() {
      getPorject(this.params).then(res => {
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
        deletePorjects(para).then((res) => {
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
      this.projectDetailVisible = true;
      this.id = row.id;
    },
    //点击编辑按钮弹出详情页
    handleUpdate(row) {
      this.title = "编辑";
      this.openType = "update";
      this.edit = false;
      this.projectDetailVisible = true;
      this.id = row.id;
    },
    //点击新增按钮弹出详情页
    handleInsert() {
      this.title = "新增";
      this.openType = "insert";
      this.edit = false;
      this.projectDetailVisible = true;
    },
    //日期格式化
    changeDate : function(row) {
      let date = row.createTime;
      return this.$moment(date).format('YYYY-MM-DD');
    },
    //日期格式化
    dateChange : function(row) {
      let date = row.beginDate;
      return this.$moment(date).format('YYYY-MM-DD');
    },
    //点击绑定智慧工地按钮弹出智慧工地项目列表
    handleBinding : function(sels) {
      if(sels.length < 1) {
        this.$message({
          type : "error",
          message : "请选择一条数据"
        });
        return;
      }
      if(sels.length > 1) {
        this.$message({
          type : "error",
          message : "只能选择一条数据"
        });
        return
      }
      if(this.sels[0].uuid != '' && this.sels[0].uuid != null && this.sels[0].uuid != undefined) {
        this.$message({
          type : "error",
          message : "该项目已经绑定智慧工地"
        });
        return;
      }
      this.projectId = sels[0].id;
      this.projectBindingVisible = true;

    },
    //子组件向父组件传值
    setShow : function(data) {
      if(data.sign == "关闭绑定") {
        this.projectBindingVisible = false;
      this.getListData();
      }else if(data.sign == "关闭项目信息") {
        this.projectDetailVisible = false;
      this.getListData();
      }else if(data.sign == "打开地图") {
        this.isClose = data.isClose;
        this.mapVisible = true;
        this.projectScope = data.projectScope;
      }else if(data.sign == "关闭地图") {
        this.placePoint = data.data.point.lng + "," + data.data.point.lat;
        this.mapVisible = false;
      }else if(data.sign == "设置项目范围") {
        this.projectScope = data.projectScope;
        this.mapVisible = false;
      }else if(data.sign == "关闭修改组织") {
        this.orgVisible = false;
        this.getListData();
      }
    },
    //获取项目
    selectProjectInfo : function() {
      let para = {};
      selectProjectInfo(para).then((res) => {
        this.projectList = res.data;
      });
    },
    //状态格式化
    getType : function(row) {
      if(row.type == 1) {
        return '房建';
      }else if(row.type == 2) {
        return '市政';
      }
    },
    getStatus : function(row) {
      if(row.status == 0) {
        return '未审批';
      }else if(row.status == 1) {
        return '已审批';
      }else {
        return '';
      }
    },
    handleOpen : function() {
      let ids = this.sels.map(item => item.id);
      let para = {
        ids : ids
      }
      this.$confirm("确认审批吗？","提醒",{type : "warning"}).then(() => {
        approve(para).then((res) => {
          this.$message({
            type : res.success?'success':'error',
            message : res.message
          });
          this.getListData();
        });
      });
    },
    changeOrg : function() {
      this.orgVisible = true;
    }
  },
  components : {
    ProjectDetail,
    ProjectBinding,
    MapBaidu,
    ChangeOrg
  }
};
</script>

<style lang="scss" scoped>
</style>

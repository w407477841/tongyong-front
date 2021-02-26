<template>

  <div class="app-container list-container">
    <div class="container-box condition-box">
      <div class="conditionBar">
        <el-form :inline="true" class="condition-form">
          <el-form-item>
            <el-input size="mini" v-model="keyword" :disabled="edit" placeholder="关键字" :clearable="true"></el-input>
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
          <el-table-column label="设备号" prop="deviceNo" width="180"></el-table-column>
          <el-table-column label="插头号" prop="plugNo" width="180"></el-table-column>
          <el-table-column label="上报时间" prop="reportTime" width="220" :formatter="formatDate" ></el-table-column>
          <el-table-column label="维修时间" prop="repairTime" width="220" :formatter="formatDate"></el-table-column>
          <el-table-column label="故障内容" prop="malfunctionContent" width="180"></el-table-column>
          <el-table-column label="维修内容" prop="feedbackContent" width="180"></el-table-column>
          <el-table-column label="记录状态" prop="status" width="180":formatter="recordStatus"></el-table-column>
          <el-table-column label="反馈状态" prop="feedbackStatus" width="180":formatter="feedbackStatus"></el-table-column>
          <el-table-column label="备注" :show-overflow-tooltip="true" prop="comments" width="180"></el-table-column>
          <el-table-column label="创建日期" :width="dateWidth" prop="createTime" :formatter="changeDate"></el-table-column>
          <el-table-column label="创建人" :width="userWidth" prop="createUserName"></el-table-column>
          <el-table-column label="操作" :width="380" align="center" fixed="right">
            <template slot-scope="scope">
              <rightButton @clickView="handleView" @clickUpdate="handleUpdate" @clickDelate="handleDelete"  :row="scope.row" :hasPutIn="true" :operationPrex="operationPrex"></rightButton>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination-box">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageIndex" :page-sizes="pageSizes" :page-size="pageSize" :total="pageTotal" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>
    </div>

    <el-dialog :title="this.title" :visible.sync="detailVisible" :close-on-click-modal="false" width="60%" v-if="detailVisible">
      <Detail @setShow="setShow" :edit="this.edit" :openType="this.openType" :id="this.id"></Detail>
    </el-dialog>

    
  </div>
</template>

<script>
import {getAsMalfunctions,deleteAsMalfunctions} from './api.js';
import Detail from './detail';


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
      detailVisible : false,
      id : '',
      certificateTypeList : [],
      operationPrex : 'aftersale:asmalfunction'
    };
  },
  computed: {
    params() {
      let param = {
        key: this.keyword,
        columns:["device_no","plug_no"],
        pageNum: this.pageIndex,
        pageSize: this.pageSize,
        body:{}
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
      getAsMalfunctions(this.params).then(res => {
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
        deleteAsMalfunctions(para).then((res) => {
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
      this.detailVisible = true;
    },
    //点击编辑按钮弹出详情页
    handleUpdate(row) {
      this.title = "编辑";
      this.edit = false;
      this.openType = "update";
      this.id = row.id;
      this.reportTime = row.reportTime;
      this.detailVisible = true;
    },
    //点击新增按钮弹出详情页
    handleInsert() {
      this.title = "新增";
      this.edit = false;
      this.openType = "insert";
      this.detailVisible = true;
    },
     //子组件向父组件传值
    setShow : function(data) {
      
        this.detailVisible = false;
        this.getListData();
      
    },
    //时间格式化
    changeDate : function(row) {
      let date = row.createTime;
      return this.$moment(date).format('YYYY-MM-DD');
    },
    //时间格式化YYYY-MM-DD HH:mm:ss
    formatDate(row, column) {
      // 获取单元格数据
      let dataa = row[column.property]
      if(dataa!=''&&dataa!=null){
        console.log(dataa);
  
        return this.$moment(dataa).format('YYYY-MM-DD HH:mm:ss');
      
      }else{
        return '';
      }
    },
    //记录状态
    recordStatus:function(row){
      if(row.status == 0){
        return "已上报";
      }else if(row.status == 1){
        return "处理中";
      }else if(row.status == 2){
        return "已处理";
      }
    },
    //反馈状态
    feedbackStatus:function(row){
        return row.feedback_status == 0 ? "未解决":"已解决"
    }
  },
  components : {
    Detail
  }
};
</script>

<style lang="scss" scoped>
</style>

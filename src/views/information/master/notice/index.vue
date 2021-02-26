<!--
 * @Author: changmengyu
 * @CreateTime: 2018-09-08 22:33:08 
 * @Desc: 通知公告详情
-->
<template>
    <div class="app-container list-container">
        <div class="container-box condition-box">
            <div class="conditionBar">
                <el-form :inline="true" class="condition-form">       
                    <el-form-item>
                       <!-- <el-button type="primary" size="mini" icon="el-icon-search" @click="handleSearch">查询</el-button> --> 
                    </el-form-item>

                     <topButton :operationPrex="operationPrex" @clickInsert="handleInsert"  @clickDelate="handleDelete" :sels="sels"></topButton>                         

                </el-form>
            </div>
        </div>

        <div class="container-box list-box">
            <div class="table-box">
                <el-table size="small" :data="listData" style="width: 100%"   height="100%"  header-row-class-name="xyTableHeader" highlight-current-row @selection-change="listSelectionChange"  >
                    <el-table-column type="selection" :width="selectionWidth"></el-table-column>
                    <el-table-column type="index" :width="indexWidth"></el-table-column>
                    <el-table-column label="公告编号" prop="code" :width = "300"></el-table-column>
                    <el-table-column label="公告标题" prop="title" :width = "300" show-overflow-tooltip></el-table-column>
                    <el-table-column label="创建日期"  :width = "300" prop="createTime"></el-table-column>
                    <el-table-column label="创建人" :width="userWidth" prop="createUserName" show-overflow-tooltip></el-table-column>
                    <el-table-column label="操作" :width="operateWidth" align="center" fixed="right">
                        <template slot-scope="scope">
                           <rightButton :operationPrex="operationPrex" @clickView="handleView" @clickUpdate="handleUpdate" @clickDelate="handleDelete" :row="scope.row"></rightButton>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="pagination-box">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :page-sizes="pageSizes" :page-size="pageSize" :total="pageTotal" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
            </div>
        </div>
           
 <detailsDialog v-if="visible" :visible.sync="visible" @close="closeDialog" :routeType="detailsType" :detailsId="detailsId"></detailsDialog>


    </div>
</template>

<script>
import {
  getListApi,
  getInfoApi,
  insertInfoApi,
  updateInfoApi,
  deleteInfoApi
} from '../../api/notice.js';
import detailsDialog from './details';
export default {
   components:{
    detailsDialog
  },
  data() {

    return {
      operationPrex: "information:notice",
      sels:[],
      listData: [],
      pageNum: 1,
      pageSizes: [10, 20, 30],
      pageSize: 10,
      pageTotal: 0,

 
      visible:false,
      detailsType:null,
      detailsId:null,
      detailsPath: this.$route.path + '/details'
    };
  },
  computed: {
    params() {
      let param = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      };
      return param;
    },

  },
  
  mounted() {
    this.handleSearch();
  },
  methods: {
   handleSearch(){
      this.pageNum  = 1;
      this.pageSize  = 10;

      this.handelGet();
   },


    handelGet() {
       
      getListApi(this.params).then(res => {
        this.listData = res.data.list;
        this.pageTotal = Number(res.data.total);
        
        
      });
    },

    handleSizeChange(val) {
      this.pageSize = val;
      this.handelGet();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.handelGet();
    },
   
 handleView(row) {
      this.visible = true;
      this.detailsType = 'view';
      this.detailsId = row.id;
    },
    handleUpdate(row) {
      this.visible = true;
      this.detailsType = 'update';
      this.detailsId = row.id;
    },
    handleInsert() {
      this.visible = true;
      this.detailsType = 'insert';
      this.detailsId = null;
    },
  
  handleDelete(sels) {
    //  let params = { ids: sels.map(item => item.id).toString() };
    let params = { ids: sels.map(item => item.id)};
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning"
      }).then(() => {
        deleteInfoApi(params).then(res => {
          this.$message({
            message: res.message,
            type: res.success ? "success" : "error"
          });
          this.handleSearch();
        });
      });
    },
   
     listSelectionChange(sels) {
      this.sels = sels;
    },
      closeDialog(){
     this.visible = false;
     this.handelGet() ;
    }
  }
};
</script>

<style lang="scss" scoped>
</style>

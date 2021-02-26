<!--
 * @Author: zhouyujie 
 * @CreateTime: 2018-09-08 22:33:42 
 * @Desc: 短信推送主页面 
-->
<template>
    <div class="app-container list-container">
        <div class="container-box condition-box">
            <div class="conditionBar">
                <el-form :inline="true" class="condition-form">       
                   

                     <topButton :operationPrex="operationPrex" @clickInsert="handleInsert"  @clickDelate="handleDelate" check="status=已启用" :sels="sels"></topButton>                         
                      <el-form-item>
                       <!-- <el-button type="primary" size="mini" icon="el-icon-search" @click="handleSearch">查询</el-button> --> 
                       <el-button type="primary" size="mini" icon="el-icon-dagou" @click="handleOpen" :disabled="checkDisabled('status=已启用')">启用</el-button>
                    </el-form-item>
                    
                </el-form>
            </div>
        </div>

        <div class="container-box list-box">
            <div class="table-box">
                <el-table size="small" :data="listData" style="width: 100%"   height="100%"  header-row-class-name="xyTableHeader" highlight-current-row @selection-change="listSelectionChange" >
                    <el-table-column type="selection" :width="selectionWidth"></el-table-column>
                    <el-table-column type="index" :width="indexWidth"></el-table-column>
                    <el-table-column label="短信编号" prop="code" width="120"></el-table-column>
                    <el-table-column label="短信标题" prop="title" show-overflow-tooltip></el-table-column>
                    <el-table-column label="设备类型" prop="deviceTypeName" show-overflow-tooltip></el-table-column>
                    <el-table-column label="预计开始发送日期" :width="dateWidth"  prop="sendTime" :formatter="handleDate"></el-table-column>
                    <el-table-column label="短信类型"  prop="type" :formatter="handleType" show-overflow-tooltip></el-table-column>
                    <el-table-column label="启用"  prop="status"></el-table-column>
                    <el-table-column label="创建日期" :width="dateWidth" prop="createTime" :formatter="handleDate"></el-table-column>
                    <el-table-column label="创建人" :width="userWidth" prop="createUserName" show-overflow-tooltip></el-table-column>
                    <el-table-column label="操作" :width="operateWidth" align="center" fixed="right">
                        <template slot-scope="scope">
                           <rightButton :operationPrex="operationPrex" @clickView="handleView" @clickUpdate="handleUpdate" @clickDelate="handleDelate" :disUpdate="scope.row.status=='已启用'?true:false" :disDelete="scope.row.status=='已启用'?true:false" :row="scope.row"></rightButton>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="pagination-box">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageIndex" :page-sizes="pageSizes" :page-size="pageSize" :total="pageTotal" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
            </div>
        </div>
            
 <detailsDialog v-if="visible" :visible.sync="visible" @close="closeDialog" :routeType="detailsType" :detailsId="detailsId"></detailsDialog>


    </div>
</template>

<script>
import {
  updateStatusApi,
  getListApi,
  getInfoApi,
  insertInfoApi,
  updateInfoApi,
  deleteInfoApi
} from '../../api/message.js';
import moment from 'moment';
import detailsDialog from './details';
export default {
   components:{
    detailsDialog
  },
  data() {

    return {
      operationPrex: "information:message",
      DetailListData:[],
      sels:[],
      listData: [],
      pageIndex: 1,
      pageSizes: [10, 20, 30],
      pageSize: 10,
      pageTotal: 0,

      pageIndexDetail: 1,
      pageSizesDetail: [10, 20, 30],
      pageSizeDetail: 10,
      pageTotalDetail: 0,
      visible:false,
      detailsType:null,
      detailsId:null,
      detailsPath: this.$route.path + '/details'
    };
  },
  computed: {
    params() {
      let param = {
        pageNum: this.pageIndex,
        pageSize: this.pageSize
      };
      return param;
    },
    paramsDetail(){
                let param = {
                    id: this.id,
                    pageNum: this.pageIndexDetail,
                    pageSize: this.pageSizeDetail
                };
                return param;
            },
  },
  mounted() {
    this.handleSearch();
  },
  methods: {
    //调用查询
   handleSearch(){
      this.pageIndex  = 1;
      this.pageSize  = 10;

      this.handelGet();
   },

  //查询
    handelGet() {
       
      getListApi(this.params).then(res => {
        this.listData = res.data.list;
        this.pageTotal = res.data.total;
      });
    },
    //日期格式转换
  handleDate(row, column, cellValue, index){
    if(cellValue){
      return moment(cellValue).format('YYYY-MM-DD');
    }else{
      return "";
    }
   
  },
  //条数变更
    handleSizeChange(val) {
      this.pageSize = val;
      this.handelGet();
    },
    //页数变更
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.handelGet();
    },
  //查看
 handleView(row) {
      this.visible = true;
      this.detailsType = 'view';
      this.detailsId = row.id;
    },
    //编辑
    handleUpdate(row) {
      this.visible = true;
      this.detailsType = 'update';
      this.detailsId = row.id;
    },
    //短信类型转换
    handleType(row){
      if(row.type ==1){
        return "报警";
      }else if(row.type ==2){
        return "预警";
      }else if(row.type ==3){
        return "信息";
      }
    },
    //启用
     handleOpen() {
     let params = { ids: this.sels.map(item => item.id).toString() };
     let flag =false;
      this.$confirm("确认启用选中记录吗？", "提示", {
        type: "warning"
      }).then(()=>{
       this.sels.forEach(element => {

       if(element.status===1 || element.status=="已启用"){
         flag =true;
          this.$message({
                message: "已启用的不可再启用",
                type: 'error'
              });
              return;
       }else if(!flag){
         updateStatusApi(params).then(res=>{
            this.$message({
                message: res.message,
                type: res.success?'success':'error'
              });
       this.handelGet();
     });
       }
     });
      });
     
     
    },
    //新增
    handleInsert() {
      this.visible = true;
      this.detailsType = 'insert';
      this.detailsId = null;
    },

 //删除
  handleDelate(sels) {
     let params = { ids: sels.map(item => item.id) };
       
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning"
      }).then(() => {
        
         sels.forEach(element => {
           
       if(element.status==1 || element.status=="已启用"){
         
          this.$message({
                message: "已启用的不可删除",
                type: 'error'
              });
       }else{
         
          deleteInfoApi(params).then(res => {
          this.$message({
            message: res.message,
            type: res.success ? "success" : "error"
          });
          this.handleSearch();
        });
       }
     });
       
      });
    },
   //选中项记录
     listSelectionChange(sels) {
      this.sels = sels;
    },
    //关闭弹窗
      closeDialog(){
     this.visible = false;
     this.handelGet() ;
    }
  }
};
</script>

<style lang="scss" scoped>
</style>

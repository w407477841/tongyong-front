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
          <el-table-column label="系统订单编号" prop="orderNo" width="180"></el-table-column>
          <el-table-column label="微信订单号" prop="wxOrderNo" width="180"></el-table-column>
          <el-table-column label="设备号" prop="deviceNo" width="180"></el-table-column>
          <el-table-column label="插头号" prop="plugNo" width="180"></el-table-column>
          <el-table-column label="卡号" prop="cardNo" width="180"></el-table-column>
          <el-table-column label="手机号" prop="phone" width="180"></el-table-column>
          <el-table-column label="订单标记" prop="orderTag" width="180" :formatter="orderTagStatus"></el-table-column>
          <el-table-column label="单价元/小时" prop="price" width="180"></el-table-column>
          <el-table-column label="小时数" prop="hourage" width="180"></el-table-column>
          <el-table-column label="合计" prop="amount" width="180"></el-table-column>
          <el-table-column label="订单状态" prop="status" width="180" :formatter="orderStatus"></el-table-column>
          <el-table-column label="指令状态" prop="cmdStatus" width="180" :formatter="cmdStatus"></el-table-column>
          <el-table-column label="备注" prop="comments" width="180"></el-table-column>
          <el-table-column label="支付时间" prop="payTime" width="180" :formatter="formatDate"></el-table-column>
          <el-table-column label="指令下发时间" prop="cmdSendTime" width="180" :formatter="formatDate"></el-table-column>
          <el-table-column label="指令回复时间" prop="cmdReplyTime" width="180" :formatter="formatDate"></el-table-column>
          <el-table-column label="充电开始时间" prop="chargingStartTime" width="180" :formatter="formatDate"></el-table-column>
          <el-table-column label="充电结束时间" prop="chargingEndTime" width="180" :formatter="formatDate"></el-table-column>
          <el-table-column label="充电状态" prop="chargingStatus" width="180" :formatter="chargingSelect"></el-table-column>
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
import {getOrderRecords,deleteOrderRecords} from './api.js';
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
      operationPrex : 'order:orderrecord'
    };
  },
  computed: {
    params() {
      let param = {
        key: this.keyword,
        columns:["order_no","device_no","plug_no"],
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
      getOrderRecords(this.params).then(res => {
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
        deleteOrderRecords(para).then((res) => {
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
      let data = row[column.property]
      if(data!=''&&data!=null){
        return this.$moment(data).format('YYYY-MM-DD HH:mm:ss');
      
      }else{
        return '';
      }
    },
    //订单标记
    orderTagStatus:function(row){
      if(row.orderTag == 1){
        return "微信支付";
      }else if(row.orderTag == 2){
        return "刷卡支付";
      }else{
        return "余额支付";
      }
        
    },
    //cmd_status指令状态
    cmdStatus:function(row){
      if(row.cmdStatus == 0){
        return "未下发";
      }else if(row.cmdStatus == 1){
        return "已下发";
      }else if(row.cmdStatus == 2){
        return "成功";
      }else{
        return "失败";
      }

    },
    //订单状态
    orderStatus:function(row){
      if(row.status == 0){
        return "取消支付";
      }else if(row.status == 1){
        return "支付成功";
      }else if(row.status == 2){
        return "支付失败";
      }else{
        return "未操作";
      }
    },
    //充电状态
    chargingSelect:function(row){
      if(row.chargingStatus == 0){
        return "未开始";
      }else if(row.chargingStatus == 1){
        return "充电中";
      }else{
        return "充电结束";
      }
    }
  },
  components : {
    Detail
  }
};
</script>

<style lang="scss" scoped>
</style>

<template>
  <div class="app-container list-container">
    <div class="container-box condition-box">
      <div class="conditionBar">
      </div>
    </div>

    <div class="container-box list-box">
      <div class="table-box">
        <el-row>
          <el-col :span="12">
            <el-button type="primary" size="mini" icon="el-icon-plus" @click="handleInsert">新增</el-button>
            <el-button type="primary" size="mini" icon="el-icon-plus" @click="batchInsert">批量导入</el-button>
            <a href="./static/出厂调试设备导入模板.xlsx"><el-button type="primary" size="mini" icon="el-icon-download">模板下载</el-button></a>
            <el-button size="mini" @click="clearFilter">清空筛选</el-button>
            <el-table ref="filterTable" size="small" :data="listData" style="width: 100%" highlight-current-row header-row-class-name="xyTableHeader" @row-click="changeRow" :row-class-name="className">
              <el-table-column type="index" :width="indexWidth"></el-table-column>
              <el-table-column label="厂家" :show-overflow-tooltip="true" prop="producer" :formatter="getProducer"></el-table-column>
              <el-table-column label="设备类型" :show-overflow-tooltip="true" prop="deviceType" :formatter="getType"></el-table-column>
              <el-table-column label="设备号" :show-overflow-tooltip="true" prop="deviceNo"></el-table-column>
              <el-table-column filter-placement="bottom-end" :filter-method="filterHandler" label="状态" :show-overflow-tooltip="true" prop="isColor" :formatter="getStatus" :filters="[{ text: '已接通', value: true }, { text: '未接通', value: false }]"></el-table-column>
              <el-table-column label="操作" :width="300">
                <template slot-scope="scope">
                  <el-button type="success" size="mini" icon="el-icon-share" @click="handleLink(scope.$index,scope.row)" v-if="scope.row.sub == null">开始连接</el-button>
                  <el-button type="danger" size="mini" icon="el-icon-close" @click="cancelLink(scope.$index,scope.row)" v-if="scope.row.sub != null">断开连接</el-button>
                  <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope.$index,scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
          <el-col :span="12" style="margin-top : 40px">
            <el-form>
              <el-form-item></el-form-item>
              <el-form-item v-for="item in dataList" :key="item.deviceNo">
                <div v-if="item.isShow" >{{"厂家:" + item.producerName + ',设备类型:' + item.typeName + ',设备号:' + item.deviceNo}}</div>
                <el-input type="textarea" :autosize="{minRows: 10,maxRows: 20}" :value="item.deviceData" :readonly="true" v-if="item.isShow"></el-input>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </div>
    </div>

    <el-dialog width="30%" title="新增" :visible.sync="dialogVisible" :close-on-click-modal="false" append-to-body>
      <div class="details-container">
        <div class="container-box details-box">
          <div class="details-body">
            <el-form size="small" :label-width="labelWidth" :model="formDatas" :rules="formDatasRules" ref="editForm" height="100%" style="overflow:auto">
              <el-row>
                <el-col :xs="24" :sm="24" :md="24" class="col-height">
                  <el-form-item label="厂家" prop="producer">
                    <el-select size="mini" v-model="formDatas.producer" filterable clearable placeholder="厂家" :disabled="isDis">
                      <el-option v-for="item in producerList" :label="item.label" :value="item.value" :key="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" class="col-height">
                  <el-form-item label="设备类型" prop="deviceType">
                    <el-select size="mini" v-model="formDatas.deviceType" filterable clearable placeholder="设备类型">
                      <el-option v-for="item in deviceTypeList" :label="item.label" :value="item.value" :key="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" class="col-height">
                  <el-form-item label="黑匣子编号" prop="deviceNo">
                    <el-input v-model="formDatas.deviceNo" :maxlength="20"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <div class="details-footer">
            <el-button size="small" @click="handleCancel">取 消</el-button>
            <el-button size="small" type="primary" @click="handleSubmit">保 存</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
    <el-dialog width="30%" title="批量导入" :visible.sync="uploadVisible" :close-on-click-modal="false" append-to-body>
      <div class="details-container">
        <div class="container-box details-box">
          <div class="details-body">
            <el-row>
              <el-col :xs="24" :sm="24" :md="24">
                <el-select size="mini" v-model="producer" filterable clearable placeholder="厂家" v-if="!isDis">
                  <el-option v-for="item in producerList" :label="item.label" :value="item.value" :key="item.value"></el-option>
                </el-select>
                <input type="file" id="excel-file" @change="fileChange">
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {} from '../../api/debugging.js';
import {websocketUrl} from '@/axios/base.js';
import moment from 'moment';

export default {
  data() {
    return {
      labelWidth: "100px",
      listData: [],
      operationPrex : 'factory:debugging',
      producerList: [
        {
          label: '合肥海智',
          value: 'anhuijuzheng'
        },
        {
          label: '大连腾屹',
          value: 'daliantengyi'
        }
      ],
      deviceTypeList: [
        {
          label : '扬尘',
          value : 'monitor'
        },
        {
          label : '塔吊',
          value : 'crane'
        },
        {
          label : '升降机',
          value : 'lift'
        }
      ],
      dialogVisible: false,
      formDatas : {
        producer : '',
        deviceType : '',
        deviceNo : ''
      },
      formDatasRules : {

      },
      dataList : [],
      socket : null,
      stompClient : null,
      uploadVisible : false,
      isDis : false,
      producer : ''
    };
  },
  mounted() {
    // this.linkWebsocket();
  },
  beforeDestroy() {
    this.disconnect();
  },
  methods: {
    //条件查询
    handleSearch : function() {
      this.pageIndex = 1;
      this.getListData();
    },
    //删除
    handleDelete : function(index,row) {
      this.$confirm("确认删除选中记录吗？","提示", {type: "warning"}).then(() => {
        for(let i = 0;i < this.listData.length;i++) {
          if(this.listData[i].topic == "/topic/" + row.producer + "/" + row.deviceType + "/" + row.deviceNo) {
            this.listData[i].sub.unsubscribe();
          }
        }
        this.listData.splice(index,1);
        this.dataList.splice(index,1);
      });
    },
    //点击新增按钮弹出详情页
    handleInsert : function() {
      this.formDatas = {
        isShow : false,
        deviceData : '',
        sub : null,
        topic : '',
        producer : '',
        producerName : '',
        deviceType : '',
        typeName : '',
        deviceNo : '',
        isColor : false
      };
      let user = JSON.parse(sessionStorage.getItem("user"));
      if(user.vender == '' || user.vender == null || user.vender == undefined) {
        this.isDis = false;
      }else {
        this.isDis = true;
        for(let i = 0;i < this.producerList.length;i++) {
          if(user.vender == this.producerList[i].label) {
            this.formDatas.producer = this.producerList[i].value;
          }
        }
      }
      this.dialogVisible = true;
    },
    handleLink : function(index,row) {
      let sub = this.stompClient.subscribe(
        "/topic/" + row.producer + "/" + row.deviceType + "/" + row.deviceNo,
        msg => {
          // 订阅服务端提供的某个topic
          // msg.body存放的是服务端发送给我们的信息
          this.dataList = JSON.parse(JSON.stringify(this.listData));
          for(let i = 0;i < this.listData.length;i++) {
            if(i === index) {
              this.listData[i].deviceData = moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + "   :   " + msg.body + "\r\n" + this.listData[i].deviceData;
              this.$set(this.dataList,i,this.listData[i]);
            }
          }
          this.$set(this.listData,index,Object.assign({},this.listData[index],{
            isColor : true
          }));
          //this.listData[index].isColor = true;
        }
      );
      this.listData[index].sub = sub;
      this.listData[index].topic = "/topic/" + row.producer + "/" + row.deviceType + "/" + row.deviceNo;
    },
    linkWebsocket : function() {
      // 建立连接对象
      this.socket = new SockJS(websocketUrl + "/webSocketServer"); //连接服务端提供的通信接口，连接以后才可以订阅广播消息和个人消息
      // 获取STOMP子协议的客户端对象
      this.stompClient = Stomp.over(this.socket);
      // 定义客户端的认证信息,按需求配置
      let headers = {};
      // 向服务器发起websocket连接
      this.stompClient.connect(
        headers,
        frame => {
          
        },
        err => {}
      );
    },
    handleSubmit : function() {
      this.formDatas.isShow = false;
      this.formDatas.deviceData = '';
      this.formDatas.sub = null;
      this.formDatas.topic = '';
      for(let i = 0;i < this.producerList.length;i++) {
        if(this.formDatas.producer == this.producerList[i].value) {
          this.formDatas.producerName = this.producerList[i].label;
        }
      }
      for(let i = 0;i < this.deviceTypeList.length;i++) {
        if(this.formDatas.deviceType == this.deviceTypeList[i].value) {
          this.formDatas.typeName = this.deviceTypeList[i].label;
        }
      }
      this.$set(this.listData,this.listData.length,this.formDatas);
      this.dialogVisible = false;
    },
    handleCancel : function() {
      this.$confirm("新增内容将不被保存，是否确认取消？","提示", {type: "warning"}).then(() => {
        this.dialogVisible = false;
      });
    },
    getProducer : function(data) {
        let producer = '' ;
        this.producerList.forEach(element => {
          if(data.producer ===  element.value){
            producer = element.label ; 
            return ; 
          }
        });
        
        return producer;
    },
    getType : function(data) {
      if(data.deviceType == 'lift') {
        return '升降机';
      }else if(data.deviceType == 'crane') {
        return '塔吊';
      }else if(data.deviceType == 'monitor') {
        return '扬尘';
      }
    },
    //关闭ws
    disconnect() {
      if (this.stompClient != null) {
        this.stompClient.disconnect();
      }
    },
    changeRow : function(row) {
      for(let i = 0;i < this.listData.length;i++) {
        if(i === row.index) {
          this.listData[i].isShow = true;
          this.$set(this.dataList,i,this.listData[i]);
        }else {
          this.listData[i].isShow = false;
          this.$set(this.dataList,i,this.listData[i]);
        }
      }
    },
    className : function({ row, rowIndex }) {
      row.index = rowIndex;
      if(row.isColor) {
        return 'success-row';
      }else {
        return '';
      }
    },
    cancelLink : function(index,row) {
      let dataList = JSON.parse(JSON.stringify(this.listData));
      this.listData[index].sub.unsubscribe();
      dataList[index].sub = null;
      dataList[index].isColor = false;
      this.$set(this.listData,index,dataList[index]);
    },
    batchInsert : function() {
      let user = JSON.parse(sessionStorage.getItem("user"));
      if(user.vender == '' || user.vender == null || user.vender == undefined) {
        this.isDis = false;
      }else {
        this.isDis = true;
      }
      this.uploadVisible = true;
    },
    fileChange : function(e) {
      let user = JSON.parse(sessionStorage.getItem("user"));
      var _this = this;
      var files = e.target.files;
      var fileReader = new FileReader();
      fileReader.onload = function(ev) {
        try {
          var data = ev.target.result
          var workbook = XLSX.read(data, {
            type: 'binary'
          }) // 以二进制流方式读取得到整份excel表格对象
          var fileList = []; // 存储获取到的数据
        } catch (e) {
          _this.$message({
            type : 'error',
            message : "文件类型不正确"
          });
          return;
        }
        // 表格的表格范围，可用于判断表头是否数量是否正确
        var fromTo = '';
        // 遍历每张表读取
        for (var sheet in workbook.Sheets) {
          if (workbook.Sheets.hasOwnProperty(sheet)) {
            fromTo = workbook.Sheets[sheet]['!ref'];
            fileList = fileList.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
            break; // 如果只取第一张表，就取消注释这行
          }
        }
        //在控制台打印出来表格中的数据
        for(let i = 0;i < fileList.length;i++) {
          let data = {
            isShow : false,
            deviceData : '',
            sub : null,
            topic : '',
            producer : '',
            producerName : '',
            deviceType : '',
            typeName : '',
            deviceNo : ''
          };
          if(user.vender == '' || user.vender == null || user.vender == undefined) {
            data.producer = _this.producer;
            for(let j = 0;j < _this.producerList.length;j++) {
              if(_this.producer == _this.producerList[j].value) {
                data.producerName = _this.producerList[j].label;
              }
            }
          }else {
            data.producerName = user.vender;
            for(let j = 0;j < _this.producerList.length;j++) {
              if(user.vender == _this.producerList[j].label) {
                data.producer = _this.producerList[j].value;
              }
            }
          }
          for(var key in fileList[i]) {
            if(key == '设备类型') {
              data.typeName = fileList[i][key];
              for(let j = 0;j < _this.deviceTypeList.length;j++) {
                if(fileList[i][key] == _this.deviceTypeList[j].label) {
                  data.deviceType = _this.deviceTypeList[j].value;
                }
              }
            }else if(key == '设备号') {
              data.deviceNo = fileList[i][key];
            }
            _this.$set(_this.listData,i,data);
          }
        }
        _this.uploadVisible = false;
      };
      // 以二进制方式打开文件
      fileReader.readAsBinaryString(files[0]);
    },
    getStatus : function(row) {
      if(row.isColor) {
        return '已接通';
      }else {
        return '未接通';
      }
    },
    clearFilter : function() {
      this.$refs.filterTable.clearFilter();
    },
    filterHandler(value, row, column) {
      const property = column['property'];
      return row[property] === value;
    }
  }
};
</script>

<style>
  .el-table .success-row {
    background: #03fa03;
  }
</style>

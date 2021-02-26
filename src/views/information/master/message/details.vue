<!--
 * @Author: zhouyujie 
 * @CreateTime: 2018-09-08 22:33:08 
 * @Desc: 短信模板详情
-->
<template>
    <el-dialog width="60%" :title="title" :visible.sync="dialogVisible" :close-on-click-modal="false" append-to-body>
        <div class="details-container">
            <div class="container-box details-box">
                <div class="details-body">
                    <el-tabs type="border-card" style="height:100%">
                        <el-tab-pane label="基本信息">
                            <el-form size="small" :label-width="labelWidth" :model="formDatas" :rules="formDatasRules" ref="editForm">
                                  <el-row>
                               <el-col :xs="24" :sm="24" :md="24">
                                    <el-form-item label="短信类型" prop="type">
                                        <el-select v-model="formDatas.type" clearable :disabled="edit" placeholder="请选择">
                                            <el-option  
                                            label="报警" :value="1" ></el-option>
                                             <el-option  
                                            label="预警" :value="2" ></el-option>
                                            <el-option  
                                            label="信息" :value="3" ></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="24" :sm="24" :md="24">
                                    <el-form-item label="设备类型" prop="deviceType">
                                        <el-select v-model="formDatas.deviceType" filterable  clearable :disabled="edit" placeholder="请选择">
                                            <el-option v-for="item in deviceTypes" :label="item.name" :value="item.id" :key="item.id"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="24" :sm="24" :md="24">
                                    <el-form-item label="短信标题" prop="title">
                                        <el-input v-model="formDatas.title" :disabled="edit" maxlength="50"></el-input>
                                    </el-form-item>
                                </el-col>
                                   <el-col :xs="24" :sm="24" :md="24">
                                    <el-form-item label="内容" prop="content">
                                        <el-input type="textarea" v-model="formDatas.content" :disabled="edit" :rows="8" :maxlength="200"></el-input>
                                    </el-form-item>
                                </el-col>
                                  </el-row>
                                <el-row>
                                  <el-col :xs="24" :sm="12" :md="12">
                                    <el-form-item label="预计开始发送日期" prop="sendTime" >
                                        <el-date-picker v-model="formDatas.sendTime" :disabled="edit" type="date"  value-format="yyyy-MM-dd" ></el-date-picker>
                                        <!-- <el-date-picker v-if="formDatas.sendTime" key v-model="formDatas.sendTime"  :disabled="edit" type="date" value-format="yyyy-MM-dd"></el-date-picker> -->
                                                    <!-- <el-date-picker v-else v-model="formDatas.sendTime"  :disabled="edit" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"></el-date-picker> -->
                                    </el-form-item>
                                </el-col>
                   
                            </el-row>
                              <el-row>
                                  <el-col :xs="20" :sm="20" :md="18">
                                     <el-form-item label="指定人" prop="relatedUser">
                                                

                                          <el-select v-model="formDatas.relatedUser" :disabled="editSelect"  multiple
                                              filterable allow-create default-first-option placeholder="请选择指定人">
                                            <el-option v-for="item in userList" :label="item.name" :value="item.id" :key="item.id"></el-option>
                                        </el-select>
                                    </el-form-item>
                                    
                                </el-col>
                                 <el-col :xs="6" :sm="6" :md="6" style="padding-left:5px;">
                                    <el-button size="small" @click="handleSelectAll" :disabled="edit">选择所有</el-button>
                                    <el-button size="small" @click="handleClearAll" :disabled="edit">清空所有</el-button>
                                 </el-col>
                                </el-row>
                            </el-form>
                        </el-tab-pane>
                    </el-tabs>
                </div>

                <div class="details-footer">
                    <el-button size="small" @click="handleCancel">取 消</el-button>
                    <el-button size="small" v-if="!edit" type="primary" @click="handleSubmit">保 存</el-button>
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<script>
import { getInfoApi, insertInfoApi, updateInfoApi,getUserListApi,getDeviceTypeListApi } from '../../api/message.js';


export default {
  data() {
    return {
        labelWidth: '140px',
      activeNames: [],
      relatedUser:[],
      deviceTypes:[],
      formDatas: { relatedUser:[]},
      formDatasRules: {
        type:[{ required: true, message: '请选择短信类型',trigger:"change" }],
        deviceType:[{ required: true, message: '请选择设备类型',trigger:"change" }],
         title:[{ required: true, message: '请输入短信标题',trigger:"blur" }],
         content:[{ required: true, message: '请输入内容',trigger:"blur" }],
         relatedUser:[{ required: true, message: '请选择指定人',trigger:"change" }],
         sendTime:[{ required: true, message: '请选择预计发送日期',trigger:"blur" }]


      },
      userList: [],
      //dialog模式
      edit: false,
      title: '',
      dialogVisible: false,
      editSelect:false
    };
  },
  props: {
    //dialog模式
    visible: {
      type: Boolean,
      default: function() {
        return true;
      }
    },
    routeType: {
      type: String,
      default: function() {
        return null;
      }
    },
    detailsId: {
      type: Number || String,
      default: function() {
        return null;
      }
    }
  },
  watch: {
    //dialog模式
    routeType: {
      handler: function(val, oldVal) {
        this.edit = false;
        if (val == 'insert') {
          this.title = '新增';
        } else if (val == 'update') {
          this.title = '编辑';
        } else {
          this.title = '查看';
          this.edit = true;
          this.editSelect = true;
        }
      },
      immediate: true
    },
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = val;
      },
      immediate: true
    },
    dialogVisible(val) {
      if (!val) {
        this.$emit('close', {});
      }
    }
  },
  computed: {
   
      params() {
       
      let para ={
         id:'',
         title:this.formDatas.title,
         deviceType:this.formDatas.deviceType,
         type:this.formDatas.type,
         content:this.formDatas.content,
         relatedUser:this.formDatas.relatedUser,
         sendTime:this.formDatas.sendTime
         

      } ; 
      let param = {
        body: para
      
      };
      return param;
    }
    
  
  },

  mounted() {
   
   
      this.getOtherInfo();
    
    //查看，编辑需要查看详情
    if (this.routeType == 'view' || this.routeType == 'update') {
      this.getInfo();
    }
  },
  methods: {
    //关闭
    handleCancel() {
      if (this.routeType == 'view') {
        this.dialogVisible = false; //dialog模式
      } else {
        if (this.routeType == 'insert') {
          this.$confirm('新增内容将不被保存，是否确认取消？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.dialogVisible = false
          });
        }
        if (this.routeType == 'update') {
          this.$confirm('修改内容将不被保存，是否确认取消？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
             this.dialogVisible = false
          });
        }
      }
    },
    //查询单条信息
    getInfo() {
      
      let param = {
        id: this.detailsId
      };
      getInfoApi(param).then(res => {
        if(res.data.relatedUser[0] == '0'){
             this.userList.push({ id:0, name:'所有人' });
         }
         let pa=[];
              res.data.relatedUser.forEach(function(data,index,arr){  
                pa.push(+data);  
             });  
           
             res.data.relatedUser = pa;
            this.formDatas = res.data;
      });
    },
    //查询下拉框数据
    getOtherInfo() {
       getUserListApi({}).then(res =>{
             this.userList = res.data;
             
         }
         );
         getDeviceTypeListApi().then(res =>{
             this.deviceTypes = res.data;
             
         }
         );
    },
    //保存
    handleSubmit() {
      this.$refs.editForm.validate(valid => {
      

        if (valid) {
          this.$confirm('确认保存吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.params.body.relatedUser = this.formDatas.relatedUser.join(",");
            let method;
            if (this.routeType == 'insert') {
              method = insertInfoApi(this.params);
            } else if (this.routeType == 'update') {
              this.params.body.id = this.detailsId;
              method = updateInfoApi(this.params);
            }
            
            method.then(res => {
              
              this.$message({
                message: res.message,
                type: res.success?'success':'error'
              });
              this.dialogVisible = false; //dialog模式
            });
          });
        }
      });
    },
     //选择所有人
  handleSelectAll(){
   if(this.userList.length >0){
    this.userList.push({ id:0, name:'所有人' });
    
      this.formDatas.relatedUser = this.userList.map(function(json){
      return json.id
    });
    this.formDatas.relatedUser=[0];
    this.editSelect =true;
   }
    
},
//删除所有人
  handleClearAll(){
    this.getOtherInfo() ;
    this.formDatas.relatedUser=[];
    this.editSelect =false;
  },
  }
};
</script>


<style lang="scss" scoped>
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 100%;
}
</style>

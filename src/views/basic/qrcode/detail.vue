<template>
    <div class="details-container">
        <div class="container-box details-box">
            <div class="details-body">
                <el-tabs type="border-card" style="height:100%">
                    <el-tab-pane label="基本信息">
                        <el-form size="small" :label-width="labelWidth" :model="formDatas" :rules="formDatasRules" ref="editForm">
                            <el-row>
                                    <el-col :xs="24" :sm="12" :md="12" class="itemHeight">
                                        <el-form-item label="二维码" prop="qrcode">
                                            <el-input minlength="10" maxlength="10" v-model="formDatas.qrcode" :disabled="edit||openType == 'update'" ></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :xs="24" :sm="12" :md="12" class="itemHeight">
                                        <el-form-item label="设备号" prop="deviceNo">

                                          <el-select v-model="formDatas.deviceNo" filterable placeholder="请选择">
                                              <el-option
                                                v-for="item in options"
                                                :key="item.device_no"
                                                :label="item.device_no"
                                                :value="item.device_no">
                                              </el-option>
                                            </el-select>

                                            <!-- <el-input v-model="formDatas.deviceNo" :disabled="edit" maxlength="20"></el-input> -->
                                        </el-form-item>
                                    </el-col>
                                    <!-- <el-col :xs="24" :sm="12" :md="12" class="itemHeight">
                                        <el-form-item label="二维码地址" prop="qrcodeUrl">
                                            <el-input v-model="formDatas.qrcodeUrl" :disabled="edit" maxlength="20"></el-input>
                                        </el-form-item>
                                    </el-col> -->
                               
                                <!-- <el-col :xs="24" :sm="24" :md="24">
                                    <el-form-item label="备注" prop="comments">
                                        <el-input :disabled="edit" type="textarea" v-model="formDatas.comments" maxlength="200"></el-input>
                                    </el-form-item>
                                </el-col> -->
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
</template>

<script>
import {insertBasicQrcode,updateBasicQrcode,getBasicQrcodeById,getPiles} from './api.js';
import {validatePhone,validateCard,validateName} from '@/utils/validate.js'

export default {
  components: {
  },
  data() {
    let checkPhone = (rule,value,callback) => {
      if(!validatePhone(value)) {
        return callback(new Error("请输入正确的手机号"));
      }else {
        return callback();
      }
    };
    let checkIdentityCode = (rule,value,callback) => {
      if(!validateCard(value)) {
        return callback(new Error("请输入正确的身份证号"));
      }else {
        return callback();
      }
    };
    let checkName = (rule,value,callback) => {
      if(validateName(value)) {
        return callback(new Error("姓名只能输入汉字、英文字母、数字和点"));
      }else {
        return callback();
      }
    };
    return {  
      options:[],
      labelWidth : '150px',
      formDatas: {
        qrcode : null,
        deviceNo : null,
        qrcodeUrl : null,
        comments : null,
      }, 
      formDatasRules: {
          qrcode : [
              { required: true, message: '请输入', trigger: 'blur' }
          ]
       
      }
    };
  },
  computed: {
    params() {
      let param = {
        body: this.formDatas
      };
      return param;
    }
  },
  mounted() {
     this.getPiles();
    if (
      this.openType == 'view' ||
      this.openType == 'update'
    ) {
      this.getInfo();
    }
    
  },
  methods: {
    
    getPiles(){
       getPiles().then(res=>{
          let arrs = [{"device_no":""}];
          this.options = arrs.concat(res.data) ;
          
       }); 
    },
    //打开页面时根据id查询数据给表单
    getInfo() {
      let param = {
        id: this.id
      };
      getBasicQrcodeById(param).then(res => {
        this.formDatas = res.data;
      });
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
            let method;
            if (this.openType == 'insert') {
              method = insertBasicQrcode(this.params);
            } else if (this.openType == 'update') {
              method = updateBasicQrcode(this.params);
            }
            method.then((res) => {
              if(res.code == 200) {
                this.$message({
                  type : 'success',
                  message : res.message
                });
                this.$emit('setShow',{});
              }else {
                this.$message({
                  type : 'error',
                  message : res.message
                });
              }
            });
          });
        }
      });
    },
    //取消
    handleCancel : function() {
      let msg = "";
      if (this.openType == "insert") {
        msg = "新增内容将不被保存，是否确认取消？";
      }
      if (this.openType == "update") {
        msg = "修改内容将不被保存，是否确认取消？";
      }
      if (this.openType == "view") {
        this.$emit('setShow',{});
        return;
      }
      this.$confirm(msg, "提示", {type: "warning"}).then(() => {
        this.$emit('setShow',{});
      });
    }
  },
  props : ['edit','openType','id']
};
</script>
<style lang="scss" scoped>
  .itemHeight {
    height : 50px
  }
</style>

<template>
    <div class="details-container">
        <div class="container-box details-box">
            <div class="details-body">
                <el-tabs type="border-card" style="height:100%">
                    <el-tab-pane label="基本信息">
                        <el-form size="small" :label-width="labelWidth" :model="formDatas" :rules="formDatasRules" ref="editForm">
                            <el-row>
                                    <el-col :xs="24" :sm="12" :md="12" class="itemHeight">
                                        <el-form-item label="手机号" prop="phone">
                                            <el-input v-model="formDatas.phone"  :disabled="edit||openType == 'update'" maxlength="20"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :xs="24" :sm="12" :md="12" class="itemHeight">
                                        <el-form-item label="反馈状态" prop="feedbackStatus">
                                            <el-select v-model="formDatas.feedbackStatus" filterable clearable  :disabled="edit||openType == 'update'" placeholder="请选择">
                                                <el-option v-for="item in feedbackSelect" :label="item.name" :value="item.id" :key="item.id">
                                                </el-option>
                                              </el-select>
                                      </el-form-item>
                                    </el-col>
                                    <el-col :xs="24" :sm="24" :md="24" >
                                        <el-form-item label="意见内容" prop="ideaContent">
                                            <el-input type="textarea" v-model="formDatas.ideaContent" :disabled="edit||openType == 'update'" maxlength="200"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :xs="24" :sm="12" :md="12" >
                                        <el-form-item label="处理状态" prop="status">
                                            <el-select v-model="formDatas.status" filterable clearable :disabled="edit" placeholder="请选择">
                                                <el-option v-for="item in statusSelect" :label="item.name" :value="item.id" :key="item.id">
                                                </el-option>
                                              </el-select>
                                         </el-form-item>
                                    </el-col>
                                    <el-col :xs="24" :sm="24" :md="24" >
                                        <el-form-item label="处理内容" prop="feedbackContent">
                                            <el-input type="textarea" v-model="formDatas.feedbackContent" :disabled="edit" maxlength="200"></el-input>
                                        </el-form-item>
                                    </el-col>

                                    <el-col :xs="24" :sm="24" :md="24" >
                                        <el-form-item label="备注" prop="comments">
                                          <el-input :disabled="edit" type="textarea" v-model="formDatas.comments" maxlength="200"></el-input>
                                        </el-form-item>
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
</template>

<script>
import {insertAsIdea,updateAsIdea,getAsIdeaById} from './api.js';
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
      
      labelWidth : '150px',
      statusSelect: [{ "name": "已上报", "id": 0 }, { "name": "处理中", "id": 1 }, { "name": "已处理", "id": 2 }],
      feedbackSelect: [{ "name": "未解决", "id": 0 }, { "name": "已解决", "id": 1 }],
      formDatas: {
        phone : null,
        ideaContent : null,
        feedbackContent : null,
        status : null,
        feedbackStatus : null,
        comments : null,
      }, 
      formDatasRules: {
          phone : [
              { required: true, message: '请输入', trigger: 'blur' }
          ],
          ideaContent : [
              { required: true, message: '请输入', trigger: 'blur' }
          ],
          feedbackContent : [
              { required: true, message: '请输入', trigger: 'blur' }
          ],
          status : [
              { required: true, message: '请输入处理状态', trigger: 'blur' }
          ],
          feedbackStatus : [
              { required: true, message: '请输入反馈状态', trigger: 'blur' }
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
    if (
      this.openType == 'view' ||
      this.openType == 'update'
    ) {
      this.getInfo();
    }
    
  },
  methods: {
    //打开页面时根据id查询数据给表单
    getInfo() {
      let param = {
        id: this.id
      };
      getAsIdeaById(param).then(res => {
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
              method = insertAsIdea(this.params);
            } else if (this.openType == 'update') {
              method = updateAsIdea(this.params);
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

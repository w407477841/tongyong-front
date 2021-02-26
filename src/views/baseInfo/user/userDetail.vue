<template>
    <div class="details-container">
        <div class="container-box details-box">
            <div class="details-body">
                <el-tabs type="border-card" style="height:100%">
                    <el-tab-pane label="基本信息">
                        <el-form size="small" :label-width="labelWidth" :model="formDatas" :rules="formDatasRules" ref="editForm">
                            <el-row>
                                <el-col :xs="24" :sm="12" :md="12" class="itemHeight">
                                    <el-form-item label="姓名" prop="name">
                                        <el-input v-model="formDatas.name" :disabled="edit" maxlength="20"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="24" :sm="12" :md="12" class="itemHeight">
                                    <el-form-item label="身份证号" prop="identityCode">
                                        <el-input v-model="formDatas.identityCode" :disabled="edit" maxlength="18"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="24" :sm="12" :md="12" class="itemHeight">
                                    <el-form-item label="手机号码" prop="phone">
                                        <el-input v-model="formDatas.phone" :disabled="edit" maxlength="11"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="24" :sm="12" :md="12" class="itemHeight">
                                    <el-form-item label="证书类型" prop="certificateType">
                                        <el-select v-model="formDatas.certificateType" :disabled="edit" placeholder="证书类型" :clearable="true" :filterable="true">
                                            <el-option v-for="item in certificateTypeList" :label="item.label" :value="item.value" :key="item.value"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="24" :sm="12" :md="12" class="itemHeight">
                                    <el-form-item label="证书名称" prop="certificateName">
                                        <el-input v-model="formDatas.certificateName" :disabled="edit" maxlength="20"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="24" :sm="12" :md="12" class="itemHeight">
                                    <el-form-item label="证书编号" prop="certificateNo">
                                        <el-input v-model="formDatas.certificateNo" :disabled="edit" maxlength="20"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="24" :sm="12" :md="12" class="itemHeight">
                                    <el-form-item label="开始日期" prop="beginDate">
                                        <el-date-picker v-if="formDatas.beginDate" key="beginDate1" v-model="formDatas.beginDate" :editable="false" :picker-options="beginPicker" :disabled="edit" type="date" format="yyyy-MM-dd"></el-date-picker>
                                        <el-date-picker v-else v-model="formDatas.beginDate" key="beginDate2" :editable="false" :picker-options="beginPicker" :disabled="edit" type="date" placeholder="选择日期" format="yyyy-MM-dd"></el-date-picker>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="24" :sm="12" :md="12" class="itemHeight">
                                    <el-form-item label="结束日期" prop="endDate">
                                        <el-date-picker v-if="formDatas.endDate" key="endDate1" v-model="formDatas.endDate" :editable="false" :picker-options="endPicker" :disabled="edit" type="date" format="yyyy-MM-dd"></el-date-picker>
                                        <el-date-picker v-else v-model="formDatas.endDate" key="endDate2" :editable="false" :picker-options="endPicker" :disabled="edit" type="date" placeholder="选择日期" format="yyyy-MM-dd"></el-date-picker>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="24" :sm="24" :md="24">
                                    <el-form-item label="备注">
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
import {insertUser,updateUser,getUserById,selectCetificateType} from '@/views/api/equipmentApi.js';
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
      formDatas: {
        name : '',
        identityCode : '',
        phone : '',
        certificateType : '',
        certificateName : '',
        certificateNo : '',
        beginDate : '',
        endDate : '',
        comments : '',
        status : 1
      }, 
      formDatasRules: {
        name : [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { validator: checkName, trigger: 'blur' }
        ],
        identityCode : [
          { required: true, message: '请输入身份证号', trigger: 'blur' },
          { validator: checkIdentityCode, trigger: 'blur' }
        ],
        phone : [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ],
        certificateType : [
          { required: true, message: '请选择证书类型', trigger: 'blur' }
        ],
        certificateName : [
          { required: true, message: '请输入证书名称', trigger: 'blur' }
        ],
        certificateNo : [
          { required: true, message: '请输入证书编号', trigger: 'blur' }
        ],
        beginDate : [
          { required: true, message: '请选择开始日期', trigger: 'blur' }
        ],
        endDate : [
          { required: true, message: '请选择结束日期', trigger: 'blur' }
        ]
      },
      certificateTypeList: []
    };
  },
  computed: {
    beginPicker() {
      let endTime = this.formDatas.endDate;
      return {
        disabledDate(time) {
          return time.getTime() > new Date(endTime);
        }
      };
    },
    endPicker() {
      let beginTime = this.$moment(this.formDatas.beginDate);
      return {
        disabledDate(time) {
          return time.getTime() < new Date(beginTime);
        }
      };
    },
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
    this.getCetificateType();
  },
  methods: {
    //打开页面时根据id查询数据给表单
    getInfo() {
      let param = {
        id: this.id
      };
      getUserById(param).then(res => {
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
              method = insertUser(this.params);
            } else if (this.openType == 'update') {
              method = updateUser(this.params);
            }
            method.then((res) => {
              if(res.code == 200) {
                this.$message({
                  type : 'success',
                  message : res.message
                });
                this.$emit('setShow',{sign : '关闭人员信息'});
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
        this.$emit('setShow',{sign : '关闭人员信息'});
        return;
      }
      this.$confirm(msg, "提示", {type: "warning"}).then(() => {
        this.$emit('setShow',{sign : '关闭人员信息'});
      });
    },
    //获取证书类型
    getCetificateType : function() {
      let para = {};
      selectCetificateType(para).then((res) => {
        this.certificateTypeList = res.data;
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

<template>
    <div class="details-container">
        <div class="container-box details-box">
            <div class="details-body">
                <el-tabs type="border-card" style="height:100%">
                    <el-tab-pane label="基本信息">
                        <el-form size="small" :label-width="labelWidth" :model="formDatas" :rules="formDatasRules" ref="editForm">
                            <el-row>
                                <el-col :xs="24" :sm="24" :md="24">
                                    <el-form-item label="登录名" prop="code">
                                        <el-input v-model="formDatas.code" :disabled="edit" maxlength="20"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="24" :sm="24" :md="24">
                                    <el-form-item label="手机号" prop="phone">
                                        <el-input v-model="formDatas.phone" :disabled="edit" maxlength="11"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="24" :sm="24" :md="24">
                                    <el-form-item label="名称" prop="name">
                                        <el-input v-model="formDatas.name" :disabled="edit" maxlength="20"></el-input>
                                    </el-form-item>
                                </el-col>
                                
                                <el-col :xs="24" :sm="12" :md="12">
                                    <el-form-item label="用户角色" prop="userRole">
                                        <el-input v-model="formDatas.userRole" :disabled="edit" maxlength="20" :readonly="true"></el-input>
                                    </el-form-item>
                                </el-col>
                            

                                <el-col :xs="24" :sm="12" :md="12">
                                    <el-form-item>
                                        <el-button :disabled="edit" type="primary" @click="setRole">设置角色</el-button>
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
import {insertUser,updateUser,getUserById} from '@/views/system/api/systemApi.js';
import {validatePhone} from '@/utils/validate.js'

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
    return {
      labelWidth : '150px',
      formDatas: {
        code : '',
        phone : '',
        name : '',
        userRole : '',
        comments : '',
        roleId : '',
        vender : ''
      }, 
      formDatasRules: {
        code : [
          { required: true, message: '请输入登录名', trigger: 'blur' }
        ],
        name : [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        phone : [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ]
      },
      userRoleList : [],
      roleIdList : []
    };
  },
  watch : {
    userRoles : {
      handler: function(val, oldVal) {
        this.$set(this.formDatas,'userRole',JSON.stringify(this.userRoles).replace("[",'').replace("]",'').replace(/"/g,''));
        this.roleIdList = this.roleIds;
      },
      deep:true
    }
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
      let data = JSON.parse(JSON.stringify(this.formDatas));
      let param = {
        body: Object.assign({},data,{
          userRoleList : this.userRoleList,
          userRole:data.userRole.split(",")
        })
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
      getUserById(param).then(res => {
        this.$set(res.data,'userRole',JSON.stringify(res.data.userRole).replace("[",'').replace("]",'').replace(/"/g,''));
        this.roleIdList = res.data.roleIds;
        this.formDatas = res.data;
      });
    },
    //保存
    handleSubmit() {
      for(let i = 0;i < this.roleIdList.length;i++) {
        this.$set(this.userRoleList,i,Object.assign({},{
          roleId : this.roleIdList[i]
        }));
      }
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
    setRole : function() {
      this.$emit('setShow',{sign : '打开设置角色'});
    }
  },
  props : ['edit','openType','id','userRoles','roleIds']
};
</script>


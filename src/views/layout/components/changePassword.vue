<template>
    <div class="details-container">
        <div class="container-box details-box">
            <div class="details-body">
                <el-tabs type="border-card" style="height:100%">
                    <el-tab-pane label="基本信息">
                        <el-form size="small" :label-width="labelWidth" :model="formDatas" :rules="formDatasRules" ref="editForm">
                            <el-row>
                                <el-col :xs="24" :sm="24" :md="24" class="itemHeight">
                                    <el-form-item label="原密码" prop="oldPassword">
                                        <el-input v-model="formDatas.oldPassword" :disabled="edit" maxlength="50"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="24" :sm="24" :md="24" class="itemHeight">
                                    <el-form-item label="新密码" prop="newPassword">
                                        <el-input v-model="formDatas.newPassword" :disabled="edit" maxlength="100"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="24" :sm="24" :md="24" class="itemHeight">
                                    <el-form-item label="确认新密码" prop="repeat">
                                        <el-input v-model="formDatas.repeat" :disabled="edit" maxlength="100"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                    </el-tab-pane>
                </el-tabs>
            </div>

            <div class="details-footer">
              <el-button size="small" @click="handleCancel">取 消</el-button>
              <el-button size="small" v-if="!edit" type="primary" @click="handleSubmit">确认修改</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import {changePWD} from '@/views/system/api/systemApi.js';
export default {
  components: {
    
  },
  data() {
    return {
      labelWidth: '150px',
      formDatas: { 
        newPassword : '',
        oldPassword : '',
        repeat : ''
      },
      formDatasRules: {
        oldPassword : [
          { required: true, message: '请输入原密码', trigger: 'blur' }
        ],
        newPassword : [
          { required: true, message: '请输入新密码', trigger: 'blur' }
        ],
        repeat : [
          { required: true, message: '请再一次输入新密码', trigger: 'blur' }
        ]
      }
    };
  },
  computed: {

  },
  mounted() {
  },
  methods: {
    //保存
    handleSubmit() {
      if(this.formDatas.newPassword != this.formDatas.repeat) {
        this.$message({
          type : 'error',
          message : '确认新密码和新密码不一致，请重新输入'
        });
        return;
      }
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm('确认保存吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let user = JSON.parse(sessionStorage.getItem("user"));
            let para = {
              body : {
                code : user.code,
                oldPassword : this.formDatas.oldPassword,
                password : this.formDatas.newPassword
              }
            }
            changePWD(para).then((res) => {
              if(res.code == 200) {
                this.$message({
                  type : 'success',
                  message : '修改成功，请重新登录'
                });
                this.$emit("setShow",{sign : "关闭修改密码"});
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
      this.$confirm("修改的密码将不被保存，是否确认取消？", "提示", {type: "warning"}).then(() => {
        this.$emit('setShow',{sign : '取消修改密码'});
      });
    }
  },
  props : ['edit','openType','id','placePoint']
};
</script>

<style lang="scss" scoped>
  .itemHeight {
    height : 50px
  }
</style>


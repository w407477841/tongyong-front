<template>
    <div class="details-container">
        <div class="container-box details-box">
            <div class="details-body">
                <el-tabs type="border-card" style="height:100%">
                    <el-tab-pane label="基本信息">
                        <el-form size="small" :label-width="labelWidth" :model="formDatas" :rules="formDatasRules" ref="editForm">
                            <el-row>
                                <el-col :xs="24" :sm="12" :md="12" class="itemHeight">
                                    <el-form-item label="平台名称" prop="name">
                                        <el-input v-model="formDatas.name" :disabled="edit" maxlength="20"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="24" :sm="12" :md="12" class="itemHeight" v-if="this.openType!='insert'">
                                    <el-form-item label="Topic" prop="topic">
                                        <el-input v-model="formDatas.topic" :readonly="true" :disabled="edit" maxlength="16"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="24" :sm="24" :md="24" class="itemHeight">
                                    <el-form-item label="备注" prop="comments">
                                        <el-input v-model="formDatas.comments" :disabled="edit" maxlength="200"></el-input>
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
import {insertApp,updateApp,selectAppById} from '../../api/application.js';
export default {
  components: {

  },
  data() {
    return {
      labelWidth: '150px',
      formDatas: { 
        name: '',
        topic : '',
        comments : ''
      },
      formDatasRules: {
        name : [
          { required: true, message: '请输入工程名称', trigger: 'blur' }
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
      selectAppById(param).then(res => {
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
              method = insertApp(this.params);
            } else if (this.openType == 'update') {
              method = updateApp(this.params);
            }
            method.then((res) => {
              if(res.code == 200) {
                this.$message({
                  type : 'success',
                  message : res.message
                });
                this.$emit("setShow",{sign : "关闭应用管理"});
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
        this.$emit('setShow',{sign : '关闭应用管理'});
        return;
      }
      this.$confirm(msg, "提示", {type: "warning"}).then(() => {
        this.$emit('setShow',{sign : '关闭应用管理'});
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


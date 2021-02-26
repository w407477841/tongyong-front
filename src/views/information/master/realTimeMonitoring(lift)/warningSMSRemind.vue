<template>
  <el-dialog :width="smDialogWidth" :title="title" :visible.sync="dialogVisible" append-to-body>
    <div class="details-container">
      <div class="container-box details-box">
        <div class="details-body">
          <el-tabs type="border-card" style="height:100%">
            <el-tab-pane label="基本信息">
              <el-form size="small" :label-width="labelWidth" :model="formDatas" :rules="formDatasRules" ref="editForm">
                <el-row>
                  <el-col :xs="24" :sm="24" :md="24">
                    <el-form-item label="短信模板" prop="model">

                      <el-select v-model="formDatas.model" placeholder="请选择短信模板" @change="contentChange()">
                        <el-option v-for="item in messModleList" :label="item.title" :value="item.id" :key="item.title"></el-option>
                      </el-select>

                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="24">
                    <el-form-item label="内容" prop="content">
                      <el-input type="textarea" v-model="formDatas.content" :disabled="false" :rows="8" :maxlength="200"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="12" :md="12">
                    <el-form-item label="指定人" prop="relatedUser">

                      <el-select v-model="formDatas.relatedUser" multiple filterable allow-create default-first-option placeholder="请选择指定人">
                        <el-option v-for="item in projectList" :label="item.name" :value="item.id" :key="item.name"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
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
import {

  insertInfoApi,
  updateInfoApi,
  getUserListApi,
  getMessModleListApi,
  insertMessage
} from '@/views/information/api/lift.js';

export default {
  data() {
    return {
      labelWidth: '120px',

      relatedUser: [],
      formDatas: { relatedUser: [] },
      formDatasRules: {
        model: [{ required: true, message: '请选择短信模板', trigger: 'blur' }],
        content: [{ required: true, message: '请输入内容', trigger: 'blur' }],
        relatedUser: [
          { required: true, message: '请选择指定人', trigger: 'blur' }
        ]
      },

      evaluateLevelList: [],
      messModleList: [],
      projectList: [],
      //dialog模式
      edit: false,
      title: '',
      dialogVisible: false
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

        this.title = '发送短信';
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
    paramss() {
      let param = {
        body: this.formDatas
      };
      return param;
    },
    params() {
      let para = {
        id: '',
        model: this.formDatas.model,
        title: '升降机报警',
        content: this.formDatas.content,
        relatedUser: this.formDatas.relatedUser,
        sendTime: new Date().getTime()
      };
      let param = {
        body: para
      };
      return param;
    }
  },

  mounted() {
    this.getOtherInfo();
  },
  methods: {
    contentChange() {
      this.messModleList.forEach(element => {
        if (element.id == this.formDatas.model) {
          this.formDatas.content = element.content;
        }
      });
    },
    handleCancel() {
      this.$confirm('短信内容将不被保存，是否确认取消？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.dialogVisible = false;
      });
    },
    // getInfo() {
    //   let param = {
    //     id: this.detailsId
    //   };
    //   getInfoApi(param).then(res => {
    //     let pa = [];
    //     res.relatedUser.forEach(function(data, index, arr) {
    //       pa.push(+data);
    //     });
    //     res.relatedUser = pa;
    //     this.formDatas = res;
    //   });
    // },
    //发送
    handleSubmit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm('确认保存吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let method;
            this.formDatas.craneId = this.id;
            method = insertMessage(this.paramss);

            method.then(res => {
              this.$message({
                message: res.message,
                type: res.success ? 'success' : 'error'
              });
              this.dialogVisible = false; //dialog模式
            });
          });
        }
      });
    },
    getOtherInfo() {
      let pa = {
        pageNum: 1,
        pageSize: 100
      };
      getMessModleListApi(pa).then(res => {
        this.messModleList = res.data.list;
      });
      getUserListApi().then(res => {
        this.projectList = res.data;
      });
    }
  }
};
</script>


<style lang="scss" scoped>
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 100%;
}
</style>

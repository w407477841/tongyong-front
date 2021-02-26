<template>
    <el-dialog width="50%" :title="title" :visible.sync="warningSMSRemind" append-to-body>
        <div class="details-container">
            <div class="container-box details-box">
                <div class="details-body">
                    <el-tabs type="border-card" style="height:100%">
                        <el-tab-pane label="基本信息">
                            <el-form size="small" :label-width="labelWidth" :model="formDatas" :rules="formDatasRules"
                                     ref="editForm">
                                <el-row>
                                    <el-col :xs="24" :sm="24" :md="24">
                                        <el-form-item label="短信模板" prop="model">
                                            <el-select v-model="formDatas.model" filterable clearable
                                                       placeholder="请选择" @change="getUserList">
                                                <el-option v-for="item in smsTemplates" :label="item.title"
                                                           :value="item.id" :key="item.id"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :xs="24" :sm="24" :md="24">
                                        <el-form-item label="内容" prop="content">
                                            <el-input type="textarea" v-model="formDatas.content"
                                                      maxlength="200"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :xs="24" :sm="24" :md="24">
                                        <el-form-item label="指定人" prop="relatedUserArray">
                                            <el-select v-model="formDatas.relatedUserArray" multiple
                                                       filterable allow-create default-first-option
                                                       placeholder="请选择指定人">
                                                <el-option v-for="item in nominators" :label="item.name"
                                                           :value="item.id" :key="item.id"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-form>
                        </el-tab-pane>
                    </el-tabs>
                </div>

                <div class="details-footer">
                    <el-button size="mini" @click="handleCancel">取 消</el-button>
                    <el-button size="mini" type="primary" @click="handleSubmit">发送</el-button>
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<script>
import {
  getWorkerInfo,
  getSMSTemplateList,
  handleSMSSubmit,
  getUserListApi
} from "@/views/information/api/dust.js";

export default {
  components: {},
  data() {
    return {
      labelWidth: "150px",
      activeNames: [],
      smsTemplates: [],
      nominators: [],
      monitorId: null,
      formDatas: {
        model: null,
        content: null,
        relatedUserArray: [],
        title: null
      },
      formDatasRules: {
        model: [{ required: true, message: "请选择短信模板", trigger: "blur" }],
        relatedUserArray: [
          { required: true, message: "请选择要发送的人", trigger: "blur" }
        ],
        content: [
          { required: true, message: "发送内容不能为空", trigger: "blur" }
        ]
      },
      //dialog模式
      edit: false,
      title: "短信提醒",
      warningSMSRemind: false
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
    monitorIdSMS: {
      default: function() {
        return null;
      }
    },

    content: {
      type: String,
      default: function() {
        return null;
      }
    }
  },
  watch: {
    //dialog模式
    //接收父页面传值
    monitorIdSMS: {
      handler: function(val, oldVal) {
        this.monitorId = val;
        this.edit = true;
      },
      immediate: true
    },
    //接收父页面传值
    content: {
      handler: function(val, oldVal) {
        this.formDatas.content = val;
        this.edit = true;
      },
      immediate: true
    },
    visible: {
      handler: function(val, oldVal) {
        this.warningSMSRemind = val;
      },
      immediate: true
    },
    warningSMSRemind(val) {
      if (!val) {
        this.$emit("close", {});
      }
    }
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
    //this.getWorkerInfo();
    this.getSMSTemplateList();
  },
  methods: {
    /* //获取工人下拉
             getWorkerInfo() {
                 let param = {
                     monitorId: this.monitorId
                 };
                 getUserListApi(param).then(res => {
                     this.nominators = res.data;
                 });
             },*/
    //获取短信模板下拉
    getSMSTemplateList() {
      let param = {};
      getSMSTemplateList(param).then(res => {
        this.smsTemplates = res.data;
      });
    },
    //获取工人列表并自动填充发送人
    getUserList(value) {
      for (let i = 0; i < this.smsTemplates.length; i++) {
        if (this.smsTemplates[i].id === value) {
          this.nominators = this.smsTemplates[i].userList;
          break;
        }
      }
      this.formDatas.relatedUserArray = [];
      for (let i = 0; i < this.nominators.length; i++) {
        this.formDatas.relatedUserArray.push(this.nominators[i].id);
      }
    },
    //发送短信
    handleSubmit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm("确认发送吗？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            handleSMSSubmit({ body: this.formDatas }).then(res => {
              if (res.success === true) {
                this.$message({ message: res.message, type: "success" });
                this.warningSMSRemind = false; //dialog模式
              } else {
                this.$message({ message: res.message, type: "error" });
              }
            });
          });
        }
      });
    },
    //取消
    handleCancel() {
      this.$confirm("新增内容将不被保存，是否确认取消？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.warningSMSRemind = false;
      });
    }
  }
};
</script>


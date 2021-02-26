<!--
 * @Author: hy
 * @CreateTime: 2018-09-08 22:30:40
 * @Desc: 电表指标设置详情
-->
<template>
<el-dialog width="60%" :title="title" :visible.sync="dialogVisible" append-to-body>
    <div class="details-container">
        <div class="container-box details-box">
            <div class="details-body">
                <el-tabs type="border-card" style="height:100%">
                    <el-tab-pane label="基本信息">
                        <el-form size="small" :label-width="labelWidth" :model="formDatas" :rules="formDatasRules" ref="editForm">
                            <el-row>
                                <el-col :xs="24" :sm="12" :md="12">
                                    <el-form-item label="规格型号" prop="specification">
                                        <el-input v-model="formDatas.specification" :disabled="edit" maxlength="50"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="24" :sm="12" :md="12">
                                    <el-form-item label="制造厂家" prop="manufactor">
                                        <el-input v-model="formDatas.manufactor" :disabled="edit" maxlength="50"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="24" :sm="12" :md="12">
                                    <el-form-item label="每秒耗电量(千瓦时)" prop="dissipation">
                                        <el-input-number  :max="9999999999" :precision="2" v-model="formDatas.dissipation" :controls="false" :disabled="edit" ></el-input-number>
                                    </el-form-item>
                                </el-col>
                                
                                <el-col :xs="24" :sm="24" :md="24">
                                    <el-form-item label="备注" prop="comments">
                                        <el-input type="textarea" v-model="formDatas.comments" :disabled="edit" :rows="4" :maxlength="200"></el-input>
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
</el-dialog>
</template>

<script>
import {
  insertInfoApi,
  updateInfoApi,
  getInfoApi,
  check
} from "../../api/targetSetElectric.js";
export default {
  data() {
    return {
      labelWidth: "150px",
      activeNames: [],
      formDatas: {},
      formDatasRules: {
        specification: [
          { required: true, message: "请输入规格型号", trigger: "blur" }
        ],
        manufactor: [
          { required: true, message: "请输入制造厂家", trigger: "blur" }
        ],
        maxWeight: [
          { required: true, message: "请输入每秒耗电量", trigger: "blur" }
        ]
      },
      edit: false,
      title: "",
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
        if (val == "insert") {
          this.title = "新增";
        } else if (val == "update") {
          this.title = "编辑";
        } else {
          this.title = "查看";
          this.edit = true;
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
    //根据类型判断是否要加载数据
    if (this.routeType == "view" || this.routeType == "update") {
      this.getInfo();
    }
    this.editFormRef = this.$refs.editForm;
  },
  methods: {
    //保存操作
    handleSubmit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm("确认保存吗？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            let param = {
              body: {
                specification: this.formDatas.specification,
                id: this.formDatas.id,
                manufactor: this.formDatas.manufactor
              }
            };
            //判重
            check(param).then(res => {
              if (res.data > 0) {
                this.$message({
                  type: "error",
                  message: "规格型号和制造厂家不能同时重复"
                });
              } else {
                let method;
                if (this.routeType == "insert") {
                  method = insertInfoApi(this.params);
                } else if (this.routeType == "update") {
                  this.params.body.id = this.detailsId;
                  method = updateInfoApi(this.params);
                }
                method.then(() => {
                  this.dialogVisible = false;
                });
                //判断类型弹出新增或编辑成功
                if (this.routeType == "insert") {
                  this.$message({
                    type: "success",
                    message: "新增成功"
                  });
                }
                if (this.routeType == "update") {
                  this.$message({
                    type: "success",
                    message: "编辑成功"
                  });
                }
              }
            });
          });
        }
      });
    },
    //取消操作
    handleCancel() {
      if (this.routeType == "view") {
        this.dialogVisible = false; //dialog模式
      } else {
        if (this.routeType == "insert") {
          this.$confirm("新增内容将不被保存，是否确认取消？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            this.dialogVisible = false;
          });
        }
        if (this.routeType == "update") {
          this.$confirm("修改内容将不被保存，是否确认取消？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            this.dialogVisible = false;
          });
        }
      }
    },
    //查询单条
    getInfo() {
      let param = {
        id: this.detailsId
      };
      getInfoApi(param).then(res => {
        this.formDatas = res.data;
      });
    }
  }
};
</script>

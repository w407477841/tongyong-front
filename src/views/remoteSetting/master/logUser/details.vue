<!--
 * @Author: hy
 * @CreateTime: 2018-09-08 22:30:40
 * @Desc: 日志人员设置详情
-->
<template>
  <el-dialog
    width="60%"
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    append-to-body
  >
    <div class="details-container">
      <div class="container-box details-box">
        <div class="details-body">
          <el-tabs type="border-card" style="height:100%">
            <el-tab-pane label="基本信息">
              <el-form
                size="small"
                :label-width="labelWidth"
                :model="formDatas"
                :rules="formDatasRules"
                ref="editForm"
              >
                <el-row>
                  <el-col :xs="24" :sm="24" :md="24">
                    <el-form-item label="设备类型" prop="deviceType">
                      <el-select
                        v-model="formDatas.deviceType"
                        filterable
                        clearable
                        :disabled="edit"
                        placeholder="请选择"
                      >
                        <el-option
                          v-for="item in typeList"
                          :label="item.name"
                          :value="item.id"
                          :key="item.id"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="24">
                    <el-form-item label="发送用户" prop="userIdList">
                      <el-select
                        v-model="formDatas.userIdList"
                        multiple
                        :disabled="edit"
                        filterable
                        default-first-option
                        placeholder="请选择发送用户"
                      >
                        <el-option
                          v-for="item in sendUsers"
                          :label="item.name"
                          :value="item.id+''"
                          :key="item.id"
                        ></el-option>
                      </el-select>
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
  getUserListApi,
  insertInfoApi,
  getInfoApi,
  updateInfoApi
} from "@/views/remoteSetting/api/logUser.js";
import { getDeviceTypeListApi } from "../../api/version.js";

export default {
  data() {
    return {
      labelWidth: "150px",
      typeList: [],
      edit: false,
      title: "",
      dialogVisible: false,
      sendUsers: [],
      formDatas: {
        deviceType: null,
        userIdList: []
      },
      formDatasRules: {
        deviceType: [
          { required: true, message: "请选择设备类型", trigger: "blur" }
        ],
        userIdList: [
          { required: true, message: "请选择发送用户", trigger: "blur" }
        ]
      }
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
        if (val === "insert") {
          this.title = "新增";
        } else if (val === "update") {
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
    getDeviceTypeListApi().then(res => {
      this.typeList = res.data;
    });
    getUserListApi().then(res => {
      this.sendUsers = res.data;
    });
    //根据类型判断是否要加载数据
    if (this.routeType == "view" || this.routeType == "update") {
      this.getInfo();
    }
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
          }).then(res => {
            if (this.routeType === "insert") {
              insertInfoApi(this.params).then(res => {
                this.$message({
                  message: res.message,
                  type: res.success ? "success" : "error"
                });
                this.dialogVisible = false;
                this.handleSearch();
              });
            } else if (this.routeType === "update") {
              this.params.body.id = this.detailsId;
              updateInfoApi(this.params).then(res => {
                this.$message({
                  message: res.message,
                  type: res.success ? "success" : "error"
                });
                this.dialogVisible = false;
                this.handleSearch();
              });
            }
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

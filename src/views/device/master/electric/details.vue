
<!--
 * @Author: hy
 * @CreateTime: 2018-09-08 22:30:40
 * @Desc: 电表管理详情
-->
<template>
  <section>
    <el-dialog width="80%" :title="title" :visible.sync="dialogVisible" append-to-body>
        <div class="details-container">
            <div class="container-box details-box">
                <div class="details-body">
                    <el-tabs type="border-card" style="height:100%" v-model="activeName2">
                        <el-tab-pane label="基本信息" name="first">
                            <el-form size="small" :label-width="labelWidth" :model="formDatas" :rules="formDatasRules" ref="editForm">
                                <el-collapse v-model="activeNames">
                                    <el-collapse-item title="基本信息" name="1">
                                        <el-row>
                                            <el-col :xs="24" :sm="24" :md="12" style="height: 50px;">
                                                <el-form-item label="工程名称" prop="projectName" >
                                                    <el-input v-model="formDatas.projectName" clearable :disabled="edit" readonly :maxlength="50">
                                                        <el-button slot="append" icon="el-icon-search" @click="openProject"  :disabled="edit"></el-button>
                                                    </el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :xs="24" :sm="24" :md="12" style="height: 50px;">
                                                <el-form-item label="设备名称" prop="name">
                                                    <el-input v-model="formDatas.name" :disabled="edit" :maxlength="20"></el-input>

                                                </el-form-item>
                                            </el-col>
                                            <el-col :xs="24" :sm="24" :md="12" style="height: 50px;">
                                                <el-form-item label="黑匣子编号" prop="deviceNo">
                                                    <el-input v-model="formDatas.deviceNo" :disabled="edit" :maxlength="20"></el-input>

                                                </el-form-item>
                                            </el-col>
                                            <el-col :xs="24" :sm="24" :md="12" style="height: 50px;">
                                                <el-form-item label="采集器编号" prop="collecterNo">
                                                    <el-input v-model="formDatas.collecterNo" :disabled="edit" :maxlength="20"></el-input>

                                                </el-form-item>
                                            </el-col>
                                            <el-col :xs="24" :sm="24" :md="12" style="height: 50px;">
                                                <el-form-item label="经纬度">
                                                    <el-input v-model="formDatas.placePoint" clearable :disabled="edit" readonly :maxlength="50">
                                                        <el-button slot="append" icon="el-icon-search" @click="mapShow"  :disabled="edit"></el-button>
                                                    </el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :xs="24" :sm="24" :md="12" style="height: 50px;">
                                                <el-form-item label="GPRS" prop="gprs">
                                                    <el-input-number :precision="0" :max="99999999999" v-model="formDatas.gprs" :controls="false" :disabled="edit"></el-input-number>
                                                    <!-- <el-input v-model="formDatas.gprs" :disabled="edit" :maxlength="20"></el-input> -->
                                                    <!-- <el-input v-model="formDatas.grps" :disabled="edit" :maxlength="50"></el-input> -->
                                                </el-form-item>
                                            </el-col>

                                            <el-col :xs="24" :sm="24" :md="12" style="height: 50px;">
                                                <el-form-item label="类别" >
                                                    <el-select v-model="formDatas.type" filterable  clearable  :disabled="edit" placeholder="请选择">
                                                        <el-option v-for="item in typeList" :label="item.name" :value="item.id" :key="item.id"></el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </el-col>

                                            <el-col :xs="24" :sm="24" :md="12" style="height: 50px;">
                                                <el-form-item label="互感系数" prop="ratio">
                                                    <el-input-number :precision="0" :max="99999999999" v-model="formDatas.ratio" :controls="false" :disabled="edit"></el-input-number>
                                                </el-form-item>
                                            </el-col>

                                        </el-row>
                                    </el-collapse-item>
                                    <el-collapse-item title="指标信息" name="2">
                                  <el-row>
                                    <el-col :xs="24" :sm="24" :md="12" style="height: 50px;">
                                        <el-form-item label="指标类型" >
                                          <el-select v-model="formDatas.specification" filterable  @change="changeValue"  clearable  :disabled="edit" placeholder="请选择">
                                            <el-option v-for="item in targetList" :label="item.specification" :value="item.id" :key="item.id"></el-option>
                                        </el-select>
                                        </el-form-item>
                                    </el-col>

                                    <el-col :xs="24" :sm="24" :md="12" style="height: 50px;">
                                        <el-form-item label="制造厂家" prop="manufactor">
                                            <el-input v-model="formDatas.manufactor" :disabled="edit"
                                                      :maxlength="50"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :xs="24" :sm="24" :md="12" style="height: 50px;">
                                        <el-form-item label="每秒耗电量(千瓦时) " prop="dissipation">
                                            <el-input-number :precision="0" :max="9999999999" v-model="formDatas.dissipation" :controls="false" :disabled="edit"></el-input-number>
                                        </el-form-item>
                                    </el-col>
                                    </el-row>


                                </el-collapse-item>
                                    <el-collapse-item title="备注信息" name="3">
                                        <el-col :xs="24" :sm="24" :md="24">
                                            <el-input type="textarea" v-model="formDatas.comments" :disabled="edit" :rows="4" :maxlength="200"></el-input>

                                        </el-col>
                                    </el-collapse-item>
                                </el-collapse>
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
        <!-- <el-dialog title="工程地点" :visible.sync="mapVisible" :close-on-click-modal="false" width="80%" v-if="mapVisible"> -->
        <map-baidu :visible.sync="mapVisible" v-if="mapVisible"  @showPoint="showPoint"></map-baidu>
        <!-- </el-dialog> -->
    </el-dialog>
    <el-dialog width="80%" title="选择工程" :visible.sync="projectVisible" :close-on-click-modal="false" append-to-body>
      <org-project @setShow="setShow"></org-project>
    </el-dialog>
    </section>
</template>

<script>
import {
  insertInfoApi,
  updateInfoApi,
  getProjectListApi,
  getInfoApi,
  getTargetListApi
} from "../../api/electric.js";
import { validateIp, validatePort } from "@/utils/validate.js";
import mapBaidu from "./mapBaidu";
import OrgProject from "@/components/orgProject/orgProject"

export default {
  components: {
    mapBaidu,
    OrgProject
  },
  data() {
    return {
      labelWidth: "100px",
      activeNames: ["1", "2", "3"],
      activeName2: "first",
      formDatas: {},
      other: false,
      cameraInfo: [],
      formDatasRules: {
        projectName: [
          { required: true, message: "请选择工程名称", trigger: "blur" }
        ],
        deviceNo: [
          { required: true, message: "请输入黑匣子编号", trigger: "blur" }
        ],
        specification: [
          { required: true, message: "请选择指标类型", trigger: "change" }
        ],
        placePoint: [
          { required: true, message: "请选择经纬度", trigger: "change" }
        ],
        type: [{ required: true, message: "请选择类型", trigger: "change" }]
      },
      projectList: [],
      targetList: [],
      deviceNoBack: "",
      projectIdBack: 0,
      tempCode: this.activeCode,
      edit: false,
      //dialog模式
      title: "",
      dialogVisible: false,
      mapVisible: false,
      center: { lng: 0, lat: 0 },
      typeList: [{ id: 1, name: "生活用电" }, { id: 2, name: "生产用电" }],
      projectVisible : false
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

    activeCode: {
      type: Number,
      default: function() {
        return 0;
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
    tempCode: {
      handler: function(val, oldVal) {
        if (val == 1) {
          this.activeName2 = "second";
        }
      },
      immediate: true
    },
    //指标类型赋值
    formDatas: {
      handler: function(val, oldVal) {
        this.targetList.forEach(element => {
          if (element.id == this.formDatas.specification) {
            this.formDatas.specification = element.specification;
            this.formDatas.manufactor = element.manufactor;
            this.formDatas.dissipation = element.dissipation;
          }
        });
      },
      immediate: true,
      deep: true
    },

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
        this.activeName2 = "first";
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
    this.getOtherInfo();
    if (this.routeType == "view" || this.routeType == "update") {
      this.getInfo();
    }
  },
  methods: {
    //关闭弹窗
    showPoint(data) {
      this.mapVisible = false;
      //   this.dialogVisible =true;

      this.formDatas = Object.assign({}, this.formDatas, {
        placePoint: data.lng ? data.lng + "," + data.lat : ""
        //   placePoint : data.lng ? JSON.stringify(data) : ''
      });
    },
    //打开地图
    mapShow() {
      this.mapVisible = true;

    },
    //查询下拉框内容
    getOtherInfo() {
      getProjectListApi({}).then(res => {
        this.projectList = res.data;
      });
      getTargetListApi({}).then(res => {
        this.targetList = res.data;
      });
    },
    //查询单条
    getInfo() {
      let param = {
        id: this.detailsId
      };
      getInfoApi(param).then(res => {
        this.formDatas = res.data;
        this.deviceNoBack = res.data.deviceNo;
        this.projectIdBack = res.data.projectId;
      });
    },
    //下拉框选中值变化后赋值
    changeValue() {
      this.formDatas.manufactor = this.manufactor;
      this.formDatas.dissipation = this.dissipation;
    },
    //关闭
    handleCancel() {
      let message;
      if (this.routeType == "view") {
        this.dialogVisible = false;
      } else {
        if (this.routeType == "insert") {
          message = "新增内容将不被保存，是否确认取消？";
        }
        if (this.routeType == "update") {
          message = "修改内容将不被保存，是否确认取消？";
        }
        this.$confirm(message, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.dialogVisible = false;
          })
          .catch(() => {});
      }
    },
    //保存
    handleSubmit() {
      this.formDatas.createTime = "";
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm("确认保存吗？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            let param = {
              body: {
                deviceNo: this.formDatas.deviceNo,
                projectId:
                  this.formDatas.projectId == null
                    ? 0
                    : this.formDatas.projectId
              }
            };
            let method;
            if (this.routeType == "insert") {
              method = insertInfoApi(this.params);
            } else if (this.routeType == "update") {
              method = updateInfoApi(this.params);
            }
            method.then(res => {
              this.$message({ type: "success", message: res.message });
              this.dialogVisible = false;
            });
          });
        }
      });
    },
    setShow : function(data) {
      if(data.sign == '关闭组织工程') {
        this.projectVisible = false;
        if(data.data != null && data.data != undefined && data.data != '') {
          this.formDatas.projectId = data.data.id;
          this.formDatas.projectName = data.data.name;
        }
      }
    },
    openProject : function() {
      this.projectVisible = true;
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

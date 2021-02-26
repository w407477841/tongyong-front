<!--
 * @Author: xss
 * @CreateTime: 2018-09-08 22:30:40
 * @Desc: 扬尘指标设置详情
-->
<template>
<el-dialog width="60%" :title="title" :visible.sync="dialogVisible" append-to-body>
    <div class="details-container">
        <div class="container-box details-box">
            <div class="details-body">
                <el-tabs type="border-card" style="height:100%">
                    <el-tab-pane label="基本信息">
                        <el-form size="small" :label-width="labelWidth" :model="formDatas" :close-on-click-modal="false" :rules="formDatasRules" ref="editForm">
                            <el-row>
                                <el-col :xs="24" :sm="12" :md="12" class="col-height">
                                    <el-form-item label="规格型号" prop="specification" >
                                        <el-input v-model="formDatas.specification" :disabled="edit" maxlength="50"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="24" :sm="12" :md="12" class="col-height">
                                    <el-form-item label="制造厂家" prop="manufactor">
                                        <el-input v-model="formDatas.manufactor" :disabled="edit" maxlength="50"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="24" :sm="12" :md="12" class="col-height">
                                    <el-form-item label="PM10(μg/m³)" prop="pm10">
                                        <el-input-number  :max="9999999999" :precision="2" v-model="formDatas.pm10" :controls="false" :disabled="edit" ></el-input-number>
                                    </el-form-item>
                                </el-col>

                                <el-col :xs="24" :sm="12" :md="12" class="col-height">
                                    <el-form-item label="PM2.5(μg/m³)" prop="pm25">
                                        <el-input-number  :max="9999999999" :precision="2" v-model="formDatas.pm25" :controls="false" :disabled="edit" ></el-input-number>
                                    </el-form-item>
                                </el-col>

                                <el-col :xs="24" :sm="12" :md="12" class="col-height">
                                    <el-form-item label="噪音(分贝)" prop="noise">
                                        <el-input-number  :max="9999999999" :precision="2" v-model="formDatas.noise" :controls="false" :disabled="edit" ></el-input-number>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="24" :sm="12" :md="12" class="col-height">
                                    <el-form-item label="风速(m/s)" prop="windSpeed">
                                        <el-input-number  :max="9999999999" :precision="2" v-model="formDatas.windSpeed" :controls="false" :disabled="edit" ></el-input-number>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="24" :sm="12" :md="12" class="col-height">
                                    <el-form-item label="温度(℃)" >
                                      <el-col :xs="24" :sm="11" :md="11" prop="temperatureMin">
                                        <el-input-number  :max="9999999999" :precision="2" v-model="formDatas.temperatureMin" :controls="false" :disabled="edit" ></el-input-number>
                                      </el-col>
                                      <el-col :xs="24" :sm="2" :md="2" style="text-align: center;">
                                        <span >~</span>
                                      </el-col>
                                      <el-col :xs="24" :sm="11" :md="11" temperatureMax>
                                        <el-input-number  :max="9999999999" :precision="2" v-model="formDatas.temperatureMax" :controls="false" :disabled="edit" ></el-input-number>
                                      </el-col>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="24" :sm="12" :md="12" class="col-height">
                                    <!-- <el-form-item label="湿度(%rh)" prop="humidity">
                                        <el-input-number  :max="9999999999" :precision="2" v-model="formDatas.humidity" :controls="false" :disabled="edit" ></el-input-number>
                                    </el-form-item> -->
                                    <el-form-item label="湿度(%rh)" >
                                      <el-col :xs="24" :sm="11" :md="11" prop="humidityMin">
                                        <el-input-number  :max="9999999999" :precision="2" v-model="formDatas.humidityMin" :controls="false" :disabled="edit" ></el-input-number>
                                      </el-col>
                                      <el-col :xs="24" :sm="2" :md="2" style="text-align: center;">
                                        <span >~</span>
                                      </el-col>
                                      <el-col :xs="24" :sm="11" :md="11" humidityMax>
                                        <el-input-number  :max="9999999999" :precision="2" v-model="formDatas.humidityMax" :controls="false" :disabled="edit" ></el-input-number>
                                      </el-col>
                                    </el-form-item>
                                </el-col>

                                <el-col :xs="24" :sm="12" :md="12" class="col-height">
                                    <el-form-item label="TSP(μg/m³)" prop="tsp">
                                        <el-input-number  :max="9999999999" :precision="2" v-model="formDatas.tsp" :controls="false" :disabled="edit" ></el-input-number>
                                    </el-form-item>
                                </el-col>

                                <el-col :xs="24" :sm="12" :md="12" class="col-height"> 
                                    <el-form-item label="风力" prop="windForce">
                                        <el-input-number  :max="9999999999" :precision="2" v-model="formDatas.windForce" :controls="false" :disabled="edit" ></el-input-number>
                                    </el-form-item>
                                </el-col>

                                <el-col :xs="24" :sm="12" :md="12" class="col-height">
                                    <el-form-item label="大气压(pa)" prop="atmospheric">
                                        <el-input-number  :max="9999999999" :precision="2" v-model="formDatas.atmospheric" :controls="false" :disabled="edit" ></el-input-number>
                                    </el-form-item>
                                </el-col>

                                <el-col :xs="24" :sm="24" :md="24" class="col-height">
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
} from "../../api/environment.js";
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
    //根据类型判断是否需要加载数据
    if (this.routeType == "view" || this.routeType == "update") {
      this.getInfo();
    }
    this.editFormRef = this.$refs.editForm;
  },
  methods: {
    //保存操作
    handleSubmit() {
      //判断温度区间
      if (
        this.formDatas.temperatureMin != null &&
        this.formDatas.temperatureMax != null
      ) {
        if (this.formDatas.temperatureMin > this.formDatas.temperatureMax) {
          this.$message({
            type: "error",
            message: "最小温度不能大于最大温度！"
          });
          return;
        }
      }
      //判断湿度区间
      if (
        this.formDatas.humidityMin != null &&
        this.formDatas.humidityMax != null
      ) {
        if (this.formDatas.humidityMin > this.formDatas.humidityMax) {
          this.$message({
            type: "error",
            message: "最小湿度不能大于最大湿度！"
          });
          return;
        }
      }
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
        //dialog模式
        this.dialogVisible = false;
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
<style>
.col-height {
  height: 50px;
}
</style>

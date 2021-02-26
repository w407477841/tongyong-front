<!--
 * @Author: xss
 * @CreateTime: 2018-09-08 22:30:40
 * @Desc: 塔吊详情
-->
<template>
  <section>
    <el-dialog
      width="80%"
      :title="title"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      append-to-body
    >
      <div class="details-container">
        <div class="container-box details-box">
          <div class="details-body">
            <el-tabs type="border-card" style="height:100%" v-model="activeName2">
              <el-tab-pane label="基本信息" name="first">
                <el-form
                  size="small"
                  :label-width="labelWidth"
                  :model="formDatas"
                  :rules="formDatasRules"
                  ref="editForm"
                >
                  <el-collapse v-model="activeNames">
                    <el-collapse-item title="基本信息" name="1">
                      <el-row>
                        <el-col :xs="8" :sm="8" :md="8" class="col-height">
                          <el-form-item label="工程名称" prop="projectName">
                            <el-input
                              v-model="formDatas.projectName"
                              size="mini"
                              clearable
                              :disabled="edit"
                              readonly
                              :maxlength="50"
                            >
                              <el-button
                                slot="append"
                                icon="el-icon-search"
                                @click="openProject"
                                :disabled="edit"
                              ></el-button>
                            </el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :xs="8" :sm="8" :md="8" class="col-height">
                          <el-form-item label="塔机编号" prop="craneNo">
                            <el-input v-model="formDatas.craneNo" :disabled="isupdate" :maxlength="20"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :xs="8" :sm="8" :md="8" class="col-height">
                          <el-form-item label="设备名称" prop="name">
                            <el-input v-model="formDatas.name" :disabled="edit" :maxlength="20"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :xs="8" :sm="8" :md="8" class="col-height">
                          <el-form-item label="设备出厂日期" prop="productionDate">
                            <el-date-picker
                              v-model="formDatas.productionDate"
                              :disabled="edit"
                              type="date"
                              placeholder="选择日期"
                              format="yyyy-MM-dd"
                            ></el-date-picker>
                          </el-form-item>
                        </el-col>
                        <el-col :xs="8" :sm="8" :md="8" class="col-height">
                          <el-form-item label="塔机型号" prop="specification">
                            <el-input
                              v-model="formDatas.specification"
                              :disabled="edit"
                              :maxlength="20"
                            ></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :xs="8" :sm="8" :md="8" class="col-height">
                          <el-form-item label="备案编号" prop="identifier">
                            <el-input
                              v-model="formDatas.identifier"
                              :disabled="edit"
                              :maxlength="20"
                            ></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :xs="8" :sm="8" :md="8" class="col-height">
                          <el-form-item label="制造厂家" prop="manufactor">
                            <el-input
                              v-model="formDatas.manufactor"
                              :disabled="edit"
                              :maxlength="50"
                            ></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :xs="8" :sm="8" :md="8" class="col-height">
                          <el-form-item label="制造许可" prop="licence">
                            <el-input v-model="formDatas.licence" :disabled="edit" :maxlength="20"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :xs="8" :sm="8" :md="8" class="col-height">
                          <el-form-item label="产权单位" prop="owner" class="col-height">
                            <el-input v-model="formDatas.owner" :disabled="edit" :maxlength="50"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :xs="8" :sm="8" :md="8" class="itemHeight">
                          <el-form-item label="检测日期" prop="testDate">
                            <el-date-picker
                              v-model="formDatas.testDate"
                              :disabled="edit"
                              type="date"
                              placeholder="选择日期"
                              format="yyyy-MM-dd"
                            ></el-date-picker>
                          </el-form-item>
                        </el-col>
                        <el-col :xs="8" :sm="8" :md="8" class="col-height">
                          <el-form-item label="安装单位" prop="assembleUnit">
                            <el-input
                              v-model="formDatas.assembleUnit"
                              :disabled="edit"
                              :maxlength="20"
                            ></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :xs="8" :sm="8" :md="8" class="itemHeight">
                          <el-form-item label="安装日期" prop="craneAssembleDate">
                            <el-date-picker
                              v-model="formDatas.craneAssembleDate"
                              :disabled="edit"
                              type="date"
                              placeholder="选择日期"
                              format="yyyy-MM-dd"
                            ></el-date-picker>
                          </el-form-item>
                        </el-col>
                        <el-col :xs="8" :sm="8" :md="8" class="col-height">
                          <el-form-item label="位置" prop="placePoint" class="col-height">
                            <el-input
                              v-model="formDatas.placePoint"
                              clearable
                              :disabled="edit"
                              readonly
                              :maxlength="50"
                            >
                              <el-button
                                slot="append"
                                icon="el-icon-search"
                                @click="mapShow"
                                :disabled="edit"
                              ></el-button>
                            </el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :xs="8" :sm="8" :md="8" class="itemHeight">
                          <el-form-item label="预计拆除日期" prop="disassembleDate">
                            <el-date-picker
                              v-model="formDatas.disassembleDate"
                              :disabled="edit"
                              type="date"
                              placeholder="选择日期"
                              format="yyyy-MM-dd"
                            ></el-date-picker>
                          </el-form-item>
                        </el-col>
                      </el-row>
                    </el-collapse-item>
                    <el-collapse-item title="指标信息" name="2">
                      <el-row>
                        <el-col :xs="8" :sm="8" :md="8" class="col-height">
                          <el-form-item label="最大幅度(m)" prop="maxRange">
                            <el-input-number
                              :max="100"
                              :precision="2"
                              v-model="formDatas.maxRange"
                              :controls="false"
                              :disabled="edit"
                            ></el-input-number>
                          </el-form-item>
                        </el-col>
                        <el-col :xs="8" :sm="8" :md="8" class="col-height">
                          <el-form-item label="最大力矩/起重量(t.m/t)" prop="fixMoment">
                            <el-input-number
                              :max="99999999"
                              :precision="2"
                              v-model="formDatas.fixMoment"
                              :controls="false"
                              :disabled="edit"
                            ></el-input-number>
                          </el-form-item>
                        </el-col>
                        <el-col :xs="8" :sm="8" :md="8" class="col-height">
                          <el-form-item label="最大起重量(t)" prop="maxWeight">
                            <el-input-number
                              :max="99999999"
                              :precision="2"
                              v-model="formDatas.maxWeight"
                              :controls="false"
                              :disabled="edit"
                            ></el-input-number>
                          </el-form-item>
                        </el-col>
                        <el-col :xs="8" :sm="8" :md="8" class="col-height">
                          <el-form-item label="当前高度(m)" prop="currentHeight">
                            <el-input-number
                              :max="99999999"
                              :precision="2"
                              v-model="formDatas.currentHeight"
                              :controls="false"
                              :disabled="edit"
                            ></el-input-number>
                          </el-form-item>
                        </el-col>
                        <el-col :xs="8" :sm="8" :md="8" class="col-height">
                          <el-form-item label="独立高度(m)" prop="standardHeight">
                            <el-input-number
                              :max="99999999"
                              :precision="2"
                              v-model="formDatas.standardHeight"
                              :controls="false"
                              :disabled="edit"
                            ></el-input-number>
                          </el-form-item>
                        </el-col>
                        <el-col :xs="8" :sm="8" :md="8" class="col-height">
                          <el-form-item label="附着道数" prop="turn">
                            <el-input-number
                              :max="99999999"
                              :precision="2"
                              v-model="formDatas.turn"
                              :controls="false"
                              :disabled="edit"
                            ></el-input-number>
                          </el-form-item>
                        </el-col>
                        <el-col :xs="8" :sm="8" :md="8" class="col-height">
                          <el-form-item label="风速(m/s)" prop="windSpeed">
                            <el-input-number
                              :max="99999999"
                              :precision="2"
                              v-model="formDatas.windSpeed"
                              :controls="false"
                              :disabled="edit"
                            ></el-input-number>
                          </el-form-item>
                        </el-col>
                        <el-col :xs="8" :sm="8" :md="8" class="col-height">
                          <el-form-item label="倾角(°)" prop="tiltAngle">
                            <el-input-number
                              :max="99999999"
                              :precision="2"
                              v-model="formDatas.tiltAngle"
                              :controls="false"
                              :disabled="edit"
                            ></el-input-number>
                          </el-form-item>
                        </el-col>
                        <el-col :xs="8" :sm="8" :md="8" class="col-height">
                          <el-form-item label="倍率" prop="multipleRate">
                            <el-input-number
                              :max="99999999"
                              :precision="2"
                              v-model="formDatas.multipleRate"
                              :controls="false"
                              :disabled="edit"
                            ></el-input-number>
                          </el-form-item>
                        </el-col>
                      </el-row>
                    </el-collapse-item>
                    <el-collapse-item title="安装信息" name="3">
                      <el-row>
                        <el-col :xs="8" :sm="8" :md="8" class="col-height">
                          <el-form-item label="黑匣子编号" prop="deviceNo">
                            <el-input :maxlength="20" v-model="formDatas.deviceNo" :disabled="isupdate"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :xs="8" :sm="8" :md="8" class="col-height">
                          <el-form-item label="黑匣子型号" prop="model">
                            <el-input :maxlength="10" v-model="formDatas.model" :disabled="edit"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :xs="8" :sm="8" :md="8" class="col-height">
                          <el-form-item label="安装日期" prop="assembleDate">
                            <el-date-picker
                              v-model="formDatas.assembleDate"
                              :disabled="edit"
                              type="date"
                              placeholder="选择日期"
                              format="yyyy-MM-dd"
                            ></el-date-picker>
                          </el-form-item>
                        </el-col>
                        <el-col :xs="8" :sm="8" :md="8" class="col-height">
                          <el-form-item label="SIM卡号" prop="gprs">
                            <el-input :maxlength="20" v-model="formDatas.gprs" :disabled="edit"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :xs="8" :sm="8" :md="8" class="col-height">
                          <el-form-item label="黑匣子生产厂商" prop="deviceManufactor">
                            <el-input
                              :maxlength="50"
                              v-model="formDatas.deviceManufactor"
                              :disabled="edit"
                            ></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :xs="8" :sm="8" :md="8" class="col-height">
                          <el-form-item label prop="deviceManufactor"></el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="24" class="checkboxGroup">
                          <el-form-item label="功能配置" prop="functionConfig">
                            <el-checkbox-group v-model="functionConfig" @change="groupchnage">
                              <el-checkbox label="0" :disabled="edit">小车变幅传感器</el-checkbox>
                              <el-checkbox label="1" :disabled="edit">高度检测传感器</el-checkbox>
                              <el-checkbox label="2" :disabled="edit">吊重检测传感器</el-checkbox>
                              <el-checkbox label="3" :disabled="edit">现场风速传感器</el-checkbox>
                              <el-checkbox label="4" :disabled="edit">塔吊回转传感器</el-checkbox>
                              <el-checkbox label="5" :disabled="edit">继电器输出控制</el-checkbox>
                              <el-checkbox label="6" :disabled="edit">防倾翻传感器</el-checkbox>
                            </el-checkbox-group>
                          </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="24" class="checkboxGroup">
                          <el-form-item label="识别模块" prop="recognitionConfig">
                            <el-checkbox-group v-model="recognitionConfig" @change="groupchnage2">
                              <el-checkbox label="0" :disabled="edit">IC卡</el-checkbox>
                              <el-checkbox label="1" :disabled="edit">指纹识别</el-checkbox>
                              <el-checkbox label="2" :disabled="edit">人脸识别</el-checkbox>
                              <el-checkbox label="3" :disabled="edit">虹膜识别</el-checkbox>
                            </el-checkbox-group>
                          </el-form-item>
                        </el-col>
                      </el-row>
                    </el-collapse-item>
                    <el-collapse-item title="备注信息" name="4">
                      <el-col :xs="24" :sm="24" :md="24">
                        <el-input
                          type="textarea"
                          v-model="formDatas.comments"
                          :disabled="edit"
                          :rows="4"
                          :maxlength="200"
                        ></el-input>
                      </el-col>
                    </el-collapse-item>
                  </el-collapse>
                </el-form>
              </el-tab-pane>

              <el-tab-pane label="附件信息" name="third">
                <uploadFile
                  ref="filePane2"
                  :disabled="edit"
                  :fileList="annex"
                  @data="listenToFile"
                  :hide="false"
                >
                  <el-table-column prop="name" label="文件名" mini-width="120"></el-table-column>
                  <!--:render-header="renderHeaderFunction"-->
                  <el-table-column prop="useType" label="类型" mini-width="120">
                    <template slot-scope="scope">
                      <el-input
                        size="mini"
                        v-model="scope.row.type"
                        :disabled="edit"
                        :maxlength="12"
                      ></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column prop="size" label="文件大小" mini-width="60"></el-table-column>
                  <el-table-column prop="comments" label="备注" mini-width="120">
                    <template slot-scope="scope">
                      <el-input
                        size="mini"
                        v-model="scope.row.comments"
                        :disabled="edit"
                        :maxlength="200"
                      ></el-input>
                    </template>
                  </el-table-column>
                </uploadFile>
              </el-tab-pane>

              <el-tab-pane label="视频信息" name="second">
                <cameraInfo :listData="cameraInfo" ref="cameraInfo" :edit="edit"></cameraInfo>
              </el-tab-pane>
            </el-tabs>
          </div>

          <div class="details-footer">
            <el-button size="small" v-if="!edit" type="primary" @click="handleSubmit">保 存</el-button>
            <el-button size="small" @click="handleCancel">取 消</el-button>
          </div>
        </div>
      </div>
      <map-baidu :visible.sync="mapVisible" v-if="mapVisible" @showPoint="showPoint"></map-baidu>
    </el-dialog>
    <el-dialog
      width="80%"
      title="选择工程"
      :visible.sync="projectVisible"
      :close-on-click-modal="false"
      append-to-body
    >
      <org-project @setShow="setShow"></org-project>
    </el-dialog>
  </section>
</template>

<script>
import {
  insertInfoApi,
  updateInfoApi,
  getProjectListApi,
  countApi,
  countApi2,
  countApi3,
  getInfoApi,
  getTargetListApi,
  updateCellTimes
} from "../../api/crane.js";
import { validateIp, validatePort } from "@/utils/validate.js";
import cameraInfo from "@/components/camera/cameraInfo";
import mapBaidu from "././../monitor/mapBaidu";
import OrgProject from "@/components/orgProject/orgProject";
import uploadFile from "@/components/uploadFile/index.vue";
import { url } from "@/axios/base.js";
export default {
  components: {
    cameraInfo,
    mapBaidu,
    OrgProject,
    uploadFile
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (!value) {
        callback();
      }
      if (!validateIp(value)) {
        callback(new Error("请输入正确的IP地址"));
      } else {
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (!value) {
        callback();
      }
      if (!validatePort(value)) {
        callback(new Error("请输入正确端口号(0~65535)"));
      } else {
        callback();
      }
    };
    return {
      recognitionConfig: [],
      functionConfig: [],
      annex: [],
      labelWidth: "170px",
      activeNames: ["1", "2", "3", "4"],
      activeName2: "first",
      formDatas: {},
      other: false,
      cameraInfo: [],
      formDatasRules: {
        projectName: {
          required: true,
          message: "请选择工程名称",
          trigger: "blur"
        },
        craneNo: {
          required: true,
          message: "请输入塔机编号",
          trigger: "blur"
        },
        deviceNo: {
          required: true,
          message: "请输入黑匣子编号",
          trigger: "blur"
        },
        placePoint: {
          //required: true,
          message: "请选择位置",
          trigger: "change"
        },
        gprs: { required: true, message: "请输入SIM卡号", trigger: "blur" },
        specification: {
          required: true,
          message: "请输入塔机型号",
          trigger: "blur"
        },

        owner: {
          required: true,
          message: "请输入产权单位",
          trigger: "blur"
        },
        productionDate: {
          required: true,
          message: "请选择设备出厂日期",
          trigger: "blur"
        },
        // manufactor: {
        //   required: true,
        //   message: "请输入制造厂家",
        //   trigger: "blur"
        // },
        // maxRange: {
        //   required: true,
        //   message: "请输入最大幅度",
        //   trigger: "blur"
        // },
        // maxWeight: {
        //   required: true,
        //   message: "请输入最大载重量",
        //   trigger: "blur"
        // },
        // standardHeight: {
        //   required: true,
        //   message: "请标准高度",
        //   trigger: "blur"
        // },
        // fixMoment: {
        //   required: true,
        //   message: "请输入额定力矩",
        //   trigger: "blur"
        // },
        // windSpeed: { required: true, message: "请输入风速", trigger: "blur" },
        // tiltAngle: { required: true, message: "请输入倾角", trigger: "blur" },
        ipAddress: [{ validator: validatePass, trigger: "blur" }],
        port: [{ validator: validatePass2, trigger: "blur" }]
      },
      projectList: [],
      targetList: [],
      deviceNoBack: "",
      tempCode: this.activeCode,
      projectIdBack: 0,
      edit: false,
      //dialog模式
      title: "",
      dialogVisible: false,
      afterTemp: null,
      specification: null,
      manufactor: null,
      mapVisible: false,
      projectVisible: false,
      isupdate:false
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

    routeType: {
      handler: function(val, oldVal) {
        this.edit = false;
        this.isupdate = false;
        if (val == "insert") {
          this.title = "新增";
        } else if (val == "update") {
          this.title = "编辑";
          this.isupdate = true;
        } else {
          this.title = "查看";
          this.edit = true;
          this.isupdate = true;
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
        body: {
          crane: this.formDatas,
          videos: this.removeEmpty(this.$refs["cameraInfo"].tableData),
          annex: this.removeEmpty(this.$refs["filePane2"].datas)
        }
      };
      return param;
    }
  },
  mounted() {
    this.getOtherInfo();
    if (this.routeType == "view" || this.routeType == "update") {
      this.getInfo();
    }
    this.changeValue();
  },
  methods: {
    listenToFile(fileList) {
      this.annex = fileList;
    },
    groupchnage(val) {
      //console.info("group",val)
    },
    groupchnage2(val) {
      console.info("group", val);
    },
    //获取单条
    getInfo() {
      let param = {
        id: this.detailsId
      };
      getInfoApi(param).then(res => {
        //占用处理 记住修改之前的两个字段
        // this.specification = res.data.crane.specification;
        // this.manufactor = res.data.crane.manufactor;
        this.formDatas = res.data.crane;
        this.functionConfig = [];
        for (let i = 0; i < 7; i++) {
          if (this.formDatas.functionConfig.substring(i, i + 1) === "1") {
            this.functionConfig.push("" + i);
          }
        }
        this.recognitionConfig = [];
        for (let i = 0; i < 4; i++) {
          if (this.formDatas.recognitionConfig.substring(i, i + 1) === "1") {
            this.recognitionConfig.push("" + i);
          }
        }

        this.cameraInfo = res.data.videos;
        this.annex = res.data.annex || [];
        // this.deviceNoBack = res.data.crane.deviceNo;
        this.projectIdBack = res.data.crane.projectId;
      });
    },
    //关闭弹窗
    showPoint(data) {
      this.mapVisible = false;
      this.formDatas = Object.assign({}, this.formDatas, {
        placePoint: data.lng ? data.lng + "," + data.lat : ""
        //   placePoint : data.lng ? JSON.stringify(data) : ''
      });
    },
    //打开地图
    mapShow() {
      this.mapVisible = true;
    },
    //获取项目列表以及指标列表
    getOtherInfo() {
      getProjectListApi({}).then(res => {
        this.projectList = res.data;
      });
      getTargetListApi({}).then(res => {
        this.targetList = res.data;
      });
    },
    //取消操作
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
    //保存操作
    handleSubmit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm("确认保存吗？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            let functionConfig = [0, 0, 0, 0, 0, 0, 0];
            this.functionConfig.forEach(item => {
              functionConfig[item] = 1;
            });

            this.formDatas.functionConfig = functionConfig.join("");
            let recognitionConfig = [0, 0, 0, 0];
            this.recognitionConfig.forEach(item => {
              recognitionConfig[item] = 1;
            });

            this.formDatas.recognitionConfig = recognitionConfig.join("");

            let param = {
              body: {
                id:this.formDatas.id,
                deviceNo: this.formDatas.deviceNo,
                projectId:
                  this.formDatas.projectId == null
                    ? 0
                    : this.formDatas.projectId
              }
            };
            let param2 = {
              body: {
                id:this.formDatas.id,
                craneNo:this.formDatas.craneNo,
                projectId:
                  this.formDatas.projectId == null
                    ? 0
                    : this.formDatas.projectId
              }
            };
            let param3 = {
              body: {
                id:this.formDatas.id,
                gprs:this.formDatas.gprs,
                projectId:
                  this.formDatas.projectId == null
                    ? 0
                    : this.formDatas.projectId
              }
            };
            //alert(this.beforeTemp);
            //    alert(this.afterTemp);
            countApi(param).then(res => {
              console.log(res);
               if (
                 (res.data > 0 && this.routeType == ("insert")) ||
                 ((res.data > 0 &&
                   this.deviceNoBack != this.formDatas.deviceNo) ||
                   (this.projectIdBack != 0 &&
                     this.projectIdBack != this.formDatas.projectId))
               ) {
                 this.formDatas.deviceNo = this.deviceNoBack;
               this.$message({
                 type: "error",
                 message: "工程名称和黑匣子编号不能同时重复"
               });
              } else {
                countApi2(param2).then(res => {
                  console.log(res);
               if (
                 (res.data > 0 && this.routeType == ("insert")) ||
                 ((res.data > 0 &&
                   this.deviceNoBack != this.formDatas.deviceNo) ||
                   (this.projectIdBack != 0 &&
                     this.projectIdBack != this.formDatas.projectId))
               ) {
                 this.formDatas.craneNo = this.deviceNoBack;
               this.$message({
                 type: "error",
                 message: "工程名称和塔机编号不能同时重复"
               });
              } else {
                //alert(param3);
                countApi3(param3).then(res => {
                  console.log(res);
               if (
                 (res.data > 0 && this.routeType == ("insert")) ||
                 ((res.data > 0 &&
                   this.deviceNoBack != this.formDatas.deviceNo) ||
                   (this.projectIdBack != 0 &&
                     this.projectIdBack != this.formDatas.projectId))
               ) {
                 
               this.$message({
                 type: "error",
                 message: "工程名称和SIM卡号不能同时重复"
               });
              } else {
                 let method;
              if (this.routeType == "insert") {
                method = insertInfoApi(this.params);
              } else if (this.routeType == "update") {
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
              
              }
            });
              
              }
            });
          });
        }
      });
    },
    //编辑时指标类型变动事件
    changeValue() {
      // this.formDatas.manufactor = this.manufactor;
      // this.formDatas.maxRange = this.maxRange;
      // this.formDatas.maxWeight = this.maxWeight;
      // this.formDatas.standardHeight = this.standardHeight;
      // this.formDatas.fixMoment = this.fixMoment;
      // this.formDatas.windSpeed = this.windSpeed;
      // this.formDatas.tiltAngle = this.tiltAngle;
      // this.afterTemp = this.formDatas.specification;
    },
    setShow: function(data) {
      if (data.sign == "关闭组织工程") {
        this.projectVisible = false;
        if (data.data != null && data.data != undefined && data.data != "") {
          this.formDatas.projectId = data.data.id;
          this.formDatas.projectName = data.data.name;
        }
      }
    },
    openProject: function() {
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
.col-height {
  height: 50px;
}
</style>
<style lang="scss">
.checkboxGroup .el-checkbox {
  width: 150px;
  margin: 0;
}
</style>

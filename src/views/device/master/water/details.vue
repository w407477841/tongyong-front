<!--
 * @Author: xss
 * @CreateTime: 2018-09-08 22:30:40
 * @Desc: 塔吊详情
-->
<template>
<section>
<el-dialog width="80%" :title="title" :visible.sync="dialogVisible" :close-on-click-modal="false" append-to-body>
    <div class="details-container">
        <div class="container-box details-box">
            <div class="details-body">
                <el-form size="small" :label-width="labelWidth" :model="formDatas" :rules="formDatasRules" ref="editForm" height="100%" style="overflow:auto">
                 <el-collapse v-model="activeNames">
                    <el-collapse-item title="基本信息" name="1">
                        <el-row>
                            <el-col :xs="24" :sm="12" :md="12" class="col-height">
                                <el-form-item label="工程名称" prop="projectName" >
                                    <el-input v-model="formDatas.projectName" clearable :disabled="edit" readonly :maxlength="50">
                                        <el-button slot="append" icon="el-icon-search" @click="openProject"  :disabled="edit"></el-button>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :xs="24" :sm="12" :md="12" class="col-height">
                                <el-form-item label="设备名称" prop="name">
                                    <el-input v-model="formDatas.name" :disabled="edit" :maxlength="20"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :xs="24" :sm="12" :md="12" class="col-height">
                                <el-form-item label="黑匣子编号" prop="deviceNo">
                                    <el-input v-model="formDatas.deviceNo" :disabled="edit" :maxlength="20"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :xs="24" :sm="24" :md="12" class="col-height">
                                <el-form-item label="采集器编号" prop="collecterNo" class="col-height">
                                    <el-input v-model="formDatas.collecterNo" clearable :disabled="edit" :maxlength="50"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :xs="24" :sm="24" :md="12" class="col-height">
                                <el-form-item label="位置"  class="col-height">
                                    <el-input v-model="formDatas.placePoint" clearable :disabled="edit" readonly :maxlength="50">
                                         <el-button slot="append" icon="el-icon-search" @click="mapShow"  :disabled="edit"></el-button>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :xs="24" :sm="24" :md="12" class="col-height">
                                <el-form-item label="GPRS" prop="gprs" class="col-height">
                                    <el-input-number  :max="999999999" :precision="0" v-model="formDatas.gprs" :controls="false" :disabled="edit" ></el-input-number>
                                </el-form-item>
                            </el-col>
                            <el-col :xs="24" :sm="24" :md="12" class="col-height">
                                <el-form-item label="互感系数" prop="ratio" class="col-height">
                                    <el-input-number  :max="999999999" :precision="0" v-model="formDatas.ratio" :controls="false" :disabled="edit" ></el-input-number>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-collapse-item>
                    <el-collapse-item title="指标信息" name="2">
                        <el-row>
                          <el-col :xs="24" :sm="24" :md="12" class="col-height">
                              <el-form-item label="指标类型" prop="specification">
                                <el-select v-model="formDatas.specification" filterable  @change="changeValue"  clearable  :disabled="edit" placeholder="请选择">
                                  <el-option v-for="item in targetList" :label="item.specification" :value="item.id" :key="item.id"></el-option>
                                </el-select>
                              </el-form-item>
                          </el-col>
                          <el-col :xs="24" :sm="24" :md="12" class="col-height">
                              <el-form-item label="制造厂家" prop="manufactor">
                                  <el-input v-model="formDatas.manufactor" :disabled="edit" :maxlength="50"></el-input>
                              </el-form-item>
                          </el-col>
                          <el-col :xs="24" :sm="24" :md="12" class="col-height">
                              <el-form-item label="每秒耗水量(立方米)" prop="dissipation">
                                   <el-input-number  :max="9999999999" :precision="2" v-model="formDatas.dissipation" :controls="false" :disabled="edit" ></el-input-number>
                              </el-form-item>
                          </el-col>
                          <el-col :xs="24" :sm="24" :md="12" class="col-height">
                              <el-form-item label="类别" >
                                  <el-select v-model="formDatas.type" filterable  clearable  :disabled="edit" placeholder="类别">
                                      <el-option v-for="item in typeList" :label="item.label" :value="item.value" :key="item.value"></el-option>
                                  </el-select>
                              </el-form-item>
                          </el-col>
                          <el-col :xs="24" :sm="24" :md="12" class="col-height">
                              <el-form-item label="设备类别" prop="deviceType">
                                  <el-select v-model="formDatas.deviceType" filterable  clearable  :disabled="edit" placeholder="设备类别">
                                      <el-option v-for="item in deviceTypeList" :label="item.label" :value="item.value" :key="item.value"></el-option>
                                  </el-select>
                              </el-form-item>
                          </el-col>
                        </el-row>
                      </el-collapse-item>
                      <el-collapse-item title="备注信息" name="3" class="col-height">
                          <el-col :xs="24" :sm="24" :md="24">
                            <el-form-item label="备注" prop="comments">
                              <el-input type="textarea" v-model="formDatas.comments" :disabled="edit" :rows="4" :maxlength="200"></el-input>
                            </el-form-item>
                          </el-col>
                      </el-collapse-item>
                    </el-collapse>
                </el-form>
            </div>

            <div class="details-footer">
                <el-button size="small" @click="handleCancel">取 消</el-button>
                <el-button size="small" v-if="!edit" type="primary" @click="handleSubmit">保 存</el-button>
            </div>
        </div>
    </div>
    <map-baidu :visible.sync="mapVisible" v-if="mapVisible"  @showPoint="showPoint"></map-baidu>
    </el-dialog>
    <el-dialog width="80%" title="选择工程" :visible.sync="projectVisible" :close-on-click-modal="false" append-to-body>
      <org-project @setShow="setShow"></org-project>
    </el-dialog>
</section>
</template>

<script>
import {insertWater,updateWater,selectWaterById,selectListNoPage} from "@/views/device/api/water.js";
import {selectProjectInfo} from "@/views/api/equipmentApi.js";
import mapBaidu from "././../monitor/mapBaidu";
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
      formDatasRules: {
        projectName: [
          {required: true,message: "请选择工程名称",trigger: "blur"}
        ],
        name: [
          {required: true,message: "请输入设备名称",trigger: "blur"}
        ],
        deviceNo: [
          {required: true,message: "请输入黑匣子编号",trigger: "blur"}
        ],
        placePoint: [
          {required: true,message: "请选择位置",trigger: "change"}
        ],
        gprs: [
          {required: true,message: "请输入gprs", trigger: "blur"}
        ],
        specification: [
          {required: true,message: "请输入规格型号",trigger: "blur"}
        ],
        manufactor: [
          {required: true,message: "请输入制造厂家",trigger: "blur"}
        ],
        dissipation: [
          {required: true,message: "请输入每秒耗水量",trigger: "blur"}
        ],
        type:[
          {required: true, message: '请选择类型',trigger:"change"}
        ]
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
      typeList : [
        {label : '生活用水',value : 1},
        {label : '生产用水',value : 2},
        {label : '消防用水',value : 3}
      ],
      deviceTypeList : [
        {label : '冷水表',value : 1},
        {label : '热水表',value : 2}
      ],
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
    this.getProject();
    if (this.routeType == "view" || this.routeType == "update") {
      this.getInfo();
    }
    this.getTypeList();
  },
  methods: {
    //获取单条
    getInfo() {
      let param = {
        id: this.detailsId
      };
      selectWaterById(param).then(res => {
        this.formDatas = res.data;
        this.formDatas.specification = Number(res.data.specification);
      });
    },
    getProject : function() {
      selectProjectInfo({}).then((res) => {
        this.projectList = res.data;
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
        }).then(() => {
          this.dialogVisible = false;
        });
      }
    },
    //保存操作
    handleSubmit() {
      this.formDatas.status = 0;
      this.formDatas.isOnline = 0;
      this.formDatas.isOnlineCollecter = 0;
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm("确认保存吗？", "提示", {type: "warning"}).then(() => {
            let method;
              if (this.routeType == "insert") {
                method = insertWater(this.params);
              } else if (this.routeType == "update") {
                method = updateWater(this.params);
              }
              method.then((res) => {
                if(res.code == 200) {
                  this.$message({
                    type : 'success',
                    message : res.message
                  });
                  this.dialogVisible = false;
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
    getTypeList : function() {
      selectListNoPage({}).then((res) => {
        this.targetList = res.data;
      });
    },
    changeValue : function(val) {
      for(let i = 0;i < this.targetList.length;i++) {
        if(this.targetList[i].id == val) {
          this.formDatas.manufactor = this.targetList[i].manufactor;
          this.formDatas.dissipation = this.targetList[i].dissipation;
        }
      }
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
.col-height {
  height: 50px;
}
</style>

<template>
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
                <el-col :xs="24" :sm="24" :md="24" class="itemHeight">
                  <el-form-item label="工程名称" prop="name">
                    <el-input v-model="formDatas.name" :disabled="edit" maxlength="50"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="8" class="itemHeight">
                  <el-form-item label="工程地点" prop="address">
                    <el-input v-model="formDatas.address" :disabled="edit" maxlength="100"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="8" class="itemHeight">
                  <el-form-item label="项目经纬度" prop="placePoint">
                    <el-input
                      v-model="formDatas.placePoint"
                      :readonly="true"
                      :disabled="edit"
                      maxlength="100"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="8" class="itemHeight">
                  <el-form-item>
                    <el-button @click="mapShow(true)" type="primary" :disabled="edit">选择经纬度</el-button>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="8" class="itemHeight">
                  <el-form-item label="项目类别" prop="type">
                    <el-select
                      v-model="formDatas.type"
                      :disabled="edit"
                      placeholder="项目类别"
                      :clearable="true"
                      :filterable="true"
                    >
                      <el-option
                        v-for="item in typeList"
                        :label="item.label"
                        :value="item.value"
                        :key="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="8" class="itemHeight">
                  <el-form-item label="项目区域" prop="positions">
                    <el-cascader
                      :options="positionList"
                      v-model="formDatas.positions"
                      :disabled="edit"
                      :props="positionProps"
                      style="width : 100%"
                      :change-on-select="true"
                    ></el-cascader>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="8" class="itemHeight">
                  <el-form-item label="开工日期" prop="beginDate">
                    <el-date-picker
                      v-if="formDatas.beginDate"
                      key="beginDate1"
                      v-model="formDatas.beginDate"
                      :editable="false"
                      :picker-options="beginPicker"
                      :disabled="edit"
                      type="date"
                      format="yyyy-MM-dd"
                    ></el-date-picker>
                    <el-date-picker
                      v-else
                      v-model="formDatas.beginDate"
                      key="beginDate2"
                      :editable="false"
                      :picker-options="beginPicker"
                      :disabled="edit"
                      type="date"
                      placeholder="选择日期"
                      format="yyyy-MM-dd"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="8" class="itemHeight">
                  <el-form-item label="竣工日期" prop="endDate">
                    <el-date-picker
                      v-if="formDatas.endDate"
                      key="endDate1"
                      v-model="formDatas.endDate"
                      :editable="false"
                      :picker-options="endPicker"
                      :disabled="edit"
                      type="date"
                      format="yyyy-MM-dd"
                    ></el-date-picker>
                    <el-date-picker
                      v-else
                      v-model="formDatas.endDate"
                      key="endDate2"
                      :editable="false"
                      :picker-options="endPicker"
                      :disabled="edit"
                      type="date"
                      placeholder="选择日期"
                      format="yyyy-MM-dd"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="8" class="itemHeight">
                  <el-form-item label="建筑面积(平方米)" prop="buildingSize">
                    <el-input-number
                      v-model.number="formDatas.buildingSize"
                      :disabled="edit"
                      :min="0"
                      :max="9999999999"
                      :precision="2"
                      :controls="false"
                    ></el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="8" class="itemHeight">
                  <el-form-item label="建设单位" prop="constructionUnit">
                    <el-input v-model="formDatas.constructionUnit" :disabled="edit" maxlength="50"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="8" class="itemHeight">
                  <el-form-item label="施工单位" prop="builders">
                    <el-cascader
                      :options="builderList"
                      :disabled="edit"
                      v-model="formDatas.builders"
                      :props="builderProps"
                      style="width : 100%"
                      :change-on-select="true"
                    ></el-cascader>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="8" class="itemHeight">
                  <el-form-item label="勘察单位" prop="surveyor">
                    <el-input v-model="formDatas.surveyor" :disabled="edit" maxlength="50"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="8" class="itemHeight">
                  <el-form-item label="监理单位" prop="supervisor">
                    <el-input v-model="formDatas.supervisor" :disabled="edit" maxlength="50"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24">
                  <el-form-item label="项目简介">
                    <el-input
                      :disabled="edit"
                      type="textarea"
                      v-model="formDatas.introduction"
                      maxlength="50"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="8" class="itemHeight">
                  <el-form-item label="项目经理" prop="manager">
                    <el-input v-model="formDatas.manager" :disabled="edit" maxlength="12"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="8" class="itemHeight">
                  <el-form-item label="联系电话" prop="managerPhone">
                    <el-input
                      v-model.number="formDatas.managerPhone"
                      :disabled="edit"
                      maxlength="11"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="8" class="itemHeight">
                  <el-form-item label="定额工期" prop="fixDays">
                    <el-input v-model="formDatas.fixDays" :disabled="edit" maxlength="50"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="8" class="itemHeight">
                  <el-form-item label="项目范围" prop="projectScope">
                    <el-input v-model="formDatas.projectScope" :disabled="edit" :readonly="true"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="8" class="itemHeight">
                  <el-form-item label prop="fixDays">
                    <el-button @click="mapShow(false)" type="primary" :disabled="edit">选择项目范围</el-button>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24">
                  <el-form-item label="项目平面图" prop="ichnography">
                    <upload-image
                      v-model="formDatas.ichnography"
                      :limit="1"
                      :fileList="fileList"
                      :disabled="edit"
                      @data="imageData"
                    ></upload-image>
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
import {
  insertPorject,
  updatePorject,
  getProjectById,
  selectArea,
  selectOrganizationInfo
} from "@/views/api/equipmentApi.js";
import { validatePhone } from "@/utils/validate.js";
import UploadImage from "@/components/uploadImage/index.vue";
import { url } from "@/axios/base.js";
export default {
  components: {
    UploadImage
  },
  data() {
    let checkPhone = (rule, value, callback) => {
      if (!validatePhone(value) && value != "") {
        return callback(new Error("请输入正确的手机号"));
      } else {
        return callback();
      }
    };
    return {
      labelWidth: "150px",
      activeNames: [],
      formDatas: {
        name: "",
        address: "",
        type: "",
        orgId: "",
        positions: [],
        position: "",
        beginDate: "",
        endDate: "",
        buildingSize: "",
        constructionUnit: "",
        builders: [],
        builder: "",
        surveyor: "",
        supervisor: "",
        introduction: "",
        manager: "",
        managerPhone: "",
        fixDays: "",
        placePoint: ""
      },
      formDatasRules: {
        name: [{ required: true, message: "请输入工程名称", trigger: "blur" }],
        address: [
          { required: true, message: "请输入工程地点", trigger: "blur" }
        ],
        type: [{ required: true, message: "请选择项目类别", trigger: "blur" }],
        placePoint: [
          { required: true, message: "请选择项目经纬度", trigger: "change" }
        ],
        builders: [
          { required: true, message: "请选择施工单位", trigger: "blur" }
        ],
        beginDate: [
          { required: true, message: "请选择开工日期", trigger: "blur" }
        ],
        endDate: [
          { required: true, message: "请选择竣工日期", trigger: "blur" }
        ],
        managerPhone: [{ validator: checkPhone, trigger: "blur" }]
      },
      typeList: [{ label: "房建", value: 1 }, { label: "市政", value: 2 }],
      positionList: [],
      builderList: [],
      positionProps: {
        value: "id",
        label: "name",
        children: "children"
      },
      builderProps: {
        value: "id",
        label: "name",
        children: "children"
      },
      fileList: []
    };
  },
  watch: {
    placePoint: {
      handler: function(val, oldVal) {
        this.formDatas.placePoint = this.placePoint;
      }
    },
    projectScope: {
      handler: function(val, oldVal) {
        this.$set(this.formDatas, "projectScope", this.projectScope);
      }
    }
  },
  computed: {
    beginPicker() {
      let endTime = this.formDatas.endDate;
      return {
        disabledDate(time) {
          if (!endTime) {
            return false;
          }
          return time.getTime() > new Date(endTime);
        }
      };
    },
    endPicker() {
      let beginTime = this.$moment(this.formDatas.beginDate);
      return {
        disabledDate(time) {
          if (!beginTime) {
            return false;
          }
          return time.getTime() < new Date(beginTime);
        }
      };
    },
    params() {
      let param = {
        body: this.formDatas
      };
      return param;
    }
  },
  mounted() {
    if (this.openType == "view" || this.openType == "update") {
      this.getInfo();
    }
    this.getArea();
    this.getOrg();
  },
  methods: {
    //打开页面时根据id查询数据给表单
    getInfo() {
      let param = {
        id: this.id
      };
      getProjectById(param).then(res => {
        this.formDatas = res.data;
        this.$set(this.formDatas, "positions", res.data.positions);
        this.$set(this.formDatas, "projectScope", res.data.projectScope);
        console.log(res.data.ichnography);
        if (res.data.ichnography) {
          this.fileList = [
            {
              response: res.data.ichnography,
              url:
                url +
                "/fileUpload/filedownload?remotePath=" +
                res.data.ichnography
            }
          ];
        } else {
          this.fileList = [];
        }
      });
    },
    //获取区域
    getArea: function() {
      let para = {};
      selectArea(para).then(res => {
        let jsonStr = JSON.stringify(res.data);
        jsonStr = jsonStr.replace(/"children":\[],/g, "");
        let data = JSON.parse(jsonStr);
        this.positionList = data;
      });
    },
    //保存
    handleSubmit() {
      this.formDatas.status = 0;
      if (
        this.formDatas.positions != "" &&
        this.formDatas.positions != undefined
      ) {
        this.formDatas.position = this.formDatas.positions[
          this.formDatas.positions.length - 1
        ];
      }
      if (
        this.formDatas.builders != "" &&
        this.formDatas.builders != undefined
      ) {
        this.formDatas.builder = this.formDatas.builders[
          this.formDatas.builders.length - 1
        ];
      }
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm("确认保存吗？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            let method;
            if (this.openType == "insert") {
              method = insertPorject(this.params);
            } else if (this.openType == "update") {
              method = updatePorject(this.params);
            }
            method.then(res => {
              if (res.code == 200) {
                this.$message({
                  type: "success",
                  message: res.message
                });
                this.$emit("setShow", { sign: "关闭项目信息" });
              } else {
                this.$message({
                  type: "error",
                  message: res.message
                });
              }
            });
          });
        }
      });
    },
    //点击选择按钮打开地图
    mapShow: function(isClose) {
      if (!this.formDatas.projectScope) {
        this.$emit("setShow", { isClose: isClose, sign: "打开地图" });
      } else {
        this.$emit("setShow", {
          isClose: isClose,
          sign: "打开地图",
          projectScope: this.formDatas.projectScope
        });
      }
    },
    //获取施工单位
    getOrg: function() {
      let para = {};
      selectOrganizationInfo(para).then(res => {
        let jsonStr = JSON.stringify(res.data);
        jsonStr = jsonStr.replace(/"children":\[],/g, "");
        let data = JSON.parse(jsonStr);
        this.builderList = data;
      });
    },
    //取消
    handleCancel: function() {
      let msg = "";
      if (this.openType == "insert") {
        msg = "新增内容将不被保存，是否确认取消？";
      }
      if (this.openType == "update") {
        msg = "修改内容将不被保存，是否确认取消？";
      }
      if (this.openType == "view") {
        this.$emit("setShow", { sign: "关闭项目信息" });
        return;
      }
      this.$confirm(msg, "提示", { type: "warning" }).then(() => {
        this.$emit("setShow", { sign: "关闭项目信息" });
      });
    },
    imageData(data, urls) {
      this.formDatas.ichnography = urls[0];
      this.fileList = data;
    }
  },
  props: ["edit", "openType", "id", "placePoint", "projectScope"]
};
</script>

<style lang="scss" scoped>
.itemHeight {
  height: 50px;
}
</style>


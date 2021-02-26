<!--
 * @Author: xss
 * @CreateTime: 2018-09-29 22:30:40
 * @Desc: 版本升级一览
-->
<template>
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
          <el-tabs type="border-card" style="height:100%">
            <el-tab-pane label="附件信息">
              <uploadFile
                ref="filePane2"
                :disabled="edit"
                :fileList="annex"
                @data="listenToFile"
                :hide="false"
                :newHide="false"
              >
                <el-table-column prop="name" label="升级包名称" mini-width="120"></el-table-column>
                <el-table-column
                  prop="useType"
                  label="类型"
                  mini-width="120"
                  :render-header="renderHeaderFunction"
                >
                  <template slot-scope="scope">
                    <el-select
                      v-model="scope.row.useType"
                      filterable
                      clearable
                      :disabled="edit"
                      placeholder="请选择"
                      size="mini"
                    >
                      <el-option
                        v-for="item in typeList"
                        :label="item.name"
                        :value="item.id"
                        :key="item.id"
                      ></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <!--<el-table-column prop="type" label="文件类型" mini-width="120"></el-table-column>-->
                <el-table-column prop="size" label="文件大小" mini-width="60"></el-table-column>
                <!-- <el-table-column prop="version" label="版本号" mini-width="120"  :render-header="renderHeaderFunction">
                                    <template slot-scope="scope">
                                        <el-input size="mini" v-model="scope.row.version" :disabled="edit"
                                                  :maxlength="12"></el-input>
                                    </template>
                </el-table-column>-->
                <el-table-column
                  prop="version"
                  label="版本号"
                  min-width="130"
                  show-overflow-tooltip
                  :formatter="formatterVersion"
                ></el-table-column>
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
  getInfoApi,
  insertInfoApi,
  getDeviceTypeListApi
} from "../../api/version.js";
import uploadFile from "@/components/uploadFile/index.vue";
import { url } from "@/axios/base.js";

export default {
  components: {
    uploadFile
  },
  data() {
    return {
      labelWidth: "150px",
      activeNames: [],
      formDatas: {},
      formDatasRules: {},
      edit: false,
      title: "",
      annex: [],
      typeList: [],
      fileList: [],
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
    }
  },
  watch: {
    //dialog模式
    routeType: {
      handler: function(val, oldVal) {
        this.edit = false;
        this.title = "新增";
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
        body: this.removeEmpty(this.$refs["filePane2"].datas)
      };
      return param;
    }
  },
  mounted() {
    getDeviceTypeListApi().then(res => {
      this.typeList = res.data;
    });
    //根据类型判断是否要加载数据
    if (this.routeType == "view" || this.routeType == "update") {
      this.getInfo();
    }
    this.editFormRef = this.$refs.editForm;
  },
  methods: {
    listenToFile(fileList) {
      this.annex = fileList;
    },
    //查询单条
    getInfo() {
      let param = {
        id: this.detailsId
      };
      getInfoApi(param).then(res => {
        //this.formDatas = res.data;
        this.annex = res.data.upGradesFile;
      });
    },
    //保存操作
    handleSubmit() {
      this.$confirm("确认保存吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let method;
        method = insertInfoApi(this.params);
        method.then(res => {
          this.$message({
            message: res.message,
            type: res.success ? "success" : "error"
          });
          this.dialogVisible = false; //dialog模式
        });
      });
    },
    //取消操作
    handleCancel() {
      this.$confirm("新增内容将不被保存，是否确认取消？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.dialogVisible = false;
      });
    },
    renderHeaderFunction(h, { column, $index }) {
      return h("span", { class: ["i-c-red"] }, [h("i", "* "), column.label]);
    },
    formatterVersion(row) {
      let val = row.name;
      let b = val.indexOf("_") !== -1 && val.indexOf(".") !== -1;
      if (!b) {
        this.$message({
          showClose: true,
          message: "文件名:" + val + " 不符合规范,示例:xx_xxx_vx.x.x.bin",
          type: "error"
        });
        return "";
      }
      return val.substring(val.lastIndexOf("_") + 1, val.lastIndexOf("."));
    }
  }
};
</script>
<style>
.i-c-red i {
  color: red;
}
</style>
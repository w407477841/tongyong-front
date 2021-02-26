
<template>
<section>
<el-dialog width="80%" :title="title" :visible.sync="dialogVisible" :close-on-click-modal="false" append-to-body>
    <div class="details-container">
        <div class="container-box details-box">
            <div class="details-body">
            <el-col :span="24">
                <el-table size="small" :ref="sprayData" :data="sprayData" style="width: 100%;" @selection-change="selsChange">
                    <el-table-column type="selection" width="55">
                    </el-table-column>
                    <el-table-column type="index" width="60" prop="id"  label="ID">
                    </el-table-column>
                    <el-table-column prop="projectName" :show-overflow-tooltip="true" label="项目名称"   >
                    </el-table-column>
                    <!-- <el-table-column prop="name" :show-overflow-tooltip="true" label="扬尘黑匣子编号"   >
                    </el-table-column> -->
                    <el-table-column prop="name" :show-overflow-tooltip="true" label="名称"   >
                    </el-table-column>
                    <el-table-column prop="deviceNo" :show-overflow-tooltip="true" label="黑匣子编号"   >
                    </el-table-column>
                    <el-table-column prop="onlineName" :show-overflow-tooltip="true" label="在线状态"   >
                    </el-table-column>
                    <el-table-column prop="statusName" :show-overflow-tooltip="true" label="状态"   >
                    </el-table-column>
                </el-table>
                <div class="page-el-UIDF802">
                    <el-pagination @size-change="changePageSize" @current-change="handleCurrentChange"  :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
                    </el-pagination>
                </div>

                <el-col :span="24"  class="toolbar" style="padding-bottom:0px;">
                <el-form :inline="true" >
                    <el-form-item>
                    <el-button type="primary" class="el-icon-arrow-down" @click="putSelectIn()">&nbsp;移入</el-button>
                    </el-form-item>
                    <el-form-item>
                    <el-button type="primary" class="el-icon-arrow-up" @click="putSelectOut()">&nbsp;移出</el-button>
                    </el-form-item>
                    <!-- <el-form-item>
                    <el-button type="primary" class="el-icon-arrow-down" @click="allPutIn()">&nbsp;全部移入</el-button>
                    </el-form-item>
                    <el-form-item>
                    <el-button type="primary" class="el-icon-arrow-up" @click="allPutOut()">&nbsp;全部移出</el-button>
                    </el-form-item> -->
                </el-form>
                </el-col>

                <el-table size="small" :ref="sprayedData" :data="sprayedData" @selection-change="selcChange" style="width: 100%;">
                    <el-table-column type="selection" width="55">
                    </el-table-column>
                    <el-table-column type="index" width="60" prop="id"  label="ID">
                    </el-table-column>
                    <el-table-column prop="projectName" :show-overflow-tooltip="true" label="项目名称"  >
                    </el-table-column>
                    <!-- <el-table-column prop="name" :show-overflow-tooltip="true" label="扬尘黑匣子编号"  >
                    </el-table-column> -->
                    <el-table-column prop="name" :show-overflow-tooltip="true" label="名称"  >
                    </el-table-column>
                    <el-table-column prop="deviceNo" :show-overflow-tooltip="true" label="黑匣子编号"  >
                    </el-table-column>
                    <el-table-column prop="onlineName" :show-overflow-tooltip="true" label="在线状态"  >
                    </el-table-column>
                    <el-table-column prop="statusName" :show-overflow-tooltip="true" label="状态"  >
                    </el-table-column>
                </el-table>
            </el-col>
            </div>
            <div class="details-footer">
                <el-button size="small" @click="handleCancel">取 消</el-button>
                <el-button size="small" type="primary" @click="handleSubmit">保 存</el-button>
            </div>
        </div>
         
    </div>
    </el-dialog>
</section>
</template>

<script>
import {
  insertInfoApi,
  updateInfoApi,
  getProjectListApi,
  countApi,
  getInfoApi,
  getTargetListApi,
  getSprayList,
  getList,
  add
} from "../../api/monitor.js";
export default {
  components: {},
  data() {
    return {
      labelWidth: "100px",
      activeNames: ["1", "2", "3"],
      activeName2: "first",
      formDatas: {},
      sprayData: [],
      sels: [],
      selc: [],
      sprayedData: [],
      other: false,
      pageNum: 1,
      pageSize: 10,
      cameraInfo: [],
      projectList: [],
      targetList: [],
      deviceNoBack: "",
      projectIdBack: 0,
      tempCode: this.activeCode,
      edit: false,
      //dialog模式
      title: "",
      total: 0,
      dialogVisible: false,
      mapVisible: false,
      center: { lng: 0, lat: 0 },
      projectVisible: false
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
    },
    projectId: {
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
          this.title = "绑定喷淋";
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

  computed: {},
  mounted() {
    this.getSprayListData();
    this.getListData();
  },
  methods: {
    allPutOut() {
      this.sprayedData = [];
    },
    allPutIn() {
      this.sprayData.forEach(el => {
        this.sprayedData.push(el);
      });
    },
    putSelectIn() {
      if (this.sels.length > 0) {
        if (this.sprayedData.length > 0) {
          for (var i = 0; i < this.sels.length; i++) {
            var flag = true;
            for (var j = 0; j < this.sprayedData.length; j++) {
              if (this.sels[i].deviceNo == this.sprayedData[j].deviceNo) {
                flag = false;
              }
            }
            if (flag) {
              this.sprayedData.push(this.sels[i]);
            }
          }
        } else {
          this.sels.forEach(el => {
            this.sprayedData.push(el);
          });
        }
      } else {
        this.$message({
          type: "warning",
          message: "请勾选要移入的数据"
        });
      }
      this.sels = [];
      this.getSprayListData();
    },
    putSelectOut() {
      this.selc.forEach(el => {
        this.sprayedData.splice(this.sprayedData.indexOf(el), 1);
      });
      this.selc = [];
    },
    selsChange(sels) {
      this.sels = sels;
    },
    selcChange(sels) {
      this.selc = sels;
    },
    getListData() {
      getList({ id: this.detailsId }).then(res => {
        this.sprayedData = res.data.list;
      });
    },
    changePageSize(v) {
      this.pageSize = v;
      this.getSprayListData();
    },
    handleCurrentChange(v) {
      this.pageNum = v;
      this.getSprayListData();
    },
    getSprayListData() {
      getSprayList({
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        projectId: this.projectId
      }).then(res => {
        this.sprayData = res.data.list;
        this.total = res.data.total;
      });
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
        //console.log(res);
        this.formDatas = res.data.monitor;
        this.cameraInfo = res.data.videos;
        this.deviceNoBack = res.data.monitor.deviceNo;
        this.projectIdBack = res.data.monitor.projectId;
      });
    },
    //下拉框选中值变化后赋值
    changeValue() {
      //console.log(this.formDatas.specification);

      this.formDatas.manufactor = this.manufactor;
      this.formDatas.pm10 = this.pm10;
      this.formDatas.pm25 = this.pm25;
      this.formDatas.humidity = this.humidity;
      this.formDatas.temperature = this.temperature;
      this.formDatas.windSpeed = this.windSpeed;
      this.formDatas.noise = this.noise;
      this.formDatas.tsp = this.tsp;
    },
    //关闭
    handleCancel() {
      this.$confirm("绑定内容将不被保存，是否确认取消？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.visible = false;
      });
    },
    //保存
    handleSubmit() {
      let param = {
        body: {
          id: this.detailsId,
          spray: this.sprayedData
        }
      };
      this.$confirm("确认保存吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        add(param).then(res => {
          if (res.code == 200) {
            this.$message({
              message: "绑定成功",
              type: "success"
            });
            this.visible = false;
          }
        });
      });
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

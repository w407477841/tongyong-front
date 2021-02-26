<template>
  <div class="baseStation">
    <div class="home-box">
      <el-row class="panel-group">
        <el-col :span="24" class="grid-col">
          <div class="card-panel hydropower-summary">
            <el-autocomplete
              class="baseStation__input"
              v-model="projectName"
              :fetch-suggestions="querySearch"
              placeholder="请搜索项目"
              @select="handleSelect"
            ></el-autocomplete>
            <div class="baseStation__main">
              <div class="baseStation__left">
                <h3 style="margin-top:0">选择平面类型</h3>
                <el-select v-model="value" placeholder="请选择" size="mini">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <h3>上传楼层平面图</h3>
                <el-upload
                  class="baseStation__upload"
                  ref="upload"
                  drag
                  :action="baseUrl + '/fileUpload/photoupload?type=project_map&userName=admin'"
                  :auto-upload="false"
                  accept="image/png, image/jpg"
                  :on-error="uploadOnError"
                  :on-success="uploadOnSuccess"
                  :before-upload="uploadBeforeUpload"
                  :before-remove="uploadBeforeRemove"
                  :file-list="fileList"
                  :limit="1"
                  :on-exceed="uploadOnExceed"
                >
                  <i class="el-icon-upload"></i>
                  <div>点击或将图片拖拽到这里上传</div>
                  <div class="baseStation__tips">支持扩展名JPG、PNG</div>
                </el-upload>
                <div class="baseStation__buttonGroup">
                  <el-button size="small" v-if="!uploadSuccess">取消</el-button>
                  <el-button
                    style="margin-left: 10px;"
                    size="small"
                    type="primary"
                    @click="submitUpload"
                    v-if="!uploadSuccess"
                  >上传</el-button>
                  <el-button
                    size="small"
                    type="primary"
                    @click="submitUpload"
                    v-if="uploadSuccess"
                  >上传成功</el-button>
                </div>
                <h3>平面图实际尺寸(宽×高)</h3>
                <el-input-number
                  v-model="realWidth"
                  controls-position="right"
                  :min="0"
                  :step="0.01"
                  :precision="2"
                ></el-input-number>
                <span>米</span>
                <span>×</span>
                <el-input-number
                  v-model="realHeight"
                  controls-position="right"
                  :min="0"
                  :step="0.01"
                  :precision="2"
                ></el-input-number>
                <span>米</span>
              </div>
              <div class="baseStation__right">
                <div class="baseStation__building" v-if="value == 2">
                  <h3>选择楼号</h3>
                  <div class="baseStation__building-main">
                    <el-button
                      :type="item.status == 2?'primary':''"
                      class="baseStation__button"
                      v-for="(item,index) in buildings"
                      :key="index"
                      @click="chooseBuilding(item)"
                    >{{item.name}}</el-button>
                  </div>
                </div>
                <div class="baseStation__floor" v-if="value == 2">
                  <div class="baseStation__floor-main">
                    <el-tabs v-model="activeName" @tab-click="settingTabClick">
                      <el-tab-pane
                        v-for="(item,index) in buildings"
                        :key="index"
                        :label="item.name"
                        :name="Number(item.id)"
                      >
                        <el-button
                          :type="el.status==2?'primary':el.status==1?'success':''"
                          class="baseStation__button"
                          v-for="(el,i) in item.floors"
                          :key="i"
                          @click="choosefloor(el,item)"
                        >{{el.name}}</el-button>
                        <el-button
                          type="text"
                          class="baseStation__floor-allin"
                          @click="allChoose(item,el)"
                          v-if="item.floors.length>0"
                        >{{item.isAllChoose}}</el-button>
                      </el-tab-pane>
                    </el-tabs>
                  </div>
                </div>
              </div>
            </div>
            <p class="baseStation__bottomTips">
              *标记为
              <span style="color:#5CBA33;">绿色</span> 的楼层为已经提交过平面图的楼层。
            </p>
            <el-button type="primary" @click="uploadSubmit" class="baseStation__uploadButton">提交</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import { getProjectsApi, getFloorsApi, postAddMap } from "../../api/setting.js";
import { url } from "@/axios/base.js";
export default {
  data() {
    return {
      uploadSuccess: false,
      fileList: [],
      activeName: "",
      projectName: "",
      projectId: "",
      projectNames: [],
      buildings: [],
      baseUrl: url,
      uploadMapUrl: "",
      options: [
        {
          value: "1",
          label: "项目图"
        },
        {
          value: "2",
          label: "楼层图"
        }
      ],
      value: "1",
      realWidth: new Number(),
      realHeight: new Number(),
      params: {},
      projectId: "",
      floors: []
    };
  },
  watch: {
    buildings: {
      deep: true,
      handler() {
        this.floors = [];
        this.buildings.forEach(el => {
          let num = 0;
          el.floors.forEach(_el => {
            if (_el.status == 2) {
              num++;
              this.floors.push(_el);
            }
          });
          if (num > 0) {
            el.status = 2;
          }
          if (num == 0) {
            el.status = 0;
          }
        });
      }
    }
  },
  methods: {
    submitUpload() {
      this.$refs.upload.submit();
    },
    uploadOnError(err, file, fileList) {
      conosle.log(err);
      this.$message({ type: "error", message: err });
    },
    uploadOnSuccess(response, file, fileList) {
      this.uploadMapUrl = response;
      this.uploadSuccess = true;
    },
    uploadBeforeUpload(file) {
      //   this.fileList = [];
    },
    uploadOnExceed(files, fileList) {
      this.$message({
        type: "warning",
        message: "最大上传个数为1，请先删除上一个图片！"
      });
    },
    //获取项目
    getProjects() {
      getProjectsApi().then(res => {
        this.projectNames = [];
        res.forEach(el => {
          this.projectNames.push({
            value: el.name,
            address: el.address,
            id: el.id
          });
        });
      });
    },
    querySearch(queryString, cb) {
      var projectNames = this.projectNames;
      var results = queryString
        ? projectNames.filter(this.createFilter(queryString))
        : projectNames;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return projectName => {
        return (
          projectName.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },
    handleSelect(item) {
      this.projectId = item.id;
      this.getFloors(item.id);
    },
    //获取楼层、楼号
    getFloors(projectId) {
      let params = {
        projectId: projectId
      };
      getFloorsApi(params).then(res => {
        this.buildings = [];
        res.forEach(el => {
          el.isAllChoose = "全选";
        });
        this.buildings = res;
        this.activeName = Number(res[0].id);
      });
    },
    //选择楼号
    chooseBuilding(item) {
      this.activeName = Number(item.id);
    },
    //选择楼层
    choosefloor(el, item) {
      if (el.status == 0 || el.status == 1) {
        el.oldStatus = el.status;
        el.status = 2;
      } else if (el.status == 2) {
        el.status = el.oldStatus;
      }
      let num = 0;
      item.floors.forEach(_el => {
        if (_el.status == 2) {
          num++;
        }
      });
      if (num == item.floors.length) {
        item.isAllChoose = "全否";
      }
    },
    //更改tab
    settingTabClick(v) {
    },
    //全选
    allChoose(item, el) {
      if (item.isAllChoose == "全选") {
        item.isAllChoose = "全否";
        item.floors.forEach(el => {
          el.status = 2;
        });
      } else if (item.isAllChoose == "全否") {
        item.isAllChoose = "全选";
        item.floors.forEach(el => {
          el.status = 0;
        });
      }
    },
    uploadBeforeRemove(file, fileList) {
      this.uploadMapUrl = "";
      this.fileList = [];
      this.uploadSuccess = false;
    },
    uploadSubmit() {
      if (this.value == 1) {
        this.params = {
          path: this.uploadMapUrl,
          type: this.value,
          xZhou: this.realWidth,
          yZhou: this.realHeight,
          projectId: this.projectId
        };
      } else if (this.value == 2) {
        this.params = {
          path: this.uploadMapUrl,
          type: this.value,
          xZhou: this.realWidth,
          yZhou: this.realHeight,
          projectId: this.projectId,
          floors: this.floors
        };
      }
      if (!this.params.path || this.params.path == "") {
        this.$message({
          type: "error",
          message: "没有选择图片"
        });
      } else if (!this.realWidth || this.realWidth == 0) {
        this.$message({
          type: "error",
          message: "没有填写平面图实际宽度"
        });
      } else if (!this.realHeight || this.realHeight == 0) {
        this.$message({
          type: "error",
          message: "没有填写平面图实际高度"
        });
      } else if (!this.floors || this.floors == []) {
        this.$message({
          type: "error",
          message: "没有选择平面图对应的楼层"
        });
      } else {
        postAddMap(this.params).then(res => {
          if (res.code == 200) {
            this.realWidth = "";
            this.realHeight = "";
            this.floors = [];
            this.buildings = [];
            this.uploadMapUrl = "";
            this.$message({
              type: "success",
              message: res.message
            });
          }
        });
      }
    }
  },
  mounted() {
    this.getProjects();
  }
};
</script>
<style lang="scss">
.baseStation {
  height: 100%;
  .baseStation__input {
    margin-left: 27px;
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .home-box {
    padding: 10px;
    position: absolute;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    .panel-group {
      height: 100%;
      .grid-col {
        height: 100%;
        .hydropower-summary {
          &::before {
            content: " ";
            display: inline-block;
            width: 100%;
            height: 4px;
            position: absolute;
            left: 0;
            top: 0;
            background-color: #00beda;
          }
        }
        .card-panel {
          height: 100%;
          font-size: 12px;
          position: relative;
          overflow: hidden;
          color: #666;
          background: #fff;
          box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
          border-color: rgba(0, 0, 0, 0.05);

          &::before {
            content: " ";
            display: inline-block;
            width: 100%;
            height: 4px;
            position: absolute;
            left: 0;
            top: 0;
          }
          .baseStation__dropdown {
            padding: 20px 28px;
            .el-dropdown-link {
              font-weight: bold;
            }
          }
          .baseStation__main {
            display: flex;
            width: 95%;
            height: 85%;
            margin: 0 auto;
            border: 1px solid #dfdfdf;
            .baseStation__left {
              width: 52%;
              border-right: 1px solid #dfdfdf;
              padding: 10px;
              position: relative;
              .baseStation__upload {
                width: 100%;
                border: 1px solid #d9d9d9;
                border-top-left-radius: 6px;
                border-top-right-radius: 6px;
                .baseStation__tips {
                  color: #999;
                  font-size: 12px;
                  margin-top: 10px;
                }
                .el-upload {
                  width: 100%;
                  .el-upload-dragger {
                    width: 100%;
                    border-bottom: 1px solid #d9d9d9;
                    border-top: none;
                    border-left: none;
                    border-right: none;
                    border-bottom-left-radius: 0;
                    border-bottom-right-radius: 0;
                    background-color: #f9f9f9;
                  }
                }
                .el-upload-list {
                  height: 50px;
                  overflow-y: hidden;
                }
                .el-upload-list {
                  width: 60%;
                }
              }
              .baseStation__buttonGroup {
                position: absolute;
                top: 304px;
                right: 20px;
                z-index: 999;
              }
            }
            .baseStation__right {
              width: 48%;
              .baseStation__building {
                padding-left: 30px;
                border-bottom: 1px solid #d9d9d9;
                height: 50%;
                .baseStation__building-main {
                  padding-right: 80px;
                  height: 80%;
                  overflow-y: scroll;
                  .baseStation__button {
                    width: 90px;
                    height: 30px;
                    padding: 7px;
                    margin-left: 0px;
                    margin-bottom: 10px;
                    margin-right: 10px;
                    span {
                      max-width: 100%;
                      white-space: nowrap;
                      overflow: hidden;
                      text-overflow: ellipsis;
                    }
                  }
                }
              }
              .baseStation__floor {
                padding-left: 30px;
                padding-top: 10px;
                position: relative;
                height: 50%;
                .baseStation__floor-main {
                  height: 100%;
                  .el-tabs {
                    height: 100%;
                  }
                  .el-tabs__nav-wrap::after {
                    background: none;
                  }
                  .el-tabs__item {
                    height: 30px;
                    line-height: 30px;
                  }
                  .el-tabs__nav-next,
                  .el-tabs__nav-prev {
                    line-height: 30px;
                  }
                  .el-tabs__header {
                    width: 90%;
                  }
                  .el-tabs__content {
                    padding-right: 80px;
                    height: 75%;
                    overflow-y: scroll;
                  }
                  .baseStation__button {
                    width: 90px;
                    height: 30px;
                    padding: 7px;
                    margin-left: 0px;
                    margin-bottom: 10px;
                    margin-right: 10px;
                    span {
                      max-width: 100%;
                      white-space: nowrap;
                      overflow: hidden;
                      text-overflow: ellipsis;
                    }
                  }
                }
                .baseStation__floor-allin {
                  position: absolute;
                  right: 20px;
                  top: 5px;
                }
              }
            }
          }
          .baseStation__bottomTips {
            position: absolute;
            left: 3%;
            bottom: 1%;
            color: #f36161;
          }
          .baseStation__uploadButton {
            position: absolute;
            margin: 1% auto 0;
            left: 50%;
            transform: translate(-50%, 0);
          }
        }
      }
    }
  }
}
</style>

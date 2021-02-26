<!--
 * @Author: changmengyu
 * @CreateTime: 2018-09-08 22:33:08 
 * @Desc: 通知公告详情
-->
<template>
    <el-dialog  width="60%" :title="title" :visible.sync="dialogVisible"  :close-on-click-modal="false"  append-to-body>
        <div class="details-container">
            <div class="container-box details-box">
                <div class="details-body">
                    <el-tabs type="border-card" style="height:100%">
                        <el-tab-pane label="基本信息">
                            <el-form size="small" :label-width="labelWidth" :model="formDatas" :rules="formDatasRules" ref="editForm">
                                <el-row>                               
                                    <el-col :xs="24" :sm="24" :md="24">
                                        <el-form-item label="公告标题" prop="title">
                                            <el-input v-model="formDatas.title" :disabled="edit" :maxlength="50"></el-input>
                                        </el-form-item>
                                    </el-col>    
                                    <el-col :xs="24" :sm="24" :md="24">
                                        <el-form-item label="内容" prop="content">
                                            <el-input type="textarea" v-model="formDatas.content" :disabled="edit" :rows="8" :maxlength="500"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    
                                </el-row>
                            </el-form>
                        </el-tab-pane>
                        <el-tab-pane label="附件信息">
                          <uploadFile ref="filePane2" :disabled="edit" :fileList="annex" @data="listenToFile">
                            <el-table-column prop="code" label="文件编号" mini-width="120">
                                <template slot-scope="scope">
                                  <el-input size="small" v-model="scope.row.code" :disabled="edit" :maxlength="12"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column prop="name" label="文件名称" mini-width="120"></el-table-column>
                            <el-table-column prop="type" label="文件类型" mini-width="120"></el-table-column>
                            <el-table-column prop="size" label="文件大小" mini-width="120"></el-table-column>
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
  updateInfoApi
} from "../../api/notice.js";
import uploadFile from '@/components/uploadFile/index.vue';
import {url} from "@/axios/base.js";
export default {
  components: {
    uploadFile
  },
  data() {
    return {
      
      labelWidth: "150px",
      activeNames: [],
      formDatas: {
       
       
      },
      fileList:[],
      selsdetails:[],
      formDatasRules: {
       title: [
          { required: true, message: "请输入公告标题", trigger: "blur" }
        ],
        content: [
          { required: true, message: "请输入内容", trigger: "blur" }
        ]
      },
      projectList: [],
      
    
      photoList: [],
      annex:[],
     
      //dialog模式
      title: "",
      edit: false,
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
      let pa ={
        id:'',
       title: this.formDatas.title,
       content:this.formDatas.content
      };
      let param = {
        body: {
          projectAnnouncement:pa,
          projectAnnouncementFile: this.removeEmpty(
                  this.$refs['filePane2'].datas
                )
        }
      };
      return param;
    }
  },
  mounted() {
    
    if (this.routeType == "view" || this.routeType == "update") {
      this.getInfo();
    }
  },
  methods: {
    listenToFile(fileList){
        this.annex = fileList;
    },
    //删除明细
    deleteRowDetails() {
      /*debugger;*/
      this.$confirm("确认删除选中记录吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {

          
         
        })
        .catch(() => {
        });
    },
    tableRowClassName({ row, rowIndex }) {
      row.index = rowIndex;
    },
    // 选择附件信息
    handleSelectionChangeDetails(sels) {
      this.selsdetails = sels;
    },
    handleNodeClick(data) {
    },
    upload(list, imgUrls) {
      this.formDatas.photos = imgUrls.join(",");
    },
    handleCancel() {
      if (this.title.search("编辑") != -1) {
        this.$confirm("修改内容将不被保存,是否确认取消?", "提示", {
          type: "warning"
        }).then(() => {
          this.dialogVisible = false;
        });
      } else if (this.title.search("新增") != -1) {
        this.$confirm("新增内容将不被保存,是否确认取消?", "提示", {
          type: "warning"
        }).then(() => {
          this.dialogVisible = false;
        });
      } else {
        this.dialogVisible = false;
      }
    },
    // 查看页面信息
    getInfo() {
      let param = {
        id: this.detailsId
      };
      getInfoApi(param).then(res => {

        this.formDatas = res.data.projectAnnouncement;

        this.annex = res.data.projectAnnouncementFile;
        // newdata.forEach(el => {
        //   el.url = el.photo
        //     ? url + "/fileUpload/filedownload?remotePath=" + el.photo
        //     : "";
        // });
        // this.photoList = newdata;
      });
    },
    
    handleSubmit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm("确认保存吗？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
           
            
            let method;
            if (this.routeType == "insert") {

              method = insertInfoApi(this.params);
            } else if (this.routeType == "update") {
              this.params.body.projectAnnouncement.id = this.detailsId;
              method = updateInfoApi(this.params);
            }
              method.then(res => {
              
              this.$message({
                message: res.message,
                type: res.success?'success':'error'
              });
              this.dialogVisible = false; //dialog模式
            });
          });
        }
      });
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

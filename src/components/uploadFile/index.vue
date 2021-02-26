<!--
 * @Author: pangyu 
 * @CreateTime: 2018-08-28 15:09:43 
 * @Desc: 图片上传 
-->
<template>
  <div class="uploadFile">
    <div>
      <el-button
        @click="uploadClick"
        size="mini"
        type="primary"
        :disabled="disabled || fileList.length==limit"
      >选择文件</el-button>
      <span class="file_solt_upload_name" :style="style">{{fileName}}</span>
      <input
        :id="DomId"
        @change="inputChange($event)"
        ref="upload"
        type="file"
        class="file_solt_upload_input"
        size="mini"
        value="选择文件"
        :accept="accept"
      >
      <el-button
        size="mini"
        icon="el-icon-upload"
        type="primary"
        :disabled="disabled"
        @click="submitUpload"
      >文件上传</el-button>
      <el-button
        type="danger"
        icon="el-icon-delete"
        size="mini"
        :disabled="disabled || selsdetails.length == 0"
        @click="deleteRowDetails"
      >删除</el-button>
    </div>
    <el-table
      ref="multipleTable"
      size="small"
      :data="datas"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <slot></slot>
      <el-table-column label="文档编写人" width="130" v-if="hide">
        <template slot-scope="scope">
          <el-input size="small" v-model="scope.row.author" :disabled="disabled" :maxlength="12"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="comments" label="备注" width="200" v-if="hide">
        <template slot-scope="scope">
          <el-input size="small" v-model="scope.row.comments" :disabled="disabled" :maxlength="200"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" v-if="newHide">
        <template slot-scope="scope">
          <a
            style="color:#0698d6;"
            :href="[fileBaseUrl+'/fileUpload/filedownload?remotePath='+scope.row.path]"
          >点击下载</a>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import _ from "lodash";
import { url } from "@/axios/base.js";
export default {
  data() {
    return {
      DomId:
        "upload_file_" +
        Math.random()
          .toString(36)
          .split(".")[1],
      headers: { token: sessionStorage.getItem("token") },
      datas: [],
      selsdetails: [],
      dialogVisible: false,
      fileBaseUrl: url,
      fileName: "",
      upInput: false,
      action: url + "/fileUpload/fileupload",
      style: ""
    };
  },
  props: {
    accept: {
      type: String,
      default: () => {
        return "image/png,image/gif,application/pdf,text/plain,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,text/csv,application/vnd.ms-works,image/jpeg,image/bmp,application/octet-stream";
      }
    },
    disabled: {
      type: Boolean,
      default: () => {
        return false;
      }
    },
    hide: {
      type: Boolean,
      default: () => {
        return true;
      }
    },
    newHide: {
      type: Boolean,
      default: () => {
        return true;
      }
    },
    limit: {
      type: Number,
      default: () => {
        return null;
      }
    },
    fileList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    fileSize: {
      type: [Number, String],
      default: () => {
        return 50;
      }
    }
  },
  watch: {
    fileList: {
      handler(val) {
        this.datas = val;
        if (val.length == this.limit) {
          this.upInput = true;
        }
      },
      deep: true
    }
  },
  methods: {
    uploadClick() {
      document.getElementById(this.DomId).click();
    },
    inputChange(event) {
      let names = event.target.value.split("\\");
      this.fileName = names[names.length - 1];
      this.style = "display:inline-block;";
      let _this = this;
      setTimeout(() => {
        _this.style = "";
      }, 100);
    },
    submitUpload() {
      let _this = this;
      //自定义文件上传自定义文件上传
      let fileObj = document.getElementById(this.DomId).files[0];
      let fileInput = _this.$refs.upload;
      let filemaxsize = 1024 * 1024 * Number(_this.fileSize); // 50M
      if (Number(fileObj.size) > Number(filemaxsize)) {
        this.$message({
          message: "选择文件大小不能超过" + _this.fileSize + "Mb！",
          type: "error"
        });
        return;
      }

      if (fileObj != undefined) {
        // 接收上传文件的后台地址
        let FileController =
          _this.fileBaseUrl +
          "/fileUpload/fileupload";
          // sessionStorage.getItem("token");
        // FormData 对象
        let form = new FormData();
        // 文件对象
        form.append("uploadFile", fileObj);
        // 其他参数
        form.append("type", null);
        // XMLHttpRequest 对象
        var xhr = new XMLHttpRequest();

        xhr.open("post", FileController, true);
        // xhr.setRequestHeader("Token", sessionStorage.getItem("token"));
        xhr.onload = function() {
          let res = JSON.parse(xhr.responseText).data;
          let names = res.fileName.split("\\");
          res.fileName = names[names.length - 1];
          let newRow = {
            code: "",
            name: res.fileName,
            type: res.fileType,
            author: "",
            authorName: res.fileAuthorName,
            comments: res.fileComments,
            model: res.fileModel ? res.fileModel : "",
            size: res.fileSize,
            path: res.filePath
          };
          _this.datas.push(newRow);
          //清空input

          document.getElementById(_this.DomId).value = "";
          _this.fileName = "";
          _this.$emit("data", _this.datas);
        };
        xhr.send(form);
      }
    },
    handleSelectionChange(sels) {
      this.selsdetails = sels;
    },
    deleteRowDetails() {
      this.$confirm("确认删除选中记录吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.datas = _.difference(this.datas, this.selsdetails);
          this.$emit("data", this.datas);
        })
        .catch(() => {});
    }
  }
};
</script>

<style lang="scss">
.file_solt_upload_name {
  padding: 0 5px;
  overflow: hidden;
  height: 0;
  width: 0;
}
.file_solt_upload_input {
  display: none;
}
</style>

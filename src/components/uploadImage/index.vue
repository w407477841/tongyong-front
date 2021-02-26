<template>
    <div :class="{'uploadImage-XY':true, 'hide-add':fileList.length === limit}">
        <el-upload :class="disabled?'view':''" :action="action" list-type="picture-card" :file-list.sync="datas" :disabled="disabled" :limit='limit' :on-preview="handlePictureCardPreview" :on-success="handleSuccess" :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible" :append-to-body="true" :close-on-click-modal="false">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
    </div>
</template>

<script>
import {url} from '@/axios/base.js'
export default {
  data() {
    return {
      datas: [],
      dialogImageUrl: '',
      dialogVisible: false,
      action: url + '/fileUpload/photoupload?type=photo&userName='+JSON.parse(sessionStorage.user).code
    };
  },
  props: {
    disabled: {
      type: Boolean,
      default: () => {
        return false;
      }
    },
    fileList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    limit: {
      type: Number,
      default: () => {
        return null;
      }
    }
  },
  watch: {
    fileList: {
      handler(val) {
        console.log(val)
        this.datas = val;
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    handleSuccess(file, fileList) {
      this.datas.push(fileList)
      let imgUrls = [];
      this.datas.forEach(el => {
        let url = el.photo?el.photo:el.response;
        imgUrls.push(url)
      });
      this.$emit('data', this.datas,imgUrls);
    },
    handleRemove(file, fileList) {
      this.datas = fileList;
      let imgUrls = [];
      this.datas.forEach(el => {
        let url = el.photo?el.photo:el.response;
        imgUrls.push(url)
      });
      this.$emit('data', this.datas,imgUrls);
    },
    handlePictureCardPreview(file) {
      // let urlHttp = file.url.split("://");
      // if(urlHttp[0] == "http") {
      //   this.dialogImageUrl = file.url;
      // }else {
      //   this.dialogImageUrl = url+ '/fileUpload/filedownload?remotePath='+file.url;
      // }
      this.dialogImageUrl = url+ '/fileUpload/filedownload?remotePath='+file.response;
      this.dialogVisible = true;
    }
  }
};
</script>

<style lang="scss">
.uploadImage-XY {
  .view {
    .el-upload--picture-card {
      display: none !important;
    }
    .el-upload-list__item-delete {
      display: none !important;
    }
    .el-upload-list__item-status-label {
      display: none !important;
    }
  }
}
.hide-add {
    .el-upload {
        display: none;
    }
}
</style>

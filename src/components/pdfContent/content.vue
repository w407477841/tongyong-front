<template>
  <el-dialog
    title="整改内容"
    :visible.sync="dialogContentVisible"
    class="content"
    width="60%"
    @close="handleCancle"
  >
    <el-form :model="form" label-width="85px" :rules="formDatasRules" ref="dialogForm">
      
      
        <el-input
          size="small"
          type="textarea"
          placeholder="请输入内容"
          v-model="form.textarea"
          maxlength="400"
          show-word-limit="true"
          rows="8"
          resize="none"
        ></el-input>
        <span class="content__count">{{`${form.textarea.length}/400`}}</span>
     
    </el-form>
    
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancle">取消</el-button>
      <el-button type="primary" @click="handleSubmit">打印预览</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { sendMessage, userList } from "@/views/crane/api/craneReport.js";
import { validatePhone } from "@/utils/validate.js";
import { printPDF } from "@/views/crane/api/craneReport.js";
import { truncate } from 'fs';
import { httpUrl } from '@/axios/base.js';
export default {
  data() {
    let checkPhone = (rule, value, callback) => {
      //   console.log(value);
      let array = value.length > 11 ? value.split(",") : [value];
      console.log(array);
      let error = 0;
      array.forEach(el => {
        if (!validatePhone(el) && el != "") {
          error++;
        }
      });
      if (error > 0) {
        return callback(new Error("请输入正确的手机号"));
      } else {
        return callback();
      }
    };
    return {
      form: {
        textarea: "",
        phone: ""
      },
      userList: [],
      key: "",
      currentPage: 1,
      phoneArray: [],
      formDatasRules: {
        phone: [
          //   { required: true, message: "请输入手机号码", trigger: "blur" },
          { validator: checkPhone, trigger: "change" }
        ]
      },
      userArray: [],
      pageSize: 9999,
      pageNum: 1,
      key: ""
    };
  },
  watch: {
    form: {
      deep: true,
      handler() {
        if (this.form.phone.length >= 11) {
          let array = this.form.phone.split(",");
          this.form.phone = this.dedupe(array).join(",");
          console.log(this.form.phone.length);
        }
      }
    }
  },
  mounted() {
  
 
  },
  props: {
    contentVisible: {
      require: true,
      default() {
        return false;
      }
    },
    projectId:{
      require:true,
      default(){
        return false;
      }
    },
    startTime:{
      require:true,
      default(){
        return false;
      }
    },
    endTime:{
      require:true,
      default(){
        return false;
      }
    },
    deviceNo:{
      require:true,
      default(){
        return false;
      }
    },
    craneNo:{
      require:true,
      default(){
        return false;
      }
    }
  },
  computed: {
    dialogContentVisible: {
      get() {
        if (this.contentVisible) {
          return true;
        } else if (!this.contentVisible) {
          return false;
        }
      },
      set() {
        if (this.contentVisible) {
          return true;
        } else if (!this.contentVisible) {
          return false;
        }
      }
    }
  },
  methods: {
    isCheckbox(row, index) {
      // console.log(this.form.phone.split(",").indexOf(row.phone));
      if (
        this.form.phone.length >= 119 &&
        this.form.phone.split(",").indexOf(row.phone) == -1
      ) {
        return false;
      } else {
        return true;
      }
    },
 
 
    //去重
    dedupe(array) {
      return Array.from(new Set(array));
    },
    
    //取消隐藏弹框
    handleCancle() {
      this.$emit("dialogContentVisibleChange");
    },
    //打印预览
    handleSubmit() {
      this.$refs.dialogForm.validate(valid => {
        if (valid) {
          let params = {
           
              content: this.form.textarea,
              projectId: this.projectId,
              deviceNo: this.deviceNo,
              craneNo: this.craneNo,
              startTime: this.startTime,
              endTime: this.endTime
           
          };
          printPDF(params).then(res => {
            console.log("查询结果",res);
            if (res.code == 200) {
              this.handleCancle();
             console.log("当前地址",httpUrl);
              window.location.href= "/static/pdf/web/index.html?file="+httpUrl+"rectifyReport.pdf";
                 
              
             
            }
          });
        }
      });
    },
    //去重
    dedupe(array) {
      return Array.from(new Set(array));
    },
   
  }
};
</script>

<style lang="scss">
.content {
  &__count {
    position: absolute;
    right: 25px;
    bottom: 100px;
    text-align: right;
    height: 25px;
    line-height: 25px;
    color: #ccc;
  }
  &__formItem {
    position: relative;
    width:100%;
  }
  &__pagination {
    position: absolute;
    bottom: 5px;
    left: 50%;
    transform: translate(-50%, 0);
  }
  &__phoneNumber {
    position: relative;
    height: 455px;
  }
  .el-dialog {
    border-radius: 3px;
  }
  .el-dialog__header {
    border-radius: 3px;
    padding: 15px;
    background-color: #f0f0f0;
    font-weight: bold;
    .el-dialog__title {
      font-size: 16px;
    }
  }
  .el-dialog__body {
    padding:10px 20px 20px 20px;
    display: flex;
    justify-content: space-between;
    form {
      width: 100%;
      height: 70%;
    }
    .message__phoneNumber {
      border: 1px solid #dcdfe6;
      padding: 15px 15px 0 15px;
      width: 48%;
    }
  }
  .el-table th {
    background-color: #f0f0f0 !important;
  }
  .el-form-item__label {
    color: #aaa;
  }
}
</style>

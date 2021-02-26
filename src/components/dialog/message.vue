<template>
  <el-dialog
    title="新建短信"
    :visible.sync="dialogFormVisible"
    class="message"
    width="80%"
    @close="handleCancle"
  >
    <el-form :model="form" label-width="85px" :rules="formDatasRules" ref="dialogForm">
      <el-form-item label="手机号码:" prop="phone">
        <el-input
          size="small"
          v-model="form.phone"
          autocomplete="off"
          placeholder="请输入手机号，用英文逗号分开，最多10个"
          maxlength="119"
        ></el-input>
      </el-form-item>
      <el-form-item label="短信内容:" class="message__formItem">
        <el-input
          size="small"
          type="textarea"
          placeholder="请输入内容"
          v-model="form.textarea"
          maxlength="200"
          show-word-limit="true"
          rows="20"
          resize="none"
        ></el-input>
        <span class="message__count">{{`${form.textarea.length}/200`}}</span>
      </el-form-item>
    </el-form>
    <div class="message__phoneNumber">
      <el-input placeholder="姓名/手机号码" v-model="key" size="small" @keyup.enter.native="keyEnter">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="keyEnter"></i>
      </el-input>
      <el-table
        :data="userList"
        style="width: 100%;margin-top:10px;"
        size="mini"
        height="87%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" :selectable="isCheckbox"></el-table-column>
        <el-table-column prop="phone" label="手机"></el-table-column>
        <el-table-column prop="name" label="姓名"></el-table-column>
      </el-table>
      <!-- <el-pagination
        class="message__pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="userList.length"
      ></el-pagination>-->
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancle">取消</el-button>
      <el-button type="primary" @click="handleSubmit">发送</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { sendMessage, userList } from "@/views/crane/api/craneReport.js";
import { validatePhone } from "@/utils/validate.js";
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
    this.form = Object.assign({}, this.form, { textarea: this.sms });
    this.getUserList();
  },
  props: {
    dialogVisible: {
      require: true,
      default() {
        return false;
      }
    },
    sms: {
      type: String,
      default() {
        return "";
      }
    }
  },
  computed: {
    dialogFormVisible: {
      get() {
        if (this.dialogVisible) {
          return true;
        } else if (!this.dialogVisible) {
          return false;
        }
      },
      set() {
        if (this.dialogVisible) {
          return true;
        } else if (!this.dialogVisible) {
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
    //搜索
    keyEnter() {
      console.log("keyEnter", this.key);
      this.getUserList();
    },
    //获取短信目标人员列表
    getUserList() {
      let params = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        key: this.key
      };
      userList(params).then(res => {
        console.log(res);
        if (res.code == 200) {
          this.userList = res.data.list;
          this.userArray = [];
          if (res.data.list.length > 0) {
            res.data.list.forEach(el => {
              this.userArray.push(el.phone);
            });
          }
        }
      });
    },
    //去重
    dedupe(array) {
      return Array.from(new Set(array));
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getUserList();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getUserList();
    },
    //取消隐藏弹框
    handleCancle() {
      this.$emit("dialogFormVisibleChange");
    },
    //保存发送短信
    handleSubmit() {
      this.$refs.dialogForm.validate(valid => {
        if (valid) {
          let params = {
            body: {
              content: this.form.textarea,
              phone: this.form.phone
            }
          };
          sendMessage(params).then(res => {
            console.log(res);
            if (res.code == 200) {
              this.$emit("dialogFormVisibleChange");
            }
          });
        }
      });
    },
    //去重
    dedupe(array) {
      return Array.from(new Set(array));
    },
    //右侧手机号码选择
    handleSelectionChange(val) {
      console.log(val);
      let array = [];
      if (this.form.phone.length > 11) {
        array = this.form.phone.split(",");
      } else if (this.form.phone.length <= 11 && this.form.phone.length > 0) {
        array = Array(this.form.phone);
      }
      console.log(array);
      //   array = array.filter(el => !~this.userArray.indexOf(el));
      let sels = [];
      if (val.length > 0) {
        val.forEach(el => {
          sels.push(el.phone);
        });
      }
      //   array.push(...sels);
      console.log("this.userArray", this.userArray);
      console.log("sels", sels);
      let newArray = this.userArray.filter(el => !~sels.indexOf(el));
      console.log(newArray);
      array.push(...this.userArray);
      array = array.filter(el => !~newArray.indexOf(el));
      console.log(array);
      array = this.dedupe(array);
      this.form.phone = array.join(",");
    }
  }
};
</script>

<style lang="scss">
.message {
  &__count {
    position: absolute;
    right: 5px;
    bottom: 0;
    text-align: right;
    height: 25px;
    line-height: 25px;
    color: #ccc;
  }
  &__formItem {
    position: relative;
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
    display: flex;
    justify-content: space-between;
    form {
      width: 48%;
      height: 455px;
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

<template>
  <div id="loginContainer" class="login-container">
    <div class="login-box">
      <!-- <div class="login-banner">
        <div class="banner-image"></div>
      </div>-->
      <div class="login-form">
 
        <el-form
          autocomplete="on"
          :model="loginForm"
          :rules="loginRules"
          ref="loginForm"
          label-position="left"
        >
          <h3 class="login-login"></h3>
          <el-form-item prop="username">
            <el-input
              type="text"
              v-model="loginForm.username"
              auto-complete="off"
              placeholder="请输入用户名"
            >
              <i slot="prefix" class="el-input__icon el-icon-person"></i>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              v-model="loginForm.password"
              auto-complete="off"
              placeholder="请输入密码"
            >
              <i slot="prefix" class="el-input__icon el-icon-mima"></i>
            </el-input>
          </el-form-item>
          <div class="rememberPwd">
            <el-checkbox v-model="rememberPwd">记住密码</el-checkbox>
          </div>
          <!-- <el-form-item>
            <div class="validate-box">
              <div class="validate-inp">
                <el-input type="text" v-model="loginForm.code" auto-complete="off" placeholder="请输入验证码"></el-input>
              </div>
              <div class="validate-code"></div>
            </div>
          </el-form-item>-->
          <el-form-item>
            <el-button
              class="loginBtn"
              type="primary"
              style="width:100%;"
              :loading="loading"
              @click.native.prevent="handleLogin"
            >登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="copyright">Copyright © 2019 江苏鸿鹄电子科技有限公司</div>
    <el-dialog
      title="选择公司"
      :visible.sync="groupsVisible"
      :close-on-click-modal="false"
      append-to-body
    >
      <el-button
        v-for="(item,index) in groups"
        :key="index"
        v-on:click="toGroup(item);"
      >{{item.name}}</el-button>
    </el-dialog>
  </div>
</template>

<script>
// import { isvalidUsername } from '@/utils/validate'

import {
  loginApi,
  toGroupApi,
  getUserOperationsApi,
  selectProjects
} from "./login";
export default {
  name: "login",
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
        loginType: "USERNAME",
        clientId:"abcdef",
        clientSecret:"123456"

      },
      value1:'',
      loginRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      },
      loading: false,
      groupsVisible: false,
      groups: [],
      rememberPwd: false
    };
  },
  mounted() {
    if (localStorage.getItem("rememberPwdCrane")) {
      this.loginForm = Object.assign(
        {},
        this.loginForm,
        JSON.parse(localStorage.getItem("rememberPwdCrane"))
      );
      this.rememberPwd = true;
    }
    //回车登录
    let that = this;
    document.onkeydown = function(e) {
      // 回车提交表单
      // 兼容FF和IE和Opera
      if (that.$route.path != "/login") {
        return;
      }
      var theEvent = window.event || e;
      var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
      if (code == 13) {
        that.handleLogin();
      }
    };


  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
           this.loading = true;

          loginApi(this.loginForm).then(res => {
            this.loading = false;

            if (res.code == "200") {
              if (this.rememberPwd) {
                localStorage.setItem(
                  "rememberPwdCrane",
                  JSON.stringify(this.loginForm)
                );
              } else {
                localStorage.removeItem("rememberPwdCrane");
              }
              sessionStorage.setItem("auth", res.auth);
              let user = res.user;
              sessionStorage.setItem("user", JSON.stringify(user));

              this.groups = user.groups || [];
              sessionStorage.setItem("pros", JSON.stringify(this.groups));
              if (this.groups.length > 1) {
                this.groupsVisible = true;
              } else {
                this.toGroup(user.groups[0]);
              }
            } else {
              this.$message({
                message: res.message,
                type: "error"
              });
            }
          }).catch(e=>{
            console.info(e)
             this.loading = false;
              this.$message({
                message: "无服务",
                type: "error"
              });
          });
        } else {
          return false;
        }
      });
    },
    toGroup(item) {
      let param = {
        body: item.id
      };
      console.log(item);
      toGroupApi(param).then(res => {
        sessionStorage.setItem("orgName", item.name);
        sessionStorage.setItem("orgId", item.id);
        sessionStorage.setItem("topId", item.id);
        selectProjects({}).then(res => {
          this.getUserOperations();
        });
      });
    },
    getUserOperations() {
      getUserOperationsApi().then(res => {
        sessionStorage.setItem("userOperations", res);
        if (res.indexOf("dust:home:menu") > -1) {
          this.$router.push({ path: "/dust/dusthome" });
        } else if (res.indexOf("crane:home:menu") > -1) {
          this.$router.push({ path: "/tower/towerhome" });
        } else if (res.indexOf("lift:home:menu") > -1) {
          this.$router.push({ path: "/lift/lifthome" });
        } else if (res.indexOf("hydropower:home:menu") > -1) {
          this.$router.push({ path: "/hydropower/hydropowerhome" });
        } else {
          this.$router.push({ path: "/home" });
        }
      });
      //this.$router.push({ path: '/' });
    },
    //获取  集团下所有项目
    getProjects() {}
  }
};
</script>

<style lang="scss" scoped>
.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background: linear-gradient(135deg, #2e7bb3, #51aece);
  background-image: url("~@/assets/image/login_bg.png");
  background-size: cover;
  background-repeat: no-repeat;
  .login-box {
    z-index: 11;
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    width: 380px;
    margin: -190px auto 0;
    display: flex;
    align-items: flex-end;
    .login-form {
      width: 380px;
      height: 345px;
      padding: 35px 35px 15px 35px;
      background-color: rgba(255, 255, 255, 0.2);
      .login-login {
        height: 45px;
        margin-bottom: 50px;
        margin-top: 0;
        background-image: url("~@/assets/image/login_logo.png");
        background-repeat: no-repeat;
        background-position: left;
        background-size: contain;
      }
      .validate-box {
        display: flex;
        .validate-code {
          width: 90px;
          height: 40px;
          background-color: #000;
          margin-left: 20px;
        }
        .validate-inp {
          flex: 1;
        }
      }
    }
    .loginBtn {
      background-color: #0c4c98;
    }
  }
  .copyright {
    position: absolute;
    width: 100%;
    bottom: 0;
    left: 0;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    color: #fff;
    text-align: center;
    background-color: rgba(255, 255, 255, 0.1);
  }
}
</style>
<style lang="scss">
.login-form {
  .el-input__inner {
    background-color: #56d0f7;
    border: solid 1px #56d0f7;
    color: rgba(0, 0, 0, 0.8);
    &::placeholder {
      color: #334a65 !important;
    }
  }
  .el-input__prefix {
    color: #008db7;
  }
}
.rememberPwd {
  /* text-align: right; */
  margin-bottom: 10px;
}
.rememberPwd .el-checkbox__label {
  color: #334a65 !important;
}
</style>

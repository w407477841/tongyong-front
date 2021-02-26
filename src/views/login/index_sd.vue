<template>
  <div id="loginContainer" class="login-container">
    <div class="login-box">
      <!-- <div class="login-banner">
        <div class="banner-image"></div>
      </div> -->
      <div class="login-form">
        <el-form autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
          <h3 class="login-login"></h3>
          <el-form-item prop="username">
            <el-input type="text" v-model="loginForm.username" auto-complete="off" placeholder="请输入用户名">
              <i slot="prefix" class="el-input__icon el-icon-person"></i>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" v-model="loginForm.password" auto-complete="off" placeholder="请输入密码">
              <i slot="prefix" class="el-input__icon el-icon-mima"></i>
            </el-input>
          </el-form-item>
          <!-- <el-form-item>
            <div class="validate-box">
              <div class="validate-inp">
                <el-input type="text" v-model="loginForm.code" auto-complete="off" placeholder="请输入验证码"></el-input>
              </div>
              <div class="validate-code"></div>
            </div>
          </el-form-item> -->
          <el-form-item>
            <el-button class="loginBtn" type="primary" style="width:100%;" :loading="loading" @click.native.prevent="handleLogin">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="copyright">Copyright © 2019 南通星云智能科技有限公司</div>
    <el-dialog title="选择公司" :visible.sync="groupsVisible" :close-on-click-modal="false" append-to-body>
      <el-button v-for="(item,index) in groups" :key="index" v-on:click="toGroup(item);">{{item.name}}</el-button>
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
} from './login';
export default {
  name: 'login',
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
        loginType: 2
      },
      loginRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      loading: false,
      groupsVisible: false,
      groups: []
    };
  },
  mounted() {
    //回车登录
    let that = this;
    document.onkeydown = function(e) {
      // 回车提交表单
      // 兼容FF和IE和Opera
      if (that.$route.path != '/login') {
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

            if (res.code == '200') {
              sessionStorage.setItem('auth', res.auth);
              let user = res.user;
              sessionStorage.setItem('user', JSON.stringify(user));

              this.groups = user.groups || [];

              if (this.groups.length > 1) {
                this.groupsVisible = true;
              } else {
                this.toGroup(user.groups[0]);
              }
            } else {
              this.$message({
                message: res.message,
                type: 'error'
              });
            }
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
      toGroupApi(param).then(res => {
        sessionStorage.setItem('orgName', item.Name);
        sessionStorage.setItem('orgId', item.id);
        sessionStorage.setItem('topId', item.id);
        selectProjects({}).then(res => {
          sessionStorage.setItem(
            'pros',
            JSON.stringify(
              res.data.map(item => {
                return { id: item.id, name: item.name };
              })
            )
          );
          this.getUserOperations();
        });
      });
    },
    getUserOperations() {
      getUserOperationsApi().then(res => {
        sessionStorage.setItem('userOperations', res);
        if (res.indexOf('dust:home:menu') > -1) {
          this.$router.push({ path: '/dust/dusthome' });
        } else if (res.indexOf('crane:home:menu') > -1) {
          this.$router.push({ path: '/tower/towerhome' });
        } else if (res.indexOf('lift:home:menu') > -1) {
          this.$router.push({ path: '/lift/lifthome' });
        } else if (res.indexOf('hydropower:home:menu') > -1) {
          this.$router.push({ path: '/hydropower/hydropowerhome' });
        } else{
          this.$router.push({ path: '/debugging' });
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
  background-image: url('~@/assets/login/sdbg.png');
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
      background-color: rgba(255, 255, 255, 0.85);
      .login-login {
        height: 45px;
        margin-bottom: 50px;
        margin-top: 0;
        background-image: url("~@/assets/login/sdlogo.png");
        background-repeat: no-repeat;
        background-position: center;
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
      background-color: #1296db;
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
    background-color: #f8f8f8;
    border: solid 1px #f8f8f8;
    color: #008db7;
  }
  .el-input__prefix {
    color: #008db7;
  }
}
</style>

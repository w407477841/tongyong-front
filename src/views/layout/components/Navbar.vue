<template>
  <el-menu class="navbar" mode="horizontal">
    <div class="sidebar-title">
      <div class="sidebar-logo"></div>
      <div class="sidebar-text"></div>
    </div>
    <hamburger
      v-if="device==='mobile'"
      class="hamburger-container"
      :toggleClick="toggleSideBar"
      :isActive="sidebar.opened"
    ></hamburger>
    <!-- <breadcrumb></breadcrumb> -->
    <div class="right-container">
      <template>
        <div class="project-container">
          <!-- <el-select
            class="projectselectBlur"
            size="small"
            v-model="orgId"
            filterable
            placeholder="请选择"
            popper-class="selectClass"
            @change="orgChange"
          >
            <el-option label="所有项目部" :value="topId"></el-option>
            <el-option v-for="item in projects" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>-->
          <el-dropdown trigger="click">
            <div class="navbar-dropdown-link">
              {{orgName}}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </div>
            <el-dropdown-menu slot="dropdown">
              <!-- <el-dropdown-item @click.native="orgChange({id:topId,name:'所有项目部'})">所有项目部</el-dropdown-item> -->
              <el-dropdown-item
                v-for="item in projects"
                :key="item.id"
                @click.native="orgChange(item)"
              >{{item.name}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </template>
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <span class="user-name">{{user.name}}</span>
          <img class="user-avatar" src="~@/assets/image/defaultHeadImg.svg">
        </div>
        <el-dropdown-menu class="user-dropdown" slot="dropdown">
          <a @click="changePassword" class="inlineBlock">
            <el-dropdown-item>修改密码</el-dropdown-item>
          </a>
          <a @click="logout" class="inlineBlock">
            <el-dropdown-item divided>退出</el-dropdown-item>
          </a>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </el-menu>
</template>

<script>
import { mapGetters } from "vuex";
// import Breadcrumb from '@/components/Breadcrumb';
import Hamburger from "@/components/Hamburger";
import { toGroupApi, getUserOperationsApi } from "@/views/login/login.js";

export default {
  components: {
    // Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters(["sidebar", "avatar"]),
    device() {
      return this.$store.state.app.device;
    },
    projects() {
      let projects = JSON.parse(sessionStorage.getItem("pros"));
      return projects;
    }
  },
  data() {
    return {
      visible: false,
      topId: Number(sessionStorage.getItem("topId")), //集团
      user: JSON.parse(sessionStorage.getItem("user")),
      // projects:  sessionStorage.getItem('projects'),
      orgName: sessionStorage.getItem("orgName"),
      orgId: Number(sessionStorage.getItem("orgId")) //存放当前项目
    };
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("ToggleSideBar");
    },
    orgChange(item) {
      this.orgId = item.id;
      this.orgName = item.name;
      // let orgInfo = {};
      // this.projects.forEach(el => {
      //   if (el.id == this.orgId) {
      //     orgInfo = el;
      //   }
      // });

      let param = {
        body: this.orgId
      };
      toGroupApi(param).then(res => {
        sessionStorage.setItem("orgId", this.orgId);
        sessionStorage.setItem("orgName", this.orgName);
        location.reload();

        //	this.$message({type:"success",message:"切换成功"})
      });
    },
    logout() {
      this.$confirm("确认退出吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          //this.$message.error({ message: '请重新登录！' });
          sessionStorage.removeItem("user");
          sessionStorage.removeItem("userOperations");
          sessionStorage.removeItem("auth");
          sessionStorage.removeItem("orgName");
          sessionStorage.removeItem("orgId");
          sessionStorage.removeItem("pros");
          this.$store.dispatch("delAllViews");
          this.$router.push({ path: "/login" });
        })
        .catch(() => {});
    },

    changePassword: function() {
      this.$emit("setShow", { sign: "修改密码" });
    }
  },
  mounted() {}
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  background-image: linear-gradient(90deg, #0078bc 0%, #00beda 100%),
    linear-gradient(#ffffff, #ffffff);
  background-blend-mode: normal, normal;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
  .right-container {
    float: right;
  }
  .project-container {
    display: inline-block;
    margin-right: 25px;
    // max-width: 100px;
    font-size: 14px;
    .project-active {
      height: 50px;
      display: flex;
      .project-name {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
  .avatar-container {
    height: 50px;
    display: block;
    float: right; // position: absolute;
    // right: 35px;
    .avatar-wrapper {
      cursor: pointer;
      position: relative;
      display: flex;
      align-content: center;
      .user-name {
        display: inline-block;
        color: #ffffff;
      }
      .user-avatar {
        width: 40px;
        height: 40px;
        margin-top: 2px;
        margin-left: 10px;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
  }
}
</style>
<style lang="scss">
.project-box {
  height: 200px;
  overflow: hidden;
  .project-scrollbar {
    height: 100%;
    .el-scrollbar__wrap {
      overflow-x: hidden;
      .project-items {
        .project-item {
          padding: 10px 0;
          cursor: pointer;
          border-bottom: 1px solid #dddddd;
          &:hover {
            color: #0698d6;
          }
        }
      }
    }
  }
}
.projectselectBlur {
  width: 200px;
}
.selectClass {
  width: 200px;
}
.navbar-dropdown-link {
  display: inline-block;
  height: 100%;
  cursor: pointer;
  color: #ffffff;
}
</style>




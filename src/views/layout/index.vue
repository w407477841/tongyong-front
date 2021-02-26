<template>
  <div class="app-wrapper" :class="classObj">
    <!-- <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside"></div> -->
    <navbar @setShow="setShow"></navbar>
    <div class="app-wrapper-bottom">
      <sidebar></sidebar>
      <div class="main-container">
        <TagsView/>
        <app-main></app-main>
      </div>
    </div>
    <el-dialog
      title="修改密码"
      :visible.sync="changeVisible"
      :close-on-click-modal="false"
      width="30%"
      v-if="changeVisible"
    >
      <change-password @setShow="setShow"></change-password>
    </el-dialog>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain, TagsView } from "./components";
import ChangePassword from "./components/changePassword.vue";
import ResizeMixin from "./mixin/ResizeHandler";

export default {
  data() {
    return {
      changeVisible: false
    };
  },
  name: "layout",
  components: {
    Navbar,
    Sidebar,
    AppMain,
    TagsView,
    ChangePassword
  },
  mixins: [ResizeMixin],
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar;
    },
    device() {
      return this.$store.state.app.device;
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === "mobile"
      };
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch("CloseSideBar", { withoutAnimation: false });
    },
    setShow: function(data) {
      if (data.sign == "修改密码") {
        this.changeVisible = true;
      } else if (data.sign == "关闭修改密码") {
        this.changeVisible = false;
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("userOperations");
        sessionStorage.removeItem("auth");
        sessionStorage.removeItem("orgName");
        sessionStorage.removeItem("orgId");
        this.$router.push({ path: "/login" });
      } else if (data.sign == "取消修改密码") {
        this.changeVisible = false;
      }
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}
</style>

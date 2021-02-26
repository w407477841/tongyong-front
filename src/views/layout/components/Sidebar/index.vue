<template>
  <div class="sidebar-container">
    <div class="menu-container">
      <div class="route-menu">
        <!-- <div class="hamburger_box" v-if="device!=='mobile'">
          <hamburger
            class="hamburger-container"
            :toggleClick="toggleSideBar"
            :isActive="sidebar.opened"
          ></hamburger>
        </div> -->
        <el-scrollbar wrapClass="scrollbar-wrapper">
          <el-menu
            mode="vertical"
            unique-opened
            :show-timeout="200"
            :default-active="$route.path"
            :collapse="isCollapse"
            background-color="#334a65"
            text-color="#85a0bf"
            active-text-color="#fff"
          >
            <template v-for="route in routes">
              <sidebar-item
                v-if="route.alwaysShow"
                :key="route.name"
                :item="route"
                :base-path="route.path"
              ></sidebar-item>
            </template>
          </el-menu>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script>
import Hamburger from "@/components/Hamburger";

import { mapGetters } from "vuex";
import SidebarItem from "./SidebarItem";

export default {
  components: {
    SidebarItem,
    Hamburger
  },
  data() {
    return {
      active: "",
      childRoutes: [],
      permission: sessionStorage.getItem("userOperations")
    };
  },
  computed: {
    ...mapGetters(["sidebar"]),
    device() {
      return this.$store.state.app.device;
    },
    routes() {
      return this.$router.options.routes;
    },
    isCollapse() {
      return !this.sidebar.opened;
    }
  },
  mounted() {},
  methods: {
    checkPermssion: function(str, strs) {
      if (!str) {
        return true;
      }
      return strs.indexOf(str) > -1 ? true : false;
    },
    toggleSideBar() {
      this.$store.dispatch("ToggleSideBar");
    },
    routerClick(items, index) {
      items.forEach(el => {
        el.navActive = false;
      });
      items[index].navActive = true;
      this.childRoutes = items[index].children;
    }
  }
};
</script>

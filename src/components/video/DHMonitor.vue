<!--
 * @Author: zhangzhenya 
 * @CreateTime: 2018-08-27 15:04:47 
 * @Desc: 大华视频组件 
-->
<template>
    <div class="monitor">
      <div class="tajialert">
					<div id="login_install_dialog" style="display:none;height:1.25rem;width:25rem;padding-top:1.875rem;margin:auto;">
					  <div style="clear:both;zoom:1;border:.125rem solid #373737;background:#D5D5D5;">
								<a id="login_btn_install" href="/webplugin.exe" target="_download" onclick="instal()" style="background:rgb(255,0,0);">Instal</a>
								<a id="login_btn_cancel" href="javascript:;">Cancle</a>
						</div>
					</div>
					<div id="f_ocx" style="top:5rem;left:0;width:100%;height:100%;"></div>
			</div>
    </div>
</template>

<script>
export default {
  props: ["listMaterialMonitor"],
  data() {
  },
  // watch: {
  //   listMaterialMonitor() {
  //     this.openDahua();
  //   }
  // },
  mounted(){
    this.openDahua();
  },
  methods: {
    openDahua() {
      //console.log("111",this.listMaterialMonitor);
      var that = this;
      var info = {
        ip: that.listMaterialMonitor.ip,
        port: that.listMaterialMonitor.port,
        username: that.listMaterialMonitor.username,
        password: that.listMaterialMonitor.password
      };
      var mainOcxHtml = "";
      var agent = navigator.userAgent.toLowerCase();
      var PLUGINS_CLASSID = "7F9063B6-E081-49DB-9FEC-D72422F2727F";
      var VERSION_GUI = "version=3,1,0,4"; //注意：本地GUI上版本信息显示需要的字符串，修改版本的时候这个字符串也要修改
      var Sys = {};
      var sys_flag = true;
      var isMac = navigator.userAgent.toLowerCase().indexOf("mac") != -1;
      var ua = navigator.userAgent.toLowerCase();
      var s;
      (s = ua.match(/(msie\s|trident.*rv:)([\d.]+)/))
        ? (Sys.ie = s[2])
        : (s = ua.match(/firefox\/([\d.]+)/))
          ? (Sys.firefox = s[1])
          : (s = ua.match(/chrome\/([\d.]+)/))
            ? (Sys.chrome = s[1])
            : (s = ua.match(/opera.([\d.]+)/))
              ? (Sys.opera = s[1])
              : (s = ua.match(/version\/([\d.]+).*safari/))
                ? (Sys.safari = s[1])
                : 0;
      // var PLUGINS_NAME = 'WebActiveEXE.Plugin.1';
      // var hasPlugin = checkPlugins(Sys.ie);

      var g_PlayTime;
      var g_curSpeed = 4; //默认的正常速度
      var htmlStChn1 = "";
      sys_flag = Sys.ie;
      loadPlugins(sys_flag, info);
    }
  }
};
</script>

<style lang="scss" scoped>
.monitor {
  width: 100%;
  height: 100%;
  .tajialert {
    width: 100%;
    height: 100%;
  }
}
</style>

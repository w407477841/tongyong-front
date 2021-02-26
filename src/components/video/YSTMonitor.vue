<!--
 * @Author: zhangzhenya 
 * @CreateTime: 2019-05-16 10:04:47 
 * @Desc: 云视通视频组件 
-->
<template>
  <div class="monitor">
    <div style=" position: relative; z-index:-1;" class="videoPlugin" id="plugConter"></div>
    <div class="btnGroup">
      <button
        v-if="channelsLen>1"
        @click="changePage(-1)"
        :class="['monitor__pagination',pageIndex==0?'disable':'']"
      >上一页</button>
      <button v-if="isCapturePic" @click="clickCapturePic" class="monitor__pagination">抓图</button>
      <button
        v-if="channelsLen>1"
        @click="changePage(1)"
        :class="['monitor__pagination',pageIndex==channelsLen-1?'disable':'']"
      >下一页</button>
    </div>
  </div>
</template>

<script>
export default {
  // props: ["baseInfo", "tag", "isCapturePic", "cameraIndex"],
  props: {
    pagination: {
      type: Boolean,
      default() {
        return true;
      }
    },
    baseInfo: {
      // 必须提供字段
      required: true
    },
    tag: {
      // 必须提供字段
      required: true
    },
    isCapturePic: {
      // 可选字段，有默认值
      required: true
    },
    isGroup: {
      required: false,
      default: true
    },
    cameraIndex: {
      required: false,
      default: 1
    }
  },
  data() {
    return {
      channelsList: [],
      channelsLen: 0,
      pageIndex: 0,
      pageSize: 9,
      channels: [],
      // 全局保存当前选中窗口
      g_iWndIndex: "", //可以不用设置这个变量，有窗口参数的接口中，不用传值，开发包会默认使用当前选择窗口
      YSTobj: null //OS
    };
  },
  watch: {
    g_iWndIndex() {
      console.log(this.g_iWndIndex);
    }
  },
  beforeDestroy() {
    this.clickStopRealPlay();
  },
  async mounted() {
    this.IsWin7_64();
    this.YSTobj = this.getOs();
    this.InitPlugin();
    this.listenObj();
    this.listenObj;
    this.JSConnectAll();
    // this.clickLogout();
    // this.clickStopRealPlay();
    // this.clickLogin();
    // this.setLocalCfg();
  },
  methods: {
    // 一维数组 转 二维数组
    cf(arr, n) {
      if (!Array.isArray(arr) || arr.length == 0) {
        return [];
      }
      let tem = [],
        size = arr.length,
        count = Math.floor((size - 1) / n) + 1;
      while (count--) {
        tem.unshift(arr.slice(count * n, (count + 1) * n));
      }
      return tem;
    },
    //切换页码
    changePage(num) {
      this.pageIndex = this.pageIndex + num;
      this.clickStopRealPlay();
      this.channels = this.channelsList[this.pageIndex];
      this.clickStartRealPlay(this.channels);
    },
    //初始化
    InitPlugin() {
      try {
        if (obj == "Chrome") {
          JSSetChromeExplorer();
        }
        JSDivideWindow(this.pageSize);
      } catch (e) {
        setTimeout("InitPlugin();", 200);
      }
    },
    //监听播放器事件
    listenObj() {
      if (this.YSTobj == "MSIE") {
        document.getElementById("plugConter").innerHTML =
          '<object id="MS_Activex" classid="clsid:12168BC5-28EF-4898-883B-22EC3B5FD53E" height="600" width="1000"> </object>';
      } else if (this.YSTobj == "Firefox") {
        document.getElementById("plugConter").innerHTML =
          '<object id="MS_Activex" type="application/webcc-plugin" height="600" width="1000"> </object>';
      } else if (this.YSTobj == "Chrome") {
        document.getElementById("plugConter").innerHTML =
          '<object id="MS_Activex" type="application/webcc-plugin" width="1000" height="600" ></object>';
      }

      if (this.YSTobj == "MSIE") {
        MS_Activex.attachEvent("OnChnSelected", this.OnChnSelected);
        MS_Activex.attachEvent("OnChnStateChanged", this.OnChnStateChanged);
        MS_Activex.attachEvent("OnConnectChanged", this.OnConnectChanged);
      }
    },
    //退出登录
    //停止视频
    //登录全部连接
    JSConnectAll() {
      var yst = this.baseInfo.ip;
      var account = this.baseInfo.username;
      var pwd = this.baseInfo.password;
      var winDivide = 0;
      JSDisconnectAll();
      JSDivideWindow(this.pageSize);
      for (var i = 0; i < this.pageSize; i++) {
        MS_Activex.JSConnect(yst, account, pwd, 9101, i + 1, i + 1, false);
      }
    },
    // 获取频道
    // 开始播放
    // 设置本地参数
    // 抓图
    JSVideoCapture() {
      //视频抓拍
      var yst = this.baseInfo.ip;
      var chnno = txt_chno.value;
      var str = MS_Activex.JSVideoCapture(yst, chnno);
      alert(str);
    },
    //断开全部
    JSDisconnectAll() {
      MS_Activex.JSDisconnectAll();
    },
    JSSetChromeExplorer() {
      MS_Activex.JSSetChromeExplorer();
    },
    //分屏
    JSDivideWindow(nNum) {
      MS_Activex.JSDivideWindow(nNum);
    },
    IsWin7_64() {
      if (
        navigator.userAgent.indexOf("MSIE") > 0 &&
        navigator.userAgent.indexOf("Windows NT 6.1") > 0 &&
        navigator.userAgent.indexOf("x64") > 0
      ) {
        alert("请使用32位浏览器!");
      }
    },

    getOs() {
      //判断ie
      if (!!window.ActiveXObject || "ActiveXObject" in window) {
        return "MSIE";
      }

      /* //判断ie6-ie10
        if (navigator.userAgent.indexOf("MSIE") > 0) {
        return "MSIE";
        }*/
      if ((isFirefox = navigator.userAgent.indexOf("Firefox") > 0)) {
        return "Firefox";
      }
      if ((isSafari = navigator.userAgent.indexOf("Chrome") > 0)) {
        return "Chrome";
      }
      if ((isCamino = navigator.userAgent.indexOf("Safari") > 0)) {
        return "Safari";
      }
      return "Chrome";
    },

    OnChnStateChanged(ip, nSrv, state) {
      //        alert("OnChnStateChanged:" + ip + "服务通道:" + nSrv + "状态:" + state);
    },

    OnChnSelected(ip, nSrv, nLocalIndex, state) {
      //        alert("OnChnSelected:" + ip + "窗口:" + nLocalIndex + "服务通道:" + nSrv + "状态:" + state);
    },

    /*连接返回状态*/
    // var ConnectState =
    //     {
    //         CS_NOCONN: 0, 	//没有连接
    //         CS_CONNECTING: 1, 	//连接中
    //         CS_CONNOK: 2, 	//连接成功
    //         CONNERR: 3, 	//连接失败
    //         DISOK: 4, 	//断开连接成功
    //         CS_DISCON: 5, 	//连接异常断开
    //         CS_SSTOP: 6, 	//服务停止
    //         CS_OTHER: 7
    //     }

    OnConnectChanged(ip, nSrv, state) {
      //alert("Connect:" + ip + "通道" + nSrv + "的连接状态为" + state);
    }
  }
};
</script>

<style lang="scss" scoped>
.monitor {
  width: 100%;
  height: 100%;
  position: relative;
  .videoPlugin {
    width: 100%;
    height: 100%;
  }
  .btnGroup {
    width: 470px;
    height: 26px;
    position: absolute;
    left: 50%;
    bottom: -40px;
    transform: translate(-50%, 0);
    display: flex;
    justify-content: space-around;
  }
  .monitor__pagination {
    width: 150px;
    height: 26px;
    line-height: 26px;
    box-shadow: inset 0 0 2rem rgba(0, 246, 255, 0.4);
    border: solid 1px #004a7c;
    color: #fff;
    background-color: transparent;
  }
  .disable {
    color: #414141;
    border: solid 1px #333537;
    box-shadow: inset 0 0 2rem rgba(16, 38, 39, 0.4);
    visibility: hidden;
  }
}
</style>

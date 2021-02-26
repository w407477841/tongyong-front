<!--
 * @Author: zhangzhenya 
 * @CreateTime: 2018-08-27 15:04:47 
 * @Desc: 海康视频组件 
-->
<template>
  <div class="monitor">
    <div style=" position: relative; z-index:-1;" class="videoPlugin" id="videoPlugin"></div>
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
        return false;
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
      default: null
    }
  },
  data() {
    return {
      channelsList: [],
      channelsLen: 0,
      pageIndex: 0,
      pageSize: 4,
      channels: [],
      // 全局保存当前选中窗口
      g_iWndIndex: "" //可以不用设置这个变量，有窗口参数的接口中，不用传值，开发包会默认使用当前选择窗口
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
    this.initIntelligentVideo();
    this.clickLogout();
    this.clickStopRealPlay();
    this.clickLogin();
    this.setLocalCfg();
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
      this.$emit("channels", this.channels);
    },
    initIntelligentVideo: function() {
      let that = this;
      $(function() {
        // 检查插件是否已经安装过
        var iRet = WebVideoCtrl.I_CheckPluginInstall();
        if (-2 == iRet) {
          return;
        } else if (-1 == iRet) {
          return;
        }

        // 初始化插件参数及插入插件
        WebVideoCtrl.I_InitPlugin("100%", "100%", {
          bWndFull: true, //是否支持单窗口双击全屏，默认支持 true:支持 false:不支持
          iWndowType: 1,
          cbSelWnd: function(xmlDoc) {
            console.log(
              111,
              xmlDoc,
              $(xmlDoc)
                .find("SelectWnd")
                .eq(0)
                .text()
            );
            that.g_iWndIndex = $(xmlDoc)
              .find("SelectWnd")
              .eq(0)
              .text();
            that.$emit("g_iWndIndex", that.g_iWndIndex);
            var szInfo = "当前选择的窗口编号：" + this.g_iWndIndex;
          },
          szColorProperty: "sub-border:ffffff"
        });
        WebVideoCtrl.I_InsertOBJECTPlugin("videoPlugin");
        //只加载一个窗口
        // 检查插件是否最新
        if (-1 == WebVideoCtrl.I_CheckPluginVersion()) {
          return;
        }
        // 窗口事件绑定
        $(window).bind({
          resize: function() {
            var $Restart = $("#restartDiv");
            if ($Restart.length > 0) {
              var oSize = getWindowSize();
              $Restart.css({
                width: oSize.width + "px",
                height: oSize.height + "px"
              });
            }
          }
        });
      });
    },
    clickLogout() {
      var that = this;
      console.log(that.baseInfo.ip);
      var ip = that.baseInfo.ip;
      if (that.tag == 1) {
        ip = that.baseInfo.ip1;
      }
      var iRet = WebVideoCtrl.I_Logout(ip);
      console.log(2);
    },
    clickStopRealPlay() {
      console.log("stop");
      for (var i = 0; i < this.channels.length; i++) {
        WebVideoCtrl.I_Stop(i);
      }
      console.log(3);
    },
    clickLogin() {
      var that = this;
      if (that.tag == 0) {
        var iRet = WebVideoCtrl.I_Login(
          that.baseInfo.ip,
          1,
          that.baseInfo.port,
          that.baseInfo.username,
          that.baseInfo.password,
          {
            async: false,
            success: function(xmlDoc) {
              setTimeout(function() {
                that.getChannelInfo();
              }, 10);
            },
            error: function() {
              alert(that.baseInfo.ip + " 登录失败！");
            }
          }
        );
      } else if (that.tag == 1) {
        var iRet = WebVideoCtrl.I_Login(
          that.baseInfo.ip1,
          1,
          that.baseInfo.port1,
          that.baseInfo.username1,
          that.baseInfo.password1,
          {
            async: false,
            success: function(xmlDoc) {
              setTimeout(function() {
                that.getChannelInfo();
              }, 10);
            },
            error: function() {
              alert(that.baseInfo.ip1 + " 登录失败！");
            }
          }
        );
      }
      console.log(4);
    },
    getChannelInfo: function() {
      var that = this;
      var channels = [];
      var ip = that.baseInfo.ip;
      // 模拟通道
      WebVideoCtrl.I_GetAnalogChannelInfo(ip, {
        async: false,
        success: function(xmlDoc) {
          var oChannels = $(xmlDoc).find("VideoInputChannel");
          $.each(oChannels, function(i) {
            var id = $(this)
                .find("id")
                .eq(0)
                .text(),
              name = $(this)
                .find("name")
                .eq(0)
                .text();
            if ("" == name) {
              name = "Camera " + (i < 9 ? "0" + (i + 1) : i + 1);
            }
            channels.push({
              id: id,
              name: name
            });
          });
        },
        error: function() {
          //alert(ip + " 获取模拟通道失败！");
        }
      });
      // 数字通道
      WebVideoCtrl.I_GetDigitalChannelInfo(ip, {
        async: false,
        success: function(xmlDoc) {
          var oChannels = $(xmlDoc).find("InputProxyChannelStatus");
          $.each(oChannels, function(i) {
            var id = $(this)
                .find("id")
                .eq(0)
                .text(),
              name = $(this)
                .find("name")
                .eq(0)
                .text(),
              online = $(this)
                .find("online")
                .eq(0)
                .text();
            if ("false" == online) {
              // 过滤禁用的数字通道
              return true;
            }
            if ("" == name) {
              name = "IPCamera " + (i < 9 ? "0" + (i + 1) : i + 1);
            }
            channels.push({
              id: id,
              name: name
            });
          });
        },
        error: function() {
          //alert(ip + " 获取数字通道失败！");
        }
      });
      // 零通道
      WebVideoCtrl.I_GetZeroChannelInfo(ip, {
        async: false,
        success: function(xmlDoc) {
          var oChannels = $(xmlDoc).find("ZeroVideoChannel");
          $.each(oChannels, function(i) {
            var id = $(this)
                .find("id")
                .eq(0)
                .text(),
              name = $(this)
                .find("name")
                .eq(0)
                .text();
            if ("" == name) {
              name = "Zero Channel " + (i < 9 ? "0" + (i + 1) : i + 1);
            }
            if (
              "true" ==
              $(this)
                .find("enabled")
                .eq(0)
                .text()
            ) {
              // 过滤禁用的零通道
              channels.push({
                id: id,
                name: name
              });
            }
          });
        },
        error: function() {
          //alert(ip + " 获取零通道失败！");
        }
      });
      if (this.pagination) {
        this.channelsList = this.cf(channels, this.pageSize);
        this.channelsLen = this.channelsList.length;
        this.channels = this.channelsList[this.pageIndex];
      } else {
        this.channels = channels;
      }
      this.clickStartRealPlay(this.channels);
      this.$emit("channels", this.channels);
    },
    clickStartRealPlay(channels) {
      var that = this;
      var ip = that.baseInfo.ip;
      if (that.tag == 1) {
        ip = that.baseInfo.ip1;
      }
      console.log("isGroup", this.isGroup);
      if (!this.isGroup) {
        channels = [channels[this.cameraIndex]];
      }
      //设置展示区域的宫格数,开方向上取整
      console.log("channels", channels);
      var num = Math.ceil(Math.sqrt(channels.length));
      WebVideoCtrl.I_ChangeWndNum(num);
      // WebVideoCtrl.I_ChangeWndNum(9);
      for (var i = 0; i < channels.length; i++) {
        var iStreamType = 1; //1-主码流(高清),2-子码流(模糊),3-第三码流,4-转码码流
        var iChannelID = channels[i].id;
        var iRet = WebVideoCtrl.I_StartRealPlay(ip, {
          iStreamType: iStreamType,
          iChannelID: iChannelID,
          bZeroChannel: false,
          iWndIndex: i
        });
      }
    },
    // 设置本地参数
    setLocalCfg() {
      var arrXml = [],
        szInfo = "",
        xmlDoc = WebVideoCtrl.I_GetLocalCfg();
      console.log(
        "xmlDoc",
        `${$(xmlDoc)
          .find("CapturePath")
          .eq(0)
          .text()
          .slice(0, 14)}\\Desktop`
      );
      arrXml.push("<LocalConfigInfo>");
      arrXml.push("<PackgeSize>" + 0 + "</PackgeSize>");
      arrXml.push("<PlayWndType>" + 0 + "</PlayWndType>");
      arrXml.push("<BuffNumberType>" + 0 + "</BuffNumberType>");
      arrXml.push("<RecordPath>" + "" + "</RecordPath>");
      arrXml.push(
        "<CapturePath>" +
          `${$(xmlDoc)
            .find("CapturePath")
            .eq(0)
            .text()
            .slice(0, 14)}\\Desktop` +
          "</CapturePath>"
      );
      arrXml.push("<PlaybackFilePath>" + "" + "</PlaybackFilePath>");
      arrXml.push("<PlaybackPicPath>" + "" + "</PlaybackPicPath>");
      arrXml.push("<DownloadPath>" + "" + "</DownloadPath>");
      arrXml.push("<IVSMode>" + 1 + "</IVSMode>");
      arrXml.push(
        "<CaptureFileFormat>" +
          $(xmlDoc)
            .find("CaptureFileFormat")
            .eq(0)
            .text() +
          "</CaptureFileFormat>"
      );
      arrXml.push("<ProtocolType>" + 0 + "</ProtocolType>");
      arrXml.push("</LocalConfigInfo>");

      var iRet = WebVideoCtrl.I_SetLocalCfg(arrXml.join(""));
    },
    // 抓图
    clickCapturePic() {
      var oWndInfo = WebVideoCtrl.I_GetWindowStatus(this.g_iWndIndex),
        szInfo = "";
      if (oWndInfo != null) {
        let cameraName;
        console.log(this.cameraIndex);
        if (!this.isGroup && this.cameraIndex) {
          cameraName = this.channels[this.cameraIndex].name;
        } else {
          cameraName = this.channels[this.g_iWndIndex].name;
        }
        var szPicName =
            sessionStorage.getItem("projectName") +
            "_" +
            cameraName +
            "_" +
            // this.$moment(new Date()).format("LLLLLL"),
            this.$moment(new Date()).format("YYYY-MM-DD_HH时mm分ss秒"),
          // this.$moment(new Date()).format("YYYY-MM-DD"),
          iRet = WebVideoCtrl.I_CapturePic(szPicName);
        console.log(szPicName);
        if (0 == iRet) {
          szInfo = "抓图成功！请查看桌面";
        } else {
          szInfo = "抓图失败！";
        }
        alert(szInfo);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.monitor {
  width: 100%;
  height: 100%;
  .videoPlugin {
    width: 100%;
    height: 100%;
  }
  .monitor__page {
    position: absolute;
    bottom: -24px;
    left: 50%;
    transform: translate(-50%, 0);
  }
  .monitor__button {
    width: 200px;
    height: 26px;
    line-height: 26px;
    box-shadow: inset 0 0 2rem rgba(0, 246, 255, 0.4);
    border: solid 1px #004a7c;
    color: black;
    background-color: transparent;
    margin-top: 15px;
  }
  .btnGroup {
    width: 270px;
    height: 26px;
    position: absolute;
    left: 50%;
    bottom: -26px;
    transform: translate(-50%, 0);
    display: flex;
    justify-content: space-around;
  }
  .monitor__pagination {
    width: 100px;
    height: 26px;
    line-height: 24px;
    // box-shadow: inset 0 0 2rem rgba(0, 246, 255, 0.4);
    border: solid 1px #004a7c;
    color: #000;
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

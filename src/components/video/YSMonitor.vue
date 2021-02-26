<!--
 * @Author: zhangzhenya 
 * @CreateTime: 2018-11-2 9:16:47 
 * @Desc: 萤石视频组件 
-->
<template>
    <div class="monitor">
        <!-- <video v-for="(item,index) in cameraList" :key="index" id="myPlayer" controls playsInline webkit-playsinline> -->
                <!--这里填入从开放平台官网获取到的RTMP协议URL-->
                <!-- <source :src="item.rtmp" type="" /> -->
                <!-- 这里填入从开放平台官网获取到的HLS协议URL /> -->
                <!-- <source :src="item.liveAddress" type="" /> -->
                <!-- <source src="[这里填入从开放平台官网获取到的ws协议URL]"  /> -->
        <!-- </video> -->
        <video-player v-for="(item,index) in playerOptionsList" :key="index" class="vjs-custom-skin" :options="item" @ready="playerReadied" autoplay></video-player>
      
    </div>
</template>

<script>
// videojs
import VueVideoPlayer from "vue-video-player";
window.videojs = videojs;
require("videojs-contrib-hls/dist/videojs-contrib-hls.js");
import { getYSCameraListApi } from "@/views/device/api/device.js";
export default {
  // props: ["baseInfo", "tag", "isCapturePic", "cameraIndex"],
  props: {
    // baseInfo: {
    //   // 必须提供字段
    //   required: true
    // },
    // tag: {
    //   // 必须提供字段
    //   required: true
    // },
    // isCapturePic: {
    //   // 可选字段，有默认值
    //   required: true
    // },
    // isGroup: {
    //   required: false,
    //   default: true
    // },
    // cameraIndex: {
    //   default: ""
    // }
    projectId: {
      // 可选字段，有默认值
      required: false
    },
    pageSize: {
      required: false,
      default: 9
    },
    pageIndex: {
      required: false,
      default: 0
    },
    appkey: {
      required: true,
      default: ""
    },
    secret: {
      required: true,
      default: ""
    }
  },
  computed: {
    params() {
      let param = {
        projectId: this.projectId,
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        appKey: sessionStorage.getItem("appkey")==null?this.appkey:sessionStorage.getItem("appkey"),
        secret: sessionStorage.getItem("secret")==null?this.secret:sessionStorage.getItem("secret")
      };
      return param;
    }
  },
  data() {
    return {
      cameraList: [],
      playerOptionsList: []
    };
  },
  watch: {},
  beforeDestroy() {},
  async mounted() {
    this.getYSCameraList();
  },
  methods: {
    playerReadied(player) {
      console.log(player);
      let hls = player.tech({ IWillNotUseThisInPlugins: true }).hls;
      player.tech_.hls.xhr.beforeRequest = function(options) {
        console.log(options);
        return options;
      };
    },
    //获取token
    getYSCameraList() {
      getYSCameraListApi(this.params).then(res => {
        console.log(res);
        this.cameraList = res;
        res.forEach(el => {
          this.playerOptionsList.push({
            // videojs and plugin options
            autoplay: true,
            height: "100%",
            sources: [
              {
                withCredentials: false,
                type: "application/x-mpegURL",
                src: el.liveAddress
              }
            ],
            controlBar: {
              'currentTimeDisplay':false,
                'timeDivider':false,
                'durationDisplay':false,
                'remainingTimeDisplay':false
            },
            flash: { hls: { withCredentials: false } },
            html5: { hls: { withCredentials: false } },
            poster: ""
            // autoplay: true,
            // height: "100%",
            // sources: [
            //   {
            //     type: "rtmp/mp4",
            //     src: el.rtmp
            //   }
            // ],
            // techOrder: ["flash"],
            // autoplay: false,
            // controls: true,
            // poster: ""
          });
        });
        console.log(this.playerOptionsList);
        setTimeout(() => {
          if (this.pageSize == 1) {
            $(".vjs-custom-skin")[0].style.width = "100%";
            $(".vjs-custom-skin")[0].style.height = "100%";
          }
        }, 0);
      });
    }
  }
};
</script>

<style lang="scss">
.monitor {
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: row wrap;
  align-content: flex-start;
  position: relative;
  .vjs-custom-skin {
    width: 33%;
    height: 33%;
    .video-js {
      width: 100% !important;
      height: 100% !important;
    }
  }
    .monitor__page{
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
    color:black;
    background-color: transparent;
    margin-top: 10px;
  }
}
</style>

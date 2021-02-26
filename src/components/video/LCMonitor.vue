<!--
 * @Author: zhangzhenya 
 * @CreateTime: 2018-11-2 9:16:47 
 * @Desc: 萤石视频组件 
-->
<template>
  <div class="monitor">
    <video-player
      v-for="(item,index) in playerOptionsList"
      :key="index"
      class="vjs-custom-skin"
      :options="item"
      @ready="playerReadied"
      autoplay
    ></video-player>
    <!-- <button v-if="isCapturePic" @click="clickCapturePic" class="monitor__button">抓图</button> -->
    <div class="monitor__page">
      <button
        v-if="total > pageSize && currentPageIndex !==1"
        @click="changeCameraMinus()"
        class="monitor__button"
        :disabled="currentPageIndex == 1"
      >上一页</button>
      <button
        v-if="total > pageSize && currentPageIndex < total/pageSize"
        @click="changeCameraPlus()"
        class="monitor__button"
        :disabled="currentPageIndex >= total/pageSize"
      >下一页</button>
    </div>
  </div>
</template>

<script>
// videojs
import videojs from "video.js";
window.videojs = videojs;
require("videojs-contrib-hls/dist/videojs-contrib-hls.js");
import { getLCCameraListApi } from "@/views/device/api/device.js";
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
    httpAddress: {
      type:Array,
      // 可选字段，有默认值
      required: true
    },
    pageSize: {
      required: false,
      default: 9
    },
    pageIndex: {
      required: false,
      default: 1
    }
  },
  computed: {
    params() {
      let param = {
        httpAddress: this.httpAddress,
        pageSize: this.pageSize,
        pageIndex: this.currentPageIndex
      };
      return param;
    }
  },
  data() {
    return {
      cameraList: [],
      playerOptionsList: [],
      currentPageIndex:1,
      total: 0
    };
  },
  watch: {},
  beforeDestroy() {},
  async mounted() {
    this.getLCCameraList();
  },
  methods: {
    changeCameraPlus(){
      console.log("按钮");
     this.currentPageIndex =this.currentPageIndex+1;
     this.getLCCameraList();
    },
    changeCameraMinus(){
      console.log("按钮");
     this.currentPageIndex =this.currentPageIndex-1;
     this.getLCCameraList();
    },
    //获取token
    getLCCameraList() {
      // getLCCameraListApi(this.params).then(res => {
        // console.log("进入",res);
        
        
          this.total = this.httpAddress.length;
          console.log("乐橙视频长度",this.httpAddress.length)
          // this.cameraList = res.cameraList;
          this.cameraList = this.httpAddress;
          console.log("zhi",this.playerOptionsList);
          this.playerOptionsList=[];
          this.cameraList.forEach(el => {
            this.playerOptionsList.push({
              // videojs and plugin options
              autoplay: true,
              height: "100%",
              sources: [
                {
                  withCredentials: false,
                  type: "application/x-mpegURL",
                  src: el.ip
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
          setTimeout(() => {
            if (this.pageSize == 1) {
              $(".vjs-custom-skin")[0].style.width = "100%";
              $(".vjs-custom-skin")[0].style.height = "100%";
            }
          }, 0);
        
      // });
    },
    playerReadied(player) {
      console.log(player);
      var hls = player.tech({ IWillNotUseThisInPlugins: true }).hls;
      player.tech_.hls.xhr.beforeRequest = function(options) {
        // console.log(options)
        return options;
      };
    },
    // 抓图
    clickCapturePic() {
      console.log("抓图");
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

<template>
  <div class="playing__tower">
    <div class="playing__tower-l">
      <div class="tower__main">
        <div class="main">
          <img class="station" src="~@/assets/image/tower_station.png">
          <img :style="{left:tower.wheelL}" class="wheel" src="~@/assets/image/tower_wheel.png">
          <div :style="{left:tower.lineL,height:tower.lineH}" class="line"></div>
          <img
            :style="{left:tower.hookL,bottom:tower.hookB}"
            class="hook"
            src="~@/assets/image/tower_hook.png"
          >
        </div>
        <div class="playing__tower-info">
          <div class="towerInfo-t">
            <div class="towerInfo-item">
              <p>
                <span class="title">安全吊重</span>
                <span class="val">{{maxWeight}}t</span>
              </p>
              <p>
                <span class="title">塔机高</span>
                <span class="val">{{currentHeight}}m</span>
              </p>
              <p>
                <span class="title">前臂长</span>
                <span class="val">{{maxRange}}m</span>
              </p>
              <p>
                <span class="title">风速</span>
                <span class="val">{{windSpeed}}m/s</span>
              </p>
              <p>
                <span class="title">力矩百分比</span>
                <span class="val">{{momentPercentage}}%</span>
              </p>
            </div>
            <div class="towerInfo-item">
              <p>
                <span class="title">载重</span>
                <span class="val">{{weight}}t</span>
              </p>
              <p>
                <span class="title">高度</span>
                <span class="val">{{height}}m</span>
              </p>
              <p>
                <span class="title">幅度</span>
                <span class="val">{{range}}m</span>
              </p>

              <p>
                <span class="title">回转角度</span>
                <span class="val">{{rotaryAngle}}°</span>
              </p>
              <p>
                <span class="title">倾斜角度</span>
                <span class="val">{{tiltAngle}}°</span>
              </p>
            </div>
          </div>
          <div class="towerInfo-b">
            <div class="towerInfo-time">
              <p>
                <span class="title">数据发送时间</span>
                <span class="val">{{deviceTime}}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="playing__tower-status">
        <div class="status-item">
          <span :class="[status==0?'red':'green']">{{status==0?'离线':'正常工作中'}}</span>
        </div>
      </div>
    </div>
    <div class="playing__tower-r">
      <div class="blackBox">
        <div class="item">
          <span class="title">黑匣子编号：</span>
          <span class="val">{{deviceNo}}</span>
        </div>
        <div class="item">
          <span class="title">黑匣子品牌：</span>
          <span class="val">{{manufactor}}</span>
        </div>
        <div class="item">
          <span class="title">GPRS：</span>
          <span class="val">{{gprs}}</span>
        </div>
        <div class="item">
          <span class="title">备案编号：</span>
          <span class="val">{{identifier}}</span>
        </div>
      </div>
      <div class="collision">
        <div class="collision__deflection">
          <template v-for="item in deviceList">
            <div
              class="deflection"
              v-if="item.width>0"
              :style="{width:`${item.width}%`,zIndex:item.deviceNo==deviceNo?2:1}"
              :key="item.deviceNo"
            >
              <div class="round__Inner">
                <div class="deflection__line" :style="'transform: rotate(-'+(90-rotaryAngle)+'deg)'">
                  <div
                    :class="['deflection__are',item.status==1?'green':'gray',item.deviceNo==deviceNo?'yellow':'']"
                    :style="'left:'+tower.wheelRatio+'%;'"
                  ></div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
      <div class="collision__legend">
        <div class="item yellow">当前塔吊</div>
        <div class="item green">在线</div>
        <div class="item gray">离线</div>
        <div class="item blue">其他</div>
      </div>
    </div>
  </div>
</template>

<script>
import { getDeviceList } from "@/views/crane/api/craneReport.js";
import { websocketUrl } from "@/axios/base.js";

export default {
  name: "tower-on",
  props: {
    projectId: {
      type: [Number, String],
      default() {
        return null;
      }
    },
    deviceNo: {
      type: String,
      default() {
        return null;
      }
    }
  },
  data() {
    return {
      currentHeight: 0,
      maxRange: 0,
      maxWeight: 0,
      maxMoment: 0,
      weight: 0,
      moment: 0,
      rotaryAngle: 0,
      range: 0,
      height: 0,
      windSpeed: 0,
      momentPercentage: 0,
      tiltAngle: 0,
      deviceTime: "",
      gprs: "",
      manufactor: "",
      identifier: "",
      status: 0,
      //ws
      socket: null,
      stompClient: null,
      deviceList: {}
    };
  },
  computed: {
    tower() {
      //初始状态
      let W = 155,
        H = 210;
      let wheelL = 97.5;
      let hookL = 86;
      let hookB = 0;
      let lineL = 104.5;
      let lineH = 217.5;

      let wheelRatio = this.range / this.maxRange; //滚轮位置%
      wheelL = wheelL + W * wheelRatio;
      hookL = hookL + W * wheelRatio;
      lineL = lineL + W * wheelRatio;
      let heightRate = this.height / this.currentHeight; //高度比例
      hookB = hookB + H * heightRate;
      lineH = lineH - H * heightRate;

      let rotaryAngle = this.rotaryAngle; //角度
      let weightRatio = this.weight / this.maxWeight; //吊重
      return {
        rotaryAngle: rotaryAngle,
        wheelRatio: wheelRatio * 100,
        heightRate: heightRate * 100,
        weightRatio: weightRatio * 100,
        wheelL: `${wheelL}px`,
        hookL: `${hookL}px`,
        lineL: `${lineL}px`,
        hookB: `${hookB}px`,
        lineH: `${lineH}px`
      };
    }
  },
  beforeDestroy() {
    // 页面离开时断开连接,清除定时器
    this.disconnect();
  },
  mounted() {
    this.initWebSocket();
  },
  methods: {
    getDeviceList() {
      getDeviceList({ projectId: this.projectId }).then(res => {
        (res.data || []).forEach(item => {
          item.status = item.isOnline;
          item.width = ((item.maxRange || 0) / 80) * 100;
          this.deviceList[item.deviceNo] = item;
          if (this.deviceNo == item.deviceNo) {
            let deviceActive = item;
            this.currentHeight = Number(deviceActive.currentHeight) || 0;
            this.maxRange = deviceActive.maxRange || 0;
            this.maxWeight = deviceActive.maxWeight || 0;
            this.maxMoment = deviceActive.maxMoment || 0;
            this.rotaryAngle = deviceActive.rotaryAngle || 0;
            this.range = deviceActive.range || 0;
            this.height = deviceActive.height || 0;
            this.weight = deviceActive.weight || 0;
            this.moment = deviceActive.moment || 0;
            this.windSpeed = deviceActive.windSpeed || 0;
            this.momentPercentage = deviceActive.momentPercentage || 0;
            this.tiltAngle = deviceActive.tiltAngle || 0;
            this.deviceTime = deviceActive.deviceTime || "";
            this.gprs = deviceActive.gprs || "";
            this.manufactor = deviceActive.manufactor || "";
            this.identifier = deviceActive.identifier || "";
            this.status = deviceActive.status || 0;
          }
          this.subscribe(item);
        });
      });
    },

    //注册ws
    initWebSocket() {
      // 建立连接对象
      this.socket = new SockJS(`${websocketUrl}/webSocketServer`); //连接服务端提供的通信接口，连接以后才可以订阅广播消息和个人消息
      // 获取STOMP子协议的客户端对象
      this.stompClient = Stomp.over(this.socket);
      // 定义客户端的认证信息,按需求配置
      let headers = {};
      // 向服务器发起websocket连接
      this.stompClient.connect(
        headers,
        frame => {
          this.getDeviceList();
        },
        err => {}
      );
    },
    //开启ws通道
    subscribe(item) {
      this.stompClient.subscribe(
        `/topic/current/crane/${this.projectId}/${item.deviceNo}`,
        msg => {
          // 订阅服务端提供的某个topic
          // msg.body存放的是服务端发送给我们的信息
          let res = JSON.parse(msg.body);
          console.log(res);
          let deviceList = { ...this.deviceList };
          console.log(deviceList);
          deviceList[res.deviceNo] = {
            ...deviceList[res.deviceNo],
            ...res
          };
          this.deviceList = deviceList;
          //当前设备
          if (this.deviceNo == res.deviceNo) {
            let deviceActive = {
              ...deviceList[res.deviceNo],
              ...res
            };
            console.log(deviceActive);
            this.currentHeight =  Number(deviceActive.currentHeight) || 0;
            this.maxRange = deviceActive.maxRange || 0;
            this.maxWeight = deviceActive.maxWeight || 0;
            this.maxMoment = deviceActive.maxMoment || 0;
            this.rotaryAngle = deviceActive.rotaryAngle || 0;
            this.range = deviceActive.range || 0;
            this.height = deviceActive.height || 0;
            this.weight = deviceActive.weight || 0;
            this.moment = deviceActive.moment || 0;
            this.windSpeed = deviceActive.windSpeed || 0;
            this.momentPercentage = deviceActive.momentPercentage || 0;
            this.tiltAngle = deviceActive.tiltAngle || 0;
            this.deviceTime = deviceActive.deviceTime
              ? this.$moment(deviceActive.deviceTime).format("YYYY-MM-DD HH:mm:ss")
              : "";
            this.gprs = deviceActive.gprs || "";
            this.manufactor = deviceActive.manufactor || "";
            this.identifier = deviceActive.identifier || "";
            this.status = deviceActive.status == "在线" ? 1 : 0;
          }
        }
      );
    },
    //关闭ws
    disconnect() {
      if (this.stompClient) {
        this.stompClient.disconnect();
      }
    }
  }
};
</script>

<style lang="scss">
//1vh = 7.5px
.playing__tower {
  overflow: hidden;
  width: 750px;
  display: flex;
  border: 2px solid #5e5e5e;
  background-color: #131313;
  .tower__main {
    padding: 10px;
    .main {
      width: 277.5px;
      height: 307.5;
      position: relative;
      margin: 10px;
      .station {
        width: 100%;
        height: 100%;
      }
      .wheel {
        width: 15px;
        height: 7.5px;
        position: absolute;
        left: 97.5px;
        top: 48.75px;
        transition: all ease 2s;
      }
      .hook {
        width: 37.5px;
        height: 37.5px;
        position: absolute;
        left: 86px;
        bottom: 0;
        transition: all ease 2s;
      }
      .line {
        width: 0;
        height: 217.5px;
        border-left: 2px solid #7d6a6a;
        position: absolute;
        left: 104.5px;
        top: 54px;
        transition: all ease 2s;
      }
    }
  }
  .playing__tower-info {
    p {
      margin: 0;
      padding: 0 5px;
      font-size: 12px;
      line-height: 20px;
      .title {
        color: #fff;
      }
      .val {
        color: #d4b42c;
      }
    }

    .towerInfo-t {
      display: flex;
      margin: 5px 0;
    }
    .towerInfo-item {
      width: 50%;
      padding: 6px;
      background-color: #1e1e1e;
      &:first-child {
        margin-right: 5px;
      }
    }
    .towerInfo-time {
      padding: 6px;
      background-color: #1e1e1e;
    }
  }
  .playing__tower-status {
    border-top: 2px solid #5e5e5e;
    text-align: right;
    font-size: 14px;
    padding: 10px;
    display: flex;
    .status-item {
      width: 50%;
      text-align: center;
      span {
        position: relative;
        padding-left: 10px;
        &::before {
          position: absolute;
          display: inline-block;
          content: " ";
          width: 6px;
          height: 6px;
          border-radius: 100%;
          left: 0;
          top: 50%;
          margin-top: -3px;
        }
      }
      .green {
        color: #00ff00;
        &::before {
          background-color: #00ff00;
        }
      }
      .red {
        color: #df0000;
        &::before {
          background-color: #df0000;
        }
      }
    }
  }
  .playing__tower-r {
    flex: 1;
    display: flex;
    flex-direction: column;
    border-left: 2px solid #5e5e5e;
    .blackBox {
      color: #fff;
      font-size: 14px;
      line-height: 20px;
      padding: 20px;
      border-bottom: 2px solid #5e5e5e;
    }
    .collision__deflection {
      width: 340px;
      height: 375px;
      margin: 0 auto;
      position: relative;
    }
    .deflection {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #14e39f;
      width: 100%;
      .round__Inner {
        width: 100%;
        height: 0;
        padding-bottom: 100%;
        border-radius: 50%;
        border: 1px dashed #14e39f;
        position: relative;
        .round-center {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: #14e39f;
          position: absolute;
          top: 50%;
          left: 50%;
          margin-left: -5px;
          margin-top: -5px;
        }
        .deflection__basic {
          width: 50%;
          border-top: 1px dashed #14e39f;
          position: absolute;
          left: 50%;
          top: 50%;

          .deflection__basic-text {
            position: absolute;
            right: -15px;
            top: -5px;
            width: 10px;
            height: 10px;
            line-height: 10px;
          }
        }
        .deflection__line {
          width: calc(50% + 10px);
          border-top: 1px solid #14e39f;
          transform-origin: left;
          transform: rotate(0deg);
          transition: all ease 2s;
          position: absolute;
          left: 50%;
          top: 50%;
          .deflection__line-text {
            position: absolute;
            right: -15px;
            top: -5px;
            width: 10px;
            height: 10px;
            line-height: 10px;
            transform: rotate(0deg);
          }
          .deflection__weight {
            width: 15px;
            border-top: 1px solid #14e39f;
            position: absolute;
            left: -15px;
            top: -1px;
          }
          .deflection__are {
            width: 9px;
            height: 9px;
            border-radius: 100%;
            transition: all ease 2s;
            position: absolute;
            left: 0%;
            top: -5px;
            margin-left: -4.5px;
          }
          .yellow {
            background-color: #ffcb33 !important;
          }
          .green {
            background-color: #00ff00;
          }
          .gray {
            background-color: #d4d4d4;
          }
          .blue {
            background-color: #009afe;
          }
        }
      }
    }
    .collision__legend {
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      .item {
        position: relative;
        padding-left: 15px;
        color: #fff;
        margin: 0 5px;
        &::before {
          position: absolute;
          display: inline-block;
          content: " ";
          width: 10px;
          height: 10px;
          border-radius: 100%;
          left: 0;
          top: 50%;
          margin-top: -5px;
        }
      }
      .yellow::before {
        background-color: #ffcb33;
      }
      .green::before {
        background-color: #00ff00;
      }
      .gray::before {
        background-color: #d4d4d4;
      }
      .blue::before {
        background-color: #009afe;
      }
    }
  }
}
</style>

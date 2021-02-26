<template>
  <div class="playback__tower">
    <div class="playback__tower-l">
      <div class="tower__main">
        <div class="main">
          <img class="station" src="~@/assets/image/tower_station.png" />
          <img :style="{left:tower.wheelL}" class="wheel" src="~@/assets/image/tower_wheel.png" />
          <div :style="{left:tower.lineL,height:tower.lineH}" class="line"></div>
          <img
            :style="{left:tower.hookL,bottom:tower.hookB}"
            class="hook"
            src="~@/assets/image/tower_hook.png"
          />
        </div>
        <div class="playback__tower-info">
          <div class="towerInfo-t">
            <div class="towerInfo-item">
              <p>
                <span class="title">力矩百分比</span>
                <span class="val">{{momentPercentage}}%</span>
              </p>
              <p>
                <span class="title">前臂长</span>
                <span class="val">{{maxRange}}m</span>
              </p>
              <p>
                <span class="title">载重</span>
                <span class="val">{{weight}}t</span>
              </p>
            </div>
            <div class="towerInfo-item">
              <p>
                <span class="title">安全吊重</span>
                <span class="val">{{maxWeight}}t</span>
              </p>
              <p>
                <span class="title">高度</span>
                <span class="val">{{height}}m</span>
              </p>
            </div>
          </div>
          <div class="towerInfo-b">
            <div class="towerInfo-time">
              <p>
                <span class="title">GPRS</span>
                <span class="val">{{gprs}}</span>
              </p>
              <p>
                <span class="title">数据发送时间</span>
                <span class="val">{{deviceTime}}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="playback__tower-status">
        <div class="status-item">
          <span :class="[alarmStatus?'red':'green']">{{alarmStatus?'报警':'正常'}}</span>
        </div>
        <!-- <div class="status-item">
          <span class="red">超载违章</span>
        </div>-->
      </div>
    </div>
    <div class="playback__tower-r">
      <div class="towerAngle">
        <!-- <div class="tower-worker">
          <div class="img"></div>
          <div class="item">
            <span class="title">司机姓名</span>
            <span class="val"></span>
          </div>
          <div class="item">
            <span class="title">司机编号</span>
            <span class="val"></span>
          </div>
          <div class="item">
            <span class="title">司机电话</span>
            <span class="val"></span>
          </div>
          <div class="item">
            <span class="title">作业证号</span>
            <span class="val"></span>
          </div>
        </div>-->
        <div class="deflection">
          <div class="round__Inner">
            <div class="round-center"></div>
            <div class="deflection__basic">
              <div class="deflection__basic-text">0°</div>
            </div>
            <div class="deflection__line" :style="'transform: rotate(-'+(90-rotaryAngle)+'deg)'">
              <div class="deflection__weight"></div>
              <div
                class="deflection__line-text"
                :style="'transform: rotate('+ (90-rotaryAngle)+'deg);'"
              >{{(90-rotaryAngle)}}°</div>
              <div class="deflection__are" :style="'left:'+tower.wheelRatio+'%;'"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="towerAlam">
        <div class="towerAlam-t">
          <div class="item">
            <span class="title">报警信息详情</span>
            <span class="val">{{alarmInfo}}</span>
          </div>
          <div class="item">
            <span class="title">报警时间</span>
            <span class="val">{{beginTime}}</span>
          </div>
        </div>
        <div class="towerAlam-b">
          <div class="item">
            <span class="title">载重</span>
            <span class="val">{{beginInfo.weight}}t</span>
          </div>
          <div class="item">
            <span class="title">幅度</span>
            <span class="val">{{beginInfo.range}}m</span>
          </div>
          <div class="item">
            <span class="title">安全吊重</span>
            <span class="val">{{maxWeight}}t</span>
          </div>
          <div class="item">
            <span class="title">力矩百分比</span>
            <span class="val">{{beginInfo.momentPercentage}}%</span>
          </div>
          <div class="item">
            <span class="title">吊钩高度</span>
            <span class="val">{{beginInfo.height}}m</span>
          </div>
        </div>
      </div>
      <div class="towerPlay">
        <div class="item">
          <span>开始时间</span>
          <el-date-picker
            class="backDate"
            :clearable="false"
            v-model="bDate"
            type="date"
            value-format="yyyy-MM-dd"
            size="mini"
          ></el-date-picker>
          <el-time-picker
            class="backTime"
            :clearable="false"
            v-model="bTime"
            value-format="HH:mm:ss"
            size="mini"
          ></el-time-picker>
        </div>
        <div class="item">
          <span>结束时间</span>
          <el-date-picker
            class="backDate"
            :clearable="false"
            v-model="eDate"
            type="date"
            value-format="yyyy-MM-dd"
            size="mini"
          ></el-date-picker>
          <el-time-picker
            class="backTime"
            :clearable="false"
            v-model="eTime"
            value-format="HH:mm:ss"
            size="mini"
          ></el-time-picker>
        </div>
        <div class="item">
          <el-button type="primary" plain size="mini" @click="playbackData">播放</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getDeviceList } from "@/views/crane/api/craneReport.js";
import { playbackData } from "@/views/crane/api/craneReport.js";
export default {
  name: "tower-back",
  props: {
    deviceNo: {
      type: String,
      default() {
        return null;
      }
    },
    beginTime: {
      type: String,
      default() {
        return null;
      }
    },
    endTime: {
      type: String,
      default() {
        return null;
      }
    },
    alarmInfo: {
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
      dataList: [],
      timer: null,
      beginInfo: {},
      alarmStatus: false,
      bDate: "",
      eDate: "",
      bTime: "",
      eTime: ""
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
    clearInterval(this.timer);
  },
  mounted() {
    [this.bDate, this.bTime] = this.beginTime.split(" ");
    [this.eDate, this.eTime] = this.endTime.split(" ");
    this.getDeviceList();
    this.playbackData();
    console.log(this.bDate, this.bTime);
    console.log(this.eDate, this.eTime);
  },

  methods: {
    getDeviceList() {
      getDeviceList({}).then(res => {
        (res.data || []).forEach(item => {
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
        });
      });
    },
    playbackData() {
      // let beginTime = this.beginTime;
      // let endTime = this.endTime;
      // beginTime = this.$moment(beginTime)
      //   .subtract(10, "seconds")
      //   .format("YYYY-MM-DD HH:mm:ss");
      // endTime = this.$moment(endTime)
      //   .add(10, "seconds")
      //   .format("YYYY-MM-DD HH:mm:ss");
      if (this.timer) {
        clearInterval(this.timer);
      }
      this.alarmStatus = false;
      let params = {
        deviceNo: this.deviceNo,
        startTime: `${this.bDate} ${this.bTime}`,
        endTime: `${this.eDate} ${this.eTime}`
      };
      playbackData(params).then(res => {
        this.dataList = res.data || [];
        this.dataList.forEach(item => {
          if (item.createTime == this.beginTime) {
            this.beginInfo = item;
          }
        });
        this.play();
      });
    },
    play() {
      let index = 0;
      if (this.dataList.length > 0) {
        this.timer = setInterval(() => {
          let deviceActive = this.dataList[index];
          // this.currentHeight = deviceActive.currentHeight || 0;
          // this.maxRange = deviceActive.maxRange || 0;
          // this.maxWeight = deviceActive.maxWeight || 0;
          // this.maxMoment = deviceActive.maxMoment || 0;
          this.rotaryAngle = deviceActive.rotaryAngle || 0;
          this.range = deviceActive.range || 0;
          this.height = deviceActive.height || 0;
          this.weight = deviceActive.weight || 0;
          this.moment = deviceActive.moment || 0;
          this.windSpeed = deviceActive.windSpeed || 0;
          this.momentPercentage = deviceActive.momentPercentage || 0;
          this.tiltAngle = deviceActive.tiltAngle || 0;
          this.deviceTime = deviceActive.createTime || "";
          // this.gprs = deviceActive.gprs || "";
          this.manufactor = deviceActive.manufactor || "";
          this.identifier = deviceActive.identifier || "";
          this.status = deviceActive.status || 0;
          if (deviceActive.createTime == this.beginTime) {
            this.alarmStatus = true;
          }
          if (deviceActive.createTime == this.endTime) {
            this.alarmStatus = false;
          }
          index++;
          if (this.dataList.length == index) {
            index = 0;
          }
        }, 1000);
      }
    }
  }
};
</script>

<style lang="scss">
//1vh = 7.5px
.playback__tower {
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
  .playback__tower-info {
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
  .playback__tower-status {
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
  .playback__tower-r {
    flex: 1;
    display: flex;
    flex-direction: column;
    border-left: 2px solid #5e5e5e;
  }
  .blackbox {
    display: flex;
    flex-flow: wrap;
    border-bottom: 2px solid #5e5e5e;
    padding: 10px;
    .item {
      width: 50%;
      font-size: 14px;
      line-height: 20px;
    }
  }
  .towerAngle {
    height: 220px;
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .tower-worker {
      .img {
        width: 180px;
        height: 120px;
        margin-bottom: 10px;
      }
      .item {
        font-size: 14px;
        line-height: 20px;
      }
      .title {
        color: #fff;
      }
      .val {
        color: #d4b42c;
      }
    }

    .deflection {
      color: #14e39f;
      width: 180px;
      padding: 5px;
      display: flex;
      align-items: center;
      font-size: 12px;
      margin: 0 auto;
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
            width: 5px;
            height: 5px;
            border-radius: 2.5px;
            background-color: red;
            transition: all ease 2s;
            position: absolute;
            left: 0%;
            top: -3px;
          }
        }
      }
    }
  }
  .towerAlam {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 10px 20px;
    font-size: 14px;
    border-top: 2px solid #5e5e5e;
    border-bottom: 2px solid #5e5e5e;
    .title {
      color: #fff;
    }
    .val {
      color: #d4b42c;
    }
    .towerAlam-t {
      padding-bottom: 10px;
      .item {
        display: flex;
        justify-content: space-between;
        line-height: 24px;
        .val {
          color: #df0000;
        }
      }
    }
    .towerAlam-b {
      display: flex;
      flex-wrap: wrap;
      padding-top: 10px;
      border-top: 2px dotted #5e5e5e;
      .item {
        width: 50%;
        line-height: 24px;
        display: flex;
        justify-content: space-between;
        padding: 0 5px;
      }
    }
  }
  .towerPlay {
    color: #fff;
    padding: 15px 20px;
    .item {
      padding: 2px 0;
    }
    .backDate {
      width: 90px;
    }
    .backTime {
      width: 70px;
    }
    .el-input__inner {
      padding: 0 10px;
      background-color: transparent;
      color: #fff;
    }
    .el-input__prefix {
      display: none;
    }
  }
}
</style>

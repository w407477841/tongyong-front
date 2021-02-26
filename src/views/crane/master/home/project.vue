<template>
  <div class="home-td-container">
    <div class="home-box">
      <el-row class="panel-group" :gutter="16">
        <div class="home-top">
          <el-col :xs="24" :sm="7" :lg="7" class="grid-col">
            <div class="card-panel card-panel-l">
              <div class="card-panel-title">今日累计塔吊报警</div>
              <div class="card-panel-content home-alam">
                <div class="image">
                  <svg
                    t="1561600906959"
                    class="icon"
                    viewBox="0 0 1181 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="5126"
                    width="48"
                    height="48"
                  >
                    <path
                      d="M138.988308 938.299077m34.73723 0l834.048 0q34.737231 0 34.737231 34.737231l0 0.039384q0 34.737231-34.737231 34.737231l-834.048 0q-34.737231 0-34.73723-34.737231l0-0.039384q0-34.737231 34.73723-34.737231Z"
                      fill="#fb5034"
                      p-id="5127"
                    />
                    <path
                      d="M598.843077 633.147077h127.369846l-186.88 228.903385 36.233846-182.232616H448.196923l186.919385-228.903384-36.273231 182.232615z"
                      fill="#fb5034"
                      p-id="5128"
                    />
                    <path
                      d="M556.032 0m34.737231 0l0.039384 0q34.737231 0 34.737231 34.737231l0 139.027692q0 34.737231-34.737231 34.737231l-0.039384 0q-34.737231 0-34.737231-34.737231l0-139.027692q0-34.737231 34.737231-34.737231Z"
                      fill="#fb5034"
                      p-id="5129"
                    />
                    <path
                      d="M1164.169846 503.886769a34.737231 34.737231 0 0 1-34.776615 34.737231h-138.988308a34.737231 34.737231 0 0 1 0-69.513846h139.027692c19.180308 0 34.737231 15.596308 34.737231 34.776615zM225.870769 503.886769a34.737231 34.737231 0 0 1-34.737231 34.737231h-139.027692a34.737231 34.737231 0 0 1 0-69.513846h139.027692c19.180308 0 34.737231 15.596308 34.737231 34.776615zM186.919385 152.182154a34.737231 34.737231 0 0 1 49.152 0l98.264615 98.264615a34.737231 34.737231 0 0 1-49.152 49.152L186.958769 201.294769a34.737231 34.737231 0 0 1 0-49.112615zM994.619077 152.182154a34.737231 34.737231 0 0 0-49.152 0l-98.264615 98.264615a34.737231 34.737231 0 0 0 49.152 49.152l98.264615-98.304a34.737231 34.737231 0 0 0 0-49.112615z"
                      fill="#fb5034"
                      p-id="5130"
                    />
                    <path
                      d="M864.137846 590.769231A273.368615 273.368615 0 0 0 317.44 590.769231v342.882461H864.098462V590.769231zM590.769231 238.631385A352.137846 352.137846 0 0 1 942.907077 590.769231v421.651692H238.670769V590.769231A352.137846 352.137846 0 0 1 590.769231 238.631385z"
                      fill="#fb5034"
                      p-id="5131"
                    />
                  </svg>
                </div>
                <div class="main">
                  累计
                  <span>{{alarmCount}}</span>次
                </div>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="10" :lg="10" class="grid-col">
            <div class="card-panel card-panel-m">
              <div class="card-panel-title">
                <span>公告推送</span>
                <router-link class="link" to="/notice">查看所有公告>></router-link>
              </div>
              <div class="card-panel-content home-notice">
                <div class="image">
                  <svg
                    t="1561601040296"
                    class="icon"
                    viewBox="0 0 1280 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="6071"
                    width="48"
                    height="48"
                  >
                    <path
                      d="M613.952 14.848L384 157.248a188.8 188.8 0 0 1-99.584 28.032H170.688C75.84 185.28 0 259.968 0 350.976v329.088c0 100.352 82.944 182.016 184.896 182.016h132.736a188.8 188.8 0 0 1 99.584 28.032l199.04 119.04c14.272 9.28 30.848 13.952 49.792 13.952 52.16 0 94.848-41.984 94.848-93.312V94.208c0-16.32-4.736-35.008-14.208-48.96-30.848-44.352-87.68-58.368-132.736-30.4z m49.728 914.944l-199.04-119.04c-45.056-25.664-94.848-42.048-147.008-42.048H184.896c-49.792 0-90.112-39.68-90.112-88.64V350.976c0-39.68 33.216-72.32 73.536-72.32h116.096c54.528 0 104.32-14.08 151.68-42.048l229.952-142.4v835.584h-2.368z m568.96-464.448h-284.48a47.168 47.168 0 0 0-47.36 46.656c0 25.664 21.248 46.72 47.36 46.72h284.416C1258.688 558.72 1280 537.6 1280 512a47.168 47.168 0 0 0-47.36-46.72z m-19.008 396.8l-246.528-140.096a46.336 46.336 0 0 0-64 16.32 44.864 44.864 0 0 0 16.64 63.04l246.464 140.032a46.336 46.336 0 0 0 64-16.32c14.208-21.056 7.104-49.024-16.576-63.04z m-248.896-560.192l246.528-140.032c23.68-14.016 30.784-41.984 16.64-63.04-14.272-23.296-42.688-30.336-64-16.32l-246.592 140.032c-23.68 14.016-30.784 41.984-16.576 63.04 14.208 20.992 42.688 30.336 64 16.32z"
                      p-id="6072"
                      fill="#189ffb"
                    />
                  </svg>
                </div>
                <div class="main">
                  <vueSeamless :data="noticeList" :class-option="classOption" class="seamless-warp">
                    <ul>
                      <li
                        v-for="(item,index) in noticeList"
                        :key="index"
                        :title="item.content"
                      >{{item.content}}</li>
                    </ul>
                  </vueSeamless>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="7" :lg="7" class="grid-col">
            <weather class="card-panel card-panel-r"></weather>
          </el-col>
        </div>
      </el-row>
      <div class="card-panel card-panel-main">
        <div class="card-panel-title">塔吊实时监控</div>
        <div class="card-panel-content">
          <div class="deviceList">
            <swiper v-if="deviceList.length>0" :options="swiperOption">
              <swiper-slide
                :class="['towerOn',indexActive==index?'active':'']"
                v-for="(item,index) in deviceList"
                :key="index"
                @click.native="changeDevice(index)"
              >
                <dir class="opacity"></dir>
                <home-tower-on v-bind="item"></home-tower-on>
              </swiper-slide>
            </swiper>
          </div>
          <div class="deviceActive">
            <div class="border-box circle-main">
              <div class="border-title">当前塔吊信息</div>
              <div class="circle-box">
                <div
                  v-if="deviceDetail.rotaryAngle || (deviceDetail.rotaryAngle === 0)"
                  class="circle-content"
                >
                  <div
                    class="circle-line-box"
                    :style="{transform:'rotate('+deviceDetail.rotaryAngle+'deg)'}"
                  >
                    <div class="circle-line">
                      <div class="circle-d"></div>
                    </div>
                  </div>
                </div>
                <span v-else>无数据</span>
              </div>
              <div class="circle-text">
                <div class="circle-text-li">
                  <span>司机姓名</span>
                  {{deviceDetail.dirverName}}
                </div>
                <div class="circle-text-li">
                  <span>司机电话</span>
                  {{deviceDetail.dirverPhone}}
                </div>
                <div class="circle-text-li">
                  <span>司机编号</span>
                  {{deviceDetail.driver}}
                </div>
                <div class="circle-text-li">
                  <span>作业证号</span>
                  {{deviceDetail.dirverCertificateNo}}
                </div>
              </div>
            </div>
            <div class="deviceActive-r">
              <div class="deviceActive-t border-box">
                <div class="item">
                  <div class="title">黑匣子编号</div>
                  <div class="val">{{deviceDetail.deviceNo}}</div>
                </div>
                <div class="item">
                  <div class="title">黑匣子品牌</div>
                  <div class="val">{{deviceDetail.manufactor}}</div>
                </div>
                <div class="item">
                  <div class="title">SIM</div>
                  <div class="val">{{deviceDetail.gprs}}</div>
                </div>
                <div class="item">
                  <div class="title">备案编号</div>
                  <div class="val">{{deviceDetail.identifier}}</div>
                </div>
              </div>
              <div class="deviceActive-b">
                <swiper :options="swiperOption">
                  <swiper-slide>
                    <div class="border-box">
                      <div class="content-box">
                        <div class="slide-svg">
                          <svg class="icon" aria-hidden="true">
                            <use xlink:href="#el-icon-zhongliang" />
                          </svg>
                        </div>
                        <span class="slide-s1">安全吊重</span>
                        <span
                          v-if="deviceDetail.weight || deviceDetail.weight === 0"
                          class="slide-s2"
                        >{{deviceDetail.weight}}吨</span>
                        <span class="slide-s2" v-else>无数据</span>
                      </div>
                    </div>
                  </swiper-slide>
                  <swiper-slide>
                    <div class="border-box">
                      <div class="content-box">
                        <div class="slide-svg">
                          <svg class="icon" aria-hidden="true">
                            <use xlink:href="#el-icon-liju" />
                          </svg>
                        </div>
                        <span class="slide-s1">力矩</span>
                        <span
                          v-if="deviceDetail.moment || deviceDetail.moment === 0"
                          class="slide-s2"
                        >{{deviceDetail.moment}}KN.m</span>
                        <span class="slide-s2" v-else>无数据</span>
                      </div>
                    </div>
                  </swiper-slide>
                  <swiper-slide>
                    <div class="border-box">
                      <div class="content-box">
                        <div class="slide-svg">
                          <svg class="icon" aria-hidden="true">
                            <use xlink:href="#el-icon-fudu" />
                          </svg>
                        </div>
                        <span class="slide-s1">幅度</span>
                        <span
                          v-if="deviceDetail.range || deviceDetail.range === 0"
                          class="slide-s2"
                        >{{deviceDetail.range}}m</span>
                        <span class="slide-s2" v-else>无数据</span>
                      </div>
                    </div>
                  </swiper-slide>
                  <swiper-slide>
                    <div class="border-box">
                      <div class="content-box">
                        <div class="slide-svg">
                          <svg class="icon" aria-hidden="true">
                            <use xlink:href="#el-icon-gaodu" />
                          </svg>
                        </div>
                        <span class="slide-s1">高度</span>
                        <span
                          v-if="deviceDetail.height || deviceDetail.height === 0"
                          class="slide-s2"
                        >{{deviceDetail.height}}m</span>
                        <span class="slide-s2" v-else>无数据</span>
                      </div>
                    </div>
                  </swiper-slide>
                  <swiper-slide>
                    <div class="border-box">
                      <div class="content-box">
                        <div class="slide-svg">
                          <svg class="icon" aria-hidden="true">
                            <use xlink:href="#el-icon-weibiaoti-" />
                          </svg>
                        </div>
                        <span class="slide-s1">回转角度</span>
                        <span
                          v-if="deviceDetail.rotaryAngle || deviceDetail.rotaryAngle === 0"
                          class="slide-s2"
                        >{{deviceDetail.rotaryAngle}}°</span>
                        <span class="slide-s2" v-else>无数据</span>
                      </div>
                    </div>
                  </swiper-slide>
                  <swiper-slide>
                    <div class="border-box">
                      <div class="content-box">
                        <div class="slide-svg">
                          <svg class="icon" aria-hidden="true">
                            <use xlink:href="#el-icon-qingjiao" />
                          </svg>
                        </div>
                        <span class="slide-s1">倾角</span>
                        <span
                          v-if="deviceDetail.tiltAngle || deviceDetail.tiltAngle === 0"
                          class="slide-s2"
                        >{{deviceDetail.tiltAngle}}°</span>
                        <span class="slide-s2" v-else>无数据</span>
                      </div>
                    </div>
                  </swiper-slide>
                  <swiper-slide>
                    <div class="border-box">
                      <div class="content-box">
                        <div class="slide-svg">
                          <svg class="icon" aria-hidden="true">
                            <use xlink:href="#el-icon-fengsu" />
                          </svg>
                        </div>
                        <span class="slide-s1">风速</span>
                        <span
                          v-if="deviceDetail.windSpeed || deviceDetail.windSpeed === 0"
                          class="slide-s2"
                        >{{deviceDetail.windSpeed}}m/s</span>
                        <span class="slide-s2" v-else>无数据</span>
                      </div>
                    </div>
                  </swiper-slide>
                </swiper>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="copyright">Copyright © 2019 江苏鸿鹄电子科技有限公司</div>
  </div>
</template>

<script>
import {
  getDeviceList,
  craneAlarmCount,
  craneNotice
} from "@/views/crane/api/craneReport.js";
import { websocketUrl } from "@/axios/base.js";
import vueSeamless from "vue-seamless-scroll";
import weather from "@/components/weather.vue";
import homeTowerOn from "./tower.vue";
import "swiper/dist/css/swiper.css";
import { swiper, swiperSlide } from "vue-awesome-swiper";
export default {
  name: "towerhome",
  components: {
    weather,
    swiper,
    swiperSlide,
    homeTowerOn,
    vueSeamless
  },
  data() {
    return {
      swiperOption: {
        slidesPerView: "auto",
        spaceBetween: 16,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
        }
      },
      //设备详情
      projectId: "1",
      //ws
      socket: null,
      stompClient: null,
      deviceList: [],
      indexActive: 0,
      noticeList: [],
      alarmCount: 0
    };
  },
  computed: {
    classOption() {
      return {
        // direction: 0,
        openWatch: true,
        step: 0.3,
        limitMoveNum: 3
        // singleHeight: 26,
        // waitTime: 2500
      };
    },
    deviceDetail(){
      let data = {};
      if(this.deviceList.length>0){
        data = this.deviceList[this.indexActive];
      }
      return data;
    }
    
  },
  beforeDestroy() {
    // 页面离开时断开连接,清除定时器
    this.disconnect();
  },
  mounted() {
    this.initWebSocket();
    this.craneAlarmCount();
    this.craneNotice();
  },
  methods: {
    craneAlarmCount() {
      craneAlarmCount({}).then(res => {
        this.alarmCount = res.data || 0;
      });
    },
    craneNotice() {
      craneNotice({}).then(res => {
        this.noticeList = res.data || [];
      });
    },
    changeDevice(index) {
      if (this.indexActive != index) {
        this.indexActive = index;
      }
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
    getDeviceList() {
      getDeviceList({}).then(res => {
        (res.data || []).forEach(item => {
          item.status = item.isOnline;
          item.rotaryAngle = null;
          item.tiltAngle = null;
          item.windSpeed = null;
          this.deviceList.push(item);
          this.subscribe(item);
        });
      });
    },
    //开启ws通道
    subscribe(item) {
      this.stompClient.subscribe(
        `/topic/current/crane/${this.projectId}/${item.deviceNo}`,
        msg => {
          // 订阅服务端提供的某个topic
          // msg.body存放的是服务端发送给我们的信息
          let res = JSON.parse(msg.body);
          let list = [];
          let deviceList = [...this.deviceList];
          deviceList.forEach(item => {
            if (item.deviceNo == res.deviceNo) {
              item = Object.assign({}, item, res);
            }
            list.push(item);
          });
          this.deviceList = list;
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
.home-td-container {
  height: 100%;
  .home-box {
    padding: 10px;
    position: absolute;
    width: 100%;
    height: 100%;
    padding-bottom: 30px;
    overflow-y: auto;
    font-size: 12px;
  }

  .copyright {
    position: absolute;
    width: 100%;
    bottom: 0;
    left: 0;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    color: #000;
    text-align: center;
    background-color: #fff;
    z-index: 11;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.25);
  }
  .card-panel {
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
    &::before {
      content: " ";
      display: inline-block;
      width: 100%;
      height: 4px;
      position: absolute;
      left: 0;
      top: 0;
    }
    .card-panel-title {
      font-size: 16px;
      padding: 14px 15px 10px;
      .link {
        float: right;
        color: #4d83ff;
        cursor: pointer;
        font-size: 14px;
      }
    }
    .card-panel-content {
      flex: 1;
      padding: 0 10px;
    }
  }
  .panel-group {
    .card-panel {
      height: 160px;
      .card-panel-title {
        border-bottom: 1px solid #e5eaed;
      }

      &-l::before {
        background-color: #fe4c30;
      }
      &-m::before {
        background-color: #189ffb;
      }
      &-r::before {
        background-color: #ffb900;
      }
    }
  }
  .home-top {
    height: 175px;
  }
  .card-panel-main {
    height: 680px;
    &::before {
      background-color: #00bdda;
    }
  }
  .circle-main {
    width: 330px;
    height: 340px;
    .circle-box {
      width: 100%;
      height: 65%;
      display: flex;
      justify-content: center;
      align-items: center;
      .circle-content {
        position: relative;
        width: 150px;
        height: 150px;
        border-radius: 50%;
        border: #ffba00 solid 2px;
        .circle-line-box {
          position: absolute;
          left: 50%;
          top: 0;
          width: 2px;
          height: 100%;
          margin-left: -1px;
        }
        .circle-line {
          position: absolute;
          left: 0;
          top: 0;
          width: 2px;
          height: 50%;
          background: #ffba00;
          .circle-d {
            position: absolute;
            left: -6.5px;
            top: 70%;
            width: 15px;
            height: 15px;
            background: #ffba00;
            border-radius: 50%;
          }
        }
      }
    }
    .circle-text {
      width: 100%;
      padding-left: 12%;
      .circle-text-li {
        display: inline-block;
        width: 49%;
        line-height: 30px;
        span {
          color: #999;
          margin-right: 5px;
        }
      }
    }
  }

  .border-box {
    padding: 20px;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    border: 1px solid #e6ebee;

    &::before {
      content: " ";
      display: inline-block;
      width: 40px;
      height: 2px;
      background-color: #00beda;
      position: absolute;
      left: 20px;
      top: 0;
    }

    .border-title {
      font-size: 16px;
      font-weight: bold;
      padding-bottom: 4px;
    }
  }

  .deviceList {
    height: 260px;
    margin-bottom: 15px;
    .towerOn {
      width: 260px;
      position: relative;
      .opacity {
        position: absolute;
        left: 1px;
        top: 1px;
        right: 1px;
        bottom: 1px;
        background-color: rgba(255, 255, 255, 0.4);
        z-index: 2;
        margin: 0;
      }
    }
    .towerOn.active {
      .opacity {
        display: none;
      }
      .home__towerOn {
        border-color: #ffb501;
      }
    }
  }
  .deviceActive {
    display: flex;
    padding-bottom: 10px;
    .deviceActive-r {
      flex: 1;
      margin-left: 10px;
      overflow: hidden;
    }
    .deviceActive-t {
      height: 150px;
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      .item {
        width: 25%;
        .title {
          font-size: 14px;
          margin-bottom: 10px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .val {
          height: 20px;
          font-size: 18px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
    .deviceActive-b {
      height: 180px;
      .border-box {
        width: 160px;
        height: 180px;
      }
      .swiper-slide {
        width: 160px;
        margin-right: 10px !important;
      }
      .content-box {
        height: 100%;
        display: flex;
        flex-direction: column;
      }
      .slide-svg {
        padding-top: 15px;
        text-align: center;
        svg {
          font-size: 50px;
        }
      }

      .slide-s1 {
        display: inline-block;
        text-align: center;
        color: #555;
        padding-top: 10px;
      }

      .slide-s2 {
        display: inline-block;
        text-align: center;
        font-weight: 600;
        color: #555;
        font-size: 18px;
        padding-top: 20px;
      }
    }
  }
  .home-alam,
  .home-notice {
    display: flex;
    align-items: center;
    .image {
      width: 68px;
      height: 68px;
      .icon {
        width: 100%;
        height: 100%;
      }
    }
    .main {
      flex: 1;
      height: 100%;
      padding: 10px;
      padding-right: 0;
      overflow: hidden;
    }
    .seamless-warp {
      height: 100%;
      overflow: hidden;
    }
  }
  .home-alam {
    color: #fe6850;
    .main {
      text-align: right;
      font-size: 16px;
      line-height: 97px;
      span {
        font-size: 24px;
      }
    }
  }
  .home-notice {
    li {
      font-size: 14px;
      line-height: 24px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
</style>
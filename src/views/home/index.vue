<template>
    <div class="home-container">
        <!-- <div class="home-box">
            <el-row class="panel-group" :gutter="16">
                <el-col :xs="24" :sm="16" :lg="16" class="grid-col">
                    <div class='card-panel card-panel-swiper'>
                        <swiper class="card-swiper" :options="swiperOption">
                            <swiper-slide class="card-slide" v-for="(slide, index) in swiperSlides" :key="index">
                                <div class="slide-box">
                                    <div class="title">
                                        <span>1111</span>
                                        <b>正常</b>
                                    </div>
                                    <div class="info">
                                        <div class="info-item">
                                            <div class="val">25分贝</div>
                                            <div class="name">噪音</div>
                                        </div>
                                        <div class="info-item">
                                            <div class="val">25ug/m³</div>
                                            <div class="name">PM2.5</div>
                                        </div>
                                        <div class="info-item">
                                            <div class="val">25ug/m³</div>
                                            <div class="name">PM210</div>
                                        </div>
                                    </div>
                                </div>
                            </swiper-slide>
                            <div class="swiper-button-prev" slot="button-prev">
                                <div class="img"></div>
                            </div>
                            <div class="swiper-button-next" slot="button-next">
                                <div class="img"></div>
                            </div>
                        </swiper>
                    </div>
                </el-col>
                <el-col :xs="24" :sm="8" :lg="8" class="grid-col">
                    <div class="card-panel card-weather-panel">
                        <div class="card-weather-title">
                            <div class="name">今天</div>
                            <div class="val">2018-08-16</div>
                        </div>
                        <div class="card-weather-box">
                            <div class="card-weather-img">
                                <div class="img">
                                    <svg class="icon" aria-hidden="true">
                                        <use xlink:href="#el-icon-ziyuan15"></use>
                                    </svg>
                                </div>
                                <div class="text">
                                    <div class="val">26℃</div>
                                    <div class="range">16℃~16℃</div>
                                </div>
                            </div>
                            <div class="card-weather-info">
                                <div class="info-item">
                                    <span class="name">温度</span>
                                    <span class="val">50%</span>
                                </div>
                                <div class="info-item">
                                    <span class="name">风向</span>
                                    <span class="val">偏东南风</span>
                                </div>
                                <div class="info-item">
                                    <span class="name">空气等级</span>
                                    <span class="val">45</span>
                                    <span class="status">优</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-col>
                <el-col :xs="24" :sm="8" :lg="8" class="grid-col">
                    <div class="grid-box border-box">
                        <div class="border-title">扬尘PM2.5综合监测曲线</div>
                        <div class="content-box">
                            <charts v-bind="chartsOption1"></charts>
                        </div>
                    </div>
                </el-col>
                <el-col :xs="24" :sm="8" :lg="8" class="grid-col">
                    <div class="grid-box border-box">
                        <div class="border-title">扬尘PM10综合监测曲线</div>
                        <div class="content-box">
                            <charts v-bind="chartsOption2"></charts>
                        </div>
                    </div>
                </el-col>
                <el-col :xs="24" :sm="8" :lg="8" class="grid-col">
                    <el-row class="panel-group" :gutter="16">
                        <el-col :xs="12" :sm="12" :lg="12" class="grid-col">
                            <div class="grid-mini-box border-box">
                                <div class="card">
                                    <div class="card-text">设备数量</div>
                                    <div class="card-num">111</div>
                                    <div class="card-img">
                                        <i class="el-icon-yangchen" style="color:#00beda;"></i>
                                    </div>
                                </div>
                            </div>
                        </el-col>
                        <el-col :xs="12" :sm="12" :lg="12" class="grid-col">
                            <div class="grid-mini-box border-box">
                                <div class="card">
                                    <div class="card-text">工地数量</div>
                                    <div class="card-num">111</div>
                                    <div class="card-img">
                                        <i class="el-icon--gongdi" style="color:#008ed5;"></i>
                                    </div>
                                </div>
                            </div>
                        </el-col>
                        <el-col :xs="12" :sm="12" :lg="12" class="grid-col" style="margin-bottom:0;">
                            <div class="grid-mini-box border-box">
                                <div class="card">
                                    <div class="card-text">超标工地</div>
                                    <div class="card-num">111</div>
                                    <div class="card-img">
                                        <i class="el-icon--gongdi" style="color:#e86262;"></i>
                                    </div>
                                </div>
                            </div>
                        </el-col>
                        <el-col :xs="12" :sm="12" :lg="12" class="grid-col" style="margin-bottom:0;">
                            <div class="grid-mini-box border-box">
                                <div class="card">
                                    <div class="card-text">正常工地</div>
                                    <div class="card-num">111</div>
                                    <div class="card-img">
                                        <i class="el-icon--gongdi" style="color:#00b034;"></i>
                                    </div>
                                </div>
                            </div>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :xs="24" :sm="8" :lg="8" class="grid-col">
                    <div class="grid-box border-box">
                        <div class="border-title">TSP报警监测</div>
                        <div class="content-box">
                            <charts v-bind="chartsOption3"></charts>
                        </div>
                    </div>
                </el-col>
                <el-col :xs="24" :sm="8" :lg="8" class="grid-col">
                    <div class="grid-box border-box">
                        <div class="border-title">PM2.5设备排名 TOP20</div>
                        <div class="content-box">
                            <div class="rank">
                                <div class="name">设备名称</div>
                                <div class="val">PM2.5</div>
                            </div>
                            <div class="rank-box">
                                <el-scrollbar wrapClass="scrollbar-wrapper">
                                    <div class="rank" v-for="i in 20" :key="i">
                                        <div class="name">111</div>
                                        <div class="val">2222</div>
                                    </div>
                                </el-scrollbar>
                            </div>
                        </div>
                    </div>
                </el-col>
                <el-col :xs="24" :sm="8" :lg="8" class="grid-col">
                    <div class="grid-box border-box">
                        <div class="border-title">PM10设备排名 TOP20</div>
                        <div class="content-box">
                            <div class="rank">
                                <div class="name">设备名称</div>
                                <div class="val">PM10</div>
                            </div>
                            <div class="rank-box">
                                <el-scrollbar wrapClass="scrollbar-wrapper">
                                    <div class="rank" v-for="i in 20" :key="i">
                                        <div class="name">111</div>
                                        <div class="val">2222</div>
                                    </div>
                                </el-scrollbar>
                            </div>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div> -->
        <div class="copyright">Copyright © 2019 江苏鸿鹄电子科技有限公司</div>
    </div>
</template>

<script>
import charts from "./charts";
import "swiper/dist/css/swiper.css";
import { swiper, swiperSlide } from "vue-awesome-swiper";
import getData from "./getData.js";
export default {
  name: "home",
  //混入获取页面数据
  mixins: [getData],
  components: {
    charts,
    swiper,
    swiperSlide
  },
  data() {
    return {
      swiperOption: {
        slidesPerView: "auto",
        spaceBetween: 30,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
        }
      },
      swiperSlides: [1, 2, 3, 4, 5],
      //扬尘PM2.5综合监测曲线
      chartsOption1: {
        x: ["1", "2", "3", "4"],
        y: [3, 4, 2, 5],
        lineColor: "#53c5ff",
        areaColor: "#c8f4ff"
      },
      //扬尘PM10综合监测曲线
      chartsOption2: {
        x: ["1", "2", "3", "4"],
        y: [3, 4, 2, 5],
        lineColor: "#7fe39c",
        areaColor: "#beefcd"
      },
      //TSP报警监测
      chartsOption3: {
        x: ["1", "2", "3", "4"],
        y: [3, 4, 2, 5],
        lineColor: "#ffd16c",
        areaColor: "#ffeab2"
      },
      //PM2.5设备排名 TOP20
      pm25_top20: [],
      //PM10设备排名 TOP20
      pm10_top20: [],
      //设备数量
      quantity1: "",
      //工地数量
      quantity2: "",
      //超标工地
      quantity3: "",
      //正常工地
      quantity4: "",
      //所有扬尘设备最近一条数据列表
      all_lastList: [],
      //天气数据
      weatherData: {}
    };
  },
  mounted() {}
};
</script>

<style lang="scss">
.home-container {
  height: 100%;

  .home-box {
    padding: 10px;
    position: absolute;
    width: 100%;
    height: 100%;
    padding-bottom: 30px;
    overflow-y: auto;
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
}

.grid-col {
  margin-bottom: 16px;
}

.panel-group {
  .card-panel {
    height: 180px;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);

    &::before {
      content: " ";
      display: inline-block;
      width: 100%;
      height: 4px;
      position: absolute;
      left: 0;
      top: 0;
    }
  }

  .grid-box {
    height: 300px;
    display: flex;
    flex-direction: column;

    .content-box {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .rank {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      height: 34px;
      line-height: 34px;
      color: #666;

      .name {
        padding-left: 5px;
      }

      .val {
        width: 100px;
        text-align: center;
      }
    }

    .rank-box {
      flex: 1;
      overflow: hidden;

      .rank:nth-child(2n + 1) {
        background-color: #f4f8f9;
      }

      .el-scrollbar {
        height: 100%;
      }

      .scrollbar-wrapper {
        overflow-x: hidden;
      }

      .rank {
        color: #000;
      }
    }
  }

  .grid-mini-box {
    height: 142px;
  }

  .border-box {
    padding: 20px;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.85);

    &::before {
      content: " ";
      display: inline-block;
      width: 40px;
      height: 4px;
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

  .card {
    height: 100%;
    color: #000;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .card-text {
      font-size: 14px;
      margin-bottom: 10px;
    }

    .card-num {
      font-size: 20px;
    }

    .card-img {
      width: 80px;
      height: 80px;
      font-size: 80px;
      position: absolute;
      right: 10px;
      top: 31px;
    }
  }
}

//设备
.card-panel-swiper {
  padding: 40px 20px;

  &::before {
    background-color: #00beda;
  }
}

.card-swiper {
  height: 100%;
}

.card-slide {
  height: 100%;
  width: 300px;
  padding-right: 30px;
  border-right: 1px solid #e5ebec;

  &:last-child {
    border-right: 0;
  }
}

.swiper-button-prev.swiper-button-disabled,
.swiper-button-next.swiper-button-disabled {
  display: none;
}

.slide-box {
  display: flex;
  height: 100%;
  flex-direction: row;
  flex-direction: column;
  justify-content: space-between;

  .title {
    display: flex;
    align-items: center;
    font-size: 20px;
    color: #000;
    font-weight: bold;
    padding-left: 15px;

    b {
      display: inline-block;
      padding: 0 8px;
      height: 16px;
      line-height: 16px;
      font-size: 12px;
      color: #fff;
      background-color: #00b034;
      border-radius: 2px;
      margin-left: 10px;
    }
  }

  .info {
    display: flex;

    .info-item {
      flex-grow: 1;
      text-align: center;

      .val {
        font-size: 16px;
        color: #000;
        margin-bottom: 15px;
      }

      .name {
        font-size: 12px;
        color: #999;
      }
    }
  }
}

.swiper-button-next {
  width: 30px;
  height: 100%;
  background-size: 0;
  background-color: #fff;
  top: 0;
  right: 0;
  margin-top: 0;
  padding-left: 10px;

  .img {
    width: 100%;
    height: 100%;
    background-image: url("data:image/png;base64,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");
    background-size: 15px;
    background-color: #f5f5f5;
    background-repeat: no-repeat;
    background-position: center;
  }
}

.swiper-button-prev {
  width: 30px;
  height: 100%;
  background-size: 0;
  background-color: #fff;
  top: 0;
  left: 0;
  margin-top: 0;
  padding-right: 10px;

  .img {
    width: 100%;
    height: 100%;
    background-image: url("data:image/png;base64,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");
    background-size: 15px;
    background-color: #f5f5f5;
    background-repeat: no-repeat;
    background-position: center;
  }
}

//天气
.card-weather-panel {
  &::before {
    background-color: #ffba00;
  }

  .card-weather-title {
    display: flex;
    justify-content: space-between;
    font-size: 20px;
    padding: 14px 30px 10px;
    border-bottom: 1px solid #e5ebec;

    .name {
      color: #000;
      font-weight: bold;
    }

    .val {
      color: #ffba00;
    }
  }

  .card-weather-box {
    display: flex;
    height: 132px;
    align-items: center;
    justify-content: space-around;

    .card-weather-img {
      display: flex;

      .img {
        width: 80px;
        height: 80px;
        font-size: 68px;
        margin-right: 10px;
      }

      .text {
        align-self: center;

        .val {
          font-size: 30px;
          color: #000;
          font-weight: bold;
          margin-bottom: 10px;
        }

        .range {
          font-size: 16px;
          color: #999;
        }
      }
    }

    .card-weather-info {
      .info-item {
        width: 120px;
        margin: 10px 0;
        font-size: 14px;

        .name {
          color: #999;
        }

        .val {
          color: #000;
          margin-left: 5px;
        }

        .status {
          margin-left: 5px;
          display: inline-block;
          padding: 2px 5px 0;
          background-color: #00b034;
          border-radius: 2px;
          font-size: 12px;
          color: #fff;
        }
      }
    }
  }
}
</style>
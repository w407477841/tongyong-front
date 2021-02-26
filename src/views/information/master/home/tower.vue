<template>
  <div class="home__towerOn">
    <div class="home__towerOn-tower">
      <div class="td-box">
        <div class="td-t" :style="{left:tRangPX}">
          <div class="td-1"></div>
          <div class="td-2" :style="{height:tHeightPX}"></div>
          <div class="td-3"></div>
        </div>
      </div>
    </div>
    <div class="home__towerOn-info">
      <div class="infoL">
        <span class="val">{{name}}</span>
        <span :class="['status',status==1?'':'noStatus']">{{status==1?'正常':'离线'}}</span>
      </div>
      <!-- <div class="infoR">
        <span class="title">驾驶员</span>
        <span class="val"></span>
      </div> -->
    </div>
  </div>
</template>

<script>
export default {
  name: "home-tower-on",
  props: {
    name: {
      type: String,
      default() {
        return null;
      }
    },
    status: {
      type: Number,
      default() {
        return null;
      }
    },
    maxRange: {
      type: Number,
      default() {
        return null;
      }
    },
    standardHeight: {
      type: Number,
      default() {
        return null;
      }
    },
    range: {
      type: Number,
      default() {
        return null;
      }
    },
    height: {
      type: Number,
      default() {
        return null;
      }
    }
  },
  computed: {
    tRangPX() {
      let left = 5,
        w = 70;
      left = (this.range / this.maxRange) * w + left;
      return left + "px";
    },
    tHeightPX() {
      let height = 0,
        h = 107;
      height = (this.height / this.standardHeight) * h;
      return height + "px";
    }
  },
  data() {
    return {
      bottonDetail: {
        leftPos: 35, //5-75
        height5: 3 //107
      }
    };
  }
};
</script>

<style lang="scss">
.home__towerOn {
  width: 260px;
  height: 260px;
  border: 1px solid #e7ecef;
  .td-box {
    margin: 0 auto;
    position: relative;
    width: 221.6px;
    height: 221.6px;
    background-image: url("~@/assets/image/td1.png");
    background-repeat: no-repeat;
    background-size: cover;
    .td-t {
      position: absolute;
      left: 28px;
      top: 80px;
      width: 28px;
      height: 137.6px;
      .td-1 {
        width: 28px;
        height: 7.2px;
        background-image: url("~@/assets/image/td2.png");
        background-repeat: no-repeat;
        background-size: cover;
      }
      .td-2 {
        width: 28px;
        height: 2.4px;
        background-image: url("~@/assets/image/td2.png");
        background-repeat: no-repeat;
        background-size: cover;
        background-position: 0 -7.2px;
      }
      .td-3 {
        width: 28px;
        height: 22.4px;
        background-image: url("~@/assets/image/td2.png");
        background-repeat: no-repeat;
        background-size: cover;
        background-position: 0 -114.4px;
      }
    }
  }
  .home__towerOn-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
    background-color: #f9f9f9;
    height: 36px;
    padding: 0 8px;
    .status {
      font-size: 12px;
      color: #fff;
      background-color: #01b033;
      padding: 1px 5px;
      border-radius: 3px;
      &.noStatus {
        background-color: #df0000;
      }
    }
    .val {
      color: #000;
      font-weight: bold;
    }
  }
}
</style>

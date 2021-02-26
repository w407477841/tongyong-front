<template>
    <div class="app-container">
        <div class="dust__operationChart">
            <div class="operationChart_mian">
                <div class="form">
                    <el-form :inline="true" class="condition-form">
                        <el-form-item>
                            <el-radio-group v-model="radio" size="mini" @change="radioClick()">
                                <el-radio-button :label="1" >1小时</el-radio-button>
                                <el-radio-button :label="2">24小时</el-radio-button>
                                <el-radio-button :label="3">7天</el-radio-button>
                                <el-radio-button :label="4">自定义</el-radio-button>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item v-if="radio==4">
                            <el-date-picker v-model="beginTime" type="date" :picker-options="beginPicker" placeholder="选择日期" value-format="yyyy-MM-dd" size="mini" ></el-date-picker>
                            <i>-</i>
                            <el-date-picker v-model="endTime" type="date" :picker-options="endPicker" placeholder="选择日期" value-format="yyyy-MM-dd" size="mini" ></el-date-picker>
                            
                            <el-button class="searchBtn" type="primary" size="mini" icon="el-icon-search"
                                   @click="search">查询
                            </el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" icon="el-icon-yckz" size="mini" @click="routerLink">切换成列表形式</el-button>
                        </el-form-item>
                    </el-form>              
                </div>
                <div class="chart">
                  <div id="operationChart"></div>
                </div>
            </div>
            <div class="operationChart_nav">
                <el-scrollbar wrapClass="operationChart-wrapper">
                    <ul class="navBox">
                        <li v-for="item in navs" :class="['navItem',item.active?'active':'']" :key="item.text" @click="navClick(item)">
                            <div class="text">{{item.text}}</div>
                            <div :class="['icon el-icon',item.icon]"></div>
                        </li>
                    </ul>
                </el-scrollbar>
            </div>
        </div>
    </div>
</template>

<script>
import { changeToEcharts } from "@/views/api/equipmentApi.js";
export default {
  data() {
    return {
      detailId: this.$route.query.id,
      radio: 1,
      beginTime: "",
      level:0,
      endTime: "",
      name: "weight",
      unit: "载重(t)",
      text: "载重",
      navs: [
        {
          active: true,
          text: "载重",
          name: "weight",
          unit: "载重(t)",
          icon: "el-icon-zhongliang"
        },
        {
          active: false,
          text: "力矩",
          name: "moment",
          unit: "力矩(N.m)",
          icon: "el-icon-liju12"
        },
        {
          active: false,
          text: "幅度",
          name: "range",
          unit: "幅度(m)",
          icon: "el-icon-fudu12"
        },
        {
          active: false,
          text: "高度",
          name: "height",
          unit: "高度(m)",
          icon: "el-icon-gaodu"
        },
        {
          active: false,
          text: "回转角度",
          name: "rotary_angle",
          unit: "回转角度(°)",
          icon: "el-icon-weibiaoti12"
        },
        {
          active: false,
          text: "倾角",
          name: "tilt_angle",
          unit: "倾角(°)",
          icon: "el-icon-qingjiao"
        },
        {
          active: false,
          text: "风速",
          name: "wind_speed",
          unit: "风速(m/s)",
          icon: "el-icon-fengsu"
        }
      ],
      chart: null
    };
  },
  computed: {
    beginPicker() {
      let endTime = this.endTime;
      return {
        disabledDate(time) {
          return time.getTime() > new Date(endTime);
        }
      };
    },
    endPicker() {
      let beginTime = this.$moment(this.beginTime);
      return {
        disabledDate(time) {
          return time.getTime() < new Date(beginTime);
        }
      };
    },
    params() {
      let param = {
        id: this.detailId,
        beginDate: this.beginTime,
        endDate: this.endTime,
        type: this.radio,
        columnName: this.name,
        devType:2
      };
      return param;
    }
  },
  mounted() {
    let _this = this;
    setTimeout(() => {
      _this.chart = this.$echarts.init(
        document.getElementById("operationChart")
      );
      this.getList(this.radio);
    }, 0);
  },
  methods: {
    search() {
      if (this.beginTime == "") {
        this.$message({
          type: "error",
          message: "请选择开始时间!"
        });
        return;
      }
      if (this.endTime == "") {
        this.$message({
          type: "error",
          message: "请选择结束时间!"
        });
        return;
      }
      if (this.endTime < this.beginTime) {
        this.$message({
          type: "error",
          message: "开始时间不能大于结束时间!"
        });
        return;
      }
      if (this.beginTime.substring(0, 6) != this.endTime.substring(0, 6)) {
        this.$message({
          type: "error",
          message: "开始时间和结束时间不能跨月!"
        });
        return;
      }
      this.getList(4);
    },
    navClick(item) {
      this.name = item.name;
      this.unit = item.unit;
      this.text = item.text;
      this.getList(this.radio);
      if (!item.active) {
        this.navs.forEach(el => {
          el.active = false;
        });
        item.active = true;
      }
    },
    radioClick() {
      if (this.radio != 4) {
        this.getList(this.radio);
      }
    },
    //请求后台接口
    getList(type) {
      changeToEcharts(this.params).then(res => {
        let option = {
          x: [],
          y: []
        };
        let count = res.total;
          res.list.forEach(el => {
               let  time = this.$moment(el.time).format("YYYY-MM-DD HH:mm");
            if(type==1){
             
              this.level=0;
            }else if(type==2){
              
              this.level=2;
            }else if(type==3){
             
              this.level=23;
            }else if(type==4){
              
               if(count/24<=1){
                 this.level=4;
              }
              else if(count/24<=6){
                 this.level=23;
              }else if(count/24<=12){
                this.level=46;
              }else if(count/24<=18){
                this.level=69;
              }else if(count/24<=24){
                this.level=92;
              }else if(count/24<=31){
                this.level=105;
              }
             
              
            }
            option.x.push(time);
            option.y.push(el.name);
          });
        
        
        this.chart.setOption({
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "cross",
              animation: false,
              label: {
                backgroundColor: "#505765"
              }
            }
          },
          xAxis: {
            axisLabel: {interval:this.level,
            formatter:function(value)  
                               {  
                                   return value.split(" ").join("\n");  
                               } },
            name: "时间",
            type: "category",
            data: option.x
          },
          dataZoom: [
            {
              show: true,
              realtime: true,
              start: 0,
              bottom:'0%',
              end: 100
            },
            {
              type: "inside",
              realtime: true,
              start: 0,
              end: 100
            }
          ],
          yAxis: {
            name: this.unit,
            type: "value",
            splitLine: {
              show: false
            }
          },
          series: [
            {
              name: this.text,
              type: "line",
              data: option.y
            }
          ]
        });
      });
    },
    routerLink() {
      // this.$router.push({
      //   path: "/realTimeMonitoring/runData",
      //   query: { id: this.$route.query.row.id }
      // });
      this.$router.back(-1);
    }
  }
};
</script>

<style lang="scss">
.dust__operationChart {
  height: 100%;
  display: flex;
  flex-wrap: nowrap;
}
.operationChart_nav {
  width: 250px;
  height: 100%;
  .el-scrollbar {
    height: 100%;
    .operationChart-wrapper {
      overflow-x: hidden;
    }
  }
  .navBox {
    width: 235px;
    float: right;
  }
  .navItem {
    padding: 0 20px;
    height: 110px;
    background-color: #fff;
    margin-bottom: 15px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    .icon {
      height: 60px;
      font-size: 60px;
      color: #00bdda;
    }
    &::before {
      content: "";
      width: 0;
      height: 0;
      border-top: 10px solid transparent;
      border-bottom: 10px solid transparent;
      border-right: 10px solid #fff;
      position: absolute;
      left: -10px;
    }
    &:last-child {
      margin: 0;
    }
    &.active {
      color: #fff;
      background-color: #00bdda;
      .icon {
        color: #fff;
      }
    }
    &.active::before {
      border-right: 10px solid #00bdda;
    }
  }
}
.operationChart_mian {
  flex: 1;
  height: 100%;
  background-color: #fff;
  padding: 10px;
  display: flex;
  flex-direction: column;
  .form {
    .el-form-item {
      margin-bottom: 0;
    }
  }
  .chart {
    flex: 1;
  }
}
#operationChart {
  width: 100%;
  height: 100%;
}
</style>

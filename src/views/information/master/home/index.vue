<template>
    <div class="home-yc-container">
        <div class="home-box">
            <el-row class="panel-group" :gutter="16">
                <el-col :xs="24" :sm="16" :lg="16" class="grid-col">
                    <div class='card-panel card-panel-swiper'>
                        <div class="row-select">
                            <el-select v-model="deviceNo" @change="handleChangeDevice" placeholder="请选择">
                                <el-option v-for="(item,index) in deviceOptions" :label="item.deviceNo" :value="item.deviceNo" :key="index"></el-option>
                            </el-select>
                        </div>
                        <el-row :gutter="16">
                            <el-col :xs="24" :sm="12" :lg="12" class="grid-col">
                                <div class="box-text-all">
                                    <div class="box-text">
                                        <p class="bt1">{{data9.pm25 || "无数据"}}</p>
                                        <p class="bt2">PM2.5(ug/m³)</p>
                                    </div>
                                    <div class="box-text">
                                        <p class="bt1">{{data9.pm10 || "无数据"}}</p>
                                        <p class="bt2">PM10(ug/m³)</p>
                                    </div>
                                    <div class="box-text">
                                        <p class="bt1">{{data9.temperature || "无数据"}}</p>
                                        <p class="bt2">温度(℃)</p>
                                    </div>
                                    <div class="box-text">
                                        <p class="bt1">{{data9.humidity || "无数据"}}</p>
                                        <p class="bt2">湿度(%rh)</p>
                                    </div>
                                    <div class="box-text">
                                        <p class="bt1">{{data9.windSpeed || (data9.windSpeed === 0 ? 0 : "无数据")}}</p>
                                        <p class="bt2">风速(m/s)</p>
                                    </div>
                                    <div class="box-text">
                                        <p class="bt1">{{data9.windDirection || "无数据"}}</p>
                                        <p class="bt2">风向</p>
                                    </div>
                                    <div class="box-text">
                                        <p class="bt1">{{data9.noise || "无数据"}}</p>
                                        <p class="bt2">噪音(分贝)</p>
                                    </div>
                                    <div class="box-text">
                                        <p class="bt1">{{data9.tsp || "无数据"}}</p>
                                        <p class="bt2">TSP(ug/m³)</p>
                                    </div>
                                    <div class="box-text">
                                        <p class="bt1">{{ (data9.windForce >= 0)?data9.windForce :"无数据"}}</p>
                                        <p class="bt2">风力(级)</p>
                                    </div>
                                </div>
                            </el-col>
                            <el-col :xs="24" :sm="12" :lg="12" class="grid-col">
                                <div class="grid-box border-box border-box-no-before">
                                    <div class="content-box">
                                        <charts v-if="chartsOption1.x.length > 0" v-bind="chartsOption1"></charts>
                                        <span class="nodatas" v-else>无数据</span>
                                    </div>
                                    <div v-if="chartsOption1.x.length > 0" class="border-title" style="text-align:center; padding-top:16px;">扬尘PM2.5综合监测曲线</div>
                                </div>
                            </el-col>
                            <el-col :xs="24" :sm="12" :lg="12" class="grid-col">
                                <div class="grid-box border-box border-box-no-before">
                                    <div class="content-box">
                                        <charts v-if="chartsOption2.x.length > 0" v-bind="chartsOption2"></charts>
                                        <span class="nodatas" v-else>无数据</span>
                                    </div>
                                    <div v-if="chartsOption2.x.length > 0" class="border-title" style="text-align:center; padding-top:16px;">扬尘PM10综合监测曲线</div>
                                </div>
                            </el-col>
                            <el-col :xs="24" :sm="12" :lg="12" class="grid-col">
                                <div class="grid-box border-box border-box-no-before">
                                    <div class="content-box">
                                        <charts v-if="chartsOption3.x.length > 0" v-bind="chartsOption3"></charts>
                                        <span class="nodatas" v-else>无数据</span>
                                    </div>
                                    <div v-if="chartsOption3.x.length > 0" class="border-title" style="text-align:center; padding-top:16px;">TSP报警监测</div>
                                </div>
                            </el-col>
                        </el-row>
                    </div>

                    <el-row class="panel-group panel-group-number" :gutter="16">
                        <el-col :xs="12" :sm="12" :lg="6" class="grid-col">
                            <div class="grid-mini-box border-box aa-color1">
                                <div class="card">
                                    <div class="card-text">设备数量</div>
                                    <div class="card-num">{{this.quantity1}}</div>
                                    <div class="card-img">
                                        <i class="el-icon-yangchen" style="color:#00beda;"></i>
                                    </div>
                                </div>
                            </div>
                        </el-col>
                        <el-col :xs="12" :sm="12" :lg="6" class="grid-col">
                            <div class="grid-mini-box border-box aa-color2">
                                <div class="card">
                                    <div class="card-text">工地数量</div>
                                    <div class="card-num">{{this.quantity2}}</div>
                                    <div class="card-img">
                                        <i class="el-icon--gongdi" style="color:#008ed5;"></i>
                                    </div>
                                </div>
                            </div>
                        </el-col>
                        <el-col :xs="12" :sm="12" :lg="6" class="grid-col" style="margin-bottom:0;">
                            <div class="grid-mini-box border-box aa-color3">
                                <div class="card">
                                    <div class="card-text">超标工地</div>
                                    <div class="card-num">{{this.quantity3}}</div>
                                    <div class="card-img">
                                        <i class="el-icon--gongdi" style="color:#e86262;"></i>
                                    </div>
                                </div>
                            </div>
                        </el-col>
                        <el-col :xs="12" :sm="12" :lg="6" class="grid-col" style="margin-bottom:0;">
                            <div class="grid-mini-box border-box aa-color4">
                                <div class="card">
                                    <div class="card-text">正常工地</div>
                                    <div class="card-num">{{this.quantity4}}</div>
                                    <div class="card-img">
                                        <i class="el-icon--gongdi" style="color:#00b034;"></i>
                                    </div>
                                </div>
                            </div>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :xs="24" :sm="8" :lg="8" class="grid-col">
                    <weather></weather>

                    <div class="grid-box border-box" style="margin-bottom:16px; margin-top:16px;">
                        <div class="border-title">PM2.5设备排名 TOP20</div>
                        <div class="content-box">
                            <div class="rank">
                                <div class="name">设备名称</div>
                                <div class="val">PM2.5</div>
                            </div>
                            <div class="rank-box">
                                <el-scrollbar wrapClass="scrollbar-wrapper">
                                    <div class="rank" v-for="(i,index) in pm25Top20" :key="index">
                                        <div class="name">{{i.deviceNo}}</div>
                                        <div class="val">{{i.amount || "无数据"}}</div>
                                    </div>
                                </el-scrollbar>
                            </div>
                        </div>
                    </div>

                    <div class="grid-box border-box">
                        <div class="border-title">PM10设备排名 TOP20</div>
                        <div class="content-box">
                            <div class="rank">
                                <div class="name">设备名称</div>
                                <div class="val">PM10</div>
                            </div>
                            <div class="rank-box">
                                <el-scrollbar wrapClass="scrollbar-wrapper">
                                    <div class="rank" v-for="(i,index) in pm10Top20" :key="index">
                                        <div class="name">{{i.deviceNo}}</div>
                                        <div class="val">{{i.amount || "无数据"}}</div>
                                    </div>
                                </el-scrollbar>
                            </div>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div class="copyright">Copyright © 2019 江苏鸿鹄电子科技有限公司</div>
    </div>
</template>

<script>
    import charts from './charts';
    import weather from '@/components/weather.vue'
    import 'swiper/dist/css/swiper.css';
    import {
        swiper,
        swiperSlide
    } from 'vue-awesome-swiper';
    import { getAllDevices,getLastOneApi,getWeatherApi,
        getDeviceNumberApi, getWorkSiteNumberApi,getOverproofWorkSiteNumberApi, getNormalWorkSiteNumberApi,
        getRank20Api,getTrendApi
    } from '@/views/api/dustHome.js';
    export default {
        name: 'home',
        components: {
            charts,
            swiper,
            swiperSlide,
            weather
        },
        data() {
            return {

                //选中设备
                deviceNo:'',
                projectId:'',
                deviceOptions:[],
                //扬尘PM2.5综合监测曲线
                chartsOption1: {
                    x: [],
                    y: [],
                    // lineColor: '#53c5ff',
                    // areaColor: '#c8f4ff'
                },
                //扬尘PM10综合监测曲线
                chartsOption2: {
                    x: [],
                    y: [],
                    // lineColor: '#7fe39c',
                    // areaColor: '#beefcd'
                },
                //TSP报警监测
                chartsOption3: {
                    x: [],
                    y: [],
                    // lineColor: '#ffd16c',
                    // areaColor: '#ffeab2'
                },
                //PM2.5设备排名 TOP20
                pm25Top20:[],
                //PM10设备排名 TOP20
                pm10Top20:[],
                //设备数量
                quantity1:'',
                //工地数量
                quantity2:'',
                //超标工地
                quantity3:'',
                //正常工地
                quantity4:'',
                //所有扬尘设备最近一条数据列表
                all_lastList:[],

                data9:{}
            };
        },
        methods:{
            handleChangeDevice(v){
                let o = this.deviceOptions.find((obj)=>{
                    return obj.deviceNo == v;
                });
                this.projectId = o.projectId;
                this.handleSwitchDevice();
            },
            //扬尘设备切换
            handleSwitchDevice(){
                let obj = {
                    projectId:this.projectId,
                    deviceNo:this.deviceNo
                }
                //9项数据
                getLastOneApi(obj).then((data)=>{
                    this.data9 = data || {};
                });

                this.handlePM25();
                this.handlePM10();
                this.handleTSP();
            },
            //设备数量,工地数量,超标工地,正常工地
            handleFourIconValue(){
                let obj = {
                    orgId:sessionStorage.getItem('orgId'),
                };
                getDeviceNumberApi(obj).then((data)=>{
                    this.quantity1=data.amount;
                });
                getWorkSiteNumberApi(obj).then((data)=>{
                    this.quantity2=data.amount;
                });
                getOverproofWorkSiteNumberApi(obj).then((data)=>{
                    this.quantity3=data.amount;
                });
                getNormalWorkSiteNumberApi(obj).then((data)=>{
                    this.quantity4=data.amount;
                });

            },
            //pm2.5,pm10 前20
            handlePm25Top20(){
                let obj1 = {
                    orgId:sessionStorage.getItem('orgId'),
                    columnName:"pm25"
                };
                getRank20Api(obj1).then((data)=>{
                    this.pm25Top20=data;
                    //this.handlePm10Top20();
                });

            },
            handlePm10Top20(){
                let obj2 = {
                    orgId:sessionStorage.getItem('orgId'),
                    columnName:"pm10"
                };
                getRank20Api(obj2).then((data)=>{
                    this.pm10Top20=data;
                });
            },
            //扬尘PM2.5综合监测曲线
            handlePM25() {
                let obj = {
                    projectId:this.projectId,
                    deviceNo:this.deviceNo,
                    columnName:'pm25'
                };
                getTrendApi(obj).then((data)=>{
                    let options = {
                        x: [],
                        y: [],
                        lineColor: '#53c5ff',
                        areaColor: '#c8f4ff'
                    }
                    if(data){
                        data.forEach((el)=>{
                            let time = this.$moment(el.trendTime).format('HH:mm');
                            options.x.push(time);
                            let amount = el.amount || 0;
                            options.y.push(amount);
                        });
                    }
                    this.chartsOption1 = options;

                });
            },
            //扬尘PM10综合监测曲线
            handlePM10() {
                let obj = {
                    projectId:this.projectId,
                    deviceNo:this.deviceNo,
                    columnName:'pm10'
                };
                getTrendApi(obj).then((data)=>{
                    let options = {
                        x: [],
                        y: [],
                        lineColor: '#7fe39c',
                        areaColor: '#beefcd'
                    }
                    if(data){
                        data.forEach((el)=>{
                            let time = this.$moment(el.trendTime).format('HH:mm');
                            options.x.push(time);
                            let amount = el.amount || 0;
                            options.y.push(amount);
                        });
                    }
                    this.chartsOption2 = options;

                });
            },
            //TSP报警监测
            handleTSP() {
                let obj = {
                    projectId:this.projectId,
                    deviceNo:this.deviceNo,
                    columnName:'tsp'
                };
                getTrendApi(obj).then((data)=>{
                    let options = {
                        x: [],
                        y: [],
                        lineColor: '#ffd16c',
                        areaColor: '#ffeab2'
                    }
                    if(data){
                        data.forEach((el)=>{
                            let time = this.$moment(el.trendTime).format('HH:mm');
                            options.x.push(time);
                            let amount = el.amount || 0;
                            options.y.push(amount);
                        });
                    }
                    this.chartsOption3 = options;
                });
            },
        },
        created(){
            let orgId = sessionStorage.getItem('orgId');
            // 扬尘设备 默认第1个
            getAllDevices({orgId}).then((data)=>{
                if(data.environmentList.length > 0){
                    this.deviceOptions = data.environmentList;
                    this.deviceNo = data.environmentList[0].deviceNo;
                    this.projectId = data.environmentList[0].projectId;
                    this.handleSwitchDevice();
                }
            });

            this.handleFourIconValue();
            this.handlePm25Top20();
            this.handlePm10Top20();
        },
        mounted() {


        }
    };
</script>

<style lang="scss">
    .home-yc-container {
        height: 100%;
        .nodatas {
            display: block;
            width: 100%;
            height: 100%;
            text-align: center;
            line-height: 280px;
            color:#555;
            font-weight: 600;
        }
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
                    content: ' ';
                    display: inline-block;
                    width: 100%;
                    height: 4px;
                    position: absolute;
                    left: 0;
                    top: 0;
                }
            }

            .box-text-all {
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                padding:20px;
                height: 300px;
                background-color: #F9FBFC;
                .box-text {
                    width: 33.33%;
                    // height: 33.33%;
                    text-align: center;
                    .bt1 {
                        font-weight: 600;
                        color: #555;
                        font-size: 14px;
                    }
                    .bt2 {
                        color: #888;
                    }
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
                    content: ' ';
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

            .border-box-no-before {
                &::before {
                    display: none;
                }
                box-shadow:none;
                padding-top: 0;
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
        .panel-group-number {
            .border-box {
                &::before {
                    width: 100%;
                    left:0;
                }
            }
            .aa-color1 {
                &::before {
                    background-color:#00BEDA;
                }
            }
            .aa-color2 {
                &::before {
                    background-color:#008ED5;
                }
            }
            .aa-color3 {
                &::before {
                    background-color:#E86262;
                }
            }
            .aa-color4 {
                &::before {
                    background-color:#00B034;
                }
            }
        }
        .panel-group .card-panel-swiper {
            margin-bottom: 16px;
            height: 654px;
            padding:0 16px;
            &::before {
                content: ' ';
                display: inline-block;
                width: 100%;
                height: 4px;
                background-color: #00beda;
                position: absolute;
                left: 0;
                top: 0;
            }
            .row-select {
                margin:4px 0;
                .el-input__inner {
                    border:none;
                    color: #333;
                    font-weight: 600;
                }
            }
        }
    }
</style>

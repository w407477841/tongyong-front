<template>
    <div class="hydropower-home-container">
        <div class="home-box">
            <el-row class="panel-group" :gutter="16">
                <el-col :xs="24" :sm="16" :lg="16" class="grid-col">
                    <div class='card-panel hydropower-summary'>
                        <div class="sumc">
                            <div class="sumc-left">
                                <span class="d-t">水电表总数</span>
                                <br/>
                                <span class="d-d">{{total}}</span>
                            </div>
                            <div class="sumc-right">
                                <svg class="icon" aria-hidden="true">
                                    <use xlink:href="#el-icon-shuidianmei"></use>
                                </svg>
                            </div>
                        </div>
                        <div class="sumc">
                            <div class="sumc-left">
                                <span class="d-t">水表数</span>
                                <br/>
                                <span class="d-d">{{waterDeviceSum.all}}</span>
                            </div>
                            <div class="sumc-left">
                                <span class="d-t">正常 <b>{{waterDeviceSum.normal}}</b></span>
                                <br/>
                                <span class="d-t" style="margin-top:28px;">停用 <b>{{waterDeviceSum.discontinuation}}</b></span>
                            </div>
                        </div>
                        <div class="sumc">
                            <div class="sumc-left">
                                <span class="d-t">电表数</span>
                                <br/>
                                <span class="d-d">{{electricDeviceSum.all}}</span>
                            </div>
                            <div class="sumc-left">
                                <span class="d-t">正常 <b>{{electricDeviceSum.normal}}</b></span>
                                <br/>
                                <span class="d-t" style="margin-top:28px;">停用 <b>{{electricDeviceSum.discontinuation}}</b></span>
                            </div>
                        </div>
                    </div>
                </el-col>
                <el-col :xs="24" :sm="8" :lg="8" class="grid-col">
                    <weather></weather>
                </el-col>
                <el-col :xs="24" :sm="8" :lg="8" class="grid-col">
                    <div class="grid-box border-box">
                        <div class="border-title">用水监控曲线</div>
                        <div class="content-box">
                            <charts v-bind="chartsOption1"></charts>
                        </div>
                    </div>
                </el-col>
                <el-col :xs="24" :sm="8" :lg="8" class="grid-col">
                    <div class="grid-box border-box">
                        <div class="border-title">用电监控曲线</div>
                        <div class="content-box">
                            <charts v-bind="chartsOption2"></charts>
                        </div>
                    </div>
                </el-col>
                <el-col :xs="24" :sm="8" :lg="8" class="grid-col">
                    <div class="grid-box border-box">
                        <div class="border-title">异常仪表数</div>
                        <div class="content-box meter-content">
                            <div class="meter">
                                <i class="el-icon-waterIco" style="color:#4CD7EB;"></i>
                                <br/>
                                <span>异常水仪表</span>
                                <br/>
                                <span>{{waterDeviceSum.abnormal}}</span>
                            </div>
                            <div class="meter">
                                <i class="el-icon-electricityIco" style="color:#FFBE10;"></i>
                                <br/>
                                <span>异常电仪表</span>
                                <br/>
                                <span>{{electricDeviceSum.abnormal}}</span>
                            </div>
                        </div>
                    </div>
                </el-col>
                <el-col :xs="24" :sm="8" :lg="8" class="grid-col">
                    <div class="grid-box border-box">
                        <div class="border-title">用水监控饼图</div>
                        <div class="content-box">
                            <pie-charts v-bind="chartsOption3" graphicText="用水监控" :clickable="true" @callback="waterCallback"></pie-charts>
                        </div>
                    </div>
                </el-col>
                <el-col :xs="24" :sm="8" :lg="8" class="grid-col">
                    <div class="grid-box border-box">
                        <div class="border-title">用电监控饼图</div>
                        <div class="content-box">
                            <pie-charts v-bind="chartsOption4" graphicText="用电监控" :clickable="true" @callback="electricCallback"></pie-charts>
                        </div>
                    </div>
                </el-col>
                <el-col :xs="24" :sm="8" :lg="8" class="grid-col">
                    <el-row class="panel-group" :gutter="16">
                        <el-col :xs="12" :sm="12" :lg="12" class="grid-col">
                            <div class="grid-mini-box border-box">
                                <div class="card">
                                    <div class="card-text">水耗同比</div>
                                    <div class="card-num text_overflow" :title="waterUseData.tb + '%'">{{waterUseData.tb}}%</div>
                                    <div class="card-img">
                                        <i v-if="waterUseData.tb > 0" class="el-icon-arrTop" style="color:#29C958;"></i>
                                        <i v-else-if="waterUseData.tb == 0">--</i>
                                        <i v-else class="el-icon-arrDown" style="color:#FF0000;"></i>
                                    </div>
                                </div>
                            </div>
                        </el-col>
                        <el-col :xs="12" :sm="12" :lg="12" class="grid-col">
                            <div class="grid-mini-box border-box">
                                <div class="card">
                                    <div class="card-text">水耗环比</div>
                                    <div class="card-num text_overflow" :title="waterUseData.hb + '%'">{{waterUseData.hb}}%</div>
                                    <div class="card-img">
                                        <i v-if="waterUseData.hb > 0" class="el-icon-arrTop" style="color:#29C958;"></i>
                                        <i v-else-if="waterUseData.hb == 0">--</i>
                                        <i v-else class="el-icon-arrDown" style="color:#FF0000;"></i>
                                    </div>
                                </div>
                            </div>
                        </el-col>
                        <el-col :xs="12" :sm="12" :lg="12" class="grid-col" style="margin-bottom:0;">
                            <div class="grid-mini-box border-box">
                                <div class="card">
                                    <div class="card-text">电耗同比</div>
                                    <div class="card-num text_overflow" :title="electricUseData.tb + '%'">{{electricUseData.tb}}%</div>
                                    <div class="card-img">
                                        <i v-if="electricUseData.tb > 0" class="el-icon-arrTop" style="color:#29C958;"></i>
                                        <i v-else-if="electricUseData.tb == 0">--</i>
                                        <i v-else class="el-icon-arrDown" style="color:#FF0000;"></i>
                                    </div>
                                </div>
                            </div>
                        </el-col>
                        <el-col :xs="12" :sm="12" :lg="12" class="grid-col" style="margin-bottom:0;">
                            <div class="grid-mini-box border-box">
                                <div class="card">
                                    <div class="card-text">电耗环比</div>
                                    <div class="card-num text_overflow" :title="electricUseData.hb + '%'">{{electricUseData.hb}}%</div>
                                    <div class="card-img">
                                        <i v-if="electricUseData.hb > 0" class="el-icon-arrTop" style="color:#29C958;"></i>
                                        <i v-else-if="electricUseData.hb == 0">--</i>
                                        <i v-else class="el-icon-arrDown" style="color:#FF0000;"></i>
                                    </div>
                                </div>
                            </div>
                        </el-col>
                    </el-row>

                </el-col>
            </el-row>
        </div>
        <div class="copyright">Copyright © 2019 江苏鸿鹄电子科技有限公司</div>
    </div>
</template>

<script>
    import charts from './charts';
    import pieCharts from './pieCharts';
    import weather from '@/components/weather.vue';
    import { getWaterInfo,getElectricInfo } from '@/views/api/dustHome.js';
    
    export default {
        name: 'home',
        components: {
            charts,
            weather,
            pieCharts
        },
        data() {
            return {
                //用水监测曲线
                chartsOption1: {
                    x: [],
                    y: [],
                    lineColor: '#53c5ff',
                    areaColor: '#c8f4ff'
                },
                //用电监测曲线
                chartsOption2: {
                    x: [],
                    y: [],
                    lineColor: '#ffd16c',
                    areaColor: '#ffeab2'
                },
                //用水监控饼图
                chartsOption3: {
                    color:['#2E95FF','#01C8DD','#A4E7FF'],
                    data:[]
                },
                //用电监控饼图
                chartsOption4: {
                    color:['#FFD460','#FFBA00'],
                    data:[]
                },
                //电表数 
                electricDeviceSum:{},
                //水表数 
                waterDeviceSum:{},
                //电同比  环比
                electricUseData:{},
                //水同比  环比
                waterUseData:{},
                //星期数据
                weekData:{
                    "Monday":"周一",
                    "Tuesday":"周二",
                    "Wednesday":"周三",
                    "Thursday":"周四",
                    "Friday":"周五",
                    "Saturday":"周六",
                    "Sunday":"周日",
                },
                waterData:{},
                electricData:{}
            };
        },
        computed:{
            total(){
                return (this.waterDeviceSum.all  + this.electricDeviceSum.all) || '' ;
            }
        },
        methods:{
            getLineData(arr){
                let obj = {
                    x:[],
                    y:[]
                };
                arr.forEach(el => {
                    obj.y.push(el.amount);
                    let d = this.$moment(parseInt(el.name)).format('YYYY-MM-DD');
                    // d = this.weekData[d];
                    obj.x.push(d);
                });
                return obj;
            },
            getPieData(arr){
                let a = [];
                arr.forEach(el=>{
                    let obj = {
                        value:el.amount,
                        name:el.name
                    }
                    a.push(obj);
                });
                return a;
            },
            waterCallback(param){
                let data = this.waterData;
                let o1 = [];
                if(param.name){                   
                    if(param.name=='生活用水'){
                        o1 = this.getLineData(data.lineDataSh || []);                     
                    }else if(param.name=='生产用水'){
                        o1 = this.getLineData(data.lineDataSc || []);
                    }else if(param.name=='消防用水'){
                        o1 = this.getLineData(data.lineDataXf || []);
                    }
                }else{
                    o1 = this.getLineData(data.lineData || []);
                }
                this.chartsOption1 = Object.assign(this.chartsOption1,o1);
            },
            electricCallback(param){
                let data = this.electricData;
                let o1 = [];
                if(param.name){                   
                    if(param.name=='生活用电'){
                        o1 = this.getLineData(data.lineDataSh || []);                     
                    }else if(param.name=='生产用电'){
                        o1 = this.getLineData(data.lineDataSc || []);
                    }
                }else{
                    o1 = this.getLineData(data.lineData || []);
                }
                this.chartsOption2 = Object.assign(this.chartsOption2,o1);
            }
        },
        created(){
            //电
            getElectricInfo({orgId:sessionStorage.getItem('orgId')}).then(data=>{
                this.electricData = data;
                this.electricDeviceSum = data.deviceSum;
                this.electricUseData = data.useData;
                let o1 = this.getLineData(data.lineData || []);
                this.chartsOption2 = Object.assign(this.chartsOption2,o1);
                let o2 = this.getPieData(data.pieData || []);
                this.chartsOption4.data = o2;
            });
            //水
            getWaterInfo({orgId:sessionStorage.getItem('orgId')}).then(data=>{
                this.waterData = data;
                this.waterDeviceSum = data.deviceSum;
                this.waterUseData = data.useData;
                let o1 = this.getLineData(data.lineData || []);
                this.chartsOption1 = Object.assign(this.chartsOption1,o1);
                let o2 = this.getPieData(data.pieData || []);
                this.chartsOption3.data = o2;

            });
        },
        mounted() {}
    };
</script>


<style lang="scss">
    .hydropower-home-container {
        height: 100%;
        .home-box {
            padding: 10px;
            position: absolute;
            width: 100%;
            height: 100%;
            padding-bottom: 30px;
            overflow-y: auto;
            .hydropower-summary {
                &::before {
                    content: ' ';
                    display: inline-block;
                    width: 100%;
                    height: 4px;
                    position: absolute;
                    left: 0;
                    top: 0;
                    background-color: #00beda;
                }
                display: flex;
                .sumc {
                    width:33.33%;
                    border-right:#F5F7F8 solid 1px;
                    &:nth-child(3) {
                        border:none;
                        .sumc-left {
                            .d-d {
                                color: #FFBA00;
                            } 
                        }
                    }
                    display: flex;
                    text-align: center;
                    .sumc-left {
                        flex-grow: 1;
                        span {
                            display: inline-block;
                        }
                        .d-t {
                            font-size: 14px;
                            margin-top: 55px;
                        }
                        .d-d {
                            font-size: 30px;
                            color: #0071AC;
                            margin-top: 20px;
                        }
                    }
                    &:nth-child(2) {
                        .sumc-left {
                            .d-d {
                                color: #01C8DD;
                            } 
                        }
                    }

                    .sumc-right {
                        flex-grow:1;
                        svg {
                            font-size: 70px;
                            margin-top: 55px;
                            color: #0071AC;
                        }
                    }
                }
            }
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

            .grid-box {
                height: 300px;
                display: flex;
                flex-direction: column;

                .content-box {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                }

                .meter-content {
                    flex-direction: row;
                    align-items: center;
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

            .card {
                height: 100%;
                color: #000;
                display: flex;
                flex-direction: column;
                justify-content: center;
                text-indent: 20px;
                .card-text {
                    font-size: 14px;
                    margin-bottom: 10px;
                    color:#777;
                }



                .card-num {
                    font-size: 20px;
                    font-size: 40px;
                    font-weight: 700;
                }

                .text_overflow { 
                    width:130px; 
                    // white-space:nowrap; 
                    // text-overflow:ellipsis; 
                    // overflow:hidden;
                }

                .card-img {
                    display: flex;
                    align-items: center;
                    width: 80px;
                    height: 80px;
                    font-size: 22px;
                    position: absolute;
                    right: 10px;
                    top: 31px;
                    text-align: center;
                }
                @media (max-width: 1600px) {
                    .card-img {
                        text-indent: 40px;
                    }
                }
            }

            @media (max-width:1400px){
                .card {
                    text-indent: 0;
                }
            }
        }

        .meter {
            box-sizing: border-box;
            width: 50%;
            height: 80%;
            text-align: center;
            &:first-child {
                border-right:#F1F4F4 solid 1px;
            }
            i {
                font-size: 80px;
            }
            span:nth-child(3) {
                display: inline-block;
                font-size: 14px;
                margin-top: 20px;
            }
            span:nth-child(5) {
                display: inline-block;
                font-size: 40px;
                margin-top: 20px;
                font-weight: 700;
                color: #000;
            }
        }
    }



</style>
<template>
    <div class="home-sjj-container">
        <div class="home-box">
            <el-row class="panel-group" :gutter="16">
                <el-col :xs="24" :sm="8" :lg="8" class="grid-col">
                    <div class='card-panel card-panel-swiper'>
                        <div class="row-select">
                            <el-select v-model="deviceNo" @change="handleChangeDevice" placeholder="请选择">
                                <el-option v-for="(item,k) in deviceOptions" :label="item.deviceNo" :value="item.deviceNo" :key="k"></el-option>
                            </el-select>
                        </div>
                        <div class="circle-box sjj-bg">
                            <div class="sjj-box" :style="{top:bottonDetail.currentHeight+'px'}"></div>
                        </div>


                    </div>

                </el-col>
                <el-col :xs="24" :sm="8" :lg="8" class="grid-col">
                    <div class='card-panel card-panel-swiper'>
                        <div class="tower-title2">当前升降机信息</div>
                        <div class="td-text-box">
                            <div class="td-title">
                                <span class="t1">{{deviceDetail.deviceNo}}</span>
                                <span v-if="deviceDetail.status === 1" class="t2">在线</span>
                                <span v-if="deviceDetail.status === 0" class="t2 t2-2">离线</span>
                            </div>
                            <ul>
                                <li>
                                    <span v-if="deviceDetail.standardHeight" class="ts1">{{deviceDetail.standardHeight}}</span>
                                    <span v-else class="ts1">无数据</span>
                                    <span class="ts2">总高(m)</span> 
                                </li>
                                <li>
                                    <span v-if="deviceDetail.maxWeight" class="ts1">{{deviceDetail.maxWeight}}</span>
                                    <span v-else class="ts1">无数据</span>
                                    <span class="ts2">载重(吨)</span> 
                                </li>
                            </ul>
                        </div>
                        <div class="circle-text">
                            <div class="circle-text-li">
                                <span>司机姓名</span>{{bottonDetail.dirverName}}
                            </div>
                            <div class="circle-text-li">
                                <span>司机电话</span>{{bottonDetail.dirverPhone}}
                            </div>
                            <div class="circle-text-li">
                                <span>司机编号</span>{{bottonDetail.driver}}
                            </div>
                            <div class="circle-text-li">
                                <span>作业证号</span>{{bottonDetail.dirverCertificateNo}}
                            </div>
                        </div>
                        <p style="text-align:center;margin-top:150px;">数据发送时间 {{moment(bottonDetail.createTime).format('YYYY-MM-DD HH:mm')}}</p>
                    </div>

                </el-col>
                <el-col :xs="24" :sm="8" :lg="8" class="grid-col">
                    <weather></weather>

                    <div class="grid-box border-box" style=" margin-top:16px; height:434px;">
                        <div class="content-box">
                                <div class="box-text-all">
                                    <div class="box-text">
                                        <p class="bt1">黑匣子编号</p>
                                        <p class="bt2">{{deviceDetail.deviceNo}}</p>
                                    </div>
                                    <div class="box-text">
                                        <p class="bt1">黑匣子品牌</p>
                                        <p class="bt2">{{deviceDetail.manufactor}}</p>
                                    </div>
                                    <div class="box-text box-text2">
                                        <p class="bt1">GPRS</p>
                                        <p class="bt2">{{deviceDetail.gprs}}</p>
                                    </div>
                                    <div class="box-text box-text2">
                                        <p class="bt1">备案编号</p>
                                        <p class="bt2">{{deviceDetail.identifier}}</p>
                                    </div>
                                </div>
                        </div>
                    </div>
                </el-col>
            </el-row>

            <el-row class="box-for-swiper">
                <swiper class="card-swiper" :options="swiperOption">
                    <swiper-slide class="card-slide">
                        <div class="panel-group slide-box">
                            <div class="grid-box border-box" style="height:188px;">
                                <div class="content-box">
                                    <div class="slide-svg">
                                        <svg class="icon" aria-hidden="true">
                                            <use xlink:href="#el-icon-icon-life-alarm-copy"></use>
                                        </svg>
                                    </div>
                                    <span class="slide-s1">报警</span>
                                    <span v-if="bottonDetail.alarm || bottonDetail.alarm === 0" class="slide-s2">{{bottonDetail.alarm}}次</span>
                                    <span v-else class="slide-s2">无数据</span>
                                </div>
                            </div>
                        </div>
                    </swiper-slide>
                    <swiper-slide class="card-slide">
                        <div class="panel-group slide-box">
                            <div class="grid-box border-box" style="height:188px;">
                                <div class="content-box">
                                    <div class="slide-svg">
                                        <svg class="icon" aria-hidden="true">
                                            <use xlink:href="#el-icon-qianmen"></use>
                                        </svg>
                                    </div>
                                    <span class="slide-s1">前门</span>
                                    <span v-if="bottonDetail.frontDoorStatus == 0" class="slide-s2">关</span>
                                    <span v-else-if="bottonDetail.frontDoorStatus == 1" class="slide-s2">开</span>
                                    <span v-else class="slide-s2">无数据</span>
                                </div>
                            </div>
                        </div>
                    </swiper-slide>
                    <swiper-slide class="card-slide">
                        <div class="panel-group slide-box">
                            <div class="grid-box border-box" style="height:188px;">
                                <div class="content-box">
                                    <div class="slide-svg">
                                        <svg class="icon" aria-hidden="true">
                                            <use xlink:href="#el-icon-houmen"></use>
                                        </svg>
                                    </div>
                                    <span class="slide-s1">后门</span>
                                    <span v-if="bottonDetail.backDoorStatus == 0" class="slide-s2">关</span>
                                    <span v-else-if="bottonDetail.backDoorStatus == 1" class="slide-s2">开</span>
                                    <span v-else class="slide-s2">无数据</span>
                                </div>
                            </div>
                        </div>
                    </swiper-slide>
                    <swiper-slide class="card-slide">
                        <div class="panel-group slide-box">
                            <div class="grid-box border-box" style="height:188px;">
                                <div class="content-box">
                                    <div class="slide-svg">
                                        <svg class="icon" aria-hidden="true">
                                            <use xlink:href="#el-icon-yujing"></use>
                                        </svg>
                                    </div>
                                    <span class="slide-s1">预警</span>
                                    <span v-if="bottonDetail.earlyWarning || bottonDetail.earlyWarning === 0" class="slide-s2">{{bottonDetail.earlyWarning}}次</span>
                                    <span v-else class="slide-s2">无数据</span>
                                </div>
                            </div>
                        </div>
                    </swiper-slide>
                    <swiper-slide class="card-slide">
                        <div class="panel-group slide-box">
                            <div class="grid-box border-box" style="height:188px;">
                                <div class="content-box">
                                    <div class="slide-svg">
                                        <svg class="icon" aria-hidden="true">
                                            <use xlink:href="#el-icon-gaodu1"></use>
                                        </svg>
                                    </div>
                                    <span class="slide-s1">高度</span>
                                    <span v-if="bottonDetail.height || bottonDetail.height === 0" class="slide-s2">{{bottonDetail.height}}m</span>
                                    <span v-else class="slide-s2">无数据</span>
                                </div>
                            </div>
                        </div>
                    </swiper-slide>
                    <swiper-slide class="card-slide">
                        <div class="panel-group slide-box">
                            <div class="grid-box border-box" style="height:188px;">
                                <div class="content-box">
                                    <div class="slide-svg">
                                        <svg class="icon" aria-hidden="true">
                                            <use xlink:href="#el-icon-xingzhuang8"></use>
                                        </svg>
                                    </div>
                                    <span class="slide-s1">运行速度</span>
                                    <span v-if="bottonDetail.speed || bottonDetail.speed === 0" class="slide-s2">{{bottonDetail.speed}}m/s</span>
                                    <span v-else class="slide-s2">无数据</span>
                                </div>
                            </div>
                        </div>
                    </swiper-slide>
                    <swiper-slide class="card-slide">
                        <div class="panel-group slide-box">
                            <div class="grid-box border-box" style="height:188px;">
                                <div class="content-box">
                                    <div class="slide-svg">
                                        <svg class="icon" aria-hidden="true">
                                            <use xlink:href="#el-icon-toubudaohang-gongrenguanli"></use>
                                        </svg>
                                    </div>
                                    <span class="slide-s1">人数</span>
                                    <span v-if="bottonDetail.people || bottonDetail.people === 0" class="slide-s2">{{bottonDetail.people}}人</span>
                                    <span v-else class="slide-s2">无数据</span>
                                </div>
                            </div>
                        </div>
                    </swiper-slide>
                    <swiper-slide class="card-slide">
                        <div class="panel-group slide-box">
                            <div class="grid-box border-box" style="height:188px;">
                                <div class="content-box">
                                    <div class="slide-svg">
                                        <svg class="icon" aria-hidden="true">
                                            <use xlink:href="#el-icon-zhongliang"></use>
                                        </svg>
                                    </div>
                                    <span class="slide-s1">重量</span>
                                    <span v-if="bottonDetail.weight || bottonDetail.weight === 0" class="slide-s2">{{bottonDetail.weight}}吨</span>
                                    <span v-else class="slide-s2">无数据</span>
                                </div>
                            </div>
                        </div>
                    </swiper-slide>
                    <!-- <div class="swiper-button-prev" slot="button-prev">
                        <div class="img"></div>
                    </div>
                    <div class="swiper-button-next" slot="button-next">
                        <div class="img"></div>
                    </div> -->
                </swiper>
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
    import { getLiftList,getLiftDetail,getLiftAlarmCount } from '@/views/api/dustHome.js';
    import { Loading } from 'element-ui';
    export default {
        name: 'towerhome',
        components: {
            weather,
            swiper,
            swiperSlide
        },
        data() {
            return {
                loading:null,
                //选中设备
                deviceNo:'',
                projectId:'',
                swiperOption: {
                    slidesPerView: 'auto',
                    spaceBetween: 16,
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev'
                    }
                },
                //选中设备
                deviceNo:'',
                projectId:'',
                deviceOptions:[],
                //下面一排数据
                bottonDetail:{
                    currentHeight:270
                },
                //设备详情
                deviceDetail:{
                    
                }
            };
        },
        methods:{
            //打开loading
            openLoading(){
                this.loading = Loading.service({
                    lock: true,
                    text: '加载中……',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
            },
            //关闭loading
            closeLoading(){
                if(this.loading){
                    this.loading.close();
                    this.loading = null;
                }
            },
            handleChangeDevice(v){
                let o = this.deviceOptions.find((obj)=>{
                    return obj.deviceNo == v;
                });
                this.projectId = o.projectId;
                this.deviceDetail = o;
                this.bottonDetail = {};
                this.deviceNo = o.deviceNo;
                this.handelGetBotton();
            },
            //获取下面一排数据
            handelGetBotton(){
                if(!this.loading){
                    this.openLoading();
                }
                let aa = getLiftDetail({orgId:sessionStorage.getItem('orgId'),deviceNo:this.deviceNo});
                let bb = getLiftAlarmCount({orgId:sessionStorage.getItem('orgId'),deviceNo:this.deviceNo});

                let p = Promise.all([aa,bb]);
                p.then(([d1,d2])=>{
                    let data1 = d1.data || {};
                    this.bottonDetail = data1;
                    if(this.deviceDetail.standardHeight && this.bottonDetail.height){
                        let bfb = (this.bottonDetail.height / this.deviceDetail.standardHeight).toFixed(2);
                        this.bottonDetail.currentHeight = parseInt(270 * (1 - bfb));
                    }
                    let data2 = d2.data || {};
                    this.bottonDetail.alarm = data2.alarm;
                    this.bottonDetail.earlyWarning = data2.earlyWarning;
                    this.$forceUpdate();
                    this.closeLoading();
                }).catch(error=>{
                    this.closeLoading();
                });
            }
        },
        created(){
            let orgId = sessionStorage.getItem('orgId');
            // 升降机 默认第1个
            this.openLoading();
            getLiftList({orgId}).then((data)=>{
                if(data.data && data.data.deviceList && data.data.deviceList.length > 0){
                    this.deviceOptions = data.data.deviceList;
                    this.deviceNo = this.deviceOptions[0].deviceNo;
                    this.projectId = this.deviceOptions[0].projectId;
                    this.deviceDetail = this.deviceOptions[0];
                    this.handelGetBotton();
                }
                else{
                    this.closeLoading(); 
                }
            }).catch(error=>{
                this.closeLoading();
            });
        },
        mounted() {

            
        }
    };
</script>

<style lang="scss">
    .home-sjj-container {
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
        .box-for-swiper {
            // background: #FFF;
            height: 188px;
            // margin-top: 16px;
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
        .box-text-all {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            height: 100%;
            .box-text {
                width: 50%;
                height: 50%;
                box-sizing: border-box;
                padding-top: 80px;
                text-align: center;
                .bt1 {
                    color:#666;
                }
                .bt2 {
                    font-weight: 600;
                    color: #555;
                    font-size: 14px;
                }
            }
            .box-text2 {
                padding-top: 30px;
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

        .panel-group .card-panel-swiper {
            // margin-bottom: 16px;
            height: 630px;
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
            .tower-title2 {
                height: 40px;
                line-height: 40px;
                margin:4px 0;
                overflow: hidden;
                color: #333;
                font-weight: 600;
            }
            .circle-box {
                position: relative;
                width: 100%;
                height: 358px;
                margin-top: 80px;
            }
            .sjj-bg {
                background-image: url('~@/assets/image/sjj1.png');
                background-position: center center;
                background-repeat: no-repeat;
                .sjj-box {
                    position: absolute;
                    left:50%;
                    margin-left: -51.5px;
                    top:0;
                    width: 103px;
                    height: 85px;
                    background-image: url('~@/assets/image/sjj2.png');
                    background-repeat: no-repeat;
                }
            }
            .circle-text {
                width: 100%;
                padding-left: 12%;
                margin-top: 100px;
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

        .card-swiper {
            height: 100%;
        }

        .card-slide {
            height: 100%;
            width: 15%;
            border: #E9EEEF solid 1px;
            box-sizing: border-box;
            // padding-right: 30px;

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
                background-image: url('data:image/png;base64,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');
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
                background-image: url('data:image/png;base64,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');
                background-size: 15px;
                background-color: #f5f5f5;
                background-repeat: no-repeat;
                background-position: center;
            }
        }

        .td-text-box {
            margin-top: 100px;
            .td-title {
                padding-left: 12%;
                .t1 {
                    font-size: 16px;
                    font-weight: 700;
                }
                .t2 {
                    margin-left: 5px;
                    display: inline-block;
                    padding: 3px 5px 0;
                    background-color: #00b034;
                    border-radius: 2px;
                    font-size: 12px;
                    color: #fff;
                }
                .t2-2 {
                    background-color: #666;
                }
            }
            ul {
                margin-bottom: 20px;
                margin-top: 20px;
                padding-left:12%;
                box-sizing: border-box;
            }
            li {
                display: inline-block;
                width: 49%;
                span {
                    display: block;
                }
                .ts1 {
                    font-size: 16px;
                    color:#555;
                    font-weight: 400;
                    margin-bottom: 10px;
                }
                .ts2 {
                    margin-bottom: 10px;
                }
            }
        }
    }



















</style>
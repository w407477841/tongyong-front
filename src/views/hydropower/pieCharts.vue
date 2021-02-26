<template>
    <div class="charts" ref="charts"></div>
</template>

<script>
    import _ from 'lodash';
    export default {
        data() {
            return {
                charts: null
            };
        },
        props: {
            color: {
                type: Array,
                default () {
                    return [];
                }
            },
            data: {
                type: Array,
                default () {
                    return [];
                }
            },
            graphicText:{
                type:String,
                default () {
                    return '';
                }
            },
            clickable:{
                type:Boolean,
                default () {
                    return false;
                }
            }
        },
        watch: {
            data: function () {
                this.setCharts();
            }
        },
        mounted() {
            let _this = this;
            setTimeout(() => {
                _this.charts = _this.$echarts.init(_this.$refs.charts);
                _this.setCharts();
                addEventOnResize(() => {
                    _this.charts.resize();
                });
            }, 0);
            this.$nextTick().then(() => {});
        },
        methods: {
            getLegendData(){
                if(this.data.length == 0){ return [];}
                let arr = this.data.map(el => {
                    return el.name;
                });
                return arr;
            },
            setCharts() {
                let _this = this;
                this.charts.setOption({
                    color:_this.color,
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b}: {c} ({d}%)"
                    },
                    graphic: {
                        type: "text",
                        left: "center",
                        top: "center",
                        style: {
                            text: _this.graphicText,
                            fill: "#000",
                            textAlign: "center",
                            fontSize: "12px"
                        },
                        onclick:(param)=>{
                            if(_this.clickable){
                                _this.$emit('callback', param);
                            }
                        }
                    },
                    legend: {
                        orient: 'horizontal',
                        bottom:0,
                        icon: "pin",
                        data: _this.getLegendData()
                    },
                    series: [{
                        name: '用途',
                        type: 'pie',
                        radius: ['35%', '55%'],
                        avoidLabelOverlap: true,
                        label: {
                            normal: {
                                show: true,
                                position: 'outside'
                            },
                            // emphasis: {
                            //     show: true,
                            //     textStyle: {
                            //         fontSize: '30',
                            //         fontWeight: 'bold'
                            //     }
                            // },
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: "rgba(0, 0, 0, 0.5)"
                            }
                        },
                        labelLine: {
                            normal: {
                                show: true
                            }
                        },
                        data:_this.data,
                        // legendHoverLink: false
                    }]
                });
                if(_this.clickable){
                    _this.charts.on("click",function(param){
                        _this.$emit('callback', param);
                    });
                }
                
                
            }
        }
    };
</script>

<style lang="scss" scoped>
    .charts {
        height: 100%;
        width: 100%;
    }
</style>
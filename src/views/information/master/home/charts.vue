<template>
    <div class="charts" ref="charts"></div>
</template>

<script>
    export default {
        data() {
            return {
                charts: null
            };
        },
        props: {
            x: {
                type: Array,
                default () {
                    return [];
                }
            },
            y: {
                type: Array,
                default () {
                    return [];
                }
            },
            lineColor: {
                type: String,
                default () {
                    return '#53c5ff';
                }
            },
            areaColor: {
                type: String,
                default () {
                    return '#c8f4ff';
                }
            },
        },
        watch: {
            x: function () {
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
            setCharts() {
                let _this = this;
                this.charts.setOption({
                    grid: {
                        left: '20',
                        right: '15',
                        bottom: '10',
                        top: '40',
                        containLabel: true
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross'
                        },
                        padding: [5, 10]
                    },
                    xAxis: {
                        type: 'category',
                        axisLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            color: '#999999'
                        },
                        splitLine: {
                            show: false
                        },
                        data: _this.x
                    },
                    color: [_this.lineColor],
                    yAxis: [{
                        type: 'value',
                        name:'ug/m³        ',
                        nameTextStyle:{
                            color: '#999999'
                        },
                        splitLine: {
                            show: false
                        },
                        axisLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            color: '#999999'
                        }
                    }],
                    series: [{
                        type: 'line',
                        smooth: true,
                        itemStyle: {
                            normal: {
                                lineStyle: {
                                    color: _this.lineColor
                                }
                            }
                        },
                        areaStyle: {
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [{
                                        offset: 0,
                                        color: _this.areaColor // 0% 处的颜色
                                    },
                                    {
                                        offset: 1,
                                        color: '#fff' // 100% 处的颜色
                                    }
                                ],
                                globalCoord: false // 缺省为 false
                            }
                        },
                        symbol: 'none',
                        data: _this.y
                    }]
                });
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
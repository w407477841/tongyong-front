<template>
    <div>
        <el-button v-if="hasMonitorStatus" type="primary" plain size="small" @click="monitorStatus">监控状态</el-button>
        <el-button v-if="hasOperationData" type="primary" plain size="small" @click="operationData">运行数据</el-button>
        <el-button v-if="hasRunningTime" type="primary" plain size="small" @click="runningTime">运行时间</el-button>
        <el-button v-if="hasWorkRecord" type="primary" plain size="small" @click="workRecord">工作记录</el-button>
        <el-button v-if="hasEarlyWarningInfo" type="primary" plain size="small" @click="earlyWarningInfo">预警信息</el-button>
        <el-button v-if="hasWarningInfo" type="primary" plain size="small" @click="warningInfo">报警信息</el-button>
        <el-button v-if="hasIllegalInfo" type="primary" plain size="small" @click="illegalInfo">违章信息</el-button>

  
   
   
    </div>
</template>

<script>
    export default {
        data() {
            return {};
        },
        props: {
            hasMonitorStatus: {
                type: Boolean,
                default: function () {
                    return true;
                }
            },
            hasOperationData: {
                type: Boolean,
                default: function () {
                    return true;
                }
            },
            hasRunningTime: {
                type: Boolean,
                default: function () {
                    return true;
                }
            },
            hasWorkRecord: {
                type: Boolean,
                default: function () {
                    return true;
                }
            },
            hasEarlyWarningInfo: {
                type: Boolean,
                default: function () {
                    return true;
                }
            },
            hasWarningInfo: {
                type: Boolean,
                default: function () {
                    return true;
                }
            },
            hasIllegalInfo: {
                type: Boolean,
                default: function () {
                    return true;
                }
            },
            operationPrex: String,
            row: Object
        },
        computed: {
        },
        methods: {
            monitorStatus() {
                this.$emit('monitorStatus', this.row);
            },
            operationData() {
                this.$emit('operationData', this.row);
            },
            runningTime() {
                this.$emit('runningTime', this.row);
            },
            workRecord() {
                this.$emit('workRecord', this.row);
            },
            earlyWarningInfo() {
                this.$emit('earlyWarningInfo', this.row);
            },
            warningInfo() {
                this.$emit('warningInfo', this.row);
            },
            warningMessage() {
                this.$emit('warningMessage', this.row);
            },
            illegalInfo() {
                this.$emit('illegalInfo', this.row);
            },
        }
    };
</script>

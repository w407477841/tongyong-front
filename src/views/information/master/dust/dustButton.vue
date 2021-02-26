<template>
    <div>
        <el-button v-if="hasMonitorStatus" type="primary" plain size="mini" @click="monitorStatus">监控状态</el-button>
        <el-button v-if="hasOperationData" type="primary" plain size="mini" @click="operationData">运行数据</el-button>
        <el-button v-if="hasWarningMessage" type="primary" plain size="mini" @click="warningMessage">报警信息</el-button>
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
            hasWarningMessage: {
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
            warningMessage() {
                this.$emit('warningMessage', this.row);
            },
        }
    };
</script>

<template>
    <el-dialog width="80%" :title="title" :visible.sync="dialogVisible" append-to-body :close-on-click-modal="false">
        <div class="details-container">
            <div class="container-box details-box">
                <div class="details-body">
                    <el-tabs type="border-card" style="height:100%">
                        <el-tab-pane label="基本信息">
                            <el-form size="small" :label-width="labelWidth" :model="formDatas" :rules="formDatasRules"
                                     ref="editForm">
                                <el-row>
                                    <el-col :xs="24" :sm="8" :md="8" style="height: 50px;">
                                        <el-form-item label="规格型号" prop="specification">
                                            <el-input v-model="formDatas.specification" :disabled="edit" :maxlength="20"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :xs="24" :sm="8" :md="8" style="height: 50px;">
                                        <el-form-item label="制造厂家" prop="manufactor">
                                            <el-input v-model="formDatas.manufactor" :disabled="edit" :maxlength="20"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :xs="24" :sm="8" :md="8" style="height: 50px;">
                                        <el-form-item label="PM10 (μg/m³)" prop="pm10">
                                            <el-input v-model="formDatas.pm10" :disabled="edit" :maxlength="20"></el-input>
                                        </el-form-item>
                                    </el-col>

                                    <el-col :xs="24" :sm="8" :md="8" style="height: 50px;">
                                        <el-form-item label="PM2.5 (μg/m³)" prop="pm25">
                                            <el-input v-model="formDatas.pm25" :disabled="edit" :maxlength="20"></el-input>
                                        </el-form-item>
                                    </el-col>

                                    <el-col :xs="24" :sm="8" :md="8" style="height: 50px;">
                                        <el-form-item label="噪音（分贝）" prop="noise">
                                            <el-input v-model="formDatas.noise" :disabled="edit" :maxlength="20"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :xs="24" :sm="8" :md="8" style="height: 50px;">
                                        <el-form-item label="风速 (m/s)" prop="windSpeed">
                                            <el-input v-model="formDatas.windSpeed" :disabled="edit" :maxlength="20"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :xs="24" :sm="8" :md="8" style="height: 50px;">
                                        <el-form-item label="风向" prop="windDirection">
                                            <el-input v-model="formDatas.windDirection" :disabled="edit" :maxlength="20"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :xs="24" :sm="8" :md="8" style="height: 50px;">
                                        <el-form-item label="温度（℃)" prop="temperature">
                                            <el-input v-model="formDatas.temperature" :disabled="edit" :maxlength="20"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :xs="24" :sm="8" :md="8" style="height: 50px;">
                                        <el-form-item label="湿度(%rh)" prop="humidity">
                                            <el-input v-model="formDatas.humidity" :disabled="edit" :maxlength="20"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :xs="24" :sm="8" :md="8" style="height: 50px;">
                                        <el-form-item label="TSP (μg/m³)" prop="tsp">
                                            <el-input v-model="formDatas.tsp" :disabled="edit" :maxlength="20"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :xs="24" :sm="8" :md="8" style="height: 50px;">
                                        <el-form-item label="风力" prop="windForce">
                                            <el-input v-model="formDatas.windForce" :disabled="edit" :maxlength="20"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :xs="24" :sm="8" :md="8" style="height: 50px;">
                                        <el-form-item label="大气压 (pa)" prop="atmospheric">
                                            <el-input v-model="formDatas.atmospheric" :disabled="edit" :maxlength="20"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :xs="24" :sm="8" :md="8" style="height: 50px;">
                                        <el-form-item label="状态" prop="status">
                                            <el-input v-model="formDatas.status" :disabled="edit" :maxlength="20"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :xs="24" :sm="8" :md="8" style="height: 50px;">
                                        <el-form-item label="报警" prop="alarm">
                                            <el-input v-model="formDatas.alarm" :disabled="edit" :maxlength="20"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :xs="24" :sm="8" :md="8" style="height: 50px;">
                                        <el-form-item label="key1" prop="key1">
                                            <el-input v-model="formDatas.key1" :disabled="edit" :maxlength="20"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :xs="24" :sm="8" :md="8" style="height: 50px;">
                                        <el-form-item label="key2" prop="key2">
                                            <el-input v-model="formDatas.key2" :disabled="edit" :maxlength="20"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :xs="24" :sm="8" :md="8" style="height: 50px;">
                                        <el-form-item label="key3" prop="key3">
                                            <el-input v-model="formDatas.key3" :disabled="edit" :maxlength="20"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :xs="24" :sm="8" :md="8" style="height: 50px;">
                                        <el-form-item label="key4" prop="key4">
                                            <el-input v-model="formDatas.key4" :disabled="edit" :maxlength="20"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :xs="24" :sm="8" :md="8" style="height: 50px;">
                                        <el-form-item label="key5" prop="key5">
                                            <el-input v-model="formDatas.key5" :disabled="edit" :maxlength="20"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :xs="24" :sm="8" :md="8" style="height: 50px;">
                                        <el-form-item label="key6" prop="key6">
                                            <el-input v-model="formDatas.key6" :disabled="edit" :maxlength="20"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :xs="24" :sm="8" :md="8" style="height: 50px;">
                                        <el-form-item label="key7" prop="key7">
                                            <el-input v-model="formDatas.key7" :disabled="edit" :maxlength="20"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :xs="24" :sm="8" :md="8" style="height: 50px;">
                                        <el-form-item label="key8" prop="key8">
                                            <el-input v-model="formDatas.key8" :disabled="edit" :maxlength="20"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :xs="24" :sm="8" :md="8" style="height: 50px;">
                                        <el-form-item label="key9" prop="key9">
                                            <el-input v-model="formDatas.key9" :disabled="edit" :maxlength="20"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :xs="24" :sm="8" :md="8" style="height: 50px;">
                                        <el-form-item label="key10" prop="key10">
                                            <el-input v-model="formDatas.key10" :disabled="edit" :maxlength="20"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-form>
                        </el-tab-pane>
                    </el-tabs>
                </div>

                <div class="details-footer">
                    <el-button size="small" @click="handleCancel">取 消</el-button>
                    <el-button size="small" v-if="!edit" type="primary" @click="handleSubmit">保 存</el-button>
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<script>
    import {
        insertInfoApi,
        updateInfoApi,
        getInfoApi,
    } from "../../api/monitorDataModel.js";

    export default {
        data() {
            return {
                labelWidth: "150px",
                activeNames: [],
                formDatas: {},
                formDatasRules: {
                    specification: [
                        {required: true, message: "请输入规格型号", trigger: "blur"}
                    ],
                    manufactor: [
                        {required: true, message: "请输入制造厂家", trigger: "blur"}
                    ],
                },
                edit: false,
                title: "",
                dialogVisible: false
            };
        },
        props: {
            //dialog模式
            visible: {
                type: Boolean,
                default: function () {
                    return true;
                }
            },
            routeType: {
                type: String,
                default: function () {
                    return null;
                }
            },
            detailsId: {
                type: Number || String,
                default: function () {
                    return null;
                }
            }
        },
        watch: {
            //dialog模式
            routeType: {
                handler: function (val, oldVal) {
                    this.edit = false;
                    if (val == "insert") {
                        this.title = "新增";
                    } else if (val == "update") {
                        this.title = "编辑";
                    } else {
                        this.title = "查看";
                        this.edit = true;
                    }
                },
                immediate: true
            },
            visible: {
                handler: function (val, oldVal) {
                    this.dialogVisible = val;
                },
                immediate: true
            },
            dialogVisible(val) {
                if (!val) {
                    this.$emit("close", {});
                }
            }
        },
        computed: {
            params() {
                let param = {
                    body: this.formDatas
                };
                return param;
            }
        },
        mounted() {
            if (this.routeType == "view" || this.routeType == "update") {
                this.getInfo();
            }
            this.editFormRef = this.$refs.editForm;
        },
        methods: {
            //提交
            handleSubmit() {
                this.$refs.editForm.validate(valid => {
                    if (valid) {
                        this.$confirm("确认保存吗？", "提示", {
                            confirmButtonText: "确定",
                            cancelButtonText: "取消",
                            type: "warning"
                        }).then(() => {
                            let method;
                            if (this.routeType == "insert") {
                                method = insertInfoApi(this.params);
                            } else if (this.routeType == "update") {
                                this.params.body.id = this.detailsId;
                                method = updateInfoApi(this.params);
                            }
                            method.then(() => {
                                this.dialogVisible = false;
                            });
                            //判断类型弹出新增或编辑成功
                            if (this.routeType == "insert") {
                                this.$message({
                                    type: "success",
                                    message: "新增成功"
                                });
                            }
                            if (this.routeType == "update") {
                                this.$message({
                                    type: "success",
                                    message: "编辑成功"
                                });
                            }
                        });
                    }
                });
            },
            //取消
            handleCancel() {
                if (this.routeType == "view") {
                    this.dialogVisible = false; //dialog模式
                } else {
                    if (this.routeType == "insert") {
                        this.$confirm("新增内容将不被保存，是否确认取消？", "提示", {
                            confirmButtonText: "确定",
                            cancelButtonText: "取消",
                            type: "warning"
                        }).then(() => {
                            this.dialogVisible = false;
                        });
                    }
                    if (this.routeType == "update") {
                        this.$confirm("修改内容将不被保存，是否确认取消？", "提示", {
                            confirmButtonText: "确定",
                            cancelButtonText: "取消",
                            type: "warning"
                        }).then(() => {
                            this.dialogVisible = false;
                        });
                    }
                }
            },
            //单条
            getInfo() {
                let param = {
                    id: this.detailsId
                };
                getInfoApi(param).then(res => {
                    this.formDatas = res.data;
                });
            }
        }
    };
</script>

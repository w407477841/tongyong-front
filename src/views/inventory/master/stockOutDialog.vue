<!--
 * @Author: hjy
 * @CreateTime: 2018-09-08 22:30:40
 * @Desc: 安全帽出库详情
-->
<template>
    <el-dialog width="60%" :title="title" :visible.sync="outDialogVisible" :close-on-click-modal="false" append-to-body>
        <div class="details-container">
            <div class="container-box details-box">
                <div class="details-body">
                    <el-form size="small" :label-width="labelWidth" :model="formDatas" :rules="formDatasRules"
                             ref="editForm">
                        <el-collapse v-model="activeNames">
                            <el-collapse-item title="基本信息" name="1">
                                <el-row>
                                    <el-col :xs="24" :sm="12" :md="12" class="col-height">
                                        <el-form-item label="工程名称" prop="projectId">
                                            <el-select size="mini" v-model="formDatas.projectId" filterable clearable
                                                       placeholder="">
                                                <el-option v-for="item in projectList" :label="item.name"
                                                           :value="item.id"
                                                           :key="item.id"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-collapse-item>
                            <el-collapse-item title="备注信息" name="3">
                                <el-form-item label="备注" prop="comments">
                                    <el-input type="textarea" :rows="4" :maxlength="200"
                                              v-model="formDatas.comments"></el-input>
                                </el-form-item>
                            </el-collapse-item>
                        </el-collapse>
                    </el-form>
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
        stockOutApi,
        getProjectListApi
    }from '../api/inventory.js';

    export default {
        components: {},
        data() {
            return {
                labelWidth: '100px',
                activeNames: ['1', '2', '3'],
                formDatas: {},
                other: false,
                projectId: "",
                formDatasRules: {
                    projectId: {required: true, message: "请选择工程名称", trigger:"change" },
                },
                projectList: [],
                edit: false,
                //dialog模式
                title: '出库',
                deviceTypeValue:"",
                outDialogVisible: false,
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
            detailsIds: {
                default: function () {
                    return null;
                }
            },
            deviceType:{
                default: function () {
                    return null;
                }
            }
        },
        watch: {
            //dialog模式
            visible: {
                handler: function (val, oldVal) {
                    this.outDialogVisible = val;
                },
                immediate: true
            },
            detailsIds: {
                handler: function (val, oldVal) {
                    this.formDatas.deviceNo = val;
                },
                immediate: true
            },
            deviceType:{
                handler: function (val, oldVal) {
                    this.deviceTypeValue = val;
                },
                immediate: true
            },
            outDialogVisible(val) {
                if (!val) {
                    this.$emit('close', {});
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
            this.getProjectList();
        },
        methods: {
            //关闭
            handleCancel() {
                let message = "填写内容将不被保存，是否确认取消？";
                this.$confirm(message, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.outDialogVisible = false;
                }).catch(() => {
                });

            },
            //查询项目列表
            getProjectList() {
                getProjectListApi({}).then(res => {
                    this.projectList = res.data;
                });
            },
            //保存
            handleSubmit() {
                this.$refs.editForm.validate(valid => {
                    if (valid) {
                        this.$confirm('确认出库吗？', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.params.status = 0;
                            this.params.body.type = this.deviceTypeValue;
                            stockOutApi(this.params).then(res => {
                                if (res.success === true) {
                                    this.$message({message: res.message, type: "success"});
                                    this.outDialogVisible = false; //dialog模式
                                } else {
                                    this.$message({message: res.message, type: "error"});
                                }
                            });
                        });
                    }
                });
            }
        }
    };
</script>


<style lang="scss" scoped>
    .el-date-editor.el-input,
    .el-date-editor.el-input__inner {
        width: 100%;
    }

    .col-height {
        height: 50px;
    }
</style>

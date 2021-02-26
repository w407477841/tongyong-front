<!--
 * @Author: zhouyujie 
 * @CreateTime: 2018-09-08 22:30:40 
 * @Desc: 安全帽详情
-->
<template>
    <el-dialog width="80%" :title="title" :visible.sync="dialogVisible" :close-on-click-modal="false" append-to-body>
        <div class="details-container">
            <div class="container-box details-box">
                <div class="details-body">
                    <el-tabs type="border-card" style="height:100%" v-model="activeName2">
                        <el-tab-pane label="基本信息" name="first">
                            <el-form size="small" :label-width="labelWidth" :model="formDatas" :rules="formDatasRules"
                                     ref="editForm">
                                <el-collapse v-model="activeNames">
                                    <el-collapse-item title="基本信息" name="1">
                                        <el-row>
                                            <el-col :xs="24" :sm="12" :md="12" class="col-height">
                                                <el-form-item label="imei" prop="imei">
                                                    <el-input v-model="formDatas.imei" :disabled="edit"
                                                              :maxlength="20"></el-input>
                                                </el-form-item>
                                            </el-col>

                                            <el-col :xs="24" :sm="12" :md="12" class="col-height">
                                                <el-form-item label="名称" prop="name">
                                                    <el-input v-model="formDatas.name" :disabled="edit"
                                                              :maxlength="20"></el-input>

                                                </el-form-item>
                                            </el-col>
                                            <el-col :xs="24" :sm="12" :md="12" class="col-height">
                                                <el-form-item label="工程名称" prop="projectId">
                                                    <el-select v-model="formDatas.projectId" clearable
                                                               :disabled="edit" placeholder="请选择">
                                                        <el-option v-for="item in projectList" :label="item.name"
                                                                   :value="item.id" :key="item.id"></el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :xs="24" :sm="12" :md="12" class="col-height">
                                                <el-form-item label="证件类型" prop="idCardType">
                                                    <el-select v-model="formDatas.idCardType" clearable
                                                               :disabled="edit" placeholder="请选择">
                                                        <el-option v-for="item in idCardTypeList" :label="item.name"
                                                                   :value="item.id" :key="item.id"></el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :xs="24" :sm="12" :md="12" class="col-height">
                                                <el-form-item label="证件编号" prop="identifier">
                                                    <el-input v-model="formDatas.idCardNumber" :disabled="edit"
                                                              :maxlength="20"></el-input>
                                                </el-form-item>
                                            </el-col>
                                        </el-row>
                                    </el-collapse-item>
                                    <el-collapse-item title="备注信息" name="3" class="col-height">
                                        <el-col :xs="24" :sm="24" :md="24">
                                            <el-input type="textarea" v-model="formDatas.comments" :disabled="edit"
                                                      :rows="4" :maxlength="200"></el-input>
                                        </el-col>
                                    </el-collapse-item>
                                </el-collapse>
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
        getInfoApi,
        getProjectListApi,
        updateOrInsertProjectHelmet,
    } from '../../api/helmet.js';

    export default {
        components: {},
        data() {
            return {
                labelWidth: '100px',
                activeNames: ['1', '2', '3'],
                activeName2: "first",
                formDatas: {},
                other: false,
                idCardTypeList:[{"id":1,"name":"身份证"}],
                formDatasRules: {
                    /*projectId: [{required: true, message: '请选择工程名称', trigger: "change"}],*/
                    imei: [{required: true, message: '请输入黑匣子编号', trigger: "blur"}],
                },
                projectList: [],
                edit: false,
                //dialog模式
                title: '',
                dialogVisible: false,
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

            activeCode: {
                type: Number,
                default: function () {
                    return 0;
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
                    if (val === 'insert') {
                        this.title = '新增';
                    } else if (val === 'update') {
                        this.title = '编辑';
                    } else {
                        this.title = '查看';
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
                    this.activeName2 = "first";
                    this.$emit('close', {});
                }
            }
        },

        computed: {
            params() {
                let param = {
                    type:"",
                    body: this.formDatas
                };
                return param;
            }
        },
        mounted() {
            this.getOtherInfo();
            if (this.routeType === 'view' || this.routeType === 'update') {
                this.getInfo();
            }

        },
        methods: {
            //查询下拉框内容
            getOtherInfo() {
                getProjectListApi({}).then(res => {
                        this.projectList = res.data;
                    }
                );
            },
            //查询单条
            getInfo() {
                let param = {
                    id: this.detailsId
                };
                getInfoApi(param).then(res => {
                    this.formDatas = res.data;
                });
            },

            //关闭
            handleCancel() {
                let message;
                if (this.routeType === 'view') {
                    this.dialogVisible = false;
                } else {
                    if (this.routeType === 'insert') {
                        message = "新增内容将不被保存，是否确认取消？";
                    }
                    if (this.routeType === 'update') {
                        message = "修改内容将不被保存，是否确认取消？";
                    }
                    this.$confirm(message, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.dialogVisible = false;
                    }).catch(() => {
                    });
                }

            },
            //保存
            handleSubmit() {
                this.formDatas.createTime = "";
                this.$refs.editForm.validate(valid => {
                    if (valid) {
                        this.$confirm('确认保存吗？', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            if(this.routeType === 'insert'){
                                this.params.type="insert";
                            }else{
                                this.params.type="update";
                            }
                            updateOrInsertProjectHelmet(this.params).then(res => {
                                if (res.success === true) {
                                    this.$message({ message: res.message, type: "success" });
                                    this.dialogVisible = false; //dialog模式
                                } else {
                                    this.$message({ message: res.message, type: "error" });
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

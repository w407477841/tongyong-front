<!--
 * @Author: hjy
 * @CreateTime: 2018-09-08 22:30:40 
 * @Desc: 安全帽人员调拨
-->
<template>
    <el-dialog width="60%" :title="title" :visible.sync="putDialogVisible" :close-on-click-modal="false" append-to-body>
        <div class="details-container">
            <div class="container-box details-box">
                <div class="details-body">
                    <el-form size="small" :label-width="labelWidth" :model="formData" :rules="formDatasRules"
                             ref="editForm">
                        <el-collapse v-model="activeNames">
                            <el-collapse-item title="基本信息" name="1">
                                <el-row>
                                    <el-col :xs="24" :sm="12" :md="12" class="col-height">
                                        <el-form-item label="身份证号码" prop="idCardNumber">
                                            <el-input v-model="formData.idCardNumber"
                                                      :maxlength="18"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-collapse-item>
                            <el-collapse-item title="备注信息" name="3">
                                <el-form-item label="备注" prop="comments">
                                    <el-input type="textarea" :rows="4" :maxlength="200"
                                              v-model="formData.comments"></el-input>
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
        personTransfersApi
    } from '../../api/helmet.js';
    import {validatePhone,validateCard,validateName} from '@/utils/validate.js'
    export default {
        components: {},
        data() {
            let checkIdentityCode = (rule,value,callback) => {
                if(!validateCard(value)) {
                    return callback(new Error("请输入正确的身份证号"));
                }else {
                    return callback();
                }
            };
            return {
                labelWidth: '100px',
                activeNames: ['1', '2', '3'],
                formData: {},
                other: false,
                formDatasRules: {
                    /*projectId: [{required: true, message: '请选择工程名称', trigger: "change"}],*/
                    idCardNumber: [{required: true, message: '请输入身份证号码', trigger: "blur"},
                                            { validator: checkIdentityCode, trigger: 'blur' }
                    ],
                },
                projectList: [],
                edit: false,
                //dialog模式
                title: "人员调拨",
                putDialogVisible: false,
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
            detailIds: {
                default: function () {
                    return null;
                }
            }
        },
        watch: {
            //dialog模式
            visible: {
                handler: function (val, oldVal) {
                    this.putDialogVisible = val;
                },
                immediate: true
            },
            detailIds: {
                handler: function (val, oldVal) {
                    this.formData.id = val;
                    console.info(val);
                },
                immediate: true
            },
            putDialogVisible(val) {
                if (!val) {
                    this.$emit('close', {});
                }
            }
        },

        computed: {
            params() {
                let param = {
                    body: this.formData
                };
                return param;
            }
        },
        mounted() {

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
                    this.putDialogVisible = false;
                }).catch(() => {
                });

            },
            //保存
            handleSubmit() {
                this.$refs.editForm.validate(valid => {
                    if (valid) {
                        this.$confirm('确认将该安全帽进行调拨吗？', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            personTransfersApi(this.params).then(res => {
                                if (res.success === true) {
                                    this.$message({message: res.message, type: "success"});
                                    this.putDialogVisible = false; //dialog模式
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

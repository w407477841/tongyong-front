<template>
    <div class="details-container">
        <div class="container-box details-box">
            <div class="details-body">
                <el-tabs type="border-card" style="height:100%">
                    <el-tab-pane label="基本信息">
                        <el-form size="small" :label-width="labelWidth" :model="formDatas" :rules="formDatasRules" ref="editForm">
                            <el-row>
                                <el-col :xs="24" :sm="12" :md="12" class="itemHeight">
                                    <el-form-item label="姓名" prop="name">
                                        <el-input v-model="formDatas.name" :disabled="true" maxlength="50"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="24" :sm="12" :md="12" class="itemHeight">
                                    <el-form-item label="身份证号" prop="identityCode">
                                        <el-input v-model="formDatas.identityCode" :disabled="true" maxlength="50"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="24" :sm="12" :md="12" class="itemHeight">
                                    <el-form-item label="手机号码" prop="phone">
                                        <el-input v-model="formDatas.phone" :disabled="true" maxlength="50"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="24" :sm="12" :md="12" class="itemHeight">
                                    <el-form-item label="证书类型" prop="certificateType">
                                        <el-select v-model="formDatas.certificateType" :disabled="true" placeholder="证书类型" :clearable="true" :filterable="true" >
                                            <el-option v-for="item in certificateTypeList" :label="item.label" :value="item.value" :key="item.value"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="24" :sm="12" :md="12" class="itemHeight">
                                    <el-form-item label="证书名称" prop="certificateName">
                                        <el-input v-model="formDatas.certificateName" :disabled="true" maxlength="50"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="24" :sm="12" :md="12" class="itemHeight">
                                    <el-form-item label="证书编号" prop="certificateNo">
                                        <el-input v-model="formDatas.certificateNo" :disabled="true" maxlength="50"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="24" :sm="12" :md="12" class="itemHeight">
                                    <el-form-item label="开始日期" prop="beginDate">
                                        <el-date-picker v-model="formDatas.beginDate" :picker-options="beginPicker" :disabled="true" type="date" placeholder="选择日期" format="yyyy-MM-dd"></el-date-picker>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="24" :sm="12" :md="12" class="itemHeight">
                                    <el-form-item label="结束日期" prop="endDate">
                                        <el-date-picker v-model="formDatas.endDate" :picker-options="endPicker" :disabled="true" type="date" placeholder="选择日期" format="yyyy-MM-dd"></el-date-picker>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="24" :sm="12" :md="12" class="itemHeight">
                                    <el-form-item label="工程名称" prop="projectId">
                                        <el-select v-model="formDatas.projectId" placeholder="工程名称" :clearable="true" :filterable="true">
                                            <el-option v-for="item in projectList" :label="item.label" :value="item.value" :key="item.value"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="24" :sm="24" :md="24">
                                    <el-form-item label="备注">
                                        <el-input :disabled="true" v-model="formDatas.comments"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                    </el-tab-pane>
                </el-tabs>
            </div>

            <div class="details-footer">
                <el-button size="small" @click="handleCancel">取 消</el-button>
                <el-button size="small" type="primary" @click="handleSubmit">保 存</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import {updateUser,getUserById,selectProjectInfo,selectCetificateType} from '@/views/api/equipmentApi.js';
import uploadImage from '@/components/uploadImage';
export default {
  components: {
    uploadImage
  },
  data() {
    return {
      labelWidth: '150px',
      activeNames: [],
      formDatas: {
        name : '',
        identityCode : '',
        phone : '',
        certificateType : '',
        certificateName : '',
        certificateNo : '',
        beginDate : '',
        endDate : '',
        comments : '',
        status : 2,
        projectId : ''
      }, 
      formDatasRules: {
        projectId : [
          { required: true, message: '请选择工程名称', trigger: 'blur' }
        ]
      },
      projectList: [],
      certificateTypeList: []
    };
  },
  computed: {
    beginPicker() {
      let endTime = this.formDatas.endDate;
      return {
        disabledDate(time) {
          return time.getTime() > new Date(endTime);
        }
      };
    },
    endPicker() {
      let beginTime = this.$moment(this.formDatas.beginDate);
      return {
        disabledDate(time) {
          return time.getTime() < new Date(beginTime);
        }
      };
    },
    params() {
      let param = {
        body: this.formDatas
      };
      return param;
    }
  },
  mounted() {
    this.getInfo();
    this.selectProjectInfo();
    this.getCetificateType();
  },
  methods: {
    //打开页面时根据id查询数据给表单
    getInfo() {
      let param = {
        id: this.id
      };
      getUserById(param).then(res => {
        this.formDatas = res.data;
      });
    },
    //保存
    handleSubmit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm('确认保存吗？', '提示', {confirmButtonText: '确定',cancelButtonText: '取消',type: 'warning'}).then(() => {
            this.params.body.status = 2;
            updateUser(this.params).then((res) => {
              if(res.code == 200) {
                this.$message({
                  type : 'success',
                  message : res.message
                });
                this.$emit('setShow',{sign : "关闭加入项目"});
              }else {
                this.$message({
                  type : 'error',
                  message : res.message
                });
              }
            });
          });
        }
      });
    },
    //获取项目
    selectProjectInfo : function() {
      let para = {};
      selectProjectInfo(para).then((res) => {
        this.projectList = res.data;
      });
    },
    //取消
    handleCancel : function() {
      this.$confirm("修改内容将不被保存，是否确认取消？", "提示", {type: "warning"}).then(() => {
        this.$emit('setShow',{sign : '关闭加入项目'});
      });
    },
    //获取证书类型
    getCetificateType : function() {
      let para = {};
      selectCetificateType(para).then((res) => {
        this.certificateTypeList = res.data;
      });
    }
  },
  props : ['id']
};
</script>


<style lang="scss" scoped>
  .itemHeight {
    height : 50px
  }
</style>
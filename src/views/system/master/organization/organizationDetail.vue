<template>
    <div class="details-container">
        <div class="container-box details-box">
            <div class="details-body">
                <el-tabs type="border-card" style="height:100%">
                    <el-tab-pane label="基本信息">
                        <el-form size="small" :label-width="labelWidth" :model="formDatas" :rules="formDatasRules" ref="editForm">
                            <el-row>
                                <el-col :xs="24" :sm="24" :md="24">
                                    <el-form-item label="部门名称" prop="name">
                                        <el-input v-model="formDatas.name" :maxlength="20" auto-complete="off"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="24" :sm="24" :md="24">
                                    <el-form-item label="公司简介" prop="introduction">
                                        <el-input type="textarea" :rows="2" :maxlength="200" v-model="formDatas.introduction" auto-complete="off"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="24" :sm="24" :md="24">
                                    <el-form-item label="备注" prop="commonts">
                                        <el-input type="textarea" :rows="2" :maxlength="200" v-model="formDatas.commonts" auto-complete="off"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="24" :sm="24" :md="24" v-show="false">
                                    <el-form-item label="parentId">
                                        <el-input :rows="2" :maxlength="200" v-model="formDatas.parentId" auto-complete="off"></el-input>
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
import {insertOrganization} from '@/views/system/api/systemApi.js';

export default {
  components: {
  },
  data() {
    return {
      labelWidth : '150px',
      formDatas: {
        name : '',
        introduction : '',
        commonts : '',
        parentId : '',
        flag : 1,// 表示要显示的
        level : '',
        groupId : ''
      }, 
      formDatasRules: {
        name : [
          { required: true, message: '请输入部门名称', trigger: 'blur' }
        ]
      },
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

  },
  methods: {
    //保存
    handleSubmit() {
      this.formDatas.parentId = this.id;
      this.formDatas.groupId = this.groupId;
      this.formDatas.level = this.level;
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm('确认保存吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            insertOrganization(this.params).then((res) => {
              if(res.code == 200) {
                this.$message({
                  type : 'success',
                  message : res.message
                });
                this.$emit('setShow',{sign : '关闭部门信息'});
              }
            });
          });
        }
      });
    },
    //取消
    handleCancel : function() {
      this.$confirm("新增内容将不被保存，是否确认取消？", "提示", {type: "warning"}).then(() => {
        this.$emit('setShow',{sign : '关闭部门信息'});
      });
    }
  },
  props : ['id','groupId','level']
};
</script>


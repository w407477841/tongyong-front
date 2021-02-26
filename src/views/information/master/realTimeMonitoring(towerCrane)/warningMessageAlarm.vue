<template>
    <div class="details-container">
        <div class="container-box details-box">
            <div class="details-body">
                <el-tabs type="border-card" style="height:100%">
                    <el-tab-pane label="基本信息">
                        <el-form size="small" :label-width="labelWidth" :model="formDatas" :rules="formDatasRules" ref="editForm">
                            <el-row>
                                <el-col :xs="24" :sm="24" :md="24">
                                    <el-form-item label="短信模板" prop="model">
                                        <el-select v-model="formDatas.model" placeholder="短信模板" :clearable="true" :filterable="true" @change="setValue">
                                            <el-option v-for="item in modelList" :label="item.title" :value="item.id" :key="item.id"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="24" :sm="24" :md="24">
                                    <el-form-item label="内容" prop="content">
                                        <el-input type="textarea" v-model="formDatas.content" maxlength="200"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="12" :sm="12" :md="12">
                                    <el-form-item label="指定人" prop="relatedUser">
                                        <el-select v-model="formDatas.relatedUser" placeholder="指定人" :clearable="true" :filterable="true" multiple>
                                            <el-option v-for="item in relatedUserTypeList" :label="item.name" :value="item.id" :key="item.id"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                    </el-tab-pane>
                </el-tabs>
            </div>

            <div class="details-footer" stype="text-align : right">
                <el-button size="small" @click="cancel">取 消</el-button>
                <el-button size="small" type="primary" @click="handleSubmit">发 送</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import {insertMessage,selectUser,getMessModleListApi} from '@/views/api/equipmentApi.js';
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
        model : '',
        content : '',
        relatedUser : ''
      }, 
      formDatasRules: {
        model : [
          {required : true,message : '请选择短信模板',trigger : 'blur'}
        ],
        content : [
          {required : true,message : '请输入内容',trigger : 'blur'}
        ],
        relatedUser : [
          {required : true,message : '请选择指定人',trigger : 'blur'}
        ]
      },
      modelList: [],
      relatedUserTypeList : []
    };
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
    this.getInfo();
    this.getUserInfo();
    this.getMessageInfo();
  },
  methods: {
    //给内容赋值
    getInfo() {
      this.formDatas.content = this.content;
    },
    //发送
    handleSubmit() {
      this.$refs.editForm.validate(valid => {
        if(valid) {
          this.$confirm('确认发送吗？', '提示', {type : "warning"}).then(() => {
            this.formDatas.craneId = this.id;
            insertMessage(this.params).then((res) => {
              if(res.code == 200) {
                this.$message({
                  type : 'success',
                  message : res.message
                });
                this.$emit("setShow",{sign : '关闭信息'});
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
    //获取指定人
    getUserInfo : function() {
      let para = {};
      selectUser(para).then((res) => {
        this.relatedUserTypeList = res.data;
      });
    },
    //获取短信模板
    getMessageInfo : function() {
      getMessModleListApi({}).then((res) => {
        this.modelList = res.data;
      });
    },
    setValue : function(val) {
      if(this.formDatas.model == '') {
        this.formDatas.relatedUser = '';
      }else {
        for(let i = 0;i < this.modelList.length;i++) {
          if(val == this.modelList[i].id) {
            let data = this.modelList[i].relatedUser.split(",");
            let newDate = [];
            for(let j = 0;j < data.length;j++) {
              newDate[j] = Number(data[j]);
            }
            this.formDatas.relatedUser = newDate;
            return;
          }
        }
      }
    },
    cancel : function() {
      this.$confirm('新增内容将不被保存，确认取消吗？', '提示', {type : "warning"}).then(() => {
        this.$emit("setShow",{sign : '关闭信息'});
      });
    }
  },
  props : ['id','content']
};
</script>


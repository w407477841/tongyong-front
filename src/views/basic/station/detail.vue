<template>
    <div class="details-container">
        <div class="container-box details-box">
            <div class="details-body">
                <el-tabs type="border-card" style="height:100%">
                    <el-tab-pane label="基本信息">
                        <el-form size="small" :label-width="labelWidth" :model="formDatas" :rules="formDatasRules" ref="editForm">
                            <el-row>
                                    <el-col :xs="24" :sm="12" :md="12" class="itemHeight">
                                        <el-form-item label="站点名称" prop="name">
                                            <el-input v-model="formDatas.name" :disabled="edit" maxlength="20"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :xs="24" :sm="12" :md="12" class="itemHeight">
                                        <el-form-item label="地址" prop="address">
                                            <el-input v-model="formDatas.address" :disabled="edit" maxlength="20"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :xs="24" :sm="12" :md="12" class="itemHeight">
                                        <el-form-item label="坐标" prop="coordinate">
                                            <el-input v-model="formDatas.coordinate" :disabled="edit" maxlength="20" id="lnglat">
                                              <el-button slot="append" type="primary" @click="open" icon="el-icon-location">打开地图</el-button>
                                            </el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :xs="24" :sm="12" :md="12" class="itemHeight">
                                        <el-form-item label="物业" prop="orgId">
                                          <el-select v-model="formDatas.orgId" filterable clearable :disabled="edit" placeholder="请选择">
                                            <el-option v-for="item in orgSelect" :label="item.name" :value="item.id" :key="item.id">
                                            </el-option>
                                          </el-select>
                                        </el-form-item>
                                    </el-col>
                                <el-col :xs="24" :sm="24" :md="24">
                                    <el-form-item label="备注" prop="comments">
                                        <el-input :disabled="edit" type="textarea" v-model="formDatas.comments" maxlength="200"></el-input>
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

        <el-dialog title="站点地址" :visible.sync="mapVisible" append-to-body :close-on-click-modal="false" width="80%" v-if="mapVisible">
          <map-baidu @setShow="setShow" :isClose="isClose"></map-baidu>
        </el-dialog>
    </div>
</template>

<script>
import {insertBasicStation,updateBasicStation,getBasicStationById,getOrgInfo} from './api.js';
import {validatePhone,validateCard,validateName} from '@/utils/validate.js';
import MapBaidu from './mapBaidu';

export default {
  components: {
  },
  data() {
    let checkPhone = (rule,value,callback) => {
      if(!validatePhone(value)) {
        return callback(new Error("请输入正确的手机号"));
      }else {
        return callback();
      }
    };
    let checkIdentityCode = (rule,value,callback) => {
      if(!validateCard(value)) {
        return callback(new Error("请输入正确的身份证号"));
      }else {
        return callback();
      }
    };
    let checkName = (rule,value,callback) => {
      if(validateName(value)) {
        return callback(new Error("姓名只能输入汉字、英文字母、数字和点"));
      }else {
        return callback();
      }
    };
    return {
      labelWidth : '150px',
      orgSelect: [],
      mapVisible : false,
      isClose : true,
      formDatas: {
        name : null,
        address : null,
        coordinate : null,
        comments : null,
        orgId : null,
      }, 
      formDatasRules: {
          name : [
              { required: true, message: '请输入站点名称', trigger: 'blur' }
          ],
          address : [
              { required: true, message: '请输入地址', trigger: 'blur' }
          ],
          coordinate : [
              { required: true, message: '请输入坐标', trigger: 'blur' }
          ],
          orgId : [
              { required: true, message: '请选择物业', trigger: 'blur' }
          ],
      }
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
    //获取物业名称
    getOrgInfo().then(res => {
      this.orgSelect = res.data;
    });

    if (
      this.openType == 'view' ||
      this.openType == 'update'
    ) {
      this.getInfo();
    }
  },
  methods: {
    open() {
      this.mapVisible = true
    },
    //打开页面时根据id查询数据给表单
    getInfo() {
      let param = {
        id: this.id
      };
      getBasicStationById(param).then(res => {
        this.formDatas = res.data;
      });
    },
    //保存
    handleSubmit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm('确认保存吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let method;
            if (this.openType == 'insert') {
              method = insertBasicStation(this.params);
            } else if (this.openType == 'update') {
              method = updateBasicStation(this.params);
            }
            method.then((res) => {
              if(res.code == 200) {
                this.$message({
                  type : 'success',
                  message : res.message
                });
                this.$emit('setShow',{});
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
    //取消
    handleCancel : function() {
      let msg = "";
      if (this.openType == "insert") {
        msg = "新增内容将不被保存，是否确认取消？";
      }
      if (this.openType == "update") {
        msg = "修改内容将不被保存，是否确认取消？";
      }
      if (this.openType == "view") {
        this.$emit('setShow',{});
        return;
      }
      this.$confirm(msg, "提示", {type: "warning"}).then(() => {
        this.$emit('setShow',{});
      });
    },
    //子组件向父组件传值
    setShow : function(data) {
        this.formDatas.coordinate = data.data.point.lng + "," + data.data.point.lat; 
        this.mapVisible = false;
    }
  },
  components : {
    MapBaidu
  },
  props : ['edit','openType','id']
};
</script>
<style lang="scss" scoped>
  .itemHeight {
    height : 50px
  }
</style>

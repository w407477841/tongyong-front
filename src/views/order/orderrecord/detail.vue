<template>
    <div class="details-container">
        <div class="container-box details-box">
            <div class="details-body">
                <el-tabs type="border-card" style="height:100%">
                    <el-tab-pane label="基本信息">
                        <el-form size="small" :label-width="labelWidth" :model="formDatas" :rules="formDatasRules" ref="editForm">
                            <el-row>
                                    <el-col :xs="24" :sm="12" :md="12" class="itemHeight">
                                        <el-form-item label="系统订单编号" prop="orderNo">
                                            <el-input v-model="formDatas.orderNo" :disabled="edit" maxlength="20"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :xs="24" :sm="12" :md="12" class="itemHeight">
                                        <el-form-item label="微信订单号" prop="wxOrderNo">
                                            <el-input v-model="formDatas.wxOrderNo" :disabled="edit" maxlength="20"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :xs="24" :sm="12" :md="12" class="itemHeight">
                                        <el-form-item label="设备号" prop="deviceNo">
                                            <el-input v-model="formDatas.deviceNo" :disabled="edit" maxlength="20"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :xs="24" :sm="12" :md="12" class="itemHeight">
                                        <el-form-item label="插头号" prop="plugNo">
                                            <el-input v-model="formDatas.plugNo" :disabled="edit" maxlength="20"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :xs="24" :sm="12" :md="12" class="itemHeight">
                                        <el-form-item label="卡号" prop="cardNo">
                                            <el-input v-model="formDatas.cardNo" :disabled="edit" maxlength="20"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :xs="24" :sm="12" :md="12" class="itemHeight">
                                        <el-form-item label="手机号" prop="phone">
                                            <el-input v-model="formDatas.phone" :disabled="edit" maxlength="20"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :xs="24" :sm="12" :md="12" class="itemHeight">
                                        <el-form-item label="订单标记" prop="orderTag">
                                            <el-select v-model="formDatas.orderTag" :disabled="edit" maxlength="20">
                                                <el-option v-for="item in orderTagStatus" :label="item.name" :value="item.id" :key="item.id">
                                                  </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :xs="24" :sm="12" :md="12" class="itemHeight">
                                        <el-form-item label="单价元/小时" prop="price">
                                            <el-input v-model="formDatas.price" :disabled="edit" maxlength="20"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :xs="24" :sm="12" :md="12" class="itemHeight">
                                        <el-form-item label="小时数" prop="hourage">
                                            <el-input v-model="formDatas.hourage" :disabled="edit" maxlength="20"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :xs="24" :sm="12" :md="12" class="itemHeight">
                                        <el-form-item label="合计" prop="amount">
                                            <el-input v-model="formDatas.amount" :disabled="edit" maxlength="20"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :xs="24" :sm="12" :md="12" class="itemHeight">
                                        <el-form-item label="订单状态" prop="status">
                                            <el-select v-model="formDatas.status" :disabled="edit" maxlength="20">
                                                <el-option v-for="item in orderStatus" :label="item.name" :value="item.id" :key="item.id">
                                                  </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :xs="24" :sm="12" :md="12" class="itemHeight">
                                        <el-form-item label="指令状态" prop="cmdStatus">
                                            <el-select v-model="formDatas.cmdStatus" :disabled="edit" maxlength="20">
                                                <el-option v-for="item in cmdStatusSelect" :label="item.name" :value="item.id" :key="item.id">
                                                  </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :xs="24" :sm="12" :md="12" class="itemHeight">
                                        <el-form-item label="支付时间" prop="payTime">
                                            <!-- <el-input v-model="formDatas.payTime" :disabled="edit" maxlength="20"></el-input> -->
                                            <el-date-picker v-model="formDatas.payTime" type="datetime" :disabled="edit||openType == 'update'" value-format="yyyy-MM-dd HH:mm:ss" maxlength="20" ></el-date-picker>
                                            
                                        </el-form-item>
                                    </el-col>
                                    <el-col :xs="24" :sm="12" :md="12" class="itemHeight">
                                        <el-form-item label="指令下发时间" prop="cmdSendTime">
                                            <!-- <el-input v-model="formDatas.cmdSendTime" :disabled="edit" maxlength="20"></el-input> -->
                                            <el-date-picker v-model="formDatas.cmdSendTime" type="datetime" :disabled="edit||openType == 'update'" value-format="yyyy-MM-dd HH:mm:ss" maxlength="20" ></el-date-picker>
                                           
                                        </el-form-item>
                                    </el-col>
                                    <el-col :xs="24" :sm="12" :md="12" class="itemHeight">
                                        <el-form-item label="指令回复时间" prop="cmdReplyTime">
                                            <!-- <el-input v-model="formDatas.cmdReplyTime" :disabled="edit" maxlength="20"></el-input> -->
                                            <el-date-picker v-model="formDatas.cmdReplyTime" type="datetime" :disabled="edit||openType == 'update'" value-format="yyyy-MM-dd HH:mm:ss" maxlength="20" ></el-date-picker>
                                           
                                        </el-form-item>
                                    </el-col>
                                    <el-col :xs="24" :sm="12" :md="12" class="itemHeight">
                                        <el-form-item label="充电开始时间" prop="chargingStartTime">
                                            <!-- <el-input v-model="formDatas.chargingStartTime" :disabled="edit" maxlength="20"></el-input> -->
                                            <el-date-picker v-model="formDatas.chargingStartTime" type="datetime" :disabled="edit||openType == 'update'" value-format="yyyy-MM-dd HH:mm:ss" maxlength="20" ></el-date-picker>
                                           
                                          </el-form-item>
                                    </el-col>
                                    <el-col :xs="24" :sm="12" :md="12" class="itemHeight">
                                        <el-form-item label="充电结束时间" prop="chargingEndTime">
                                            <!-- <el-input v-model="formDatas.chargingEndTime" :disabled="edit" maxlength="20"></el-input> -->
                                            <el-date-picker v-model="formDatas.chargingEndTime" type="datetime" :disabled="edit||openType == 'update'" value-format="yyyy-MM-dd HH:mm:ss" maxlength="20" ></el-date-picker>
                                           
                                        </el-form-item>
                                    </el-col>
                                    <el-col :xs="24" :sm="12" :md="12" class="itemHeight">
                                        <el-form-item label="充电状态" prop="chargingStatus">
                                            <el-select v-model="formDatas.chargingStatus" :disabled="edit" maxlength="20">
                                                <el-option v-for="item in chargingSelect" :label="item.name" :value="item.id" :key="item.id">
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
    </div>
</template>

<script>
import {insertOrderRecord,updateOrderRecord,getOrderRecordById} from './api.js';
import {validatePhone,validateCard,validateName} from '@/utils/validate.js'

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
      orderTagStatus:[{ "name": "微信支付", "id": 0 }, { "name": "刷卡支付", "id": 1 }, { "name": "余额支付", "id": 2 }],
      cmdStatusSelect: [{ "name": "未下发", "id": 0 }, { "name": "已下发", "id": 1 }, { "name": "成功", "id": 2 },{ "name": "失败", "id": 3 }],
      orderStatus: [{ "name": "取消支付", "id": 0 }, { "name": "支付成功", "id": 1 }, { "name": "支付失败", "id": 2 }, { "name": "未操作", "id": 3 }],
      chargingSelect:[{ "name": "未开始", "id": 0 }, { "name": "充电中", "id": 1 }, { "name": "充电结束", "id": 2 }],
      formDatas: {
        orderNo : null,
        wxOrderNo : null,
        deviceNo : null,
        plugNo : null,
        cardNo : null,
        phone : null,
        orderTag : null,
        price : null,
        hourage : null,
        amount : null,
        status : null,
        cmdStatus : null,
        comments : null,
        payTime : null,
        cmdSendTime : null,
        cmdReplyTime : null,
        chargingStartTime : null,
        chargingEndTime : null,
        chargingStatus : null,
      }, 
      formDatasRules: {
          orderNo : [
              { required: true, message: '请输入系统订单编号', trigger: 'blur' }
          ],
          wxOrderNo : [
              { required: true, message: '请输入微信订单号', trigger: 'blur' }
          ],
          deviceNo : [
              { required: true, message: '请输入设备号', trigger: 'blur' }
          ],
          plugNo : [
              { required: true, message: '请输入插头号', trigger: 'blur' }
          ],
          cardNo : [
              { required: true, message: '请输入', trigger: 'blur' }
          ],
          phone : [
              { required: true, message: '请输入', trigger: 'blur' }
          ],
          orderTag : [
              { required: true, message: '请输入订单标记(1 ：微信支付，2刷卡支付,3余额支付)', trigger: 'blur' }
          ],
          price : [
              { required: true, message: '请输入单价元/小时', trigger: 'blur' }
          ],
          hourage : [
              { required: true, message: '请输入小时数', trigger: 'blur' }
          ],
          amount : [
              { required: true, message: '请输入合计', trigger: 'blur' }
          ],
          status : [
              { required: true, message: '请输入订单状态（0取消支付，1支付成功，2支付失败,3 未操作）', trigger: 'blur' }
          ],
          cmdStatus : [
              { required: true, message: '请输入指令状态(0:未下发，1:已下发，2：成功，3：失败)', trigger: 'blur' }
          ],
          comments : [
              { required: true, message: '请输入备注', trigger: 'blur' }
          ],
          payTime : [
              { required: true, message: '请输入支付时间', trigger: 'blur' }
          ],
          cmdSendTime : [
              { required: true, message: '请输入指令下发时间', trigger: 'blur' }
          ],
          cmdReplyTime : [
              { required: true, message: '请输入指令回复时间', trigger: 'blur' }
          ],
          chargingStartTime : [
              { required: true, message: '请输入', trigger: 'blur' }
          ],
          chargingEndTime : [
              { required: true, message: '请输入', trigger: 'blur' }
          ],
          chargingStatus : [
              { required: true, message: '请输入充电状态（0未开始 1充电中，2充电结束）', trigger: 'blur' }
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
    if (
      this.openType == 'view' ||
      this.openType == 'update'
    ) {
      this.getInfo();
    }
    
  },
  methods: {
    //打开页面时根据id查询数据给表单
    getInfo() {
      let param = {
        id: this.id
      };
      getOrderRecordById(param).then(res => {
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
              method = insertOrderRecord(this.params);
            } else if (this.openType == 'update') {
              method = updateOrderRecord(this.params);
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
    }
  },
  props : ['edit','openType','id']
};
</script>
<style lang="scss" scoped>
  .itemHeight {
    height : 50px
  }
</style>

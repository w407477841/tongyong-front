<template>
  <div class="details-container">
    <div class="container-box details-box">
      <div class="details-body">
        <el-tabs type="border-card" style="height:100%">
          <el-tab-pane label="基本信息">
            <el-form size="small" :label-width="labelWidth" :model="formDatas" :rules="formDatasRules" ref="editForm">
              <el-row>
                <el-col :xs="24" :sm="12" :md="12" class="itemHeight">
                  <el-form-item label="所属站点" prop="stationId">
                    <el-select v-model="formDatas.stationId" filterable clearable :disabled="edit" placeholder="请选择">
                      <el-option v-for="item in stationSelect" :label="item.name" :value="item.id" :key="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" class="itemHeight">
                  <el-form-item label="桩名称" prop="name">
                    <el-input v-model="formDatas.name" :disabled="edit||openType == 'update'"  maxlength="20"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" class="itemHeight">
                  <el-form-item label="设备号" prop="deviceNo">
                    <el-input v-model="formDatas.deviceNo" :disabled="edit" maxlength="20"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" class="itemHeight">
                  <el-form-item label="单价(元/小时)" prop="price">
                    <el-input v-model="formDatas.price" :disabled="edit" maxlength="20"></el-input>
                  </el-form-item>
                </el-col>

                <el-col :xs="24" :sm="12" :md="12" class="itemHeight">
                  <el-form-item label="状态" prop="status">
                    <el-select v-model="formDatas.status" filterable clearable :disabled="edit" placeholder="请选择">
                      <el-option v-for="item in statusSelect" :label="item.name" :value="item.id" :key="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :xs="24" :sm="12" :md="12" class="itemHeight">
                  <el-form-item label="在线" prop="online">
                    <el-select v-model="formDatas.online" filterable clearable :disabled="edit" placeholder="请选择">
                      <el-option v-for="item in onlineSelect" :label="item.name" :value="item.id" :key="item.id">
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
  import { insertBasicPile, updateBasicPile, getBasicPileById,getStationInfo} from './api.js';
  import { validatePhone, validateCard, validateName } from '@/utils/validate.js'

  export default {
    components: {
    },
    data() {
      return {
        labelWidth: '150px',
        statusSelect: [{ "name": "正常", "id": 0 }, { "name": "报警", "id": 1 }, { "name": "维修中", "id": 2 }],
        onlineSelect: [{ "name": "离线", "id": 0 }, { "name": "在线", "id": 1 }],
        stationSelect: [],
        formDatas: {
          stationId: [],
          name: null,
          deviceNo: null,
          price: null,
          status: null,
          online: null,
          comments: null,
        },
        formDatasRules: {
          stationId: [
            { required: true, message: '请输入', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请输入', trigger: 'blur' }
          ],
          deviceNo: [
            { required: true, message: '请输入', trigger: 'blur' }
          ],
          price: [
            { required: true, message: '请输入', trigger: 'blur' }
          ],
          status: [
            { required: true, message: '请输入', trigger: 'blur' }
          ],
          online: [
            { required: true, message: '请输入', trigger: 'blur' }
          ]

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
      //获取站点名称
      getStationInfo().then(res => {
      this.stationSelect = res.data;
    });

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
        getBasicPileById(param).then(res => {
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
                method = insertBasicPile(this.params);
              } else if (this.openType == 'update') {
                method = updateBasicPile(this.params);
              }
              method.then((res) => {
                if (res.code == 200) {
                  this.$message({
                    type: 'success',
                    message: res.message
                  });
                  this.$emit('setShow', {});
                } else {
                  this.$message({
                    type: 'error',
                    message: res.message
                  });
                }
              });
            });
          }
        });
      },
      //取消
      handleCancel: function () {
        let msg = "";
        if (this.openType == "insert") {
          msg = "新增内容将不被保存，是否确认取消？";
        }
        if (this.openType == "update") {
          msg = "修改内容将不被保存，是否确认取消？";
        }
        if (this.openType == "view") {
          this.$emit('setShow', {});
          return;
        }
        this.$confirm(msg, "提示", { type: "warning" }).then(() => {
          this.$emit('setShow', {});
        });
      }
    },
    props: ['edit', 'openType', 'id']
  };
</script>
<style lang="scss" scoped>
  .itemHeight {
    height: 50px
  }
</style>
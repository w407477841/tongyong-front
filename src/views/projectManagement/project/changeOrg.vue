<template>
  <div class="details-container">
    <div class="container-box details-box">
      <div class="details-body">
        <el-form
          size="small"
          :label-width="labelWidth"
          :model="formDatas"
          :rules="formDatasRules"
          ref="editForm"
        >
          <el-row>
            <el-col :xs="24" :sm="24" :md="24" class="itemHeight">
              <el-form-item label="组织部门" prop="orgId">
                <el-cascader
                  :options="orgIdList"
                  v-model="formDatas.orgId"
                  :props="builderProps"
                  :change-on-select="true"
                ></el-cascader>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <div class="details-footer">
        <el-button size="small" @click="handleCancel">取 消</el-button>
        <el-button size="small" type="primary" @click="handleSubmit">保 存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { changeOrg, selectOrganizationInfo } from "@/views/api/equipmentApi.js";
export default {
  data() {
    return {
      labelWidth: "80px",
      formDatas: {
        id: "",
        orgId: []
      },
      formDatasRules: {
        orgId: [{ required: true, message: "请选择组织部门", trigger: "blur" }]
      },
      orgIdList: [],
      builderProps: {
        value: "id",
        label: "name",
        children: "children"
      }
    };
  },
  mounted() {
    this.getOrg();
  },
  methods: {
    //保存
    handleSubmit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm("确认保存吗？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            let param = {
              ids: this.ids,
              body: {
                id: this.formDatas.id,
                orgId: this.formDatas.orgId[this.formDatas.orgId.length - 1]
              }
            };
            changeOrg(param).then(res => {
              if (res.code == 200) {
                this.$message({
                  type: "success",
                  message: res.message
                });
                this.$emit("setShow", { sign: "关闭修改组织" });
              } else {
                this.$message({
                  type: "error",
                  message: res.message
                });
              }
            });
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //获取施工单位
    getOrg: function() {
      let para = {};
      selectOrganizationInfo(para).then(res => {
        let jsonStr = JSON.stringify(res.data);
        jsonStr = jsonStr.replace(/"children":\[],/g, "");
        let data = JSON.parse(jsonStr);
        this.orgIdList = data;
      });
    },
    //取消
    handleCancel: function() {
      this.$confirm("修改内容将不被保存，是否确认取消？", "提示", {
        type: "warning"
      }).then(() => {
        this.$emit("setShow", { sign: "关闭修改组织" });
      });
    }
  },
  props: ["ids"]
};
</script>

<style lang="scss" scoped>
.itemHeight {
  height: 50px;
}
</style>


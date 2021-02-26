<template>
  <div>
    <el-button size="small" v-if="hasCancel" @click="handleCancel">取 消</el-button>
    <el-button size="small" v-if="!edit && hasSubmit" type="primary" @click="handleSubmit">保 存</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      edit: this.$route.query.type == 'view' ? true : false
    };
  },
  props: {
    editFormRef: {
      default: function() {
        return null;
      }
    },
    hasCancel:{
      type: Boolean,
      default: function() {
        return true;
      }
    },
    hasSubmit:{
      type: Boolean,
      default: function() {
        return true;
      }
    }
  },
  computed: {},
  methods: {
    handleCancel() {
      let title = '';
      if (this.$route.query.type == 'insert') {
        title = '新增'
      } else if (this.$route.query.type == 'update') {
        title = '修改'
      } else if (this.$route.query.type == 'view') {
        this.$router.back();
        return;
      }
      this.$confirm(title+'内容将不被保存,是否确认取消?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$router.back();
        });
    },
    handleSubmit() {
      this.editFormRef.validate(valid => {
        if (valid) {
          this.$confirm('确认保存吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$emit('clickSubmit', {});
          });
        }
      });
    }
  }
};
</script>

<template>
    <div>
        <el-button v-if="validateOperation('delete') && hasDelete" type="danger" plain size="small" icon="el-icon-delete"
                   @click="handleDelete">删除</el-button>
        <el-button v-if="validateOperation('upgrade') && hasUpgrade" type="primary" plain size="small"
                   icon="el-icon-setting" @click="handleUpgrade">升级</el-button>
    </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    hasDelete: {
      type: Boolean,
      default: function() {
        return true;
      }
    },
    hasUpgrade: {
      type: Boolean,
      default: function() {
        return true;
      }
    },
    operationPrex: String,
    row: Object
  },
  computed: {},
  methods: {
    handleDelete() {
      this.$emit("handleDelete", this.row);
    },
    handleUpgrade() {
      this.$emit("handleUpgrade", this.row);
    }
  }
};
</script>

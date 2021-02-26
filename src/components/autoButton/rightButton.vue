<!--
 * @Author: pangyu 
 * @CreateTime: 2018-08-28 15:03:40 
 * @Desc: 右侧查看编辑删除按钮组 
-->
<template>
  <div>
    <slot></slot>
    <el-button v-if="validateOperation('view') && hasView" type="primary" plain size="small" icon="el-icon-search" @click="handleView">查看</el-button>
    <el-button v-if="validateOperation('update') && hasUpdate" :disabled="disUpdate" type="success" plain size="small" icon="el-icon-edit" @click="handleUpdate">编辑</el-button>
    <el-button v-if="validateOperation('delete') && hasDelete" :disabled="disDelete" type="danger" plain size="small" icon="el-icon-delete" @click="handleDelete">删除</el-button>
    <el-button v-if="validateOperation('putIn') && hasPutIn" type="primary" plain size="small" icon="el-icon-plus" @click="putInProject">加入项目</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    hasView: {
      type: Boolean,
      default: function() {
        return true;
      }
    },
    hasUpdate: {
      type: Boolean,
      default: function() {
        return true;
      }
    },
    hasDelete: {
      type: Boolean,
      default: function() {
        return true;
      }
    },
    hasPutIn: {
      type: Boolean,
      default: function() {
        return false;
      }
    },
     disUpdate: {
      type: Boolean,
      default: function() {
        return false;
      }
    },
    disDelete: {
      type: Boolean,
      default: function() {
        return false;
      }
    },
    operationPrex: String,
    row: Object
  },
  computed: {

  },
  methods: {
    //查看
    handleView() {
      this.$emit("clickView", this.row);
    },
    //编辑
    handleUpdate() {
      this.$emit("clickUpdate", this.row);
    },
    //删除
    handleDelete() {
      this.$emit("clickDelate", [this.row]);
    },
    putInProject() {
      this.$emit('clickPutIn', this.row);
    }
  }
};
</script>

<template>
    <div>
        <el-button v-if="hasViewDetails" type="primary" plain size="mini" @click="viewDetails">查看详情</el-button>
        <el-button v-if="hasSMSRemind" type="primary" plain size="mini" @click="SMSRemind">短信提醒</el-button>
    </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    hasViewDetails: {
      type: Boolean,
      default: function() {
        return true;
      }
    },
    hasSMSRemind: {
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
    viewDetails() {
      this.$emit("viewDetails", this.row);
    },
    SMSRemind() {
      this.$emit("SMSRemind", this.row);
    }
  }
};
</script>

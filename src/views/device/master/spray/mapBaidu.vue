<!--
 * @Author: zhouyujie 
 * @CreateTime: 2018-09-08 22:32:08 
 * @Desc:百度地图 
-->
<template>
<el-dialog title="工程地点" :visible.sync="dialogVisable"  :close-on-click-modal="false" width="80%" v-if="dialogVisable" append-to-body>
  <section>
  <el-form>
    <el-form-item>
      <el-input v-model="key" class="toolbar-search" placeholder="输入地址" style="width:300px"><el-button type="success"  slot="append" class="el-icon-search" @click="search"></el-button></el-input>
    </el-form-item>
  </el-form>
  <baidu-map :center="center" :zoom="zoom" @ready="handler" :scroll-wheel-zoom="true" @click="getPoint" style="height : 600px"></baidu-map>
  </section>
</el-dialog>
</template>
<script>
export default {
  data () {
    return {
      center: "南通",
      zoom: 15,
      key : '',
     placePoint:{},
      dialogVisable:false
    }
  },
  props:{
    mapVisible:{
      type:Boolean,
      default: function() {
        return true;
      }
    }
  },
  watch:{
     mapVisible: {
      handler: function(val, oldVal) {
        this.dialogVisable = val;
      },
      immediate: true
    },
     dialogVisable(val) {
      if (!val) {
        this.$emit('showPoint',this.placePoint);
      }
    }
  },
  methods: {
    //初始化地图
    handler ({BMap, map}) {
      this.zoom = 15
    },
    //获取点击地点的经纬度
    getPoint : function(point) {
      this.placePoint = point.point;
      
      this.dialogVisable=false;
      
    },
    //查询地点
    search : function() {
      this.center = this.key;
    }
  }
}
</script>
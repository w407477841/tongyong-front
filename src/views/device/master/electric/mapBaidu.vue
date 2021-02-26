<!--
 * @Author: hy
 * @CreateTime: 2018-09-08 22:32:08 
 * @Desc:百度地图 
-->
<template>
  <el-dialog title="工程地点" :visible.sync="dialogVisable"  width="80%" v-if="dialogVisable" append-to-body>
    <section>
      <el-form>
        <el-form-item>
          <el-input v-model="key" class="toolbar-search" placeholder="输入地址" style="width:300px"><el-button type="success"  slot="append" class="el-icon-search" @click="search"></el-button></el-input>
        </el-form-item>
      </el-form>
      <baidu-map  class="bmMap"  :center="center" :zoom="zoom" @ready="handler" :scroll-wheel-zoom="true" @click="getPoint" style="height : 600px">
        <bm-local-search :class="['bmSearch',bmShow?'bmShow':'']" :keyword="key" :auto-viewport="true" :location="center" @searchcomplete="searchcompletehanlder"></bm-local-search>
      </baidu-map>
    </section>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
       bmShow:false,
      center: "南通",
      zoom: 15,
      key: "",
      placePoint: {},
      dialogVisable: false
    };
  },
  props: {
    mapVisible: {
      type: Boolean,
      default: function() {
        return true;
      }
    }
  },
  watch: {
    mapVisible: {
      handler: function(val, oldVal) {
        //console.log("触发画面",val);
        this.dialogVisable = val;
      },
      immediate: true
    },
    dialogVisable(val) {
      //console.log("关闭时的值z",val);
      if (!val) {
        this.$emit("showPoint", this.placePoint);
      }
    }
  },
  methods: {
    //初始化地图
    handler({ BMap, map }) {
      this.zoom = 15;
    },
    //获取点击地点的经纬度
    getPoint: function(point) {
      this.placePoint = point.point;
      //console.log("地点",point.point);

      this.dialogVisable = false;
    },
    //查询地点
    search: function() {
      this.center = this.key;
    },
    searchcompletehanlder(res){
              if(res){
                this.bmShow = true;  
        }else{
            this.bmShow = false;  
        }
        console.info(res);
    }
  }
};
</script>
<style lang="scss">
.bmMap{
  display: flex;
  .bmSearch{
    width: 300px;
    display: none;
    overflow-y: auto;
  }
  .bmShow{
    display: block;
  }
}
</style>
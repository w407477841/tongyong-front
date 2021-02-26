<template>
  <baidu-map class="map" :center="{lng: 121.000, lat: 32.000}" @ready="handler" :zoom="9" :scroll-wheel-zoom="scrollWheelZoom">
    
    <!-- <bm-point-collection :points="points" shape="BMAP_POINT_SHAPE_WATERDROP" color="red"  @click="clickHandler">
     
     
    </bm-point-collection> -->

<bm-point-collection :points="offPoints"  color="red" size="BMAP_POINT_SIZE_NORMAL"   @mouseover="mouseoverHandler"></bm-point-collection>
<bm-point-collection :points="onPoints"  color="green" size="BMAP_POINT_SIZE_NORMAL"   @mouseover="mouseoverHandler"></bm-point-collection>
<bm-info-window ref="info-window" :position="infoWindow.position" :title="infoWindow.title" :show="infoWindow.show"  @close="closeHandler"  @open="openHandler" >
      <p>{{infoWindow.contents.projectName}}</p>
      <p>{{infoWindow.contents.deviceNo}}</p>
      <p>{{infoWindow.contents.statusName}}</p>
    </bm-info-window>
      <!-- <bm-marker :position="markerPoint" :dragging="false" @click="infoWindowOpen">
      <bm-info-window :show="infoWindow.show" @close="infoWindowClose" @open="infoWindowOpen">
        <p v-text="infoWindow.contents"></p>
      </bm-info-window>
    </bm-marker> -->
  </baidu-map>
</template>
<script>
import { BmlMarkerClusterer } from "vue-baidu-map";

import {getNoPageListApi} from '../../api/targetSetElectric';
// import BMap from 'BMap';
export default {
  components: {
    BmlMarkerClusterer
  },
  data() {
    return {
      onPoints: [] ,
      offPoints: [] ,
      map:'',
      markerPoint:{lng:"105.000",lat:"38.000"},

      infoWindow: {
        position:null,
        title:"",
        show: false,
        contents: {
          projectName:"",
          deviceNo:"",
          statusName:""
        }
      },
     markerArr:[],
      positions:[]
    };
  },
  props:{
    scrollWheelZoom:{
      type: Boolean || String,
      default: function() {
        return false;
      }
    }
  },
  mounted() {
    // this.addPoints();
    
  },
  methods: {
    handler({BMap,map}){
      window.map =map;
     
     const pointse = [];
      const info =[];
    
      getNoPageListApi({}).then(res=>{
       
       
       res.data.forEach(el => {
         let placePoint  = el.placePoint;
         if(placePoint){
            let value=  placePoint.split(",");
             if(el.statusName === '离线' ){
          this.offPoints.push({lng:value[0], lat: value[1],body: el})
            }else{
           this.onPoints.push({lng:value[0], lat: value[1],body: el})    
            }

          

           
         }
         

       })

     
      });
      this.positions =info;
      this.points = pointse;
       this.setMapEvent();//设置地图事件
       this.addMapControl();//向地图添加控件
      
    },
    /**
     * 开启窗口
     */
    openInfoWindow(c){
      
        this.infoWindow.contents = c.contents
        this.infoWindow.show = true
        this.infoWindow.position={
           lng: c.point.lng,
           lat:  c.point.lat
        }
        
    },
   /**
    * 移入点位
    */
    mouseoverHandler(e){
      
     let  contents = {
          projectName:"项目名称："+e.point.body.projectName,
          deviceNo:"黑匣子编号："+e.point.body.deviceNo,
          statusName:"状态："+e.point.body.statusName,
        }
        this.openInfoWindow({contents:contents,point:e.point});
    },
    /**
     *  关闭信息窗口
     */
    closeHandler(){
    this.infoWindow.show = false
        },
        /**
         * 开启信息窗口
         */
    openHandler(){
    this.infoWindow.show = true
   
    },
    setMapEvent(){
       map.enableDragging();//启用地图拖拽事件，默认启用(可不写)
       map.enableScrollWheelZoom();//启用地图滚轮放大缩小
       map.enableDoubleClickZoom();//启用鼠标双击放大，默认启用(可不写)
       map.enableKeyboard();//启用键盘上下左右键移动地图
     },
     addMapControl(){
       //向地图中添加缩放控件
       var ctrl_nav = new BMap.NavigationControl({anchor:BMAP_ANCHOR_TOP_LEFT,type:BMAP_NAVIGATION_CONTROL_LARGE});
       map.addControl(ctrl_nav);
       //向地图中添加缩略图控件
       var ctrl_ove = new BMap.OverviewMapControl({anchor:BMAP_ANCHOR_BOTTOM_RIGHT,isOpen:1});
       map.addControl(ctrl_ove);
       //向地图中添加比例尺控件
       var ctrl_sca = new BMap.ScaleControl({anchor:BMAP_ANCHOR_BOTTOM_LEFT});
       map.addControl(ctrl_sca);
     }
   


  }
};
</script>
<style>
.map {
  width: 100%;
  height: 800px;
}
</style>
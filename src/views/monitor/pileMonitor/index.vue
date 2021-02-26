<template>
  <div class="container">
    <!-- <div class="toolbar">
        <select style="width: 220px;">
          <option value="" style="display: none;" selected>运营商选择</option>
          <option value="1">运营商1</option>
          <option value="2">运营商2</option>
          <option value="3">运营商3</option>
        </select>
        <select style="width: 150px;">
          <option value="" style="display: none;" selected>充电站选择</option>
          <option value="1">充电站1</option>
          <option value="2">充电站2</option>
          <option value="3">充电站3</option>
        </select>
        <select style="width: 150px;">
          <option value="" style="display: none;" selected>充电状态选择</option>
          <option value="1">空闲中</option>
          <option value="2">充电中</option>
          <option value="3">报警中</option>
          <option value="3">离线中</option>
        </select>
        <div class="search_btn"><img src="~@/assets/image/search.png"><span style="margin-left: 4px;">查询</span></div>
        <div class="switch_btn"><img src="~@/assets/image/form.png"><span style="margin-left: 4px;">列表展示</span></div>
    </div> -->
    <div class="status_statistics">
      <div class="divide" style="background-color: #e1f0dd;border-top-left-radius: 4px;border-bottom-left-radius: 4px;">充电枪状态</div>
      <div class="divide"><div style="background-color: #56CAEF;"></div>空闲中： {{kxCount}}</div>
      <div class="divide"><div style="background-color: #78c948;"></div>充电中： {{zyCount}}</div>
      <div class="divide" style="border-top-right-radius: 4px;border-bottom-right-radius: 4px;">
        <div style="background-color: #F79D4B;"></div>报警中： {{gzCount}}
      </div>
    </div>
    <div class="content">
      
        <div class="pileInfo" v-for="pile in piles" :key="pile.deviceName">
          <div class="pile_img">
             <p><i :class="pile.online===1?'el-icon-zaixian pile-online':'el-icon-lixian pile-offline'"   ></i></p>
            <img src="~@/assets/image/CP.png">
            <div class="gun_status">
              <table>
                <tr>
                  <td><div :style="'background-color: '+getPlugClass(pile.deviceStatusList[0].status)"></div><span>01</span></td>
                  <td><div :style="'background-color: '+getPlugClass(pile.deviceStatusList[5].status)"></div><span>06</span></td>
                  
                </tr>
                <tr>
              <td><div :style="'background-color: '+getPlugClass(pile.deviceStatusList[1].status)"></div><span>02</span></td>
                  <td><div :style="'background-color: '+getPlugClass(pile.deviceStatusList[6].status)"></div><span>07</span></td>
                </tr>
                <tr>
            <td><div :style="'background-color: '+getPlugClass(pile.deviceStatusList[2].status)"></div><span>03</span></td>
                  <td><div :style="'background-color: '+getPlugClass(pile.deviceStatusList[7].status)"></div><span>08</span></td>
                </tr>
                <tr>
              <td><div :style="'background-color: '+getPlugClass(pile.deviceStatusList[3].status)"></div><span>04</span></td>
                  <td><div :style="'background-color: '+getPlugClass(pile.deviceStatusList[8].status)"></div><span>09</span></td>
                </tr>
                <tr>
                   <td><div :style="'background-color: '+getPlugClass(pile.deviceStatusList[4].status)"></div><span>05</span></td>
                  <td><div :style="'background-color: '+getPlugClass(pile.deviceStatusList[9].status)"></div><span>0A</span></td>
                </tr>
              </table>
            </div>
          </div>
          <div class="pile_font">
           
            <p>桩名：{{pile.pileName}}</p>
            <p>站名：{{pile.stationName}}</p>
            
          </div>
        </div>
   
  
    </div>
  </div>
</template>

<script>
import {getPileSatusList} from './api'

export default {

  data(){

    return {

      piles:[],
      kxCount:0,
      zyCount:0,
      gzCount:0

    }

  },
   computed: {
    params() {
      let param = {
        body:{
          
        }
      };
      return param;
    }
  },
  mounted(){

    this.getPiles();


  },
  methods:{

    getPiles:function(){
      getPileSatusList(this.params).then(res=>{
          this.piles = res.data
          let[kxCount,zyCount,gzCount] = [0,0,0];
             
          this.piles.forEach((item)=>{
            item.deviceStatusList.forEach(ds=>{
              if(ds.status===0){
                     kxCount++;
                  }else if(ds.status===1){
                     zyCount++;
                  }else if(ds.status===2){
                     gzCount++;
                  }
            })
                  
          })
         this.kxCount = kxCount;
         this.zyCount = zyCount;
         this.gzCount = gzCount;

      })
    },
    getPlugClass:function(status){

        if(1 === status ){
            return '#78c948' ;
        }else if(0 === status){
            return '#56CAEF';
        }else if(2 === status){
            return '#F79D4B';
        }

    }

  }


}

</script>

<style lang="scss">
  .app-main {
    background-color: #fff;
  }
  .container {
    width: 85%;
    height: 100%; 
    margin: 0 auto; 
    padding: 15px; 
    padding-left: 5px;
  }
  .toolbar {
    width: 100%; 
    height: 30px;
  }
  select {
		height: 100%;
		border-radius: 4px;
		font-size: 14px;
		color: #666666;
    letter-spacing: 1px;
		background-color: #ffffff;
    margin-left: 10px;
    padding-left: 5px;
    float: left;
    background: url("~@/assets/image/drop.png") no-repeat right center;
		background-color: #ffffff;
    -webkit-appearance: none;
	}
  select::-ms-expand { 
    display: none; 
  } 
  .toolbar div {
    height: 100%; 
    margin-left: 10px;
    text-align: center;
    line-height: 30px;
    border-radius: 4px;
    font-size: 14px;
    float: left;
  }
  .search_btn {
    width: 60px; 
    border: #223e1a 1px solid; 
    background-color: #4db131;
		color: #fff;
  }
  .switch_btn {
    width: 100px;
    border: #78c948 1px solid;
    background-color: #e1f0dd; 
    color: #78c948;
  }
  .status_statistics {
    height: 40px;
    width: 433px;
    margin-top: 5px;
    margin-left: 10px;
    border: #999999 1px solid;
    border-radius: 4px;
  }
  .divide {
    width: 107.6px;
    height: 100%;
    background-color: #f1f7ef;
    float: left;
    text-align: center;
    line-height: 40px;
    font-size: 14px;
    position: relative;
  }
  .divide div{
    width: 4px;
    height: 16px;
    border-radius: 50px;
    position: absolute;
    top: 12px;
    left: 8px;
  }
  .content {
    width: 800px;
    height: calc(100% - 80px);
  }
  // .line {
  //   width: 100%;
  //   height: 150px;
  //   margin-top: 10px;
  // }
  .pileInfo {
    width: 250px;
    height: 100%;
    background-color: #f7f7f7;
    margin-left: 10px;
    margin-top: 10px;
    float: left;
  }
  .pile_img {
    width: 100%;
    height: 100px;
    position: relative;
  }
  .pile_img img {
    position: absolute;
    top: 20px;
    left: 15px;
  }
  .gun_status {
    width: 100px;
    height: 90px;
    position: absolute;
    right: 10px;
    top: 10px;
    font-size: 14px;
  }
  .gun_status table {
    width: 100%;
    height: 90px;
    border-spacing: 0px;
  }
  .gun_status tr {
    width: 100%;
    height: 18px;
  }
  .gun_status td {
    width: 50%;
    height: 18px;
    line-height: 18px;
  }
  .gun_status div {
    width: 8px;
    height: 8px;
    border-radius: 50px;
    float: left;
    margin-top: 5px;
  }
  .gun_status span {
    margin-left: 8px;
  }
  .pile_font {
    font-size: 14px;
    color: #333333;
    height: 60px;
    padding-left: 15px;
  }
  .pile_font p {
    margin-block-start: 4px;
    margin-block-end: 4px;
  }

  .pile-online {

  color: #78c948;

  }

  .pile-offline {

    color: #ff1100;
  }

</style>

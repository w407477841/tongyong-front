<template>
    <div class="video">
        <el-row class="boxCard-group" :gutter="16" v-if="baseInfo.platformType != 1">
          <el-col :xs="24" :sm="24" :lg="24" class="boxCard-col" :span="8">
                <div class="boxCard" style="height:600px;">
                    <div class="video__main">
                        <!-- <HK-monitor v-if="flag" :baseInfo="baseInfo" @channels="getChannels" @g_iWndIndex="getIWndIndex"></HK-monitor> -->
                          <!-- <HK-monitor v-if="flag && baseInfo.platformType == 1" :tag="0" :baseInfo="baseInfo" @channels="getChannels" @g_iWndIndex="getIWndIndex" :isCapturePic="false"></HK-monitor> -->
                          <BQ-monitor v-if="flag && baseInfo.platformType == 2"></BQ-monitor>
                          <DH-monitor v-if="flag && baseInfo.platformType == 3" :listMaterialMonitor="baseInfo"></DH-monitor>
                          <YS-monitor v-if="baseInfo.platformType == 4"  :projectId="projectId" :pageSize="9" :pageIndex="0"></YS-monitor>
                          <LC-monitor v-if="baseInfo.platformType == 5"   :httpAddress="httpAddress" :pageSize="9" :pageIndex="1" ></LC-monitor>
                          <YST-monitor v-if="baseInfo.platformType == 6" :baseInfo="baseInfo" :pageSize="9" :pageIndex="0" ></YST-monitor>
                    </div>
                </div>
            </el-col>
        </el-row>
        <el-row class="boxCard-group" :gutter="16" v-else>
            <el-col :xs="24" :sm="8" :lg="8" class="boxCard-col" :span="8">
                <div class="boxCard">
                    <div class="video__main">
                        <!-- <HK-monitor v-if="flag" :baseInfo="baseInfo" @channels="getChannels" @g_iWndIndex="getIWndIndex"></HK-monitor> -->
                          <HK-monitor v-if="flag && baseInfo.platformType == 1" :tag="0" :baseInfo="baseInfo" @channels="getChannels" @g_iWndIndex="getIWndIndex" :isCapturePic="false"></HK-monitor>
                          <!-- <BQ-monitor v-if="flag && baseInfo.platformType == 2"></BQ-monitor>
                          <DH-monitor v-if="flag && baseInfo.platformType == 3" :listMaterialMonitor="baseInfo"></DH-monitor>
                          <YS-monitor v-if="baseInfo.platformType == 4"  :projectId="projectId" :pageSize="9" :pageIndex="0"></YS-monitor>
                          <LC-monitor v-if="baseInfo.platformType == 5"   :projectId="projectId" :pageSize="9" :pageIndex="1" ></LC-monitor> -->
                    </div>
                </div>
            </el-col>
            <el-col :xs="24" :sm="8" :lg="8" class="boxCard-col" :span="8">
                <div class="boxCard">
                    <div class="boxCard-title">本地配置</div>
                    <div class="video__main">
                        <div class="video__setter" style="height:200px;">
                            <el-form ref="form" :model="form" label-width="125px" size="mini" label-position="left">
                                <el-form-item label="录像文件保存路径">
                                    <el-col :span="18">
                                        <el-input v-model="form2.videoFile"></el-input>
                                    </el-col>
                                    <el-col :span="4">
                                        <el-button size="mini" @click="clickOpenFileDlg('videoFile', 0)">浏览</el-button>
                                    </el-col>
                                </el-form-item>
                                <el-form-item label="回放下载保存路径">
                                    <el-col :span="18">
                                        <el-input v-model="form2.pbDownload"></el-input>
                                    </el-col>
                                    <el-col :span="4">
                                        <el-button size="mini" @click="clickOpenFileDlg('pbDownload', 0);">浏览</el-button>
                                    </el-col>
                                </el-form-item>
                                <el-form-item label="预览抓图保存路径">
                                    <el-col :span="18">
                                        <el-input v-model="form2.pvScreenshot"></el-input>
                                    </el-col>
                                    <el-col :span="4">
                                        <el-button size="mini" @click="clickOpenFileDlg('pvScreenshot', 0);">浏览</el-button>
                                    </el-col>
                                </el-form-item>
                            </el-form>
                        </div>
                        <div class="video__option">
                            <!-- <el-button size="mini" type="success" plain @click="clickGetLocalCfg">获取</el-button> -->
                            <el-button size="mini" type="primary" plain @click="clickSetLocalCfg">设置</el-button>
                        </div>
                    </div>
                </div>
            </el-col>
            <el-col :xs="24" :sm="8" :lg="8" class="boxCard-col" :span="8">
                <div class="boxCard">
                    <div class="boxCard-title">回放</div>
                    <div class="video__main">
                        <div class="video__setter">
                            <el-date-picker v-model="pikerDate" type="datetimerange" range-separator="至"
                                start-placeholder="开始日期" end-placeholder="结束日期" size="mini" style="width:100%;margin-bottom:10px;">
                            </el-date-picker>
                        </div>
                        <div class="video__textarea">
                            <!-- <ul>
                                <li v-for="(item,index) in playBackMessage" :key="index">{{item}}</li>
                            </ul> -->
                            <table id="searchlist" class="searchlist" cellpadding="0" cellspacing="0" border="0"></table>
                        </div>
                        <div class="video__option">
                            <el-row :gutter="24">
                                <el-col :span="6">
                                    <el-button type="primary" plain size="mini" style="width:60px" @click="clickRecordSearch(0)">搜索</el-button>
                                </el-col>
                                <el-col :span="6">
                                    <el-button type="success" plain size="mini" style="width:80px" @click="clickStartPlayback">开始回放</el-button>
                                </el-col>
                                <el-col :span="6">
                                    <el-button type="danger" plain size="mini" style="width:80px" @click="clickStopPlayback">停止回放</el-button>
                                </el-col>
                            </el-row>
                            <el-row :gutter="24">
                                <!-- <el-col :span="4">
                                    <el-button type="primary" plain size="mini" style="width:60px" @click="clickReversePlayback">倒放</el-button>
                                </el-col> -->
                                <el-col :span="6">
                                    <el-button type="primary" plain size="mini" style="width:60px" @click="clickPause">暂停</el-button>
                                </el-col>
                                <el-col :span="4">
                                    <el-button type="success" plain size="mini" style="width:60px" @click="clickResume">恢复</el-button>
                                </el-col>
                                <!-- <el-col :span="4">
                                    <el-button type="warning" plain size="mini" style="width:60px" @click="clickPlaySlow">慢放</el-button>
                                </el-col>
                                <el-col :span="4">
                                    <el-button type="warning" plain size="mini" style="width:60px" @click="clickPlayFast">快放</el-button>
                                </el-col> -->
                            </el-row>
                        </div>
                    </div>

                </div>
            </el-col>
            <el-col :xs="24" :sm="8" :lg="8" class="boxCard-col" :span="8">
                
                <div class="boxCard">
                    <div class="boxCard-title">云台控制</div>
                    <div class="video__main">
                        <div class="video__setter" style="height:122px;">
                            <el-form ref="form" :model="form" label-width="125px" size="mini" label-position="left">
                            <el-form-item label="云台速度">
                                <el-select v-model="form.speed" placeholder="云台速度" size="mini">
                                    <el-option label="1" value="1"></el-option>
                                    <el-option label="2" value="2"></el-option>
                                    <el-option label="3" value="3"></el-option>
                                    <el-option label="4" value="4"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="窗口分割数">
                                <el-select v-model="form.windowNum" placeholder="窗口分割数" size="mini" @change="changeWndNum(form.windowNum);">
                                    <el-option value="1*1">1*1</el-option>
                                    <el-option value="2*2">2*2</el-option>
                                    <el-option value="3*3">3*3</el-option>
                                    <el-option value="4*4">4*4</el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="通道列表">
                                <el-select v-model="form.aisleList" placeholder="通道列表" size="mini" @change="aisleListChange(form.aisleList);">
                                    <el-option v-for="(item,index) in windowOptions"
                                    :key="index"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            </el-form>
                        </div>
                        <div class="video__optionS">
                            <div class="video__direction">
                                <el-row :gutter="24">
                                    <el-col :span="6">
                                        <el-button size="mini" style="width:60px" @mousedown.native="mouseDownPTZControl(5)" @mouseup.native="mouseUpPTZControl">左上</el-button>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-button size="mini" style="width:60px" @mousedown.native="mouseDownPTZControl(1)" @mouseup.native="mouseUpPTZControl">上</el-button>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-button size="mini" style="width:60px" @mousedown.native="mouseDownPTZControl(7)" @mouseup.native="mouseUpPTZControl">右上</el-button>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="24">
                                    <el-col :span="6">
                                        <el-button size="mini" style="width:60px" @mousedown.native="mouseDownPTZControl(3)" @mouseup.native="mouseUpPTZControl">左</el-button>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-button size="mini" style="width:60px" @mousedown.native="mouseDownPTZControl(9)" @mouseup.native="mouseUpPTZControl">自动</el-button>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-button size="mini" style="width:60px" @mousedown.native="mouseDownPTZControl(4)" @mouseup.native="mouseUpPTZControl">右</el-button>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="24">
                                    <el-col :span="6">
                                        <el-button size="mini" style="width:60px" @mousedown.native="mouseDownPTZControl(6)" @mouseup.native="mouseUpPTZControl">左下</el-button>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-button size="mini" style="width:60px" @mousedown.native="mouseDownPTZControl(2)" @mouseup.native="mouseUpPTZControl">下</el-button>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-button size="mini" style="width:60px" @mousedown.native="mouseDownPTZControl(8)" @mouseup.native="mouseUpPTZControl">右下</el-button>
                                    </el-col>
                                </el-row>
                            </div>
                            <div class="video__conf">
                                <el-row :gutter="24">
                                    <el-col :span="9">
                                        <el-button size="mini" style="width:60px" @mousedown.native="PTZZoomIn" @mouseup.native="PTZZoomStop">变倍+</el-button>
                                    </el-col>
                                    <el-col :span="9">
                                        <el-button size="mini" style="width:60px" @mousedown.native="PTZZoomout" @mouseup.native="PTZZoomStop">变倍-</el-button>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="24">
                                    <el-col :span="9">
                                        <el-button size="mini" style="width:60px" @mousedown.native="PTZFocusIn" @mouseup.native="PTZFoucusStop">变焦+</el-button>
                                    </el-col>
                                    <el-col :span="9">
                                        <el-button size="mini" style="width:60px" @mousedown.native="PTZFoucusOut" @mouseup.native="PTZFoucusStop">变焦-</el-button>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="24">
                                    <el-col :span="9">
                                        <el-button size="mini" style="width:60px" @mousedown.native="PTZIrisIn" @mouseup.native="PTZIrisStop">光圈+</el-button>
                                    </el-col>
                                    <el-col :span="9">
                                        <el-button size="mini" style="width:60px" @mousedown.native="PTZIrisOut" @mouseup.native="PTZIrisStop">光圈-</el-button>
                                    </el-col>
                                </el-row>
                            </div>
                        </div>
                        <div class="video__review">
                            <el-button size="mini" type="primary" plain @click="clickCapturePic">抓图</el-button>
                            <el-button size="mini" type="success" plain @click="clickStartRecord">开始录像</el-button>
                            <el-button size="mini" type="danger" plain @click="clickStopRecord">停止录像</el-button>
                        </div>
                    </div>

                </div>
            </el-col>
            <el-col :xs="24" :sm="8" :lg="8" class="boxCard-col" :span="8">
                <div class="boxCard">
                    <div class="boxCard-title">操作信息</div>
                    <div class="video__main">
                        <div class="video__textarea">
                            <ul>
                                <li v-for="(item,index) in optionMessage" :key="index">{{item}}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </el-col>
            <!-- <el-col :xs="24" :sm="8" :lg="8" class="boxCard-col" :span="8">
                <div class="boxCard">
                    <div class="boxCard-title">事件回调信息</div>
                    <div class="video__main">
                        <div class="video__textarea">
                            <ul>
                                <li v-for="(item,index) in callBackMessage" :key="index">{{item}}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </el-col> -->
        </el-row>
    </div>
</template>

<script>
import HKMonitor from "@/components/video/HKMonitor.vue";
import DHMonitor from "@/components/video/DHMonitor.vue";
import BQMonitor from "@/components/video/BQMonitor.vue";
import LCMonitor from "@/components/video/LCMonitor.vue";
import YSMonitor from "./YSMonitor.vue";
import YSTMonitor from "@/components/video/YSTMonitor.vue";
export default {
  data() {
    return {
      baseInfo: {},
      flag: false,
      form: {
        // videoFile: "",
        // pbDownload: "",
        // pvScreenshot: "",
        pbCapture: "",
        projectId:"",
        pbClip: "",
        speed: "",
        windowNum: "",
        aisleList: ""
        
      },
      form2:{
        videoFile: "",
        pbDownload: "",
        pvScreenshot: ""
      },
      pikerDate: [new Date(), new Date()],
      optionMessage: [],
      callBackMessage: [],
      //   playBackMessage: [],
      g_iWndIndex: 0, //可以不用设置这个变量，有窗口参数的接口中，不用传值，开发包会默认使用当前选择窗口
      channels: [],
      httpAddress:[],
      windowOptions: [
        // {
        //   value: "选项1",
        //   label: "黄金糕"
        // },
        // {
        //   value: "选项2",
        //   label: "双皮奶"
        // },
        // {
        //   value: "选项3",
        //   label: "蚵仔煎"
        // },
        // {
        //   value: "选项4",
        //   label: "龙须面"
        // },
        // {
        //   value: "选项5",
        //   label: "北京烤鸭"
        // }
      ],
      isSetLocalCfg: false
    };
  },
  watch: {
    form2: {
      handler(val) {
        this.isSetLocalCfg = false;
      },
      deep: true
    }
  },
  mounted() {
    this.baseInfo.ip = sessionStorage.getItem("ip");
    this.baseInfo.password = sessionStorage.getItem("password");
    this.baseInfo.username = sessionStorage.getItem("loginName");
    this.baseInfo.port = sessionStorage.getItem("port");
    this.baseInfo.platformType = sessionStorage.getItem("platformType");
    this.baseInfo.appkey = sessionStorage.getItem("appkey");
    this.baseInfo.secret = sessionStorage.getItem("secret");
    this.projectId = sessionStorage.getItem("projectId");
    this.httpAddress = sessionStorage.getItem("httpAddress").split(",");
    console.log("222322",this.projectId);
    console.log(this.baseInfo);
    setTimeout(() => {
        this.flag = true;
    }, 0);
    
  },
  methods: {
    getPos(ev) {
      let scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      let scrollLeft =
        document.documentElement.scrollLeft || document.body.scrollLeft;
      return { x: ev.clientX + scrollLeft, y: ev.clientY + scrollTop };
    },
    drag(ev) {
      this.slider.className = "focus";
      let that = this;
      let scale =
        this.wrapDiv.clientHeight /
        this.contentDiv.clientHeight; /*确定滚动比例*/
      let oEvent = ev || event;
      let pos = that.getPos(oEvent); //获取鼠标坐标
      this.disY = pos.y - this.slider.offsetTop;
      this.disX = pos.x - this.slider.offsetLeft;
      document.onmousemove = function(ev) {
        /*注册document的mousemove事件*/
        let oEvent = ev || event;
        let pos = that.getPos(oEvent);
        let t = pos.y - that.disY;
        t = t < 0 ? 0 : t; /*限定滚动范围*/
        if (t > that.sliderWrap.clientHeight - that.slider.offsetHeight) {
          t = that.sliderWrap.clientHeight - that.slider.offsetHeight;
        }
        that.slider.style.top = t + "px"; /*设置滚动条位置*/
        let t1 = -(t + 1) / scale;
        that.contentDiv.style.top = t1 + "px"; /*表格内容按比例滚动*/
        that.contentDiv1.style.top = t1 + "px";
      };
      document.onmouseup = function() {
        /*鼠标放开清除事件*/
        that.slider.className = "";
        document.onmousemove = null;
        document.onmouseup = null;
      };
      return false; //兼容firefox
    },
    initScroll() {
      this.slider.style.top = 0;
      this.contentDiv.style.top = 0;
      this.contentDiv1.style.top = 0;
    },
    // 显示操作信息
    showOPInfo(szInfo) {
      szInfo =
        this.$moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + " " + szInfo;
      this.optionMessage.unshift(szInfo);
    },

    // 显示回调信息
    showCBInfo(szInfo) {
      szInfo =
        this.$moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + " " + szInfo;
      this.callBackMessage.unshift(szInfo);
    },
    // 获取本地参数
    // clickGetLocalCfg() {
    //   var xmlDoc = WebVideoCtrl.I_GetLocalCfg();

    //   this.form.videoFile = $(xmlDoc)
    //     .find("RecordPath")
    //     .eq(0)
    //     .text();
    //   this.form.pbDownload = $(xmlDoc)
    //     .find("DownloadPath")
    //     .eq(0)
    //     .text();
    //   this.form.pvScreenshot = $(xmlDoc)
    //     .find("CapturePath")
    //     .eq(0)
    //     .text();
    //   this.form.pbCapture = $(xmlDoc)
    //     .find("PlaybackPicPath")
    //     .eq(0)
    //     .text();
    //   this.form.pbClip = $(xmlDoc)
    //     .find("PlaybackFilePath")
    //     .eq(0)
    //     .text();
    // },
    clickOpenFileDlg(id, iType) {
      var szDirPath = WebVideoCtrl.I_OpenFileDlg(iType);
      console.log(szDirPath);
      if (szDirPath != -1 && szDirPath != "" && szDirPath != null) {
        if (id == "videoFile") {
          this.form2.videoFile = szDirPath;
        } else if (id == "pbDownload") {
          this.form2.pbDownload = szDirPath;
        } else if (id == "pvScreenshot") {
          this.form2.pvScreenshot = szDirPath;
        } else if (id == "pbCapture") {
          this.form.pbCapture = szDirPath;
        } else if ((id = "pbClip")) {
          this.form.pbClip = szDirPath;
        }
      }
    },
    // 设置本地参数
    clickSetLocalCfg() {
      var arrXml = [],
        szInfo = "";

      arrXml.push("<LocalConfigInfo>");
      arrXml.push("<PackgeSize>" + 0 + "</PackgeSize>");
      arrXml.push("<PlayWndType>" + 0 + "</PlayWndType>");
      arrXml.push("<BuffNumberType>" + 0 + "</BuffNumberType>");
      arrXml.push("<RecordPath>" + this.form2.videoFile + "</RecordPath>");
      arrXml.push("<CapturePath>" + this.form2.pvScreenshot + "</CapturePath>");
      arrXml.push(
        "<PlaybackFilePath>" + this.form.pbClip + "</PlaybackFilePath>"
      );
      arrXml.push(
        "<PlaybackPicPath>" + this.form.pbCapture + "</PlaybackPicPath>"
      );
      arrXml.push("<DownloadPath>" + this.form2.pbDownload + "</DownloadPath>");
      arrXml.push("<IVSMode>" + 1 + "</IVSMode>");
      arrXml.push("<CaptureFileFormat>" + 0 + "</CaptureFileFormat>");
      arrXml.push("<ProtocolType>" + 0 + "</ProtocolType>");
      arrXml.push("</LocalConfigInfo>");

      var iRet = WebVideoCtrl.I_SetLocalCfg(arrXml.join(""));

      if (0 == iRet) {
        szInfo = "本地配置设置成功！";
        this.isSetLocalCfg = true;
      } else {
        szInfo = "本地配置设置失败！";
        this.isSetLocalCfg = false;
      }
      this.showOPInfo(szInfo);
    },

    // PTZ控制 9为自动，1,2,3,4,5,6,7,8为方向PTZ
    mouseDownPTZControl(iPTZIndex) {
      if (!this.form.speed || this.form.speed == "") {
        this.$message({ type: "error", message: "请先选择云台速度" });
      } else {
        var g_bPTZAuto = false;
        var oWndInfo = WebVideoCtrl.I_GetWindowStatus(this.g_iWndIndex),
          iPTZSpeed = this.form.speed ? this.form.speed : 0;
        var that = this;
        if (oWndInfo != null) {
          if (9 == iPTZIndex && g_bPTZAuto) {
            iPTZSpeed = 0; // 自动开启后，速度置为0可以关闭自动
          } else {
            g_bPTZAuto = false; // 点击其他方向，自动肯定会被关闭
          }

          WebVideoCtrl.I_PTZControl(iPTZIndex, false, {
            iPTZSpeed: iPTZSpeed,
            success: function(xmlDoc) {
              if (9 == iPTZIndex) {
                g_bPTZAuto = !g_bPTZAuto;
              }
              that.showOPInfo(oWndInfo.szIP + " 开启云台成功！");
            },
            error: function() {
              that.showOPInfo(oWndInfo.szIP + " 开启云台失败！");
            }
          });
        }
      }
    },
    // 方向PTZ停止
    mouseUpPTZControl() {
      if (!this.form.speed || this.form.speed == "") {
        this.$message({ type: "error", message: "请先选择云台速度" });
      } else {
        var oWndInfo = WebVideoCtrl.I_GetWindowStatus(this.g_iWndIndex);
        var that = this;
        if (oWndInfo != null) {
          WebVideoCtrl.I_PTZControl(1, true, {
            success: function(xmlDoc) {
              that.showOPInfo(oWndInfo.szIP + " 停止云台成功！");
            },
            error: function() {
              that.showOPInfo(oWndInfo.szIP + " 停止云台失败！");
            }
          });
        }
      }
    },
    PTZZoomIn() {
      var oWndInfo = WebVideoCtrl.I_GetWindowStatus(this.g_iWndIndex);
      var that = this;
      if (oWndInfo != null) {
        WebVideoCtrl.I_PTZControl(10, false, {
          iWndIndex: this.g_iWndIndex,
          success: function(xmlDoc) {
            that.showOPInfo(oWndInfo.szIP + " 调焦+成功！");
          },
          error: function() {
            that.showOPInfo(oWndInfo.szIP + "  调焦+失败！");
          }
        });
      }
    },

    PTZZoomout() {
      var oWndInfo = WebVideoCtrl.I_GetWindowStatus(this.g_iWndIndex);
      var that = this;
      if (oWndInfo != null) {
        WebVideoCtrl.I_PTZControl(11, false, {
          iWndIndex: this.g_iWndIndex,
          success: function(xmlDoc) {
            that.showOPInfo(oWndInfo.szIP + " 调焦-成功！");
          },
          error: function() {
            that.showOPInfo(oWndInfo.szIP + "  调焦-失败！");
          }
        });
      }
    },

    PTZZoomStop() {
      var oWndInfo = WebVideoCtrl.I_GetWindowStatus(this.g_iWndIndex);
      var that = this;
      if (oWndInfo != null) {
        WebVideoCtrl.I_PTZControl(11, true, {
          iWndIndex: this.g_iWndIndex,
          success: function(xmlDoc) {
            that.showOPInfo(oWndInfo.szIP + " 调焦停止成功！");
          },
          error: function() {
            that.showOPInfo(oWndInfo.szIP + "  调焦停止失败！");
          }
        });
      }
    },

    PTZFocusIn() {
      var oWndInfo = WebVideoCtrl.I_GetWindowStatus(this.g_iWndIndex);
      var that = this;
      if (oWndInfo != null) {
        WebVideoCtrl.I_PTZControl(12, false, {
          iWndIndex: this.g_iWndIndex,
          success: function(xmlDoc) {
            that.showOPInfo(oWndInfo.szIP + " 聚焦+成功！");
          },
          error: function() {
            that.showOPInfo(oWndInfo.szIP + "  聚焦+失败！");
          }
        });
      }
    },

    PTZFoucusOut() {
      var oWndInfo = WebVideoCtrl.I_GetWindowStatus(this.g_iWndIndex);
      var that = this;
      if (oWndInfo != null) {
        WebVideoCtrl.I_PTZControl(13, false, {
          iWndIndex: this.g_iWndIndex,
          success: function(xmlDoc) {
            that.showOPInfo(oWndInfo.szIP + " 聚焦-成功！");
          },
          error: function() {
            that.showOPInfo(oWndInfo.szIP + "  聚焦-失败！");
          }
        });
      }
    },

    PTZFoucusStop() {
      var oWndInfo = WebVideoCtrl.I_GetWindowStatus(this.g_iWndIndex);
      var that = this;
      if (oWndInfo != null) {
        WebVideoCtrl.I_PTZControl(12, true, {
          iWndIndex: this.g_iWndIndex,
          success: function(xmlDoc) {
            that.showOPInfo(oWndInfo.szIP + " 聚焦停止成功！");
          },
          error: function() {
            that.showOPInfo(oWndInfo.szIP + "  聚焦停止失败！");
          }
        });
      }
    },

    PTZIrisIn() {
      var oWndInfo = WebVideoCtrl.I_GetWindowStatus(this.g_iWndIndex);
      var that = this;
      if (oWndInfo != null) {
        WebVideoCtrl.I_PTZControl(14, false, {
          iWndIndex: this.g_iWndIndex,
          success: function(xmlDoc) {
            that.showOPInfo(oWndInfo.szIP + " 光圈+成功！");
          },
          error: function() {
            that.showOPInfo(oWndInfo.szIP + "  光圈+失败！");
          }
        });
      }
    },

    PTZIrisOut() {
      var oWndInfo = WebVideoCtrl.I_GetWindowStatus(this.g_iWndIndex);
      var that = this;
      if (oWndInfo != null) {
        WebVideoCtrl.I_PTZControl(15, false, {
          iWndIndex: this.g_iWndIndex,
          success: function(xmlDoc) {
            that.showOPInfo(oWndInfo.szIP + " 光圈-成功！");
          },
          error: function() {
            that.showOPInfo(oWndInfo.szIP + "  光圈-失败！");
          }
        });
      }
    },

    PTZIrisStop() {
      var oWndInfo = WebVideoCtrl.I_GetWindowStatus(this.g_iWndIndex);
      var that = this;
      if (oWndInfo != null) {
        WebVideoCtrl.I_PTZControl(14, true, {
          iWndIndex: this.g_iWndIndex,
          success: function(xmlDoc) {
            that.showOPInfo(oWndInfo.szIP + " 光圈停止成功！");
          },
          error: function() {
            that.showOPInfo(oWndInfo.szIP + "  光圈停止失败！");
          }
        });
      }
    },

    // 抓图
    clickCapturePic() {
      if (!this.form2.pvScreenshot || this.form2.pvScreenshot == "") {
        this.$message({ type: "error", message: "请选择预览抓图保存路径" });
      } else {
        if (!this.isSetLocalCfg) {
          this.$message({ type: "error", message: "修改路径后请设置以保存" });
        } else {
          var oWndInfo = WebVideoCtrl.I_GetWindowStatus(this.g_iWndIndex),
            szInfo = "";

          if (oWndInfo != null) {
            var szPicName =
                sessionStorage.getItem("projectName") +
                "_" +
                this.channels[this.g_iWndIndex].name +
                "_" +
                this.$moment(new Date()).format("YYYY-MM-DD_HH时mm分ss秒"),
              iRet = WebVideoCtrl.I_CapturePic(szPicName);
            if (0 == iRet) {
              szInfo = "抓图成功！";
            } else {
              szInfo = "抓图失败！";
            }
            this.showOPInfo(oWndInfo.szIP + " " + szInfo);
          }
        }
      }
    },

    // 开始录像
    clickStartRecord() {
      if (!this.form2.videoFile || this.form2.videoFile == "") {
        this.$message({ type: "error", message: "请选择录像文件保存路径" });
      } else {
        if (!this.isSetLocalCfg) {
          this.$message({ type: "error", message: "修改路径后请设置以保存" });
        } else {
          var oWndInfo = WebVideoCtrl.I_GetWindowStatus(this.g_iWndIndex),
            szInfo = "";

          if (oWndInfo != null) {
            var szFileName =
                sessionStorage.getItem("projectName") +
                "_" +
                this.channels[this.g_iWndIndex].name +
                "_" +
                this.$moment(new Date()).format("YYYY-MM-DD_HH时mm分ss秒"),
              iRet = WebVideoCtrl.I_StartRecord(szFileName);
            console.log("szFileName", szFileName);
            if (0 == iRet) {
              szInfo = "开始录像成功！";
            } else {
              szInfo = "开始录像失败！";
            }
            this.showOPInfo(oWndInfo.szIP + " " + szInfo);
          }
        }
      }
    },

    // 停止录像
    clickStopRecord() {
      var oWndInfo = WebVideoCtrl.I_GetWindowStatus(this.g_iWndIndex),
        szInfo = "";

      if (oWndInfo != null) {
        var iRet = WebVideoCtrl.I_StopRecord();
        if (0 == iRet) {
          szInfo = "停止录像成功！";
        } else {
          szInfo = "停止录像失败！";
        }
        this.showOPInfo(oWndInfo.szIP + " " + szInfo);
      }
    },
    // 开始回放
    clickStartPlayback() {
      var oWndInfo = WebVideoCtrl.I_GetWindowStatus(this.g_iWndIndex),
        szIP = this.baseInfo.ip,
        iChannelID = this.g_iWndIndex + 1,
        bZeroChannel = false,
        szStartTime = this.$moment(this.pikerDate[0]).format(
          "YYYY-MM-DD hh:mm:ss"
        ),
        szEndTime = this.$moment(this.pikerDate[1]).format(
          "YYYY-MM-DD hh:mm:ss"
        ),
        szInfo = "",
        bChecked = false,
        iRet = -1;

      if ("" == szIP) {
        return;
      }

      if (bZeroChannel) {
        // 零通道不支持回放
        return;
      }

      if (oWndInfo != null) {
        // 已经在播放了，先停止
        WebVideoCtrl.I_Stop();
      }

      if (bChecked) {
        // 启用转码回放
        var oTransCodeParam = {
          TransFrameRate: "14", // 0：全帧率，5：1，6：2，7：4，8：6，9：8，10：10，11：12，12：16，14：15，15：18，13：20，16：22
          TransResolution: "1", // 255：Auto，3：4CIF，2：QCIF，1：CIF
          TransBitrate: "19" // 2：32K，3：48K，4：64K，5：80K，6：96K，7：128K，8：160K，9：192K，10：224K，11：256K，12：320K，13：384K，14：448K，15：512K，16：640K，17：768K，18：896K，19：1024K，20：1280K，21：1536K，22：1792K，23：2048K，24：3072K，25：4096K，26：8192K
        };
        iRet = WebVideoCtrl.I_StartPlayback(szIP, {
          iChannelID: iChannelID,
          szStartTime: szStartTime,
          szEndTime: szEndTime,
          oTransCodeParam: oTransCodeParam
        });
      } else {
        iRet = WebVideoCtrl.I_StartPlayback(szIP, {
          iChannelID: iChannelID,
          szStartTime: szStartTime,
          szEndTime: szEndTime
        });
      }

      if (0 == iRet) {
        szInfo = "开始回放成功！";
      } else {
        szInfo = "开始回放失败！";
      }
      this.showOPInfo(szIP + " " + szInfo);
    },

    // 停止回放
    clickStopPlayback() {
      var oWndInfo = WebVideoCtrl.I_GetWindowStatus(this.g_iWndIndex),
        szInfo = "";

      if (oWndInfo != null) {
        var iRet = WebVideoCtrl.I_Stop();
        if (0 == iRet) {
          szInfo = "停止回放成功！";
        } else {
          szInfo = "停止回放失败！";
        }
        this.showOPInfo(oWndInfo.szIP + " " + szInfo);
      }
    },
    // 开始倒放
    clickReversePlayback() {
      var oWndInfo = WebVideoCtrl.I_GetWindowStatus(this.g_iWndIndex),
        szInfo = "",
        szIP = this.baseInfo.ip,
        iChannelID = this.g_iWndIndex + 1,
        bZeroChannel = false,
        szStartTime = this.$moment(this.pikerDate[0]).format(
          "YYYY-MM-DD hh:mm:ss"
        ),
        szEndTime = this.$moment(this.pikerDate[1]).format(
          "YYYY-MM-DD hh:mm:ss"
        );
      if ("" == szIP) {
        return;
      }

      if (bZeroChannel) {
        // 零通道不支持回放
        return;
      }

      if (oWndInfo != null) {
        // 已经在播放了，先停止
        WebVideoCtrl.I_Stop();
      }

      var iRet = WebVideoCtrl.I_ReversePlayback(szIP, {
        iChannelID: iChannelID,
        szStartTime: szStartTime,
        szEndTime: szEndTime
      });
      console.log(iRet);
      if (0 == iRet) {
        szInfo = "开始倒放成功！";
      } else {
        szInfo = "开始倒放失败！";
      }
      this.showOPInfo(szIP + " " + szInfo);
    },
    // 暂停
    clickPause() {
      var oWndInfo = WebVideoCtrl.I_GetWindowStatus(this.g_iWndIndex),
        szInfo = "";

      if (oWndInfo != null) {
        var iRet = WebVideoCtrl.I_Pause();
        if (0 == iRet) {
          szInfo = "暂停成功！";
        } else {
          szInfo = "暂停失败！";
        }
        this.showOPInfo(oWndInfo.szIP + " " + szInfo);
      }
    },

    // 恢复
    clickResume() {
      var oWndInfo = WebVideoCtrl.I_GetWindowStatus(this.g_iWndIndex),
        szInfo = "";

      if (oWndInfo != null) {
        var iRet = WebVideoCtrl.I_Resume();
        if (0 == iRet) {
          szInfo = "恢复成功！";
        } else {
          szInfo = "恢复失败！";
        }
        this.showOPInfo(oWndInfo.szIP + " " + szInfo);
      }
    },

    // 慢放
    clickPlaySlow() {
      var oWndInfo = WebVideoCtrl.I_GetWindowStatus(this.g_iWndIndex),
        szInfo = "";

      if (oWndInfo != null) {
        var iRet = WebVideoCtrl.I_PlaySlow();
        if (0 == iRet) {
          szInfo = "慢放成功！";
        } else {
          szInfo = "慢放失败！";
        }
        this.showOPInfo(oWndInfo.szIP + " " + szInfo);
      }
    },

    // 快放
    clickPlayFast() {
      var oWndInfo = WebVideoCtrl.I_GetWindowStatus(this.g_iWndIndex),
        szInfo = "";

      if (oWndInfo != null) {
        var iRet = WebVideoCtrl.I_PlayFast();
        if (0 == iRet) {
          szInfo = "快放成功！";
        } else {
          szInfo = "快放失败！";
        }
        this.showOPInfo(oWndInfo.szIP + " " + szInfo);
      }
    },
    // 搜索录像
    clickRecordSearch(iType) {
      console.log("搜索");
      var iSearchTimes = 0;
      var szIP = this.baseInfo.ip,
        iChannelID = this.g_iWndIndex + 1,
        bZeroChannel = false,
        szStartTime = this.$moment(this.pikerDate[0]).format(
          "YYYY-MM-DD hh:mm:ss"
        ),
        szEndTime = this.$moment(this.pikerDate[1]).format(
          "YYYY-MM-DD hh:mm:ss"
        );
      console.log(
        "I_RecordSearch!!",
        szIP,
        iChannelID,
        szStartTime,
        szEndTime,
        iSearchTimes
      );
      if ("" == szIP) {
        return;
      }

      if (bZeroChannel) {
        // 零通道不支持录像搜索
        return;
      }

      if (0 == iType) {
        // 首次搜索
        console.log("首次搜索");
        $("#searchlist").empty();
        iSearchTimes = 0;
      }
      var that = this;
      WebVideoCtrl.I_RecordSearch(szIP, iChannelID, szStartTime, szEndTime, {
        iSearchPos: iSearchTimes * 40,
        success: function(xmlDoc) {
          console.log("806", xmlDoc);
          if (
            "MORE" ===
            $(xmlDoc)
              .find("responseStatusStrg")
              .eq(0)
              .text()
          ) {
            for (
              var i = 0, nLen = $(xmlDoc).find("searchMatchItem").length;
              i < nLen;
              i++
            ) {
              var szPlaybackURI = $(xmlDoc)
                .find("playbackURI")
                .eq(i)
                .text();
              if (szPlaybackURI.indexOf("name=") < 0) {
                break;
              }
              var szStartTime = $(xmlDoc)
                .find("startTime")
                .eq(i)
                .text();
              var szEndTime = $(xmlDoc)
                .find("endTime")
                .eq(i)
                .text();
              var szFileName = szPlaybackURI.substring(
                szPlaybackURI.indexOf("name=") + 5,
                szPlaybackURI.indexOf("&size=")
              );

              var objTr = $("#searchlist")
                .get(0)
                .insertRow(-1);
              var objTd = objTr.insertCell(0);
              objTd.id = "downloadTd" + i;
              objTd.innerHTML = iSearchTimes * 40 + (i + 1);
              objTd = objTr.insertCell(1);
              objTd.width = "30%";
              objTd.innerHTML = szFileName;
              objTd = objTr.insertCell(2);
              objTd.width = "30%";
              //   objTd.innerHTML = szStartTime.replace("T", " ").replace("Z", "");
              objTd = objTr.insertCell(3);
              objTd.width = "30%";
              //   objTd.innerHTML = szEndTime.replace("T", " ").replace("Z", "");
              objTd = objTr.insertCell(4);
              objTd.width = "10%";
              objTd.innerHTML =
                "<a href='javascript:;' onclick='clickStartDownloadRecord(" +
                i +
                ");'>下载</a>";
              $("#downloadTd" + i).data("playbackURI", szPlaybackURI);
            }

            iSearchTimes++;
            that.clickRecordSearch(1); // 继续搜索
          } else if (
            "OK" ===
            $(xmlDoc)
              .find("responseStatusStrg")
              .eq(0)
              .text()
          ) {
            var iLength = $(xmlDoc).find("searchMatchItem").length;
            for (var i = 0; i < iLength; i++) {
              var szPlaybackURI = $(xmlDoc)
                .find("playbackURI")
                .eq(i)
                .text();
              if (szPlaybackURI.indexOf("name=") < 0) {
                break;
              }
              var szStartTime = $(xmlDoc)
                .find("startTime")
                .eq(i)
                .text();
              var szEndTime = $(xmlDoc)
                .find("endTime")
                .eq(i)
                .text();
              var szFileName = szPlaybackURI.substring(
                szPlaybackURI.indexOf("name=") + 5,
                szPlaybackURI.indexOf("&size=")
              );

              var objTr = $("#searchlist")
                .get(0)
                .insertRow(-1);
              var objTd = objTr.insertCell(0);
              objTd.id = "downloadTd" + i;
              objTd.innerHTML = iSearchTimes * 40 + (i + 1);
              objTd = objTr.insertCell(1);
              objTd.width = "30%";
              objTd.innerHTML = szFileName;
              objTd = objTr.insertCell(2);
              objTd.width = "30%";
              //   objTd.innerHTML = szStartTime.replace("T", " ").replace("Z", "");
              objTd = objTr.insertCell(3);
              objTd.width = "30%";
              //   objTd.innerHTML = szEndTime.replace("T", " ").replace("Z", "");
              objTd = objTr.insertCell(4);
              objTd.width = "10%";
              objTd.innerHTML =
                "<a href='javascript:;' onclick='clickStartDownloadRecord(" +
                i +
                ");'>下载</a>";
              $("#downloadTd" + i).data("playbackURI", szPlaybackURI);
            }
            that.showOPInfo(szIP + " 搜索录像文件成功！");
          } else if (
            "NO MATCHES" ===
            $(xmlDoc)
              .find("responseStatusStrg")
              .eq(0)
              .text()
          ) {
            setTimeout(function() {
              that.showOPInfo(szIP + " 没有录像文件！");
            }, 50);
          }
        },
        error: function() {
          that.showOPInfo(szIP + " 搜索录像文件失败！");
        }
      });
    },
    // 下载录像

    clickStartDownloadRecord(i) {
      if (!this.form2.pbDownload || this.form2.pbDownload == "") {
        this.$message({ type: "error", message: "请选择回放下载保存路径" });
      } else {
        if (!this.isSetLocalCfg) {
          this.$message({ type: "error", message: "修改路径后请设置以保存" });
        } else if (this.isSetLocalCfg) {
          var iDownloadID = -1;
          var tDownloadProcess = 0;
          var szIP = this.baseInfo.ip,
            szChannelID = this.g_iWndIndex + 1,
            szFileName =
              sessionStorage.getItem("projectName") +
              "_" +
              this.channels[this.g_iWndIndex].name +
              "_" +
              this.$moment(new Date()).format("YYYY-MM-DD"),
            szPlaybackURI = $("#downloadTd" + i).data("playbackURI");

          if ("" == szIP) {
            return;
          }

          iDownloadID = WebVideoCtrl.I_StartDownloadRecord(
            szIP,
            szPlaybackURI,
            szFileName
          );

          if (iDownloadID < 0) {
            var iErrorValue = WebVideoCtrl.I_GetLastError();
            if (34 == iErrorValue) {
              this.showOPInfo(szIP + " 已下载！");
            } else if (33 == iErrorValue) {
              this.showOPInfo(szIP + " 空间不足！");
            } else {
              this.showOPInfo(szIP + " 下载失败！");
            }
          } else {
            this.showOPInfo(szIP + "freeze");
          }
        }
      }
    },
    // 窗口分割数
    changeWndNum(iType) {
      iType = parseInt(iType, 10);
      WebVideoCtrl.I_ChangeWndNum(iType);
    },
    getChannels(value) {
      console.log("getChannels", value);
      this.channels = value;
      this.channels.forEach(el => {
        this.windowOptions.push({ value: el.id, label: el.name });
      });
      console.log("this.channels", this.windowOptions);
    },
    getIWndIndex(value) {
      this.g_iWndIndex = value;
    },
    clickStartRealPlay(i) {
      console.log("clickStartRealPlay", i);
      var oWndInfo = WebVideoCtrl.I_GetWindowStatus(this.g_iWndIndex),
        szIP = this.baseInfo.ip,
        iStreamType = parseInt(1, 10),
        iChannelID = parseInt(i, 10),
        bZeroChannel = false,
        szInfo = "";

      if ("" == szIP) {
        return;
      }

      if (oWndInfo != null) {
        // 已经在播放了，先停止
        WebVideoCtrl.I_Stop();
      }

      var iRet = WebVideoCtrl.I_StartRealPlay(szIP, {
        iStreamType: iStreamType,
        iChannelID: iChannelID,
        bZeroChannel: bZeroChannel
      });

      if (0 == iRet) {
        szInfo = "开始预览成功！";
      } else {
        szInfo = "开始预览失败！";
      }

      this.showOPInfo(szIP + " " + szInfo);
    },
    aisleListChange(value) {
      console.log("aisleListChange", value);
      this.windowOptions.forEach(el => {
        console.log(el);
        if (el.value == value) {
          this.clickStartRealPlay(el.value);
        }
      });
    }
  },
  components: {
    HKMonitor,
    DHMonitor,
    BQMonitor,
    YSMonitor,
    LCMonitor,
    YSTMonitor
  }
};
</script>

<style lang="scss" scoped>
.video {
  padding: 10px;

  .boxCard-col {
    margin-bottom: 16px;

    .boxCard {
      height: 300px;
      padding: 15px 20px;
      font-size: 12px;
      position: relative;
      overflow: hidden;
      color: #666;
      background: #fff;
      box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
      border-color: rgba(0, 0, 0, 0.85);

      &::before {
        content: " ";
        display: inline-block;
        width: 45px;
        height: 4px;
        background-color: #51aece;
        position: absolute;
        left: 20px;
        top: 0;
      }

      .video__main {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 100%;
        height: calc(100% - 13px);

        .video__setter {
          display: flex;
          justify-content: space-between;
          margin-top: 10px;

          .el-form-item--mini.el-form-item {
            margin-bottom: 10px;
          }
        } //
        .el-form-item--mini.el-form-item {
          margin: 5px 5px;
        }
        .video__optionS {
          display: flex;
          justify-content: space-between;

          //   .el-row {
          //     margin: 10px 0;
          //   }
        }

      

        .video__option {
          .el-row {
            margin-top: 10px;
          }
        }
        .video__textarea {
          width: 100%;
          margin-top: 10px;
          height: calc(100% - 13px);
          border: 1px solid #c0c4cc;
          border-radius: 4px;
          padding: 10px;
          overflow-y: scroll;
          ul {
            li {
              padding: 2px;
            }
          }
        }
      }
    }
  }
}
</style>
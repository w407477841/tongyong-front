<!--
 * @Author: zhangzhenya 
 * @CreateTime: 2018-08-27 15:04:47 
 * @Desc: 8700视频组件 
-->
<template>
    <div class="monitor">
      <object classid="clsid:9ECD2A40-1222-432E-A4D4-154C7CAB9DE3" id="mainVideo" class="weekareamonitor" style="width:100%;height:100%;"></object>
    </div>
</template>

<script>
import http from "@/axios";
export default {
  data() {
    return {
      index: 1,
      childNodes: []
    };
  },
  mounted() {
    this.InitSpvx("mainVideo");
    this.SetLocalParam("mainVideo");
    this.SetWnd("mainVideo");
    this.getNodes("mainVideo", this.index);
  },
  methods: {
    InitSpvx(id) {
      var ocxObj = document.getElementById(id);
      var languageType = 1;
      var ret = ocxObj.MPV_Init(languageType);
      if (ret != 0) {
        alert("初始化失败");
      }
    },
    SetLocalParam(id) {
      var ocxObj = document.getElementById(id);
      var devPxRa = screen.deviceXDPI / screen.logicalXDPI;
      var xml =
        '<?xml version="1.0" encoding="UTF-8"?> ' +
        "<localParam> " +
        "<picType>0</picType> " +
        "<capturePath>C:\\Hikvision</capturePath> " +
        "<recordSize>2</recordSize> " +
        "<recordPath>C:\\Hikvision</recordPath> " +
        "<limitPreviewTime>0</limitPreviewTime> " +
        "<showMsgTip>1</showMsgTip> " +
        "</localParam>";
      var ret = ocxObj.MPV_SetLocalParam(xml);
      if (ret != 0) {
        alert("设置本地参数失败");
      }
    },
    GenToken: function(uri, strParam, mySecret) {
      var srcStr = uri + strParam + mySecret;
      var token = hex_md5(srcStr).toUpperCase(); // 生成token
      return token;
    },
    SetWnd(id) {
      var ocxObj = document.getElementById(id);
      var ret = ocxObj.MPV_SetPlayWndCount(parseInt(1, 10));
      if (ret != 0) {
        alert("设置分屏失败！");
      }
    },
    GetMilSeconds() {
      return new Date().getTime();
    },
    GetCameraToken(time, pUuid) {
      var uri = "/openapi/service/vss/res/getCamerasByRegionUuids";
      var strParam = {
        appkey: "2b0484ba",
        time: time,
        pageNo: 1,
        pageSize: 400,
        opUserUuid: "cc78be40ec8611e78168af26905e6f0f",
        regionUuids: pUuid
      }; // 获取监控点
      var token = this.GenToken(
        uri,
        JSON.stringify(strParam),
        "16633d4d4336451d8a313d6a0075aca1"
      );
      return token;
    },
    GetSinglePreviewToken(time, uuid) {
      var uri = "/openapi/service/vss/preview/getPreviewParamByCameraUuid";
      var strParam = {
        appkey: "2b0484ba",
        time: time,
        opUserUuid: "cc78be40ec8611e78168af26905e6f0f",
        cameraUuid: uuid,
        netZoneUuid: "350ea8aace1441ab9d73055b25db49db"
      };
      var token = this.GenToken(
        uri,
        JSON.stringify(strParam),
        "16633d4d4336451d8a313d6a0075aca1"
      );
      return token;
    },
    getNodes(id, index) {
      var resUuid = "37e8012395fb4f658708b9289f1797c7";
      var time1 = this.GetMilSeconds();
      console.log("106", time1);
      var _this = this;
      var cameraToken = _this.GetCameraToken(time1, resUuid);
      console.log("109", cameraToken);
      http
        .post(
          "/openapi/service/vss/res/getCamerasByRegionUuids?token=" +
            cameraToken,
          {
            appkey: "2b0484ba",
            time: time1,
            pageNo: 1,
            pageSize: 400,
            opUserUuid: "cc78be40ec8611e78168af26905e6f0f",
            regionUuids: resUuid
          }
        )
        .then(nodes => {
          console.log("125", nodes);
          if (nodes.errorCode != 0) {
            var vDesc =
              "根据区域查询监控点失败，" +
              nodes.errorMessage +
              ",错误码为：" +
              nodes.errorCode;
            alert(vDesc);
          } else if (nodes.data.total < 1) {
          } else {
            _this.childNodes = [];
            console.log("135", _this.childNodes);
            for (var i = 0; i < nodes.data.list.length; i++) {
              var arr = {};
              arr.uuid = nodes.data.list[i].cameraUuid;
              arr.name = nodes.data.list[i].cameraName;
              arr.NodeType = 3; // 3表示监控点
              arr.isParent = false;
              arr.iconSkin = "data-icon-camera1";
              _this.childNodes.push(arr);
            }
            console.log("145", _this.childNodes);
            _this.startSinglePreview(id, index);
          }
        });
    },
    startSinglePreview(id, index) {
      var time = this.GetMilSeconds();
      console.log("153", "startSinglePreview", this.childNodes, index);
      var seledCameraUuid = this.childNodes[index - 1].uuid;
      console.log("155", seledCameraUuid);
      var _this = this;
      http
        .post(
          "/openapi/service/vss/preview/getPreviewParamByCameraUuid?token=" +
            _this.GetSinglePreviewToken(time, seledCameraUuid),
          {
            appkey: "2b0484ba",
            time: time,
            opUserUuid: "cc78be40ec8611e78168af26905e6f0f",
            cameraUuid: seledCameraUuid,
            netZoneUuid: "350ea8aace1441ab9d73055b25db49db"
          }
        )
        .then(xml => {
          console.log("171", "xml", xml);
          // 调OCX单路预览接口
          var spvxOcx = document.getElementById(id);
          if (xml.data) {
            var ret = 0;
            var opt = 0;
            switch (opt) {
              case 0:
                ret = spvxOcx.MPV_StartPreview(xml.data);
                break;
              case 1:
                ret = spvxOcx.MPV_StartPreviewBySelectedWnd(xml.data);
                break;
              case 2:
                var vWndIndex = $("#seledWndIndex option:selected").val();
                ret = spvxOcx.MPV_StartPreviewByWndIndex(
                  xml.data,
                  parseInt(vWndIndex, 10)
                );
                break;
              default:
                return;
            }
            if (ret != 0) {
              alert("预览失败：" + xml.data);
            }
          } else {
            var vDesc =
              "查询预览参数失败，" +
              nodes.errorMessage +
              ",错误码为：" +
              nodes.errorCode;
            alert(vDesc);
          }
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.monitor {
  width: 100%;
  height: 100%;
  #mainVideo {
    width: 100%;
    height: 100%;
  }
}
</style>

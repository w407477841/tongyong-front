import http from "@/axios";
import { url as base } from "@/axios/base.js";

export function createURL(url, param /*链接和参数*/) {
  let link = "";
  for (let k in param) {
    link += param[k] ? `&${k}=${param[k]}` : ``;
  }
  let myURL =
    base +
    url +
    "?auth=" +
    sessionStorage.getItem("auth").replace("xywg ", "") +
    link;
  return myURL.replace(" ", "");
}

export function downExcel(data, name) {
  //创建一个blob对象,file的一种
  let blob = new Blob([data], {
    type: "application/x-xls"
  });
  let link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  //配置下载的文件名
  link.download = `${name}.xls`;
  link.click();
  link.remove();
}

export function downPdf(data) {
  //创建一个blob对象,file的一种
  let blob = new Blob([data], {
    type: "application/pdf"
  });
  let link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  //配置下载的文件名
  link.download = `testout3.pdf`;
  link.click();
  link.remove();
}
//设备流量
export const getDeviceFlowList = params => {
  return http.post("/craneData/api/getDeviceFlow", params).then(res => res);
};
//设备循环工作时长
export const getMomentPercentList = params => {
  return http.post("/craneData/api/getMomentPercent", params).then(res => res);
};
//设备循环工作时长Excel
export const getMomentPercentExcel = params => {
  return http
    .post("/craneData/api/getMomentPercentExcel", params, {
      hasInterceptors: false
    })
    .then(res => downExcel(res, "设备循环工作时长"));
};
//力矩百分比过滤、重量次数
export const getMomentPercentInfo = params => {
  return http
    .post("/craneData/api/getMomentPercentInfo", params)
    .then(res => res);
};
//设备离线
export const deviceOffline = params => {
  return http.post("/craneData/api/deviceOffline", params).then(res => res);
};
//预警信息，报警信息，违规信息，
export const getWarnInfo = params => {
  return http.post("/craneData/api/getWarnInfo", params).then(res => res);
};
//预警等详情处理
export const selectAlarmInfoCount = params => {
  return http
    .post("/device/projectCrane/selectAlarmInfoCount", params)
    .then(res => res);
};
export const selectAlarmInfo = params => {
  return http.post("/craneData/api/selectAlarmInfo", params).then(res => res);
};
//详情处理
export const updateHandle = params => {
  return http.post("/craneData/api/updateHandle", params).then(res => res);
};
//设备列表
export const getDeviceList = params => {
  return http
    .post("/craneData/api/deviceList", params, {
      loading: false
    })
    .then(res => res);
};
//预警等详情
export const selectWorkGrade = params => {
  return http.post("/craneData/api/selectWorkGrade", params).then(res => res);
};
//设备台账
export const getDeviceAccount = params => {
  return http
    .post("/device/projectCrane/selectDeviceAccount", params)
    .then(res => res);
};
//分时段
export const getAnalysisList = params => {
  return http
    .post("/device/projectCrane/getAnalysisList", params)
    .then(res => res);
};
//日期排序
export const selectAnalysisListByDate = params => {
  return http
    .post("/device/projectCrane/selectAnalysisListByDate", params, {
      removePending: false
    })
    .then(res => res);
};
//综合平均数
export const selectAnalysisListAvg = params => {
  return http
    .post("/device/projectCrane/selectAnalysisListAvg", params, {
      removePending: false
    })
    .then(res => res);
};
//动画回放
export const playbackData = params => {
  return http.post("/craneData/api/playbackData", params).then(res => res);
};
//短信接口
export const sendMessage = params => {
  return http.post("/message/sendMessage", params).then(res => res);
};
//短信目标人员列表
export const userList = params => {
  return http.post("/message/userList", params).then(res => res);
};
//设备在线
export const selectIsOnline = params => {
  return http.post("/craneData/api/selectIsOnline", params).then(res => res);
};
//今日累计塔吊报警
export const craneAlarmCount = params => {
  return http.post("/homepage/craneAlarmCount", params).then(res => res);
};
//公告推送
export const craneNotice = params => {
  return http.post("/homepage/craneNotice", params).then(res => res);
};
//力矩百分比分析
export const getMomentInfo = params => {
  return http.post("/craneData/api/getMomentInfo", params).then(res => res);
};
//力矩百分比分析
export const towerIndex = params => {
  return http.post("/craneData/api/towerIndex", params).then(res => res);
};
//监控状态未受控
export const selectOfflineReasonPie = params => {
  return http
    .post("/project/realTimeMonitoringTower/selectOfflineReasonPie", params)
    .then(res => res);
};
//监控状态未受控
export const selectCraneStatus = params => {
  return http
    .post("/project/realTimeMonitoringTower/selectCraneStatus", params)
    .then(res => res);
};
//首页
export const billboard = params => {
  return http.post("/homepage/billboard", params).then(res => res);
};

//导出pdf
export const reportPDF = params => {
  return http.post("/craneToPdf/report", params).then(res => downPdf(res));
};

//打印pdf
export const printPDF = params => {
  return http.post("/craneToPdf/print", params).then(res => res);
};

import http from "@/axios";
import moment from "moment";
moment().format();
//列表
export const getListApi = params => {
  return http.post("/device/projectCrane/selectPageList", params).then(res => {
    return res;
  });
};
//详情
export const getInfoApi = params => {
  return http
    .post("/device/projectCrane/selectInfo", params, {
      loading: false
    })
    .then(res => {
      return res;
    });
};
//新增
export const insertInfoApi = params => {
  return http.post("/device/projectCrane/insertInfo", params).then(res => res);
};
//删除
export const deleteInfoApi = params => {
  return http.post("/device/projectCrane/deletes", params).then(res => res);
};
//编辑
export const updateInfoApi = params => {
  return http
    .post("/device/projectCrane/updateInfo", params, {
      loading: false
    })
    .then(res => res);
};
//启用
export const updateStatusApi = params => {
  return http
    .post("/device/projectCrane/updateStatus", params)
    .then(res => res);
};
//黑匣子编号判重
export const countApi = params => {
  return http
    .post("/device/projectCrane/checkByDeviceNoAndProjectId", params, {
      noError: false
    })
    .then(res => res);
};
//塔机编号判重
export const countApi2 = params => {
  return http
    .post("/device/projectCrane/checkByCraneNoAndProjectId", params, {
      noError: false
    })
    .then(res => res);
};
//SIM卡号判重
export const countApi3 = params => {
  return http
    .post("/device/projectCrane/checkByGprsAndProjectId", params, {
      noError: false
    })
    .then(res => res);
};
//获取项目列表
export const getProjectListApi = params => {
  return http
    .post("/projectManagement/projectInfo/selectListNoPage", params, {
      loading: false
    })
    .then(res => res);
};
//获取指标类型
export const getTargetListApi = params => {
  return http
    .post("infromation/projectTargetSetCrane/selectListNoPage", params, {
      loading: false
    })
    .then(res => res);
};
//不分页查询
export const getNoPageListApi = params => {
  return http
    .post("/device/projectCrane/selectListNoPage", params, {
      loading: false
    })
    .then(res => {
      return res;
    });
};
//占用处理
export const updateCellTimes = params => {
  return http
    .post("/infromation/projectTargetSetCrane/updateCellTimes", params)
    .then(res => res);
};
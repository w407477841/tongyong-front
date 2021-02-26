import http from '@/axios'
import moment from 'moment';
//列表
export const getListApi = params => {return http.post('/device/projectLift/selectPageList',params).then(res => res); };
//详情
export const getInfoApi = params => {return http.post('/device/projectLift/selectInfo',params,{loading : false}).then(res => res); };
//新增
export const insertInfoApi = params => {return http.post('/device/projectLift/insertProjectLift',params).then(res => res); };
//删除
export const deleteInfoApi = params => {return http.post('/device/projectLift/deletes',params).then(res => res); };
//编辑
export const updateInfoApi = params => {return http.post('/device/projectLift/updateProjectLift',params).then(res => res); };
//启用
export const updateStatusApi = params => {return http.post('/device/projectLift/updateStatus', params).then(res => res); };
//获取项目列表
export const getProjectListApi = params => {return http.post('/projectManagement/projectInfo/selectListNoPage',params).then(res => res); };

// //获取明细列表
// export const getDetailListApi = params => {return http.get('/device/projectEnvironmentMonitorDetail/selectPageList',{ params : params}).then(res =>{
//     res.list.forEach(el => {

//         el.deviceTime = moment(el.deviceTime).format("YYYY-MM-DD");
//     });
//     return res
// }

// ); };

//获取指标类型
export const getTargetListApi = params => {return http.post('/infromation/projectTargetSetLift/selectListNoPage',params).then(res => res); };
//获取报警统计信息
// export const getAlarmListApi = params => {return http.get('/device/projectLift/selectPageList',{ params : params}).then(res => res); };
//根据类型查询报警详细
// export const getAlarmDetailApi = params => {return http.get('/device/projectLift/getDetailAlarm',{ params : params}).then(res => res); };
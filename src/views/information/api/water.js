import http from '@/axios';
import moment from 'moment';

//季晓君
//实时监控(水表)
//获取实时监控水表信息
export const selectWaterData = params => {return http.post('/device/projectWaterMeter/selectWaterData',params).then(res => res); };
//获取监控状态
export const selectMonitorStatus = params => {return http.post('/device/projectWaterMeter/selectMonitorStatus',params).then(res => res); };
//获取运行数据
export const selectRunData = params => {return http.post('/device/projectWaterMeter/selectRunData',params).then(res => res); };
//获取报警条数
export const selectWarningAlarm = params => {return http.post('/device/projectWaterMeter/selectWarningAlarm',params).then(res => res); };
//获取报警详情
export const selectAlarmData = params => {return http.post('/device/projectWaterMeter/selectAlarmData',params).then(res => res); };
//新增短信
export const insertMessage = params => {return http.post('/device/projectMessageWater/insert',params).then(res => res); };

//获取项目下拉列表信息
export const selectProjectInfo = params => { return http.post('/projectManagement/projectInfo/selectProjectInfo', params).then(res => res); };
//获取用户不分页
export const selectUser = params => { return http.post('/system/user/selectUser', params).then(res => res); };
//获取短信模板
export const getMessModleListApi = params => {return http.post('/information/projectMessage/selectUseList',params).then(res => res); };
//获取不分页列表
export const selectWaterList = params => {return http.post('/device/projectWaterMeter/selectWaterList',params).then(res => res); };

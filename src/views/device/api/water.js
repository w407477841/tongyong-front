import http from '@/axios';
import moment from 'moment';

//季晓君
//设备管理
//新增
export const insertWater = params => {return http.post('/device/projectWaterMeter/insert',params).then(res => res); };
//获取列表
export const selectWater = params => {return http.post('/device/projectWaterMeter/selectWater',params).then(res => res); };
//根据id获取详情
export const selectWaterById = params => {return http.post('/device/projectWaterMeter/selectWaterById',params).then(res => res); };
//编辑
export const updateWater = params => {return http.post('/device/projectWaterMeter/update',params).then(res => res); };
//删除
export const deletesWater = params => {return http.post('/device/projectWaterMeter/deletes',params).then(res => res); };
//启用
export const setUse = params => {return http.post('/device/projectWaterMeter/setUse',params).then(res => res); };
//停用
export const setDis = params => {return http.post('/device/projectWaterMeter/setDis',params).then(res => res); };
//获取指标类型
export const selectListNoPage = params => {return http.post('/information/projectTargetSetWater/selectListNoPage',params).then(res => res); };

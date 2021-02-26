import http from '@/axios';
import moment from 'moment';

//季晓君
//水表指标设置
//获取列表
export const selectTargetSetWater = params => {return http.post('/information/projectTargetSetWater/selectTargetSetWater',params).then(res => res); };
//获取列表
export const insertTargetSetWater = params => {return http.post('/information/projectTargetSetWater/insert',params).then(res => res); };
//获取列表
export const updateTargetSetWater = params => {return http.post('/information/projectTargetSetWater/update',params).then(res => res); };
//获取列表
export const deleteTargetSetWater = params => {return http.post('/information/projectTargetSetWater/deletes',params).then(res => res); };
//获取列表
export const selectTargetSetWaterById = params => {return http.post('/information/projectTargetSetWater/get',params).then(res => res); };

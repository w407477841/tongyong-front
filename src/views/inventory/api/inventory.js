import http from '@/axios'
import moment from 'moment';
//列表
export const getListApi = params => {return http.post('/device/helmet/selectPageList',params).then(res => res); };
//获取项目列表
export const getProjectListApi = params => {return http.post('/projectManagement/projectInfo/selectListNoPage',params,{loading:false}).then(res => res); };

//项目调拨
export const projectTransfersApi = params => {return http.post('/device/helmet/projectTransfers', params).then(res => res); };
//人员调拨
export const personTransfersApi = params => {return http.post('/device/helmet/personTransfers', params).then(res => res); };

//删除
export const deleteInfoApi = params => {return http.post('/device/helmet//deletes',params).then(res => res); };

//启用
export const updateStatusApi = params => {return http.post('/device/helmet/updateStatus', params).then(res => res); };
//详情
export const getInfoApi = params => {return http.post('/device/helmet/selectInfo',params,{loading:false}).then(res => res); };

//新增或者编辑
export const updateOrInsertProjectHelmet = params => {return http.post('/device/helmet/updateOrInsertProjectHelmet',params).then(res => res); };


//------------------------------------------------------------------------------------------------------------------------------------------------
//库存列表
export const getStockListApi = params => {return http.post('/device/helmetStock/selectPageList',params).then(res => res); };

//单个入库
export const stockPutApi = params => {return http.post('/device/helmetStock/stockPut',params).then(res => res); };

//出库
export const stockOutApi = params => {return http.post('/device/helmetStock/stockOut',params).then(res => res); };

//删除库存
export const deleteStockApi = params => {return http.post('/device/helmetStock/deleteStock',params).then(res => res); };


import http from '@/axios'
import moment from 'moment';
//列表
export const getListApi = params => {return http.post('/device/projectElectricPower/selectPageList',params).then(res => res); };
//详情
 export const getInfoApi = params => {return http.post('/device/projectElectricPower/selectInfo',params).then(res => res); };
//合计
export const countApi = params => {return http.post('/device/projectElectricPower/countDevice', params).then(res => res); };  
//新增
export const insertInfoApi = params => {return http.post('/device/projectElectricPower/insertInfo',params).then(res => res); };
//删除
export const deleteInfoApi = params => {return http.post('/device/projectElectricPower/deletes',params).then(res => res); };
//编辑
export const updateInfoApi = params => {return http.post('/device/projectElectricPower/updateInfo',params).then(res => res); };
//启用
export const updateStatusApi = params => {return http.post('/device/projectElectricPower/updateStatus', params).then(res => res); };
//获取项目列表
export const getProjectListApi = params => {return http.post('/projectManagement/projectInfo/selectListNoPage',params).then(res => res); };
// //获取明细列表
// export const getDetailListApi = params => {return http.get('/device/projectElectricPowerDetail/selectPageList',{ params : params}).then(res =>{
//     res.list.forEach(el => {
       
//         el.deviceTime = moment(el.deviceTime).format("YYYY-MM-DD");
//     });
//     return res
// } 
   
// ); };

//获取指标类型
export const getTargetListApi = params => {return http.post('/infromation/projectTargetSetElectric/selectListNoPage',params).then(res => res); };

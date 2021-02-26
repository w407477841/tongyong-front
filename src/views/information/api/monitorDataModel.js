import http from '@/axios'
import moment from 'moment';
moment().format();
//列表
export const getListApi = params => {
    return http.post('/information/projectEnvironmentMonitorDataModel/selectPageList', params).then(res => {
        return res;
    });
};
//详情
export const getInfoApi = params => {
    return http.post('/information/projectEnvironmentMonitorDataModel/get', params ).then(res => {
        return res;
    });
};
//新增
export const insertInfoApi = params => { return http.post('/information/projectEnvironmentMonitorDataModel/insertModel', params).then(res => res); };
//删除
export const deleteInfoApi = params => { return http.post('/information/projectEnvironmentMonitorDataModel/deletes', params).then(res => res); };
//编辑
export const updateInfoApi = params => { return http.post('/information/projectEnvironmentMonitorDataModel/updateModel', params).then(res => res); };
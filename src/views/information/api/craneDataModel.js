import http from '@/axios'
import moment from 'moment';
moment().format();
//列表
export const getListApi = params => {
    return http.post('/information/projectCraneDataModel/selectPageList', params).then(res => {
        return res
    });
};
//详情
export const getInfoApi = params => {
    return http.post('/information/projectCraneDataModel/get', params ).then(res => {
        return res;
    });
};
//新增
export const insertInfoApi = params => { return http.post('/information/projectCraneDataModel/insertModel', params).then(res => res); };
//删除
export const deleteInfoApi = params => { return http.post('/information/projectCraneDataModel/deletes', params).then(res => res); };
//编辑
export const updateInfoApi = params => { return http.post('/information/projectCraneDataModel/updateModel', params).then(res => res); };
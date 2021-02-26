import http from '@/axios'
import moment from 'moment';
moment().format();
//列表
export const getListApi = params => {
    return http.post('/infromation/projectTargetSetLift/selectPageList', params).then(res => {
        return res
    });
};
//详情
export const getInfoApi = params => {
    return http.post('/infromation/projectTargetSetLift/get', params ).then(res => {
        return res;
    });
};
//新增
export const insertInfoApi = params => { return http.post('/infromation/projectTargetSetLift/insert', params).then(res => res); };
//删除
export const deleteInfoApi = params => { return http.post('/infromation/projectTargetSetLift/deletes', params).then(res => res); };
//编辑
export const updateInfoApi = params => { return http.post('/infromation/projectTargetSetLift/update', params).then(res => res); };
//判重
export const check = params => { return http.post('/infromation/projectTargetSetLift/checkBySpecificationAndManufactor', params ).then(res => res); };
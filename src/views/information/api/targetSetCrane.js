import http from '@/axios'
import moment from 'moment';
moment().format();
//列表
export const getListApi = params => {
    return http.post('/infromation/projectTargetSetCrane/selectPageList', params).then(res => {
        return res
    });
};
//详情
export const getInfoApi = params => {
    return http.post('/infromation/projectTargetSetCrane/get', params).then(res => {
        return res;
    });
};
//新增
export const insertInfoApi = params => {
    return http.post('/infromation/projectTargetSetCrane/insert', params).then(res => res);
};
//删除
export const deleteInfoApi = params => {
    return http.post('/infromation/projectTargetSetCrane/deletes', params).then(res => res);
};
//编辑
export const updateInfoApi = params => {
    return http.post('/infromation/projectTargetSetCrane/update', params).then(res => res);
};
//判重
export const check = params => {
    return http.post('/infromation/projectTargetSetCrane/checkBySpecificationAndManufactor', params).then(res => res);
};
//不分页查询
export const getNoPageListApi = params => {
    return http.post('/device/projectCrane/selectListMap', params).then(res => {
        return res
    });
};
import http from '@/axios'
import moment from 'moment';
moment().format();
//列表
export const getListApi = params => {
    return http.post('/infromation/projectTargetSetElectric/selectPageList', params).then(res => {
        return res
    });
};
//详情
export const getInfoApi = params => {
    return http.post('/infromation/projectTargetSetElectric/get', params ).then(res => {
        return res;
    });
};
//新增
export const insertInfoApi = params => { return http.post('/infromation/projectTargetSetElectric/insert', params).then(res => res); };
//删除
export const deleteInfoApi = params => { return http.post('/infromation/projectTargetSetElectric/deletes', params).then(res => res); };
//编辑
export const updateInfoApi = params => { return http.post('/infromation/projectTargetSetElectric/update', params).then(res => res); };
//判重
export const check = params => { return http.post('/infromation/projectTargetSetElectric/checkBySpecificationAndManufactor', params,{loading:false} ).then(res => res); };

//不分页查询
export const getNoPageListApi = params => {
    return http.post('/device/projectElectricPower/selectListMap', params).then(res => {
        return res
    });
};

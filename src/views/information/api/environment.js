import http from '@/axios'
import moment from 'moment';
moment().format();
//列表
export const getListApi = params => {
    return http.post('/infromation/projectTargetSetEnvironment/selectPageList', params).then(res => {
        return res
    });
};
//详情
export const getInfoApi = params => {
    return http.post('/infromation/projectTargetSetEnvironment/get', params ).then(res => {
        return res;
    });
};
//新增
export const insertInfoApi = params => { return http.post('/infromation/projectTargetSetEnvironment/insert', params).then(res => res); };
//删除
export const deleteInfoApi = params => { return http.post('/infromation/projectTargetSetEnvironment/deletes', params).then(res => res); };
//编辑
export const updateInfoApi = params => { return http.post('/infromation/projectTargetSetEnvironment/update', params).then(res => res); };
//判重
export const check = params => { return http.post('/infromation/projectTargetSetEnvironment/checkBySpecificationAndManufactor', params ).then(res => res); };

//不分页查询
export const getNoPageListApi = params => {
    return http.post('/device/projectEnvironmentMonitor/selectListMap', params).then(res => {
        return res
    });
};


//不分页查询
export const getNoPageListApi2 = params => {
    return http.post('/device/projectLift/selectListMap', params).then(res => {
        return res
    });
};
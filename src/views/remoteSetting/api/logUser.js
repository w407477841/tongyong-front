import http from '@/axios'
import moment from 'moment';
moment().format();
//列表
export const getListApi = params => {
    return http.post('/remoteSetting/logUser/getPageList', params).then(res => {
        return res
    });
};
//详情
export const getInfoApi = params => {
    return http.post('/remoteSetting/logUser/getInfoById', params).then(res => {
        return res;
    });
};
//新增
export const insertInfoApi = params => {
    return http.post('/remoteSetting/logUser/insertModel', params).then(res => res);
};


//编辑
export const updateInfoApi = params => {
    return http.post('/remoteSetting/logUser/update', params).then(res => res);
};

//删除
export const deleteInfoApi = params => {
    return http.post('/remoteSetting/logUser/deletes', params).then(res => res);
};

//获取用户
export const getUserListApi = params => {
    return http.post('/system/user/selectUserByLogin', params).then(res => {
        return res
    });
};



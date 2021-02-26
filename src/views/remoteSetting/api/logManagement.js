import http from '@/axios'
import moment from 'moment';
moment().format();
//列表
export const getListApi = params => {
    return http.post('/remoteSetting/deviceLog/getPageList', params).then(res => {
        return res
    });
};

//设备重启
export const deviceReboot = params => {
    return http.post('/remoteSetting/deviceLog/deviceReboot', params).then(res => res);
};

//详情
export const getExceptionLogApi = params => {
    return http.post('/remoteSetting/deviceLog/getExceptionLog', params).then(res => {
        return res;
    });
};

//详情
export const getExceptionSMSLog = params => {
    return http.post('/remoteSetting/deviceLog/getExceptionSMSLog', params).then(res => {
        return res;
    });
};

//详情
export const getRebootLogApi = params => {
    return http.post('/remoteSetting/deviceLog/getRebootLog', params).then(res => {
        return res;
    });
};

//获取塔吊校准设置履历
export const getCalibrationSetApi = params => {
    return http.post('/remoteSetting/deviceLog/getCalibrationSet', params).then(res => {
        return res;
    });
};


//获取塔吊单机防碰撞设置履历
export const getCraneSingleCollisionAvoidanceSetApi = params => {
    return http.post('/remoteSetting/deviceLog/getCraneSingleCollisionAvoidanceSet', params).then(res => {
        return res;
    });
};


/*//新增
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
};*/





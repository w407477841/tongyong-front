import http from '@/axios'
import moment from 'moment';
//列表
export const getListApi = params => {
    return http.post('/device/projectEnvironmentMonitor/selectPageList', params).then(res => res);
};
//详情
export const getInfoApi = params => {
    return http.post('/device/projectEnvironmentMonitor/selectInfo', params, {
        loading: false
    }).then(res => res);
};
//合计
export const countApi = params => {
    return http.post('/device/projectEnvironmentMonitor/countDevice', params).then(res => res);
};
//新增
export const insertInfoApi = params => {
    return http.post('/device/projectEnvironmentMonitor/insertInfo', params).then(res => res);
};
//删除
export const deleteInfoApi = params => {
    return http.post('/device/projectEnvironmentMonitor/deletes', params).then(res => res);
};
//编辑
export const updateInfoApi = params => {
    return http.post('/device/projectEnvironmentMonitor/updateInfo', params).then(res => res);
};
//启用
export const updateStatusApi = params => {
    return http.post('/device/projectEnvironmentMonitor/updateStatus', params).then(res => res);
};
//获取项目列表
export const getProjectListApi = params => {
    return http.post('/projectManagement/projectInfo/selectListNoPage', params, {
        loading: false
    }).then(res => res);
};
//获取项目列表
export const getSprayList = params => {
    return http.post('/device/projectSpray/getPageList', params, {
        loading: false
    }).then(res => res);
};

//获取项目列表
export const getList = params => {
    return http.post('/device/projectSprayBind/getList', params, {
        loading: false
    }).then(res => res);
};

//获取项目列表
export const add = params => {
    return http.post('/device/projectSprayBind/add', params, {
        loading: false
    }).then(res => res);
};
// //获取明细列表
// //获取明细列表
// export const getDetailListApi = params => {return http.get('/device/projectEnvironmentMonitorDetail/selectPageList',{ params : params}).then(res =>{
//     res.list.forEach(el => {

//         el.deviceTime = moment(el.deviceTime).format("YYYY-MM-DD");
//     });
//     return res
// } 

// ); };

//获取指标类型
export const getTargetListApi = params => {
    return http.post('/infromation/projectTargetSetEnvironment/selectListNoPage', params, {
        loading: false
    }).then(res => res);
};
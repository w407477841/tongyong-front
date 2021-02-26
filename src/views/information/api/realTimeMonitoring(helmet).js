import http from '@/axios'
import moment from 'moment';
//列表
export const getListApi = params => {
    return http.post('/device/helmet/selectPageList', params).then(res => res);
};
//获取项目列表
export const getProjectListApi = params => {
    return http.post('/projectManagement/projectInfo/selectListNoPage', params, {
        loading: false
    }).then(res => res);
};

//删除
export const deleteInfoApi = params => {
    return http.post('/device/helmet//deletes', params).then(res => res);
};

//启用
export const updateStatusApi = params => {
    return http.post('/device/helmet/updateStatus', params).then(res => res);
};
//详情
export const getInfoApi = params => {
    return http.post('/device/helmet/selectInfo', params, {
        loading: false
    }).then(res => res);
};

//新增或者编辑
export const updateOrInsertProjectHelmet = params => {
    return http.post('/device/helmet/updateOrInsertProjectHelmet', params).then(res => res);
};


/*

//合计
export const countApi = params => {return http.post('/device/projectEnvironmentMonitor/countDevice', params).then(res => res); };  


//编辑
export const updateInfoApi = params => {return http.post('/device/projectEnvironmentMonitor/updateInfo',params).then(res => res); };


// //获取明细列表
// export const getDetailListApi = params => {return http.get('/device/projectEnvironmentMonitorDetail/selectPageList',{ params : params}).then(res =>{
//     res.list.forEach(el => {
       
//         el.deviceTime = moment(el.deviceTime).format("YYYY-MM-DD");
//     });
//     return res
// } 
   
// ); };

//获取指标类型
export const getTargetListApi = params => {return http.post('/infromation/projectTargetSetEnvironment/selectListNoPage',params,{loading:false}).then(res => res); };
*/
//获取监控状态
export const selectMonitorStatus = params => {
    return http.get('/device/projectHelmetHeartbeat/selectMonitorStatus', {
        params: params
    }).then(res => res);
};

//获取运行数据
export const getRunData = params => {
    return http.get('/device/projectHelmetHealthDetail/getDetailsById', {
        params: params
    }).then(res => res);
};

//获取报警信息
export const getAlarmMessage = params => {
    return http.get('/device/helmet/getAlarmMessage', {
        params: params
    }).then(res => res);
};

//获取报警信息
export const getListByHelmetId = params => {
    return http.get('/device/helmet/getListByHelmetId', {
        params: params
    }).then(res => res);
};
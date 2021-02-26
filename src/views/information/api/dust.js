import http from '@/axios'
import moment from 'moment';
moment().format();
//主页列表
export const getListApi = params => {
    return http.post('/device/projectEnvironmentMonitor/selectPageList', params).then(res => {
        return res
    });
};

//获取监控状态列表
export const getMonitorStatusListApi = params => {
    return http.post('/project/projectEnvironmentMonitorHeartbeat/selectPageList', params).then(res => {
        return res
    });
};

//获取运行数据列表
export const geoperationDataListApi = params => {
    return http.post('/project/projectEnvironmentMonitorDetail/selectPageList', params).then(res => {
        return res
    });
};

//获取报警信息统计列表
export const countWarningMessageList = params => {
    return http.post('/project/projectEnvironmentMonitorAlarm/countAlarmByDeviceNo', params).then(res => {
        return res
    });
};

//获取报警信息统计列表详情
export const countAlarmByDeviceNoDetail = params => {
    return http.post('/project/projectEnvironmentMonitorAlarm/countAlarmByDeviceNoDetail', params).then(res => {
        return res
    });
};

//获取工人下拉
export const getWorkerInfo = params => {
    return http.post('/project/projectEnvironmentMonitorAlarm/getWorkListByMonitorId', params).then(res => {
        return res
    });
};
//获取人员列表
export const getUserListApi = params => {
    return http.post('/baseInfo/projectUser/selectUser', params).then(res => res);
};

//获取短信模板下拉
export const getSMSTemplateList = params => {
    return http.post('/project/projectEnvironmentMonitorAlarm/getSMSModel', params).then(res => {
        return res
    });
};

//短信发送
export const handleSMSSubmit = params => {
    return http.post('/project/projectEnvironmentMonitorAlarm/handleSMSSubmit', params).then(res => {
        return res
    });
};

//图表
export const changeToEcharts = params => {
    return http.get('/project/projectEnvironmentMonitorDetail/changeToChart', {
        params: params
    }).then(res => {
        return res
    });
};
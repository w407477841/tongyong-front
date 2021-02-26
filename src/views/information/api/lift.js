import http from '@/axios'
import moment from 'moment';
moment().format();
//主页列表
export const realTimeMonitoring = params => {
    return http.post('/project/projectLiftAlarm/realTimeMonitoring', params).then(res => {
        res.data.list.forEach(el => {
            el.isOnline = el.isOnline == 1 ? "在线" : el.isOnline == 0 ? "离线" : "";

        });
        return res;
    });
};

//查询监控状态
export const selectMonitorStatus = params => {
    return http.post('/project/projectLiftDetail/selectMonitorStatus', params).then(res => {
        res.data.list.forEach(el => {
            if (el.endTime != null) {
                el.duration = el.endTime - el.createTime;
                var time = el.duration / 1000;
                var day = 0;
                if (time >= 86400) {
                    day = parseInt(time / 86400) + "天";
                    time = time % 86400;
                }
                if (time > 60 && time < 60 * 60) {
                    time = parseInt(time / 60.0) + "分钟" + parseInt((parseFloat(time / 60.0) -
                        parseInt(time / 60.0)) * 60) + "秒";
                } else if (time >= 60 * 60 && time < 60 * 60 * 24) {
                    time = parseInt(time / 3600.0) + "小时" + parseInt((parseFloat(time / 3600.0) -
                            parseInt(time / 3600.0)) * 60) + "分钟" +
                        parseInt((parseFloat((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) -
                            parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60)) * 60) + "秒";
                } else {
                    time = parseInt(time) + "秒";
                }

                if (day == 0) {
                    el.duration = time;
                } else el.duration = day + time;

            }
            el.createTime = moment(el.createTime).format('YYYY-MM-DD HH:mm:ss');
            el.endTime = moment(el.endTime).format('YYYY-MM-DD HH:mm:ss');

            el.status = el.status == 1 ? "受控" : el.status == 0 ? "未受控" : "";

        });
        return res;
    });
};
//查询运行数据
export const selectOperationData = params => {
    return http.post('/project/projectLiftDetail/selectOperationData', params).then(res => {
        res.data.list.forEach(el => {
            el.deviceTime = moment(el.deviceTime).format('YYYY-MM-DD HH:mm:ss');
            el.status = el.status == 1 ? "受控" : el.status == 0 ? "未受控" : "";
        });
        return res;
    });
};
//获取预警数量
export const countEarlyWarning = params => {
    return http.post('/project/projectLiftAlarm/countEarlyWarning', params).then(res => res);
};
//获取警告数量
export const countCallWarning = params => {
    return http.post('/project/projectLiftAlarm/countCallWarning', params).then(res => res);
};
//获取违法数量
export const countViolation = params => {
    return http.post('/project/projectLiftAlarm/countViolation', params).then(res => res);
};


//获取预警详情
export const earlyWarningDetail = params => {
    return http.post('/project/projectLiftAlarm/earlyWarningDetail', params).then(res => {
        res.data.list.forEach(el => {
            el.createTime = moment(el.createTime).format('YYYY-MM-DD HH:mm:ss');

        });
        return res;
    });
};

//获取人员列表
export const getUserListApi = params => {
    return http.post('/baseInfo/projectUser/selectUser', params).then(res => res);
};
//获取短信模板
export const getMessModleListApi = params => {
    return http.post('/information/projectMessage/selectPageList', params).then(res => res);
};

//获取监控状态列表
export const getMonitorStatusListApi = params => {
    return http.post('/project/projectEnvironmentMonitorDetail/selectPageList', params).then(res => {
        return res
    });
};

//获取运行数据列表
export const geoperationDataListApi = params => {
    return http.post('/project/projectEnvironmentMonitorDetail/selectPageList', params).then(res => {
        return res
    });
};
//发送短信
export const insertMessage = params => {
    return http.post('/project/projectLiftAlarm/insertMessage', params).then(res => res);
};

//图表
export const changeToEcharts = params => {
    return http.get('/project/projectLiftDetail/changeToChart', {
        params: params
    }).then(res => {
        return res
    });
};
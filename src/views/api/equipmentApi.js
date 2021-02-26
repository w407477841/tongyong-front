import http from '@/axios';
import moment from 'moment';

//季晓君
//人员信息
//新增
export const insertUser = params => {
    return http.post('/baseInfo/projectUser/insert', params).then(res => res);
};
//修改
export const updateUser = params => {
    return http.post('/baseInfo/projectUser/update', params).then(res => res);
};
//批量删除
export const deleteUsers = params => {
    return http.post('/baseInfo/projectUser/deletes', params).then(res => res);
};
//获取列表
export const getUser = params => {
    return http.post('/baseInfo/projectUser/selectUserInfo', params).then(res => res);
};
//根据id获取信息
export const getUserById = params => {
    return http.post('/baseInfo/projectUser/get', params, {
        loading: false
    }).then(res => res);
};
//获取人员列表
export const getUserListApi = params => {
    return http.post('/baseInfo/projectUser/selectUser', params).then(res => res);
};

//项目信息
//新增
export const insertPorject = params => {
    return http.post('/projectManagement/projectInfo/insert', params).then(res => res);
};
//修改
export const updatePorject = params => {
    return http.post('/projectManagement/projectInfo/update', params).then(res => res);
};
//批量删除
export const deletePorjects = params => {
    return http.post('/projectManagement/projectInfo/deletes', params).then(res => res);
};
//获取列表
export const getPorject = params => {
    return http.post('/projectManagement/projectInfo/selectProjectList', params).then(res => res);
};
//根据id获取信息
export const getProjectById = params => {
    return http.post('/projectManagement/projectInfo/selectProjectById', params, {
        loading: false
    }).then(res => res);
};
//获取项目信息
export const selectProject = params => {
    return http.post('/projectManagement/projectInfo/selectProject', params).then(res => res);
};
//获取项目下拉列表信息
export const selectProjectInfo = params => {
    return http.post('/projectManagement/projectInfo/selectProjectInfo', params).then(res => res);
};
//绑定智慧工地
export const bindingProject = params => {
    return http.post('/projectManagement/projectInfo/bindingProject', params).then(res => res);
};
//获取智慧工地项目
export const getSmartProject = params => {
    return http.post('/projectManagement/projectInfo/getSmartProject', params).then(res => res);
};
//获取区域列表
export const selectArea = params => {
    return http.post('/projectManagement/projectArea/selectArea', params, {
        loading: false
    }).then(res => res);
};
//审批
export const approve = params => {
    return http.post('/projectManagement/projectInfo/approve', params, {
        loading: false
    }).then(res => res);
};
//审批
export const changeOrg = params => {
    return http.post('/projectManagement/projectInfo/changeOrg', params, {
        loading: false
    }).then(res => res);
};

//证书类型
//获取证书类型
export const selectCetificateType = params => {
    return http.post('/baseInfo/projectMasterCetificateType/selectCetificateType', params, {
        loading: false
    }).then(res => res);
};



//设备类型
//新增
export const insertDeviceType = params => {
    return http.post('/baseInfo/masterDeviceType/insert', params).then(res => res);
};
//修改
export const updateDeviceType = params => {
    return http.post('/baseInfo/masterDeviceType/update', params).then(res => res);
};
//批量删除
export const deleteDeviceTypes = params => {
    return http.post('/baseInfo/masterDeviceType/deletes', params).then(res => res);
};
//获取列表
export const getDeviceType = params => {
    return http.post('/baseInfo/masterDeviceType/selectDeviceTypeInfo', params).then(res => res);
};
//根据id获取信息
export const getDeviceTypeById = params => {
    return http.post('/baseInfo/masterDeviceType/get', params).then(res => res);
};

//获取部门信息
export const selectOrganizationInfo = params => {
    return http.post('system/organization/selectOrganizationInfo', params, {
        loading: false
    }).then(res => res);
};

//获取当前部门下所有部门
export const selectUnderOrganization = params => {
    return http.post('system/organization/selectUnderOrganization', params, {
        loading: false
    }).then(res => res);
};

//获取塔吊信息
export const selectCrane = params => {
    return http.post('/project/realTimeMonitoringTower/selectCrane', params).then(res => res);
};
//获取塔吊详情
export const selectCraneData = params => {
    return http.post('/project/realTimeMonitoringTower/selectCraneData', params).then(res => res);
};
export const selectWeightData = params => {
    return http.post('/project/realTimeMonitoringTower/selectWeightData', params).then(res => res);
};
//获取预警条数
export const selectPromptingAlarm = params => {
    return http.post('/project/realTimeMonitoringTower/selectPromptingAlarm', params).then(res => res);
};
//获取报警条数
export const selectWarningAlarm = params => {
    return http.post('/project/realTimeMonitoringTower/selectWarningAlarm', params).then(res => res);
};
//获取违章条数
export const selectViolationAlarm = params => {
    return http.post('/project/realTimeMonitoringTower/selectViolationAlarm', params).then(res => res);
};
//获取信息详情
export const selectAlarmData = params => {
    return http.post('/project/realTimeMonitoringTower/selectAlarmData', params).then(res => res);
};
//发送短信
export const insertMessage = params => {
    return http.post('/project/realTimeMonitoringTower/insertMessage', params).then(res => res);
};
//获取监控状态
export const selectMonitorStatus = params => {
    return http.post('/project/realTimeMonitoringTower/selectMonitorStatus', params).then(res => res);
};
//获取运行时间
export const selectRunTime = params => {
    return http.post('/project/realTimeMonitoringTower/selectRunTime', params).then(res => res);
};

//获取短信模板
export const getMessModleListApi = params => {
    return http.post('/information/projectMessage/selectUseList', params).then(res => res);
};


//获取用户不分页
export const selectUser = params => {
    return http.post('/system/user/selectUser', params).then(res => res);
};

//图表
export const changeToEcharts = params => {
    return http.get('/device/projectCraneDetail/changeToChart', {
        params: params
    }).then(res => {
        return res
    });
};
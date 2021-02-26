import http from '@/axios'
//列表
export const getListApi = params => {
    return http.post('/device/projectSpray/getPageList', params).then(res => res);
};
//详情
export const insertInfoApi = params => {
    return http.post('/device/projectSpray/insert', params, {
        loading: false
    }).then(res => res);
};
//详情
export const updateInfoApi = params => {
    return http.post('/device/projectSpray/update', params, {
        loading: false
    }).then(res => res);
};
//获取项目列表
export const getProjectListApi = params => {
    return http.post('/projectManagement/projectInfo/selectListNoPage', params, {
        loading: false
    }).then(res => res);
};

//详情
export const getInfoApi = params => {
    return http.post('/device/projectSpray/selectInfo', params).then(res => {
        return res;
    });
};

//详情
export const check = params => {
    return http.post('/device/projectSpray/checkByDeviceNo', params).then(res => {
        return res;
    });
};

export const deleteInfoApi = params => {
    return http.post('/device/projectSpray/deletes', params).then(res => res);
};

export const handleRebootApi = params => {
    return http.post('/device/projectSpray/deviceReboot', params).then(res => res);
};

export const handleDeviceOpenCloseApi = params => {
    return http.post('/device/projectSpray/deviceOpenClose', params).then(res => res);
};

export const getBySprayId = params => {
    return http.post('/device/projectSprayDetail/getBySprayId', params).then(res => res);
};
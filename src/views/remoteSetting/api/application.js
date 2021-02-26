import http from '@/axios'

//新增
export const insertApp = params => {
    return http.post('/remoteSetting/projectApplicationConfig/insert', params).then(res => {
        return res
    });
};

//编辑
export const updateApp = params => {
    return http.post('/remoteSetting/projectApplicationConfig/update', params).then(res => {
        return res
    });
};

//删除
export const deleteApp = params => {
    return http.post('/remoteSetting/projectApplicationConfig/deletes', params).then(res => {
        return res
    });
};

//列表
export const selectAppList = params => {
    return http.post('/remoteSetting/projectApplicationConfig/selectList', params).then(res => {
        return res
    });
};

//单条查询
export const selectAppById = params => {
    return http.post('/remoteSetting/projectApplicationConfig/get', params).then(res => {
        return res
    });
};

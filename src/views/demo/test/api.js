import http from '@/axios';
//新增
export const insertDemoTest = params => {
    return http.post('/demo/test/insert', params).then(res => res);
};
//修改
export const updateDemoTest = params => {
    return http.post('/demo/test/update', params).then(res => res);
};
//批量删除
export const deleteDemoTests = params => {
    return http.post('/demo/test/deletes', params).then(res => res);
};
//获取列表
export const getDemoTests = params => {
    return http.post('/demo/test/selectList', params).then(res => res);
};
//根据id获取信息
export const getDemoTestById = params => {
    return http.post('/demo/test/get', params).then(res => res);
};
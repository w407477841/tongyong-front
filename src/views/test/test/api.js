import http from '@/axios';
//新增
export const insertTest = params => {
    return http.post('/test/test/insert', params).then(res => res);
};
//修改
export const updateTest = params => {
    return http.post('/test/test/update', params).then(res => res);
};
//批量删除
export const deleteTests = params => {
    return http.post('/test/test/deletes', params).then(res => res);
};
//获取列表
export const getTests = params => {
    return http.post('/test/test/selectList', params).then(res => res);
};
//根据id获取信息
export const getTestById = params => {
    return http.post('/test/test/get', params).then(res => res);
};
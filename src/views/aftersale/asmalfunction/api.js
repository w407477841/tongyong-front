import http from '@/axios';
//新增
export const insertAsMalfunction = params => {
    return http.post('/aftersale/as-malfunction/insert', params).then(res => res);
};
//修改
export const updateAsMalfunction = params => {
    return http.post('/aftersale/as-malfunction/update', params).then(res => res);
};
//批量删除
export const deleteAsMalfunctions = params => {
    return http.post('/aftersale/as-malfunction/deletes', params).then(res => res);
};
//获取列表
export const getAsMalfunctions = params => {
    return http.post('/aftersale/as-malfunction/selectList', params).then(res => res);
};
//根据id获取信息
export const getAsMalfunctionById = params => {
    return http.post('/aftersale/as-malfunction/get', params).then(res => res);
};
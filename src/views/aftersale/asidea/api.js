import http from '@/axios';
//新增
export const insertAsIdea = params => {
    return http.post('/aftersale/as-idea/insert', params).then(res => res);
};
//修改
export const updateAsIdea = params => {
    return http.post('/aftersale/as-idea/update', params).then(res => res);
};
//批量删除
export const deleteAsIdeas = params => {
    return http.post('/aftersale/as-idea/deletes', params).then(res => res);
};
//获取列表
export const getAsIdeas = params => {
    return http.post('/aftersale/as-idea/selectList', params).then(res => res);
};
//根据id获取信息
export const getAsIdeaById = params => {
    return http.post('/aftersale/as-idea/get', params).then(res => res);
};
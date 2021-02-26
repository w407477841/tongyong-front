import http from '@/axios';
//新增
export const insertBasicCard = params => {
    return http.post('/basic/basic-card/insertBasicCard', params).then(res => res);
};


export const batchInsertBasicCard = params => {
    return http.post('/basic/basic-card/batchInsertBasicCard', params).then(res => res);
};


//修改
export const updateBasicCard = params => {
    return http.post('/basic/basic-card/update', params).then(res => res);
};
//批量删除
export const deleteBasicCards = params => {
    return http.post('/basic/basic-card/deletes', params).then(res => res);
};
//获取列表
export const getBasicCards = params => {
    return http.post('/basic/basic-card/selectList', params).then(res => res);
};
//根据id获取信息
export const getBasicCardById = params => {
    return http.post('/basic/basic-card/get', params).then(res => res);
};
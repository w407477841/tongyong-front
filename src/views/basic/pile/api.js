import http from '@/axios';
//新增
export const insertBasicPile = params => {
    return http.post('/basic/basic-pile/insertBasicPile', params).then(res => res);
};
//修改
export const updateBasicPile = params => {
    return http.post('/basic/basic-pile/updateBasicPile', params).then(res => res);
};
//批量删除
export const deleteBasicPiles = params => {
    return http.post('/basic/basic-pile/deletes', params).then(res => res);
};
//获取列表
export const getBasicPiles = params => {
    return http.post('/basic/basic-pile/selectPileList', params).then(res => res);
};
//根据id获取信息
export const getBasicPileById = params => {
    return http.post('/basic/basic-pile/get', params).then(res => res);
};
//获取站名
export const getStationInfo = params => {
    return http.post('/basic/basic-pile/getStationInfo', params).then(res => res);
};


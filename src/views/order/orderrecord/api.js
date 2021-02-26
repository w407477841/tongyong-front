import http from '@/axios';
//新增
export const insertOrderRecord = params => {
    return http.post('/order/order-record/insert', params).then(res => res);
};
//修改
export const updateOrderRecord = params => {
    return http.post('/order/order-record/update', params).then(res => res);
};
//批量删除
export const deleteOrderRecords = params => {
    return http.post('/order/order-record/deletes', params).then(res => res);
};
//获取列表
export const getOrderRecords = params => {
    return http.post('/order/order-record/selectList', params).then(res => res);
};
//根据id获取信息
export const getOrderRecordById = params => {
    return http.post('/order/order-record/get', params).then(res => res);
};
//chenlin
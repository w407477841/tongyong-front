import http from '@/axios';
//新增
export const insertBalanceRecord = params => {
    return http.post('/balance/balance-record/insert', params).then(res => res);
};
//修改
export const updateBalanceRecord = params => {
    return http.post('/balance/balance-record/update', params).then(res => res);
};
//批量删除
export const deleteBalanceRecords = params => {
    return http.post('/balance/balance-record/deletes', params).then(res => res);
};
//获取列表
export const getBalanceRecords = params => {
    return http.post('/balance/balance-record/selectList', params).then(res => res);
};
//根据id获取信息
export const getBalanceRecordById = params => {
    return http.post('/balance/balance-record/get', params).then(res => res);
};
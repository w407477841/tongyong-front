import http from '@/axios';
//新增
export const insertBasicStation = params => {
    return http.post('/basic/basic-station/insert', params).then(res => res);
};
//修改
export const updateBasicStation = params => {
    return http.post('/basic/basic-station/update', params).then(res => res);
};
//批量删除
export const deleteBasicStations = params => {
    return http.post('/basic/basic-station/deletes', params).then(res => res);
};
//获取列表
export const getBasicStations = params => {
    return http.post('/basic/basic-station/selectStationList', params).then(res => res);
};
//根据id获取信息
export const getBasicStationById = params => {
    return http.post('/basic/basic-station/get', params).then(res => res);
};
//获取物业id
export const getOrgInfo = params => {
    return http.post('/basic/basic-station/getOrgInfo', params).then(res => res);
};
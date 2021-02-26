import http from '@/axios';
//新增
export const insertBasicQrcode = params => {
    return http.post('/basic/basic-qrcode/insertBasicQrcode', params).then(res => res);
};
//修改
export const updateBasicQrcode = params => {
    return http.post('/basic/basic-qrcode/updateBasicQrcode', params).then(res => res);
};
//批量删除
export const deleteBasicQrcodes = params => {
    return http.post('/basic/basic-qrcode/deletes', params).then(res => res);
};
//获取列表
export const getBasicQrcodes = params => {
    return http.post('/basic/basic-qrcode/selectList', params).then(res => res);
};
//根据id获取信息
export const getBasicQrcodeById = params => {
    return http.post('/basic/basic-qrcode/get', params).then(res => res);
};


//获取列表
export const getPiles = params => {
    return http.post('/basic/basic-qrcode/getPiles', params).then(res => res);
};

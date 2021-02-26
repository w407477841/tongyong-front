import http from '@/axios';


//获取列表
export const getPileSatusList = params => {
    return http.post('/monitor/getPileSatusList',  params ).then(res => res);
};
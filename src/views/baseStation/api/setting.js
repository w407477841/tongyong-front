import http from '@/axios';
import moment from 'moment';

// export const insertWater = params => {return http.post('/device/projectWaterMeter/insert',params).then(res => res); };

//获取项目
export const getProjectsApi = params => {
    return http.get('/station2sbpt/getProjects', {
        params: params
    }).then(res => res);
};
//获取楼号楼层
export const getFloorsApi = params => {
    return http.get('/station2sbpt/getFloors', {
        params: params
    }).then(res => res);
};
//提交平面图
export const postAddMap = params => {
    return http.post('/station2sbpt/addMap', params).then(res => res);
};
//获取平面图一览
export const getMapsByProjectIdApi = params => {
    return http.get('/station2sbpt/getMapsByProjectId', {
        params: params
    }).then(res => res);
};
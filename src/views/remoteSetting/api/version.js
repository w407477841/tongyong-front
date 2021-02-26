import http from '@/axios'
import moment from 'moment';
moment().format();
//列表
export const getListApi = params => {
    return http.post('/remotesetting/projectDeviceUpgradePackage/getPageList', params).then(res => {
        return res
    });
};
//详情
export const getInfoApi = params => {
    return http.post('/remotesetting/projectDeviceUpgradePackage/getPageList', params).then(res => {
        return res;
    });
};
//新增
export const insertInfoApi = params => {
    return http.post('/remotesetting/projectDeviceUpgradePackage/insertModel', params).then(res => res);
};
//删除
export const deleteInfoApi = params => {
    return http.post('/remotesetting/projectDeviceUpgradePackage/deletes', params).then(res => res);
};

//获取设备类型列表
export const getDeviceTypeListApi = params => {
    return http.post('/baseInfo/masterDeviceType/selectDeviceType', params).then(res => {
        return res
    });
}

//设备列表列表
export const getDeviceListData = params => {
    return http.post('/remotesetting/projectDeviceUpgradePackage/getDeviceList', params).then(res => {
        return res
    });
};


//新增
export const handleSearchUpgradeApi = params => {
    return http.post('/remotesetting/projectDeviceUpgradePackage/insertDeviceUpgrade', params).then(res => res);
};
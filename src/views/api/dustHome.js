/*
 * @Author: shanjinfeng 
 * @Date: 2018-09-25 13:58:54 
 * @Last Modified by: shanjinfeng
 * @Last Modified time: 2018-10-10 15:42:22
 * @descrition 扬尘首页接口
 */
import http from '@/axios'
//查询集团下所有扬尘设备
export const getAllDevices = params => {
    return http.get('/device/projectEnvironmentMonitor/getByOrgId', { params: params }).then(res => {
        return res;
    });
}
//所有扬尘设备最近一条数据列表
export const getLastOneApi = params => {
    return http.get('/project/projectEnvironmentMonitorDetail/getLastOne', { params: params }).then(res => {
        return res;
    });
}
//获取天气接口
export const getWeatherApi = params => {
    return http.get('/homepage/getWeatherInfo', { params: params,loading:false }).then(res => {
        return res;
    });
}
//扬尘pm2.5,pm10 ,tps综合监测曲线接口
export const getTrendApi = params => {
    return http.get('/project/projectEnvironmentMonitorDetail/getTrend', { params: params,removePending:false }).then(res => {
        return res;
    });
}

//pm25,pm10 设备排行 前 20
export const getRank20Api = params => {
    return http.get('/project/projectEnvironmentMonitorDetail/getRank20', { params: params,removePending:false }).then(res => {
        return res;
    });
}

//设备数量
export const getDeviceNumberApi = params => {
    return http.get('/device/projectEnvironmentMonitor/getCountByOrgId', { params: params }).then(res => {
        return res;
    });
}

//工地数量
export const getWorkSiteNumberApi = params => {
    return http.get('/projectManagement/projectInfo/getCountByOrgId', { params: params }).then(res => {
        return res;
    });
}

//超标工地
export const getOverproofWorkSiteNumberApi = params => {
    return http.get('/projectManagement/projectInfo/getExceedCountByOrgId', { params: params }).then(res => {
        return res;
    });
}

//正常工地
export const getNormalWorkSiteNumberApi = params => {
    return http.get('/projectManagement/projectInfo/getNormalCountByOrgId', { params: params }).then(res => {
        return res;
    });
}

//查询集团下所有塔吊
export const getCraneList = params => {
    return http.post('/device/projectCrane/getCraneList', params,{loading:false}).then(res => {
        return res;
    });
}

//查询塔吊最近一条数据
export const getCraneDetail = params => {
    return http.post('/device/projectCrane/getCraneDetail',  params,{loading:false,removePending:false}).then(res => {
        return res;
    });
}

//查询集团下所有升降机
export const getLiftList = params => {
    return http.post('/lift/liftInfo/getLiftList', params,{loading:false}).then(res => {
        return res;
    });
}

//查询升降机最近一条数据
export const getLiftDetail = params => {
    return http.post('/lift/liftInfo/getLiftDetail', params,{loading:false}).then(res => {
        return res;
    });
}

//查询升降机当月重量报警/预警 数量
export const getLiftAlarmCount = params => {
    return http.post('/lift/liftInfo/getLiftAlarmCount', params,{loading:false}).then(res => {
        return res;
    });
}

//水电首页水表接口
export const getWaterInfo = params => {
    return http.get('/device/projectWaterMeter/getWaterInfo', { params: params }).then(res => {
        return res;
    });
}

//水电首页电表接口
export const getElectricInfo = params => {
    return http.get('/device/projectElectricPower/getElectricInfo', { params: params,removePending:false }).then(res => {
        return res;
    });
}




//生成支付订单
export const createOrder = params => {
    return http.post('/alipay/topay',  params).then(res => {
        return res;
    });
}

//查询所有充值记录
export const getchargeList = params => {
    return http.post('/ProjectTopUp/list',  params,{loading:false}).then(res => {
        return res;
    });
}

//修改状态
export const updateStatus = params => {
    return http.get('/ProjectTopUp/updateStatus',  { params: params,removePending:false }).then(res => {
        return res;
    });
}

//测试用
export const getReturnUrl = params => {
    return http.get('/alipay/returnUrl',  { params: params,removePending:false }).then(res => {
        return res;
    });
}
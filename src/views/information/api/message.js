import http from '@/axios'
import moment from 'moment';
//列表
export const getListApi = params => {
    return http.post('/information/projectMessage/selectPageList',params).then(res => {
        res.data.list.forEach(el => {
            el.status = el.status == 1 ? "已启用" : el.status == 0 ? "未启用" : "";
            
        });
        return res;
    });
};



//详情
export const getInfoApi = params => {
    return http.post('/information/projectMessage/getOne',params,{loading:false}).then(res => {
        // res.type = res.type == 1 ? "是" :res.type == 0 ? "否" : "";
        res.data.sendTime = moment(res.sendTime).format('YYYY-MM-DD');
        res.data.relatedUser=res.data.relatedUser.split(",");
        
        return res;
    });
};




//新增
export const insertInfoApi = params => { return http.post('/information/projectMessage/insertMessage', params).then(res => res); };
//删除
export const deleteInfoApi = params => { return http.post('/information/projectMessage/deletes', params).then(res => res); };
//编辑
export const updateInfoApi = params => { return http.post('/information/projectMessage/update', params).then(res => res); };
//获取人员列表
export const getUserListApi = params => {return http.post('/system/user/selectUser',params,{loading:false}).then(res => res); };

//获取人员列表
export const getDeviceTypeListApi = params => {return http.post('/baseInfo/masterDeviceType/selectDeviceType',params,{loading:false}).then(res => res); };

//启用
export const updateStatusApi = params => {return http.post('/information/projectMessage/updateStatus', params).then(res => res); };


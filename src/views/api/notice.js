import http from '@/axios'
import moment from 'moment';
//列表
export const getListApi = params => {
    return http.get('/information/projectAnnouncement/pageList', { params: params }).then(res => {
        res.list.forEach(el => {
            el.status = el.status == 1 ? "已发送" : el.status == 0 ? "未发送" : "";
            
        });
        return res;
    });
};



//详情
export const getInfoApi = params => {
    return http.get('/information/projectAnnouncement/selectOne', { params: params }).then(res => {
        // res.type = res.type == 1 ? "是" :res.type == 0 ? "否" : "";
        res.sendTime = moment(res.sendTime).format('YYYY-MM-DD');
        res.relatedUser = res.relatedUser.split(",");
        
        return res;
    });
};




//新增
export const insertInfoApi = params => { return http.post('/information/projectAnnouncement/insertAnnouncement', params).then(res => res); };
//删除
export const deleteInfoApi = params => { return http.post('/information/projectAnnouncement/delete', params).then(res => res); };
//编辑
export const updateInfoApi = params => { return http.post('/information/projectAnnouncement/update', params).then(res => res); };
//获取人员列表
export const getUserListApi = params => {return http.get('/sys/sysUser/pageList',{ params : params}).then(res => res); };
//获取单条详细列表
export const getDetailInfoApi = params => {return http.get('/information/projectAnnouncementReadRecord/getOne',{ params : params}).then(res => {
    res.list.forEach(el => {
        el.readStatus = el.readStatus == 1 ? "已阅读" : el.readStatus == 0 ? "未阅读" : "";
        
    });
    return res;
}); };
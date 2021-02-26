import http from '@/axios'
import moment from 'moment';
moment().format();
//列表
export const getListApi = params => {
    return http.post('/infromation/projectAnnouncement/selectPageList', params ).then(res => {
        res.data.list.forEach(el => {
            el.createTime =  moment(el.createTime).format('YYYY-MM-DD');
            
        });
        return res;
    });
};
//列表
// export const getListApi = params => {
//     return http.post('/infromation/ProjectAnnouncement/selectPageList', params).then(res => {
//         return res
//     });
// };


//详情
export const getInfoApi = params => {
    return http.post('/infromation/projectAnnouncement/selectProjectAnnouncementOne',params ).then(res => res);
};




//新增
export const insertInfoApi = params => { return http.post('/infromation/projectAnnouncement/insertProjectAnnouncement', params).then(res => res); };
//删除
export const deleteInfoApi = params => { return http.post('/infromation/projectAnnouncement/deleteProjectAnnouncement', params).then(res => res); };
//编辑
export const updateInfoApi = params => { return http.post('/infromation/projectAnnouncement/updateProjectAnnouncement', params).then(res => res); };

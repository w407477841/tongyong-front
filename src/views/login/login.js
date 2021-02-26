import http from '@/axios'

export const loginApi = params => {return http.post('/login',params,{loading:false,noError:false,hasMsg:false})};
//项目集团
export const toGroupApi = params => {return http.post('/system/organization/chooseOrg',params,{loading:false}).then(res => res); };
//查询
export const selectProjects = params => {return http.post('/system/organization/selectOrganization',params,{loading:false})};


export const getUserOperationsApi = params => {return http.get('/system/operation/getPermissions',{params:params,loading:false}).then(res => res); };
export const logoutApi = params => {return http.get('/logout',{params:params,loading:false}).then(res => res); };




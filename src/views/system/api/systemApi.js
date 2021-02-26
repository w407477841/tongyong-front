import http from '@/axios';

//季晓君
//用户管理
//新增
export const insertUser = params => { return http.post('/system/user/insertUser', params).then(res => res); };
//修改
export const updateUser = params => { return http.post('/system/user/updateUser', params).then(res => res); };
//批量删除
export const deleteUsers = params => { return http.post('/system/user/deletes', params).then(res => res); };
//获取列表
export const getUser = params => { return http.post('/system/user/selectUserInfo', params).then(res => res); };
//根据id获取信息
export const getUserById = params => { return http.post('/system/user/selectUserById', params).then(res => res); };
//修改密码
export const changePWD = params => { return http.post('/system/user/changePWD', params).then(res => res); };

//角色管理
//新增
export const insertRole = params => { return http.post('/system/role/insert', params).then(res => res); };
//修改
export const updateRole = params => { return http.post('/system/role/update', params).then(res => res); };
//批量删除
export const deleteRoles = params => { return http.post('/system/role/deletes', params).then(res => res); };
//获取列表
export const getRole = params => { return http.post('/system/role/selectRoleInfo', params).then(res => res); };
//根据id获取信息
export const getRoleById = params => { return http.post('/system/role/get', params).then(res => res); };
//新增角色权限
export const insertRoleOperation = params => { return http.post('/system/role/insertRoleOperation', params).then(res => res); };
//获取角色所有权限
export const selectRoleOwnedOperation = params => { return http.post('/system/role/selectRoleOwnedOperation', params).then(res => res); };

//资源管理
//新增
export const insertOperation = params => { return http.post('/system/operation/insert', params).then(res => res); };
//修改
export const updateOperation = params => { return http.post('/system/operation/update', params).then(res => res); };
//批量删除
export const deleteOperations = params => { return http.post('/system/operation/deletes', params).then(res => res); };
//获取权限树形数据
export const selectTreeOperation = params => { return http.post('/system/operation/selectTreeOperation', params).then(res => res); };
//根据id获取信息
export const getOperationById = params => { return http.post('/system/operation/get', params).then(res => res); };

//资源管理
//新增
export const insertOrganization = params => { return http.post('/system/organization/insert', params).then(res => res); };
//批量删除
export const deleteOrganization = params => { return http.post('/system/organization/delete', params).then(res => res); };
//获取权限树形数据
export const selectTreeOrganization = params => { return http.post('/system/organization/selectOrganizationInfo', params).then(res => res); };
//删除部门用户
export const deleteOrgUser = params => { return http.post('/system/organization/deleteOrgUser', params).then(res => res); };
//新增部门用户
export const insertOrgUser = params => { return http.post('/system/organization/insertOrgUser', params).then(res => res); };
//获取部门下用户
export const selectUserByOrgId = params => { return http.post('/system/user/selectUserByOrgId', params).then(res => res); };
//获取未加入该部门下的用户
export const selectUserNotInOrg = params => { return http.post('/system/user/selectUserNotInOrg', params).then(res => res); };

import Layout from '@/views/layout'
export default [
    {
        path: '/system',
        permission : 'system:menu',
        component: Layout,
        alwaysShow: true,
        name: 'system',
        redirect: '/SysOperation',
        meta: { title: '系统管理',icon:'el-icon-xitongshezhi' },
        children:[
            {
                path: '/SysOperation',
                name: 'SysOperation',
                permission : 'system:operation:menu',
                meta: { title: '资源管理' },
                component: () => import('@/views/system/master/operation/SysOperation.vue')
            },
            {
                path: '/sysUser',
                name: 'sysUser',
                permission : 'system:user:menu',
                meta: { title: '用户管理' },
                component: () => import('@/views/system/master/user/user.vue')
            },
            {
                path: '/role',
                name: 'role',
                permission : 'system:role:menu',
                meta: { title: '角色管理' },
                component: () => import('@/views/system/master/role/role.vue')
            },
            {
                path: '/organization',
                name: 'organization',
                permission : 'system:org:menu',
                meta: { title: '部门管理' },
                component: () => import('@/views/system/master/organization/organization.vue')
            }
        ]
    }
]
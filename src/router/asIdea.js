import Layout from '@/views/layout'
export default [
    {
        path: '/aftersale/',
        permission : 'aftersale:menu',
        component: Layout,
        hide:false,
        alwaysShow: true,
        name: 'aftersale-home-page',
        redirect: '/aftersale/asidea',
        meta: { title: '售后管理',icon:'el-icon-kaifazhezhongxingongjuxiazai' },
        children:[
            {
                path: '/aftersale/asidea',
                name: 'aftersale-asidea',
                permission : 'aftersale:asidea:menu',
                meta: { title: '意见反馈' },
                component: () => import('@/views/aftersale/asidea')
    },{
            path: '/aftersale/asmalfunction',
            name: 'aftersale-asmalfunction',
            permission : 'aftersale:asmalfunction:menu',
            meta: { title: '故障报修' },
            component: () => import('@/views/aftersale/asmalfunction')
    }
]
}
]
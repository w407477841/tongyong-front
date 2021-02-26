import Layout from '@/views/layout'
export default [
    {
        path: '/basic/',
        permission : 'basic:menu',
        component: Layout,
        hide:false,
        alwaysShow: true,
        name: 'basic-home-page',
        redirect: '/basic/card',
        meta: { title: '基础管理',icon:'el-icon-kaifazhezhongxingongjuxiazai' },
        children:[
            {
                path: '/basic/card',
                name: 'basic-basiccard',
                permission : 'basic:basiccard:menu',
                meta: { title: '卡管理' },
                component: () => import('@/views/basic/card')
            },
            {
                path: '/basic/basicpile',
                name: 'basic-basicpile',
                permission : 'basic:basicpile:menu',
                meta: { title: '桩管理' },
                component: () => import('@/views/basic/pile')

            },{
                path: '/basic/basicstation',
                name: 'basic-basicstation',
                permission : 'basic:basicstation:menu',
                meta: { title: '站点管理' },
                component: () => import('@/views/basic/station')
            },
            {
                path: '/basic/basicqrcode',
                name: 'basic-basicqrcode',
                permission : 'basic:basicqrcode:menu',
                meta: { title: '二维码管理' },
                component: () => import('@/views/basic/qrcode')
        }

]
}
]
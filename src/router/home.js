import Layout from '@/views/layout'
export default [
    {
        path: '/',
        //permission : 'system:menu',
        component: Layout,
        hide:true,
        alwaysShow: false,
        name: 'home-page',
        redirect: '/home',
        meta: { title: '主页',icon:'el-icon-xitongshezhi' },
        children:[
            {
                path: '/home',
                name: 'home-page',
               // permission : 'system:operation:menu',
                meta: { title: '主页' },
                component: () => import('@/views/home')
            }
        ]
    }
]
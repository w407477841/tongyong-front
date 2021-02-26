import Layout from '@/views/layout'
export default [
    {
        path: '/monitor/',
        permission : 'monitor:menu',
        component: Layout,
        hide:false,
        alwaysShow: true,
        name: 'monitor-home-page',
        redirect: '/monitor/pileMonitor',
        meta: { title: '实时监控',icon:'el-icon-kaifazhezhongxingongjuxiazai' },
        children:[
            {
                path: '/monitor/pileMonitor',
                name: 'monitor-pileMonitor',
                permission : 'monitor:pileMonitor:menu',
                meta: { title: '桩监控' },
                component: () => import('@/views/monitor/pileMonitor')
            }

        ]
    }
]
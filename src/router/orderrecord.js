import Layout from '@/views/layout'
export default [
    {
        path: '/order/',
        permission : 'order:menu',
        component: Layout,
        hide:false,
        alwaysShow: true,
        name: 'order-home-page',
        redirect: '/order/orderrecord',
        meta: { title: '订单管理',icon:'el-icon-kaifazhezhongxingongjuxiazai' },
        children:[
            {
                path: '/order/orderrecord',
                name: 'order-orderrecord',
                permission : 'order:orderrecord:menu',
                meta: { title: '订单明细' },
                component: () => import('@/views/order/orderrecord')
            },
            {
                path: '/order/balancerecord',
                name: 'balance-balancerecord',
                permission : 'balance:balancerecord:menu',
                meta: { title: '充值记录' },
                component: () => import('@/views/order/balance')
    }
        ]
}
]
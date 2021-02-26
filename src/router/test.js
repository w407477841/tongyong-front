import Layout from '@/views/layout'
export default [
    {
        path: '/test/',
        //permission : 'test:menu',
        component: Layout,
        hide:false,
        alwaysShow: true,
        name: 'test-home-page',
        redirect: '/test/test',
        meta: { title: '测试主页',icon:'el-icon-kaifazhezhongxingongjuxiazai' },
        children:[
            {
                path: '/test/test',
                name: 'test-test',
          //      permission : 'test:test:menu',
                meta: { title: '测试' },
                component: () => import('@/views/test/test')
    }
]
}
]
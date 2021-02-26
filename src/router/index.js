import Vue from 'vue';
import Router from 'vue-router';

import system from './system';
import home from './home';
import test from './test';
import basicCard from './basicCard';
import orderrecord from './orderrecord'
import asIdea from './asIdea';
import pileMonitor from './monitor';


Vue.use(Router);
export default new Router({
    // mode: 'history',
    base: process.env.BASE_URL,
    routes: [{
            path: '/',
            redirect: '/home'
        },
        // ...inventory,
        // ...dustDevice,
        // ...towerDevice,
        // ...liftDevice,
        // ...helmet,
        // ...waterDevice,
        // ...electricDevice,
        // ...project,
        // ...informationDevice,
        {
            path: '/login',
            component: () =>
                import('@/views/login/index'),
            hidden: true
        },
        // ...information,
        // ...device,
        // ...hydropower,
        ...home,
        ...system,
        ...test,
        ...basicCard,
        ...orderrecord,
        ...asIdea,
        ...pileMonitor,
        // ...remoteSetting,
        // ...debugging,
        // ...baseStation
    ]
})

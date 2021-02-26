import Vue from 'vue'
import BaiduMap from 'vue-baidu-map'
import App from './App.vue'
import router from './router'
import store from './store'
import { BmlMarkerClusterer } from 'vue-baidu-map'

import 'normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/styles/index.scss' // global css

import VueI18n from 'vue-i18n'
// 导入Element-UI 语言包
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
//过滤器
import * as filters from './filters'
import Moment from "moment";
//import VueVideoPlayer from 'vue-video-player';
//import 'video.js/dist/video-js.css';
import echarts from 'echarts'
import SockJS from "sockjs-client";
import Stomp from "stompjs";
window.SockJS = SockJS;
window.Stomp = Stomp;
Vue.prototype.$echarts = echarts
Vue.prototype.$moment = Moment;
// Vue.use(VueVideoPlayer,
//   /* {
//   options: global default options,
//   events: global videojs events
// } */
// )
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

import topButton from '@/components/autoButton/topButton.vue';
import rightButton from '@/components/autoButton/rightButton.vue';
import formButton from '@/components/autoButton/formButton.vue';

Vue.component('topButton', topButton);
Vue.component('rightButton', rightButton);
Vue.component('formButton', formButton);

import config from '@/mixins/config.js'


Vue.use(VueI18n);
//合并语言包
const i18n = new VueI18n({
  locale: 'zh',
  messages: {
    'en': Object.assign(require('./lang/en.json'), enLocale),
    'zh': Object.assign(require('./lang/zh.json'), zhLocale)
  },
});

Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
});

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (to.path == "/login") {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("userOperations");
    sessionStorage.removeItem("auth");
  }

  let token = sessionStorage.getItem("auth");
  if (!token && to.path != "/login") {
    next({
      path: "/login"
    });
  } else {
    let res = sessionStorage.getItem("userOperations");
    if (to.path == '/dust/dusthome') {
      if (res.indexOf('dust:home:menu') > -1) {
        next();
      } else if (res.indexOf('crane:home:menu') > -1) {
        next({ path: '/tower/towerhome' });
      } else if (res.indexOf('lift:home:menu') > -1) {
        next({ path: '/lift/lifthome' });
      } else if (res.indexOf('hydropower:home:menu') > -1) {
        next({ path: '/hydropower/hydropowerhome' });
      }
    } else {   
      next();
    }

  }
})
router.afterEach(() => {
  NProgress.done() // 结束Progress
})

Vue.config.productionTip = false
Vue.mixin(config);
window.rootApp = new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
Vue.use(BaiduMap, {
  // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
  ak: 'GqKqAVxobuSmaI14O3auufoZSziltPmG'
});
Vue.component('bml-marker-cluster', BmlMarkerClusterer);
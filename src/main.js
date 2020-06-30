/*
 * @Author: bianjie
 * @Date: 2020-06-22 13:53:53
 * @LastEditors: bianjie
 * @LastEditTime: 2020-06-30 16:13:43
 */
import Vue from 'vue';
import topBar from '@/components/topbar/topbar.vue';
import { validateUrl } from '@/util/util';
import uniIcons from './components/uni-icons/uni-icons.vue';
import App from './App.vue';
import tabBar from './components/tabbar/tabbar.vue';
// 底部导航栏
Vue.component('tab-bar', tabBar);
// 头部组件
Vue.component('top-bar', topBar);

process.UNI_LIBRARIES = ['vant', '@dcloudio/uni-ui'];
if (process.env.NODE_ENV === 'production') {
  Object.assign(process.env, {
    VUE_APP_API_PATH: 'http://localhost:3000/app/',

  });
}
if (process.env.NODE_ENV === 'dev') {
  Object.assign(process.env, {
    VUE_APP_API_PATH: 'http://localhost:3000/app/',
  });
}

Vue.config.productionTip = false;
Vue.prototype.$testUrl = validateUrl;
App.mpType = 'app';
App.components = { uniIcons };

const app = new Vue({
  ...App,
});
app.$mount();

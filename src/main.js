/*
 * @Author: bianjie
 * @Date: 2020-06-22 13:53:53
 * @LastEditors: bianjie
 * @LastEditTime: 2021-02-25 19:22:59
 */
import Vue from 'vue';
// #ifdef H5 || APP-PLUS
import axiosApi from 'axios';
// #endif
// #ifdef MP-WEIXIN
import wxApi from 'wx-axios-promise';
// #endif
import topBar from '@/components/topbar/topbar.vue';
import { validateUrl, connectSql, connectServer } from '@/util/util';
import uuid from 'uuid';
import uView from 'uview-ui';
import uniIcons from './components/uni-icons/uni-icons.vue';
import App from './App.vue';
import tabBar from './components/tabbar/tabbar.vue';
import bjxFrom from './components/bjx-form/bjx-form.vue';
import bjxFromItem from './components/bjx-form/bjx-form-item.vue';
import axiosPlugin from './util/axios';
import store from './store';
import { navigateTo } from './util/routerUtil';

let axios;
// #ifdef H5 || APP-PLUS
axios = axiosApi;
// #endif
// #ifdef MP-WEIXIN
axios = wxApi;
// #endif

Vue.use(uView);

// 底部导航栏
Vue.component('tab-bar', tabBar);
// 头部组件
Vue.component('top-bar', topBar);
// 表单组件
Vue.component('bj-form', bjxFrom);
Vue.component('bj-form-item', bjxFromItem);
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
Vue.use(axiosPlugin);
Vue.config.productionTip = false;
Vue.prototype.$testUrl = validateUrl;
Vue.prototype.$uuid = uuid;
Vue.$store = store;
Vue.prototype.$navigateTo = navigateTo;
App.mpType = 'app';
App.components = { uniIcons };
const configUrl = process.env.NODE_ENV !== 'production'
  ? '/static/config/config.json' : '/static/config/config.json';
if (process.env.VUE_APP_PLATFORM === 'app-plus' || process.env.VUE_APP_PLATFORM === 'mp-weixin') {
  Vue.prototype.baseConfig = {
    API_PATH: 'https://www.nxnsa.com:10001/',
    SOCKET_URL: 'wss://www.nxnsa.com:10002/connectWebSocket',
  };
  // #ifdef APP-PLUS
  connectSql();
  // #endif
  connectServer(true);
  const app = new Vue({
    store,
    ...App,
  });
  app.$mount();
} else {
  axios(configUrl)
    .then((result) => {
      Vue.prototype.baseConfig = result.data;
    }).then(() => {
      connectServer(true);
      const app = new Vue({
        store,
        ...App,
      });
      app.$mount();
    });
}

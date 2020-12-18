/*
 * @Author: bianjie
 * @Date: 2020-06-22 13:53:53
 * @LastEditors: bianjie
 * @LastEditTime: 2020-12-18 16:10:57
 */
import Vue from 'vue';
import axios from 'axios';
import topBar from '@/components/topbar/topbar.vue';
import { validateUrl } from '@/util/util';
import uuid from 'uuid';
import uniIcons from './components/uni-icons/uni-icons.vue';
import App from './App.vue';
import tabBar from './components/tabbar/tabbar.vue';
import bjxFrom from './components/bjx-form/bjx-form.vue';
import bjxFromItem from './components/bjx-form/bjx-form-item.vue';
import axiosPlugin from './util/axios';
import store from './store';
import { navigateTo } from './util/routerUtil';

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
  ? '/config.json' : `${process.env.VUE_APP_PUBLIC_URL}/config.json`;
if (process.env.VUE_APP_PLATFORM === 'app-plus') {
  Vue.prototype.baseConfig = {
    API_PATH: 'http://39.106.3.0:10000/',
    AUTH_PATH: 'http://39.106.3.0:9999/',
  };
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
      const userInfo = uni.getStorageSync('token');
      if (userInfo) {
        const data = JSON.parse(userInfo);
        Vue.prototype.$socketTask = uni.connectSocket({
          url: `${Vue.prototype.baseConfig.SOCKET_URL}/${data.token_type} ${data.access_token}`,
        });
      }
      const app = new Vue({
        store,
        ...App,
      });
      app.$mount();
    });
}

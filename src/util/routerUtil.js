/*
 * @Author: bianjie
 * @Date: 2020-11-30 18:49:55
 * @LastEditors: bianjie
 * @LastEditTime: 2020-12-06 17:06:54
 */
import Vue from 'vue';

const navigateTo = (val) => {
  if (val.url !== 'pages/login/index' && !Vue.axios.defaults.headers.Authorization) {
    const token = JSON.parse(uni.getStorageSync('token'));
    if (token) {
      Vue.axios.defaults.headers.Authorization = `${token.token_type} ${token.access_token}`;
      uni.navigateTo({ url: val.url });
    } else {
      uni.navigateTo({ url: '/pages/login/index' });
    }
  } else {
    uni.navigateTo({ url: val.url });
  }
};
export {
  navigateTo,
};

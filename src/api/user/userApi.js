/*
 * @Author: bianjie
 * @Date: 2020-11-30 17:19:18
 * @LastEditors: bianjie
 * @LastEditTime: 2021-02-25 19:22:48
 */
import Vue from 'vue';
import QueryString from 'querystring';
// #ifdef H5 || APP-PLUS
import axiosApi from 'axios';
// #endif
// #ifdef MP-WEIXIN
import wxApi from 'wx-axios-promise';
// #endif
let axios;
// #ifdef H5 || APP-PLUS
axios = axiosApi;
// #endif
// #ifdef MP-WEIXIN
axios = wxApi;
// #endif
//  登陆验证
const getLoginToken = (body) => axios.post(
  `${Vue.prototype.baseConfig.API_PATH
  }oauth/token?${QueryString.stringify(body)}`, '',
);

//  注册登陆
const registerUser = (body, code) => axios.post(
  `${Vue.prototype.baseConfig.API_PATH
  }user/center/register${code ? `/${code}` : ''}`, body,
);

//  注册登陆
const checkRegister = (body) => axios.get(
  `${Vue.prototype.baseConfig.API_PATH
  }user/center/isregister/${body}`,
);

//  验证码发送
const sendCode = (body) => axios.get(
  `${Vue.prototype.baseConfig.API_PATH
  }user/center/code/${body}`,
);
export {
  getLoginToken, registerUser, checkRegister, sendCode,
};

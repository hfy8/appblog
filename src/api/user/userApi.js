/*
 * @Author: bianjie
 * @Date: 2020-11-30 17:19:18
 * @LastEditors: bianjie
 * @LastEditTime: 2020-12-02 18:00:45
 */
import Vue from 'vue';
import axios from 'axios';
import QueryString from 'querystring';

//  专线下单
const getLoginToken = (body) => axios.post(
  `${Vue.prototype.baseConfig.API_PATH
  }oauth/token?${QueryString.stringify(body)}`, '',
);
export {
  getLoginToken,
};

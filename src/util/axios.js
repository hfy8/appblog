/*
 * @Author: bianjie
 * @Date: 2020-10-26 12:10:26
 * @LastEditors: bianjie
 * @LastEditTime: 2021-01-04 11:20:58
 */
/**
 * Created by zy on 2020/4/9.
 */
import axios from 'axios';
import { STATUS_CODE, SELF_ERROR_MANAGE_HEADER_NAME } from './constant';

// respone拦截器
export default {
  install(Vue) {
    // 创建axios实例
    const service = axios.create({
      timeout: 30000, // 请求超时时间
      headers: {
        zone: 'SLINE',
      },
    });
    service.interceptors.response.use(
      (response) => {
        const resData = response.data;
        const { status } = response;
        const codePrefix = Math.floor(status / 100);
        if (codePrefix !== 2) {
          // 此处进行异常处理
          let desc = '';
          if (codePrefix === 4) {
            desc = '请求异常！';
          } else {
            desc = '后台服务异常！';
          }
          uni.showToast({
            title: desc, icon: 'none', position: 'bottom',
          });
          return Promise.reject(response);
        }
        // console.log(resData);
        // console.log((resData instanceof Blob));
        // if ((resData instanceof Blob) || ((`${resData}`) === '[object Blob]')) {
        //   // 若是文件流，则直接返回
        //   return resData;
        // }
        // IE取不到response.request.responseURL
        // const { url } = response.config;
        // if (NO_META_URL.some((item) => url.indexOf(item) !== -1)) {
        //   return resData;
        // }
        // console.log(resData);

        if (!resData.state) {
          return Promise.reject(response);
        }
        const { state } = resData;
        if (state && state === STATUS_CODE.SUCCESS) {
          return resData.content;
        }
        const { errorMessage } = resData;
        const e = new Error(errorMessage);
        e.name = STATUS_CODE.SERVER_ERROR;
        const requestHeaders = response.config.headers;
        if (!requestHeaders || !requestHeaders[SELF_ERROR_MANAGE_HEADER_NAME]) {
          uni.showToast({
            title: '后台服务异常', icon: 'none', position: 'bottom',
          });
        }
        return Promise.reject(e);
      },
      (error) => {
        // 此处进行异常处理
        if (error.response.status === 401 || error.response.status === 500) {
          uni.navigateTo({ url: '/pages/login/index' });
          return;
        }
        uni.showToast({ title: '系统异常！', icon: 'none', position: 'bottom' });
        return Promise.reject(error);
      },
    );
    axios.defaults.adapter = function (config) { // 自己定义个适配器，用来适配uniapp的语法
      return new Promise((resolve, reject) => {
        const settle = require('axios/lib/core/settle');
        const buildURL = require('axios/lib/helpers/buildURL');
        uni.request({
          method: config.method.toUpperCase(),
          url: buildURL(config.url, config.params, config.paramsSerializer),
          header: config.headers,
          data: config.data,
          dataType: config.dataType,
          responseType: config.responseType,
          sslVerify: config.sslVerify,
          complete: function complete(response) {
            // eslint-disable-next-line no-param-reassign
            response = {
              data: response.data,
              status: response.statusCode,
              errMsg: response.errMsg,
              header: response.header,
              config,
            };
            settle(resolve, reject, response);
          },
        });
      });
    };
    service.defaults.adapter = function (config) { // 自己定义个适配器，用来适配uniapp的语法
      return new Promise((resolve, reject) => {
        const settle = require('axios/lib/core/settle');
        const buildURL = require('axios/lib/helpers/buildURL');
        uni.request({
          method: config.method.toUpperCase(),
          url: buildURL(config.url, config.params, config.paramsSerializer),
          header: config.headers,
          data: config.data,
          dataType: config.dataType,
          responseType: config.responseType,
          sslVerify: config.sslVerify,
          complete: function complete(response) {
            // eslint-disable-next-line no-param-reassign
            response = {
              data: response.data,
              status: response.statusCode,
              errMsg: response.errMsg,
              header: response.header,
              config,
            };
            settle(resolve, reject, response);
          },
        });
      });
    };
    // eslint-disable-next-line no-param-reassign
    Vue.axios = service;
  },
};

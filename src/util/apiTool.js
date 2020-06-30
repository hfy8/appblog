/*
 * @Author: bianjie
 * @Date: 2020-06-19 17:05:29
 * @LastEditors: bianjie
 * @LastEditTime: 2020-06-19 17:22:16
 */
import QueryString from 'querystring';
import Vue from 'vue';

/**
 * 请求地址校验，完整地址不使用默认api地址
 */
const Expression = /^https?:\/\//i || /^http?:\/\//i;
const urlTest = new RegExp(Expression);
/**
 * 封装axios Post请求
 * @param {*} url
 * @param {*} params
 * @param {*} commit
 * @param {*} clearMutation
 * @param {*} requestMutation
 * @param {*} failMutation
 */
const postAction = async (url, params, commit, clearMutation = '', requestMutation = '', failMutation = '') => {
  let fullUrl = urlTest.test(url) ? url : `${process.env.VUE_APP_API_PATH}${url}`;
  fullUrl = params ? `${fullUrl}?${QueryString.stringify(params)}` : `${fullUrl}`;
  const response = await Vue.axios.post(fullUrl, params).catch((error) => {
    commit(clearMutation);
    return Promise.reject(error);
  });
  commit(clearMutation);
  if (response.success) {
    commit(requestMutation, response.data);
    return Promise.resolve(response.data);
  }
  commit(failMutation);
};
/**
 * 封装axios Get请求
 * @param {*} url
 * @param {*} params
 * @param {*} commit
 * @param {*} clearMutation
 * @param {*} requestMutation
 * @param {*} failMutation
 */
const getAction = async (url, params, commit, clearMutation = '', requestMutation = '', failMutation = '') => {
  let fullUrl = urlTest.test(url) ? url : `${process.env.VUE_APP_API_PATH}${url}`;
  fullUrl = params ? `${fullUrl}?${QueryString.stringify(params)}` : `${fullUrl}`;
  const response = await Vue.axios.get(fullUrl).catch((error) => {
    commit(clearMutation);
    return Promise.reject(error);
  });
  commit(clearMutation);
  if (response.success) {
    commit(requestMutation, response.data);
    return Promise.resolve(response.data);
  }
  commit(failMutation);
};
/**
 * 封装axios Put请求
 * @param {*} url
 * @param {*} params
 * @param {*} commit
 * @param {*} clearMutation
 * @param {*} requestMutation
 * @param {*} failMutation
 */
const putAction = async (url, params, commit, clearMutation = '', requestMutation = '', failMutation = '') => {
  let fullUrl = urlTest.test(url) ? url : `${process.env.VUE_APP_API_PATH}${url}`;
  fullUrl = params ? `${fullUrl}?${QueryString.stringify(params)}` : `${fullUrl}`;
  const response = await Vue.axios.put(fullUrl, params).catch((error) => {
    commit(clearMutation);
    return Promise.reject(error);
  });
  commit(clearMutation);
  if (response.success) {
    commit(requestMutation, response.data);
    return Promise.resolve(response.data);
  }
  commit(failMutation);
};
/**
 * 封装axios delete请求
 * @param {*} url
 * @param {*} commit
 * @param {*} clearMutation
 * @param {*} requestMutation
 * @param {*} failMutation
 */
const deleteAction = async (url, commit, clearMutation = '', requestMutation = '', failMutation = '') => {
  const fullUrl = urlTest.test(url) ? url : `${process.env.VUE_APP_API_PATH}${url}`;
  const response = await Vue.axios
    .delete(fullUrl).catch((error) => {
      commit(clearMutation);
      return Promise.reject(error);
    });
  commit(clearMutation);
  if (response.success) {
    commit(requestMutation, response.data);
    return Promise.resolve(response.data);
  }
  commit(failMutation);
};
/**
 * 封装axios put JSON请求
 * @param {*} url
 * @param {*} params
 * @param {*} commit
 * @param {*} clearMutation
 * @param {*} requestMutation
 * @param {*} failMutation
 */
const putJSONAction = async (url, params, commit, clearMutation = '', requestMutation = '', failMutation = '') => {
  const fullUrl = urlTest.test(url) ? url : `${process.env.VUE_APP_API_PATH}${url}`;
  const response = await Vue.axios
    .put(fullUrl, params, {
      headers: {
        'Content-Type': 'application/json',
      },
    }).catch((error) => {
      commit(clearMutation);
      return Promise.reject(error);
    });
  commit(clearMutation);
  if (response.success) {
    commit(requestMutation, response.data);
    return Promise.resolve(response.data);
  }
  commit(failMutation);
};
/**
 * 封装axios post JSON请求
 * @param {*} url
 * @param {*} params
 * @param {*} commit
 * @param {*} clearMutation
 * @param {*} requestMutation
 * @param {*} failMutation
 */
const postJSONAction = async (url, params, commit, clearMutation = '', requestMutation = '', failMutation = '') => {
  const fullUrl = urlTest.test(url) ? url : `${process.env.VUE_APP_API_PATH}${url}`;
  const response = await Vue.axios.post(fullUrl, params, {
    headers: {
      'Content-Type': 'application/json',
    },
  }).catch((error) => {
    commit(clearMutation);
    return Promise.reject(error);
  });
  commit(clearMutation);
  if (response.success) {
    commit(requestMutation, response.data);
    return Promise.resolve(response.data);
  }
  commit(failMutation);
};
/**
 * 封装axios 文件处理请求
 * @param {*} url
 * @param {*} params
 * @param {*} commit
 * @param {*} clearMutation
 * @param {*} requestMutation
 * @param {*} failMutation
 */
const postMultipartAction = async (url, params, commit, clearMutation = '', requestMutation = '', failMutation = '') => {
  const fullUrl = urlTest.test(url) ? url : `${process.env.VUE_APP_API_PATH}${url}`;
  const response = await Vue.axios.post(fullUrl, params, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }).catch((error) => {
    commit(clearMutation);
    return Promise.reject(error);
  });
  commit(clearMutation);
  if (response.success) {
    commit(requestMutation, response.data);
    return Promise.resolve(response.data);
  }
  commit(failMutation);
};
export {
  postAction, getAction, putAction, deleteAction, postJSONAction, putJSONAction, postMultipartAction,
};

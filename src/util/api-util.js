/*
 * @Author: bianjie
 * @Date: 2020-07-14 13:40:50
 * @LastEditors: bianjie
 * @LastEditTime: 2021-01-04 09:57:11
 */
/**
 * Created by zy on 2020/3/26.
 */
import QueryString from 'querystring';
import Vue from 'vue';

const envConfig = process.env;
const BASE_URL = envConfig.VUE_APP_BASE_URL ? envConfig.VUE_APP_BASE_URL : '';
const POOL_URL = envConfig.VUE_APP_POOL_URL ? envConfig.VUE_APP_POOL_URL : '';
const PTN_BASE_URL = envConfig.VUE_APP_PTN_BASE_URL ? envConfig.VUE_APP_PTN_BASE_URL : '';
const PON_BASE_URL = envConfig.VUE_APP_PON_BASE_URL ? envConfig.VUE_APP_PON_BASE_URL : '';
const OTN_BASE_URL = envConfig.VUE_APP_OTN_BASE_URL ? envConfig.VUE_APP_OTN_BASE_URL : '';
const ZJ_BASE_URL = envConfig.VUE_APP_ZJ_BASE_URL ? envConfig.VUE_APP_ZJ_BASE_URL : '';
const EDL_BUY_URL = envConfig.VUE_APP_EDL_BUY_URL ? envConfig.VUE_APP_EDL_BUY_URL : '';
const EDL_LIST_URL = envConfig.VUE_APP_EDL_LIST_URL ? envConfig.VUE_APP_EDL_LIST_URL : '';
// OP新老资源池映射表页面
const OP_POOL_MAPPING = envConfig.VUE_APP_OP_POOL_MAPPING ? envConfig.VUE_APP_OP_POOL_MAPPING : '';

const axiosGet = async (commit, url = '', params = null, mutationType = '') => {
  commit(mutationType.REQUEST);
  const fullUrl = params ? `${url}?${QueryString.stringify(params)}` : url;
  try {
    const result = await Vue.axios.get(fullUrl);
    commit(mutationType.SUCCESS, result);
  } catch (e) {
    commit(mutationType.FAIL);
    return Promise.reject(e);
  }
};

const axiosPost = async (commit, url = '', body = null, mutationType = '') => {
  if (mutationType) {
    commit(mutationType.REQUEST);
  }
  try {
    const result = await Vue.axios.post(url, body);
    if (mutationType) {
      commit(mutationType.SUCCESS, result);
    }
  } catch (e) {
    if (mutationType) {
      commit(mutationType.FAIL);
    }
    return Promise.reject(e);
  }
};

export {
  BASE_URL, axiosGet, axiosPost, POOL_URL,
  PTN_BASE_URL, PON_BASE_URL, OTN_BASE_URL, ZJ_BASE_URL, EDL_BUY_URL, OP_POOL_MAPPING, EDL_LIST_URL,
};

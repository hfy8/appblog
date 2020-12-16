/*
 * @Author: bianjie
 * @Date: 2020-06-22 12:33:25
 * @LastEditors: bianjie
 * @LastEditTime: 2020-11-30 17:18:37
 */
import Vue from 'vue';
import Vuex from 'vuex';
import { axiosGet, axiosPost } from '@/util/api-util';
import { buildMutType } from '@/util/mutationTool';

const MUTATION_TOKEN = buildMutType('TOKEN');

Vue.use(Vuex);
const state = {
  token: '',

};
const mutations = {
  [MUTATION_TOKEN.TOKEN_CLEAR]() {
    state.token = '';
  },
};
const actions = {
  /**
   * 登陆获取登陆密钥
   * @param {*} param0
   * @param {*} params
   */
  getLoginToken({ commit }, params) {
    axiosGet('/oauth/token', params, commit, MUTATION_TOKEN.TOKEN_CLEAR, MUTATION_TOKEN_REQUEST, MUTATION_TOKEN_FAIL);
  },
  /**
   * 发动短信验证码请求
   * @param {*} param0
   * @param {*} params
   */
  sendNote({ commit }, params) {
    axiosPost('/user/sendnote', params, commit);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};

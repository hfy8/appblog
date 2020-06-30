/*
 * @Author: bianjie
 * @Date: 2020-06-22 12:33:25
 * @LastEditors: bianjie
 * @LastEditTime: 2020-06-22 12:52:51
 */
import Vue from 'vue';
import Vuex from 'vuex';
import { postJSONAction } from '@/util/apiTool';
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
    postJSONAction('/user/login', params, commit, MUTATION_TOKEN.TOKEN_CLEAR, MUTATION_TOKEN_REQUEST, MUTATION_TOKEN_FAIL);
  },
  /**
   * 发动短信验证码请求
   * @param {*} param0
   * @param {*} params
   */
  sendNote({ commit }, params) {
    postJSONAction('/user/sendnote', params, commit);
  },
};

export default {
  state,
  mutations,
  actions,
};

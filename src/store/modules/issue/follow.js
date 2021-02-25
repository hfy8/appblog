/*
 * @Author: bianjie
 * @Date: 2020-12-15 13:59:55
 * @LastEditors: bianjie
 * @LastEditTime: 2021-01-18 14:43:07
 */
import Vue from 'vue';
import { axiosGet, axiosPost } from '@/util/api-util';
import { buildMutType } from '@/util/mutationTool';

const GET_FOLLOW_LIST = buildMutType('GET_FOLLOW_LIST');

export default {
  namespaced: true,
  state: {
    follows: [],
  },
  mutations: {
    reset(state, val) {
      state[val] = JSON.parse(JSON.stringify(state[val]));
    },
    [GET_FOLLOW_LIST.REQUEST](state) {
      state.follows = [];
    },
    [GET_FOLLOW_LIST.SUCCESS](state, payload) {
      state.follows = payload.data.map((e) => {
        Object.assign(e, { message: [] });
        return e;
      });
    },
    [GET_FOLLOW_LIST.FAIL](state) {
      state.follows = [];
    },
  },
  actions: {
    // 获取关注列表
    getFollows({ commit }, params) {
      return axiosGet(
        commit,
        `${Vue.prototype.baseConfig.API_PATH}follow/follows`,
        params,
        GET_FOLLOW_LIST,
      );
    },

    // 关注
    followUser({ commit }, params) {
      return axiosPost(
        commit,
        `${Vue.prototype.baseConfig.API_PATH}follow/followUser`,
        params,
        '',
      );
    },

    // 取关
    disFollowUser({ commit }, params) {
      return axiosPost(
        commit,
        `${Vue.prototype.baseConfig.API_PATH}follow/disFollowUser`,
        params,
        '',
      );
    },
  },
};

/*
 * @Author: bianjie
 * @Date: 2020-06-22 12:33:25
 * @LastEditors: bianjie
 * @LastEditTime: 2021-01-18 16:14:31
 */
import Vue from 'vue';
import { buildMutType } from '@/util/mutationTool';
import { axiosGet } from '@/util/api-util';

import {
  selectTemporary,
} from '@/util/sql';

const GET_USER_INFO = buildMutType('GET_USER_INFO');

export default {
  namespaced: true,
  state: {
    temUsers: [],
    userInfo: {},

  },
  mutations: {
    reset(state, val) {
      state[val] = JSON.parse(JSON.stringify(state[val]));
    },
    async localTemUsers(state) {
      const userInfo = uni.getStorageSync('token');
      if (userInfo) {
        const data = JSON.parse(userInfo);
        const arr = await selectTemporary(data.userName, data.userId).catch((e) => {
          console.log(e);
        });
        if (arr.length > 0) {
          state.temUsers = arr.map((e) => {
            Object.assign(e, { message: [] });
            return e;
          });
        }
      }
    },
    [GET_USER_INFO.REQUEST](state) {
      state.userInfo = {};
    },
    [GET_USER_INFO.SUCCESS](state, payload) {
      state.userInfo = payload;
    },
    [GET_USER_INFO.FAIL](state) {
      state.userInfo = {};
    },
  },
  actions: {
    getUserInfo({ commit }, params) {
      return axiosGet(
        commit,
        `${Vue.prototype.baseConfig.API_PATH}user/center/getUserInfo/${params.fuid}`,
        '',
        GET_USER_INFO,
      );
    },
  },
};

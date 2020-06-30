/*
 * @Author: bianjie
 * @Date: 2020-06-19 16:50:09
 * @LastEditors: bianjie
 * @LastEditTime: 2020-06-22 12:53:59
 */
import Vue from 'vue';
import Vuex from 'vuex';
import { login } from 'module';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    login,
  },
});

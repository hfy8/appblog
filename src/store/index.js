/*
 * @Author: bianjie
 * @Date: 2020-06-19 16:50:09
 * @LastEditors: bianjie
 * @LastEditTime: 2020-12-15 14:53:05
 */
import Vue from 'vue';
import Vuex from 'vuex';
import login from './modules/login/login';
import issue from './modules/issue/issue';
import follow from './modules/issue/follow';
import img from './modules/img/img';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    login,
    issue,
    img,
    follow,
  },
});

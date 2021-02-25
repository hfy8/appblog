/*
 * @Author: bianjie
 * @Date: 2020-06-19 16:50:09
 * @LastEditors: bianjie
 * @LastEditTime: 2021-01-26 17:30:14
 */
import Vue from 'vue';
import Vuex from 'vuex';
import user from './modules/user/user';
import issue from './modules/issue/issue';
import follow from './modules/issue/follow';
import img from './modules/img/img';
import message from './modules/h5/message';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    user,
    issue,
    img,
    follow,
    message,
  },
});

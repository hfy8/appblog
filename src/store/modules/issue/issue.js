/*
 * @Author: bianjie
 * @Date: 2020-06-22 12:33:25
 * @LastEditors: bianjie
 * @LastEditTime: 2020-12-15 12:14:39
 */
import Vue from 'vue';
import { axiosGet, axiosPost } from '@/util/api-util';
import { buildMutType } from '@/util/mutationTool';

const GET_GLOBAL_ISSUE_LIST = buildMutType('GLOBAL_ISSUE_LIST');
const GET_ISSUE_LIST = buildMutType('GET_ISSUE_LIST');
const GET_COMMENTS_LIST = buildMutType('GET_COMMENTS_LIST');

export default {
  namespaced: true,
  state: {
    issueGlobalList: [],
    globalTotal: 0,
    issueList: [],
    total: 0,
    comments: [],
    commentTotal: 0,
  },
  mutations: {
    [GET_GLOBAL_ISSUE_LIST.REQUEST](state) {
      state.issueGlobalList = [];
    },
    [GET_GLOBAL_ISSUE_LIST.SUCCESS](state, payload) {
      state.globalTotal = payload.total;
      state.issueGlobalList = payload.data;
    },
    [GET_GLOBAL_ISSUE_LIST.FAIL](state) {
      state.issueGlobalList = [];
    },
    [GET_ISSUE_LIST.REQUEST](state) {
      state.issueList = [];
    },
    [GET_ISSUE_LIST.SUCCESS](state, payload) {
      state.total = payload.total;
      state.issueList = payload.data;
    },
    [GET_ISSUE_LIST.FAIL](state) {
      state.issueList = [];
    },
    [GET_COMMENTS_LIST.REQUEST](state) {
      state.comments = [];
    },
    [GET_COMMENTS_LIST.SUCCESS](state, payload) {
      state.commentTotal = payload.total;
      state.comments = payload.data;
    },
    [GET_COMMENTS_LIST.FAIL](state) {
      state.comments = [];
    },

  },
  actions: {
    // 获取全局动态列表
    getGlobalIssueList({ commit }, params) {
      return axiosGet(
        commit,
        `${Vue.prototype.baseConfig.API_PATH}issue/lists`,
        params,
        GET_GLOBAL_ISSUE_LIST,
      );
    },
    // 发布动态
    plicIssue({ commit }, params) {
      return axiosPost(
        commit,
        `${Vue.prototype.baseConfig.API_PATH}issue/create`,
        params,
        '',
      );
    },

    // 点赞动态
    thumbUpIssue({ commit }, params) {
      return axiosPost(
        commit,
        `${Vue.prototype.baseConfig.API_PATH}issue/thumbup/${params.did}`,
        '',
        '',
      );
    },

    // 获取动态评论
    getComments({ commit }, params) {
      return axiosGet(
        commit,
        `${Vue.prototype.baseConfig.API_PATH}comment/lists/${params.did}`,
        '',
        GET_COMMENTS_LIST,
      );
    },

    // 创建评论
    createComment({ commit }, params) {
      return axiosPost(
        commit,
        `${Vue.prototype.baseConfig.API_PATH}comment/create`,
        params,
        '',
      );
    },

  },
};

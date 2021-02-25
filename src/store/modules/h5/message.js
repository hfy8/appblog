/*
 * @Author: bianjie
 * @Date: 2021-01-26 17:25:40
 * @LastEditors: bianjie
 * @LastEditTime: 2021-01-26 17:56:15
 */
export default {
  namespaced: true,
  state: {
    messages: {},
  },
  mutations: {
    setMessage(state, val) {
      if (val.user in state.messages) {
        state.messages[val.user] = [...state.messages[val.user], ...val[val.user]];
      } else {
        Object.assign(state.messages, { [val.user]: val[val.user] });
      }
    },
  },
};

/*
 * @Author: bianjie
 * @Date: 2020-06-22 12:31:06
 * @LastEditors: bianjie
 * @LastEditTime: 2020-06-22 12:32:23
 */
const buildMutType = (pre) => ({
  REQUEST: `${pre}_REQUEST`,
  SUCCESS: `${pre}_SUCCESS`,
  FAIL: `${pre}_FAIL`,
});

export {
  buildMutType,
};

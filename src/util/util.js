/*
 * @Author: bianjie
 * @Date: 2020-06-30 12:34:41
 * @LastEditors: bianjie
 * @LastEditTime: 2020-06-30 13:29:41
 */
const Expression = /^https?:\/\//i || /^http?:\/\//i;
const urlTest = new RegExp(Expression);
const validateUrl = (url) => urlTest.test(url);
export {
  validateUrl,
};

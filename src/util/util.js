/*
 * @Author: bianjie
 * @Date: 2020-06-30 12:34:41
 * @LastEditors: bianjie
 * @LastEditTime: 2020-10-26 14:17:38
 */
const Expression = /^https?:\/\//i || /^http?:\/\//i;
const urlTest = new RegExp(Expression);
const validateUrl = (url) => urlTest.test(url);
const splitArray = (val, param) => {
  let str = '';
  val.forEach((element) => {
    if (str) {
      str += `${param}${element}`;
    } else {
      str += element;
    }
  });
  return str;
};
export {
  validateUrl, splitArray,
};

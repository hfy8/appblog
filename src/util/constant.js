/*
 * @Author: bianjie
 * @Date: 2020-10-26 12:11:17
 * @LastEditors: bianjie
 * @LastEditTime: 2020-10-26 14:59:54
 */
const STATUS_CODE = {
  SUCCESS: 'ok',
  SERVER_ERROR: 'error',
};
const STATUS_CODE_MESSAGE = {
  [STATUS_CODE.SUCCESS]: '操作成功',
  [STATUS_CODE.SERVER_ERROR]: '服务器内部错误',
};
const SELF_ERROR_MANAGE_HEADER_NAME = 'isSelfErrorManage';
const SELF_ERROR_MANAGE_HEADER = {
  [SELF_ERROR_MANAGE_HEADER_NAME]: true,
};
export {
  STATUS_CODE, STATUS_CODE_MESSAGE, SELF_ERROR_MANAGE_HEADER_NAME, SELF_ERROR_MANAGE_HEADER,
};

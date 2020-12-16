/*
 * @Author: bianjie
 * @Date: 2020-06-22 12:33:25
 * @LastEditors: bianjie
 * @LastEditTime: 2020-12-09 12:04:50
 */
import Vue from 'vue';

export default {
  namespaced: true,
  state: {
  },
  mutations: {
  },
  actions: {
    uploadImg({ commit }, params) {
      uni.uploadFile({
        url: `${Vue.prototype.baseConfig.API_PATH}minio/upload`,
        filePath: params.path,
        name: 'file',
        formData: {
          fileName: `${params.path.substring(params.path.lastIndexOf('/') + 1).replace(/[-]/g, '')}.jpg`,
        },
        success: (res) => {
          if (res.data.code === 200) {
            console.log('上传成功');
          }
        },
      });
    },
  },
};

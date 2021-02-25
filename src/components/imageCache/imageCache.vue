<!--
 * @Author: bianjie
 * @Date: 2020-12-09 17:03:38
 * @LastEditors: bianjie
 * @LastEditTime: 2021-02-05 11:37:13
-->
<template>
  <image
    :class="clas"
    :src="path"
    lazy-load
    :mode="mode"
    @error="reload()"
  />
</template>

<script>
import { getStorage, setStorage } from '@/util/util';

export default {
  props: {
    url: String,
    mode: String,
    clas: String,
    type: {
      type: String,
      default: 'user',
    },
  },
  data() {
    return {
      path: getStorage(this.url) || this.downLoadFile(this.url),
    };
  },
  watch: {
    url(url) {
      this.downLoadFile(url);
    },
  },
  methods: {
    reload() {
      this.downLoadFile(this.url);
    },
    reset() {
      console.log(this.url);
      uni.removeStorageSync(this.url);
      this.downLoadFile(this.url);
    },
    downLoadFile(url) {
      uni.downloadFile({
        url, // 仅为示例，并非真实的资源
        success: (res) => {
          if (res.statusCode === 200) {
            this.path = res.tempFilePath;
            // #ifdef APP-PLUS
            uni.saveFile(res.tempFilePath);
            // #endif
            setStorage(this.url, res.tempFilePath);
          } else {
            this.downLoadFile(`${this.baseConfig.API_PATH}minio/down/${this.type === 'user' ? 'no-icon.png' : 'no-img.png'}`);
          }
        },
        error: () => {
          this.downLoadFile(`${this.baseConfig.API_PATH}minio/down/${this.type === 'user' ? 'no-icon.png' : 'no-img.png'}`);
        },
      });
    },
  },
};
</script>

<style>
</style>

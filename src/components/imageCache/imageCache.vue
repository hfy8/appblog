<!--
 * @Author: bianjie
 * @Date: 2020-12-09 17:03:38
 * @LastEditors: bianjie
 * @LastEditTime: 2020-12-15 16:57:03
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
export default {
  props: {
    url: String,
    mode: String,
    clas: String,
  },
  data() {
    return {
      path: uni.getStorageSync(this.url) || this.downLoadFile(this.url),
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
    downLoadFile(url) {
      uni.downloadFile({
        url, // 仅为示例，并非真实的资源
        success: (res) => {
          if (res.statusCode === 200) {
            this.path = res.tempFilePath;
            // #ifdef APP-PLUS
            uni.saveFile(res.tempFilePath);
            // #endif
            uni.setStorageSync(this.url, res.tempFilePath);
          }
        },
      });
    },
  },
};
</script>

<style>
</style>

<!--
 * @Author: bianjie
 * @Date: 2020-06-29 13:44:02
 * @LastEditors: bianjie
 * @LastEditTime: 2020-06-30 18:09:52
-->
<template>
  <view>
    <top-bar :fixed="true" :setting-able="false" />
    <view :class="NotchScreen?'web-view-notch':'web-view'">
      <web-view :webview-styles="webviewStyles" :src="url" />
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      webviewStyles: {
        progress: {
          color: '#FF3333',
        },
      },
      url: 'https://www.baidu.com',
    };
  },
  computed: {
    NotchScreen() {
      // #ifdef APP-PLUS
      if (plus) {
        return plus.navigator.hasNotchInScreen;
      }
      // #endif
      return false;
    },
  },
  onLoad(option) {
    if (option.url) {
      this.url = option.url;
    }
    // #ifdef APP-PLUS
    const currentWebview = this.$mp.page.$getAppWebview(); // 获取当前页面的webview对象
    setTimeout(() => {
      const wv = currentWebview.children()[0];
      wv.setStyle({ top: this.NotchScreen ? 86 : 56 });
    }, 1000);
    // #endif
  },
};
</script>
<style lang="scss" scoped>
.web-view {
  height: calc(100vh - 56px) !important;
  z-index: -1;
}
.web-view-notch {
  height: calc(100vh - 86px) !important;
  z-index: -1;
}
</style>

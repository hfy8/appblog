<!--
 * @Author: bianjie
 * @Date: 2020-06-30 13:01:10
 * @LastEditors: bianjie
 * @LastEditTime: 2020-06-30 15:23:11
-->
<template>
  <view class="content">
    <top-bar v-model="searchContent" @confirm="search" />
    <view :class="NotchScreen?'text-view-notch':'text-view'">
      <text>{{ text }}</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      text: '',
      searchContent: '',
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
    this.text = option.text;
  },
  methods: {
    search() {
      if (this.$testUrl(this.searchContent)) {
        uni.navigateTo({ url: `/pages/outBrow/outBrow?url=${this.searchContent}` });
      } else {
        uni.navigateTo({
          url: `/pages/textView/textView?text=${this.searchContent}`,
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.content{
  height: 100vh;
  .text-view{
    height: calc(100vh - 56px);

  }
  .text-view-notch{
    height: calc(100vh - 86px);
  }
}
</style>

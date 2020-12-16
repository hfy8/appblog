<!--
 * @Author: bianjie
 * @Date: 2020-11-02 09:56:45
 * @LastEditors: bianjie
 * @LastEditTime: 2020-11-02 10:14:35
-->
<template>
  <view class="content">
    <view class="icon" :style="{color: color, fontSize: fontSize}" @click="toclick" v-html="type" />
  </view>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: '&#xe644;',
    },
    color: {
      type: String,
      default: '#666666',
    },
    fontSize: {
      type: String,
      default: '40rpx',
    },
  },
  methods: {
    toclick() {
      this.$emit('click');
    },
  },
};
</script>

<style scoped>
.content {
  display: flex;
  align-items: center;
  justify-content: center;
}
@font-face {
  font-family: "iconfont"; /* project id 1483307 */
  src: url("https://at.alicdn.com/t/font_1483307_bak9n3w3yqt.ttf") format("truetype");
}

.icon {
  font-family: iconfont !important;
  font-size: 60rpx;
}
</style>

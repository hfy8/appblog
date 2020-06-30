<!--
 * @Author: bianjie
 * @Date: 2020-06-24 12:20:22
 * @LastEditors: bianjie
 * @LastEditTime: 2020-06-29 09:51:21
-->
<template>
  <view class="label-content">
    <view class="title">
      <text>{{ content.title }}</text>
    </view>
    <view class="user-title">
      <view>
        <image class="user-picture" />
      </view>
      <text>{{ content.name }}</text>
    </view>
    <view class="pre-text">
      <text>{{ content.body }}</text>
    </view>
    <view class="footer">
      <text />
    </view>
  </view>
</template>

<script>
export default {
  props: {
    content: {
      type: Object,
      required: true,
    },
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.label-content {
  width: 750upx;
  background-color: white;
  text-align: left;
  display: flex;
  margin-top: 20upx;
  flex-direction: column;
  .title {
    font-size: 25upx;
    font-weight: bold;
    margin-bottom: 10upx;
  }
  .user-title {
    display: flex;
    font-size: 25upx;
    margin-bottom: 10upx;
    .user-picture {
      width: 30upx;
      height: 30upx;
    }
  }
  .pre-text {
    font-size: 25upx;
    margin-bottom: 10upx;
  }
}
</style>>

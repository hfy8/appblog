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
      <text>{{ content.num }} 点赞</text>
      <text>{{ content.num }} 评论 </text>
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
  margin-top: 4upx;
  padding: 30upx;
  flex-direction: column;
  .title {
    font-size: 32upx;
    font-weight: 600;
    margin-bottom: 10upx;
    color: #1a1a1a;
  }
  .user-title {
    display: flex;
    font-size: 27upx;
    margin-bottom: 10upx;
    .user-picture {
      width: 30upx;
      height: 30upx;
    }
  }
  .pre-text {
    font-size: 27upx;
    margin-bottom: 10upx;
    color: #444;
  }
  .footer {
    font-size: 25upx;
    font-family: Helvetica Neue, Helvetica, Roboto, Segoe UI, Arial, sans-serif;
    color: #999;
    display: flex;
  }
}
</style>>

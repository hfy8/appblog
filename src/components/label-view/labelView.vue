<!--
 * @Author: bianjie
 * @Date: 2020-06-24 12:20:22
 * @LastEditors: bianjie
 * @LastEditTime: 2020-07-07 14:03:16
-->
<template>
  <view class="label-content">
    <view class="label-body">
      <view class="title">
        <text>{{ content.title }}</text>
      </view>
      <view class="user-title">
        <view>
          <image class="user-picture" :src="url" />
        </view>
        <text class="user-name">
          {{ content.name }}
        </text>
      </view>
      <view class="pre-text">
        <text>{{ content.body }}</text>
      </view>
      <view class="footer">
        <view class="operation">
          <view class="footer-hand">
            <uni-icons type="hand-thumbsup" size="15" />
            <text>{{ content.num ||0 }}</text>
          </view>
          <view class="footer-chat">
            <uni-icons type="chat" size="15" />
            <text>{{ content.num ||0 }}</text>
          </view>
        </view>
      </view>
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
  data() {
    return {
      url: '',
    };
  },
  watch: {
    // 监听图片名称变化跟新地址
    'content.imgName': () => {
      this.imgUrl();
    },
  },
  mounted() {
    this.imgUrl();
  },
  methods: {
    // 获取图片URL地址
    imgUrl() {
      this.$minio.presignedUrl(
        'GET',
        'labels',
        this.content.imgName,
        24 * 60 * 60,
        (err, presignedUrl) => {
          if (err) {
            return console.log(err);
          }
          this.url = presignedUrl;
        },
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.label-content {
  width: 750upx;
  background-color: white;
  text-align: left;
  display: flex;
  margin-top: 4upx;
  flex-direction: column;
  .label-body {
    padding: 30upx;
  }
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
    line-height: 30upx;
    vertical-align: middle;
    .user-picture {
      width: 30upx;
      height: 30upx;
      border-radius: 50%;
    }
    .user-name {
      margin-left: 10upx;
      font-weight: bold;
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
    align-items: center;
    .operation {
      display: flex;
      align-items: flex-end;
      justify-content: end;
      margin-left: auto;
      vertical-align: middle;
      .footer-chat{
        margin-left: 10upx;
      }
    }
  }
}
</style>>

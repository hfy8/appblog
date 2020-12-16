<!--
 * @Author: bianjie
 * @Date: 2020-06-24 12:20:22
 * @LastEditors: bianjie
 * @LastEditTime: 2020-12-15 16:34:53
-->
<template>
  <view class="label-content">
    <view class="label-body">
      <view class="title" @tap="showDetail(content)">
        <text>{{ content.title }}</text>
      </view>
      <view class="user-title">
        <view>
          <imageCache
            clas="user-picture"
            :url="`${baseConfig.API_PATH}minio/down/${content.uicon}`"
            mode="scaleToFill"
          />
        </view>
        <text class="user-name">
          {{ content.uname }}
        </text>
      </view>
      <view class="uni-flex uni-row">
        <view class="flex-item" @tap="showDetail(content)">
          <view class="pre-text">
            <text>{{ content.content.replace(/<[^>]+>/g,"") }}</text>
          </view>
        </view>
        <view v-show="content.images" class="flex-image">
          <imageCache class="info-image" :url="`${this.baseConfig.API_PATH}minio/down/${content.images.split(',')[0]}`" mode="scaleToFill" @tap="previewImg" />
        </view>
      </view>
      <view class="footer">
        <view class="operation">
          {{ content.thumbUp }} 赞同.{{ content.discussNum }} 讨论
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import imageCache from '../imageCache/imageCache.vue';

export default {
  components: { imageCache },
  props: {
    content: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      uicon: '',
      icon: '',
      url: '',
    };
  },
  methods: {
    // 详情页面
    showDetail(item) {
      this.$navigateTo({ url: `/pages/content/index?item=${encodeURIComponent(JSON.stringify(item))}` });
    },
    // 预览
    previewImg(e) {
      uni.previewImage({
        current: e.target.dataset.src,
        urls: [e.target.dataset.src],
      });
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
  .uni-row {
    display: flex;
    flex-direction: row;
  }
  .flex-item {
    flex: 2;
  }
  .flex-image {
    flex: 1;
    text-align: right;
  }
  .info-image {
    width: 150upx;
    height: 150upx;
    background-color: black;
    object-fit: cover;
  }
  .title {
    font-size: 32upx;
    font-weight: bold;
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
      font-weight: 500;
      color: rgb(56, 55, 55);
    }
  }
  .pre-text {
    display: -webkit-box;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
    font-size: 27upx;
    height: 150upx;
    margin-bottom: 10upx;
    color: #444;
    word-wrap: break-word;
    white-space: normal;
    word-break: break-all;
    line-clamp: 3;
    -webkit-line-clamp: 3;
  }
  .footer {
    font-size: 25upx;
    font-family: Helvetica Neue, Helvetica, Roboto, Segoe UI, Arial, sans-serif;
    color: #999;
    display: flex;
    .operation {
      vertical-align: middle;
      text-align: left;
      .footer-chat {
        margin-left: 10upx;
      }
    }
  }
}
</style>>

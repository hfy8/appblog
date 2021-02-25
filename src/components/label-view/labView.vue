<!--
 * @Author: bianjie
 * @Date: 2020-06-24 12:20:22
 * @LastEditors: bianjie
 * @LastEditTime: 2021-02-25 15:41:35
-->
<template>
  <view class="label-content" @longtap="moreAction">
    <view class="label-body">
      <view class="title" @tap="showDetail(content)">
        <text>{{ content.title }}</text>
      </view>
      <view class="uni-flex uni-row">
        <view class="flex-item" @tap="showDetail(content)">
          <view class="pre-text">
            <text>
              {{ content.content.replace(/<[^>]+>/g,"") }}
            </text>
          </view>
        </view>
        <view v-show="content.images!==null" class="flex-image">
          <imageCache
            class="info-image"
            type="img"
            :url="baseConfig.API_PATH+`minio/down/`+content.images.split(',')[0]"
            mode="scaleToFill"
            @tap="previewImg"
          />
        </view>
      </view>
      <view class="footer">
        <view class="operation">
          {{ content.thumbUp }} 赞同.{{ content.discussNum }} 讨论
        </view>
      </view>
      <view v-if="content.uid===token.userId&&more" class="more">
        <view class="operation" @tap="delIssue(content.did)">
          <text>删除</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapActions } from 'vuex';
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
      more: false,
      token: JSON.parse(uni.getStorageSync('token')),
      scrolling: false,
    };
  },
  methods: {
    ...mapActions('issue', ['delIssue']),
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
    // 显示更多操作
    moreAction() {
      if (this.scrolling) {
        return;
      }
      this.more = true;
    },
    // 检测是否是滑动事件
    touchmove() {
      this.scrolling = true;
    },
    touchend() {
      this.scrolling = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.label-content {
  width: 600upx;
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
  .more{
    font-size: 25upx;
    font-family: Helvetica Neue, Helvetica, Roboto, Segoe UI, Arial, sans-serif;
    color: #999;
    display: flex;
    .operation {
      flex: 1;
      vertical-align: middle;
      align-items: flex-end;
      text-align: right;
      color:#337DFF;
    }
  }
}
</style>>

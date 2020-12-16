<!--
 * @Author: bianjie
 * @Date: 2020-11-02 18:41:29
 * @LastEditors: bianjie
 * @LastEditTime: 2020-12-09 18:14:28
-->
<template>
  <view class="comment">
    <view>
      <imageCache
        clas="user-picture"
        :url="`${this.baseConfig.API_PATH}minio/down/${item.uicon}`"
        mode="scaleToFill"
      />
    </view>
    <view class="comment-info">
      <view class="from-user">
        <view class="user-name">
          {{ item.uname }}
        </view>
        <view class="time">
          {{ item.createTime | time }}
        </view>
      </view>
      <view class="content">
        <view v-if="!!item.tuName" class="comment-user">
          <view> 回复 </view>
          <view class="user-name">
            {{ item.tuName }}：
          </view>
        </view>
        <view class="comment-content">
          {{ item.content }}
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import moment from 'moment';
import imageCache from '@/components/imageCache/imageCache.vue';

export default {
  components: { imageCache },
  filters: {
    time: (val) => {
      const timestamp = new Date(val).getTime();
      return moment(timestamp).format('YYYY.MM.DD HH:MM');
    },
  },
  props: {
    item: Object,
  },
  data() {
    return {
      token: JSON.parse(uni.getStorageSync('token')),

    };
  },
  methods: {
  },
};
</script>

<style lang="scss" scoped>
$base-color: #5a9bec;
.comment {
  font-size: 25upx;
  display: flex;
  .comment-info {
    flex: 1;
    margin-left: 10upx;
  }
}
.user-picture {
  width: 30px;
  height: 30px;
  object-fit: cover;
  border-radius: 8upx;
}
.from-user {
  display: flex;
  .user-name {
    flex: 1;
    color: $base-color;
  }
  .time {
    flex: 1;
    text-align: right;
  }
}
.content {
  display: flex;
  .comment-user {
    display: flex;
    white-space: nowrap;
  }
  .comment-content {
    flex: 1;
    word-break: break-all;
    word-wrap: break-word;
  }
  .user-name {
    color: $base-color;
  }
}
</style>

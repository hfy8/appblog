<!--
 * @Author: bianjie
 * @Date: 2020-12-18 17:04:32
 * @LastEditors: bianjie
 * @LastEditTime: 2021-02-05 16:25:38
-->
<template>
  <view class="content">
    <view v-if="follows.length===0&&temUsers.length===0" class="no-info">
      当前没有消息
    </view>
    <view v-for="item in follows" :key="item.fuid" class="item">
      <navigator :url="`/pages/contact/chat/chat?fuid=${item.fuid}`" class="user-item" open-type="navigate">
        <view>
          <view class="img">
            <imageCache
              clas="user-picture"
              :url="`${baseConfig.API_PATH}minio/down/${item.fuicon}`"
              mode="scaleToFill"
              :badge="item.message.length"
            />
            <u-badge
              type="error"
              :count="item.message.length"
              :overflow-count="99"
              :is-center="true"
              size="mini"
            />
          </view>
        </view>
        <view class="user-info">
          <view class="user-name">
            <view class="name">
              <text>
                {{ item.funame }}
              </text>
            </view>
            <view class="last">
              <text v-if="item.fuid in items&&items[String(item.fuid)].createTime">
                {{ items[String(item.fuid)].createTime }}
              </text>
            </view>
          </view>
          <view class="message-lst">
            <text v-if="item.fuid in items">
              {{ items[String(item.fuid)].content }}
            </text>
          </view>
        </view>
      </navigator>
    </view>
    <view v-for="it in temUsers" :key="it.fuid" class="item">
      <navigator :url="`/pages/contact/chat/chat?fuid=${it.fuid}`" class="user-item" open-type="navigate">
        <view>
          <view class="img">
            <imageCache
              clas="user-picture"
              :url="`${baseConfig.API_PATH}minio/down/${it.fuicon}`"
              mode="scaleToFill"
            />
            <u-badge
              type="error"
              :count="it.message.length"
              :overflow-count="99"
              :is-center="true"
              size="mini"
            />
          </view>
        </view>
        <view class="user-info">
          <view class="user-name">
            <view class="name">
              <text>
                {{ it.funame }}
              </text>
            </view>
            <view class="last">
              <text v-if="it.fuid in temItems&&temItems[String(it.fuid)].createTime">
                {{ temItems[String(it.fuid)].createTime }}
              </text>
            </view>
          </view>
          <view class="message-lst">
            <text v-if="it.fuid in temItems">
              {{ temItems[String(it.fuid)].content }}
            </text>
          </view>
        </view>
      </navigator>
    </view>
  </view>
</template>
<script>
import { mapState } from 'vuex';
import imageCache from '@/components/imageCache/imageCache.vue';
import {
  openSqlite,
  isOpen,
  selectInformationType,
} from '@/util/sql';

export default {
  components: { imageCache },
  data() {
    return {
      items: {},
      temItems: {},

    };
  },
  computed: {
    ...mapState('follow', ['follows']),
    ...mapState('user', ['temUsers']),
  },
  watch: {
    follows: {
      async handler() {
        this.items = await this.getItems();
        this.compare(this.follows, this.temUsers);
      },
      // 代表在wacth里声明了firstName这个方法之后立即先去执行handler方法
      immediate: true,
      deep: true,
    },
    temUsers: {
      async handler() {
        this.temItems = await this.getTemItems();
        this.compare(this.follows, this.temUsers);
      },
      // 代表在wacth里声明了firstName这个方法之后立即先去执行handler方法
      immediate: true,
      deep: true,
    },
  },
  onNavigationBarButtonTap(e) {
    if (e.index === 1) {
      uni.reLaunch({ url: '/pages/login/index' });
    }
  },
  methods: {
    compare(follows, temUsers) {
      follows.forEach((e) => {
        const index = temUsers.findIndex((el) => el.fuid === e.fuid);
        if (index !== -1) {
          temUsers.splice(index, 1);
        }
      });
    },
    // token值
    token() {
      return JSON.parse(uni.getStorageSync('token'));
    },
    async getItems() {
      const item = {};
      // #ifdef APP-PLUS
      await Promise.all(this.follows.map(async (e) => {
        const token = this.token();
        if (!isOpen(token.userName)) {
          openSqlite(token.userName);
        }
        const arr = await selectInformationType(token.userName, 0, 1, e.fuid);
        if (arr.length > 0) {
          Object.assign(item, { [e.fuid]: arr[0] });
        }
        uni.preloadPage({
          url: `/pages/contact/chat/chat?fuid=${e.fuid}`,
          fail: (error) => {
            console.log(error);
          },
        });
      }));
      // #endif
      return item;
    },
    async getTemItems() {
      const item = {};
      // #ifdef APP-PLUS
      await Promise.all(this.temUsers.map(async (e) => {
        const token = this.token();
        if (!isOpen(token.userName)) {
          openSqlite(token.userName);
        }
        const arr = await selectInformationType(token.userName, 0, 1, e.fuid);
        if (arr.length > 0) {
          Object.assign(item, { [e.fuid]: arr[0] });
        }
        uni.preloadPage({ url: `/pages/contact/chat/chat?fuid=${e.fuid}` });
      }));
      // #endif
      return item;
    },
  },

};
</script>

<style lang="scss" scoped>
.content{
  height: 100vh;
}
.item{
  height: 100rpx;
  padding: 10rpx;
  display: flex;
  flex-direction: column;
  align-items: left;
  border-bottom: 1px solid #f3f3f3;
  overflow:hidden;
}

.user-item{
  display: flex;
  font-size: 25upx;
}
.img {
  width: 80rpx;
  height: 80rpx;
  position: relative;
  margin: auto;
}
.user-picture {
  width: 80rpx;
  height: 80rpx;
  object-fit: cover;
  border-radius: 10rpx;
}
.user-info{
  flex: 5;
  display: flex;
  flex-direction: column;
  margin-left: 10rpx;
  .user-name{
    font-weight: bold;
    font-size: 32upx;
    display: flex;
    .last{
      flex: 1;
      text-align: right;
      float:right;
      font-size: 25upx;
      font-weight: normal;
      color: #C3C3C3;
    }
  }
  .message-lst{
    font-size: 25upx;
    color: #C3C3C3;
  }

}
.uni_badge {
  font-size: 20rpx;
  color: white;
  left: 70rpx;
  margin-top: -5rpx;
  position: absolute;
  text-align: center;
  line-height: 25rpx;
  border-radius: 12.5rpx;
  background-color: red;
  width: 25rpx;
  height: 25rpx;
  z-index: 9999;
}
.uni_badge-wider{
    width: 35rpx;
}
.no-info{
  text-align: center;
  color:#eee;
  margin-top: 10upx;
}
</style>

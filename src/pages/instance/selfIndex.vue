<!--
 * @Author: bianjie
 * @Date: 2020-06-24 10:55:45
 * @LastEditors: bianjie
 * @LastEditTime: 2021-02-05 16:17:38
-->
<template>
  <view class="content">
    <view>
      <view>
        <scroll-view
          v-show="!showCover"
          :class="NotchScreen ? 'scroll-view-notch' : 'scroll-view'"
          class="scroll-view"
          scroll-y="true"
          @scrolltolower="scrolltolower"
        >
          <view class="top-view">
            <ImageCache
              class="conf-image"
              type="img"
              :url="`${baseConfig.API_PATH}minio/down/${user.userIcon}`"
              mode="scaleToFill"
            />
            <view class="user">
              <text class="user-name">
                {{ user.userName }}
              </text>
              <ImageCache
                class="user-image"
                type="img"
                :url="`${baseConfig.API_PATH}minio/down/${user.userIcon}`"
                mode="scaleToFill"
              />
            </view>
          </view>
          <view v-for="(item, index) in Object.keys(list)" :key="index">
            <view v-if="item!==moment().format('YYYY年')" class="year-title">
              {{ item }}
            </view>
            <view
              v-for="(it, idx) in Object.keys(list[item])"
              :key="idx"
              class="day-content"
            >
              <view v-if="it!=='今天'" class="day-title">
                <view class="day">
                  {{ it.substring(0, 2) }}
                </view>
                <view class="month">
                  {{ it.substring(2) }}
                </view>
              </view>
              <view v-else class="day-title">
                <view class="day">
                  今天
                </view>
              </view>
              <view
                v-if="list[item][it].length===0&&it==='今天'"
                @tap.stop="addNewInstance"
              >
                <ImageCache
                  class="add-image"
                  type="img"
                  :url="`${baseConfig.API_PATH}minio/down/no-instance.png`"
                  mode="aspectFit"
                />
              </view>
              <view v-else>
                <labView
                  v-for="(i, dx) in list[item][it]"
                  :key="dx"
                  :content="i"
                />
              </view>
            </view>
          </view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script>
import labView from '@/components/label-view/labView.vue';
import { mapActions, mapState } from 'vuex';
import Vue from 'vue';
import { info } from '@/util/tabInfo';
import { dataCount } from '@/util/util';
import moment from 'moment';
import Index from '../index/index.vue';
import ImageCache from '../../components/imageCache/imageCache.vue';

export default {
  components: { Index, labView, ImageCache },
  data() {
    return {
      showCover: false,
      showTab: true,
      searchContent: '',
      list: {},
      info,
      moment,
    };
  },
  computed: {
    ...mapState('issue', ['issueList', 'total']),
    ...mapState('follow', ['follows']),
    NotchScreen() {
      // #ifdef APP-PLUS
      if (plus) {
        return plus.navigator.hasNotchInScreen;
      }
      // #endif
      return false;
    },
    count() {
      return this.list ? dataCount(this.list) : 0;
    },
    page() {
      if (!this.list) {
        return 1;
      }
      return Math.floor(dataCount(this.list) / 5 + 1);
    },
    user() {
      const userInfo = uni.getStorageSync('token');
      if (userInfo) {
        return JSON.parse(userInfo);
      }
      return {};
    },
  },
  async mounted() {
    const userInfo = uni.getStorageSync('token');
    if (!userInfo) {
      uni.navigateTo({ url: '/pages/login/index' });
    }
    const data = JSON.parse(uni.getStorageSync('token'));
    if (data) {
      Object.assign(Vue.axios.defaults.headers, {
        Authorization: `${data.token_type} ${data.access_token}`,
      });
    }
    this.getIssueList({ page: this.page, size: 5 }).then(() => {
      this.list = { ...this.issueList };
    });
    if (this.follows.length === 0) {
      await this.getFollows();
    }
  },
  onNavigationBarButtonTap(e) {
    if (e.index === 1) {
      uni.navigateTo({ url: '/pages/editor/index' });
    }
  },
  methods: {
    ...mapActions('issue', ['getIssueList']),
    ...mapActions('follow', ['getFollows']),
    async scrolltolower() {
      if (this.count === this.total && this.count !== 0) {
        return;
      }
      await this.getIssueList({ page: this.page, size: 5 });
      this.list = { ...this.issueList };
    },
    addNewInstance() {
      uni.navigateTo({ url: '/pages/editor/index' });
    },
  },
};
</script>

<style lang="scss" scoped>
.conf-image{
  width:750upx;
  height: 600upx;
}
.content {
  text-align: center;
  height: 100vh;
  background-color: white;
  .scroll-view {
    height: 100vh;
  }
}
.swiper {
  height: 100vh;
}
.logo {
  height: 100vh;
  width: 750upx;
}
.cover-img {
  height: 100vh;
}
.year-title,
.day-title {
  text-align: left;
  .day {
    font-size: 42upx;
    font-weight: bold;
    word-spacing:10upx
  }
  .month {
    font-size: 27upx;
    font-weight: 600;
    word-spacing:10upx
  }
}
.year-title {
  font-size: 42upx;
  font-weight: bold;
}
.day-title {
  display: flex;
  width: 150upx;
  height: 72upx;
  padding-top: 30upx;
  align-items:baseline;
  justify-items:baseline;
}
.day-content {
  display: flex;
}
.user-image{
  width: 100rpx;
  height: 100rpx;
  object-fit: cover;
  border-radius: 10rpx;
}
.user{
  right: 40upx;
  position:absolute;
  top:540upx;
  align-items: flex-start;
  .user-name{
    margin-right: 30upx;
    line-height: 80rpx;
    vertical-align: top;
    font-weight: 600;
    color: #555;

  }
}
.add-image{
  width: 150upx;
  height: 130upx;
  margin-left: 30upx;
  background-color: #eee;
}
.top-view{
  margin-bottom: 60upx;
}
</style>

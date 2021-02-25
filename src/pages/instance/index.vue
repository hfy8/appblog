<!--
 * @Author: bianjie
 * @Date: 2020-06-24 10:55:45
 * @LastEditors: bianjie
 * @LastEditTime: 2021-02-05 11:32:59
-->
<template>
  <view class="content">
    <!-- <Index v-show="showCover" class="cover-img" @closeCover="closeCover" /> -->
    <view>
      <view>
        <scroll-view
          v-show="!showCover"
          :class="NotchScreen?'scroll-view-notch':'scroll-view'"
          class="scroll-view"
          scroll-y="true"
          @scrolltoupper="scrolltoupper"
          @scrolltolower="scrolltolower"
        >
          <labelView
            v-for="(item) in list"
            :key="item.did"
            :content="item"
          />
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script>
import labelView from '@/components/label-view/labelView.vue';
import { mapActions, mapState } from 'vuex';
import Vue from 'vue';
import { info } from '@/util/tabInfo';
import Index from '../index/index.vue';

export default {
  components: { Index, labelView },
  data() {
    return {
      showCover: false,
      showTab: true,
      searchContent: '',
      list: [],
      info,
      firstLoad: true,
    };
  },
  computed: {
    ...mapState('issue', ['issueGlobalList', 'globalTotal']),
    ...mapState('follow', ['follows']),
    NotchScreen() {
      // #ifdef APP-PLUS
      if (plus) {
        return plus.navigator.hasNotchInScreen;
      }
      // #endif
      return false;
    },
    page() {
      return Math.floor((this.list.length / 5) + 1);
    },
  },
  onShow() {
    const userInfo = uni.getStorageSync('token');
    if (!userInfo) {
      uni.navigateTo({ url: '/pages/login/index' });
    }
    const data = JSON.parse(uni.getStorageSync('token'));
    if (data) {
      Object.assign(Vue.axios.defaults.headers, { Authorization: `${data.token_type} ${data.access_token}` });
    }
    if (this.firstLoad) {
      this.refresh();
      this.firstLoad = false;
    }
  },
  async mounted() {
    const userInfo = uni.getStorageSync('token');
    if (!userInfo) {
      uni.navigateTo({ url: '/pages/login/index' });
    }
    const data = JSON.parse(uni.getStorageSync('token'));
    if (data) {
      Object.assign(Vue.axios.defaults.headers, { Authorization: `${data.token_type} ${data.access_token}` });
    }
    this.getGlobalIssueList({ page: this.page, size: 5 }).then(() => {
      this.list = [...this.issueGlobalList];
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
    ...mapActions('issue', ['getGlobalIssueList']),
    ...mapActions('follow', [
      'getFollows',
    ]),
    // 关闭广告遮罩
    closeCover(showCover) {
      this.showCover = showCover;
    },
    // 页面变更刷新
    async refresh() {
      await this.getGlobalIssueList({ page: 1, size: 5 });
      this.list = [...this.issueGlobalList];
    },
    // 下拉到底部加载
    async scrolltolower() {
      if (this.list.length === this.globalTotal && this.list.length !== 0) {
        return;
      }
      await this.getGlobalIssueList({ page: this.page, size: 5 });
      this.list.push(...this.issueGlobalList);
    },
    // 上啦刷新
    async scrolltoupper() {
      this.refresh();
    },
    search() {
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  text-align: center;
  height: 100vh;
  background-color: #f3f3f3;
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
</style>

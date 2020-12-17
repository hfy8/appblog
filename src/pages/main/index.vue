<!--
 * @Author: bianjie
 * @Date: 2020-06-24 10:55:45
 * @LastEditors: bianjie
 * @LastEditTime: 2020-12-17 18:34:26
-->
<template>
  <view class="content">
    <Index v-show="showCover" class="cover-img" @closeCover="closeCover" />
    <view>
      <top-bar v-show="!showCover" v-model="searchContent" @confirm="search" />
      <view>
        <scroll-view
          v-show="!showCover"
          :class="NotchScreen?'scroll-view-notch':'scroll-view'"
          class="scroll-view"
          scroll-y="true"
          @scroll="scroll"
          @scrolltolower="scrolltolower"
        >
          <labelView v-for="(item,index) in list" :key="index" :content="item" />
        </scroll-view>
      </view>
      <tab-bar :tab-show="showTab&&!showCover" />
    </view>
  </view>
</template>

<script>
import labelView from '@/components/label-view/labelView.vue';
import { mapActions, mapState } from 'vuex';
import Vue from 'vue';
import Index from '../index/index.vue';

export default {
  components: { Index, labelView },
  data() {
    return {
      showCover: true,
      showTab: true,
      searchContent: '',
      list: [],
    };
  },
  computed: {
    ...mapState('issue', ['issueGlobalList', 'globalTotal']),
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
  mounted() {
    this.$socketTask.onOpen((data) => {
      console.log(JSON.stringify(data));
    });
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
    this.getFollows();
  },
  methods: {
    ...mapActions('issue', ['getGlobalIssueList']),
    ...mapActions('follow', [
      'getFollows',
    ]),
    // 底部控制
    scroll(event) {
      if (event.detail.deltaY > 0) {
        this.showTab = true;
      } else {
        this.showTab = false;
      }
    },
    // 关闭广告遮罩
    closeCover(showCover) {
      this.showCover = showCover;
    },
    async scrolltolower() {
      if (this.list.length === this.globalTotal && this.list.length !== 0) {
        return;
      }
      await this.getGlobalIssueList({ page: this.page, size: 5 });
      this.list.push(...this.issueGlobalList);
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
    height: calc(100vh - 56px);
  }
  .scroll-view-notch {
    height: calc(100vh - 86px);
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

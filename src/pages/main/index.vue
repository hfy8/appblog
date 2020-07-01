<!--
 * @Author: bianjie
 * @Date: 2020-06-24 10:55:45
 * @LastEditors: bianjie
 * @LastEditTime: 2020-07-01 09:24:44
-->
<template>
  <view class="content">
    <Index v-show="showCover" class="cover-img" @closeCover="closeCover" />
    <view>
      <top-bar v-show="!showCover" v-model="searchContent" @confirm="search" />
      <view>
        <scroll-view v-show="!showCover" :class="NotchScreen?'scroll-view-notch':'scroll-view'" class="scroll-view" scroll-y="true" @scroll="scroll">
          <labelView v-for="(item,index) in content" :key="index" :content="item" />
        </scroll-view>
      </view>
      <tab-bar :tab-show="showTab&&!showCover" />
    </view>
  </view>
</template>

<script>
import labelView from '@/components/label-view/labelView.vue';
import Index from '../index/index.vue';

export default {
  components: { Index, labelView },
  data() {
    return {
      showCover: true,
      showTab: true,
      searchContent: '',
      content: [
        {
          name: 'asdsadsa',
          title: '吃饭没1',
          body: 'asdasdasdd',
          num: 100,
        },
        {
          name: 'asdsadsa',
          title: '吃饭没',
          body: 'asdasdasdd',
          num: 100,

        },
        {
          name: 'asdsadsa',
          title: '吃饭没',
          body: 'asdasdasdd',
          num: 100,

        },
        {
          name: 'asdsadsa',
          title: '吃饭没',
          body: 'asdasdasdd',
          num: 100,

        },
        {
          name: 'asdsadsa',
          title: '吃饭没',
          body: 'asdasdasdd',
          num: 100,

        },
        {
          name: 'asdsadsa',
          title: '吃饭没',
          body: 'asdasdasdd',
          num: 100,

        },
        {
          name: 'asdsadsa',
          title: '吃饭没',
          body: 'asdasdasdd',
          num: 100,

        },
        {
          name: 'asdsadsa',
          title: '吃饭没',
          body: 'asdasdasdd',
          num: 100,

        },
        {
          name: 'asdsadsa',
          title: '吃饭没',
          body: 'asdasdasdd',
          num: 100,

        },
        {
          name: 'asdsadsa',
          title: '吃饭没',
          body: 'asdasdasdd',
          num: 100,

        },
        {
          name: 'asdsadsa',
          title: '吃饭没',
          body: 'asdasdasdd',
          num: 100,

        },
        {
          name: 'asdsadsa',
          title: '吃饭没',
          body: 'asdasdasdd',
          num: 100,

        },
      ],
    };
  },
  computed: {
    NotchScreen() {
      // #ifdef APP-PLUS
      if (plus) {
        return plus.navigator.hasNotchInScreen;
      }
      // #endif
      return false;
    },
  },
  onLoad() {
  },
  methods: {
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
  .scroll-view-notch{
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

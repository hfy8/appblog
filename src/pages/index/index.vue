<!--
 * @Author: bianjie
 * @Date: 2020-06-22 13:53:53
 * @LastEditors: bianjie
 * @LastEditTime: 2020-06-28 16:53:53
-->
<template>
  <view class="content">
    <swiper class="swiper" :indicator-dots="indicatorDots" :autoplay="autoplay">
      <swiper-item>
        <view>
          <image class="logo" src="/static/first.jpg" />
        </view>
      </swiper-item>
      <swiper-item>
        <view>
          <image class="logo" src="/static/sec.jpg" />
        </view>
      </swiper-item>
      <swiper-item>
        <view>
          <image class="logo" src="/static/thir.jpg" />
        </view>
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
export default {
  data() {
    return {
      autoplay: true,
      indicatorDots: true,
    };
  },
  mounted() {
    setTimeout(() => {
      this.$emit('closeCover', false);
    }, 4000);
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.content {
  text-align: center;
  height: 100vh;
}
.swiper {
  height: 100vh;
}
.logo {
  height: 100vh;
  width: 750upx;
}
</style>>

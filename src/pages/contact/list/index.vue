<!--
 * @Author: bianjie
 * @Date: 2020-12-18 17:04:32
 * @LastEditors: bianjie
 * @LastEditTime: 2020-12-18 18:06:48
-->
<template>
  <view>
    <view v-for="item in follows" :key="item.fuid" @tap="nagetobd">
      <navigator :url="`/pages/contact/board/index?fuid=${item.fuid}`" open-type="navigate">
        <imageCache
          clas="user-picture"
          :url="`${baseConfig.API_PATH}minio/down/${item.fuicon}`"
          mode="scaleToFill"
        />
        <text>
          {{ item.funame }}
        </text>
      </navigator>
    </view>
  </view>
</template>
<script>
import { mapState } from 'vuex';
import imageCache from '@/components/imageCache/imageCache.vue';

export default {
  components: { imageCache },
  data() {
    return {
    };
  },
  computed: {
    ...mapState('follow', ['follows']),
  },
  methods: {
    nagetobd() {
      uni.navigateTo({ url: '/pages/contact/board/index' });
    },
  },

};
</script>

<style>

</style>

<!--
 * @Author: bianjie
 * @Date: 2020-06-28 16:15:25
 * @LastEditors: bianjie
 * @LastEditTime: 2021-01-11 16:55:06
-->
<template>
  <uni-transition :class="placement" :mode-class="['slide-bottom']" :show="tabShow">
    <block v-for="(item,index) in tabList" :key="index">
      <view
        class="navigator block"
        :style="{'background-color':backgroundColor}"
        :class="currentTabIndex == index ? 'on' : ''"
        @tap="switchTab(index)"
      >
        <navigator :url="item.router" open-type="navigate">
          <view class="icon">
            <uni-icons
              class="iconfont"
              :type="item.icon"
              size="20"

              :style="[currentTabIndex == index ? {'color': tintColor} : {'color': color}]"
            />
            <text v-if="item.badge" class="uni_badge">
              {{ item.badge }}
            </text>
            <text v-if="item.badgeDot" class="uni_badge uni_badge_dot" />
          </view>
          <view
            class="text"
            :style="[currentTabIndex == index ? {'color': tintColor} : {'color': color}]"
          >
            {{ item.text }}
          </view>
        </navigator>
      </view>
    </block>
  </uni-transition>
</template>
<script>
import uniTransition from '@/components/uni-transition/uni-transition.vue';
import instanceList from '@/pages/instance/index.vue';
import chatList from '@/pages/contact/list/index.vue';

export default {
  components: { uniTransition, instanceList, chatList },
  props: {
    current: { type: [Number, String], default: 0 },
    backgroundColor: { type: String, default: '#fbfbfb' },
    color: { type: String, default: '#999' },
    tintColor: { type: String, default: '#42b983' },
    placement: { type: String, default: 'bottom' },
    tabShow: { type: Boolean, default: true },
    tabList: { type: Array, default: () => [] },
  },
  data() {
    return {
      currentTabIndex: this.current,
    };
  },
  mounted() {
    this.tabList.forEach(
      (e) => {
        if (e.router) {
          uni.preloadPage({ url: e.router });
        }
      },
    );
  },
  methods: {
    switchTab(index) {
      this.tabList[index].badgeDot = false;
      this.currentTabIndex = index;
      this.$emit('click', index);
    },
  },
};
</script>
<style lang="scss" scoped>
.top {
  box-shadow: 0px 1upx #f3f3f3;
  width: 750upx;
  position: fixed;
  top: 0upx;
  display: flex;
  align-items: center;
  justify-content: center;
  .navigator {
    height: 56px;
    flex: 1;
  }
}
.bottom {
  box-shadow: 0px -1upx #f3f3f3;
  width: 750upx;
  position: fixed;
  bottom: 0upx;
  display: flex;
  align-items: center;
  justify-content: center;
  .navigator {
    height: 56px;
    flex: 1;
  }
}
.uni_badge {
  font-size: 30upx;
  top: 5upx;
  color: white;
  position: absolute;
  text-align: center;
  line-height: 30upx;
  border-radius: 15upx;
  background-color: red;
  width: 30upx;
  height: 30upx;
}
.uni_badge_dot {
  position: absolute;
  text-align: center;
  line-height: 20upx;
  border-radius: 10upx;
  background-color: red;
  width: 20upx;
  height: 20upx;
}
.text {
  font-size: 20upx;
}
</style>

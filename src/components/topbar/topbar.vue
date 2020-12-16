<template>
  <uniTransition
    :mode-class="[fixed?'slide-bottom':'']"
    :class="{'fixed-top':fixed}"
    :show="topShow"
  >
    <view :class="NotchScreen?'top-header-notch':'top-header'">
      <view v-if="NotchScreen" class="contentNotch" />
      <view v-if="type==='main'" class="top-view">
        <uni-search-bar
          class="top-serach"
          :radius="radius"
          :placeholder="placeholder"
          :cancel-button="cancelButton"
          :value="value"
          :setting-able="settingAble"
          @scan="scan"
          @setting="setting"
          @confirm="search"
          @input="input"
        />
      </view>
      <view v-if="type==='back'" class="top-back">
        <view class="back-icon">
          <uni-icons type="back" color="white" size="32" />
        </view>
        <view class="back-sub">
          <text class="top-sub" @tap="submit">
            发表
          </text>
        </view>
      </view>
    </view>
  </uniTransition>
</template>
<script>
import uniTransition from '@/components/uni-transition/uni-transition.vue';
import uniSearchBar from '@/components/uni-search-bar/uni-search-bar.vue';
/**
 * 头部组件封装
 */
export default {
  components: { uniTransition, uniSearchBar },
  props: {
    type: { type: String, default: 'main' },
    value: { type: String, default: '' },
    cancelButton: { type: String, default: 'none' },
    placeholder: { type: String, default: '搜索' },
    radius: { type: Number, default: 50 },
    settingAble: { type: Boolean, default: true },
    fixed: { type: Boolean, default: false },
    topShow: { type: Boolean, default: true },
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
  methods: {
    search(val) {
      this.$emit('confirm', val.value);
    },
    input(val) {
      this.$emit('input', val.value);
    },
    scan() {
      uni.scanCode({
        success: (res) => {
          if (this.$testUrl(res.result)) {
            this.$navigateTo({ url: `/pages/outBrow/outBrow?url=${res.result}` });
          } else {
            this.$navigateTo({
              url: `/pages/textView/textView?text=${res.result}`,
            });
          }
        },
      });
    },
    setting() {
      this.$emit('setting');
    },
    submit() {
      this.$emit('submit');
    },
  },
};
</script>
<style lang="scss" scoped>
.top-header {
  display: flex;
  flex-direction: column;
  margin-top: 0upx;
  width: 750upx;
  height: 56px;
  background-color: red;
}
.top-header-notch {
  display: flex;
  flex-direction: column;
  margin-top: 0upx;
  width: 750upx;
  height: 86px;
  background-color: red;
}
.top-serach {
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: center;
}
.contentNotch {
  width: 750upx;
  height: 30px;
}
.top-view {
  width: 750upx;
  height: 56px;
}
.fixed-top {
  position: fixed;
  top: 0px;
  width: 750upx;
}
.top-back {
  height: 56px;
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: center;
  color: white;
  .back-icon {
    flex: 1;
  }
  .back-sub {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    flex-direction: row;
    align-items: center;
  }
  .top-sub {
    width: 100upx;
  }
}
</style>

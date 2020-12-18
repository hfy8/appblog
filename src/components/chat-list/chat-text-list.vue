<template name="chat-text-list">
  <view class="width">
    <br>
    <block v-for="msg in msgs" :key="msg">
      <block v-if="msg.me === true">
        <view style="position: absolute ;right: 0upx;">
          <text style="color: #CACACA;">
            {{ my_name }}
          </text>
        </view>
        <br>
        <view style="position: absolute;right: 0upx;width: 90%;">
          <view style="position: absolute; right: 30upx; width: 10%;">
            <view style="position: absolute;right: 20upx;">
              <imageCache style="width: 80upx;height: 80upx;" :url="my_image" mode="" />
            </view>
          </view>
          <view style="position: absolute; right: 20%;">
            <view class="Separation-line" />
            <view class="" style="padding: 10upx;text-align: right;background-color: #007AFF;border: 2upx solid #007AFF;border-radius: 20upx 0 20upx 20upx;">
              <view style="text-align: left;">
                <text style="font-size: 40upx;color: #e1e1e1;word-break:break-all;">
                  {{ msg.msg }}
                </text>
              </view>
            </view>
          </view>
        </view>
      </block>
      <!-- --------------------------------------------------------------- -->
      <block v-if="msg.me === false">
        <text style="color: #CACACA;">
          {{ other_name }}
        </text>
        <view style="position: absolute;left: 0upx;width: 90%;">
          <view style="position: absolute; left: 0upx; width: 10%;">
            <view style="position: absolute;left: 20upx;">
              <imageCache style="width: 80upx;height: 80upx;" :url="other_image" mode="" />
            </view>
          </view>
          <view style="position: absolute; left: 20%;">
            <view class="Separation-line" />
            <view class="" style="padding: 10upx;text-align: left;background-color: #00ff33;border: 2upx solid #00ff33;border-radius: 0 20upx 20upx 20upx;">
              <view style="text-align: left;">
                <text style="font-size: 40upx;color: #4f4f4f;word-break:break-all;">
                  {{ msg.msg }}
                </text>
              </view>
            </view>
          </view>
        </view>
      </block>
      <br>
      <br>
      <br>
    </block>
    <br>
    <br>
    <br>
    <br>
    <br>
    <view class="" style="background-color: #ffffff;position: fixed;width: 100%;top: 92%;height: 8%;">
      <textarea v-model="input" style="float: left;border-radius: 25px;border: 5upx solid #00eaff;padding: 12upx; width: 78%; height: 70upx;font-size: 50upx;color: #000000;" />
      <button type="default" style="float: right;position: fixed;right: 0upx;width: 100upx;height: 100upx;background-color: #009dff;" @tap="ev()">
        <uni-icons type="paperplane" size="20" />
      </button>
    </view>
  </view>
</template>

<script>
import uniIcons from './uni-icons.vue';
import imageCache from '../imageCache/imageCache.vue';

export default {
  name: 'ChatTextList',
  components: { uniIcons, imageCache },

  // 属性
  props: {
    my_image: { // 我的图片的路径
      type: String,
      value: null,
    },
    other_image: { // 对方的图片
      type: String,
      value: null,
    },
    my_name: {
      type: String,
    },
    other_name: {
      type: String,
    },
    msgs: { // 聊天列表
      type: Array,
      // 使用方法：[{me:true, msg:"我发送的信息"}, {me:false, msg:"对方发送的信息"}]
      value: [],
    },
  },
  data() {
    return {
      input: '',
    };
  },
  methods: {
    ev() {
      const get = this.input;
      this.$emit('send', get);// 传递的值
    },
  },
};
</script>

<style>

</style>

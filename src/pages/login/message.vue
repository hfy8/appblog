<!--
 * @Author: bianjie
 * @Date: 2020-06-24 16:48:28
 * @LastEditors: bianjie
 * @LastEditTime: 2020-06-24 18:22:20
-->
<template>
  <view class="content">
    <view class="info-row">
      <view class="title">
        <text>短信验证码登陆</text>
      </view>
      <view class="input-group">
        <view class="input-row">
          <input v-model="account" type="text" placeholder="手机或邮箱">
        </view>
      </view>
      <view class="btn-row">
        <button type="primary" class="primary" @tap="bindLogin">
          发送验证码
        </button>
      </view>
      <view class="btn-row">
        <button plain class="plain" @tap="$emit('setCurrent','Login')">
          密码登陆
        </button>
      </view>
    </view>
    <view class="way-row">
      <text class="other-way">
        其他登陆方式
      </text>
      <view class="icon-row">
        <view class="icon-link">
          <uni-icons type="weixin" size="25" class="weixin" />
        </view>
        <view class="icon-link">
          <uni-icons type="weibo" size="25" class="weibo" />
        </view>
      </view>
    </view>
  </view>
</template>

<script>

export default {
  data() {
    return {
      account: '',
      password: '',
    };
  },
  methods: {
  },
};
</script>

<style lang="scss" scoped>
.content {
  display: flex;
  flex-direction: column;
  .info-row {
    padding: 80upx;
    padding-top: 150upx;
    flex: 1;
  }
  .way-row {
    padding: 80upx;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    .other-way {
      font-size: 24upx;
      display: flex;
      justify-content: center;
      color: $uni-text-color-placeholder;
      margin-bottom: 50upx;
    }
    .icon-row {
      display: flex;
      justify-content: center;
      .icon-link:first-child {
        margin-right: $uni-spacing-row-base;
      }
       .icon-link:first-child {
        margin-right: $uni-spacing-row-base;
      }
      .icon-link {
        width: 80upx;
        height: 80upx;
        border-radius: 40upx;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #e6ebf0;
      }
      .weixin {
        color: green !important;
      }
      .weibo {
        color: orange !important;
      }
    }
  }
  .title {
    font-size: 60upx;
    margin-bottom: 100upx;
  }
  height: 100vh;
}
.input-group {
  .input-row {
    margin-bottom: 60upx;
    border-bottom: 1upx solid #e6ebf0;
    :first-child {
      margin-bottom: 30upx;
    }
  }
}
.action-row {
  display: flex;
  flex-direction: row;
}

.action-row navigator {
  margin-top: 20upx;
  color: #007aff;
  font-size: 25upx;
}
.btn-row {
  margin-bottom: 20upx;
  .plain {
    border: none !important;
  }
}
</style>>

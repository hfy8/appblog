<!--
 * @Author: bianjie
 * @Date: 2020-06-24 16:48:28
 * @LastEditors: bianjie
 * @LastEditTime: 2021-01-29 17:41:30
-->
<template>
  <view class="content">
    <view class="info-row">
      <view class="title">
        <text>注册</text>
      </view>
      <view class="input-group">
        <view class="input-row">
          <u-input v-model="phone" type="textarea" placeholder="手机号" />
        </view>
        <view class="input-code">
          <u-input v-model="code" type="textarea" placeholder="请输入验证码" />
          <text class="time-bth" :class="disable?'time-on':''" @tap="sendCode">
            {{ !disable?'发送验证码':time+'s' }}
          </text>
        </view>
        <view class="input-row">
          <u-input v-model="name" type="textarea" placeholder="账号名称" />
        </view>
        <view class="input-row">
          <u-input v-model="password" type="password" placeholder="密码" />
        </view>
      </view>
      <view class="btn-row">
        <button type="primary" :disabled="!phone||!code||!name||!password" class="primary" @tap="registerLogin(name,phone,code,password)">
          确认登陆
        </button>
      </view>
      <view class="action-row">
        <text @tap="$emit('setCurrent', 'Login')">
          已有账号登陆
        </text>
      </view>
    </view>
  </view>
</template>

<script>
import { sendCode } from '@/api/user/userApi';
import { registerLogin } from '@/util/util';

export default {
  data() {
    return {
      phone: '',
      code: '',
      name: '',
      password: '',
      disable: false,
      time: 60,
      interval: undefined,
      registerLogin,
    };
  },
  methods: {
    sendCode() {
      if (this.phone) {
        sendCode(this.phone);
        this.disable = true;
        this.interval = setInterval(() => {
          this.time -= 1;
          if (this.time === 0) {
            this.disable = false;
            this.time = 60;
            clearInterval(this.interval);
          }
        }, 1000);
      }
    },
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
.btn-row {
  margin-bottom: 20upx;
  margin-top: 30upx;
  .plain {
    border: none !important;
  }
}

.action-row {
  display: flex;
  flex-direction: row;
}

.action-row text {
  margin-top: 20upx;
  color: #007aff;
  font-size: 25upx;
}
.time-bth{
  position: relative;
  height: 48px;
  padding-top: 4px;
  padding-bottom: 4px;
}
.input-code{
  display: flex;
}
.time-on{
  color:rgb(192, 196, 204)
}
</style>>

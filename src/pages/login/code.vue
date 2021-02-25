<!--
 * @Author: bianjie
 * @Date: 2021-01-13 17:58:47
 * @LastEditors: bianjie
 * @LastEditTime: 2021-01-14 10:03:57
-->
<template>
  <view class="content">
    <view class="info-row">
      <view class="title">
        <text>验证码</text>
      </view>
      <view class="input-group">
        <view class="input-row">
          <vcode-input
            ref="VcodeInput"
            is-auto-complete
            @vcodeInput="bindLogin"
          />
        </view>
      </view>
      <view class="btn-row">
        <button type="primary" class="primary" @tap="bandLogin">
          发送验证码
        </button>
      </view>
      <view class="action-row">
        <text @tap="$emit('setCurrent', 'Login')">
          密码登陆
        </text>
      </view>
    </view>
    <view class="way-row">
      <text class="other-way">
        其他登陆方式
      </text>
      <view class="icon-row">
        <view class="icon-link">
          <uni-icons type="weixin" size="25" class="weixin" @tap="login('weixin')" />
        </view>
        <view class="icon-link">
          <uni-icons type="weibo" size="25" class="weibo" @tap="login('sinaweibo')" />
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { getLoginTokenByPhone } from '@/api/user/userApi';
import vcodeInput from '@/components/vcode-input/vcode-input.vue';

export default {
  components: { vcodeInput },
  data() {
    return {
      account: '',
      password: '',
    };
  },
  methods: {
    async bandLogin() {
      uni.removeStorageSync('token');
      const result = await getLoginTokenByPhone({
        grant_type: 'sms',
        username: this.account,
        password: this.password,
        client_id: 'admin',
        client_secret: 'admin',
      }).catch(() => {
        // 消息框
        uni.showToast({
          icon: 'none',
          title: '登陆失败，请检查用户名和密码',
          position: 'bottom',
        });
      });
      const { data } = result;
      if (data.access_token) {
        uni.setStorage({ key: 'token', data: JSON.stringify(data) });
        connectSql();
        Object.assign(data);
        Vue.axios.defaults.headers.Authorization = `${data.token_type} ${data.access_token}`;
        await this.getFollows();
        connectServer(true);
        uni.setStorageSync('follows', JSON.stringify(this.follows));
        uni.switchTab({ url: '/pages/instance/index' });
      } else {
        // 消息框
        uni.showToast({
          icon: 'none',
          title: '登陆失败，请检查用户名和密码',
          position: 'bottom',
        });
      }
    },
    login(val) {
      uni.getLocation({
        type: 'wgs84',
        geocode: true,
        success(res) {
          console.log(res.address);
        },
      });
      uni.login(
        {
          provider: val,
          success() {
            uni.getUserInfo({
              provider: val,
              success(e) {
                console.log(e);
              },
            });
          },
        },
      );
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
.input-group {
  .input-row {
    margin-bottom: 60upx;
    border-bottom: 1upx solid #e6ebf0;
    :first-child {
      margin-bottom: 30upx;
    }
  }
}
.btn-row {
  margin-bottom: 20upx;
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
</style>>

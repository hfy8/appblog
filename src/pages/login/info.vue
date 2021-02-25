<!--
 * @Author: bianjie
 * @Date: 2021-01-29 17:15:17
 * @LastEditors: bianjie
 * @LastEditTime: 2021-01-29 17:15:18
-->
<!--
 * @Author: bianjie
 * @Date: 2021-01-14 10:06:08
 * @LastEditors: bianjie
 * @LastEditTime: 2021-01-15 11:14:49
-->
<!--
 * @Author: bianjie
 * @Date: 2020-06-24 16:48:28
 * @LastEditors: bianjie
 * @LastEditTime: 2021-01-13 17:38:28
-->
<template>
  <view class="content">
    <view class="info-row">
      <view class="title">
        <text>绑定手机</text>
      </view>
      <view class="input-group">
        <view class="input-row">
          <input v-model="phone" type="text" placeholder="手机">
        </view>
      </view>
      <view class="btn-row">
        <button type="primary" class="primary" @tap="register">
          确认绑定
        </button>
      </view>
    </view>
  </view>
</template>

<script>
import { registerUser } from '@/api/user/userApi';
import { mapActions, mapState } from 'vuex';
import { bindLogin } from '@/util/util';

export default {
  data() {
    return {
      phone: '',
      user: JSON.parse(uni.getStorageSync('login')),
      bindLogin,
    };
  },
  computed: {
    ...mapState('follow', ['follows']),
  },
  methods: {
    ...mapActions('img', ['uploadImg']),
    ...mapActions('follow', ['getFollows']),

    async register() {
      if (this.phone === '') {
        uni.showToast({
          icon: 'none',
          title: '手机号码不能为空',
          position: 'bottom',
        });
        return;
      }
      let urls = '';
      await uni.downloadFile({
        url: this.user.imageUrl, // 图片地址
        success: async (res) => {
          if (res.statusCode === 200) {
            urls = res.tempFilePath;
            await this.uploadImg(
              {
                path: urls,
              },
            ).catch((e) => {
              console.log(e);
            });
            await registerUser({
              userId: this.user.userId,
              icon: `${urls.substring(urls.lastIndexOf('/') + 1).replace(/[-]/g, '')}.jpg`,
              account: this.user.userName,
              userName: '',
              showName: this.user.userName,
              phone: this.phone,
            }).catch((e) => {
              console.log(e);
            });
            bindLogin(this.user.userName, this.user.userId);
          }
        },
      });
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

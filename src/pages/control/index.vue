<!--
 * @Author: bianjie
 * @Date: 2021-01-12 14:27:25
 * @LastEditors: bianjie
 * @LastEditTime: 2021-02-05 11:35:35
-->
<!--本页面由uniapp切片工具生成，uni-app切片-可视化设计工具(一套代码编译到7个平台iOS、Android、H5、小程序)，软件下载地址：http://www.ymznkf.com/new_view_669.htm -->
<template>
  <view class="YmContent">
    <view class="my_1">
      <view class="my_2">
        <view class="my_6">
          <view @tap.stop="chooseFile">
            <imageCache
              ref="img"
              clas="user-picture"
              :url="`${baseConfig.API_PATH}minio/down/${item.userIcon}`"
              mode="scaleToFill"
              border="0"
              class="my_7"
            />
          </view>
          <text decode="true" class="my_8">
            {{ item.userName }}
          </text>
        </view>
      </view>
      <view class="my_4">
        <view class="my_31">
          <image src="/static/user/bg.png" mode="scaleToFill" border="0" class="my_23" @click="my_23_23_click()" />
          <text decode="true" class="my_24">
            修改密码
          </text>
          <image src="/static/user/yjt.png" mode="scaleToFill" border="0" class="my_25" @click="my_25_25_click()" />
        </view>
        <view class="my_32">
          <image src="/static/user/sm.png" mode="scaleToFill" border="0" class="my_27" @click="my_27_27_click()" />
          <text decode="true" class="my_28">
            扫一扫
          </text>
          <image src="/static/user/yjt.png" mode="scaleToFill" border="0" class="my_29" @click="my_29_29_click()" />
        </view>
      </view>
      <view class="my_5">
        <image src="/static/user/sz.png" mode="scaleToFill" border="0" class="my_17" @click="my_17_17_click()" />
        <text decode="true" class="my_18">
          设置
        </text>
        <image src="/static/user/yjt.png" mode="scaleToFill" border="0" class="my_19" @click="my_19_19_click()" />
      </view>
      <view>
        <button class="register" size="mini" @tap="register">
          退出登陆
        </button>
      </view>
    </view>
  </view>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      item: JSON.parse(uni.getStorageSync('token')),
      path: '',
    };
  },
  methods: {
    ...mapActions('img', ['uploadImg']),
    register() {
      uni.setStorageSync('token', '');
      uni.closeSocket();
      uni.reLaunch({ url: '/pages/login/index' });
    },
    /**
     * 选择头像
     */
    chooseFile() {
      uni.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          this.path = res.tempFilePaths;
          this.getBlob(this.path[0]);
        },
        fail: (err) => {
          console.log(err);
        },
      });
    },
    // 上传文件
    async getBlob(path) {
      const params = {
        path,
        name: this.item.userIcon,
      };
      await this.uploadImg(params);
      setTimeout(() => {
        this.$refs.img.reset();
      }, 3000);
    },
  },
};
</script>

<style lang="scss" scoped>
   @import './my.scss';
   .register{
     color:red;
     width: 750upx;
     font-size: 32upx;;
   }
</style>

<template>
  <view>
    <view class="zhtx-imgs">
      <view v-for="(item, index) in list" :key="index" class="zhtx-single">
        <image
          :src="item"
          mode="aspectFit"
          @tap="previewImg"
        />
        <view class="zhtx-del" @tap="deleteItem(index)">
          x
        </view>
      </view>
      <view
        v-if="limit > list.length"
        class="zhtx-single zhtx-addNew"
        @tap="chooseFile"
      >
        <text class="zhtx-add">
          +
        </text>
      </view>
    </view>
    <view class="num">
      <text style="color: #007aff; font-size: 14px">
        {{ list.length }}
      </text>
      /{{ limit }}
    </view>
  </view>
</template>

<script>
import { mapActions } from 'vuex';
import imageCache from '../imageCache/imageCache.vue';

const toast = (msg) => {
  uni.showToast({
    title: msg,
    icon: 'none',
    position: 'bottom',
  });
};
/* eslint-disable*/
export default {
  components:{imageCache},
  props: {
    uImgList: {
      type: Array, // 附件列表
      default() {
        return [];
      },
    },
    uploadFileUrl: {
      type: String,
      dafault: "#", // 上传文件的服务器url
    },
    header: {
      type: Object, // 上传图片到服务器时，HTTP 请求 Header
      default() {
        return {};
      },
    },
    limit: {
      type: Number, // 限制可上传的图片数量
      default: 9, // 这里有问题???
    },
    fileKeyName: {
      type: String,
      default: "file", // 用于在服务端通过自定义key值获取该文件数据
    },
    canUploadFile: {
      // 是否更新
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      imageList: [],
      files: [],
    };
  },
  computed: {
    list: {
      get() {
        return this.uImgList;
      },
    },
  },
  methods: {
    ...mapActions("img", ["uploadImg"]),
    // 预览
    previewImg(e) {
      uni.previewImage({
        current: e.target.dataset.src,
        loop: true,
        longPressActions: {
          itemList: ["发送给朋友", "保存图片", "收藏"],
          success: (data) => {
            // 可以自定义分享操作
            console.log(
              `选中了第${data.tapIndex + 1}个按钮,第${data.index + 1}张图片`
            );
          },
          fail(err) {
            console.log(err.errMsg);
          },
        },
        urls: this.list, // this.imageList,保持删除了的不在
      });
    },
    // 删除
    deleteItem(index) {
      uni.showModal({
        title: "提示",
        content: "确定要删除此项吗？",
        success: (res) => {
          if (res.confirm) {
            this.imageList.splice(index, 1);
            this.files.splice(index, 1);
            this.list.splice(index, 1); // 已经达到了数据更新的状态
            // this.$forceUpdate(); //强制更新
            this.$emit("input", this.list); // 类似双向数据绑定
          }
        },
      });
    },

    chooseFile() {
      // 双重保证
      // console.log(this.list);
      if (this.list.length >= this.limit) {
        toast("已达到最大上传数量");
        return;
      }

      const { canUploadFile } = this;
      let tempFiles;
      if (canUploadFile) {
        uni.chooseImage({
          count: this.limit - this.list.length,
          sizeType: ["original", "compressed"],
          sourceType: ["album", "camera"],
          success: (res) => {
            tempFiles = res.tempFilePaths;
            this.files.push(res.tempFiles);
            this.imageList = this.imageList.concat(tempFiles);
            this.list.push(...tempFiles); // 如果图片一次性就超过这个值怎么使他赋的值回退

            // #ifdef H5
            if (this.list.length >= this.limit) {
              this.files.splice(this.limit);
              this.list.splice(this.limit);
              toast("已达到最大上传数量");
              return;
            }
            // #endif

            this.$emit("input", this.list); // 类似双向数据绑定,更新数据, 使用.sync修饰
            this.$forceUpdate();
          },
          fail: (err) => {
            console.log(err);
          },
        });
      }
    },
    // 上传文件
    getBlob(path) {
      const params = {
        path,
      };
      this.uploadImg(params);
    },
    async upload() {
      // const files = [];
      uni.showLoading({
        title: "上传中...",
        mask: false,
      });
      // 这里改成异步上传会不会更好(对于跨端请求,只能重复调用api)
      for (let i = 0; i < this.list.length; i++) {
        this.getBlob(this.list[i]);
        uni.hideLoading();
      }
    },
  },
};
</script>

<style  >
.zhtx-imgs {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
}
.zhtx-del {
  position: absolute;
  width: 35rpx;
  height: 35rpx;
  background: #f56c6c;
  color: #fff;
  top: 0;
  text-align: center;
  right: 0;
  line-height: 28rpx;
  font-size: 30rpx;
  z-index: 100;
}
.zhtx-single {
  position: relative;
  width: 180rpx;
  height: 180rpx;
  border: 1px solid #ccc;
  margin: 10rpx;
}
.zhtx-addNew {
  display: flex;
  justify-content: center;
  align-items: center;
}
text {
  font-size: 50rpx;
  color: #999;
}
image {
  width: 100%;
  height: 100%;
  display: block;
}
.num {
  float: right;
  color: #ccc;
  font-size: 12px;
}
.num::after {
  clear: both;
}
</style>

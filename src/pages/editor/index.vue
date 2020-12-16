<!--
 * @Author: bianjie
 * @Date: 2020-07-08 17:42:10
 * @LastEditors: bianjie
 * @LastEditTime: 2020-12-15 18:18:57
-->
<template>
  <view class="content">
    <top-bar v-model="searchContent" :type="'back'" @submit="issueSubmit" @confirm="search" />
    <view class="content-body">
      <bj-form
        ref="form"
        msg-type="msg"
        label-type="inline"
        :rules="rules"
        label-width="0"
        :form="form"
      >
        <bj-form-item prop="title">
          <input v-model="form.title" class="content-body-label" name="input" placeholder="标题">
        </bj-form-item>
        <bj-form-item prop="content">
          <view :value="form.content" class="content-body-text">
            <editor
              id="editor"
              ref="editot"
              name="textarea"
              class="ql-container"
              placeholder="发表你的内容"
              @input="handleContent"
              @ready="onEditorReady"
            />
            <view class="icons-op">
              <icons type="&#xe658;" @tap="setBold" />
              <icons type="&#xe655;" />
              <icons type="&#xe65c;" />
              <icons type="&#xe65a;" />
              <icons type="&#xe657;" @tap="setHeader" />
              <icons type="&#xe65d;" />
            </view>
          </view>
        </bj-form-item>
        <bj-form-item prop="images">
          <imgUpload
            ref="images"
            v-model="form.images"
            class="content-body-image"
            name="imgUpload"
          />
        </bj-form-item>
      </bj-form>
    </view>
  </view>
</template>

<script>
import imgUpload from '@/components/zhtx-uploadImg/zhtx-uploadImg.vue';
import { mapActions } from 'vuex';
import { splitArray } from '@/util/util';
import icons from './icons.vue';

export default {
  components: { imgUpload, icons },
  data() {
    return {
      current: 'Login',
      searchContent: '',
      form: {
        title: '',
        content: '',
        images: [],
      },
      rules: {
        title: {
          validator: (value) => {
            if (!value) {
              return '标题不能为空';
            }
            if (value.length < 1 || value.length > 300) {
              return '标题不能超出300字';
            }
            return true;
          },
        },
        content: {
          validator: () => {
            if (!this.form.content) {
              return '内容不能低于50字';
            }
            if (this.form.content.length < 50) {
              return '内容不能低于50字';
            }
            if (this.form.content.length > 3000) {
              return '内容不能超出3000字';
            }
            return true;
          },
        },
        images: {
          validator: (value) => {
            if (value.length === 0) {
              return '请选择图片';
            }
            return true;
          },
        },
      },
    };
  },
  onBackPress(options) {
    if (options.from === 'navigateBack') {
      return true;
    }
    uni.navigateBack();
    return false;
  },
  methods: {
    ...mapActions('issue', ['plicIssue']),
    onEditorReady() {
      uni
        .createSelectorQuery()
        .in(this)
        .select('.ql-container')
        .fields(
          {
            size: true,
            context: true,
          },
          (res) => {
            this.editorCtx = res.context;
            this.editorCtx.setContents({
              html: this.html,
            });
          },
        )
        .exec();
    },
    undo() {
      this.editorCtx.undo();
    },
    setBold() {
      this.editorCtx.format('bold');
    },
    setHeader() {
      this.editorCtx.format('header', 'h4');
    },
    handleContent(e) {
      this.form.content = e.detail.html;
    },
    async issueSubmit() {
      this.$refs.form.validate(async (err) => {
        if (err) {
          await this.$refs.images.upload().catch((er) => {
            console.log(er);
          });
          const images = this.form.images.map(
            (el) => `${el.substring(el.lastIndexOf('/') + 1).replace(/[-]/g, '')}.jpg`,
          );
          const params = {
            did: parseInt(new Date().getTime() / 1000, 10),
            content: this.form.content,
            title: this.form.title,
            images: splitArray(images, ','),
          };
          await this.plicIssue(params);
          this.$navigateTo({ url: '/pages/main/index' });
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
@font-face {
  font-family: "iconfont"; /* project id 1483307 */
  src: url("https://at.alicdn.com/t/font_1483307_bak9n3w3yqt.ttf")
    format("truetype");
}
.content-body {
  margin: 20upx;
}
.content-body-label {
  padding-left: 10upx;
  font-size: 12px;
  border-left: 2px solid red;
}
.content-body-text {
  font-size: 12px;
  margin-top: 10upx;
  padding: 10upx;
  width: auto;
  border: 1px solid #eee;
}
.content-body-image {
  margin-top: 20upx;
  border: 1px solid #eee;
}
.icons-op {
  display: flex;
}
.ql-container{
  word-break: break-all;

}
</style>

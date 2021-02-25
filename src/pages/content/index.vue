<!--
 * @Author: bianjie
 * @Date: 2020-07-13 12:24:23
 * @LastEditors: bianjie
 * @LastEditTime: 2021-01-27 14:06:13
-->
<template>
  <view class="content">
    <view v-if="images" class="image">
      <imageCache
        v-for="(it, index) in images"
        :key="index"
        :url="it"
        mode="scaleToFill"
        :clas="`images image-${images.length}`"
      />
    </view>
    <view class="user-title">
      <view>
        <imageCache
          clas="user-picture"
          :url="`${this.baseConfig.API_PATH}minio/down/${item.uicon}`"
          mode="scaleToFill"
        />
      </view>
      <text class="user-name">
        {{ item.uname }}
      </text>
      <view v-if="token && token.userName !== item.uname" class="user-button">
        <view
          v-if="follows.find((el) => el.fuid === item.uid)"
          class="notice-button un-follow"
          @tap="disFollow"
        >
          - 已关注
        </view>
        <view v-else class="notice-button" @tap="follow">
          + 关注
        </view>
      </view>
    </view>
    <view class="title">
      <text>{{ item.title }}</text>
    </view>
    <view class="body">
      <rich-text class="ql-editor" :nodes="item.content" />
    </view>
    <view class="footer">
      <view
        :class="token && token.userName === item.uname ? 'disable-tap' : ''"
      >
        <text
          class="thumbup"
          :class="token && token.userName === item.uname ? 'disable-tap' : ''"
          @tap="thumbUp(item)"
        >
          赞同 {{ item.thumbUp }}
        </text>
      </view>
      <view>
        <text class="discussnum" @tap="toggleMask('show')">
          . 评论 {{ item.discussNum }}
        </text>
      </view>
      <view>
        <uni-icons
          class="disscuss-icon"
          :type="open ? 'arrowdown' : 'forward'"
          size="14"
          color="#444"
          @tap="comment"
        />
      </view>
    </view>
    <view v-if="open" class="comments">
      <view v-if="comments.length === 0" class="no-commnets">
        <text>暂无评论</text>
      </view>
      <view
        v-for="com in comments"
        :key="com.cid"
        :class="token && token.userName === com.uname ? 'disable-tap' : ''"
      >
        <view
          :class="token && token.userName === com.uname ? 'disable-tap' : ''"
          @tap="toggleMask('show', com)"
        >
          <comment :item="com" />
        </view>
      </view>
      <view
        v-if="commentTotal > comments.length"
        class="more-commnets"
        @tap="allComments()"
      >
        <uniLoadMore
          :status="loading?'loading':'more'"
          :content-text="{
            contentdown: '点击加载所有',
            contentrefresh: '',
            contentnomore: '没有更多数据了',
          }"
          :icon-size="16"
          :color="'#444'"
          icon-type="circle"
        />
      </view>
    </view>
    <popComment
      ref="popComment"
      :placeholder="'发布评论'"
      @pubComment="popComment"
    />
  </view>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import popComment from '@/components/ygc-comment/ygc-comment.vue';
import imageCache from '@/components/imageCache/imageCache.vue';
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
import comment from './comment.vue';

export default {
  components: {
    comment, popComment, imageCache, uniLoadMore,
  },
  data() {
    return {
      item: {},
      images: [],
      uicon: '',
      open: '',
      all: false,
      loading: false,
      relateComment: undefined,
      token: JSON.parse(uni.getStorageSync('token')) || {},
    };
  },
  computed: {
    ...mapState('issue', ['issueGlobalList', 'comments', 'commentTotal']),
    ...mapState('follow', ['follows']),
  },
  methods: {
    ...mapActions('issue', [
      'thumbUpIssue',
      'getGlobalIssueList',
      'getComments',
      'createComment',
    ]),
    ...mapActions('follow', ['getFollows', 'followUser', 'disFollowUser']),
    // 获取图片URL地址
    getIamges() {
      const images = this.item.images.split(',');
      images.map((el) => {
        this.images.push(`${this.baseConfig.API_PATH}minio/down/${el}`);
      });
    },
    async thumbUp(item) {
      await this.thumbUpIssue(item);
      this.item.thumbUp += 1;
    },
    async comment() {
      if (!this.open) {
        await this.getComments(this.item);
      }
      this.open = !this.open;
    },
    // 打开评论发言表单
    toggleMask(type, obj) {
      this.relateComment = undefined;
      if (obj) {
        this.relateComment = obj;
      }
      this.$refs.popComment.toggleMask(type);
    },
    // 发表评论
    async popComment(content) {
      const data = JSON.parse(uni.getStorageSync('token'));
      await this.createComment({
        uid: data.userId,
        tuId: this.relateComment ? this.relateComment.uid : this.item.uid,
        did: this.item.did,
        content,
        tcId: this.relateComment ? this.relateComment.cid : '',
        type: this.relateComment ? 2 : 1,
        uname: data.userName,
        uicon: data.userIcon,
        tuName: this.relateComment ? this.relateComment.uname : '',
      });
      this.item.discussNum += 1;
      this.toggleMask('');
      if (this.all) {
        await this.getComments({
          did: this.item.did,
          params: { page: 1, size: this.commentTotal + 1 },
        });
      } else {
        await this.getComments(this.item);
      }
      this.open = true;
    },
    // 关注
    async follow() {
      await this.followUser({
        fuid: this.item.uid,
        funame: this.item.uname,
        fuicon: this.item.uicon,
      });
      await this.getFollows();
    },
    // 取关
    async disFollow() {
      await this.disFollowUser({
        fuid: this.item.uid,
        funame: this.item.uname,
      });
      await this.getFollows();
    },
    // 默认初始评论信息
    async openComments() {
      await this.getComments(this.item);
      this.open = true;
    },
    // 加载所有评论
    async allComments() {
      this.loading = true;
      await this.getComments({
        did: this.item.did,
        params: { page: 1, size: this.commentTotal },
      });
      this.loading = false;
      this.all = true;
    },
  },
  onLoad(options) {
    this.item = JSON.parse(decodeURIComponent(options.item));
    if (this.item.images) {
      this.getIamges();
      this.openComments();
    }
  },
};
</script>

<style lang="scss" scoped>
.content {
  text-align: left;
  height: 100vh;
  background-color: #ffffff;
  .title {
    height: 60upx;
    padding: 14upx;
    font-weight: bold;
    font-size: 24px;
  }
  .image {
    display: flex;
    flex-wrap: wrap;
    .images {
      box-sizing: border-box;
      display: flex; //2父元素flex 伸缩盒子布局
      flex-wrap: wrap; //2父元素设置换行
    }
    .image-1 {
      width: calc(100%);
      height: 400upx;
    }
    .image-2 {
      width: calc(calc(100% / 2) - 0px);
      height: 400upx;
    }
    .image-3 {
      width: calc(calc(100% / 3) - 0px);
      height: 400upx;
    }
    .image-4 {
      width: calc(calc(100% / 2) - 0px);
      height: 200upx;
    }
    .image-5 {
      width: calc(calc(100% / 3) - 0px);
      height: 200upx;
    }
    .image-6 {
      width: calc(calc(100% / 3) - 0px);
      height: 200upx;
    }
    .image-7 {
      width: calc(calc(100% / 3) - 0px);
      height: 133upx;
    }
    .image-8 {
      width: calc(calc(100% / 3) - 0px);
      height: 133upx;
    }
    .image-9 {
      width: calc(calc(100% / 3) - 0px);
      height: 133upx;
    }
  }
  .body {
    padding: 14upx;
    word-wrap: break-word;
    white-space: normal;
    word-break: break-all;
  }
  .footer {
    display: flex;
    align-self: center;
    align-items: center;
    padding: 14upx;
    font-size: 25upx;
    vertical-align: middle;
    margin-top: 20upx;
    .disscuss-icon {
      line-height: 25upx;
      flex: 1;
      vertical-align: middle;
    }
    uni-view {
      vertical-align: middle;
    }
  }
  .user-title {
    display: flex;
    font-size: 32upx;
    margin-bottom: 10upx;
    height: 90upx;
    vertical-align: middle;
    align-items: center;
    padding: 14upx;
    border-bottom: 1px solid #eeeeee;
    .user-button {
      width: 200upx;
      vertical-align: middle;
      text-align: right;
      .notice-button {
        vertical-align: middle;
        font-size: 32upx;
        height: 60upx;
        font-weight: 500;
        border-radius: 8upx;
        line-height: 60upx;
        text-align: center;
        color: white;
        background-color: #5a9bec;
      }
      .un-follow {
        background-color: #eee;
      }
    }
    .user-picture {
      vertical-align: middle;
      width: 60upx;
      height: 60upx;
      border-radius: 50%;
    }
    .user-name {
      vertical-align: middle;
      line-height: 60upx;
      flex: 1;
      margin-left: 10upx;
      font-weight: 500;
      color: rgb(56, 55, 55);
    }
  }
}
.ql-editor {
  font-size: 32upx;
}
.footer {
  .thumbup,
  .discussnum {
    display: inline-block;
    vertical-align: middle;
    font-size: 25upx;
    color: #444;
    line-height: 25upx;
  }
}
.scroll-90 {
  transform: rotate(90deg);
}
.disable-tap {
  pointer-events: none;
}
.comments {
  background-color: #eeeeee;
  border-radius: 4px;
  padding: 10upx;
  margin: 10upx;
}
.no-commnets {
  font-size: 25upx;
  text-align: center;
  color: #444;
}
.more-commnets {
  font-size: 25upx;
  text-align: center;
  color: #444;
}
</style>

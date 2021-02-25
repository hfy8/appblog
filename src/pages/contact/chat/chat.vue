<template>
  <view class="content">
    <view id="content-box" class="content-box" :class="{'content-showfn':showFunBtn}" @touchstart="touchstart">
      <!-- 背景图- 定位方式 -->
      <!-- <image class="content-box-bg" :src="_user_info.chatBgImg" :style="{ height: imgHeight }" /> -->
      <view v-if="loading" class="content-box-loading">
        <uniLoadMore
          :status="loading?'loading':'noMore'"
          :content-text="{
            contentdown: '上拉显示更多',
            contentrefresh: '',
            contentnomore: '没有更多数据了',
          }"
          icon-type="circle"
        />
      </view>
      <view v-for="(item, index) in messageList" :id="`msg-${index}`" :key="index" class="message">
        <view class="message-item " :class="String(item.from)===String(token().userId) ? 'right' : 'left'">
          <imageCache
            clas="user-picture img"
            :url="`${baseConfig.API_PATH}minio/down/${item.ficon}`"
            mode="scaleToFill"
          />
          <!-- type = 1 文本 -->
          <view v-if="item.type === 1" class="content">
            {{ item.content }}
          </view>
          <!-- type = 2 语音 -->
          <view
            v-if="item.type === 2"
            class="content type2"
            :class="[{ 'content-type-right': item.isItMe }]"
            hover-class="type2-hover-class"
            :style="{width:`${130+(item.contentDuration*2)}rpx`}"
            @tap="handleAudio(item)"
          >
            <view
              class="voice_icon"
              :class="[
                { voice_icon_right: item.isItMe },
                { voice_icon_left: !item.isItMe },
                { voice_icon_right_an: item.anmitionPlay && item.isItMe },
                { voice_icon_left_an: item.anmitionPlay && !item.isItMe }
              ]"
            />
            <view class="">
              {{ item.contentDuration }}''
            </view>
          </view>
          <!-- type = 3 图片 -->
          <view
            v-if="item.type === 3"
            class="content type3"
            @tap="viewImg([item.content])"
          >
            <image :src="item.content" class="img" mode="widthFix" />
          </view>
        </view>
      </view>
    </view>

    <!-- 底部聊天输入框 -->
    <view class="input-box" :class="{ 'input-box-mpInputMargin': mpInputMargin }">
      <view class="input-box-flex">
        <!-- #ifndef H5 -->
        <image v-if="chatType === 'voice'" class="icon_img" :src="require('@/static/voice.png')" @click="switchChatType('keyboard')" />
        <image v-if="chatType === 'keyboard'" class="icon_img" :src="require('@/static/keyboard.png')" @click="switchChatType('voice')" />
        <!-- #endif -->
        <view class="input-box-flex-grow">
          <input
            v-if="chatType === 'voice'"
            id="input"
            v-model="formData.content"
            type="text"
            class="content"
            :hold-keyboard="true"
            :confirm-type="'send'"
            :confirm-hold="true"
            placeholder-style="color:#DDDDDD;"
            :cursor-spacing="10"
            @confirm="sendMsg(null)"
          >
          <view
            v-if="chatType === 'keyboard'"
            class="voice_title"
            :style="{ background: recording ? '#c7c6c6' : '#FFFFFF' }"
            @touchstart.stop.prevent="startVoice"
            @touchmove.stop.prevent="moveVoice"
            @touchend.stop="endVoice"
            @touchcancel.stop="cancelVoice"
          >
            {{ voiceTitle }}
          </view>
        </view>

        <!-- 功能性按钮 -->
        <image class=" icon_btn_add" :src="require('@/static/add.png')" @tap="switchFun" />

        <button class="btn" type="primary" size="mini" @touchend.prevent="sendMsg(null)">
          发送
        </button>
      </view>

      <view class="fun-box" :class="{'show-fun-box':showFunBtn}">
        <u-grid :col="4" hover-class="type2-hover-class" :border="false" @click="clickGrid">
          <u-grid-item v-for="(item, index) in funList" :key="index" :index="index" bg-color="#eaeaea">
            <u-icon :name="item.icon" :size="52" />
            <view class="grid-text">
              {{ item.title }}
            </view>
          </u-grid-item>
        </u-grid>
      </view>
    </view>

    <!-- //语音动画 -->
    <view v-if="recording" class="voice_an">
      <view class="voice_an_icon">
        <view id="one" class="wave" />
        <view id="two" class="wave" />
        <view id="three" class="wave" />
        <view id="four" class="wave" />
        <view id="five" class="wave" />
        <view id="six" class="wave" />
        <view id="seven" class="wave" />
      </view>
      <view class="text">
        {{ voiceIconText }}
      </view>
    </view>
  </view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
import {
  connectServer,
  sort,
} from '@/util/util';
import moment from 'moment';
import {
  openSqlite,
  insertInformationType,
  selectInformationType,
  messageInfoSQL,
  countInformationType,
  isOpen,
} from '@/util/sql';

export default {
  components: { uniLoadMore },
  data() {
    return {
      fromUserInfo: {},
      formData: {
        content: '',
        limit: 15,
        index: 1,
      },
      fuid: '',
      messageList: [],
      canPush: false, // 初始页面不需要监听message
      loading: false, // 标识是否正在获取数据
      imgHeight: '1000px',
      mpInputMargin: false, // 适配微信小程序 底部输入框高度被顶起的问题
      chatType: 'voice', // 图标类型 'voice'语音 'keyboard'键盘
      voiceTitle: '按住 说话',
      Recorder: uni.getRecorderManager(),
      Audio: uni.createInnerAudioContext(),
      recording: false, // 标识是否正在录音
      isStopVoice: false, // 加锁 防止点击过快引起的当录音正在准备(还没有开始录音)的时候,却调用了stop方法但并不能阻止录音的问题
      voiceInterval: null,
      voiceTime: 0, // 总共录音时长
      canSend: true, // 是否可以发送
      PointY: 0, // 坐标位置
      voiceIconText: '正在录音...',
      showFunBtn: false, // 是否展示功能型按钮
      AudioExam: null, // 正在播放音频的实例
      funList: [
        { icon: 'photo-fill', title: '照片', uploadType: ['album'] },
        { icon: 'camera-fill', title: '拍摄', uploadType: ['camera'] },
      ],
    };
  },
  onLoad(options) {
    this.fuid = options.fuid;
    // 录音开始事件
    this.Recorder.onStart(() => {
      this.beginVoice();
    });
    // 录音结束事件
    this.Recorder.onStop((res) => {
      clearInterval(this.voiceInterval);
      this.handleRecorder(res);
    });

    // 音频停止事件
    this.Audio.onStop(() => {
      this.closeAnmition();
    });

    // 音频播放结束事件
    this.Audio.onEnded(() => {
      this.closeAnmition();
    });
  },
  onPullDownRefresh() {
    uni.stopPullDownRefresh();
    this.joinData();
  },
  computed: {
    ...mapState('follow', ['follows']),
    ...mapState('user', ['temUsers']),
    ...mapState('message', ['messages']),

    item() {
      return this.follows.find((el) => el.fuid === this.fuid) || this.temUsers.find((el) => el.fuid === this.fuid);
    },
  },
  watch: {
    'item.message': {
      handler(val) {
        if (val.length === 0) {
          return;
        }
        // #ifdef APP-PLUS
        if (!this.canPush) {
          this.item.message = [];
          return;
        }
        // #endif
        if (val.length > 0) {
          this.messageList = [...this.messageList, ...val];
          // #ifdef H5
          this.setMessage({ user: this.item.fuid, [this.item.fuid]: [...val] });
          // #endif
          this.item.message = [];
          this.$nextTick(() => {
            // #ifdef APP-PLUS
            uni.pageScrollTo({
              scrollTop: 99999,
              duration: 100,
            });
            // #endif
          });
        }
      },
      mmediate: true,
    },
  },
  methods: {
    ...mapMutations('message', ['setMessage']),
    // token值
    token() {
      return JSON.parse(uni.getStorageSync('token'));
    },
    // 获取聊天总数
    async getNum() {
      const token = this.token();
      const num = await countInformationType(token.userName, this.item.fuid);
      return num;
    },
    // 拼接消息 处理滚动
    async joinData() {
      // #ifdef APP-PLUS
      const info = await this.getNum();

      const { num } = info[0];
      if (num <= this.messageList.length) {
        return;
      }
      // #endif
      this.loading = true;
      let data = [];
      // #ifdef APP-PLUS
      data = await this.getMessageData();
      // #endif
      // 获取节点信息
      setTimeout(() => {
        this.loading = false;
        // #ifdef H5
        if (this.item.fuid in this.messages) {
          this.messageList = [...this.messages[this.item.fuid]];
        } else {
          this.messageList = [];
        }
        // #endif
        // #ifdef APP-PLUS
        this.messageList = [...data, ...this.messageList];
        if (!this.canPush) {
          this.$nextTick(() => {
            uni.pageScrollTo({
              scrollTop: 99999,
              duration: 100,
            });
          });
        } else {
          this.$nextTick(() => {
            uni.pageScrollTo({
              scrollTop: 0,
              duration: 1000,
            });
          });
        }
        // #endif
        this.formData.index++;
        this.canPush = true;
      }, 200);
    },
    // 处理滚动
    bindScroll(sel, duration = 0) {
      const query = uni.createSelectorQuery().in(this);
      query
        .select(sel)
        .boundingClientRect((data) => {
          uni.pageScrollTo({
            scrollTop: data && data.top - 40,
            duration,
          });
        })
        .exec();
    },
    // 获取消息
    async getMessageData() {
      const token = this.token();
      let arr = [];
      const startIndex = (this.formData.index - 1) * this.formData.limit;
      arr = await selectInformationType(token.userName, startIndex, this.formData.limit, this.item.fuid);
      arr.sort(sort('list'));
      return arr;
    },
    // 切换语音或者键盘方式
    switchChatType(type) {
      this.chatType = type;
      this.showFunBtn = false;
    },
    // 切换功能性按钮
    switchFun() {
      this.chatType = 'keyboard';
      this.showFunBtn = !this.showFunBtn;
      uni.hideKeyboard();
    },
    // 发送消息
    sendMsg() {
      if (!this.formData.content) {
        return;
      }
      const token = this.token();
      const params = {
        content: this.formData.content,
        ficon: token.userIcon, // 用户头像
        from: `${token.userId}`,
        to: `${this.item.fuid}`,
        ticon: this.item.fuicon,
        createTime: moment(Date.now()).format('YYYY.MM.DD HH:MM'),
        type: 1,
      };
      this.messageList.push(params);
      // #ifdef H5
      this.setMessage({ user: this.item.fuid, [this.item.fuid]: [params] });
      // #endif
      // #ifdef APP-PLUS
      if (!isOpen(token.userName)) {
        openSqlite(token.userName);
      }
      messageInfoSQL(token.userName);
      insertInformationType(token.userName, params.from, params.ficon, params.to, params.ticon, params.content, params.createTime, params.type).catch((e) => {
        console.log(e);
      });
      // #endif
      if (this.follows.some((el) => el.fuid === this.fuid)) {
        this.$store.commit('follow/reset', 'follows');
      }
      if (this.temUsers.some((el) => el.fuid === this.fuid)) {
        this.$store.commit('user/reset', 'temUsers');
      }
      this.$nextTick(() => {
        this.formData.content = '';
        // #ifdef APP-PLUS
        uni.pageScrollTo({
          scrollTop: 99999,
          duration: 100,
        });
        // #endif

        if (this.showFunBtn) {
          this.showFunBtn = false;
        }

        // #ifdef APP-PLUS
        if (params.type === 1) {
          this.mpInputMargin = true;
        }
        // #endif
        // h5浏览器并没有很好的办法控制键盘一直处于唤起状态 而且会有样式性的问题
        // #ifdef H5
        uni.hideKeyboard();
        // #endif
      });
      this.$socketTask.send({
        data: JSON.stringify(params),
        computed() { console.log('消息已发送'); },
        fail() {
          connectServer(true);
          setTimeout(() => {
            this.$socketTask.send({
              data: JSON.stringify(params),
              computed() { console.log('消息已发送'); },
            });
          }, 1000);
        },
      });
    },
    // 用户触摸屏幕的时候隐藏键盘
    touchstart() {
      uni.hideKeyboard();
    },
    // // userid 用户id
    // linkToBusinessCard(userId) {
    //   this.$u.route({
    //     url: 'pages/businessCard/businessCard',
    //     params: {
    //       userId,
    //     },
    //   });
    // },
    // 准备开始录音
    startVoice(e) {
      if (!this.Audio.paused) {
        // 如果音频正在播放 先暂停。
        this.stopAudio(this.AudioExam);
      }
      this.recording = true;
      this.isStopVoice = false;
      this.canSend = true;
      this.voiceIconText = '正在录音...';
      this.PointY = e.touches[0].clientY;
      this.Recorder.start({
        format: 'mp3',
      });
    },
    // 录音已经开始
    beginVoice() {
      if (this.isStopVoice) {
        this.Recorder.stop();
        return;
      }
      this.voiceTitle = '松开 结束';
      this.voiceInterval = setInterval(() => {
        this.voiceTime++;
      }, 1000);
    },
    // move 正在录音中
    moveVoice(e) {
      const PointY = e.touches[0].clientY;
      const slideY = this.PointY - PointY;
      if (slideY > uni.upx2px(120)) {
        this.canSend = false;
        this.voiceIconText = '松开手指 取消发送 ';
      } else if (slideY > uni.upx2px(60)) {
        this.canSend = true;
        this.voiceIconText = '手指上滑 取消发送 ';
      } else {
        this.voiceIconText = '正在录音... ';
      }
    },
    // 结束录音
    endVoice() {
      this.isStopVoice = true; // 加锁 确保已经结束录音并不会录制
      this.Recorder.stop();
      this.voiceTitle = '按住 说话';
    },
    // 录音被打断
    cancelVoice() {
      this.voiceTime = 0;
      this.voiceTitle = '按住 说话';
      this.canSend = false;
      this.Recorder.stop();
    },
    // 处理录音文件
    handleRecorder({ tempFilePath, duration }) {
      let contentDuration;
      // #ifdef APP-PLUS
      this.voiceTime = 0;
      if (duration < 600) {
        this.voiceIconText = '说话时间过短';
        setTimeout(() => {
          this.recording = false;
        }, 200);
        return;
      }
      contentDuration = duration / 1000;
      // #endif

      // #ifdef APP-PLUS
      contentDuration = this.voiceTime + 1;
      this.voiceTime = 0;
      if (contentDuration <= 0) {
        this.voiceIconText = '说话时间过短';
        setTimeout(() => {
          this.recording = false;
        }, 200);
        return;
      }
      // #endif

      this.recording = false;
      const params = {
        type: 2,
        content: tempFilePath,
        contentDuration: Math.ceil(contentDuration),
      };
      // eslint-disable-next-line no-unused-expressions
      this.canSend && this.sendMsg(params);
    },
    // 控制播放还是暂停音频文件
    handleAudio(item) {
      this.AudioExam = item;
      // eslint-disable-next-line no-unused-expressions
      this.Audio.paused ? this.playAudio(item) : this.stopAudio(item);
    },
    // 播放音频
    playAudio(item) {
      this.Audio.src = item.content;
      this.Audio.hasBeenSentId = item.hasBeenSentId;
      this.Audio.play();
      Object.assign(item, { anmitionPlay: true });
    },
    // 停止音频
    stopAudio(item) {
      Object.assign(item, { anmitionPlay: false });
      this.Audio.src = '';
      this.Audio.stop();
    },
    // 关闭动画
    closeAnmition() {
      const { hasBeenSentId } = this.Audio;
      const item = this.messageList.find((it) => it.hasBeenSentId === hasBeenSentId);
      item.anmitionPlay = false;
    },
    // 点击宫格时触发
    clickGrid(index) {
      if (index === 0) {
        this.chooseImage(['album']);
      } else if (index === 1) {
        this.chooseImage(['camera']);
      }
    },
    // 发送图片
    chooseImage(sourceType) {
      uni.chooseImage({
        sourceType,
        sizeType: ['compressed'],
        success: (res) => {
          this.showFunBtn = false;
          for (let i = 0; i < res.tempFilePaths.length; i++) {
            const params = {
              type: 3,
              content: res.tempFilePaths[i],
            };
            this.sendMsg(params);
          }
        },
      });
    },
    // 查看大图
    viewImg(imgList) {
      uni.previewImage({
        urls: imgList,
        // #ifndef MP-WEIXIN
        indicator: 'number',
        // #endif
      });
    },
  },
  onReady() {
    // 自定义返回按钮 因为原生的返回按钮不可阻止默认事件
    // // #ifdef H5
    // const icon = document.getElementsByClassName('uni-page-head-btn')[0];
    // icon.style.display = 'none';
    // // #endif
    // #ifdef APP-PLUS
    uni.setNavigationBarTitle({
      title: this.item.funame,
    });
    // #endif
    this.joinData();
    uni.getSystemInfo({
      success: (res) => {
        this.imgHeight = `${res.windowHeight}px`;
      },
    });
    uni.onKeyboardHeightChange((res) => {
      if (res.height === 0) {
        // #ifdef APP-PLUS
        this.mpInputMargin = false;
        // #endif
      } else {
        this.showFunBtn = false;
      }
    });
  },
};
</script>

<style lang="scss" scoped>
 @import './index.scss';
 .content{
     background-color: #f3f3f3;

 }
</style>

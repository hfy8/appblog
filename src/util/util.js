/*
 * @Author: bianjie
 * @Date: 2020-06-30 12:34:41
 * @LastEditors: bianjie
 * @LastEditTime: 2021-02-05 15:55:52
 */
import Vue from 'vue';
import moment from 'moment';
import {
  openSqlite,
  messageInfoSQL,
  isOpen,
  temporaryInfoSQL,
  insertInformationType,
  insertTemporaryInfo,
} from '@/util/sql';
import { getLoginToken, checkRegister, registerUser } from '@/api/user/userApi';

const Expression = /^https?:\/\//i || /^http?:\/\//i;
let HeartCheck = null;
const urlTest = new RegExp(Expression);
const validateUrl = (url) => urlTest.test(url);
const splitArray = (val, param) => {
  let str = '';
  val.forEach((element) => {
    if (str) {
      str += `${param}${element}`;
    } else {
      str += element;
    }
  });
  return str;
};

// 个人控件数据处理

const dataControl = (year, data) => {
  let day = {};
  if (!year[moment().format('yyyy年')]) {
    Object.assign(year, { [moment().format('yyyy年')]: { 今天: [] } });
  } else if (!year[moment().format('yyyy年')]['今天']) {
    Object.assign(year[moment().format('yyyy年')], { 今天: [] });
  }
  data.forEach((e) => {
    const y = moment(e.createTime).format('yyyy年');
    let m = moment(e.createTime).format('MM月');
    let d = moment(e.createTime).format('DD');
    if (m === moment().format('MM月') && d === moment().format('DD')) {
      d = '今天';
      m = '';
    }
    if (y in year) {
      day = { ...year[y] };
      if (d + m in year[y]) {
        year[y][d + m].push(e);
        return;
      } if (d + m in day) {
        day[d + m].push(e);
      } else {
        Object.assign(day, { [d + m]: [e] });
      }
    } else {
      Object.assign(day, { [d + m]: [e] });
    }
    Object.assign(year, { [y]: day });
  });
  return year;
};

// 计算深层对象的内容

const dataCount = (data) => {
  const keys = Object.keys(data);
  let count = 0;
  keys.forEach((e) => {
    const dKeys = Object.keys(data[e]);
    dKeys.forEach((i) => {
      count += data[e][i].length;
    });
  });
  return count;
};
// 连接数据库
const connectSql = () => {
  const userInfo = uni.getStorageSync('token');
  if (userInfo) {
    const data = JSON.parse(userInfo);
    if (!isOpen(data.userName)) {
      openSqlite(data.userName);
    }
    messageInfoSQL(data.userName);
    temporaryInfoSQL(data.userName);
  }
};
const connectServer = (closeFlag) => {
  const userInfo = uni.getStorageSync('token');
  if (userInfo) {
    const data = JSON.parse(userInfo);
    if (closeFlag) {
      uni.closeSocket();
    }
    Vue.prototype.$socketTask = uni.connectSocket({
      url: `${Vue.prototype.baseConfig.SOCKET_URL}/${data.access_token}`,
      complete: () => {
      },
    });
    Vue.prototype.$socketTask.onOpen(() => {
      // #ifdef APP-PLUS
      connectSql();
      Vue.$store.commit('user/localTemUsers');
      // #endif
      // 心跳检测
      clearInterval(HeartCheck);
      HeartCheck = setInterval(() => {
        Vue.prototype.$socketTask.send({
          data: {
            content: '',
            ficon: data.userIcon, // 用户头像
            from: `${data.userId}`,
            to: `${data.fuid}`,
            ticon: data.fuicon,
            createTime: moment(Date.now()).format('YYYY.MM.DD HH:MM'),
            type: 3,
          },
          fail() {
            connectServer(true);
          },
        });
      }, 60000);
      console.log('WebSocket连接已打开！');
    });
    Vue.prototype.$socketTask.onMessage(async (mes) => {
      const message = JSON.parse(mes.data);
      // #ifdef APP-PLUS
      connectSql();
      // #endif
      let item = Vue.$store.state.follow.follows.find((e) => String(e.fuid) === String(message.from));
      if (item) {
        item.message.push(message);
      } else {
        item = Vue.$store.state.user.temUsers.find((e) => String(e.fuid) === String(message.from));
        if (item) {
          item.message.push(message);
        } else {
          await Vue.$store.dispatch('user/getUserInfo', { fuid: message.from });
          const user = Vue.$store.state.user.userInfo;
          // #ifdef APP-PLUS
          insertTemporaryInfo(data.userName, data.userId, user.userId, user.showName, data.userName, user.icon).catch((e) => {
            console.log(e);
          });
          // #endif
          Vue.$store.state.user.temUsers.push({
            uid: data.userId,
            fuid: user.userId,
            funame: user.showName,
            uname: data.userName,
            fuicon: user.icon,
            message: [],
          });
          item = Vue.$store.state.user.temUsers.find((e) => String(e.fuid) === String(message.from));
          item.message.push(message);
        }
      }
      // #ifdef APP-PLUS
      insertInformationType(data.userName, message.from, message.ficon, message.to, message.ticon, message.content, message.createTime, message.type).catch((e) => console.log(e));
      // #endif
    });
    Vue.prototype.$socketTask.onError(() => {
      console.log('连接出错');
    });
    Vue.prototype.$socketTask.onClose(() => {
      console.log('连接关闭');
    });
  }
};
// list排序
const sort = (col) => (a, b) => a[col] - b[col];

// 密码登陆跳转
const bindLogin = async (account, password) => {
  uni.showLoading({ title: '登陆中。。。' });
  uni.removeStorageSync('token');
  const result = await getLoginToken({
    grant_type: 'password',
    username: account,
    password,
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
    // #ifdef APP-PLUS
    connectSql();
    // #endif
    Object.assign(data);
    Vue.axios.defaults.headers.Authorization = `${data.token_type} ${data.access_token}`;
    await Vue.$store.dispatch('follow/getFollows');
    await Vue.$store.commit('user/localTemUsers');
    connectServer(true);
    uni.hideLoading();
    uni.switchTab({ url: '/pages/instance/index' });
  } else {
    uni.hideLoading();
    // 消息框
    uni.showToast({
      icon: 'none',
      title: '登陆失败，请检查用户名和密码',
      position: 'bottom',
    });
  }
};

// 手机登陆跳转
const phoneLogin = async (phone, code) => {
  uni.showLoading({ title: '登陆中。。。' });
  uni.removeStorageSync('token');
  const result = await getLoginToken({
    grant_type: 'sms',
    phone,
    code,
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
    // #ifdef APP-PLUS
    connectSql();
    // #endif
    Object.assign(data);
    Vue.axios.defaults.headers.Authorization = `${data.token_type} ${data.access_token}`;
    await Vue.$store.dispatch('follow/getFollows');
    await Vue.$store.commit('user/localTemUsers');
    connectServer(true);
    uni.hideLoading();
    uni.switchTab({ url: '/pages/instance/index' });
  } else {
    uni.hideLoading();
    // 消息框
    uni.showToast({
      icon: 'none',
      title: '登陆失败，请检查用户名和密码',
      position: 'bottom',
    });
  }
};

// 第三方登陆
const registerLogin = async (name, phone, code, password) => {
  const result = await checkRegister(phone).catch((ae) => {
    console.log(ae);
  });
  if (result.data.content) {
    uni.showToast({
      icon: 'none',
      title: '手机号码已注册请使用其他手机号码',
      position: 'bottom',
    });
  } else {
    await registerUser({
      userId: phone,
      account: name,
      userName: '',
      showName: name,
      phone,
      password,
    }, code).catch((e) => {
      console.log(e);
    });
    bindLogin(name, password);
  }
};

// 第三方登陆
const otherLogin = (val) => {
  uni.login(
    {
      provider: val,
      fail(e) {
        console.log(e);
      },
      success() {
        uni.getUserInfo({
          provider: val,
          fail(e) {
            console.log(e);
          },
          success: async (e) => {
            console.log(e);
            let user = {};
            if (val === 'weixin') {
              user = {
                userName: e.userInfo.nickName,
                userId: e.userInfo.openId,
                showName: e.userInfo.nickName,
                imageUrl: e.userInfo.avatarUrl,
              };
            } else {
              user = {
                userName: e.userInfo.name,
                userId: e.userInfo.idstr,
                showName: e.userInfo.name,
                imageUrl: e.userInfo.profile_image_url,
              };
            }
            const result = await checkRegister(user.userId).catch((ae) => {
              console.log(ae);
            });
            if (!result.data.content) {
              uni.setStorageSync('login', JSON.stringify(user));
              uni.navigateTo({ url: '/pages/login/info' });
            } else {
              await bindLogin(user.userName, user.userId).catch(() => {});
            }
          },
        });
      },
    },
  );
};

const getStorage = (key) => {
  const timestamp = Date.parse(new Date()) / 1000;
  // 删除缓存
  // 获取缓存
  const val = uni.getStorageSync(key);
  const tmp = val.split('|');
  if (!tmp[1] || timestamp >= tmp[1]) {
    uni.removeStorageSync(key);
    return '';
  }
  return tmp[0];
};
const setStorage = (key, value) => {
  const timestamp = Date.parse(new Date()) / 1000;
  // 删除缓存
  // 获取缓存
  uni.setStorageSync(key, `${value}|${timestamp + (3600 * 24 * 10)}`);
};

export {
  validateUrl, splitArray, connectServer, sort, connectSql, bindLogin, otherLogin, dataControl, dataCount, phoneLogin, registerLogin, getStorage, setStorage,
};

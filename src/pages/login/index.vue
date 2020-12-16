<!--
 * @Author: bianjie
 * @Date: 2020-06-24 18:09:25
 * @LastEditors: bianjie
 * @LastEditTime: 2020-09-25 19:37:20
-->
<template>
  <view class="content">
    <Login v-if="current==='Login'" @setCurrent="setCurrent" />
    <Message v-if="current==='Message'" @setCurrent="setCurrent" />
  </view>
</template>

<script>
import Login from './login.vue';
import Message from './message.vue';

export default {
  components: { Login, Message },
  data() {
    return {
      current: 'Login',
    };
  },
  methods: {
    setCurrent(val) {
      this.current = val;
    },
  },
};
</script>

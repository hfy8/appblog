<!--
 * @Author: bianjie
 * @Date: 2020-06-24 18:09:25
 * @LastEditors: bianjie
 * @LastEditTime: 2021-01-29 17:09:42
-->
<template>
  <view class="content">
    <Login v-if="current==='Login'" @setCurrent="setCurrent" />
    <Message v-if="current==='Message'" @setCurrent="setCurrent" />
    <Register v-if="current==='Register'" @setCurrent="setCurrent" />
  </view>
</template>

<script>
import Login from './login.vue';
import Message from './message.vue';
import Register from './register.vue';

export default {
  components: { Login, Message, Register },
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

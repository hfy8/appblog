<!--
 * @Author: bianjie
 * @Date: 2020-12-18 17:04:39
 * @LastEditors: bianjie
 * @LastEditTime: 2020-12-18 17:50:25
-->
<template>
  <chat-text-list
    :my_image="token.uicon"
    :other_image="item.fuicon"
    :my_name="item.uname"
    :other_name="item.funame"
    :msgs="msg"
    @send="sendmsg"
  />
</template>

<script>
import ChatTextList from '@/components/chat-list/chat-text-list.vue';

export default {
  components: { ChatTextList },
  data() {
    return {
      token: JSON.parse(uni.getStorageSync('token')),
      item: {},
    };
  },
  onLoad(options) {
    item = options.item;
  },
  methods: {
    sendmsg() {},
  },

};
</script>

<style>

</style>

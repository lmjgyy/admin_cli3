<template>
  <div>
    <button @click="openTips">click</button>
  </div>
</template>

<script>
import create from "./create";
import Notice from "./notice";
export default {
  methods: {
    openTips() {
      create(Notice, {
        title: "我是弹窗标题",
        message: "你的页面出错了",
        duration: 1000,
      }).show();
    },
  },
};
</script>

<style>
</style>
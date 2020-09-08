<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <!-- <el-carousel indicator-position="outside" :interval="4000" type="card">
	    <el-carousel-item v-for="(item,index) in imgList" :key="index">
	      <img :src="item.src" alt="" style="width: 100%;">
	    </el-carousel-item>
    </el-carousel>-->
    <el-button @click="upload">上传</el-button>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Dashboard",
  computed: {
    ...mapGetters(["name"]),
  },
  data() {
    return {
      imgList: [
        {
          src: require("../../assets/dashboard/lufei.jpg"),
        },
        {
          src: require("../../assets/dashboard/suolong.jpg"),
        },
        {
          src: require("../../assets/dashboard/shanzhi.jpg"),
        },
        {
          src: require("../../assets/dashboard/namei.jpg"),
        },
        {
          src: require("../../assets/dashboard/qiaoba.jpg"),
        },
        {
          src: require("../../assets/dashboard/wusuopu.jpg"),
        },
      ],
    };
  },
  mounted() {
    // 文件选择后的回调
    this.$bus.$on("fileAdded", () => {
      console.log("文件已选择");
    });

    // 文件上传成功的回调
    this.$bus.$on("fileSuccess", () => {
      console.log("文件上传成功");
    });
  },
  methods: {
    upload() {
      // 打开文件选择框
      this.$bus.$emit("openUploader", {
        id: "1111", // 传入的参数
      });
    },
  },
  destroyed() {
    this.$bus.$off("fileAdded");
    this.$bus.$off("fileSuccess");
  },
};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>

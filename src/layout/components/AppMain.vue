<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <router-view :key="key" />
    </transition>
    <global-uploader></global-uploader>
    <drawer-ball :visible.sync="visible"></drawer-ball>
    <drawer :visible.sync="visible"></drawer>
  </section>
</template>

<script>
import DrawerBall from "./DrawerBall.vue";
import Drawer from "./Drawer.vue";
import GlobalUploader from "./GlobalUploader.vue";
export default {
  name: "AppMain",
  components: {
    DrawerBall,
    Drawer,
    GlobalUploader,
  },
  data() {
    return {
      visible: false,
    };
  },
  computed: {
    key() {
      return this.$route.path;
    },
  },
};
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}
.fixed-header + .app-main {
  padding-top: 50px;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>

<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <el-carousel indicator-position="outside">
	    <el-carousel-item v-for="(item,index) in imgList" :key="index">
	      <img :src="item.src" alt="">
	    </el-carousel-item>
	  </el-carousel>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  data () {
    return {
      imgList: [
        {
          src: require('../../assets/dashboard/lufei.jpg')
        },
        {
          src: require('../../assets/dashboard/lufei.jpg')
        }
      ]
    }
  }
}
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

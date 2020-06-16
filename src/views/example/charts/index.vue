<template>
  <div>
    <div id="myChart" :style="{width: '500px', height: '500px'}"></div>
  </div>
</template>

<script>
import EchartTheme from './echart-theme.js'
import BaseChart from './echart-options.js'
export default {
  name: 'hello',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
    }
  },
  mounted(){
    this.drawLine();
  },
  methods: {
    drawLine(){
      let dom = document.getElementById('myChart');
      let datas = [
          {value: 335, name: '直接访问'},
          {value: 310, name: '邮件营销'},
          {value: 234, name: '联盟广告'},
          {value: 135, name: '视频广告'},
          {value: 1548, name: '搜索引擎'}
      ]
      let chart = new BaseChart(null, dom, null, datas, EchartTheme)
      chart.pie()
    }
  },
}
</script>

<style>
</style>

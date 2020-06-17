<template>
  <div>
    <div :id="uuid" :style="{width: '1500px', height: height}"></div>
  </div>
</template>

<script>
import utils from '@/utils';
import BaseChart from './echart-options.js'
export default {
  name: 'hello',
  props: {
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '500px'
    },
    chartData: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      uuid: '',
    }
  },
  created() {
    this.uuid = utils.getUuid();
  },
  mounted(){
    this.drawLine();
  },
  methods: {
    drawLine(){
      let dom = document.getElementById(this.uuid);
      let chart = new BaseChart(dom, this.chartData.params, this.chartData.datas, this.chartData.series)
      chart[this.chartData.chart_type]()
    }
  },
}
</script>

<style>
</style>

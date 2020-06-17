<template>
  <div>
    <base-chart width="100%" height="800px" :chartData="chartData"></base-chart>
  </div>
</template>

<script>
import BaseChart from '@/components/BaseChart/_base-chart.vue'
export default {
  name: 'hello',
  components: {
    BaseChart
  },
  data () {
    return {
      chartData: {}
    }
  },
  created(){
    this.drawLine();
  },
  methods: {
    drawLine(){
      let series = [{
            name: '邮件营销',
            type: 'line',
            stack: '总量',
            data: [120, 132, 101, 134, 90, 230, 210]
        },
        {
            name: '联盟广告',
            type: 'line',
            stack: '总量',
            data: [220, 182, 191, 234, 290, 330, 310]
        },
        {
            name: '视频广告',
            type: 'line',
            stack: '总量',
            data: [150, 232, 201, 154, 190, 330, 410]
        },
        {
            name: '直接访问',
            type: 'line',
            stack: '总量',
            data: [320, 332, 301, 334, 390, 330, 320]
        },
        {
            name: '搜索引擎',
            type: 'line',
            stack: '总量',
            data: [820, 932, 901, 934, 1290, 1330, 1320]
        }
      ]
      this.chartData = {
        params: {
          title: {
            text: '折线图堆叠',
          },
          xAxis: {
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
          }
        },
        datas: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎'],
        series: series,
        chart_type: 'line'
      }
    }
  },
}
</script>

<style>
</style>

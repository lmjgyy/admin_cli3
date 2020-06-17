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
      var xAxisData = [];
      var data1 = [];
      var data2 = [];
      for (var i = 0; i < 100; i++) {
          xAxisData.push('类目' + i);
          data1.push((Math.sin(i / 5) * (i / 5 -10) + i / 6) * 5);
          data2.push((Math.cos(i / 5) * (i / 5 -10) + i / 6) * 5);
      }
      let series = [{
          name: 'bar',
          type: 'bar',
          data: data1,
          animationDelay: function (idx) {
              return idx * 10;
          }
      }, {
          name: 'bar2',
          type: 'bar',
          data: data2,
          animationDelay: function (idx) {
              return idx * 10 + 100;
          }
      }]
      this.chartData = {
        params: {
          title: {
            text: '柱状图动画延迟',
          },
          xAxis: {
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
          },
          toolbox: {
            // y: 'bottom',
            feature: {
              magicType: {
                type: ['stack', 'tiled']
              },
              dataView: {},
              saveAsImage: {
                pixelRatio: 2
              }
            }
          },
          xAxis: {
            splitLine: {
                show: false
            }
          },
          animationEasing: 'elasticOut',
          animationDelayUpdate: function (idx) {
              return idx * 5;
          }
        },
        datas: ['bar', 'bar2'],
        series: series,
        chart_type: 'bar'
      }
    }
  },
}
</script>

<style>
</style>

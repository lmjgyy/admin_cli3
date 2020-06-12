<template>
  <div>
    <div id="myChart" :style="{width: '100%', height: '500px'}"></div>
  </div>
</template>

<script>
import EchartTheme from './echart-theme.js'
import echarts from 'echarts'
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
    /*
    1 series：系列/数组 ，数组内多个对象，则为一个统计图节点内有多种统计图类型
    1.1 serises.type: line折线图，bar柱状图，pie饼图，scatter散点图， graph关系图，tree树图
    1.2 series.data： 对应数据值
    2 组件
    xAxis直角坐标系x轴
    yAxis直角坐标系y轴
    grid直角坐标系底板
    angleAxis极坐标系角度轴
    radiusAxis极坐标系半径轴
    polar极坐标系底板
    geo地理坐标系
    dataZoom数据缩放组件
    visualMap视觉映射组件
    tooltip提示框组件
    toolbox工具栏组件
    series系列
    */
    drawLine(){
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById('myChart'), EchartTheme)
      // 绘制图表
      myChart.setOption({
          title: { text: '在Vue中使用echarts' },
          grid: {
            height: '40%',
            left: 30,
            right:30,
            bottom:110
          },
          tooltip: {},
          xAxis: {
            data: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
          },
          textStyle: { // 全局文本颜色
            color: 'red',
            emphasis: {
                shadowBlur: 200,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          yAxis: {},
          series: [{
            type: 'pie',
            center: ['65%',60],
            radius: '35%',
            data: [
              {
                name: 'XX',
                value: 52,
              },
              {
                name: 'YY',
                value: 54,
              },
              {
                name: 'ZZ',
                value: 42,
              },
            ],
          },{
            type: 'line',
            data: [34,28,45,69,39,43,33,23,23,33,39,22],
          },{
            type: 'bar',
            data: [20,14,32,46,24,23,23,13,16,20,24,15],
          }]
      });
    }
  },
}
</script>

<style>
</style>

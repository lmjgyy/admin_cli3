import echarts from 'echarts'
import EchartTheme from './echart-theme.js'
var BaseChart = function (option, dom, params, datas, theme = null) {
  this.option = option;
  this.dom = dom;
  this.params = params;
  this.datas = datas;
  this.theme = theme;
}
// 初始化表格
BaseChart.prototype.initChart = function (option) {
  var chart = echarts.init(this.dom, EchartTheme)
  chart.setOption(option)
  return chart
}
// 格式化数据
BaseChart.prototype.NoGroupFormate = function (data = []) {
  var cate = [];
  for (let item of data) {
    cate.push(item.name || '')
  }
  return cate
}
// 饼图
BaseChart.prototype.pie = function () {
  if (this.dom != null) {
    var legendData;
    var params = this.params || {};
    params.legend = this.NoGroupFormate(this.datas);
    if (params.legendData  != "" && params.legendData !=null ||  params.legendData != undefined ) {
      legendData = params.legendData ;
    }
    params.colors = params.colors || EchartTheme.color
    var option = {
      color: params.colors,
      title: {
        text : params.title || "",	//标题
        subtext : params.subtext || "", //副标题
        x : params.positionx || 'center',	//位置/默认居中
        y : params.positiony || 'top',	//位置
      },
      tooltip: {
        show: true,
        trigger: 'item',
        formatter: '{a} </br>{b} : {c} ({d}%)'
      },
      legend: {
        orient: params.legendOrient || 'horizontal', //垂直：vertical； 水平 horizontal
          x: params.legendx || 'left',
          y: params.legendy || 'top',
          data: legendData || '',
          textStyle:{
          color: params.colortext ||'#333',
        }
      },
      series : [{
        name : params.title || "",
        type : 'pie',	//类型
        radius :params.radius || '48%', //圆的大小
        center : [params.centerX || '50%', params.centerY ||'50%'],//位置居中
        data : this.datas,
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          },
          normal:{
            label:{
              show: true,
              formatter: '{b} \n {d}%'
            },
            labelLine :{show:true}
          }
        }
      }]
    }
    var chart = this.initChart(option);
    chart.resize();
    window.addEventListener('resize', function() {
      chart.resize();
    })
    return chart
  }
}
export default BaseChart;

import echarts from 'echarts'
import EchartTheme from './echart-theme.js'
var BaseChart = function (dom, params, datas, series) {
  this.dom = dom;
  this.params = params;
  this.datas = datas;
  this.series = series;
  this.setOption = function (data, obj) {
    var temp = {};
    for (let item of data) {
      temp[item] = {...EchartTheme[item], ...obj[item]}
    }
    for (let attr in params) {
      for (let v in params[attr]) {
        if (!temp[attr]) {
          temp[attr] = {}
        }
        temp[attr][v] = params[attr][v]
      }
    }
    return {...temp};
  }
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
BaseChart.prototype.defaultVal = function (type) {
  switch (type) {
    case 'pie': {
      let tooltip = {trigger: 'item', formatter: '{a} </br>{b} : {c} ({d}%)'}
      return {...this.setOption(['title', 'tooltip', 'legend'], {"tooltip": tooltip})}
    };
    case 'line': {
      let tooltip = {trigger: 'axis'}
      return {...this.setOption(['title', 'tooltip', 'legend', 'yAxis', 'xAxis', 'grid'], {"tooltip": tooltip})}
    };
    case 'bar': {
      let tooltip = {}
      return {...this.setOption(['title', 'tooltip', 'legend', 'yAxis', 'xAxis', 'grid'], {"tooltip": tooltip})}
    };
  }
}
BaseChart.prototype.generateChart = function (type) {
  if (this.dom != null) {
    var params = this.params || {}
    var option = {
      ...this.defaultVal(type),
      ...{series: this.series}
    }
    var chart = this.initChart(option);
    return chart
  }
}
// 饼图
BaseChart.prototype.pie = function () {
  return this.generateChart('pie')
}
// 折线图
BaseChart.prototype.line = function () {
  return this.generateChart('line')
}
// 柱状图
BaseChart.prototype.bar = function () {
  return this.generateChart('bar')
}

export default BaseChart;

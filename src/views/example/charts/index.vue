<template>
  <div class="app-container kkk">
    <el-tabs v-model="activeName" @edit="handleTabsEdit" editable  type="card">
      <el-tab-pane :label="v.title" :name="v.name" v-for="(v, i) in editableTabs" :key="i">
        <div :class="`item${i}`">
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import LineChart from './line.vue'
import BarChart from './bar.vue'
import PieChart from './pie.vue'
import utils from '@/utils';
import Vue from 'Vue';
export default {
  components: {
    LineChart,
    BarChart,
    PieChart
  },
  data () {
    return {
      activeName: '1',
      editableTabs: [{
        title: `折线图---${utils.getUuid()}`,
        name: '1',
        content: () => {
          var NODE = Vue.extend(LineChart);
          new NODE().$mount('.item0')
        }
      },
      {
        title: `柱状图---${utils.getUuid()}`,
        name: '2',
        content: () => {
          var NODE = Vue.extend(BarChart);
          new NODE().$mount('.item1')
        }
      },
      {
        title: `饼图---${utils.getUuid()}`,
        name: '3',
        content: () => {
          var NODE = Vue.extend(PieChart);
          new NODE().$mount('.item2')
        }
      }]
    }
  },
  mounted () {
    for (let item of this.editableTabs) {
      item.content()
    }
  },
  methods: {
    handleTabsEdit(targetName, action) {
      if (action === 'add') {
        this.$prompt('请输入line、bar或pie', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^(line|pie|bar)$/,
          inputErrorMessage: '输入格式不正确'
        }).then(({ value }) => {
          this.$message({
            type: 'success',
            message: '你的选择的是: ' + value
          });
          this.addTabs(value)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        });
      }
      
      if (action === 'remove') {
        let tabs = this.editableTabs;
        let activeName = this.editableTabsValue;
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab.name;
              }
            }
          });
        }
        
        this.editableTabsValue = activeName;
        this.editableTabs = tabs.filter(tab => tab.name !== targetName);
      }
    },
    addTabs(value) {
      let obj = {}
      const that = this
      switch (value) {
        case 'line':
          obj = {
            title: `折线图---${utils.getUuid()}`,
            name: `${this.editableTabs.length + 1}`,
            content: () => {
              var NODE = Vue.extend(LineChart);
              new NODE().$mount(`.item${that.editableTabs.length - 1}`)
            }
          }
        break;
        case 'bar':
          obj = {
            title: `柱状图---${utils.getUuid()}`,
            name: `${this.editableTabs.length + 1}`,
            content: () => {
              var NODE = Vue.extend(BarChart);
              new NODE().$mount(`.item${that.editableTabs.length - 1}`)
            }
          }
        break;
        case 'pie':
          obj = {
            title: `饼图---${utils.getUuid()}`,
            name: `${this.editableTabs.length + 1}`,
            content: () => {
              var NODE = Vue.extend(PieChart);
              new NODE().$mount(`.item${that.editableTabs.length - 1}`)
            }
          }
        break;
      }
      this.editableTabs.push(obj)
      this.$nextTick(() => {
        debugger
        obj.content()
      })
    }
  }
}
</script>

<style>
</style>

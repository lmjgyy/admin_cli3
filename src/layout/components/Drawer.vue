<template>
  <el-drawer
    title="任务管理"
    :visible.sync="show"
    direction="rtl"
    size="50%">
    <base-table
      highlight-current-row
      fit
      isReverse
      :loading="loading"
      :tableConfig="tableConfig"
      defaultExpandAll
      rowKey="id"
    >
    </base-table>
  </el-drawer>
</template>

<script>
import { getTaskList } from '@/api/task'
import BaseTable from '@/components/BaseTable/_base-table'
export default {
  components: {
    BaseTable
  },
  props: {
    visible: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    show: {
      get () {
        return this.visible
      },
      set (val) {
        this.$emit('update:visible', val);
      }
    }
  },
  watch: {
    visible (newVal) {
      newVal && this.fetchData()
    }
  },
  data () {
    return {
      tableConfig: {
        tableData: [],
        columnOptions: 'TASKMANAGE',
        total: 0,
        pagesize: 10,
        currentPage:1
      },
      loading: false
    }
  },
  methods: {
    fetchData() {
      let params = {
        currentPage: this.tableConfig.currentPage,
        pagesize: this.tableConfig.pagesize
      }
      // this.loading = true;
      getTaskList(params).then(res => {
        this.tableConfig.tableData = res.data.items;
        this.tableConfig.total = res.data.pageVo.total
      })
    }
  }
}
</script>

<style>
</style>

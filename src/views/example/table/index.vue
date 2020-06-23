<template>
  <div class="app-container">
    <base-table
      border
      fit
      highlight-current-row
      hasIndex
      hasSelect
      :tableConfig="tableConfig"
      :mode="'no-pagination'"
      :loading="loading"
      @row-click="rowClick"
      ref="table"
      :pageConfig = "{ pagesizes: [10, 50, 100, 200]}"
      @current-change="handleCurrentChange"
      :defaultSort="{prop: 'pageviews', order: 'descending'}"
    >
      <!-- lazy
      default-expand-all
      :load="load" -->
      <template v-slot:status="scope">
        <el-tag :type="scope.scope.row.status | statusFilter" slot="Status">{{ $refs.table.renderCell(scope.scope.row, scope.scope.column, scope.scope.columnOption) }}</el-tag>
      </template>
      <template v-slot:display_time="scope">
        <i class="el-icon-time" />
        <span>{{ $refs.table.renderCell(scope.scope.row, scope.scope.column, scope.scope.columnOption) }}</span>
      </template>
      <template v-slot:optionHeader="scope">
        <el-input v-model="search" size="mini" placeholder="输入关键字搜索"/>
      </template>
      <template v-slot:optionBody="scope">
        <el-button size="mini" @click="handleEdit(scope.scope.$index, scope.scope.row)">Upload</el-button>
        <el-button size="mini" type="danger" @click="handleDelete(scope.scope.$index, scope.scope.row)">Delete</el-button>
      </template>
      <template v-slot:expanderHeader="scope">
        <i class="el-icon-arrow-down"></i>
      </template>
      <template v-slot:expand="scope">
        <el-form label-position="left" class="demo-table-expand">
          <template  v-for="(v, k) in scope.scope.columnOptions">
            <el-form-item :label="v.label" v-if="v.type!='expand'">
              <span>{{ $refs.table.renderCell(scope.scope.row, { property: v.prop }, v) }}</span>
            </el-form-item>
          </template>
        </el-form>
      </template>
    </base-table>
  </div>
</template>

<script>
import { getList } from '@/api/table'
import BaseTable from '@/components/BaseTable/_base-table'
export default {
  components: {
    BaseTable
  },
  data() {
    return {
      tableConfig: {
        tableData: [],
        columnOptions: 'WRITER_INFO',
        total: 0,
        pagesize: 10,
        currentPage:1
      },
      loading: false,
      search: '',
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    rowClick(row, column, event){
      this.$refs.table.$refs['base-table'].clearSelection()
    },
    handleCurrentChange(val) {
      console.log(val)
    },
    fetchData() {
      this.loading = true
      getList().then(res => {
        this.tableConfig.tableData = res.data.items
        this.tableConfig.total = res.data.items.length
        // this.tableConfig.tableData = [{
        //   id: 1,
        //   date: '2016-05-02',
        //   name: '王小虎',
        //   address: '上海市普陀区金沙江路 1518 弄'
        // }, {
        //   id: 2,
        //   date: '2016-05-04',
        //   name: '王小虎',
        //   address: '上海市普陀区金沙江路 1517 弄'
        // }, {
        //   id: 3,
        //   date: '2016-05-01',
        //   name: '王小虎',
        //   address: '上海市普陀区金沙江路 1519 弄',
        //   hasChildren: true
        // }, {
        //   id: 4,
        //   date: '2016-05-03',
        //   name: '王小虎',
        //   address: '上海市普陀区金沙江路 1516 弄'
        // }]
        this.loading = false
      })
    },
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
      this.tableConfig.tableData.splice(index, 1)
    },
    // 懒加载树
    load(tree, treeNode, resolve) {
      setTimeout(() => {
        resolve([
          {
            id: 31,
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄'
          }, {
            id: 32,
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄'
          }
        ])
      }, 1000)
    }
  }
}
</script>

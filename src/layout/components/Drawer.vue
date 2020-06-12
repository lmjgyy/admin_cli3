<template>
  <el-drawer
    :visible.sync="show"
    direction="rtl"
    :before-close="beforeClose"
    close-on-press-escape
    custom-class="base-drawer"
    ref="drawer"
    :modal="false"
    append-to-body
    modal-append-to-body
    size="40%">
    <div slot="title" class="base-drawer__title">
      <div class="base-drawer__title--text">任务管理</div>
      <pagination class="base-drawer__title--pagination"
        v-show="showPage"
        :pageVo.sync="pageVo" @update="refreshData"
        :pageConfig="{ hiddenPrev: true, layoutNext: 'total, prev, pager, next, jumper', 'small': true, 'background': false }"
      >
      </pagination>
    </div>
    <!-- destroy-on-close 是否关闭之后销毁子元素 -->
    <base-table
      highlight-current-row
      fit
      header
      ref="table"
      isReverse
      :loading="loading"
      :tableConfig="tableConfig"
      :headerCellStyle="() => {return {background: '#f2f4f7'}}"
      rowKey="id"
      :hasPagination="false"
      @refreshData=""
    >
      <template v-slot:status="scope">
        <el-tag :type="scope.scope.row.status | statusFilter" slot="Status">{{ $refs.table.renderCell(scope.scope.row, scope.scope.column, scope.scope.columnOption) }}</el-tag>
      </template>
    </base-table>
<!--    <button @click="click">aaa</button> -->
  </el-drawer>
</template>

<script>
import { getTaskList } from '@/api/task'
import BaseTable from '@/components/BaseTable/_base-table'
import Pagination from '@/components/BaseTable/pagination.vue'
export default {
  components: {
    BaseTable,
    Pagination
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
    },
    pageVo: {
      get () {
        return {
          total: this.tableConfig.total || 0,
          pagesize: this.tableConfig.pagesize || 10,
          currentPage: this.tableConfig.currentPage || 1
        }
      },
      set (val) {
        for (let attr in val) {
          this.tableConfig[attr] = val[attr]
        }
      }
    },
  },
  watch: {
    visible (newVal) {
      newVal && this.fetchData()
    },
    screenWidth: {
      immediate: true,
      handler (newVal) {
        let size = parseInt(newVal * 0.4);
        console.log(size)
        this.showPage = size >= 768
      }
    }
  },
  mounted() {
    window.onresize = () => {
      return (() => {
        this.screenWidth = document.body.clientWidth;
      })()
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
      loading: false,
      timer: null,
      screenWidth: document.body.clientWidth,
      size: '40%',
      showPage: true
    }
  },
  methods: {
    refreshData (val) {
      this.pageVo = val
      this.fetchData()
    },
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
    },
    // click() {
    //   this.$refs.drawer.closeDrawer()
    // },
    beforeClose (done) {
      // this.$confirm('确定要关闭吗？')
      //   .then(_ => {
      //     this.timer = setTimeout(() => {
      //       done();
      //       // 动画关闭需要一定的时间
      //       setTimeout(() => {
      //       }, 400);
      //     }, 2000);
      //   })
      //   .catch(_ => {});
      console.log(done);
      done()
    }
  }
}
</script>

<style>
</style>

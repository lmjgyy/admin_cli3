<template>
  <div :class="{'base-table':true,'base-table__reverse':isReverse}">
    <el-table
      ref="base-table"
      :data="paginationMode"
      v-loading="loading"
      :stripe="stripe"
      :border="border"
      :fit="fit"
      :size="size"
      :height="height"
      :highlight-current-row="highlightRow"
      element-loading-text="Loading"
      :show-header="showHeader"
      :row-class-name="rowClassName"
      :header-cell-style="headerCellStyle"
      :header-cell-class-name="headerCellClassName"
      :header-row-class-name="headerRowClassName"
      :header-row-style="headerRowStyle"
      :row-key="rowKey"
      :default-expand-all="defaultExpandAll"
      :expand-row-keys="expandRowKeys"
      :tooltip-effect="tooltipEffect"
      :show-summary="showSummary"
      :sum-text="sumText"
      :span-method="spanMethod"
      :select-on-indeterminate="selectOnIndeterminate"
      :indent="indent"
      :lazy="lazy"
      :load="load"
      :tree-props="treeProps"
      @select="select"
      @select-all="selectAll"
      @selection-change="selectionChange"
      @cell-mouse-enter="cellMouseEnter"
      @cell-mouse-leave="cellMouseLeave"
      @cell-click="cellClick"
      @cell-dbclick="cellDbclick"
      @row-click="rowClick"
      @row-dbclick="rowDbclick"
      @row-contextmenu="rowContextmenu"
      @header-click="headerClick"
      @header-contextmenu="headerContextmenu"
      @sort-change="sortChange"
      @filter-change="filterChange"
      @current-change="currentChange"
      @header-draggend="headerDraggend"
      @expand-change="expandChange"
      :default-sort = "{prop: 'pageviews', order: 'descending'}"
    >
     <template slot="empty" v-if="!loading">
        <empty></empty>
      </template>
      <el-table-column
        v-if="hasSelect"
        align="center"
        type="selection"
        label="#"
        width="55">
      </el-table-column>
<!--      <el-table-column align="center" label="#" width="50" v-if="hasIndex">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column> -->
      <el-table-column
        label="#"
        align="center"
        v-if="hasIndex"
        type="index"
        :index="AccumulateIndex?indexMethod:''"
        width="50">
      </el-table-column>
      <slot name="prefix"></slot>
      <el-table-column
        :prop="item.prop||''"
        :label="item.label||''"
        v-for="(item,index) in columnOptions[tableConfig.columnOptions]"
        :key="index"
        :width="item.width||''"
        show-overflow-tooltip
        :fixed="item.fixed"
        :resizable="item.resizable"
        :filter-multiple="item.filterMultiple"
        :header-align="item.headerAlign"
        :align="item.align || 'left'"
        :sortable="item.sortable"
        :type="item.type||''"
        :sort-method="item.sortMethod"
        :filters="item.filters && getSingleObj(tableConfig.tableData.map((v) => { return { text: v[item.prop], value: v[item.prop] }}), {})"
        :filter-method="item.filterMethod"
        :filter-placement="item.filterPlacement"
      >
        <template slot="header" slot-scope="scope">
          <!--  自定义头部，renderHeader判断，格式： { align: 'right', width: 200, renderHeader: true, renderHtml: true } -->
          <slot :name="item.slotHeaderName" :scope="scope" v-if="item.renderHeader"></slot>
          <!--  普通头部 -->
          <span>{{item.label}}</span>
        </template>

       <template slot-scope="scope">
          <div v-if="item.renderHtml">
            <!--  自定义body，renderHtml判断，格式： { prop: 'status', label: 'Status', align: 'center', width: 200, slotBodyrName: 'status', renderHtml: true } -->
            <slot :name="item.slotBodyName" :scope="{row: scope.row, column: scope.column, columnOption: item}" v-if="!item.renderHeader"></slot>
            <!-- 自定义头部的body -->
            <slot :name="item.slotBodyName" :scope="{row: scope.row, columnOptions: columnOptions[tableConfig.columnOptions]}" v-else></slot>
          </div>
          <div v-if="item.type=='expand'">
            <!-- 展开表格，expand判断， 格式：{ type: 'expand', slotBodyrName: 'expand' } -->
            <slot :name="item.slotBodyName" :scope="{row: scope.row, columnOptions: columnOptions[tableConfig.columnOptions]}"></slot>
          </div>
            <!-- 普通列， 格式： { prop: 'title', label: 'Title', } -->
          <span v-if="!item.renderHtml">{{ renderCell(scope.row, scope.column, item) }}</span>
        </template>
      </el-table-column>
      <slot name="suffix"></slot>
    </el-table>
    <pagination :pageVo.sync="pageVo" @update="update" :pageConfig="pageConfig" v-if="hasPagination"></pagination>
  </div>
</template>

<script>
import columnOptions from '@/common/column-options'
import Empty from './empty'
import Pagination from './pagination.vue'
import tabMix from '@/mixins/table-mix.js'
export default {
  name: 'baseTable',
  mixins: [ tabMix ],
  components: {
    Empty,
    Pagination
  },
  computed: {
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
    paginationMode () {
      switch (this.mode) {
        case 'normal':
          return this.tableConfig.tableData;
        case 'no-pagination':
          return this.tableConfig.tableData.slice((this.tableConfig.currentPage-1)*this.tableConfig.pagesize, this.tableConfig.currentPage*this.tableConfig.pagesize);
      }
    }
  },
  props: {
    // 分页模式
    mode: {
      type: String,
      default: 'normal'
    },
    pageConfig: {
      type: Object,
      default: () => {
        return {}
      }
    },
    hasPagination: {
      type: Boolean,
      default: true
    },
    // 表格
    tableConfig: {
      type: Object,
      default: () => {
        return {
          tableData: [],
          columnOptions: '',
          total: 0,
          pagesize: 10,
          currentPage:1
        }
      }
    },
    // 分页在上，表格在下
    isReverse: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    border: {
      type: Boolean,
      default: false
    },
    fit: {
      type: Boolean,
      default: false
    },
    stripe: {
      type: Boolean,
      default: false
    },
    highlightRow: {
      type: Boolean,
      default: false
    },
    hasSelect: {
      type: Boolean,
      default: false
    },
    hasIndex: {
      type: Boolean,
      default: false
    },
    height: {
      type: Number
    },
    size: {
      type: String,
      default: ''
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    rowClassName: { // 返回字符串
      type: Function,
      default: ({ row, rowIndex}) => {
        return ''
      }
    },
    rowStyle: { // 返回对象
      type: Function,
      default: ({ row, rowIndex}) => {
        return {}
      }
    },
    cellClassName: { // 返回字符串
      type: Function,
      default: ({ row, rowIndex, columnIndex}) => {
        return ''
      }
    },
    cellStyle: { // 返回对象
      type: Function,
      default: ({ row, column, rowIndex, columnIndex}) => {
        return {}
      }
    },
    headerRowClassName: { // 返回字符串
      type: Function,
      default: ({ row, rowIndex}) => {
        return ''
      }
    },
    headerRowStyle: { // 返回对象
      type: Function,
      default: ({ row, rowIndex}) => {
        return {}
      }
    },
    headerCellClassName: { // 返回字符串
      type: Function,
      default: ({ row, column, rowIndex, columnIndex}) => {
        return ''
      }
    },
    headerCellStyle: { // 返回对象
      type: Function,
      default: ({ row, column, rowIndex, columnIndex}) => {
        return {}
      }
    },
    rowKey: {
      type: String,
      default: ''
    },
    defaultExpandAll: {
      type: Boolean,
      default: false
    },
    expandRowKeys: {
      type: Array,
    },
    tooltipEffect: {
      type: String,
      default: 'dark'
    },
    showSummary: {
      type: Boolean,
      default: false
    },
    sumText: {
      type: String,
      default: '合计'
    },
    spanMethod: {
      type: Function,
      default: ({ row, column, rowIndex, columnIndex }) => {}
    },
    selectOnIndeterminate: {
      type: Boolean,
      default: true
    },
    indent: {
      type: Number,
      default: 16
    },
    lazy: {
      type: Boolean,
      default: false
    },
    load: {
      type: Function,
      default: (row, treeNode, resolve) => {}
    },
    treeProps: {
      type: Object,
      default: () => {
        return { hasChildren: 'hasChildren', children: 'children' }
      }
    },
    // 累加索引
    AccumulateIndex: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      columnOptions: columnOptions
    }
  },
  methods: {
    update (val) {
      if (this.mode == 'normal') {
        this.$emit('refreshData');
      } else {
        this.pageVo = val
      }
    },
    indexMethod (index) {
      return (this.pageVo.currentPage - 1) * this.pageVo.pagesize + index + 1
    },
    select (selection, row) {
      this.$emit('select', selection, row)
    },
    selectAll (selection) {
      this.$emit('select-all', selection)
    },
    selectionChange (selection) {
      this.$emit('selection-change', selection)
    },
    cellMouseEnter (row, column, cell, event) {
      this.$emit('cell-mouse-enter', row, column, cell, event)
    },
    cellMouseLeave (row, column, cell, event) {
      this.$emit('cell-mouse-leave', row, column, cell, event)
    },
    cellClick (row, column, cell, event) {
      this.$emit('cell-click', row, column, cell, event)
    },
    cellDbclick (row, column, cell, event) {
      this.$emit('cell-dbclick', row, column, cell, event)
    },
    rowClick (row, column, event) {
      this.$emit('row-click', row, column, event)
    },
    rowDbclick (row, column, event) {
      this.$emit('row-dbclick', row, column, event)
    },
    rowContextmenu (row, column, event) {
      this.$emit('row-contextmenu', row, column, event)
    },
    headerClick (column, event) {
      this.$emit('header-click', column, event)
    },
    headerContextmenu (column, event) {
      this.$emit('header-contextmenu', column, event)
    },
    sortChange ({ column, prop, order }) {
      this.$emit('sort-change', { column, prop, order })
    },
    filterChange (filters) {
      this.$emit('filter-change', filters)
    },
    currentChange (currentRow, oldCurrentRow) {
      this.$emit('current-change', currentRow, oldCurrentRow)
    },
    headerDraggend (newWidth, oldWidth, column, event) {
      this.$emit('header-draggend', newWidth, oldWidth, column, event)
    },
    expandChange (row, expandedRows) {
      this.$emit('expand-change', row, expandedRows)
    },
    // 过滤对象数组去重
    getSingleObj (arr, obj) {
      return arr.reduce((cur, next) => {
        obj[next.value] ? '' : obj[next.value] = true && cur.push(next);
        return cur;
      }, [])
    }
  },
}
</script>

<template>
  <el-popover
    popper-class="base-popper"
    placement="bottom-end"
    width="160"
    @hide="screenColumn"
    @show="originColumn = [...checkedColumns]"
  >
    <div>
      <el-checkbox :indeterminate="!checkAll" v-model="checkAll" @change="handleCheckAll">全选</el-checkbox>
      <div style="margin: 15px 0;">
        <el-checkbox-group v-model="checkedColumns" @change="handleChangeColumn">
          <el-checkbox v-for="item in dropItem" :label="item.value" :key="item.value">{{item.label}}</el-checkbox>
        </el-checkbox-group>
      </div>
    </div>
    <span slot="reference">
      <table-header-icon></table-header-icon>
    </span>
  </el-popover>
</template>

<script>
import TableHeaderIcon from './table-header-icon'
export default {
  components: {
    TableHeaderIcon
  },
  props: {
    dropItem: {
      type: Array,
      default: []
    },
    screenData: {
      type: Object
    },
  },
  data () {
    return {
      checkAll: false,
      checkedColumns: []
    }
  },
  created() {
    this.checkedColumns = this.screenData.checkedColumns
  },
  computed: {
    originColumns () {
      return this.screenData.originColumns
    }
  },
  watch: {
    checkedColumns() {
      this.checkAll = this.checkedColumns.length === this.dropItem.length
    },
  },
  methods: {
    screenColumn () {
       this.$emit('hide', {checkedColumns: this.checkedColumns})
    },
    handleCheckAll (value) {
      if (value) {
        this.checkedColumns = this.dropItem.map(v => v.value)
      } else {
        this.checkedColumns = []
      }
    },
    handleChangeColumn (value) {
      this.checkAll = this.checkedColumns.length === this.dropItem.length
    }
  }
}
</script>

<style>
</style>

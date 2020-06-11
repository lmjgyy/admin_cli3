<template>
  <div class="base-pagination">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"

      :page-sizes="config.pagesizes"
      :pager-count="config.pagerCount"
      :background="config.background"
      :layout="config.layoutPrev"
      :popper-class="config.popperClass"
      :disabled="config.disabled"
      :small="config.small"
      :hide-on-single-page="config.hide && pageVo.total/pageVo.pagesize<=1"
      
      :current-page="pageVo.currentPage"
      :page-size="pageVo.pagesize"
      :total="pageVo.total">
    </el-pagination>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"

      :background="config.background"
      :pager-count="config.pagerCount"
      :layout="config.layoutNext"
      :disabled="config.disabled"
      :small="config.small"
      :hide-on-single-page="config.hide && pageVo.total/pageVo.pagesize<=1"

      :current-page="pageVo.currentPage"
      :page-size="pageVo.pagesize"
      :total="pageVo.total">
    </el-pagination>
  </div>
</template>

<script>
export default {
  data(){
    return {
      configDefault: {
        pagesizes: [10, 20, 30, 40],
        pagerCount: 5,
        background: true,
        layoutPrev: "total, sizes",
        layoutNext: "prev, pager, next, jumper",
        popperClass: '',
        disabled: false,
        small: false,
        hide: true
      },
      configOptions: [
        'pagesizes',
        'pagerCount',
        'background',
        'layoutPrev',
        'layoutNext',
        'popperClass',
        'disabled',
        'small',
        'hide'
      ]
    }
  },
  computed: {
    config () {
      let obj = {};
      for (let item of this.configOptions) {
        if (!this.pageConfig.hasOwnProperty(item)) {
          obj[item] = this.configDefault[item]
        } else {
          obj[item] = this.pageConfig[item]
        }
      }
      return obj;
    }
  },
  props: {
    pageVo: {
      type: Object,
      default: () => {
        return {
          total: 0,
          pagesize: 10,
          currentPage:1
        }
      }
    },
    pageConfig: {
      type: Object,
    }
  },
  methods: {
    handleSizeChange(val){
      this.pageVo.pagesize = val
      this.$emit('update', this.pageVo)
    },
    handleCurrentChange(val){
      this.pageVo.currentPage = val
      this.$emit('update', this.pageVo)
    }
  }
}
</script>

<style>
</style>

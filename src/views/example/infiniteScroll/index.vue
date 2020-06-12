<template>
  <div class="base-infiniteScroll-wrapper" style="overflow:auto" infinite-scroll-distance="">
    <ul class="infinite-list" v-infinite-scroll="load" infinite-scroll-disabled="disabled" infinite-scroll-distance="10" style="overflow:auto">
      <li v-for="(item, index) in list" class="infinite-list-item">{{ index }}-------{{ item.name }}</li>
    </ul>
    <p v-if="loading">加载中...</p>
    <p v-if="noMore" class="base-infiniteScroll-wrapper__noData">没有更多了</p>
  </div>
</template>

<script>
import { getTaskList } from '@/api/task'
export default {
  data () {
    return {
      list: [],
      count: 50,
      loading: false,
      number: 0
    }
  },
  computed: {
    disabled () {
      return this.loading || this.noMore
    },
    noMore () {
      return this.count >= 500
    },
  },
  created() {
    this.fetchData({currentPage: ++this.number, pagesize: 50})
  },
  methods: {
    load () {
      this.fetchData({currentPage: ++this.number, pagesize: 50})
    },
    fetchData(params) {
      this.loading = true
      getTaskList(params).then(res => {
        this.loading = false
        this.list = [...this.list, ...res.data.items]
        this.count+= this.number
      }).catch(err => {
        this.loading = false
      })
    },
  }
}
</script>

<template>
  <div>
    <!-- <item :level="6">
      <div slot="iis">
        <template slot-scope="scope">
          {{scope}}
        </template> 
      </div>
      <div>
        456
      </div>
    </item> -->
    <!-- <item :show="isShow">
      <slot>我被你发现啦3！！！</slot>
    </item> -->
    {{txt}}
    <item  v-model="txt" :txt="txt">
      
    </item>
    <ul @scroll="scroll" ref="ul">
      <li v-for="item in list" class="aaa" :key="item.name">{{item.name}}</li>
    </ul>
  </div>
</template>

<script>
import item from './item'
export default{
  components: { item },
  data () {
    return {
      list: [],
      count: 3,
      scrollTop: 0,
      testData: [
        {type: 'success', text: '成功'},
        {type: 'error', text: '错误'},
        {type: 'warn', text: '警告'},
        {type: 'default', text: '成功'},
      ],
      isShow: true,
      txt: ''
    }
  },
  created () {
    console.log(this.$refs.ul)
  },
  methods: {
    scroll(e) {
      if (this.count>=20) {
        return
      }
      console.log(e.target.scrollTop)
      if (e.target.scrollTop - this.scrollTop > 400) {
        this.count++
        this.scrollTop = e.target.scrollTop
      }
    }
  },
  created() {
    this.list = [
      {name: 'disk1'},
      {name: 'disk2'},
      {name: 'disk3'},
    ]
  }
}
</script>

<style>
 ul {
   height: 800px;
   overflow: auto;
 }
.aaa{
  height: 400px;
  padding: 20px;
  border: 2px solid #eee;
  list-style: none;
  margin: 5px;
}
</style>

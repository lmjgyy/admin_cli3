<!--
<script>
export default {
  data () {
    return {
      domProps: 'domProps'
    }
  },
  render: function (createElement) {
    console.log(this.$slots)
    return createElement(
      'h' + this.level,   // tag name 标签名称
      [
        this.$slots.iis, 
        createElement(
          'span',
          {
            class: {
              foo: true
            },
            style: {
              fontSize: '25px'
            },
            on: {
              click(e)
              {
                console.log(e)
              }
            },
            domProps: {
              title: this.domProps
            },
            props: {
              someProp: 'foobar'
            },
            // directives: [
            //   {
            //     name: 'my-custom-directive',
            //     value: '2',
            //     expression: '1 + 1',
            //     arg: 'foo',
            //     modifiers: {
            //       bar: true
            //     }
            //   }
            // ],
            scopedSlots: {
              iis: props => {
                debugger
                createElement('span', props.text)
              }
            },
            key: 'myKey',
            ref: 'myRef'
          },
          this.$slots.default
        )
      ], // 子组件中的阵列
    )
  },
  props: {
    level: {
      type: Number,
      required: true
    }
  }
}
</script>

<style>

</style>-->
<!--<script>
export default {
  props:{
		show:{
			type: Boolean,
			default: true
		}
	},
	render:function(h){	
		if(this.show ) return h('div',this.$slots.default);
	},
}
</script>

<style>

</style>-->

<script>
export default {
  props: {
    txt: {
      type: String,
      default: "",
    },
  },
  render: function (h) {
    var self = this;
    return h("div", [
      h("p", "你猜我输入的是啥：" + this.txt),
      h("input", {
        on: {
          input(event) {
            self.$emit("input", event.target.value);
          },
        },
      }),
    ]);
  },
};
</script>

<style>
</style>
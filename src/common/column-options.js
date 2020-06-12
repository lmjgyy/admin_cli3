/* type: index / expand /Selection 类型,
label: 列名,
prop: 列字段,
width: 列宽,
align: 列水平位置,
sortable: 是否排序,
sortMethod: 排序方法,
slotBodyName: 插槽体名称,
slotHeaderName: 插槽头名称,
formatter: 数据格式化,
renderHtml: 是否自定义body,
fiexed: 固定列到左或右  /true /'left'/'right'
filters: 是否筛选 / true
filterMethod: 筛选方法
resizable: 是否可调节列宽度
filterMultiple： 是否多选
headerAlign: 表头对齐方式
renderHeader: 是否自定义header */
import utils from '@/utils'

const WRITER_INFO = [
  {
    type: 'expand',
    renderHeader: true,
    slotBodyName: 'expand',
    slotHeaderName: 'expanderHeader'
  },
  {
    prop: 'title',
    label: 'Title',
  },
  {
    prop: 'author',
    label: 'Author',
    width: 120,
    align: 'center',
  },
  {
    prop: 'pageviews',
    label: 'Pageviews',
    width: 120,
    align: 'center',
    sortable: true,
    sortMethod: (obj1, obj2) => {
      return utils.sort(obj1, obj2, 'pageviews')
    }
  },
  {
    prop: 'status',
    label: 'Status',
    width: 120,
    align: 'center',
    renderHtml: true,
    slotBodyName: 'status',
    filters: true,
    filterMethod: (value, row, column) => {
      const property = column['property'];
      return row[property] === value;
    },
    filterMultiple: true,
    filterPlacement: 'bottom'
  },
  {
    prop: 'display_time',
    label: 'Display_time',
    align: 'center',
    width: 200,
    renderHtml: true,
    slotBodyName: 'display_time',
    formatter (row, col) {
      return utils.parseTime(row[col])
    }
  },
  {
    align: 'right',
    width: 200,
    renderHeader: true,
    renderHtml: true,
    slotBodyName: 'optionBody',
    slotHeaderName: 'optionHeader'
  },
]
const TREE_DATA = [
  {
    prop: 'date',
    label: '日期',

  },
  {
    prop: 'name',
    label: '姓名',
  },
  {
    prop: 'address',
    label: '地址',
  },
]
const TASKMANAGE = [
  {
    prop: 'name',
    label: '任务名称',
  },
  {
    prop: 'status',
    label: '状态',
    slotBodyName: 'status',
    renderHtml: true,
    align: 'center'
  },
  {
    prop: 'obj_name',
    label: '操作对象',
    align: 'center'
  },
  {
    prop: 'created_at',
    label: '创建时间',
    align: 'center'
  },
]
export default {
  WRITER_INFO,
  TREE_DATA,
  TASKMANAGE
}

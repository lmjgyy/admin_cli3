import utils from '@/utils'
export default {
  methods: {
    renderCell (row, column, item) {
      if (!column) {
        return
      }
      if (column.property === item.prop && item.formatter) {
        return utils.emptyText(item.formatter(row, column.property))
      }
      return row[column.property]
    }
  }
}

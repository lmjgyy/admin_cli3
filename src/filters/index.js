export const statusFilter= function (status) {
  const statusMap = {
    published: 'success',
    draft: 'gray',
    deleted: 'danger'
  }
  return statusMap[status]
}

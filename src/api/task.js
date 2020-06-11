import request from '@/utils/request'

export function getTaskList(params) {
  return request({
    url: '/vue-admin-template/delaytask/list',
    method: 'get',
    params
  })
}

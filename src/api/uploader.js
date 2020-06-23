import request from '@/utils/request'

export function mergeSimpleUpload(data) {
  return request({
    url: '/vue-admin-template/user/login',
    method: 'post',
    data
  })
}
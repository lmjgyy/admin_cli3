import request from '@/utils/request'

export function merge(data) {
  return request({
    url: 'v2/ai/merge',
    method: 'post',
    data
  })
}

export function checkChunk(data) {
  return request({
    url: 'v2/ai/checkchunk',
    method: 'post',
    data
  })
}

export function checkFile(data) {
  return request({
    url: 'v2/ai/checkfile',
    method: 'post',
    data
  })
}

export function uploader(data) {
  return request({
    url: 'v2/ai/uploader',
    method: 'post',
    data
  })
}
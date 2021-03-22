import request from '@/utils/request'

export function upload(file) {
  return request({
    url: '/oss/upload',
    method: 'post',
    data: file
  })
}
export function uploadBatch(files) {
  return request({
    url: '/oss/uploadBatch',
    method: 'post',
    data: files
  })
}
export function download(params) {
  return request({
    url: '/oss/download',
    method: 'get',
    params: params
  })
}
export function deleteById(params) {
  return request({
    url: '/oss/removeById',
    method: 'delete',
    params: params
  })
}


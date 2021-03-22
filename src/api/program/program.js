import request from '@/utils/request'

const prefix = '/program'

export function getByPage(data) {
  data.category = 1
  return request({
    url: `${prefix}/getByPage`,
    method: 'post',
    data: data
  })
}

export function getById(params) {
  return request({
    url: `${prefix}/getById`,
    method: 'get',
    params: params
  })
}

export function add(data) {
  data.category = 1
  return request({
    url: `${prefix}/add`,
    method: 'post',
    data: data
  })
}

export function modify(data) {
  data.category = 1
  return request({
    url: `${prefix}/modify`,
    method: 'put',
    data: data
  })
}

export function removeById(params) {
  params.category = 1
  return request({
    url: `${prefix}/removeById`,
    method: 'delete',
    params: params
  })
}

export function listProgramsMatch() {
  return request({
    url: `${prefix}/listMatch`,
    method: 'get'
  })
}

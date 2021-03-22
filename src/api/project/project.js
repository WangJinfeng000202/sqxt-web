import request from '@/utils/request'

const prefix = '/project'

export function getByPage(data) {
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
  return request({
    url: `${prefix}/add`,
    method: 'post',
    data: data
  })
}

export function modify(data) {
  return request({
    url: `${prefix}/modify`,
    method: 'put',
    data: data
  })
}

export function removeById(params) {
  return request({
    url: `${prefix}/removeById`,
    method: 'delete',
    params: params
  })
}

export function listProjectsMatch() {
  return request({
    url: `${prefix}/listMatch`,
    method: 'get'
  })
}

export function getByContractNo(params) {
  return request({
    url: `${prefix}/getByContractNo`,
    method: 'get',
    params: params
  })
}


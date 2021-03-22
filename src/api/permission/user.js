import request from '@/utils/request'

const prefix = '/auth/user'

export function getUserByPage(userQueryParams) {
  return request({
    url: `${prefix}/getPage`,
    method: 'post',
    data: userQueryParams
  })
}
export function changeUserStatus(params) {
  return request({
    url: `${prefix}/changeStatus`,
    method: 'get',
    params: params
  })
}

export function getById(params) {
  return request({
    url: `${prefix}/getById`,
    method: 'get',
    params: params
  })
}

export function add(user) {
  return request({
    url: `${prefix}/add`,
    method: 'post',
    data: user
  })
}
export function modify(user) {
  return request({
    url: `${prefix}/modify`,
    method: 'put',
    data: user
  })
}
export function removeById(params) {
  return request({
    url: `${prefix}/removeById`,
    method: 'delete',
    params: params
  })
}

export function toAssign(params) {
  return request({
    url: `${prefix}/toAssign`,
    method: 'get',
    params: params
  })
}
export function doAssign(assign) {
  return request({
    url: `${prefix}/doAssign`,
    method: 'post',
    data: assign
  })
}

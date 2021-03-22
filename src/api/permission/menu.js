import request from '@/utils/request'

const prefix = '/auth/permission'

export function getAllMenus() {
  return request({
    url: `${prefix}/getAllMenus`,
    method: 'get'
  })
}
export function changeStatus(params) {
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

export function add(permission) {
  return request({
    url: `${prefix}/add`,
    method: 'post',
    data: permission
  })
}
export function modify(permission) {
  return request({
    url: `${prefix}/modify`,
    method: 'put',
    data: permission
  })
}
export function removeBatch(params) {
  return request({
    url: `${prefix}/removeBatch`,
    method: 'delete',
    params: params
  })
}
export function getAllMenusByRoleId(params) {
  return request({
    url: `${prefix}/getMenuByRoleId`,
    method: 'get',
    params: params
  })
}
export function insertBatch(data) {
  return request({
    url: `${prefix}/doAssign`,
    method: 'post',
    data: data
  })
}

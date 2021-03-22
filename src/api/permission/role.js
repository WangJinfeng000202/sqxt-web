import request from '@/utils/request'

const prefix = '/auth/role'

export function getRolesPage(RoleQueryParams) {
  return request({
    url: `${prefix}/getByPage`,
    method: 'post',
    data: RoleQueryParams
  })
}

export function getAllSimpleRoles() {
  return request({
    url: `${prefix}/getAll`,
    method: 'get'
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

export function add(role) {
  return request({
    url: `${prefix}/add`,
    method: 'post',
    data: role
  })
}

export function modify(role) {
  return request({
    url: `${prefix}/modify`,
    method: 'put',
    data: role
  })
}

export function removeById(params) {
  return request({
    url: `${prefix}/removeById`,
    method: 'delete',
    params: params
  })
}

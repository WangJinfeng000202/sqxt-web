import request from '@/utils/request'

const prefix = '/equipment'

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

export function listEquipmentsMatch() {
  return request({
    url: `${prefix}/listMatch`,
    method: 'get'
  })
}

export function getAccessibleEquipments() {
  return request({
    url: `${prefix}/findAccessibleEquipments`,
    method: 'get'
  })
}

export function listRelatedEquipments(params) {
  return request({
    url: `${prefix}/listRelatedEquipments`,
    method: 'get',
    params: params
  })
}

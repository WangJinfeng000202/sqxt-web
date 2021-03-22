import request from '@/utils/request'

const prefix = '/epv'

export function listPage(data) {
  return request({
    url: `${prefix}/listPage`,
    method: 'post',
    data: data
  })
}

export function upgradeEquipments(data) {
  return request({
    url: `${prefix}/upgrade`,
    method: 'post',
    data: data
  })
}

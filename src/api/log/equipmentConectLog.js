import request from '@/utils/request'

const prefix = '/equipmentConnectLog'

export function listEquipmentConnectLogs(data) {
  return request({
    url: `${prefix}/listEquipmentConnectLogs`,
    method: 'post',
    data: data
  })
}

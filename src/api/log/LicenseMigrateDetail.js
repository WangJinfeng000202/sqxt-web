import request from '@/utils/request'

const prefix = '/licenseMigrateDetail'

export function listLicenseMigrateDetailLogs(data) {
  return request({
    url: `${prefix}/listLicenseMigrateDetails`,
    method: 'post',
    data: data
  })
}

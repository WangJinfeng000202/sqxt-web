import request from '@/utils/request'

const prefix = '/programVersionLog'
export function listByProgramVersionId(params) {
  return request({
    url: `${prefix}/getByProgramVersionLogsId`,
    method: 'get',
    params: params
  })
}

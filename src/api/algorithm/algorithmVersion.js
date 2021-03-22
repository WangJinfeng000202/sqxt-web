import request from '@/utils/request'

const prefix = '/programVersion'

export function getByProgramId(data) {
  data.category = 0
  return request({
    url: `${prefix}/getByProgramId`,
    method: 'post',
    data: data
  })
}

export function getByPrograms(data) {
  return request({
    url: `${prefix}/getByProgramId`,
    method: 'post',
    data: data
  })
}

export function addVersion(data) {
  data.category = 0
  return request({
    url: `${prefix}/add`,
    method: 'post',
    data: data
  })
}

export function inputResult(data) {
  return request({
    url: `${prefix}/inputResult`,
    method: 'post',
    data: data
  })
}

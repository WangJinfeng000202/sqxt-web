import request from '@/utils/request'

const prefix = '/programVersion'

export function getByProgramId(data) {
  data.category = 1
  return request({
    url: `${prefix}/getByProgramId`,
    method: 'post',
    data: data
  })
}

export function getProgramVersion(data) {
  return request({
    url: `${prefix}/getByProgramId`,
    method: 'post',
    data: data
  })
}

export function addVersion(data) {
  data.category = 1
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

export function getAccessibleVersions(params) {
  return request({
    url: `${prefix}/getAccessibleVersionsByProgramId`,
    method: 'get',
    params: params
  })
}

export function downloadPackage(params) {
  return request({
    url: `${prefix}/download`,
    method: 'get',
    params: params
  })
}

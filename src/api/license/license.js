import request from '@/utils/request'

const prefix = 'license'

export function listPage(data) {
  return request({
    url: `${prefix}/listPage`,
    method: 'post',
    data: data
  })
}

export function addLicense(data) {
  return request({
    url: `${prefix}/addLicense`,
    method: 'post',
    data: data
  })
}

export function queryLicenseSn(params) {
  return request({
    url: `${prefix}/queryLicenseSn`,
    method: 'get',
    params: params
  })
}

export function delay(data) {
  return request({
    url: `${prefix}/delay`,
    method: 'post',
    data: data
  })
}


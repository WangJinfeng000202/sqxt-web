import request from '@/utils/request'

const prefix = '/ProgramUpgradeLog'

export function listHardwareUpgradeLogs(data) {
  return request({
    url: `${prefix}/listProgramUpgradeLogs`,
    method: 'post',
    data: data
  })
}

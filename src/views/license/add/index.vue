<template>
  <div class="app-container">
    <el-form inline :model="license" label-width="150px" label-position="right" class="demo-form-inline">
      <el-form-item label="合同编号">
        <el-select v-model="project" placeholder="请选择" value-key="id">
          <el-option v-for="(item,index) in projects" :key="index" :value="item" :label="item.contractNo" />
        </el-select>
      </el-form-item>
      <el-form-item label="项目名称">
        <el-select v-model="project" placeholder="请选择" value-key="id">
          <el-option v-for="(item,index) in projects" :key="index" :value="item" :label="item.name" />
        </el-select>
      </el-form-item>
      <el-form-item label="客户名称">
        <el-select v-model="project" placeholder="请选择" value-key="id">
          <el-option v-for="(item,index) in projects" :key="index" :value="item" :label="item.customerName" />
        </el-select>
      </el-form-item>
      <el-form-item label="设备名称">
        <el-select v-model="equipment" placeholder="请选择" value-key="id">
          <el-option v-for="(item,index) in equipments" :key="index" :value="item" :label="item.name" />
        </el-select>
      </el-form-item>
      <el-form-item label="设备型号">
        <el-select v-model="equipment" placeholder="请选择" value-key="id">
          <el-option v-for="(item,index) in equipments" :key="index" :value="item" :label="item.model" />
        </el-select>
      </el-form-item>
      <el-form-item label="设备序列码">
        <el-select v-model="equipment" placeholder="请选择" value-key="id">
          <el-option v-for="(item,index) in equipments" :key="index" :value="item" :label="item.sn" />
        </el-select>
      </el-form-item>
      <el-form-item label="算法名称">
        <el-select v-model="algorithm" placeholder="请选择" value-key="id" @change="changeAlgorithm">
          <el-option v-for="(item,index) in algorithms" :key="index" :value="item" :label="item.name" />
        </el-select>
      </el-form-item>
      <el-form-item label="算法版本号">
        <el-select v-model="algorithmVersion" placeholder="请选择" value-key="id">
          <el-option v-for="(item,index) in algorithmVersions" :key="index" :value="item" :label="item.version" />
        </el-select>
      </el-form-item>
      <el-form-item label="类型">
        <el-select v-model="algorithmVersion" placeholder="请选择" value-key="id">
          <el-option v-for="(item,index) in algorithmVersions" :key="index" :value="item" :label="item.type === 0?'安装包':'升级包'" />
        </el-select>
      </el-form-item>
      <el-form-item label="软件名称">
        <el-select v-model="program" placeholder="请选择" value-key="id" @change="changeProgram">
          <el-option v-for="(item,index) in programs" :key="index" :value="item" :label="item.name" />
        </el-select>
      </el-form-item>
      <el-form-item label="软件版本号">
        <el-select v-model="programVersion" placeholder="请选择" value-key="id">
          <el-option v-for="(item,index) in programVersions" :key="index" :value="item" :label="item.version" />
        </el-select>
      </el-form-item>
      <el-form-item label="类型">
        <el-select v-model="programVersion" placeholder="请选择" value-key="id">
          <el-option v-for="(item,index) in programVersions" :key="index" :value="item" :label="item.type === 0?'安装包':'升级包'" />
        </el-select>
      </el-form-item>
      <el-form-item label="领用人">
        <el-input v-model="license.receiveUserName" placeholder="请输入" suffix-icon="xxxx" />
      </el-form-item>
      <el-form-item label="领用人联系方式">
        <el-input v-model="license.receiveUserContactTel" placeholder="请输入" suffix-icon="xxxx" />
      </el-form-item>
      <el-form-item label="授权时间">
        <el-date-picker
          v-model="grantAt"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <el-col align="center">
        <el-button @click="toLicenseList">取 消</el-button>
        <el-button type="primary" @click="submit">提交</el-button>
      </el-col>
    </el-form>
  </div>
</template>

<script>
import { listProjectsMatch } from '@/api/project/project'
import { getAccessibleEquipments } from '@/api/equipment/equipment'
import { listProgramsMatch } from '@/api/program/program'
import { getAccessibleVersions } from '@/api/program/programVersion'
import { addLicense } from '@/api/license/license'

export default {
  name: 'Index',
  data() {
    return {
      projects: [],
      project: {},
      equipments: [],
      equipment: {},
      programs: [],
      programVersions: [],
      program: {},
      programVersion: {},
      algorithms: [],
      algorithmVersions: [],
      algorithmVersion: {},
      algorithm: {},
      license: { receiveUserName: '', contractNo: '', receiveUserContactTel: '' },
      grantAt: []
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.getAllProjects()
      this.getAllEquipments()
      this.getAllPrograms()
    },
    changeProgram() {
      const params = { programId: this.program.id }
      getAccessibleVersions(params).then(res => {
        this.programVersions = res.data.rows
      }).catch(() => {
        this.$message.error('获取数据失败')
      })
    },
    changeAlgorithm() {
      const params = { programId: this.algorithm.id }
      getAccessibleVersions(params).then(res => {
        this.algorithmVersions = res.data.rows
      }).catch(() => {
        this.$message.error('获取数据失败')
      })
    },
    getAllProjects() {
      listProjectsMatch().then(res => {
        this.projects = res.data.rows
      }).catch(() => {
        this.$message.error('获取数据失败')
      })
    },
    getAllEquipments() {
      getAccessibleEquipments().then(res => {
        this.equipments = res.data.rows
      }).catch(() => {
        this.$message.error('获取数据失败')
      })
    },
    getAllPrograms() {
      listProgramsMatch().then(res => {
        this.programs = res.data.rows
        this.algorithms = res.data.items
      })
    },
    submit() {
      if (!this.program.id && !this.algorithm.id) {
        this.$message.error('软件或算法至少选择一个')
        return
      }
      const data = { ...this.license }
      data.equipmentId = this.equipment.id
      data.customerName = this.project.customerName
      data.projectId = this.project.id
      data.licenseDetailDTO = []
      if (this.program.id) {
        data.licenseDetailDTO.push({
          programId: this.program.id,
          programVersionId: this.programVersion.id,
          grantAt: this.grantAt[0],
          expiredAt: this.grantAt[1]
        })
      }
      if (this.algorithm.id) {
        data.licenseDetailDTO.push({
          programId: this.algorithm.id,
          programVersionId: this.algorithmVersion.id,
          grantAt: this.grantAt[0],
          expiredAt: this.grantAt[1]
        })
      }
      addLicense(data).then(res => {
        this.$notify({ title: '成功', message: res.msg, type: 'success' })
        this.toLicenseList()
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    toLicenseList() {
      this.$router.push({ 'path': '/license/index' })
    }
  }
}
</script>

<style scoped>

</style>

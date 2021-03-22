<template>
  <div class="app-container">
    <!--搜索输入-->
    <el-form :inline="true" :model="licenseMigrateDetailsLogQueryParams">
      <el-form-item label="项目名称">
        <el-input v-model="licenseMigrateDetailsLogQueryParams.projectName" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="设备名称">
        <el-input v-model="licenseMigrateDetailsLogQueryParams.equipmentName" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="记录时间">
        <el-date-picker v-model="licenseMigrateDetailsLogQueryParams.insertStartAt" type="datetime" placeholder="选择开始时间" />
        <el-date-picker v-model="licenseMigrateDetailsLogQueryParams.insertEndAt" type="datetime" placeholder="选择截止时间" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getLicenseMigrateDetailsLogs"><i class="el-icon-search" />查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="clearParams"><i class="el-icon-remove" />清空</el-button>
      </el-form-item>
    </el-form>
    <!--表格信息-->
    <el-table :data="licenseMigrateDetailLogs" style="width: 100%;margin-bottom: 20px">
      <el-table-column type="index" label="序号" width="80" />
      <el-table-column property="projectName" label="项目名称" />
      <el-table-column property="contractNo" label="合同编号" />
      <el-table-column property="customerName" label="客户名称" />
      <el-table-column property="equipmentName" label="设备名称" />
      <el-table-column property="equipmentSn" label="设备序列码" />
      <el-table-column property="type" label="延期/终止">
        <template slot-scope="scope">
          <span v-if="scope.row.type === 0" style="color: #20a0ff">延期</span>
          <span v-if="scope.row.type === 1" style="color: red;">终止</span>
        </template>
      </el-table-column>
      <el-table-column property="insertedAt" label="记录时间" width="150" />
      <el-table-column label="操作项" width="120">
        <template>
          <a class="a-button">
            <i class="el-icon-edit" />查看设备信息
          </a>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <el-pagination
      background
      :current-page="page"
      :total="total"
      :page-size="pageSize"
      :page-sizes="[5, 10, 20, 30, 40, 50]"
      style="padding: 30px 0; text-align: center;"
      layout="sizes, prev, pager, next, jumper, ->, total, slot"
      @size-change="pageSizeChanged"
      @current-change="pageChanged"
    />
  </div>
</template>

<script>
import { listLicenseMigrateDetailLogs } from '@/api/log/LicenseMigrateDetail'

export default {
  name: 'Index',
  data() {
    return {
      page: 1,
      pageSize: 10,
      total: 0,
      licenseMigrateDetailsLogQueryParams: { projectName: '', equipmentName: '', insertStartAt: '', insertEndAt: '' },
      licenseMigrateDetailLogs: []
    }
  },
  created() {
    this.getLicenseMigrateDetailsLogs()
  },
  methods: {
    getLicenseMigrateDetailsLogs() {
      const data = { ...this.licenseMigrateDetailsLogQueryParams }
      data.page = this.page
      data.pageSize = this.pageSize
      listLicenseMigrateDetailLogs(data).then(res => {
        this.licenseMigrateDetailLogs = res.data.rows
        this.total = res.data.total
      }).catch(() => {
        this.$message.success('加载数据失败')
      })
    },
    equipmentDetail(row) {
      this.$router.push({ path: '/equipment/detail' })
    },
    clearParams() {
      this.licenseMigrateDetailsLogQueryParams = {}
    },
    pageChanged(page) {
      this.page = page
      this.getEquipments()
    },
    pageSizeChanged(pageSize) {
      this.page = 1
      this.pageSize = pageSize
      this.getEquipments()
    }
  }
}
</script>

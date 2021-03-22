<template>
  <div class="app-container">
    <!--搜索输入-->
    <el-form :inline="true" :model="equipmentConnectLogQueryParams">
      <el-form-item label="设备名称">
        <el-input v-model="equipmentConnectLogQueryParams.equipmentName" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="设备序列码">
        <el-input v-model="equipmentConnectLogQueryParams.equipmentSn" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="授权序列码">
        <el-input v-model="equipmentConnectLogQueryParams.licenseSn" placeholder="请输入" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="clearParams"><i class="el-icon-remove" />清空</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getEquipmentConnectLogs"><i class="el-icon-search" />查询</el-button>
      </el-form-item>
    </el-form>
    <!--表格信息-->
    <el-table :data="equipmentsConnectLogs" style="width: 100%;margin-bottom: 20px">
      <el-table-column type="index" label="序号" width="80" />
      <el-table-column property="equipmentName" label="设备名称" />
      <el-table-column property="licenseSn" label="授权序列码" />
      <el-table-column property="equipmentSn" label="设备序列码" />
      <el-table-column property="insertedAt" label="连接时间" />
      <el-table-column property="ip" label="连接ip" />
      <el-table-column label="操作">
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

import { listEquipmentConnectLogs } from '@/api/log/equipmentConectLog'

export default {
  name: 'Index',
  data() {
    return {
      page: 1,
      pageSize: 10,
      total: 0,
      equipmentConnectLogQueryParams: { equipmentSn: '', equipmentName: '', licenseSn: '' },
      equipmentsConnectLogs: []
    }
  },
  created() {
    this.getEquipmentConnectLogs()
  },
  methods: {
    getEquipmentConnectLogs() {
      const data = { ...this.equipmentConnectLogQueryParams }
      data.page = this.page
      data.pageSize = this.pageSize
      listEquipmentConnectLogs(data).then(res => {
        this.equipmentsConnectLogs = res.data.rows
        this.total = res.data.total
      }).catch(() => {
        this.$message.success('加载数据失败')
      })
    },
    equipmentDetail(row) {
      this.$router.push({ path: '/equipment/detail' })
    },
    clearParams() {
      this.equipmentConnectLogQueryParams = {}
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

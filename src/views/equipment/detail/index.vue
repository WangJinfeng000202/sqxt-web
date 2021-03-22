<template>
  <div class="app-container">
    <a-tabs v-model="activeName">
      <a-tab-pane key="first" tab="设备详情">
        <a-descriptions title="设备基础信息">
          <a-descriptions-item label="设备名称">
            {{ equipment.name }}
          </a-descriptions-item>
          <a-descriptions-item label="设备型号">
            {{ equipment.model }}
          </a-descriptions-item>
          <a-descriptions-item label="设备序列码">
            {{ equipment.sn }}
          </a-descriptions-item>
          <a-descriptions-item label="设备照片">
            <span style="color: red;">{{ fileList.length }}张</span>
          </a-descriptions-item>
          <br>
          <br>
          <a-descriptions-item>
            <el-image
              v-for="(item,index) in fileList"
              :key="index"
              fit="contain"
              style="width: 100px; height: 100px"
              :src="item"
              :preview-src-list="fileList"
            />
          </a-descriptions-item>
        </a-descriptions>
        <a-descriptions v-if="equipment.contractNo" title="项目基础信息">
          <a-descriptions-item label="项目编号">
            {{ project.no }}
          </a-descriptions-item>
          <a-descriptions-item label="项目名称">
            {{ project.name }}
          </a-descriptions-item>
          <a-descriptions-item label="客户名称">
            {{ project.customerName }}
          </a-descriptions-item>
          <a-descriptions-item label="联系人">
            {{ project.contactName }}
          </a-descriptions-item>
          <a-descriptions-item label="联系方式">
            {{ project.contactTel }}
          </a-descriptions-item>
        </a-descriptions>
        <a-descriptions title="其他信息">
          <a-descriptions-item label="入库时间">
            {{ equipment.insertedAt }}
          </a-descriptions-item>
          <a-descriptions-item label="登记人员">
            {{ equipment.createUserName }}
          </a-descriptions-item>
          <a-descriptions-item label="授权时间">
            {{ equipment.grantAt }}
          </a-descriptions-item>
          <a-descriptions-item label="激活时间">
            {{ equipment.activateAt }}
          </a-descriptions-item>
          <a-descriptions-item label="领用人">
            {{ equipment.receiveUserName }}
          </a-descriptions-item>
          <a-descriptions-item label="领用联系方式">
            {{ equipment.receiveUserContactTel }}
          </a-descriptions-item>
        </a-descriptions>
      </a-tab-pane>
      <a-tab-pane key="second" tab="设备连接记录">
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
      </a-tab-pane>
      <a-tab-pane key="third" tab="设备升级记录">
        <!--表格信息-->
        <el-table :data="hardwareUpgradeLogs" style="width: 100%;margin-bottom: 20px">
          <el-table-column type="index" label="序号" width="80" />
          <el-table-column property="projectName" label="项目名称" />
          <el-table-column property="equipmentName" label="设备名称" />
          <el-table-column property="equipmentSn" label="设备序列码" width="150" />
          <el-table-column property="programCategory" label="升级类型">
            <template slot-scope="scope">
              <span v-if="scope.row.type === 0" style="color: #20a0ff">程序</span>
              <span v-if="scope.row.type === 1" style="color: red;">算法</span>
            </template>
          </el-table-column>
          <el-table-column property="programName" label="程序名称" />
          <el-table-column property="programVersion" label="升级版本号" />
          <el-table-column property="remark" label="描述" />
          <el-table-column property="type" label="离线/在线">
            <template slot-scope="scope">
              <span v-if="scope.row.type === 0" style="color: red">离线</span>
              <span v-if="scope.row.type === 1" style="color: #20a0ff;">在线</span>
            </template>
          </el-table-column>
          <el-table-column property="insertedAt" label="连接时间" width="150" />
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
      </a-tab-pane>
      <a-tab-pane key="fourth" tab="设备授权记录">
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
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>
import { download } from '@/api/upload'
import { getByContractNo } from '@/api/project/project'
import { listEquipmentConnectLogs } from '@/api/log/equipmentConectLog'
import { listHardwareUpgradeLogs } from '@/api/log/hardWareUpgradeLog'
import { listLicenseMigrateDetailLogs } from '@/api/log/LicenseMigrateDetail'

export default {
  data() {
    return {
      activeName: 'first',
      equipment: {},
      fileList: [],
      project: {},
      page: 1,
      pageSize: 10,
      total: 0,
      equipmentConnectLogQueryParams: { equipmentSn: '', equipmentName: '', licenseSn: '' },
      equipmentsConnectLogs: [],
      hardwareUpgradeLogs: [],
      licenseMigrateDetailLogs: []
    }
  },
  created() {
    this.init()
    // 如果设备已经绑定 根据合同编号获取项目信息
    if (this.equipment.contractNo) {
      this.getProjectByContractNo()
    }
    this.getEquipmentConnectLogs()
    this.getHardWareUpgradeLogs()
    this.getLicenseMigrateDetailsLogs()
  },
  methods: {
    init() {
      this.equipment = this.$route.params.equipment
      this.getPhotos()
    },
    getPhotos() {
      const params = { ownerName: 'equipment', ownerId: this.equipment.id }
      download(params).then(res => {
        this.fileList = res.data.rows
      }).catch(() => {
      })
    },
    getProjectByContractNo() {
      const params = { contractNo: this.equipment.contractNo }
      getByContractNo(params).then(res => {
        this.project = res.data.row
      }).catch(() => {
      })
    },
    getLicenseMigrateDetailsLogs() {
      const data = { contractNo: this.equipment.contractNo }
      data.page = this.page
      data.pageSize = this.pageSize
      listLicenseMigrateDetailLogs(data).then(res => {
        this.licenseMigrateDetailLogs = res.data.rows
        this.total = res.data.total
      }).catch(() => {
        this.$message.success('加载数据失败')
      })
    },
    getHardWareUpgradeLogs() {
      const data = { equipmentId: this.equipment.id }
      data.page = this.page
      data.pageSize = this.pageSize
      listHardwareUpgradeLogs(data).then(res => {
        this.hardwareUpgradeLogs = res.data.rows
        this.total = res.data.total
      }).catch(() => {
        this.$message.success('加载数据失败')
      })
    },
    getEquipmentConnectLogs() {
      const data = { equipmentId: this.equipment.id }
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

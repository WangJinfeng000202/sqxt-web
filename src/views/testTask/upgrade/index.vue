<template>
  <div class="app-container">
    <!--搜索输入-->
    <el-form :inline="true" :model="epvQueryParams">
      <el-form-item label="项目名称">
        <el-input v-model="epvQueryParams.projectName" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="设备名称">
        <el-input v-model="epvQueryParams.equipmentName" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="epvQueryParams.status" placeholder="请输入">
          <el-option label="未升级" :value="0" />
          <el-option label="已升级" :value="1" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getEquipments"><i class="el-icon-search" />查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="clearParams"><i class="el-icon-remove" />清空</el-button>
      </el-form-item>
      <el-button type="primary" @click="upgradeDialog(false)">批量升级</el-button>
    </el-form>
    <!--表格信息-->
    <el-table :data="epvs" style="width: 100%;margin-bottom: 20px" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" :selectable="checkBox" />
      <el-table-column property="projectName" label="项目名称" width="180px" />
      <el-table-column property="equipmentName" label="设备名称" width="180px" />
      <el-table-column property="equipmentSn" label="设备序列码" width="180" />
      <el-table-column property="programName" label="程序/算法名称" />
      <el-table-column property="programVersion" label="版本号" />
      <el-table-column label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.programVersionOrder < epvQueryParams.programVersionOrder">未升级</span>
          <span v-else>已升级</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200px">
        <template slot-scope="scope">
          <a class="a-button" @click="detailInfo(scope.row)">
            <i class="el-icon-edit" />查看
          </a>
          <a
            v-if="scope.row.programVersionOrder < epvQueryParams.programVersionOrder"
            class="a-button"
            @click="upgradeDialog(scope.row)"
          >
            <i class="el-icon-edit" />升级
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
    <!--设备升级窗口-->
    <el-dialog title="设备升级" :visible.sync="dialogUpgradeVisible" :before-close="closeUpgrade" width="35%">
      <el-form :model="upgradeDetail" class="app-container" label-width="80px" label-position="left">
        <el-form-item label="升级方式">
          <el-radio-group v-model="upgradeDetail.type">
            <el-radio :label="0">离线升级</el-radio>
            <el-radio :label="1">在线升级</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="upgradeDetail.remark" type="textarea" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="upgradeSubmit">确定</el-button>
          <el-button @click="closeUpgrade">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { listPage, upgradeEquipments } from '@/api/equipmentProgramVersion/epv'

export default {
  name: 'Index',
  data() {
    return {
      page: 1,
      pageSize: 10,
      total: 0,
      epvQueryParams: { projectName: '', equipmentName: '', status: '' },
      epvs: [],
      multipleSelection: [],
      epv: {},
      // 设备升级
      dialogUpgradeVisible: false,
      upgradeDetail: { type: '', remark: '' },
      programVersionId: '',
      batch: false
    }
  },
  created() {
    this.init()
    this.getEquipments()
  },
  methods: {
    init() {
      this.epvQueryParams.programId = this.$route.params.programId
      this.epvQueryParams.programVersionOrder = this.$route.params.order
      this.programVersionId = this.$route.params.programVersionId
    },
    upgradeDialog(row) {
      this.epv = row
      this.batch = !row
      if (this.batch && this.multipleSelection.length < 1) {
        this.dialogUpgradeVisible = false
        this.$message.warning('未选择要升级的设备')
      } else {
        this.dialogUpgradeVisible = true
      }
    },
    closeUpgrade() {
      this.dialogUpgradeVisible = false
      this.upgradeDetail = { type: '', remark: '' }
    },
    upgradeSubmit() {
      const data = {}
      data.programVersionId = this.programVersionId
      data.type = this.upgradeDetail.type
      data.remark = this.upgradeDetail.remark
      data.epvs = []
      if (this.batch) {
        console.log(this.multipleSelection)
        data.epvs = this.multipleSelection
      } else {
        data.epvs.push({ ...this.epv })
      }
      upgradeEquipments(data).then(res => {
        this.$notify({ title: '成功', message: res.msg, type: 'success' })
        this.closeUpgrade()
        this.getEquipments()
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    detailInfo(row) {
    },
    checkBox(row) {
      return row.programVersionOrder < this.epvQueryParams.programVersionOrder
    },
    getEquipments() {
      const data = { ...this.epvQueryParams }
      data.page = this.page
      data.pageSize = this.pageSize
      listPage(data).then(res => {
        this.epvs = res.data.rows
        this.total = res.data.total
      }).catch(() => {
        this.$message.error('加载数据失败')
      })
    },
    cancelForm() {
      this.draw = false
      this.equipment = {}
    },
    clearParams() {
      this.epvQueryParams.projectName = ''
      this.epvQueryParams.equipmentName = ''
      this.epvQueryParams.status = ''
    },
    pageChanged(page) {
      this.page = page
      this.getEquipments()
    },
    pageSizeChanged(pageSize) {
      this.page = 1
      this.pageSize = pageSize
      this.getEquipments()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
  }
}
</script>
<style lang="scss">
:focus {
  outline: 0;
}

.el-upload-list__item {
  transition: none !important;
}

.a-button {
  color: #20a0ff;
}
</style>

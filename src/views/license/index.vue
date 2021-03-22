<template>
  <div class="app-container">
    <!--搜索输入-->
    <el-form :inline="true" :model="licenseQueryParams">
      <el-form-item label="项目名称">
        <el-input v-model="licenseQueryParams.projectName" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="设备名称">
        <el-input v-model="licenseQueryParams.equipmentName" placeholder="请输入" />
      </el-form-item>
      <br>
      <el-form-item label="激活时间">
        <el-date-picker
          v-model="licenseQueryParams.activeAt"
          type="daterange"
          :clearable="false"
          align="right"
          unlink-panels
          range-separator="——"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
        />
      </el-form-item>
      <el-form-item label="入库时间">
        <el-date-picker
          v-model="licenseQueryParams.insertedAt"
          type="daterange"
          :clearable="false"
          align="right"
          unlink-panels
          range-separator="——"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getLicenses"><i class="el-icon-search" />查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="clearParams"><i class="el-icon-remove" />清空</el-button>
      </el-form-item>
      <el-button type="primary" @click="toAddLicenseForm">新增</el-button>
    </el-form>
    <!--表格信息-->
    <el-table :data="licenses" style="width: 100%;margin-bottom: 20px">
      <el-table-column type="index" label="序号" width="80" />
      <el-table-column property="projectName" label="项目名称" width="150" />
      <el-table-column property="contractNo" label="合同编号" width="180" />
      <el-table-column property="customerName" label="客户名称" />
      <el-table-column property="equipmentName" label="项目名称" />
      <el-table-column property="programName" label="程序/算法" width="180" />
      <el-table-column property="grantAt" label="授权开始" width="150" />
      <el-table-column property="expiredAt" label="授权结束" width="150" />
      <el-table-column property="insertedAt" label="入库时间" width="150" />
      <el-table-column label="操作" fixed="right" width="400">
        <template slot-scope="scope">
          <a class="a-button">
            下载授权文件
          </a>
          <a class="a-button" @click="getLicenseSn(scope.row)">
            查看授权码
          </a>
          <a class="a-button">
            查看授权记录
          </a>
          <a class="a-button">
            查看详情
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
    <!--显示授权码-->
    <el-dialog title="设备授权码" :visible.sync="dialogSnVisible" :before-close="closeLicenseSn" width="30%">
      <span>{{ licenseSn }}</span>
    </el-dialog>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import { listPage, queryLicenseSn } from '@/api/license/license'

export default {
  name: 'Index',
  data() {
    return {
      page: 1,
      pageSize: 5,
      total: 0,
      licenseQueryParams: { projectName: '', equipmentName: '', activeAt: [], insertedAt: [] },
      licenses: [],
      license: { insertedAt: '' },
      draw: false,
      drawTitle: '新增授权',
      activeName: 'first',
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      fileList: [],
      licenseSn: '',
      dialogSnVisible: false,
      headers: {
        Authorization: 'Bearer ' + getToken()
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  created() {
    this.getLicenses()
  },
  methods: {
    toAddLicenseForm() {
      this.$router.push({ 'path': '/license/add' })
    },
    getLicenses() {
      const data = { ...this.licenseQueryParams }
      data.page = this.page
      data.pageSize = this.pageSize
      data.activeAtStart = data.activeAt[0]
      data.activeAtEnd = data.activeAt[1]
      data.insertedAtStart = data.insertedAt[0]
      data.insertedAtEnd = data.insertedAt[1]
      delete data.insertedAt
      delete data.activeAt
      listPage(data).then(res => {
        this.licenses = res.data.rows
        this.total = res.data.total
      }).catch(err => {
        this.$notify({ title: '错误', message: err, type: 'error' })
      })
    },
    closeLicenseSn() {
      this.dialogSnVisible = false
      this.licenseSn = ''
    },
    clearParams() {
      this.licenseQueryParams = { projectName: '', equipmentName: '', activeAt: [], insertedAt: [] }
    },
    pageChanged(page) {
      this.page = page
      this.getLicenses()
    },
    pageSizeChanged(pageSize) {
      this.page = 1
      this.pageSize = pageSize
      this.getLicenses()
    },
    getLicenseSn(row) {
      this.dialogSnVisible = true
      const params = { id: row.id }
      queryLicenseSn(params).then(res => {
        this.licenseSn = res.data.row
      }).catch(() => {
        this.$message.error('获取数据失败')
      })
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

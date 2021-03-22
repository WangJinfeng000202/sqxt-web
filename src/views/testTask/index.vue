<template>
  <div class="app-container">
    <!--搜索输入-->
    <el-form :inline="true" :model="programVersionQueryParams">
      <el-form-item label="类型">
        <el-select v-model="programVersionQueryParams.category">
          <el-option :value="0" label="算法" />
          <el-option :value="1" label="程序" />
        </el-select>
      </el-form-item>
      <el-form-item label="版本号">
        <el-input v-model="programVersionQueryParams.version" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="测试版本">
        <el-select v-model="programVersionQueryParams.status">
          <el-option :value="0" label="通过" />
          <el-option :value="1" label="待测试" />
          <el-option :value="3" label="失败" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getProgramVersions"><i class="el-icon-search" />查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="clearParams"><i class="el-icon-remove" />清空</el-button>
      </el-form-item>
    </el-form>
    <!--表格信息-->
    <el-table :data="programVersions" style="width: 100%;margin-bottom: 20px">
      <el-table-column type="index" label="序号" width="80">
        <template slot-scope="scope">
          {{ (page-1) * pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column property="programName" label="算法/程序名称" width="180px" />
      <el-table-column property="version" label="版本号" />
      <el-table-column label="类型">
        <template slot-scope="scope">
          {{ scope.row.category === 0? '算法' : '程序' }}
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 0" style="color: #20a0ff">已通过</span>
          <span v-if="scope.row.status === 1" style="color: pink">待测试</span>
          <span v-if="scope.row.status === 2" style="color: green">测试中</span>
          <span v-if="scope.row.status === 3" style="color: red">失败</span>
        </template>
      </el-table-column>
      <el-table-column property="description" label="描述" />
      <el-table-column property="maintainer" label="维护人" />
      <el-table-column label="文件包">
        <template slot-scope="scope">
          <a @click="download(scope.row)"><i class="el-icon-download" />下载</a>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <a v-if="scope.row.status === 0" @click="upgradeEquipment(scope.row)"><i class="el-icon-edit" />设备升级</a>
          <a v-if="scope.row.status === 1" @click="inputResult(scope.row)"><i class="el-icon-edit" />录入测试结果</a>
          <span v-if="scope.row.status === 3"> ———— </span>
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
    <el-dialog
      title="录入测试结果"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <el-form :model="result" status-icon label-width="100px" class="demo-ruleForm">
        <el-form-item label="录入测试结果">
          <el-radio-group v-model="result.status">
            <el-radio :label="0">通过</el-radio>
            <el-radio :label="3">不通过</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="result.remark" type="textarea" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getProgramVersion, inputResult } from '@/api/program/programVersion'
import { download } from '@/api/upload'

export default {
  name: 'Index',
  data() {
    return {
      page: 1,
      pageSize: 10,
      total: 0,
      programVersionQueryParams: { no: '', name: '', customerName: '' },
      programVersions: [],
      programVersion: { contactName: '' },
      dialogVisible: false,
      result: {}
    }
  },
  created() {
    this.getProgramVersions()
  },
  methods: {
    download(row) {
      const params = { ownerId: row.id, ownerName: 'program_version' }
      download(params).then(res => {
        window.location.href = res.data.rows[0]
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    inputResult(row) {
      this.dialogVisible = true
      this.result.id = row.id
    },
    submit() {
      const data = { ...this.result }
      inputResult(data).then(res => {
        this.$notify({ title: '成功', message: res.msg, type: 'success' })
        this.result = {}
        this.dialogVisible = false
        this.getProgramVersions()
      }).catch(err => {
        this.$notify({ title: '错误', message: err.message, type: 'error' })
      })
    },
    handleEdit(row) {
      this.draw = true
      this.drawTitle = '编辑项目'
      const params = {}
      params.id = row.id
    },
    getProgramVersions() {
      const data = { ...this.programVersionQueryParams }
      data.page = this.page
      data.pageSize = this.pageSize
      getProgramVersion(data).then(res => {
        this.programVersions = res.data.rows
        this.total = res.data.total
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    clearParams() {
      this.programVersionQueryParams = {}
    },
    pageChanged(page) {
      this.page = page
      this.getProgramVersions()
    },
    pageSizeChanged(pageSize) {
      this.page = 1
      this.pageSize = pageSize
      this.getProgramVersions()
    },
    upgradeEquipment(row) {
      this.$router.push({
        name: 'Upgrade',
        params: { programId: row.programId, order: row.order, programVersionId: row.id }
      })
    }
  }
}
</script>
<style lang="scss">
:focus {
  outline: 0;
}
</style>

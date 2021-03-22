<template>
  <div class="app-container">
    <!--搜索输入-->
    <el-form :inline="true" :model="projectQueryParams">
      <el-form-item label="项目编号">
        <el-input v-model="projectQueryParams.no" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="项目名称">
        <el-input v-model="projectQueryParams.name" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="客户名称">
        <el-input v-model="projectQueryParams.customerName" placeholder="请输入" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getProjects"><i class="el-icon-search" />查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="clearParams"><i class="el-icon-remove" />清空</el-button>
      </el-form-item>
      <el-button type="primary" @click="addProject">新增</el-button>
    </el-form>
    <!--表格信息-->
    <el-table
      :data="projects"
      style="width: 100%;margin-bottom: 20px"
      :expand-row-keys="currentExpandRow"
      row-key="id"
      @expand-change="expandChange"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table
            :data="props.row.equipments"
            style="width: 100%"
          >
            <el-table-column prop="name" label="设备名称" />
            <el-table-column prop="model" label="设备型号" />
            <el-table-column prop="sn" label="设备序列码" width="150" />
            <el-table-column prop="grantAt" label="授权时间" width="150" />
            <el-table-column prop="activateAt" label="激活时间" width="150" />
            <el-table-column label="时效倒计时" width="150">
              <template slot-scope="scope">
                <span v-if="scope.row.remainDay === -2">永久</span>
                <span v-else-if="scope.row.remainDay === -1">已到期</span>
                <span v-else>{{ scope.row.remainDay }}</span>
              </template>

            </el-table-column>
            <el-table-column prop="receiveUserName" label="领用人" />
            <el-table-column prop="contractNo" label="合同编号" width="150" />
            <el-table-column label="算法名称">
              <template slot-scope="scope">
                <span v-if="scope.row.programCategory === 0">
                  {{ scope.row.programName }}
                </span>
                <span v-else>——</span>
              </template>
            </el-table-column>
            <el-table-column label="软件名称">
              <template slot-scope="scope">
                <span v-if="scope.row.programCategory === 1">
                  {{ scope.row.programName }}
                </span>
                <span v-else>——</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="280">
              <template slot-scope="scope">
                <a v-if="scope.row.remainDay !== -2" @click="openDelayDialog(scope.row)">
                  <i class="el-icon-edit" />延期
                </a>
                <a v-if="scope.row.remainDay !== -2" @click="terminationTip(scope.row)">
                  <i class="el-icon-edit" />终止
                </a>
                <a>
                  <i class="el-icon-view" />连接记录
                </a>
                <a>
                  <i class="el-icon-view" />升级记录
                </a>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column property="no" label="项目编号" width="180px" />
      <el-table-column property="name" label="项目名称" />
      <el-table-column property="customerName" label="客户名称" />
      <el-table-column property="contactName" label="联系人" />
      <el-table-column property="contactTel" label="联系电话" />
      <el-table-column property="createUserName" label="入库人员" />
      <el-table-column property="insertedAt" label="入库时间" />
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <span v-if="scope.row.contractNo" style="color: #20a0ff;">————</span>
          <span v-else>
            <a @click="handleEdit(scope.row)">
              <i class="el-icon-edit" />编辑
            </a>
            <a @click="handleDelete(scope.row)">
              <i class="el-icon-delete" />删除
            </a>
          </span>
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
    <!--新增或修改窗口-->
    <el-drawer
      :title="drawTitle"
      :before-close="cancelForm"
      :visible.sync="draw"
      direction="rtl"
      size="35%"
    >
      <el-form :model="project" class="app-container" label-width="80px" label-position="left">
        <el-form-item label="合同编号">
          <el-input v-model="project.contractNo" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="项目名称">
          <el-input v-model="project.name" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="客户名称">
          <el-input v-model="project.customerName" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="联系人">
          <el-input v-model="project.contactName" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="project.contactTel" placeholder="请输入" />
        </el-form-item>
        <el-form-item>
          <el-button @click="cancelForm">取 消</el-button>
          <el-button type="primary" @click="saveProject">
            保存
          </el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
    <!--延期-->
    <el-dialog title="延期" :visible.sync="dialogFormVisible" width="40%" :before-close="closeDelay">
      <el-form :model="delay" label-width="80">
        <el-form-item label="是否永久">
          <el-select v-model="delay.type" placeholder="请选择（是、否）">
            <el-option label="否" :value="0" />
            <el-option label="是" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="!delay.type" label="授权时间">
          <el-date-picker
            v-model="delay.time"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="——"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDelay">取 消</el-button>
        <el-button type="primary" @click="delaySubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { add, getById, getByPage, modify, removeById } from '@/api/project/project'
import { listRelatedEquipments } from '@/api/equipment/equipment'
import { delay } from '@/api/license/license'

export default {
  name: 'Index',
  data() {
    return {
      page: 1,
      pageSize: 10,
      total: 0,
      projectQueryParams: { no: '', name: '', customerName: '' },
      projects: [],
      project: { contactName: '' },
      draw: false,
      drawTitle: '新增用户',
      currentExpandRow: [],
      // 延期
      dialogFormVisible: false,
      delay: { type: 0, time: [] },
      delayDetail: {}
    }
  },
  created() {
    this.getProjects()
  },
  methods: {
    closeDelay() {
      this.dialogFormVisible = false
      this.delay = { type: 0, time: [] }
    },
    openDelayDialog(row) {
      this.dialogFormVisible = true
      this.delayDetail = row
      this.delay.end = false
    },
    terminationTip(row) {
      this.$confirm('此操作将终止设备, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delay.end = true
        this.delayDetail = row
        this.delaySubmit()
      })
    },
    delaySubmit() {
      const data = {}
      console.log(this.delayDetail)
      data.licenseId = this.delayDetail.licenseId
      data.licenseDetailId = this.delayDetail.licenseDetailId
      data.end = this.delay.end
      data.permanent = (this.delay.type === 1)
      // 如果不终止
      if (!data.end) {
        if (!data.permanent) { // 如果不是永久
          if (this.delay.time.length === 2) { // 时间不为空
            data.presentGrantAt = this.delay.time[0]
            data.presentExpiredAt = this.delay.time[1]
          } else {
            this.$message.warning('授权时间不能为空')
            return
          }
        }
      }
      delay(data).then(res => {
        this.$notify({ title: '成功', message: res.msg, type: 'success' })
        this.closeDelay()
        this.getProjects()
        this.currentExpandRow = []
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    expandChange(row) {
      const params = {
        contractNo: row.contractNo
      }
      const rowIndex = this.currentExpandRow.indexOf(row.id)
      if (rowIndex === -1) { // 未展开，点击打开
        this.currentExpandRow.push(row.id)
      } else { // 已经展开，点击后关闭
        this.currentExpandRow.splice(rowIndex, 1)
        return
      }
      let currentIndex = 0
      this.projects.forEach((item, index) => {
        if (item.id === row.id) {
          currentIndex = index
        }
      })
      listRelatedEquipments(params).then(res => {
        this.$set(this.projects[currentIndex], 'equipments', res.data.rows)
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    handleEdit(row) {
      this.draw = true
      this.drawTitle = '编辑项目'
      const params = {}
      params.id = row.id
      getById(params).then(res => {
        this.project = res.data.row
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除该项目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.removeProjectById(row)
      }).catch(() => {})
    },
    removeProjectById(row) {
      const params = {}
      params.id = row.id
      removeById(params).then(res => {
        this.$notify({ title: '成功', message: res.msg, type: 'success' })
        this.getProjects()
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    saveProject() {
      if (!this.project.id) {
        add(this.project).then(res => {
          this.$notify({ title: '成功', message: res.msg, type: 'success' })
          this.cancelForm()
          this.getProjects()
        }).catch(err => {
          this.$message.error(err.message)
        })
      } else {
        modify(this.project).then(res => {
          this.$notify({ title: '成功', message: res.msg, type: 'success' })
          this.cancelForm()
          this.getProjects()
        }).catch(err => {
          this.$message.error(err.message)
        })
      }
    },
    getProjects() {
      const data = { ...this.projectQueryParams }
      data.page = this.page
      data.pageSize = this.pageSize
      getByPage(data).then(res => {
        this.projects = res.data.rows
        this.total = res.data.total
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    cancelForm() {
      this.draw = false
      this.project = {}
    },
    clearParams() {
      this.projectQueryParams = {}
    },
    addProject() {
      this.draw = true
      this.drawTitle = '新增项目'
    },
    pageChanged(page) {
      this.page = page
      this.getProjects()
    },
    pageSizeChanged(pageSize) {
      this.page = 1
      this.pageSize = pageSize
      this.getProjects()
    }
  }
}
</script>
<style lang="scss">
:focus {
  outline: 0;
}
</style>

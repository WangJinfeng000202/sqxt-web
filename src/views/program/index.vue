<template>
  <div class="app-container">
    <!--搜索输入-->
    <el-form :inline="true" :model="programQueryParams">
      <el-form-item label="程序名称">
        <el-input v-model="programQueryParams.name" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="程序版本">
        <el-input v-model="programQueryParams.latestVersion" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="类型">
        <el-select v-model="programQueryParams.type" placeholder="请选择">
          <el-option label="安装包" :value="0" />
          <el-option label="升级包" :value="1" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getPrograms"><i class="el-icon-search" />查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="clearParams"><i class="el-icon-remove" />清空</el-button>
      </el-form-item>
      <el-button type="primary" @click="addProgram">新增</el-button>
    </el-form>
    <!--表格信息-->
    <el-table
      :data="programs"
      style="width: 100%;margin-bottom: 20px"
      :header-cell-style="{background:'#eef1f6',color:'#606266'}"
      :expand-row-keys="currentExpandRow"
      row-key="id"
      @expand-change="expandChange"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table
            :data="props.row.versions"
            style="width: 100%"
            :header-cell-style="{background:'#eef1f6',color:'#606266'}"
          >
            <el-table-column prop="version" label="版本" />
            <el-table-column label="状态">
              <template slot-scope="scope">
                <span v-if="scope.row.status === 0" style="color: #20a0ff">已通过</span>
                <span v-if="scope.row.status === 1" style="color: pink">待测试</span>
                <span v-if="scope.row.status === 2" style="color: green">测试中</span>
                <span v-if="scope.row.status === 3" style="color: red">失败</span>
              </template>
            </el-table-column>
            <el-table-column prop="maintainer" label="维护人" />
            <el-table-column prop="remark" label="备注" />
            <el-table-column prop="insertedAt" label="创建时间" />
            <el-table-column label="文件包">
              <template slot-scope="scope">
                <a @click="download(scope.row)"><i class="el-icon-download" />下载</a>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <a @click="getProgramVersionLogs(scope.row)">
                  <i class="el-icon-view" />查看记录
                </a>
                <a v-if="scope.row.status === 3">
                  <i class="el-icon-delete" />删除
                </a>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="程序名称" />
      <el-table-column prop="latestVersion" label="最新版本" />
      <el-table-column label="类型">
        <template slot-scope="scope">
          {{ scope.row.type === 0? '安装包':'升级包' }}
        </template>
      </el-table-column>
      <el-table-column prop="updatedAt" label="更新时间" />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <a @click="addProgramVersion(scope.row)">
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
    <!--新增或修改窗口-->
    <el-drawer
      :title="drawTitle"
      :before-close="cancelForm"
      :visible.sync="draw"
      direction="rtl"
      size="35%"
    >
      <el-form :model="program" class="app-container" label-width="80px" label-position="left">
        <el-form-item label="程序名称">
          <el-input v-model="program.name" :disabled="programNameDisabled" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="版本号">
          <el-input v-model="program.latestVersion" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="上传程序">
          <el-upload
            class="upload-demo"
            action="http://localhost:8081/oss/upload"
            :limit="1"
            :headers="headers"
            :file-list="fileList"
            :on-success="success"
          >
            <el-button size="mini" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="program.type">
            <el-option :value="0" label="安装包" />
            <el-option :value="1" label="升级包" />
          </el-select>
        </el-form-item>
        <el-form-item label="维护人">
          <el-input v-model="program.maintainer" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input v-model="program.maintainerContact" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="程序描述">
          <el-input v-model="program.description" type="textarea" placeholder="请输入程序描述" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="program.remark" type="textarea" placeholder="请输入程序备注" />
        </el-form-item>
        <el-form-item>
          <el-button @click="cancelForm">取 消</el-button>
          <el-button type="primary" @click="saveProgram">
            保存
          </el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
    <!--查看版本详情-->
    <el-drawer
      title="查看详情"
      :visible.sync="drawDetail"
      direction="rtl"
      size="45%"
    >
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in programVersionLogs"
          :key="index"
          :timestamp="activity.insertedAt"
        >
          {{ activity.originStatus === "1"? '创建版本': activity.originStatus === "0" ? "测试成功": '' }}
        </el-timeline-item>
      </el-timeline>
    </el-drawer>
  </div>
</template>

<script>
import { add, getById, getByPage } from '@/api/program/program'
import { getToken } from '@/utils/auth'
import { addVersion, getProgramVersion } from '@/api/program/programVersion'
import { listByProgramVersionId } from '@/api/program/programVersionLog'
import { download } from '@/api/upload'

export default {
  name: 'Index',
  data() {
    return {
      page: 1,
      pageSize: 5,
      total: 0,
      headers: {
        Authorization: 'Bearer ' + getToken()
      },
      programQueryParams: { latestVersion: '', name: '', matchModel: '' },
      programs: [],
      currentExpandRow: [],
      program: { maintainer: '', maintainerContact: '' },
      draw: false,
      drawTitle: '',
      fileList: [],
      programNameDisabled: false,
      current: {},
      drawDetail: false,
      programVersionLogs: []
    }
  },
  created() {
    this.getPrograms()
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
    getProgramVersionLogs(row) {
      this.drawDetail = true
      const data = { programVersionId: row.id }
      listByProgramVersionId(data).then(res => {
        this.programVersionLogs = res.data.rows
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    expandChange(row) {
      const data = {
        page: 1,
        pageSize: 5,
        category: 1,
        programId: row.id
      }
      const rowIndex = this.currentExpandRow.indexOf(row.id)
      if (rowIndex === -1) { // 未展开，点击打开
        this.currentExpandRow.push(row.id)
      } else { // 已经展开，点击后关闭
        this.currentExpandRow.splice(rowIndex, 1)
        return
      }
      let currentIndex = 0
      this.programs.forEach((item, index) => {
        if (item.id === row.id) {
          currentIndex = index
        }
      })
      getProgramVersion(data).then(res => {
        this.$set(this.programs[currentIndex], 'versions', res.data.rows)
        this.$set(this.programs[currentIndex], 'total', res.data.total)
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    success(res) {
      this.fileList.push(res.data.row)
    },
    getAttachesIds(fileList) {
      const attaches = []
      for (let i = 0; i < fileList.length; i++) {
        attaches.push(fileList[i].id)
      }
      return attaches
    },
    saveProgram() {
      if (!this.current.id) {
        const data = { ...this.program }
        const ids = this.getAttachesIds(this.fileList)
        if (ids.length < 1) {
          this.$message.warning('程序包未上传')
          return
        }
        data.attachIds = ids
        add(data).then(res => {
          this.$notify({ title: '成功', message: res.msg, type: 'success' })
          this.cancelForm()
          this.getPrograms()
        }).catch(err => {
          this.$message.error(err.message)
        })
      } else {
        this.saveProgramVersion()
      }
    },
    saveProgramVersion() {
      const programVersion = { ...this.program }
      programVersion.programId = this.current.programId
      programVersion.version = programVersion.latestVersion
      delete programVersion.name
      delete programVersion.latestVersion
      programVersion.programName = this.current.name
      programVersion.programId = this.current.id
      const ids = this.getAttachesIds(this.fileList)
      if (ids.length < 1) {
        this.$message.warning('程序包未上传')
        return
      }
      programVersion.attachIds = ids
      addVersion(programVersion).then(res => {
        this.$notify({ title: '成功', message: res.msg, type: 'success' })
        this.current = {}
        this.cancelForm()
        this.expandChange({ id: programVersion.programId })
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    getPrograms() {
      const data = { ...this.programQueryParams }
      data.page = this.page
      data.pageSize = this.pageSize
      getByPage(data).then(res => {
        this.programs = res.data.rows
        this.total = res.data.total
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    cancelForm() {
      this.draw = false
      this.program = { name: '' }
      this.fileList = []
    },
    clearParams() {
      this.programQueryParams = {}
    },
    addProgram() {
      this.draw = true
      this.drawTitle = '新增程序'
      this.programNameDisabled = false
    },
    addProgramVersion(row) {
      this.draw = true
      this.programNameDisabled = true
      this.drawTitle = '程序升级'
      const params = { id: row.id }
      getById(params).then(res => {
        this.current = res.data.row
        this.$set(this.program, 'name', res.data.row.name)
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    pageChanged(page) {
      this.page = page
      this.getPrograms()
    },
    pageSizeChanged(pageSize) {
      this.page = 1
      this.pageSize = pageSize
      this.getPrograms()
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
</style>

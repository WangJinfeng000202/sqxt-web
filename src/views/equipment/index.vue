<template>
  <div class="app-container">
    <!--搜索输入-->
    <el-form :inline="true" :model="equipmentQueryParams">
      <el-form-item label="设备名称">
        <el-input v-model="equipmentQueryParams.name" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="设备型号">
        <el-input v-model="equipmentQueryParams.model" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="设备序列码">
        <el-input v-model="equipmentQueryParams.sn" placeholder="请输入" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getEquipments"><i class="el-icon-search" />查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="clearParams"><i class="el-icon-remove" />清空</el-button>
      </el-form-item>
      <el-button type="primary" @click="addEquipment">新增</el-button>
    </el-form>
    <!--表格信息-->
    <el-table :data="equipments" style="width: 100%;margin-bottom: 20px">
      <el-table-column type="index" label="序号" width="80" />
      <el-table-column property="name" label="设备名称" width="180px" />
      <el-table-column property="model" label="设备型号" />
      <el-table-column property="sn" label="设备序列码" />
      <el-table-column property="insertedAt" label="入库时间" />
      <el-table-column property="createUserName" label="登记人员" />
      <el-table-column label="操作" width="200px">
        <template slot-scope="scope">
          <a class="a-button" @click="equipmentDetail(scope.row)">
            <i class="el-icon-edit" />详情
          </a>
          <a v-if="!scope.row.contractNo" class="a-button" @click="handleEdit(scope.row)">
            <i class="el-icon-edit" />编辑
          </a>
          <a v-if="!scope.row.contractNo" class="a-button" @click="handleDelete(scope.row)">
            <i class="el-icon-delete" />删除
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
      size="45%"
    >
      <el-form :model="equipment" inline class="app-container" label-width="90px" label-position="left">
        <el-form-item label="设备名称">
          <el-input v-model="equipment.name" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="设备型号">
          <el-input v-model="equipment.model" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="设备序列码">
          <el-input v-model="equipment.sn" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="入库时间">
          <el-date-picker
            v-model="equipment.insertedAt"
            align="right"
            type="date"
            placeholder="选择日期"
            :picker-options="pickerOptions"
          />
        </el-form-item>
        <el-form-item label="上传照片">
          <el-upload
            action="http://localhost:8081/oss/upload"
            list-type="picture-card"
            :headers="headers"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :file-list="fileList"
            :on-success="success"
          >
            <i class="el-icon-plus" />
          </el-upload>
          <el-dialog :visible.sync="dialogVisible" append-to-body>
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
        <br>
        <el-form-item>
          <el-button @click="cancelForm">取 消</el-button>
          <el-button type="primary" @click="saveEquipment">保存</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>

<script>
import { add, getById, getByPage, modify, removeById } from '@/api/equipment/equipment'
import { getToken } from '@/utils/auth'
import { deleteById } from '@/api/upload'

export default {
  name: 'Index',
  data() {
    return {
      page: 1,
      pageSize: 10,
      total: 0,
      equipmentQueryParams: { sn: '', name: '', model: '' },
      equipments: [],
      equipment: { insertedAt: '' },
      draw: false,
      drawTitle: '新增设备',
      activeName: 'first',
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      fileList: [],
      headers: {
        Authorization: 'Bearer ' + getToken()
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      }
    }
  },
  created() {
    this.getEquipments()
  },
  methods: {
    handleRemove(file) {
      const params = { id: file.id }
      deleteById(params).then(res => {
        this.$notify({ title: '成功', message: res.msg, type: 'success' })
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    success(res, file, fileList) {
      this.fileList.push(res.data.row)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    equipmentDetail(row) {
      this.$router.push({
        name: 'Detail',
        params: { equipment: row }
      })
    },
    handleEdit(row) {
      this.draw = true
      this.drawTitle = '编辑设备'
      const params = {}
      params.id = row.id
      getById(params).then(res => {
        this.equipment = res.data.row
        this.fileList = this.equipment.attaches
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除该设备, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.removeEquipmentById(row)
      }).catch(() => {
      })
    },
    removeEquipmentById(row) {
      const params = {}
      params.id = row.id
      removeById(params).then(res => {
        this.$notify({ title: '成功', message: res.msg, type: 'success' })
        this.getEquipments()
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    saveEquipment() {
      if (!this.equipment.id) {
        const data = { ...this.equipment }
        data.attachIds = this.getAttachesIds(this.fileList)
        add(data).then(res => {
          this.$notify({ title: '成功', message: res.msg, type: 'success' })
          this.cancelForm()
          this.getEquipments()
        }).catch(err => {
          this.$message.error(err.message)
        })
      } else {
        const data = { ...this.equipment }
        data.attachIds = this.getAttachesIds(this.fileList)
        modify(data).then(res => {
          this.$notify({ title: '成功', message: res.msg, type: 'success' })
          this.cancelForm()
          this.getEquipments()
        }).catch(err => {
          this.$message.error(err.message)
        })
      }
    },
    getAttachesIds(fileList) {
      const attaches = []
      for (let i = 0; i < fileList.length; i++) {
        attaches.push(fileList[i].id)
      }
      return attaches
    },
    getEquipments() {
      const data = { ...this.equipmentQueryParams }
      data.page = this.page
      data.pageSize = this.pageSize
      getByPage(data).then(res => {
        this.equipments = res.data.rows
        this.total = res.data.total
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    cancelForm() {
      this.draw = false
      this.equipment = {}
      this.fileList = []
    },
    clearParams() {
      this.equipmentQueryParams = {}
    },
    addEquipment() {
      this.draw = true
      this.drawTitle = '新增设备'
      this.equipment.insertedAt = new Date()
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

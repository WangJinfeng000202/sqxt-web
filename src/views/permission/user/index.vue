<template>
  <div class="app-container">
    <!--搜索输入-->
    <el-form :inline="true" :model="userQueryParams">
      <el-form-item label="用户名">
        <el-input v-model="userQueryParams.username" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="userQueryParams.name" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="角色">
        <el-select v-model="userQueryParams.roleId" placeholder="请选择">
          <el-option v-for="(item, index) in roles" :key="index" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="userQueryParams.status" placeholder="请选择">
          <el-option label="启用" value="1" />
          <el-option label="禁用" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getAllUsers"><i class="el-icon-search" />查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="clearParams"><i class="el-icon-remove" />清空</el-button>
      </el-form-item>
      <el-button type="primary" @click="addUser">新增</el-button>
    </el-form>
    <!--表格信息-->
    <el-table :data="users" style="width: 100%;margin-bottom: 20px" border>
      <el-table-column type="index" label="序号" width="80" />
      <el-table-column property="username" label="用户名" />
      <el-table-column property="name" label="姓名" />
      <el-table-column property="contactTel" label="联系电话" width="150px" />
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="1"
            :inactive-value="0"
            @change="changeStatus($event, scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="角色" width="250px">
        <template slot-scope="scope">
          <el-tag v-for="(item,index) in scope.row.roles" :key="index" size="mini" effect="plain"> {{ item.name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column property="insertedAt" label="创建日期" width="180px" />
      <el-table-column label="操作" width="280px">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleDoAssign(scope.row)">
            <i class="el-icon-edit" />分配角色
          </el-button>
          <el-button size="mini" type="info" @click="handleEdit(scope.row)">
            <i class="el-icon-edit" />编辑
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">
            <i class="el-icon-delete" />删除
          </el-button>
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
      <el-form :model="user" class="app-container" label-width="80px" label-position="left">
        <el-form-item label="用户名">
          <el-input v-model="user.username" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="user.name" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="user.contactTel" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="user.status" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item>
          <el-button @click="cancelForm">取 消</el-button>
          <el-button type="primary" @click="saveUser">
            保存
          </el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
    <!--角色分配弹窗 -->
    <el-dialog :title="dialogTitle" width="30%" :visible.sync="dialogFormVisible">
      <el-form :model="assign">
        <el-form-item label="角色">
          <el-select v-model="assign.roleIds" multiple>
            <el-option v-for="(item, index) in roles" :key="index" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAssign">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import { getUserByPage, changeUserStatus, getById, add, modify, removeById, doAssign, toAssign } from '@/api/permission/user'
import { getAllSimpleRoles } from '@/api/permission/role'

export default {
  data() {
    return {
      userQueryParams: { roleId: '', contactTel: '' },
      users: [],
      roles: [],
      total: 0,
      user: { status: 1 },
      page: 1,
      pageSize: 10,
      draw: false,
      assign: { roleIds: [] },
      drawTitle: '新增用户',
      dialogFormVisible: false,
      dialogTitle: '分配角色'
    }
  },
  created() {
    this.getAllUsers()
    this.getAllRoles()
  },
  methods: {
    submitAssign() {
      doAssign(this.assign).then(res => {
        this.$notify({ title: '成功', message: res.msg, type: 'success' })
        this.dialogFormVisible = false
        this.getAllUsers()
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    handleDoAssign(row) {
      const params = { userId: row.id }
      toAssign(params).then(res => {
        this.assign.roleIds = res.data.rows
      }).catch(err => {
        this.$message.error(err.message)
      })
      this.assign.id = row.id
      this.dialogTitle = '为用户' + row.name + '分配角色'
      this.dialogFormVisible = true
    },
    getAllRoles() {
      getAllSimpleRoles().then(res => {
        this.roles = res.data.rows
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    pageChanged(page) {
      this.page = page
      this.getAllUsers()
    },
    pageSizeChanged(pageSize) {
      this.page = 1
      this.pageSize = pageSize
      this.getAllUsers()
    },
    clearParams() {
      this.userQueryParams = {}
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.removeUserById(row)
      }).catch(() => {})
    },
    removeUserById(row) {
      const params = {}
      params.id = row.id
      removeById(params).then(res => {
        this.$notify({ title: '成功', message: res.msg, type: 'success' })
        this.getAllUsers()
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    saveUser() {
      if (!this.user.id) {
        add(this.user).then(res => {
          this.$notify({ title: '成功', message: res.msg, type: 'success' })
          this.getAllUsers()
          this.cancelForm()
        }).catch(err => {
          this.$message.error(err.message)
        })
      } else {
        modify(this.user).then(res => {
          this.$notify({ title: '成功', message: res.msg, type: 'success' })
          this.getAllUsers()
          this.cancelForm()
        }).catch(err => {
          this.$message.error(err.message)
        })
      }
    },
    handleEdit(row) {
      this.draw = true
      this.drawTitle = '编辑用户'
      const params = {}
      params.id = row.id
      getById(params).then(res => {
        this.user = res.data.row
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    addUser() {
      this.draw = true
      this.drawTitle = '新增用户'
    },
    cancelForm() {
      this.draw = false
      this.user = {}
    },
    changeStatus($event, user) {
      const params = {}
      params.userId = user.id
      params.status = $event
      changeUserStatus(params)
        .then(res => {
          this.$notify({ title: '成功', message: res.msg, type: 'success' })
          this.getAllUsers()
        }).catch(err => {
          this.$message.error(err.message)
        })
    },
    getAllUsers() {
      const params = { ...this.userQueryParams }
      params.page = this.page
      params.pageSize = this.pageSize
      getUserByPage(params)
        .then(res => {
          this.users = res.data.rows
          this.total = res.data.total
        }).catch(err => {
          this.$message.error(err.message)
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

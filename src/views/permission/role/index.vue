<template>
  <div class="app-container">
    <el-form :inline="true" :model="roleQueryParams">
      <el-form-item label="角色名称">
        <el-input v-model="roleQueryParams.name" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="角色编码">
        <el-input v-model="roleQueryParams.code" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="roleQueryParams.status" placeholder="请选择">
          <el-option label="启用" value="1" />
          <el-option label="禁用" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getAllRoles"><i class="el-icon-search" />查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="clearParams"><i class="el-icon-remove" />清空</el-button>
      </el-form-item>
      <el-button type="primary" @click="addRole">新增</el-button>
    </el-form>
    <el-table :data="roles" style="width: 100%;margin-bottom: 20px" border>
      <el-table-column type="index" label="序号" width="80" />
      <el-table-column property="name" label="角色名称" />
      <el-table-column property="code" label="角色编码" />
      <el-table-column property="remark" label="备注" />
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
      <el-table-column property="insertedAt" label="创建日期" />
      <el-table-column label="操作" width="280px">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="getAllMenusByRoleId(scope.row)">
            <i class="el-icon-edit" />分配权限
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
    <el-drawer
      :title="drawTitle"
      :before-close="cancelForm"
      :visible.sync="draw"
      direction="rtl"
      size="35%"
    >
      <el-form :model="role" class="app-container" label-width="80px" label-position="left">
        <el-form-item label="角色名称">
          <el-input v-model="role.name" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="角色编码">
          <el-input v-model="role.code" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="role.remark" type="textarea" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="role.status" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item>
          <el-button @click="cancelForm">取 消</el-button>
          <el-button type="primary" @click="saveRole">
            保存
          </el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
    <el-dialog :title="dialogTitle" width="40%" :visible.sync="dialogFormVisible" :before-close="closeTree">
      <el-checkbox checked @change="setAllExpand($event)">展开/折叠</el-checkbox>
      <el-checkbox @change="allSelect($event)">全选/全不选</el-checkbox>
      <el-checkbox v-model="strictly" @change="cascade($event)">父子联动</el-checkbox>
      <el-tree
        ref="tree"
        :data="permissions"
        show-checkbox
        default-expand-all
        :default-checked-keys="permissionSelected"
        node-key="id"
        highlight-current
        :props="defaultProps"
        :check-strictly="strictly===false"
      />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="getCheckedKeys"> 提 交 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getRolesPage, getById, changeUserStatus, add, modify, removeById } from '@/api/permission/role'
import { getAllMenusByRoleId, insertBatch } from '@/api/permission/menu'

export default {
  name: 'Index',
  data() {
    return {
      roleQueryParams: {},
      roles: [],
      permissions: [],
      permissionSelected: [],
      role: { remark: '', status: 1 },
      drawTitle: '',
      draw: false,
      page: 1,
      pageSize: 10,
      total: 0,
      strictly: true,
      dialogFormVisible: false,
      dialogTitle: '分配权限',
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      roleId: -1
    }
  },
  created() {
    this.getAllRoles()
  },
  methods: {
    cascade($event) {
      this.strictly = $event
    },
    // 设置全部展开和折叠。state参数为bool值
    setAllExpand(state) {
      const nodes = this.$refs.tree.store.nodesMap
      for (const i in nodes) {
        nodes[i].expanded = state
      }
    },
    allSelect($event) {
      if ($event) {
        this.$refs.tree.setCheckedNodes(this.permissions)
      } else {
        this.$refs.tree.setCheckedNodes([])
      }
    },
    getAllMenusByRoleId(row) {
      this.dialogFormVisible = true
      this.dialogTitle = '为角色' + row.name + '分配权限'
      const params = { roleId: row.id }
      this.roleId = row.id
      getAllMenusByRoleId(params).then(res => {
        this.permissions = res.data.rows
        this.getChecked(this.permissions)
      }).catch(err => {
        this.$notify({ title: '错误', message: err.message, type: 'error' })
      })
    },
    // 递归获取选中的节点
    getChecked(permissions) {
      for (let i = 0; i < permissions.length; i++) {
        if (permissions[i].selected) {
          this.permissionSelected.push(permissions[i].id)
        }
        permissions[i].disabled = permissions[i].status === 0
        if (permissions[i].children) {
          this.getChecked(permissions[i].children)
        }
      }
    },
    getCheckedKeys() {
      const assign = {}
      assign.permissionIds = this.$refs.tree.getCheckedKeys()
      assign.id = this.roleId
      insertBatch(assign).then(res => {
        this.$notify({ title: '成功', message: res.msg, type: 'success' })
        this.closeTree()
      }).catch(err => {
        this.$notify({ title: '错误', message: err.message, type: 'error' })
      })
    },
    closeTree() {
      this.dialogFormVisible = false
      this.permissionSelected = []
    },
    pageChanged(page) {
      this.page = page
      this.getAllRoles()
    },
    pageSizeChanged(pageSize) {
      this.page = 1
      this.pageSize = pageSize
      this.getAllRoles()
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
        this.$notify({ title: '错误', message: err.message, type: 'error' })
      })
    },
    handleEdit(row) {
      this.draw = true
      this.drawTitle = '编辑角色'
      const params = { id: row.id }
      getById(params).then(res => {
        this.role = res.data.row
      }).catch(err => {
        this.$notify({ title: '错误', message: err.message, type: 'error' })
      })
    },
    addRole() {
      this.draw = true
      this.drawTitle = '新增角色'
    },
    changeStatus($event, row) {
      const params = {}
      params.id = row.id
      params.status = $event
      changeUserStatus(params)
        .then(res => {
          this.$notify({ title: '成功', message: res.msg, type: 'success' })
          this.getAllRoles()
        }).catch(err => {
          this.$notify({ title: '错误', message: err.message, type: 'error' })
        })
    },
    cancelForm() {
      this.role = { status: 1 }
      this.draw = false
    },
    saveRole() {
      if (!this.role.id) {
        add(this.role).then(res => {
          this.$notify({ title: '成功', message: res.msg, type: 'success' })
          this.getAllRoles()
          this.cancelForm()
        }).catch(err => {
          this.$notify({ title: '错误', message: err.message, type: 'error' })
        })
      } else {
        modify(this.role).then(res => {
          this.$notify({ title: '成功', message: res.msg, type: 'success' })
          this.getAllRoles()
          this.cancelForm()
        }).catch(err => {
          this.$notify({ title: '错误', message: err.message, type: 'error' })
        })
      }
    },
    getAllRoles() {
      this.roleQueryParams.page = this.page
      this.roleQueryParams.pageSize = this.pageSize
      getRolesPage(this.roleQueryParams).then(res => {
        this.roles = res.data.rows
        this.total = res.data.total
      }).catch(err => {
        this.$notify({ title: '错误', message: err.message, type: 'error' })
      })
    },
    clearParams() {
      this.roleQueryParams = {}
    }
  }
}
</script>

<style lang="scss" >
:focus {
  outline: 0;
}
</style>

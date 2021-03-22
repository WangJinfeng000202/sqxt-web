<template>
  <div class="app-container">
    <el-table
      :data="menus"
      style="width: 100%;margin-bottom: 20px;margin-top: 20px"
      row-key="id"
      border
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="id" label="id" sortable width="120px" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="value" label="值" width="150px" />
      <el-table-column label="类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type===1" type="primary" effect="plain">菜单</el-tag>
          <el-tag v-else-if="scope.row.type===2" type="info" effect="plain">按钮</el-tag>
          <el-tag v-else type="primary" effect="plain">root</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="path" label="路径" />
      <el-table-column prop="component" label="组件" />
      <el-table-column prop="uri" label="接口" width="150px" />
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="1"
            :inactive-value="0"
            @change="changeStatus($event,scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="insertedAt" label="创建时间" width="160px" />
      <el-table-column label="操作" width="250px">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="addSubMenu(scope.row)">
            <i class="el-icon-document-add" />新增
          </el-button>
          <el-button size="mini" type="info" @click="modifyMenu(scope.row)">
            <i class="el-icon-edit" />编辑
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">
            <i class="el-icon-delete" />删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-drawer
      :title="drawTitle"
      :before-close="cancelForm"
      :visible.sync="draw"
      direction="rtl"
      size="35%"
    >
      <el-form :model="menu" class="app-container" label-width="80px" label-position="left">
        <el-form-item label="名称">
          <el-input v-model="menu.name" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="值">
          <el-input v-model="menu.value" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="menu.type" placeholder="请选择">
            <el-option label="root" :value="0" />
            <el-option label="菜单" :value="1" />
            <el-option label="按钮" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="menu.status" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item label="路径">
          <el-input v-model="menu.path" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="组件">
          <el-input v-model="menu.component" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="接口">
          <el-input v-model="menu.uri" placeholder="请输入" />
        </el-form-item>
        <el-form-item>
          <el-button @click="cancelForm">取 消</el-button>
          <el-button type="primary" @click="saveMenu">
            保存
          </el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>

<script>

import { add, getAllMenus, getById, modify, removeBatch, changeStatus } from '@/api/permission/menu'

export default {
  name: 'Index',
  data() {
    return {
      menus: [],
      menu: { status: 1 },
      draw: false,
      drawTitle: '新增菜单'
    }
  },
  created() {
    this.getAllMenus()
  },
  methods: {
    getAllMenus() {
      getAllMenus().then(res => {
        this.menus = res.data.rows
      }).catch(err => {
        this.$notify({ title: '错误', message: err.message, type: 'error' })
      })
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除该菜单以及所有子菜单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.removeMenuById(row)
      }).catch(() => {})
    },
    removeMenuById(row) {
      const params = {}
      params.id = row.id
      removeBatch(params).then(res => {
        this.$notify({ title: '成功', message: res.msg, type: 'success' })
        this.getAllMenus()
      }).catch(err => {
        this.$notify({ title: '错误', message: err.message, type: 'error' })
      })
    },
    addSubMenu(row) {
      this.menu.pid = row.id
      this.draw = true
      this.drawTitle = '新增菜单'
    },
    modifyMenu(row) {
      this.draw = true
      this.drawTitle = '编辑菜单'
      const params = { id: row.id }
      this.menu = getById(params).then(res => {
        this.menu = res.data.row
      }).catch(err => {
        this.$notify({ title: '错误', message: err.message, type: 'error' })
      })
    },
    saveMenu() {
      console.log(this.menu)
      if (!this.menu.id) {
        add(this.menu).then(res => {
          this.$notify({ title: '成功', message: res.msg, type: 'success' })
          this.getAllMenus()
          this.cancelForm()
        }).catch(err => {
          this.$notify({ title: '错误', message: err.message, type: 'error' })
        })
      } else {
        modify(this.menu).then(res => {
          this.$notify({ title: '成功', message: res.msg, type: 'success' })
          this.getAllMenus()
          this.cancelForm()
        }).catch(err => {
          this.$notify({ title: '错误', message: err.message, type: 'error' })
        })
      }
    },
    changeStatus($event, permission) {
      const params = {}
      params.id = permission.id
      params.status = $event
      changeStatus(params)
        .then(res => {
          this.$notify({ title: '成功', message: res.msg, type: 'success' })
          this.getAllMenus()
        }).catch(err => {
          this.$notify({ title: '错误', message: err.message, type: 'error' })
        })
    },
    cancelForm() {
      this.draw = false
      this.menu = { status: 1 }
    }
  }
}
</script>

<style lang="scss">
:focus {
  outline: 0;
}
</style>

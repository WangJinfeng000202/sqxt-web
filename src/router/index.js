import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '控制台', icon: 'dashboard' }
    }]
  },

  {
    path: '/project',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Project',
        component: () => import('@/views/project/index'),
        meta: { title: '项目信息管理', icon: 'form' }
      }
    ]
  },
  {
    path: '/equipment',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Equipment',
        component: () => import('@/views/equipment/index'),
        meta: { title: '设备信息管理', icon: 'form' }
      },
      {
        path: 'detail',
        name: 'Detail',
        hidden: true,
        component: () => import('@/views/equipment/detail/index'),
        meta: { title: '设备详情', icon: 'form' }
      }
    ]
  },
  {
    path: '/algorithm',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Algorithm',
        component: () => import('@/views/algorithm/index'),
        meta: { title: '算法信息管理', icon: 'form' }
      }
    ]
  },
  {
    path: '/program',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Program',
        component: () => import('@/views/program/index'),
        meta: { title: '程序信息管理', icon: 'form' }
      }
    ]
  },
  {
    path: '/test',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Test',
        component: () => import('@/views/testTask/index'),
        meta: { title: '测试任务', icon: 'form' }
      },
      {
        path: 'upgrade',
        name: 'Upgrade',
        hidden: true,
        component: () => import('@/views/testTask/upgrade/index'),
        meta: { title: '设备升级', icon: 'form' }
      }
    ]
  },
  {
    path: '/license',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'License',
        component: () => import('@/views/license/index'),
        meta: { title: '发放许可授权', icon: 'form' }
      },
      {
        path: 'add',
        name: 'LicenseAdd',
        hidden: true,
        component: () => import('@/views/license/add/index'),
        meta: { title: '新增许可授权' }
      }
    ]
  },
  {
    path: '/log',
    component: Layout,
    redirect: '/log/hardware',
    name: 'Log',
    meta: { title: '日志管理', icon: 'form' },
    children: [
      {
        path: 'hardwareLog',
        name: 'HardwareLog',
        component: () => import('@/views/log/hardware/index'),
        meta: { title: '硬件升级记录表', icon: 'form' }
      },
      {
        path: 'licenseLog',
        name: 'LicenseLog',
        component: () => import('@/views/log/license/index'),
        meta: { title: '授权变更记录表', icon: 'form' }
      },
      {
        path: 'equipmentLog',
        name: 'EquipmentLog',
        component: () => import('@/views/log/equipment/index'),
        meta: { title: '设备连接记录表', icon: 'form' }
      }
    ]
  },
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/user',
    name: 'Permission',
    meta: { title: '权限管理', icon: 'form' },
    children: [
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/permission/user/index'),
        meta: { title: '用户管理', icon: 'form' }
      }, {
        path: 'role',
        name: 'Role',
        component: () => import('@/views/permission/role/index'),
        meta: { title: '角色管理', icon: 'form' }
      }, {
        path: 'menu',
        name: 'Menu',
        component: () => import('@/views/permission/menu/index'),
        meta: { title: '菜单管理', icon: 'form' }
      }
    ]
  },
  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
        meta: { title: 'External Link', icon: 'link' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router

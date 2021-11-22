import Vue from 'vue'
import Router from 'vue-router'
// in development env not use Lazy Loading,because Lazy Loading too many pages will cause webpack hot update too slow.so only in production use Lazy Loading
/* layout */
import Layout from '../views/layout/Layout'
import Cookies from 'js-cookie'

const _import = require('./_import_' + process.env.NODE_ENV)
Vue.use(Router)
export const constantRouterMap = [

  { path: '/login', component: _import('login/index'), hidden: true },
  { path: '/404', component: _import('404'), hidden: true },
  {
    path: '',
    component: Layout,
    redirect: '/dashboard',
    name: '首页',
    // hidden: true,
    meta: { title: '首页块', icon: 'tree' },
    children: [{
      path: '',
      name: '仪表盘',
      component: _import('dashboard/index'),
      meta: { title: '海智项目管理系统', icon: 'crm' },
      menu: 'dashboard'
    }]
  },
  // {
  //   path: '/members',
  //   component: Layout,
  //   redirect: '/members/',
  //   name: '学会会员',
  //   meta: { title: '学会会员', icon: 'tree' },
  //   children: [
  //     {
  //       path: '',
  //       name: '学会会员模块',
  //       component: _import('members/member'),
  //       meta: { title: '学会会员模块', icon: 'record' },
  //       menu: 'members'
  //     },
      
  //   ]
  // },
  // {
  //   path: '/authority',
  //   component: Layout,
  //   redirect: '/authority/',
  //   name: '权限管理',
  //   meta: { title: '权限管理', icon: 'table' },
  //   children: [
      
  //     {
  //       path: '',
  //       name: '权限管理模块',
  //       component: _import('authority/role'),
  //       meta: { title: '权限管理模块', icon: 'table' },
  //       menu: 'authority'
  //     },
  //   ]
  // },
  // {
  //   path: '/worker',
  //   component: Layout,
  //   redirect: '/worker/',
  //   name: '工作人员',
  //   meta: { title: '工作人员', icon: 'table' },
  //   children: [
      
  //     {
  //       path: '',
  //       name: '工作人员模块',
  //       component: _import('worker/workerman'),
  //       meta: { title: '工作人员模块', icon: 'table' },
  //       menu: 'worker'
  //     },
  //   ]
  // },
  // {
  //   path: '/declargov',
  //   component: Layout,
  //   redirect: '/declargov/',
  //   name: '政府机构',
  //   meta: { title: '政府机构', icon: 'tree' },
  //   children: [
  //     {
  //       path: '',
  //       name: '申报政府模块',
  //       component: _import('declargov/index'),
  //       meta: { title: '申报政府模块', icon: 'record' },
  //       menu: 'declargov'
  //     },
      
  //   ]
  // },
  // {
  //   path: '/policyman',
  //   component: Layout,
  //   redirect: '/policyman/',
  //   name: '政策管理',
  //   meta: { title: '政策管理', icon: 'tree' },
  //   children: [
  //     {
  //       path: '',
  //       name: '政策管理模块',
  //       component: _import('policyman/index'),
  //       meta: { title: '政策管理模块', icon: 'record' },
  //       menu: 'policyman'
  //     },
      
  //   ]
  // },
  // {
  //   path: '/projectman',
  //   component: Layout,
  //   redirect: '/projectman/proposer',
  //   name: '项目管理模块',
  //   meta: { title: '项目管理模块', icon: 'tree' },
  //   children: [
  //     {
  //       path: 'proposer',
  //       name: '申请人信息',
  //       component: _import('projectman/proposer'),
  //       meta: { title: '申请人信息', icon: 'record' },
  //       menu: 'projectman'
  //     },
  //     {
  //       path: 'pinstorage',
  //       name: '入库项目',
  //       component: _import('projectman/pinstorage'),
  //       meta: { title: '入库项目', icon: 'record' },
  //       menu: 'projectman'
  //     },
  //     {
  //       path: 'declare',
  //       name: '申报项目',
  //       component: _import('projectman/declare'),
  //       meta: { title: '申报项目', icon: 'record' },
  //       menu: 'projectman'
  //     },

  //   ]
  // },
  // {
  //   path: '/academician',
  //   component: Layout,
  //   redirect: '/academician/',
  //   name: '两院院士',
  //   meta: { title: '两院院士', icon: 'tree' },
  //   children: [
  //     {
  //       path: '',
  //       name: '两院院士模块',
  //       component: _import('academician/acade'),
  //       meta: { title: '两院院士模块', icon: 'record' },
  //       menu: 'academician'
  //     },
      
  //   ]
  // },
  // {
  //   path: '/overseas',
  //   component: Layout,
  //   redirect: '/overseas/',
  //   name: '驻外合作机构',
  //   meta: { title: '驻外合作机构', icon: 'tree' },
  //   children: [
  //     {
  //       path: '',
  //       name: '驻外合作机构模块',
  //       component: _import('overseas/oversea'),
  //       meta: { title: '驻外合作机构模块', icon: 'record' },
  //       menu: 'overseas'
  //     },
      
  //   ]
  // },
  // { path: '*', redirect: '/404', hidden: true }
]
export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
export const asyncRouterMap = [
  {
    path: '/authority',
    component: Layout,
    redirect: '/authority/',
    name: '权限管理',
    meta: { title: '权限管理', icon: 'table' },
    children: [
      
      {
        path: '',
        name: '权限管理模块',
        component: _import('authority/role'),
        meta: { title: '权限管理模块', icon: 'table' },
        menu: 'role'
      },
    ]
  },
  {
    path: '/worker',
    component: Layout,
    redirect: '/worker/',
    name: '工作人员',
    meta: { title: '工作人员', icon: 'table' },
    children: [
      
      {
        path: '',
        name: '工作人员模块',
        component: _import('worker/workerman'),
        meta: { title: '工作人员模块', icon: 'table' },
        menu: 'user'
      },
    ]
  },
  {
    path: '/declargov',
    component: Layout,
    redirect: '/declargov/',
    name: '政府机构',
    meta: { title: '政府机构', icon: 'tree' },
    children: [
      {
        path: '',
        name: '申报政府模块',
        component: _import('declargov/index'),
        meta: { title: '申报政府模块', icon: 'record' },
        menu: 'govment'
      },
      
    ]
  },
  {
    path: '/policyman',
    component: Layout,
    redirect: '/policyman/',
    name: '政策管理',
    meta: { title: '政策管理', icon: 'tree' },
    children: [
      {
        path: '',
        name: '政策管理模块',
        component: _import('policyman/index'),
        meta: { title: '政策管理模块', icon: 'record' },
        menu: 'policy'
      },
      
    ]
  },
  {
    path: '/projectman',
    component: Layout,
    redirect: '/projectman/proposer',
    name: '项目管理模块',
    meta: { title: '项目管理模块', icon: 'tree' },
    children: [
      {
        path: 'proposer',
        name: '申请人信息',
        component: _import('projectman/proposer'),
        meta: { title: '申请人信息', icon: 'record' },
        menu: 'proposer'
      },
      {
        path: 'pinstorage',
        name: '入库项目',
        component: _import('projectman/pinstorage'),
        meta: { title: '入库项目', icon: 'record' },
        menu: 'inboundProject'
      },
      {
        path: 'declare',
        name: '申报项目',
        component: _import('projectman/declare'),
        meta: { title: '申报项目', icon: 'record' },
        menu: 'declareProject'
      },

    ]
  },
  {
    path: '/academician',
    component: Layout,
    redirect: '/academician/',
    name: '两院院士',
    meta: { title: '两院院士', icon: 'tree' },
    children: [
      {
        path: '',
        name: '两院院士模块',
        component: _import('academician/acade'),
        meta: { title: '两院院士模块', icon: 'record' },
        menu: 'academician'
      },
      
    ]
  },

  {
    path: '/overseas',
    component: Layout,
    redirect: '/overseas/',
    name: '驻外合作机构',
    meta: { title: '驻外合作机构', icon: 'tree' },
    children: [
      {
        path: '',
        name: '驻外合作机构模块',
        component: _import('overseas/oversea'),
        meta: { title: '驻外合作机构模块', icon: 'record' },
        menu: 'cooperation'
      },
      
    ]
  },
  {
    path: '/members',
    component: Layout,
    redirect: '/members/',
    name: '学会会员',
    meta: { title: '学会会员', icon: 'tree' },
    children: [
      {
        path: '',
        name: '学会会员模块',
        component: _import('members/member'),
        meta: { title: '学会会员模块', icon: 'record' },
        menu: 'members'
      },
      
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

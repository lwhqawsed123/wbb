import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import myIndex from '../views/tool/gen/basicInfoForm.vue'

// import employe from '@/views/employer/index.vue'

/* Layout */
import Layout from '@/layout'

/**
 * Note: 路由配置项
 *
 * hidden: true                   // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true               // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect           // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'             // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * meta : {
    roles: ['admin','editor']    // 设置该路由进入的权限，支持多个权限叠加
    title: 'title'               // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'             // 设置该路由的图标，对应路径src/icons/svg
    breadcrumb: false            // 如果设置为false，则不会在breadcrumb面包屑中显示
  }
 */

// 公共路由
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login'),
    hidden: true
  },
  {
    path: '/register',
    component: () => import('@/views/register'),
    hidden: true
  },
  {
    path: '/forget',
    component: () => import('@/views/forget'),
    hidden: true
  },
  {
    path: '/moveRegister',
    component: () => import('@/views/moveRegister'),
    hidden: true
  },
  {
    path: '/promptSuccess',
    component: () => import('@/views/promptSuccess'),
    hidden: true
  },
  {
    path: '/lawyerLetter',
    component: () => import('@/views/lawyerLetter'),
    hidden: true
  },
  {
    path: '/voucher',
    component: () => import('@/views/voucher'),
    hidden: true
  },
  {
    path: '/voucher2',
    component: () => import('@/views/voucher2'),
    hidden: true
  },
  {
    path: '/voucher3',
    component: () => import('@/views/voucher3'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/index'),
        name: '首页',
        meta: { title: '首页', icon: 'dashboard', noCache: true, affix: true },
      },
      {
        path: '/declare',
        component: () => import('@/views/prop/information/compinfo/index'),
        hidden: true,
      },
    ]
  },
  {
    path: '/user',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'profile',
        component: () => import('@/views/system/user/profile/index'),
        name: 'Profile',
        meta: { title: '个人中心', icon: 'user' }
      },
      // {
      //   path:'/family',
      //   name: 'family',
      //   component:() => import('@/views/exhibition/family'),
      //   meta: { title: '家财险介绍' }
      // },
    ]
  },
  {
    path: '/exhibition',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/family',
        name: 'family',
        component: () => import('@/views/exhibition/family'),
        meta: { title: '家财险介绍' }
      },
      {
        path: '/employer',
        name: 'employer',
        component: () => import('@/views/exhibition/employer'),
        meta: { title: '雇主责任险介绍' }
      },
      {
        path: '/Property',
        name: 'Property',
        component: () => import('@/views/exhibition/Property'),
        meta: { title: '物业险介绍' }
      },
      {
        path: '/flexible',
        name: 'flexible',
        component: () => import('@/views/exhibition/flexible'),
        meta: { title: '灵活用工介绍' }
      },
      {
        path: '/mutual',
        name: 'mutual',
        component: () => import('@/views/exhibition/mutual'),
        meta: { title: '伤亡互助' }
      },
      {
        path: '/cooperation',
        name: 'cooperation',
        // alwaysShow: false,
        hidden: true,
        component: () => import('@/views/platform/insurance/cooperation/index'),
        meta: { title: '合作产品',breadcrumb: false }
      },
      {
        path: '/details',
        name: 'details',
        component: () => import('@/views/platform/property/list/details/index'),
        meta: { title: '公司详情',breadcrumb: false }
      },
      {
        path: '/invoice',
        name: 'invoice',
        component: () => import('@/views/platform/property/list/invoice/index'),
        meta: { title: '发票抬头详情',breadcrumb: false }
      },
      // {
      //   path: '/replaceList',
      //   name: 'replaceList',
      //   component: () => import('@/views/prop/employer/record/list/index'),
      //   meta: { title: '替换记录',breadcrumb: false },
      // },
    ]
  },
  {
    path: '/Other',
    name: 'Other',
    component: Layout,
    hidden: true,
    children: [
      {
        // 公司信息修改
        path: '/InformationModification',
        hidden: true,
        component: () => import('@/views/Other/InformationModification'),
      },
    ]
  },
  {
    path: '/dict',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'type/data/:dictId(\\d+)',
        component: () => import('@/views/system/dict/data'),
        name: 'Data',
        meta: { title: '字典数据', icon: '' }
      }
    ]
  },
  // {
  //   path: '/system',
  //   component: Layout,
  //   hidden: true,
  //   children: [
  //     {
  //       path: '/pmenu',
  //       name:'pmenu',
  //       component: () => import('@/views/system/pmenu/index'),
  //       meta: { title: '物业管理菜单', icon: '' }
  //     }
  //   ]
  // },
  {
    path: '/gen',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'edit',
        component: () => import('@/views/tool/gen/editTable'),
        name: 'GenEdit',
        meta: { title: '修改生成配置' }
      }
    ]
  },
]

export default new Router({
  mode: 'history', // 去掉url中的#
  // base: '/wbb/',
  base: '',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})
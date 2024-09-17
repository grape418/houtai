// 对外暴露配置路由(常量路由)
// 一级路由
export const constantRoute = [{
  // 登录
  path: '/login',
  component: () => import("@/views/login/index.vue"),
  name: 'login',  // 命名路由
  meta: {
    title: '登录', // 菜单标题
    hidden: true, // 代表路由标题是否在菜单中隐藏
    icon: 'Promotion'
  }
},
{
  // 登录成功以后展示
  path: '/',
  component: () => import("@/layout/index.vue"),
  name: 'layout',
  meta: {
    title: '', // 菜单标题
    hidden: false,
    icon: ''
  },
  redirect: '/home',
  // 二级路由
  children: [
    {
      path: '/home',
      component: () => import('@/views/home/index.vue'),
      meta: {
        title: '首页', // 菜单标题
        hidden: false,
        icon: 'HomeFilled'
      },
    },
    /*     {
          path: '/ceshi',
          component: () => import('@/views/home/index.vue'),
          meta:{
            title: '测试', // 菜单标题
            hidden: false,
            icon: 'Tools'
          },
        } */
  ]
},

  {
    path: '/screen',
    component: () => import("@/views/screen/index.vue"),
    name: 'Screen',
    meta: {
      hidden: false,
      title: '数据大屏',
      icon: 'Platform'
    }
  },
  {
    path: '/acl',
    component: () => import("@/layout/index.vue"),
    name: 'Acl',
    meta: {
      title: '权限管理',
      hidden: false,
      icon: 'Lock'
    },
    redirect: '/acl/user',
    children: [
      {
        path: '/acl/user',
        component: () => import("@/views/acl/User/index.vue"),
        name: 'Acl',
        meta: {
          title: '用户管理',
          hidden: false,
          icon: 'User'
        },
      },
      {
        path: '/acl/role',
        component: () => import("@/views/acl/role/index.vue"),
        name: 'Role',
        meta: {
          title: '角色管理',
          hidden: false,
          icon: 'UserFilled'
        },
      },
      {
        path: '/acl/permission',
        component: () => import("@/views/acl/Permission/index.vue"),
        name: 'Permission',
        meta: {
          title: '菜单管理',
          hidden: false,
          icon: 'Monitor'
        },
      },
    ]
  },
  {
    path: '/product',
    component: () => import('@/layout/index.vue'),
    meta: {
      title: '商品管理',
      icon: 'Goods',
      hidden: false
    },
    redirect: '/product/trademack',
    children: [
      {
        path: '/product/trademack',
        component: () => import('@/views/product/trademark/index.vue'),
        name: 'trademark',
        meta: {
          title: '品牌管理',
          icon: 'Film',
          hidden: false
        },
      },
      {
        path: '/product/attr',
        component: () => import('@/views/product/attr/index.vue'),
        name: 'attr',
        meta: {
          title: '属性管理',
          icon: 'Management',
          hidden: false
        },
      },
      {
        path: '/product/spu',
        component: () => import('@/views/product/spu/index.vue'),
        name: 'spu',
        meta: {
          title: 'spu管理',
          icon: 'Document',
          hidden: false
        },
      },
      {
        path: '/product/sku',
        component: () => import('@/views/product/sku/index.vue'),
        name: 'sku',
        meta: {
          title: 'sku管理',
          icon: 'StarFilled',
          hidden: false
        },
      },
    ]
  },
  {
    // 404
    path: '/404',
    component: () => import("@/views/404/index.vue"),
    name: '404',
    meta: {
      title: '404', // 菜单标题
      hidden: true,
      icon: "CloseBold"
    },
  },
  {
    // 登录成功以后展示
    path: '/pathMatch(.*)*',
    component: () => import("@/views/404/index.vue"),
    name: 'Any',
    meta: {
      title: '任意路由', // 菜单标题
      hidden: true,
      icon: 'Filter'
    },
  }
]
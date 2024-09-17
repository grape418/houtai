// 路由鉴权，项目当中的路由能不能被权限的设置（某一个路由什么条件下可以访问）
import router from "./router";
import nprogress from 'nprogress'
// 引入进度条样式
import 'nprogress/nprogress.css'
nprogress.configure({showSpinner: false})
// 获取用户相关的小仓库的内部token，去判断用户是否登录成功
import useUserStore from './store/modules/user'
import pinia from "./store";
import setting from "./setting";
let useStore = useUserStore(pinia)
console.log(useStore);

// 全局守卫： 项目当中任意路由切换都会触发的钩子
// 全局前置守卫
router.beforeEach(async(to: any, from: any, next: any) => {
 document.title = `${setting.title} - ${to.meta.title}`
  nprogress.start()
  // 获取token 判断用户是否登录
  let token = useStore.token
  // 获取用户的名字
  let username = useStore.username
  if (token) {
    if (to.path == '/login') {
      next({ path: '/' })
    } else {
      // 登录成功访问其余六个路由
      // 有用户信息 放行
      if(username){
        next()
      }else{
        // 如果没有用户信息 在守卫这里发请求获取用户信息
        try {
          // 获取用户信息后放行
          await useStore.userInfo()
          next()
        } catch (error) {
          // token过期 获取不到用户信息
          // 用户手动修改本地存储token
          // 过期了：退出登录——>用户相关的数据清空
          await useStore.userLogout()
          next({path:'/login',query:({redirect:to.path})})
        }
      }
    }
  } else {
    if (to.path == '/login') {
      next()
    } else {
      next({ path: '/login', query: { redirect: to.path } })
    }
  }
})

// 全局后置守卫
router.afterEach((to: any, from: any) => {
  nprogress.done()
})

// 全部路由组件 登录、404、任意路由、首页、数据大屏、权限管理（三个子路由）、商品管理（四个子路由）

// 用户未登录：可以访问login 其他不可以访问
// 用户登录成功： 不可以访问login（指向首页），其他可以访问
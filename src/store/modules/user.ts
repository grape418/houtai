// 创建用户相关的小仓库
import { defineStore } from 'pinia'
// 引入接口
import { reqLogin, reqUserInfo, reqLogout } from '@/api/user/index'
import type { loginFormData, loginResponseData,userInfoReponse } from '@/api/user/type'
// 引入数据类型
import type { UserState } from './types/type'
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from '@/utils/token'
// 引入路由（常量路由）
import { constantRoute } from '@/router/routes'
let useUserStore = defineStore('User', {
  // 存储小仓库的地方
  state: (): UserState => {
    return {
      token: GET_TOKEN(), // 用户唯一标识
      menuRoutes: constantRoute,  // 仓库存储生成菜单需要的路由
      username: '',
      avatar: ''
    }
  },
  // 异步|逻辑的地方
  actions: {
    // 处理用户登陆的方法
    async userLogin(data: loginFormData) {
      // 登录请求
      let result: loginResponseData = await reqLogin(data)
      console.log(result);
      
      if (result.code === 200) {
        // 由于pinia|vuex 存储数据其实利用的js对象
        this.token = (result.data as string)
        // 本地存储 持久化存储
        SET_TOKEN((result.data as string))
        return 'ok'
      } else {
        return Promise.reject(new Error(result.data))
      }
    },
    // 获取用户信息的方法
    async userInfo() {
      // 获取用户的信息存储到仓库之中
      let result:userInfoReponse = await reqUserInfo()
      if (result.code == 200) {
        this.username = result.data.name
        this.avatar = result.data.avatar
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
    // 退出登录方法
    async userLogout() {
      // 退出登录
      let result:any = await reqLogout()
      if(result.code == 200){
        this.token = ''
        this.username = ''
        this.avatar = ''
        REMOVE_TOKEN()
        return 'ok'
      }else{
        return Promise.reject(new Error(result.message))
      }
    }
  },
  // 计算属性
  getters: {

  }
})
// 对外暴露获取小仓库的方法
export default useUserStore
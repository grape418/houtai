// 统一管理项目用户相关的接口
import request from "@/utils/requerts";
import type { loginFormData, loginResponseData,userInfoReponse } from './type'
/* import type { loginForm, loginResponseData, userResponseData} from "./type";
// 同意管理接口
enum API {
  LOGIN_URI = '/user/login',
  USERINFO_URL = '/user/info'
}
// 对外暴露请求函数
// 登录接口方法
export const reqLogin = (data: loginForm) => request.post<any, loginResponseData>(API.LOGIN_URI, data)
// 获取用户信息接口的方法
export const reqUserInfo = () => request.post<any, userResponseData>(API.USERINFO_URL) */
// 项目用户相关的请求地址
enum API {
  LOGIN_URL = '/admin/acl/index/login',
  USERINFO_URL = '/admin/acl/index/info',
  LOGOUT_URL = '/admin/acl/index/logout'
}
// 登录接口
export const reqLogin = (data: loginFormData) => request.post<any, loginResponseData>(API.LOGIN_URL, data)
// 获取用户信息
export const reqUserInfo = () => request.get<any, userInfoReponse>(API.USERINFO_URL)
// 退出登录
export const reqLogout = () => request.post<any, any>(API.LOGOUT_URL)


/* import { dataType } from "element-plus/es/components/table-v2/src/common"
// 登录接口需要携带参数ts类型
export interface loginForm{
  username: string;
  password: string;
}

interface dataType{
  token?:string;
  message?:string
}

// 登录接口返回的数据类型
export interface loginResponseData{
  code: number;
  data: dataType;
}

interface userInfo{
  userID: number,
  avatar: string,
  username: string,
  password: string,
  desc: string,
  roles: string[],
  buttons: string[],
  routes: string[],
  token: string
}
interface user{
  checkUser: userInfo
}
// 定义服务器返回用户信息相关的数据类型
export interface userResponseData{
  code: number
  data: user
} */
// 定义用户相关的ts类型
export interface loginFormData {
  password: string
  username: string
}

// 定义全部接口返回数据都拥有的数据类型
export interface ResponseData{
  code: number
  message: string
  ok: boolean
}

// 登录接口返回的数据类型
export interface loginResponseData extends ResponseData{
  data: string
}

// 获取用户信息返回的数据类型
export interface userInfoReponse extends ResponseData{
  data: {
    routes: string[]
    bottons: string[]
    roles: string[]
    name: string
    avatar: string
  }
}
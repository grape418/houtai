// 书写品牌管理模块
import request from "@/utils/requerts";
import type { TradeMackResponseData, TradeMack } from './type'
enum API{
  
  TRADEMCK_API='/admin/product/baseTrademark/',
  // 添加品牌
  ADDTRADEMARK_URL= '/admin/product/baseTrademark/save',
  // 修改已有品牌
  UPDATETRADEMARK_URL= '/admin/product/baseTrademark/update',
  // 删除已有的品牌
  DELETE_URL= 'admin/product/baseTrademark/remove/{id}'
}
// 获取已有品牌得接口方法
// page 获取哪页
// limit 每页展示多少数据
export const reqHasTrademark = (page:number,limit:number) =>request.get<any,TradeMackResponseData>(API.TRADEMCK_API+`${page}/${limit}`)
// 添加与修改品牌的函数
export const reqAddorUpdateTrademark = (data: TradeMack) =>{
  if(data.id){
    // 修改
    return request.post<any,any>(API.UPDATETRADEMARK_URL,data)
  }else{
    // 新增
    return request.post<any,any>(API.ADDTRADEMARK_URL,data)
  }
}
export const reqDeteleTradeMark = (id:number) => request.delete<any,any>(API.DELETE_URL+`${id}`)
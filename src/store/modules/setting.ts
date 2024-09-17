// 小仓库关于layout组件相关的配置仓库、
import { defineStore } from 'pinia'

let uselayOutSettingStore = defineStore('SettingStroe',{
  state: ()=>{
    return{
      fold:false, //用于控制菜单折叠还是收起
      refsh:false, //控制刷新效果
    }
  }
})
export default uselayOutSettingStore
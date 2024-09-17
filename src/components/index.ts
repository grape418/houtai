import SvgIcon from './SvgIcon/index.vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import Category from './Category/index.vue'
const allGloablComponent:any = { SvgIcon, Category}
// console.log(allGloablComponent);

// 对外暴露一个插件对象
export default {
  install(app:any){
    // 注册项目全局组件
    Object.keys(allGloablComponent).forEach(key => {
      // 注册为全局组件
      app.component(key,allGloablComponent[key])
    })
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component)
    }
  }
}
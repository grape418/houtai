import { createApp } from 'vue'

// 引入element-plus插件和样式
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// @ts-ignore
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import App from '@/App.vue'
// svg需要的配置代码
import 'virtual:svg-icons-register'
// 引入暗黑模式
import 'element-plus/theme-chalk/dark/css-vars.css'

/* import SvgIcon from '@/components/SvgIcon/index.vue' */
// 获取实例对象
const app = createApp(App)
/* app.component('SvgIcon',SvgIcon) */
// 安装element-plus插件
// 引入自定义插件对象：注册整个项目的全局对象
import globalComponent from '@/components'
// 安装自定义插件
app.use(globalComponent)

//引入模板的全局样式
import '@/styles/index.scss'
app.use(ElementPlus, {
  locale: zhCn,   // element-plus国际化配置
})

/* // 测试代码 测试假接口能否使用
import axios from 'axios'
axios({
  url: '/api/user/login',
  method: 'post',
  data: {
    username: 'admin',
    password: '111111'
  }
}) */
import router from './router'
// 注册模板路由
import pinia from './store'
// 引入路由鉴权文件(保证至少执行一次)
import './permission'
app.use(pinia)
app.use(router)
app.mount('#app')

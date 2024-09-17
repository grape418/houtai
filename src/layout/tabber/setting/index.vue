<template>
      <el-button size="small" icon="Refresh" circle @click="updataRefresh"></el-button>
      <el-button size="small" icon="FullScreen" circle @click="fullScreen"></el-button>
      <el-popover
        placement="top-start"
        title="主题设置"
        :width="300"
        trigger="hover"
      >
      <el-form>
        <el-form-item label="主题颜色">
          <el-color-picker @change="setColor" v-model="color" size="small" show-alpha :predefine="predefineColors" />
        </el-form-item>
        <el-form-item label="深色模式">
          <el-switch
            v-model="dark"
            size="defualt"
            inline-prompt
            active-icon="MoonNight"
            inactive-icon="Sunny"
            @change="changeDark"
          />
        </el-form-item>
      </el-form>
        <template #reference>
          <el-button size="small" icon="Setting" circle></el-button>
        </template>
      </el-popover>
      <img :src="useStore.avatar" style="width: 24px; height: 24px; margin: 10px 10px; border-radius: 50%;" >
      <!-- 下拉菜单 -->
      <el-dropdown>
        <span class="el-dropdown-link">
         {{ useStore.username }}
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
</template>

<script setup lang="ts">
// 获取用户相关的小仓库
import useUserStore from '@/store/modules/user';
// 获取骨架的小仓库
import uselayOutSettingStore from '@/store/modules/setting'
import { useRouter,useRoute } from 'vue-router';
import { ref } from 'vue';
let layOutSettingStore = uselayOutSettingStore()
let useStore = useUserStore()
// 获取路由器对象
let $router = useRouter()
let $route = useRoute()
// 收集开关的数据
let dark = ref<boolean>(false)
// 刷新按钮 点击回调
const updataRefresh = () =>{
  layOutSettingStore.refsh = !layOutSettingStore.refsh
}
const fullScreen = () =>{
  let full = document.fullscreenElement
  if(!full){
    // 全屏
    document.documentElement.requestFullscreen()
  }else{
    // 退出全屏
    document.exitFullscreen()
  }
}
// 退出登录点击回调
const logout = async() => {
  // 1.需要向服务器发请求
  // 2.清空用户相关的信息【token|username|avaadar】
  await useStore.userLogout()
  // 3.跳转到登录页面
  $router.push({ path: '/login',query:{redirect:$route.path} })
}

const color = ref('rgba(255, 69, 0, 0.68)')
const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
])

const changeDark = () => {
  // 获取html根节点
  let html = document.documentElement
  // 判断html标签是否有类名dark
  dark.value ? html.className= 'dark' : html.className= ''
}

// 主体颜色
const setColor = () => {
  const html = document.documentElement
  html.style.setProperty('--el-color-primary',color.value)
}
</script>
<script lang="ts">
  export default {
    name: 'setting'
  }
</script>
<style scoped>

</style>
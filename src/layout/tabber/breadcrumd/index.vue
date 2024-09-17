<template>
      <!-- 顶部左侧 -->
      <el-icon style="margin-right: 10px;" @click="changeIcon">
        <component :is="layOutSettingStore.fold?'fold':'expand'"></component>
      </el-icon>
      <!-- 左侧面包屑 -->
      <el-breadcrumb separator-icon="ArrowRight">
        <!--面包屑动态展示路由的名字与标题 -->
        <el-breadcrumb-item v-for="(item,index) in $route.matched" :key="index" v-show="item.meta.title" :to="item.path">
          <el-icon style="margin: 0px 2px;">
            <component :is="item.meta.icon"></component>
          </el-icon>
          <span style="margin: 0px 5px;">{{ item.meta.title }}</span>
        </el-breadcrumb-item>
      </el-breadcrumb>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import {ref} from 'vue'
import uselayOutSettingStore from '@/store/modules/setting'
// 获取layout配置相关的仓库
let layOutSettingStore = uselayOutSettingStore()
// 定义一个响应式数据控制图标的切换
const changeIcon = () => {
  // 图标切换
  layOutSettingStore.fold = !layOutSettingStore.fold
}
let $route = useRoute()
</script>
<script lang="ts">
  export default {
    name: 'breadcrumb'
  }
</script>
<style scoped>

</style>
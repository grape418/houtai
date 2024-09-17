<template>
  <div class="layout_container">
    <!-- 左侧菜单 -->
    <div class="layout_slider" :class="{fold:layOutSettingStroe.fold?true:false}">
      <Logo/>
      <!-- 滚动组件 -->
      <el-scrollbar class="srcollbar">
        <el-menu background-color="#00519" text-color="white" :default-active="$route.path" :collapse="layOutSettingStroe.fold?true:false">
         <!-- 根据路由动态生成菜单 -->
        <Menu :menuList="useStore.menuRoutes"></Menu>
        </el-menu>
      </el-scrollbar>
    </div>
    <!-- 顶部导航 -->
    <div class="layout_tabber" :class="{fold:layOutSettingStroe.fold?true:false}">
      <Tabber></Tabber>
    </div>
    <!-- 内容展示 -->
    <div class="layout_main" :class="{fold:layOutSettingStroe.fold?true:false}">
      <Main></Main>
    </div>

  </div>
</template>

<script setup lang="ts">
import Logo from './logo/index.vue'
// 引入菜单组件
import  Menu  from './menu/index.vue'
// 右侧内容展示区域
import Main from './main/index.vue'
// 获取路由对象
import { useRoute } from 'vue-router';
import Tabber from './tabber/index.vue'
// 获取用户相关的小仓库
import useUserStore from '@/store/modules/user';
import uselayOutSettingStroe from '@/store/modules/setting'
let useStore = useUserStore()
// 获取路由对象
let $route = useRoute()
// 配置仓库
let layOutSettingStroe = uselayOutSettingStroe()
</script>

<script lang="ts">
  export default {
    name: 'layout'
  }
</script>

<style lang="scss" scoped>
.layout_container{
  width: 100%;
  height: 100vh;
  .layout_slider{
    width: $base-menu-width;
    height: 100vh;
    background-color: $base-menu-background ;
    transition: all 0.3s;
    .srcollbar{
      width: 100%;
      height: calc(100vh - $base-menu-logo-height);
      .el-menu{
      border-right: none;
    }
    }
    &.fold{
      width: $base-menu-min-width;
    }
  }
  .layout_tabber{
    width: calc(100% - $base-menu-width);
    height:$base-menu-height ;
    position: fixed;
    top: 0px;
    left: $base-menu-width;
    transition: all 0.3s;
    &.fold{
      width: calc(100% - $base-menu-min-width);
      left: $base-menu-min-width;
    }   

  }
  .layout_main{
    position: absolute;
    width: calc(100% - $base-menu-width);
    height: calc(100vh - $base-menu-height) ;
    left: $base-menu-width;
    top: $base-menu-height;
    padding: 20px;
    overflow: auto;
    transition: all 0.3s;
    &.fold{
      width: calc(100% - $base-menu-min-width);
      left: $base-menu-min-width;
    } 
  }
}
</style>
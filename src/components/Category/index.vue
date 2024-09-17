<template>
  <el-card>
    <el-form :inline="true">
      <el-form-item label="一级分类">
        <el-select v-model="categoryStore.c1Id" @change="handler" :disabled="scene==0? false : true ">
          <el-option v-for="(c1,index) in categoryStore.c1Arr" :key="c1.id" :label="c1.name" :value="c1.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select v-model="categoryStore.c2Id" @change="handler1" :disabled="scene==0? false : true ">
          <el-option v-for="(c2,index) in categoryStore.c2Arr" :key="c2.id" :label="c2.name" :value="c2.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select v-model="categoryStore.c3Id" :disabled="scene==0? false : true ">
          <el-option v-for="(c3,index) in categoryStore.c3Arr" :key="c3.id" :label="c3.name" :value="c3.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import useCategoryStore from '@/store/modules/category'
let categoryStore =  useCategoryStore()
// 全局组件挂载完毕
onMounted(() => {
  getC1()
})
// 通知仓库获取一级分类的方法
const getC1 = () => {
  categoryStore.getC1()
}
// 一级菜单的下拉事件
const handler = () =>{
  categoryStore.c2Id = ''
  categoryStore.c3Arr = []
  categoryStore.c3Id = ''
  categoryStore.getC2()

}
// 二级下拉菜单change
const handler1 = () => {
  categoryStore.c3Id = '' 
  categoryStore.getC3()
}

defineProps(['scene'])

</script>

<style scoped>
.el-select {  
  width: 300px; /* 如果需要，也设置输入部分的宽度 */  
}
</style>
<template>
<div>
  <Category :scene="scene"/>
  <el-card style="margin: 10px 0px;">
    <div v-show="scene == 0">
        <el-button type="primary" size="default" icon="Plus" :disabled="categoryStore.c3Id ? false: true" @click="addAttr">添加属性</el-button>
        <el-table border style="margin: 10px 0px;" :data="attArr">
        <el-table-column label="序号" type="index" width="80px" align="center" ></el-table-column>
        <el-table-column label="属性名称" width="120px" align="center" prop="attrName"></el-table-column>
        <el-table-column label="属性值名称"align="center" >
            <template #="{row,index}">
                <el-tag v-for="(item,indx) in row.attrValueList" :key="item.id" style="margin: 5px 5px;">
                    {{ item.valueName }}
                </el-tag>
            </template>
        </el-table-column>
        <el-table-column label="操作" width="120px" align="center" >
            <!-- $index已有的属性对象  row已有属性-->
            <template #="{row,$index}">   
                <!-- 修改已有属性的按钮 -->
                <el-button type="primary" size="small" icon="Edit" @click="updateAttr(row)"></el-button>
                <el-popconfirm :title="`确认删除${row.attrName}？`" width="200px" @confirm="deleteAttr(row.id)">
                    <template #reference>
                        <el-button type="primary" size="small" icon="Delete"></el-button>
                    </template>
                </el-popconfirm>
            </template>
        </el-table-column>
        </el-table>
    </div>
    <div v-show="scene == 1">
        <el-form :inline="true">
            <el-form-item label="属性名称">
                <el-input placeholder="请输入属性名称" v-model="attrParams.attrName"></el-input>
            </el-form-item>
        </el-form>
        <el-button 
        type="primary" size="default" icon="Plus" 
        :disabled="attrParams.attrName ? false : true"
        @click="addAttrValue"
        >添加属性值
        </el-button>
        <el-button type="primary" size="default" @click="cancel">取消</el-button>
        <el-table border style="margin: 15px 0;" :data="attrParams.attrValueList">
            <el-table-column width="80px" type="index" align="center" label="序号"></el-table-column>
            <el-table-column align="center" label="属性值名称">
            <!-- row即为当前属性值对象 -->
                <template #="{row, $index}">
                    <el-input :ref="(vc: any) => inputArr[$index] = vc" v-if="row.flag" @blur="toLook(row, $index)"
                        size="small" placeholder="请你输入属性值名称" v-model="row.valueName"></el-input>                   
                    <div v-else @click="toEdit(row,$index)"> {{ row.valueName }}</div>
                </template>
            </el-table-column>
            <el-table-column align="center" label="属性值操作">
                <template #="{row,index}">
                    <el-button type="primary" size="default" icon="Delete" @click="attrParams.attrValueList.splice(index,1)"></el-button> 
                </template>
            </el-table-column>
        </el-table>
        <el-button type="primary" size="default" @click="save" :disabled="attrParams.attrValueList.length > 0 ? false : true">保存</el-button>
        <el-button type="primary" size="default"  @click="cancel">取消</el-button>
    </div>
  </el-card>

</div>
</template>

<script setup lang="ts">
import { watch,ref,reactive, nextTick, onBeforeMount } from 'vue';
// 获取仓库
import useCategoryStore from '@/store/modules/category';
// 引入获取已有属性和属性值接口的方法
import { reqAddOrUpadteAttr, reqAttr,reqRemoveAttr } from '@/api/product/attr'; 
import type { AttrResponseData, Attr, AttrValue } from '@/api/product/attr/type';
import { ElMessage } from 'element-plus';
let categoryStore = useCategoryStore()
// 存储已有的属性与属性值
let attArr = ref<Attr[]>([])
// 定义卡片组件内容切换的变量
let scene = ref<number>(0)  // scene=0显示table，显示table,scene=1显示添加和修改的结构
// 定义一个响应式数据控制编辑模式和响应模式的查看
// 收集新增得属性的数据
let attrParams = reactive<Attr>({
    attrName: '', // 新增属性名字
    attrValueList: [  // 新增属性值数组 

    ],
    categoryId: '', // 三级分类的id
    categoryLevel: 3 // 代表的是三级分类
})
let inputArr = ref<any>([])
// 监听三级
watch(()=>categoryStore.c3Id,async() => {
    attArr.value = []
    // 保证三级分类有才能发请求
    if(!categoryStore.c3Id){
        return 
    }
    // 获取分类id
    getAttr()  
})
// 获取已有属性和属性值方法 
const getAttr = async() => {
    const { c1Id, c2Id, c3Id} = categoryStore
    // 获取分类下已有属性和属性值方法
    let result:AttrResponseData = await reqAttr(c1Id, c2Id, c3Id) 
    if(result.code == 200){
      attArr.value = result.data  
    }
}
// 添加属性按钮的回调
const addAttr = () => {
    // 切换为添加和修改属性的结构
    scene.value = 1 
    // 每次点击清空数据
    Object.assign(attrParams,{
        attrName: '',
        attrValueList: [
        ], 
        categoryId: categoryStore.c3Id,
        categoryLevel: 3
    })
}
const updateAttr = (row:Attr) => {
    // 切换为添加和修改属性的结构
    scene.value = 1
    Object.assign(attrParams,JSON.parse(JSON.stringify(row)))
}
const  cancel = () => {
    scene.value = 0
} 
const addAttrValue = () => {
    // 点击添加属性值按钮的时候 向数组添加一个属性值对象
    attrParams.attrValueList.push({
        valueName: '',
        flag:true // 控制每个属性值的编辑模式都拥有单独的焦点框的控制
    })
       //获取最后el-input组件聚焦
    nextTick(() => {
        inputArr.value[attrParams.attrValueList.length - 1].focus();
    })
}
const save = async() =>{
    // 收集参数
    let result:any = await reqAddOrUpadteAttr(attrParams)
    if(result.code == 200){
        scene.value = 0
        ElMessage({
            type: 'success',
            message: attrParams.id ? '修改成功' : '添加成功'
        })
        // 获取全部已有的数据和数据类型
        getAttr()
    }else{
        ElMessage({
            type: 'error',
            message: attrParams.id ? '修改失败' : '添加失败'
        })
    }
}
// 失去焦点回调
const toLook = (row: AttrValue, $index: any) => {
    // 非法情况判断
    if(row.valueName.trim()== '') {
        // 删除对应属性值为空的值
        attrParams.attrValueList.splice($index,1)
        ElMessage({
            type:"error",
            message: '属性值不能为空'
        })
        return
    }
    // 属性值不能相同
    let repeat = attrParams.attrValueList.find((item) => {
        // 判断有焦点的那个属性值
        if(item != row){
            return item.valueName === row.valueName
        }
    })
    if(repeat){
        ElMessage({
            type:"error",
            message: '属性值不能重复'
        })
        return
    }
    row.flag = false
}
// 点击div回调
const toEdit = (row:AttrValue,$index:number) => {
    row.flag = true
    nextTick(() => {
        inputArr.value[$index].focus();
    })
}

const deleteAttr = async (attrId: number) => {
    let result:any = await reqRemoveAttr(attrId)
    if(result.code == 200){
        ElMessage({
            type: 'success',
            message: '删除成功'
        })
        getAttr()
    }else{
        ElMessage({
            type: 'error',
            message: '删除失败'
        })
    }
}
// 路由组件销毁的时候，把仓库分类相关的数据清空
onBeforeMount(()=>{
    categoryStore.$reset()
})
</script>

<style scoped>


</style>
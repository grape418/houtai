<template>
    <el-card>
        <el-table :data="permissionArr" border style="width: 100%; margin-bottom: 20px" row-key="id">
            <el-table-column prop="name" label="名称"></el-table-column>
            <el-table-column prop="code" label="权限值"></el-table-column>
            <el-table-column prop="updateTime" label="修改时间"></el-table-column>
            <el-table-column label="操作">
                <template #="{row, index}">
                    <el-button type="primary" size="small" icon="DocumentAdd" @click="addMenu(row)" :disabled="row.level == 4 ? true : false">{{ row.level == 3 ? '添加功能' : '添加菜单'}}</el-button>
                    <el-button type="primary" size="small" icon="Edit" @click="updateMenu(row)" :disabled="row.level == 1 ? true : false">编辑</el-button>
                    <el-popconfirm title="您确定要删除吗？" width="260px" @confirm="deleteMenu(row.id)">
                        <template #reference>
                            <el-button type="primary" size="small" icon="Delete" :disabled="row.level == 1 ? true : false">删除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
    <el-dialog v-model="dialogVisible" title="添加菜单">
        <el-form>
            <el-form-item label="名称">
                <el-input placeholder="请输入菜单" v-model="newMenu.name"></el-input>
            </el-form-item>
            <el-form-item label="权限">
                <el-input placeholder="请输入权限值" v-model="newMenu.code"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
        <div class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary"  @click="confirm">确认</el-button>
        </div>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { reqAddOrUpdateMenu, reqAllPermisstion, reqRemoveMenu } from '@/api/acl/menu';
import type { MenuParams, Permisstion, PermisstionList, PermisstionResponseData } from '@/api/acl/menu/type';
import { ElMessage } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';

let permissionArr = ref<PermisstionList>([])
let dialogVisible = ref<any>(false)
let newMenu = reactive<MenuParams>({
    name: '',
    code: '',
    level: 0,
    pid: 0
})
onMounted(()=>{
    getPermissionData()
})

const getPermissionData = async() => {
    let result:PermisstionResponseData = await reqAllPermisstion()
    if (result.code == 200) {
        permissionArr.value = result.data;
    }
}
const addMenu = (row: Permisstion) => {
    dialogVisible.value = true
    newMenu.code = '',
    newMenu.name = '',
    newMenu.id = 0,
    newMenu.pid = 0
    //收集新增的菜单的level数值
    newMenu.level = row.level + 1;
    //给谁新增子菜单
    newMenu.pid = (row.id as number)
}
const updateMenu = (row: Permisstion) => {
    dialogVisible.value = true
    Object.assign(newMenu, row)
}
const confirm = async() => {
    dialogVisible.value = false
    let result = await reqAddOrUpdateMenu(newMenu)
    if (result.code == 200) {
        //提示信息
        ElMessage({ type: 'success', message: newMenu.id ? '更新成功' : '添加成功' })
        //再次获取全部最新的菜单的数据
        getPermissionData();
    }
}
const deleteMenu = async(id: number) => {
    let result = await reqRemoveMenu(id)
    if(result.code == 200){
        ElMessage({type: 'success', message: '删除成功'})
        getPermissionData()
    }
    
}
</script>

<style scoped>

</style>
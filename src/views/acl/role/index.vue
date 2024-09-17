<template>
    <el-card>
        <el-form class="search">
            <el-form-item label="职位搜索">
                <el-input placeholder="请输入搜索职位关键字" style="width: 200px" v-model="keyword"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="sreach" :disabled="keyword ? false :true">搜索</el-button>
                <el-button type="primary" @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
    </el-card>
    <el-card style="margin: 10px 0;">
        <el-button type="primary" icon="Plus" @click="addRole">添加职位</el-button>
        <el-table style="margin: 10px 0;" border :data="roleArr">
            <el-table-column align="center" label="#" width="50px" type="index"></el-table-column>
            <el-table-column align="center" prop="id" label="身份证"></el-table-column>
            <el-table-column align="center" prop="roleName" label="职位名称"></el-table-column>
            <el-table-column align="center" prop="createTime" label="创建时间"></el-table-column>
            <el-table-column align="center" prop="updateTime" label="更新时间"></el-table-column>
            <el-table-column align="center" label="操作" width="300px">
                <template #="{row, index}">
                    <el-button type="primary" size="small" icon="User" @click="changeRole(row)">分配角色</el-button>
                    <el-button type="primary" size="small" icon="Edit" @click="updateRole(row)">编辑</el-button>
                    <el-button type="primary" size="small" icon="Delete" @click="deleteRole(row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
         v-model:current-page="pageNo"
         v-model:page-size="pageSize"
         :page-sizes="[5, 10, 15, 20]"
         :background="true"
         layout="prev, pager, next, jumper, -> ,total, sizes"
         :total="total"
         @size-change="roleDate"
         @current-change="handle"
        />
    </el-card>
    <!-- 职位 -->
    <el-dialog v-model="dialogVisible" :title="newRole.id ? '修改职位' : '添加职位'" width="800">
        <el-form :model="newRole" ref="form" :rules="rules">
            <el-form-item label="职位名称">
                <el-input placeholder="请输入职位名称" v-model="newRole.roleName" ></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
        <div class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary"  @click="confirm">确认</el-button>
        </div>
        </template>
    </el-dialog>
    <!-- 权限分配 -->
    <el-drawer v-model="drawer">
        <template #header>
            <h2>分配菜单与按钮权限</h2>
        </template>
        <template #default>
            <el-tree
                ref="tree"
                :data="menuArr"
                style="max-width: 600px"
                :props="props"
                node-key="id"
                default-expand-all  
                show-checkbox
                :default-checked-keys="selectArr"
             />
        </template>
        <template #footer>
            <el-button @click="drawer = false" size="default">取消</el-button>
            <el-button type="primary" size="default" @click="handler">确定</el-button>
        </template>
    </el-drawer>
</template>

<script setup lang="ts">
import { reqAddOrUpdateRole, reqAllRoleList, reqRemoveRole, reqAllMenuList, reqSetPermisstion } from '@/api/acl/role';
import type { MenuList, MenuResponseData, Records, RoleData } from '@/api/acl/role/type';
import uselayOutSettingStore from '@/store/modules/setting';
import { ElMessage } from 'element-plus';
import { nextTick, onMounted, reactive, ref } from 'vue';

let pageNo = ref<number>(1)
let pageSize = ref<number>(10)
let total = ref<number>(0)
let keyword = ref<string>('')
let roleArr = ref<Records>([])
let dialogVisible = ref<boolean>(false)
let form = ref<any>()
let drawer = ref<boolean>(false)
let settingStore = uselayOutSettingStore()
// 收集新品牌数据
let newRole = reactive<RoleData>({
    roleName: ''
})
// 存储权限数据
let menuArr = ref<MenuList>([])
// 准备一个数组 数据用于存储勾选的节点的id（四级）
let selectArr = ref<any>([])
let tree = ref<any>()
onMounted(()=>{
    roleDate()
})
const sreach = () => {
    roleDate()
    keyword.value = ''
}
const reset = () => {
    settingStore.refsh = !settingStore.refsh
}
const roleDate = async(pager = 1) => {
   let result = await reqAllRoleList(pageNo.value, pageSize.value,  keyword.value)
   total.value = result.data.total
   roleArr.value = result.data.records
}
const handle = () => {
    roleDate()
} 
const addRole = () => {
    dialogVisible.value = true;
    nextTick(() => {
        // 重置 newRole 对象和清除表单验证
        newRole.roleName = '';
        newRole.id = undefined; // 确保 id 被重置
        form.value.clearValidate('roleName');
    })
}
const updateRole = (row: RoleData) => {
    dialogVisible.value = true;
    nextTick(() => {
        // 更新 newRole 对象
        Object.assign(newRole, { ...row })
        form.value.clearValidate('roleName');
    })
}
const validateRole = (rule:any, value: any, callback: any) => {
    if(value.trim().length >= 2){
        callback()
    }else{
        callback(new Error('职位名称至少两位'))
    }
}
const rules = {
    roleName: [
        {required: true, trigger: 'blur', validator: validateRole}
    ]
}
const confirm = async() => {
    const validateResult = await form.value.validate();
    if(validateResult){
        let result = await reqAddOrUpdateRole(newRole)
        if(result.code == 200){
            ElMessage({
                type: 'success',
                message: newRole.id ? '修改成功' : '添加成功'
            })
            dialogVisible.value = false
            roleDate(newRole.id ? pageNo.value : 1)
        }else{
            ElMessage({
                type: 'error',
                message: newRole.id ? '修改失败' : '添加失败'
            })
            dialogVisible.value = false
        }  
        }
}
const deleteRole = async(id: number) => {
    let result = await reqRemoveRole(id)
    if(result.code == 200){
        ElMessage({
            type: 'success',
            message: '删除成功'
        })
        roleDate()
    }else{
        ElMessage({
            type: 'error',
            message: '删除失败'
        })
    }  
}

const changeRole = async(row: RoleData) => {
    drawer.value = true
    Object.assign(newRole,row)
    let result:MenuResponseData = await reqAllMenuList((newRole.id as number))
    if(result.code == 200){
        menuArr.value = result.data
        selectArr.value = filterSelectArr(menuArr.value, [])
    }
}

const props = {
    children: 'children',
    label: 'name',
}

const filterSelectArr = (allData: any, initArr: any) => {
    allData.forEach((item: any) => {
        if (item.select && item.level == 4) {
            initArr.push(item.id);
        }
        if (item.children && item.children.length > 0) {
            filterSelectArr(item.children, initArr);
        }
    })
    return initArr;
}
const handler = async() => {
    // 职位id
    const roleID = (newRole.id as number)
    // 选中节点的id
    let arr = tree.value.getCheckedKeys()
    // 半选的id
    let arr1 = tree.value.getHalfCheckedKeys()
    let premissionID = arr.concat(arr1)
    // 下发权限
    let result:any = await reqSetPermisstion(roleID,premissionID )
    console.log(result);
    if(result.code == 200){
        drawer.value = false
        ElMessage({
            type: 'success',
            message: '分配权限成功'
        })
        window.location.reload()
    }
}
</script>

<style scoped>
.search{
    display: flex;
    justify-content: space-between;
}
</style>
<template>
  <div>
    <el-card class="box-card">
    <!-- 卡片顶部 -->
     <el-button type="primary" size="default" icon="Plus" @click="addTrademack">添加品牌</el-button>
     <!-- 表格组件 展示已有的品牌数据 -->
      <el-table style="margin: 10px 0px;" border :data="trademarkArr">
        <el-table-column label="序号" width="80px" align="center" type="index"></el-table-column>
        <el-table-column label="品牌名称" align="center" prop="tmName"></el-table-column>
        <el-table-column label="品牌LOGO" align="center" >
          <template #="{row,$index}">
            <img :src="row.logoUrl" :alt="row.tmName" style="width: 100px; height: 100px;">
          </template>
        </el-table-column>
        <el-table-column label="品牌操作" align="center">
          <template #="{row,$index}">
            <el-button type="primary" size="small" icon="Edit" @click="updateTrademark(row)"></el-button>
            <el-popconfirm :title="`您确认要删除${row.tmName}?`" width="250px" icon="Delete" @confirm="removeTradeMack(row.id)">
              <template #reference>
                <el-button type="primary" size="small" icon="Delete"></el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        @size-change="sizeChange"
        @current-change="getHasTrademark"
        :pager-count = '9'
        v-model:current-page="pageNo"
        v-model:page-size="limit"
        :page-sizes="[3,5,7,9]"
        size="small"
        layout="prev, pager, next, jumper,->, sizes,total"
        :total="total"
      />
    </el-card>
    <!-- 对话框组件 增加新品牌 -->
    <!--  v-model 控制对话框是显示还是隐藏 Boolean-->
    <el-dialog v-model="dialogFormVisible" :title="trademarkParams.id ? '修改品牌' : '添加品牌'" width="500">
      <el-form style="width: 80%;"  :model="trademarkParams" :rules="rules" ref="formRef">
        <el-form-item label="品牌名称" prop="tmName" label-width="90px">
          <el-input placeholder="请输入品牌名称" v-model="trademarkParams.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" prop="logoUrl" label-width="90px">
          <el-upload
            class="avatar-uploader"
            action="/api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="trademarkParams.logoUrl" :src="trademarkParams.logoUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <!-- 底部按钮 -->
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="confirm">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref,onMounted, reactive } from 'vue';
import { reqHasTrademark, reqAddorUpdateTrademark, reqDeteleTradeMark } from '@/api/product/trademark'
import type { Records,TradeMackResponseData, TradeMack } from '@/api/product/trademark/type'
import { ElMessage, UploadProps } from 'element-plus';
// 当前页码
let pageNo = ref<number>(1)
let limit = ref<number>(5)
// 存储已有品牌数据的总数
let total = ref<number>(0)
let trademarkArr = ref<Records>([])
let dialogFormVisible = ref<boolean>(false)
// 定义新的收集品牌的数据
let trademarkParams =  reactive<TradeMack>({
  tmName:'',
  logoUrl:''
})
// 获取el-form组件实例
let formRef = ref()
// 获取已有品牌的接口 封装成一个函数 在任何情况下获取数据 调用函数即可
const getHasTrademark = async (pager =1) => {
  pageNo.value = pager
  let result:TradeMackResponseData = await reqHasTrademark(pageNo.value,limit.value)
  if(result.code == 200){
    total.value = result.data.total
    trademarkArr.value=result.data.records
  }
}
// 组件挂载完毕钩子    发一次请求，获取第一页，一页三个品牌的数据
onMounted(() =>{
  getHasTrademark()
})
// const changePageNo = () => {
//   getHasTrademark()
// }

// 下拉菜单发生变化时会触发此函数
// 这个自定义事件，分页器组件会将下拉菜单选中的数据返回
const sizeChange = () =>{
  // 当前每页数据量发生变化时页码归一
  getHasTrademark()
  
}
// 添加品牌按钮
const addTrademack = () => {
  dialogFormVisible.value = true
  trademarkParams.tmName = ''
  trademarkParams.logoUrl = ''
  trademarkParams.id = 0
}
// 修改品牌
// row: 当前已有品牌的数据
const updateTrademark = (row:TradeMack) => {
  console.log(row);
  dialogFormVisible.value = true
  // es6语法 合并对象
  Object.assign(trademarkParams, row)
/*   // 展示已有品牌的数据
  trademarkParams.id = row.id
  trademarkParams.tmName = row.tmName
  trademarkParams.logoUrl = row.logoUrl */
} 
// 对话框底部取消按钮
const cancel = () => {
  dialogFormVisible.value = false

  formRef.value.clearValidate('logoUrl')
  formRef.value.clearValidate('tmName')
}
// 对话框底部取消确定
const confirm = async() => {
  // 再发请求之前对整个表单进行检验
  // 调用这个方法
  await formRef.value.validate()
  let result:any = await reqAddorUpdateTrademark(trademarkParams)
  if(result.code == 200){
    dialogFormVisible.value = false
    ElMessage({
      type: 'success',
      message:  trademarkParams.id ? '修改品牌成功': '添加品牌成功'
    })
    // 再次发请求获取已有的全部数据
    getHasTrademark(trademarkParams.id ? pageNo.value : 0)
    // 收集数据
  }else{
    ElMessage({
      type: 'error',
      message: trademarkParams.id ? '修改品牌失败': '添加品牌失败'
    })
    dialogFormVisible.value = false
  }
}
// 上传图片之前触发的钩子函数
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if(rawFile.type == 'image/png' || rawFile.type == 'image/jpeg' || rawFile.type == 'image/git'){
    if(rawFile.size/1024/1024 < 4){
      return true
    }else{
      ElMessage({
        type: 'error',
        message: '文件上传大小小于4M'
    })
    return false
    }
  }else{
    ElMessage({
      type: 'error',
      message: '文件上传格式不正确'
    })
    return false
  }
}
// 文件上传成功的钩子
const handleAvatarSuccess: UploadProps['onSuccess'] = (response,uploadFile) => {
  trademarkParams.logoUrl = response.data
  formRef.value.clearValidate('logoUrl')
}

// 品牌校验自定义规则方法
const validatorTmName = (rule:any,value:any,callback:any) => {
  // 自定校验规则
  if(value.trim().length >= 2){
    callback()
  }else{
    callback(new Error('品牌名称大于等于两位'))
  }
}
// 图片
const validatorlogoUrl = (rule:any,value:any,callback:any) =>{
  if(value){
    callback()
  }else{
    callback(new Error('请上传图片'))
  }
}
// 表单校验规则
const rules ={
  tmName: [
    { required: true,  // 必填
      tirgger: 'blur' , // 表单失去焦点时触发
      validator: validatorTmName
    }
  ],
  logoUrl: [
    {
      required: true,
      validator: validatorlogoUrl
    }
  ]
}
// 气泡确认框
const removeTradeMack = async (id: number) => {
  let result = await reqDeteleTradeMark(id)
  if(result == 200){
    ElMessage({
      type: 'success',
      message: '删除品牌成功'
    })
    getHasTrademark(trademarkArr.value.length>1 ? pageNo.value: pageNo.value-1)
  }else{
    ElMessage({
      type: 'error',
      message: '删除失败'
    })
  }
}
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
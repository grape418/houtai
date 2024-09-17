<template>
  <div class="login_container">
    <el-row>
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24">
        <el-form 
        class="login_form"
        :model="loginFrom"
        :rules="rules"
        ref="loginFroms"
        >
          <h1>Hello</h1>
          <h2>欢迎来到硅谷甄选</h2>
          <el-form-item prop="username">
            <el-input :prefix-icon="User" v-model="loginFrom.username"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" :prefix-icon="Lock" v-model="loginFrom.password" show-password></el-input>
          </el-form-item>
          <el-form-item>
            <el-button :loading="loading" class="login_button" type="primary" size="default" @click="login">登录</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { User, Lock } from '@element-plus/icons-vue';
import { reactive, ref } from 'vue';
import { useRouter,useRoute } from 'vue-router';
import { ElNotification } from 'element-plus';
// 引入当前时间的函数
import { getTime } from '@/utils/time';
// 引入用户相关的小仓库
import useUserStroe from '@/store/modules/user'
let useStroe = useUserStroe() 
// 获取el-form组件
let loginFroms = ref()
// 获取路由器
let $router = useRouter()
let $route = useRoute()
// 定义一个变量 控制按钮加载效果
let loading = ref(false)
// 收集账号与密码数据
let loginFrom = reactive({username: 'admin', password: '111111'})
// 登录按钮回调
const login = async ()=>{
  // 保证所有的表单项校验通过在发送请求
  await loginFroms.value.validate()
  // 加载效果： 开始加载
  loading.value = true
  // 点击登录之后干什么
  // 通知仓库发登录请求
  // 请求成功-> 首页展示数据
  // 请求失败-》 弹出登录失败信息 
  try {
    // 可以书写.then的写法  保证登录成功
    await useStroe.userLogin(loginFrom)
    // 编程式导航跳转到首页
    let redirect:any = $route.query.redirect
    $router.push({path:redirect || '/'})
    // 登录成功的提示信息
    ElNotification({
      type: 'success',
      message: '欢迎回来',
      title: `Hi,${getTime()}好!`
    })
    // 登录成功加载效果也消失
    loading.value = false
  } catch (error) {
    // 登陆失败加载效果消失
    loading.value = false
    // 登录失败提示信息
    ElNotification({
      type: 'error',
      message:( error as Error).message
    })
  }
}
/* // 自定义校验规则函数
const vaildatorUserName = (rule: any, value: any, callback: any) => {
  // rule即为数组校验对象
  // value 为表单元素的内容
  // callback 函数 如果符合条件callback放行通过
  // 不符合注入错误信息
  if(/^\d{5,10}$/.test(value)){
    callback()
  }else{
    callback(new Error('账号长度至少5位'))
  }
}

const vaildatorPassword = (rule: any, value: any, callback: any) => {
  if(value.length <= 6){
    callback()
  }else{
    callback(new Error('密码长度至少6位'))
  }
} */
// 定义表单校验的配置对象
const rules = {
  // 规则对象属性说明required 代表这个字段必须校验
  username: [
    {required: true, min: 5, max: 10, message: '账号长度为6~10位', tirgger:'blur'} 
    // { trigger: 'change' ,vaildator:vaildatorUserName}
  ],
  password: [
    {required: true, min: 6, max: 12, message: '账号长度为8~12位', tirgger:'change'}
    // { trigger: 'change' ,vaildator:vaildatorPassword}
  ]
}

</script>

<style scoped lang="scss">
.login_container{
  width: 100%;
  height: 100vh;
  background:url('@/assets/images/background.jpg') no-repeat;
  background-size: cover;
}
.login_form{
  position: relative;
  width: 80%;
  top:30vh;
  background: url('@/assets/images/login_form.png') no-repeat;
  background-size: cover;
  padding: 40px;
  h1{
    color: white;
    font-size: 40px;
  }
  h2{
    color: white;
    font-size: 20px;
    margin: 20px 0px;
  }
  .login_button{
    width: 100%;
  }
}
</style>
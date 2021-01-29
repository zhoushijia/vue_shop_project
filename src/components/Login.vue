<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar">
        <img src="../assets/Tom.png" alt="" />
      </div>
      <el-form class="form_box" ref="loginFormRef" :rules="loginFormRules" :model="loginForm" label-width="0px">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="loginForm.password" prefix-icon="iconfont icon-3702mima"></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button class="btn-1" type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="loginFormReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// import 导出会缓存 这里的 axios 还是 main.js 中导出的 axios
// import axios from 'axios'
export default {
  name: 'login',
  data() {
    return {
      // 表单数据双向绑定
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 定义 表单验证 规则
      loginFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在3 - 10位', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 20, message: '密码在6 - 20位', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    loginFormReset() {
      // 获取 dom 对象
      this.$refs.loginFormRef.resetFields()
    },
    login() {
      // 整个表单进行校验
      /*  try {
        const valid = await this.$refs.loginFormRef.validate()
      } catch (error) {
        return error
      } */
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return
        // 发送 axios 请求 给 data 起别名 this.loginForm 表单数据
        // const { data: res } = await axios.post('login', this.loginForm)
        const { data: res } = await this.$http.post('login', this.loginForm)
        if (res.meta.status !== 200) return this.$message.error('登陆失败')
        // 跳出 element ui 弹框
        this.$message.success('登录成功')
        // 将令牌存储到 sessionStorage 中
        window.sessionStorage.setItem('token', res.data.token)
        // 跳转到 Home 页面
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  height: 100%;
  background-color: #2b4b6b;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 4px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  .avatar {
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 130px;
    height: 130px;
    background-color: #fff;
    border-radius: 50%;
    border: 1px solid #eee;
    box-shadow: 0 0 10px #eee;
    padding: 10px;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: #eee;
    }
  }
}
.form_box {
  position: absolute;
  bottom: 0;
  width: 100%;
  box-sizing: border-box;
  padding: 0 20px;
  .btns {
    padding: 0 40px;
    display: flex;
    justify-content: space-between;
    .btn-1 {
      margin-right: 80px;
    }
  }
}
</style>

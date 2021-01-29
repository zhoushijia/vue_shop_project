<template>
  <div>
    home
    <el-button type="info" @click="loginOut">退出</el-button>
  </div>
</template>

<script>
export default {
  methods: {
    // 实现退出功能
    loginOut() {
      // 需要调用后端接口
      // 清空token信息
      window.sessionStorage.clear()
      // 跳转到登录页
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="less" scoped></style>

<template>
  <el-container class="home_container">
    <el-header class="home_header">
      <div>
        <img src="../assets/top.png" alt="" />
        <span>Tom电商后台管理系统</span>
      </div>
      <el-button type="info" @click="loginOut">退出</el-button>
    </el-header>
    <el-container>
      <el-aside width="200px" class="home_aside">Aside</el-aside>
      <el-main class="home_main">Main</el-main>
    </el-container>
  </el-container>
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

<style lang="less" scoped>
.home_container {
  height: 100%;
}
.home_header {
  background-color: #373d41;
  display: flex;
  align-items: center;
  justify-content: space-between;
  > div {
    display: flex;
    align-items: center;
    color: #fff;
    img {
      height: 100%;
      border-radius: 50%;
    }
    span {
      margin-left: 15px;
    }
  }
}
.home_aside {
  background-color: #333744;
}
.home_main {
  background-color: #eaedf1;
}
</style>

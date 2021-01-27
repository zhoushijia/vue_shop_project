<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar">
        <img src="../assets/logo.png" alt="" />
      </div>
      <el-form class="form_box" v-model="loginForm" label-width="0px">
        <el-form-item>
          <el-input v-model="loginForm.name" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input type="password" v-model="loginForm.password" prefix-icon="iconfont icon-3702mima"></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button class="btn-1" type="primary">登录</el-button>
          <el-button type="info">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'login',
  data() {
    return {
      loginForm: {
        name: 'zs',
        password: '111111'
      }
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

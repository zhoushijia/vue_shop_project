<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片主体 -->
    <el-card class="box-card">
      <!-- 搜索栅格layout栏 -->
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input placeholder="请输入内容"> </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <template>
        <el-table :data="userlist" style="width: 100%" stripe border>
          <el-table-column type="index" label="#"> </el-table-column>
          <el-table-column prop="username" label="用户名"> </el-table-column>
          <el-table-column prop="email" label="邮箱"> </el-table-column>
          <el-table-column prop="mobile" label="电话"> </el-table-column>
          <el-table-column prop="role_name" label="角色"> </el-table-column>
          <el-table-column prop="mg_state" label="状态">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.mg_state"> </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作"> </el-table-column>
        </el-table>
      </template>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      queryUser: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userlist: []
    }
  },
  methods: {
    //   调用接口 获取用户
    async getUserlist() {
      const { data: res } = await this.$http.get('users', { params: this.queryUser })
      if (res.meta.status !== 200) return this.$message.error('获取用户列表失败')
      this.userlist = res.data.users
    }
  },
  // 获取用户列表
  created() {
    this.getUserlist()
  }
}
</script>
<style lang="less" scoped></style>

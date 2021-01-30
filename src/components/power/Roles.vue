<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table :data="roleslist" style="width: 100%" stripe border>
        <!-- 展开行 -->
        <el-table-column type="expand"> <template slot-scope=""></template></el-table-column>
        <!-- 主体 -->
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="">
            <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
// import hub from '../../utils/hub'
export default {
  name: 'Roles',
  created() {
    // hub.$emit('getActivePath', '/roles')
    this.getRoleslist()
  },
  data() {
    return {
      // 存储角色
      roleslist: []
    }
  },
  methods: {
    //   获取所有角色
    async getRoleslist() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error('获取角色列表失败')
      this.roleslist = res.data
    }
  }
}
</script>

<style lang="less" scoped></style>

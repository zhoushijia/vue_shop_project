<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table :data="rightslist" style="width: 100%" stripe border>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="authName" label="权限说明"> </el-table-column>
        <el-table-column prop="path" label="访问路径"> </el-table-column>
        <el-table-column prop="level" label="权限层级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '1'">等级一</el-tag>
            <el-tag v-else-if="scope.row.level === '2'" type="success">等级二</el-tag>
            <!-- TODO: v-else 后面不用再跟参数了 -->
            <el-tag v-else type="warning"> 等级三</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
// import hub from '../../utils/hub.js'
export default {
  name: 'Rights',
  created() {
    // hub.$emit('getActivePath', '/rights')
    this.getRightslist()
  },
  data() {
    return {
      // 存储权限
      rightslist: []
    }
  },
  methods: {
    //   获取权限列表
    async getRightslist() {
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status !== 200) return this.$message.error('获取权限列表失败')
      this.rightslist = res.data
    }
  }
}
</script>
<style lang="less" scoped></style>

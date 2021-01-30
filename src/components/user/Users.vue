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
          <!-- 搜索框功能 清空优化 -->
          <el-input placeholder="请输入内容" v-model="queryUser.query" clearable @clear="getUserlist">
            <el-button slot="append" icon="el-icon-search" @click="getUserlist"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
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
            <!-- 作用域插槽 -->
            <template slot-scope="scope">
              <!-- switch 开关 配合后端传来的数据-->
              <el-switch v-model="scope.row.mg_state" @change="switchChange(scope.row)"> </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180px">
            <!-- 作用域插槽 -->
            <template slot-scope="scope">
              <!-- 修改按钮  -->
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="editUser(scope.row.id)"></el-button>
              <!-- 删除按钮  -->
              <el-button type="warning" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row.id)"></el-button>
              <!-- 分配按钮 需要提示文本 tooltip -->
              <el-tooltip effect="dark" content="分配角色" :enterable="false" placement="top">
                <el-button type="danger" icon="el-icon-setting" size="mini"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </template>

      <!-- 分页功能 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryUser.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryUser.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </el-card>

    <!-- 添加用户对话框 -->
    <el-dialog title="用户信息" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <!-- 内容输入区 -->
      <el-form ref="addForm" :model="addFormUser" :rules="addFormRules" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addFormUser.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addFormUser.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addFormUser.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addFormUser.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑用户对话框 -->
    <el-dialog title="编辑用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import hub from '../../utils/hub.js'
export default {
  name: 'Users',
  data() {
    // 邮箱验证规则
    const checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-]+)+$/
      if (regEmail.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }
    // 手机验证规则
    const checkMobile = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的电话号码'))
    }
    // 数据
    return {
      // 查询时参数
      queryUser: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      // 查询所用用户接受数据
      userlist: [],
      // 总用户数
      total: 0,
      // 添加用户控制对话框弹出关闭
      addDialogVisible: false,
      // 编辑用户对话框
      editDialogVisible: false,
      // 添加用户时收集数据
      addFormUser: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 用户信息规则
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '密码长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入电话号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 编辑用户时校验规则
      editFormRules: {
        email: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入电话号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 修改用户时接受数据
      editForm: {}
    }
  },
  methods: {
    // 调用接口 获取所有用户
    async getUserlist() {
      const { data: res } = await this.$http.get('users', { params: this.queryUser })
      if (res.meta.status !== 200) return this.$message.error('获取用户列表失败')
      this.userlist = res.data.users
      this.total = res.data.total
    },
    // 页条数值改变 监听新值
    handleSizeChange(newSize) {
      this.queryUser.pagesize = newSize
      this.getUserlist()
    },
    // 页码改变
    handleCurrentChange(newPagenum) {
      this.queryUser.pagenum = newPagenum
      this.getUserlist()
    },
    //  监听状态事件 发起请求 开关状态切换
    async switchChange(userInfo) {
      const { data: res } = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error('状态更新失败')
      }
      this.$message.success('状态更新成功')
    },
    // 监听对话框关闭事件 重置表单 处理尸体
    addDialogClosed() {
      this.$refs.addForm.resetFields()
    },
    // 新增用户
    addUser() {
      this.$refs.addForm.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post('users', this.addFormUser)
        if (res.meta.status !== 201) return this.$message.error('用户添加失败')
        this.$message.success('用户添加成功')
        // 关闭对话框
        this.addDialogVisible = false
        this.getUserlist()
      })
    },
    // 编辑用户 editUser 和 editUserInfo
    // 根据用户id查询用户信息
    async editUser(id) {
      // 根据 id 发请求
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) return this.$message.error('获取用户信息失败')
      // this.$message.success('获取用户信息成功')
      this.editForm = res.data
      // 弹出修改用户对话框
      this.editDialogVisible = true
    },
    //?   监听编辑对话框 重置表单  ? 个人感觉这一步多余
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 更新用户信息
    editUserInfo() {
      // 表单数据预校验，必须预校验，否则可能会造成错误数据提交
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return
        // const { data: res } = await this.$http.put('users/' + this.editForm.id, this.editForm)
        const { data: res } = await this.$http.put('users/' + this.editForm.id, { email: this.editForm.email, mobile: this.editForm.mobile })
        if (res.meta.status !== 200) return this.$message.error('更新用户信息失败')
        this.$message.success('更新用户信息成功')
        // 重新获取后台数据 并渲染
        this.getUserlist()
        // 关闭对话框
        this.editDialogVisible = false
      })
    },
    // 根据id删除用户
    async deleteUser(id) {
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((err) => err)
      if (confirmResult !== 'confirm') return this.$message.info('已取消删除用户')
      // 发请求删除用户
      const { data: res } = await this.$http.delete('users/' + id)
      if (res.meta.status !== 200) return this.$message.error('删除用户失败')
      // 解决分页删除时小 bug
      if (this.userlist.length == 1) {
        this.queryUser.pagenum = this.queryUser.pagenum > 1 ? this.queryUser.pagenum - 1 : 1
      }
      this.$message.success('删除用户成功')
      this.getUserlist()
    }
  },
  // 获取用户列表
  created() {
    this.getUserlist()
    hub.$emit('getActivePath', '/users')
  }
}
</script>
<style lang="less" scoped></style>

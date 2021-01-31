<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddRoleDialog">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 表格区 -->
      <el-table :data="roleslist" style="width: 100%" stripe border>
        <!-- 展开行 -->
        <el-table-column type="expand">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <!-- 栅格系统 -->
            <el-row :class="['tag_bottom', 'vcenter', index1 === 0 ? 'tag_top' : '']" v-for="(item1, index1) in scope.row.children" :key="item1.id">
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable>{{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <!-- 二级权限  -->
                <el-row :class="['vcenter', index2 === 0 ? '' : 'tag_top']" v-for="(item2, index2) in item1.children" :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeRoleRight(scope.row, item3.id)">{{ item2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <!-- 三级权限 -->
                    <el-tag type="warning" v-for="item3 in item2.children" :key="item3.id" closable @close="removeRoleRight(scope.row, item3.id)">{{ item3.authName }}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 主体 -->
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditRoleDialog(scope.row.id)">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteRole(scope.row.id)">删除</el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="addRoleDialogVisible" width="50%" @close="addRoleDialogClosed">
      <!-- 内容输入区 -->
      <el-form ref="addForm" :model="addFormRole" :rules="addFormRules" label-width="70px">
        <el-form-item label="角色名" prop="roleName">
          <el-input v-model="addFormRole.roleName"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="roleDesc">
          <el-input v-model="addFormRole.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑角色对话框 -->
    <el-dialog title="编辑角色" :visible.sync="editRoleDialogVisible" width="50%" @close="editRoleDialogClosed">
      <!-- 内容输入区 -->
      <el-form ref="editForm" :model="editFormRole" :rules="editFormRules" label-width="70px">
        <el-form-item label="角色名" prop="roleName">
          <el-input v-model="editFormRole.roleName"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="roleDesc">
          <el-input v-model="editFormRole.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限对话框 -->
    <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%" @close="setRightDialogClosed">
      <!-- 树形控件 -->
      <!-- data 渲染后端数据  props 绑定子树节点和展示内容  show-checkbox 显示复选框 node-key 绑定对应id default-expand-all 默认展开 -->
      <el-tree :data="rightlist" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys" ref="treeRightRef"></el-tree>
      <!-- 底部按钮  -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRight">确 定</el-button>
      </span>
    </el-dialog>
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
      roleslist: [],
      // 添加角色对话框
      addRoleDialogVisible: false,
      addFormRole: {
        roleName: '',
        roleDesc: ''
      },
      addFormRules: {
        roleName: [
          { required: true, message: '请输入角色名', trigger: 'blur' },
          { min: 3, max: 10, message: '角色名长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 3, max: 15, message: '角色描述长度在 3 到 15个字符', trigger: 'blur' }
        ]
      },
      // 编辑角色
      editRoleDialogVisible: false,
      editFormRole: {
        roleId: '',
        roleName: '',
        roleDesc: ''
      },
      editFormRules: {
        roleName: [
          { required: true, message: '请输入角色名', trigger: 'blur' },
          { min: 3, max: 10, message: '角色名长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 3, max: 15, message: '角色描述长度在 3 到 15个字符', trigger: 'blur' }
        ]
      },
      // 分配权限对话框
      setRightDialogVisible: false,
      // 存储所有权限
      rightlist: [],
      // 树形权限展示的数据
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      // 存储用户选中的树形权限id值
      defKeys: [],
      // 分配角色权限需要用到的id
      roleId: ''
    }
  },
  methods: {
    // #1  获取所有角色
    async getRoleslist() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error('获取角色列表失败')
      this.roleslist = res.data
    },
    // #2 添加角色
    //  添加角色对话框显示
    showAddRoleDialog() {
      this.addRoleDialogVisible = true
    },
    // 添加角色
    addRole() {
      this.$refs.addForm.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post('roles', this.addFormRole)
        if (res.meta.status !== 201) return this.$message.error('添加角色失败')
        this.$message.success('添加角色成功')
        // 重新渲染
        this.getRoleslist()
        // 关闭对话框
        this.addRoleDialogVisible = false
      })
    },
    // 监听添加角色对话框关闭
    addRoleDialogClosed() {
      this.$refs.addForm.resetFields()
    },
    // #3 编辑角色
    //  编辑角色对话框显示 并据id发送请求 获取角色信息
    async showEditRoleDialog(id) {
      console.log(111)
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) return this.$message.error('根据id获取角色信息失败')
      this.editFormRole = res.data
      this.editRoleDialogVisible = true
    },
    // 监听编辑角色对话框关闭
    editRoleDialogClosed() {
      // 清理尸体
      this.$refs.editForm.resetFields()
    },
    //  发送请求 编辑角色
    editRole() {
      this.$refs.editForm.validate(async (valid) => {
        if (!valid) return this.$message.error('编辑输入信息不合法')
        const { data: res } = await this.$http.put(`roles/${this.editFormRole.roleId}`, this.editFormRole)
        if (res.meta.status !== 200) return this.$message.error('编辑角色失败')
        this.$message.success('编辑角色成功')
        this.getRoleslist()
        this.editRoleDialogVisible = false
      })
    },
    // #4 删除角色
    async deleteRole(id) {
      const confirm = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((err) => err)
      if (confirm !== 'confirm') return this.$message.info('取消了删除')
      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) return this.$message.error('删除角色失败')
      this.$message.success('删除角色成功')
      this.getRoleslist()
    },
    // #5 角色授权
    // 弹出分配权限对话框
    async showSetRightDialog(role) {
      // 下面的分配权限需要用到角色id 预先存储
      this.roleId = role.id
      // 发起权限列表请求 所有权限列项
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) return this.$message.error('获取权限数据失败')
      this.rightlist = res.data
      // 获取默认id渲染到树形复选框
      this.getLeafKeys(role, this.defKeys)
      // 跳出对话框
      this.setRightDialogVisible = true
    },
    // 获取三级子权限id
    getLeafKeys(role, arr) {
      // 如果灭有children属性 说明是三级子角色
      if (!role.children) return arr.push(role.id)
      // 继续往下找
      role.children.forEach((item) => {
        this.getLeafKeys(item, arr)
      })
    },
    // 监听权限对话框关闭 关闭则将存储的权限id值清空
    setRightDialogClosed() {
      this.defKeys = []
    },
    // 分配权限
    async allotRight() {
      const keys = [...this.$refs.treeRightRef.getCheckedKeys(), ...this.$refs.treeRightRef.getHalfCheckedKeys()]
      const keysStr = keys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: keysStr })
      if (res.meta.status !== 200) return this.$message.error('分配权限失败')
      this.$message.success('分配权限成功')
      this.getRoleslist()
      // 关闭对话框
      this.setRightDialogVisible = false
    },
    // #6 删除指定角色权限
    async removeRoleRight(role, id) {
      // 删除提示框
      const confirmRight = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((err) => err)
      if (confirmRight !== 'confirm') return this.$message.info('取消删除')
      // 发请求
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${id}`)
      if (res.meta.status !== 200) return this.$message.error('删除权限失败')
      // this.getRoleslist()
      // 这里的 role 是引用 所用赋值会影响到外面
      role.children = res.data
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.tag_top {
  border-top: 1px solid #eee;
}
.tag_bottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>

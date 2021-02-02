<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区 -->
    <el-card>
      <el-alert title="注意：只允许第三级分类设置相关参数" type="warning" effect="dark" :closable="false"> </el-alert>
      <el-row>
        <el-col>
          <span>请选择商品分类: </span>
          <el-cascader :options="catelist" v-model="selectedKeys" :props="cascaderProps" @change="cateParamsChanged"></el-cascader>
        </el-col>
      </el-row>
      <!-- tab切换 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" :disabled="isBtnDisables" @click="showAddDialog">添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyparams" style="width: 100%" border stripe>
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column prop="attr_name" label="参数名称"> </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" :disabled="isBtnDisables" @click="showAddDialog">添加属性</el-button>
          <!-- 静态属性表格 -->
          <el-table :data="onlyparams" style="width: 100%" border stripe>
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column prop="attr_name" label="参数名称"> </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 增加参数对话框 -->
    <el-dialog :title="'添加' + isTitle" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
        <el-form-item :label="isTitle" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑参数对话框 -->
    <el-dialog :title="'添加' + isTitle" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="80px">
        <el-form-item :label="isTitle" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Cateparams',
  data() {
    return {
      // ##0 获取商品分类
      catelist: [],
      // ##1 获取参数
      selectedKeys: [],
      cascaderProps: {
        // 当用户选择时传给v-model的值
        value: 'cat_id',
        // 级联组件显示的内容
        label: 'cat_name',
        // 子项绑定
        children: 'children',
        // 鼠标经过则显示子项
        expandTrigger: 'hover'
      },
      // tab栏切换属性
      activeName: 'many',
      // 获取动态参数
      manyparams: [],
      // 静态属性
      onlyparams: [],
      // ##2 增加参数
      addDialogVisible: false,
      addForm: {
        attr_name: ''
      },
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ]
      },
      // ##3 编辑参数
      editDialogVisible: false,
      editForm: {
        attr_name: ''
      },
      editFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getCategories()
  },
  methods: {
    //  #0 获取商品分类
    async getCategories() {
      const { data: res } = await this.$http.get('categories')
      //   console.log(res.data)
      if (res.meta.status !== 200) return this.$message.error('获取商品分类失败')
      this.catelist = res.data
    },
    // #1 获取动态参数或静态属性
    // tab 切换 根据id发请求获取动态参数或静态属性
    handleClick() {
      this.getParamsData()
    },
    // 级联栏改变
    cateParamsChanged() {
      this.getParamsData()
    },
    // 获取动态参数或静态属性
    async getParamsData() {
      // TODO: 注意这里需要清空 selectedKeys
      if (this.selectedKeys.length !== 3) return (this.selectedKeys = [])
      // console.log(this.cateId)
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: this.activeName } })
      //   console.log(res)
      if (res.meta.status !== 200) return this.$message.error('根据id获取分类参数失败')
      if (this.activeName === 'many') return (this.manyparams = res.data)
      this.onlyparams = res.data
    },
    // #2 添加动态参数或静态属性
    showAddDialog() {
      this.addDialogVisible = true
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    addParams() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, { ...this.addForm, attr_sel: this.activeName })
        if (res.meta.status !== 201) return this.$message.error('添加参数失败')
        this.$message.success('添加参数成功')
        this.getParamsData()
        this.addDialogVisible = false
      })
    },
    // #3 编辑动态参数或静态属性
    async showEditDialog(id) {
      console.log(id)
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${id}`, { params: { attr_sel: this.activeName } })
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('根据id获取分类参数失败')
      this.editForm = res.data
      this.editDialogVisible = true
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    editParams() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.put(`categories/${this.editForm.cat_id}/attributes/${this.editForm.attr_id}`, this.editForm)
        if (res.meta.status !== 200) return this.$message.error('更新参数失败')
        this.$message.success('更新参数成功')
        this.getParamsData()
        this.editDialogVisible = false
      })
    },
    // #4 删除参数
    async deleteParams(id) {
      const confirmResult = await this.$confirm('此操作将永久删除该参数, 是否继续?', '删除参数', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((err) => err)
      if (confirmResult !== 'confirm') return this.$message.info('已取消删除参数')
      // 发请求删除用户
      const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${id}`)
      if (res.meta.status !== 200) return this.$message.error('删除参数失败')
      this.$message.success('删除参数成功')
      this.getParamsData()
    }
  },
  computed: {
    // ##1 获取动态参数或静态属性
    // 当级联栏选中了3级 则按钮可用
    isBtnDisables() {
      return this.selectedKeys.length !== 3 ? true : false
    },
    // TODO: 获取级联列表中选中的id
    cateId() {
      return this.selectedKeys.length === 3 ? this.selectedKeys[2] : null
    },
    // ##2 增加参数
    isTitle() {
      return this.activeName === 'many' ? '动态参数' : '静态属性'
    }
  }
}
</script>
<style lang="less" scoped>
.el-alert {
  margin-bottom: 15px;
}
</style>

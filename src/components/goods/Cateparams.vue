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
      <el-alert title="注意：只允许第三级分类设置相关参数" type="warning" :closable="false"> </el-alert>
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
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item, index) in scope.row.attr_vals" :key="index" closable :disable-transitions="false" @close="tagClosed(scope.row, index)">{{ item }} </el-tag>
                <!-- 新增标签 -->
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)"> </el-input>
                <el-button v-else size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
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
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item, index) in scope.row.attr_vals" :key="index" closable :disable-transitions="false" @close="tagClosed(scope.row, index)">{{ item }} </el-tag>
                <!-- 标签 -->
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)"> </el-input>
                <el-button v-else size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
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
    <el-dialog :title="'编辑' + isTitle" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
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
      if (this.selectedKeys.length !== 3) {
        this.selectedKeys = []
        // #7 当选中的不是3级子分类时 清空表格数据
        this.manyparams = []
        this.onlyparams = []
        return
      }
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: this.activeName } })
      if (res.meta.status !== 200) return this.$message.error('根据id获取分类参数失败')

      res.data.forEach((item) => {
        // 将字符串转化成数组
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 新增标签内容,input框是否隐藏
        item.inputVisible = false
        // 新增标签内容,input框中的值
        item.inputValue = ''
      })
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
    },
    // #5 新增标签内容
    showInput(row) {
      // 点击新增按钮 显示input框
      row.inputVisible = true
      // 数据更新到视图渲染是异步的 $nextTick可以保证代码在渲染完成后再执行 在渲染完成后自动聚焦
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm(row) {
      // 如果输入内容为空字符
      if (row.inputValue.trim().length <= 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      //   let r = JSON.parse(JSON.stringify(row.attr_vals)).push(row.inputValue.trim())
      // 这里前端已经将标签添加成功，但数据还未传到后端
      row.attr_vals.push(row.inputValue.trim())
      this.saveTagChange(row)
      // 发请求
      /*  const { data: res } = await this.$http.put(`categories/${row.cat_id}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        // 这里必须传字符串
        attr_vals: row.attr_vals.join(' ')
        // attr_vals: r.join(' ')
      })
      if (res.meta.status !== 200) return this.$message.error('添加标签失败')
      this.$message.success('添加标签成功') */
      // row.attr_vals = r
      row.inputValue = ''
      row.inputVisible = false
    },
    // #6 删除标签
    tagClosed(row, i) {
      row.attr_vals.splice(i, 1)
      this.saveTagChange(row)
    },
    async saveTagChange(row) {
      // 发请求
      const { data: res } = await this.$http.put(`categories/${row.cat_id}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        // 这里必须传字符串
        attr_vals: row.attr_vals.join(' ')
      })
      if (res.meta.status !== 200) return this.$message.error('添加标签失败')
      this.$message.success('添加标签成功')
    }
  },
  computed: {
    // ##1 获取动态参数或静态属性
    // 当级联栏选中了3级 则按钮可用
    isBtnDisables() {
      return this.selectedKeys.length !== 3
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
.el-tag {
  margin: 10px;
}
.input-new-tag {
  width: 150px;
}
</style>

<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- vue-table-with-tree-grid -->
      <!-- data数据绑定 columns表格列设置 expand-type展开行 selection-type复选框 show-index每行索引 show-row-hover经过时高亮 -->
      <zk-table :data="catelist" :columns="columns" :expand-type="false" :selection-type="false" show-index index-text="#" border :show-row-hover="false">
        <!-- 是否有效 -->
        <template slot="isOk" scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color:lightgreen;"></i>
          <i class="el-icon-error" v-else style="color:red;"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="operate" scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditCateDialog(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteCate(scope.row)">删除</el-button>
        </template>
      </zk-table>

      <!-- 分页 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryCate.pagenum" :page-sizes="[3, 5, 10, 15]" :page-size="queryCate.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%" @close="addCateDialogClosed">
      <el-form ref="addCateFormRef" :model="addCateForm" :rules="addCateFormRules" label-width="80px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="分类层级">
          <!-- options: 指定数据源 -->
          <!-- props: 用来指定配置对象 -->
          <!-- checkStrictly 允许选择一级分类 -->
          <el-cascader v-model="selectedKeys" :options="parentCateList" :props="cascaderProps" clearable @change="parentCateChanged" style="width:100%;"></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑分类对话框 -->
    <el-dialog title="编辑分类" :visible.sync="editCateDialogVisible" width="50%" @close="editCateDialogClosed">
      <el-form ref="editCateFormRef" :model="editCateForm" :rules="editCateFormRules" label-width="80px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'Cate',
  created() {
    this.getCategories()
  },
  data() {
    return {
      // ##1 查询商品列表
      //  查询条件
      queryCate: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 商品分类列表数据
      catelist: [],
      total: 0,
      // 表格列设置
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          prop: 'cat_deleted',
          type: 'template',
          template: 'isOk'
        },
        {
          label: '排序',
          prop: 'cat_level',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'operate'
        }
      ],
      // ##2 添加分类
      // 添加分类
      addCateDialogVisible: false,
      addCateForm: {
        cat_pid: 0,
        cat_name: '',
        cat_level: 0
      },
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入商品分类名称', trigger: 'blur' },
          { min: 1, max: 10, message: '角色名长度在 1 到 10 个字符', trigger: 'blur' }
        ]
      },
      // 级联选择器配置
      cascaderProps: {
        // 当用户选择时传给v-model的值
        value: 'cat_id',
        // 级联组件显示的内容
        label: 'cat_name',
        // 子项绑定
        children: 'children',
        // 允许选择一级分类
        checkStrictly: true,
        // 鼠标经过则显示子项
        expandTrigger: 'hover'
      },
      // 存储父级商品分类列表
      parentCateList: [],
      // 被选中的级联的id数组
      selectedKeys: [],
      // ##3 编辑分类
      editCateDialogVisible: false,
      editCateForm: { cat_name: '' },
      editCateFormRules: {
        cat_name: [
          { required: true, message: '请输入商品分类名称', trigger: 'blur' },
          { min: 1, max: 10, message: '角色名长度在 1 到 10 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // #1 查询商品分类列表
    async getCategories() {
      const { data: res } = await this.$http.get('categories', { params: this.queryCate })
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error('获取商品分类失败')
      this.catelist = res.data.result
      this.total = res.data.total
    },
    // 页面条数
    handleSizeChange(newSize) {
      this.queryCate.pagesize = newSize
      this.getCategories()
    },
    // 当前页面
    handleCurrentChange(newPage) {
      this.queryCate.pagenum = newPage
      this.getCategories()
    },
    // #2 添加商品分类
    // 添加分类对话框显示
    async showAddCateDialog() {
      // 先发请求获取商品分类列表
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) return this.$message.error('获取父级商品分类失败')
      this.parentCateList = res.data
      // console.log(res)
      // 跳出弹框
      this.addCateDialogVisible = true
    },
    // 级联选择器改变 收集数据
    parentCateChanged() {
      if (this.selectedKeys.length > 0) {
        // console.log(this.selectedKeys)
        // 被选中的级联的id数组的最后一项则是父级id
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        // 被选中的级联的id数组的长度则是该商品分类的等级
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    // 关闭对话框时
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields()
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
      this.selectedKeys = []
    },
    // 确定时 发请求添加商品分类数据
    addCate() {
      this.$refs.addCateFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post('categories', this.addCateForm)
        if (res.meta.status !== 201) return this.$message.error('添加商品分类失败')
        this.$message.success('添加商品分类成功')
        this.getCategories()
        this.addCateDialogVisible = false
      })
    },
    // #3 编辑分类
    async showEditCateDialog(cate) {
      // 根据id发请求 查询
      const { data: res } = await this.$http.get('categories/' + cate.cat_id)
      if (res.meta.status !== 200) return this.$message.error('据id获取分类失败')
      this.editCateForm = res.data
      // 跳出对话框
      this.editCateDialogVisible = true
    },
    // 监听对话框关闭
    editCateDialogClosed() {
      this.$refs.editCateFormRef.resetFields()
    },
    // 发请求提交更新
    editCate() {
      this.$refs.editCateFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.put('categories/' + this.editCateForm.cat_id, { cat_name: this.editCateForm.cat_name })
        if (res.meta.status !== 200) return this.$message.error('更新分类失败')
        this.$message.success('更新分类成功')
        this.getCategories()
        // this.updateCatelist(this.editCateForm.cat_id, this.catelist)
        this.editCateDialogVisible = false
      })
    },
    // 按更新实现前端部分渲染 提高性能
    /*  updateCatelist(id, cate) {
      if (cate.cat_id === id) {
        cate.cat_name = this.editCateForm.cat_name
        return
      }
      if (!cate.children) return
      cate.children.forEach((item) => {
        this.updateCatelist(id, item)
      })
    }, */
    // #4 删除分类
    async deleteCate(cate) {
      // 删除提示框
      const confirmRight = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((err) => err)
      if (confirmRight !== 'confirm') return this.$message.info('取消删除')
      // 发请求
      const { data: res } = await this.$http.delete(`categories/${cate.cat_id}`)
      if (res.meta.status !== 200) return this.$message.error('删除分类失败')
      console.log(cate)
      this.$message.success('删除分类成功')
      // 被删除项的父id是0 并且 长度为1 则说明是最外层的
      if (this.catelist.length === 1 && cate.cat_pid === 0) {
        this.queryCate.pagenum = this.queryCate.pagenum === 1 ? 1 : this.queryCate.pagenum - 1
      }
      this.getCategories()
      // this.catelist = res.data
    }
  }
}
</script>
<style lang="less" scoped>
.zk-table {
  margin-top: 15px;
}
</style>

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
        <template slot="operate" scope="">
          <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
        </template>
      </zk-table>

      <!-- 分页 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryCate.pagenum" :page-sizes="[3, 5, 10, 15]" :page-size="queryCate.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%">
      <el-form ref="addCateFormRef" :model="addCateForm" :rules="addCateFormRules" label-width="70px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="分类层级">
          <!-- options: 指定数据源 -->
          <!-- props: 用来指定配置对象 -->
          <!-- checkStrictly 允许选择一级分类 -->
          <el-cascader v-model="selectedKeys" :options="parentCateList" :props="cascaderProps" @change="parentCateChanged" style="width:100%;"></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCateDialogVisible = false">确 定</el-button>
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
      addCateFormRules: {},
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
      // 被选中的级联的id数组
      selectedKeys: [],
      // 存储父级商品分类列表
      parentCateList: []
    }
  },
  methods: {
    //   查询商品分类列表
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
    // 级联选择器改变
    parentCateChanged() {
      // this.selectedKeys =
    }
  }
}
</script>
<style lang="less" scoped>
.zk-table {
  margin-top: 15px;
}
</style>

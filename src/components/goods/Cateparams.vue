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
          <el-button type="primary" :disabled="isBtnDisables">添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyparams" style="width: 100%" border stripe>
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column prop="attr_name" label="参数名称"> </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="">
                <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" :disabled="isBtnDisables">添加属性</el-button>
          <!-- 静态属性表格 -->
          <el-table :data="onlyparams" style="width: 100%" border stripe>
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column prop="attr_name" label="参数名称"> </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="">
                <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Cateparams',
  data() {
    return {
      // ##1 获取商品分类
      catelist: [],
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
      activeName: 'many',
      manyparams: [],
      onlyparams: []
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
    }
  },
  computed: {
    // 当级联栏选中了3级 则按钮可用
    isBtnDisables() {
      return this.selectedKeys.length !== 3 ? true : false
    },
    // TODO: 获取级联列表中选中的id
    cateId() {
      return this.selectedKeys.length === 3 ? this.selectedKeys[2] : null
    }
  }
}
</script>
<style lang="less" scoped>
.el-alert {
  margin-bottom: 15px;
}
</style>

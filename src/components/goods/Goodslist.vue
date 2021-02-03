<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片主体 -->
    <el-card>
      <!-- 搜索栅格layout栏 -->
      <el-row :gutter="20">
        <el-col :span="10">
          <!-- 搜索框功能 清空优化 -->
          <el-input placeholder="请输入内容" v-model="queryGood.query" clearable @clear="getGoodslist">
            <el-button slot="append" icon="el-icon-search" @click="getGoodslist"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 表格区 -->
      <el-table :data="goodslist" style="width: 100%" stripe border>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="goods_name" label="商品名称"> </el-table-column>
        <el-table-column prop="goods_price" label="价格" width="75px"> </el-table-column>
        <el-table-column prop="goods_weight" label="重量" width="60px"> </el-table-column>
        <el-table-column prop="add_time" label="添加时间" width="160px">
          <template slot-scope="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template slot-scope="">
            <!-- 修改按钮  -->
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <!-- 删除按钮  -->
            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页功能 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryGood.pagenum" :page-sizes="[5, 10, 15, 20]" :page-size="queryGood.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total" background> </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Goodslist',
  data() {
    return {
      // ##1 查询商品
      queryGood: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      goodslist: []
    }
  },
  created() {
    this.getGoodslist()
  },
  methods: {
    // #1 获取商品列表
    async getGoodslist() {
      const { data: res } = await this.$http.get('goods', { params: this.queryGood })
      if (res.meta.status !== 200) return this.$message.error('获取商品列表失败')
      this.goodslist = res.data.goods
      this.total = res.data.total
    }
  }
}
</script>

<style lang="less" scoped></style>

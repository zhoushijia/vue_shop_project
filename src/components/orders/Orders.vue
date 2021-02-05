<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片主体 -->
    <el-card>
      <!-- 搜索栅格layout栏 -->
      <el-row :gutter="20">
        <el-col :span="10">
          <!-- 搜索框功能 清空优化 -->
          <el-input placeholder="请输入内容" v-model="queryOrder.query" clearable @clear="getOrderlist">
            <el-button slot="append" icon="el-icon-search" @click="getOrderlist"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加订单</el-button>
        </el-col>
      </el-row>

      <el-table :data="orderlist" style="width: 100%" stripe border>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="240px"> </el-table-column>
        <el-table-column prop="order_price" label="订单价格"> </el-table-column>
        <el-table-column prop="pay_status" label="是否付款">
          <template slot-scope="scope">
            <el-tag type="warning" v-if="scope.row.pay_status == 0">未付款</el-tag>
            <el-tag type="success" v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"> </el-table-column>
        <el-table-column prop="create_time" label="下单时间">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="showAddressDialog(scope.row)"></el-button>
            <el-button size="mini" type="success" icon="el-icon-location" @click="showPckageDialog(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryOrder.pagenum" :page-sizes="[10, 15, 20, 30]" :page-size="queryOrder.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>

      <el-dialog title="修改地址" :visible.sync="addressDialogVisible" width="50%" @close="addressDialogClosed">
        <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px">
          <el-form-item label="省市区/县" prop="address1">
            <el-cascader v-model="addressForm.address1" :options="city" :props="cityProps" @change="handleChange" style="width:100%"></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="address2">
            <el-input v-model="addressForm.address2"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addressDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addressDialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog title="快递信息" :visible.sync="packageDialogVisible" width="50%">
        <el-timeline>
          <el-timeline-item v-for="(activity, index) in packageInfo" :key="index" :timestamp="activity.time">
            {{ activity.context }}
          </el-timeline-item>
        </el-timeline>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
import city from './citydata.js'
export default {
  name: 'Orders',
  data() {
    return {
      queryOrder: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      orderlist: [],
      total: 0,
      addressDialogVisible: false,
      addressForm: {
        address1: [],
        address2: ''
      },
      addressFormRules: {
        address1: [{ required: true, message: '请选择省市区/县', trigger: 'blur' }],
        address2: [{ required: true, message: '请输入详细地址', trigger: 'blur' }]
      },
      city,
      cityProps: { expandTrigger: 'hover', value: 'children', label: 'label', children: 'children' },
      // #3 物流信息
      packageDialogVisible: false,
      packageInfo: []
    }
  },
  created() {
    this.getOrderlist()
  },
  methods: {
    // #1 获取订单列表
    async getOrderlist() {
      const { data: res } = await this.$http.get('orders', { params: this.queryOrder })
      if (res.meta.status !== 200) return this.$message.error('获取订单列表失败')
      this.orderlist = res.data.goods
      this.total = res.data.total
    },
    handleSizeChange(newSize) {
      this.queryOrder.pagesize = newSize
      this.getOrderlist()
    },
    handleCurrentChange(newPage) {
      this.queryOrder.pagenum = newPage
      this.getOrderlist()
    },
    // #2 修改地址
    showAddressDialog(order) {
      this.addressDialogVisible = true
    },
    addressDialogClosed() {
      this.$refs.addressFormRef.resetFields()
    },
    handleChange() {},
    // #3 物流信息
    async showPckageDialog() {
      const { data: res } = await this.$http.get('/kuaidi/804909574412544580')
      if (res.meta.status !== 200) return this.$message.error('获取物流信息失败')
      this.packageInfo = res.data
      this.packageDialogVisible = true
    }
  }
}
</script>

<style lang="less" scoped></style>

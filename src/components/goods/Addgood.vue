<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片主体 -->
    <el-card>
      <!-- 警示条 -->
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"> </el-alert>
      <!-- 步骤条 -->
      <el-steps :space="200" :active="activeStep - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tab切换 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-position="top" label-width="100px">
        <el-tabs :tab-position="'left'" v-model="activeStep" :before-leave="beforeTabLeave" @tab-click="handleClick">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name"> <el-input v-model="addForm.goods_name"></el-input> </el-form-item>
            <el-form-item label="价格" prop="goods_price"> <el-input v-model="addForm.goods_price"></el-input> </el-form-item>
            <el-form-item label="数量" prop="goods_number"> <el-input v-model="addForm.goods_number"></el-input> </el-form-item>
            <el-form-item label="重量" prop="goods_weight"> <el-input v-model="addForm.goods_weight"></el-input> </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader v-model="addForm.goods_cat" :options="catelist" :props="cateProps" @change="handleChange" style="width:100%;"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <!-- 动态参数 -->
          <el-tab-pane label="商品参数" name="1">
            <!-- 动态参数每一项 -->
            <el-form-item :label="item.attr_name" v-for="item in manyParams" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox v-for="(cb, i) in item.attr_vals" :key="i" :label="cb" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <!-- 静态属性 -->
          <el-tab-pane label="商品属性" name="2">
            <!-- 静态属性的每一项 -->
            <el-form-item :label="item.attr_name" v-for="item in onlyParams" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <!-- 上传图片 -->
          <el-tab-pane label="商品图片" name="3">
            <!-- on-preview 点击文件列表中已上传的文件时的钩子 on-remove 文件列表移除文件时的钩子 list-type 文件列表的类型-->
            <el-upload :action="uploadImgURL" :on-preview="handlePreview" :on-remove="handleRemove" :on-success="handleSuccess" list-type="picture" :headers="reqHeader">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <vue-quill-editor v-model="addForm.goods_introduce"></vue-quill-editor>
            <!-- 添加商品按钮 -->
            <el-button type="primary" @click="addCate">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <el-dialog title="预览图片" :visible.sync="priviewImgDialogVisible" width="50%">
      <el-image :src="previewPath" style="width:100%"></el-image>
      <span slot="footer" class="dialog-footer">
        <el-button @click="priviewImgDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="priviewImgDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import _ from 'lodash'
export default {
  name: 'Addgood',
  data() {
    return {
      // ##1
      activeStep: 0,
      // ##2
      addForm: {
        goods_name: '',
        goods_price: '0',
        goods_number: '0',
        goods_weight: '0',
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      addFormRules: {
        goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        goods_price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
        goods_number: [{ required: true, message: '请输入商品数量', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '请输入商品重量', trigger: 'blur' }],
        goods_cat: [{ required: true, message: '请选择商品分类', trigger: 'blur' }]
      },
      catelist: [],
      // 级联组件规则
      cateProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 动态参数
      manyParams: [],
      // 静态属性
      onlyParams: [],
      // 图片URL
      uploadImgURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 请求头
      reqHeader: { authorization: window.sessionStorage.getItem('token') },
      previewPath: '',
      priviewImgDialogVisible: false
    }
  },
  created() {
    this.getCatelist()
  },
  methods: {
    // #1  获取商品分类
    async getCatelist() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error('获取商品分类失败')
      this.catelist = res.data
    },
    handleChange() {
      // 保证必须选第三级子分类
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    // tab的切换标签之前的钩子
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName == 0 && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请选择商品分类')
        return false
      }
    },
    // tab 切换
    async handleClick() {
      // 保证访问的是动态参数面板
      if (this.activeStep == 1) {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'many' } })
        if (res.meta.status !== 200) this.$message.error('获取动态参数失败')
        res.data.forEach((item) => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        })
        this.manyParams = res.data
      } else if (this.activeStep == 2) {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'only' } })
        if (res.meta.status !== 200) this.$message.error('获取静态属性失败')
        this.onlyParams = res.data
      }
    },
    // 图片预处理
    handlePreview(file) {
      // 获取图片信息
      console.log(file)
      this.previewPath = file.response.data.url
      this.priviewImgDialogVisible = true
    },
    // 图片移除 主要是为了移除pics中的图片信息
    handleRemove(file) {
      // file是要删除的文件
      const removeIndex = this.addForm.pics.findIndex((item) => {
        file.response.data.tmp_path === item.pic
      })
      this.addForm.pics.splice(removeIndex, 1)
    },
    // 图片上传成功后 获取临时信息存储到form种
    handleSuccess(response) {
      // response是上传成功的返回对象
      this.addForm.pics.push({ pic: response.data.tmp_path })
    },
    // 添加商品
    addCate() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return
        // 需要传入动态属性和静态参数
        this.manyParams.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.addForm.attrs.push(newInfo)
        })
        this.onlyParams.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })
        // 克隆的目的是不该表addForm.goods_cat的数据类型，保证数据绑定的级联组件不出错
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        const { data: res } = await this.$http.post('goods', form)
        if (res.meta.status !== 201) return this.$message.error('添加商品失败')
        this.$message.success('添加商品成功')
        this.$router.push('/goods')
      })
    }
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>

<style lang="less" scoped>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
</style>

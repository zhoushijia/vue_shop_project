<template>
  <el-container class="home_container">
    <!-- 头部 -->
    <el-header class="home_header">
      <div>
        <img src="../assets/top.png" alt="" />
        <span>Tom电商后台管理系统</span>
      </div>
      <el-button type="info" @click="loginOut">退出</el-button>
    </el-header>
    <el-container>
      <!-- 左侧栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'" class="home_aside">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 主菜单 -->
        <!-- 1. active-text-color 选中高亮颜色 2. submenu是否只保持一个子菜单的展开unique-opened 3. collapse-transition 必须动态绑定 4. collapse 折叠 5. router 路由链接激活 6. default-active当前激活菜单的 index -->
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#409eff" unique-opened :collapse-transition="false" :collapse="isCollapse" router :default-active="activePath">
          <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i :class="item.icon"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item @click="getActivePath('/' + subitem.path)" :index="'/' + subitem.path" v-for="subitem in item.children" :key="subitem.id">
              <i class="el-icon-menu"></i>
              <span>{{ subitem.authName }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主题内容 -->
      <el-main class="home_main"><router-view></router-view></el-main>
    </el-container>
  </el-container>
</template>

<script>
import hub from '../utils/hub.js'
export default {
  name: 'Home',
  data() {
    return {
      menuList: [],
      icons: ['iconfont icon-user', 'iconfont icon-tijikongjian', 'iconfont icon-shangpin', 'iconfont icon-danju', 'iconfont icon-baobiao'],
      isCollapse: false,
      activePath: ''
    }
  },
  created() {
    hub.$on('getActivePath', this.getActivePath)
    this.getMenuList()
    // 页面刷新后 获得前一次默认点击效果
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    // 实现退出功能
    loginOut() {
      // 需要调用后端接口
      // 清空token信息
      window.sessionStorage.clear()
      // 跳转到登录页
      this.$router.push('/login')
    },
    // 发请求,获取侧边栏数据
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error('获取侧边栏分类失败')
      // 添加图标
      res.data.forEach((item, index) => {
        item.icon = this.icons[index]
      })
      this.menuList = res.data
    },
    // 实现侧边栏的折叠效果
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    // 侧边栏本地持久化 保存默认状态
    getActivePath(activePath) {
      // 存储到sessionStorage中
      window.sessionStorage.setItem('activePath', activePath)
      // 保证点击后的高亮效果
      this.activePath = activePath
    }
  },
  destroyed() {
    hub.$off('getActivePath')
  }
}
</script>

<style lang="less" scoped>
.home_container {
  height: 100%;
}
.home_header {
  background-color: #373d41;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 20px;
  padding-left: 0;
  color: #fff;
  > div {
    display: flex;
    align-items: center;
    img {
      height: 100%;
      border-radius: 50%;
    }
    span {
      margin-left: 15px;
    }
  }
}
.home_aside {
  background-color: #333744;
  // 去除多余边线
  .el-menu {
    border-right: none;
  }
}
.home_main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 10px;
}
.toggle-button {
  text-align: center;
  background-color: #4a5064;
  color: #fff;
  font-size: 10px;
  letter-spacing: 0.2em;
  line-height: 24px;
  cursor: pointer;
}
</style>

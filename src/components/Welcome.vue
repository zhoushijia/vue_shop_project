<template>
  <div>
    <h1>Welcome</h1>
  </div>
</template>
<script>
import hub from '../utils/hub.js'
export default {
  name: 'Welcome',
  created() {
    //##1 定义事件中心自定义事件
    hub.$emit('getActivePath', '')
  }
}
</script>
<style lang="less" scoped></style>

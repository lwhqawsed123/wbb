<template>
  <div id="app">
    <router-view v-if="isRouterAlive" />
  </div>
</template>

<script>
export default  {
  name:  'App',
  provide () {
    return {
      reload: this.reload
    }
  },
  data () {
    return {
      isRouterAlive: true
    }
  },
  created(){
    // console.log('想和我们共同打造世界最大中文互动问答平台吗？\n想让自己的成就在亿万用户面前展现吗？想让世界看得你的光芒吗？\n加入我们，在这里不仅是工作，投入你的时间和热情，滴滴汗水终会汇聚成不平凡的成果。\n期待你的加盟。（投简历地址被我砍了）');
    // console.log("请在邮件中注明%c来自:console", "color:red;font-weight:bold;");
    
    
  },
  methods: {
    reload () {
      this.isRouterAlive = false
      this.$nextTick(function () {
        this.isRouterAlive = true
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  #app{
    width: 100%;
    height: 100%;
  }
</style>

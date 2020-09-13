<template>
  <!-- 移动注册成功提示注册成功页 -->
  <div class="promptSuccess">
    <div class="promptSuccess-main">
      <div class="promptSuccess-tu">
        <div class="promptSuccess-yuan el-icon-check"></div>
      </div>
      <p>
        <b>注册成功~!</b>
        <span>{{time}}秒后返回</span>
      </p>
    </div>
  </div>
</template>

<script>
import "@/utils/rem.js";
export default {
  name: "promptSuccess",
  data() {
    return {
      time: 5
    };
  },
  created(){
      this.countDown()
  },
  methods:{
      countDown(){
          const _this = this;
          let clock = window.setInterval(()=>{
              this.time--
              if(this.time <= 0){
                window.clearInterval(clock);
                _this.$router.push('/moveRegister')
              }
          },1000);
      }
  }
};
</script>

<style lang='scss' scoped>
.promptSuccess {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .promptSuccess-main {
    .promptSuccess-tu {
        display: flex;
        justify-content: center;
      .promptSuccess-yuan {
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
        background-color: #49bf47;
        text-align: center;
        line-height: 2rem;
        color: #fff;
        margin: 0 auto;
      }
    }
    p {
      font-size: 0.5rem;
    }
  }
}
</style>
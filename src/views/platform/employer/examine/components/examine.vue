<template>
  <div class="declare-wrap">
    <div class="wrap-box">
      <h4>批改信息</h4>
      <div class="wrap-box-conter">
        <div style="width:120px;height:80px;border: 1px solid #333;"></div>
      </div>
    </div>
    <div class="wrap-box">
      <h4>批改清单</h4>
      <div class="wrap-box-conter">
        <div class="box-btn btn1">下载清单列表</div>
      </div>
    </div>
    <div class="wrap-box">
      <h4>批改凭证</h4>
      <div class="wrap-box-conter">
        <div style="width:120px;height:80px;border: 1px solid #333;"></div>
      </div>
    </div>
    <!-- 按钮 -->
    <div style="display:flex;margin-left:100px">
      <div class="box-btn btn2">提 交</div>
      <div class="box-btn btn3" style="margin-left:15px" @click="revert">返 回</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "examine-examine",
  data() {
    return {};
  },
  methods:{
      // 返回
      revert(){
          this.$emit('changePage','DETAILED')
      }
  }
};
</script>
<style>
.box-btn {
  width: 120px;
  height: 36px;
  text-align: center;
  line-height: 36px;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
}
.box-btn.btn1 {
  background-color: #f59a23;
  border: 1px solid #f59a23;
}
.box-btn.btn2 {
  background-color: #6aa5f1;
  border: 1px solid #6aa5f1;
}
.box-btn.btn3 {
  /* background-color: #6aa5f1; */
  border: 1px solid #afafaf;
  color: #8f8f8f;
}
</style>
<style lang="scss" scoped>
.declare-wrap {
  padding: 20px;
  box-sizing: border-box;
  color: #606266;
  .wrap-box {
    display: flex;
    padding-bottom: 40px;
    h4{
        width: 80px;
    }
    .wrap-box-conter {
      margin-left: 20px;
    }
  }
}
</style>
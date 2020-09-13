<template>
  <!-- 雇主险定制申报 -->
  <div class="publicStyle">
    <div class="publicStyle-conter">
      <component :is="currentPage" :obj="obj" @changePage="changePage" keep-alive></component>
    </div>
  </div>
</template>

<script>
import declare from "./components/declare";
import print from "./components/print/index";
import upload from "./components/upload/index";
import payment from "./components/payment/index";

export default {
  name: "consult",
  components: {
    DECLARE: declare,
    PRINT:print,
    UPLOAD:upload,
    PAYMENT:payment
  },
  data() {
    return { 
      currentPage: "DECLARE", // DECLARE : 申报页 PRINT:打印页 UPLOAD:上传资料
      obj: {}
    };
  },
  created() {
    
  },
  methods: {
    changePage(page, obj) {
      this.currentPage = page;
      obj && (this.obj = obj);
    }
  }
};
</script>

<style scoped>
@import "../../../../assets/styles/publicStyle.css";
</style>
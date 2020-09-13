<template>
  <!-- 雇主定制保单管理 新增 -->
  <div>
    <component2 :is="currentPage" @changePage2="changePage2" :obj2="obj2" :id="id"  keep-alive></component2>
  </div>
</template>

<script>
import declare from "./childrenComponents/declare";
import print from "./childrenComponents/print/index";
import upload from "./childrenComponents/upload/index";
import payment from "./childrenComponents/payment/index";
export default {
  name: "added-examine",
  props: ["obj"],
  components: {
    DECLARE: declare,
    PRINT:print,
    UPLOAD:upload,
    PAYMENT:payment
  },
  data() {
    return {
      currentPage: "DECLARE",
      obj2:{},
      id:'',
    };
  },
  created() {
      this.id = this.obj.id
    
  },
  methods: {
    changePage2(page,obj2) {
        if(page == 'REVERT'){
            this.$emit('changePage','LIST')
        }else {
            this.currentPage = page;
        }

        obj2 && (this.obj2 = obj2);
    }
  }
};
</script>

<style>
</style>
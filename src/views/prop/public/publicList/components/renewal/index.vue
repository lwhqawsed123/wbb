<template>
  <!-- 公众责任险续保 -->
  <div>
    <component2 :is="currentPage" @changePage2="changePage2" :obj="obj"  :propertyData="propertyData" keep-alive></component2>
  </div>
</template>

<script>
import renewalDclare from "../renewal/childrenComponents/renewalDclare";
import print from './childrenComponents/print/index'
import upload from './childrenComponents/upload/index'
import payment from './childrenComponents/payment/index'
import {
  getPropCompany
} from "@/api/information/information";
export default {
  name: "renewal-examine",
  props: ["idData"],
  components: {
    RENEWAL_DECLARE: renewalDclare,
    PRINTING: print,
    UPLOAD: upload,
    PAYMENT:payment,
  },
  data() {
    return {
      currentPage: "RENEWAL_DECLARE", // RENEWAL_DECLARE:续保页
      addedId: "",
      propertyData:{},
      obj:{}
    };
  },
  created() {
    // 获取物业公司信息
    getPropCompany().then(xhrData => {
      if (xhrData.code === 200) {
        this.propertyData = xhrData.data;
      }
    });
  },
  methods: {
    changePage2(page,obj) {
      if(page == 'RETURN'){
        this.$emit('changePage','LIST')
      }
      this.currentPage = page;
        obj && (this.obj = obj);
    }
  }
};
</script>

<style>
</style>
<template>
  <!-- 公众责任险申报 -->
  <div class="publicStyle">
    <div class="publicStyle-conter">
      <component
        :is="currentPage"
        :arrData="arrData"
        :insData="insData"
        :propertyData="propertyData"
        @changePage="changePage"
        keep-alive
      ></component>
    </div>
  </div>
</template>

<script>

import declare from "./components/declare";
import print from "./components/print/index";
import upload from "./components/upload/index";
import payment from "./components/payment/index";
import {
  getPropCompany
} from "@/api/information/information";
export default {
  name: "examine",
  components: {
    DECLARE: declare,
    PRINTING: print,
    UPLOAD: upload,
    PAYMENT:payment,
  },
  data() {
    return {
      currentPage: "DECLARE", // DECLARE: 申报页  PRINTING：查看并打印页面 UPLOAD:上传页 PAYMENT:确认付款页
      arrData: [],
      propertyData: {},
      insData:{}
    };
  },
  created() {
    // 获取物业公司信息
    getPropCompany().then(xhrData => {
      // console.log(xhrData, "物业公司信息");
      if (xhrData.code === 200) {
        this.propertyData = xhrData.data;
      }
    });
  },
  methods: {
    // page 当前页 arrData 输入的数据 propertyData 物业公司信息
    changePage(page, arrData, propertyData,insData) {
      // console.log(page,arrData,propertyData,insData);
      this.currentPage = page;
      arrData && (this.arrData = arrData);
      propertyData && (this.propertyData = propertyData);
      insData && (this.insData = insData);
    }
  }
};
</script>

<style scoped>
@import "../../../../assets/styles/publicStyle.css";
</style>
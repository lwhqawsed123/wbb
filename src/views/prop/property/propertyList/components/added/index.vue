<template>
  <!-- 公众责任险新增申报 -->
  <div>
    <component2 :is="currentPage" @changePage2="changePage2" :obj="obj" :idData='idData' :addedId="addedId" :propertyData="propertyData" keep-alive></component2>
  </div>
</template>

<script>
import list from "../added/childrenComponents/addedList";
import addedDeclare from "../added/childrenComponents/addedDeclare";
import addedUpload from "../added/childrenComponents/addedUpload";
import {
  getPropCompany
} from "@/api/information/information";
export default {
  name: "added-examine",
  props: ["idData"],
  components: {
    LIST: list,
    ADDED_DECLARE: addedDeclare,
    ADDED_UPLOAD:addedUpload
  },
  data() {
    return {
      currentPage: "LIST",
      addedId: "",
      propertyData:{},
      obj:{}
    };
  },
  created() {
    this.addedId = this.idData.id;
    // 获取物业公司信息
    getPropCompany().then(xhrData => {
      // console.log(xhrData, "物业公司信息");
      if (xhrData.code === 200) {
        this.propertyData = xhrData.data;
      }
    });
  },
  methods: {
    changePage2(page,obj) {
      if(page == 'REVERT'){
        this.$emit("changePage", "LIST");
        return
      }
      this.currentPage = page;
        obj && (this.obj = obj);
    }
  }
};
</script>

<style>
</style>
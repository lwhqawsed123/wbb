<template>
  <!-- 公众责任险退保 -->
  <div>
    <component2 :is="currentPage" @changePage2="changePage2" :obj="idData"  :propertyData="propertyData" keep-alive></component2>
  </div>
</template>

<script>
import list from "../surrender/childrenComponents/surrenderList";
import declare from "../surrender/childrenComponents/surrenderDeclare";
import Upload from "../surrender/childrenComponents/surrenderUpload";
import {
  
} from "@/api/information/information";
export default {
  name: "surrender-examine",
  props: ["idData"],
  components: {
    LIST: list,
    DECLARE:declare,
    UPLOAD:Upload
  },
  data() {
    return {
      currentPage: "LIST",
      propertyData:{},
      obj:{}
    };
  },
  created() {
    this.obj.id = this.idData.id
  },
  methods: {
    changePage2(page,obj) {
      if(page == 'REVERT'){
        this.$emit("changePage", "LIST");
        return
      }
      this.currentPage = page; // LIST：退保列表
        obj && (this.obj = obj);
      //   arrData && (this.arrData = arrData);
    }
  }
};
</script>

<style>
</style>
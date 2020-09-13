<template>
  <!-- 雇主险定制询价 -->
  <div class="publicStyle">
    <div class="publicStyle-conter">
      <component :is="currentPage" :obj="obj" @changePage="changePage" keep-alive></component>
    </div>
  </div>
</template>

<script>
// import "../../../../assets/styles/publicStyle.css";
import inquiry from "./components/inquiry";
import outcome from "./components/outcome";
export default {
  name: "consult",
  components: {
    INQUIRY: inquiry,
    OUTCOME: outcome,
  },
  data() {
    return {
      currentPage: "INQUIRY", //  INQUIRY: 询价 OUTCOME : 结果页
      // currentPage: "OUTCOME", 
      obj: {}
    };
  },
  created() {},
  methods: {
    // page 当前页 arrData 输入的数据 propertyData 物业公司信息
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
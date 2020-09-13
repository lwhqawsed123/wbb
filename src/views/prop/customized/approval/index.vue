<template>
  <!-- 雇主险定制 批单 -->
  <div class="publicStyle">
    <div class="publicStyle-conter">
      <component :is="currentPage" :obj="obj" @changePage="changePage" keep-alive></component>
    </div>
  </div>
</template>

<script>
// import "../../../../assets/styles/publicStyle.css";
import list from "./components/list";
import declare from "./components/declare";
import see from "./components/see";
export default {
  name: "consult",
  components: {
    LIST: list,
    DECLARE:declare,
    SEE:see
  },
  data() {
    return {
      currentPage: "LIST", //  批单列表页
      obj: {}
    };
  },
  created() {},
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
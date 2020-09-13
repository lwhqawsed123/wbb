<template>
  <!-- 雇主险保单管理 -->
  <div class="publicStyle">
    <div class="publicStyle-conter">
      <component :is="currentPage" :obj="obj" @changePage="changePage" keep-alive></component>
    </div>
  </div>
</template>

<script>
// import "../../../../assets/styles/publicStyle.css";
import list from "./components/list";
import see from "./components/see/index";
import added from "./components/added/index";
import replace from "./components/replace/index";
import surrender from "./components/surrender/index";
import again from "./components/again/index";
import correction from "./components/correction/index";
export default {
  name: "rechargeRecord",
  components: {
    LIST: list,
    SEE:see,
    ADDED:added,
    REPLACE:replace,
    SURRENDER:surrender,
    AGAIN:again,
    CORRECTION:correction
  },
  data() {
    return {
      currentPage: "LIST", // LIST: 列表页,
       obj: {}
    };
  },
  methods: {
    changePage(page, obj) {
      this.currentPage = page;
      obj && (this.obj = obj);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../../../assets/styles/publicStyle.css";
</style>
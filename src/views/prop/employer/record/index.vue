<template>
  <!-- 雇主险批单记录 -->
  <div>
    <component :is="currentPage" @changePage="changePage" keep-alive></component>
  </div>
</template>

<script>
import "../../../../assets/styles/publicStyle.css";
import list from "./components/list";
import replace from "./components/replace";
export default {
  name: "rechargeRecord",
  components: {
    LIST: list,
    REPLACE:replace
  },
  data() {
    return {
      currentPage: "LIST" // LIST: 列表页,
    };
  },
  methods: {
    changePage(page) {
      this.currentPage = page;
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
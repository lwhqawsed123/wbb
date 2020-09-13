<template>
  <!-- 雇主批单审核 -->
  <div>
    <component :is="currentPage" @changePage="changePage" keep-alive></component>
  </div>
</template>

<script>
import "../../../../assets/styles/publicStyle.css";
import list from "./components/list";
import see from "./components/see";
export default {
  name: "online",
  components: {
    LIST: list,
    SEE: see
  },
  data() {
    return {
      currentPage: "LIST" // LIST: 列表页 DETAILED: 查看明细 EXAMINE:审核
    };
  },
  methods: {
    changePage(page) {
      // console.log(page);

      this.currentPage = page;
    }
  }
};
</script>

<style>
</style>
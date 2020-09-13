<template>
  <!-- 经办人列表 -->
  <div class="publicStyle">
    <div class="publicStyle-conter">
      <component :is="currentPage" :obj="obj" @changePage="changePage" keep-alive></component>
    </div>
  </div>
</template>

<script>
import "../../../../assets/styles/publicStyle.css";
import list from "./components/list";
import add from "./components/add";
export default {
  name: "operator-components",
  components: {
    LIST: list,
  },
  data() {
    return {
      currentPage: "LIST", //  LIST:经办人列表页
      obj: {}
    };
  },
  created() {},
  methods: {
    // page 当前页 obj 输入的数据 
    changePage(page, obj) {
      this.currentPage = page;
      obj && (this.obj = obj);
    }
  }
};
</script>

<style>
</style>
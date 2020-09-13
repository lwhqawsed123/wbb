<template>
  <!-- 雇主险扩展24小时 -->
  <div class="publicStyle">
    <div class="publicStyle-conter">
      <component :is="currentPage"  @changePage="changePage" keep-alive></component>
    </div>
  </div>
</template>

<script>
import "../../../../assets/styles/publicStyle.css";
import list from './components/list'
import declare from './components/declare'
import printing from './components/print/printing'
export default {
  name: "extend",
  components: {
    LIST: list,
    DECLARE:declare,
    PRINTING:printing
  },
  data() {
    return {
      currentPage: "LIST" // LIST: 列表页,DECLARE:申报页
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
<template>
<!-- 雇主批单审核 -->
  <div class="publicStyle">
    <div class="publicStyle-conter">
      <component :is="currentPage"  @changePage="changePage" keep-alive></component>
    </div>
  </div>
</template>

<script>
import "../../../../assets/styles/publicStyle.css";
import list from './components/list'
import detailed from './components/detailed'
import examine from './components/examine'
export default {
  name:'examine',
  components: {
    LIST: list,
    DETAILED:detailed,
    EXAMINE:examine,
  },
  data() {
    return {
      currentPage: "LIST" // LIST: 列表页 DETAILED: 查看明细 EXAMINE:审核
    }
  },
  methods: {
    changePage(page) {
      this.currentPage = page;
    }
  }
}
</script>

<style>

</style>
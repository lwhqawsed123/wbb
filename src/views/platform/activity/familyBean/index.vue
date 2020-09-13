<template>
<!-- 雇主批单审核 -->
  <div class="publicStyle">
    <div class="publicStyle-conter">
      <component :is="currentPage" :obj='obj'  @changePage="changePage" keep-alive></component>
    </div>
  </div>
</template>

<script>
import "../../../../assets/styles/publicStyle.css";
import list from './components/list'
import add from './components/add'
import see from './components/see'
import modify from './components/modify'
export default {
  name:'examine',
  components: {
    LIST: list,
    ADD:add,
    SEE:see,
    MODIFY:modify
  },
  data() {
    return {
      currentPage: "LIST" ,// LIST: 列表页 
      obj:{}
    }
  },
  methods: {
    changePage(page,obj) {
      this.currentPage = page;
       obj && (this.obj = obj);
    }
  }
}
</script>

<style>

</style>
<template>
  <!-- 雇主保单管理 批改 -->
  <div>
    <component2 :is="currentPage" @changePage2="changePage2" :obj2="obj2" :id="id"  keep-alive></component2>
  </div>
</template>

<script>
import list from "../replace/childrenComponents/list";
export default {
  name: "added-examine",
  props: ["obj"],
  components: {
    LIST: list,
  },
  data() {
    return {
      currentPage: "LIST",
      obj2:{},
      id:'',
    };
  },
  created() {
      this.id = this.obj.id
    
  },
  methods: {
    changePage2(page,obj2) {
        if(page == 'REVERT'){
            this.$emit('changePage','LIST')
        }else {
            this.currentPage = page;
        }

        obj2 && (this.obj2 = obj2);
    }
  }
};
</script>

<style>
</style>
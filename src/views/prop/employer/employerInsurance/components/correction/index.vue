<template>
  <!-- 雇主保单管理 新增 -->
  <div>
    <component2  :is="currentPage" @changePage2="changePage2"  :id="id" :obj2="obj2"  keep-alive></component2>
  </div>
</template>

<script>
import list from "../correction/childrenComponents/employerCorrectionList";
import correction from "../correction/childrenComponents/employerCorrection";
export default {
  name: "correction-index",
  props: ["obj"],
  components: {
    LIST: list,
    CORRECTION:correction
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
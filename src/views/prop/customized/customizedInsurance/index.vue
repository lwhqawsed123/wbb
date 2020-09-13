<template>
  <!-- 雇主险定制保单管理 -->
  <div class="publicStyle">
    <div class="publicStyle-conter">
      <component :is="currentPage" :obj="obj" @changePage="changePage" keep-alive></component>
    </div>
  </div>
</template>

<script>

import list from "./components/list";
import added from './components/added/index'
import see from './components/see/index'
import surrender from './components/surrender/index'
import replace from './components/replace/index'
import policy from './components/policy/index'
import renewal from './components/renewal/index'
export default {
  name: "consult",
  components: {
    LIST: list,
    ADDED:added,
    REPLACE:replace,
    SEE:see,
    SURRENDER:surrender,
    POLICY:policy,
    RENEWAL:renewal
  },
  data() {
    return {
      currentPage: "LIST", //  LIST: 雇主保单管理页
      obj: {}
    };
  },
  created() {},
  methods: {
    // page 当前页 arrData 输入的数据 propertyData 物业公司信息
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
<template>
  <!-- 责任险保单管理 -->
  <div class="publicStyle">
    <div class="publicStyle-conter">
      <component :is="currentPage" :idData="idData" @changePage="changePage" keep-alive></component>
    </div>
  </div>
</template>

<script>
import "../../../../assets/styles/publicStyle.css";
import list from "./components/list";
import added from "./components/added/index";
import see from "./components/see/index";
import surrender from "./components/surrender/index";
import policy from "./components/policy/index";
import renewal from "./components/renewal/index";
export default {
  name: "examine",
  components: {
    LIST: list,
    ADDED:added,
    SEE:see,
    SURRENDER:surrender,
    POLICY:policy,
    RENEWAL:renewal
  },
  data() {
    return {
      currentPage: "LIST", //  LIST:保单管理页 ADDED: 新增列表页 SEE: 查看列表页 SURRENDER:退保列表页
      idData: {}
    };
  },
  created() {},
  methods: {
    // page 当前页 arrData 输入的数据 propertyData 物业公司信息
    changePage(page, idData) {
      this.currentPage = page;
      idData && (this.idData = idData);
    }
  }
};
</script>

<style>
</style>
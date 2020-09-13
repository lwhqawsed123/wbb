<template>
  <!-- 雇主险保单管理 -->
  <div class="publicStyle">
    <div class="publicStyle-conter">
      <!-- <div class="legal-tab">
        <div class="legal-tab-header" :class="activePage==='application'?'active':''" @click="changeActive('application')">委托申请</div>
        <div class="legal-tab-header" :class="activePage==='record'?'active':''" @click="changeActive('record')">委托记录</div>
        <div class="legal-line-bottom"></div>
      </div> -->
      <component :is="currentPage" :obj="obj" @changePage="changePage" keep-alive></component>
    </div>
  </div>
</template>

<script>
import "../../../../assets/styles/publicStyle.css";
import list from "./components/list";
import see from "./components/see/index";
export default {
  name: "legalCounselRecord",
  components: {
    LIST: list,
    SEE:see
  },
  data() {
    return {
      currentPage: "LIST", // application: 申请页,
      obj: {},
      activePage: "LIST", // record: 列表页,

    };
  },
  methods: {
    changePage(page, obj) {
      this.currentPage = page;
      obj && (this.obj = obj);
    },
    changeActive(page){
      this.activePage=page
      this.changePage(page)
    }
  }
};
</script>

<style lang="scss" scoped>
.legal-tab {
  width: 100%;
  height: 30px;
  display: flex;
  font-size: 14px;

  .legal-tab-header {
    padding: 0 14px;
    text-align: center;
    color: #000000;
    background-color: #d7d7d7;
    border: 1px solid #000000;
    box-sizing: border-box;
    line-height: 30px;
    cursor: pointer;
    &:nth-child(1){
      border-right: none;
    }
  }
  .legal-line-bottom {
    width: 200px;
    height: 100%;
    border-bottom: 1px solid #000000;
  }
  .active {
    background-color: #ffffff;
    border-bottom: none;

  }
}
</style>
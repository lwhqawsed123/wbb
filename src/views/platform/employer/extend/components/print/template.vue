<!--打印清单-->
<template>
  <div class="printf-template" style="display: none">
    <!--打印html-->
    <div id="printf-box">
      <h4>投保公司</h4>
      <div class="wrap-box">
        <p>
          物业公司名称：
          <span>{{policyInfo.name1}}</span>
        </p>
        <p>
          物业公司纳税识别号：
          <span>{{policyInfo.name2}}</span>
        </p>
        <p>
          联系人：
          <span>{{policyInfo.name3}}</span>
        </p>
        <p>
          联系方式：
          <span>{{policyInfo.name4}}</span>
        </p>
        <p>
          物业公司地址：
          <span>{{policyInfo.name5}}</span>
        </p>
      </div>
      <h4>批改清单</h4>
      <div class="wrap-box2">
        <table width="1000" cellspacing="0" align="center">
          <caption align="center">雇主责任险清单</caption>
          <tr align="center">
            <td>序号</td>
            <td>项目名称</td>
            <td>雇员姓名</td>
            <td>雇员身份证</td>
            <td>雇员手机</td>
            <td>有/无社保</td>
            <td>批改类型</td>
            <td>保单开始时间</td>
            <td>保单结束时间</td>
          </tr>
          <tr align="center" v-for="(item,index) in policyList" :key="index">
            <td>{{index+1}}</td>
            <td>{{item.name}}</td>
            <td>{{item.bName}}</td>
            <td>{{item.sfz}}</td>
            <td>{{item.sj}}</td>
            <td>{{item.sb}}</td>
            <td>{{item.xz}}</td>
            <td>{{item.ks}}</td>
            <td>{{item.js}}</td>
          </tr>
        </table>
      </div>
    </div>

    <!--打印css-->
    <div id="CSS_PRINT" style="display: none">
      * {
      margin: 0;
      padding: 0;
      }
      #printf-box{
      padding:20px;
      box-sizing: border-box;
      }
      .wrap-box {
      width: 60%;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      margin-left: 100px;
      }
      .wrap-box p{
      width: 50%;
      height: 50px;
      }
      .wrap-box2{
      margin-left: 100px;
      }
      .wrap-box p {
      width: 50%;
      height: 50px;
      }
      .wrap-box2 table{
      border-collapse: collapse;
      }
      .wrap-box2 tr{
      height: 50px;
      border: 1px solid #000;
      }
      .wrap-box2 td{
      border: 1px solid #000;
      }
      .wrap-box2 caption{
      border: 1px solid #000;
      border-bottom: none;
      height: 40px;
      line-height: 40px;
      }
    </div>
  </div>
</template>

<script>
export default {
  name: "printf-page-template",
  props: {
    policyInfo: {
      type: Object,
      default: {}
    },
    policyList: {
      type: Array,
      default: []
    }
  },
  data() {
    return {};
  },
  created() {},
  mounted() {
    // console.log("mounted");
  },
  methods: {}
};
</script>

<style lang='scss' scoped>
</style>

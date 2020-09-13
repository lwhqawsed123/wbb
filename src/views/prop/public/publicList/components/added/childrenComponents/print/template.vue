<!--打印清单-->
<template>
  <div class="printf-template" style="display: none">
    <!--打印html-->
    <div id="printf-box1">
      <h4>投保公司</h4>
      <div class="wrap-box">
        <p>
          物业公司名称：
          <span>{{policyInfo.name || ""}}</span>
        </p>
        <p>
          物业公司纳税识别号：
          <span>{{policyInfo.certNo || ""}}</span>
        </p>
        <p>
          联系人：
          <span>{{policyInfo.contact || ""}}</span>
        </p>
        <p>
          联系方式：
          <span>{{policyInfo.contact_no || ""}}</span>
        </p>
        <p>
          物业公司地址：
          <span>{{policyInfo.address || ""}}</span>
        </p>
      </div>
      <h4>批改清单</h4>
      <div class="wrap-box2">
        <table width="1000" cellspacing="0" align="center">
          <caption align="center">公众责任险清单</caption>
          <tr align="center">
            <td>序号</td>
            <td>项目名称</td>
            <td >项目地址</td>
            <td>小区类型</td>
            <td>投保份数</td>
            <td>投保起始日期</td>
            <td>投保结束日期</td>
            <td>项目占地面积(万平方米)</td>
            <td>是否有游泳池</td>
          </tr>
          <tr align="center" v-for="(item,index) in policyList" :key="index">
            <td class="printing1-td1">{{index+1}}</td>
            <td class="printing1-td2">{{item.name.name}}</td>
            <td class="printing1-td3">{{item.diziData}}</td>
            <td class="printing1-td4">{{item.type}}</td>
            <td class="printing1-td5">{{item.share}}</td>
            <td class="printing1-td6">{{item.startTime}}</td>
            <td class="printing1-td6">{{item.endTime}}</td>
            <td class="printing1-td7">{{item.mj}}</td>
            <td class="printing1-td8">{{item.yc}}</td>
          </tr>
        </table>
      </div>
      <div id="printing1">打印</div>
    </div>

    <!--打印css-->
    <div id="CSS_PRINT1" style="display: none">
      * {
      margin: 0;
      padding: 0;
      }
      #printf-box{
      padding:20px;
      box-sizing: border-box;
      }
      .wrap-box {
      width: 1000px;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      padding-top:20px;
      }
      .wrap-box p{
      width: 50%;
      height: 50px;
      }
      .wrap-box2{
      padding-top:20px;
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
      padding:5px;
      box-sizing: border-box;
      min-width:80px;
      }
      .wrap-box2 caption{
      border: 1px solid #000;
      border-bottom: none;
      height: 40px;
      line-height: 40px;
      }
      .wrap-box2 .printing1-td1{
        width:2%
      }
      .wrap-box2 .printing1-td2{
        width:10%
      }
      .wrap-box2 .printing1-td3{
        width:30%
      }
      .wrap-box2 .printing1-td4{
        width:10%
      }
      .wrap-box2 .printing1-td5{
        width:10%
      }
      .wrap-box2 .printing1-td6{
        width:15%
      }
      .wrap-box2 .printing1-td7{
        width:10%
      }
      .wrap-box2 .printing1-td8{
        width:10%
      }
      #printing1{
          display: block;
          width: 50px;
          height: 50px;
          border: 1px solid #ddd;
          border-radius: 50%;
          text-align: center;
          line-height: 50px;
          font-size: 14px;
          background-color: #ddd;
          margin-left:475px;
          cursor: pointer;
          margin-top:30px;
      }
    </div>
     <!-- 方法 -->
    <div id="SCRIPT_PRINT1" style="display: none">
      document.title = "打印";
      var printf1 = document.getElementById('printing1')
      printf1.onclick = function(){
        this.style.display = 'none'
        window.print();
        window.close();
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

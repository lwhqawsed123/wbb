<!--打印清单-->
<template>
  <div class="printf-template" style="display: none">
    <!--打印html-->
    <div id="printf-box2">
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
          <caption align="center">雇主责任险清单</caption>
          <tr align="center">
            <td>序号</td>
            <td>项目名称</td>
            <td >雇员姓名</td>
            <td>身份证号</td>
            <td>手机号</td>
            <td>有/无社保</td>
          </tr>
          <tr align="center" v-for="(item,index) in policyList" :key="index">
            <td class="printing2-td1">{{index+1}}</td>
            <td class="printing2-td2">{{item.project}}</td>
            <td class="printing2-td3">{{item.name}}</td>
            <td class="printing2-td4">{{item.idCard}}</td>
            <td class="printing2-td5">{{item.phone}}</td>
            <td class="printing2-td6">{{item.isSocialSecurity}}</td>
          </tr>
        </table>
      </div>
      <!-- <div id="printing2">打印</div> -->
       <div id="printing2-btn">
            <div id="printing2-btn1">确认</div>
            <div id="printing2-btn2">返回</div>
        </div>
    </div>

    <!--打印css-->
    <div id="CSS_PRINT2" style="display: none">
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
      .wrap-box2 .printing2-td1{
        width:2%
      }
      .wrap-box2 .printing2-td2{
        width:10%
      }
      .wrap-box2 .printing2-td3{
        width:15%
      }
      .wrap-box2 .printing2-td4{
        width:25%
      }
      .wrap-box2 .printing2-td5{
        width:10%
      }
      .wrap-box2 .printing2-td6{
        width:15%
      }
      .wrap-box2 .printing2-td7{
        width:10%
      }
      .wrap-box2 .printing2-td8{
        width:10%
      }
      #printing2{
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
       #printing2-btn{
          display: flex;
      }
      #printing2-btn1{
          width: 120px;
          height: 36px;
          padding: 0 10px;
          box-sizing: border-box;
          border-radius: 4px;
          line-height: 36px;
          text-align: center;
          background-color: #169bd5;
          color: #fff;
          cursor: pointer;
          margin-left:405px;
          margin-top: 50px;
      }
      #printing2-btn2{
          width: 120px;
          height: 36px;
          padding: 0 10px;
          box-sizing: border-box;
          border-radius: 4px;
          line-height: 36px;
          text-align: center;
          border: 1px solid #333;
          color: #333;
          cursor: pointer;
          margin-top: 50px;
          margin-left: 10px;
      }
    </div>
     <!-- 方法 -->
    <div id="SCRIPT_PRINT2" style="display: none">
      <!-- var printf2 = document.getElementById('printing2')
      printf2.onclick = function(){
        this.style.display = 'none'
        window.print();
        window.close();
      } -->
       document.title = "打印";
      var printf1 = document.getElementById('printing2-btn1')
      var printf2 = document.getElementById('printing2-btn2')
      printf1.onclick = function(){
        window.opener.document.getElementById("b").innerText='确认';
        setTimeout(function(){
           window.close();
        },500)
      }
      printf2.onclick = function(){
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
  created() {
    this.policyList.forEach(item=>{
      if(item.isSocialSecurity == '0'){
        item.isSocialSecurity = '无'
      }else if(item.isSocialSecurity == '1'){
        item.isSocialSecurity = '有'
      }
    })
  },
  mounted() {
  },
  methods: {}
};
</script>

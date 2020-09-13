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
            <td>雇员姓名</td>
            <td>雇员身份证号</td>
            <td>雇员手机号</td>
            <td>有/无社保</td>
            <td>批改类型</td>
            <td>投保时间</td>
            <td>保单结算时间</td>
          </tr>
          <tr align="center" v-for="(item,index) in policyList" :key="index">
            <td class="printing2-td1">{{index+1}}</td>
            <!-- 项目名称 -->
            <td class="printing2-td2">{{item.compProjectName}}</td>
            <!-- 雇员姓名 -->
            <td class="printing2-td3">{{item.name}}</td>
            <!-- 被保人身份证 -->
            <td class="printing2-td4">{{item.idCard}}</td>
            <!-- 被保人手机号 -->
            <td class="printing2-td5">{{item.phone}}</td>
            <!-- 有无社保 -->
            <td class="printing2-td6">{{item.isSocialSecurity == '0' ? '无':'有' }}</td>
            <!-- 批改类型 -->
            <td class="printing2-td7">{{handle(item.type)}}</td>
            <!-- 投保时间 -->
            <td class="printing2-td8">{{item.startTime.split(' ')[0]}}</td>
            <!-- 保单结算时间 -->
            <td class="printing2-td9">{{item.endTime.split(' ')[0]}}</td>
          </tr>
        </table>
      </div>
      <div id="printing2">打印</div>
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
      .wrap-box2 .printing2-td1{
        width:2%
      }
      .wrap-box2 .printing2-td2{
        width:20%
      }
      .wrap-box2 .printing2-td3{
        width:18%
      }
      .wrap-box2 .printing2-td4{
        width:10%
      }
      .wrap-box2 .printing2-td5{
        width:10%
      }
      .wrap-box2 .printing2-td6{
        width:5%
      }
      .wrap-box2 .printing2-td7{
        width:8%
      }
      .wrap-box2 .printing2-td8{
        width:13%
      }
      .wrap-box2 .printing2-td9{
        width:14%
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
    </div>
     <!-- 方法 -->
    <div id="SCRIPT_PRINT2" style="display: none">
       document.title = "打印";
      var printf2 = document.getElementById('printing2')
      printf2.onclick = function(){
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
//   props: {
//     policyInfo: {
//       type: Object,
//       default: {}
//     },
//     policyList: {
//       type: Array,
//       default: []
//     }
//   },
  props:['policyInfo','policyList'],
  data() {
    return {};
  },
  created() {
    
  },
  mounted() {
    //   this.policyList.forEach(item=>{
    //   if(item.isSocialSecurity == '0'){
    //     item.isSocialSecurity = '无'
    //   }else if(item.isSocialSecurity == '1'){
    //     item.isSocialSecurity = '有'
    //   }
    //   if(item.type == '0'){
    //       item.type = '投保'
    //   }else if(item.type == '1'){
    //       item.type = '新增'
    //   }else if(item.type == '2'){
    //       item.type = '退保 '
    //   }
    //   item.startTime = item.startTime.split(' ')[0]
    //   item.endTime = item.endTime.split(' ')[0]
    // })
  },
  methods: {
      handle(type){
          if(type == '0'){
              return type = '投保'
          }else if(type == '1'){
            return  type = '新增'
          }else if(type == '2'){
            return  type = '退保'
          }
      }
  }
};
</script>

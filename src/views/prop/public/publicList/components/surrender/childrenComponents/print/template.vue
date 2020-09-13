<!--打印清单-->
<template>
  <div class="printf-template" style="display: none">
    <!--打印html-->
    <div id="printf-box1">
        <div class="wrap-box2">
          <table width="1000" cellspacing="0" align="center">
            <caption align="center">保险事项变更申请书</caption>
            <tr align="center">
              <td class="wrap-box2-width1">投保人</td>
              <td class="wrap-box2-width2">物保宝科技(广东)有限公司</td>
            </tr>
            <tr align="center">
              <td class="wrap-box2-width1">被保险人</td>
              <td class="wrap-box2-width2">{{formData.name}}</td>
            </tr>
            <tr align="center">
              <td class="wrap-box2-width1">退保项目</td>
              <td class="wrap-box2-width2">{{formData.projectName}}</td>
            </tr>
            <tr align="center">
              <td class="wrap-box2-width1">保单号码</td>
              <td class="wrap-box2-width2">{{formData.orderNo}}</td>
            </tr>
            <tr align="center">
              <td class="wrap-box2-width1">保险起止日期</td>
              <td class="wrap-box2-width2">{{formData.beforeTime}} 至 {{formData.startTime}}</td>
            </tr>
            <tr align="center">
              <td class="wrap-box2-width1">申请变更原因</td>
              <td class="wrap-box2-width2">本公司要求退保</td>
            </tr>
            <tr>
              <td colspan="2">投保人（被保险人）签章：<p class="wrap-box2-p">年&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;日</p></td>
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
      .wrap-box2-width1{
        width:30%
      }
      .wrap-box2-width2{
        width:70%
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
      .wrap-box2-p{
          text-align: right;
          height: 80px;
          line-height: 120px;
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
      console.log(this.formData)
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
  props: ['formData'],
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

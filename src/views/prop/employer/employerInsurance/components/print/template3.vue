<!--打印清单-->
<template>
  <div class="printf-template" style="display: none">
    <!--打印html-->
    <!--打印html-->
     <div id="printf-box1">
        <div id="printing123">
          <div class="printf-box-page">
              <div class="printf-box-header">
                  <img class="logo" :src="logoImg" alt="">
              </div>
                  <div class="printf-box-content">
                      <div class="page-title">雇主责任险电子批单</div>
                      <div class="page-title title">
                        </div>
                      <div class="page-title title2"></div>
                      <div class="page-table">
                          <table border="0" cellspacing="0" cellpadding="0">
                              <!--rowspan colspan-->
                              <!--投保人信息-->
                              <tr class="hidden">
                                  <!-- 20 -->
                                  <td style="width: 100px;min-width: 200px">&nbsp;</td>
                                  <!-- 200 -->
                                  <td style="width: 220px">&nbsp;</td>
                                  <td style="width: 180px">&nbsp;</td>
                                  <td style="width: 200px">&nbsp;</td>
                              </tr>
                              <tr>
                                  <td class="title" colspan="1">批单号：</td>
                                  <td class="title" colspan="1">{{printData.reviseNo}}</td>
                                  <td class="title" colspan="1">保单号：</td>
                                  <td class="title" colspan="1">{{printData.policyNo}}</td>
                              </tr>
                              <tr>
                                  <td class="title" colspan="1">被保险人：</td>
                                  <td class="title" colspan="3">{{printData.compName}}</td>
                              </tr>
                              <tr>
                                  <td class="title left" colspan="4" >批文：</td>
                              </tr>
                              <tr>
                                  <td class="title lt" colspan="4" >兹经投保人申请，公司同意自  起，对保单做如下批改：</td>
                              </tr>
                              <tr>
                                  <td class="title lt" colspan="4" >被保险人投保雇员由 {{printData.beforeNum}} 人变更为 {{printData.currentNum}} 人</td>
                              </tr>
                              <tr>
                                  <td class="title lt" colspan="4" >累计责任限额由 {{printData.beforeLimit}} 变更为 {{printData.currentLimit}} </td>
                              </tr>
                              <tr>
                                  <td class="title lt" colspan="4" >后附投保雇员变更名单</td>
                              </tr>
                          </table>
                          <div class="page-title title tn">
                            本保单所载其他条件不变，特此批注。<br>
                            签单日期：{{printData.createTime}}<br>
                            服务电话：0571-95519-2<br>
                            网址：www.chinal<br>
                          </div>
                          <table width="706" cellspacing="0" align="center" v-if="printData.newList.length">
                            <caption align="center">添加雇员名单</caption>
                            <tr align="center">
                            <td class="printing2-td1">序号</td>
                            <td class="printing2-td2">姓名</td>
                            <td class="printing2-td3">身份证号</td>
                            <td class="printing2-td4">工种</td>
                            <td class="printing2-td5">保单有效期</td>
                            </tr>
                            <tr align="center" v-for="(item,index) in printData.newList" :key="index" >
                                <td >{{index+1}}</td>
                                <td >{{item.name}}</td>
                                <td >{{item.idCard}}</td>
                                <td >{{item.jobName}}</td>
                                <td >{{item.startTime | filterTime}}至{{item.endTime | filterTime}}</td>
                            </tr>
                           </table>
                          <table width="706" cellspacing="0" align="center" v-if="printData.returnList.length">
                            <caption align="center">减少雇员名单</caption>
                            <tr align="center">
                            <td class="printing2-td1">序号</td>
                            <td class="printing2-td2">姓名</td>
                            <td class="printing2-td3">身份证号</td>
                            <td class="printing2-td4">工种</td>
                            <td class="printing2-td5">保单有效期</td>
                            </tr>
                            <tr align="center" v-for="(item,index) in printData.returnList" :key="index" >
                                <td >{{index+1}}</td>
                                <td >{{item.name}}</td>
                                <td >{{item.idCard}}</td>
                                <td >{{item.jobName}}</td>
                                <td >{{item.startTime | filterTime}}至{{item.endTime | filterTime}}</td>
                            </tr>
                           </table>
                      </div>
                  </div>
                  <div class="printf-box-footer"></div>
              </div>
        </div>
         <div id="printing1">打印</div>
      </div>
    
   
    <!--打印css-->
    <div id="CSS_PRINT1" style="display: none">
      * {
        margin: 0;
        padding: 0;
    }

    #printf-box1 {
        width: 706px;
        /*padding: 43px 33px;*/
        background: #fff;
    }

    #printf-box1 .printf-box-page {
        page-break-after: always;
    }

    #printf-box1 .printf-box-header img.logo {
        display: inline-block;
        width: 100%;
        height: 75px;
    }

    #printf-box1 .printf-box-content .page-title {
        margin-top: 50px; 
        font-size: 19px;
        text-align: center;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        font-weight: bold;
        color: rgba(0, 0, 0, 1);
        line-height: 29px;
    }

    #printf-box1 .printf-box-content .page-title.title {
        margin-top: 0px;
        text-indent: 2em;
        font-size: 14px;
        text-align: left;
        line-height: 20px;
        font-weight: normal;
    }

    #printf-box1 .printf-box-content .page-title.title2 {
        margin-top: 5px;
        font-size: 16px;
        text-align: center;
        line-height: 20px;
        letter-spacing: 10px;
    }

    #printf-box1 .printf-box-content .page-table {
        margin: 0px auto 0;
    }

    #printf-box1 .printf-box-content .page-table .subText {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        line-height: 27px;
        margin-bottom: 7px;
    }

    .text-pageNum {
        float: right;
    }

    #printf-box1 .printf-box-content .page-table table {
        table-layout: fixed;
        border-collapse: separate;
        text-align: left;
        border-right: 1px solid #333;
        border-bottom: 1px solid #333;
    }

    #printf-box1 .printf-box-content .page-table tr.hidden {
        visibility: hidden;
        height: 0;
        line-height: 0;
        border: none;
        overflow: hidden;
    }

    #printf-box1 .printf-box-content .page-table tr.hidden td {
        visibility: hidden;
        height: 1;
        line-height: 0;
        padding: 0;
        border: none;
        overflow: hidden;
    }

    #printf-box1 .printf-box-content .page-table tr {
        line-height: 30px;
    }

    #printf-box1 .printf-box-content .page-table td {
        border-left: 1px solid #333;
        border-top: 1px solid #333;
        height: 16px;
        font-size: 13px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(0, 0, 0, 1);
        line-height: 16px;
        padding: 8px 4px 8px 4px;
        word-break: break-all;
        white-space: pre-wrap;
    }

    #printf-box1 .printf-box-content .page-table .noBorderTop td {
        border-top: none;
    }

    #printf-box1 .printf-box-content .page-table td.title {
        height: 16px;
        font-size: 13px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: rgba(0, 0, 0, 1);
        line-height: 16px;
        padding: 8px 4px 8px 4px;
        text-align: center;
    }

    #printf-box1 .printf-box-content .page-table td.title.left {
        text-align: left;
        /* line-height: 30px; */
        font-weight: bold;
        font-size: 14px;
    }
    #printf-box1 .printf-box-content .page-table td.title.lt {
        text-align: left;
    }

    #printf-box1 .printf-box-content .page-table span.title.span1 {
        color: red;
    }

    #printf-box1 .printf-box-content .page-table span.title.span2 {
        color: red;
        margin-left: 50px;
    }

    #printf-box1 .printf-box-content .page-table span.title.right {
        text-align: right;
        /* color:red */
        margin-left: 150px;
    }

    #printf-box1 .printf-box-content .page-table td.conter {
        text-align: center;
    }

    #printf-box1 .printf-box-content .page-table td.conter.p {
        /* display: flex; */
        /* flex-wrap:wrap */
        text-align: left;
    }

    #printf-box1 .printf-box-content .page-table td.conter.p p {
        text-align: left;
        /* display: flex; */
        display: inline-block;
        align-items: center;
        margin-right: 20px;
        /* vertical-align: bottom; */

    }

    #printf-box1 .printf-box-content .page-table td.conter.p p span {
        display: inline-block;
        width: 10px;
        height: 10px;
        border: 1px solid #000;
        margin-right: 3px;

    }

    #printf-box1 .printf-box-content .page-table td.span p span {
        display: inline-block;
        width: 10px;
        height: 10px;
        border: 1px solid #000;
        margin-right: 5px;
        text-align: center;
        line-height: 10px;
        font-weight: bold;
    }

    #printf-box1 .printf-box-content .page-table td .text-sign {
        margin-top: 16px;
        text-align: left;
    }

    #printf-box1 .printf-box-content .page-table td .text-date {
        text-align: right;
    }

    #printf-box1 .printf-box-content .page-table .text-remark {
        margin-top: 13px;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        line-height: 27px;
    }

    #printf-box1 .printf-box-content .page-table .text-sign {
        margin-top: 27px;
    }

    #printf-box1 .printf-box-content .page-table .text-sign .sign-name {
        font-size: 12px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
        line-height: 27px;
        text-align: right;
    }

    #printf-box1 .printf-box-content .page-table .text-sign .sign-date {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        line-height: 27px;
        text-align: right;
    }

    #printf-box1 .printf-box-content .page-table .text-sign .sign-date span {
        padding: 0 10px;
    }

    #printf-box1 .page-break-after {
        page-break-after: always;
    }
    #printf-box1 .wrap-box2{
      padding-top:20px;
      }
    #printf-box1 .wrap-box p {
      width: 50%;
      height: 50px;
      }
    #printf-box1 .wrap-box2 table{
      border-collapse: collapse;
      }
      .wrap-box2 tr{
      height: 50px;
      border: 1px solid #000;
      
      }
     #printf-box1 .wrap-box2 td{
     border: 1px solid #000;
      padding:5px;
      box-sizing: border-box;
      min-width:80px;
      }
     #printf-box1 .wrap-box2 caption{
      border: 1px solid #000;
      border-bottom: none;
      height: 40px;
      line-height: 40px;
      }
    #printf-box1 .printing2-td1{
        width:25px
      }
     #printf-box1 .printing2-td2{
        width:40px
      }
     #printf-box1 .printing2-td3{
        width:120px
      }
     #printf-box1 .printing2-td4{
        width:50px
      }
     #printf-box1 .printing2-td5{
        width:80px
      }
     /* #printf-box1 .printing2-td6{
        width:15%
      }
     #printf-box1 .printing2-td7{
        width:10%
      }
     #printf-box1 .printing2-td8{
        width:10%
      } */

    #printing1 {
        display: block;
        width: 50px;
        height: 50px;
        border: 1px solid #ddd;
        border-radius: 50%;
        text-align: center;
        line-height: 50px;
        font-size: 14px;
        background-color: #ddd;
        margin-left: 300px;
        cursor: pointer;
    }
    #policy{
        text-align: right;
        margin-right: 50px;
        padding: 5px 0;
        box-sizing: border-box;
    }
    #printf-box1 .printf-box-content .page-title.title.tn{
        padding: 5px 0;
        text-indent: 0em;
    }
    </div>
    <!-- 方法 -->
    <div id="SCRIPT_PRINT1" style="display: none">
       <!-- var ele= document.createElement("script");
        ele.setAttribute("type", "text/javascript");
        ele.setAttribute("src", "/boss/utils/canvas.js");
        document.body.appendChild(ele);
        var image;
        setTimeout(function(){
          html2canvas(document.getElementById('printing123'), {
            background: "#fff",
            onrendered: function(canvas) {
                 convertCanvasToImage(canvas)
            }
        })
         function convertCanvasToImage(canvas) {
            image = new Image();
            image.src = canvas.toDataURL("image/png");
            console.log(image.src)
          }
      },1000 * 1) -->
      var printf1 = document.getElementById('printing1')
      document.title = "电子批单";
      printf1.onclick = function(){
        console.log(1)
        this.style.display = 'none'

        window.print();
        <!-- window.opener.document.getElementById("abc").innerText=image.src; -->
        window.close();
      }

    </div>

  </div>
</template>

<script>
export default {
  name: "printf-page-template3",
  props: ['printData'],
  data() {
    return {
      liveLength: 0,
      NonLiveLength: 0,
      isExistence1: false,
      isExistence2: false,
      logoImg: require('./ins_renshou.png')
    };
  },
  filters:{
      filterTime(val){
          return val.split(' ')[0]
      }
  },
  created() {
  },
  mounted() {

  },
  methods: {
      
  }
};
</script>

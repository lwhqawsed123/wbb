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
                      <div class="page-title">批单(ENDORSEMENT)</div>
                      <div class="page-title title">
                        特别提示：尊敬的客户，您可通过富德财产保险股份有限公司24小时服务电话40066-95535，公司网站www.fundins.com或公司营业网点柜台核实承保和理赔信息。若对查询结果有异议，请通过以上三种渠道与本公司联系。
                      </div>
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
                                  <td class="title" colspan="1">险种：</td>
                                  <td class="title" colspan="1">雇主责任险</td>
                                  <td class="title" colspan="1">保单号：</td>
                                  <td class="title" colspan="1">{{printData.policyNo}}</td>
                              </tr>
                              <tr>
                                  <td class="title" colspan="1">被保险人：</td>
                                  <td class="title" colspan="1">{{printData.PropCompanyName}}</td>
                                  <td class="title" colspan="1">批单号：</td>
                                  <td class="title" colspan="1">{{printData.reviseNo}}</td>
                              </tr>
                              <tr>
                                  <td class="title left" colspan="4" >批文：</td>
                              </tr>
                              <tr>
                                  <td class="title lt" colspan="4" >根据投保人/被保险人申请，保险人同意，{{printData.startTime}}  保险单内容变更如下</td>
                              </tr>
  
                          </table>
                          <div class="page-title title tn">
                            被保险人投保雇员由{{printData.beforeNum}}人变更为{{printData.afterNum}}人，新增{{list.length}}人
                          </div>
                          <table width="706" cellspacing="0" align="center">
                            <caption align="center">增加雇员名单</caption>
                            <tr align="center">
                            <td>序号</td>
                            <td>姓名</td>
                            <td>身份证号</td>
                            <td>工种</td>
                            <td>保单有效期</td>
                            </tr>
                            <tr align="center" v-for="(item,index) in list" :key="index">
                                <td class="printing2-td1">{{index+1}}</td>
                                <td class="printing2-td2">{{item.name}}</td>
                                <td class="printing2-td4">{{item.idCard}}</td>
                                <td class="printing2-td3">{{item.jobName}}</td>
                                <td class="printing2-td5">{{item.startTime.split(' ')[0]}} 至 {{item.endTime.split(' ')[0]}}</td>
                            </tr>
                        </table>
                          <!-- <p class="text-remark">
                            投保人声明：上述所填内容属实；保险人已将《公众责任保险条款》内容和责任免除内容向投保人作了充分说明；投保人对《公众责任保险条款》内容和责任免除内容及保险人的说明已经了解，同意从保险单签发之日起保险合同成立。
                        </p>
                        <div class="text-sign">
                            <p class="sign-name">投保人（盖章）</p>
                            <p class="sign-date">
                                年
                                <span></span>月
                                <span></span>日
                            </p>
                        </div> -->
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
        font-size: 12px;
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
        font-size: 12px;
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
    #printf-box1 .wrap-box2 .printing2-td1{
        width:2%
      }
     #printf-box1 .wrap-box2 .printing2-td2{
        width:10%
      }
     #printf-box1 .wrap-box2 .printing2-td3{
        width:10%
      }
     #printf-box1 .wrap-box2 .printing2-td4{
        width:20%
      }
     #printf-box1 .wrap-box2 .printing2-td5{
        width:20%
      }
     #printf-box1 .wrap-box2 .printing2-td6{
        width:15%
      }
     #printf-box1 .wrap-box2 .printing2-td7{
        width:10%
      }
     #printf-box1 .wrap-box2 .printing2-td8{
        width:10%
      }

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
        margin-top:30px;
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
        ele.setAttribute("src", "/utils/canvas.js");
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
      document.title = "电子保单";
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
  name: "printf-page-template1",
  props: ['printData','list'],
  data() {
    return {
      liveLength: 0,
      NonLiveLength: 0,
      isExistence1: false,
      isExistence2: false,
      logoImg: require('./ins_guzhu.png')
    };
  },
  created() {
  },
  mounted() {

  },
  methods: {
      
  }
};
</script>

<style lang='scss' scoped>
.a{
    
}
</style>

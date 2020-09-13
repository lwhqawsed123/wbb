<!--打印清单-->
<template>
  <div class="printf-template" style="display: none">
    <!--打印html-->
    <!--打印html-->
    
    <div id="printf-box2">
      <div id="printing123">
        <div class="printf-box-page">
            <div class="printf-box-header">
                <img class="logo" :src="logoImg" alt="">
            </div>
                <div class="printf-box-content">
                    <div class="page-title">雇主责任保险保险单(电子保单)</div>
                    <p id="policy">保险单号：{{PrintingData.policyNo}}</p>
                    <div class="page-title title">
                        鉴于投保人已向本保险人投保雇主责任保险及相关附加险，并按本保险单约定支付保险费，保险人同意按照承保险种及其对应保险条款的约定承担保险责任，特立本保险单为凭。
                    </div>
                    <!-- <div class="page-title title">投保人或被保险人收到本保险单后请立即核对。如有错误和遗漏，请于72小时内通知本公司更正。发生保险事故后，请即刻拨打40066-95535报案。</div> -->
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
                                <td class="title left" colspan="5" >投保人信息</td>
                            </tr>
                            <tr>
                                <td class="title lt" colspan="1">投保人名称</td>
                                <td class="title" colspan="1">物保宝科技服务(广东)有限公司</td>
                                <td class="title lt" colspan="1">证件类型：营业执照</td>
                                <td class="title" colspan="1">91440300MA5G049L0E</td>
                            </tr>
                            <tr>
                                <td class="title lt" colspan="1">投保人地址</td>
                                <td class="title" colspan="3">广东省深圳市南山区紫光信息港C座</td>
                            </tr>
                            <tr>
                                <td class="title lt" colspan="4">营业性质：详见营业执照经营范围</td>
                            </tr>
                            <tr>
                                <td class="title left" colspan="4" >被保险人信息</td>
                            </tr>
                            <tr>
                                <td class="title lt" colspan="4">被保险人雇员人数合计____{{PrintingList.length}}____人，详见随附雇员清单</td>
                            </tr>
                            <tr>
                                <td class="title " colspan="1">保障项目</td>
                                <td class="title " colspan="1">责任/赔偿限额类型</td>
                                <td class="title " colspan="2">责任/赔偿限额(元)</td>
                            </tr>
                            <tr>
                                <td class="title " colspan="1">雇主责任险-主险</td>
                                <td class="title " colspan="1">每人伤亡赔偿限额</td>
                                <td class="title " colspan="2">{{handleDeath(PrintingData.planCode)}}</td>
                                <!-- <td class="title " colspan="2"></td> -->
                            </tr>
                            <tr>
                                <td class="title " colspan="1">雇主责任险-主险</td>
                                <td class="title " colspan="1">每人医疗费用赔偿限额</td>
                                <td class="title " colspan="2">{{handleCare(PrintingData.planCode)}}</td>
                                <!-- <td class="title " colspan="2"></td> -->
                            </tr>
                            <tr>
                                <td class="title " colspan="1">附加误工补助补充责任保险</td>
                                <td class="title " colspan="1">每人赔偿限额</td>
                                <td class="title " colspan="2">100元/天，免赔5天，最多180天</td>
                            </tr>
                            <tr>
                                <td class="title " colspan="1">附加住院津贴</td>
                                <td class="title " colspan="1">每人赔偿限额</td>
                                <td class="title " colspan="2">100元/天，最多60天</td>
                            </tr>
                            <tr>
                                <td class="title " colspan="1" >保险费合计：</td>
                                <td class="title " colspan="3" >按约定计算</td>
                            </tr>
                            <tr>
                                <td class="title " colspan="1" >保险期间</td>
                                <td class="title " colspan="3" >{{PrintingData.startTime}} 至 {{PrintingData.endTime}}</td>
                            </tr>
                            <tr>
                                <td class="title " colspan="1">特别约定</td>
                                <td class="title lt" colspan="3">
1、承保三类职业以下
2、承保年龄18-70周岁
3、退休人员死亡伤残保额50万
4、5人起保，月投保不可退保
5、本保单不承担涉及高空作业及高危行业从业人员的投保
6、意外工伤事故需在二级医院以上治疗
7、投保方式：记名投保
                                </td>
                            <tr>
                                <td class="title " colspan="1">明示告知</td>
                                <td class="title lt" colspan="3">
1、保险人根据投保人的投保申请，在投保人按约定交付保险费后，依照本合同所附条款、批单及特别约定承担保险责任。请仔细阅读并理解保险条款的全部内容，特别是免除保险责任的部分。
2、为保证您的合法权益，您可通过访问我司主页（主页地址：http://www.fundins.com/）或拨打我司客户服务热线40066-95535，对您所投保保单的相关信息进行查询或验真。
                                </td>
                            </tr>
                            <tr>
                                <td class="title " colspan="1" >合同争议处理方式</td>
                                <td class="title " colspan="3" >诉讼</td>
                            </tr>

                        </table>
                        <p class="text-remark">
                          服务电话：0571-95519 网址：www.chinalife-p.com.cn
 本保单由中国人寿财产保险股份下属落地分支机构出具并提供后续保险服务。落地分支机构见
保单销售机构/签单（发）机构
                      </p>
                      <!-- <div class="text-sign">
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
            <div class="printf-box-page">
                <div class="wrap-box2">
                    <table width="706" cellspacing="0" align="center">
                        <caption align="center">雇员清单</caption>
                        <tr align="center">
                        <td>序号</td>
                        <td>雇员姓名</td>
                        <td>证件类型</td>
                        <td>证件号码</td>
                        <td>工种名称</td>
                        </tr>
                        <tr align="center" v-for="(item,index) in PrintingList" :key="index">
                            <td class="printing2-td1">{{index+1}}</td>
                            <td class="printing2-td2">{{item.name}}</td>
                            <td class="printing2-td3">身份证</td>
                            <td class="printing2-td4">{{item.idCard}}</td>
                            <td class="printing2-td5">{{item.jobName}}</td>
                        </tr>
                    </table>
                </div>
            </div>
      </div>
       <div id="printing2">打印</div>
       
    </div>
   
    <!--打印css-->
    <div id="CSS_PRINT2" style="display: none">
       * {
        margin: 0;
        padding: 0;
    }

    #printf-box2 {
        width: 706px;
        /*padding: 43px 33px;*/
        background: #fff;
    }

    #printf-box2 .printf-box-page {
        page-break-after: always;
    }

    #printf-box2 .printf-box-header img.logo {
        display: inline-block;
        width: 100%;
        height: 75px;
    }

    #printf-box2 .printf-box-content .page-title {
        <!-- margin-top: 50px; -->
        font-size: 19px;
        text-align: center;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        font-weight: bold;
        color: rgba(0, 0, 0, 1);
        line-height: 29px;
    }

    #printf-box2 .printf-box-content .page-title.title {
        margin-top: 0px;
        text-indent: 2em;
        font-size: 14px;
        text-align: left;
        line-height: 20px;
        font-weight: normal;
    }

    #printf-box2 .printf-box-content .page-title.title2 {
        margin-top: 5px;
        font-size: 16px;
        text-align: center;
        line-height: 20px;
        letter-spacing: 10px;
    }

    #printf-box2 .printf-box-content .page-table {
        margin: 0px auto 0;
    }

    #printf-box2 .printf-box-content .page-table .subText {
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

    #printf-box2 .printf-box-content .page-table table {
        table-layout: fixed;
        border-collapse: separate;
        text-align: left;
        border-right: 1px solid #333;
        border-bottom: 1px solid #333;
    }

    #printf-box2 .printf-box-content .page-table tr.hidden {
        visibility: hidden;
        height: 0;
        line-height: 0;
        border: none;
        overflow: hidden;
    }

    #printf-box2 .printf-box-content .page-table tr.hidden td {
        visibility: hidden;
        height: 1;
        line-height: 0;
        padding: 0;
        border: none;
        overflow: hidden;
    }

    #printf-box2 .printf-box-content .page-table tr {
        line-height: 30px;
    }

    #printf-box2 .printf-box-content .page-table td {
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

    #printf-box2 .printf-box-content .page-table .noBorderTop td {
        border-top: none;
    }

    #printf-box2 .printf-box-content .page-table td.title {
        height: 16px;
        font-size: 12px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: rgba(0, 0, 0, 1);
        line-height: 16px;
        padding: 8px 4px 8px 4px;
        text-align: center;
    }

    #printf-box2 .printf-box-content .page-table td.title.left {
        text-align: left;
        line-height: 30px;
        font-weight: bold;
        font-size: 14px;
    }
    #printf-box2 .printf-box-content .page-table td.title.lt {
        text-align: left;
    }

    #printf-box2 .printf-box-content .page-table span.title.span1 {
        color: red;
    }

    #printf-box2 .printf-box-content .page-table span.title.span2 {
        color: red;
        margin-left: 50px;
    }

    #printf-box2 .printf-box-content .page-table span.title.right {
        text-align: right;
        /* color:red */
        margin-left: 150px;
    }

    #printf-box2 .printf-box-content .page-table td.conter {
        text-align: center;
    }

    #printf-box2 .printf-box-content .page-table td.conter.p {
        /* display: flex; */
        /* flex-wrap:wrap */
        text-align: left;
    }

    #printf-box2 .printf-box-content .page-table td.conter.p p {
        text-align: left;
        /* display: flex; */
        display: inline-block;
        align-items: center;
        margin-right: 20px;
        /* vertical-align: bottom; */

    }

    #printf-box2 .printf-box-content .page-table td.conter.p p span {
        display: inline-block;
        width: 10px;
        height: 10px;
        border: 1px solid #000;
        margin-right: 3px;

    }

    #printf-box2 .printf-box-content .page-table td.span p span {
        display: inline-block;
        width: 10px;
        height: 10px;
        border: 1px solid #000;
        margin-right: 5px;
        text-align: center;
        line-height: 10px;
        font-weight: bold;
    }

    #printf-box2 .printf-box-content .page-table td .text-sign {
        margin-top: 16px;
        text-align: left;
    }

    #printf-box2 .printf-box-content .page-table td .text-date {
        text-align: right;
    }

    #printf-box2 .printf-box-content .page-table .text-remark {
        margin-top: 13px;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        line-height: 27px;
    }

    #printf-box2 .printf-box-content .page-table .text-sign {
        margin-top: 27px;
    }

    #printf-box2 .printf-box-content .page-table .text-sign .sign-name {
        font-size: 12px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
        line-height: 27px;
        text-align: right;
    }

    #printf-box2 .printf-box-content .page-table .text-sign .sign-date {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        line-height: 27px;
        text-align: right;
    }

    #printf-box2 .printf-box-content .page-table .text-sign .sign-date span {
        padding: 0 10px;
    }

    #printf-box2 .page-break-after {
        page-break-after: always;
    }
    #printf-box2 .wrap-box2{
      padding-top:20px;
      }
    #printf-box2 .wrap-box p {
      width: 50%;
      height: 50px;
      }
    #printf-box2 .wrap-box2 table{
      border-collapse: collapse;
      }
      .wrap-box2 tr{
      height: 50px;
      border: 1px solid #000;
      
      }
     #printf-box2 .wrap-box2 td{
     border: 1px solid #000;
      padding:5px;
      box-sizing: border-box;
      min-width:80px;
      }
     #printf-box2 .wrap-box2 caption{
      border: 1px solid #000;
      border-bottom: none;
      height: 40px;
      line-height: 40px;
      }
    #printf-box2 .wrap-box2 .printing2-td1{
        width:2%
      }
     #printf-box2 .wrap-box2 .printing2-td2{
        width:20%
      }
     #printf-box2 .wrap-box2 .printing2-td3{
        width:10%
      }
     #printf-box2 .wrap-box2 .printing2-td4{
        width:20%
      }
     #printf-box2 .wrap-box2 .printing2-td5{
        width:10%
      }
     #printf-box2 .wrap-box2 .printing2-td6{
        width:15%
      }
     #printf-box2 .wrap-box2 .printing2-td7{
        width:10%
      }
     #printf-box2 .wrap-box2 .printing2-td8{
        width:10%
      }

    #printing2 {
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
    </div>
    <!-- 方法 -->
    <div id="SCRIPT_PRINT2" style="display: none">
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
      var printf2 = document.getElementById('printing2')
      document.title = "电子保单";
      printf2.onclick = function(){
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
  name: "printf-page-template2",
  props: ['PrintingData','PrintingList'],
  data() {
    return {
      liveLength: 0,
      NonLiveLength: 0,
      isExistence1: false,
      isExistence2: false,
      logoImg: require('./ins_renshou.png')
    };
  },
  created() {
  },
  mounted() {

  },
  methods: {
      // 每人伤亡赔偿限额
      handleDeath(val){
          if(val == 'PLAN_ONE'){
              return val = '70万'
          }else if(val == 'PLAN_TWO'){
              return val = '70万'
          }else if(val == 'PLAN_THREE'){
              return val = '50万'
          }else if(val == 'PLAN_FOUR'){
              return val = '50万'
          }
      },
      // 每人医疗费用赔偿限额
      handleCare(val){
          if(val == 'PLAN_ONE'){
              return val = '2万'
          }else if(val == 'PLAN_TWO'){
              return val = '4万'
          }else if(val == 'PLAN_THREE'){
                return val = '2万'
          }else if(val == 'PLAN_FOUR'){
                return val = '4万'
          }
      }
  }
};
</script>

<style lang='scss' scoped>
.a{
    
}
</style>

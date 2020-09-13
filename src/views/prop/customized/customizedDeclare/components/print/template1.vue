<!--打印清单-->
<template>
  <div class="printf-template" style="display: none">
    <!--打印html-->
    <!--打印html-->
    
    <div id="printf-box1">
      <div id="printing123">
        <div class="printf-box-page">
            <div class="printf-box-content">
                <div class="page-title">雇主责任保险投保单(WBBGZ{{orderId}})</div>
                <div class="page-title title">尊敬的投保人：在您填写本投保单请先详细阅读《中国人民财产保险股份有限公司雇主责任保险条款(2015版)》，阅读条款时请您特别注意条款中的保险责任、责任免除、投保人被保险人义务、赔偿处理等内容并听取保险人就条款(包括前述需特别注意的内容)所作的说明。</div>
                <div class="page-table">
                    <table border="0" cellspacing="0" cellpadding="0">
                        <!--rowspan colspan-->
                        <!--投保人信息-->
                        <tr class="hidden">
                            <!-- 20 -->
                            <td style="width: 30px;min-width: 30px">&nbsp;</td> 
                            <!-- 200 -->
                            <td style="width: 80px">&nbsp;</td>
                            <td style="width: 100px">&nbsp;</td>
                            <td style="width: 80px">&nbsp;</td>
                            <td style="width: 80px">&nbsp;</td>
                            <td style="width: 150px">&nbsp;</td>
                            <td style="width: 220px">&nbsp;</td>
                        </tr>
                        <tr>
                            <td class="title left" colspan="7">一、投保人、被保险人信息</td>
                        </tr>
                        <tr>
                            <td class="title" colspan="2">投保人名称</td>
                            <td class="conter" colspan="3">物保宝科技服务(广东)有限公司</td>
                            <td class="title" colspan="1">联系电话</td>
                            <td class="conter" colspan="1"></td>
                        </tr>
                        <tr>
                            <td class="title" rowspan="5">被保险人信息</td>
                            <td class="title">名称</td>
                            <td class="conter" colspan="3">{{policyInfo.propertyData.name}}</td>
                            <td class="title" colspan="1">营业性质</td>
                            <td class="title" colspan="1"></td>
                        </tr>
                        <tr>
                            <td class="title">证件类型</td>
                            <td class="conter p" colspan="3"><p><span></span>组织机构代码证</p><p><span></span>税务登记证</p><p><span></span>工商登记证</p><p><span>√</span>营业执照</p></td>
                            <td class="title" colspan="1">营业执照</td>
                            <td class="title" colspan="1">{{policyInfo.propertyData.certNo}}</td>
                        </tr>
                        <tr>
                            <td class="title">营业范围</td>
                            <td class="conter" colspan="3"></td>
                            <td class="title" colspan="1">行业类别</td>
                            <td class="title" colspan="1"></td>
                        </tr>
                        <tr>
                            <td class="title">雇员人数</td>
                            <td class="conter" colspan="1"></td>
                            <td class="title" colspan="1">投保人数</td>
                            <td class="title" colspan="1">{{policyInfo.insObjData.num}}</td>
                            <td class="title" colspan="1">联系电话</td>
                            <td class="title" colspan="1"></td>
                        </tr>
                        <tr>
                            <td class="title">联系地址</td>
                            <td class="conter" colspan="3">{{policyInfo.propertyData.address}}</td>
                            <td class="title" colspan="1">邮编</td>
                            <td class="conter" colspan="1"></td>
                        </tr>
                        <tr>
                            <td class="title" colspan="2">近三年损失情况(时间、原因、损失金额)</td>
                            <td class="conter" colspan="5"></td>
                        </tr>
                        <tr>
                            <td class="title left" colspan="7">二、承保信息</td>
                        </tr>
                        <tr>
                            <td class="title" rowspan="7" colspan="2">主险</td>
                            <td class="conter" colspan="3">限额名称</td>
                            <td class="title" colspan="1">责任限额/免赔额</td>
                            <td class="title" colspan="1">保险费(元)</td>
                        </tr>
                        <tr>
                            <td class="conter" colspan="3">累计责任限额</td>
                            <td class="title" colspan="1"></td>
                            <td class="title" colspan="1"  rowspan="10">{{policyInfo.insObjData.yearMoney}}元/人</td>
                        </tr>
                        <tr>
                            <td class="conter" rowspan="4" colspan="1">每次事故责任限额</td>
                            <td class="conter" colspan="2">每次事故责任限额</td>
                            <td class="title" colspan="1"></td>
                        </tr>
                        <tr>
                            <td class="conter" colspan="2">每人伤亡责任限额</td>
                            <td class="title" colspan="1">{{policyInfo.insObjData.disabilityNum}}元</td>
                        </tr>
                        <tr>
                            <td class="conter" colspan="2">每人医疗费用责任限额</td>
                            <td class="title" colspan="1">{{policyInfo.insObjData.accidentNum}}元</td>
                        </tr>
                        <tr>
                            <td class="conter" colspan="2">法律费用责任限额</td>
                            <td class="title" colspan="1"></td>
                        </tr>
                        <tr>
                            <td class="conter" colspan="3">每次事故每人医疗费用免赔额</td>
                            <td class="title" colspan="1">100元</td>
                        </tr>
                        <tr>
                            <td class="title" rowspan="4" colspan="2">附加险</td>
                            <td class="conter" colspan="4">住院补贴(100元/天，最多60天)</td>
                        </tr>
                        <tr>
                            <td class="conter" colspan="4">误工费(100元/天，免赔5天，最多180天)</td>
                        </tr>
                        <tr>
                            <td class="conter" colspan="4">扩展24小时(死亡伤残10万意外医疗1万)</td>
                        </tr>
                        <tr>
                            <td class="conter" colspan="4">伤残赔付特约(伤残赔付比例按等比赔付)</td>
                        </tr>
                        <tr>
                            <td class="conter" colspan="2">保险费合计(人民币)</td>
                            <td class="conter" colspan="5">(大写):&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(小写):&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                        </tr>
                        <tr>
                            <td class="conter" colspan="2">保险期间</td>
                            <td class="conter" colspan="5">{{policyInfo.startTime.split(' ')[0]}} 至 {{policyInfo.endTime}}</td>
                        </tr>
                        <tr>
                            <td class="conter" colspan="2">保险合同争议处理</td>
                            <td class="conter p" colspan="5"><p><span></span>提交_________________________________________仲裁委员会仲裁</p><p><span>√</span>诉讼</p></td>
                        </tr>
                        <tr>
                            <td class="conter" colspan="2">司法管辖</td>
                            <td class="conter" colspan="5"></td>
                        </tr>
                        <tr>
                            <td class="title left" colspan="7">三、特别约定</td>
                        </tr>
                        <tr>
                            <td class="conter" colspan="2">特别约定</td>
                            <td class="title left" colspan="5">
（1）每人死亡伤残赔偿限额70万元（达到法定退休年龄限额50万）；
（2）医疗费用赔偿限额2万元；
（3）每次事故住院补贴100元/天，累计60天；
（4）每次事故医疗费用绝对免赔额人民币100.00元后100%赔付；
（5） 误工补偿100元/天，每次事故免赔5天，最长赔付180天；
（6）上述住院津贴、误工费均在伤残限额中列支；
（7）被保险人包含退休返聘及劳务派遣人员；
（8）自动承保新进人员条款（ 兹经合同双方同意，本保险自动承保被保险人所有新增招收的雇员。被保险人应按月向保险人书面申报新员工的情况，并按日比例支付附加保险费。本条款未约定事宜适用保险合同的其他约定。）
（9）被保险人雇员因保险责任内意外事故致残，保险人按如下比例进行赔偿：一级伤残100%，二级伤残80%，三级伤残70%，四级伤残60%，五级伤残50%，六级伤残40%，七级伤残30%，八级伤残15%，九级伤残7.5%，十级伤残5%。
<span class="title span1">（10）本保单的赔款接收人为被保险人：</span>
（11）被保险人可从意外事故责任方获得的赔偿或者从工伤保险下获得的赔偿不影响或者减少被保险人应在本保险合同项下获得的赔偿，但仅限于非费用类项目。
（12）本保单承保被保险人的雇员因从事保险单载明的业务工作而猝死，依法应由被保险人承担的经济赔偿责任。
释义：猝死是指在工作时间和工作岗位，突发疾病死亡或者在48小时之内经抢救无效死亡。
                            </td>
                        </tr>
                         <tr>
                            <td class="title left" colspan="7">四、投保人声明</td>
                        </tr>
                        <tr>
                            <td class="conter" colspan="2">投保人声明</td>
                            <td class="title left" colspan="5">
        保险人已向本人提供并详细介绍了中国人民财产保险雇主责任保险条款（2015版），并对其中免除保险人责任的条款（包括但不限于责任免除、投保人被保险人义务、赔偿处理、其他事项等），以及本保险合同中付费约定和特别约定的内容向本人做了明确说明，本人已充分理解并接受上述内容，同意以此作为订立保险合同的依据，自愿投保本保险。
上述所填写的内容均属实。
<span class="title span2">投保人签名 / 签章：</span><span class="title right">_________年_________月_________日</span>
                            </td>
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
        height: 46px;
    }

    #printf-box1 .printf-box-content .page-title {
        margin-top: 50px;
        font-size: 19px;
        text-align: center;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: rgba(0, 0, 0, 1);
        line-height: 29px;
    }
    #printf-box1 .printf-box-content .page-title.title {
        margin-top: 0px;
        text-indent:2em;
        font-size: 14px;
        text-align: left;
        line-height: 20px;
    }

    #printf-box1 .printf-box-content .page-table {
        margin: 10px auto 0;
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
        line-height: 30px;
        font-weight: bold;
        font-size: 14px;

    }
    #printf-box1 .printf-box-content .page-table span.title.span1{
         color:red;
     }
    #printf-box1 .printf-box-content .page-table span.title.span2{
         color:red;
         margin-left: 50px;
     }
    #printf-box1 .printf-box-content .page-table span.title.right{
        text-align: right;
         /* color:red */
         margin-left: 150px;
     }

    #printf-box1 .printf-box-content .page-table td.conter {
        text-align: center;
    }
    #printf-box1 .printf-box-content .page-table td.conter.p{
        /* display: flex; */
        /* flex-wrap:wrap */
        text-align: left;
    }
    #printf-box1 .printf-box-content .page-table td.conter.p p{
        text-align: left;
        /* display: flex; */
        display: inline-block;
        align-items: center;
        margin-right: 20px;
        /* vertical-align: bottom; */
        
    }
    #printf-box1 .printf-box-content .page-table td.conter.p p span{
        display: inline-block;
        width: 10px;
        height: 10px;
        text-align: center;
        line-height: 10px;
        border: 1px solid #000;
        margin-right: 3px;
        font-weight: bold;
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
    </div>
    <!-- 方法 -->
    <div id="SCRIPT_PRINT1" style="display: none">
        document.title = "打印";
       var ele= document.createElement("script");
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
            window.opener.document.getElementById("a").innerText=image.src;
          }
      },1000 * 1)
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
  name: "printf-page-template1",
  props: ['policyInfo','orderId'],
  data() {
    return {
      liveLength: 0,
      NonLiveLength: 0,
      isExistence1: false,
      isExistence2: false
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

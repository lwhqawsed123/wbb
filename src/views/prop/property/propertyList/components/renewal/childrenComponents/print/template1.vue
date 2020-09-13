<!--打印清单-->
<template>
  <div class="printf-template" style="display: none">
    <!--打印html-->
    <!--打印html-->
    <div id="printf-box1">
      <div id="printing123">
      <div class="printf-box-page">
        <div class="printf-box-content">
          <div class="page-title">物业责任保险投保单(WBBWY{{insureNum}})</div>
          <div class="page-table">
            <table border="0" cellspacing="0" cellpadding="0">
              <!--rowspan colspan-->
              <!--投保人信息-->
              <tr class="hidden">
                <td style="width: 90px;min-width: 90px">&nbsp;</td>
                <td style="width: 325px">&nbsp;</td>
                <td style="width: 90px">&nbsp;</td>
                <td style="width: 200px">&nbsp;</td>
              </tr>
              <tr>
                <td class="title">被保险人</td>
                <td class="conter">{{policyInfo.name || ''}}</td>
                <td class="title">营业性质</td>
                <td class="conter">{{policyInfo.business_nature || '物业管理'}}</td>
              </tr>
              <tr>
                <td class="title">营业处所地址</td>
                <td class="conter">{{policyInfo.address || ''}}</td>
                <td class="title">营业执照</td>
                <td class="conter">{{policyInfo.certNo || ''}}</td>
              </tr>
              <tr>
                <td class="title">每次事故赔偿限额</td>
                <td class="conter">{{policyInfo.peraccident_climit || '详见正式保单'}}</td>
                <td class="title">每人赔偿限额</td>
                <td class="conter">{{policyInfo.perpersion_climit || '详见正式保单'}}</td>
              </tr>
              <tr>
                <td class="title">各项目累计赔偿金额(在对应项打√)</td>
                <!-- <td>{{policyInfo.insured_amount || ''}}</td> -->
                <td class="span">
                  <p>
                    <span v-html="isExistence1 ? '√':''"></span>1.RMB{{total.liveInsuredAmount/10000}}万元/居住小区*（{{liveLength}}）份
                  </p>
                  <p>
                    <span v-html="isExistence2 ? '√':''"></span>2.RMB{{total.NonLiveInsuredAmount/10000}}万元/非居住小区*（{{NonLiveLength}}）份
                  </p>
                </td>
                <td class="title">免赔额</td>
                <td class="conter">{{policyInfo.deductible || '财产损失：每次事故绝对免赔额RMB1,000元。人身伤亡：无免赔'}}</td>
              </tr>
              <!-- <tr>
                <td class="title">保险费(在对应项打√)</td>
                <td class="span" colspan="3">
                  <p>
                    <span v-html="isExistence1 ? '√':''"></span>1.RMB{{total.livePremium}}元/纯居住小区*（{{liveLength}}）份
                  </p>
                  <p>
                    <span v-html="isExistence2 ? '√':''"></span>2.RMB{{total.NonLivePremium}}元/商用型小区*（{{NonLiveLength}}）份
                  </p>
                </td>
              </tr> -->
              <tr>
                <td class="title">保险期限</td>
                <td
                  class="conter"
                  colspan="3"
                >{{policyList[0].startTime + ' 至 '+ policyList[0].endTime || ''}}</td>
              </tr>
              <tr>
                <td class="title">其他需要说明的情况</td>
                <!-- <td colspan="3" v-html="lineBreak2Html(policyInfo.otherMsg)"></td> -->
                <td class="conter" colspan="3">详细清单列表</td>
              </tr>
              <tr>
                <td class="title">合计保费</td>
                <!-- <td colspan="3" v-html="lineBreak2Html(policyInfo.previous_cdata)"></td> -->
                <td class="conter" colspan="3" v-html="premium" ></td>
              </tr>
              <tr>
                <td class="title">特别约定</td>
                <!-- <td colspan="3" v-html="lineBreak2Html(policyInfo.special_agreement)"></td> -->
                <!-- <td colspan="3" >{{lineBreak2Html(policyInfo.otherMsg)}}</td> -->
                <td colspan="3">
1. 投保的小区名称：
投保的小区地址：
2. 投保人、被保险人或受益人知道或应当知道保险事故发生后，应在48小时内及时通知保险人，并书面说明事故发生的原因、经过和损失情况；故意或者因重大过失未及时通知，致使保险事故的性质、原因、损失程度等难以确定的，保险人对无法确定的部分，不承担给付保险金的责任，但保险人通过其他途径已经及时知道或者应及时知道保险事故发生的除外。
3. 指定公估人条款
4.扩展游泳池责任（保费增加500元）
                </td>
              </tr>
            </table>
            <p
              class="text-remark"
            >投保人声明：上述所填内容属实；保险人已将《物业管理责任险条款》内容和责任免除内容向投保人作了充分说明；投保人对《物业管理责任险条款》内容和责任免除内容及保险人的说明已经了解，同意从保险单签发之日起保险合同成立。</p>
            <div class="text-sign">
              <p class="sign-name">投保人（盖章）</p>
              <p class="sign-date">
                年
                <span></span>月
                <span></span>日
              </p>
            </div>
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
      page-break-after:always;
      }
      #printf-box1 .printf-box-header img.logo {
      display: inline-block;
      width:100%;
      height:46px;
      }
      #printf-box1 .printf-box-content .page-title {
      <!-- margin-top: 50px; -->
      font-size:19px;
      font-family:PingFangSC-Medium,PingFang SC;
      font-weight:500;
      color:rgba(0,0,0,1);
      line-height:29px;
      }
      #printf-box1 .printf-box-content .page-table {
      margin: 10px auto 0;
      }
      #printf-box1 .printf-box-content .page-table .subText {
      font-size:12px;
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      color:rgba(51,51,51,1);
      line-height:27px;
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
      visibility:hidden;
      height:0;
      line-height: 0;
      border: none;
      overflow: hidden;
      }
      #printf-box1 .printf-box-content .page-table tr.hidden td {
      visibility:hidden;
      height:1;
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
      height:16px;
      font-size:12px;
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      color:rgba(0,0,0,1);
      line-height:16px;
      padding: 8px 4px 8px 4px;
      word-break: break-all;
      white-space: pre-wrap;
      }
      #printf-box1 .printf-box-content .page-table .noBorderTop td {
      border-top: none;
      }
      #printf-box1 .printf-box-content .page-table td.title {
      height:16px;
      font-size:12px;
      font-family:PingFangSC-Medium,PingFang SC;
      font-weight:500;
      color:rgba(0,0,0,1);
      line-height:16px;
      padding: 8px 4px 8px 4px;
      text-align: center;
      }
      #printf-box1 .printf-box-content .page-table td.conter {
      text-align: center;
      }
      #printf-box1 .printf-box-content .page-table td.span p span {
      display: inline-block;
      width: 10px;
      height: 10px;
      border: 1px solid #000;
      margin-right:5px;
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
      font-size:12px;
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      color:rgba(51,51,51,1);
      line-height:27px;
      }
      #printf-box1 .printf-box-content .page-table .text-sign {
      margin-top: 5px;
      }
      #printf-box1 .printf-box-content .page-table .text-sign .sign-name {
      font-size:12px;
      font-family:PingFangSC-Medium,PingFang SC;
      font-weight:500;
      color:rgba(51,51,51,1);
      line-height:27px;
      text-align: right;
      }
      #printf-box1 .printf-box-content .page-table .text-sign .sign-date {
      font-size:12px;
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      color:rgba(51,51,51,1);
      line-height:27px;
      text-align: right;
      }
      #printf-box1 .printf-box-content .page-table .text-sign .sign-date span {
      padding: 0 10px;
      }
      #printf-box1 .page-break-after {
      page-break-after:always;
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
          margin-left:300px;
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
            <!-- console.log(image.src) -->
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
  props: {
    policyInfo: {
      type: Object,
      default: {}
    },
    policyList: {
      type: Array,
      default: []
    },
    total: {
      type: Object,
      default: {}
    },
    insureNum: {
      type: String,
      default: ""
    },
    premium: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      liveLength: 0,
      NonLiveLength: 0,
      isExistence1: false,
      isExistence2: false
    };
  },
  created() {
    this.liveShare();
  },
  mounted() {
    // console.log("mounted");
    console.log(this.policyList);
  },
  methods: {
    liveShare() {
      var num1 = 0;
      var num2 = 0;
      var num3 = 0;
      var num4 = 0;
      for (let i = 0; i < this.policyList.length; i++) {
        if (this.policyList[i].type == "居住类型") {
          num1 += this.policyList[i].insureNum;
          this.isExistence1 = true;
        } else if (this.policyList[i].type == "非居住类型") {
          num2 += this.policyList[i].insureNum;
          this.isExistence2 = true;
        }
      }
      this.liveLength = num1;
      this.NonLiveLength = num2;
    },
    lineBreak2Html(input) {
      if (input) {
        return input
          .replace(/\n\r/g, "<br>")
          .replace(/\r\n/g, "<br>")
          .replace(/\n/g, "<br>")
          .replace(/\r/g, "<br>");
      } else {
        return "";
      }
    },
    key2Text(arr, key) {
      let _text = "";
      arr.forEach((item, index) => {
        if (parseInt(item.value) === parseInt(key)) {
          _text = item.label;
        }
      });
      return _text;
    },
    // dateFormat(date, "YYYY-mm-dd HH:MM")
    dateFormat(date, fmt) {
      if (!date) return "";
      date = new Date(date);
      let ret;
      const opt = {
        "Y+": date.getFullYear().toString(), // 年
        "m+": (date.getMonth() + 1).toString(), // 月
        "d+": date.getDate().toString(), // 日
        "H+": date.getHours().toString(), // 时
        "M+": date.getMinutes().toString(), // 分
        "S+": date.getSeconds().toString() // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
      };
      for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
          fmt = fmt.replace(
            ret[1],
            ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, "0")
          );
        }
      }
      return fmt;
    },
  }
};
</script>

<style lang='scss' scoped>
</style>

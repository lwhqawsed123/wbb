<template>
  <!-- 查看并打印 -->
  <div class="printing-wrap">
    <div class="printing-wrap-box">
      <h4>投保单</h4>
      <a href="javascript:;" @click="htmlToPrint1">查看并打印</a>
    </div>
    <div class="printing-wrap-box">
      <h4>投保明细</h4>
      <a href="javascript:;" @click="htmlToPrint2">查看并确认</a>
    </div>
    <printf-template1 :policyInfo='obj2' :orderId='orderId' style="display: none"></printf-template1>
    <printf-template2
      :policyInfo="obj2.propertyData"
      :policyList="obj2.form.insEmpApplyUsers"
      style="display: none"
    ></printf-template2>
    <div class="apply-page-bot">
      <a class="apply-page-btn" href="javascript:;" @click="next">下一步</a>
      <!-- <a class="apply-page-btn apply-page-btn-default" href="javascript:;" @click="goBack()">上一步</a> -->
    </div>
    <div id="a" style="display:none"></div>
    <div id="b" style="display:none"></div>
  </div>
</template>

<script>
import PrintfTemplate1 from "./template1";
import PrintfTemplate2 from "./template2";
import { insEmpCustomApplyOrderNo ,filePolicy} from "@/api/information/information";
import $ from "jquery";
export default {
  name: "declare-printing",
  components: { PrintfTemplate1, PrintfTemplate2 },
  props: ["obj2"],
  data() {
    return {
      orderId:''
    };
  },
  created() {
    // console.log(this.obj2);
    this.getOrderNo()
  },

  methods: {
    //  获取凭证号
    getOrderNo() {
      insEmpCustomApplyOrderNo().then(xhrData => {
        // console.log(xhrData, "凭证号");
        if (xhrData.code === 200) {
          this.orderId = xhrData.msg
        }
      });
    },
    // 下一步
    async next() {
       const _this = this
      //获取上传通行证
      const res = await filePolicy();
      if (res.code === 200) {
        _this.aliyunOssToken = res.data;
      } else {
        _this.$message.error(res.data.message);
      }
      // // // UPLOAD
      // // this.propertyData.insureNum = this.insureNum;
      let base64Img = document.getElementById("a").innerText
      let queren = document.getElementById("b").innerText
      // if(base64Img == ''){
      //    this.$message({
      //     message: '请查看并打印！',
      //     type: 'warning'
      //   });
      //   return
      // }
      if(queren != '确认'){
         this.$message.warning('请查看并确认投保明细')
         return
      }
      let imgUrl;
      if(base64Img == ''){
        imgUrl = ''
      }else{
      // if(base64Img == ''){
      //   imgUrl = ''
      //   this.$message.warning('请查看并打印')
      //   return
      // }
      
         imgUrl =  this.dataURLtoFile(base64Img)
        var getSuffix = function(fileName) {
          var pos = fileName.lastIndexOf(".");
          var suffix = "";
          if (pos != -1) {
            suffix = fileName.substring(pos);
          }
          return suffix;
        };
        var filename = new Date().getTime() + getSuffix(imgUrl.name);
        var formData = new FormData();
        //注意formData里append添加的键的大小写
        formData.append("key", _this.aliyunOssToken.dir + filename); //存储在oss的文件路径
        formData.append("OSSAccessKeyId", _this.aliyunOssToken.accessKeyId); //accessKeyId
        formData.append("policy", _this.aliyunOssToken.policy); //policy
        formData.append("Signature", _this.aliyunOssToken.signature); //签名
        //如果是base64文件，那么直接把base64字符串转成blob对象进行上传就可以了
  
        formData.append("file", imgUrl);
        formData.append("success_action_status", 200); //成功后返回的操作码
        var url =  _this.aliyunOssToken.action;
  
        var fileUrl =
          _this.aliyunOssToken.action + "/" + _this.aliyunOssToken.dir + filename;
        $.ajax({
          url: url,
          type: "POST",
          data: formData,
          // async: false,
          cache: false,
          contentType: false,
          processData: false,
          success: function(data) {
            // 请求成功 返回路径
            // console.log(fileUrl, "成功");
            _this.obj2.policyFile = fileUrl;
          },
          error: function(data) {
            // console.log(data, "失败");
          }
        });
      }
      this.obj2.orderId = this.orderId
      this.$emit("changePage2", "UPLOAD", this.obj2);
    },
    // 上一步
    goBack() {
      this.$emit("changePage2", "DECLARE");
    },
    // 打印投保明细
    htmlToPrint1() {
      let CSS_PRINT =
        "<style>" +
        document.getElementById("CSS_PRINT1").innerHTML +
        "</style>";
      let HTML_PRINT = document.getElementById("printf-box1").outerHTML;
      // SCRIPT_PRINT1
      let SCRIPT_PRINT =
        "<script>" +
        document.getElementById("SCRIPT_PRINT1").innerHTML +
        "</" +
        "script>";
      let HTML = CSS_PRINT + HTML_PRINT + SCRIPT_PRINT;
      var win = window.open("");
      win.document.write(HTML);
      // let timer = setTimeout(() => {
      //   win.print();
      //   win.close();
      //   clearTimeout(timer);
      // }, 100);
    },
    // 打印投保明细
    htmlToPrint2() {
      let CSS_PRINT =
        "<style>" +
        document.getElementById("CSS_PRINT2").innerHTML +
        "</style>";

      let HTML_PRINT = document.getElementById("printf-box2").outerHTML;
      let SCRIPT_PRINT =
        "<script>" +
        document.getElementById("SCRIPT_PRINT2").innerHTML +
        "</" +
        "script>";
      let HTML = CSS_PRINT + HTML_PRINT + SCRIPT_PRINT;
      var win = window.open("");
      win.document.write(HTML);
      // let timer = setTimeout(() => {
      //   win.print();
      //   win.close();
      //   clearTimeout(timer);
      // }, 100);
    },
    // base64转file
    dataURLtoFile(dataurl, filename = 'file') {
          let arr = dataurl.split(',')
          let mime = arr[0].match(/:(.*?);/)[1]
          let suffix = mime.split('/')[1]
          let bstr = atob(arr[1])
          let n = bstr.length
          let u8arr = new Uint8Array(n)
          while (n--) {
              u8arr[n] = bstr.charCodeAt(n)
          }
          return new File([u8arr], `${filename}.${suffix}`, {
              type: mime
          })
      },
  }
};
</script>

<style lang="scss" scoped>
.printing-wrap {
  padding: 50px;
  box-sizing: border-box;
  .printing-wrap-box {
    display: flex;
    align-items: center;
    padding-bottom: 60px;
    h4 {
      width: 120px;
    }
    a {
      width: 120px;
      height: 40px;
      line-height: 40px;
      display: block;
      text-align: center;
      color: #fff;
      font-size: 14px;
      background-color: #f59a23;
      margin-left: 30px;
    }
  }
  .apply-page-bot {
    border-top: 1px solid #dddddd;
    box-sizing: border-box;
    margin-top: 40px;

    .el-form-item__content {
      margin-left: 0px !important;
    }

    a.apply-page-btn {
      margin-top: 25px;
      display: inline-block;
      width: 130px;
      height: 44px;
      background: linear-gradient(
        270deg,
        rgba(248, 184, 0, 1) 0%,
        rgba(239, 130, 0, 1) 100%
      );
      border-radius: 4px;
      text-align: center;
      line-height: 44px;
      font-size: 16px;
      color: #fff;
    }

    a.apply-page-btn + a.apply-page-btn {
      margin-left: 10px;
    }

    a.apply-page-btn-default {
      background: #f1f2f3 !important;
      color: #606266 !important;
      border: 1px solid #cacbcc;
    }
  }
}
</style>
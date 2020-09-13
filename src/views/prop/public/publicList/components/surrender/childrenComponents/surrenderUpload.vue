<template>
  <div class="added-addedUpload">
    <div class="added-addedUpload-box">
      <h4>保险事项变更申请书</h4>
      <a href="javascipt:;" @click="htmlToPrint">打印并盖章</a>
    </div>
    <div class="added-addedUpload-box">
      <h4>上传申请书</h4>
      <div class="added-addedUpload-box-upload">
        <el-upload
          action="123"
          list-type="picture-card"
          :class="{ disabled: uploadDisabled1 }"
          :on-change="handleChange1"
          :multiple="false"
          :limit="limitcount1"
          :http-request="httpRequest"
          :on-remove="handleRemove1"
          :on-preview="handlePictureCardPreview1"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <p></p>
      </div>
    </div>
    <!-- 查看大图 -->
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>
    <printf-template :formData="formData" style="display: none"></printf-template>
    <div class="apply-page-bot">
      <a class="apply-page-btn" href="javascript:;" @click="submission">提交</a>
      <a class="apply-page-btn apply-page-btn-default" href="javascript:;" @click="revert">返回</a>
    </div>
  </div>
</template>

<script>
import PrintfTemplate from "./print/template";
import {
  filePolicy,
  insPubGetApplyDetail,
  insPubReturnApply
} from "@/api/information/information";
import $ from "jquery";
export default {
  name: "surrenderUpload",
  props: ["obj"],
  components: { PrintfTemplate },
  data() {
    return {
      limitcount1: 1,
      uploadDisabled1: false,
      dialogVisible: false,
      dialogImageUrl: "",
      formData: {},
      imgUrl: ""
    };
  },
  created() {
    // console.log(this.obj, "打印");
    this.getOssToken();
    this.getApplyDetail();
  },
  methods: {
    // 获取选中后的保单号
    getApplyDetail() {
      insPubGetApplyDetail(this.obj.form.id).then(xhrData => {
        // console.log(xhrData);
        if (xhrData.code === 200) {
          this.obj.form.orderNo = xhrData.data.orderNo;
          // console.log(this.obj, "objData");
          this.formData = this.obj.form;
        }
      });
    },

    //获取上传通行证
    getOssToken() {
      var _self = this;
      filePolicy()
        .then(function(res) {
          // console.log(res);

          if (res.code == 200) {
            _self.aliyunOssToken = res.data;
          } else {
            _self.$message.error(res.data.message);
          }
        })
        .catch(function(error) {
          // console.log(error);
        });
    },
    // 上传文件
    handleChange1(file1, fileList) {
      this.uploadDisabled1 = fileList.length >= this.limitcount1;
      var _self = this;
       // 加载动画
      const loading = this.$loading({
        lock: true,
        text: "上传中，请等待...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      var getSuffix = function(fileName) {
        var pos = fileName.lastIndexOf(".");
        var suffix = "";
        if (pos != -1) {
          suffix = fileName.substring(pos);
        }
        return suffix;
      };
      var filename = new Date().getTime() + getSuffix(file1.name);
      var formData = new FormData();
      //注意formData里append添加的键的大小写
      formData.append("key", _self.aliyunOssToken.dir + filename); //存储在oss的文件路径
      formData.append("OSSAccessKeyId", _self.aliyunOssToken.accessKeyId); //accessKeyId
      formData.append("policy", _self.aliyunOssToken.policy); //policy
      formData.append("Signature", _self.aliyunOssToken.signature); //签名
      //如果是base64文件，那么直接把base64字符串转成blob对象进行上传就可以了

      formData.append("file", file1.raw);
      formData.append("success_action_status", 200); //成功后返回的操作码
      var url =  _self.aliyunOssToken.action;

      var fileUrl =
        _self.aliyunOssToken.action + "/" + _self.aliyunOssToken.dir + filename;

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
          // _self.uploadUrl.policyHeadFile = fileUrl;
          _self.imgUrl = fileUrl;
          // 关闭加载动画
          loading.close();
        },
        error: function(data) {
          // console.log(data, "失败");
          // 关闭加载动画
          loading.close();
        }
      });
    },
    httpRequest(file) {
      // console.log(file);
    },
    // 清除上传文件
    handleRemove1(file, fileList) {
      this.uploadDisabled1 = fileList.length >= this.limitcount1;
    },
    handlePictureCardPreview1(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 打印投保明细
    htmlToPrint() {
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
    // 提交
    submission() {
      // console.log(this.obj,this.imgUrl,'提交');
      // console.log(this.obj.form);
      
      const upData = {
        applyId: this.obj.id,
        projectId: this.obj.form.projectNameId,
        startTime: this.obj.form.startTime + " 00:00:00",
        applyFile:this.imgUrl
      };
      if(upData.applyFile == ''){
        this.$message.warning('请上传文件！')
        return
      }
      insPubReturnApply(upData).then(xhrData => {
        // console.log(xhrData);
        if (xhrData.code === 200) {
          this.$message({
            message: "提交成功，请耐心等待，保险经办人会尽快处理的",
            type: "success"
          },3000);
          this.$emit("changePage2", "LIST",this.obj);
        }
      });
    },
    // 返回
    revert() {
      this.$emit("changePage2", "DECLARE");
    }
  }
};
</script>

<style lang='scss' scoped>
.added-addedUpload {
  padding: 20px;
  box-sizing: border-box;
  .added-addedUpload-box {
    display: flex;
    align-items: center;
    padding-bottom: 40px;
    box-sizing: border-box;
    h4 {
      width: 150px;
    }
    a {
      display: block;
      width: 120px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      background-color: #ec808d;
      color: #fff;
      margin-left: 50px;
    }
    .added-addedUpload-box-upload {
      margin-left: 50px;
      // width: 220px;
      text-align: center;
      p {
        padding-top: 10px;
        box-sizing: border-box;
      }
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
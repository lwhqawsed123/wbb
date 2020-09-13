<template>
  <div class="added-addedUpload">
    <div class="added-addedUpload-box">
      <h4 style="width:70px">批单清单</h4>
      <a href="javascipt:;" @click="htmlToPrint">查看并打印</a>
    </div>
    <div class="added-addedUpload-box">
      <h4 style="width:70px">批单资料</h4>
      <div class="added-addedUpload-box-upload">
        <div class="demo-image__preview-box" v-for="(item,index) in imgData" :key="index">
          <el-image
            v-if="item.url != ''"
            style="width: 150px; height: 150px;cursor: pointer;"
            :src="item.url"
            :preview-src-list="srcList1"
            @click="getImgUrl1(index)"
          ></el-image>
          <el-image
            style="width: 150px; height: 150px;background-color: #f5f7fa;display: flex; justify-content: center; align-items: center;"
            v-if="item.url == ''"
          >
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
        </div>
        <p>批单清单（骑缝章）</p>
      </div>
    </div>
    <div style="margin-top:30px;display:flex;align-items: center;">
      <h4 style="width:70px">批单号</h4>
      <el-input disabled style="width:250px;margin-left:50px" v-model.trim="form.policyNo"></el-input>
    </div>
    <div style="margin-top:30px;display:flex;align-items: center;">
      <h4 style="width:70px">结算类型</h4>
      <el-input disabled style="width:250px;margin-left:50px" v-model.trim="form.type"></el-input>
    </div>
    <div style="margin-top:30px;display:flex;align-items: center;">
      <h4 style="width:70px">结算金额</h4>
      <el-input disabled style="width:250px;margin-left:50px" v-model.trim="form.amount"></el-input>
    </div>
    <printf-template :policyInfo="propertyData" :policyList="formArr" style="display: none"></printf-template>
    <div class="apply-page-bot">
      <a v-if="isShowSettlement" class="apply-page-btn" href="javascript:;" @click="settlement">结算</a>
      <a class="apply-page-btn apply-page-btn-default" href="javascript:;" @click="goBack()">返回</a>
    </div>
    <!-- 查看 对话框 -->
    <el-dialog title="收款信息" class="seeDialog" :visible.sync="dialogVisible" width="50%">
      <h3 style="padding-bottom:20px">收款账号</h3>
      <el-form ref="seeForm" :model="seeForm" label-width="130px">
        <el-form-item label="保险公司名称：">
          <el-input disabled v-model="seeForm.name"></el-input>
        </el-form-item>
        <el-form-item label="户名：">
          <el-input disabled v-model="seeForm.compProjectName"></el-input>
        </el-form-item>
        <el-form-item label="开户银行：">
          <el-input disabled v-model="seeForm.idCard"></el-input>
        </el-form-item>
        <el-form-item label="银行账户：">
          <el-input disabled v-model="seeForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="付款金额：">
          <el-input disabled v-model="seeForm.isSocialSecurity"></el-input>
        </el-form-item>
        <el-form-item label="经办人：">
          <el-input disabled v-model="seeForm.isSocialSecurity"></el-input>
        </el-form-item>
        <el-form-item label="经办人联系电话：">
          <el-input disabled v-model="seeForm.isSocialSecurity"></el-input>
        </el-form-item>
        <!--  -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <a href="javascript:;" class="btn btn2" @click="dialogVisible=false">关 闭</a>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import PrintfTemplate from "./print/template";
import {
  filePolicy,
  insEmpCustomReviseDetail,
  getPropCompany,
  insEmpCustomRevise
} from "@/api/information/information";
import $ from "jquery";
export default {
  name: "added-addedUpload",
  props: ["obj"],
    components: { PrintfTemplate },
  data() {
    return {
      dialogVisible: false,
      isShowTips: false,
      form: {},
      seeForm:{},
      limitcount1: 1,
      uploadDisabled1: false,
      dialogVisible: false,
      dialogImageUrl: "",
      aliyunOssToken: {},
      propertyData: {},
      formArr:[],
      arrData: [],
      imgUrl: "",
      // 是否显示结算按钮
      isShowSettlement: false,
      imgData: [],
      srcList1: []
    };
  },
  created() {
    // console.log(this.obj, "ooooobbbbbb");
    this.getRevuse();
    this.getCompany();
    this.getCustomRevise()
  },
  mounted() {},
  methods: {
    // 当前信息详情
    getRevuse() {
      insEmpCustomReviseDetail(this.obj.id).then(xhrData => {
        if (xhrData.code === 200) {
          this.formArr = xhrData.rows;
        }
      });
    },
    // 当前信息
     getCustomRevise(){
      insEmpCustomRevise(this.obj.id).then(xhrData=>{
        // console.log(xhrData);
        if(xhrData.code === 200){
          this.imgData.push({
            url : xhrData.data.reviseFile
          })
          this.form.policyNo = xhrData.data.policyNo
          this.form.type = xhrData.data.type
          if(this.form.type == '0'){
            this.form.type = '支出'
          }else if(this.form.type == '1'){
             this.form.type = '收入'
          }
          this.form.amount = xhrData.data.amount
        }
        
      })
    },
    //
    getCompany() {
      // 获取物业公司信息
      getPropCompany().then(xhrData => {
        if (xhrData.code === 200) {
          this.propertyData = xhrData.data;
        }
      });
    },
    // 返回
    goBack() {
      this.$emit("changePage", "LIST");
    },
    // 提交资料
    settlement() {
        this.dialogVisible = true
    },
    getImgUrl1(index) {
      // 先还原
      this.srcList1 = [];
      // 后添加
      this.srcList1.push(this.imgData[index].url);
    },
    // 打印投保明细
    htmlToPrint() {
      let CSS_PRINT =
        "<style>" +
        document.getElementById("CSS_PRINT2").innerHTML +
        "</style>";
      let HTML_PRINT = document.getElementById("printf-box2").outerHTML;
      // SCRIPT_PRINT1
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
  }
};
</script>
<style>
.seeDialog .el-dialog__header {
  background-color: #e6e8eb;
}
.seeDialog .el-dialog__title {
  font-size: 20px;
  font-weight: bold;
}
.seeDialog .el-dialog__footer {
  background-color: #e6e8eb;
}
.seeDialog .el-dialog__body {
  padding-left: 30px;
  padding-right: 30px;
  box-sizing: border-box;
}
.seeDialog .el-dialog__footer {
  padding-bottom: 10px;
}
.seeDialog .btn {
  /* background-color: #e6e8eb; */
  width: 82px;
  height: 32px;
  border-radius: 2px;
  text-align: center;
  line-height: 32px;
  font-weight: bold;
  display: inline-block;
  font-size: 14px;
}
.seeDialog .btn.btn1 {
  background: rgba(239, 130, 0, 1);
  border: 1px solid rgba(206, 112, 0, 1);
  color: #fff;
}
.seeDialog .btn.btn2 {
  border: 1px solid rgba(0, 0, 0, 0.25);
}
</style>
<style>
.disabled .el-upload--picture-card {
  display: none;
}
</style>
<style lang="scss" scoped>
.added-addedUpload {
  padding: 20px;
  box-sizing: border-box;
  .added-addedUpload-p {
    padding-bottom: 30px;
    box-sizing: border-box;
    color: red;
    font-size: 14px;
  }
  .added-addedUpload-box {
    display: flex;
    align-items: center;
    padding-bottom: 40px;
    box-sizing: border-box;
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
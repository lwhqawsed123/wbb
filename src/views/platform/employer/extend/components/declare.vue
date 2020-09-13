<template>
  <!-- 雇主险扩展24小时-> 申报 -->
  <div class="declare-wrap">
    <!-- 批单清单 -->
    <div class="declare-wrap-box">
      <h4>批单清单</h4>
      <div class="box-btn btn1" @click="printing">查看并打印</div>
    </div>
    <!-- 批单资料 -->
    <div class="declare-wrap-box">
      <h4>批单资料</h4>
      <el-upload
        action="123"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :auto-upload="false"
      >
        <i class="el-icon-plus"></i>
      </el-upload>
    </div>
    <!-- 提交 -->
    <div style="padding-top:20px;padding-left:100px;display:flex">
      <div class="box-btn btn2">提 交</div>
      <div class="box-btn btn3" style="margin-left:15px" @click="revert">返 回</div>
    </div>
    <printf-template :policyInfo="policyInfo" :policyList="policyList" style="display: none"></printf-template>
  </div>
</template>

<script>
import PrintfTemplate from "./print/template";
export default {
  name: "declare",
  components: { PrintfTemplate },
  data() {
    return {
      policyInfo: {
        name1: "物业公司名称",
        name2: "123321123321123",
        name3: "联系人",
        name4: "13122222222",
        name5: "公司地址123654",
      },
      policyList: [
        {
          name: "项目名1",
          bName: "被保人姓名1",
          sfz: "被保人身份证1",
          sj: "被保人手机号1",
          sb: "有",
          xz: "新增",
          ks: "2020-1-1",
          js: "2020-7-1"
        },
        {
          name: "项目名2",
          bName: "被保人姓名2",
          sfz: "被保人身份证2",
          sj: "被保人手机号2",
          sb: "有",
          xz: "新增",
          ks: "2020-1-1",
          js: "2020-7-1"
        },
        {
          name: "项目名3",
          bName: "被保人姓名3",
          sfz: "被保人身份证3",
          sj: "被保人手机号3",
          sb: "有",
          xz: "新增",
          ks: "2020-1-1",
          js: "2020-7-1"
        }
      ]
    };
  },
  methods: {
    handleRemove(file, fileList) {
      // console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 返回
    revert() {
      this.$emit("changePage", "LIST");
    },
    // 打印
    printing() {
      // this.$emit("changePage", "PRINTING");
      this.htmlToPrint();
    },
    htmlToPrint() {
      let CSS_PRINT =
        "<style>" + document.getElementById("CSS_PRINT").innerHTML + "</style>";
      let HTML_PRINT = document.getElementById("printf-box").outerHTML;
      let HTML = CSS_PRINT + HTML_PRINT;
      var win = window.open("");
      win.document.write(HTML);
      let timer = setTimeout(() => {
        win.print();
        win.close();
        clearTimeout(timer);
      }, 100);
    }
  }
};
</script>
<style>
.box-btn {
  width: 120px;
  height: 36px;
  text-align: center;
  line-height: 36px;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
}
.box-btn.btn1 {
  background-color: #dd6075;
  border: 1px solid #dd6075;
}
.box-btn.btn2 {
  background-color: #6aa5f1;
  border: 1px solid #6aa5f1;
}
.box-btn.btn3 {
  /* background-color: #6aa5f1; */
  border: 1px solid #afafaf;
  color: #8f8f8f;
}
</style>
<style lang="scss" scoped>
.declare-wrap {
  padding: 20px;
  box-sizing: border-box;
  color: #606266;
  .declare-wrap-box {
    display: flex;
    align-items: center;
    padding-bottom: 50px;
    h4 {
      padding-right: 40px;
    }
  }
}
</style>
<template>
  <!-- 雇主险发票申请 -->
  <div class="invoiceApply" id="invoiceApply">
    <div class="invoiceApply-conter">
      <div class="invoiceApply-wrap">
        <div class="invoiceApply-wrap-top">
          <el-form
            ref="form"
            :rules="rules"
            :model="form"
            label-width="120px"
            label-position="left"
          >
            <h3>申报信息</h3>
            <el-form-item label="申报单位:">
              <span>{{companyName}}</span>
            </el-form-item>
            <el-form-item label="发票抬头:">
              <el-select @change="getTitleVal" v-model="declareId" placeholder="请选择">
                <el-option
                  v-for="(item,index) in data"
                  :key="index"
                  :label="item.title"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="税号:">
              <span>{{invoiceData.einNo}}</span>
            </el-form-item>
            <el-form-item label="单位地址:">
              <span>{{invoiceData.address}}</span>
            </el-form-item>
            <el-form-item label="电话号码:">
              <span>{{invoiceData.telphoneNo}}</span>
            </el-form-item>
            <el-form-item label="开户银行:">
              <span>{{invoiceData.openingBank}}</span>
            </el-form-item>
            <el-form-item label="公司账号:">
              <span>{{invoiceData.companyAccount}}</span>
            </el-form-item>
            <el-form-item label="发票类型:">
              <el-select v-model="form.type1">
                <el-option label="增值税专票" :value="1"></el-option>
                <el-option label="增值税普票" :value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="发票打印类型:">
              <el-select @change="invoiceType" v-model="form.type2">
                <el-option label="蓝票" value="BLUE_TICKET"></el-option>
                <el-option label="红票" value="RED_TICKET"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="isShow" label="原发票序列号:" prop="originaSequence">
              <el-input v-model="form.originaSequence"></el-input>
            </el-form-item>
            <el-form-item v-if="isShow" label="原发票号码:" prop="originalInvoice">
              <el-input v-model="form.originalInvoice"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="invoiceApply-wrap-main">
          <h3>发票快递信息</h3>
          <p>
            <span>收件人:</span>
            <span>{{invoiceData.recipient}}</span>
          </p>
          <p>
            <span>手机号:</span>
            <span>{{invoiceData.mobileNo}}</span>
          </p>
          <p>
            <span>邮编:</span>
            <span>{{invoiceData.zipCode}}</span>
          </p>
          <p>
            <span>邮寄地址:</span>
            <span>{{invoiceData.dizi}}</span>
          </p>
        </div>
        <div class="recharge-bottom">
          <div class="recharge-btn" @click="applySubmit">申请</div>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
/* getPropCompany */
#invoiceApply .el-select {
  width: 400px !important;
}
#invoiceApply .el-input--medium {
  width: 400px !important;
}
</style>
<script>
import {
  queryInvoiceList,
  getInvoiceById,
  getPropCompany,
  applyEinvoices,
  einvoicesGetBizs
} from "@/api/information/information";
export default {
  name: "invoiceApply",
  data() {
    return {
      // 是否显示
      isShow: false,
      // 发票所以信息数据
      data: [],
      // 发票当前信息数据
      invoiceData: {},
      // 申报单位id
      declareId: "",
      // 当前物业公司
      companyName: "",
      // 保单号数据
      bizData: [],
      // 保单号
      bizNo: "",
      // 保单号类型
      bizNoType: "",
      // 表单内容
      form: {
        // 发票类型
        type1: "",
        // 发票打印类型
        type2: "BLUE_TICKET",
        // 原发票序列号
        originaSequence: "",
        // 原发票号码
        originalInvoice: ""
      },
      // 表单验证
      rules: {
        // 原发票序列号
        originaSequence: [
          { required: true, message: "请输入发票序列号", trigger: "blur" }
        ],
        // 原发票号码
        originalInvoice: [
          { required: true, message: "请输入原发票号码", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    // 调用 获取发票信息 方法
    this.getInvoiceList();
    // 调用 获取当前公司信息 方法
    this.getCompany();
    // 调用 获取保单号 方法
    this.getBizs();
  },
  methods: {
    // 获取可以申请的保单
    getBizs() {
      einvoicesGetBizs().then(xhrData => {
        
        if (xhrData.code === 200) {
          const arr = [];
          for (let i = 0; i < xhrData.data.length; i++) {
            arr[i] = {
              bizNo: xhrData.data[i].bizNo,
              bizNoType: xhrData.data[i].bizNoType
            };
          }
          this.bizData = arr;
        }
      });
    },
    // 获取当前公司信息
    getCompany() {
      //  请求 获取当前公司信息
      getPropCompany().then(xhrData => {
        if (xhrData.code === 200) {
          this.companyName = xhrData.data.name;
        }
      });
    },
    // 提取 获取发票信息方法
    getInvoiceList() {
      // 请求 获取发票信息
      const page = {
        title: "",
        recipient: "",
        pageSize: "",
        pageNum: ""
      };
      queryInvoiceList(page).then(xhrData => {
        if (xhrData.code === 200) {
          this.data = xhrData.rows;
          this.invoiceData = xhrData.rows[0];
          this.declareId = xhrData.rows[0].id;
          this.invoiceData.dizi =
            xhrData.rows[0].provinceName +
            xhrData.rows[0].cityName +
            xhrData.rows[0].areaName +
            xhrData.rows[0].detailAddress;
          this.form.type1 = xhrData.rows[0].type;
        }
      });
    },
    // 下拉框获取信息
    getTitleVal(val) {
      // 根据id 获取发票明细
      getInvoiceById(val).then(xhrData => {
        this.invoiceData = xhrData.data;
        this.invoiceData.dizi =
          xhrData.data.provinceName +
          xhrData.data.cityName +
          xhrData.data.areaName +
          xhrData.data.detailAddress;
        this.form.type1 = xhrData.data.type;
      });
    },
    // 申请提交
    applySubmit() {
      const _this = this;
      if (this.form.type1 == "1") {
        this.form.type1 = "SPECIAL";
      } else if (this.form.type1 == "2") {
        this.form.type1 = "NORMAL";
      }
      if (this.form.originaSequence == undefined) {
        this.form.originaSequence = "";
      }
      if (this.form.originalInvoice == undefined) {
        this.form.originalInvoice = "";
      }
      // 请求 发票申请
      const data = {
        // 发票抬头id
        invoiceTitleId: this.declareId,
        // 发票类型
        issuedType: this.form.type1,
        // 发票打印类型
        invoicePrintType: this.form.type2,
        // 原发票序列号
        originalTicketNo: this.form.originaSequence,
        // 原发票号码
        originalTicketCode: this.form.originalInvoice,
        // 保单数据
        insEmpEinvoicesApplyDetails: this.bizData,
        applyStyle: "ONLINE"
      };
      // 表单验证
      this.$refs["form"].validate(valid => {
        if (valid) {
          // 通过验证
          // 开启加载动画
          const loading = this.$loading({
            lock: true,
            text: "申请中,请稍后...",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)"
          });
          // 请求 申请
          applyEinvoices(data).then(xhrData => {
            if (xhrData.code === 200) {
              setTimeout(() => {
                // 清空数据
                this.form.originaSequence = "";
                this.form.originalInvoice = "";
                // 关闭加载动画
                loading.close();
                this.$message.success("申请成功!");
                this.form.type1 = data.issuedType;
                if (data.issuedType == "NORMAL") {
                  this.form.type1 = 2;
                } else if (data.issuedType == "SPECIAL") {
                  this.form.type1 = 1;
                }
              }, 3000);
            }else{
              // 关闭加载动画
              loading.close();
              this.$message.error('申请失败');
            }
          }).catch(()=>{
            // 关闭加载动画
            loading.close();
          })
        } else {
          if (data.issuedType == "NORMAL") {
            this.form.type1 = 2;
          } else if (data.issuedType == "SPECIAL") {
            this.form.type1 = 1;
          }
          this.$message.warning("请输入完全!");
          return false;
        }
      });
    },
    // 发票打印类型下拉框
    invoiceType(val) {
      if (val == "BLUE_TICKET") {
        this.isShow = false;
      } else if (val == "RED_TICKET") {
        this.isShow = true;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.invoiceApply {
  width: 100%;
  padding: 15px;
  min-height: calc(88vh);
  box-sizing: border-box;
  background-color: #e6e8eb;
  padding-bottom: 30px;
  .invoiceApply-conter {
    min-height: calc(88vh);
    background-color: #fff;
    border-radius: 5px;
    position: relative;
    padding-bottom: 100px;
    .invoiceApply-wrap {
      padding: 20px 40px;
      box-sizing: border-box;
      .invoiceApply-wrap-top {
        p {
          font-size: 16px;
          color: #666;
          // font-weight: bold;
          margin-top: 40px;
          span {
            display: inline-block;
          }
          span:nth-child(1) {
            text-align: left;
            width: 120px;
          }
        }
      }
      .invoiceApply-wrap-main {
        padding-bottom: 40px;
        h3 {
          color: #333;
          margin-top: 50px;
        }
        p {
          font-size: 16px;
          color: #666;
          // font-weight: bold;
          margin-top: 40px;
          span {
            display: inline-block;
          }
          span:nth-child(1) {
            text-align: left;
            width: 120px;
          }
        }
        #invoice-form {
          width: 50%;
        }
      }
      .recharge-bottom {
        padding-top: 24px;
        padding-bottom: 30px;
        box-sizing: border-box;
        border-top: 1px solid #e2e2e2;
        // padding-left: 20px;
        .recharge-btn {
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
          font-size: 14px;
          color: #fff;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
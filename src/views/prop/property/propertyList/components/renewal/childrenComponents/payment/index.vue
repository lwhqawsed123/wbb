<template>
  <div class="payment-index">
    <el-form id="paymentForm" ref="form" :rules="rules" :model="form" label-width="120px">
      <el-row>
        <el-col :span="10">
          <h4>收款账号</h4>
          <el-form-item label="保险公司名称:">
            <el-input disabled v-model="insCompany.name"></el-input>
          </el-form-item>
          <el-form-item label="户名:">
            <el-input disabled v-model="insCompany.accountName"></el-input>
          </el-form-item>
          <el-form-item label="开户银行:">
            <el-input disabled v-model="insCompany.openAccountBank"></el-input>
          </el-form-item>
          <el-form-item label="银行账户:">
            <el-input disabled v-model="insCompany.bankAccount"></el-input>
          </el-form-item>
          <el-form-item label="付款金额:">
            <el-input disabled v-model="totalPremium"></el-input>
          </el-form-item>
          <el-form-item label="经办人:">
            <el-input disabled v-model="insCompany.contact"></el-input>
          </el-form-item>
          <el-form-item label="经办人联系电话:">
            <el-input disabled v-model="insCompany.contactPhone"></el-input>
          </el-form-item>
          <h4>开票信息</h4>
          <el-form-item  label="开票抬头:" prop="invoiceId">
            <el-select clearable @change="rise" v-model="form.invoiceId" placeholder="请选择开票抬头">
              <el-option
                v-for="item in titleData"
                :key="item.id"
                :label="item.title"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="!isDisabled" :required="!isDisabled" label="发票抬头:" prop="title">
            <el-input :disabled="isDisabled" v-model.trim="form.title"></el-input>
          </el-form-item>
          <el-form-item v-if="!isDisabled" label="税号:" prop="einNo">
            <el-input v-model.trim="form.einNo"></el-input>
          </el-form-item>
          <el-form-item v-if="!isDisabled" label="单位地址:" prop="address">
            <el-input v-model.trim="form.address"></el-input>
          </el-form-item>
          <el-form-item v-if="!isDisabled" label="电话号码:" prop="telphoneNo">
            <el-input @input="change($event)" :maxlength="15" v-model="form.telphoneNo"></el-input>
            <!-- <el-col :span="7">
              <el-form-item prop="phoneCode">
                <el-input oninput="value=value.replace(/[^\d]/g,'')" @input="change($event)" :maxlength="5" v-model="form.phoneCode"></el-input>
              </el-form-item>
            </el-col>
            <el-col class="line" :span="1" style="text-align: center">-</el-col>
            <el-col :span="16">
              <el-form-item style="display: inline-block;width:100%" prop="telephone">
                <el-input oninput="value=value.replace(/[^\d]/g,'')" @input="change($event)" :maxlength="8" v-model="form.telephone"></el-input>
              </el-form-item>
            </el-col> -->
          </el-form-item>
          <el-form-item v-if="!isDisabled" label="开户银行:" prop="openingBank">
            <el-input v-model.trim="form.openingBank"></el-input>
          </el-form-item>
          <el-form-item v-if="!isDisabled" label="公司账号:" prop="companyAccount">
            <el-input v-model.trim="form.companyAccount"></el-input>
          </el-form-item>
          <el-form-item v-if="!isDisabled" label="开票类型:">
            <el-radio v-model="form.type" label="1">增值税专票</el-radio>
          </el-form-item>
          <h4 v-if="!isDisabled">发票快递信息</h4>
          <el-form-item v-if="!isDisabled" label="收件人:" prop="recipient">
            <el-input v-model.trim="form.recipient"></el-input>
          </el-form-item>
          <el-form-item v-if="!isDisabled" label="手机号:" prop="mobileNo">
            <el-input :maxlength="11" v-model.trim="form.mobileNo"></el-input>
          </el-form-item>
          <el-form-item v-if="!isDisabled" label="邮箱:" prop="emailAddress">
            <el-input v-model.trim="form.emailAddress"></el-input>
          </el-form-item>
          <el-form-item v-if="!isDisabled" label="区域" prop="selectedOptions">
            <el-cascader :options="options" v-model="form.selectedOptions" @change="handleChange"></el-cascader>
          </el-form-item >
          <el-form-item v-if="!isDisabled" label="详细地址:" prop="detailAddress">
            <el-input type="textarea" v-model.trim="form.detailAddress"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="apply-page-bot">
      <a class="apply-page-btn" href="javascript:;" @click="submission">确认付款</a>
    </div>
  </div>
</template>

<script>
import {
  insRuleGetProduct,
  queryInvoiceList,
  insPropConfirmPay,
  sysRegion
} from "@/api/information/information";
export default {
  name: "payment-index",
  // props: ["arrData"],
  props: ["obj"],
  data() {
    let validateTitle = (rule, value, callback) => {
      if (this.form.title === "") {
        callback(new Error("请输入发票抬头"));
      } else {
        callback();
      }
    };
    return {
      // 表单数据
      form: {
        type: "1",
        title:''
      },
      //  表单验证
      rules: {
         invoiceId: [
          // { required: true, message: "请选择发票抬头", trigger: "change" 11 }
        ],
        selectedOptions: [
          { required: true, message: "请选择区域", trigger: "change" }
        ],
        title: [{ validator: validateTitle }],
        einNo: [{ required: true, message: "请输入税号", trigger: "blur" }],
        address: [{ required: true, message: "请输入地址", trigger: "blur" }],
        phoneCode: [{ required: true, message: "请输入号码", trigger: "blur" }],
        telephone: [{ required: true, message: "请输入号码", trigger: "blur" }],
        telphoneNo: [{ required: true, message: "请输入手机号/固号", trigger: "blur" }],
        openingBank: [{ required: true, message: "请输入开户银行", trigger: "blur" }],
        companyAccount: [
          { required: true, message: "请输入公司账号", trigger: "blur" }
        ],
        recipient: [{ required: true, message: "请输入收件人", trigger: "blur" }],
        // 手机号
        mobileNo: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            pattern: /^1(3|4|5|6|7|8|9)\d{9}$/,
            message: "手机号格式不对",
            trigger: "blur"
          }
        ],
        // 邮箱
        emailAddress: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            pattern: /^([a-zA-Z0-9_\.\-]+)@([a-zA-Z0-9_\.\-]+)\.([a-zA-Z]{2,4})$/,
            message: "请输入正确的邮箱",
            trigger: "blur"
          }
        ],
        detailAddress: [{ required: true, message: "请输入详细地址", trigger: "blur" }]
      },
      // 保险公司信息
      insCompany: {
        // 保险公司名称
        name: "",
        // 户名
        accountName: "",
        // 开户银行
        openAccountBank: "",
        // 银行账号
        bankAccount: "",
        // 经办人
        contact: "",
        // 经办人联系电话
        contactPhone: "",
        // 保险公司id
        id: ""
      },
      // 省市区数据
      options: [],
      // 开票抬头
      titleArr: [],
      //公众险主键id
      applyId: "",
      // 付款金额
      totalPremium: "",
      //
      isDisabled:false,
      // 开票抬头id
      titleId:'',
      // 开票抬头信息
      titleData:[]
    };
  },
  mounted() {
    this.getRuleGetProduct();
    this.getInvoiceList();
    this.getRegion()
    this.applyId = this.obj.insData.id;
    this.totalPremium = this.obj.insData.totalPremium;
  },
  methods: {
    //获取省市区
    getRegion() {
      sysRegion().then(xhrData => {
        if (xhrData.code === 200) {
          this.options = xhrData.data;
        }
      });
    },
    // 获取保险公司信息
    getRuleGetProduct() {
      const data = {
        insType: "4"
      };
      insRuleGetProduct(data).then(xhrData => {
        if (xhrData.code == 200) {
          this.insCompany = xhrData.data.insCompany;
        }
      });
    },
    // 获取开票抬头信息
    getInvoiceList() {
      const page = {
        pageSize: 99999,
        pageNum: 1,
        recipient: "",
        type: "",
        title: ""
      };
      queryInvoiceList(page).then(xhrData => {
        if (xhrData.code === 200) {
          this.titleArr = xhrData.rows;
          this.titleArr.forEach(item=>{
            if(item.type == '1'){
              this.titleData.push({
                title:item.title,
                id:item.id
              })
            }
          })
        }
      });
    },
    // 获取省市区信息
    // 选择公司所在省、市、区
    handleChange() {
      // 处理 省市级 数据
      // 省 编码
      this.form.provinceName = this.form.selectedOptions[0];
      // 市 编码
      this.form.cityName = this.form.selectedOptions[1];
      // 区 编码
      this.form.areaName = this.form.selectedOptions[2];
      this.form.area =
        this.form.provinceName + this.form.cityName + this.form.areaName;
    },
    // 确认付款
    submission() {
      //   console.log(this.form);
      this.$refs["form"].validate(valid => {
        if (valid) {
          //   alert("submit!");
          this.form.applyId = this.applyId;
          this.form.insCompId = this.insCompany.id;
          this.form.id = this.titleId
          // this.form.telphoneNo = this.form.phoneCode+'-'+this.form.telephone
          // console.log(this.form);
          insPropConfirmPay(this.form).then(xhrData => {
            // console.log(xhrData);
            if (xhrData.code === 200) {
              this.$message({
                message: "提交成功，请耐心等待，保险经办人会尽快处理的",
                type: "success"
              });
              this.$emit("changePage2", "RETURN");
            }
          });
        } else {
          //   console.log("error submit!!");
          this.$message({
            message: "请输入完成",
            type: "warning"
          });
          return false;
        }
      });
    },
    // 获取文本框值
    change(e) {
      this.$forceUpdate();
    },
    // 触发方法抬头
    rise(val) {
      if(val == ''){
        this.isDisabled = false
      }else{
        this.isDisabled = true
        this.titleId = val
      }
    }
  }
};
</script>
<style>
#paymentForm .el-select,
#paymentForm .el-cascader--medium {
  width: 60%;
}
</style>
<style lang="scss" scoped>
.payment-index {
  padding: 30px;
  box-sizing: border-box;
  h4 {
    padding-bottom: 30px;
    box-sizing: border-box;
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
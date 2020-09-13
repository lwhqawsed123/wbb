<template>
  <div class="see-table-box">
    <div style="padding:50px 20px 10px 20px">
      <el-row
        :gutter="20"
        class="record-top"
        style="margin-left: 0px; margin-right: 0px; padding-bottom:10px;margin-bottom:20px"
      >
        <el-col>
          <div class="process">
            <div class="process-content">
              <div class="process-box">
                <div class="process-box-left">1</div>
                <div class="process-box-right">
                  <h5>{{processBoxList[0].name}}</h5>
                  <p>{{processBoxList[0].cName}}</p>
                </div>
              </div>
              <div class="process-box">
                <div class="process-box-left process-box-left2">2</div>
                <div class="process-box-right">
                  <h5>{{processBoxList[1].name}}</h5>
                  <p>{{processBoxList[1].cName}}</p>
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-form
        style="width:600px"
        :model="ruleForm"
        label-width="120px"
        label-position="right"
        ref="ruleForm"
        :rules="rules"
      >
        <el-form-item label="开票总金额">
          <template>
            <span style="color:#d9001b">￥ {{obj.orderMoney}}</span>
          </template>
        </el-form-item>
        <el-form-item label="开票类型" prop="billingType">
          <el-radio-group v-model="ruleForm.billingType" @change="changeBillingType">
            <el-radio
              v-for="item in billingTypeList"
              :key="item.billingType"
              :label="item.billingType"
              :disabled="(item.billingType===1&&obj.orderMoney<2000)?true:false"
            >{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="选择抬头">
          <el-select
            v-model="ruleForm.invoiceTitleId"
            clearable
            placeholder="请选择"
            style="width:100%"
          >
            <el-option
              v-for="item in invoiceOptions"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <div v-if="!ruleForm.invoiceTitleId">
          <h4 style="margin:10px 0;color:#409eff">开票信息</h4>
          <el-form-item label="发票抬头" prop="title">
            <el-input v-model.trim="ruleForm.title"></el-input>
          </el-form-item>
          <el-form-item label="税号" prop="einNo">
            <el-input v-model.trim="ruleForm.einNo"></el-input>
          </el-form-item>
          <el-form-item
            label="单位地址"
            prop="address"
            v-show="ruleForm.billingType === 1"
            :required="ruleForm.billingType === 1"
          >
            <el-input v-model.trim="ruleForm.address"></el-input>
          </el-form-item>
          <el-form-item
            label="电话号码"
            prop="telphoneNo"
            v-show="ruleForm.billingType === 1"
            :required="ruleForm.billingType === 1"
          >
            <el-input v-model.trim="ruleForm.telphoneNo"></el-input>
          </el-form-item>
          <el-form-item
            label="开户银行"
            prop="openingBank"
            v-show="ruleForm.billingType === 1"
            :required="ruleForm.billingType === 1"
          >
            <el-input v-model.trim="ruleForm.openingBank"></el-input>
          </el-form-item>
          <el-form-item
            label="公司账号"
            prop="companyAccount"
            v-show="ruleForm.billingType === 1"
            :required="ruleForm.billingType === 1"
          >
            <el-input v-model.trim="ruleForm.companyAccount"></el-input>
          </el-form-item>
          <h4 style="margin:10px 0;color:#409eff">发票快递信息</h4>
          <el-form-item label="收件人" prop="recipient">
            <el-input v-model.trim="ruleForm.recipient" placeholder></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobileNo">
            <el-input v-model.trim="ruleForm.mobileNo" maxlength="11"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="emailAddress">
            <el-input v-model.trim="ruleForm.emailAddress"></el-input>
          </el-form-item>
          <el-form-item
            label="区域"
            prop="selectedOptions"
            v-show="ruleForm.billingType === 1"
            :required="ruleForm.billingType === 1"
          >
            <el-cascader
              ref="cascaderAddr"
              v-model="ruleForm.selectedOptions"
              :options="options"
              @change="handleChange2"
              style="width:100%"
            ></el-cascader>
          </el-form-item>
          <el-form-item
            label="详细地址"
            prop="detailAddress"
            v-show="ruleForm.billingType === 1"
            :required="ruleForm.billingType === 1"
          >
            <el-input v-model.trim="ruleForm.detailAddress"></el-input>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <a href="javascript:;" class="invoice-btn btn1" @click="submit('ruleForm')">提 交</a>
      <a href="javascript:;" class="invoice-btn btn2" @click="revert">上一步</a>
    </div>
  </div>
</template>

<script>
import {
  recordDetailList,
  applyInvoice,
  financeAddInvoice,
  financeEditInvoice
} from "@/api/legal/legal_record";
import {
  queryInvoiceList,
  sysRegion,
  delInvoiceById,
  getPropCompany
} from "@/api/information/information";
export default {
  name: "insurance-added-list",
  props: ["obj"],
  data() {
    // 验证函数
    let validateTitle = (rule, value, callback) => {
      if (this.form.title === "") {
        callback(new Error("请输入发票抬头"));
      } else {
        callback();
      }
    };
    // 单位地址
    let validateAddress = (rule, value, callback) => {
      if (value === "") {
        if (this.ruleForm.billingType === 2) {
          callback();
        } else {
          callback(new Error("请输入单位地址"));
        }
      } else {
        callback();
      }
    };
    // 固定电话区号
    let validatePhoneCode = (rule, value, callback) => {
      if (value === "") {
        if (this.ruleForm.billingType === 2) {
          callback();
        } else {
          callback(new Error("请输入区号"));
        }
      } else if (!isNumber(value)) {
        callback(new Error("请输入数字"));
      } else {
        callback();
      }
    };
    // 固定电话
    let validateTelephone = (rule, value, callback) => {
      if (value === "") {
        if (this.ruleForm.billingType === 2) {
          callback();
        } else {
          callback(new Error("请输入固定电话"));
        }
      } else if (!isNumber(value)) {
        callback(new Error("请输入数字"));
      } else {
        callback();
      }
    };
    // 手机号
    let validateTelphoneNo = (rule, value, callback) => {
      if (value === "") {
        if (this.ruleForm.billingType === 2) {
          callback();
        } else {
          callback(new Error("请输入手机/电话"));
        }
      }
      // else if (!isNumber(value)) {
      //   callback(new Error("请输入数字"));
      // }
      else {
        callback();
      }
    };
    // 开户银行
    let validateOpeningBank = (rule, value, callback) => {
      if (value === "") {
        if (this.ruleForm.billingType === 2) {
          callback();
        } else {
          callback(new Error("请输入开户银行"));
        }
      } else {
        callback();
      }
    };
    // 开户银行
    let validateCompanyAccount = (rule, value, callback) => {
      if (value === "") {
        if (this.ruleForm.billingType === 2) {
          callback();
        } else {
          callback(new Error("请输入银行账户"));
        }
      } else {
        callback();
      }
    };
    // 区域
    let validateSelectedOptions = (rule, value, callback) => {
      if (value.length <= 0) {
        if (this.ruleForm.billingType === 2) {
          callback();
        } else {
          callback(new Error("请输入区域"));
        }
      } else {
        callback();
      }
    };
    // 详细地址
    let validateDetailAddress = (rule, value, callback) => {
      if (value === "") {
        if (this.ruleForm.billingType === 2) {
          callback();
        } else {
          callback(new Error("请输入详细地址"));
        }
      } else {
        callback();
      }
    };
    return {
      // 获取发票抬头
      invoiceOptions: [],
      // 表单数据
      ruleForm: {
        // 发票类型
        billingType: 2,
        // 发票抬头id
        invoiceTitleId: "",
        // 公司名称
        pcName: "",
        // 发票抬头
        title: "",
        // 税号
        einNo: "",
        // 单位地址
        address: "",
        // 联系电话
        telphoneNo: "",
        // 开户银行
        openingBank: "",
        // 公司账号
        companyAccount: "",
        // 固定电话区号
        phoneCode: "",
        // 固定电话号码
        telephone: "",
        // 发票类型
        type: 1,
        // 收件人
        recipient: "",
        // 手机号
        mobileNo: "",
        // 邮箱
        emailAddress: "",
        // 邮编
        zipCode: "",
        // 区域
        area: "",
        // 详细地址
        detailAddress: "",
        // 省编码
        provinceCode: "",
        // 省
        provinceName: "",
        // 市编码
        cityCode: "",
        // 市
        cityName: "",
        // 区/县编码
        areaCode: "",
        // 区
        areaName: "",
        // 区域
        selectedOptions: []
      },
      // 公司名称
      pcName: "",
      // 省市区下拉框
      options: [],
      processBoxList: [
        { name: "选择订单", cName: "" },
        { name: "发票详情", cName: "" }
      ],
      // 发票类型
      billingTypeList: [
        { billingType: 1, name: "增值税专票" },
        { billingType: 2, name: "增值税普票" }
      ],
      // 表单验证
      rules: {
        // 公司名称
        // pcName: [
        //   { required: true, message: "请输入公司名称", trigger: "blur" }
        // ],
        // 发票抬头
        title: [{ required: true, message: "请输入发票抬头", trigger: "blur" }],
        // title: [{  validator: validateTitle }],
        // 税号
        einNo: [{ required: true, message: "请输入税号", trigger: "blur" }],
        // 单位地址
        address: [
          // {  message:"请输入单位地址", trigger: "blur" }
          { validator: validateAddress }
        ],
        // 联系电话
        telphoneNo: [{ validator: validateTelphoneNo }],
        // 开户银行
        // openingBank: [{ message: "请输入开户银行", trigger: "blur" }],
        openingBank: [{ validator: validateOpeningBank }],

        // 公司账号
        // companyAccount: [{ message: "请输入公司账号", trigger: "blur" }],
        companyAccount: [{ validator: validateCompanyAccount }],
        // 收件人
        recipient: [
          { required: true, message: "请输入收件人", trigger: "blur" }
        ],
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
        // 详细地址
        detailAddress: [{ validator: validateDetailAddress }],
        // 区域
        selectedOptions: [{ validator: validateSelectedOptions }],

        // 固定电话区号
        phoneCode: [{ validator: validatePhoneCode }],
        // phoneCode: [
        //   {  message: "请输入区号", trigger: "blur" },
        //   { pattern: /^[0-9]*$/, message: "请输入数字", trigger: "blur" }
        // ],
        // 固定电话
        telephone: [{ validator: validateTelephone }]
        // telephone: [
        //   { message: "请输入固定电话", trigger: "blur" },
        //   { pattern: /^[0-9]*$/, message: "请输入数字", trigger: "blur" }
        // ]
      }
    };
  },
  created() {
    if (this.obj.orderMoney < 2000) {
      this.$set(this.ruleForm, "billingType", 2);
    } else {
      this.$set(this.ruleForm, "billingType", 1);
    }
    this.getList(); // 获取发票抬头
    this.getProp(); // 获取公司名称
    this.getRegion(); // 获取省市区
  },
  mounted() {},
  methods: {
    // 获取发票抬头列表
    getList() {
      let page = {
        title: "",
        recipient: "",
        pageSize: 999999999999,
        pageNum: 1
      };
      queryInvoiceList(page).then(xhrData => {
        if (xhrData.code === 200) {
          this.invoiceOptions = xhrData.rows.filter(item => {
            return item.type === this.ruleForm.billingType;
          });
        }
      });
    },
    //
    changeBillingType() {
      this.getList();
    },
    // 获取公司信息
    getProp() {
      getPropCompany().then(xhrData => {
        if (xhrData.code === 200) {
          this.pcName = xhrData.data.name;
        }
      });
    },
    //获取省市区
    getRegion() {
      sysRegion().then(xhrData => {
        // console.log(xhrData);
        if (xhrData.code === 200) {
          this.options = xhrData.data;
        }
      });
    },
    // 选择公司所在省、市、区
    handleChange2(val) {
      this.ruleForm.provinceName = val[0];
      this.ruleForm.cityName = val[1];
      this.ruleForm.areaName = val[2];
      this.ruleForm.area =
        this.ruleForm.provinceName +
        this.ruleForm.cityName +
        this.ruleForm.areaName;
    },
    // 选择发票抬头
    chooseInvoice(id) {
      this.invoiceOptions.forEach(item => {
        if (item.id === id) {
          // 回显到菜单
          Object.keys(item).forEach(key => {
            this.$set(this.ruleForm, key, item[key]);
          });
          let arr = [];
          arr[0] = item.provinceName; // 省
          arr[1] = item.cityName; // 市
          arr[2] = item.areaName; // 区
          this.$set(this.ruleForm, "selectedOptions", arr);
        }
      });
    },
    submit(formdata) {
      if (this.ruleForm.invoiceTitleId) {
        this.ToAdd();
      } else {
        this.$refs[formdata].validate(valid => {
          if (valid) {
            let form = JSON.parse(JSON.stringify(this.ruleForm));
            form.type = this.ruleForm.billingType;
            form.pcName = this.pcName;
            delete form.billingType;
            // 表单验证后 请求
            financeAddInvoice(form).then(xhrData => {
              if (xhrData.code === 200) {
                let data = {
                  invoiceTitleId: xhrData.data,
                  orderNumber: this.obj.orderNumber,
                  invoiceAmount: this.obj.orderMoney,
                  billingType: this.ruleForm.billingType,
                  orders: this.obj.id
                };
                this.addInvoice(data);
              } else {
                this.$message.error({
                  message: "添加失败!"
                });
              }
            });
          } else {
            this.$message.warning({
              message: "请完善信息"
            });
            return false;
          }
        });
      }
    },
    // 当选择发票抬头时调用
    ToAdd() {
      let data = {
        invoiceTitleId: this.ruleForm.invoiceTitleId,
        orderNumber: this.obj.orderNumber,
        invoiceAmount: this.obj.orderMoney,
        billingType: this.ruleForm.billingType,
        orders: this.obj.id
      };
      this.addInvoice(data);
    },
    // 新增开票请求
    addInvoice(data) {
      // 表单验证后 请求
      applyInvoice(data).then(xhrData => {
        if (xhrData.code === 200) {
          this.$message.success({
            message: "申请成功!"
          });
          this.$router.push({ name: "LegalInvoiceRecords" });
          // delInvoiceById(data.invoiceTitleId).then(res=>{
          //   this.$router.push({name:'LegalInvoiceRecords'})
          // })
        } else {
          this.$message.error({
            message: "添加失败!"
          });
          // delInvoiceById(data.invoiceTitleId)
        }
      });
    },
    // 返回
    revert() {
      this.$emit("changePage", "LIST", this.obj);
    },
    // 关闭对话框
    resetForm(formName) {
      // 清空表单
      this.$nextTick(() => {
        this.$refs["ruleForm"].resetFields();
      });
      this.dialogVisible = false;
    },
    // 查询
    query() {
      this.getList();
    },
    // 返回
    revert() {
      this.$emit("changePage", "LIST", this.obj);
    }
  }
};
</script>
<style lang="scss" scoped>
.dialog-footer {
  padding-left: 100px;
}
.invoice-btn {
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
.btn1 {
  background: rgba(239, 130, 0, 1);
  border: 1px solid rgba(206, 112, 0, 1);
  color: #fff;
  margin-right: 30px;
}
.btn2 {
  border: 1px solid rgba(0, 0, 0, 0.25);
}
.btn {
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
</style>
<style lang='scss' scoped>
.record-top {
  margin-left: 0;
  margin-right: 0;
  min-height: 60px;
  border-bottom: 1px solid #d6d6d6;
  padding-bottom: 20px;
  .el-form--inline .el-form-item {
    margin-top: 10px;
    margin-bottom: 0;
    .el-input {
      width: 200px;
    }
  }
}
.see-table-box {
  padding: 0 10px;
}
.process {
  margin-bottom: 5px;
  .process-content {
    display: flex;

    :first-child {
      ::after {
        display: none !important;
      }
    }

    .process-box {
      margin-right: 110px;
      display: flex;
      position: relative;

      ::after {
        content: "";
        position: absolute;
        left: -90px;
        top: 15px;
        width: 80px;
        height: 1px;
        background-color: #eaeaea;
      }

      .process-box-left {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background-color: #ef8200;
        font-size: 12px;
        text-align: center;
        line-height: 30px;
        color: #fff;
      }
      .process-box-left2 {
        background-color: #ef8200;
      }
      .process-box-right {
        margin-left: 10px;

        h5 {
          margin-top: 8px;
          margin-bottom: 8px;
          font-size: 16px;
          letter-spacing: 2px;
        }

        p {
          margin-top: 5px;
          color: #ef8200;
          font-size: 14px;
        }
      }
    }
  }
}
</style>
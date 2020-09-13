<template>
  <div class="register">
    <!-- 注册 -->
    <div>
      <div class="register-logoTitle">
        <img src="../assets/logo/logo2.png" alt />
        <h1>
          <span>|</span>忘记密码
        </h1>
      </div>

      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="120px"
        class="demo-ruleForm"
        id="forget"
        style="width:500px"
      >
        <!-- <el-form-item label="登陆账号" prop="userName">
          <el-input v-model="ruleForm.userName" autocomplete="off"></el-input>
        </el-form-item>-->
        <el-form-item label="设置密码" prop="password">
          <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="contactNo">
          <el-input :maxlength="11" v-model="ruleForm.contactNo"></el-input>
        </el-form-item>
        <el-form-item label="短信验证码" prop="phoneCode">
          <el-col :span="14">
            <el-input :maxlength="6" v-model="ruleForm.phoneCode"></el-input>
          </el-col>
          <el-col :span="6">
            <el-button
              type="warning"
              :disabled="isDisabled"
              @click="sending"
            >( {{btnText}}{{isDisabled?'s':''}} )</el-button>
          </el-col>
        </el-form-item>
        <el-form-item>
          <a href="javascript:;" class="register-btn" @click="submitForm('ruleForm')">确定</a>
          <!-- <el-button class="register-btn" type="primary" @click="submitForm('ruleForm')">提交</el-button> -->
        </el-form-item>
        <p class="register-p">
          我有账号?
          <a href="javascript:;" @click="toLogin">立即登陆</a>
        </p>
      </el-form>
    </div>
  </div>
</template>

<script>
import {
  systemUserForgetPassword,
  systemUserForgetPasswordGetCode
} from "@/api/login";
import { sysRegion } from "@/api/information/information";
import { isvalidPhone } from "@/validate/validate.js";
export default {
  name: "forget",
  data() {
    // 表单判断
    // 第一次密码
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    // 确认密码
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    // 手机号
    var validPhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入电话号码"));
      } else if (!isvalidPhone(value)) {
        callback(new Error("请输入正确的11位手机号码"));
      } else {
        callback();
      }
    };
    return {
      options: [],
      // selectedOptions: [],

      // 按钮文字
      btnText: "获取短信验证码",
      // 是否禁用
      isDisabled: false,
      // 合作协议
      dialogVisible: false,
      // 表单数据
      ruleForm: {
        // 物业公司名称
        companyName: "",
        // 电话区号
        areaCode: "",
        // 固定电话号码
        CompanyTelephone: "",
        // 登录账号（6-20位）
        userName: "",
        // 密码
        password: "",
        // 确认密码
        checkPass: "",
        // 联系人
        contact: "",
        // 手机号
        // contactNo: "",
        contactNo: "",
        // 短信验证码
        phoneCode: "",
        // 合作协议
        rememberMe: "",
        selectedOptions: []
      },
      // 表单验证
      rules: {
        // 公司名称
        companyName: [
          { required: true, message: "请输入公司名称", trigger: "blur" }
        ],
        // 电话区号
        areaCode: [{ message: "请输入电话区号", trigger: "blur" }],
        // 固定电话号码
        CompanyTelephone: [{ message: "请输入固定电话号码", trigger: "blur" }],
        // 联系人
        contact: [{ required: true, message: "请输入联系人", trigger: "blur" }],
        // 短信验证码
        phoneCode: [
          { required: true, message: "请输入短信验证码", trigger: "blur" }
        ],
        // 联系人手机号
        contactNo: [{ required: true, validator: validPhone, trigger: "blur" }],
        // 登录账号（6-20位）
        userName: [
          {
            required: true,
            message: "请输入登陆账号(6-20位)",
            trigger: "blur"
          },
          { min: 6, max: 20, message: "长度在 6 到 20 个字符", trigger: "blur" }
        ],
        // 密码
        password: [
          { required: true, validator: validatePass, trigger: "blur" },
          { min: 6, message: "不能低于6位", trigger: "blur" }
        ],
        // 确认密码
        checkPass: [
          { required: true, validator: validatePass2, trigger: "blur" }
        ],
        // 省市区
        selectedOptions: [
          { required: true, message: "请选择省市区", trigger: "change" }
        ]
      },
      //
      loading: false,
      states: "",
      form: {},
      options2: [],
      restaurants: [],
      timeout: null
    };
  },
  created() {},
  mounted() {},
  methods: {
    // 忘记密码 修改密码
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // console.log(this.ruleForm);
          const data = {};
          //   data.userName = this.ruleForm.userName; // 登录账号
          data.newPassword = this.ruleForm.password; // 密码
          data.phone = this.ruleForm.contactNo; // 手机号
          data.phoneCode = this.ruleForm.phoneCode; // 验证码
          //   console.log(data);
          systemUserForgetPassword(data).then(xhrData => {
            if (xhrData.code === 200) {
              this.$message.success({
                message: `修改成功！即将跳转登录页`
              });
              setTimeout(()=>{
                this.$router.push("/login");
              },1000)
            }
          });
        } else {
          // console.log("error submit!!");
          return false;
        }
      });
    },
    // 跳转到登陆
    toLogin() {
      this.$router.push("/login");
    },
    // 发送短信
    sending() {
      // 验证手机号是否符合
      if (isvalidPhone(this.ruleForm.contactNo)) {
        // console.log(this.ruleForm.contactNo);
        const phoneData = {
          phone: this.ruleForm.contactNo
        };
        systemUserForgetPasswordGetCode(phoneData).then(xhrData => {
          // console.log(xhrData);
          if (xhrData.code === 200) {
            this.$message.success({
              message: "发送成功"
            });
            // 禁用按钮
            this.isDisabled = true;
            // 短信倒计时
            this.btnText = 59;
            const count = setInterval(() => {
              if (this.btnText > 1) {
                this.btnText--;
              } else {
                clearInterval(count);
                this.btnText = "获取短信验证码";
                // 开发禁用按钮
                this.isDisabled = false;
              }
            }, 1000);
          }
        });
      }
    },
    // 手机号验证
    isvalidPhone(str) {
      const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
      return reg.test(str);
    },
    //
    getNameData(val) {
      this.ruleForm.selectedOptions = [];
      // console.log(val, "val");
      let arr = [];
      arr[0] = val.prop_province + "省";
      arr[1] = val.prop_city;
      arr[2] = val.prop_county;
      // console.log(arr);
      this.$set(this.ruleForm, "selectedOptions", arr);
    },
    //
    getNameData2(val) {
      // console.log(val);
    }
  }
};
</script>
<style >
#forget .el-input__inner {
  border-radius: 2px;
}
#forget .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #818181;
}
#forget .el-checkbox__input.is-focus .el-checkbox__inner {
  border: 1px solid #ef8200;
}
#forget .el-checkbox__input.is-checked .el-checkbox__inner {
  color: #ef8200;
  background: #ef8200;
  border: 1px solid #ef8200;
}
#forget .el-form-item__label {
  color: #818181;
  letter-spacing: 2px;
}
#forget .line {
  text-align: center;
}
#forget .registerckb {
  padding-left: 100px;
  box-sizing: border-box;
}
#forget p.register-p {
  font-size: 12px;
  color: #818181;
  margin-left: 120px;
}
#forget p.register-p a {
  margin-left: 5px;
  color: #1890ff;
}
#forget a.register-btn {
  display: block;
  box-sizing: border-box;
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  width: 100%;
  height: 44px;
  line-height: 44px;
  background: linear-gradient(
    270deg,
    rgba(248, 184, 0, 1) 0%,
    rgba(239, 130, 0, 1) 100%
  );
  border-radius: 4px;
  margin-top: 20px;
  margin-bottom: 0px;
}
</style>
<style lang="scss" scoped>
.register {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  //   margin-top: 50px;
  padding-top: 50px;
  padding-bottom: 30px;
  box-sizing: border-box;
  //   background-color: #ddd;
  .hezuo-p1 {
    margin-top: 30px;
    margin-bottom: 50px;
  }
  .hezuo-p2 {
    margin-top: 30px;
  }
  .register-logoTitle {
    display: flex;
    margin-bottom: 50px;
    margin-left: 50px;
    height: 25px;
    line-height: 25px;
    img {
      display: block;
      width: 105px;
      height: 25px;
    }
    h1 {
      font-size: 20px;
      color: #2d2d2d;
      margin: 0;
      margin-left: 15px;
      display: flex;
      span {
        display: block;
        margin-right: 12px;
        color: #a4a4a4;
      }
    }
  }
  #register-dialog {
    text-align: center;
    color: #606266;
    .register-dialog-mian {
      text-align: left;
      height: 550px;
      overflow: auto;
      .register-dialog-title {
        padding-bottom: 20px;
        h2 {
          font-size: 18px;
          margin-top: 30px;
        }
        p {
          font-size: 16px;
          letter-spacing: 1px;
        }
        .register-dialog-class1 {
          line-height: 25px;
          margin-top: 50px;
          padding-bottom: 20px;
        }
        .register-dialog-matter1 {
          padding: 10px 0;
          box-sizing: border-box;
          p {
            line-height: 25px;
            margin: 14px 0;
          }
        }
      }
    }
  }
}
</style>

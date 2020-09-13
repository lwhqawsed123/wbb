<template>
  <!-- 移动端登录界面 -->
  <div class="moveRegister">
    <div class="moveRegister-wrap">
      <div class="moveRegister-top">
        <div class="moveRegister-logo">
          <img src="../assets/logo/logo2.png" alt />
        </div>
        <span>|</span>
        <div class="moveRegister-title">
          <h2>2020年深圳市物协会员代表大会</h2>
        </div>
      </div>
      <div class="moveRegister-main">
        <el-form
          :model="ruleForm"
          status-icon
          :rules="rules"
          label-position="left"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
          id="moveRegisterForm"
        >
          <el-form-item label="公司名称" prop="companyName">
            <!-- <el-input v-model.trim="ruleForm.companyName" autocomplete="off"></el-input> -->
            <el-autocomplete
              style="width:100%"
              v-model="ruleForm.companyName"
              :fetch-suggestions="remoteMethod2"
              @select="getNameData"
              placeholder="请输入内容"
            ></el-autocomplete>
          </el-form-item>
          <el-form-item label="区域" prop="selectedOptions">
            <!-- <el-cascader :options="options" v-model="form.selectedOptions" @change="handleChange"></el-cascader> -->
            <el-cascader
              style="width:100%"
              ref="cascaderAddr"
              v-model="ruleForm.selectedOptions"
              :options="options2"
            ></el-cascader>
          </el-form-item>
          <!-- <el-form-item label="公司电话" prop="areaCode">
            <el-col :span="10">
              <el-input :maxlength="5" v-model.trim="ruleForm.areaCode" autocomplete="off"></el-input>
            </el-col>
            <el-col class="line" :span="1" style="text-align: center">-</el-col>
            <el-col :span="13">
              <el-form-item style="display: inline-block;width:100%" prop="CompanyTelephone">
                <el-input
                  :maxlength="8"
                  v-model="ruleForm.CompanyTelephone"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>-->
          <!-- <el-form-item label="公司座机号码" prop="CompanyTelephone">
        <el-input v-model="ruleForm.CompanyTelephone" autocomplete="off"></el-input>
          </el-form-item>-->
          <el-form-item label="登陆账号" prop="userName">
            <el-input v-model.trim="ruleForm.userName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              :minlength="6"
              type="password"
              v-model.trim="ruleForm.password"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPass">
            <el-input
              :minlength="6"
              type="password"
              v-model.trim="ruleForm.checkPass"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="联系人" prop="contact">
            <el-input v-model.trim="ruleForm.contact"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="contactNo">
            <el-input :maxlength="11" v-model="ruleForm.contactNo"></el-input>
          </el-form-item>
          <el-form-item label="短信验证码" prop="phoneCode">
            <div style="width:100%;display:flex">
              <!-- <el-col :span="10"> -->
              <el-input class="inputRem1" v-model="ruleForm.phoneCode"></el-input>
              <!-- </el-col> -->
              <!-- <el-col :span="14"> -->
              <el-button
                class="inputRem2"
                type="warning"
                :disabled="isDisabled"
                @click="sending"
              >( {{btnText}}{{isDisabled?'s':''}} )</el-button>
              <!-- </el-col> -->
            </div>
          </el-form-item>
          <!-- <div class="registerckb">
            <el-checkbox style="font-size: 12px;color: #818181;" v-model="ruleForm.rememberMe">
              本人已同意并阅读
              <a href="javascript:;" @click="dialogVisible = true">《合作协议》</a>
            </el-checkbox>
          </div>-->
          <!-- <el-form-item> -->
          <a href="javascript:;" class="moveRegister-btn" @click="submitForm('ruleForm')">立即注册</a>
          <!-- <el-button class="register-btn" type="primary" @click="submitForm('ruleForm')">提交</el-button> -->
          <!-- </el-form-item> -->
          <p class="moveRegister-p">(特设礼遇)当天扫码注册的会员单位所有居住项目均获得物保宝广东公司敬赠百元保费金</p>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import "@/utils/rem.js";
import { register, listRecord, companyPhoneCode } from "@/api/login";
import { sysRegion } from "@/api/information/information";
import { isvalidPhone } from "@/validate/validate.js";
export default {
  name: "",
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
      // 合作协议
      //   dialogVisible: false,
      // 按钮文字
      btnText: "获取短信验证码",
      // 是否禁用
      isDisabled: false,
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
        contactNo: "",
        // 合作协议
        rememberMe: "",
        // 短信验证码
        phoneCode: "",
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
        // 联系人手机号
        contactNo: [{ required: true, validator: validPhone, trigger: "blur" }],
        // 短信验证码
        phoneCode: [
          { required: true, message: "请输入短信验证码", trigger: "blur" }
        ],
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
      options2: []
    };
  },
  created(){
    this.getRegion();
  },
  methods: {
    //获取省市区
    getRegion() {
      sysRegion().then(xhrData => {
        if (xhrData.code === 200) {
          this.options2 = xhrData.data;
        }
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
           const data = {};
          data.companyName = this.ruleForm.companyName; // 公司名称
          data.userName = this.ruleForm.userName; // 登录账号
          data.password = this.ruleForm.password; // 密码
          data.contactNo = this.ruleForm.contactNo; // 手机号
          data.contact = this.ruleForm.contact; // 联系人
          data.province = this.ruleForm.selectedOptions[0]; //  省
          data.city = this.ruleForm.selectedOptions[1]; //  市
          data.county = this.ruleForm.selectedOptions[2]; //  区
          data.phoneCode = this.ruleForm.phoneCode; // 验证码
          let reg = RegExp(/物业/);
          let titleName = ''
          // 包含物业名字
          if (reg.exec(data.companyName)) {
            // 包含物业的直接注册
            titleName = "注册成功！";
            data.propCreditCode = this.prop_credit_code // 统一社会信用代码
          }else{
            // 未包含物业的需待审核
            titleName = "注册成功，等待审核！";
            data.propCreditCode = '' // 统一社会信用代码
          }
          // console.log(data);
          
          register(data)
            .then(xhrData => {
              if (xhrData.code === 200) {
                this.$message.success({
                  message: titleName
                });
                // 清空表单
                this.$refs[formName].resetFields();
                // 注册成功跳转到提示注册成功页面
                this.$router.push("/promptSuccess");
              }
            })
            .catch(() => {
              // this.$message.error({
              //   message: "注册失败~"
              // });
            });
        } else {
          //   console.log("error submit!!");

          return false;
        }
      });
    },
    // 发送短信
    sending() {
      // 验证手机号是否符合
      if (this.ruleForm.contactNo == "") return;
      if (isvalidPhone(this.ruleForm.contactNo)) {
        // console.log(this.ruleForm.contactNo);
        const phoneData = {
          phone: this.ruleForm.contactNo
        };
        companyPhoneCode(phoneData).then(xhrData => {
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
    async remoteMethod2(val, cb) {
      let states = [];
      if (val == "") {
        cb([]);
        return;
      }
      const page = {
        page: 0,
        size: 100,
        keyword: val
      };
      // await listRecord(page).then(xhrData => {

      // });
      let xhrData = await listRecord(page);

      if (xhrData.code === 200) {
        // this.states = xhrData.data.content;
        states = xhrData.data.content;
        states.forEach(item => {
          item.value = item.prop_name;
        });
        var restaurants = states;
        var results = val ? restaurants : null;
        cb(results);
      }
    },
    // 选取公司时获取对应信息
    getNameData(val) {
      this.ruleForm.selectedOptions = [];
      // // console.log(val, "val");
      let arr = [];
      arr[0] = val.prop_province + "省";
      arr[1] = val.prop_city;
      arr[2] = val.prop_county;
      // // console.log(arr);
      this.$set(this.ruleForm, "selectedOptions", arr);
      this.prop_credit_code = val.prop_credit_code
    }
    // 合作协议
    // handleClose(done) {
    //   done();
    //   // this.$confirm("确认关闭？")
    //   //   .then(_ => {
    //   //     done();
    //   //   })
    //   //   .catch(_ => {});
    // }
  }
};
</script>
<style>
.inputRem1 {
  width: 1.8rem;
}
.inputRem2 {
  /* width: 2.8rem; */
}
.inputRem2 span {
  /* font-size: 0.3rem; */
  font-size: 14px;
}
</style>
<style lang="scss" scoped>
.moveRegister {
  width: 100%;
  // height: 100%;
  padding: 0.6rem 0.3rem;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  .moveRegister-wrap {
    .moveRegister-top {
      display: flex;
      justify-content: center;
      padding-bottom: 0.6rem;
      .moveRegister-logo {
        width: 3rem;
        height: auto;
        img {
          width: 100%;
        }
      }
      span {
        font-size: 0.6rem;
        margin-right: 0.1rem;
        margin-left: 0.1rem;
        line-height: 1.1rem;
      }
      .moveRegister-title {
        h2 {
          font-size: 0.35rem;
          width: 2.6rem;
          text-align: center;
          margin: 0;
          margin-top: 0.16rem;
        }
      }
    }
    .moveRegister-main {
      width: 100%;
      #moveRegisterForm {
        .moveRegister-btn {
          display: block;
          height: 0.8rem;
          background: linear-gradient(
            270deg,
            rgba(248, 184, 0, 1) 0%,
            rgba(239, 130, 0, 1) 100%
          );
          font-size: 0.4rem;
          font-weight: bold;
          letter-spacing: 0.02rem;
          text-align: center;
          line-height: 0.8rem;
          color: #fff;
          border-radius: 0.04rem;
        }
        .moveRegister-p {
          font-size: 0.3rem;
          text-align: center;
          color: #666;
          line-height: 0.4rem;
        }
      }
    }
  }
}
</style>
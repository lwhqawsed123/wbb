<template>
  <div class="login">
    <div class="login-left">
      <div class="login-left-title">
        <h2 class="login-left-h1">用保障与物业</h2>
        <h2>共生和进化的平台</h2>
      </div>
    </div>
    <el-form
      id="loginForm"
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
    >
      <!-- <h3 class="title">物保宝后台管理系统</h3> -->
      <div class="logoTitle">
        <img src="../assets/logo/logo2.png" width="105" height="25" alt />
        <span></span>
        <h1 class="title">服务平台登录</h1>
      </div>
      <el-form-item style="margin-top:25px" prop="username">
        <el-input
          class="login-input"
          v-model="loginForm.username"
          type="text"
          auto-complete="off"
          placeholder="请输入账号"
        >
          <!-- <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" /> -->
          <svg-icon
            style="width:28px;height: 20px;margin-top: 10px;padding-right: 5px;border-right: 1px solid #c0c0c0;"
            slot="prefix"
            icon-class="wbb_zhang"
            class="el-input__icon input-icon"
          />
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          class="login-input"
          v-model="loginForm.password"
          type="password"
          auto-complete="off"
          placeholder="请输入密码"
          @keyup.enter.native="handleLogin"
        >
          <!-- <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" /> -->
          <svg-icon
            style="width:28px;height: 20px;margin-top: 10px;padding-right: 5px;border-right: 1px solid #c0c0c0;"
            slot="prefix"
            icon-class="wbb_pas"
            class="el-input__icon input-icon"
          />
        </el-input>
      </el-form-item>
      <el-form-item class="login-input" prop="code">
        <el-input
          v-model="loginForm.code"
          auto-complete="off"
          placeholder="请输入验证码"
          style="width: 63%"
          @keyup.enter.native="handleLogin"
        >
          <!-- <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon" /> -->
        </el-input>
        <div class="login-code">
          <img :src="codeUrl" @click="getCode" />
        </div>
      </el-form-item>
      <div
        style=" display: flex;justify-content: space-between;padding: 0 30px;box-sizing: border-box;height:30px"
      >
        <el-checkbox
          v-model="loginForm.rememberMe"
          style="margin:0px 0px 25px 0px;color:#c1c1c1;font-size:12px"
        >记住登陆状态</el-checkbox>
        <!-- <div style="font-size:14px;cursor: pointer;" @click="toRegister">立即注册</div> -->
        <div style="color:#c1c1c1;font-size:12px;line-height: 19px;cursor: pointer;" @click="forget">忘记密码?</div>
      </div>

      <el-form-item style="width:100%;margin-bottom:0;">
        <el-button
          :loading="loading"
          size="medium"
          type="primary"
          style="width:100%;"
          id="loginBtn"
          @click.native.prevent="handleLogin"
        >
          <span v-if="!loading">立 即 登 陆</span>
          <span v-else>登 录 中...</span>
        </el-button>
      </el-form-item>
      <p class="login-p">
        还没有账号?
        <a href="javascript:;" @click="toRegister">立即注册</a>
      </p>
    </el-form>
    <!--  底部  -->
    <!-- <div class="el-login-footer">
      <span>Copyright © 2018-2019 ruoyi.vip All Rights Reserved.</span>
    </div>-->
  </div>
</template>

<script>
import { getCodeImg } from "@/api/login";
import Cookies from "js-cookie";
import { encrypt, decrypt } from "@/utils/jsencrypt";
let Base64 = require('js-base64').Base64;
export default {
  name: "Login",
  data() {
    return {
      codeUrl: "",
      cookiePassword: "",
      loginForm: {
        username: "",
        password: "",
        rememberMe: false,
        code: "",
        uuid: ""
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", message: "用户名不能为空" }
        ],
        password: [
          { required: true, trigger: "blur", message: "密码不能为空" }
        ],
        code: [{ required: true, trigger: "change", message: "验证码不能为空" }]
      },
      loading: false,
      redirect: undefined
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  created() {
    this.getCode();
    this.getCookie();
  },
  methods: {
    getCode() {
      getCodeImg().then(res => {
        this.codeUrl = "data:image/gif;base64," + res.img;
        this.loginForm.uuid = res.uuid;
      });
    },
    getCookie() {
      const username = Cookies.get("username");
      const password = Cookies.get("password");
      const rememberMe = Cookies.get("rememberMe");
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password:
          password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
      };
    },
    handleLogin() {
     
      // this.loginForm.username = Base64.encode(this.loginForm.username)
      
      //  console.log(this.loginForm);
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          if (this.loginForm.rememberMe) {
            Cookies.set("username", this.loginForm.username, { expires: 30 });
            Cookies.set("password", encrypt(this.loginForm.password), {
              expires: 30
            });
            Cookies.set("rememberMe", this.loginForm.rememberMe, {
              expires: 30
            });
          } else {
            Cookies.remove("username");
            Cookies.remove("password");
            Cookies.remove("rememberMe");
          }
          let loginForm = {}
          // loginForm.password = Base64.encode(this.loginForm.password)
          // loginForm.password = encrypt(this.loginForm.password)
          loginForm.password = this.loginForm.password
          loginForm.rememberMe = this.loginForm.rememberMe
          loginForm.username = this.loginForm.username
          loginForm.code = this.loginForm.code
          loginForm.uuid = this.loginForm.uuid
          // console.log(loginForm.password,'加密后');

          // console.log(decrypt(loginForm.password),'解密');
          
          this.$store
            .dispatch("Login", loginForm)
            .then(() => {
              this.loading = false;
              this.$router.push({ path: this.redirect || "/" });
            })
            .catch(() => {
              this.loading = false;
              this.getCode();
            });
        }
      });
    },
    // 跳转到注册页面
    toRegister() {
      this.$router.push("/register");
      // this.$router.push("/moveRegister");
    },
    // 跳转到忘记密码页面
    forget(){
      this.$router.push("/forget");
    }
  }
};
</script>
<style >
#loginForm .el-form-item--medium .el-form-item__content,
#loginForm .el-form-item .login-input .is-required .el-form-item--medium {
  text-align: center;
  padding: 0 30px;
  box-sizing: border-box;
  
}
#loginForm .el-checkbox__label {
  font-size: 12px;
}
#loginForm .el-checkbox__input.is-checked .el-checkbox__inner {
  background: #ef8200;
  border: 1px solid #ef8200;
}
#loginForm .el-checkbox__input.is-focus .el-checkbox__inner {
  border: 1px solid #ef8200;
}
#loginForm .login-input .el-input .el-input--medium .el-input--prefix {
  height: 40px;
}
#loginForm .el-input__inner {
  border: none;
  border-bottom: 1px solid #ecedf0;
  border-radius: 0;
  height: 40px;
  padding: 0 35px;
  padding-left: 40px;
  box-sizing: border-box;
}
#loginForm .login-code img {
  width: 100%;
  height: 100%;
}
#loginForm .el-form-item__error {
  margin-left: 40px;
}
#loginBtn {
  height: 44px;
  background: linear-gradient(
    270deg,
    rgba(248, 184, 0, 1) 0%,
    rgba(239, 130, 0, 1) 100%
  );
  border-radius: 4px;
  border: none;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 0;
}
#loginForm .login-p {
  padding: 0 40px;
  box-sizing: border-box;
  font-size: 12px;
  color: #c1c1c1;
}
#loginForm .login-p a {
  color: #51abff;
  margin-left: 3px;
}
#loginForm .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #c1c1c1;
}
#loginForm input:-webkit-autofill {
  box-shadow: 0 0 0px 1000px white inset !important;
}
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: #eff0f4;
  background-image: url("../assets/image/bj1.jpg");
  // background-size: cover;
  .login-left {
    width: 400px;
    min-height: 405px;
    background-color: #fb8333;
     display: flex;
      justify-content: center;
      // align-items: center;
    .login-left-title {
     margin-top: 80px;
      h2 {
        text-align: center;
        box-sizing: border-box;
        color: #fff;
        // text-shadow:5px 2px 6px #000;  
        font-size: 30px;
      }
    }
  }
}
.logoTitle {
  display: flex;
  img {
    display: block;
    margin-top: 13px;
  }
  span {
    display: block;
    width: 1px;
    height: 25px;
    background-color: #343434;
    margin-top: 13px;
    margin-left: 14px;
  }
  h1.title {
    font-size: 20px;
    color: #343434;
    margin-left: 12px;
  }
}

.login-form {
  // border-radius: 6px;
  background: #ffffff;
  width: 400px;
  // padding: 25px 35px 5px 35px;
  padding: 20px 40px;
  .el-input {
    height: 38px;
    .el-input__inner {
      border: none;
      border-bottom: 1px solid #e6e8eb;
    }
    input {
      height: 38px;
    }
  }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.login-code {
  width: 37%;
  height: 38px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
</style>

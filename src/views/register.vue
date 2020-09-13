<template>
  <div class="register">
    <!-- 注册 -->
    <div class="register-logoTitle">
      <img src="../assets/logo/logo2.png" alt />
      <h1>
        <span>|</span>服务平台账号注册
      </h1>
    </div>

    <el-form
      :model="ruleForm"
      status-icon
      :rules="rules"
      ref="ruleForm"
      label-width="120px"
      class="demo-ruleForm"
      id="registerForm"
    >
      <el-form-item label="公司名称" prop="companyName">
        <!-- <el-select
        ref="selector"
          style="width:100%"
          v-model="ruleForm.companyName"
          filterable
          remote
          placeholder="请输入关键词"
          @change="getNameData"
          :remote-method="remoteMethod"
          :loading="loading"
          value-key="prop_name"
        >
          <el-option
            v-for="item in options"
            :key="item.prop_name"
            :label="item.prop_name"
            :value="item"
          ></el-option>
        </el-select>-->
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
        <el-col :span="6">
          <el-input :maxlength="5" v-model.number="ruleForm.areaCode" autocomplete="off"></el-input>
        </el-col>
        <el-col class="line" :span="1">-</el-col>
        <el-col :span="17">
          <el-form-item style="display: inline-block;width:100%" prop="CompanyTelephone">
            <el-input :maxlength="8" v-model.number="ruleForm.CompanyTelephone" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>-->
      <!-- <el-form-item label="公司座机号码" prop="CompanyTelephone">
        <el-input v-model="ruleForm.CompanyTelephone" autocomplete="off"></el-input>
      </el-form-item>-->
      <el-form-item label="登陆账号" prop="userName">
        <el-input v-model="ruleForm.userName" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="联系人" prop="contact">
        <el-input v-model="ruleForm.contact"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="contactNo">
        <el-input :maxlength="11" v-model="ruleForm.contactNo"></el-input>
      </el-form-item>
      <el-form-item label="短信验证码" prop="phoneCode">
        <el-col :span="6">
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
      <div class="registerckb">
        <el-checkbox style="font-size: 12px;color: #818181;" v-model="ruleForm.rememberMe">
          本人已同意并阅读
          <a href="javascript:;" @click="dialogVisible = true">《合作协议》</a>
        </el-checkbox>
      </div>
      <el-form-item>
        <a href="javascript:;" class="register-btn" @click="submitForm('ruleForm')">立即注册</a>
        <!-- <el-button class="register-btn" type="primary" @click="submitForm('ruleForm')">提交</el-button> -->
      </el-form-item>
      <p class="register-p">
        我有账号?
        <a href="javascript:;" @click="toLogin">立即登陆</a>
      </p>
    </el-form>

    <!-- 合作协议 -->
    <el-dialog
      title="物保项目战略合作协议"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose"
      id="register-dialog"
    >
      <div class="register-dialog-mian">
        <div class="register-dialog-title">
          <p>甲 方：物保宝网络技术（广东）有限公司</p>
          <p>电 话：400-055-5151</p>
          <p>地 址：深圳市南山区西丽街道松坪山社区朗山路13号清华紫光科技园6层611</p>
          <p>联系人：殷杰</p>
          <!-- 乙　方：申请开通物保云平台单位    -->
          <h2>乙 方：申请开通物保云平台单位</h2>
          <p
            class="register-dialog-class1"
          >甲乙双方本着长期合作，互惠互利，共同发展的原则，根据中华人民共和国法律及其有关规定，经双方友好、平等协商，就物业行业内各物管项目进行物保战略合作推进物业金融、物业社区便民增值服务等物保项目达成本协议。在双方同意遵守本协议约定时，甲乙双方对协议的所有条款均无疑义并对各自有关权利、义务等条款的法律含义有准确无误的理解。</p>
          <!-- 一、基本合作事项 -->
          <div class="register-dialog-matter1">
            <h3>一、基本合作事项</h3>
            <p v-for="(item,index) in agreementData.one" :key="index">({{index+1}})、{{item.title}}</p>
          </div>
          <!-- 二、双方的权利和义务 -->
          <div class="register-dialog-matter1">
            <h3>二、双方的权利和义务</h3>
            <p>（一）、甲方的权利和义务</p>
            <p
              v-for="(item,index) in agreementData.two.one"
              :key="index"
            >({{index+1}})、{{item.title}}</p>
            <p>（二）乙方的权利和义务</p>
            <p
              v-for="(item,index) in agreementData.two.two"
              :key="index"
            >({{index+1}})、{{item.title}}</p>
          </div>
          <!-- 三、保密 -->
          <div class="register-dialog-matter1">
            <h3>三、保密</h3>
            <p v-for="(item,index) in agreementData.three" :key="index">({{index+1}})、{{item.title}}</p>
          </div>
          <!-- 四、协议的变更、补充及终止 -->
          <div class="register-dialog-matter1">
            <h3>四、协议的变更、补充及终止</h3>
            <p v-for="(item,index) in agreementData.four" :key="index">({{index+1}})、{{item.title}}</p>
          </div>
          <h3>五、本协议中所涉及相关便民服务均由服务提供方承担相应责任，物保平台作为服务集成商应积极协调处理，确保乙方权益。</h3>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button type="primary" @click="dialogVisible = false">关 闭</el-button> -->
        <a href="javascript:;" class="user-btn btn2" @click="dialogVisible = false">返 回</a>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { register, listRecord, companyPhoneCode } from "@/api/login";
import { sysRegion } from "@/api/information/information";
import { isvalidPhone } from "@/validate/validate.js";
export default {
  name: "register",
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
      // 区域数据
      // options: listRecord,
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
      // 物保项目战略合作协议 数据
      agreementData: {
        // 一、基本合作事项
        one: [
          {
            title:
              "乙方自愿成为甲方的物保平台商户单位并遵守平台商户相关规定，以便甲方利用互联网与房、车产业链及社区服务资源为乙方和业主提供相关金融及增值服务。"
          },
          {
            title:
              "为确保专业服务甲方设立物保专员制度，由甲方平台根据实际需要对其进行培训与考核;通过后安排到乙方项目，乙方提供办公场所，甲方承担人员成本。物保专员具体操作和执行双方的合作项目，包括但不限于以下内容：业主生活便民服务如保险事故的理赔协助等其他增值服务和从事双方合作事项的推广和执行等内容。"
          },
          {
            title:
              "甲方服务平台为乙方物管项目及业主提供金融及保险服务、房产与车辆等生活综合需求服务。"
          },
          {
            title:
              "乙方同意参加物保宝平台承办的物业行业公益活动（缴物业费、停车费回馈业主保障项目）。合作生效后，向甲方领取相关保险海报等推广物料，按相关流程在物保云服务平台上实施操作，该系列惠民产品仅限物业购买后赠送给业主与客户不得销售与退保。开展项目的地区不限，可在中国境内实施（港、澳、台地区除外）。双方合作的具体内容与结果通报相关物业行业协会（当地未设立物协的除外）"
          },
          {
            title:
              "乙方自愿成为甲方的物保平台商户单位并遵守平台商户相关规定，以便甲方利用互联网与房、车产业链及社区服务资源为乙方和业主提供相关金融及增值服务。"
          },
          {
            title:
              "乙方同意在物管项目中开展甲方平台上社区金融便民服务和业主房产、车辆等生活系列服务共同创造物业增值业务。"
          },
          {
            title: "乙方承诺不与第三方开展甲方平台相关业务的有关合作。"
          }
        ],
        // 二、双方的权利和义务
        two: {
          one: [
            {
              title:
                "甲方整合中国银联及保险机构、房产产业链、汽车产业链、生活消费圈等合作伙伴致力于为乙方及业主用户提供便捷、专业的社区金融服务，房产系列、车辆系列便民增值服务等。"
            },
            {
              title:
                "甲方及其合作伙伴负责平台上多元化便民服务平台的建设、运行和管理，并有权制定和修改相应的管理规则和功能。"
            },
            {
              title:
                "甲方应设立业务咨询和联系电话，负责解答乙方在使用甲方平台服务中遇到的各种疑问，并及时协助解决乙方与甲方及其合作伙伴间在业务合作过程中的有关问题。"
            },
            { title: "甲方有权向乙方追索其违反本协议的有关款项。" },
            {
              title:
                "甲方平台资源对双方的合作业务内容进行扩展服务，如装修、房产中介与金融服务、汽车置换与金融、汽车清洁与保养、汽车保险、社区便民服务等。具体合作形式物保宝平台定期发布。所有服务项目，乙方均享有合作收益，甲方享有服务项目实施优先权。"
            },
            {
              title:
                "甲方有权对网上服务平台进行维护，维护时间将通过甲方网站、邮件或电话提前通知乙方。"
            },
            {
              title:
                "若出服务纠纷，甲方作为社区服务集成商应予以公平、公正的协调处理，及时将协商的结果告知乙方。"
            }
          ],
          two: [
            {
              title:
                "乙方作为甲方平台商户不得与其他任何第三方就物保宝平台涉及的业务领域或其他类似领域内进行合作。否则承担相应违约责任，按物保平台使用年限赔偿平台使用与管理费。"
            },
            {
              title:
                "在未得到甲方书面授权的情况下，乙方不能擅自转载、复制、截取、篡改甲方网站上的内容及侵犯甲方与合作伙伴等知识产权行为。"
            },
            {
              title:
                "乙方应保证本协议与附件下乙方相关信息的真实、有效，发生变化的及时在线变更信息，乙方承担由于信息未及时变更导致利益受损责任。"
            },
            {
              title:
                "乙方应维护甲方信誉和合法权益，遵守和执行甲方平台的各项服务产品服务规章。如：在保险项目上不作夸大、虚假、误导性宣传，不欺骗、误导业主或引诱、强迫业主投保、不隐瞒与保险合同有关的重要情况，如实向业主转告相关注意事项。"
            },
            {
              title:
                "物保平台物业特供产品仅限物业渠道赠送客户使用且不得退保。乙方不得擅自更改保险公司规定的保险条款、保险费用、承保规定和要求，且按保险公司见费出单要求支付相应保费，平台赠送产品除外。乙方发生保险欺诈行为的甲方有权单方中止保险合作。乙方给符合条件的业主申报保障时，按物保云平台规则实施。申报成功后方可将保障内容告知业主。若因乙方工作人员疏忽或遗漏造成业主应有保障而无法生效，所引起的责任由乙方承担。"
            },
            {
              title:
                "乙方的物管项目应将物保系列惠民项目通过内部刊物、电子牌、海报宣传栏、门洞门贴和专人宣导等方式告知业主，多种方式让业主开通物保平台账户（含移动APP下载）。"
            },
            {
              title:
                "乙方代销金融保险等产品时应如实向业主转告相关注意事项，乙方可享物业渠道特惠价，享有相应产品销售收益。"
            },
            {
              title:
                "物保平台增加新服务项目后，乙方须进行员工培训及时推广至所有物管项目，提升增值服务空间。甲方服务项目与乙方现有服务有冲突时，双方协商解决。"
            }
          ]
        },
        // 三、保密
        three: [
          {
            title:
              "双方应对其通过工作接触和通过其他渠道得知的有关对方商业秘密严格保密，未经对方事先书面同意，不得向第三方披露。"
          },
          {
            title:
              "除本协议规定工作所需外，未经对方事先同意，不得擅自使用、复制对方的技术资料、商业信息及其他资料。"
          }
        ],
        // 四、协议的变更、补充及终止
        four: [
          {
            title:
              "本协议履行过程中如需变更，应双方协商一致并达成书面协议，变更或补充的内容与本协议具有同等的效力。"
          },
          {
            title:
              "本协议自乙方在线开通物保云平台之日起生效，有效期为五年。协议期满时，双方如无异议自动延期。协议执行中如一方需要变更或终止，应提前一个月通知对方，经双方协商达成书面协议后，双方方能变更或终止，否则协议依然有效。"
          },
          {
            title:
              "凡因本协议发生的或与本协议有关的任何争议，甲、乙双方应友好协商解决。"
          },
          {
            title:
              "合作期间内，甲乙双方不得因单位名称的变更或者法定代表人、负责人和承办人等事项的变动而不履行协议所规定的内容。"
          }
        ]
      },
      //
      loading: false,
      states: "",
      form: {},
      options2: [],
      restaurants: [],
      timeout: null,
      // 统一社会信用代码
      prop_credit_code:''
    };
  },
  created() {
    this.getRegion();
  },
  mounted() {
    //    setTimeout(() => {
    //   this.$refs.selector.$el.querySelector('input').click()
    // }, 500)
  },
  methods: {
    //获取省市区
    getRegion() {
      sysRegion().then(xhrData => {
        // console.log(xhrData);
        if (xhrData.code === 200) {
          this.options2 = xhrData.data;
        }
      });
    },
    // 搜索查询下拉框
    async remoteMethod(query) {
      // console.log(query);
      if (query !== "") {
        // await this.getInsList(query)
        const page = {
          page: 0,
          size: 100,
          keyword: query
        };

        await listRecord(page).then(xhrData => {
          if (xhrData.code === 200) {
            this.states = xhrData.data.content;
            // console.log(this.states);
          }
        });
        this.loading = true;
        // this.list = this.states.map(item => {
        //   return { value: `${item.id}`, label: `${item.prop_name}` };
        // });
        // console.log(this.list);
        setTimeout(() => {
          this.loading = false;
          this.options = this.states;
          // this.options = this.list.filter(item => {
          //   return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1;
          // });
        }, 200);
      } else {
        this.options = [];
      }
    },
    //
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
    // 立即注册
    submitForm(formName) {
      // console.log(this.ruleForm.selectedOptions);
      
      if (
        this.ruleForm.selectedOptions[1] == null ||
        this.ruleForm.selectedOptions[2] == null
      ) {
        this.$message.warning({
          message: "请选择区域!"
        });
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (!this.ruleForm.rememberMe) {
            this.$message.warning({
              message: "请勾选合作协议!"
            });
            return;
          }
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
          register(data).then(xhrData => {
            // console.log(xhrData);
            if (xhrData.code === 200) {
              this.$message.success({
                message: titleName
              });
              this.$router.push("/login");
            }
          });
        } else {
          // console.log("error submit!!");
          return false;
        }
      });
    },
    // 合作协议
    handleClose(done) {
      done();
      // this.$confirm("确认关闭？")
      //   .then(_ => {
      //     done();
      //   })
      //   .catch(_ => {});
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
    // 手机号验证
    isvalidPhone(str) {
      const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
      return reg.test(str);
    },
    // 选取公司时获取对应信息
    getNameData(val) {
      this.ruleForm.selectedOptions = [];
      // console.log(val, "val");
      let arr = [];
      arr[0] = val.prop_province + "省";
      arr[1] = val.prop_city;
      arr[2] = val.prop_county;
      // console.log(arr);
      this.$set(this.ruleForm, "selectedOptions", arr);
      this.prop_credit_code = val.prop_credit_code
    },
    //
    getNameData2(val) {
      // console.log(val);
    }
  }
};
</script>
<style >
#registerForm .el-input__inner {
  border-radius: 2px;
}
#registerForm .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #818181;
}
#registerForm .el-checkbox__input.is-focus .el-checkbox__inner {
  border: 1px solid #ef8200;
}
#registerForm .el-checkbox__input.is-checked .el-checkbox__inner {
  color: #ef8200;
  background: #ef8200;
  border: 1px solid #ef8200;
}
#registerForm .el-form-item__label {
  color: #818181;
  letter-spacing: 2px;
}
#registerForm .line {
  text-align: center;
}
#registerForm .registerckb {
  padding-left: 100px;
  box-sizing: border-box;
}
#registerForm p.register-p {
  font-size: 12px;
  color: #818181;
  margin-left: 100px;
}
#registerForm p.register-p a {
  margin-left: 5px;
  color: #1890ff;
}
#registerForm a.register-btn {
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
#register-dialog .el-dialog__header {
  background-color: #e6e8eb;
}
#register-dialog .user-btn {
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
#register-dialog .user-btn.btn1 {
  background: rgba(239, 130, 0, 1);
  border: 1px solid rgba(206, 112, 0, 1);
  color: #fff;
}
#register-dialog .user-btn.btn2 {
  border: 1px solid rgba(0, 0, 0, 0.25);
}
#register-dialog .el-dialog__title {
  font-size: 20px;
  font-weight: bold;
}
#register-dialog .el-dialog__body {
  padding-left: 40px;
  padding-right: 40px;
  padding-bottom: 0;
  box-sizing: border-box;
}
#register-dialog .el-dialog__footer {
  background-color: #e6e8eb;
}
</style>
<style lang="scss" scoped>
.register {
  width: 40%;
  margin: 0 auto;
  margin-top: 50px;
  padding-bottom: 30px;
  box-sizing: border-box;
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
    margin-left: 120px;
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

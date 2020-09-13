<template>
  <!-- 雇主险申报 -->
  <div class="declare" id="declare">
    <div class="declare-conter">
      <!-- 申报信息 -->
      <div class="declare-top">
        <h4>
          申报信息
          <!-- <span>?</span> -->
        </h4>
      </div>
      <div class="declare-top-conter">
        <div class="declare-top-left">
          <p>
            <span>申报人</span>
            <span>{{companyName}}</span>
            <span style="margin-left:15px;color:#da242a">当前余额:{{WYBalance || 0.00}}元</span>
          </p>
          <p>
            <span>承保公司</span>
            <span>{{productData.insCompanyName}}</span>
          </p>
        </div>
        <div v-if="!optionTow" class="declare-top-right">
          <a href="javascript:;" class="declare-top-btn btn1" @click="handleExport">批量模板下载</a>
          <el-upload
            class="upload-demo"
            action="123"
            accept=".xls, .xlsx"
            :on-change="handleChange"
            :file-list="fileList"
            :auto-upload="false"
            :on-remove="onRemove"
            :limit="1"
          >
            <el-button class="declare-top-btn btn2" size="small" type="primary">文件上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传 .xls/.xlsx 文件</div>
          </el-upload>
        </div>
      </div>

      <el-form
        :model="ruleForm"
        ref="ruleForm"
        label-position="left"
        label-width="120px"
        class="demo-ruleForm"
        id="declareForm"
      >
        <!-- 投保方案 -->
        <div>
          <div class="declare-top">
            <h4>
              投保方案
              <!-- <span>?</span> -->
              <a
                href="javascript:;"
                style="color:#0179FE;font-size:14px;margin-left:30px;"
                @click="dialogTableVisible=true"
              >产品介绍</a>
            </h4>
          </div>
          <table id="declareTable">
            <tr style="font-size:14px;height:50px;">
              <th style="width:20%;"></th>
              <th style="width:20%;">
                <el-radio @change="showMoney" v-model="ruleForm.code" label="PRD_SOL_0513">{{value}}</el-radio>
              </th>
              <th style="width:20%;">
                <el-radio @change="showMoney" v-model="ruleForm.code" label="PRD_SOL_0514">{{value}}</el-radio>
              </th>
              <th style="width:20%;">
                <el-radio @change="showMoney" v-model="ruleForm.code" label="PRD_SOL_0515">{{value}}</el-radio>
              </th>
              <th style="width:20%;">
                <el-radio @change="showMoney" v-model="ruleForm.code" label="PRD_SOL_0516">{{value}}</el-radio>
              </th>
            </tr>
            <tr style="height: 50px;font-size:13px;line-height: 20px;color:#646464">
              <td>死亡伤残</td>
              <td>70万</td>
              <td>70万</td>
              <td>50万</td>
              <td>50万</td>
            </tr>
            <tr style="height: 50px;font-size:13px;line-height: 20px;color:#646464">
              <td>意外医疗</td>
              <td>2万</td>
              <td>4万</td>
              <td>2万</td>
              <td>4万</td>
            </tr>
            <tr style="height: 50px;font-size:13px;line-height: 20px;color:#646464">
              <td>住院津贴</td>
              <td colspan="4">100元/天，最多60天</td>
            </tr>
            <tr style="height: 50px;font-size:13px;line-height: 20px;color:#646464">
              <td>误工费</td>
              <td colspan="4">100元/天，免赔5天，最多180天</td>
            </tr>
          </table>
        </div>
        <div class="type-box">
          <!-- <el-checkbox v-model="type1" @change="switchUpgrade">伤残赔付特约 / 年</el-checkbox> -->
        </div>
        <!-- <div class="type-box">
          <el-checkbox v-model="type2" @change="switchUpgrade2">扩展24小时 / 年</el-checkbox>
        </div>-->

        <!-- 保障周期 -->
        <div style="padding-bottom:20px">
          <div class="declare-top" style="margin-top:30px;">
            <h4>
              保障周期
              <!-- <span>?</span> -->
            </h4>
          </div>
          <el-radio-group v-model="selectionType.label">
            <el-radio class="declare-radio" label="Y">
              <span class="declare-spanO">按年</span>
              <span>次日生效，保险截至日期生效日+365天</span>
              <!-- 开关控制标准或升级 -->
              <!-- <el-switch
                @change="switchUpgrade"
                class="switchStyle"
                v-model="type1"
                active-color="#7958b5"
                active-text="升级"
                inactive-color="#666"
                inactive-text="标准"
              ></el-switch>-->
              <span class="declare-span1">每人 {{exhibition.yearMoney}} 元</span>
            </el-radio>
            <el-radio class="declare-radio" label="M">
              <span class="declare-spanO">按月</span>
              <span>次日生效，保险截至日期+月份数*30天</span>
              <el-form-item style="display: inline-block;margin-left:-100px;margin-bottom:0;">
                <el-select @change="choiceMonth" v-model="selectionType.month" placeholder="请选择月份">
                  <el-option
                    v-for="(item,index) in yueFen"
                    :key="index"
                    :label="item.label"
                    :value="item.yue"
                  ></el-option>
                </el-select>
              </el-form-item>
              <span class="declare-span1">每人 {{exhibition.monthMoney}} 元</span>
            </el-radio>
            <el-radio class="declare-radio" label="D">
              <span class="declare-spanO">按日</span>
              <el-date-picker
                v-model="selectionType.data"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptions"
                @change="choiceDay"
              ></el-date-picker>
              <span class="declare-span1">每人 {{exhibition.dayMoney}} 元</span>
            </el-radio>
          </el-radio-group>
        </div>
        <!-- 被保人信息 -->
        <div>
          <div class="declare-top">
            <h4>被保人信息</h4>
          </div>
          <div v-if="!optionTow" class="batchData">
            <el-table :data="formdataArr" border style="width: 50%">
              <el-table-column type="index" label="序号" width="50"></el-table-column>
              <el-table-column prop="name" label="雇员姓名" min-width="30%"></el-table-column>
              <el-table-column prop="certNo" label="身份证" min-width="40%"></el-table-column>
              <el-table-column prop="phone" label="手机号" min-width="30%"></el-table-column>
            </el-table>
          </div>
          <div v-if="optionTow">
            <div class="declare-xinxi">
              <el-form
                :model="form"
                ref="form"
                label-width="120px"
                :rules="rules"
                v-for="(item,index) in form.insEmpApplyUsers"
                :key="index"
                v-cloak
                class="declare-xinxi-form"
              >
                <!-- <div class="declare-xinxi-left"> -->
                <el-form-item
                  label="雇员姓名"
                  :prop="'insEmpApplyUsers.'+index+'.name'"
                  :rules="rules.name"
                >
                  <el-input style="width:300px" v-model.trim="item.name"></el-input>
                  <el-button v-if="index > 0" @click.prevent="removeDomain(item)">删除</el-button>
                </el-form-item>
                <!-- </div> -->
                <!-- <div class="declare-xinxi-right"> -->
                <el-form-item
                  label="身份证"
                  :prop="'insEmpApplyUsers.'+index+'.certNo'"
                  :rules="rules.certNo"
                >
                  <el-input maxlength="18" style="width:300px" v-model.trim="item.certNo"></el-input>
                </el-form-item>
                <el-form-item
                  label="手机号"
                  :prop="'insEmpApplyUsers.'+index+'.phone'"
                  :rules="rules.phone"
                >
                  <el-input maxlength="11" style="width:300px" v-model.trim="item.phone"></el-input>
                </el-form-item>
                <el-form-item
                  label="工种"
                  :prop="'insEmpApplyUsers.'+index+'.jobCode'"
                  :rules="rules.jobCode"
                >
                  <el-select style="width:300px" v-model="item.jobCode">
                    <el-option
                      v-for="(item,index) in Typework"
                      :label="item.name"
                      :value="item.code"
                      :key="index"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <!-- </div> -->
              </el-form>
            </div>
            <div class="addInsuranceBtn">
              <el-button @click="addInsurance">新增被保险人</el-button>
            </div>
          </div>
        </div>
        <!-- 选择扣费项目 -->
        <!-- <div v-if="isShow"> -->
        <div>
          <div class="declare-top">
            <h4>
              选择扣费项目
              <!-- <span>?</span> -->
            </h4>
          </div>
          <el-form-item label="可选扣费项目">
            <el-select
              clearable
              @change="choice"
              value-key="id"
              v-model="projectId"
              placeholder="请选择项目"
            >
              <el-option
                v-for="(item,index) in project"
                :key="index"
                :label="item.name"
                :value="item"
              ></el-option>
            </el-select>
            <span class="declare-tis" v-show="showYuE">当前余额：{{isIDShow?WYBalance:yuE}}元</span>
          </el-form-item>
        </div>
        <!-- <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">申报</el-button>
          <el-button >批量申报</el-button>
        </el-form-item>-->
        <div class="declare-btn-wrap">
          <!-- <el-button type="warning" disabled>警告按钮</el-button> -->
          <el-button
            v-if="optionTow"
            ref="disabledBtn"
            class="declare-btn btn1"
            @click="submitForm('ruleForm')"
          >申报</el-button>
          <el-button v-if="batchApplyShow" class="declare-btn" @click="batchApply">批量申报</el-button>

          <!-- 点击批量申报时候出现的按钮 -->
          <el-button v-if="!optionTow" class="declare-btn btn1" @click="batchApplyDeclare">申报</el-button>
          <el-button v-if="!optionTow" class="declare-btn" @click="btnchReturn">返 回</el-button>
        </div>
      </el-form>
    </div>
    <!-- 雇主产品介绍 对话框 -->
    <el-dialog id="guarantee-dialog" title="产品介绍" :visible.sync="dialogTableVisible">
      <div class="guarantee-dialog-main">
        <h3>物保宝雇主责任险方案(18岁-70岁)</h3>
        <el-table :data="tableData1" :span-method="objectSpanMethod" border style="width: 100%;">
          <el-table-column prop="type" label min-width="20%"></el-table-column>
          <el-table-column prop="programme1" label="方案一" min-width="20%"></el-table-column>
          <el-table-column prop="programme2" label="方案二" min-width="20%"></el-table-column>
          <el-table-column prop="programme3" label="方案三" min-width="20%"></el-table-column>
          <el-table-column prop="programme4" label="方案四" min-width="20%"></el-table-column>
        </el-table>
      </div>
      <h3>保险条款</h3>
      <el-input type="textarea" v-model="insuranceClause"></el-input>
      <h3>附加条款</h3>
      <el-input type="textarea" v-model="additionalClause"></el-input>
      <h3>个人法律服务内容</h3>
      <el-input type="textarea" v-model="personalClause"></el-input>
      <div slot="footer" class="dialog-footer">
        <a href="javascript:;" class="guarantee-btn btn2" @click="dialogTableVisible=false">返 回</a>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// propJobsList
// 请求
import {
  propJobsList,
  insRuleGetProduct,
  getProjectRoleList,
  confirmOne,
  insEmpApplyGetApplies,
  insEmpApplyExportTemplate,
  insEmpApplyImportData,
  insEmpEndorse,
  getPropCompany
} from "@/api/information/information";
// 验证
import {
  ShiFanManShiBaSui,
  Identity,
  IdCard,
  IdCard2,
  isvalidPhone
} from "@/validate/validate.js";
import { log } from "util";
export default {
  name: "declare",
  inject: ["reload"],
  data() {
    // 根据身份证判断是否成年
    var isAdult = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入身份证"));
      } else if (!Identity(value)) {
        callback(new Error("证件号码格式有误"));
      } else if (!ShiFanManShiBaSui(value)) {
        callback(new Error("未成年"));
      } else if (IdCard(value)) {
        callback(new Error("已超过70岁"));
      } else {
        callback();
      }
    };
    return {
      // 伤残赔付标准或升级
      type1: false, // 默认升级  // 2020-3-27占时位false
      // 对话框
      dialogTableVisible: false,
      // 选择批量时候
      optionTow: true,
      // 批量申报按钮显示控制
      batchApplyShow: true,
      // 文件上传
      fileList: [],
      // 接口
      uploadUrl: "",
      // 控制时间控件在第二天起 只能选择30天
      pickerOptions: {
        disabledDate(time) {
          let curDate = new Date().getTime();
          let three = 31 * 24 * 3600 * 1000;
          let threeMonths = curDate + three;
          return time.getTime() < Date.now() || time.getTime() > threeMonths;
        }
      },
      // 显示在页面
      exhibition: {
        // 年金额
        yearMoney: "260",
        // 月金额
        monthMoney: "22",
        // 日金额
        dayMoney: "2"
      },
      // 用来计算
      calculation: {
        // 年金额
        yearMoney: "260",
        // 月金额
        monthMoney: "22",
        // 日金额
        dayMoney: "2"
      },
      // 用户类型
      userType: "",
      // 是否显示
      // isShow: true,
      // 工种
      Typework: [],
      // 当前余额
      yuE: "",
      // 保存当前小区信息
      projectId: {},
      // 显示当前余额
      showYuE: false,
      // 空值
      value: "",
      // 选择类型
      selectionType: {
        // 类型
        label: "Y",
        // 月数
        month: "",
        // 开始时间
        beginDate: "",
        // 结束时间
        endDate: "",
        data: ""
      },
      // 月份
      yueFen: [
        {
          label: "一个月",
          yue: "1"
        },
        {
          label: "二个月",
          yue: "2"
        },
        {
          label: "三个月",
          yue: "3"
        },
        {
          label: "四个月",
          yue: "4"
        },
        {
          label: "五个月",
          yue: "5"
        },
        {
          label: "六个月",
          yue: "6"
        },
        {
          label: "七个月",
          yue: "7"
        },
        {
          label: "八个月",
          yue: "8"
        },
        {
          label: "九个月",
          yue: "9"
        },
        {
          label: "十个月",
          yue: "10"
        },
        {
          label: "十一个月",
          yue: "11"
        },
        {
          label: "十二个月",
          yue: "12"
        }
      ],
      // 雇主产品介绍 保险条款
      insuranceClause: "",
      // 雇主产品介绍 附加条款
      additionalClause: "",
      // 雇主产品介绍 个人法律服务内容
      personalClause: "",
      // 伤残赔付特约
      type1: true,
      // 扩展24小时
      type2: true,
      // 小区项目名
      project: [],
      // 表单
      ruleForm: {
        // 承保公司code
        insCompanyTypeCode: "",
        // 承保公司id
        insCompanyId: "",
        // 年月日
        periodUnit: "",
        // 年月日对于类型 例:periodUnit:'Y'为年 period:'1' 年只有1
        period: "",
        // 开始时间
        beginDate: "",
        // 结束时间
        endDate: "",
        // 小区项目
        // projectId: "",
        projectId: "",
        // 申请人
        insEmpApplyUsers: [],
        // 投保方案
        code: "PRD_SOL_0513"
      },
      // 雇主险产品介绍
      tableData1: [
        {
          type: "死亡伤残",
          programme1: "70万",
          programme2: "70万",
          programme3: "50万",
          programme4: "50万"
        },
        {
          type: "意外医疗",
          programme1: "2万",
          programme2: "4万",
          programme3: "2万",
          programme4: "4万"
        },
        {
          type: "住院津贴",
          programme1: "100元/天,最多60天"
        },
        {
          type: "误工费",
          programme1: "100元/天,免赔5天,最多180天。"
        },
        {
          type: "1、雇员为物保平台人员,均为3类以下人员。"
        },
        {
          type: "2、医疗绝对免赔额100元后按100%赔付。"
        },
        {
          type: "3、伤亡责任:达到法定退休年龄人员为50万。"
        },
        {
          type: "4、伤残等级赔付从10级5%起。"
        },
        {
          type:
            "5、如附加24小时全天意外保障条款(每人赔偿限额:死亡伤残10万,意外医疗1万),年保费增加60元/人。"
        },
        {
          type:
            "6、特约伤残等级赔付从10级10%,9级20%,以此类推,年保费增加20元/人。"
        }
      ],
      // 获取保险品种信息
      productData: [],
      tableData: [],
      multipleSelection: [],
      // 申请人信息
      form: {
        insEmpApplyUsers: [
          {
            // 被保险人
            name: "",
            // 身份证
            certNo: "",
            // 手机号
            phone: "",
            // 所属职业
            jobCode: ""
          }
        ]
      },
      // 表单验证
      rules: {
        // 雇员姓名
        name: [
          { required: true, message: "请输入雇员姓名", trigger: "blur" }
        ],
        // 身份证
        certNo: [{ required: true, validator: isAdult, trigger: "blur" }],
        // 手机号
        phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            pattern: /^1(3|4|5|6|7|8|9)\d{9}$/,
            message: "手机号格式不对",
            trigger: "blur"
          }
        ],
        // 所属职业
        jobCode: [
          { required: true, message: "请选择所属职业", trigger: "change" }
        ]
      },
      // 上传文件信息
      formdata: "",
      // 上传成功后保存数据
      formdataArr: [],
      // 已有保单保存
      existingPolicyData: [],
      // 当前物业公司信息
      companyName: "",
      // 物业公司金额
      WYBalance: 0,
      isIDShow: false
    };
  },
  created() {
    // 获取工种类型
    propJobsList().then(xhrData => {
      if (xhrData.code === 200) {
        this.Typework = xhrData.rows;
      }
    });
    // 获取保险产品
    this.getInsRuleGetProduct();

    // 是否存在某方案
    insEmpApplyGetApplies().then(xhrData => {
      console.log(xhrData, "方案");

      if (xhrData.code === 200) {
        // 已有保单赋值保存
        this.existingPolicyData = xhrData.data;
      }
    });
    // 判断用户类型
    // this.getUserType();
    // 获取 当前物业公司信息
      this.getCompany();
    // 获取项目信息
      this.getProjectData();
  },
  methods: {
    // 获取物业公司信息
    getCompany() {
      getPropCompany().then(xhrData => {
        console.log(xhrData, "物业公司");

        if (xhrData.code === 200) {
          this.companyName = xhrData.data.name;
          this.WYBalance = xhrData.data.balance.toFixed(2);
        }
      });
    },
    // 获取项目信息
    getProjectData() {
      // 获取小区信息
      getProjectRoleList().then(xhrData => {
        this.project = xhrData.rows;
         this.$nextTick(()=>{
        this.project.unshift({
          name: this.companyName,
          id: ""
        });
         },300)
      });
    },
    // 选择天数
    choiceDay(val) {
      if (val == null) {
        val = [];
        this.exhibition.dayMoney = this.calculation.dayMoney;
      }
      if (val.length > 0) {
        // 开始时间
        const date1 = val[0];
        // 结束时间
        const date2 = val[1];
        // 计算完后的天数
        const period = this.dateDiff(date1, date2);

        this.exhibition.dayMoney = this.calculation.dayMoney * period;
      }
    },
    // 选择月份
    choiceMonth(val) {
      this.exhibition.monthMoney = this.calculation.monthMoney * val;
    },
    // 投保方案类型 显示对应金额
    showMoney(val) {
      // 默认显示升级
      this.type1 = true;
      this.selectionType.data = "";
      this.selectionType.month = "";
      if (val == "PRD_SOL_0513") {
        // 年金额
        this.exhibition.yearMoney = 260;
        this.calculation.yearMoney = 260;
        // 月金额
        this.exhibition.monthMoney = 22;
        this.calculation.monthMoney = 22;
        // 日金额
        this.exhibition.dayMoney = 2;
        this.calculation.dayMoney = 2;
      } else if (val == "PRD_SOL_0514") {
        // 年金额
        this.exhibition.yearMoney = 300;
        this.calculation.yearMoney = 300;
        // 月金额
        this.exhibition.monthMoney = 25;
        this.calculation.monthMoney = 25;
        // 日金额
        this.exhibition.dayMoney = 2.5;
        this.calculation.dayMoney = 2.5;
      } else if (val == "PRD_SOL_0515") {
        // 年金额
        this.exhibition.yearMoney = 200;
        this.calculation.yearMoney = 200;
        // 月金额
        this.exhibition.monthMoney = 17;
        this.calculation.monthMoney = 17;
        // 日金额
        this.exhibition.dayMoney = 1;
        this.calculation.dayMoney = 1;
      } else if (val == "PRD_SOL_0516") {
        // 年金额
        this.exhibition.yearMoney = 240;
        this.calculation.yearMoney = 240;
        // 月金额
        this.exhibition.monthMoney = 20;
        this.calculation.monthMoney = 20;
        // 日金额
        this.exhibition.dayMoney = 1.5;
        this.calculation.dayMoney = 1.5;
      }
    },

    // // 获取当前用户类型
    // getUserType() {
    //   // 用户类型 01物业用户 02小区用户
    //   this.userType = this.$store.state.user.userType;
    //   if (this.userType == "01") {
    //     this.isShow = false;
    //     // this.isShow = true; // 暂时显示
    //   } else if (this.userType == "02") {
    //     this.isShow = true;
    //   }
    // },
    // 获取保险产品
    getInsRuleGetProduct() {
      // 1:家财 ,2:雇主 ,3:公众 ,4:物业 ,5:..
      const data = {
        insType: "2"
      };
      // const data = '2'
      insRuleGetProduct(data).then(xhrData => {
        console.log(xhrData);

        if (xhrData.code === 200) {
          this.productData = xhrData.data;
          // 承保公司code
          this.ruleForm.insCompanyTypeCode = xhrData.data.insCompanyProductCode;
          this.ruleForm.insCompanyId = xhrData.data.insCompanyId;
        }
      });
    },
    // 新增被保险人信息
    addInsurance() {
      this.form.insEmpApplyUsers.push({
        // 被保险人
        name: "",
        // 身份证
        certNo: "",
        // 手机号
        phone: "",
        // 所属职业
        jobCode: ""
      });
    },
    // 控制伤残赔付标准或升级
    switchUpgrade(val) {
      console.log(val);
      // console.log(this.ruleForm.code);
      if (this.ruleForm.code == "PRD_SOL_0513") {
        // 年金额
        this.exhibition.yearMoney = 260;
        this.calculation.yearMoney = 260;
        if (val) {
          this.exhibition.yearMoney = this.exhibition.yearMoney + 20;
          this.calculation.yearMoney = this.calculation.yearMoney + 20;
        }
      } else if (this.ruleForm.code == "PRD_SOL_0514") {
        // 年金额
        this.exhibition.yearMoney = 300;
        this.calculation.yearMoney = 300;
        if (val) {
          this.exhibition.yearMoney = this.exhibition.yearMoney + 20;
          this.calculation.yearMoney = this.calculation.yearMoney + 20;
        }
      } else if (this.ruleForm.code == "PRD_SOL_0515") {
        // 年金额
        this.exhibition.yearMoney = 200;
        this.calculation.yearMoney = 200;
        if (val) {
          this.exhibition.yearMoney = this.exhibition.yearMoney + 20;
          this.calculation.yearMoney = this.calculation.yearMoney + 20;
        }
      } else if (this.ruleForm.code == "PRD_SOL_0516") {
        // 年金额
        this.exhibition.yearMoney = 240;
        this.calculation.yearMoney = 240;
        if (val) {
          this.exhibition.yearMoney = this.exhibition.yearMoney + 20;
          this.calculation.yearMoney = this.calculation.yearMoney + 20;
        }
      }
    },
    // 扩展24小时
    switchUpgrade2(val) {
      console.log(val);
      // console.log(this.ruleForm.code);
      if (this.ruleForm.code == "PRD_SOL_0513") {
        // 年金额
        this.exhibition.yearMoney = 260;
        this.calculation.yearMoney = 260;
        if (val) {
          this.exhibition.yearMoney = this.exhibition.yearMoney + 60;
          this.calculation.yearMoney = this.calculation.yearMoney + 60;
        }
      } else if (this.ruleForm.code == "PRD_SOL_0514") {
        // 年金额
        this.exhibition.yearMoney = 300;
        this.calculation.yearMoney = 300;
        if (val) {
          this.exhibition.yearMoney = this.exhibition.yearMoney + 60;
          this.calculation.yearMoney = this.calculation.yearMoney + 60;
        }
      } else if (this.ruleForm.code == "PRD_SOL_0515") {
        // 年金额
        this.exhibition.yearMoney = 200;
        this.calculation.yearMoney = 200;
        if (val) {
          this.exhibition.yearMoney = this.exhibition.yearMoney + 60;
          this.calculation.yearMoney = this.calculation.yearMoney + 60;
        }
      } else if (this.ruleForm.code == "PRD_SOL_0516") {
        // 年金额
        this.exhibition.yearMoney = 240;
        this.calculation.yearMoney = 240;
        if (val) {
          this.exhibition.yearMoney = this.exhibition.yearMoney + 60;
          this.calculation.yearMoney = this.calculation.yearMoney + 60;
        }
      }
    },
    // 删除
    removeDomain(item) {
      var index = this.form.insEmpApplyUsers.indexOf(item);
      if (index !== -1) {
        this.form.insEmpApplyUsers.splice(index, 1);
      }
    },
    // 申报按钮
    submitForm(form) {
      let newArr = [];
      // 保存this
      const _this = this;
      // 判断选择的保障周期
      this.ruleForm.periodUnit = this.selectionType.label;
      // 选择年
      if (this.selectionType.label == "Y") {
        this.ruleForm.period = "1";
      } else if (this.selectionType.label == "M") {
        // 判断选择了按月时候 是否选择了月份
        if (this.selectionType.month == "") {
          this.$message.warning({
            message: "请选择月数"
          });
          return;
        } else {
          this.ruleForm.period = this.selectionType.month;
        }
      } else if (this.selectionType.label == "D") {
        if (this.selectionType.data == "") {
          this.$message.warning({
            message: "请选择天数"
          });
          return;
        } else {
          // 开始时间
          const data1 = this.selectionType.data[0];
          this.ruleForm.beginDate = this.selectionType.data[0] + " 00:00:00";
          // 结束时间
          const data2 = this.selectionType.data[1];
          this.ruleForm.endDate = this.selectionType.data[1] + " 23:59:59";
          // 获取 月份直接的天数
          this.ruleForm.period = this.dateDiff(data1, data2);
        }
      }
      if (this.insEmpApplyUsers != undefined) {
        this.ruleForm.insEmpApplyUsers.push(this.insEmpApplyUsers);
      }
      // 多个保险人信息赋值到请求表单
      this.ruleForm.insEmpApplyUsers = this.form.insEmpApplyUsers;
      // 请求 雇主险提交方案及用户到保险公司
      this.form.insEmpApplyUsers.forEach((ele, index) => {
        _this.$refs["form"][index].validate(valid => {
          if (valid) {
            newArr.push(true);
          } else {
            newArr.push(false);
          }
        });
      });
      let flag = newArr.every(val => {
        return val == true;
      });

      if (flag) {
        // console.log(this.ruleForm.insEmpApplyUsers.certNo);
        if (this.type1) {
          this.ruleForm.type1 = "0";
        } else {
          this.ruleForm.type1 = "1";
        }
        if (this.type2) {
          this.ruleForm.type2 = "0";
        } else {
          this.ruleForm.type2 = "1";
        }
        console.log(this.ruleForm);
        // 保存this
        let _this = this;
        // 保存最终金额
        let money;
        function calculationMoney(num) {
          for (let i = 1; i <= _this.ruleForm.insEmpApplyUsers.length; i++) {
            money = num * i;
          }
        }
        // 判断选择年月日
        if (this.ruleForm.periodUnit == "Y") {
          calculationMoney(this.exhibition.yearMoney);
        } else if (this.ruleForm.periodUnit == "M") {
          calculationMoney(this.exhibition.monthMoney);
        } else if (this.ruleForm.periodUnit == "D") {
          calculationMoney(this.exhibition.dayMoney);
        }
        this.$confirm(`此次申报将会扣除账户${money}元, 是否继续?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.ruleForm.insEmpApplyUsers.forEach(item => {
              // 验证输入的身份证是否达到60以上
              if (IdCard2(item.certNo)) {
                console.log("达到60岁以上");
                this.$confirm(
                  "被保人达到60岁以上,死亡伤残保额由70万变更为40万,是否继续?",
                  "提示",
                  {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                  }
                )
                  .then(() => {
                    // 通过表单验证
                    const existing = this.existingPolicyData;
                    const ruleForm = this.ruleForm;
                    const arr = [];
                    // 加载框
                    const loading = this.$loading({
                      lock: true,
                      text: "申请中...",
                      spinner: "el-icon-loading",
                      background: "rgba(0, 0, 0, 0.7)"
                    });
                    // 判断申请的保单是否已经存在 存在调用批增
                    for (let i = 0; i < existing.length; i++) {
                      if (existing[i].periodUnit == "D") {
                        continue;
                      }
                      if (
                        ruleForm.code == existing[i].code &&
                        ruleForm.periodUnit == existing[i].periodUnit &&
                        ruleForm.insCompanyTypeCode ==
                          existing[i].insCompanyTypeCode
                      ) {
                        arr.push(existing[i].applyId);
                      }
                    }
                    // 大于零表示 数组内有值 代表 保单存在
                    if (arr.length > 0) {
                      // console.log(arr[0],'调用批增');
                      const endoreType = "1"; // 批增 参数类型
                      for (
                        let i = 0;
                        i < this.ruleForm.insEmpApplyUsers.length;
                        i++
                      ) {
                        this.ruleForm.insEmpApplyUsers[
                          i
                        ].endoreType = endoreType;
                      }
                      const data = {
                        applyId: arr[0],
                        toIns: 1, // 默认1 提交到保险公司
                        endorseUsers: this.ruleForm.insEmpApplyUsers,
                        projectId: this.ruleForm.projectId
                      };
                      console.log(data, "asd");

                      // 调用批增接口
                      insEmpEndorse(data)
                        .then(xhrData => {
                          if (xhrData.code === 200) {
                            this.$message.success({
                              message: "申报成功!"
                            });
                            // 更新项目信息
                            this.getProjectData();
                            // 更新物业信息
                            this.getCompany();
                            // 关闭 加载
                            loading.close();
                            // 清空表单
                            this.form.insEmpApplyUsers.forEach((ele, index) => {
                              _this.$refs["form"][index].resetFields();
                            });
                            // 刷新
                            this.reload();
                          } else {
                            // 关闭 加载
                            loading.close();
                            this.$message.error({
                              message: "申请失败!"
                            });
                          }
                        })
                        .catch(() => {
                          // 关闭 加载
                          loading.close();
                        });
                    } else {
                      confirmOne(this.ruleForm)
                        .then(xhrData => {
                          if (xhrData.code === 200) {
                            this.$message.success({
                              message: "申报成功!"
                            });
                            // 更新项目信息
                            this.getProjectData();
                            // 更新物业信息
                            this.getCompany();
                            // 关闭 加载
                            loading.close();
                            // 清空表单
                            this.form.insEmpApplyUsers.forEach((ele, index) => {
                              _this.$refs["form"][index].resetFields();
                            });
                            // 刷新
                            this.reload();
                          } else {
                            // 关闭 加载
                            loading.close();
                            this.$message.error({
                              message: "申报失败"
                            });
                          }
                        })
                        .catch(() => {
                          // 关闭 加载
                          loading.close();
                        });
                    }
                  })
                  .catch(() => {
                    this.$message({
                      type: "info",
                      message: "已取消删除"
                    });
                  });
              } else {
                // 通过表单验证
                const existing = this.existingPolicyData;
                const ruleForm = this.ruleForm;
                const arr = [];
                // 加载框
                const loading = this.$loading({
                  lock: true,
                  text: "申请中...",
                  spinner: "el-icon-loading",
                  background: "rgba(0, 0, 0, 0.7)"
                });
                // 判断申请的保单是否已经存在 存在调用批增
                for (let i = 0; i < existing.length; i++) {
                  if (existing[i].periodUnit == "D") {
                    continue;
                  }
                  if (
                    ruleForm.code == existing[i].code &&
                    ruleForm.periodUnit == existing[i].periodUnit &&
                    ruleForm.insCompanyTypeCode ==
                      existing[i].insCompanyTypeCode
                  ) {
                    arr.push(existing[i].applyId);
                  }
                }
                // 大于零表示 数组内有值 代表 保单存在
                if (arr.length > 0) {
                  // console.log(arr[0],'调用批增');
                  const endoreType = "1"; // 批增 参数类型
                  for (
                    let i = 0;
                    i < this.ruleForm.insEmpApplyUsers.length;
                    i++
                  ) {
                    this.ruleForm.insEmpApplyUsers[i].endoreType = endoreType;
                  }
                  const data = {
                    applyId: arr[0],
                    toIns: 1, // 默认1 提交到保险公司
                    endorseUsers: this.ruleForm.insEmpApplyUsers,
                    projectId: this.ruleForm.projectId
                  };

                  // 调用批增接口
                  insEmpEndorse(data)
                    .then(xhrData => {
                      if (xhrData.code === 200) {
                        this.$message.success({
                          message: "申报成功!"
                        });
                        // 更新项目信息
                        this.getProjectData();
                        // 更新物业信息
                        this.getCompany();
                        // 关闭 加载
                        loading.close();
                        // 清空表单
                        this.form.insEmpApplyUsers.forEach((ele, index) => {
                          _this.$refs["form"][index].resetFields();
                        });
                        // 刷新
                        this.reload();
                      } else {
                        // 关闭 加载
                        loading.close();
                        this.$message.error({
                          message: "申请失败!"
                        });
                      }
                    })
                    .catch(() => {
                      // 关闭 加载
                      loading.close();
                    });
                } else {
                  confirmOne(this.ruleForm)
                    .then(xhrData => {
                      if (xhrData.code === 200) {
                        this.$message.success({
                          message: "申报成功!"
                        });
                        // 更新项目信息
                        this.getProjectData();
                        // 更新物业信息
                        this.getCompany();
                        // 关闭 加载
                        loading.close();
                        // 清空表单
                        this.form.insEmpApplyUsers.forEach((ele, index) => {
                          _this.$refs["form"][index].resetFields();
                        });
                        // 刷新
                        this.reload();
                      } else {
                        // 关闭 加载
                        loading.close();
                        this.$message.error({
                          message: "申报失败"
                        });
                      }
                    })
                    .catch(() => {
                      // 关闭 加载
                      loading.close();
                    });
                }
              }
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消申报"
            });
          });
      } else {
        this.$message.warning({
          message: "请填写完整信息"
        });
      }
    },
    // 提取申报方法
    extractDeclareFun() {
      // console.log(this.ruleForm);
    },
    // 计算天数差
    dateDiff(sDate1, sDate2) {
      var aDate, oDate1, oDate2, iDays;
      aDate = sDate1.split("-");
      oDate1 = new Date(aDate[1] + "-" + aDate[2] + "-" + aDate[0]); //转换为9-25-2017格式
      aDate = sDate2.split("-");
      oDate2 = new Date(aDate[1] + "-" + aDate[2] + "-" + aDate[0]);
      iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24); //把相差的毫秒数转换为天数
      return iDays;
    },
    // 选择小区
    choice(item) {
      // 更新列表
      this.getProjectData();
      console.log(item);
      if (item.id == "") {
        this.isIDShow = true;
      } else {
        this.isIDShow = false;
      }

      this.ruleForm.projectId = this.projectId.id;
      // 显示当余额
      this.showYuE = true;
      // 当前余额赋值上去
      if (item == "") {
        this.showYuE = false;
      }
      if (item.balance == null) {
        this.yuE = "0.00";
      } else {
        this.yuE = item.balance.toFixed(2);
      }
    },
    // 下载模板按钮
    handleExport() {
      // const formInline = this.formInline;
      this.$confirm("是否确认批量模板下载?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return insEmpApplyExportTemplate();
        })
        .then(response => {
          this.download(response.msg);
        })
        .catch(function() {});
    },
    // 上传
    handleChange(file, fileList) {
      const param = new FormData();
      param.append("file", file.raw);
      insEmpApplyImportData(param).then(xhrData => {
        if (xhrData.code === 200) {
          this.formdataArr = xhrData.data;
        }
      });
    },
    // 上传文件关闭按钮
    onRemove() {
      // 清空表格
      this.formdataArr = [];
    },
    // 批量申报按钮
    batchApply() {
      // 回到顶部
      document.body.scrollTop = document.documentElement.scrollTop = 0;
      // 控制显示 隐藏
      this.optionTow = false;
      this.batchApplyShow = false;
    },
    // 返回按钮
    btnchReturn() {
      // 清空表格
      this.formdataArr = [];
      // 回到顶部
      document.body.scrollTop = document.documentElement.scrollTop = 0;
      // 控制显示 隐藏
      this.optionTow = true;
      this.batchApplyShow = true;
    },
    // 批量审批时候的 审批按钮
    batchApplyDeclare() {
      // 清空表单
      this.ruleForm.insEmpApplyUsers = [];
      // 保存this
      const _this = this;
      // 判断选择的保障周期
      this.ruleForm.periodUnit = this.selectionType.label;
      // 选择年
      if (this.selectionType.label == "Y") {
        this.ruleForm.period = "1";
      } else if (this.selectionType.label == "M") {
        if (this.selectionType.month == "") {
          this.$message.warning({
            message: "请选择月数"
          });
          return;
        } else {
          this.ruleForm.period = this.selectionType.month;
        }
      } else if (this.selectionType.label == "D") {
        if (this.selectionType.data == "") {
          this.$message.warning({
            message: "请选择天数"
          });
          return;
        } else {
          // 开始时间
          const data1 = this.selectionType.data[0];
          this.ruleForm.beginDate = this.selectionType.data[0] + " 00:00:00";
          // 结束时间
          const data2 = this.selectionType.data[1];
          this.ruleForm.endDate = this.selectionType.data[1] + " 23:59:59";
          // 获取 月份直接的天数
          this.ruleForm.period = this.dateDiff(data1, data2);
        }
      }
      const existing = this.existingPolicyData;
      const ruleForm = this.ruleForm;
      const arr = [];

      // 判断申请的保单是否已经存在 存在调用批增
      for (let i = 0; i < existing.length; i++) {
        if (existing[i].periodUnit == "D") {
          continue;
        }
        if (
          ruleForm.code == existing[i].code &&
          ruleForm.periodUnit == existing[i].periodUnit &&
          ruleForm.insCompanyTypeCode == existing[i].insCompanyTypeCode
        ) {
          arr.push(existing[i].applyId);
        }
      }

      for (let i = 0; i < this.formdataArr.length; i++) {
        //  this.ruleForm.insEmpApplyUsers[i]=this.formdataArr[i].name =this.formdataArr[i].certNo ,this.formdataArr[i].phone
        this.ruleForm.insEmpApplyUsers[i] = {
          name: this.formdataArr[i].name,
          certNo: this.formdataArr[i].certNo,
          phone: this.formdataArr[i].phone,
          // 默认传递
          jobCode: "JOB_CD_0009"
        };
      }
      if (this.ruleForm.insEmpApplyUsers.length <= 0) {
        this.$message.warning({
          message: "请上传文件后申报!"
        });
      } else {
        // console.log(this.ruleForm.insEmpApplyUsers);
        let dataArr = this.ruleForm.insEmpApplyUsers;
        for (let i = 0; i < dataArr.length; i++) {
          // console.log(dataArr[i]);
          // 判断身份证格式是否正确
          if (!Identity(dataArr[i].certNo)) {
            // 身份证格式不正确
            this.$message.error({
              message: `第${i + 1}行,身份证格式存在错误!  请确认后申报!`
            });
            return;
          } else if (!ShiFanManShiBaSui(dataArr[i].certNo)) {
            // 证件中存在未成年用户
            this.$message.error({
              message: `第${i + 1}行,证件中存在未成年!  请确认后申报!`
            });
            return;
          } else if (IdCard(dataArr[i].certNo)) {
            // 证件中存在超过70岁用户
            this.$message.error({
              message: `第${i + 1}行,证件中存在超过70岁用户!  请确认后申报!`
            });
            // break;
            return;
          } else if (!isvalidPhone(dataArr[i].phone)) {
            // 手机号格式有误
            this.$message.error({
              message: `第${i + 1}行,手机号格式有误!  请确认后申报!`
            });
            return;
          }
        }
        // 保存最终金额

        if (this.ruleForm.projectId == undefined) {
          this.ruleForm.projectId = "";
        }
        console.log(this.ruleForm);
        let money;
        function calculationMoney(num) {
          for (let i = 1; i <= _this.ruleForm.insEmpApplyUsers.length; i++) {
            money = num * i;
          }
        }
        // 判断选择年月日
        if (this.ruleForm.periodUnit == "Y") {
          calculationMoney(this.exhibition.yearMoney);
        } else if (this.ruleForm.periodUnit == "M") {
          calculationMoney(this.exhibition.monthMoney);
        } else if (this.ruleForm.periodUnit == "D") {
          calculationMoney(this.exhibition.dayMoney);
        }
        // console.log('通过',money);
        this.$confirm(`此次申报将会扣除账户${money}元, 是否继续?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            // 加载框
            const loading = this.$loading({
              lock: true,
              text: "申请中...",
              spinner: "el-icon-loading",
              background: "rgba(0, 0, 0, 0.7)"
            });
            // 大于零表示 数组内有值 代表 保单存在
            if (arr.length > 0) {
              const endoreType = "1"; // 批增 参数类型
              for (let i = 0; i < this.ruleForm.insEmpApplyUsers.length; i++) {
                this.ruleForm.insEmpApplyUsers[i].endoreType = endoreType;
              }
              const data = {
                applyId: arr[0],
                toIns: 1, // 默认1 提交到保险公司
                endorseUsers: this.ruleForm.insEmpApplyUsers,
                projectId: this.ruleForm.projectId
              };
              console.log(data);

              // 调用批增接口
              insEmpEndorse(data)
                .then(xhrData => {
                  if (xhrData.code === 200) {
                    this.$message.success({
                      message: "申报成功!"
                    });
                    // 关闭 加载
                    loading.close();
                    // 清空上传文件
                    this.fileList = [];
                    // 清空文本
                    this.ruleForm.insEmpApplyUsers = [];
                    // 清空表格
                    this.formdataArr = [];
                    // 刷新
                    this.reload();
                  }
                })
                .catch(() => {
                  // 关闭 加载
                  loading.close();
                });
            } else {
              // console.log(arr[0], "不存在");
              // 调用 一键通接口
              confirmOne(this.ruleForm)
                .then(xhrData => {
                  if (xhrData.code === 200) {
                    this.$message.success({
                      message: "申报成功!"
                    });
                    // 关闭 加载
                    loading.close();
                    // 清空上传文件
                    this.fileList = [];
                    // 清空文本
                    this.ruleForm.insEmpApplyUsers = [];
                    // 清空表格
                    this.formdataArr = [];
                    // 刷新
                    this.reload();
                  } else {
                    // 关闭 加载
                    loading.close();
                  }
                })
                .catch(() => {
                  // 关闭 加载
                  loading.close();
                });
            }
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消申报!"
            });
          });
      }
    },
    // 表格控制
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      // 设置要合并的行和要合并的列
      if (
        (rowIndex === 2 && columnIndex === 1) ||
        (rowIndex === 3 && columnIndex === 1)
      ) {
        // 分别代表合并的行数和列数
        return [1, 4];
      } else if (
        (rowIndex === 4 && columnIndex === 0) ||
        (rowIndex === 5 && columnIndex === 0) ||
        (rowIndex === 6 && columnIndex === 0) ||
        (rowIndex === 7 && columnIndex === 0) ||
        (rowIndex === 8 && columnIndex === 0) ||
        (rowIndex === 9 && columnIndex === 0)
      ) {
        return [1, 5];
      }
    }
  }
};
</script>
<style>
.switchStyle {
  margin-left: 10px;
}
.switchStyle .el-switch__label {
  position: absolute;
  display: none;
  color: #fff;
}
.switchStyle .el-switch__label--left {
  z-index: 9;
  left: 20px;
}
.switchStyle .el-switch__label--right {
  z-index: 9;
  /* left: -14px; */
}
.switchStyle .el-switch__label.is-active {
  display: block;
}
.switchStyle.el-switch .el-switch__core,
.el-switch .el-switch__label {
  width: 60px !important;
}
.el-form-item__label {
  font-size: 14px;
  color: #7e7e7e;
  font-weight: normal;
}
.declare-btn-wrap {
  padding-top: 15px;
  border-top: 1px solid #dbdbdb;
}
.declare-btn {
  display: inline-block;
  width: 130px;
  height: 44px;
  text-align: center;
  font-size: 16px;
  font-weight: bold;
}
.declare-btn.btn1 {
  background: linear-gradient(
    270deg,
    rgba(248, 184, 0, 1) 0%,
    rgba(239, 130, 0, 1) 100%
  );
  border-radius: 4px;
  border: 1px solid rgba(248, 184, 0, 1);
  color: #fff;
}
.declare-btn.btn1.disabled {
  opacity: 0.5;
}
.declare-btn.btn2 {
  border-radius: 4px;
  border: 1px solid #dbdbdb;
  color: #999;
}
#declare .el-range-editor.el-input__inner {
  width: 464px;
}
#declareTable .el-radio__inner {
  width: 20px;
  height: 20px;
  border:  1px solid rgb(173, 173, 173);
}
#declareTable .el-radio__inner::after {
  width: 12px;
  height: 12px;
}
#guarantee-dialog .el-dialog__header {
  background-color: #e6e8eb;
}
#guarantee-dialog .guarantee-btn {
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
#guarantee-dialog .guarantee-btn.btn1 {
  background: rgba(239, 130, 0, 1);
  border: 1px solid rgba(206, 112, 0, 1);
  color: #fff;
}
#guarantee-dialog .guarantee-btn.btn2 {
  border: 1px solid rgba(0, 0, 0, 0.25);
}
#guarantee-dialog .el-dialog__title {
  font-size: 20px;
  font-weight: bold;
}
#guarantee-dialog .el-dialog__body {
  padding-left: 40px;
  padding-right: 40px;
  padding-bottom: 40px;
  box-sizing: border-box;
}
#guarantee-dialog .el-dialog__footer {
  background-color: #e6e8eb;
}
.declare-top h4{
  padding-bottom: 15px;
}
</style>
<style lang="scss" scoped>
.declare {
  width: 100%;
  padding: 15px;
  min-height: calc(88vh);
  box-sizing: border-box;
  background-color: #e6e8eb;
  padding-bottom: 30px;
  .declare-conter {
    min-height: calc(88vh);
    background-color: #fff;
    padding: 25px;
    box-sizing: border-box;
    border-radius: 5px;
    .declare-top-conter {
      display: flex;
      justify-content: space-between;
      .declare-top-left {
        p {
          font-size: 14px;
          color: #7e7e7e;
          margin-bottom: 35px;
          // padding-top: 15px;
          box-sizing: border-box;
          span:nth-child(1) {
            display: inline-block;
            width: 120px;
          }
          span:nth-child(2) {
            display: inline-block;
          }
        }
      }
      .declare-top-right {
        a.declare-top-btn:nth-child(2) {
          margin-top: 20px;
        }
        .declare-top-btn {
          width: 122px;
          height: 32px;
          background: rgba(241, 242, 243, 1);
          border-radius: 2px;
          border: 1px solid rgba(0, 0, 0, 0.25);
          font-size: 14px;
          display: block;
          font-weight: bold;
        }
        .declare-top-btn.btn1 {
          text-align: center;
          line-height: 32px;
        }
        .declare-top-btn.btn2 {
          color: #000;
          margin-top: 20px;
        }
      }
    }
    .type-box {
      padding-top: 20px;
    }
    .addInsuranceBtn {
      padding-bottom: 20px;
    }
    .declare-top {
      h4 {
        padding-top: 15px;
        span {
          display: inline-block;
          width: 13px;
          height: 13px;
          border-radius: 50%;
          border: 1px solid #6b6b6b;
          font-size: 10px;
          text-align: center;
          line-height: 13px;
          color: #929292;
          margin-left: 10px;
        }
      }
    }
    table {
      width: 100%;
      border-collapse: collapse;
      border: none;
      border-radius: 5px;
      -moz-border-radius: 5px;
      -webkit-border-radius: 5px;
      th {
        // background-color: #fafafa;
        background-color: #f8f8f8;
      }
      td,
      th {
        padding: 15px;
        box-sizing: border-box;
        border: solid rgb(223, 223, 223) 1px;
        // border: solid#ececec 1px;
      }
    }
    .declare-xinxi {
      display: flex;
      // justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      .declare-xinxi-form:nth-child(n + 4) {
        margin-top: 15px;
        // border-top: 1px solid #dcdfe6;
        padding-top: 15px;
      }
      .declare-xinxi-form {
        flex: auto;
        p {
          font-size: 14px;
          color: #7e7e7e;
          margin-bottom: 35px;
          span:nth-child(1) {
            display: inline-block;
            width: 120px;
          }
          span:nth-child(2) {
            display: inline-block;
          }
        }
      }
    }
    .declare-radio {
      display: block;
      margin-top: 15px;
    }
    .declare-spanO {
      display: inline-block;
      width: 80px;
    }
    .declare-span1 {
      color: #f5222d;
      margin-left: 20px;
    }
    span.declare-tis {
      font-size: 14px;
      color: #f5222d;
      margin-left: 15px;
    }
    .batchData {
      // display: flex;
      // align-items: center;
      // flex-wrap: wrap;
      padding-bottom: 30px;
      .batchData-conter {
        flex: auto;
        p {
          font-size: 14px;
          color: #7e7e7e;
          margin-bottom: 35px;
          span:nth-child(1) {
            display: inline-block;
            width: 120px;
          }
          span:nth-child(2) {
            display: inline-block;
          }
        }
      }
    }
  }
  #guarantee-dialog {
    margin-top: 0;
    .guarantee-dialog-main {
      h3 {
        background-color: #e5dfec;
        margin-bottom: 0;
        height: 40px;
        line-height: 40px;
        text-align: center;
      }
    }
  }
}
</style>
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
            <span>申报单位</span>
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
              雇员法保服务(雇主责任险+个人法律年卡+赔偿协助服务)
              <!-- <span>?</span> -->
              <a
                href="javascript:;"
                style="color:#0179FE;font-size:14px;margin-left:30px;"
                @click="dialogTableVisible=true"
              >内容介绍</a>
            </h4>
          </div>
          <table id="declareTable">
            <tr style="font-size:14px;height:50px;">
              <th style="width:20%;"></th>
              <th style="width:20%;">
                <el-radio
                  disabled
                  @change="showMoney"
                  v-model="ruleForm.code"
                  label="PLAN_ONE"
                >{{value}}</el-radio>
              </th>
              <th style="width:20%;">
                <el-radio
                  disabled
                  @change="showMoney"
                  v-model="ruleForm.code"
                  label="PLAN_TWO"
                >{{value}}</el-radio>
              </th>
              <th style="width:20%;">
                <el-radio
                  disabled
                  @change="showMoney"
                  v-model="ruleForm.code"
                  label="PLAN_THREE"
                >{{value}}</el-radio>
              </th>
              <th style="width:20%;">
                <el-radio
                  disabled
                  @change="showMoney"
                  v-model="ruleForm.code"
                  label="PLAN_FOUR"
                >{{value}}</el-radio>
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
        <div v-if="!isInsurance" v-show="isAdditional" class="type-box">
          <el-checkbox disabled v-model="type1">伤残赔付特约（伤残赔付比例按等比赔付） / 年</el-checkbox>
        </div>
        <div v-if="!isInsurance" v-show="isAdditional" class="type-box">
          <el-checkbox disabled v-model="type2">扩展24小时（死亡伤残10万意外医疗1万） / 年</el-checkbox>
        </div>

        <!-- 保障周期 -->
        <div style="padding-bottom:20px">
          <div class="declare-top" style="margin-top:30px;">
            <h4>
              保障周期
              <!-- <span>?</span> -->
            </h4>
          </div>
          <el-radio-group @change="getSelectionType" v-model="selectionType.label">
            <el-radio disabled class="declare-radio" label="Y">
              <span class="declare-spanO">按年</span>
              <!-- <span>次日生效，保险截至日期生效日+365天</span> -->
              <el-date-picker
                v-model="startTime"
                disabled
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
              ></el-date-picker>
              <span>至</span>
              <el-date-picker
                v-model="endTime"
                disabled
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
              ></el-date-picker>
              <span class="declare-span1">每人 {{yearCost}} 元</span>
            </el-radio>
          </el-radio-group>
        </div>
        <div>
          <div class="declare-top">
            <h4>选择扣费</h4>
          </div>
          <el-form-item label="扣费账户">
            <el-select
              style="width:300px"
              @change="choice"
              value-key="name"
              v-model="projectItem"
              placeholder="请选择"
            >
              <el-option-group v-for="item in projectData" :key="item.name" :label="item.name">
                <el-option
                  v-for="item2 in item.arr"
                  :key="item2.name"
                  :label="item2.name"
                  :value="item2"
                ></el-option>
              </el-option-group>
            </el-select>
            <span class="declare-tis" v-show="showYuE">当前余额：{{isIDShow?WYBalance:yuE}}元</span>
          </el-form-item>
          <div v-if="isShowInvoice">
            <!-- 国寿财有发票选择 -->
            <el-form-item label="是否开票">
              <el-switch
                @change="isInvoice"
                class="switchStyle"
                v-model="isSocialSecurity2"
                active-color="#1890ff"
                active-text="是"
                inactive-color="#ddd"
                inactive-text="否"
              ></el-switch>
            </el-form-item>
            <div v-show="isSocialSecurity2">
              <el-form-item>
                <el-radio-group @change="getInvoiceType" v-model="invoiceType">
                  <el-radio label="1">增值税专票</el-radio>
                  <el-radio label="2">增值税普票</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item v-show="speciaAndOrdinary">
                <el-select
                  @change="gitInvoiceId"
                  style="width:300px"
                  v-model="invoiceId1"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in specialData"
                    :key="item.id"
                    :label="item.title"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-show="!speciaAndOrdinary">
                <el-select
                  @change="gitInvoiceId"
                  style="width:300px"
                  v-model="invoiceId2"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in ordinaryData"
                    :key="item.id"
                    :label="item.title"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
          </div>
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
              <el-table-column prop="idCard" label="身份证" min-width="40%"></el-table-column>
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
                <el-form-item
                  :prop="'insEmpApplyUsers.'+index+'.projectItem'"
                  :rules="rules.projectItem"
                  label="项目名称："
                >
                  <el-select
                    @change="getProject($event,index)"
                    value-key="name"
                    style="width:300px"
                    v-model="item.projectItem"
                    placeholder="请选择"
                  >
                    <el-option-group
                      v-for="item in projectData"
                      :key="item.name"
                      :label="item.name"
                    >
                      <el-option
                        v-for="item2 in item.arr"
                        :key="item2.name"
                        :label="item2.name"
                        :value="item2"
                      ></el-option>
                    </el-option-group>
                  </el-select>
                  <el-button v-if="index > 0" @click.prevent="removeDomain(item)">删除</el-button>
                </el-form-item>
                <el-form-item
                  label="雇员姓名"
                  :prop="'insEmpApplyUsers.'+index+'.name'"
                  :rules="rules.name"
                >
                  <el-input style="width:300px" v-model.trim="item.name"></el-input>
                </el-form-item>
                <el-form-item
                  label="身份证"
                  :prop="'insEmpApplyUsers.'+index+'.idCard'"
                  :rules="rules.idCard"
                >
                  <el-input maxlength="18" style="width:300px" v-model.trim="item.idCard"></el-input>
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
                  :prop="'insEmpApplyUsers.'+index+'.jobCodeItem'"
                  :rules="rules.jobCodeItem"
                >
                  <el-select
                    value-key="name"
                    @change="getJobCode($event,index)"
                    style="width:300px"
                    v-model="item.jobCodeItem"
                  >
                    <el-option
                      v-for="(item,index) in Typework"
                      :label="item.name"
                      :value="item"
                      :key="index"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="批改申报时间" :rules="rules.startTime">
                  <!-- <el-date-picker
                  @change="getStartTime($event,index)"
                  :picker-options="pickerOptions"
                    v-model="item.startTime"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期"
                  ></el-date-picker>-->
                  <el-date-picker
                    disabled
                    v-model="correctionStartTime"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期"
                  ></el-date-picker>
                  <span>至</span>
                  <el-date-picker
                    v-model="endTime"
                    disabled
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期"
                  ></el-date-picker>
                  <span style="color:#da242a">{{showDayNum || '0'}}元</span>
                </el-form-item>
              </el-form>
            </div>
            <div class="addInsuranceBtn">
              <el-button @click="addInsurance">新增被保险人</el-button>
            </div>
          </div>
        </div>
        <div class="declare-btn-wrap">
          <el-button
            v-if="optionTow"
            ref="disabledBtn"
            class="declare-btn btn1"
            @click="submitForm('ruleForm')"
          >申报</el-button>
          <el-button class="declare-btn" @click="btnchReturn">返 回</el-button>
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
      <h3 style="padding:15px 0">保险条款</h3>
      <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 10}" v-model="insuranceClause"></el-input>
      <h3 style="padding:15px 0">附加条款</h3>
      <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 5}" v-model="additionalClause"></el-input>
      <h3 style="padding:15px 0">个人法律服务内容</h3>
      <el-input type="textarea" :autosize="{ maxRows: 15}"  v-model="personalClause"></el-input>
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
  getProjectRoleList,
  confirmOne,
  insEmpApplyGetApplies,
  insEmpApplyExportTemplate,
  insEmpApplyImportData,
  insEmpEndorse,
  getPropCompany,
  //
  // queryProjectList,
  queryInvoiceList,
  insEmpApply,
  insRuleGetProduct,
  //
  insEmpApplyId,
  insEmpApplyNew,
  insEmpProduct
} from "@/api/information/information";
// 验证
import {
  ShiFanManShiBaSui,
  Identity,
  IdCard,
  IdCard2,
  isvalidPhone
} from "@/validate/validate.js";
// 保险条款
import { employeeAddClause,employeeClause,personalLaw } from "@/validate/programme"
import { log } from "util";
export default {
  name: "declare",
  props: ["obj2"],
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
      // 保存发票id
      invoiceId1: "",
      invoiceId2: "",
      // 发票类型
      invoiceType: "1",
      // 保存所有发票类型数据
      wholeDataL: [],
      // 保存专票类型数据
      specialData: [],
      // 保存普票类型数据
      ordinaryData: [],
      // 专票或普票 (默认专票)
      speciaAndOrdinary: true,
      // 是否开票 (默认开票)
      isSocialSecurity2: true,
      // 是否显示附加险
      isAdditional: true,
      //
      projectItem: "",
      //
      projectData: [],
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
      // 控制时间控件在第二天起 只能选择30天
      pickerOptions: this.disabledDate(),
      // 显示在页面
      exhibition: {
        // 年金额
        yearMoney: "",
        // 月金额
        monthMoney: "",
        // 日金额
        dayMoney: ""
      },
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
        startTime: "",
        // 结束时间
        endTime: "",
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
        startTime: "",
        // 结束时间
        endTime: "",
        // 小区项目
        // projectId: "",
        projectItem: "",
        // 申请人
        insEmpApplyUsers: [],
        // 投保方案
        code: "",
        // 发票id
        invoiceId: ""
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
      productData: {},
      // 申请人信息
      form: {
        insEmpApplyUsers: [
          {
            // 被保险人
            name: "",
            // 身份证
            idCard: "",
            // 手机号
            phone: "",
            // 工种
            jobCodeItem: "",
            // 项目名称
            projectItem: "",
            // 工种名字
            jobName: "",
            // 工种code
            jobCode: "",
            // 开始时间
            startTime: ""
          }
        ]
      },
      // 表单验证
      rules: {
        // 被保险人
        name: [{ required: true, message: "请输入雇员姓名", trigger: "blur" }],
        // 身份证
        idCard: [{ required: true, validator: isAdult, trigger: "blur" }],
        // 手机号
        phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            pattern: /^1(3|4|5|6|7|8|9)\d{9}$/,
            message: "手机号格式不对",
            trigger: "blur"
          }
        ],
        // 工种
        jobCodeItem: [
          { required: true, message: "请选择所属职业", trigger: "change" }
        ],
        // 批改开时间
        startTime: [
          { required: true, message: "请选择批改时间", trigger: "change" }
        ],
        // 项目
        projectItem: [
          { required: true, message: "请选择项目", trigger: "change" }
        ]
      },
      // 上传成功后保存数据
      formdataArr: [],
      // 当前物业公司信息
      companyName: "",
      // 物业公司金额
      WYBalance: 0,
      isIDShow: false,
      //////////////
      insCompId: "",
      payProjectId: "", // 扣费项目,可能是物业公司也可能是项目
      payProjectType: "", // 扣费类型，0：物业公司 1：项目
      // 保存之前开始时间
      startTime: "",
      // 批改申报结束 保存之前结束时间
      endTime: "",
      // 批改申报开始时间
      correctionStartTime: "",
      // 是否显示隐藏开票
      isShowInvoice: false,
      // 保存 投保规则时间段内可投保时间戳开始
      startTimeStamp: "",
      // 保存 投保规则时间段内可投保时间戳结束
      endTimeStamp: "",
      // 保存传入日期年内天数
      yearDayNum: "",
      // 保存年保费
      yearCost: 0, // 占存
      // 保存天保费
      dayNum: "",
      // 展示天保费
      showDayNum: "",
      // 国寿财不展示附加险
      isInsurance: false,
    };
  },
  created() {
    this.additionalClause = employeeAddClause()
    this.insuranceClause = employeeClause()
    this.personalClause = personalLaw();
    this.getCompany();
    this.getProjectList();
    this.getInvoiceList();
    this.getRuleGetProduct();
    this.getEmpData();
    // 获取工种类型
    propJobsList().then(xhrData => {
      if (xhrData.code === 200) {
        this.Typework = xhrData.rows;
      }
    });
  },
  methods: {
    // 获取批改申报时间
    getStartTime(val, index) {
      // 保存选择的天数
      if (val == null) {
        this.form.insEmpApplyUsers[index].dayNum = 0;
      } else {
        let day = this.dateDiff(val, this.endTime);
        this.form.insEmpApplyUsers[index].dayNum = (day * this.dayNum).toFixed(
          2
        );
      }
      this.form.insEmpApplyUsers[index].startTime = val + " 00:00:00";
    },
    // 申报详情
    async getEmpData() {
      let planId = "";
      let xhrData = await insEmpApplyId(this.obj2.applyId);
      if (xhrData.code === 200) {
        planId = xhrData.data.planId;
        this.selectionType.label = xhrData.data.cycle;
        this.startTime = xhrData.data.startTime.split(" ")[0];
        // console.log(this.startTime);
        
        let startTime = new Date(this.startTime);
        let startTimeStamp = startTime.getTime(startTime);
        this.endTime = xhrData.data.endTime.split(" ")[0];
        // 保存一年内总天数
        this.yearDayNum = this.dateDiff(this.startTime, this.endTime);
        // console.log(this.startTime, this.endTime);
        
        let endTime = new Date(this.endTime);
        let endTimeStamp = endTime.getTime(this.endTime);
        this.endTimeStamp = endTimeStamp;
        this.ruleForm.code = xhrData.data.planCode;
        // 当前时间
        // console.log(new Date().toLocaleDateString());
        let newStartTime = this.startTime.replace(/-0*/g,"\/");
        const start = new Date(new Date().toLocaleDateString()).getTime();
        
        const start2 = new Date(newStartTime).getTime();
        // 在保期间 若 当前时间大于在保期间起始时间 使用当前时间
        // console.log(start,start2);
        
        // console.log(start >= start2);
        
        if (start >= start2) {
          // this.startTimeStamp = start;
          // 获取当前第二天时间
          let dateSecond = new Date();
          let yearSecond = dateSecond.getFullYear();
          let monthSecond = dateSecond.getMonth() + 1;
          let daySecond = dateSecond.getDate() + 1;
          if (monthSecond < 10) {
            monthSecond = "0" + monthSecond;
          }
          if (daySecond < 10) {
            daySecond = "0" + daySecond;
          }
          this.correctionStartTime =
            yearSecond + "-" + monthSecond + "-" + daySecond;
            
        } else {
          // this.startTimeStamp = startTimeStamp;
          this.correctionStartTime = this.startTime
        }
      }
      let data = await insEmpProduct(planId);
      if (data.code === 200) {
        this.yearCost = data.data.yeeFee;
      }
      // 计算天保费保留7位小数
      this.dayNum = Number(this.yearCost / this.yearDayNum).toFixed(7);
      // 计算天数差
      let dayNum = this.dateDiff(this.correctionStartTime, this.endTime);
      // 计算展示的天保费
      this.showDayNum = (dayNum * this.dayNum).toFixed(2);
    },
    // 获取工种信息
    getJobCode(val, index) {
      // console.log(val, index);
      this.form.insEmpApplyUsers[index].jobCode = val.code;
      this.form.insEmpApplyUsers[index].jobName = val.name;
    },
    // 是否开票
    isInvoice(val) {},
    // 获取选择发票id
    gitInvoiceId(val) {
      // console.log(val);
      this.ruleForm.invoiceId = val;
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
        // console.log(xhrData);
        if (xhrData.code === 200) {
          this.wholeDataL = xhrData.rows;
          this.wholeDataL.forEach(item => {
            // 专票
            if (item.type == "1") {
              this.specialData.push({
                title: item.title,
                id: item.id
              });
            }
            // 普票
            else if (item.type == "2") {
              this.ordinaryData.push({
                title: item.title,
                id: item.id
              });
            }
          });
        }
      });
    },
    // 获取发票类型
    getInvoiceType(val) {
      // 专票类型
      if (val == "1") {
        // 显示专票可选
        this.speciaAndOrdinary = true;
      }
      // 普票类型
      else if (val == "2") {
        // 否则反向
        this.speciaAndOrdinary = false;
      }
    },
    // 项目名称触发
    getProject(val, index) {
      // console.log(val, index);
      this.form.insEmpApplyUsers[index].projectId = val.id;
      if (val.remark == "物业用户") {
        this.form.insEmpApplyUsers[index].projectType = "0";
      } else {
        this.form.insEmpApplyUsers[index].projectType = "1";
      }
    },
    //
    getSelectionType(val) {
      // type2
      if (val == "Y") {
        this.isAdditional = true;
        this.type1 = true;
        this.type2 = true;
      } else {
        this.isAdditional = false;
        this.type1 = false;
        this.type2 = false;
      }
    },
    // 获取物业公司信息
    getCompany() {
      getPropCompany().then(xhrData => {
        if (xhrData.code === 200) {
          this.companyName = xhrData.data.name;
          this.WYBalance = xhrData.data.balance.toFixed(2);
        }
      });
    },
    // 获取物业公司信息与项目公司信息
    async getProjectList() {
      const _this = this;
      const page = {
        pageNum: 1,
        pageSize: 99999
      };
      const userResp = await getPropCompany();
      const reposResp = await getProjectRoleList(page);
      if (userResp.code === 200) {
        let arr1 = [];
        arr1.push(userResp.data);
        _this.projectData[0] = {
          name: "物业账户",
          arr: arr1
        };
      }
      if (reposResp.code === 200) {
        _this.projectData[1] = {
          name: "项目账户",
          arr: reposResp.rows
        };
      }
      this.$forceUpdate();
    },
    // 选择天数
    choiceDay(val) {},
    // 选择月份
    choiceMonth(val) {
      // console.log(val);
    },
    // 投保方案类型 显示对应金额
    showMoney(val) {},
    // 获取保险产品
    getRuleGetProduct() {
      const data = {
        insType: "2"
      };
      insRuleGetProduct(data).then(xhrData => {
        // console.log(xhrData, "保险");
        if (xhrData.code == 200) {
          // 保险公司名称
          this.productData.insCompanyName = xhrData.data.insCompanyName;
          // 保险公司id
          this.insCompId = xhrData.data.insCompanyId;
          // 国寿无 附加险
          if (xhrData.data.insCompanyProductCode == "CNGC") {
            this.isInsurance = true;
            this.type1 = false;
            this.type2 = false;
          } else {
            this.isInsurance = false;
            this.type1 = true;
            this.type2 = true;
          }
        }
      });
    },
    // 新增被保险人信息
    addInsurance() {
      this.form.insEmpApplyUsers.push({
        // 被保险人
        name: "",
        // 身份证
        idCard: "",
        // 手机号
        phone: "",
        // 所属职业
        jobCodeItem: "",
        // 项目名称
        projectItem: "",
        // 工种名字
        jobName: "",
        // 工种code
        jobCode: "",
        //
        startTime: ""
      });
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
      const _this = this;
      // 多个保险人信息赋值到请求表单
      this.ruleForm.insEmpApplyUsers = this.form.insEmpApplyUsers;
      // correctionStartTime
      // console.log(this.ruleForm.insEmpApplyUsers);
      this.ruleForm.insEmpApplyUsers.forEach(item => {
        item.startTime = this.correctionStartTime + " 00:00:00";
      });
      // console.log(this.ruleForm);
      const data = {
        id: this.obj2.applyId, // 主键id
        invoiceId: this.ruleForm.invoiceId, // 发票id
        payProjectId: this.payProjectId, // 扣费项目,可能是物业公司也可能是项目
        payProjectType: this.payProjectType, // 扣费类型，0：物业公司 1：项目
        insEmpApplyDetailList: this.ruleForm.insEmpApplyUsers
      };
      // console.log(this.isSocialSecurity2);
      // 选择 不开票
      if (!this.isSocialSecurity2) {
        data.invoiceId = null;
      }

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
        // console.log(data, "data");
        // 开启加载动画
        const loading = this.$loading({
          lock: true,
          text: "申报中，请等待...",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        // 请求 提交
        insEmpApplyNew(data)
          .then(xhrData => {
            // console.log(xhrData);
            if (xhrData.code === 200) {
              // 提交成功 关闭加载动画
              loading.close();
              // 提示
              this.$message.success("申报成功！");
              // 清空表单
              this.form.insEmpApplyUsers.forEach((ele, index) => {
                _this.$refs["form"][index].resetFields();
              });
              // 跳转到保单管理页面
              this.$emit("changePage2", "LIST");
              // setTimeout(()=>{
              // this.$router.push({ name: "EmployerInsurance" });
              // },500)
            }
          })
          .catch(() => {
            // 请求失败 关闭加载动画
            loading.close();
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
      // aDate = sDate1.split("-");
      // oDate1 = new Date(aDate[1] + "-" + aDate[2] + "-" + aDate[0]); //转换为9-25-2017格式
      // aDate = sDate2.split("-");
      // oDate2 = new Date(aDate[1] + "-" + aDate[2] + "-" + aDate[0]);
      // console.log((oDate1 - oDate2),'123');
      let sDateOne = new Date(sDate1);
      let sDateTwo = new Date(sDate2);
      let sDate1TimeStamp = sDateOne.getTime(sDateOne);
      let sDate2TimeStamp = sDateTwo.getTime(sDateTwo);
      iDays = parseInt(Math.abs(sDate1TimeStamp - sDate2TimeStamp) / 1000 / 60 / 60 / 24); //把相差的毫秒数转换为天数
      // iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24); //把相差的毫秒数转换为天数
      // console.log(iDays);
      
      return iDays;
    },
    // 选择项目
    choice(item) {
      // console.log(item);
      this.payProjectId = item.id;
      if (item.remark == "物业用户") {
        this.payProjectType = "0";
      } else {
        this.payProjectType = "1";
      }
    },
    // 下载模板按钮
    handleExport() {},
    // 上传
    handleChange(file, fileList) {},
    // 上传文件关闭按钮
    onRemove() {
      // 清空表格
      this.formdataArr = [];
    },
    // 返回按钮
    btnchReturn() {
      this.$emit("changePage2", "LIST");
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
    },
    // 还原信息
    reduction() {
      this.form = {
        insEmpApplyUsers: [
          {
            // 被保险人
            name: "",
            // 身份证
            idCard: "",
            // 手机号
            phone: "",
            // 工种
            jobCodeItem: "",
            // 项目名称
            projectItem: "",
            // 工种名字
            jobName: "",
            // 工种code
            jobCode: "",
            //
            startTime: ""
          }
        ]
      };
    },
    // 处理时间选择范围
    disabledDate() {
      let _this = this;
      return {
        disabledDate(date) {
          return (
            date.getTime() <= _this.startTimeStamp - 8.64e7 ||
            date.getTime() >= _this.endTimeStamp - 8.64e7
            // date.getTime() >= _this.startTimeStamp  + (30 * 24 * 3600 * 1000)
          );
        }
      };
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
  width: 50px !important;
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
  border: 1px solid rgb(173, 173, 173);
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
.declare-top h4 {
  padding-bottom: 15px;
}
</style>
<style lang="scss" scoped>
.declare {
  //   width: 100%;
  //   padding: 15px;
  //   min-height: calc(88vh);
  //   box-sizing: border-box;
  //   background-color: #e6e8eb;
  //   padding-bottom: 30px;
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
      color: #da242a;
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
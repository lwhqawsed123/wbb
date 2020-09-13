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
                  @change="showMoney"
                  :disabled="isShowDay"
                  v-model="ruleForm.code"
                  label="PLAN_ONE"
                >{{value}}</el-radio>
              </th>
              <th style="width:20%;">
                <el-radio
                  @change="showMoney"
                  :disabled="isShowDay"
                  v-model="ruleForm.code"
                  label="PLAN_TWO"
                >{{value}}</el-radio>
              </th>
              <th style="width:20%;">
                <el-radio @change="showMoney" v-model="ruleForm.code" label="PLAN_THREE">{{value}}</el-radio>
              </th>
              <th style="width:20%;">
                <el-radio
                  @change="showMoney"
                  :disabled="isShowDay"
                  v-model="ruleForm.code"
                  label="PLAN_FOUR"
                >{{value}}</el-radio>
              </th>
              <!-- 富德B款 没有↓这个方案 -->
              <!-- <th v-if="!isProgramme" style="width:20%;">
                <el-radio @change="showMoney" :disabled="isShowDay" v-model="ruleForm.code" label="PLAN_FOUR">{{value}}</el-radio>
              </th>-->
            </tr>
            <tr style="height: 50px;font-size:13px;line-height: 20px;color:#646464">
              <td>死亡伤残</td>
              <td>70万</td>
              <td>70万</td>
              <td>50万</td>
              <td>50万</td>
              <!-- <td v-if="!isProgramme">50万</td> -->
            </tr>
            <tr style="height: 50px;font-size:13px;line-height: 20px;color:#646464">
              <td>意外医疗</td>
              <td>2万</td>
              <td>4万</td>
              <td>2万</td>
              <td>4万</td>
              <!-- <td v-if="!isProgramme">4万</td> -->
            </tr>
            <tr style="height: 50px;font-size:13px;line-height: 20px;color:#646464">
              <td>住院津贴</td>
              <td :colspan="4">100元/天，最多60天</td>
              <!-- <td :colspan="!isProgramme ? '4':'3'">100元/天，最多60天</td> -->
            </tr>
            <tr style="height: 50px;font-size:13px;line-height: 20px;color:#646464">
              <td>误工费</td>
              <td :colspan="4">100元/天，免赔5天，最多180天</td>
              <!-- <td :colspan="!isProgramme ? '4':'3'">100元/天，免赔5天，最多180天</td> -->
            </tr>
          </table>
        </div>
        <div v-if="!isInsurance" v-show="isAdditional" class="type-box">
          <el-radio v-model="type1" :label="type1" @change="switchUpgrade">伤残赔付特约（伤残赔付比例按等比赔付） / 年</el-radio>
        </div>
        <div v-if="!isInsurance" v-show="isAdditional" class="type-box">
          <el-radio
            v-model="type2"
            :label="type2"
            @change="switchUpgrade2"
          >扩展24小时（死亡伤残10万意外医疗1万） / 年</el-radio>
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
            <el-radio :disabled="!allowData.allowYear" class="declare-radio" label="Y">
              <span class="declare-spanO">按年</span>
              <!-- <span>次日生效，保险截至日期生效日+365天</span> -->
              <el-date-picker
                :disabled="!allowData.allowYear"
                :picker-options="pickerOptions2"
                v-model="selectionType.nian"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
              ></el-date-picker>
              <span class="declare-span1">每人 {{exhibition.yearMoney}} 元</span>
            </el-radio>
            <el-radio :disabled="!allowData.allowMonth" class="declare-radio" label="M">
              <span class="declare-spanO">按月</span>
              <span>次日零时生效，保障周期按月统计</span>
              <el-form-item style="display: inline-block;margin-left:-100px;margin-bottom:0;">
                <el-select
                  :disabled="!allowData.allowMonth"
                  @change="choiceMonth"
                  v-model="selectionType.month"
                  placeholder="请选择月份"
                >
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
            <el-radio v-if="allowData.allowDay" class="declare-radio" label="D">
              <span class="declare-spanO">按日</span>
              <!-- <el-date-picker
              :disabled="allowData.allowDay"
                v-model="selectionType.data"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptions"
                @change="choiceDay"
              ></el-date-picker>-->
              <el-date-picker
                @change="getstartTime"
                :picker-options="pickerOptions1"
                v-model="startTime"
                type="date"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期"
              ></el-date-picker>
              <span>至</span>
              <el-date-picker
                @change="getEndTime"
                :picker-options="pickerOptions3"
                v-model="endTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
              ></el-date-picker>
              <span class="declare-span1">每人 {{exhibition.dayMoney}} 元</span>
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
          <el-form-item id="currentBalance" label="当前余额">
            <el-input  disabled v-model="currentBalance"></el-input>
          </el-form-item>
          <el-form-item label="是否开票" v-if="isShowInvoice">
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
        <!-- 被保人信息 -->
        <div>
          <div class="declare-top">
            <h4>
              雇员信息
              <p
                v-if="!isShowDay"
                style="color:#da242a;font-size:14px;margin-left:30px;display: inline-block"
              >最低五人起投保</p>
              <p
                v-if="isShowDay"
                style="color:#da242a;font-size:14px;margin-left:30px;display: inline-block"
              >仅承保临时雇佣人员及到家服务</p>
            </h4>
          </div>
          <div v-if="!optionTow" class="batchData">
            <!-- <el-table :data="formdataArr" border style="width: 50%">
              <el-table-column type="index" label="序号" width="50"></el-table-column>
              <el-table-column prop="name" label="雇员姓名" min-width="30%"></el-table-column>
              <el-table-column prop="idCard" label="身份证" min-width="40%"></el-table-column>
              <el-table-column prop="phone" label="手机号" min-width="30%"></el-table-column>
            </el-table>-->
            <el-table
              max-height="500px"
              :data="formdataArr.slice((currentPage-1)*pagesize,currentPage*pagesize)"
              border
              style="width: 1151px"
            >
              <el-table-column type="index" label="序号" width="60"></el-table-column>
              <el-table-column prop="name" label="项目名称" width="300px">
                <template slot-scope="scope">
                  <el-select
                    style="width:100%"
                    @change="optionArr($event,scope.$index)"
                    value-key="name"
                    v-model="scope.row.project"
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
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip prop="name" label="雇员姓名" width="100px"></el-table-column>
              <el-table-column show-overflow-tooltip prop="idCard" label="身份证" width="200px"></el-table-column>
              <el-table-column show-overflow-tooltip prop="phone" label="手机号" width="200px"></el-table-column>
              <el-table-column show-overflow-tooltip prop="jobCode" label="工种" min-width="200px">
                <template slot-scope="scope">
                  <el-select
                    value-key="name"
                    @change="getJobCode2($event,scope.$index)"
                    style="width:100%"
                    v-model="scope.row.jobCodeItem"
                  >
                    <el-option
                      v-for="(item,index) in Typework"
                      :label="item.name"
                      :value="item"
                      :key="index"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <el-pagination
              style="position: static;"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[100]"
              :page-size="pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="parseInt(total)"
            ></el-pagination>
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
                  <el-button v-if="index == 0" style="visibility: hidden;">删除</el-button>
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
              </el-form>
            </div>
            <div class="addInsuranceBtn">
              <el-button @click="addInsurance">新增被保险人</el-button>
            </div>
          </div>
        </div>
        <div class="declare-btn-wrap">
          <el-button
            :disabled="isDisabledBtn"
            v-if="optionTow"
            ref="disabledBtn"
            class="declare-btn btn1"
            @click="submitForm('ruleForm')"
            v-hasPermi="['ins:emp:add']"
          >申报</el-button>
          <el-button
            v-hasPermi="['ins:emp:add']"
            :disabled="isDisabledBtn"
            v-if="batchApplyShow"
            class="declare-btn"
            @click="batchApply"
          >批量申报</el-button>

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
          <!-- <el-table-column v-if="!isProgramme" prop="programme4" label="方案四" min-width="20%"></el-table-column> -->
        </el-table>
      </div>
      <h3 style="padding:15px 0">保险条款</h3>
      <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 10}" v-model="insuranceClause"></el-input>
      <h3 style="padding:15px 0">附加条款</h3>
      <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 5}" v-model="additionalClause"></el-input>
      <h3 style="padding:15px 0">个人法律服务内容</h3>
      <el-input type="textarea" :autosize="{ maxRows: 15}" v-model="personalClause"></el-input>
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
  insEmpApplyAllowChoice,
  insEmpApplyImport,
  insEmpApplyAllowDayTime
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
import { employeeAddClause, employeeClause,personalLaw } from "@/validate/programme";
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
      //
      currentPage:1,
      //
      pagesize:100,
      //
      total:0,
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
      // type1: false, // 默认升级  // 2020-3-27占时位false
      // 对话框
      dialogTableVisible: false,
      // 选择批量时候
      optionTow: true,
      // 批量申报按钮显示控制
      batchApplyShow: true,
      // 文件上传
      fileList: [],
      // 控制时间控件在第二天起 只能选择30天
      pickerOptions: {
        disabledDate(time) {
          let curDate = new Date().getTime();
          let three = 31 * 24 * 3600 * 1000;
          let threeMonths = curDate + three;
          return (
            time.getTime() < Date.now() - 8.64e7 || time.getTime() > threeMonths
          ); // 当天可投
          // return time.getTime() < Date.now() || time.getTime() > threeMonths; // 次日可投
        }
      },
      pickerOptions2: {
        disabledDate(time) {
          let curDate = new Date().getTime();
          let three = 2 * 31 * 24 * 3600 * 1000;
          let threeMonths = curDate + three;
          // return time.getTime() < Date.now() - 8.64e7 || time.getTime() > threeMonths; // 当天可投
          return time.getTime() < Date.now() || time.getTime() > threeMonths; // 次日可投
        }
      },
      pickerOptions1: {
        disabledDate(time) {
          let curDate = new Date().getTime();
          let three = 2 * 31 * 24 * 3600 * 1000;
          let threeMonths = curDate + three;
          // return time.getTime() < Date.now() - 8.64e7 || time.getTime() > threeMonths; // 当天可投
          return time.getTime() < Date.now() || time.getTime() > threeMonths; // 次日可投
          // return time.getTime() >= Date.now() ;
        }
      },
      pickerOptions3: this.disabledDate3(),
      // 显示在页面
      exhibition: {
        // 年金额
        yearMoney: "",
        // 月金额
        monthMoney: "",
        // 日金额
        dayMoney: ""
      },
      // 保险公司金额保存
      insMoney: {
        PLAN_ONE: {
          yeeFee: "",
          monthFee: "",
          dayFee: ""
        },
        PLAN_TWO: {
          yeeFee: "",
          monthFee: "",
          dayFee: ""
        },
        PLAN_THREE: {
          yeeFee: "",
          monthFee: "",
          dayFee: ""
        },
        PLAN_FOUR: {
          yeeFee: "",
          monthFee: "",
          dayFee: ""
        }
      },
      // 附加险费用
      additional: {
        // 团体意外
        accidentMoney: "",
        // 伤残赔付特约
        disabilityMoney: ""
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
        code: "PLAN_ONE",
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
            "5、如附加24小时全天意外保障条款(每人赔偿限额:死亡伤残10万,意外医疗1万)。"
          // "5、如附加24小时全天意外保障条款(每人赔偿限额:死亡伤残10万,意外医疗1万),年保费增加60元/人。"
        },
        {
          type: "6、特约伤残等级赔付从10级10%,9级20%,以此类推。"
          // "6、特约伤残等级赔付从10级10%,9级20%,以此类推,年保费增加20元/人。"
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
            jobCode: ""
          }
        ]
      },
      // 表单验证
      rules: {
        // 雇员姓名
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
      // 保存可选择年或月或日
      allowData: {
        allowMonth: Boolean,
        allowYear: Boolean,
        allowDay: Boolean
      },
      // 申报按钮是否可按
      isBtn: false,
      // 范围开始时间
      startTime: "",
      // 范围结束时间
      endTime: "",
      // 保存 投保规则时间段内可投保时间戳开始
      startTimeStamp: "",
      // 保存 投保规则时间段内可投保时间戳结束
      endTimeStamp: "",
      getStartTime: "",
      getendTime: "",
      // 展示富德方案
      isProgramme: false,
      // 国寿财不展示附加险
      isInsurance: false,
      //
      isShowDay: false,
      // 是否显示开票
      isShowInvoice: true,
      // 未分配保险公司
      isDisabledBtn: false,
      // 展示当前余额
      currentBalance:''
    };
  },
  created() {
    this.additionalClause = employeeAddClause();
    this.insuranceClause = employeeClause();
    this.personalClause = personalLaw();
    this.getCompany();
    this.getProjectList();
    this.getInvoiceList();
    this.getRuleGetProduct();
    // 获取工种类型
    propJobsList().then(xhrData => {
      if (xhrData.code === 200) {
        this.Typework = xhrData.rows;
      }
    });
    // 判断日期是否可以选择年或月或日
    insEmpApplyAllowChoice().then(xhrData => {
      // console.log(xhrData, "规则");
      if (xhrData.code === 200) {
        this.allowData = xhrData.data;
        if (
          this.allowData.allowDay &&
          this.allowData.allowMonth &&
          this.allowData.allowYear
        ) {
          this.isBtn = true;
        }
      }
    });
  },
  methods: {
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
    // 保障周期
    getSelectionType(val) {
      this.isShowInvoice = true;
      this.isSocialSecurity2 = true;
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
      if (val == "D") {
        this.isShowDay = true;
        this.isShowInvoice = false;
        this.ruleForm.code = "PLAN_THREE";
        this.isSocialSecurity2 = false;
        this.exhibition.yearMoney =
          Number(this.insMoney.PLAN_THREE.yeeFee) +
          Number(this.additional.accidentMoney) +
          Number(this.additional.disabilityMoney);
        this.exhibition.monthMoney = Number(this.insMoney.PLAN_THREE.monthFee);
        this.exhibition.dayMoney = Number(this.insMoney.PLAN_THREE.dayFee);
      } else {
        this.isShowDay = false;
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
      let monthMoney = "";
      if (this.ruleForm.code == "PLAN_ONE") {
        monthMoney = Number(val) * Number(this.insMoney.PLAN_ONE.monthFee);
      } else if (this.ruleForm.code == "PLAN_TWO") {
        monthMoney = Number(val) * Number(this.insMoney.PLAN_TWO.monthFee);
      } else if (this.ruleForm.code == "PLAN_THREE") {
        monthMoney = Number(val) * Number(this.insMoney.PLAN_THREE.monthFee);
      } else if (this.ruleForm.code == "PLAN_FOUR") {
        monthMoney = Number(val) * Number(this.insMoney.PLAN_FOUR.monthFee);
      }
      this.exhibition.monthMoney = monthMoney;
    },
    // 投保方案类型 显示对应金额
    showMoney(val) {
      this.selectionType.month = "";
      this.startTime = "";
      this.endTime = "";
      // 方案1
      if (val == "PLAN_ONE") {
        this.exhibition.yearMoney =
          Number(this.insMoney.PLAN_ONE.yeeFee) +
          Number(this.additional.accidentMoney) +
          Number(this.additional.disabilityMoney);
        this.exhibition.monthMoney = Number(this.insMoney.PLAN_ONE.monthFee);
        this.exhibition.dayMoney = Number(this.insMoney.PLAN_ONE.dayFee);
      } else if (val == "PLAN_TWO") {
        this.exhibition.yearMoney =
          Number(this.insMoney.PLAN_TWO.yeeFee) +
          Number(this.additional.accidentMoney) +
          Number(this.additional.disabilityMoney);
        this.exhibition.monthMoney = Number(this.insMoney.PLAN_TWO.monthFee);
        this.exhibition.dayMoney = Number(this.insMoney.PLAN_TWO.dayFee);
      } else if (val == "PLAN_THREE") {
        this.exhibition.yearMoney =
          Number(this.insMoney.PLAN_THREE.yeeFee) +
          Number(this.additional.accidentMoney) +
          Number(this.additional.disabilityMoney);
        this.exhibition.monthMoney = Number(this.insMoney.PLAN_THREE.monthFee);
        this.exhibition.dayMoney = Number(this.insMoney.PLAN_THREE.dayFee);
      } else if (val == "PLAN_FOUR") {
        this.exhibition.yearMoney =
          Number(this.insMoney.PLAN_FOUR.yeeFee) +
          Number(this.additional.accidentMoney) +
          Number(this.additional.disabilityMoney);
        this.exhibition.monthMoney = Number(this.insMoney.PLAN_FOUR.monthFee);
        this.exhibition.dayMoney = Number(this.insMoney.PLAN_FOUR.dayFee);
      }
    },
    // 获取保险产品
    getRuleGetProduct() {
      const data = {
        insType: "2"
      };
      insRuleGetProduct(data)
        .then(xhrData => {
          // console.log(xhrData, "保险");
          if (xhrData.code == 200) {
            this.isDisabledBtn = false;
            // 保险公司名称
            this.productData.insCompanyName = xhrData.data.insCompanyName;
            // 保险公司id
            this.insCompId = xhrData.data.insCompanyId;
            let productList = xhrData.data.productList;
            let insEmpProductAdditionalList =
              xhrData.data.insEmpProductAdditionalList;
            // 方案1 年,月，日费用
            this.insMoney.PLAN_ONE.yeeFee = productList[0].yeeFee;
            this.insMoney.PLAN_ONE.monthFee = productList[0].monthFee;
            this.insMoney.PLAN_ONE.dayFee = productList[0].dayFee;
            // 默认方案1
            this.exhibition.yearMoney = this.insMoney.PLAN_ONE.yeeFee;
            this.exhibition.monthMoney = this.insMoney.PLAN_ONE.monthFee;
            this.exhibition.dayMoney = this.insMoney.PLAN_ONE.dayFee;
            // 方案2 年，月，日费用
            this.insMoney.PLAN_TWO.yeeFee = productList[1].yeeFee;
            this.insMoney.PLAN_TWO.monthFee = productList[1].monthFee;
            this.insMoney.PLAN_TWO.dayFee = productList[1].dayFee;
            // 方案3 年，月，日费用
            this.insMoney.PLAN_THREE.yeeFee = productList[2].yeeFee;
            this.insMoney.PLAN_THREE.monthFee = productList[2].monthFee;
            this.insMoney.PLAN_THREE.dayFee = productList[2].dayFee;
            // 判断保险公司规则   富德无50万4万方案
            if (xhrData.data.insCompanyProductCode == "CNFD") {
              this.isProgramme = true;
              // 团体意外价格
              this.additional.accidentMoney =
                insEmpProductAdditionalList[0].yearFee;
              // 伤残赔付价格
              this.additional.disabilityMoney =
                insEmpProductAdditionalList[1].yearFee;
              //
              this.exhibition.yearMoney =
                this.insMoney.PLAN_ONE.yeeFee +
                this.additional.accidentMoney +
                this.additional.disabilityMoney;
            } else {
              this.isProgramme = false;
            }
            // 国寿无 附加险
            if (xhrData.data.insCompanyProductCode == "CNGC") {
              this.isInsurance = true;
              this.type1 = false;
              this.type2 = false;
              // 方案4 年，月，日费用
              this.insMoney.PLAN_FOUR.yeeFee = productList[3].yeeFee;
              this.insMoney.PLAN_FOUR.monthFee = productList[3].monthFee;
              this.insMoney.PLAN_FOUR.dayFee = productList[3].dayFee;
            } else {
              this.isInsurance = false;
              this.type1 = true;
              this.type2 = true;
            }
            // console.log(this.insMoney);
          }
        })
        .catch(() => {
          // console.log('无承保公司');
          // 未分配保险公司 禁止操作
          this.isDisabledBtn = true;
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
        jobCode: ""
      });
    },
    // 是否开票
    switchUpgrade(val) {
      // console.log(val);
    },
    // 扩展24小时
    switchUpgrade2(val) {
      // console.log(val);
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
      // console.log(this.form.insEmpApplyUsers.length);
      if (!this.isShowDay) {
        if (this.form.insEmpApplyUsers.length < 5) {
          this.$message.warning({
            message: "最低五人起投保"
          });
          return;
        }
      }
      // 判断选择的保障周期
      this.ruleForm.periodUnit = this.selectionType.label;
      if (this.payProjectId == "") {
        this.$message.warning({
          message: "请选择扣费项目"
        });
        return;
      }
      if (this.isSocialSecurity2) {
        if (this.ruleForm.invoiceId == "") {
          this.$message.warning({
            message: "请选择发票"
          });
          return;
        }
      }
      // 选择年
      if (this.selectionType.label == "Y") {
        if (
          this.selectionType.nian == undefined ||
          this.selectionType.nian == ""
        ) {
          this.$message.warning({
            message: "请选择年日期"
          });
          return;
        } else {
          this.ruleForm.period = "0";
          this.ruleForm.endTime = null;
          this.ruleForm.startTime = this.selectionType.nian + " 00:00:00";
        }
      } else if (this.selectionType.label == "M") {
        // 判断选择了按月时候 是否选择了月份
        if (this.selectionType.month == "") {
          this.$message.warning({
            message: "请选择月数"
          });
          return;
        } else {
          this.ruleForm.period = this.selectionType.month;
          this.ruleForm.startTime = null;
          this.ruleForm.endTime = null;
        }
      } else if (this.selectionType.label == "D") {
        if (this.startTime == "" || this.endTime == "") {
          this.$message.warning({
            message: "请选择天数"
          });
          return;
        } else {
          this.ruleForm.period = "0";
          this.ruleForm.startTime = this.getStartTime;
          this.ruleForm.endTime = this.getendTime;
        }
      }
      if (this.insEmpApplyUsers != undefined) {
        this.ruleForm.insEmpApplyUsers.push(this.insEmpApplyUsers);
      }
      // 多个保险人信息赋值到请求表单
      this.ruleForm.insEmpApplyUsers = this.form.insEmpApplyUsers;
      // console.log(this.ruleForm);
      const data = {
        invoiceId: this.ruleForm.invoiceId, // 发票id
        cycle: this.ruleForm.periodUnit, // Y年M月D日
        insCompId: this.insCompId, // 保险公司id // 先默认
        isExpand: this.type2 ? "1" : "0", // 是否扩展24小时 0：否 1：是
        isHurtPay: this.type1 ? "1" : "0", // 伤残赔付特约 0：否 1：是
        monthNum: this.ruleForm.period, // 月数
        payProjectId: this.payProjectId, // 扣费项目,可能是物业公司也可能是项目
        payProjectType: this.payProjectType, // 扣费类型，0：物业公司 1：项目
        planCode: this.ruleForm.code, // 方案代码
        startTime: this.ruleForm.startTime, // 投保开始时间
        endTime: this.ruleForm.endTime, // 投保结束时间
        insEmpApplyDetailList: this.ruleForm.insEmpApplyUsers // 投保人明细
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
        insEmpApply(data)
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
              // setTimeout(()=>{
              this.$router.push({ name: "EmployerInsurance" });
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
      // iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24); //把相差的毫秒数转换为天数
      let sDateOne = new Date(sDate1);
      let sDateTwo = new Date(sDate2);
      let sDate1TimeStamp = sDateOne.getTime(sDateOne);
      let sDate2TimeStamp = sDateTwo.getTime(sDateTwo);
      iDays = parseInt(
        Math.abs(sDate1TimeStamp - sDate2TimeStamp) / 1000 / 60 / 60 / 24
      ); //把相差的毫秒数转换为天数
      return iDays;
    },
    // 选择项目
    choice(item) {
      // console.log(item);
      this.currentBalance = item.balance + '元'
      this.payProjectId = item.id;
      if (item.remark == "物业用户") {
        this.payProjectType = "0";
      } else {
        this.payProjectType = "1";
      }
    },
    // 选择日 开始时间
    getstartTime(val) {
      // console.log(val);
      this.endTime = "";
      let startTime = new Date(val);
      let startTimeStamp = startTime.getTime(startTime);
      this.startTimeStamp = startTimeStamp;
      if (val == null) {
        this.endTime = "";
      }
      this.getStartTime = val;
      this.ruleForm.startTime = this.getStartTime;
    },
    // 选择日 结束时间
    getEndTime(val) {
      if (val == null) {
        this.exhibition.dayMoney = 0;
        return;
      }
      this.getendTime = val + " 23:59:59";
      this.ruleForm.endTime = this.getendTime;
      // console.log(this.ruleForm.startTime,this.ruleForm.endTime);
      const data = {
        startTime: this.ruleForm.startTime,
        endTime: this.ruleForm.endTime
      };
      insEmpApplyAllowDayTime(data)
        .then(xhrData => {
          if (xhrData.code === 200) {
            let startTime = data.startTime.split(" ")[0];
            let endTime = data.endTime.split(" ")[0];
            let day = Number(this.dateDiff(startTime, endTime)) + 1;
            let dayMoney = "";
            if (this.ruleForm.code == "PLAN_ONE") {
              dayMoney = Number(this.insMoney.PLAN_ONE.dayFee);
            } else if (this.ruleForm.code == "PLAN_TWO") {
              dayMoney = Number(this.insMoney.PLAN_TWO.dayFee);
            } else if (this.ruleForm.code == "PLAN_THREE") {
              dayMoney = Number(this.insMoney.PLAN_THREE.dayFee);
            } else if (this.ruleForm.code == "PLAN_FOUR") {
              dayMoney = Number(this.insMoney.PLAN_FOUR.dayFee);
            }
            this.exhibition.dayMoney = dayMoney * day;
          }
        })
        .catch(() => {
          this.startTime = "";
          this.endTime = "";
        });
    },
    // 规则时间控件在第一次选择之后时间段内选择
    disabledDate3() {
      let _this = this;
      return {
        disabledDate(date) {
          return (
            // date.getTime() <= _this.startTimeStamp - 8.64e7 ||
            date.getTime() <= _this.startTimeStamp ||
            date.getTime() >= _this.startTimeStamp + 30 * 24 * 3600 * 1000
          );
        }
      };
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
       const loading = this.$loading({
          lock: true,
          text: '上传中，请等待...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
      insEmpApplyImport(param).then(xhrData => {
        let arr1 = [];
        let arr2 = [];
        if (xhrData.code === 200) {
          this.formdataArr = xhrData.data;
          this.total = this.formdataArr.length
          this.formdataArr.forEach((item, index) => {
            arr1.push({
              name: item.projectName,
              id: item.projectId,
              remark: item.projectType == "0" ? "物业用户" : ""
            });
            arr2.push({
              // name:item.jobName== null ? '保洁':item.name,
              name: item.jobName,
              code: item.jobCode
            });
            // console.log(arr2);

            this.$set(this.formdataArr[index], "project", arr1[index]);
            this.$set(this.formdataArr[index], "jobCodeItem", arr2[index]);
             // 关闭对话框
            loading.close();
          })
        }
      }).catch(()=>{
             // 关闭对话框
            loading.close();
            // 清空上传文件
          this.fileList = [];
          // 清空数据
          this.formdataArr = [];
          })
    },
    // 上传文件关闭按钮
    onRemove() {
      // 清空表格
      this.formdataArr = [];
      this.currentPage= 1
      //
      this.pagesize=100
      //
      this.total=0

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
      this.ruleForm.periodUnit = this.selectionType.label;
      if (this.payProjectId == "") {
        this.$message.warning({
          message: "请选择扣费项目"
        });
        return;
      }
      if (this.isSocialSecurity2) {
        if (this.ruleForm.invoiceId == "") {
          this.$message.warning({
            message: "请选择发票"
          });
          return;
        }
      }
      // 选择年
      if (this.selectionType.label == "Y") {
        if (
          this.selectionType.nian == undefined ||
          this.selectionType.nian == ""
        ) {
          this.$message.warning({
            message: "请选择年日期"
          });
          return;
        } else {
          this.ruleForm.period = "0";
          this.ruleForm.endTime = null;
          this.ruleForm.startTime = this.selectionType.nian + " 00:00:00";
        }
      } else if (this.selectionType.label == "M") {
        // 判断选择了按月时候 是否选择了月份
        if (this.selectionType.month == "") {
          this.$message.warning({
            message: "请选择月数"
          });
          return;
        } else {
          this.ruleForm.period = this.selectionType.month;
          this.ruleForm.startTime = null;
          this.ruleForm.endTime = null;
        }
      } else if (this.selectionType.label == "D") {
        if (this.startTime == "" || this.endTime == "") {
          this.$message.warning({
            message: "请选择天数"
          });
          return;
        } else {
          this.ruleForm.period = "0";
          this.ruleForm.startTime = this.getStartTime;
          this.ruleForm.endTime = this.getendTime;
        }
      }
      if (this.formdataArr.length <= 0) {
        this.$message.warning({
          message: "请上传文件"
        });
        return;
      }
      const insEmpApplyDetailList = [];
      this.formdataArr.forEach(item => {
        insEmpApplyDetailList.push({
          idCard: item.idCard,
          jobCode:
            item.jobFormdataCode == null ? item.jobCode : item.jobFormdataCode,
          name: item.name,
          phone: item.phone,
          projectType: "" + item.projectType,
          projectId:
            item.compProjectId == null ? item.projectId : item.compProjectId
        });
      });
      for (let i = 0; i < insEmpApplyDetailList.length; i++) {
        if (insEmpApplyDetailList[i].projectId == null) {
          this.$message.error({
            message: `第${i + 1}行,项目未选择，请选择后申报！`
          });
          return;
        }
        if (insEmpApplyDetailList[i].jobCode == null) {
          this.$message.error({
            message: `第${i + 1}行,工种未选择，请选择后申报！`
          });
          return;
        }
      }
      // console.log(this.ruleForm);
      const data = {
        invoiceId: this.ruleForm.invoiceId, // 发票id
        cycle: this.ruleForm.periodUnit, // Y年M月D日
        insCompId: this.insCompId, // 保险公司id // 先默认
        isExpand: this.type2 ? "1" : "0", // 是否扩展24小时 0：否 1：是
        isHurtPay: this.type1 ? "1" : "0", // 伤残赔付特约 0：否 1：是
        monthNum: this.ruleForm.period, // 月数
        payProjectId: this.payProjectId, // 扣费项目,可能是物业公司也可能是项目
        payProjectType: this.payProjectType, // 扣费类型，0：物业公司 1：项目
        planCode: this.ruleForm.code, // 方案代码
        startTime: this.ruleForm.startTime, // 投保开始时间
        endTime: this.ruleForm.endTime, // 投保结束时间
        insEmpApplyDetailList // 投保人明细
      };
      // console.log(data,'data');
      // 开启加载动画
      const loading = this.$loading({
        lock: true,
        text: "申报中，请等待...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      // 请求 提交
      insEmpApply(data)
        .then(xhrData => {
          // console.log(xhrData);
          if (xhrData.code === 200) {
            // 提交成功 关闭加载动画
            loading.close();
            // 提示
            this.$message.success("申报成功！");
            // 清空数据
            this.formdataArr = [];
            // 清空上传文件
            this.fileList = [];
            // 跳转到保单管理页面
            // setTimeout(()=>{
            this.$router.push({ name: "EmployerInsurance" });
            // },500)
          }
        })
        .catch(() => {
          // 请求失败 关闭加载动画
          loading.close();
        });
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
            jobCode: ""
          }
        ]
      };
    },
    optionArr(val, index) {
      // console.log(val, index);
      if (val.remark == "物业用户") {
        this.formdataArr[index].projectType = "0";
      } else {
        this.formdataArr[index].projectType = "1";
      }
      this.formdataArr[index].compProjectName = val.name;
      this.formdataArr[index].compProjectId = val.id;
      // console.log(e.target.options.selectedIndex);
      // this.optionProject[index] = val
      // this.formdataArr[index].compProjectId = val
    },
    //
    getJobCode2(val, index) {
      this.formdataArr[index].jobFormdataCode = val.code;
    },
    handleSizeChange(val) {
        this.pagesize = val;
    },
    handleCurrentChange(val) {
        this.currentPage = val;
    },
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
#currentBalance .el-input.is-disabled .el-input__inner{
  width: 300px;
  color: rgb(228, 119, 119);
  font-weight: bold;
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
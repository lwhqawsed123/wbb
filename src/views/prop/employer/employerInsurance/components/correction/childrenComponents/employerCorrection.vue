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
            <span style="margin-left:15px;color:#da242a">当前余额:{{WYBalance | filterBalance}}元</span>
          </p>
          <p>
            <span>承保公司</span>
            <span>{{productData.insCompanyName}}</span>
          </p>
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
                <el-radio disabled v-model="ruleForm.code" label="PLAN_ONE">{{value}}</el-radio>
              </th>
              <th style="width:20%;">
                <el-radio disabled v-model="ruleForm.code" label="PLAN_TWO">{{value}}</el-radio>
              </th>
              <th style="width:20%;">
                <el-radio disabled v-model="ruleForm.code" label="PLAN_THREE">{{value}}</el-radio>
              </th>
              <th style="width:20%;">
                <el-radio disabled v-model="ruleForm.code" label="PLAN_FOUR">{{value}}</el-radio>
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
        <div v-if="!isInsurance" class="type-box">
          <el-checkbox disabled v-model="type1">伤残赔付特约（伤残赔付比例按等比赔付） / 年</el-checkbox>
        </div>
        <div v-if="!isInsurance" class="type-box">
          <el-checkbox disabled v-model="type2">扩展24小时（死亡伤残10万意外医疗1万） / 年</el-checkbox>
        </div>

        <!-- 保障周期 -->
        <div style="padding-bottom:20px">
          <div class="declare-top" style="margin-top:30px;">
            <h4>保障周期</h4>
          </div>
          <el-radio-group v-model="selectionType.label">
            <el-radio disabled class="declare-radio" label="Y">
              <span class="declare-spanO">按年</span>
              <el-date-picker
                v-model="selectionType.startTime"
                disabled
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
              ></el-date-picker>
              <span>至</span>
              <el-date-picker
                v-model="selectionType.endTime"
                disabled
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
              ></el-date-picker>
              <span class="declare-span1">每人 {{yearMoney}} 元</span>
            </el-radio>
          </el-radio-group>
        </div>
        <!-- <div>
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
          </el-form-item>
          <div>
            <el-form-item label="是否开票">
              <el-switch
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
                  placeholder="请选择"
                  v-model="invoiceId2"
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
        </div>-->
      </el-form>
      <!-- 批改列表 -->
      <el-form
        :model="correctionForm"
        ref="correctionForm"
        label-position="left"
        label-width="80px"
        id="correctionForm"
      >
        <el-form-item label="项目名称" class="correctionForm-right">
          <el-input style="width:160px" v-model="correctionForm.name"></el-input>
        </el-form-item>
        <el-form-item label="雇员姓名" class="correctionForm-right">
          <el-input style="width:160px;" v-model="correctionForm.name"></el-input>
        </el-form-item>
        <div class="correctionForm-wrap">
          <el-button type="primary" @click="add">新增员工</el-button>
        </div>
        <div class="correctionForm-wrap">
          <el-button type="warning" @click="reduce">减少员工</el-button>
        </div>
        <div class="correctionForm-wrap">
          <el-button type="danger" @click="delCurrent" :disabled="tableData.length <= 0">删除</el-button>
        </div>
        <div class="correctionForm-wrap">
          <el-button @click="handleExport">批量模板下载</el-button>
        </div>
        <div class="correctionForm-wrap">
          <!-- <el-button type="success">批量新增文件上传</el-button> -->
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
            <el-button type="success">批量新增文件上传</el-button>
            <span style="margin-left:5px" slot="tip" class="el-upload__tip">只能上传 .xls/.xlsx 文件</span>
          </el-upload>
        </div>
      </el-form>
      <!-- 批量列表表格 -->
      <el-table
        @selection-change="handleSelectionChange"
        max-height="400px"
        :data="tableData"
        border
        style="width: 100%;margin-top:15px"
      >
        <el-table-column align="center" type="selection" width="60"></el-table-column>
        <el-table-column prop="compProjectName" label="所属项目" min-width="200px">
          <template slot-scope="scope">
            <el-select
              style="width:100%"
              @change="optionArr($event,scope.$index)"
              value-key="name"
              v-model="scope.row.project"
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
          </template>
        </el-table-column>
        <el-table-column prop="name" label="雇员姓名" min-width="80px"></el-table-column>
        <el-table-column prop="idCard" label="身份证号" min-width="180px"></el-table-column>
        <el-table-column prop="phone" label="手机号" min-width="120px"></el-table-column>
        <el-table-column prop="jobCode" label="工种" min-width="160px">
          <template slot-scope="scope">
            <el-select
              value-key="name"
              @change="getJobCode($event,scope.$index)"
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
        <el-table-column show-overflow-tooltip prop="type" label="批改类型" min-width="100px">
          <template slot-scope="scope">{{handleType(scope.row.type)}}</template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="startTime" label="保单生效日期" min-width="150px"></el-table-column>
        <el-table-column show-overflow-tooltip prop="endTime" label="保单结束日期" min-width="150px"></el-table-column>
      </el-table>
      <div class="declare-btn-wrap">
        <el-button ref="disabledBtn" class="declare-btn btn1" @click="submit">提 交</el-button>
        <el-button class="declare-btn" @click="btnchReturn">返 回</el-button>
      </div>
    </div>
    <!-- 雇主产品介绍 对话框 -->
    <el-dialog id="guarantee-dialog" title="产品介绍" :visible.sync="dialogTableVisible">
      <div class="guarantee-dialog-main">
        <h3 style="padding-bottom:15px">物保宝雇主责任险方案(18岁-70岁)</h3>
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
      <el-input type="textarea" :autosize="{ maxRows: 15}" v-model="personalClause"></el-input>
      <div slot="footer" class="dialog-footer">
        <a href="javascript:;" class="guarantee-btn btn2" @click="dialogTableVisible=false">返 回</a>
      </div>
    </el-dialog>
    <!-- 新增员工 对话框 -->
    <el-dialog
      @closed="closeAdd"
      width="1000px"
      class="seeDialog"
      title="添加雇员信息"
      :visible.sync="dialogTableVisibleAdd"
    >
      <el-form :model="addForm" ref="addForm" label-position="left" id="addForm">
        <div style=" display: flex;justify-content: space-between;">
          <h4>雇员列表</h4>
          <div>
            <el-button
              size="mini"
              @click="delCurrentAdd"
              :disabled="addForm.formdataArr.length <= 0"
            >删除</el-button>
            <el-button type="primary" size="mini" @click="addFormData">添加</el-button>
          </div>
        </div>
        <el-table
          @selection-change="handleSelectionChangeAdd"
          max-height="400px"
          :data="addForm.formdataArr"
          border
          style="width: 100%;margin-top:15px"
        >
          <el-table-column align="center" type="selection" width="60"></el-table-column>
          <el-table-column align="center" prop="projectName" label="所属项目" min-width="200px">
            <template slot-scope="scope">
              <el-form-item
                :prop="'formdataArr.' + scope.$index + '.project'"
                :rules="addForm.rulesTable.project"
              >
                <el-select
                  @change="optionArrAdd($event,scope.$index)"
                  value-key="name"
                  v-model="scope.row.project"
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
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="name"
            label="雇员姓名"
            min-width="100px"
          >
            <template slot-scope="scope">
              <el-form-item
                :prop="'formdataArr.' + scope.$index + '.name'"
                :rules="addForm.rulesTable.name"
              >
                <el-input maxlength="6" v-model.trim="scope.row.name"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="idCard" label="身份证号" min-width="180px">
            <template slot-scope="scope">
              <el-form-item
                :prop="'formdataArr.' + scope.$index + '.idCard'"
                :rules="addForm.rulesTable.idCard"
              >
                <el-input maxlength="18" v-model.trim="scope.row.idCard"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="phone" label="手机号" min-width="120px">
            <template slot-scope="scope">
              <el-form-item
                :prop="'formdataArr.' + scope.$index + '.phone'"
                :rules="addForm.rulesTable.phone"
              >
                <el-input maxlength="11" v-model.trim="scope.row.phone"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="jobCode" label="工种" min-width="160px">
            <template slot-scope="scope">
              <el-form-item
                :prop="'formdataArr.' + scope.$index + '.jobCodeItem'"
                :rules="addForm.rulesTable.jobCodeItem"
              >
                <el-select
                  value-key="name"
                  @change="getJobCodeAdd($event,scope.$index)"
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
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <a href="javascript:;" class="btn btn1" @click="addFormPreserve">保 存</a>
        <a href="javascript:;" class="btn btn2" @click="dialogTableVisibleAdd=false">取 消</a>
      </div>
    </el-dialog>
    <!-- 减少员工 对话框 -->
    <el-dialog
      @closed="closeReduce"
      width="1100px"
      class="seeDialog"
      title="批量减少"
      :visible.sync="dialogTableVisibleReduce"
    >
      <el-form
        @submit.native.prevent
        :model="reduceForm"
        ref="reduceForm"
        label-position="left"
        label-width="80px"
      >
        <el-form-item label="雇员姓名">
          <el-input style="width:220px" @keyup.enter.native="query" v-model="reduceForm.name"></el-input>
          <el-button @click="query">查询</el-button>
        </el-form-item>
        <el-table
          @selection-change="handleSelectionChangeReduce"
          v-loading="reduceLoading"
          max-height="400px"
          :data="reduceData"
          border
          style="width: 100%;margin-top:15px"
        >
          <el-table-column :selectable="reduceCheckbox" type="selection" width="60"></el-table-column>
          <el-table-column show-overflow-tooltip prop="projectName" label="所属项目" min-width="180px"></el-table-column>
          <el-table-column prop="name" label="雇员姓名" min-width="80px"></el-table-column>
          <el-table-column prop="idCard" label="身份证号" min-width="180px"></el-table-column>
          <el-table-column prop="phone" label="手机号" min-width="120px"></el-table-column>
          <el-table-column prop="jobName" label="工种" min-width="140px"></el-table-column>
          <el-table-column show-overflow-tooltip prop="startTime" label="保单生效日期" min-width="130px">
            <template slot-scope="scope">{{scope.row.startTime.split(' ')[0]}}</template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="endTime" label="保单结束日期" min-width="130px">
            <template slot-scope="scope">{{scope.row.endTime.split(' ')[0]}}</template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <a href="javascript:;" class="btn btn1" @click="reduceFormPreserve">保 存</a>
        <a href="javascript:;" class="btn btn2" @click="dialogTableVisibleReduce=false">取 消</a>
      </div>
    </el-dialog>
    <!-- 提交订单 -->
    <el-dialog
      @closed="closeOrder"
      width="550px"
      id="orderDialog"
      class="seeDialog"
      title="提交订单"
      :visible.sync="dialogTableVisibleOrder"
    >
      <el-form
        @submit.native.prevent
        :model="orderForm"
        ref="orderForm"
        label-position="left"
        label-width="100px"
      >
        <div>
          <el-form-item label="订单金额">
            <el-input disabled v-model="orderForm.orderCost"></el-input>
          </el-form-item>
          <el-form-item :label="orderAccount">
            <el-select
              style="width:100%"
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
          </el-form-item>
          <el-form-item :label="orderBalance">
            <el-input disabled v-model="orderForm.cost"></el-input>
          </el-form-item>
          <div v-if="isShowInvoice">
            <el-form-item label="是否开票">
              <el-switch
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
                  style="width:100%"
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
                  style="width:100%"
                  placeholder="请选择"
                  v-model="invoiceId2"
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <a href="javascript:;" class="btn btn1" @click="submitFormPreserve">提 交</a>
        <a href="javascript:;" class="btn btn2" @click="dialogTableVisibleOrder=false">取 消</a>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 请求
import {
  getPropCompany,
  getProjectRoleList,
  insRuleGetProduct,
  queryInvoiceList,
  insEmpApplyExportTemplate,
  insEmpApplyImport,
  propJobsList,
  insEmpApplyGetById,
  insEmpReviseReturnAllow,
  insEmpRevise,
  insEmpReviseAgainCommit
} from "@/api/information/information";
// 保险条款
import {
  employeeAddClause,
  employeeClause,
  personalLaw
} from "@/validate/programme";
// 验证
import {
  ShiFanManShiBaSui,
  Identity,
  IdCard,
  IdCard2
} from "@/validate/validate.js";
export default {
  name: "employerInsurance-correction",
  props: ["obj2"],
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
      // 雇主产品介绍 保险条款
      insuranceClause: "",
      // 雇主产品介绍 附加条款
      additionalClause: "",
      // 雇主产品介绍 个人法律服务内容
      personalClause: "",
      // 产品 对话框
      dialogTableVisible: false,
      // 新增员工
      dialogTableVisibleAdd: false,
      // 减少员工
      dialogTableVisibleReduce: false,
      // 提交订单
      dialogTableVisibleOrder: false,
      // 空值
      value: "",
      companyName: "",
      WYBalance: 0,
      // 获取保险品种信息
      productData: {},
      // 保险公司id
      insCompId: "",
      //
      projectData: [],
      //
      ruleForm: {
        code: ""
      },
      //
      type1: true,
      type2: true,
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
      // 工种
      Typework: [],
      //
      projectItem: "",
      // 是否开票 (默认开票)
      isSocialSecurity2: true,
      // 发票类型
      invoiceType: "1",
      // 保存专票类型数据
      specialData: [],
      // 保存普票类型数据
      ordinaryData: [],
      // 专票或普票 (默认专票)
      speciaAndOrdinary: true,
      // 批改列表表单
      correctionForm: {},
      // 批改列表表格
      tableData: [],
      // 保存表格选中数据
      multipleSelection: [],
      // 新增员工 保存表格选中数据
      multipleSelectionAdd: [],
      // 文件上传
      fileList: [],
      // 新增员工
      addForm: {
        // 新增员工
        formdataArr: [],
        // 表单验证
        rulesTable: {
          name: [
            { required: true, message: "请输入雇员姓名", trigger: "bulr" }
          ],
          project: [{ required: true, message: "请选择", trigger: "change" }],
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
          ]
        }
      },
      // 减少员工
      reduceForm: {
        name: ""
      },
      // 减少员工 表格数据
      reduceData: [],
      // 国寿财不展示附加险
      isInsurance: false,
      // 提交订单
      orderForm: {},
      // 保存提交订单数据
      insEmpApplyDetailList: [],
      // 记录批增数量
      addNum: 0,
      // 记录批减数量
      reduceNum: 0,
      // 提交订单账户
      orderAccount: "",
      // 提交订单余额
      orderBalance: "",
      // 是否显示开票
      isShowInvoice: false,
      // 批量减少加载
      reduceLoading: false,
      // 保存批减勾选数据
      reduceTickData: [],
      // 年保费
      yearMoney:'',
      // 批减时候
      isReduce:false,
      // 保存批减金额
      returnPremium:'',
      // 保存列表已存在的index
      existenceIndex:[]
    };
  },
  filters: {
    filterBalance: function(val) {
      return val;
    }
  },
  created() {
    console.log(this.obj2,this.obj2.reviseId);

    this.additionalClause = employeeAddClause();
    this.insuranceClause = employeeClause();
    this.personalClause = personalLaw();
    this.getProjectList();
    this.getInvoiceList();
    this.getBeforeData();
    // 获取工种类型
    propJobsList().then(xhrData => {
      if (xhrData.code === 200) {
        this.Typework = xhrData.rows;
      }
    });
    
  },
  methods: {
    // 获取重新提交信息
    getAgainCommit(){
      // 重新提交获取信息
      insEmpReviseAgainCommit(this.obj2.reviseId).then(xhrData => {
        if (xhrData.code === 200) {
          // console.log(xhrData);
          let arr1 = [];
          let arr2 = [];
          this.tableData = xhrData.data.insEmpApplyDetailList;
          this.tableData.forEach((item, index) => {
              item.startTime = item.startTime.split(' ')[0]
              item.endTime = item.endTime.split(' ')[0]
            arr1.push({
              name: item.projectName,
              id: item.projectId,
              remark: item.projectType == "0" ? "物业用户" : ""
            });
            arr2.push({
              name: item.jobName,
              code: item.jobCode
            });
            this.$set(this.tableData[index], "project", arr1[index]);
            this.$set(this.tableData[index], "jobCodeItem", arr2[index]);
          });
        }
      });
    },
    // 批减查询
    query() {

      let _this = this;
      _this.existenceIndex = []
      const page = {
        applyId: this.obj2.applyId,
        name: this.reduceForm.name
      };
      this.reduceLoading = true;
      insEmpReviseReturnAllow(page).then(xhrData => {
        this.reduceData = xhrData.rows;
        let newArr = [];
        if (xhrData.code === 200) {
          if (_this.tableData.length > 0) {
            this.reduceData.forEach((item1, index1) => {
              _this.tableData.forEach((item2, index2) => {
                if (item1.idCard === item2.idCard) {
                  item1.only = '1'
                }
              });
            });
            
          }
          // this.reduceData = this.getArrDifference(xhrData.rows, this.tableData);
          this.reduceLoading = false;
        }
      });
    },
    // 获取之前申报信息
    getBeforeData() {
      insEmpApplyGetById(this.obj2.applyId).then(xhrData => {
        if (xhrData.code === 200) {
          console.log(xhrData);
          let data = xhrData.data;
          this.ruleForm.code = data.planCode;
          this.selectionType.startTime = data.startTime.split(" ")[0];
          this.selectionType.endTime = data.endTime.split(" ")[0];
          // 年保费
          this.yearMoney = data.insEmpProduct.yeeFee
          // 保险公司名称
          this.productData.insCompanyName = data.insCompName;
          // 国寿无 附加险
          if (data.insCompCode == "CNGC") {
            this.isInsurance = true;
          } else {
            this.isInsurance = false;
          }
        }
      });
    },
    // insEmpApplyGetById
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
        this.companyName = userResp.data.name;
        this.WYBalance = userResp.data.balance.toFixed(2);
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
      if(this.obj2.reviseId != undefined){
        this.getAgainCommit()
      }
      this.$forceUpdate();
    },
    // 返回按钮
    btnchReturn() {
      this.$emit("changePage2", "LIST");
    },
    // 选择项目
    choice(item) {
      console.log(item);
      this.payProjectId = item.id;
      if (item.remark == "物业用户") {
        this.payProjectType = "0";
      } else {
        this.payProjectType = "1";
      }
      if(this.isReduce){
        // console.log(Number(item.balance),Number(this.returnPremium));
        this.orderForm.cost = Number(item.balance) + Number(this.returnPremium) + '元'
      }else{
        this.orderForm.cost = item.balance + " 元";
      }

    },
    // 获取发票类型
    getInvoiceType(val) {
      this.orderForm.invoiceId = null;
      this.invoiceId1 = "";
      this.invoiceId2 = "";
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
    // 获取选择发票id
    gitInvoiceId(val) {
      this.orderForm.invoiceId = val;
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
    // 删除选中列表
    delCurrent() {
      if (this.multipleSelection.length <= 0) return;
      this.$confirm("是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 拿到选中数据
          let val = this.multipleSelection;
          if (val) {
            val.forEach((item1, index1) => {
              this.tableData.forEach((item2, index2) => {
                if (item1 === item2) {
                  this.tableData.splice(index2, 1);
                }
              });
            });
          }
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 表格勾选中的数据
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 批减 表格勾选数据
    handleSelectionChangeReduce(val) {
      // console.log(val);
      this.reduceTickData = val;
    },
    // 新增员工 表格
    handleSelectionChangeAdd(val) {
      this.multipleSelectionAdd = val;
    },
    // 新增员工 删除选中列表
    delCurrentAdd() {
      if(this.multipleSelectionAdd.length <= 0) return
      this.$confirm("是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 拿到选中数据
          let val = this.multipleSelectionAdd;
          if (val) {
            val.forEach((item1, index1) => {
              this.addForm.formdataArr.forEach((item2, index2) => {
                if (item1 === item2) {
                  this.addForm.formdataArr.splice(index2, 1);
                }
              });
            });
          }
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
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
      // 保存保单生效日期
      let startTime = "";
      // 当前时间
      const start1 = new Date(new Date().toLocaleDateString()).getTime();
      //
      let nueStartTime = this.selectionType.startTime.replace(/-0*/g, "/");
      const start2 = new Date(nueStartTime).getTime();
      // 当前时间 第二天起
      let current = this.validityTerm(start1);
      // 在保期间 若 当前时间大于在保期间起始时间 使用当前时间
      if (start1 >= start2) {
        startTime = current;
      } else {
        startTime = this.selectionType.startTime;
      }
      const loading = this.$loading({
        lock: true,
        text: "上传中，请等待...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      insEmpApplyImport(param)
        .then(xhrData => {
          let arr1 = [];
          let arr2 = [];
          if (xhrData.code === 200) {
            this.tableData = xhrData.data;
            this.tableData.forEach((item, index) => {
              // 批增类型
              item.type = "1";
              // 保单生效日期
              item.startTime = startTime;
              // 保单结束日期
              item.endTime = this.selectionType.endTime;
              arr1.push({
                name: item.projectName,
                id: item.projectId,
                remark: item.projectType == "0" ? "物业用户" : ""
              });
              arr2.push({
                name: item.jobName,
                code: item.jobCode
              });
              this.$set(this.tableData[index], "project", arr1[index]);
              this.$set(this.tableData[index], "jobCodeItem", arr2[index]);
              // 关闭对话框
              loading.close();
            });
          }
        })
        .catch(() => {
          // 关闭对话框
          loading.close();
          // 清空上传文件
          this.fileList = [];
          // 清空数据
          this.formdataArr = [];
        });
    },
    // 上传文件关闭按钮
    onRemove() {
      // 清空表格
      this.tableData = [];
    },
    // 提交数据
    submit() {
      // console.log(this.tableData);
      // let data = this.tableData
      // console.log(data);
      // 记录批增数量
      this.addNum = 0;
      // 记录批减数量
      this.reduceNum = 0;
      const insEmpApplyDetailList = [];
      // 保存 批减 保费
      let objData = {}
      // 保存 批增 保费
      let addObjData ={}
      this.tableData.forEach(item => {
        if(item.type == '2'){
          objData = item
        }
        if(item.type == '1'){
          addObjData = item
        }
        insEmpApplyDetailList.push({
          // id: item.id == undefined ? null : item.id,
          id: item.type == '2' ? item.id : null,
          idCard: item.idCard,
          jobCode:
            item.jobFormdataCode == null ? item.jobCode : item.jobFormdataCode,
          name: item.name,
          phone: item.phone,
          projectType: "" + item.projectType,
          projectId:
            item.compProjectId == null ? item.projectId : item.compProjectId,
          type: item.type,
          startTime: item.startTime + " 00:00:00",
          // startTime:
          //   item.type == "2" ? item.oldStartTime : item.startTime + " 00:00:00",
          endTime: item.startTime + " 23:59:59",
          // endTime:
          //   item.type == "2" ? item.oldEndTime : item.startTime + " 23:59:59",
            premium:item.premium
        });
        if (item.type == "1") {
          this.addNum += 1;
        } else if (item.type == "2") {
          this.reduceNum += 1;
        }
      });

      if (insEmpApplyDetailList.length <= 0) return;
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
      // console.log(insEmpApplyDetailList);
      this.insEmpApplyDetailList = insEmpApplyDetailList;

      // 披增披减 相同
      if (this.addNum == this.reduceNum) {
        const data = {
          oldReviseId:this.obj2.reviseId == undefined? null:this.obj2.reviseId,
          applyId: this.obj2.applyId, // 主键id
          isInvoice: "0",
          insEmpApplyDetailList: this.insEmpApplyDetailList
        };
        const loading = this.$loading({
          lock: true,
          text: "提交中,请等待...",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        // console.log(data);
        insEmpRevise(data)
          .then(xhrData => {
            console.log(xhrData);
            if (xhrData.code === 200) {
              loading.close();
              this.$message.success("提交成功！");
              this.$emit("changePage2", "LIST");
            }
          })
          .catch(() => {
            loading.close();
          });
      } else {
        // 批增大于批减
        if (this.addNum > this.reduceNum) {
          this.orderAccount = "扣费账户";
          this.orderBalance = "当前余额";
          this.isShowInvoice = true;
          this.isSocialSecurity2 = true;
          
          // 保单生效-结束时间 天数
          let dayNum = this.dateDiff(this.selectionType.startTime,this.selectionType.endTime)
          // 天保费          // 单人所需保费 / 天数
          let dayPremium = (this.yearMoney / dayNum).toFixed(6)
          // 每人所需收取保费
          let returnPremium = parseInt((this.dateDiff(addObjData.startTime,addObjData.endTime) * dayPremium) * (this.addNum - this.reduceNum)) + 1 
          this.orderForm.orderCost = '-' + returnPremium + '元'
        } else {
          this.isReduce = true
          this.orderAccount = "退款账户";
          this.orderBalance = "退款后余额";
          this.isShowInvoice = false;
          this.isSocialSecurity2 = false;
          let oldStartTime = objData.startTime.split(' ')[0]
          let oldEndTime = objData.endTime.split(' ')[0]
          // 保单生效-结束时间 天数
          let dayNum = this.dateDiff(oldStartTime,oldEndTime)
          // 天保费          // 单人所需保费 / 天数
          let dayPremium = (objData.premium / dayNum).toFixed(6)
          // 保存保单生效日期
          let startTime = "";
          // 当前时间
          const start1 = new Date(new Date().toLocaleDateString()).getTime();
          //
          let nueStartTime = this.selectionType.startTime.replace(/-0*/g, "/");
          const start2 = new Date(nueStartTime).getTime();
          // 当前时间 第二天起
          let current = this.validityTerm(start1);
          // 在保期间 若 当前时间大于在保期间起始时间 使用当前时间
          if (start1 >= start2) {
            startTime = current;
          } else {
            startTime = this.selectionType.startTime;
          }
          // 每人所需退还保费
          let returnPremium = parseInt((this.dateDiff(startTime,oldEndTime) * dayPremium) * (this.reduceNum - this.addNum)) 
          // console.log(returnPremium);
          this.returnPremium = returnPremium
          this.orderForm.orderCost = '+' + returnPremium + '元'
          
          
          
        }
        this.dialogTableVisibleOrder = true;
      }
    },
    // 新增员工
    add() {
      this.dialogTableVisibleAdd = true;
      this.addForm.formdataArr.push({});
    },
    // 新增员工 添加按钮
    addFormData() {
      this.addForm.formdataArr.push({});
    },
    // 新增员工 保存按钮
    addFormPreserve() {
      // 保存保单生效日期
      let startTime = "";
      // 当前时间
      const start1 = new Date(new Date().toLocaleDateString()).getTime();
      //
      let nueStartTime = this.selectionType.startTime.replace(/-0*/g, "/");
      const start2 = new Date(nueStartTime).getTime();
      // 当前时间 第二天起
      let current = this.validityTerm(start1);
      // 在保期间 若 当前时间大于在保期间起始时间 使用当前时间
      if (start1 >= start2) {
        startTime = current;
      } else {
        startTime = this.selectionType.startTime;
      }
      if (this.addForm.formdataArr.length <= 0) return;
      this.$refs["addForm"].validate(valid => {
        if (valid) {
          this.addForm.formdataArr.forEach(item => {
            // 批增类型
            item.type = "1";
            // 保单生效日期
            item.startTime = startTime;
            // 保单结束日期
            item.endTime = this.selectionType.endTime;
            this.tableData.push(item);
          });
          this.$message.success("保存成功");
          this.dialogTableVisibleAdd = false;
        } else {
          // console.log('error submit!!');
          return false;
        }
      });
    },
    // 关闭新增员工对话框
    closeAdd() {
      // 清空表单
      this.addForm.formdataArr = [];
    },
    // 关闭订单对话框
    closeOrder() {
      this.orderForm = {
        orderCost: "",
        cost: ""
      };
      this.projectItem = "";
      this.orderForm.invoiceId = null;
      this.invoiceId1 = "";
      this.invoiceId2 = "";
      this.payProjectId = undefined;
    },
    // 减少员工
    reduce() {
      this.dialogTableVisibleReduce = true;
    },
    // 减少员工 关闭对话框
    closeReduce() {
      this.reduceForm = {};
      this.reduceData = [];
    },
    // 减少员工 保存按钮
    reduceFormPreserve() {
      // console.log(this.reduceData);
      // 当前时间
      const start1 = new Date(new Date().toLocaleDateString()).getTime();
      // 当前时间 第二天起
      let current = this.validityTerm(start1);
      // this.reduceData.forEach(item => {
      this.reduceTickData.forEach(item => {
        this.tableData.push({
          id: item.id,
          compProjectId: item.projectId,
          compProjectName: item.projectName,
          // endTime: current,
          endTime: item.endTime.split(' ')[0],
          idCard: item.idCard,
          jobFormdataCode: item.jobCode,
          name: item.name,
          phone: item.phone,
          projectType: item.projectType,
          project: {
            name: item.projectName,
            id: item.projectId
          },
          jobCodeItem: {
            code: item.jobCode,
            name: item.jobName
          },
          // startTime: this.selectionType.startTime,
          startTime: item.startTime.split(' ')[0],
          type: "2",
          // oldStartTime: item.startTime,
          // oldEndTime: item.endTime,
          premium:item.premium,
          only:'1'
        });
      });
      this.dialogTableVisibleReduce = false;
    },
    // 新增员工 选择工种
    getJobCodeAdd(val, index) {
      this.addForm.formdataArr[index].jobFormdataCode = val.code;
    },
    // 批量表格 选择工种
    getJobCode(val, index) {
      this.tableData[index].jobFormdataCode = val.code;
    },
    // 新增选择项目
    optionArrAdd(val, index) {
      if (val.remark == "物业用户") {
        this.addForm.formdataArr[index].projectType = "0";
      } else {
        this.addForm.formdataArr[index].projectType = "1";
      }
      this.addForm.formdataArr[index].compProjectName = val.name;
      this.addForm.formdataArr[index].compProjectId = val.id;
    },
    // 提交订单按钮
    submitFormPreserve() {
      // console.log(this.insEmpApplyDetailList);
      const data = {
        oldReviseId:this.obj2.reviseId == undefined? null:this.obj2.reviseId,
        applyId: this.obj2.applyId, // 主键id
        invoiceId: this.orderForm.invoiceId, // 发票id
        payProjectId: this.payProjectId, // 扣费项目,可能是物业公司也可能是项目
        payProjectType: this.payProjectType, // 扣费类型，0：物业公司 1：项目
        insEmpApplyDetailList: this.insEmpApplyDetailList
      };
      if (data.payProjectId == undefined) {
        this.$message.error("请选择扣费账户");
        return;
      }
      // 选择开票
      if (this.isSocialSecurity2) {
        data.isInvoice = "1";
        if (data.invoiceId == null) {
          this.$message.error("请选择发票");
          return;
        }
      }
      // 选择 不开票
      else if (!this.isSocialSecurity2) {
        data.isInvoice = "0";
        data.invoiceId = null;
      }
      const loading = this.$loading({
        lock: true,
        text: "提交中,请等待...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      // console.log(data);
      insEmpRevise(data).then(xhrData => {
        // console.log(xhrData);
        if (xhrData.code === 200) {
          loading.close();
          this.$message.success("提交成功！");
          this.$emit("changePage2", "LIST");
        }
      }).catch(()=>{
        loading.close();
      })
    },
    // 批量列表上传选择
    optionArr(val, index) {
      if (val.remark == "物业用户") {
        this.tableData[index].projectType = "0";
      } else {
        this.tableData[index].projectType = "1";
      }
      this.tableData[index].compProjectName = val.name;
      this.tableData[index].compProjectId = val.id;
    },
    // 处理状态
    handleType(val) {
      // 1 批增 2 批减
      if (val == 1) {
        return (val = "新增");
      } else if (val == 2) {
        return (val = "减少");
      }
    },
    // 保障周期时间
    validityTerm(val) {
      var date = new Date(val);
      date.setFullYear(date.getFullYear());
      date.setDate(date.getDate() + 1);
      // console.log(date);
      const d = new Date(date);
      const resDate =
        d.getFullYear() +
        "-" +
        this.p(d.getMonth() + 1) +
        "-" +
        this.p(d.getDate());
      return resDate;
    },
    // 提取公用
    p(s) {
      return s < 10 ? "0" + s : s;
    },
    getArrDifference(arr1, arr2) {},
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
    // 减少员工 禁用复选框
    reduceCheckbox(row,index){
      return row.only == '1' ? false : true
    }
  }
};
</script>
<style>
.seeDialog .el-dialog__header {
  background-color: #e6e8eb;
}
.seeDialog .el-dialog__title {
  font-size: 20px;
  font-weight: bold;
}
.seeDialog .el-dialog__footer {
  background-color: #e6e8eb;
}
.seeDialog .el-dialog__body {
  padding-left: 30px;
  padding-right: 30px;
  box-sizing: border-box;
}
.seeDialog .el-dialog__footer {
  padding-bottom: 10px;
}
.seeDialog .btn {
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
.seeDialog .btn.btn1 {
  background: rgba(239, 130, 0, 1);
  border: 1px solid rgba(206, 112, 0, 1);
  color: #fff;
}
.seeDialog .btn.btn2 {
  border: 1px solid rgba(0, 0, 0, 0.25);
}
#orderDialog .el-dialog__body {
  padding-left: 60px;
  padding-right: 60px;
  box-sizing: border-box;
}
#orderDialog .el-input.is-disabled .el-input__inner {
  color: rgb(228, 74, 74);
  font-weight: bold;
}
</style>
<style lang="scss" scoped>
.declare {
  .declare-conter {
    min-height: calc(88vh);
    background-color: #fff;
    padding: 25px;
    box-sizing: border-box;
    border-radius: 5px;
    #correctionForm {
      display: flex;
      flex-wrap: wrap;
      .correctionForm-right {
        margin-right: 15px;
      }
      .correctionForm-wrap {
        height: 36px;
        margin-bottom: 22px;
        margin-right: 15px;
      }
    }
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
    .declare-btn-wrap {
      margin-top: 15px;
    }
  }
}
</style>
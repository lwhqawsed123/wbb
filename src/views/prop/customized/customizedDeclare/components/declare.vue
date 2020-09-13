<template>
  <!-- 雇主险定制申报页面 -->
  <div class="page-content">
    <div class="process">
      <div class="process-content">
        <div class="process-box" v-for="(item,index) in processBoxList" :key="index">
          <div class="process-box-left">{{index+1}}</div>
          <div class="process-box-right">
            <h5>{{item.name}}</h5>
            <p>{{item.cName}}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="page-top">
      <h4>申报信息</h4>
    </div>
    <div class="declare-top-conter">
      <div class="declare-top-left">
        <div class="declare-title">
          <span>申报单位：</span>
          <el-input style="width:250px" disabled v-model="name"></el-input>
        </div>
        <div class="declare-title">
          <span>承保公司：</span>
          <el-select
            @change="underwrite"
            style="width:250px"
            v-model="form.company"
            placeholder="请选择"
          >
            <el-option
              v-for="item in applyCompData"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </div>
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

    <div class="page-top">
      <h4>投保方案</h4>
    </div>
    <table id="declareTable">
      <tr style="font-size:14px;height:50px;">
        <th style="width:20%;"></th>
        <th style="width:20%;">
          <el-radio @change="getCodeId" v-model="form.code" :label="codeId1">{{value}}</el-radio>
        </th>
        <th style="width:20%;">
          <el-radio @change="getCodeId" v-model="form.code" :label="codeId2">{{value}}</el-radio>
        </th>
      </tr>
      <tr align="center" style="height: 50px;font-size:13px;line-height: 20px;color:#646464">
        <td>保障内容</td>
        <td>保障金额（方案一）</td>
        <td>保障金额（方案二）</td>
      </tr>
      <tr align="center" style="height: 50px;font-size:13px;line-height: 20px;color:#646464">
        <td>死亡伤残（退休年龄保额50万）</td>
        <td>{{disabilityNum1}}元</td>
        <td>{{disabilityNum2}}元</td>
      </tr>
      <tr align="center" style="height: 50px;font-size:13px;line-height: 20px;color:#646464">
        <td>意外医疗</td>
        <td>{{accidentNum1}}元</td>
        <td>{{accidentNum2}}元</td>
      </tr>
      <tr align="center" style="height: 50px;font-size:13px;line-height: 20px;color:#646464">
        <td>住院津贴</td>
        <td colspan="4">100元/天，最多60天</td>
      </tr>
      <tr align="center" style="height: 50px;font-size:13px;line-height: 20px;color:#646464">
        <td>误工费</td>
        <td colspan="4">100元/天，免赔5天，最多180天</td>
      </tr>
    </table>
    <el-checkbox-group v-if="isShowExpand" class="inquiry-box" v-model="type1">
      <el-checkbox disabled label="1">扩展24小时（死亡伤残10万意外医疗1万）</el-checkbox>
    </el-checkbox-group>
    <el-checkbox-group v-if="isShowHurtPay" class="inquiry-box" v-model="type2">
      <el-checkbox disabled label="2">伤残赔付特约（伤残赔付比例按等比赔付）</el-checkbox>
    </el-checkbox-group>
    <div class="page-top">
      <h4>保障周期</h4>
    </div>
    <div class="declare-time">
      <el-radio style="line-height: 36px;" v-model="form.cycle" label="Y">按年</el-radio>
      <el-date-picker
        style="width:250px"
        @change="validityTerm"
        v-model="form.startTime"
        type="date"
        value-format="yyyy-MM-dd"
        placeholder="选择日期"
        :picker-options="expireTimeOption"
      ></el-date-picker>
      <span class="declare-time-span1">&nbsp;&nbsp;至&nbsp;&nbsp;</span>
      <el-input style="width:250px" disabled v-model="form.endTime"></el-input>
      <span class="declare-time-span2">每人每年{{yearMoney}}元</span>
    </div>
    <div class="page-top">
      <h4>
        雇员信息
        <p style="color:#da242a;font-size:14px;margin-left:30px;display: inline-block">最低十人起投保</p>
      </h4>
    </div>
    <div v-if="!optionTow" class="batchData">
      <el-table  max-height='500px' :data="formdataArr" border style="width: 1151px">
        <el-table-column type="index" label="序号" min-width="50"></el-table-column>
        <el-table-column prop="name" label="项目名称" min-width="300px">
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
        <el-table-column show-overflow-tooltip prop="name" label="雇员姓名" min-width="100px"></el-table-column>
        <el-table-column show-overflow-tooltip prop="idCard" label="身份证" min-width="200px"></el-table-column>
        <el-table-column show-overflow-tooltip prop="phone" label="手机号" min-width="200px"></el-table-column>
        <el-table-column show-overflow-tooltip prop="isSocialSecurity" label="有/无社保" min-width="100px"></el-table-column>
        <!-- <el-table-column show-overflow-tooltip prop="jobCode" label="工种" width="200px"></el-table-column> -->
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
            :prop="'insEmpApplyUsers.'+index+'.project'"
            :rules="rules.project"
            label="项目名称："
          >
            <el-select
              @change="getProject($event,index)"
              value-key="name"
              style="width:250px"
              v-model="item.project"
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
            <el-button v-if="index == 0" style="visibility: hidden;" @click.prevent="removeDomain(item)">删除</el-button>
            <el-button v-if="index > 0" @click.prevent="removeDomain(item)">删除</el-button>
          </el-form-item>
          <el-form-item :prop="'insEmpApplyUsers.'+index+'.name'" :rules="rules.name" label="雇员姓名：">
            <el-input style="width:250px" v-model.trim="item.name"></el-input>
          </el-form-item>
          <el-form-item
            :prop="'insEmpApplyUsers.'+index+'.idCard'"
            :rules="rules.idCard"
            label="身份证："
          >
            <el-input maxlength="18" style="width:250px" v-model.trim="item.idCard"></el-input>
          </el-form-item>
          <el-form-item
            :prop="'insEmpApplyUsers.'+index+'.phone'"
            :rules="rules.phone"
            label="手机号："
          >
            <el-input maxlength="11" style="width:250px" v-model.trim="item.phone"></el-input>
          </el-form-item>
          <!-- <el-form-item
            label="工种"
            :prop="'insEmpApplyUsers.'+index+'.jobCode'"
            :rules="rules.jobCode"
          >
            <el-select style="width:250px" v-model="item.jobCode">
              <el-option
                v-for="(item,index) in Typework"
                :label="item.name"
                :value="item.code"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>-->
          <el-form-item
            :prop="'insEmpApplyUsers.'+index+'.isSocialSecurity'"
            :rules="rules.isSocialSecurity"
            label="社保："
          >
            <el-switch
              @change="switchUpgrade"
              class="switchStyle"
              v-model="item.isSocialSecurity2"
              active-color="#1890ff"
              active-text="有"
              inactive-color="#ddd"
              inactive-text="无"
            ></el-switch>
            <!-- <el-select style="width:250px" v-model="item.isSocialSecurity" placeholder="请选择">
              <el-option label="无" value="0"></el-option>
              <el-option label="有" value="1"></el-option>
            </el-select>-->
          </el-form-item>
        </el-form>
      </div>
      <div class="addInsuranceBtn">
        <el-button @click="addInsurance">新增被保险人</el-button>
      </div>
    </div>
    <div class="apply-page-bot">
      <a v-if="optionTow" class="apply-page-btn" href="javascript:;" @click="submission">申报</a>
      <a
        v-if="batchApplyShow"
        class="apply-page-btn apply-page-btn-default"
        @click="batchApply"
      >批量申报</a>
      <!-- 点击批量申报时候出现的按钮 -->
      <a href="javascript:;" v-if="!optionTow" class="apply-page-btn" @click="batchApplyDeclare">申报</a>
      <a
        href="javascript:;"
        v-if="!optionTow"
        class="apply-page-btn apply-page-btn-default"
        @click="btnchReturn"
      >返 回</a>
    </div>
  </div>
</template>

<script>
// 验证
import {
  ShiFanManShiBaSui,
  Identity,
  IdCard,
  isvalidPhone
} from "@/validate/validate.js";
import {
  getPropCompany,
  // queryProjectList,
  insEmpCustomApplyCompList,
  insEmpCustomPriceApplyGte,
  insEmpCustomApplyExportTemplate,
  insEmpCustomApplyImportData,
  insEmpCustomApplyAllowChoiceTime,
  insEmpCustomApplyId,
  propJobsList,
  getProjectRoleList,
  insEmpCustomApplyValidRepeatIdCard
} from "@/api/information/information";
export default {
  name: "declare-declare",
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
      expireTimeOption: {
        disabledDate(date) {
          // return date.getTime() <= Date.now() - 8.64e7; // 当天可投保
          return date.getTime() <= Date.now(); // 次日可投保
        }
      },
      // 方案价格
      yearMoney: "",
      // 保险公司方案价格
      insYearMoney: {
        one: "",
        two: ""
      },
      // 方案ID
      // 物业公司名字
      codeId1: 1,
      codeId2: 2,
      name: "",
      // 是否显示扩展24小时
      isShowExpand: false,
      // 是否显示伤残赔付
      isShowHurtPay: false,
      // 方案一
      // 死亡伤残
      disabilityNum1: "",
      // 意外
      accidentNum1: "",
      // 方案二
      // 死亡伤残
      disabilityNum2: "",
      // 意外
      accidentNum2: "",
      // 文件上传
      fileList: [],
      // 选择批量时候
      optionTow: true,
      // 批量申报按钮显示控制
      batchApplyShow: true,
      // 上传成功后保存数据
      formdataArr: [],
      // 空值
      value: "",
      type1: ["1"],
      type2: ["2"],
      processBoxList: [
        { name: "资料录入", cName: "投保资料填写" },
        { name: "打印盖章", cName: "投保单打印盖章" },
        { name: "资料上传", cName: "资料上传" },
        { name: "确认付款", cName: "确认付款" }
      ],
      // 保存项目
      projectData: [],
      // 保存承保公司信息
      applyCompData: [],
      form: {
        // 按年
        cycle: "Y",
        // 申报单位
        // unit: "",
        // 承保公司
        company: "",
        // 投保方案
        code: 1,
        startTime: "",
        endTime: "",
        insEmpApplyUsers: [
          {
            // 雇员姓名
            name: "",
            // 身份证
            idCard: "",
            // 手机号
            phone: "",
            // 有无社保
            isSocialSecurity2: false,
            // 项目
            project: "",
            // 项目id
            compProjectId: ""
            // 工种
            // jobCode: ""
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
        // 社保
        // isSocialSecurity: [
        //   { required: true, message: "请选择社保", trigger: "change" }
        // ],
        // 项目
        project: [{ required: true, message: "请选择项目", trigger: "change" }]
        // 工种
        // jobCode: [{ required: true, message: "请选择项目", trigger: "change" }]
      },
      obj: {},
      optionProject: [],
      optionProjectArr1: [],
      optionProjectArr2: [],
      formTableData: {},
      // 工种
      Typework: []
    };
  },
  created() {
    this.getCompany();
    this.getProjectList();
    this.getApplyCompList();
    this.isPubGetWaitPay();
    // 获取工种类型
    propJobsList().then(xhrData => {
      if (xhrData.code === 200) {
        this.Typework = xhrData.rows;
      }
    });
  },
  methods: {
    // 判断 是否付款(未付款跳到付款页面)
    async isPubGetWaitPay() {
      if (this.$route.query.insData == undefined) return;
      if (
        this.$route.query.insData.isTrue &&
        this.$route.query.insData != undefined
      ) {
        this.obj = {
          id: this.$route.query.insData.id
        };
        await insEmpCustomApplyId(this.obj.id).then(xhrData => {
          // console.log(xhrData, "保费");
          if (xhrData.code === 200) {
            this.obj.form = {};
            this.obj.totalPremium = xhrData.data.totalPremium;
            this.obj.form.company = xhrData.data.insCompId;
          }
        });
        // console.log(this.obj,'obj');

        this.$emit("changePage", "PAYMENT", this.obj);
      }
    },
    getCompany() {
      // 获取物业公司信息
      getPropCompany().then(xhrData => {
        // console.log(xhrData, "物业公司信息");
        if (xhrData.code === 200) {
          this.obj.propertyData = xhrData.data;
          // this.optionProjectArr1.push(this.obj.propertyData);
          this.name = xhrData.data.name;
        }
      });
    },
    // getProjectList() {
    //   getPropCompany().then(xhrData => {
    //     if (xhrData.code == 200) {
    //       this.optionProjectArr2 = xhrData;
    //     }
    //   });
    // },
    // 查询承保公司
    getApplyCompList() {
      // 查询可选择的承保公司
      insEmpCustomApplyCompList().then(xhrData => {
        // console.log(xhrData);
        // yearMoney

        if (xhrData.code === 200) {
          this.applyCompData = xhrData.data;
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
      // const reposResp = await queryProjectList(page);
      const reposResp = await getProjectRoleList(page);
      if (userResp.code === 200) {
        let arr1 = [];
        arr1.push(userResp.data);
        _this.projectData[0] = {
          name: "物业类型",
          arr: arr1
        };
      }
      if (reposResp.code === 200) {
        _this.projectData[1] = {
          name: "项目类型",
          arr: reposResp.rows
        };
      }
      this.$forceUpdate();
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
        isSocialSecurity2: false,
        // 项目
        project: ""
        // 工种
        // jobCode: ""
      });
    },
    // 删除
    removeDomain(item) {
      var index = this.form.insEmpApplyUsers.indexOf(item);
      if (index !== -1) {
        this.form.insEmpApplyUsers.splice(index, 1);
      }
    },
    // 选择项目触发
    getProject(val, index) {
      // console.log(val, index);
      this.form.insEmpApplyUsers[index].compProjectId = val.id;
      this.form.insEmpApplyUsers[index].project = val.name;
      if (val.remark == "物业用户") {
        this.form.insEmpApplyUsers[index].projectType = "0";
      } else {
        this.form.insEmpApplyUsers[index].projectType = "1";
      }
    },
    // 承保公司选择触发
    underwrite(id) {
      insEmpCustomPriceApplyGte(id).then(xhrData => {
        // console.log(xhrData);
        let empCustomPlanList = xhrData.data.empCustomPlanList;
        if (xhrData.code === 200) {
          if (empCustomPlanList[0].isExpand == "0") {
            this.isShowExpand = false;
          } else if (empCustomPlanList[0].isExpand == "1") {
            this.isShowExpand = true;
          }
          if (empCustomPlanList[0].isHurtPay == "0") {
            this.isShowHurtPay = false;
          } else if (empCustomPlanList[0].isHurtPay == "1") {
            this.isShowHurtPay = true;
          }
          this.disabilityNum1 = empCustomPlanList[0].deadAmount;
          this.accidentNum1 = empCustomPlanList[0].accidentAmount;
          this.disabilityNum2 = empCustomPlanList[1].deadAmount;
          this.accidentNum2 = empCustomPlanList[1].accidentAmount;
          this.codeId1 = empCustomPlanList[0].id;
          this.codeId2 = empCustomPlanList[1].id;
          this.form.code = empCustomPlanList[0].id;
          this.insYearMoney.one = empCustomPlanList[0].price;
          this.insYearMoney.two = empCustomPlanList[1].price;
          // 默认
          this.yearMoney = this.insYearMoney.one;
        }
      });
    },
    // 申报按钮
    submission() {
      if (this.form.company == "") {
        this.$message.warning({
          message: "请选择承保公司！"
        });
        return;
      }
      if (this.form.startTime == "") {
        this.$message.warning({
          message: "请选择保障周期时间！"
        });
        return;
      }
      if(this.form.insEmpApplyUsers.length < 10){
         this.$message.warning({
          message: "最低十人起投保"
        });
        return;
      }
      let newArr = [];
      // 保存this
      const _this = this;
      // 循环遍历 表单
      this.form.insEmpApplyUsers.forEach((ele, index) => {
        if (ele.isSocialSecurity2) {
          ele.isSocialSecurity = "1";
        } else {
          ele.isSocialSecurity = "0";
        }
        // 表单验证
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
      // 通过表单验证
      if (flag) {
        
        this.obj.form = this.form;
        // console.log(this.obj);
        let insObjData = {}
        // 方案价格
        insObjData.yearMoney = this.yearMoney
        // 选择方案
        if(this.form.code == this.codeId1){
          // 死亡伤残
          insObjData.disabilityNum = this.disabilityNum1
          // 意外医疗
          insObjData.accidentNum = this.accidentNum1
        }else if(this.form.code == this.codeId2){
          // 死亡伤残
          insObjData.disabilityNum = this.disabilityNum2
          // 意外医疗
          insObjData.accidentNum = this.accidentNum2
        }
        // 投保人数
        insObjData.num = this.obj.form.insEmpApplyUsers.length
        this.obj.insObjData = insObjData
        this.obj.startTime = this.form.startTime
        this.obj.endTime = this.form.endTime
         // 查询身份证是否重复
        const newData = {}
        newData.startTime = this.obj.form.startTime
        newData.empCustomDetailList = this.obj.form.insEmpApplyUsers
        insEmpCustomApplyValidRepeatIdCard(newData).then(xhrData=>{
          if(xhrData.code === 200){
            this.$emit("changePage", "PRINT", this.obj);
          }
        }).catch(()=>{

        })
        
      } else {
        this.$message.warning({
          message: "请填写完整信息！"
        });
      }
    },
    // 保障周期时间
    validityTerm(val) {
      if(val == null) {
        this.form.endTime = ''
        return
      }
      var date = new Date(val);
      date.setFullYear(date.getFullYear() + 1);
      date.setDate(date.getDate() - 1);
      // console.log(date);
      const d = new Date(date);
      const resDate =
        d.getFullYear() +
        "-" +
        this.p(d.getMonth() + 1) +
        "-" +
        this.p(d.getDate());
      this.form.endTime = resDate;
      this.form.startTime = val + " 00:00:00";

      const data = {
        startTime: val + " 00:00:00"
      };
      // 查询这个日期是否被允许选取
      insEmpCustomApplyAllowChoiceTime(data)
        .then(xhrData => {
          // console.log(xhrData);
          if (xhrData.code === 200) {
          }
        })
        .catch(() => {
          this.form.startTime = "";
          this.form.endTime = "";
        });
    },
    // 提取公用
    p(s) {
      return s < 10 ? "0" + s : s;
    },
    // 下载模板按钮
    handleExport() {
      this.$confirm("是否确认批量模板下载?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return insEmpCustomApplyExportTemplate();
        })
        .then(response => {
          this.download(response.msg);
        })
        .catch(function() {});
    },
    // 上传
    handleChange(file, fileList) {
      const _this = this;
      const param = new FormData();
      param.append("file", file.raw);

      insEmpCustomApplyImportData(param).then(xhrData => {
        // console.log(xhrData);
        // console.log(this.projectData);

        let objData1 = {};
        let arr = [];
        if (xhrData.code === 200) {
          this.formdataArr = xhrData.data;
          this.formdataArr.forEach((item, index) => {
            if (item.isSocialSecurity == "0") {
              item.isSocialSecurity = "无";
            } else if (item.isSocialSecurity == "1") {
              item.isSocialSecurity = "有";
            }
            if (item.compProjectId == null) {
              item.compProjectName = "";
            }
            arr.push({
              name: item.compProjectName,
              id: item.compProjectId,
              remark: item.projectType == "0" ? "物业用户" : ""
            });

            this.$set(this.formdataArr[index], "project", arr[index]);
          });
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
    // 批量申报时的 申报
    batchApplyDeclare() {
      if (this.form.company == "") {
        this.$message.warning({
          message: "请选择承保公司！"
        });
        return;
      }
      if (this.form.startTime == "") {
        this.$message.warning({
          message: "请选择保障周期时间！"
        });
        return;
      }
      if(this.formdataArr.length < 10){
         this.$message.warning({
          message: "最低十人起投保"
        });
        return;
      }
      this.obj.form = this.form;
      this.obj.form.startTime = this.obj.form.startTime;
      // this.obj.form.startTime = this.obj.form.startTime + " 00:00:00";
      const empCustomPlanList = [];
      for (let i = 0; i < this.formdataArr.length; i++) {
        if (
          Object.prototype.toString.call(this.formdataArr[i].compProjectId) ===
          "[object Null]"
        ) {
          this.$message.error({
            message: `第${i + 1}行,项目未选择，请选择后申报！`
          });
          return;
        }
        // 判断身份证格式是否正确
        if (!Identity(this.formdataArr[i].idCard)) {
          // 身份证格式不正确
          this.$message.error({
            message: `第${i + 1}行,身份证格式存在错误!  请确认后申报!`
          });
          return;
        } else if (!ShiFanManShiBaSui(this.formdataArr[i].idCard)) {
          // 证件中存在未成年用户
          this.$message.error({
            message: `第${i + 1}行,证件中存在未成年!  请确认后申报!`
          });
          return;
        } else if (IdCard(this.formdataArr[i].idCard)) {
          // 证件中存在超过70岁用户
          this.$message.error({
            message: `第${i + 1}行,证件中存在超过70岁用户!  请确认后申报!`
          });
          // break;
          return;
        } else if (!isvalidPhone(this.formdataArr[i].phone)) {
          // 手机号格式有误
          this.$message.error({
            message: `第${i + 1}行,手机号格式有误!  请确认后申报!`
          });
          return;
        }
      }
      this.formdataArr.forEach((item, index) => {
        // console.log(item);
        empCustomPlanList.push({
          compProjectId:
            item.compProjectId == null ? item.project : item.compProjectId,
          idCard: item.idCard,
          isSocialSecurity: item.isSocialSecurity == "无" ? "0" : "1",
          name: item.name,
          phone: item.phone,
          project: item.compProjectName,
          projectType: "" + item.projectType
        });
      });
      // console.log(empCustomPlanList);
       let insObjData = {}
        // 方案价格
        insObjData.yearMoney = this.yearMoney
        // 选择方案
        if(this.form.code == this.codeId1){
          // 死亡伤残
          insObjData.disabilityNum = this.disabilityNum1
          // 意外医疗
          insObjData.accidentNum = this.accidentNum1
        }else if(this.form.code == this.codeId2){
          // 死亡伤残
          insObjData.disabilityNum = this.disabilityNum2
          // 意外医疗
          insObjData.accidentNum = this.accidentNum2
        }
        this.obj.form.insEmpApplyUsers = empCustomPlanList;
        // 投保人数
        insObjData.num = this.obj.form.insEmpApplyUsers.length
        this.obj.insObjData = insObjData
        this.obj.startTime = this.form.startTime
        this.obj.endTime = this.form.endTime
        // 查询身份证是否重复
        const newData = {}
        newData.startTime = this.obj.form.startTime
        newData.empCustomDetailList = this.obj.form.insEmpApplyUsers
        insEmpCustomApplyValidRepeatIdCard(newData).then(xhrData=>{
          if(xhrData.code === 200){
            this.$emit("changePage", "PRINT", this.obj);
          }
        }).catch(()=>{

        })
    },
    // 返回
    btnchReturn() {
      // 清空表格
      this.formdataArr = [];
      // 回到顶部
      document.body.scrollTop = document.documentElement.scrollTop = 0;
      // 控制显示 隐藏
      this.optionTow = true;
      this.batchApplyShow = true;
    },
    //
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
    // 按需赋值给另一个对象
    objFun(objA, objB) {
      Object.keys(objA).forEach(key => {
        objA[key] = objB[key] || objA[key];
      });
      return objA;
      // console.log(objA);
    },
    switchUpgrade(val) {
      // console.log(val);
    },
    // 获取方案
    getCodeId(val) {
      // console.log(val);
      if (val == this.codeId1) {
        this.yearMoney = this.insYearMoney.one;
      } else if (val == this.codeId2) {
        this.yearMoney = this.insYearMoney.two;
      }
    }
  }
};
</script>
<style>
.el-table--scrollable-x .el-table__body-wrapper {
  min-height: calc(15vh);
  
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
#declare-components-form
  .el-checkbox__input.is-disabled.is-checked
  .el-checkbox__inner {
  background-color: #ddd;
  border-color: #ddd;
}
#declare-components-form
  .el-checkbox__input.is-disabled.is-checked
  .el-checkbox__inner::after {
  border-color: #fff;
  
}
#declare-components-form
  .el-checkbox__input.is-disabled
  + span.el-checkbox__label {
  color: #999;
}
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
  left: 24px;
}
.switchStyle .el-switch__label--right {
  z-index: 9;
  /* left: -14px; */
}
.switchStyle .el-switch__label.is-active {
  display: block;
}
.switchStyle.el-switch .el-switch__core {
  width: 50px !important;
}
</style>
<style lang="scss" scoped>
.page-content {
  padding: 50px 20px;
  box-sizing: border-box;
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
            color: #818181;
            font-size: 14px;
          }
        }
      }
    }
  }
  .page-top {
    margin-top: 30px;
    margin-bottom: 10px;
    display: flex;
    padding-bottom: 20px;
    span {
      color: rgb(1, 121, 254);
      margin-left: 15px;
      font-size: 14px;
      cursor: pointer;
    }
    h4 {
      color: #666;
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
  .declare-title {
    padding: 15px 0;
    span {
      display: inline-block;
      color: #666;
      font-size: 14px;
      font-weight: 700;
      width: 120px;
      text-align: right;
      margin-right: 12px;
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
  .inquiry-box {
    padding-top: 20px;
    box-sizing: border-box;
  }
  .declare-time {
    display: flex;
    height: 36px;
    .declare-time-span1 {
      line-height: 36px;
      font-size: 14px;
      color: #666;
    }
    .declare-time-span2 {
      color: red;
      line-height: 36px;
      margin-left: 10px;
      font-size: 14px;
    }
  }
  .addInsuranceBtn {
    padding-bottom: 20px;
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
  .declare-xinxi {
    display: flex;
    // justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    .declare-xinxi-form {
      flex: auto;
      // width: 33%;
      padding-bottom: 20px;
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
</style>
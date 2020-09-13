<template>
  <!-- 家财保障申报 -->
  <div class="guarantee" id="guarantee">
    <div class="guarantee-conter">
      <el-form id="form" ref="form" label-position="left" :model="form" label-width="120px">
        <div class="guarantee-top" style="margin-top:0">
          <h4>
            基本信息
            <!-- <span>?</span> -->
          </h4>
        </div>
        <div class="guarantee-box">
          <div class="guarantee-box-left">
            <p>
              投保公司
              <span>{{companyName}}</span>
            </p>
            <p>
              承保公司
              <span>{{insCompanyName}}</span>
            </p>
          </div>
          <div v-if="!optionTow" class="guarantee-box-right">
            <a href="javascript:;" class="declare-top-btn btn1" @click="handleExport">批量模板下载</a>
            <el-upload
              ref="upload"
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

        <!-- 项目信息 -->
        <div>
          <div class="guarantee-top">
            <h4>
              项目信息
              <!-- <span>?</span> -->
            </h4>
          </div>
          <el-form-item label="项目名称">
            <el-select
              value-key="id"
              @change="selectFun1"
              v-model="form.nameId"
              style="width:250px;"
            >
              <el-option
                v-for="(item) in information"
                :key="item.id"
                :label="item.name"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="项目地址">
            <el-select
              value-key="id"
              @change="selectFun2"
              v-model="form.address"
              style="width:500px;"
              placeholder="请选择"
            >
              <el-option
                v-for="(item,index) in addressArr"
                :key="index"
                :value="item"
                :label="item"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="购买方式">
            <el-select
              @change="purchasing"
              v-model="form.type"
              style="width:500px;"
              placeholder="请选择"
            >
              <el-option value="0" label="家财豆"></el-option>
              <el-option value="1" label="余额"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="isShow" label="当前余额">
            <el-row>
              <el-col class="currentMoney" :span="4">
                <el-input :disabled="true" v-model="currentMoney"></el-input>
              </el-col>
              <el-col style="margin-left:15px;" :span="1">
                <span style>元</span>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item v-if="!isShow" label="家财豆">
            <el-row>
              <el-col class="currentMoney" :span="4">
                <el-input :disabled="true" v-model="fortuneBean"></el-input>
              </el-col>
              <el-col style="margin-left:15px;" :span="1">
                <span style>个</span>
              </el-col>
            </el-row>
          </el-form-item>
        </div>

        <!-- 家财保障信息 -->
        <div>
          <div class="guarantee-top">
            <h4>
              业主保障信息
              <!-- <span>?</span> -->
              <a
                href="javascript:;"
                style="color:#0179FE;font-size:14px;margin-left:30px;"
                @click="dialogTableVisible=true"
              >法保服务产品介绍</a>
            </h4>
          </div>
          <el-checkbox-group @change="selection" v-model="form.checkbox" style="width:40%;">
            <el-checkbox
              v-for="(item,index) in productList"
              :key="index"
              style="display:block;"
              :label="item.id"
              name="checkbox"
            >
              <p>{{item.listTitle}}</p>
            </el-checkbox>
          </el-checkbox-group>
        </div>
        <!-- 保障申报信息 -->
        <div>
          <div class="guarantee-top">
            <h4>
              保障申报信息
              <!-- <span>?</span> -->
            </h4>
          </div>
          <div v-if="!optionTow" class="batchData">
            <el-table max-height="500px" :data="formdataArr" border style="width: 800px;">
              <el-table-column label="序号" type="index"></el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="houseAddress"
                label="房屋地址"
                min-width="200"
              ></el-table-column>
              <el-table-column show-overflow-tooltip prop="houseNumber" label="门牌号" min-width="100"></el-table-column>
              <el-table-column show-overflow-tooltip prop="mobileNo" label="被保险人手机" min-width="120"></el-table-column>
            </el-table>
          </div>
          <div v-if="optionTow">
            <div class="multipleForm">
              <el-form
                class="multipleForm-box"
                :model="multipleForm"
                ref="multipleForm"
                label-width="120px"
                v-for="(item,index) in multipleForm.insEmpApplyUsers"
                :key="index"
                :rules="rules"
                v-cloak
              >
                <el-form-item
                  :rules="rules.houseAddress"
                  label="房屋地址"
                  :prop="'insEmpApplyUsers.'+index+'.houseAddress'"
                >
                  <el-input v-model.trim="item.houseAddress"></el-input>
                  <el-button v-if="index == 0" style="visibility: hidden;">删除</el-button>
                  <el-button v-if="index > 0" @click.prevent="removeDomain(item)">删除</el-button>
                </el-form-item>

                <el-form-item
                  :rules="rules.houseNumber"
                  label="门牌号"
                  :prop="'insEmpApplyUsers.'+index+'.houseNumber'"
                >
                  <el-input v-model.trim="item.houseNumber"></el-input>
                </el-form-item>
                <el-form-item
                  :rules="rules.mobileNo"
                  label="被保险人手机"
                  :prop="'insEmpApplyUsers.'+index+'.mobileNo'"
                >
                  <el-input :maxlength="11" v-model.trim="item.mobileNo"></el-input>
                </el-form-item>
              </el-form>
            </div>
            <p class="guarantee-p">
              保险有效期
              <span>{{effective}}</span>
            </p>
            <div class="addInsuranceBtn">
              <el-button @click="addAddress">添加地址</el-button>
            </div>
          </div>
        </div>
        <!-- 家财产品介绍 对话框 -->
        <el-dialog id="guarantee-dialog" title="法保服务产品介绍" :visible.sync="dialogTableVisible">
          <div class="guarantee-dialog-main">
            <div v-if="!isShowScheme">
              <h3>物保家财5.0万保额</h3>
              <el-table
                :data="tableData"
                :span-method="objectSpanMethod"
                border
                style="width: 100%; margin-top: 20px"
              >
                <el-table-column prop="baoZhan" label="保障内容" min-width="30%"></el-table-column>
                <el-table-column prop="wu" label min-width="15%"></el-table-column>
                <el-table-column prop="jinE" label="保障金额" min-width="25%"></el-table-column>
                <el-table-column prop="beiZhu" label="备注" min-width="30%"></el-table-column>
              </el-table>
            </div>
            <h3>物保家财6.0万保额</h3>
            <el-table
              :data="tableData1"
              :span-method="objectSpanMethod"
              border
              style="width: 100%; margin-top: 20px"
            >
              <el-table-column prop="baoZhan" label="保障内容" min-width="30%"></el-table-column>
              <el-table-column prop="wu" label min-width="15%"></el-table-column>
              <el-table-column prop="jinE" label="保障金额" min-width="25%"></el-table-column>
              <el-table-column prop="beiZhu" label="备注" min-width="30%"></el-table-column>
            </el-table>
            <h3>物保家财11.0万保额</h3>
            <el-table
              :data="tableData2"
              :span-method="objectSpanMethod"
              border
              style="width: 100%; margin-top: 20px"
            >
              <el-table-column prop="baoZhan" label="保障内容" min-width="30%"></el-table-column>
              <el-table-column prop="wu" label min-width="15%"></el-table-column>
              <el-table-column prop="jinE" label="保障金额" min-width="25%"></el-table-column>
              <el-table-column prop="beiZhu" label="备注" min-width="30%"></el-table-column>
            </el-table>
            <h3>物保家财20.0万保额</h3>
            <el-table
              :data="tableData3"
              :span-method="objectSpanMethod"
              border
              style="width: 100%; margin-top: 20px"
            >
              <el-table-column prop="baoZhan" label="保障内容" min-width="30%"></el-table-column>
              <el-table-column prop="wu" label min-width="15%"></el-table-column>
              <el-table-column prop="jinE" label="保障金额" min-width="25%"></el-table-column>
              <el-table-column prop="beiZhu" label="备注" min-width="30%"></el-table-column>
            </el-table>
            <h3>保险条款</h3>
            <el-input type="textarea" :autosize="{ maxRows: 15}" v-model="insuranceClause"></el-input>
            <h3>附加条款</h3>
            <el-input type="textarea" :autosize="{ maxRows: 4}" v-model="additionalClause"></el-input>
            <h3>个人法律服务内容</h3>
            <el-input type="textarea" :autosize="{ maxRows: 15}" v-model="personalClause"></el-input>
          </div>
          <div slot="footer" class="dialog-footer">
            <a href="javascript:;" class="guarantee-btn btn2" @click="dialogTableVisible=false">返 回</a>
          </div>
        </el-dialog>
        <div class="guarantee-bot">
          <!-- 单量申报 -->
          <a
            v-if="optionTow"
            :class="prohibit ? 'guarantee-btn prohibitbtn1': 'guarantee-btn btn1'"
            href="javascript:;"
            @click="prohibit ? prohibitBtn() : onSubmit('form')"
            v-hasPermi="['ins:house:add']"
          >申报</a>
          <!-- 批量申报 -->
          <a
            v-if="batchApplyShow"
            :class="prohibit ? 'guarantee-btn btn2 ml prohibitbtn2' : 'guarantee-btn btn2 ml'"
            href="javascript:;"
            @click="prohibit ? prohibitBtn() : batchApply()"
            v-hasPermi="['ins:house:add']"
          >批量申报</a>
          <!-- 点击批量申报时候出现的按钮 -->
          <a v-if="!optionTow" class="guarantee-btn btn1" @click="batchApplyDeclare">申报</a>
          <a v-if="!optionTow" class="guarantee-btn btn2 ml" @click="btnchReturn">返 回</a>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
// 请求
import {
  insRuleGetProduct,
  getProjectRoleList,
  houseInsureApplyHouseInsure,
  getPropCompany,
  houseInsureExportTemplate,
  houseInsureImportData
} from "@/api/information/information";
import { isvalidPhone } from "@/validate/validate";
// 保险条款
import {
  familyClause,
  familyAddClause,
  personalLaw
} from "@/validate/programme";
export default {
  name: "guarantee",
  inject: ["reload"],
  data() {
    return {
      // 上传成功后保存数据
      formdataArr: [],
      // 选择批量时候
      optionTow: true,
      // 文件上传
      fileList: [],
      // 批量申报按钮显示控制
      batchApplyShow: true,
      //  对话框
      dialogTableVisible: false,
      // 承保公司
      insCompanyName: "",
      // 承保公司id
      insCompanyId: "",
      // 项目名称
      // 提交的数据
      SubmissionData: {
        // 项目id
        pId: 0,
        // 项目名称
        projectName: "",
        // 项目地址
        projectAddress: "",
        // 房屋地址
        houseAddress: "",
        // 门牌号
        houseNumber: "",
        // 被保人手机号码
        mobileNo: "",
        // 投保公司ID
        icId: 0,
        // 投保公司名称
        icName: "",
        // 产品ID, 多选, 逗号隔开
        hIds: ""
      },
      // 表单信息
      form: {
        // 项目名称
        nameId: "",
        // 家财险类型
        checkbox: [],
        address: "",
        // 使用类型 0家财豆 1余额
        type: "0"
      },
      // 保障申报信息
      multipleForm: {
        insEmpApplyUsers: [
          {
            // 房屋地址
            houseAddress: "",
            // 门牌号
            houseNumber: "",
            // 被保险人手机
            mobileNo: ""
          }
        ]
      },
      // 表单验证
      rules: {
        // 房屋地址
        houseAddress: [
          { required: true, message: "请输入房屋地址", trigger: "blur" }
        ],
        // 门牌号
        houseNumber: [
          { required: true, message: "请输入门牌号", trigger: "blur" }
        ],
        // 被保险人手机
        mobileNo: [
          { required: true, message: "请输入被保险人手机", trigger: "blur" },
          {
            pattern: /^1[3|4|5|7|8][0-9]\d{8}$/,
            message: "手机号格式错误",
            trigger: "blur"
          }
        ]
      },
      // 保存小区项目信息
      information: [],
      // 保存小区项目对于地址
      addressArr: [],
      // 默认显示家财豆
      isShow: false,
      // 小区余额
      currentMoney: "",
      // 家财豆
      fortuneBean: "",
      // 家财保障信息
      productList: [],
      // 家财产品介绍
      // 5.0万
      tableData: [
        {
          baoZhan: "火灾、爆炸",
          wu: "房屋及附属设施室内装修",
          jinE: "20000",
          beiZhu: "-"
        },
        {
          wu: "室内财产",
          jinE: "10000",
          beiZhu: "-"
        },
        {
          baoZhan: "附加管道破裂及水渍保险",
          wu: "管道破裂水损",
          jinE: "2000",
          beiZhu: "每次事故绝对免赔200元（限额1000元）"
        },
        {
          baoZhan: "附加第三者责任保险",
          wu: "家庭第三者责任",
          jinE: "10000",
          beiZhu: "每次事故绝对免赔200元（限额2000元）"
        },
        {
          baoZhan: "附加家用电器用电安全保险",
          wu: "家电用电安全",
          jinE: "8000",
          beiZhu: "每次事故绝对免赔200元"
        },
        {
          baoZhan: "总保额",
          wu: "",
          jinE: "50000",
          beiZhu: ""
        }
      ],
      // 6.0万
      tableData1: [
        {
          baoZhan: "火灾、爆炸",
          wu: "房屋及附属设施室内装修",
          jinE: "37000",
          beiZhu: "-"
        },
        {
          wu: "室内财产",
          jinE: "10000",
          beiZhu: "-"
        },
        {
          baoZhan: "附加管道破裂及水渍保险",
          wu: "-",
          jinE: "3000",
          beiZhu: "每次事故绝对免赔200元（限额1000元）"
        },
        {
          baoZhan: "附加第三者责任保险",
          wu: "",
          jinE: "5000",
          beiZhu: ""
        },
        {
          baoZhan: "附加家用电器用电安全保险",
          wu: "",
          jinE: "5000",
          beiZhu: "每次事故绝对免赔200元"
        },
        {
          baoZhan: "总保额",
          wu: "",
          jinE: "60000",
          beiZhu: ""
        }
      ],
      // 家财产品介绍
      // 11.0万
      tableData2: [
        {
          baoZhan: "火灾、爆炸",
          wu: "房屋及附属设施室内装修",
          jinE: "50000",
          beiZhu: "-"
        },
        {
          wu: "室内财产",
          jinE: "30000",
          beiZhu: "-"
        },
        {
          baoZhan: "附加管道破裂及水渍保险",
          wu: "-",
          jinE: "3000",
          beiZhu: "每次事故绝对免赔200元（限额1000元）"
        },
        {
          baoZhan: "附加第三者责任保险",
          wu: "",
          jinE: "10000",
          beiZhu: ""
        },
        {
          baoZhan: "附加家用电器用电安全保险",
          wu: "",
          jinE: "12000",
          beiZhu: "每次事故绝对免赔200元"
        },
        {
          baoZhan: "附加盗抢保险",
          wu: "",
          jinE: "4000",
          beiZhu: "每次事故绝对免赔200元"
        },
        {
          baoZhan: "附加现金、有价证券、金银珠宝盗抢保险",
          wu: "",
          jinE: "1000",
          beiZhu: "每次事故绝对免赔200元"
        },
        {
          baoZhan: "总保额",
          wu: "",
          jinE: "110000",
          beiZhu: ""
        }
      ],
      // 家财产品介绍
      // 20.0万
      tableData3: [
        {
          baoZhan: "火灾、爆炸",
          wu: "房屋及附属设施室内装修",
          jinE: "120000",
          beiZhu: "-"
        },
        {
          wu: "室内财产",
          jinE: "30000",
          beiZhu: "-"
        },
        {
          baoZhan: "附加管道破裂及水渍保险",
          wu: "-",
          jinE: "3000",
          beiZhu: "每次事故绝对免赔300元（限额1000元）"
        },
        {
          baoZhan: "附加第三者责任保险",
          wu: "",
          jinE: "10000",
          beiZhu: "每次事故绝对免赔300元"
        },
        {
          baoZhan: "附加家用电器用电安全保险",
          wu: "",
          jinE: "32000",
          beiZhu: "每次事故绝对免赔200元"
        },
        {
          baoZhan: "附加盗抢保险",
          wu: "",
          jinE: "4000",
          beiZhu: "每次事故绝对免赔200元"
        },
        {
          baoZhan: "附加现金、有价证券、金银珠宝盗抢保险",
          wu: "",
          jinE: "1000",
          beiZhu: "每次事故绝对免赔200元"
        },
        {
          baoZhan: "总保额",
          wu: "",
          jinE: "200000",
          beiZhu: ""
        }
      ],
      // 家财产品介绍 保险条款
      insuranceClause: "",
      // 家财产品介绍 附加条款
      additionalClause: "",
      // 家财产品介绍 个人法律服务内容
      personalClause: "",
      // 公司信息(投保公司)
      companyName: "",
      // 保险有效时间
      effective: "",
      // 未分配保險公司禁止申報
      prohibit: false,
      // 根据保险公司显示方案
      isShowScheme:false
    };
  },
  created() {
    this.insuranceClause = familyClause();
    this.additionalClause = familyAddClause();
    this.personalClause = personalLaw();
    // 调用获取保险产品 方法
    this.getProduct();
    // 调用获取小区信息 方法
    this.getProjec();
    // 调用获取当前公司信息 方法
    this.getProp();
    // 获取当前时间
    this.validityTerm();
  },
  methods: {
    // 获取当前公司信息
    getProp() {
      getPropCompany().then(xhrData => {
        // console.log(xhrData, "公司信息");

        if (xhrData.code === 200) {
          this.companyName = xhrData.data.name;
          // 赋值家财豆
          this.fortuneBean = xhrData.data.fortuneBean;
        }
      });
    },
    // 获取小区信息
    getProjec() {
      getProjectRoleList().then(xhrData => {
        // const arr = []
        // console.log(xhrData);
        if (xhrData.code === 200) {
          // console.log(xhrData, "项目信息");

          this.information = xhrData.rows;
          // 默认选中第一组数据
          if (xhrData.rows.length > 0) {
            // 默认项目名称 第一个
            this.form.nameId = xhrData.rows[0].name;
            this.SubmissionData.projectName = xhrData.rows[0].name;
            this.SubmissionData.pId = xhrData.rows[0].id;
            // 金额
            this.currentMoney = Number(xhrData.rows[0].balance).toFixed(2);
            // 家财豆
            // this.fortuneBean = xhrData,rows[0].fortuneBean
            // 默认第一个项目地址
            // 拼接地址 省市区
            // const ziZhi = this.trim(
            //   xhrData.rows[0].province +
            //     xhrData.rows[0].city +
            //     xhrData.rows[0].county
            // );
            const ziZhi = xhrData.rows[0].area
            // 最后地址结果
            const address = [];
            const arr = xhrData.rows[0].address.split(";");
            for (let i = 0; i < arr.length; i++) {
              address.push(ziZhi + arr[i]);
            }
            this.addressArr = address;
            this.form.address = address[0];
            // 赋值到地址到表单
            this.multipleForm.insEmpApplyUsers[0].houseAddress = address[0];
            this.SubmissionData.projectAddress = address[0];
          }
        }
      });
    },
    // 批量审批时候的 申报按钮
    batchApplyDeclare() {
      const arrData = [];
      const formData = this.formdataArr;
      if (formData.length <= 0) {
        this.$message.warning("请上传文件");
        return;
      }
      for (let i = 0; i < formData.length; i++) {
        if (!isvalidPhone(formData[i].mobileNo)) {
          this.$message.error(`第${i + 1}行，手机号格式错误！`);
          return;
        }
      }
      const SubmissionData = this.SubmissionData;
      // 判断家财保障是否选择多种未选择 默认第一种
      if (SubmissionData.hIds == "") {
        SubmissionData.hIds = this.form.checkbox.join(",");
      }
      for (let i = 0; i < formData.length; i++) {
        // 项目id
        formData[i].pId = SubmissionData.pId;
        // 项目名称
        formData[i].projectName = SubmissionData.projectName;
        // 项目地址
        formData[i].projectAddress = SubmissionData.projectAddress;
        // 投保公司id
        formData[i].icId = SubmissionData.icId;
        // 投保公司名称
        formData[i].icName = SubmissionData.icName;
        // 产品id
        formData[i].hIds = SubmissionData.hIds;
        // 购买方式
        formData[i].type = this.form.type;
      }
      // 选中方案
      const SubmissionDataArr = this.SubmissionData.hIds.split(",");
      var money = 0;
      // 循环列出选中的id
      for (var i = 0; i < SubmissionDataArr.length; i++) {
        // 循环列出所有方案id
        for (var j = 0; j < this.productList.length; j++) {
          //  判断 方案内选中的id
          if (SubmissionDataArr[i] == this.productList[j].id) {
            // 赋值 选中的方案的价格
            money += this.productList[j].insurePremium;
          }
        }
      }
      let money2;
      for (let i = 1; i <= formData.length; i++) {
        money2 = money * i;
      }
      if (money === 0) {
        this.$message({
          type: "warning",
          message: "请选择方案!"
        });
        return;
      }
      var tiTitle;
      if (formData[0].type == "0") {
        tiTitle = `此次申报将会扣除账户${money2}个家财豆, 是否继续?`;
      } else if (formData[0].type == "1") {
        tiTitle = `此次申报将会扣除账户${money2}元, 是否继续?`;
      }

      this.$confirm(tiTitle, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // console.log(formData);
          // 开启加载动画
          const loading = this.$loading({
            lock: true,
            text: "申报中,请稍后...",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)"
          });
          // 请求申报
          houseInsureApplyHouseInsure(formData)
            .then(xhrData => {
              if (xhrData.code === 200) {
                this.$message.success({
                  message: "申报成功!"
                });
                // 关闭 加载动画
                loading.close();
                // 更新小区信息
                this.getProjec();
                // 更新家财豆信息
                this.getProp();
                // 清空表格数据
                this.formdataArr = [];
                // 清空
                this.addressArr = [];
                // this.form.checkbox = this.productList;
                this.form.address = "";
                this.form.nameId = "";
                // 还原为一个表单
                this.multipleForm.insEmpApplyUsers = [
                  {
                    // 房屋地址
                    houseAddress: "",
                    // 门牌号
                    houseNumber: "",
                    // 被保险人手机
                    mobileNo: ""
                  }
                ];
                // 清除上传列表
                this.$refs.upload.clearFiles();
              } else {
                // 关闭 加载动画
                loading.close();
              }
            })
            .catch(() => {
              // 关闭 加载动画
              loading.close();
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消申请"
          });
        });
    },
    // 获取保险产品
    getProduct() {
      const data = {
        insType: "1"
      };
      insRuleGetProduct(data)
        .then(xhrData => {
          // console.log(xhrData);
          if (xhrData.code === 200) {
            // 根据保险公司code 判断显示方案
            // 人保无5.0万方案
            if(xhrData.data.companyCode == 'CNRM'){
              this.isShowScheme  = true
            } 
            this.insCompanyName = xhrData.data.insCompanyName;
            this.productList = xhrData.data.productList;
            // 默认显示 第一种类型
            this.form.checkbox.push(xhrData.data.productList[0].id);
            // 保险公司名称
            this.SubmissionData.icName = xhrData.data.insCompanyName;
            // 保险公司id
            this.SubmissionData.icId = xhrData.data.insCompanyId;
          }
        })
        .catch(() => {
          this.prohibit = true;
        });
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
    // 上传
    handleChange(file, fileList) {
      const param = new FormData();
      param.append("file", file.raw);
      houseInsureImportData(param).then(xhrData => {
        // console.log(xhrData);
        if (xhrData.code === 200) {
          this.formdataArr = xhrData.data;
        }
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
          return houseInsureExportTemplate();
        })
        .then(response => {
          this.download(response.msg);
        })
        .catch(function() {});
    },
    // 上传文件关闭按钮
    onRemove() {
      // 清空表格
      this.formdataArr = [];
    },
    // 申报按钮
    onSubmit(form) {
      const arrData = [];
      const formData = this.multipleForm.insEmpApplyUsers;
      const SubmissionData = this.SubmissionData;
      // 判断家财保障是否选择多种未选择 默认第一种
      if (SubmissionData.hIds == "") {
        SubmissionData.hIds = this.form.checkbox.join(",");
      }
      for (let i = 0; i < formData.length; i++) {
        // 项目id
        formData[i].pId = SubmissionData.pId;
        // 项目名称
        formData[i].projectName = SubmissionData.projectName;
        // 项目地址
        formData[i].projectAddress = SubmissionData.projectAddress;
        // 投保公司id
        formData[i].icId = SubmissionData.icId;
        // 投保公司名称
        formData[i].icName = SubmissionData.icName;
        // 产品id
        formData[i].hIds = SubmissionData.hIds;
        // 购买方式
        formData[i].type = this.form.type;
      }
      const newArr = [];
      // 保存this
      const _this = this;
      // 请求 申报家财险
      this.multipleForm.insEmpApplyUsers.forEach((ele, index) => {
        _this.$refs["multipleForm"][index].validate(valid => {
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
        // 选中方案
        const SubmissionDataArr = this.SubmissionData.hIds.split(",");
        var money = 0;
        // 循环列出选中的id
        for (var i = 0; i < SubmissionDataArr.length; i++) {
          // 循环列出所有方案id
          for (var j = 0; j < this.productList.length; j++) {
            //  判断 方案内选中的id
            if (SubmissionDataArr[i] == this.productList[j].id) {
              // 赋值 选中的方案的价格
              money += this.productList[j].insurePremium;
            }
          }
        }
        let money2;
        // 循环 申报信息
        for (let i = 1; i <= formData.length; i++) {
          money2 = money * i;
        }
        if (money === 0) {
          this.$message({
            type: "warning",
            message: "请选择方案!"
          });
          return;
        }
        let tiTitle;
        if (formData[0].type == "0") {
          tiTitle = `此次申报将会扣除账户${money2}个家财豆, 是否继续?`;
        } else if (formData[0].type == "1") {
          tiTitle = `此次申报将会扣除账户${money2}元, 是否继续?`;
        }
        // const
        // 提示扣除费用
        this.$confirm(tiTitle, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            // 开启加载动画
            const loading = this.$loading({
              lock: true,
              text: "申报中,请稍后...",
              spinner: "el-icon-loading",
              background: "rgba(0, 0, 0, 0.7)"
            });
            houseInsureApplyHouseInsure(formData)
              .then(xhrData => {
                if (xhrData.code === 200) {
                  this.$message.success({
                    message: "申报成功!"
                  });
                  // 关闭 加载动画
                  loading.close();
                  // 更新小区信息
                  this.getProjec();
                  // 更新家财豆信息
                  this.getProp();
                  // 清空表单
                  this.multipleForm.insEmpApplyUsers.forEach((ele, index) => {
                    _this.$refs["multipleForm"][index].resetFields();
                  });
                  // 清空
                  this.addressArr = [];
                  this.form.address = "";
                  this.form.nameId = "";
                  // 还原为一个表单
                  this.multipleForm.insEmpApplyUsers = [
                    {
                      houseAddress: "",
                      houseNumber: "",
                      mobileNo: ""
                    }
                  ];
                } else {
                  // 关闭 加载动画
                  loading.close();
                }
              })
              .catch(() => {
                // 关闭 加载动画
                loading.close();
              });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消申请"
            });
          });
      } else {
        this.$message.warning({
          message: "请填写完整信息"
        });
      }
    },
    // 项目名称下拉框方法
    selectFun1(val) {
      console.log(val);
      
      // 保存当前项目余额
      if (val.balance == null) {
        val.balance = "0.00";
      }
      this.currentMoney = Number(val.balance).toFixed(2);
      // 拼接地址 省市区
      // const ziZhi = this.trim(val.province + val.city + val.county);
      const ziZhi = val.area;
      // 最后地址结果
      const address = [];
      const arr = val.address.split(";");
      for (let i = 0; i < arr.length; i++) {
        address.push(ziZhi + arr[i]);
      }
      this.addressArr = address;
      this.form.address = address[0];
      // 赋值到地址到表单
      this.multipleForm.insEmpApplyUsers[0].houseAddress = address[0];
      // 项目id
      this.SubmissionData.pId = val.id;
      // 项目名称
      this.SubmissionData.projectName = val.name;
      // 默认保存项目地址
      this.SubmissionData.projectAddress = address[0];
    },
    // 项目地址下拉框方法
    selectFun2(val) {
      // console.log(val);

      // this.multipleForm.insEmpApplyUsers[0].houseAddress = val;
      // 项目地址
      this.SubmissionData.projectAddress = val;
      // 清空其他表单
      this.multipleForm.insEmpApplyUsers = [
        {
          // 房屋地址
          houseAddress: val,
          // 门牌号
          houseNumber: "",
          // 被保险人手机
          mobileNo: ""
        }
      ];
    },
    // 复选框选中
    selection(val) {
      const str = val.join(",");
      this.SubmissionData.hIds = str;
    },
    // 添加地址
    addAddress() {
      this.multipleForm.insEmpApplyUsers.push({
        // 房屋地址
        houseAddress: this.SubmissionData.projectAddress,
        // houseAddress: "",
        // 门牌号
        houseNumber: "",
        // 被保险人手机
        mobileNo: ""
      });
    },
    // 删除地址
    removeDomain(item) {
      var index = this.multipleForm.insEmpApplyUsers.indexOf(item);
      if (index !== -1) {
        this.multipleForm.insEmpApplyUsers.splice(index, 1);
      }
    },
    // 去除前后空格
    trim(value) {
      return value.replace(/(^\s*)|(\s*$)/g, "");
    },
    // 表格控制
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      // 设置要合并的行和要合并的列
      if (rowIndex === 0 && columnIndex === 0) {
        // 分别代表合并的行数和列数
        return [2, 1];
      } else if (rowIndex === 1 && columnIndex === 0) {
        // 分别代表合并的行数和列数，设为0则直接不显示
        return [0, 0];
      }
    },
    // 保险有效期时间处理
    validityTerm() {
      // 保险有效期 次月1日~次月1号+365天 规则
      let nowData = new Date();
      // console.log(nowData);

      let date = {
        year: nowData.getFullYear(),
        month: nowData.getMonth() + 2,
        date: nowData.getDate()
      };
      const endTime = {
        year: date.year + 1,
        month: date.month - 1
      };
      if (date.month == "13") {
        date.year = date.year + 1;
        date.month = 1;
        endTime.year = endTime.year + 1;
      }

      endTime.date = mGetDate(endTime.year, endTime.month);
      function mGetDate(year, month) {
        var d = new Date(year, month, 0);
        return d.getDate();
      }

      this.effective =
        date.year +
        "年" +
        date.month +
        "月" +
        "1号 ~ " +
        endTime.year +
        "年" +
        endTime.month +
        "月" +
        endTime.date +
        "号";
    },
    // 购买方式触发
    purchasing(val) {
      // console.log(val);
      // 判断是家财豆方式还是余额方式 0家财豆 1余额
      if (val == 0) {
        this.isShow = false;
      } else if (val == 1) {
        this.isShow = true;
      }
    },
    prohibitBtn() {
      // console.log(1);
    }
  }
};
</script>

<style>
#guarantee .el-form-item {
  width: 100%;
}
#guarantee .el-select {
  width: 500px !important;
}
#guarantee .el-form-item .el-input--medium {
  width: 500px;
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
.currentMoney .el-input.el-input--medium.is-disabled {
  width: 100% !important;
}
#guarantee .el-input.is-disabled .el-input__inner {
  color: rgb(228, 119, 119);
  font-weight: bold;
}
</style>
<style lang="scss" scoped>
.guarantee {
  width: 100%;
  padding: 15px;
  min-height: calc(88vh);
  box-sizing: border-box;
  background-color: #e6e8eb;
  padding-bottom: 30px;
  .guarantee-conter {
    min-height: calc(88vh);
    background-color: #fff;
    padding: 25px;
    box-sizing: border-box;
    border-radius: 5px;
    .multipleForm {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      .multipleForm-box {
        padding: 10px 0;
        flex: auto;
        margin-right: 10px;
      }
    }
    .currentMoney {
      color: #f5222d;
      // margin-left: 10px;
      span {
        margin-left: 5px;
      }
    }
    .guarantee-bot {
      // margin-left: -80px;
      padding-top: 25px;
      border-top: 1px solid #dddddd;
      box-sizing: border-box;
      display: flex;
      margin-top: 15px;
      a.guarantee-btn {
        display: block;
        width: 130px;
        height: 44px;
        border-radius: 4px;
        text-align: center;
        line-height: 44px;
        font-size: 16px;
      }
      a.guarantee-btn.btn1 {
        background: linear-gradient(
          270deg,
          rgba(248, 184, 0, 1) 0%,
          rgba(239, 130, 0, 1) 100%
        );
        color: #fff;
      }
      a.guarantee-btn.btn2 {
        border: 1px solid rgba(0, 0, 0, 0.25);
      }
      a.guarantee-btn.prohibitbtn1 {
        background: linear-gradient(
          270deg,
          rgba(248, 184, 0, 1) 0%,
          rgba(239, 130, 0, 1) 100%
        );
        color: #fff;
        cursor: no-drop;
      }
      a.guarantee-btn.btn2.ml {
        margin-left: 20px;
      }
      a.guarantee-btn.btn2.ml.prohibitbtn2 {
        margin-left: 20px;
        cursor: no-drop;
      }
    }
    #form {
      .el-form-item__label {
        width: 120px;
      }
      .guarantee-p {
        color: #606266;
        font-weight: bold;
      }
      .addInsuranceBtn {
        padding-top: 20px;
        box-sizing: border-box;
      }
      .guarantee-box {
        display: flex;
        justify-content: space-between;
        .guarantee-box-right {
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
      p.guarantee-pdtop {
        margin-top: 0;
        span {
          margin-left: 30px;
        }
      }
      .guarantee-dialog-main {
        height: 550px;
        overflow: auto;
        padding: 0 10px;
        padding-bottom: 20px;
        box-sizing: border-box;
        h3 {
          padding: 10px 0;
          box-sizing: border-box;
        }
      }
    }
    p {
      font-size: 14px;
      color: #828282;
      margin-top: 25px;
      span {
        margin-left: 60px;
      }
    }
    .guarantee-top {
      margin-top: 40px;
      h4 {
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
    .batchData {
      padding-top: 20px;
      box-sizing: border-box;
    }
  }
}
</style>
<template>
  <!-- 充值 -->
  <div class="recharge">
    <div class="recharge-conter">
      <p>说明：家财豆只能用于购买家财险，不支持退款</p>
      <!-- 充值物业 -->
      <div v-if="propertyShow">
        <div class="recharge-top">
          <h4>
            充值物业
            <!-- <span>?</span> -->
          </h4>
        </div>
        <el-table :data="propertyData" style="width: 100%">
          <el-table-column show-overflow-tooltip prop="name" label="项目名称" min-width="200px"></el-table-column>
          <el-table-column show-overflow-tooltip prop="invoiceTitle" label="发票抬头" min-width="200px"></el-table-column>
          <el-table-column show-overflow-tooltip prop="balance" label="当前余额" min-width="200px"></el-table-column>
        </el-table>
      </div>
      <!-- 充值项目 -->
      <div>
        <div class="recharge-top">
          <h4>
            项目余额
            <!-- <span>?</span> -->
          </h4>
        </div>
        <!-- <div @click="openData">查看</div> -->
        <el-table :data="balanceData" style="width: 100%">
          <el-table-column
            align="center"
            show-overflow-tooltip
            prop="propLength"
            label="项目数量"
            min-width="200px"
          ></el-table-column>
          <el-table-column align="center" show-overflow-tooltip label="操作" min-width="200px">
            <template>
              <el-button size="mini" type="text" icon="el-icon-view" @click="openData">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页 -->
      <!-- <el-pagination
        style="padding:10px 0;position:static !important;"
        @size-change="handleSizeChange2"
        @current-change="handleCurrentChange2"
        :current-page="pageNum2"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="pageSize2"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNum2"
      ></el-pagination>-->
      <!-- 购买家财豆 -->
      <div v-if="propertyShow">
        <div class="recharge-top">
          <h4>
            购买家财豆
            <!-- <span>?</span> -->
            <!-- <a
              href="javascript:;"
              style="color:#0179FE;font-size:14px;margin-left:30px;"
              @click="dialogVisible3=true"
            >产品说明</a>-->
          </h4>
        </div>
        <el-table :data="propertyData" style="width: 100%">
          <el-table-column show-overflow-tooltip prop="name" label="购买账号" min-width="200px"></el-table-column>
          <el-table-column show-overflow-tooltip prop="invoiceTitle" label="发票抬头" min-width="200px"></el-table-column>
          <el-table-column show-overflow-tooltip prop="fortuneBean" label="当前数量" min-width="150px"></el-table-column>
          <el-table-column show-overflow-tooltip label="操作" min-width="220px">
            <template slot-scope="scope">
              <a
                href="javascript:;"
                style="margin-left:3px;color: #1890ff;"
                @click="beanTransfer(scope.row)"
                v-hasPermi="['bean:transform:add']"
              >余额转换</a> |
              <a
                href="javascript:;"
                style="margin-left:3px;color: #1890ff;"
                @click="beanRecord(scope.row)"
                v-hasPermi="['bean:transform:list']"
              >转换记录</a>
            </template>
          </el-table-column>
        </el-table>
        <div style="padding-top:15px;" v-show="isShowVal">
          <span>是否需要开票:</span>
          <el-switch
            class="switchStyle"
            v-model="value1"
            active-color="#7958b5"
            active-text="是"
            inactive-color="#666"
            inactive-text="否"
          ></el-switch>
        </div>
      </div>
      <p>充值说明：充值金额只能用于平台产品消费，不能退款 。</p>
      <div class="recharge-top">
        <h4>
          发起交易
          <!-- <span>?</span> -->
        </h4>
      </div>
      <el-form
        style="width:600px"
        :rules="rules"
        id="recharge-form"
        ref="form"
        :model="form"
        label-width="120px"
      >
        <el-form-item label="交易类型:">
          <el-radio-group @change="transaction" v-model="form.type2">
            <el-radio label="1">充值</el-radio>
            <el-radio :disabled="!propertyShow" label="2">购买家财豆</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="propertyShow" prop="type3" label="账户充值:">
          <el-select
            :disabled="isChoice"
            value-key="id"
            @change="projectType"
            v-model="form.type3"
            placeholder="请选择项目"
          >
            <el-option label="公司账户" value="1"></el-option>
            <el-option label="项目账户" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="pId" label="标的:">
          <el-select value-key="id" @change="getIdType" v-model="form.pId" placeholder="请选择项目">
            <el-option
              v-for="item in (is_Prop_Proj && (propertyShow) ?propertyData:tableData)"
              :key="item.id"
              :label="item.name"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="!isNumInput" prop="amount" label="金额:">
          <el-input @blur="getAmount1($event)" style="width:60%" v-model.trim="form.amount"></el-input>
        </el-form-item>
        <el-form-item v-if="isNumInput" prop="amount" label="金额:">
          <el-input @blur="getAmount2($event)" style="width:60%" v-model.trim="form.amount"></el-input>
        </el-form-item>
        <el-form-item label="支付类型:">
          <el-radio-group v-model="form.type">
            <div class="recharge-p">
              <el-radio label="3">支付宝支付</el-radio>
              <div class="recharge-ewm">
                <!-- <img :src="qcCode" alt=""/> -->
              </div>
            </div>
            <div class="recharge-p">
              <el-radio label="2">微信支付</el-radio>
              <div class="recharge-ewm">
                <!-- <img :src="'data:image/png;base64,'+qcCode" alt="" /> -->
              </div>
            </div>
            <p class="recharge-p">
              <el-radio label="1">银行转账</el-radio>
              <span>（ 注：线下转账成功后请致电400 055 5151，以方便财务确认。）</span>
              <span
                class="recharge-p-span"
                v-for="(item,index) in masg"
                :key="index+99"
              >{{item.nei}}</span>
            </p>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-show="isBean" label="是否开票:">
          <el-switch
            class="switchStyle"
            v-model="value1"
            active-color="#7958b5"
            active-text="是"
            inactive-color="#666"
            inactive-text="否"
            @change="getSwitch"
          ></el-switch>
        </el-form-item>
        <el-form-item v-show="isTitle" label="发票抬头:">
          <!-- <el-input disabled v-model="form.invoiceTitle"></el-input> -->
          <el-select value-key="id" v-model="form.invoiceTitleItem" placeholder="请选择">
            <el-option
              v-for="(item) in invoiceData"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="recharge-bottom">
        <div class="recharge-btn" v-hasPermi="['finace:money:add']" @click="rechargeBtn">充值</div>
      </div>
    </div>
    <!-- 项目余额 -->
    <el-dialog @close="closeDialog5" title="项目余额" class="seeDialog" :visible.sync="dialogVisible5" width="650px">
      <el-form
        :model="rbalanceForm"
        ref="rbalanceForm"
        label-width="100px"
        class="demo-ruleForm"
        label-position='left'
        @submit.native.prevent
      >
      <el-form-item label="账户名称:">
        <el-input @keyup.enter.native='query' style="width:200px" v-model="rbalanceForm.name"></el-input>
         <el-button type="info" plain @click="query">查询</el-button>
      </el-form-item>
      </el-form>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column show-overflow-tooltip prop="name" label="账户名称" min-width="150px"></el-table-column>
        <el-table-column show-overflow-tooltip prop="invoiceTitle" label="发票抬头" min-width="200px"></el-table-column>
        <el-table-column show-overflow-tooltip prop="balance" label="当前余额" min-width="100px"></el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        style="padding:10px 0;position:static !important;"
        @size-change="handleSizeChange2"
        @current-change="handleCurrentChange2"
        :current-page="pageNum2"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="pageSize2"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNum2"
      ></el-pagination>
      <span slot="footer" class="dialog-footer">
        <a href="javascript:;" class="btn btn2" @click="dialogVisible5 = false">关 闭</a>
      </span>
    </el-dialog>
    <!-- 家财豆余额转移对话框 -->
    <el-dialog
      @close="closeDialog"
      title="余额转换"
      class="seeDialog"
      :visible.sync="dialogVisible1"
      width="600px"
    >
      <el-form
        :model="ruleForm"
        ref="ruleForm"
        :rules="ruleFormRules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="当前物业:">
          <span>{{gsName}}</span>
        </el-form-item>
        <el-form-item label="当前余额:">
          <span>{{gsBalance}}</span>
        </el-form-item>
        <el-form-item label="转换金额:" prop="number">
          <el-row>
            <el-col :span="22">
              <el-input
                maxlength="9"
                @blur="blurText($event)"
                v-model.number.trim="ruleForm.number"
              ></el-input>
            </el-col>
            <el-col :span="1">
              <span style="margin-left:5px">元</span>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="转换数量:">
          <el-row>
            <el-col :span="22">
              <el-input v-model="ruleForm.number" :disabled="true"></el-input>
            </el-col>
            <el-col :span="1">
              <span style="margin-left:5px">个</span>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <a href="javascript:;" class="btn btn1" @click="beanTransferBtn">转 移</a>
        <a href="javascript:;" class="btn btn2" @click="dialogVisible1 = false">取 消</a>
      </span>
    </el-dialog>
    <!-- 家财豆转换记录 -->
    <el-dialog title="转换记录" class="seeDialog" :visible.sync="dialogVisible2" width="800px">
      <h4
        style="padding-bottom:10px"
      >当前{{currentName}},合计转换{{totalNumber}}.00元,总转换数量{{totalNumber}}个</h4>
      <el-table :data="recordTableData" style="width: 100%">
        <el-table-column show-overflow-tooltip type="index" label="序号" width="80"></el-table-column>
        <el-table-column show-overflow-tooltip prop="orderNo" label="订单号" min-width="120px"></el-table-column>
        <el-table-column show-overflow-tooltip prop="amount" label="转换金额(元)" min-width="70px"></el-table-column>
        <el-table-column show-overflow-tooltip prop="number" label="转换数量(个)" min-width="70px"></el-table-column>
        <el-table-column show-overflow-tooltip prop="createTime" label="转换时间" min-width="120px"></el-table-column>
        <el-table-column show-overflow-tooltip prop="createName" label="操作用户" min-width="80px"></el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNum"
        style="padding-top:20px;position:static !important;"
      ></el-pagination>
      <span slot="footer" class="dialog-footer">
        <a href="javascript:;" class="btn btn2" @click="dialogVisible2 = false">关 闭</a>
      </span>
    </el-dialog>
    <!-- 家财豆产品说明 -->
    <el-dialog title="家财豆产品介绍" class="seeDialog" :visible.sync="dialogVisible3" width="800px">
      <span slot="footer" class="dialog-footer">
        <a href="javascript:;" class="btn btn2" @click="dialogVisible3 = false">关 闭</a>
      </span>
    </el-dialog>
    <!-- 支付弹框 -->
    <el-dialog
      @close="closeDialog2"
      id="paymentDialog"
      title="支付页面"
      :visible.sync="dialogVisible4"
      width="400px"
    >
      <div class="paymentDialog-box">
        <div class="paymentDialog-box-wrap">
          <img class="paymentDialog-box-img1" :src="is_ZFB_and_WX ? ZFB_img : WX_img" alt />
        </div>
        <div class="paymentDialog-box-wrap">
          <img class="paymentDialog-box-img2" :src="'data:image/png;base64,'+qcCode" alt />
        </div>
        <div class="paymentDialog-box-wrap">
          <img class="paymentDialog-box-img3" :src="is_ZFB_and_WX ? ZFB_SAO_img : WX_SAO_img" alt />
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button type="primary" @click="dialogVisible4 = false">确 定</el-button> -->
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  // queryProjectList,
  getProjectRoleList,
  userRegister,
  queryProjectAndAccountDetail,
  getProjectInformation,
  transferAmount,
  getPropCompany,
  financeBeanTransformBean,
  financeBeanGetTransformList,
  financeQueryPayOrderResult,
  queryInvoiceList
} from "@/api/information/information";
import { isNumber } from "@/validate/validate";
export default {
  inject: ["reload"],
  name: "recharge",
  data() {
    // 验证金额
    let validateMoney1 = (rule, value, callback) => {
      if (this.form.amount === "") {
        callback(new Error("请输入金额"));
      } else if (!isNumber(this.form.amount)) {
        callback(new Error("请输入正确数字"));
      } else {
        callback();
      }
    };
    // 验证金额
    let validateMoney2 = (rule, value, callback) => {
      if (this.ruleForm.number === "") {
        callback(new Error("请输入金额"));
      } else if (!isNumber(this.ruleForm.number)) {
        callback(new Error("请输入正确数字"));
      } else {
        callback();
      }
    };
    return {
      balanceData: [
        {
          propLength: "0"
        }
      ],
      // 支付弹框
      dialogVisible4: false,
      // 公司名称
      gsName: "",
      // 当前余额
      gsBalance: "",
      // 是否开票
      value1: false,
      // 控制是否显示开关
      isShowVal: false,
      // 控制显示提示不能少于1000
      isShowNum: false,
      // 用户类型显示页面
      propertyShow: false,
      // 充值
      formRecharge: {
        // 充值类型
        type: "",
        // 金额
        amount: "",
        // 账户ID
        aId: "",
        // 项目ID
        pId: "",
        // 项目名称
        pNmae: ""
      },
      // 对话框
      dialogFormVisible: false,
      // 家财豆余额转换对话框
      dialogVisible1: false,
      // 家财豆转移记录
      dialogVisible2: false,
      // 家财豆产品介绍
      dialogVisible3: false,
      dialogVisible5: false,
      // 当前余额
      balance: "",
      // 传递表单
      serForm: {
        // 当前项目
        out_name: "",
        // 目标项目
        in_name: "",
        // 转出金额
        amount: "",
        // 转入项目id
        in_id: ""
      },
      // 表单数据
      jinEForm: {
        // 当前项目
        out_name: "",
        // 目标项目
        in_name: "",
        // 转出金额
        amount: "",
        // out_id
        out_id: "",
        // in_idName:'',
        // 转入项目id
        in_id: ""
      },
      // 表单验证
      // rules: {
      //   // 转入项目id
      //   in_idName: [
      //     { required: true, message: "请选择目标项目", trigger: "change" }
      //   ],
      //   // 转出金额
      //   amount: [{ required: true, message: "请输入金额", trigger: "blur" }]
      // },
      recharge: "",
      form: {
        // 充值类型
        type2: "1",
        // 支付类型
        type: "3",
        type3: "1",
        amount: "",
        pId: "",
        invoiceTitleItem: ""
      },
      masg: [
        {
          nei: "户　名：物保宝科技服务（广东）有限公司"
        },
        {
          nei: "账　号：4000093409100307911"
        },
        {
          nei: "开户行：中国工商银行股份有限公司深圳高新园北区支行"
        }
      ],
      // 表单验证
      rules: {
        amount: [
          { required: true, validator: validateMoney1, trigger: "blur" }
        ],
        pId: [{ required: true, message: "请选择目标项目", trigger: "change" }],
        type3: [
          { required: true, message: "请选择目标项目", trigger: "change" }
        ]
      },
      ruleFormRules: {
        number: [{ required: true, validator: validateMoney2, trigger: "blur" }]
      },
      // 表格数据
      tableData: [],
      // 保存金额数据
      amountData: [],
      // selectList:[]
      //
      rowData: {},
      // 物业信息数据
      propertyData: [],
      // 家财豆金额转换
      ruleForm: {},
      // 转换记录列表数据
      recordTableData: [],
      // 家财豆转换记录查看
      // 当前显示条数
      pageSize: 10,
      // 当前显示页数
      pageNum: 1,
      // 总条数
      totalNum: 1,
      // 当前显示条数
      pageSize2: 10,
      // 当前显示页数
      pageNum2: 1,
      // 总条数
      totalNum2: 1,
      // 家财豆转换记录
      // 当前公司
      currentName: "",
      // 总转换家财豆
      totalNumber: 0,
      // 提交的数据
      pushForm: {},
      // 家财豆才有开票
      isBean: false,
      // 发票抬头
      isTitle: false,
      //
      qcCode: "",
      // 支付宝图片
      ZFB_img: require("../../../../assets/image/zfb_zf.jpg"),
      ZFB_SAO_img: require("../../../../assets/image/zfb_sao.png"),
      // 微信图片
      WX_img: require("../../../../assets/image/wx_zf.png"),
      WX_SAO_img: require("../../../../assets/image/wx_sao.png"),
      // 显示支付宝还是微信
      is_ZFB_and_WX: true,
      // 定时器
      timing: "",
      // 显示物业信息或项目信息
      is_Prop_Proj: true,
      // 项目类型
      tableDataArr: [],
      // 控制是否可选
      isChoice: false,
      invoiceData: [],
      // 切换金额输入框
      isNumInput: false,
      rbalanceForm:{}
    };
  },
  created() {
    // 判断 是物业用户 还是 项目用户 所看到页面
    if (this.$store.state.user.userType == "01") {
      this.propertyShow = true;
    } else if (this.$store.state.user.userType == "02") {
      this.propertyShow = false;
    } else {
      this.propertyShow = true;
    }
    // 获取项目信息
    this.getProjectList();
    // 获取物业公司信息
    this.getPropCompanyData();
    // this.getPropProjData();
    this.getInvoiceList();
  },

  methods: {
    openData() {
      this.dialogVisible5 = true;
    },
    // 获取发票抬头信息
    getInvoiceList() {
      // 请求 发票抬头信息
      const page = {
        pageSize: 9999,
        pageNum: 1,
        recipient: "",
        type: "",
        title: ""
      };
      queryInvoiceList(page).then(xhrData => {
        if (xhrData.code === 200) {
          let wholeDataL = [];
          wholeDataL = xhrData.rows;
          wholeDataL.forEach(item => {
            // 专票
            if (item.type == "1") {
              this.invoiceData.push({
                title: item.title,
                id: item.id
              });
            }
            // // 普票
            // else if (item.type == "2") {
            //   this.ordinaryData.push({
            //     title: item.title,
            //     id: item.id
            //   });
            // }
          });
        }
      });
    },
    // 获取物业和项目的信息
    //  async getPropProjData() {
    //     await this.getProjectList()
    //     await this.getPropCompanyData()
    //   },
    // 提取公用 查询项目账户列表
    getProjectList(obj) {
      // 请求获取项目账户列表
      const page = {
        pageNum:obj == undefined ? this.pageNum2 : obj.pageNum,
        pageSize:obj  == undefined ? this.pageSize2 :  obj.pageSize,
        name:obj  == undefined ? this.rbalanceForm.name : obj.name
      };
      getProjectRoleList(page).then(xhrData => {
        if (xhrData.code === 200) {
          this.tableData = xhrData.rows;
          console.log(xhrData);
          // totalRecord
          this.totalNum2 = xhrData.total;
          this.balanceData[0].propLength = this.totalNum2;
          // this.tableDataArr = this.tableData.concat();
          // this.selectList = xhrData.data
          for (var i = 0; i < this.tableData.length; i++) {
            this.tableData[i].balance = Number(this.tableData[i].balance);
            // this.tableData[i].balance = Number(
            //   this.tableData[i].balance
            // ).toFixed(2);
          }
          this.$forceUpdate();
          // console.log(1);
        }
      });
    },
    // 获取物业公司信息
    getPropCompanyData() {
      // 清空之前数据
      this.propertyData = [];
      getPropCompany().then(xhrData => {
        if (xhrData.code === 200) {
          // xhrData.data.balance = xhrData.data.balance.toFixed(2);
          xhrData.data.balance = xhrData.data.balance;
          this.propertyData.push(xhrData.data);
          // this.tableDataArr.unshift(xhrData.data);
          this.$forceUpdate();
        }
        // console.log(2);
      });
    },
    // 判断是否开票 是否显示发票抬头
    getSwitch(val) {
      // console.log(val);
      this.isTitle = val;
    },
    // 关闭对话框
    resetForm() {
      // 清空表单
      this.$nextTick(() => {
        this.$refs["jinEForm"].resetFields();
      });
    },
    // 项目选择
    getIdType(val) {
      // console.log(val);
      this.pushForm.pId = "" + val.id;
      this.pushForm.aId = "" + val.accountId;
      this.pushForm.pName = val.name;
      // console.log(this.form.type2);
      if (this.form.type2 == "1") {
        if (val.remark == "物业用户") {
          this.pushForm.isProject = "0";
        } else {
          this.pushForm.isProject = "1";
        }
      } else if (this.form.type2 == "2") {
        this.pushForm.isProject = "2";
        this.form.invoiceTitle = val.invoiceTitle;
      }
    },
    // 交易类型触发
    transaction(val) {
      // console.log(val);
      this.isTitle = false;
      this.form.amount = "";
      // // val == 1 充值类型
      if (val == "1") {
        // 是否开票按钮
        this.isNumInput = false;
        this.isBean = false;
        this.value1 = false;
        this.pushForm.isProject = "0";
        this.is_Prop_Proj = true;
        this.isChoice = false;
        this.form.type3 = "1";
      }
      // 购买家财豆类型
      else if (val == "2") {
        // 是否开票按钮
        this.isNumInput = true;
        this.isBean = true;
        this.pushForm.isProject = "2";
        this.is_Prop_Proj = true;
        this.isChoice = true;
        this.form.type3 = "1";
      }
    },
    // 家财豆余额转换
    beanTransfer(row) {
      // 打开家财豆余额转换对话框
      this.dialogVisible1 = true;
      // 赋值
      this.gsName = row.name;
      this.gsBalance = row.balance;
    },
    // 家财豆金额转换 确认转移
    beanTransferBtn() {
      // console.log(this.ruleForm.number,'家财豆转移');
      if (this.ruleForm.number == undefined || this.ruleForm.number == "") {
        this.$message.warning({
          message: "请输入金额~!"
        });
        return;
      }
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          // alert('submit!');
          financeBeanTransformBean(this.ruleForm).then(xhrData => {
            // console.log(xhrData);
            if (xhrData.code === 200) {
              this.$message.success({
                message: "转换成功!"
              });
              // 关闭对话框
              this.dialogVisible1 = false;
              //更新列表
              this.getPropCompanyData();
              // this.getPropProjData();
              // 清空表单
              this.ruleForm = {};
            }
          });
        } else {
          // console.log("error submit!!");
          return false;
        }
      });
      // this.$refs['ruleForm'].resetFields()
    },
    // 家财豆转移记录
    beanRecord(row) {
      // console.log(row);
      this.currentName = row.name;
      // 打开家财豆转移记录对话框
      this.dialogVisible2 = true;
      // 调用方法 获取家财豆记录列表
      this.getTransformList();
    },
    // 获取 家财豆转换记录列表方法
    getTransformList() {
      // 请求 获取家财豆转换记录
      const page = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      };
      financeBeanGetTransformList(page).then(xhrData => {
        // console.log(xhrData);
        if (xhrData.code === 200) {
          this.recordTableData = xhrData.rows;
          if (this.recordTableData.length <= 0) return;
          // 总转换数量
          this.totalNumber = this.recordTableData[0].totalNumber;
          // 总条数
          this.totalNum = xhrData.total;
          this.recordTableData.forEach(item => {
            // item.amount = item.amount.toFixed(2);
            item.amount = item.amount;
          });
        }
      });
    },
    // 关闭家财豆转换对话框
    closeDialog() {
      // 清空表单
      this.ruleForm = {};
    },
    // 关闭 支付弹出框
    closeDialog2() {
      // 关闭定时器
      clearInterval(this.timing);
      // 关闭支付二维码弹窗
      this.dialogVisible4 = false;
    },
    // 充值按钮
    rechargeBtn() {
      const arr = [];
      delete this.pushForm.invoice;
      delete this.pushForm.amount;
      delete this.pushForm.number;
      delete this.pushForm.invoiceTitleId;
      delete this.pushForm.invoiceId;
      // 充值
      if (this.form.type2 == "1") {
        this.pushForm.type = this.form.type;
        this.pushForm.amount = "" + this.form.amount;
        arr.push(this.pushForm);
      }
      // 购买家财豆
      else if (this.form.type2 == "2") {
        this.pushForm.type = this.form.type;
        this.pushForm.number = "" + this.form.amount;
        // 判断是否需要开票 0需要 1不需要
        if (this.value1) {
          this.pushForm.invoice = "0";
          this.pushForm.invoiceId = this.form.invoiceTitleItem;
          if (this.pushForm.invoiceId == "") {
            this.$message.warning("请选择发票抬头");
            return;
          }
        } else {
          this.pushForm.invoice = "1";
        }
        arr.push(this.pushForm);
      }
      console.log(arr, "值");
      // 表单验证
      this.$refs["form"].validate(valid => {
        // 通过表单验证
        if (valid) {
          // // alert('submit!');
          // 微信支付
          if (arr[0].type == "2") {
            this.WX_img = require("../../../../assets/image/wx_zf.png");
            this.WX_SAO_img = require("../../../../assets/image/wx_sao.png");
            this.is_ZFB_and_WX = false;
          }
          // 支付宝支付
          else if (arr[0].type == "3") {
            this.ZFB_img = require("../../../../assets/image/zfb_zf.jpg");
            this.ZFB_SAO_img = require("../../../../assets/image/zfb_sao.png");
            this.is_ZFB_and_WX = true;
          }
          console.log(arr);
          
          if (arr[0].type != "1") {
            // 请求充值
            userRegister(arr)
              .then(xhrData => {
                if (xhrData.code === 200) {
                  this.$nextTick(() => {
                    // this.qrCode = 'data:image/png;base64,' + xhrData.data;
                    this.qcCode = xhrData.data.qrCodeBase64Img;
                    // 打开支付框
                    this.dialogVisible4 = true;
                  });
                  const arr2 = [];
                  let type = "";
                  if (arr[0].type == "2") {
                    type = "1";
                  } else if (arr[0].type == "3") {
                    type = "2";
                  }
                  arr2.push({
                    payProductType: type,
                    orderNo: xhrData.data.orderNo
                  });
                  return arr2;
                }
              })
              .then(arr2 => {
                // console.log(arr2, "arr");
                let _this = this;
                _this.timing = setInterval(() => {
                  financeQueryPayOrderResult(arr2).then(xhrData2 => {
                    // console.log(xhrData2);
                    if (xhrData2.code === 200) {
                      // 待支付
                      if (xhrData2.data.showQrCodeFlag == "TRUE") {
                        setTimeout(() => {
                          // _this.$message({
                          //   message: "重新充值~！",
                          //   type: "warning"
                          // });
                          // 关闭定时器
                          clearInterval(_this.timing);
                          // 关闭支付二维码弹窗
                          this.dialogVisible4 = false;
                        }, 60000 * 3);
                      }
                      // 已支付
                      else if (xhrData2.data.showQrCodeFlag == "FALSE") {
                        // 提示
                        this.$message({
                          message: "充值成功~！",
                          type: "success"
                        });
                        // 关闭定时器
                        clearInterval(_this.timing);
                        // 关闭支付二维码弹窗
                        this.dialogVisible4 = false;
                        // 还原表单
                        this.form = {
                          // 充值类型
                          type2: "1",
                          // 支付类型
                          type: "3",
                          amount: "",
                          pId: ""
                        };
                        this.isBean = false;
                        this.value1 = false;
                        // 恢复项目选择
                        this.is_Prop_Proj = true;
                        this.$forceUpdate();
                        // 更新项目信息
                        this.getProjectList();
                        // // 更新物业信息
                        this.getPropCompanyData();

                        this.$refs["form"].resetFields();
                        // this.getPropProjData();
                        return;
                      }
                    }
                  });
                  // console.log(1);
                }, 2000);
              });
          } else {
            const _this = this;
            // console.log(arr);
            const loading = this.$loading({
              lock: true,
              text: "提交中,请稍后...",
              spinner: "el-icon-loading",
              background: "rgba(0, 0, 0, 0.7)"
            });
            userRegister(arr).then(xhrData => {
              // console.log(xhrData);
              if (xhrData.code === 200) {
                _this.$message(
                  {
                    message: "提交成功，等待审核~！",
                    type: "success"
                  },
                  3000
                );
                loading.close();
                // 还原表单
                this.form = {
                  // 充值类型
                  type2: "1",
                  // 支付类型
                  type: "3",
                  amount: "",
                  pId: ""
                };
                this.isBean = false;
                this.value1 = false;
                this.isChoice = false;
                this.isNumInput = false;
                this.form.type3 = "1";
                // 清空表单验证
                this.$refs["form"].resetFields();
                this.$forceUpdate();
                // 恢复项目选择
                this.is_Prop_Proj = true;
                // 更新项目信息
                this.getProjectList();
                // 更新物业信息
                this.getPropCompanyData();
                // this.getPropProjData();
              }
            });
          }
        } else {
          // console.log("error submit!!");
          // this.$message({
          //   message: "请完善信息~！",
          //   type: "warning"
          // });
          return false;
        }
      });
    },
    // 余额转移
    balancTransfer(row) {
      this.serForm.out_id = row.accountId;
      // 获取 查询项目以及账户明细
      getProjectInformation(row.id).then(xhrData => {
        // 打开对话框
        this.dialogFormVisible = true;
        // 当前项目
        this.jinEForm.out_name = xhrData.data.name;
        // 当前余额
        // this.balance = Number(xhrData.data.balance).toFixed(2);
        this.balance = Number(xhrData.data.balance);
      });
    },
    // 确认转移
    transfer(jinEForm) {
      this.$refs[jinEForm].validate(valid => {
        if (valid) {
          this.serForm.out_name = this.jinEForm.out_name;
          this.serForm.amount = this.jinEForm.amount;
          this.serForm.in_name = this.jinEForm.in_name;
          this.serForm.in_id = this.jinEForm.in_id;
          // alert("submit!");
          // 加载中动画
          const loading = this.$loading({
            lock: true,
            text: "转移中,请稍后!",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)"
          });
          // 金额转移提交 请求
          transferAmount(this.serForm).then(xhrData => {
            if (xhrData.code === 200) {
              this.$message.success({
                message: "转移成功!"
              });
              // 关闭对话框
              this.dialogFormVisible = false;
              // 关闭 加载动画
              loading.close();
            } else {
              // 关闭 加载动画
              loading.close();
            }
          });
        } else {
          this.$message.warning({
            message: "请输入完全!"
          });
          return false;
        }
      });
    },
    handleInput2(e) {
      // 通过正则过滤小数点后两位
      e.target.value = e.target.value.match(/^\d*(\.?\d{0,1})/g)[0] || null;
    },
    selectGet(val) {
      this.jinEForm.in_id = val.accountId;
    },
    // 转移记录
    toJiLu(row) {
      this.$router.push({ name: "Transfer", params: row });
    },
    // 限制输入正整数
    blurText(e) {
      let str = e.target.value;
      if (str == 0) {
        this.ruleForm.number = "";
      }
      // if (str.indexOf("-") != -1 || str.indexOf(".") != -1) {
      //   this.$message.warning("请输入正整数");
      //   e.target.value = "";
      //   this.ruleForm.number = "";
      // }
      // let str = e.target.value;
      // if (str.indexOf("-") != -1 || str.indexOf(".") != -1) {
      //   this.$message.warning("请输入正整数");
      //   e.target.value = "";
      //   this.ruleForm.number = "";
      // }
    },
    // 家财豆数量输入 不得低于1000
    blurTextBean(e) {
      // console.log(e.target.value);
      if (e.target.value == "") {
        this.isShowNum = false;
      } else if (parseInt(e.target.value) >= 1000) {
        this.isShowVal = true;
        this.isShowNum = false;
      } else if (parseInt(e.target.value) < 1000) {
        this.isShowVal = false;
        this.isShowNum = true;
      }
    },
    handleSizeChange(val) {
      // 注意：在改变每页显示的条数时，要将页码显示到第一页
      this.pageNum = 1;
      // 改变每页显示的条数
      this.pageSize = val;
      this.getTransformList();
    },
    handleCurrentChange(val) {
      // 改变默认的页数
      this.pageNum = val;
      this.getTransformList();
    },
    handleSizeChange2(val) {
      // 注意：在改变每页显示的条数时，要将页码显示到第一页
      this.pageNum2 = 1;
      // 改变每页显示的条数
      this.pageSize2 = val;
      this.getProjectList();
    },
    handleCurrentChange2(val) {
      // 改变默认的页数
      this.pageNum2 = val;
      this.getProjectList();
    },
    query() {
      this.getProjectList();
    },
    // 项目类型
    projectType(val) {
      // console.log(val);
      // 物业类型
      if (val == "1") {
        this.is_Prop_Proj = true;
      }
      // 项目类型
      else if (val == "2") {
        this.is_Prop_Proj = false;
      }
    },
    //
    getAmount1(e) {
      if (e.target.value == "0") {
        this.form.amount = "";
      }
      if (e.target.value < 100) {
        this.$message({
          message: "输入不能少于100元",
          type: "warning"
        });
        this.form.amount = "";
      }
    },
    getAmount2(e) {
      if (e.target.value == "0") {
        this.form.amount = "";
      }
      if (e.target.value < 1000) {
        this.$message({
          message: "输入不能少于1000",
          type: "warning"
        });
        this.form.amount = "";
      }
    },
    // 关闭项目余额
    closeDialog5(){
      const page = {
        pageNum:1,
        pageSize:99999,
        name:undefined
      }
      // 清空查询框
      this.rbalanceForm.name = ''
      this.getProjectList(page)
    }
  }
};
</script>
<style>

/* .el-pagination {
    position:static !important;
  } */
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
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type="number"] {
  -moz-appearance: textfield;
}
#recharge-dialog .el-dialog__header {
  background-color: #e6e8eb;
}
#recharge-dialog .recharge-btn {
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
#recharge-dialog .recharge-btn.btn1 {
  background: rgba(239, 130, 0, 1);
  border: 1px solid rgba(206, 112, 0, 1);
  color: #fff;
}
#recharge-dialog .recharge-btn.btn2 {
  border: 1px solid rgba(0, 0, 0, 0.25);
}
#recharge-dialog .el-dialog__title {
  font-size: 20px;
  font-weight: bold;
}
#recharge-dialog .el-dialog__body {
  padding-left: 40px;
  padding-right: 40px;
  padding-bottom: 0;
  box-sizing: border-box;
}
#recharge-dialog .el-dialog__footer {
  background-color: #e6e8eb;
}
#recharge-dialog .el-cascader--medium {
  width: 100%;
}
#recharge-dialog .el-form-item__label {
  color: #979797;
}
.recharge-p {
  padding: 10px 0;
  box-sizing: border-box;
}
.recharge-p-span {
  margin-left: 25px !important;
  line-height: 30px;
  display: block;
  font-size: 14px;
  margin-top: 10px !important;
}
#recharge-form .el-select {
  width: 60%;
}
#recharge-form .el-input--medium {
  /* width: 60%; */
}
#paymentDialog .paymentDialog-box {
  /* display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap; */
}
#paymentDialog .paymentDialog-box img {
  display: block;
}
#paymentDialog .paymentDialog-box .paymentDialog-box-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
}
/* #paymentDialog .paymentDialog-box img:nth-child(1) {
  width: 150px;
}
#paymentDialog .paymentDialog-box img:nth-child(2){
width: 220px;
} */
.paymentDialog-box-img1 {
  width: 160px;
}
.paymentDialog-box-img2 {
  width: 220px;
}
.paymentDialog-box-img3 {
  width: 180px;
}
</style>
<style lang="scss" scoped>
// * {
//   padding: 0;
//   margin: 0;
// }
.recharge {
  width: 100%;
  padding: 15px;
  min-height: calc(88vh);
  box-sizing: border-box;
  background-color: #e6e8eb;
  padding-bottom: 30px;
  .recharge-conter {
    min-height: calc(88vh);
    background-color: #fff;
    padding: 25px;
    box-sizing: border-box;
    border-radius: 5px;
    .recharge-top {
      h4 {
        padding: 25px 0;
        box-sizing: border-box;
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
    p {
      font-size: 12px;
      color: #a1a1a1;
      padding-top: 20px;
    }
    .recharge-ewm {
      width: 150px;
      background-color: #666;
      margin-left: 20px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .recharge-bottom {
      padding-top: 24px;
      padding-bottom: 30px;
      box-sizing: border-box;
      border-top: 1px solid #e2e2e2;
      padding-left: 20px;
      .recharge-btn {
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
        font-size: 14px;
        color: #fff;
        cursor: pointer;
      }
    }
  }
}
</style>
<template>
  <!-- 家财凭证管理 -->
  <div>
    <div>
      <el-row
        :gutter="20"
        class="record-top"
        style="margin-left: 0px; margin-right: 0px; padding-bottom:10px"
      >
        <el-col>
          <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="订单号：">
              <el-input
                @keyup.enter.native="onSubmit"
                @clear="onSubmit"
                v-model.trim="formInline.orderNo"
                clearable
                placeholder="请输入"
                
              ></el-input>
            </el-form-item>
            <!-- <el-form-item label="物业公司：">
              <el-input
                @keyup.enter.native="onSubmit"
                @clear="onSubmit"
                v-model.trim="formInline.propName"
                clearable
                placeholder="请输入"
              ></el-input>
            </el-form-item>-->
            <el-form-item label="委托状态：">
              <el-select
                @change="onSubmit"
                clearable
                v-model="formInline.entrustStatus"
                placeholder="请选择"
                
              >
                <el-option
                  v-for="(item) in productList"
                  :key="item.entrustStatus"
                  :label="item.label"
                  :value="item.entrustStatus"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="律师函类型：">
              <el-select
                @change="onSubmit"
                clearable
                v-model="formInline.lawyerType"
                placeholder="请选择"
                
              >
                <el-option
                  v-for="(item) in lawyerTypeList"
                  :key="item.lawyerType"
                  :label="item.productName"
                  :value="item.lawyerType"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="委托时间：">
              <el-date-picker
                v-model="formInline.entrustStartDate"
                clearable
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期"
                @change="onSubmit"
                
                :picker-options="startOptions"
              ></el-date-picker>
            </el-form-item>
            <el-form-item>
              <span>-</span>
            </el-form-item>
            <el-form-item>
              <el-date-picker
                v-model="formInline.entrustEndDate"
                clearable
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期"
                @change="onSubmit"
                
                :picker-options="endOptions"
              ></el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="info" plain @click="onSubmit" >查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <!-- <div style="margin-top:10px;margin-bottom:10px"></div> -->
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100% "
        align="center"
      >
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <el-table-column prop="orderNo" :show-overflow-tooltip="true" label="订单号" min-width="120px"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="entrustNumber" label="委托数量"></el-table-column>
        <el-table-column prop="auditNumber" label="审核数量" show-overflow-tooltip></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="orderMoney" label="订单金额"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="orderPaymentMoney" label="实付金额"></el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          prop="lawyerType"
          label="律师函类型"
          min-width="100px"
        >
          <template
            slot-scope="scope"
          >{{lawyerTypeList.filter((item)=>item.lawyerType===scope.row.lawyerType)[0].productName}}</template>
        </el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          prop="entrustClient"
          label="委托人"
          min-width="100px"
        ></el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          prop="entrustDate"
          label="委托时间"
          min-width="100px"
        ></el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          prop="effective"
          label="开票状态"
          min-width="100px"
          align="center"
        >
          <template slot-scope="scope">
            <!-- 排除billingStatus为空且委托状态为已完成,审核通过 -->
            <span
              v-if="!scope.row.billingStatus&&(scope.row.entrustStatus===5||scope.row.entrustStatus===6)"
            >待开票</span>
            <span v-else-if="scope.row.billingStatus===0">待开票</span>
            <span v-else-if="scope.row.billingStatus===1">开票中</span>
            <span v-else-if="scope.row.billingStatus===2">已开票</span>
            <span v-else>-</span>
          </template>
        </el-table-column>

        <el-table-column
          :show-overflow-tooltip="true"
          prop="entrustStatus"
          label="委托状态"
          min-width="100px"
        >
          <template
            slot-scope="scope"
          >{{productList.filter((item)=>item.entrustStatus===scope.row.entrustStatus)[0].label}}</template>
        </el-table-column>

        <el-table-column label="操作" min-width="100px">
          <template slot-scope="scope">
            <a
              href="javascript:;"
              style="margin-left:3px;color: #1890ff;"
              @click="see(scope.row)"
              v-hasPermi="['info:invoice:edit']"
            >查看明细</a>
            <a
              v-if="scope.row.entrustStatus===1"
              href="javascript:;"
              style="margin-left:3px;color: #1890ff;"
              @click="startPay(scope.row)"
              v-hasPermi="['info:invoice:remove']"
            >确认付款</a>
            <a
              v-if="scope.row.entrustStatus===5||scope.row.entrustStatus===6"
              href="javascript:;"
              style="margin-left:3px;color: #1890ff;"
              @click="downloadPDF(scope.row.id)"
              v-hasPermi="['info:invoice:remove']"
            >下载全部</a>
            <!-- <el-button
              
              type="text"
              icon="el-icon-delete"
              v-hasPermi="['info:invoice:remove']"
              @click="deleteOwner(scope.row)"
            >删除</el-button>-->
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="formInline.pageNum"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="formInline.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNum"
      ></el-pagination>
    </div>
    <!-- 选择扣款账户弹框 -->
    <el-dialog
      id="choose-payment-company-dialog"
      :visible.sync="paymentCompanyDialog"
      center
      top="50vh"
      width="500px"
      custom-class="insufficient-fund-dialog"
      @before-close="resetForm('paymentForm')"
    >
      <el-form :model="paymentMsg" ref="paymentForm" label-width="100px" :rules="paymentRules">
        <el-form-item
          label="订单金额:"
        >{{paymentMsg.orderSum?paymentMsg.orderSum.toFixed(2)+' 元':'0.00'}}</el-form-item>
        <el-form-item label="扣费账户:" prop="accountId">
          <el-select
            style="width:100%"
            value-key="name"
            v-model="paymentMsg.accountId"
            placeholder="请选择"
            @change="choice"
          >
            <el-option-group v-for="group in projectData" :key="group.name" :label="group.name">
              <el-option
                v-for="item in group.options"
                :key="item.name"
                :label="item.name"
                :value="item"
              ></el-option>
            </el-option-group>
          </el-select>
        </el-form-item>
        <el-form-item class="payment-account-choose" label="当前余额:" prop="paymentAccount">
          <el-input disabled v-model="paymentMsg.paymentAccount"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="owner-dialog-footer">
        <a href="javascript:;" class="owner-btn btn4" @click="submitPay('paymentForm')">确定</a>
        <a href="javascript:;" class="owner-btn btn5" @click="closeForm('paymentForm')">取消</a>
      </div>
    </el-dialog>
    <!-- 支付余额不足弹框 -->
    <el-dialog
      id="insufficient-fund-dialog"
      :visible.sync="insufficientDialog"
      center
      top="50vh"
      width="500px"
      custom-class="insufficient-fund-dialog"
    >
      <div style="text-align:center">账户余额不足，请先付款</div>
      <div slot="footer" class="owner-dialog-footer">
        <a href="javascript:;" class="owner-btn btn3" @click="showQRCode('2')">微信支付</a>
        <a href="javascript:;" class="owner-btn btn4" @click="showQRCode('3')">支付宝支付</a>
        <a href="javascript:;" class="owner-btn btn5" @click="cancelPayment">取消</a>
      </div>
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
          <img class="paymentDialog-box-img2" :src="'data:image/png;base64,'+qrcode" alt />
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
import { recordList } from "@/api/legal/legal_record";
import { chargeList, applyPay, getByEntrustPdf } from "@/api/legal/legal";
import {
  getPropCompany,
  getProjectRoleList,
  userRegister,
  financeQueryPayOrderResult
} from "@/api/information/information";
export default {
  name: "record",
  data() {
    return {
      // 默认不开启select清空
      isClearable: true,
      // 总条数
      totalNum: 0,
      // 查询数据
      formInline: {
        // 订单号
        orderNo: "",
        // 物业公司名称
        propName: "",
        // 委托状态
        entrustStatus: "",
        // 律师函类型
        lawyerType: "",
        // 委托开始时间
        entrustStartDate: "",
        // 委托结束时间
        entrustEndDate: "",
        // 排序列
        orderByColumn: "id",
        // 排序方式(desc降序)
        isAsc: "desc",
        // 当前显示条数
        pageSize: 10,
        // 当前显示页数
        pageNum: 1
      },
      // 日期禁用项 禁用大于结束日期
      startOptions: {
        disabledDate: false
      },
      // 日期禁用项 禁用小于开始日期
      endOptions: {
        disabledDate: false
      },
      // 表格数据
      tableData: [],
      // 委托状态
      productList: [
        { entrustStatus: 1, label: "待付款" },
        { entrustStatus: 2, label: "待审核" },
        { entrustStatus: 3, label: "待处理" },
        { entrustStatus: 4, label: "部分审核" },
        { entrustStatus: 5, label: "审核通过" },
        { entrustStatus: 6, label: "已完成" },
        { entrustStatus: 7, label: "已失效" }
      ],
      // 律师函类型
      lawyerTypeList: [
        { productName: "在线(电子版)", lawyerType: 1 },
        { productName: "快递到物业", lawyerType: 2 },
        { productName: "快递到业主", lawyerType: 3 }
      ],
      // 变更申请 对话框
      dialogFormVisible: false,
      // 项目用户当前信息
      userData: {},
      // 对话框内表单数据
      changeForm: {
        // 新地址
        houseAddress: "",
        // 门牌号
        houseNumber: "",
        // 凭证号
        credentialId: ""
      },
      // 表单验证
      rules: {
        // 新地址
        houseAddress: [
          { required: true, message: "请输入新地址", trigger: "blur" }
        ],
        // 门牌号
        houseNumber: [
          { required: true, message: "请输入门牌号", trigger: "blur" }
        ]
      },
      // 保单号
      insuranceNo: "",
      // 原地址
      houseAddress: "",
      dialogVisible4: false,
      insufficientDialog: false, // 余额不足弹框
      // 支付宝图片
      ZFB_img: require("@/assets/image/zfb_zf.jpg"),
      ZFB_SAO_img: require("@/assets/image/zfb_sao.png"),
      // 微信图片
      WX_img: require("@/assets/image/wx_zf.png"),
      WX_SAO_img: require("@/assets/image/wx_sao.png"),
      // 显示支付宝还是微信
      is_ZFB_and_WX: true,
      // 定时器
      timing: "",
      qrcode: "",
      paymentData: {}, // 支付临时数据
      payLoading: "", // 委托申请loading
      payForm: {
        pId: "0",
        type: "",
        aId: "",
        amount: "",
        isProject: ""
      }, // 微信支付宝临时数据
      projectData: [], // 当前用户可选项目列表
      paymentCompanyDialog: false, // 选择扣款账户弹框
      paymentMsg: {
        insPremiumRecordId: "", // 订单id
        orderSum: "", // 订单金额
        reminderRecordId: "", // 委托记录id
        accountId: "", // 支付账户id
        paymentAccount: "0.00" // 当前账户余额
      },
      paymentRules: {
        accountId: [
          { required: true, message: "请选择扣费账户", trigger: "change" }
        ]
      }
    };
  },
  watch: {
    ["formInline.entrustStartDate"](val) {
      this.endOptions = {
        disabledDate(date) {
          if (!val) {
            return false;
          } else if (
            new Date(date).getTime() === new Date(val + " 00:00:00").getTime()
          ) {
            return false;
          }
          return date.getTime() < new Date(val).getTime();
        }
      };
    },
    ["formInline.entrustEndDate"](val) {
      this.startOptions = {
        disabledDate(date) {
          if (!val) {
            return false;
          } else if (
            new Date(date).getTime() === new Date(val + " 00:00:00").getTime()
          ) {
            return false;
          }
          return date.getTime() > new Date(val).getTime();
        }
      };
    }
  },
  created() {
    // 获取扣款公司列表
    // this.getProjectList();
    // 获取表格数据
    this.getRecordData();
  },
  methods: {
    // 查看
    see(row) {
      const obj = {
        id: row.id,
        entrustStatus: row.entrustStatus,
        orderNo: row.orderNo,
        lawyerType: row.lawyerType,
        pageSize: this.pageSize,
        pageNum: this.pageNum
      };
      this.$emit("changePage", "SEE", obj);
    },
    // 获取物业公司信息与项目公司信息
    getProjectList() {
      const page = {
        is_manage: "1",
        pageNum: 1,
        pageSize: 99999
      };
      // const userResp = await getPropCompany();
      getPropCompany().then(res => {
        if (res.code === 200) {
          let obj1 = { name: "物业类型", options: [] };
          obj1.options.push(res.data);
          getProjectRoleList(page).then(callback => {
            if (callback.code === 200) {
              let obj2 = { name: "项目类型", options: callback.rows };
              let projectData = [];
              // 判断 是物业用户 还是 项目用户 所看到页面
              if (this.$store.state.user.userType == "01") {
                projectData.push(obj1);
              }
              projectData.push(obj2);
              this.projectData = projectData;
              this.paymentCompanyDialog = true;
            }
          });
        }
      });
    },
    // 选择扣款账户(从公司/从项目 扣款)
    choice(item) {
      this.payForm.pId = "" + item.id;
      this.payForm.aId = "" + item.accountId;
      this.payForm.pName = item.name;
      this.paymentMsg.paymentAccount = item.balance.toFixed(2);
      // this.paymentMsg.accountId = item.accountId;
      if (item.remark === "物业用户") {
        // 支付扣款类型(从物业公司)
        this.payForm.isProject = "0";
      } else {
        // 支付扣款类型(从项目)
        this.payForm.isProject = "1";
      }
    },
    // 申请开票
    invoice() {
      const obj = {
        pageSize: this.pageSize,
        pageNum: this.pageNum
      };
      this.$emit("changePage", "INVOICE", obj);
    },
    // 律师函类型
    getLawyerTypeList() {
      chargeList().then(xhrData => {
        if (xhrData.code === 200) {
          this.lawyerTypeList = xhrData.rows;
        }
      });
    },
    // 获取表格数据
    async getRecordData() {
      let formInline = JSON.parse(JSON.stringify(this.formInline));
      if (formInline.entrustStartDate) {
        formInline.entrustStartDate += " 00:00:00";
      }
      if (formInline.entrustEndDate) {
        formInline.entrustEndDate += " 23:59:59";
      }
      let res = await recordList(formInline);
      if (res.code === 200) {
        // 赋值到表格数据
        this.tableData = res.rows;
        // 总条数
        this.totalNum = res.total;
      }
    },
    // 变更申请
    changeApplication(row) {
      // 打开对话框
      this.dialogFormVisible = true;
      // 凭证号
      this.changeForm.credentialId = row.credentialId;
      // 保单号
      this.insuranceNo = row.insuranceNo;
      // 原住址
      this.houseAddress = row.houseAddress;
    },
    // 确认变更申请
    changeApply(changeForm) {
      // 表单验证
      this.$refs[changeForm].validate(valid => {
        // 通过验证
        if (valid) {
          // 请求变更申请
          changeApplyAddressInfo(this.changeForm)
            .then(xhrData => {
              if (xhrData.code === 200) {
                this.$message.success({
                  message: "变更成功!"
                });
                // 关闭对话框
                this.dialogFormVisible = false;
                // 清空表单
                this.$refs["changeForm"].resetFields();
              } else if (xhrData.code === 500) {
                this.$message.error({
                  message: xhrData.msg
                });
                // 关闭对话框
                this.dialogFormVisible = false;
              }
            })
            .catch(() => {
              // 关闭对话框
              // this.dialogFormVisible = false;
            });
        } else {
          this.$message.warning({
            message: "请完善信息~!"
          });
          return false;
        }
      });
    },
    // ======开启支付======
    // 请求最新数据
    startPay(row) {
      console.log(this.paymentMsg);

      let formInline = JSON.parse(JSON.stringify(this.formInline));
      if (formInline.entrustStartDate) {
        formInline.entrustStartDate += " 00:00:00";
      }
      if (formInline.entrustEndDate) {
        formInline.entrustEndDate += " 23:59:59";
      }
      recordList(formInline)
        .then(res => {
          if (res.code === 200) {
            let flag = true;
            res.rows.forEach(item => {
              if (item.id === row.id) {
                flag = false;
                // this.payLoading = this.$loading({
                //   lock: true,
                //   text: "Loading",
                //   spinner: "el-icon-loading",
                //   background: "rgba(0, 0, 0, 0.7)"
                // });
                this.paymentMsg.orderSum = item.orderMoney;
                this.paymentData = {
                  insPremiumRecordId: item.orderNumber,
                  orderSum: item.orderMoney,
                  reminderRecordId: item.id
                };
              }
            });
            if (flag) {
              this.$message({
                type: "warning",
                message: "数据异常,请刷新页面"
              });
              return false;
            }
          }
        })
        .then(() => {
          this.getProjectList();
        });
    },
    submitPay(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$confirm(
            `本次申报将会扣除余额${this.paymentMsg.orderSum.toFixed(
              2
            )}元，是否要支付？`,
            "警告",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }
          )
            .then(() => {
              this.payLoading = this.$loading({
                lock: true,
                text: "Loading",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)"
              });
              this.toApplyPay();
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "支付已取消"
              });
              return false;
            });
        } else {
          this.$message({
            message: "请完善信息！",
            type: "warning"
          });
          return false;
        }
      });
    },
    // 从余额扣款
    toApplyPay() {
      let paymentData = JSON.parse(JSON.stringify(this.paymentData));
      paymentData.accountId = this.paymentMsg.accountId.accountId;
      // 从余额扣费
      applyPay(paymentData)
        .then(res => {
          if (res.code === 200) {
            this.payLoading.close();
            if (res.data.status === "1") {
              this.paymentCompanyDialog = false;
              this.insufficientDialog = false;
              this.$refs["paymentForm"].resetFields();
              this.getRecordData();
              this.openSuccessBox();
            } else {
              // 设置充值金额
              this.payForm.amount = res.data.needAmount;
              this.payForm.isProject = "" + res.data.isProject;
              this.insufficientDialog = true;
            }
          } else {
            this.payLoading.close();
            this.$message({
              type: "error",
              message: "扣款失败,请稍后再试!",
              duration: 5000
            });
          }
        })
        .catch(err => {
          this.payLoading.close();
        });
    },
    // 点击微信/支付支付
    showQRCode(type) {
      // 微信支付
      if (type === "2") {
        this.WX_img = require("@/assets/image/wx_zf.png");
        this.WX_SAO_img = require("@/assets/image/wx_sao.png");
        this.is_ZFB_and_WX = false;
      }
      // 支付宝支付
      else if (type == "3") {
        this.ZFB_img = require("@/assets/image/zfb_zf.jpg");
        this.ZFB_SAO_img = require("@/assets/image/zfb_sao.png");
        this.is_ZFB_and_WX = true;
      }
      this.payForm.type = type;
      this.getQRcode();
    },
    // 获取支付二维码
    getQRcode() {
      let arr = [];
      arr.push(JSON.parse(JSON.stringify(this.payForm)));
      console.log("====支付参数====");
      console.log(arr);
      // 请求充值
      userRegister(arr)
        .then(xhrData => {
          if (xhrData.code === 200) {
            this.$nextTick(() => {
              // this.qrCode = 'data:image/png;base64,' + xhrData.data;
              this.qrcode = xhrData.data.qrCodeBase64Img;
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
                  // 关闭支付选择弹框
                  this.insufficientDialog = false;
                  this.payLoading = this.$loading({
                    lock: true,
                    text: "Loading",
                    spinner: "el-icon-loading",
                    background: "rgba(0, 0, 0, 0.7)"
                  });
                  // 再次发起扣款
                  this.toApplyPay(this.paymentData);
                  return;
                }
              }
            });
            // console.log(1);
          }, 2000);
        });
    },
    // 取消支付
    cancelPayment() {
      // this.paymentData = {};
      // this.payForm = {};
      this.payLoading.close();
      this.insufficientDialog = false;
    },
    // 关闭 支付弹出框
    closeDialog2() {
      // 关闭定时器
      clearInterval(this.timing);
      // 关闭支付二维码弹窗
      this.dialogVisible4 = false;
    },
    // 支付成功弹框
    openSuccessBox() {
      this.$msgbox({
        title: "支付成功",
        message: "申请成功，请耐心等候，48个小时内将会处理您的委托",
        type: "success",
        showCancelButton: false,
        showConfirmButton: false,
        closeOnClickModal: false,
        distinguishCancelAndClose: true,
        showClose: true,
        center: true,
        beforeClose: (action, instance, done) => {
          this.getRecordData();
          done();
        }
      }).then(action => {
        this.$message({
          type: "info",
          message: "action: " + action
        });
      });
      setTimeout(() => {
        // this.payLoading.close();
        this.$msgbox.close();
      }, 5000);
    },
    // ======支付结束======
    // 关闭对话框
    resetForm(formName) {
      // 清空表单
      this.$refs[formName].resetFields();
    },
    // 关闭对话框
    closeForm(formName) {
      // 清空表单
      this.$nextTick(() => {
        this.$refs[formName].resetFields();
      });
      this.paymentCompanyDialog = false;
    },
    // 查询
    onSubmit() {
      this.getRecordData();
    },
    handleSizeChange(val) {
      // 注意：在改变每页显示的条数时，要将页码显示到第一页
      this.formInline.pageNum = 1;
      // 改变每页显示的条数
      this.formInline.pageSize = val;
      // 点击每页显示的条数时，显示第一页
      this.getRecordData();
    },
    handleCurrentChange(val) {
      // 改变默认的页数
      this.formInline.pageNum = val;
      // 切换页码时，要获取每页显示的条数
      this.getRecordData();
    },
    // 导出按钮操作
    handleExport() {
      const formInline = this.formInline;
      this.$confirm("是否确认导出所有数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return exportApplyRecord(formInline);
        })
        .then(response => {
          this.download(response.msg);
        })
        .catch(function() {});
    },
    // 下载pdf
    downloadPDF(id) {
      this.$confirm("是否确认下载pdf文件?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          getByEntrustPdf(id).then(res => {
            // 必传后缀
            this.downloadBlob(res, "律师函.zip");
          });
        })
        .catch(function() {});
    }
  }
};
</script>
<style>
/* 修改变更按钮 */
/* .el-button--primary {
  background-color: #ef8200 !important;
  border: 1px solid #ce7000;
  color: #fff;
  font-size: 14px;
  font-weight: bold;
} */
/* 修改关闭按钮 */
/* .el-button--default {
  background-color: #f1f2f3;
  border: 1px solid #cacbcc;
  font-size: 14px;
  font-weight: bold;
} */
/* 修改变更鼠标经过 */
/* .el-button--primary:hover {
  border: 1px solid #ce7000;
} */
/* 修改对话框整体 */
.el-dialog {
  border-radius: 5px;
}
/* 修改对话框中间部分 */
.el-dialog__body {
  padding-bottom: 0;
}
/* 修改对话框头部 */
.el-dialog__header {
  background-color: #e6e8eb;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}
/* 修改对话框底部 */
.el-dialog__footer {
  padding: 10px;
  background-color: #e6e8eb;
}
/* 修改对话框标题 */
.el-dialog__title {
  font-size: 20px;
  font-weight: bold;
}
</style>
<style lang="scss" scoped>
.record-top {
  margin-left: 0;
  margin-right: 0;
  min-height: 60px;
  border-bottom: 1px solid #d6d6d6;
  .el-form--inline .el-form-item {
    margin-top: 10px;
    margin-bottom: 0;
    .el-input {
      width: 140px;
    }
  }
}
.record {
  width: 100%;
  padding: 15px;
  min-height: calc(88vh);
  box-sizing: border-box;
  background-color: #e6e8eb;
  padding-bottom: 30px;
  .record-conter {
    min-height: calc(88vh);
    background-color: #fff;
    border-radius: 5px;
    position: relative;
    padding-bottom: 100px;

    .record-top {
      margin-left: 0;
      margin-right: 0;
      min-height: 60px;
      border-bottom: 1px solid #d6d6d6;
      .el-form--inline .el-form-item {
        margin-top: 10px;
        margin-bottom: 0;
        .el-input {
          width: 140px;
        }
      }
    }
    .addrecord {
      width: 120px;
      height: 36px;
      margin-top: 10px;
      background-color: #ef8200;
      border: 1px solid #d1780f;
      text-align: center;
      line-height: 36px;
      color: #fff;
      font-size: 14px;
      cursor: pointer;
    }
    .el-pagination {
      position: absolute;
      bottom: 20px;
      left: 20px;
      right: 0;
    }
  }
  .record-dialog {
    p {
      font-size: 14px;
      color: #656565;
      height: 40px;
      span {
        margin-left: 60px;
      }
    }
    label {
      font-weight: normal;
    }
    p.record-zhu {
      font-size: 12px;
      color: #b0b0b0;
    }
  }
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
<style lang="scss">
.owner-dialog-footer {
  .owner-btn {
    width: 82px;
    height: 32px;
    border-radius: 2px;
    text-align: center;
    line-height: 32px;
    font-weight: bold;
    display: inline-block;
    font-size: 14px;
  }
  .btn,
  .btn1 {
    background: #169bd5;
    border: 1px solid #169bd5;
    color: #fff;
  }
  .btn2 {
    border: 1px solid #cccccc;
    color: #000000;
  }
  .btn3 {
    width: 108px;
    height: 28px;
    background: #2bad13;
    border: 1px solid #2bad13;
    color: #fff;
    font-weight: 500;
    margin-right: 10px;
    line-height: 28px;
  }
  .btn4 {
    width: 108px;
    height: 28px;
    background: #1476fe;
    border: 1px solid #1476fe;
    color: #fff;
    font-weight: 500;
    margin-right: 10px;
    line-height: 28px;
  }
  .btn5 {
    width: 108px;
    height: 28px;
    border: 1px solid #cccccc;
    color: #000000;
    font-weight: 500;
    margin-right: 10px;
    line-height: 28px;
  }
}
.insufficient-fund-dialog {
  overflow: hidden;
  margin-top: 30vh !important;
}
.insufficient-fund-dialog .el-dialog__header {
  background-color: #ffffff;
}
.insufficient-fund-dialog .el-dialog__footer {
  background-color: #ffffff;
}
.payment-account-choose .el-input__inner {
  color: #ff0000 !important;
  background-color: #e0e0e0 !important;
  border-color: #bbbcbd !important;
}
</style>

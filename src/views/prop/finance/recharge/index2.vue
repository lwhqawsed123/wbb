<template>
  <!-- 充值 -->
  <div class="recharge">
    <div class="recharge-conter">
      <!-- 充值物业 -->
      <div v-if="propertyShow">
        <div class="recharge-top">
          <h4>
            充值物业选择
            <!-- <span>?</span> -->
          </h4>
        </div>
        <el-table :data="propertyData" style="width: 100%">
          <el-table-column prop="name" label="项目名称" min-width="30%"></el-table-column>
          <el-table-column prop="invoiceTitle" label="发票抬头" min-width="20%"></el-table-column>
          <el-table-column prop="balance" label="当前余额" min-width="15%"></el-table-column>
          <el-table-column label="充值金额(元)" min-width="15%">
            <template slot-scope="scope">
              <el-input
                ref="input"
                prop="amount"
                oninput="value=value.replace(/[^\d]/g,'')"
                v-model.number="scope.row.amount"
                style="width:100px;"
              ></el-input>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 充值项目 -->
      <div>
        <div class="recharge-top">
          <h4>
            充值项目选择
            <!-- <span>?</span> -->
          </h4>
        </div>
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="name" label="项目名称" min-width="30%"></el-table-column>
          <el-table-column prop="invoiceTitle" label="发票抬头" min-width="20%"></el-table-column>
          <el-table-column prop="balance" label="当前余额" min-width="15%"></el-table-column>
          <el-table-column label="充值金额(元)" min-width="15%">
            <template slot-scope="scope">
              <el-input
                ref="input"
                prop="amount"
                oninput="value=value.replace(/[^\d]/g,'')"
                v-model.number="scope.row.amount"
                style="width:100px;"
              ></el-input>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="record" label="余额转移/记录" min-width="20%">
            <template slot-scope="scope">
              <a href="javascript:;" @click="balancTransfer(scope.row)">余额转移</a>/
              <a href="javascript:;" @click="toJiLu(scope.row)">转移记录</a>
            </template>
          </el-table-column>-->
        </el-table>
      </div>
      <!-- 购买家财豆 -->
      <div v-if="propertyShow">
        <div class="recharge-top">
          <h4>
            购买家财豆
            <!-- <span>?</span> -->
            <a
              href="javascript:;"
              style="color:#0179FE;font-size:14px;margin-left:30px;"
              @click="dialogVisible3=true"
            >产品说明</a>
          </h4>
        </div>
        <el-table :data="propertyData" style="width: 100%">
          <el-table-column prop="name" label="购买账号" min-width="15%"></el-table-column>
          <el-table-column prop="invoiceTitle" label="发票抬头" min-width="20%"></el-table-column>
          <el-table-column prop="fortuneBean" label="当前数量" min-width="15%"></el-table-column>
          <el-table-column label="充值金额(元)" min-width="15%">
            <template slot-scope="scope">
              <el-input
                ref="input"
                prop="amount"
                oninput="value=value.replace(/[^\d]/g,'')"
                @blur="blurTextBean($event)"
                v-model.number.trim="scope.row.familyCurrency"
                style="width:100px;"
              ></el-input>
              <span v-show="isShowNum" style="color:red">不能低于1000</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="15%">
            <template slot-scope="scope">
              <a
                href="javascript:;"
                style="margin-left:3px;color: #1890ff;"
                @click="beanTransfer(scope.row)"
              >余额转换</a> |
              <a
                href="javascript:;"
                style="margin-left:3px;color: #1890ff;"
                @click="beanRecord(scope.row)"
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
          选择充值方式
          <!-- <span>?</span> -->
        </h4>
      </div>
      <el-radio-group v-model="form.radio">
        <p class="recharge-p">
          <el-radio :label="1">银行转账</el-radio>
          <span>（ 注：线下转账成功后请致电400 055 5151，以方便财务确认。）</span>
          <span class="recharge-p-span" v-for="(item,index) in masg" :key="index">{{item.nei}}</span>
        </p>
        <div>
          <el-radio :label="2">微信支付</el-radio>
          <div class="recharge-ewm">
            <img src="../../../../assets/image/zhifu.png" alt />
          </div>
        </div>
      </el-radio-group>
      <div class="recharge-bottom">
        <div class="recharge-btn" @click="rechargeBtn">充值</div>
      </div>
    </div>
    <!-- 金额转移弹窗口 -->
    <!-- <el-dialog @close="resetForm('jinEForm')" id="recharge-dialog"  title="金额转移" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="jinEForm" :model="jinEForm" label-position="left" label-width="120px">
        <el-form-item label="当前项目" >
          <el-input :disabled="true" v-model="jinEForm.out_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="项目余额" >
          <el-input :disabled="true" style="width:200px" v-model="balance" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="目标项目" prop="in_idName">
          <el-select @change="selectGet" value-key="id"  style="width:100%" v-model="jinEForm.in_idName">
            <el-option v-for="(item,index) in tableData" :key="index" :label="item.name" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="转移金额" prop="amount">
          <el-input style="width:200px" @keydown="handleInput2" v-model="jinEForm.amount" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
         <a href="javascript:;" class="recharge-btn btn1" @click="transfer('jinEForm')" >转 移</a>
        <a href="javascript:;" class="recharge-btn btn2" @click="dialogFormVisible = false">取 消</a>
      </div>
    </el-dialog>-->
    <!-- 家财豆余额转移对话框 -->
    <el-dialog
      @close="closeDialog"
      title="余额转换"
      class="seeDialog"
      :visible.sync="dialogVisible1"
      width="30%"
    >
      <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="当前物业:">
          <span>{{gsName}}</span>
        </el-form-item>
        <el-form-item label="当前余额:">
          <span>{{gsBalance}}</span>
        </el-form-item>
        <el-form-item label="转换金额:" prop="number">
          <el-row>
            <el-col :span="22">
              <el-input @blur="blurText($event)" v-model.number="ruleForm.number"></el-input>
            </el-col>
            <el-col :span="1">
              <span style="margin-left:5px">元</span>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="转换数量:" prop="number">
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
    <el-dialog title="转换记录" class="seeDialog" :visible.sync="dialogVisible2" width="50%">
      <h4
        style="padding-bottom:10px"
      >当前{{currentName}},合计转换{{totalNumber}}.00元,总转换数量{{totalNumber}}个</h4>
      <el-table :data="recordTableData" style="width: 100%">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="orderNo" label="订单号" min-width="24%"></el-table-column>
        <el-table-column prop="amount" label="转换金额(元)" min-width="18%"></el-table-column>
        <el-table-column prop="number" label="转换数量(个)" min-width="18%"></el-table-column>
        <el-table-column prop="createTime" label="转换时间" min-width="30%"></el-table-column>
        <el-table-column prop="createName" label="操作用户" min-width="10%"></el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNum"
        style="padding-top:10px"
      ></el-pagination>
      <span slot="footer" class="dialog-footer">
        <a href="javascript:;" class="btn btn2" @click="dialogVisible2 = false">关 闭</a>
      </span>
    </el-dialog>
    <!-- 家财豆产品说明 -->
    <el-dialog title="家财豆产品介绍" class="seeDialog" :visible.sync="dialogVisible3" width="50%">
      <span slot="footer" class="dialog-footer">
        <a href="javascript:;" class="btn btn2" @click="dialogVisible3 = false">关 闭</a>
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
  financeBeanGetTransformList
} from "@/api/information/information";
export default {
  inject: ["reload"],
  name: "recharge",
  data() {
    return {
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
      rules: {
        // 转入项目id
        in_idName: [
          { required: true, message: "请选择目标项目", trigger: "change" }
        ],
        // 转出金额
        amount: [{ required: true, message: "请输入金额", trigger: "blur" }]
      },
      recharge: "",
      form: {
        radio: 1
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
      // 家财豆转换记录
      // 当前公司
      currentName: "",
      // 总转换家财豆
      totalNumber: 0
    };
  },
  created() {
    this.getProjectList();
    // 判断 是物业用户 还是 项目用户 所看到页面
    if (this.$store.state.user.userType == "01") {
      this.propertyShow = true;
    } else if (this.$store.state.user.userType == "02") {
      this.propertyShow = false;
    }
    // 获取物业公司信息
    this.getPropCompanyData();
  },
  methods: {
    // 获取物业公司信息
    getPropCompanyData() {
      // 清空之前数据
      (this.propertyData = []),
        getPropCompany().then(xhrData => {
          console.log(xhrData,'物业公司');
          
          if (xhrData.code === 200) {
            xhrData.data.balance = xhrData.data.balance.toFixed(2);
            this.propertyData.push(xhrData.data);
          }
        });
    },
    // 提取公用 查询项目账户列表
    getProjectList() {
      // 请求获取项目账户列表
      queryProjectList().then(xhrData => {
        console.log(xhrData,'请求获取项目账户列表');
        if (xhrData.code === 200) {
          this.tableData = xhrData.data;
          // this.selectList = xhrData.data
          for (var i = 0; i < this.tableData.length; i++) {
            this.tableData[i].balance = Number(
              this.tableData[i].balance
            ).toFixed(2);
          }
        }
      });
    },
    // 关闭对话框
    resetForm() {
      // 清空表单
      this.$nextTick(() => {
        this.$refs["jinEForm"].resetFields();
      });
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
      // this.$refs['ruleForm'].resetFields()
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
          // 清空表单
          this.ruleForm = {};
        }
      });
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
            item.amount = item.amount.toFixed(2);
          });
        }
      });
    },
    // 关闭家财豆转换对话框
    closeDialog() {
      // 清空表单
      this.ruleForm = {};
    },
    // 充值按钮
    rechargeBtn() {
      // 清空
      // this.propertyData = {}
      // 判断 物业公司 发票抬头是否有填写
      if (this.propertyData[0].invoiceTitle === null) {
        this.$message.warning({
          message: "请完善发票抬头~!"
        });
        return;
      }
      // 项目充值
      for (let i = 0; i < this.tableData.length; i++) {
        if (
          this.tableData[i].amount == undefined ||
          this.tableData[i].amount == ""
        ) {
          continue;
        } else {
          const rowData = {
            // 项目ID
            pId: "" + this.tableData[i].id,
            // 项目名称
            pName: this.tableData[i].name,
            // 账户ID
            aId: "" + this.tableData[i].accountId,
            // 充值金额
            amount: "" + this.tableData[i].amount,
            // 项目充值
            isProject: "1"
          };
          this.amountData.push(rowData);
        }
      }
      if (this.propertyData.length > 0 && this.propertyData != undefined) {
        for (let i = 0; i < this.propertyData.length; i++) {
          if (
            this.propertyData[i].amount == undefined ||
            this.propertyData[i].amount == ""
          ) {
            continue;
          } else {
            const rowData = {
              pId: "",
              // 项目名称
              pName: "",
              // 账户ID
              aId: "" + this.propertyData[i].accountId,
              // 充值金额
              amount: "" + this.propertyData[i].amount,
              // 物业充值
              isProject: "0"
            };
            this.amountData.push(rowData);
          }
        }
        for (let i = 0; i < this.propertyData.length; i++) {
          if (
            this.propertyData[i].familyCurrency == undefined ||
            this.propertyData[i].familyCurrency == ""
          ) {
            continue;
          } else {
            const rowData = {
              pId: "",
              // 项目名称
              pName: "",
              // 账户ID
              aId: "" + this.propertyData[i].accountId,
              // 充值金额
              number: "" + this.propertyData[i].familyCurrency,
              // 家财豆购买
              isProject: "2"
            };
            this.amountData.push(rowData);
          }
        }
      }

      const _this = this;
      if (this.amountData.length <= 0) {
        this.$message.warning({
          message: "请输入完全~!"
        });
        return false;
      } else {
        // 通过验证
        // 每项添加 选取方式
        // for (var i = 0; i < this.amountData.length; i++) {
        //   this.amountData[i]["type"] = "" + this.form.radio;
        // }
        // for (let i = 0; i < this.amountData.length; i++) {
        //   if (this.amountData[i].isProject == "2") {
        //     // if(this.amountData[i].number < 1000) {
        //     //   console.log('bu');

        //     // }
        //     if (this.value1) {
              
        //       // this.amountData[i].invoice = "0";
        //       // // // 开启加载动画
        //       // const loading = this.$loading({
        //       //   lock: true,
        //       //   text: "充值中,请稍后...",
        //       //   spinner: "el-icon-loading",
        //       //   background: "rgba(0, 0, 0, 0.7)"
        //       // });

        //       // userRegister(this.amountData)
        //       //   .then(xhrData => {
        //       //     if (xhrData.code === 200) {
        //       //       setTimeout(() => {
        //       //         this.$message.success({
        //       //           message: "充值成功~等待审核!"
        //       //         });
        //       //         // 清空表格金额
        //       //         // 关闭 加载动画
        //       //         loading.close();
        //       //         // 刷新
        //       //         this.reload();
        //       //       }, 1500);
        //       //     } else {
        //       //       // 关闭 加载动画
        //       //       loading.close();
        //       //       // 清空金额
        //       //       this.amountData = [];
        //       //     }
        //       //   })
        //       //   .catch(() => {
        //       //     // 关闭 加载动画
        //       //     loading.close();
        //       //     // 清空金额
        //       //     this.amountData = [];
        //       //   });
        //     } else {
        //       // this.amountData[i].invoice = "1";
        //       // // 开启加载动画
        //       // const loading = this.$loading({
        //       //   lock: true,
        //       //   text: "充值中,请稍后...",
        //       //   spinner: "el-icon-loading",
        //       //   background: "rgba(0, 0, 0, 0.7)"
        //       // });
        //       // userRegister(this.amountData)
        //       //   .then(xhrData => {
        //       //     if (xhrData.code === 200) {
        //       //       setTimeout(() => {
        //       //         this.$message.success({
        //       //           message: "充值成功~等待审核!"
        //       //         });
        //       //         // 清空表格金额
        //       //         // 关闭 加载动画
        //       //         loading.close();
        //       //         // 刷新
        //       //         this.reload();
        //       //       }, 1500);
        //       //     } else {
        //       //       // 关闭 加载动画
        //       //       loading.close();
        //       //       // 清空金额
        //       //       this.amountData = [];
        //       //     }
        //       //   })
        //       //   .catch(() => {
        //       //     // 关闭 加载动画
        //       //     loading.close();
        //       //     // 清空金额
        //       //     this.amountData = [];
        //       //   });
        //     }
        //     return;
        //   }
        // }

      console.log(this.amountData, "12322131");
      // userRegister(this.amountData).then(xhrData=>{
      //   console.log(xhrData);
        
      // })
        // // 开启加载动画
        // const loading = this.$loading({
        //   lock: true,
        //   text: "充值中,请稍后...",
        //   spinner: "el-icon-loading",
        //   background: "rgba(0, 0, 0, 0.7)"
        // });
        // userRegister(this.amountData)
        //   .then(xhrData => {
        //     if (xhrData.code === 200) {
        //       setTimeout(() => {
        //         this.$message.success({
        //           message: "充值成功~等待审核!"
        //         });
        //         // 清空表格金额
        //         // 关闭 加载动画
        //         loading.close();
        //         // 刷新
        //         this.reload();
        //       }, 1500);
        //     } else {
        //       // 关闭 加载动画
        //       loading.close();
        //       // 清空金额
        //       this.amountData = [];
        //     }
        //   })
        //   .catch(() => {
        //     // 关闭 加载动画
        //     loading.close();
        //     // 清空金额
        //     this.amountData = [];
        //   });
      }
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
        this.balance = Number(xhrData.data.balance).toFixed(2);
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
      if (str.indexOf("-") != -1 || str.indexOf(".") != -1) {
        this.$message.warning("请输入正整数");
        e.target.value = "";
        this.ruleForm.number = "";
      }

      // let num = parseInt(e.target.value)
      // // if(e.target.value == '') return
      // let regx = /^\d+\.\d+$/;
      // const newNum_two = regx.test(num)
      // console.log(newNum_two);
      // if(newNum_two){
      //   this.$message.warning('请输入正整数')
      //   e.target.value = ''
      //   // this.ruleForm.number = ''
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
    }
  }
};
</script>
<style>
* {
  padding: 0;
  margin: 0;
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
.recharge-p-span {
  margin-left: 25px !important;
  line-height: 30px;
  display: block;
  font-size: 14px;
  margin-top: 10px !important;
}
</style>
<style lang="scss" scoped>
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
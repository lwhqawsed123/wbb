<template>
  <!-- 雇主定制质询 -->
  <div class="components-box">
    <p style="color:red">说明：本业务使用于500人以上的企业雇主险定制服务，48小时内受理定制方案报价（节假日除外），仅允许申报两家保险公司报价</p>
    <el-form ref="form" :rules="rules" :model="form" label-width="120px" label-position="left">
      <el-form-item prop="insCompId" label="保险公司：">
        <el-select
          @change="getInsCompId"
          style="width:300px"
          v-model="form.insCompId"
          placeholder="请选择"
        >
          <el-option v-for="item in companyData" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <h4>保障内容列表</h4>
      <el-table
        id="inquiry-table"
        :data="tableData"
        border
        :span-method="objectSpanMethod"
        style="width: 100%"
      >
        <el-table-column type="index" label="序号" width="80"></el-table-column>
        <el-table-column
          align="center"
          show-overflow-tooltip
          prop="name"
          label="保障内容"
          min-width="30%"
        ></el-table-column>
        <el-table-column align="center" prop="name1" label="保障金额(方案一)" min-width="35%">
          <template slot-scope="scope" style="display:flex;">
            <el-form-item v-if="!scope.row.type" style="margin-left:-100px">
              <el-input
                :disabled="isquery"
                ref="input"
                oninput="value=value.replace(/[^\d]/g,'')"
                v-model.number.trim="scope.row.amount1"
                style="width:90%"
              ></el-input>
              <span style="width:8%">元</span>
            </el-form-item>
            <div class="cell el-tooltip" v-else-if="scope.row.type">{{scope.row.title}}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="name2" label="保障金额(方案二)" min-width="35%">
          <template slot-scope="scope" style="display:flex;">
            <el-form-item style="margin-left:-100px" v-if="!scope.row.type">
              <el-input
                :disabled="isquery"
                ref="input"
                oninput="value=value.replace(/[^\d]/g,'')"
                v-model.number.trim="scope.row.amount2"
                style="width:90%"
              ></el-input>
              <span style="width:8%">元</span>
            </el-form-item>
            <div class="cell el-tooltip" v-else-if="scope.row.type">{{scope.row.title}}</div>
          </template>
        </el-table-column>
      </el-table>
      <el-radio-group @change="getCheckbox1" class="inquiry-box" v-model="form.type1">
        <el-radio :disabled="isquery" label="1">扩展24小时（死亡伤残10万意外医疗1万）</el-radio>
      </el-radio-group>
      <el-radio-group class="inquiry-box" v-model="form.type2">
        <el-radio :disabled="isquery" label="2">伤残赔付特约（伤残赔付比例按等比赔付）</el-radio>
      </el-radio-group>
      <div style="margin-top:30px">
        <el-form-item v-if="!isquery" prop="insNum" label="参保人数：">
          <el-input
            oninput="value=value.replace(/[^\d]/g,'')"
            style="width:250px"
            v-model.number.trim="form.insNum"
          ></el-input>
          <span style="margin-left:10px">人</span>
        </el-form-item>
        <el-form-item v-if="!isquery" prop="applyNanme" label="申请人：">
          <el-input style="width:250px" v-model.trim="form.applyNanme"></el-input>
        </el-form-item>
        <el-form-item v-if="!isquery" prop="applyPhone" label="申请人电话：">
          <el-input maxlength="11" style="width:250px" v-model.trim="form.applyPhone"></el-input>
        </el-form-item>
        <el-form-item v-if="!isquery" prop="code" label="验证码：">
          <el-row style="width:250px">
            <el-col :span="13">
              <el-input @keyup.enter.native="submission" v-model.trim="form.code"></el-input>
            </el-col>
            <el-col :span="10" :offset="1">
              <el-button
                :disabled="isDisabled"
                class="components-box-btn"
                href="javascript:;"
                @click="verification"
              >( {{btnText}}{{isDisabled?'s':''}} )</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <!-- 展示 -->
        <el-form-item v-if="isquery" label="参保人数：">
          <el-input disabled style="width:250px" v-model="insNum"></el-input>
          <span style="margin-left:10px">人</span>
        </el-form-item>
        <el-form-item v-if="isquery" label="申请人：">
          <el-input disabled style="width:250px" v-model.trim="applyNanme"></el-input>
        </el-form-item>
        <el-form-item v-if="isquery" label="申请人电话：">
          <el-input disabled maxlength="11" style="width:250px" v-model="applyPhone"></el-input>
        </el-form-item>
        <el-form-item v-if="isquery" label="方案一报价：">
          <el-input disabled style="width:250px" v-model.trim="offer1"></el-input>
          <span style="margin-left:10px">元/年</span>
        </el-form-item>
        <el-form-item v-if="isquery" label="方案二报价：">
          <el-input disabled style="width:250px" v-model.trim="offer2"></el-input>
          <span style="margin-left:10px">元/年</span>
        </el-form-item>
      </div>
    </el-form>
    <div class="apply-page-bot">
      <a
        :class="isquery ? 'disabled' : 'apply-page-btn'"
        href="javascript:;"
        @click="submission"
        v-hasPermi="['ins:emp:custom:price:add']"
      >提交申请</a>
    </div>
  </div>
</template>

<script>
// 请求
import {
  // 查询可选择的公司列表
  insEmpCustomRriceApplyInsCompList,
  // 提交询价
  insEmpCustomPriceApply,
  // 查询这个物业公司是否可以报价,支持根据保险公司id查询，如果没有传，则查询这家物业公司今年是否可以报价
  insEmpCustomPriceApplyAllow,
  // 获取验证码
  insEmpCustomPriceApplyPhoneCode,
  // 查询详情
  insEmpCustomPriceApplyGte,
  //
  insEmpCustomApplyCompList,
  // 查询当前时间是否可以询价
  insEmpCustomPriceApplyAllowPrice
} from "@/api/information/information";
import { isvalidPhone } from "@/validate/validate";
export default {
  name: "consult-inquiry",
  inject: ["reload"],
  data() {
    return {
      // 展示用数据
      insNum: "",
      applyNanme: "",
      applyPhone: "",
      offer1: "",
      offer2: "",
      // 是否可看
      isquery: false,
      // 是否禁用
      isDisabled: false,
      // 按钮文字
      btnText: "获取短信验证码",
      form: {
        // 保险公司id
        insCompId: "",
        type1: "1",
        type2: "2",
        insNum: "",
        applyNanme: "",
        applyPhone: "",
        code: ""
      },
      tableData: [
        {
          name: "死亡伤残（退休年龄保额50万）",
          type: false,
          amount1: "",
          amount2: ""
        },
        {
          name: "意外医疗",
          type: false,
          amount1: "",
          amount2: ""
        },
        {
          name: "住院补贴",
          type: true,
          title: "100元/天，最多60天"
        },
        {
          name: "误工费",
          type: true,
          title: "100元/天，免赔5天，最多180天"
        }
      ],
      // 保险公司数据
      companyData: [],
      // 表单验证
      rules: {
        company: [
          { required: true, message: "请选择保险公司", trigger: "change" }
        ],
        insNum: [
          { required: true, message: "请输入承保人数", trigger: "blur" }
        ],
        applyNanme: [
          { required: true, message: "请输入申请人", trigger: "blur" }
        ],
        code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
        // 手机号
        applyPhone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            pattern: /^1(3|4|5|6|7|8|9)\d{9}$/,
            message: "手机号格式不对",
            trigger: "blur"
          }
        ]
      },
      count: ""
    };
  },
  created() {
    // this.setRule()
    this.getCompList();
  },
  methods: {
    // 判断质询几次保险公司 最多俩次
    // insEmpCustomApplyCompList
    // setRule(){
    //   insEmpCustomApplyCompList().then(xhrData=>{
    //     if(xhrData.code === 200){
    //       console.log(xhrData.data.length);

    //       if(xhrData.data.length >= 2){
    //         this.isquery = true
    //       }
    //     }
    //   })
    // },
    // 获取保险公司信息
    async getInsCompId(id) {
      // 查询当前时间是否可以询价
      // insEmpCustomPriceApplyAllowPrice().then(xhrData=>{
      //   console.log(xhrData);
      //   if(xhrData.code === 200){
      //     this.isquery = !xhrData.data.allow
      //   }
      // })
      this.insNum = ''
      this.applyNanme = ''
      this.applyPhone = ''
      this.offer1 = ''
      this.offer2= ''
      let ruleData = await insEmpCustomPriceApplyAllowPrice();
      let xhrData = await insEmpCustomPriceApplyGte(id);
      if (ruleData.code === 200) {
        // 可以询价
        if (!ruleData.data.allow) {
            this.isquery = !ruleData.data.allow;
            if (xhrData.code === 200) {
            // 清空表单验证
            // this.$refs["form"].resetFields();
            // this.form.insCompId = id
            if (xhrData.data == undefined) {
              // this.isquery = false;
              this.tableData = [
                {
                  name: "死亡伤残（退休年龄保额50万）",
                  type: false,
                  amount1: "",
                  amount2: ""
                },
                {
                  name: "意外医疗",
                  type: false,
                  amount1: "",
                  amount2: ""
                },
                {
                  name: "住院补贴",
                  type: true,
                  title: "100元/天，最多60天"
                },
                {
                  name: "误工费",
                  type: true,
                  title: "100元/天，免赔5天，最多180天"
                }
              ];
            } else {
              // this.isquery = true;
              this.insNum = xhrData.data.insNum;
              this.applyNanme = xhrData.data.applyNanme;
              this.applyPhone = xhrData.data.applyPhone;
              this.insNum = xhrData.data.insNum;
              this.offer1 = xhrData.data.empCustomPlanList[0].price;
              this.offer2 = xhrData.data.empCustomPlanList[1].price;
              this.tableData[0].amount1 =
                xhrData.data.empCustomPlanList[0].deadAmount;
              this.tableData[0].amount2 =
                xhrData.data.empCustomPlanList[1].deadAmount;
              this.tableData[1].amount1 =
                xhrData.data.empCustomPlanList[0].accidentAmount;
              this.tableData[1].amount2 =
                xhrData.data.empCustomPlanList[1].accidentAmount;
            }
          }
        } else {
          
          if (xhrData.code === 200) {
            // 清空表单验证
            // this.$refs["form"].resetFields();
            // this.form.insCompId = id
            if (xhrData.data == undefined) {
              this.isquery = false;
              this.tableData = [
                {
                  name: "死亡伤残（退休年龄保额50万）",
                  type: false,
                  amount1: "",
                  amount2: ""
                },
                {
                  name: "意外医疗",
                  type: false,
                  amount1: "",
                  amount2: ""
                },
                {
                  name: "住院补贴",
                  type: true,
                  title: "100元/天，最多60天"
                },
                {
                  name: "误工费",
                  type: true,
                  title: "100元/天，免赔5天，最多180天"
                }
              ];
            } else {
              this.isquery = true;
              this.insNum = xhrData.data.insNum;
              this.applyNanme = xhrData.data.applyNanme;
              this.applyPhone = xhrData.data.applyPhone;
              this.insNum = xhrData.data.insNum;
              this.offer1 = xhrData.data.empCustomPlanList[0].price;
              this.offer2 = xhrData.data.empCustomPlanList[1].price;
              this.tableData[0].amount1 =
                xhrData.data.empCustomPlanList[0].deadAmount;
              this.tableData[0].amount2 =
                xhrData.data.empCustomPlanList[1].deadAmount;
              this.tableData[1].amount1 =
                xhrData.data.empCustomPlanList[0].accidentAmount;
              this.tableData[1].amount2 =
                xhrData.data.empCustomPlanList[1].accidentAmount;
            }
          }
          // this.isquery = xhrData.data.allow
          // console.log(xhrData);
         
        }
      }
      // insEmpCustomPriceApplyGte(id).then(xhrData => {
      //     console.log(xhrData);
      //     if (xhrData.code === 200) {
      //       // 清空表单验证
      //       // this.$refs["form"].resetFields();
      //       // this.form.insCompId = id
      //       if (xhrData.data == undefined) {
      //         this.isquery = false;
      //         this.tableData = [
      //           {
      //             name: "死亡伤残（退休年龄保额50万）",
      //             type: false,
      //             amount1: "",
      //             amount2: ""
      //           },
      //           {
      //             name: "意外医疗",
      //             type: false,
      //             amount1: "",
      //             amount2: ""
      //           },
      //           {
      //             name: "住院补贴",
      //             type: true,
      //             title: "100元/天，最多60天"
      //           },
      //           {
      //             name: "误工费",
      //             type: true,
      //             title: "100元/天，免赔5天，最多180天"
      //           }
      //         ];
      //       } else {
      //         this.isquery = true;
      //         this.insNum = xhrData.data.insNum;
      //         this.applyNanme = xhrData.data.applyNanme;
      //         this.applyPhone = xhrData.data.applyPhone;
      //         this.insNum = xhrData.data.insNum;
      //         this.offer1 = xhrData.data.empCustomPlanList[0].price;
      //         this.offer2 = xhrData.data.empCustomPlanList[1].price;
      //         this.tableData[0].amount1 =  xhrData.data.empCustomPlanList[0].deadAmount
      //         this.tableData[0].amount2 =  xhrData.data.empCustomPlanList[1].deadAmount
      //         this.tableData[1].amount1 =  xhrData.data.empCustomPlanList[0].accidentAmount
      //         this.tableData[1].amount2 =  xhrData.data.empCustomPlanList[1].accidentAmount
      //       }
      //     }
      //   });

      // if(id === 1){
      //   this.isquery = true
      // }else {
      //   this.isquery = false
      // }
    },
    // 获取可查询公司列表
    getCompList() {
      insEmpCustomRriceApplyInsCompList().then(xhrData => {
        if (xhrData.code === 200) {
          this.companyData = xhrData.data;
        }
      });
    },
    // 获取验证码
    verification() {
      const _this = this;
      if (this.form.applyPhone == "") return;
      if (!isvalidPhone(this.form.applyPhone)) {
        this.$message({
          message: "手机格式不正确！",
          type: "warning"
        });
        return;
      }
      // console.log(this.form.applyPhone);
      const data = {
        phone: this.form.applyPhone
      };
      insEmpCustomPriceApplyPhoneCode(data).then(xhrData => {
        if (xhrData.code === 200) {
          this.$message({
            message: "发送成功",
            type: "success"
          });
          // 禁用按钮
          this.isDisabled = true;
          // 短信倒计时
          this.btnText = 59;
          _this.count = setInterval(() => {
            if (this.btnText > 1) {
              this.btnText--;
            } else {
              clearInterval(_this.count);
              this.btnText = "获取短信验证码";
              // 开发禁用按钮
              this.isDisabled = false;
            }
          }, 1000);
        }
      });
    },
    // 提交申请
    submission() {
      // console.log(this.form.insCompId);

      // 禁用按钮点击
      if (this.isquery) return;
      // 表单验证
      this.$refs["form"].validate(valid => {
        if (valid) {
          const arr = [];
          this.tableData.forEach((item, index) => {
            if (item.amount1 != undefined && item.amount1 != "") {
              arr.push(item.amount1);
            }
            if (item.amount2 != undefined && item.amount2 != "") {
              arr.push(item.amount2);
            }
          });
          if (arr.length < 4) {
            this.$message({
              message: "保障金额必须输入完整！",
              type: "warning"
            });
            return;
          }
          if (this.form.insCompId == "") {
            this.$message({
              message: "请选择保险公司！",
              type: "warning"
            });
            return;
          }
          let isExpand = "1";
          let isHurtPay = "1";
          // if (this.form.type1 > 0) {
          //   isExpand = "1";
          // } else if (this.form.type1 <= 0) {
          //   isExpand = "0";
          // }
          // if (this.form.type2 > 0) {
          //   isHurtPay = "1";
          // } else if (this.form.type2 <= 0) {
          //   isHurtPay = "0";
          // }
          const newArr = [];
          newArr[0] = arr[0] + "," + arr[2];
          newArr[1] = arr[1] + "," + arr[3];
          const empCustomPlanList = [];
          newArr.forEach((item, index) => {
            empCustomPlanList.push({
              deadAmount: item.split(",")[0],
              accidentAmount: item.split(",")[1],
              name: index == 0 ? "方案一" : "方案二",
              seq: index == 0 ? "1" : "2",
              isExpand: isExpand,
              isHurtPay: isHurtPay
            });
          });
          const objData = {
            applyNanme: this.form.applyNanme,
            applyPhone: this.form.applyPhone,
            code: this.form.code,
            insCompId: this.form.insCompId,
            empCustomPlanList: empCustomPlanList,
            insNum: "" + this.form.insNum
          };
          // console.log(objData);
          // 请求提交申请
          insEmpCustomPriceApply(objData).then(xhrData => {
            // console.log(xhrData);
            if (xhrData.code === 200) {
              this.$message({
                message: "提交申请成功！",
                type: "success"
              });
              // 刷新
              this.reload();
              // 清空表单验证
              this.$refs["form"].resetFields();
              // 恢复表单
              this.restore();
              // 清除定时器
              clearInterval(this.count);
              this.btnText = "获取短信验证码";
              // 开发禁用按钮
              this.isDisabled = false;
              // 清空方案
              this.tableData.forEach(item => {
                item.amount1 = "";
                item.amount2 = "";
              });
            }
          });
        } else {
          // console.log("error submit!!");
          this.$message({
            message: "请完善信息！",
            type: "warning"
          });
          return false;
        }
      });
    },
    getCheckbox1(val) {
      // console.log(val);
    },
    // 还原表单
    restore() {
      this.form = {
        // 保险公司id
        insCompId: "",
        type1: "1",
        type2: "2",
        insNum: "",
        applyNanme: "",
        applyPhone: "",
        code: ""
      };
    },
    // 表格控制
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      // 设置要合并的行和要合并的列
      if (
        (rowIndex === 2 && columnIndex === 2) ||
        (rowIndex === 3 && columnIndex === 2)
      ) {
        // 分别代表合并的行数和列数
        return [1, 2];
      }
    },
    // 按需赋值给另一个对象
    objFun(objA, objB) {
      Object.keys(objA).forEach(key => {
        objA[key] = objB[key] || objA[key];
      });
      return objA;
      // console.log(objA);
    }
  }
};
</script>
<style lang="scss" scoped>
#inquiry-table .el-table td,
.el-table th {
  text-align: center !important;
}
#inquiry-table .el-form-item__error {
  left: 25px;
}
.components-box {
  padding: 20px;
  box-sizing: border-box;
  p {
    font-size: 14px;
    color: #666;
    padding-bottom: 40px;
    box-sizing: border-box;
  }
  h4 {
    color: #666;
    padding-bottom: 40px;
    padding-top: 20px;
  }
  .inquiry-box {
    padding-top: 20px;
    box-sizing: border-box;
    display: block;
  }
  .components-box-btn {
    display: inline-block;
    padding: 0 5px;
    border-radius: 4px;
    border: 1px solid #f59a23;
    height: 36px;
    line-height: 36px;
    font-size: 12px;
    background-color: #f59a23;
    color: #fff;
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
    a.disabled {
      margin-top: 25px;
      display: inline-block;
      width: 130px;
      height: 44px;
      background: #ddd;
      cursor: not-allowed;
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
}
</style>
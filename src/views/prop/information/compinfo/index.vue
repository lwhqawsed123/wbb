<template>
  <!-- 公司信息 -->
  <div class="company">
    <div class="company-conter">
      <div class="company-wrap">
        <div class="company-ewm">
          <!-- <div class="company-ewm-conter">
            <img src="../../../../assets/image/eweim.png" alt />
          </div>-->
        </div>
        <div class="company-title">
          <div class="company-title-conter">
            <p
              style="width:600px;padding-bottom:15px"
            >说明：物业名称必须是营业执照上全称及统一社会信用代码、企业性质必须与实际情况相符合，否则将会影响后期保单的理赔，请填写后检查公司信息是否有误</p>
            <h1>{{companyData.name}}</h1>
            <p>
              <span>所在区域</span>
              <!-- <span>{{companyData.province}}{{companyData.city}}{{companyData.county}}</span> -->
              <span>{{handle(companyData.province,companyData.city,companyData.county)}}</span>
            </p>
            <p>
              <span>详细地址</span>
              <span>{{companyData.address}}</span>
            </p>
            <p>
              <span>社会信用代码</span>
              <span>{{companyData.certNo}}</span>
            </p>
            <p>
              <span>企业性质</span>
              <span>{{companyData.propNatureName}}</span>
            </p>
            <p>
              <span>发票抬头</span>
              <span>{{companyData.invoiceTitle}}</span>
            </p>
            <p>
              <span>联系人</span>
              <span>{{companyData.contact}}</span>
            </p>
            <p>
              <span>手机号</span>
              <span>{{companyData.contact_no}}</span>
            </p>
            <p>
              <span>联系人邮箱</span>
              <span>{{companyData.contact_email}}</span>
            </p>
            <p>
              <span>公司电话</span>
              <span>{{companyData.area_code}}-{{companyData.company_no}}</span>
            </p>
          </div>
          <!-- info:company:edit -->
          <a
            href="javascript:;"
            class="company-title-xiugai"
            v-hasPermi="['info:company:edit']"
            @click="companyModify"
          >完善</a>
        </div>
      </div>
    </div>
    <!-- 完善 对话框 -->
    <el-dialog
      @close="closeDialog"
      id="company-dialog"
      title="完善"
      width="600px"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        :model="companyData"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
        :rules="rules"
        label-position="left"
        id="InformationModificationForm"
      >
        <!-- <el-form-item label="所在区域" prop="selectedOptions">
          <el-cascader
            style="width:100%"
            v-model="selectedOptions"
            :options="options"
            @change="handleChange"
          ></el-cascader>
        </el-form-item> -->
        <el-form-item label="详细地址" prop="address">
          <el-input v-model="companyData.address"></el-input>
        </el-form-item>
        <el-form-item label="社会信用代码" prop="certNo">
          <el-input :maxlength="18" class="company-input" v-model="companyData.certNo"></el-input>
        </el-form-item>
        <el-form-item label="企业性质" prop="propNatureCode">
          <el-select value-key="code" v-model="companyData.propNatureCode" placeholder="请选择">
            <el-option
              v-for="(item) in propNatureData"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发票抬头">
          <!-- @change="currentSel" -->
          <el-select @change="currentSel" value-key="id" v-model="invoice.title" placeholder="请选择">
            <el-option
              v-for="(item) in invoiceData"
              :key="item.id"
              :label="item.title"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系人" prop="contact">
          <el-input class="company-input" v-model="companyData.contact"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="contact_no">
          <el-input class="company-input" v-model="companyData.contact_no"></el-input>
        </el-form-item>
        <el-form-item class="company-input" label="联系人邮箱" prop="contact_email">
          <el-input v-model="companyData.contact_email"></el-input>
        </el-form-item>
        <el-form-item label="公司电话" prop="area_code">
          <div>
            <el-col :span="7">
              <el-input type="number" v-model.trim="companyData.area_code"></el-input>
            </el-col>
            <el-col class="line" style="text-align: center" :span="1">-</el-col>
            <el-col :span="16">
              <el-form-item style="display: inline-block;width:100%" prop="company_no">
                <el-input type="number" v-model.trim="companyData.company_no"></el-input>
              </el-form-item>
            </el-col>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="determine('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import { regionDataPlus, CodeToText } from "element-china-area-data";
import {
  getPropCompany,
  modifyUserUpdatePwd,
  queryInvoiceList,
  sysRegion,
  propNatureList
} from "@/api/information/information";
import { handleRepeat } from '@/validate/handle'
export default {
  name: "company",
  data() {
    return {
      options: [],
      // 区域数据
      // options: regionDataPlus,
      // 区域
      selectedOptions: [],
      // 完善 对话框
      dialogFormVisible: false,
      // 公司信息数据
      companyData: {
        // 公司名称
        name: "",
        // 所在区域
        // 省
        province: "",
        // 市
        city: "",
        // 区
        county: "",
        // 详细地址
        address: "",
        // 社会信用代码
        certNo: "",
        // 联系人
        contact: "",
        // 手机号
        contact_no: "",
        // 联系人邮箱
        contact_email: "",
        // 公司电话
        // 区号
        area_code: "",
        // 固定电话
        company_no: "",
        // 发票抬头
        invoiceTitle: "",
        // 发票抬头
        invoiceTitleId: ""
      },
      // 区域保存
      regionData: {
        // 所在区域
        // 省
        province: "",
        // 市
        city: "",
        // 区
        county: ""
      },
      // 表单验证
      rules: {
        // 社会信用代码
        certNo: [
          {
            pattern: /^[^_IOZSVa-z\W]{2}\d{6}[^_IOZSVa-z\W]{10}$/g,
            message: "请输入正确的统一社会信用代码",
            trigger: "blur"
          }
        ],
        // 手机号
        contact_no: [
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ],
        // 联系人邮箱
        contact_email: [
          {
            pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,
            message: "请输入正确的邮箱",
            trigger: "blur"
          }
        ],
        // 公司电话
        // 区号
        area_code: [
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        // 固定电话
        company_no: [{ max: 8, message: "长度最大8位", trigger: "blur" }],
        // 企业性质
        propNatureCode: [
          { required: true, message: "请选择企业性质", trigger: "change" }
        ]
      },
      // 发票抬头
      invoiceData: [],
      //
      invoice: {
        title: "",
        id: ""
      },
      // 保存企业性质信息
      propNatureData: []
    };
  },
  created() {
    // 调用获取当前用户信息方法
    this.getProp();
    // 获取发票抬头信息
    this.getInvoiceList();
    this.getRegion();
    
  },
  methods: {
    // 获取企业性质信息
    getPropNature() {
      propNatureList().then(xhrData => {
        if (xhrData.code === 200) {
          // console.log(xhrData);
          this.propNatureData = xhrData.data;
        }
      });
    },
    //获取省市区
    getRegion() {
      sysRegion().then(xhrData => {
        // console.log(xhrData);
        if (xhrData.code === 200) {
          this.options = xhrData.data;
        }
      });
    },
    // 取当前用户信息方法
    getProp() {
      // 获取当前用户对应的物业公司信息
      getPropCompany().then(xhrData => {
        if (xhrData.code === 200) {
          this.companyData = xhrData.data;
          this.$nextTick(() => {
            this.selectedOptions[0] = xhrData.data.province;
            this.selectedOptions[1] = xhrData.data.city;
            this.selectedOptions[2] = xhrData.data.county;
          });
          // console.log(this.selectedOptions);

          this.invoice.title = xhrData.data.invoiceTitle;
          this.invoice.id = xhrData.data.invoiceTitleId;
        }
      });
    },
    // 获取发票抬头信息
    getInvoiceList() {
      // 请求 发票抬头信息
      const page = {
        pageSize: 9999,
        pageNum: 1,
        title: "",
        recipient: ""
      };
      queryInvoiceList(page).then(xhrData => {
        if (xhrData.code === 200) {
          this.invoiceData = xhrData.rows;
        }
      });
    },
    // 获取省市区信息
    // 选择公司所在省、市、区
    handleChange() {
      // 处理 省市级 数据
      this.regionData.province = this.selectedOptions[0];
      this.regionData.city = this.selectedOptions[1];
      this.regionData.county = this.selectedOptions[2];
      // if (this.regionData.province !== undefined) {
      //   this.regionData.province = CodeToText[this.regionData.province];
      // }
      // if (this.regionData.city !== undefined) {
      //   this.regionData.city = CodeToText[this.regionData.city];
      // }
      // if (this.regionData.county !== undefined) {
      //   this.regionData.county = CodeToText[this.regionData.county];
      // }
    },
    closeDialog() {
      this.getProp();
      this.$refs["ruleForm"].resetFields();
    },
    // 完善
    companyModify() {
      // 打开对话框
      this.dialogFormVisible = true;
      // 调用获取企业信息
      this.getPropNature();
    },
    // 对话框取消按钮
    cancel() {
      this.dialogFormVisible = false;
    },
    //
    currentSel(val) {
      // console.log(val);

      this.companyData.invoiceTitle = val.title;
      this.companyData.invoiceTitleId = val.id;
    },
    // 对话框 确定 按钮
    determine(ruleForm) {
      // 表单验证通过执行

      this.$refs[ruleForm].validate(valid => {
        if (valid) {
          // this.regionData
          if (this.regionData.city == undefined) {
            this.companyData.city = " ";
          } else {
            this.companyData.city = this.regionData.city;
          }
          if (this.regionData.county == undefined) {
            this.companyData.county = " ";
          } else {
            this.companyData.county = this.regionData.county;
          }
          if (this.regionData.province == "全部") {
            this.$message.warning({
              message: "所在区域不能为全部!"
            });
            // 更新数据
            this.getProp();
          } else {
            this.companyData.province = this.regionData.province;
            // 请求完善当前用户信息

            this.companyData.province =
              this.selectedOptions[0] == undefined
                ? ""
                : this.selectedOptions[0];
            this.companyData.city =
              this.selectedOptions[1] == undefined
                ? ""
                : this.selectedOptions[1];
            this.companyData.county =
              this.selectedOptions[2] == undefined
                ? ""
                : this.selectedOptions[2];
            // console.log(this.companyData);
            modifyUserUpdatePwd(this.companyData).then(xhrData => {
              if (xhrData.code === 200) {
                // 更新数据
                this.getProp();
                this.$message.success({
                  message: "完善成功!"
                });
                this.dialogFormVisible = false;
              } else {
                this.$message.success({
                  message: "完善失败!"
                });
              }
            });
          }
        } else {
          this.$message.warning({
            message: "完成正确信息!"
          });
          return false;
        }
      });
    },
    // 处理所在区域重复问题
    handle(province, city, county) {
      return handleRepeat(province, city, county)
    }
  }
};
</script>
<style>
/* 去除webkit中input的type="number"时出现的上下图标 */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type="number"] {
  -moz-appearance: textfield;
}
#company-dialog .el-dialog__header {
  background-color: #e6e8eb;
}
#company-dialog .el-dialog__title {
  font-size: 20px;
  font-weight: bold;
}
#company-dialog .el-dialog__body {
  padding-left: 50px;
  padding-right: 50px;
  padding-bottom: 0;
  box-sizing: border-box;
}
#company-dialog .el-dialog__footer {
  background-color: #e6e8eb;
  padding-bottom: 10px;
}
#company-dialog .el-cascader--medium,
#company-dialog .el-select {
  width: 100%;
}
/* #company-dialog .el-button--primary {
  background: linear-gradient(
    270deg,
    rgba(248, 184, 0, 1) 0%,
    rgba(239, 130, 0, 1) 100%
  );
  border: 1px solid rgba(248, 184, 0, 1);
} */
</style>
<style lang="scss" scoped>
.company {
  width: 100%;
  padding: 15px;
  min-height: calc(88vh);
  box-sizing: border-box;
  background-color: #e6e8eb;
  padding-bottom: 30px;
  .company-conter {
    min-height: calc(88vh);
    background-color: #fff;
    padding: 25px;
    box-sizing: border-box;
    border-radius: 5px;
    .company-wrap {
      display: flex;
      .company-ewm {
        width: 15%;
        .company-ewm-conter {
          width: 96px;
          img {
            width: 100%;
            height: auto;
          }
        }
      }
      .company-title {
        display: flex;
        justify-content: space-between;
        width: 85%;
        .company-title-conter {
          h1 {
            font-size: 16px;
            margin-top: 0;
          }
          p {
            font-size: 14px;
            // color: #686868;
            color: #666;
            display: flex;
            margin-top: 20px;
            span:nth-child(1) {
              display: block;
              min-width: 140px;
            }
          }
        }
        .company-title-xiugai {
          font-size: 16px;
          height: 30px;
          color: #1890ff;
        }
      }
    }
  }
}
</style>
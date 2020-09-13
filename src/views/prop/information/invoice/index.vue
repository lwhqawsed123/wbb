<template>
  <!-- 发票抬头管理 -->
  <div class="invoice">
    <div class="invoice-conter">
      <el-row :gutter="20" class="invoice-top" style="margin-left: 0px; margin-right: 0px;">
        <el-col :span="21">
          <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="发票抬头：">
              <el-input @keyup.enter.native="onSubmit" v-model="formInline.title" placeholder></el-input>
            </el-form-item>
            <el-form-item label="收件人：">
              <el-input @keyup.enter.native="onSubmit" v-model="formInline.recipient" placeholder></el-input>
            </el-form-item>
            <!-- <el-form-item style="width:120px">
              <el-select v-model="formInline.region" placeholder="是否在管">
                <el-option label="是" value="shanghai"></el-option>
                <el-option label="否" value="beijing"></el-option>
              </el-select>
            </el-form-item>-->
            <el-form-item>
              <el-button type="info" plain @click="onSubmit">查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="3">
          <div class="addInvoice" @click="toAddInvoice" v-hasPermi="['info:invoice:add']">添加抬头发票</div>
        </el-col>
      </el-row>
      <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%">
        <el-table-column show-overflow-tooltip label="序号" type="index" width="80"></el-table-column>
        <el-table-column show-overflow-tooltip label="发票抬头信息" min-width="200px">
          <template slot-scope="scope">{{ scope.row.title }}</template>
        </el-table-column>
        <el-table-column prop="type" show-overflow-tooltip label="发票类型" min-width="150px"></el-table-column>
        <el-table-column prop="recipient" show-overflow-tooltip label="收件人" min-width="150px"></el-table-column>
        <el-table-column prop="dizi" show-overflow-tooltip label="快递地址/邮箱" min-width="200px"></el-table-column>
        <el-table-column prop="createTime" show-overflow-tooltip label="添加时间" min-width="200px"></el-table-column>
        <el-table-column label="操作" min-width="200px">
          <template slot-scope="scope">
            <!-- <a
              href="javascript:;"
              style="margin-right:3px; color: #1890ff;"
              @click="modify(scope.row)"
              v-hasPermi="['info:invoice:edit']"
            >修改</a>|-->
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="modify(scope.row)"
              v-hasPermi="['info:invoice:edit']"
            >修改</el-button>
            <!-- <a
              href="javascript:;"
              style="margin-left:3px;color: #1890ff;"
              @click="delInvoice(scope.row)"
              v-hasPermi="['info:invoice:remove']"
            >删除</a>-->
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              v-hasPermi="['info:invoice:remove']"
              @click="delInvoice(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNum"
      ></el-pagination>
    </div>
    <!-- 添加 修改 对话框 -->
    <el-dialog
      id="invoice-dialog"
      @close="resetForm('form')"
      :title="titleName"
      :visible.sync="dialogFormVisible"
      width="600px"
    >
      <el-form ref="form" :rules="rules" :model="form" label-width="120px" label-position="left">
        <h4>
          发票抬头信息
          <!-- <span>?</span> -->
        </h4>
        <!-- <el-form-item label="公司名称" prop="pcName">
          <el-input disabled v-model.trim="form.pcName"></el-input>
        </el-form-item>-->
        <el-form-item label="发票类型" prop="type">
          <el-radio-group @change="groupType" v-model="form.type">
            <el-radio :label="1">增值税专票</el-radio>
            <el-radio :label="2">增值税普票</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="发票抬头" prop="title">
          <el-input v-model.trim="form.title"></el-input>
        </el-form-item>
        <el-form-item label="税号" prop="einNo">
          <el-input v-model.trim="form.einNo"></el-input>
        </el-form-item>
        <el-form-item
          v-show="valType === '1'? true:false"
          :required="valType === '1'? true:false"
          label="单位地址"
          prop="address"
        >
          <el-input v-model="form.address"></el-input>
        </el-form-item>
        <el-form-item
          v-show="valType === '1'? true:false"
          :required="valType === '1'? true:false"
          label="电话号码"
          prop="telphoneNo"
        >
          <el-input @input="change($event)" :maxlength="12" v-model.trim="form.telphoneNo"></el-input>
        </el-form-item>
        <!-- <el-form-item
          v-show="valType === '1'? true:false"
          :required="valType === '1'? true:false"
          label="电话号码"
        >
          <el-col :span="7">
            <el-form-item :required="valType === '1'? true:false" prop="phoneCode">
              <el-input @input="change($event)" :maxlength="5" v-model="form.phoneCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="1" style="text-align: center">-</el-col>
          <el-col :span="16">
            <el-form-item
              :required="valType === '1'? true:false"
              style="display: inline-block;width:100%"
              prop="telephone"
            >
              <el-input @input="change($event)" :maxlength="8" v-model="form.telephone"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>-->
        <el-form-item
          v-show="valType === '1'? true:false"
          :required="valType === '1'? true:false"
          label="开户银行"
          prop="openingBank"
        >
          <el-input v-model.trim="form.openingBank"></el-input>
        </el-form-item>
        <el-form-item
          v-show="valType === '1'? true:false"
          :required="valType === '1'? true:false"
          label="银行账户"
          prop="companyAccount"
        >
          <el-input v-model.trim="form.companyAccount"></el-input>
        </el-form-item>
        <!-- <el-form-item label="活动区域">
          <el-select v-model="form.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>-->

        <div class="addInvoice-top">
          <h4 style="margin-top:30px;">
            发票快递信息
            <!-- <span>?</span> -->
          </h4>
        </div>
        <el-form-item label="收件人" prop="recipient">
          <el-input v-model.trim="form.recipient"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobileNo">
          <el-input :maxlength="11" v-model.number.trim="form.mobileNo"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="emailAddress">
          <el-input v-model.trim="form.emailAddress"></el-input>
        </el-form-item>
        <el-form-item
          v-show="valType === '1'? true:false"
          :required="valType === '1'? true:false"
          label="区域"
          prop="selectedOptions"
        >
          <!-- <el-cascader :options="options" v-model="form.selectedOptions" @change="handleChange"></el-cascader> -->
          <el-cascader
            ref="cascaderAddr"
            v-model="form.selectedOptions"
            :options="options"
            @change="handleChange2"
          ></el-cascader>
        </el-form-item>
        <el-form-item
          v-show="valType === '1'? true:false"
          :required="valType === '1'? true:false"
          label="详细地址"
          prop="detailAddress"
          type="textarea"
        >
          <el-input v-model="form.detailAddress"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <a href="javascript:;" class="invoice-btn btn1" @click="define('form')">确 定</a>
        <a href="javascript:;" class="invoice-btn btn2" @click="closeForm">取 消</a>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { isNumber } from "@/validate/validate.js";
// import { regionDataPlus, CodeToText } from "element-china-area-data";
import {
  financeAddInvoice,
  queryInvoiceList,
  saveUpdateInvoice,
  delInvoiceById,
  getInvoiceById,
  getPropCompany,
  // getInvoiceList
  sysRegion
} from "@/api/information/information";
// 处理省市区相同
import { handleRepeat } from '@/validate/handle'
export default {
  name: "invoice",
  data() {
    // 验证函数
    let validateTitle = (rule, value, callback) => {
      if (this.form.title === "") {
        callback(new Error("请输入发票抬头"));
      } else {
        callback();
      }
    };
    // 单位地址
    let validateAddress = (rule, value, callback) => {
      if (this.form.address === "") {
        if (this.valType === "2") {
          callback();
        } else {
          callback(new Error("请输入单位地址"));
        }
      } else {
        callback();
      }
    };
    // 固定电话区号
    let validatePhoneCode = (rule, value, callback) => {
      if (this.form.phoneCode === "") {
        if (this.valType === "2") {
          callback();
        } else {
          callback(new Error("请输入区号"));
        }
      } else if (!isNumber(value)) {
        callback(new Error("请输入数字"));
      } else {
        callback();
      }
    };
    // 固定电话
    let validateTelephone = (rule, value, callback) => {
      if (this.form.telephone === "") {
        if (this.valType === "2") {
          callback();
        } else {
          callback(new Error("请输入固定电话"));
        }
      } else if (!isNumber(value)) {
        callback(new Error("请输入数字"));
      } else {
        callback();
      }
    };
    // 手机号
    let validateTelphoneNo = (rule, value, callback) => {
      if (this.form.telphoneNo === "") {
        if (this.valType === "2") {
          callback();
        } else {
          callback(new Error("请输入手机/电话"));
        }
      } 
      // else if (!isNumber(value)) {
      //   callback(new Error("请输入数字"));
      // } 
      else {
        callback();
      }
    };
    // 开户银行
    let validateOpeningBank = (rule, value, callback) => {
      if (this.form.openingBank === "") {
        if (this.valType === "2") {
          callback();
        } else {
          callback(new Error("请输入开户银行"));
        }
      } else {
        callback();
      }
    };
    // 开户银行
    let validateCompanyAccount = (rule, value, callback) => {
      if (this.form.companyAccount === "") {
        if (this.valType === "2") {
          callback();
        } else {
          callback(new Error("请输入银行账户"));
        }
      } else {
        callback();
      }
    };
    // 区域
    let validateSelectedOptions = (rule, value, callback) => {
      if (this.form.selectedOptions.length <= 0 || this.form.selectedOptions[0] == '') {
        if (this.valType === "2") {
          callback();
        } else {
          callback(new Error("请输入区域"));
        }
      } else {
        callback();
      }
    };
    // 详细地址
    let validateDetailAddress = (rule, value, callback) => {
      if (this.form.detailAddress === "") {
        if (this.valType === "2") {
          callback();
        } else {
          callback(new Error("请输入详细地址"));
        }
      } else {
        callback();
      }
    };

    return {
      // 发票类型控制
      valType: "1",
      // 对话框
      dialogFormVisible: false,
      // 表格数据 (发票抬头列表)
      tableData: [],
      // 总条数
      totalNum: 1,
      // 显示条数
      pageSize: 10,
      // 显示页数
      // 分页
      pageNum: 1,
      // 对话框标题
      titleName: "",
      formInline: {
        // 发票抬头
        title: "",
        // 收件人
        recipient: ""
      },
      // 表单数据
      // 省市区数据
      options: [],
      // selectedOptions: [],
      radio: "1",
      // 表单数据
      form: {
        // 公司名称
        pcName: "",
        // 发票抬头
        title: "",
        // 税号
        einNo: "",
        // 单位地址
        address: "",
        // 联系电话
        telphoneNo: "",
        // 开户银行
        openingBank: "",
        // 公司账号
        companyAccount: "",
        // 固定电话区号
        phoneCode: "",
        // 固定电话号码
        telephone: "",
        // 发票类型
        type: 1,
        // 收件人
        recipient: "",
        // 手机号
        mobileNo: "",
        // 邮箱
        emailAddress: "",
        // 邮编
        zipCode: "",
        // 区域
        area: "",
        // 详细地址
        detailAddress: "",
        // 省编码
        provinceCode: "",
        // 省
        provinceName: "",
        // 市编码
        cityCode: "",
        // 市
        cityName: "",
        // 区/县编码
        areaCode: "",
        // 区
        areaName: "",
        // 区域
        selectedOptions: []
      },
      // 表单验证
      rules: {
        // 公司名称
        // pcName: [
        //   { required: true, message: "请输入公司名称", trigger: "blur" }
        // ],
        // 发票抬头
        title: [{ required: true, message: "请输入发票抬头", trigger: "blur" }],
        // title: [{  validator: validateTitle }],
        // 税号
        einNo: [{ required: true, message: "请输入税号", trigger: "blur" }],
        // 单位地址
        address: [
          // {  message:"请输入单位地址", trigger: "blur" }
          { validator: validateAddress }
        ],
        // 联系电话
        telphoneNo: [{ validator: validateTelphoneNo }],
        // 开户银行
        // openingBank: [{ message: "请输入开户银行", trigger: "blur" }],
        openingBank: [{ validator: validateOpeningBank }],

        // 公司账号
        // companyAccount: [{ message: "请输入公司账号", trigger: "blur" }],
        companyAccount: [{ validator: validateCompanyAccount }],
        // 收件人
        recipient: [
          { required: true, message: "请输入收件人", trigger: "blur" }
        ],
        // 手机号
        mobileNo: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            pattern: /^1(3|4|5|6|7|8|9)\d{9}$/,
            message: "手机号格式不对",
            trigger: "blur"
          }
        ],
        // 邮箱
        emailAddress: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            pattern: /^([a-zA-Z0-9_\.\-]+)@([a-zA-Z0-9_\.\-]+)\.([a-zA-Z]{2,4})$/,
            message: "请输入正确的邮箱",
            trigger: "blur"
          }
        ],
        // 详细地址
        detailAddress: [{ validator: validateDetailAddress }],
        // 区域
        selectedOptions: [{ validator: validateSelectedOptions }],

        // 固定电话区号
        phoneCode: [{ validator: validatePhoneCode }],
        // phoneCode: [
        //   {  message: "请输入区号", trigger: "blur" },
        //   { pattern: /^[0-9]*$/, message: "请输入数字", trigger: "blur" }
        // ],
        // 固定电话
        telephone: [{ validator: validateTelephone }]
        // telephone: [
        //   { message: "请输入固定电话", trigger: "blur" },
        //   { pattern: /^[0-9]*$/, message: "请输入数字", trigger: "blur" }
        // ]
      }
    };
  },
  created() {
    // 发票抬头列表
    this.getData();
    // 获取公司信息
    this.getProp();
    this.getRegion();
  },
  methods: {
    //获取省市区
    getRegion() {
      sysRegion().then(xhrData => {
        // console.log(xhrData);
        if (xhrData.code === 200) {
          this.options = xhrData.data;
        }
      });
    },
    // 获取公司信息
    getProp() {
      getPropCompany().then(xhrData => {
        if (xhrData.code === 200) {
          this.form.pcName = xhrData.data.name;
        }
      });
    },
    // 提取公用 发票抬头列表
    getData() {
      const page = {
        title: this.formInline.title,
        recipient: this.formInline.recipient,
        pageSize: this.pageSize,
        pageNum: this.pageNum
      };

      queryInvoiceList(page).then(xhrData => {
        // console.log(xhrData);

        if (xhrData.code === 200) {
          for (var i = 0; i < xhrData.rows.length; i++) {
            if (xhrData.rows[i].type == "1") {
              xhrData.rows[i].type = "增值税专票";
              xhrData.rows[i]["dizi"] =
                xhrData.rows[i].area + xhrData.rows[i].detailAddress;
            } else if (xhrData.rows[i].type == "2") {
              xhrData.rows[i].type = "增值税普票";
              xhrData.rows[i]["dizi"] = xhrData.rows[i].emailAddress;
            }
          }
          this.tableData = xhrData.rows;
          this.totalNum = xhrData.total;
        }
      });
    },
    // 查询
    onSubmit() {
      this.getData();
    },
    handleSizeChange(val) {
      // 注意：在改变每页显示的条数时，要将页码显示到第一页
      this.pageNum = 1;
      // 改变每页显示的条数
      this.pageSize = val;
      this.getData();
    },
    handleCurrentChange(val) {
      // 改变默认的页数
      this.pageNum = val;
      this.getData();
    },
    // 发票类型选择触发
    groupType(val) {
      // this.$refs["form"].resetFields();
      if (val == "1") {
        this.form.type = 1;
      } else if (val == "2") {
        this.form.type = 2;
      }
      this.valType = "" + val;
    },
    // 关闭对话框
    resetForm() {
      // 清空表单
      this.$nextTick(() => {
        this.$refs["form"].resetFields();
        this.form.selectedOptions = [];
      });
      this.dialogFormVisible = false;
    },
    // 获取文本框值
    change(e) {
      this.$forceUpdate();
    },
    // 确定
    define(form) {
      // const telphoneNo = this.form.phoneCode + "-" + this.form.telephone;
      // this.form.telphoneNo = telphoneNo;
      if (this.titleName == "添加抬头发票") {
        this.$refs[form].validate(valid => {
          if (valid) {
            // console.log(this.form);
            // 表单验证后 请求
            financeAddInvoice(this.form).then(xhrData => {
              if (xhrData.code === 200) {
                this.$message.success({
                  message: "添加成功!"
                });
                // 更新 发票抬头列表
                this.getData();
                // 关闭对话框
                this.dialogFormVisible = false;
                // 清空表单
                // this.$nextTick(() => {
                this.$refs["form"].resetFields();
                this.form.selectedOptions = [];
                // });
              } else {
                this.$message.error({
                  message: "添加失败!"
                });
              }
            });
          } else {
            this.$message.warning({
              message: "请完善信息"
            });
            return false;
          }
        });
      } else if (this.titleName == "修改") {
        // this.$refs.form.clearValidate()
        // console.log(this.form);
        
        this.$refs[form].validate(valid => {
          if (valid) {
            // 表单验证后 请求
            if (this.form.cityCode == undefined) {
              this.form.cityCode = "";
              this.form.cityName = "";
            }
            if (this.form.areaCode == undefined) {
              this.form.areaCode = "";
              this.form.areaName = "";
            }
            // console.log(this.form);

            saveUpdateInvoice(this.form).then(xhrData => {
              if (xhrData.code === 200) {
                this.$message.success({
                  message: "修改成功!"
                });
                // 更新 发票抬头列表
                this.getData();
                // 关闭对话框
                this.dialogFormVisible = false;
                // 清空表单
                // this.$nextTick(() => {
                this.$refs["form"].resetFields();
                this.form.selectedOptions = [];
                // });
              } else {
                this.$message.error({
                  message: "修改失败!"
                });
              }
            });
          } else {
            return false;
          }
        });
      }
    },
    // 取消
    closeForm() {
      // 关闭对话框
      this.dialogFormVisible = false;
    },
    // 修改发票信息
    modify(row) {
      this.form.selectedOptions = []
      this.form.areaName = ''
      if (row.type == "增值税专票") {
        this.valType = "1";
      } else if (row.type == "增值税普票") {
        this.valType = "2";
      }
      // 打开对话框
      this.dialogFormVisible = true;
      // 修改对话框标题
      this.titleName = "修改";
      // 赋值到表单
      getInvoiceById(row.id).then(xhrData => {
        if (xhrData.code === 200) {
          let data = xhrData.data;
          this.form.title = data.title; // 发票抬头
          this.form.einNo = data.einNo; // 税号
          this.form.address = data.address; // 单位地址
          this.form.openingBank = data.openingBank; // 开户银行
          this.form.recipient = data.recipient; // 收件人
          this.form.telphoneNo = data.telphoneNo // 电话号码
          // this.form.phoneCode = data.telphoneNo.split("-")[0]; //  固定电话区号
          // this.form.telephone = data.telphoneNo.split("-")[1]; // 固定电话号码
          this.form.emailAddress = data.emailAddress; // 邮箱
          this.form.mobileNo = data.mobileNo; // 手机号
          let arr = [];
          arr[0] = data.provinceName; // 省
          arr[1] = data.cityName; // 市
          arr[2] = data.areaName; // 区
          this.form.provinceName = arr[0]; // 省
          this.form.cityName = arr[1]; // 市
          this.form.areaName = arr[2]; // 区
          this.form.detailAddress = data.detailAddress; // 详细地址
          this.form.companyAccount = data.companyAccount; // 银行账户
          this.form.id = data.id; // id
          this.form.type = data.type;
          // this.form.area = arr[0]+arr[1]+arr[2] 
          this.form.area =  handleRepeat(arr[0],arr[1],arr[2])
          this.$set(this.form, "selectedOptions", arr);
          // console.log(this.form);
          
        }
      });
    },
    // 删除发票信息
    delInvoice(row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delInvoiceById(row.id).then(xhrData => {
            if (xhrData.code === 200) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              // 更新发票列表
              this.getData();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 添加发票抬头按钮
    toAddInvoice() {
      // 恢复默认表单
      (this.form = {
        // 公司名称
        pcName: "",
        // 发票抬头
        title: "",
        // 税号
        einNo: "",
        // 单位地址
        address: "",
        // 联系电话
        telphoneNo: "",
        // 开户银行
        openingBank: "",
        // 公司账号
        companyAccount: "",
        // 固定电话区号
        phoneCode: "",
        // 固定电话号码
        telephone: "",
        // 发票类型
        type: 1,
        // 收件人
        recipient: "",
        // 手机号
        mobileNo: "",
        // 邮箱
        emailAddress: "",
        // 区域
        area: "",
        // 详细地址
        detailAddress: "",
        // 省编码
        provinceCode: "",
        // 省
        provinceName: "",
        // 市编码
        cityCode: "",
        // 市
        cityName: "",
        // 区/县编码
        areaCode: "",
        // 区
        areaName: "",
        // 区域
        selectedOptions: []
      }),
        // 默认选中专票
        (this.valType = "1");
      // this.$router.push("/addInvoice");
      // 打开对话框
      this.dialogFormVisible = true;
      // 修改对话框标题
      this.titleName = "添加抬头发票";
    },
     // 选择公司所在省、市、区
    handleChange2(val) {
      // console.log(val);
      this.form.provinceName = val[0];
      this.form.cityName = val[1];
      this.form.areaName = val[2];
      // this.form.area =
      //   this.form.provinceName + this.form.cityName + this.form.areaName;
      this.form.area = handleRepeat(this.form.provinceName,this.form.cityName,this.form.areaName)
    }
  }
};
</script>
<style>
#invoice-dialog .el-dialog__header {
  background-color: #e6e8eb;
}
#invoice-dialog .invoice-btn {
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
#invoice-dialog .invoice-btn.btn1 {
  background: rgba(239, 130, 0, 1);
  border: 1px solid rgba(206, 112, 0, 1);
  color: #fff;
}
#invoice-dialog .invoice-btn.btn2 {
  border: 1px solid rgba(0, 0, 0, 0.25);
}
#invoice-dialog .el-dialog__title {
  font-size: 20px;
  font-weight: bold;
}
#invoice-dialog .el-dialog__body {
  padding-left: 40px;
  padding-right: 40px;
  padding-bottom: 0;
  box-sizing: border-box;
}
#invoice-dialog .el-dialog__footer {
  background-color: #e6e8eb;
}
#invoice-dialog .el-cascader--medium {
  width: 100%;
}
#invoice-dialog .el-form-item__label {
  color: #979797;
}
</style>
<style lang="scss" scoped>
.invoice {
  width: 100%;
  padding: 15px;
  min-height: calc(88vh);
  box-sizing: border-box;
  background-color: #e6e8eb;
  padding-bottom: 30px;

  .invoice-conter {
    min-height: calc(88vh);
    background-color: #fff;
    border-radius: 5px;
    position: relative;
    padding-bottom: 100px;
    .invoice-top {
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
    .addInvoice {
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
  #invoice-dialog h4 {
    font-size: 16px;
  }
}
</style>
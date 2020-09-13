<template>
  <!-- 保险公司列表 -->
  <div class="publicStyle">
    <div class="publicStyle-conter">
      <el-row :gutter="20" class="record-top" style="margin-left: 0px; margin-right: 0px;">
        <el-col :span="21">
          <el-form id="companyForm" :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="公司名称:">
              <el-input @keyup.enter.native="query" v-model.trim="formInline.name" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="联系电话:">
              <el-input @keyup.enter.native="query" v-model.trim="formInline.contactPhone" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="info" plain @click="query">查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="3">
          <div class="addrecord" @click="addBtn">新增保险公司</div>
        </el-col>
      </el-row>
      <!-- 列表 -->
      <el-table :data="tableData" style="width: 100%">
        <el-table-column  type="index" label="序号" width="80"></el-table-column>
        <el-table-column show-overflow-tooltip prop="name" label="保险公司名称" min-width="200px"></el-table-column>
        <el-table-column show-overflow-tooltip prop="invoiceAddress" label="单位地址" min-width="200px"></el-table-column>
        <el-table-column show-overflow-tooltip prop="contactPhone" label="联系电话" min-width="120px"></el-table-column>
        <el-table-column show-overflow-tooltip prop="createTime" label="创建时间" min-width="180px"></el-table-column>
        <el-table-column show-overflow-tooltip prop="address" label="操作" min-width="200px">
          <template slot-scope="scope">
            <a
              href="javascript:;"
              style="margin-right:3px; color: #1890ff;"
              @click="modifyCurrent(scope.row)"
            >修改</a>|
            <a
              href="javascript:;"
              style="margin-right:3px; color: #1890ff;"
              @click="cooperation(scope.row)"
            >合作产品</a>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNum"
      ></el-pagination>
      <!-- 对话框 -->
      <el-dialog
        @close="closeDialog"
        :title="dialogText"
        id="seeDialog"
        :visible.sync="dialogVisible"
        width="50%"
      >
        <el-form ref="form" :rules="rules" :model="form" label-width="120px" label-position="right">
          <!-- 基本信息 -->
          <div class="dialog-from">
            <h3>基本信息</h3>
            <el-form-item label="保险公司名称:" prop="name">
              <el-input v-model.trim="form.name" maxlength="40" placeholder="请输入保险公司名称"></el-input>
            </el-form-item>
            <el-form-item label="联系人:" prop="contact">
              <el-input v-model.trim="form.contact" maxlength="10" placeholder="请输入联系人"></el-input>
            </el-form-item>
            <el-form-item label="联系电话:" prop="contactPhone">
              <el-input type="number" v-model.trim="form.contactPhone" placeholder="请输入联系电话或固话"></el-input>
            </el-form-item>
            <el-form-item label="公司地址:" prop="address">
              <el-input v-model.trim="form.address" maxlength="50" placeholder="请输入公司地址"></el-input>
            </el-form-item>
            <el-form-item label="备注:" prop="remark">
              <el-input
                type="textarea"
                v-model="form.remark"
                maxlength="100"
                show-word-limit
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </div>
          <!-- 开票信息 -->
          <div class="dialog-from">
            <h3>开票信息</h3>
            <el-form-item label="户名:" prop="accountName">
              <el-input v-model.trim="form.accountName" maxlength="40" placeholder="请输入户名"></el-input>
            </el-form-item>
            <el-form-item label="税号:" prop="taxNumber">
              <el-input v-model.trim="form.taxNumber" placeholder="请输入税号"></el-input>
            </el-form-item>
            <el-form-item label="单位地址:" prop="invoiceAddress">
              <el-input v-model.trim="form.invoiceAddress" maxlength="50" placeholder="请输入单位地址"></el-input>
            </el-form-item>
            <el-form-item label="开户银行:" prop="openAccountBank">
              <el-input v-model.trim="form.openAccountBank" maxlength="50" placeholder="请输入开户银行"></el-input>
            </el-form-item>
            <el-form-item label="银行账户:" prop="bankAccount">
              <el-input type="number" v-model.trim="form.bankAccount" placeholder="请输入银行账户"></el-input>
            </el-form-item>
          </div>
          <!-- 合作产品 -->
          <div class="dialog-from">
            <h3>合作产品</h3>
            <el-form-item label="产品:" prop="prodTypeIdList">
              <el-checkbox-group v-model="form.prodTypeIdList">
                <el-checkbox
                  v-for="(item,index) in cities"
                  :label="item.id"
                  :key="index"
                >{{item.prodName}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </div>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <a href="javascript:;" class="btn btn1" @click="confirm('form')">{{btnTitle}}</a>
          <a href="javascript:;" class="btn btn2" @click="dialogVisible=false">取 消</a>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import "../../../../assets/styles/publicStyle.css";
// insCompanyList
// 请求
import {
  insCompanyList,
  systemProdTypeGetListByQuery,
  insCompany,
  insCompanyGetId,
  insCompanyPut
} from "@/api/information/information";
export default {
  name: "",
  data() {
    return {
      // 搜索查询表单
      formInline: {
        // 公司名称
        name: "",
        // 联系电话
        contactPhone: ""
      },
      // 列表数据
      tableData: [],
      // 总条数
      totalNum: 1,
      // 显示条数
      pageSize: 10,
      // 显示页数
      // 分页
      pageNum: 1,
      // 对话框
      dialogVisible: false,
      // 对话框标题
      dialogText: "",
      // 表单内容
      form: {
        // 保险公司名称
        name: "",
        // 联系人
        contact: "",
        // 联系人电话
        contactPhone: "",
        // 公司地址
        address: "",
        // 备注
        remark: "",
        // 户名
        accountName: "",
        // 税号
        taxNumber: "",
        // 单位地址
        invoiceAddress: "",
        // 开户银行
        openAccountBank: "",
        // 银行账户
        bankAccount: "",
        // 随意修改后的checked项
        prodTypeIdList: []
      },
      // 表单验证
      rules: {
        // 保险公司名称
        name: [
          { required: true, message: "请输入保险公司名称", trigger: "blur" }
        ],
        // 联系人
        contact: [{ required: true, message: "请输入联系人", trigger: "blur" }],
        // 联系电话
        contactPhone: [
          { required: true, message: "请输入联系电话", trigger: "blur" }
        ],
        // 公司地址
        address: [
          { required: true, message: "请输入公司地址", trigger: "blur" }
        ],
        // 户名
        accountName: [
          { required: true, message: "请输入户名", trigger: "blur" }
        ],
        // 税号
        taxNumber: [{ required: true, message: "请输入税号", trigger: "blur" }],
        // 单位地址
        invoiceAddress: [
          { required: true, message: "请输入单位地址", trigger: "blur" }
        ],
        // 开户银行
        openAccountBank: [
          { required: true, message: "请输入开户银行", trigger: "blur" }
        ],
        // 银行账户
        bankAccount: [
          { required: true, message: "请输入银行账户", trigger: "blur" }
        ],
        prodTypeIdList: [{ required: true, message: "请选择", trigger: "blur" }]
      },
      // 复选框数据
      cities: [],
      // 对话框提交按钮名称
      btnTitle: "",
      // 保存产品用于比较
      compareArr: []
    };
  },
  created() {
    this.getListData();
  },
  methods: {
    // 获取列表信息
    getListData() {
      const page = {
        name: this.formInline.name,
        contactPhone: this.formInline.contactPhone,
        pageSize: this.pageSize,
        pageNum: this.pageNum
      };
      insCompanyList(page).then(xhrData => {
        // console.log(xhrData);
        if (xhrData.code === 200) {
          this.tableData = xhrData.rows;
          // 总条数
          this.totalNum = xhrData.total;
        }
      });
    },
    // 获取合作产品信息
    getProductData() {
      // 请求获取合作产品
      systemProdTypeGetListByQuery().then(xhrData => {
        if (xhrData.code === 200) {
          this.cities = xhrData.rows;
        }
      });
    },
    // 修改按钮
    modifyCurrent(row) {
      // 修改 对话框标题
      this.dialogText = "修改";
      // 对话框提交按钮名称
      this.btnTitle = "修 改";
      // 打开对话框
      this.dialogVisible = true;
      // console.log(row.id);
      // 调用方法 获取合作产品信息
      this.getProductData();
      // 请求获取当前详情
      insCompanyGetId(row.id).then(xhrData => {
        // console.log(xhrData);
        if (xhrData.code === 200) {
          this.form = xhrData.data;
          this.compareArr = xhrData.data.prodTypeIdList;
        }
      });
    },
    // 合作产品按钮
    cooperation(row) {
      // this.$router.push({path:'/voucher2',query: {id:row.credentialId,type:row.insureAmount}})
      // 跳转页面
      this.$router.push({ path: "/cooperation" ,query: {id:row.id}});
    },
    //在改变每页显示的条数
    handleSizeChange(val) {
      // 注意：在改变每页显示的条数时，要将页码显示到第一页
      this.pageNum = 1;
      // 改变每页显示的条数
      this.pageSize = val;
      // 更新列表
      this.getListData();
    },
    // 页数
    handleCurrentChange(val) {
      // 改变默认的页数
      this.pageNum = val;
      // 更新列表
      this.getListData();
    },
    // 关闭对话框
    closeDialog() {
      //  清空表单
      this.$refs["form"].resetFields();
    },
    // 查询
    query() {
      this.getListData();
    },
    // 对话框提交按钮
    confirm(form) {
      // 判断是新增还是修改
      // 新增
      if (this.dialogText == "新增保险公司") {
        // 表单验证
        this.$refs[form].validate(valid => {
          // 通过表单验证
          if (valid) {
            // console.log(this.form);
            // 请求 新增
            insCompany(this.form).then(xhrData => {
              // console.log(xhrData);
              if (xhrData.code === 200) {
                // 提示
                this.$message({
                  type: "success",
                  message: " 添加成功!"
                });
                //  关闭对话框
                this.dialogVisible = false;
                //  清空表单
                this.$refs["form"].resetFields();
                // 更新列表
                this.getListData();
              }
            });
          } else {
            // 提示
            this.$message({
              type: "warning",
              message: " 请输入完善!"
            });
            return false;
          }
        });
      } else if (this.dialogText == "修改") {
        // 表单验证
        this.$refs[form].validate(valid => {
          // 通过表单验证
          if (valid) {
            // 判断 产品是否更改
            // 为改变
            if (
              this.scalarArrayEquals(this.form.prodTypeIdList, this.compareArr)
            ) {
              // 请求修改保险公司
              insCompanyPut(this.form).then(xhrData => {
                if (xhrData.code === 200) {
                  // 提示
                  this.$message({
                    type: "success",
                    message: " 修改成功!"
                  });
                  //  关闭对话框
                  this.dialogVisible = false;
                  // 更新列表
                  this.getListData();
                }
              });
            }
            // 改变
            else {
              this.$confirm("所选产品中存在变更, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
              })
                .then(() => {
                  // 请求修改保险公司
                  insCompanyPut(this.form).then(xhrData => {
                    if (xhrData.code === 200) {
                      // 提示
                      this.$message({
                        type: "success",
                        message: " 修改成功!"
                      });
                      //  关闭对话框
                      this.dialogVisible = false;
                      // 更新列表
                      this.getListData();
                    }
                  });
                })
                .catch(() => {
                  this.$message({
                    type: "info",
                    message: "已取消"
                  });
                });
            }
          } else {
            // 提示
            this.$message({
              type: "warning",
              message: " 请输入完善!"
            });
            return false;
          }
        });
      }
    },
    // 新增保险公司按钮
    addBtn() {
      // 修改 对话框标题
      this.dialogText = "新增保险公司";
      // 修改 对话框提交按钮名称
      this.btnTitle = "新 增";
      // 打开对话框
      this.dialogVisible = true;
      // 复原表单
      this.form = {
        // 保险公司名称
        name: "",
        // 联系人
        contact: "",
        // 联系电话
        contactPhone: "",
        // 公司地址
        address: "",
        // 备注
        remark: "",
        // 户名
        accountName: "",
        // 税号
        taxNumber: "",
        // 单位地址
        invoiceAddress: "",
        // 开户银行
        openAccountBank: "",
        // 银行账户
        bankAccount: "",
        // 随意修改后的checked项
        prodTypeIdList: []
      };
      // 调用方法 获取合作产品信息
      this.getProductData();
    },
    // 按需赋值给另一个对象
    objFun(objA, objB) {
      Object.keys(objA).forEach(key => {
        objA[key] = objB[key] || objA[key];
      });
      return objA;
      // console.log(objA);
    },
    // 判断俩数组是否相等
    scalarArrayEquals(array1, array2) {
      return (
        array1.length == array2.length &&
        array1.every(function(v, i) {
          return v === array2[i];
        })
      );
    }
  }
};
</script>
<style>
#seeDialog .el-dialog__header {
  background-color: #e6e8eb;
}
#seeDialog .el-dialog__title {
  font-size: 20px;
  font-weight: bold;
}
#seeDialog .el-dialog__footer {
  background-color: #e6e8eb;
}
#seeDialog .el-dialog__body {
  padding-left: 30px;
  padding-right: 30px;
  padding-bottom: 30px;
  box-sizing: border-box;
}
#seeDialog .el-dialog__footer {
  padding-bottom: 10px;
}
#seeDialog .btn {
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
#seeDialog .btn.btn1 {
  background: rgba(239, 130, 0, 1);
  border: 1px solid rgba(206, 112, 0, 1);
  color: #fff;
}
#seeDialog .btn.btn2 {
  border: 1px solid rgba(0, 0, 0, 0.25);
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type="number"] {
  -moz-appearance: textfield;
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
      width: 200px;
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
  bottom: 40px;
  left: 20px;
  right: 0;
}
#seeDialog {
  .dialog-from {
    h3 {
      font-size: 18px;
      padding-bottom: 20px;
    }
  }
}
</style>
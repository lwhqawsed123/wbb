<template>
  <!-- 雇主险保单管理 -->
  <div class="rechargeRecord">
    <div class="rechargeRecord-conter">
      <el-row :gutter="20" class="rechargeRecord-top" style="margin-left: 0px; margin-right: 0px;">
        <el-col :span="21">
          <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="姓名：" prop="name">
              <el-input @keyup.enter.native="onSubmit" v-model.trim="formInline.name"></el-input>
            </el-form-item>
            <el-form-item label="保障周期：" prop="periodUnit">
              <el-select v-model="formInline.periodUnit" clearable placeholder="请选择保障周期">
                <el-option label="年" value="Y"></el-option>
                <el-option label="月" value="M"></el-option>
                <el-option label="日" value="D"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="保障状态：" prop="insStatus">
              <el-select v-model="formInline.insStatus" clearable placeholder="请选择保障状态">
                <el-option label="在保" value="3"></el-option>
                <el-option label="退保" value="4"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="info" plain @click="onSubmit">查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="3">
          <div class="addproject" @click="handleExport">导出 EXCEL</div>
        </el-col>
      </el-row>
      <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%">
        <el-table-column label="凭证号" min-width="15%" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.policyNo }}</template>
        </el-table-column>
        <el-table-column label="雇员姓名" min-width="10%" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="被保险人手机" min-width="15%" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.phone }}</template>
        </el-table-column>
        <el-table-column prop="validity" label="保单有效期" min-width="25%" show-overflow-tooltip></el-table-column>
        <el-table-column prop="periodUnit" label="保障周期" min-width="10%" show-overflow-tooltip></el-table-column>
        <el-table-column prop="insStatus" label="保单状态" min-width="10%" show-overflow-tooltip></el-table-column>
        <el-table-column prop="caoZuo" label="操作" min-width="15%">
          <template slot-scope="scope">
            <a href="javascript:;" style="color:#1890FF" @click="surrender(scope.row)">退保</a> |
            <a href="javascript:;" style="color:#1890FF" @click="replace(scope.row)">替换批改</a>
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
    <!-- 替换批改 对话框 -->
    <el-dialog
      id="bd-dialog"
      :title="titleName"
      :visible.sync="dialogFormVisible"
      @close="resetForm('form')"
      width="65%"
    >
      <div class="bd-dialog-wrap">
        <div class="bd-dialog-left">
          <h2>变更前</h2>
          <p>
            <span>保单号</span>
            <span>{{AfterForm.policyNo}}</span>
          </p>
          <p>
            <span>姓名</span>
            <span>{{AfterForm.name}}</span>
          </p>
          <p>
            <span>身份证</span>
            <span>{{AfterForm.certNo}}</span>
          </p>
          <p>
            <span>手机</span>
            <span>{{AfterForm.phone}}</span>
          </p>
          <p>
            <span>所属工种</span>
            <!-- <span>{{AfterForm.code}}</span> -->
            <el-select :disabled="true" v-model="AfterForm.jobCode" placeholder="请选择">
              <el-option
                v-for="(item,index) in PropJobsList"
                :key="index"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>
          </p>
        </div>
        <div class="bd-dialog-right">
          <h2>变更后</h2>
          <el-form
            :model="form"
            ref="form"
            :rules="rules"
            label-width="120px"
            label-position="left"
          >
            <el-form-item label="保单号" prop="policyNo">
              <el-input :disabled="true" v-model="form.policyNo"></el-input>
            </el-form-item>
            <el-form-item label="姓名" prop="name">
              <el-input v-model.trim="form.name"></el-input>
            </el-form-item>
            <el-form-item label="身份证" prop="certNo">
              <el-input v-model.trim="form.certNo"></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="phone">
              <el-input :maxlength='11' v-model.trim="form.phone"></el-input>
            </el-form-item>
            <el-form-item id="code" label="所属工种" prop="jobCode">
              <el-select v-model="form.jobCode" placeholder="请选择">
                <el-option
                  v-for="(item,index) in PropJobsList"
                  :key="index"
                  :label="item.name"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <!-- <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>-->
        <a href="javascript:;" class="project-btn btn1" @click="application('form')">替换批改</a>
        <a href="javascript:;" class="project-btn btn2" @click="dialogFormVisible= false">关闭</a>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  insEmpApplyDetails,
  insEmpApplyExport,
  propJobsList,
  insEmpEndorse
} from "@/api/information/information";
// 验证
import {ShiFanManShiBaSui, Identity,IdCard } from "@/validate/validate.js";
export default {
  name: "rechargeRecord",
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
      // 对话框
      dialogFormVisible: false,
      // 对话框title
      titleName: "",
      // 表格数据
      tableData: [],
      // 总条数
      totalNum: 1,
      formInline: {
        // 姓名
        name: "",
        // 显示条数
        pageSize: 10,
        // 显示页数
        // 分页
        pageNum: 1,
        // 保障周期
        periodUnit: "",
        // 保障状态
        insStatus: ""
      },
      // 变更后信息 表单数据
      form: {
        // 保单号
        policyNo: "",
        // 姓名
        name: "",
        // 身份证
        certNo: "",
        // 手机号
        phone: "",
        // 类型 1 批增（增加人），2 批件（退保），3 修改
        endoreType: "1",
        // 所属工种
        jobCode: ""
      },
      // 表单验证
      rules: {
        // 姓名
        name: [
          { required: true, message: "请输入雇员姓名", trigger: "blur" }
        ],
        // 身份证
        certNo: [{ required: true, validator: isAdult, trigger: "blur" }],
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
        jobCode: [{ required: true, message: "请选择", trigger: "change" }]
      },
      // 变更前信息
      AfterForm: {
        // 保单号
        policyNo: "",
        // 姓名
        name: "",
        // 身份证
        certNo: "",
        // 手机号
        phone: "",
        // 所属工种
        jobCode: "",
        // 类型 1 批增（增加人），2 批件（退保），3 修改
        endoreType: "2"
      },
      // 最后提交数据
      SubmissionData: {
        // 保单申请id
        applyId: "",
        // 是否直接提交到保险公司，0 不提交，1提交到保险公司
        toIns: 1,
        // 用户
        endorseUsers: []
      },
      // 工种
      PropJobsList: []
    };
  },
  created() {
    // 获取 保单管理信息
    this.getApplyDetailsData();
    // 获取 工种
    this.getPropJobsList();
  },
  methods: {
    // 替换批改按钮
    application(form) {
      this.SubmissionData.endorseUsers = []
      this.SubmissionData.endorseUsers.push(this.form, this.AfterForm);
      // 通过表单验证
      this.$refs[form].validate(valid => {
        if (valid) {
          // 请求 雇主险批改
          insEmpEndorse(this.SubmissionData).then(xhrData => {
            if (xhrData.code === 200) {
              this.$message.success({
                message: "批改成功!"
              });
              // 关闭对话框
              this.dialogFormVisible = false;
              // 更新列表
              this.getApplyDetailsData();
            } else {
              this.$message.error({
                message: "批改失败!"
              });
              // 关闭对话框
              this.dialogFormVisible = false;
            }
          });
        } else {
          // console.log("error submit!!");
          this.$message.warning({
            message: "请输入完全!"
          });
          return false;
        }
      });
    },
    // 关闭对话框
    resetForm(form) {
      // 清空表单
        this.$refs["form"].resetFields();
    },
    // 获取工种
    getPropJobsList() {
      propJobsList().then(xhrData => {
        if (xhrData.code === 200) {
          this.PropJobsList = xhrData.rows;
        }
      });
    },
    // 获取 雇主险保单管理详细
    getApplyDetailsData() {
      const page = {
        pageSize: this.formInline.pageSize,
        pageNum: this.formInline.pageNum,
        periodUnit: this.formInline.periodUnit,
        insStatus: this.formInline.insStatus,
        name: this.formInline.name
      };
      // 调用 雇主险保单管理 请求
      insEmpApplyDetails(page).then(xhrData => {
        
        // 赋值数据
        this.tableData = xhrData.rows;
        // 获取总条数
        this.totalNum = xhrData.total;
        // 保单状态
        if (xhrData.code === 200) {
          for (let i = 0; i < this.tableData.length; i++) {
            this.tableData[i].validity =
              this.tableData[i].beginDate.split(" ")[0] +
              " 至 " +
              this.tableData[i].endDate.split(" ")[0];
            if (this.tableData[i].periodUnit == "Y") {
              this.tableData[i].periodUnit = "年";
            } else if (this.tableData[i].periodUnit == "M") {
              this.tableData[i].periodUnit = "月";
            } else if (this.tableData[i].periodUnit == "D") {
              this.tableData[i].periodUnit = "日";
            }
            // 整个保单的状态 （0 ：未知，1：在保，2：失效）
            if (this.tableData[i].status == "1") {
              // 单个投保状态 （1：准备申报，2 ：已申报，3：批增， 4：批减，5：批改）
              if (this.tableData[i].insStatus == "1") {
                this.tableData[i].insStatus = "准备申报";
              } else if (this.tableData[i].insStatus == "2" || this.tableData[i].insStatus == "3") {
                this.tableData[i].insStatus = "在保";
              } else if (this.tableData[i].insStatus == "4") {
                this.tableData[i].insStatus = "退保";
              } else if (this.tableData[i].insStatus == "5") {
                this.tableData[i].insStatus = "批改";
              } else {
                this.tableData[i].insStatus = "未知";
              }
            } else if (this.tableData[i].status == "2") {
              this.tableData[i].insStatus = "失效";
            }
          }
        }
      });
    },
    // 替换批改
    replace(row) {
      // 打开对话框
      this.dialogFormVisible = true;
      // 修改 对话框title
      this.titleName = "替换批改";
      // 赋值到变更前
      this.AfterForm.policyNo = row.policyNo;
      this.AfterForm.name = row.name;
      this.AfterForm.certNo = row.certNo;
      this.AfterForm.phone = row.phone;
      this.AfterForm.jobCode = row.jobCode;
      // 赋值到变更后
      this.form.policyNo = row.policyNo;
      // 赋值到最后提交数据
      // 保单申请id
      this.SubmissionData.applyId = row.applyId;
    },
    // 退保按钮
    surrender(row) {
      this.$confirm("此操作将永久退保, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const data = {
            applyId: row.applyId,
            toIns: 1,
            endorseUsers: [
              {
                name: row.name,
                certNo: row.certNo,
                endoreType: "2",
                phone: row.phone
              }
            ]
          };
          // 请求 退保
          insEmpEndorse(data).then(xhrData => {
            if (xhrData.code === 200) {
              this.$message({
                type: "success",
                message: "退保成功!"
              });
              // 更新列表
              this.getApplyDetailsData();
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
    // 查询
    onSubmit() {
      // 调用 方法
      this.getApplyDetailsData();
    },
    handleSizeChange(val) {
      // 注意：在改变每页显示的条数时，要将页码显示到第一页
      this.formInline.pageNum = 1;
      // 改变每页显示的条数
      this.formInline.pageSize = val;
      this.getApplyDetailsData();
    },
    handleCurrentChange(val) {
      // 改变默认的页数
      this.formInline.pageNum = val;
      this.getApplyDetailsData();
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
          return insEmpApplyExport(formInline);
        })
        .then(response => {
          this.download(response.msg);
        })
        .catch(function() {});
    }
  }
};
</script>

<style>
#bd-dialog .el-dialog__header {
  background-color: #e6e8eb;
}
#bd-dialog .project-btn {
  width: 82px;
  height: 32px;
  border-radius: 2px;
  text-align: center;
  line-height: 32px;
  font-weight: bold;
  display: inline-block;
  font-size: 14px;
}
#bd-dialog .project-btn.btn1 {
  background: rgba(239, 130, 0, 1);
  border: 1px solid rgba(206, 112, 0, 1);
  color: #fff;
}
#bd-dialog .project-btn.btn2 {
  border: 1px solid rgba(0, 0, 0, 0.25);
}
#bd-dialog .el-dialog__title {
  font-size: 20px;
  font-weight: bold;
}
#bd-dialog .el-dialog__body {
  padding-left: 40px;
  padding-right: 40px;
  padding-bottom: 0;
  box-sizing: border-box;
}
#bd-dialog .el-dialog__footer {
  background-color: #e6e8eb;
}
#code .el-select {
  width: 100%;
}
</style>
<style lang="scss" scoped>
.rechargeRecord {
  width: 100%;
  padding: 15px;
  min-height: calc(88vh);
  box-sizing: border-box;
  background-color: #e6e8eb;
  padding-bottom: 30px;
  .rechargeRecord-conter {
    min-height: calc(88vh);
    background-color: #fff;
    border-radius: 5px;
    position: relative;
    padding-bottom: 100px;
    .rechargeRecord-top {
      margin-left: 0;
      margin-right: 0;
      min-height: 60px;
      border-bottom: 1px solid #d6d6d6;
      .addproject {
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
      .el-form--inline .el-form-item {
        margin-top: 10px;
        margin-bottom: 0;
        .el-input {
          width: 140px;
        }
      }
    }
    .addrechargeRecord {
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
  #bd-dialog {
    .bd-dialog-wrap {
      display: flex;
      justify-content: space-between;
      // padding: 40px;
      // box-sizing: border-box;
      padding-bottom: 30px;
      .bd-dialog-left {
        width: 50%;
        h2 {
          font-size: 16px;
          padding-bottom: 20px;
          font-weight: bold;
          color: #000;
        }

        p {
          font-size: 14px;
          color: #5f5f5f;
          display: flex;
          height: 41px;
          margin-top: 16px;
          line-height: 40px;
          span {
            display: block;
            font-weight: bold;
          }
          span:nth-child(1) {
            width: 120px;
          }
          span:nth-child(2) {
            color: #7d7d7d;
          }
        }
      }
      .bd-dialog-right {
        width: 50%;
        h2 {
          font-size: 16px;
          padding-bottom: 20px;
          font-weight: bold;
          color: #000;
        }
      }
    }
  }
}
</style>
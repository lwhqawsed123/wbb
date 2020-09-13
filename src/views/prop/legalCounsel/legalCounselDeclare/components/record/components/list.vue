<template>
  <!-- 家财凭证管理 -->
  <div >
    <div >
      <el-row
        :gutter="20"
        class="record-top"
        style="margin-left: 0px; margin-right: 0px; padding-bottom:10px"
      >
        <el-col :span="21">
          <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="订单号：">
              <el-input v-model.trim="formInline.orderNo" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="物业公司：">
              <el-input v-model.trim="formInline.propertyCompany" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="委托状态：">
              <el-select clearable v-model="formInline.status" placeholder="请选择">
                <el-option
                  v-for="(item) in productList"
                  :key="item.id"
                  :label="item.description"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="律师函类型：">
              <el-select clearable v-model="formInline.legalCounselType" placeholder="请选择">
                <el-option
                  v-for="(item) in productList"
                  :key="item.id"
                  :label="item.description"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="委托时间：">
              <el-date-picker v-model="formInline.dateStart" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
            <el-form-item>
              <span>-</span>
            </el-form-item>
            <el-form-item>
              <el-date-picker v-model="formInline.dateEnd" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="info" plain @click="onSubmit">查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="3">
          <!-- <div class="addrecord" @click="handleExport">导出 EXCEL</div> -->
        </el-col>
      </el-row>
      <!-- <div style="margin-top:10px;margin-bottom:10px"></div> -->
      <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100% ">
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <el-table-column
          prop="credentialId"
          :show-overflow-tooltip="true"
          label="订单号"
          min-width="200px"
        ></el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          prop="houseAddress"
          label="委托数量"
          min-width="200px"
        ></el-table-column>
        <el-table-column prop="insureAmount" label="审核数量" min-width="100px" show-overflow-tooltip></el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          prop="effective"
          label="订单金额"
          min-width="200px"
        ></el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          prop="effective"
          label="律师函类型"
          min-width="200px"
        ></el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          prop="effective"
          label="委托人"
          min-width="200px"
        ></el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          prop="effective"
          label="委托状态"
          min-width="200px"
        ></el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          prop="effective"
          label="操作"
          min-width="200px"
        ></el-table-column>
        <el-table-column label="实付金额" min-width="200px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="see(scope.row)"
              v-hasPermi="['info:invoice:edit']"
            >查看明细</el-button>
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
              @click="deleteOwner(scope.row)"
            >删除</el-button>
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
    <!-- 变更申请对话框 -->
    <el-dialog
      @close="resetForm('changeForm')"
      class="record-dialog"
      title="保单信息变更申请"
      :visible.sync="dialogFormVisible"
    >
      <p>
        凭证号
        <span>{{changeForm.credentialId}}</span>
      </p>
      <p>
        保单号
        <span>{{insuranceNo}}</span>
      </p>
      <p>
        原地址
        <span>{{houseAddress}}</span>
      </p>
      <el-form
        ref="changeForm"
        :rules="rules"
        :model="changeForm"
        label-position="left"
        label-width="120px"
      >
        <el-form-item label="变更后地址" prop="houseAddress">
          <el-input style="margin-left:-20px;" v-model="changeForm.houseAddress"></el-input>
        </el-form-item>
        <el-form-item label="门牌号" prop="houseNumber">
          <el-input style="margin-left:-20px;" v-model="changeForm.houseNumber"></el-input>
        </el-form-item>
      </el-form>
      <p class="record-zhu">注：一个保单信息变更只能申请1次，请确认变更的信息的正确性；此申请流程一般需要5工作日；敬请谅解！</p>
      <div slot="footer" class="dialog-footer" prop="changeApply">
        <el-button class="record-true" type="primary" @click="changeApply('changeForm')">变更申请</el-button>
        <el-button @click="dialogFormVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  queryApplyHouseInsureList,
  getProjectRoleList,
  insRuleGetProduct,
  changeApplyAddressInfo,
  exportApplyRecord
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
        // 项目id
        pId: "",
        // 手机号
        orderNo: "",
        // 产品id
        productId: "",
        // 当前显示条数
        pageSize: 10,
        // 当前显示页数
        pageNum: 1
      },
      // 表格数据
      tableData: [],
      // 小区信息
      villageData: [],
      // 保险信息
      productList: [],
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
      houseAddress: ""
    };
  },
  created() {
    // 调用 获取小区信息 方法
    this.getPropRoleList();
    // 调用 家财申报记录 方法
    // this.getPropertyData();
    // 调用 获取保险信息 方法
    this.getProduct();
  },
  methods: {
     // 查看
    see(row) {
      const obj = {
        id: row.id,
        pageSize: this.pageSize,
        pageNum: this.pageNum
      };
      this.$emit("changePage", "SEE", obj);
    },
    // 获取小区信息
    getPropRoleList() {
      getProjectRoleList().then(xhrData => {
        if (xhrData.code === 200) {
          this.villageData = xhrData.rows;
          this.getPropertyData(xhrData.rows[0].id);
        }
      });
    },
    // 家财申报记录数据
    getPropertyData(id) {
      // 判断 物业用户进来01显示所有 项目用户进来显示当前项目02
      if (this.$store.state.user.userType == "02") {
        this.formInline.pId = id;
        this.isClearable = false;
      }
      const page = {
        pageNum: this.formInline.pageNum,
        pageSize: this.formInline.pageSize,
        pId: this.formInline.pId,
        mobileNo: this.formInline.mobileNo,
        productId: this.formInline.productId
      };
      queryApplyHouseInsureList(page).then(xhrData => {
        if (xhrData.code === 200) {
          for (let i = 0; i < xhrData.rows.length; i++) {
            xhrData.rows[i].effective =
              xhrData.rows[i].startDate + " 至 " + xhrData.rows[i].endDate;
            if (xhrData.rows[i].status == "0") {
              xhrData.rows[i].status = "待生成";
            } else if (xhrData.rows[i].status == "1") {
              xhrData.rows[i].status = "已生成";
            }
          }
          // 赋值到表格数据
          this.tableData = xhrData.rows;
          // 总条数
          this.totalNum = xhrData.total;
        }
      });
    },
    // 获取保险类型
    getProduct() {
      const data = {
        insType: "1"
      };
      insRuleGetProduct(data)
        .then(xhrData => {
          if (xhrData.code === 200) {
            this.productList = xhrData.data.productList;
          }
        })
        .catch(() => {});
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
    // 关闭对话框
    resetForm() {
      // 清空表单
      this.$refs["changeForm"].resetFields();
    },
    // 查询
    onSubmit() {
      // console.log("submit!");
      this.getPropRoleList();
    },
    // 电子凭证
    voucher(row) {
      // this.$router.push({name:"voucher",params:row})
      this.$router.push({
        path: "/voucher2",
        query: { id: row.credentialId, type: row.insureAmount }
      });
    },
    handleSizeChange(val) {
      // 注意：在改变每页显示的条数时，要将页码显示到第一页
      this.formInline.pageNum = 1;
      // 改变每页显示的条数
      this.formInline.pageSize = val;
      // 点击每页显示的条数时，显示第一页
      this.getPropertyData();
    },
    handleCurrentChange(val) {
      // 改变默认的页数
      this.formInline.pageNum = val;
      // 切换页码时，要获取每页显示的条数
      this.getPropertyData();
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
</style>
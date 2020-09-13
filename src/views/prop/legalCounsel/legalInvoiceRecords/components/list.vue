<template>
  <!-- 发票记录列表 -->
  <div>
    <div>
      <el-row
        :gutter="20"
        class="record-top"
        style="margin-left: 0px; margin-right: 0px; padding-bottom:10px"
      >
        <el-col>
          <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="发票抬头：">
              <el-input
                @keyup.enter.native="onSubmit"
                @clear="onSubmit"
                v-model="formInline.title"
                clearable
                placeholder="请输入"
              ></el-input>
            </el-form-item>
            <el-form-item label="开票类型：">
              <el-select
                @change="onSubmit"
                clearable
                v-model="formInline.billingType"
                placeholder="请选择"
                style="width:130px"
              >
                <el-option
                  v-for="(item) in billingTypeList"
                  :key="item.billingType"
                  :label="item.name"
                  :value="item.billingType"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="开票状态：">
              <el-select
                @change="onSubmit"
                clearable
                v-model="formInline.billingStatus"
                placeholder="请选择"
                style="width:130px"
              >
                <el-option
                  v-for="(item) in entrustStatusList"
                  :key="item.entrustStatus"
                  :label="item.name"
                  :value="item.entrustStatus"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="申请时间：">
              <el-date-picker
                @change="onSubmit"
                v-model="formInline.startDate"
                clearable
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期"
                style="width:150px"
                :picker-options="startOptions"
              ></el-date-picker>
            </el-form-item>
            <el-form-item>
              <span>-</span>
            </el-form-item>
            <el-form-item>
              <el-date-picker
                @change="onSubmit"
                v-model="formInline.endDate"
                clearable
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期"
                style="width:150px"
                :picker-options="endOptions"
              ></el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="info" plain @click="onSubmit">查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <!-- <div style="margin-top:10px;margin-bottom:10px"></div> -->
      <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100% ">
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <el-table-column prop="title" :show-overflow-tooltip="true" label="发票抬头" min-width="100px"></el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          prop="billingType"
          label="开票类型"
          min-width="100px"
        >
          <template
            slot-scope="scope"
          >{{billingTypeList.filter((item)=>item.billingType===scope.row.billingType)[0].name}}</template>
        </el-table-column>
        <el-table-column prop="orderNumber" label="订单数量" min-width="100px" show-overflow-tooltip></el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          prop="invoiceAmount"
          label="发票金额"
          min-width="100px"
        ></el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          prop="applyUserName"
          label="申请人"
          min-width="100px"
        ></el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          prop="applyDate"
          label="申请时间"
          min-width="100px"
        ></el-table-column>

        <el-table-column
          :show-overflow-tooltip="true"
          prop="billingStatus"
          label="开票状态"
          min-width="100px"
          align="center"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.billingStatus===0">待开票</span>
            <span v-else-if="scope.row.billingStatus===1">开票中</span>
            <span v-else-if="scope.row.billingStatus===2">已开票</span>
            <span v-else>-</span>
          </template>
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
              href="javascript:;"
              style="margin-left:3px;color: #1890ff;"
              @click="openDialog(scope.row)"
              v-hasPermi="['info:invoice:remove']"
            >发票信息</a>
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
    <!-- 查看发票信息对话框 -->
    <el-dialog
      id="invoice-dialog"
      @close="resetForm('form')"
      title="发票信息"
      :visible.sync="dialogFormVisible"
      width="600px"
    >
      <el-form ref="form" :model="form" label-width="120px" label-position="right">
        <h4>发票抬头信息</h4>
        <el-form-item label="发票类型" prop="typeName">
          <el-input disabled v-model="form.typeName"></el-input>
        </el-form-item>
        <el-form-item label="发票抬头" prop="title">
          <el-input disabled v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="税号" prop="einNo">
          <el-input disabled v-model="form.einNo"></el-input>
        </el-form-item>
        <el-form-item v-show="valType" label="单位地址" prop="address">
          <el-input disabled v-model="form.address"></el-input>
        </el-form-item>
        <el-form-item v-show="valType" label="电话号码" prop="telphoneNo">
          <el-input disabled v-model="form.telphoneNo"></el-input>
        </el-form-item>
        <el-form-item v-show="valType" label="开户银行" prop="openingBank">
          <el-input disabled v-model="form.openingBank"></el-input>
        </el-form-item>
        <el-form-item v-show="valType" label="银行账户" prop="companyAccount">
          <el-input disabled v-model="form.companyAccount"></el-input>
        </el-form-item>
        <div class="addInvoice-top">
          <h4 style="margin-top:30px;">发票快递信息</h4>
        </div>
        <el-form-item label="收件人" prop="recipient">
          <el-input disabled v-model="form.recipient"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobileNo">
          <el-input disabled v-model="form.mobileNo"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="emailAddress">
          <el-input disabled v-model="form.emailAddress"></el-input>
        </el-form-item>
        <el-form-item v-show="valType" label="区域" prop="area">
          <el-input disabled v-model="form.area"></el-input>
        </el-form-item>
        <el-form-item v-show="valType" label="详细地址" prop="detailAddress" type="textarea">
          <el-input disabled v-model="form.detailAddress"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { appliedInvoiceList, getInvoiceById } from "@/api/legal/legal_record";
export default {
  name: "record",
  data() {
    return {
      // 总条数
      totalNum: 0,
      // 查询数据
      formInline: {
        // 发票抬头
        title: "",
        // 发票类型
        billingType: "",
        // 开票状态
        billingStatus: "",
        // 委托开始时间
        startDate: "",
        // 委托结束时间
        endDate: "",
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
      // 发票类型
      billingTypeList: [
        { billingType: 1, name: "增值税专票" },
        { billingType: 2, name: "增值税普票" }
      ],
      // 开票状态
      entrustStatusList: [
        { entrustStatus: 1, name: "开票中" },
        { entrustStatus: 2, name: "已开票" }
      ],
      // 表格数据
      tableData: [],
      // 律师函类型
      lawyerTypeList: [
        { productName: "在线(电子版)", lawyerType: 1 },
        { productName: "快递到物业", lawyerType: 2 },
        { productName: "快递到业主", lawyerType: 3 }
      ],
      // 变更申请 对话框
      dialogFormVisible: false,
      // 当前打开发票的类型 true为专票 false为普票
      valType: true,
      // 对话框内表单数据
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
        areaName: ""
      }
    };
  },
  created() {
    // 获取表格数据
    this.getRecordData();
  },
  watch: {
    ["formInline.startDate"](val) {
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
    ["formInline.endDate"](val) {
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
    // 获取表格数据
    async getRecordData() {
      let formInline = JSON.parse(JSON.stringify(this.formInline));
      if (formInline.startDate) {
        formInline.startDate += " 00:00:00";
      }
      if (formInline.endDate) {
        formInline.endDate += " 23:59:59";
      }
      let res = await appliedInvoiceList(formInline);
      if (res.code === 200) {
        // 赋值到表格数据
        this.tableData = res.rows;
        // 总条数
        this.totalNum = res.total;
      }
    },
    // 获取表格数据
    async getInvoiceById(id) {
      let res = await getInvoiceById(id);
      if (res.code === 200) {
        // 打开对话框
        this.dialogFormVisible = true;
        this.form = JSON.parse(JSON.stringify(res.data));
        this.valType = this.form.type === 1 ? true : false;
        this.form.typeName = res.data.type === 1 ? "增值税专票" : "增值税普票";
      }
    },

    openDialog(row) {
      this.getInvoiceById(row.invoiceTitleId);
    },
    // 关闭对话框
    resetForm() {
      // 清空表单
      this.$refs["changeForm"].resetFields();
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
</style>
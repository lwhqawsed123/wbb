<template>
  <!-- 发票申请 -->
  <div class="invoice-list">
    <div style="padding:50px 20px 10px 20px">
      <el-row
        :gutter="20"
        class="record-top"
        style="margin-left: 0px; margin-right: 0px; padding-bottom:10px"
      >
        <el-col>
          <div class="process">
            <div class="process-content">
              <div class="process-box">
                <div class="process-box-left">1</div>
                <div class="process-box-right">
                  <h5>{{processBoxList[0].name}}</h5>
                  <p>{{processBoxList[0].cName}}</p>
                </div>
              </div>
              <div class="process-box">
                <div class="process-box-left process-box-left2">2</div>
                <div class="process-box-right">
                  <h5>{{processBoxList[1].name}}</h5>
                  <p>{{processBoxList[1].cName}}</p>
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100% " @selection-change="handleSelectionChange" row-key="id">
        <el-table-column type="selection" width="50" reserve-selection></el-table-column>
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <el-table-column
          prop="orderNo"
          :show-overflow-tooltip="true"
          label="订单号"
          min-width="100px"
        ></el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          prop="entrustNumber"
          label="委托数量"
          min-width="100px"
        ></el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          prop="orderMoney"
          label="订单金额"
          min-width="100px"
        ></el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          prop="orderPaymentMoney"
          label="实付金额"
          min-width="100px"
        ></el-table-column>
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
        <!-- <el-table-column
          :show-overflow-tooltip="true"
          prop="effective"
          label="开票状态"
          min-width="100px"
          align="center"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.billingStatus===0||scope.row.entrustStatus===6||scope.row.entrustStatus===5">待开票</span>
            <span v-else-if="scope.row.billingStatus===1">开票中</span>
            <span v-else-if="scope.row.billingStatus===2">已开票</span>
            <span v-else>-</span>
          </template>
        </el-table-column> -->

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

      </el-table>
      <el-pagination
        class="invoice-pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="formInline.pageNum"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="formInline.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNum"
      ></el-pagination>
    </div>
    <div class="next-button-box">
      <el-button class="next-button" type="primary" @click="next">下一步</el-button>
    </div>
  </div>
</template>

<script>
import { invoiceList } from "@/api/legal/legal_record";
import { chargeList } from "@/api/legal/legal";
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
        // 排序列
        orderByColumn:'id',
        // 排序方式(desc降序)
        isAsc:'desc',
        // 当前显示条数
        pageSize: 10,
        // 当前显示页数
        pageNum: 1
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
      processBoxList: [
        { name: "选择订单", cName: "" },
        { name: "发票详情", cName: "" }
      ],
      multipleSelection:[]
    };
  },
  created() {
    // 获取律师函类型
    // this.getLawyerTypeList();
    // 获取表格数据
    this.getRecordData();
  },
  methods: {
    // 点击下一步
    next() {
      if(!this.multipleSelection.length){
        this.$message.warning("最少选择一个订单")
        return
      }
      let ids=this.multipleSelection.map(item=>item.id).join(',')
      let orderMoney=0
      this.multipleSelection.forEach(item=>{
        orderMoney+=item.orderPaymentMoney
      })
      const obj = {
        id: ids,
        orderMoney:orderMoney,
        orderNumber:this.multipleSelection.length,
        pageSize: this.pageSize,
        pageNum: this.pageNum
      };
      this.$emit("changePage", "SEE", obj);
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
      let res = await invoiceList(this.formInline);
      if (res.code === 200) {
        // 赋值到表格数据
        this.tableData = res.rows;
        // 总条数
        this.totalNum = res.total;
      }
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
      this.getRecordData();
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
      this.getRecordData();
    },
    handleCurrentChange(val) {
      // 改变默认的页数
      this.formInline.pageNum = val;
      // 切换页码时，要获取每页显示的条数
      this.getRecordData();
    },
    // 表格行被选中时
     handleSelectionChange(val) {
        this.multipleSelection = val;
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
  // min-height: calc(88vh);
  box-sizing: border-box;
  background-color: #e6e8eb;
  padding-bottom: 30px;
  .record-conter {
    // min-height: calc(88vh);
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
.invoice-list {
  .invoice-pagination {
    position: relative;
    margin-left: 10px;
    margin-top: 60px;
  }
  .next-button-box {
    width: 130px;

    margin: 0 auto;
    .next-button {
      width: 130px;
    }
  }
}

.process {
  margin-bottom: 5px;
  .process-content {
    display: flex;

    :first-child {
      ::after {
        display: none !important;
      }
    }

    .process-box {
      margin-right: 110px;
      display: flex;
      position: relative;

      ::after {
        content: "";
        position: absolute;
        left: -90px;
        top: 15px;
        width: 80px;
        height: 1px;
        background-color: #eaeaea;
      }

      .process-box-left {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background-color: #ef8200;
        font-size: 12px;
        text-align: center;
        line-height: 30px;
        color: #fff;
      }
      .process-box-left2 {
        background-color: #cccccc;
      }
      .process-box-right {
        margin-left: 10px;

        h5 {
          margin-top: 8px;
          margin-bottom: 8px;
          font-size: 16px;
          letter-spacing: 2px;
        }

        p {
          margin-top: 5px;
          color: #818181;
          font-size: 14px;
        }
      }
    }
  }
}
</style>
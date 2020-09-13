<template>
  <!-- 交易记录 -->
  <div class="publicStyle">
    <div class="publicStyle-conter">
      <el-row :gutter="20" class="record-top" style="margin-left: 0px; margin-right: 0px;">
        <el-col :span="24">
          <el-form
            id="companyForm"
            :inline="true"
            @submit.native.prevent
            :model="formInline"
            class="demo-form-inline"
          >
            <el-form-item label="订单号:">
              <el-input
                @keyup.enter.native="query"
                v-model.trim="formInline.orderId"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
            <el-form-item label="产品:">
              <el-input
                @keyup.enter.native="query"
                v-model.trim="formInline.companyName"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
            <el-form-item label="收/支:">
              <el-select @change="query" clearable v-model="formInline.payStatus" placeholder="请选择">
                <el-option label="审核通过" value="1"></el-option>
                <el-option label="审核不通过" value="2"></el-option>
                <el-option label="审核中" value="3"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="订单状态:">
              <el-select @change="query" clearable v-model="formInline.payType" placeholder="请选择">
                <el-option label="线下转账" value="1"></el-option>
                <el-option label="微信支付" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="交易时间:">
              <el-date-picker
                value-format="yyyy-MM-dd"
                v-model="formInline.createTime"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="info" plain @click="query">查询</el-button>
              <!-- <el-button type="warning" plain @click="handleExport">导出</el-button> -->
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <!-- 审核列表 -->
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="index" label="序号" width="80"></el-table-column>
        <el-table-column prop="name" show-overflow-tooltip label="订单号" min-width="280px"></el-table-column>
        <el-table-column prop="name" show-overflow-tooltip label="产品" min-width="200px"></el-table-column>
        <el-table-column prop="name" show-overflow-tooltip label="业务类型" min-width="120px"></el-table-column>
        <el-table-column prop="name" show-overflow-tooltip label="收/支" min-width="120px"></el-table-column>
        <el-table-column prop="name" show-overflow-tooltip label="订单状态" min-width="120px"></el-table-column>
        <el-table-column prop="name" show-overflow-tooltip label="订单金额" min-width="100px"></el-table-column>
        <el-table-column prop="name" show-overflow-tooltip label="当前余额" min-width="80px"></el-table-column>
        <el-table-column prop="name" show-overflow-tooltip label="操作人" min-width="100px"></el-table-column>
        <el-table-column prop="name" show-overflow-tooltip label="交易时间" min-width="100px"></el-table-column>
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
    </div>
  </div>
</template>

<script>

// 请求
import {

} from "@/api/information/information";
export default {
  name: "",
  data() {
    return {
      // 查询表单数据保存
      formInline: {
        orderId: "",
        companyName: "",
        pName: "",
        payStatus: "",
        payType: "",
        createTime: ""
      },
      // 审核列表数据
      tableData: [],
      // 总条数
      totalNum: 1,
      // 显示条数
      pageSize: 10,
      // 显示页数
      // 分页
      pageNum: 1,

    };
  },
  created() {
    this.getBeanAuditList();
  },
  methods: {
    // 获取充值列表信息
    getBeanAuditList() {
      let page;
      if (
        this.formInline.createTime == "" ||
        this.formInline.createTime == null
      ) {
        page = {
          pageSize: this.pageSize,
          pageNum: this.pageNum,
          orderId: this.formInline.orderId,
          companyName: this.formInline.companyName,
          payStatus: this.formInline.payStatus,
          payType: this.formInline.payType,
          startTime: "",
          endTime: ""
        };
      } else {
        page = {
          pageSize: this.pageSize,
          pageNum: this.pageNum,
          orderId: this.formInline.orderId,
          companyName: this.formInline.companyName,
          payStatus: this.formInline.payStatus,
          payType: this.formInline.payType,
          // // 开始时间
          startTime: this.formInline.createTime[0] + " 00:00:00",
          // 结束时间
          endTime: this.formInline.createTime[1] + " 23:59:59"
        };
      }

      // console.log(page);
    //   请求(page).then(xhrData => {
    //     // console.log(xhrData);
    //     if (xhrData.code === 200) {
    //       this.tableData = xhrData.rows;
    //       // 总条数
    //       this.totalNum = xhrData.total;
    //     }
    //   });
    },
    // 查询
    query() {
      this.getBeanAuditList();
    },
    // 导出按钮操作
    handleExport() {
      const formInline = this.formInline;
      this.$confirm("是否确认导出数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return 请求(formInline);
        })
        .then(response => {
          this.download(response.msg);
        })
        .catch(function() {});
    },
    handleSizeChange(val) {
      // 注意：在改变每页显示的条数时，要将页码显示到第一页
      this.pageNum = 1;
      // 改变每页显示的条数
      this.pageSize = val;
      // 更新列表
      this.getBeanAuditList();
    },
    // 页数
    handleCurrentChange(val) {
      // 改变默认的页数
      this.pageNum = val;
      // 更新列表
      this.getBeanAuditList();
    }
  }
};
</script>

<style lang='scss' scoped>
@import "../../../../assets/styles/publicStyle.css";
.record-top {
  margin-left: 0;
  margin-right: 0;
  min-height: 60px;
  border-bottom: 1px solid #d6d6d6;
  padding-bottom: 20px;
  .el-form--inline .el-form-item {
    margin-top: 10px;
    margin-bottom: 0;
    .el-input {
      width: 200px;
    }
  }
}
</style>
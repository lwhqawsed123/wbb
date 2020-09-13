<template>
  <div style="padding:10px">
    <div class>
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
                clearable
                @keyup.enter.native="query"
                @clear="query"
                v-model.trim="formInline.orderNo"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
            <el-form-item label="开票类型：">
              <el-select
                @change="query"
                clearable
                v-model="formInline.lawyerType"
                placeholder="请选择"
                style="width:130px"
              >
                <el-option
                  v-for="(item) in productList"
                  :key="item.lawyerType"
                  :label="item.name"
                  :value="item.lawyerType"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-button type="info" plain @click="query">查询</el-button>
              <el-button type="info" plain @click="revert">返回</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <!-- 审核列表 -->
      <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%">
        <el-table-column type="index" min-width="50" label="序号"></el-table-column>
        <el-table-column prop="orderNo" show-overflow-tooltip label="订单号"></el-table-column>
        <el-table-column prop="auditNumber" label="委托数量" show-overflow-tooltip></el-table-column>
        <el-table-column show-overflow-tooltip prop="orderMoney" label="订单金额"></el-table-column>
        <el-table-column show-overflow-tooltip prop="orderPaymentMoney" label="实付金额"></el-table-column>
        <el-table-column show-overflow-tooltip prop="productName" label="律师函类型"></el-table-column>
        <el-table-column show-overflow-tooltip prop="entrustClient" label="委托人"></el-table-column>
        <el-table-column show-overflow-tooltip prop="entrustDate" label="委托时间"></el-table-column>
        <!-- <el-table-column label="委托状态">
          <template
            slot-scope="scope"
          >{{examineStatus.filter((item)=>item.examineStatus===scope.row.examineStatus)[0].label}}</template>
        </el-table-column>-->
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
import { detailList } from "@/api/legal/invoice";
export default {
  name: "insurance-added-list",
  props: ["obj"],
  data() {
    return {
      formInline: {
        orderNo: "",
        lawyerType: ""
      },
      tableData: [],
      // 总条数
      totalNum: 1,
      // 显示条数
      pageSize: 10,
      // 显示页数
      // 分页
      pageNum: 1,
      // 保险信息
      productList: [
        { lawyerType: 1, name: "在线(电子版)" },
        { lawyerType: 2, name: "快递到物业" },
        { lawyerType: 3, name: "快递到业主" }
      ],
      // 律师审核状态
      examineStatus: [
        { examineStatus: 0, label: "待付款" },
        { examineStatus: 1, label: "未审核" },
        { examineStatus: 2, label: "审核通过" },
        { examineStatus: 3, label: "已作废" },
        { examineStatus: 4, label: "待处理" },
        { examineStatus: 5, label: "已完成" }
      ]
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 列表
    getList() {
      let page = {
        id: this.obj.id,
        data: {
          orderNo: this.formInline.orderNo,
          lawyerType: this.formInline.lawyerType,
          pageSize: this.pageSize,
          pageNum: this.pageNum
        }
      };
      detailList(page).then(xhrData => {
        if (xhrData.code === 200) {
          this.tableData = xhrData.rows;
          this.totalNum = xhrData.total;
        }
      });
    },
    // 查询
    query() {
      this.getList();
    },
    // 返回
    revert() {
      this.$emit("changePage", "LIST", this.obj);
    },
    //在改变每页显示的条数
    handleSizeChange(val) {
      // 注意：在改变每页显示的条数时，要将页码显示到第一页
      this.pageNum = 1;
      // 改变每页显示的条数
      this.pageSize = val;
      // 更新列表
      this.getList();
    },
    // 页数
    handleCurrentChange(val) {
      // 改变默认的页数
      this.pageNum = val;
      // 更新列表
      this.getList();
    }
  }
};
</script>
<style>
</style>
<style lang='scss' scoped>
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
.owner-dialog-footer {
  .owner-btn {
    width: 82px;
    height: 32px;
    border-radius: 2px;
    text-align: center;
    line-height: 32px;
    font-weight: bold;
    display: inline-block;
    font-size: 14px;
  }
  .btn,
  .btn1 {
    background: #169bd5;
    border: 1px solid #169bd5;
    color: #fff;
  }
  .btn2 {
    border: 1px solid #cccccc;
    color: #000000;
  }
  .btn3 {
    width: 108px;
    height: 28px;
    background: #2bad13;
    border: 1px solid #2bad13;
    color: #fff;
    font-weight: 500;
    margin-right: 10px;
    line-height: 28px;
  }
  .btn4 {
    width: 108px;
    height: 28px;
    background: #1476fe;
    border: 1px solid #1476fe;
    color: #fff;
    font-weight: 500;
    margin-right: 10px;
    line-height: 28px;
  }
  .btn5 {
    width: 108px;
    height: 28px;
    border: 1px solid #cccccc;
    color: #000000;
    font-weight: 500;
    margin-right: 10px;
    line-height: 28px;
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
  .owner-dialog-footer {
    .owner-btn {
      width: 82px;
      height: 32px;
      border-radius: 2px;
      text-align: center;
      line-height: 32px;
      font-weight: bold;
      display: inline-block;
      font-size: 14px;
    }
    .btn,
    .btn1 {
      background: #169bd5;
      border: 1px solid #169bd5;
      color: #fff;
    }
    .btn2 {
      border: 1px solid #cccccc;
      color: #000000;
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
.el-pagination {
  position: absolute;
  bottom: 40px;
  left: 20px;
  right: 0;
}
</style>
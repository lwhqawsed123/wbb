<template>
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
            <!-- <el-form-item label="所属机构:">
              <el-input
                @keyup.enter.native="query"
                v-model.trim="formInline.companyName"
                placeholder="请输入"
              ></el-input>
            </el-form-item>-->
            <el-form-item label="订单号:">
              <el-input
                @keyup.enter.native="query"
                v-model.trim="formInline.orderNo"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
            <el-form-item label="产品:">
              <el-select
                @change="query"
                clearable
                v-model="formInline.businessType"
                placeholder="请选择"
              >
                <el-option label="家财险" value="0"></el-option>
                <el-option label="雇主险" value="1"></el-option>
                <!-- <el-option label="雇主定制" value="2"></el-option> -->
                <!-- <el-option label="公众险" value="3"></el-option> -->
                <!-- <el-option label="物业责任险" value="4"></el-option> -->
                <!-- <el-option label="财产一切险" value="5"></el-option> -->
                <el-option label="律师函委托" value="6"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="收/支:">
              <el-select @change="query" clearable v-model="formInline.result" placeholder="请选择">
                <el-option label="支出" value="0"></el-option>
                <el-option label="收入" value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="订单状态:">
              <el-select @change="query" clearable v-model="formInline.state" placeholder="请选择">
                <el-option label="交易成功" value="0"></el-option>
                <el-option label="交易失败" value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="交易时间:">
              <el-date-picker
              @change="query"
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
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <!-- 列表 -->
      <el-table id="stream_tableData" :data="tableData" style="width: 100%">
        <el-table-column type="index" label="序号" width="80"></el-table-column>
        <!-- <el-table-column prop="1" show-overflow-tooltip label="所属分部" min-width="200px"></el-table-column> -->
        <!-- <el-table-column prop="policyNo" show-overflow-tooltip label="保单号" min-width="200px"></el-table-column> -->
        <el-table-column prop="orderNo" show-overflow-tooltip label="订单号" min-width="200px"></el-table-column>
        <!-- <el-table-column prop="compName" show-overflow-tooltip label="物业公司" min-width="200px"></el-table-column>
        <el-table-column prop="insCompName" show-overflow-tooltip label="承保公司" min-width="200px"></el-table-column>-->
        <el-table-column prop="1" show-overflow-tooltip label="产品" min-width="120px">
          <template slot-scope="scope">{{handleBusinessType(scope.row.businessType)}}</template>
        </el-table-column>
        <el-table-column prop="1" show-overflow-tooltip label="业务类型" min-width="120px">
          <template slot-scope="scope">{{handleType(scope.row.type)}}</template>
        </el-table-column>
        <el-table-column prop="result" show-overflow-tooltip label="收/支" min-width="120px">
          <template slot-scope="scope">{{handleResult(scope.row.result)}}</template>
        </el-table-column>
        <!-- <el-table-column prop="premium" show-overflow-tooltip label="保费金额" min-width="120px"></el-table-column> -->
        <el-table-column prop="premium" show-overflow-tooltip label="交易金额" min-width="120px"></el-table-column>
        <el-table-column prop="premium" show-overflow-tooltip label="交易方式" min-width="120px">
          <template slot-scope="scope">
            {{handlePayType(scope.row.payType)}}
          </template>
        </el-table-column>
        <el-table-column prop="1" show-overflow-tooltip label="订单状态" min-width="120px">
          <template slot-scope="scope">{{handleState(scope.row.state)}}</template>
        </el-table-column>
        
        <el-table-column prop="createTime" show-overflow-tooltip label="交易时间" min-width="200px"></el-table-column>
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
import "../../../../assets/styles/publicStyle.css";
import { systemPremiumRecordRunningList } from "@/api/information/information";
export default {
  name: "transactionRecords-list",
  data() {
    return {
      formInline: {},
      tableData: [],
      // 总条数
      totalNum: 1,
      // 显示条数
      pageSize: 10,
      // 显示页数
      // 分页
      pageNum: 1
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      let page = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        orderNo:this.formInline.orderNo, // 订单号
        businessType:this.formInline.businessType == '' ? null : this.formInline.businessType, // 产品
        result:this.formInline.result == '' ? null : this.formInline.result, // 收/支
        state:this.formInline.state == '' ? null : this.formInline.state, // 订单状态
      };
      // applyId 获取携带过来的当前id 或者 新增成功后返回的id
      if (
        this.formInline.createTime == "" ||
        this.formInline.createTime == null
      ) {
        // page = {

        //   beginTime: "",
        //   endTime: ""
        // };
        page.beginTime = "";
        page.endTime = "";
      } else {
        // page = {
        //   // 开始时间
        //   beginTime: this.formInline.createTime[0] + " 00:00:00",
        //   // 结束时间
        //   endTime: this.formInline.createTime[1] + " 23:59:59"
        // };
        page.beginTime = this.formInline.createTime[0] + " 00:00:00";
        page.endTime = this.formInline.createTime[1] + " 23:59:59";
      }
      // console.log(page);
      systemPremiumRecordRunningList(page).then(xhrData => {
        // console.log(xhrData);
        if (xhrData.code === 200) {
          this.tableData = xhrData.rows;
          this.totalNum = xhrData.total;
        }
      });
    },
    query() {
      this.getList();
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
    },
    // 产品 0：家财险 1：雇主险 2：雇主定制 3：公众险 4：物业责任险 5：财产一切险 6:律师函委托
    handleBusinessType(val) {
      if (val == "0") {
        return (val = "家财险");
      } else if (val == "1") {
        return (val = "雇主险");
      } else if (val == "2") {
        return (val = "雇主定制");
      } else if (val == "3") {
        return (val = "公众险");
      } else if (val == "4") {
        return (val = "物业责任险");
      } else if (val == "5") {
        return (val = "财产一切险");
      } else if (val == "6") {
        return (val = "律师函委托");
      }
    },
    // 业务类型 0：申报 1：新增 2：退保 3：批改 4:退款 5:委托
    handleType(val) {
      if (val == "0") {
        return (val = "申报");
      } else if (val == "1") {
        return (val = "新增");
      } else if (val == "2") {
        return (val = "退保");
      } else if (val == "3") {
        return (val = "批改");
      } else if (val == "4") {
        return (val = "退款");
      } else if (val == "5") {
        return (val = "委托");
      }
    },
    // 收/支 0：支 1：收
    handleResult(val) {
      if (val == "0") {
        return (val = "支出");
      } else if (val == "1") {
        return (val = "收入");
      }
    },
    // 订单状态  0：交易成功 1：交易失败 2：交易未支付
    handleState(val) {
      if (val == "0") {
        return (val = "交易成功");
      } else if (val == "1") {
        return (val = "交易失败");
      }else if (val == "2") {
        return (val = "交易未支付");
      }
    },
    // 交易方式 0：线下 1：余额 2：家财豆
    handlePayType(val){
      if(val == '0'){
        return val = '线下'
      }else if(val == '1'){
        return val = '余额'
      }else if(val == '2'){
        return val = '家财豆'
      }
    },
  }
};
</script>
<style>
#stream_tableData .el-table__empty-block {
  min-height: 500px;
}
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
.el-pagination {
  position: absolute;
  bottom: 40px;
  left: 20px;
  right: 0;
}
</style>
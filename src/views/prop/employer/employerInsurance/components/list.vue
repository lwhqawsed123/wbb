<template>
  <div>
    <!-- 雇主险保单管理页 -->
    <el-row :gutter="20" class="record-top" style="margin-left: 0px; margin-right: 0px;">
      <el-col :span="24">
        <el-form
          id="companyForm"
          :inline="true"
          @submit.native.prevent
          :model="formInline"
          class="demo-form-inline"
        >
          <el-form-item label="保单号:">
            <el-input
              @keyup.enter.native="query"
              v-model.trim="formInline.policyNo"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item label="保单状态:">
            <el-select @change="query" clearable v-model="formInline.state" placeholder="请选择">
              <el-option label="申报中" value="0"></el-option>
              <el-option label="在保" value="1"></el-option>
              <el-option label="已过期" value="2"></el-option>
              <el-option label="投保失败" value="3"></el-option>
              <el-option label="退款成功" value="4"></el-option>
              <!-- <el-option
                v-for="(item,index) in allProject"
                :key="index"
                :label="item.name"
                :value="item.state"
              ></el-option>-->
            </el-select>
          </el-form-item>
          <el-form-item label="承保公司:">
            <el-input
              @keyup.enter.native="query"
              v-model.trim="formInline.insCompName"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="info" plain @click="query">查询</el-button>
            <el-button
              type="warning"
              plain
              @click="handleExport"
              v-hasPermi="['ins:emp:manage:export']"
            >导出</el-button>
            <!-- <el-button type="primary" @click="renewal" plain>续保</el-button> -->
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!-- 审核列表 -->
    <el-table v-loading="ListLoading" :data="tableData" style="width: 100%">
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <!-- min-width="10%" -->
      <el-table-column prop="policyNo" show-overflow-tooltip label="保单号" min-width="220px"></el-table-column>
      <!-- min-width="10%" -->
      <!-- <el-table-column prop="insCompName" show-overflow-tooltip label="保险公司名称" width="220px"></el-table-column> -->
      <!-- <el-table-column prop="payProjectType" show-overflow-tooltip label="扣费项目" width="220px"></el-table-column> -->
      <!-- <el-table-column prop="insCompanyName" show-overflow-tooltip label="所属项目" min-width="10%"></el-table-column> -->
      <!-- min-width="10%" -->
      <el-table-column prop="insCompName" show-overflow-tooltip label="承保公司" min-width="180px"></el-table-column>
      <!-- min-width="20%" -->
      <el-table-column prop="yx" show-overflow-tooltip label="保单有效期" min-width="200px">
        <template
          slot-scope="scope"
        >{{scope.row.yx = scope.row.startTime.split(" ")[0] + " 至 " + scope.row.endTime.split(" ")[0]}}</template>
      </el-table-column>
      <!-- min-width="5%" -->
      <el-table-column show-overflow-tooltip label="保障周期" min-width="80px">
        <template slot-scope="scope">{{handleCycle(scope.row.cycle)}}</template>
      </el-table-column>
      <el-table-column prop="premium" show-overflow-tooltip label="物业保费 / 待删除" min-width="110px"></el-table-column>
      <el-table-column prop="insPremium" show-overflow-tooltip label="保险保费 / 待删除" min-width="110px"></el-table-column>
      <!-- min-width="10%" -->
      <el-table-column show-overflow-tooltip label="保单状态" min-width="80px">
        <template slot-scope="scope">{{handleState(scope.row.state)}}</template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="方案" min-width="100px">
        <template slot-scope="scope">{{scope.row.planName}}</template>
        <!-- <template slot-scope="scope">{{handlePlanName(scope.row.planName)}}</template> -->
      </el-table-column>
      <!-- min-width="10%" -->
      <!-- <el-table-column prop="operatorPhone" show-overflow-tooltip label="保险经办人联系方式" width="150px">
        <template
          slot-scope="scope"
        >{{scope.row.operatorPhone == null ? '-' : scope.row.operatorPhone}}</template>
      </el-table-column>-->
      <!-- min-width="25%" -->
      <!-- <el-table-column fixed="right" label="操作" min-width="340px"> -->
      <el-table-column label="操作" min-width="250px">
        <template slot-scope="scope">
          <div style="display: flex;">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-view"
              @click="see(scope.row)"
              v-hasPermi="['ins:emp:manage:detail:list']"
            >查看</el-button>
            <el-button
              v-if="scope.row.state == '1' && scope.row.cycle == 'Y'"
              size="mini"
              type="text"
              icon="el-icon-sort"
              @click="correction(scope.row)"
            >批改</el-button>
            <!-- <el-button
              v-if="(scope.row.state == '1' && scope.row.cycle == 'Y') || scope.row.state == '2'"
              size="mini"
              type="text"
              icon="el-icon-plus"
              @click="added(scope.row)"
              v-hasPermi="['ins:emp:manage:new:list']"
            >新增</el-button> -->
            <!-- <el-button
              v-if="scope.row.state == '1' && scope.row.cycle == 'Y'"
              size="mini"
              type="text"
              icon="el-icon-sort"
              @click="replace(scope.row)"
            >替换</el-button> -->
            <!-- <el-button
              v-if="(scope.row.state == '1' && scope.row.cycle == 'Y') || scope.row.state == '2'"
              size="mini"
              type="text"
              icon="el-icon-close"
              @click="surrender(scope.row)"
              v-hasPermi="['ins:emp:manage:return:list']"
            >退保</el-button> -->
            <el-button
              v-if="scope.row.state == '3'"
              size="mini"
              type="text"
              icon="el-icon-folder-delete"
              @click="failure(scope.row)"
            >失败原因</el-button>
            <!-- <el-button
              v-if="scope.row.state == '1' && (scope.row.cycle == 'Y' || scope.row.cycle == 'D')"
              size="mini"
              type="text"
              icon="el-icon-tickets"
              @click="policy(scope.row)"
            >电子保单</el-button>-->
            <!-- <el-button size="mini" type="text" icon="el-icon-document-copy" @click="invoice(scope.row)">开票信息</el-button> -->
          </div>
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
    <printf-template1
      :PrintingData="PrintingData"
      :PrintingList="PrintingList"
      style="display: none"
    ></printf-template1>
    <printf-template2
      :PrintingData="PrintingData"
      :PrintingList="PrintingList"
      style="display: none"
    ></printf-template2>
    <!-- 失败原因对话框 -->
    <el-dialog title="失败原因" id="failureDialog" :visible.sync="dialogFormVisible" width="400px">
      <h3 style="max-height: 300px; overflow: auto;">{{failureTitle}}</h3>
      <span slot="footer" class="dialog-footer">
        <a href="javascript:;" class="btn btn1" @click="again">重新申报</a>
        <a href="javascript:;" class="btn btn1" @click="refund">申请退款</a>
        <a href="javascript:;" class="btn btn2" @click="dialogFormVisible = false">取 消</a>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import PrintfTemplate1 from "./template1";
import PrintfTemplate1 from "./print/template1";
import PrintfTemplate2 from "./print/template2";
import {
  insEmpApplyManage,
  insEmpApplyManageExportInsPubDetailApply,
  insEmpApplyGetById,
  insEmpApplyManageApplyReturnMoney,
  insEmpApplyManageApplyAgain
} from "@/api/information/information";
export default {
  name: "insurance-list",
  components: { PrintfTemplate1, PrintfTemplate2 },
  props: ["obj"],
  data() {
    return {
      formInline: {
        policyNo: "",
        state: "",
        insCompName: ""
      },
      tableData: [],
      // 总条数
      totalNum: 1,
      // 显示条数
      pageSize: 10,
      // 显示页数
      // 分页
      pageNum: 1,
      // 保存保单打印信息
      PrintingData: {},
      PrintingList: [],
      dialogFormVisible: false,
      // 失败原因
      failureTitle: "",
      // 保存当前行id
      applyId: null,
      // 列表动画
      ListLoading:false
    };
  },
  created() {
    this.getList();
    // console.log(this.obj);
  },
  methods: {
    getList() {
      // console.log(this.obj.pageNum);
      // if(this.obj.pageNum){
      //   this.pageNum = this.obj.pageNum
      // }
      // if(this.obj.pageSize){
      //   this.pageSize = this.obj.pageSize
      // }
      const page = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        policyNo: this.formInline.policyNo,
        state: this.formInline.state == "" ? null : this.formInline.state,
        insCompName: this.formInline.insCompName
      };
      // console.log(page);
      this.ListLoading = true
      insEmpApplyManage(page).then(xhrData => {
        // console.log(xhrData, "列表");
        if (xhrData.code === 200) {
          this.tableData = xhrData.rows;
          this.totalNum = xhrData.total;
          this.ListLoading = false
        }
      }).catch(()=>{
        this.ListLoading = false
      })
    },
    // 查询
    query() {
      this.getList();
    },
    // 导出
    handleExport() {
      const formInline = this.formInline;
      formInline.pageSize = this.pageSize;
      formInline.pageNum = this.pageNum;
      // console.log(formInline);

      this.$confirm("是否确认导出数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return insEmpApplyManageExportInsPubDetailApply(formInline);
        })
        .then(response => {
          this.download(response.msg);
        })
        .catch(function() {});
    },
    // 查看
    see(row) {
      const obj = {
        id: row.id,
        pageSize: this.pageSize,
        pageNum: this.pageNum
      };
      this.$emit("changePage", "SEE", obj);
    },
    // 新增
    added(row) {
      const obj = {
        id: row.id,
        state:row.state
      };
      this.$emit("changePage", "ADDED", obj);
    },
    // 退保
    surrender(row) {
      const obj = {
        id: row.id,
        state:row.state
      };
      this.$emit("changePage", "SURRENDER", obj);
    },
    // 替换
    replace(row) {
      const obj = {
        id: row.id
      };
      this.$emit("changePage", "REPLACE", obj);
    },
    // 批改
    correction(row){
      const obj = {
        id: row.id
      };
      
      this.$emit("changePage", "CORRECTION",obj);
    },
    // 保单
    async policy(row) {
      let xhrData = await insEmpApplyGetById(row.id);
      if (xhrData.code === 200) {
        this.PrintingData = xhrData.data;
        this.PrintingData.startTime = this.PrintingData.startTime.split(" ")[0];
        this.PrintingData.endTime = this.PrintingData.endTime.split(" ")[0];
        this.PrintingList = xhrData.data.insEmpApplyDetailList;
      }
      // 保险公司code
      // 富德
      if (row.insCompCode == "CNFD") {
        setTimeout(() => {
          this.htmlToPrint1();
        }, 100);
      }
      // 国寿财
      else if (row.insCompCode == "CNGC") {
        setTimeout(() => {
          this.htmlToPrint2();
        }, 100);
      }
    },
    // 续保
    renewal() {
      //   this.$emit("changePage", "RENEWAL");
    },
    // 开票信息
    invoice(row) {
      // console.log(row);
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
    // 失败原因按钮
    failure(row) {
      this.dialogFormVisible = true;
      // console.log(row);
      // 失败原因
      this.failureTitle = row.message;
      // 当前id
      this.applyId = row.id;
    },
    // 退款
    refund() {
      this.$confirm("是否确认申请退款?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          insEmpApplyManageApplyReturnMoney(this.applyId).then(xhrData => {
            if (xhrData.code === 200) {
              this.$message.success("申请退款成功");
              // 更新列表数据
              this.getList();
              // 关闭对话框
              this.dialogFormVisible = false;
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    // 打印投保明细
    htmlToPrint1() {
      // console.log(document.getElementById("abc").innerHTML);
      let CSS_PRINT =
        "<style>" +
        document.getElementById("CSS_PRINT1").innerHTML +
        "</style>";
      let HTML_PRINT = document.getElementById("printf-box1").outerHTML;
      // SCRIPT_PRINT1
      let SCRIPT_PRINT =
        "<script>" +
        document.getElementById("SCRIPT_PRINT1").innerHTML +
        "</" +
        "script>";
      let HTML = CSS_PRINT + HTML_PRINT + SCRIPT_PRINT;
      var win = window.open("");
      win.document.write(HTML);
    },
    // 打印投保明细
    htmlToPrint2() {
      // console.log(document.getElementById("abc").innerHTML);
      let CSS_PRINT =
        "<style>" +
        document.getElementById("CSS_PRINT2").innerHTML +
        "</style>";
      let HTML_PRINT = document.getElementById("printf-box2").outerHTML;
      // SCRIPT_PRINT1
      let SCRIPT_PRINT =
        "<script>" +
        document.getElementById("SCRIPT_PRINT2").innerHTML +
        "</" +
        "script>";
      let HTML = CSS_PRINT + HTML_PRINT + SCRIPT_PRINT;
      var win = window.open("");
      win.document.write(HTML);
    },
    handleState(state) {
      // 0：申报中 1：在保  2：已过期  3:投保失败 4:退款成功
      if (state == "0") {
        return (state = "申报中");
      } else if (state == "1") {
        return (state = "在保");
      } else if (state == "2") {
        return (state = "已过期");
      } else if (state == "3") {
        return (state = "投保失败");
      } else if (state == "4") {
        return (state = "退款成功");
      }
    },
    handleCycle(cycle) {
      if (cycle == "Y") {
        return (cycle = "年");
      } else if (cycle == "M") {
        return (cycle = "月");
      } else if (cycle == "D") {
        return (cycle = "日");
      }
    },
    handlePlanName(planName) {
      // console.log(planName);
    },
    // 重新提交
    async again() {
      let xhrData = await insEmpApplyManageApplyAgain(this.applyId);
      if (xhrData.code === 200) {
        this.$emit("changePage", "AGAIN", xhrData.data);
      }
    }
  }
};
</script>
<style>
#failureDialog .el-dialog__header {
  background-color: #e6e8eb;
}
#failureDialog .el-dialog__title {
  font-size: 20px;
  font-weight: bold;
}
#failureDialog .el-dialog__footer {
  background-color: #e6e8eb;
}
#failureDialog .el-dialog__body {
  padding-left: 30px;
  padding-right: 30px;
  padding-bottom: 30px;
  box-sizing: border-box;
}
#failureDialog .el-dialog__footer {
  padding-bottom: 10px;
}
#failureDialog .btn {
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
#failureDialog .btn.btn1 {
  background: rgba(239, 130, 0, 1);
  border: 1px solid rgba(206, 112, 0, 1);
  color: #fff;
}
#failureDialog .btn.btn2 {
  border: 1px solid rgba(0, 0, 0, 0.25);
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
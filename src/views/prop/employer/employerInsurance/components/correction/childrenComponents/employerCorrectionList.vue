<template>
  <!-- 雇员批改列表 -->
  <div class="abcd">
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
              v-model.trim="formInline.orderNo"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item label="审核状态:">
            <el-select @change="query" clearable v-model="formInline.state" placeholder="请选择">
              <el-option label="批改中" value="0"></el-option>
              <el-option label="批改成功" value="1"></el-option>
              <el-option label="批改失败" value="2"></el-option>
              <el-option label="已重新提交" value="3"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="操作时间:">
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
            <el-button type="primary" plain @click="correction">申请批改</el-button>
            <!-- <el-button type="warning" plain @click="handleExport" v-hasPermi="['ins:emp:manage:detail:export']">导出</el-button> -->
            <el-button type="info" plain @click="revert">返回</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!-- 列表 -->
    <el-table v-loading="ListLoading" :data="tableData" style="width: 100%">
      <el-table-column type="index" label="序号" width="80"></el-table-column>
      <el-table-column prop="orderNo" show-overflow-tooltip label="订单号" min-width="180px"></el-table-column>
      <el-table-column prop="reviseNo" show-overflow-tooltip label="批单号" min-width="210px"></el-table-column>
      <el-table-column prop="newNumber" show-overflow-tooltip label="新增人数" min-width="80px"></el-table-column>
      <el-table-column prop="returnNumber" show-overflow-tooltip label="退保人数" min-width="80px"></el-table-column>
      <el-table-column show-overflow-tooltip label="申报状态" min-width="100px">
        <template slot-scope="scope">{{handleState(scope.row.state)}}</template>
      </el-table-column>
      <el-table-column prop="createByName" show-overflow-tooltip label="操作人" min-width="100px"></el-table-column>
      <el-table-column prop="premium" show-overflow-tooltip label="物业保费 / 待删除" min-width="110px"></el-table-column>
      <el-table-column prop="insPremium" show-overflow-tooltip label="保险保费 / 待删除" min-width="110px"></el-table-column>
      <el-table-column prop="createTime" show-overflow-tooltip label="操作时间" min-width="160px"></el-table-column>
      <el-table-column show-overflow-tooltip label="失败原因" min-width="140px">
        <template slot-scope="scope">{{handleMessage(scope.row.message)}}</template>
      </el-table-column>
      <el-table-column label="操作" min-width="250px">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-view" @click="see(scope.row)">查看详情</el-button>
          <el-button
            v-if="scope.row.state == 1"
            size="mini"
            type="text"
            icon="el-icon-s-check"
            @click="billing(scope.row)"
          >开票信息</el-button>
          <el-button
            v-if="scope.row.state == 1"
            size="mini"
            type="text"
            icon="el-icon-s-check"
            @click="endorsement(scope.row)"
          >批单</el-button>
          <el-button
            v-if="scope.row.state == 2"
            size="mini"
            type="text"
            icon="el-icon-finished"
            @click="again(scope.row)"
          >重新提交</el-button>
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
    <!-- 查看明细 -->
    <el-dialog
      @closed="closeSee"
      width="1100px"
      class="seeDialog"
      title="查看明细"
      :visible.sync="dialogTableVisibleSee"
    >
      <el-form
        @submit.native.prevent
        :model="seeForm"
        ref="seeForm"
        label-position="left"
        label-width="80px"
      >
        <div style="display: flex;flex-wrap: wrap;">
          <el-form-item label="雇员姓名">
            <el-input style="width:220px" @keyup.enter.native="seeQuery" v-model="seeForm.name"></el-input>
          </el-form-item>
          <el-form-item style="margin-left:10px" label="批改类型">
            <el-select @change="seeQuery" clearable v-model="seeForm.type" placeholder="请选择">
              <el-option label="新增" value="1"></el-option>
              <el-option label="减少" value="2"></el-option>
            </el-select>
            <el-button @click="seeQuery">查询</el-button>
          </el-form-item>
        </div>
        <el-table
          v-loading="seeLoading"
          max-height="400px"
          :data="seeData"
          border
          style="width: 100%;margin-top:15px"
        >
          <el-table-column align="center" type="index" label="序号" width="60"></el-table-column>
          <el-table-column show-overflow-tooltip prop="projectName" label="所属项目" min-width="180px"></el-table-column>
          <el-table-column prop="name" label="雇员姓名" min-width="80px"></el-table-column>
          <el-table-column prop="idCard" label="身份证号" min-width="170px"></el-table-column>
          <el-table-column prop="phone" label="手机号" min-width="120px"></el-table-column>
          <el-table-column show-overflow-tooltip prop="jobName" label="工种" min-width="100px"></el-table-column>
          <el-table-column prop="type" label="批改类型" min-width="80px">
            <template slot-scope="scope">{{scope.row.type | filterType}}</template>
          </el-table-column>
          <el-table-column prop="startTime" label="保单生效日期" min-width="120px">
            <template slot-scope="scope">{{scope.row.startTime | filterTime}}</template>
          </el-table-column>
          <el-table-column prop="endTime" label="保单结束日期" min-width="120px">
            <template slot-scope="scope">{{scope.row.endTime | filterTime }}</template>
          </el-table-column>
        </el-table>
      </el-form>
      <!-- 分页 -->
      <el-pagination
        style="position: static;margin-top:10px"
        @size-change="handleSizeChangeSee"
        @current-change="handleCurrentChangeSee"
        :current-page="pageNumSee"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="pageSizeSee"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNumSee"
      ></el-pagination>
      <div slot="footer" class="dialog-footer">
        <a href="javascript:;" class="btn btn2" @click="dialogTableVisibleSee=false">关 闭</a>
      </div>
    </el-dialog>
    <!-- 对话框 -->
    <el-dialog title="发票抬头" class="seeDialog" :visible.sync="dialogVisible1" width="650px">
      <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <h3 style="padding-bottom:20px">开票信息</h3>
        <el-form-item label="开票抬头：">
          <el-input disabled v-model="ruleForm.title"></el-input>
        </el-form-item>
        <el-form-item label="发票抬头：">
          <el-input disabled v-model="ruleForm.title"></el-input>
        </el-form-item>
        <el-form-item label="税号：">
          <el-input disabled v-model="ruleForm.einNo"></el-input>
        </el-form-item>
        <el-form-item v-if="isShow" label="单位地址：">
          <el-input disabled v-model="ruleForm.address"></el-input>
        </el-form-item>
        <el-form-item v-if="isShow" label="电话号码：">
          <el-input disabled v-model="ruleForm.telphoneNo"></el-input>
        </el-form-item>
        <el-form-item v-if="isShow" label="开户银行：">
          <el-input disabled v-model="ruleForm.openingBank"></el-input>
        </el-form-item>
        <el-form-item v-if="isShow" label="公司账号：">
          <el-input disabled v-model="ruleForm.companyAccount"></el-input>
        </el-form-item>
        <el-form-item>
          <el-radio disabled v-model="ruleForm.radio" label="1">增值税专票</el-radio>
          <el-radio disabled v-model="ruleForm.radio" label="2">增值税普票</el-radio>
        </el-form-item>
        <h3 style="padding-bottom:20px">开票信息</h3>
        <el-form-item label="收件人：">
          <el-input disabled v-model="ruleForm.recipient"></el-input>
        </el-form-item>
        <el-form-item label="手机号：">
          <el-input disabled v-model="ruleForm.mobileNo"></el-input>
        </el-form-item>
        <el-form-item label="邮箱：">
          <el-input disabled v-model="ruleForm.emailAddress "></el-input>
        </el-form-item>
        <el-form-item v-if="isShow" label="区域：">
          <el-input disabled v-model="ruleForm.area"></el-input>
        </el-form-item>
        <el-form-item v-if="isShow" label="详细地址：">
          <el-input disabled type="textarea" v-model="ruleForm.detailAddress"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <a href="javascript:;" class="btn btn2" @click="dialogVisible1 = false">取 消</a>
      </span>
    </el-dialog>
    <!-- 批单 -->
    <printf-template3 v-if="updateComponent" :printData="printData" style="display: none"></printf-template3>
  </div>
</template>

<script>
import {
  insEmpReviseList,
  insEmpReviseDetailList,
  getInvoiceById,
  insEmpReviseGetAllowRevise,
  insEmpReviseGetReviseFileInfo
} from "@/api/information/information";
import PrintfTemplate3 from "../../print/template3";
export default {
  name: "employerCorrectionList",
  props: ["obj", "id"],
  components: { PrintfTemplate3 },
  data() {
    return {
      formInline: {
        orderNo: "",
        state: ""
      },
      // 列表加载动画
      ListLoading: false,
      tableData: [],
      // 总条数
      totalNum: 1,
      // 显示条数
      pageSize: 10,
      // 显示页数
      // 分页
      pageNum: 1,
      // 总条数
      totalNumSee: 1,
      // 显示条数
      pageSizeSee: 10,
      // 显示页数
      // 分页
      pageNumSee: 1,
      // 查看详情对话框
      dialogTableVisibleSee: false,
      // 查看详情 表单
      seeForm: {},
      // 查看详情 表格数据
      seeData: [],
      // 查看详情 加载动画
      seeLoading: false,
      // 保存 查看详情当前行id
      seeId: "",
      //
      ruleForm: {},
      //
      dialogVisible1: false,
      //
      isShow: false,
      // 保存需要打印的数据
      printData: {},
      // 更新组件
      updateComponent: false
    };
  },
  created() {
    this.getList();
  },
  filters: {
    filterTime(val) {
      if (val == null) {
        return "-";
      } else {
        return val.split(" ")[0];
      }
    },
    filterType(val) {
      if (val == "1") {
        return "新增";
      } else if (val == "2") {
        return "减少";
      }
    }
  },
  methods: {
    // 列表
    getList() {
      let page = {
        applyId: this.id,
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        orderNo: this.formInline.orderNo,
        state: this.formInline.state == "" ? null : this.formInline.state
      };
      if (
        this.formInline.createTime == "" ||
        this.formInline.createTime == null
      ) {
        // 开始时间
        page.beginTime = "";
        // 结束时间
        page.endTime = "";
      } else {
        // 开始时间
        (page.beginTime = this.formInline.createTime[0] + " 00:00:00"),
          // 结束时间
          (page.endTime = this.formInline.createTime[1] + " 23:59:59");
      }
      // console.log(page);
      this.ListLoading = true;
      insEmpReviseList(page)
        .then(xhrData => {
          // console.log(xhrData);
          if (xhrData.code === 200) {
            this.tableData = xhrData.rows;
            this.totalNum = xhrData.total;
            this.ListLoading = false;
          }
        })
        .catch(() => {
          this.ListLoading = false;
        });
    },
    // 查询
    query() {
      this.getList();
    },
    // 导出
    handleExport() {
      const formInline = this.formInline;
      formInline.applyId = this.obj.id;
      //  (formInline.pageSize = this.pageSize);
      // formInline.pageNum = this.pageNum;
      this.$confirm("是否确认导出数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return insEmpApplyManageDetailExport(formInline);
        })
        .then(response => {
          this.download(response.msg);
        })
        .catch(function() {});
    },
    // 返回
    revert() {
      this.$emit("changePage2", "REVERT");
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
    // 在改变每页显示的条数 查看详情
    handleSizeChangeSee(val) {
      // 注意：在改变每页显示的条数时，要将页码显示到第一页
      this.pageNumSee = 1;
      // 改变每页显示的条数
      this.pageSizeSee = val;
      // 更新列表
      this.getSeeList(this.seeId);
    },
    // 页数 查看详情
    handleCurrentChangeSee(val) {
      // 改变默认的页数
      this.pageNumSee = val;
      // 更新列表
      this.getSeeList(this.seeId);
    },
    // 表格状态
    handleState(state) {
      // 状态  0：批改中 1：批改成功  2：批改失败  3:已重新提交
      if (state == 0) {
        return (state = "批改中");
      } else if (state == 1) {
        return (state = "批改成功");
      } else if (state == 2) {
        return (state = "批改失败");
      } else if (state == 3) {
        return (state = "已重新提交");
      }
    },
    //
    handleMessage(val) {
      if (val == null || val == "成功") {
        return "-";
      } else {
        return val;
      }
    },
    // 申请批改
    correction() {
      const obj2 = {
        applyId: this.id
      };
      insEmpReviseGetAllowRevise(this.id)
        .then(xhrData => {
          if (xhrData.code === 200) {
            this.$emit("changePage2", "CORRECTION", obj2);
          }
        })
        .catch(() => {});
    },
    // 查看详情
    see(row) {
      this.seeId = row.id;
      this.dialogTableVisibleSee = true;
      this.getSeeList(this.seeId);
    },
    // 查看详情信息列表
    getSeeList(id) {
      const page = {
        returnApplyId: id,
        pageSize: this.pageSizeSee,
        pageNum: this.pageNumSee,
        name: this.seeForm.name,
        type: this.seeForm.type == "" ? null : this.seeForm.type
      };
      this.seeLoading = true;
      insEmpReviseDetailList(page)
        .then(xhrData => {
          if (xhrData.code === 200) {
            this.seeData = xhrData.rows;
            this.totalNumSee = xhrData.total;
            this.seeLoading = false;
          }
        })
        .catch(() => {
          this.seeLoading = false;
        });
    },
    // 关闭查看详情 对话框
    closeSee() {},
    // 查看详情 查询
    seeQuery() {
      this.getSeeList(this.seeId);
    },
    // 开票信息
    billing(row) {
      this.reduction();
      // 不存在
      if (row.invoiceId == null) return;
      this.dialogVisible1 = true;
      // 根据发票id查询信息
      getInvoiceById(row.invoiceId).then(xhrData => {
        if (xhrData.code === 200) {
          // 普票
          if (xhrData.data.type == "2") {
            this.ruleForm.radio = "2";
            this.isShow = false;
          }
          // 专票
          else if (xhrData.data.type == "1") {
            this.ruleForm.radio = "1";
            this.isShow = true;
          }
          this.objFun(this.ruleForm, xhrData.data);
        }
      });
    },
    // 重新提交
    again(row) {
      // console.log(row);
      const obj = {
        reviseId: row.id,
        applyId: this.id
      };
      // reviseId
      this.$confirm("是否重新提交?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$emit("changePage2", "CORRECTION", obj);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    // 按需赋值给另一个对象
    objFun(objA, objB) {
      Object.keys(objA).forEach(key => {
        objA[key] = objB[key] || objA[key];
      });
      return objA;
    },
    // 还原表单
    reduction() {
      this.ruleForm = {
        radio: "",
        title: "",
        einNo: "",
        address: "",
        telphoneNo: "",
        openingBank: "",
        companyAccount: "",
        recipient: "",
        mobileNo: "",
        emailAddress: "",
        area: "",
        detailAddress: ""
      };
    },
    // 批单
    endorsement(row) {
      const loading = this.$loading({
        lock: true,
        text: "加载中,请等待...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      insEmpReviseGetReviseFileInfo(row.id).then(xhrData => {
        if (xhrData.code === 200) {
          this.updateComponent = true;
          this.printData = xhrData.data;
          setTimeout(() => {
            this.htmlToPrint1();
          }, 200);
          setTimeout(() => {
            loading.close();
          }, 300);
        }
      });
    },
    // 打印批单
    htmlToPrint1() {
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
    }
  }
};
</script>
<style>
.seeDialog .el-dialog__header {
  background-color: #e6e8eb;
}
.seeDialog .el-dialog__title {
  font-size: 20px;
  font-weight: bold;
}
.seeDialog .el-dialog__footer {
  background-color: #e6e8eb;
}
.seeDialog .el-dialog__body {
  padding-left: 30px;
  padding-right: 30px;
  box-sizing: border-box;
}
.seeDialog .el-dialog__footer {
  padding-bottom: 10px;
}
.seeDialog .btn {
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
.seeDialog .btn.btn1 {
  background: rgba(239, 130, 0, 1);
  border: 1px solid rgba(206, 112, 0, 1);
  color: #fff;
}
.seeDialog .btn.btn2 {
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
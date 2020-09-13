<template>
  <div>
    <!-- 雇主险定制保单管理页 -->
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
              <el-option label="待付款" value="1"></el-option>
              <el-option label="在保" value="2"></el-option>
              <el-option label="已过期" value="3"></el-option>
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
            <el-button type="warning" plain @click="handleExport" v-hasPermi="['ins:emp:custom:apply:export']">导出</el-button>
            <el-button type="primary" @click="renewal" plain v-if="Prohibit" v-hasPermi="['ins:emp:custom:renewal:add']">续保</el-button>
            <!-- <el-button type="primary" @click="renewal" plain v-if="!tableData.length <= 0">续保</el-button> -->
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!-- 审核列表 -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="index" label="序号" min-width="50"></el-table-column>
      <!-- min-width="10%" -->
      <el-table-column prop="policyNo" show-overflow-tooltip label="保单号" min-width="200px"></el-table-column>
      <!-- min-width="10%" -->
      <el-table-column prop="compName" show-overflow-tooltip label="物业公司" min-width="200px"></el-table-column>
      <!-- <el-table-column prop="insCompanyName" show-overflow-tooltip label="所属项目" min-width="10%"></el-table-column> -->
      <!-- min-width="10%" -->
      <el-table-column prop="insCompName" show-overflow-tooltip label="承保公司" min-width="200px"></el-table-column>
      <!-- min-width="20%" -->
      <el-table-column prop="yx" show-overflow-tooltip label="保单有效期" min-width="220px">
        <template
          slot-scope="scope"
        >{{scope.row.yx = scope.row.startTime.split(" ")[0] + " 至 " + scope.row.endTime.split(" ")[0]}}</template>
      </el-table-column>
      <!-- min-width="5%" -->
      <el-table-column prop="cycle" show-overflow-tooltip label="保障周期" min-width="100px">
        <template slot-scope="scope">{{handleCycle(scope.row.cycle)}}</template>
      </el-table-column>
      <!-- min-width="10%" -->
      <el-table-column prop="state" show-overflow-tooltip label="保单状态" min-width="100px">
        <!-- <template slot-scope="scope">
          {{handleState(scope.row.state)}}
        </template>-->
      </el-table-column>
      <!-- min-width="10%" -->
      <el-table-column prop="operatorPhone" show-overflow-tooltip label="保险经办人联系方式" width="150px">
        <template
          slot-scope="scope"
        >{{scope.row.operatorPhone == null ? '-' : scope.row.operatorPhone}}</template>
      </el-table-column>
      <!-- min-width="25%" -->
      <el-table-column label="操作" min-width="350px">
        <template slot-scope="scope">
          <div style="display: flex;">
            <el-button size="mini" type="text" icon="el-icon-view" @click="see(scope.row)" v-hasPermi="['ins:emp:custom:apply:manage:detail:list']">查看</el-button>
            <el-button
              v-if="scope.row.state == '在保' || scope.row.state == '已过期'"
              size="mini"
              type="text"
              icon="el-icon-plus"
              @click="added(scope.row)"
              v-hasPermi="['ins:emp:custom:manage:new:list']"
            >新增</el-button>
            <el-button
              v-if="scope.row.state == '在保' || scope.row.state == '已过期'"
              size="mini"
              type="text"
              icon="el-icon-sort"
              @click="replace(scope.row)"
              v-hasPermi="['ins:emp:custom:manage:replace:list']"
            >替换</el-button>
            <el-button
              v-if="scope.row.state == '在保' || scope.row.state == '已过期'"
              size="mini"
              type="text"
              icon="el-icon-close"
              @click="surrender(scope.row)"
              v-hasPermi="['ins:emp:custom:manage:return:list']"
            >退保</el-button>
            <el-button
              v-if="scope.row.state == '在保' || scope.row.state == '已过期'"
              size="mini"
              type="text"
              icon="el-icon-tickets"
              @click="policy(scope.row)"
              v-hasPermi="['ins:emp:custom:manage:file:query']"
            >保单</el-button>
            <!-- <el-button size="mini" type="text" icon="el-icon-tickets" @click="renewal(scope.row)">续保</el-button> -->
            <el-button
              v-if="scope.row.state == '待付款'"
              size="mini"
              type="text"
              icon="el-icon-coin"
              @click="confirm(scope.row)"
            >确认付款</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-s-check"
              v-if="scope.row.state != '待付款'"
              @click="seeInvoice(scope.row)"
              v-hasPermi="['ins:emp:custom:manage:invoice']"
            >开票信息</el-button>
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
        <el-form-item label="单位地址：">
          <el-input disabled v-model="ruleForm.address"></el-input>
        </el-form-item>
        <el-form-item label="电话号码：">
          <el-input disabled v-model="ruleForm.telphoneNo"></el-input>
        </el-form-item>
        <el-form-item label="开户银行：">
          <el-input disabled v-model="ruleForm.openingBank"></el-input>
        </el-form-item>
        <el-form-item label="公司账号：">
          <el-input disabled v-model="ruleForm.companyAccount"></el-input>
        </el-form-item>
        <el-form-item>
          <el-radio disabled v-model="ruleForm.radio" label="1">增值税专票</el-radio>
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
        <el-form-item label="区域：">
          <el-input disabled v-model="ruleForm.area"></el-input>
        </el-form-item>
        <el-form-item label="详细地址：">
          <el-input disabled type="textarea" v-model="ruleForm.detailAddress"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <a href="javascript:;" class="btn btn2" @click="dialogVisible1 = false">取 消</a>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  insEmpCustomApplyManageList,
  getInvoiceById,
  insEmpCustomApplyManageExportEmpCustomApply,
  insEmpCustomApplyManageAllowRenewal
} from "@/api/information/information";
export default {
  name: "insurance-list",
  data() {
    return {
      dialogVisible1: false,
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
      // 对话框表单展示数据
      ruleForm: {
        radio: "1",
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
      },
      // 有待付款状态禁止续保
      Prohibit: false
    };
  },
  created() {
    this.getList();
    // 查询是否可续保
    insEmpCustomApplyManageAllowRenewal().then(xhrData=>{
      if(xhrData.code === 200){
        this.Prohibit = xhrData.data.allowRenewal // false:不可续保 true:可续保
        
      }
    })
  },
  methods: {
    getList() {
      const page = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        policyNo: this.formInline.policyNo,
        state: this.formInline.state == "" ? null : this.formInline.state,
        insCompName: this.formInline.insCompName
      };
      insEmpCustomApplyManageList(page).then(xhrData => {
        // console.log(xhrData, "列表");
        if (xhrData.code === 200) {
          this.tableData = xhrData.rows;
          this.totalNum = xhrData.total;
          this.tableData.forEach(item => {
            if (item.state == "0") {
              item.state = "申报中";
            } else if (item.state == "1") {
              item.state = "待付款";
            } else if (item.state == "2") {
              item.state = "在保";
            } else if (item.state == "3") {
              item.state = "已过期";
            }
            if (item.operatorPhone == null) {
              item.operatorPhone = "-";
            }
            item.yx =
              item.startTime.split(" ")[0] +
              " 至 " +
              item.endTime.split(" ")[0];
          });
        }
      });
    },
    // 查询
    query() {
      this.getList();
    },
    // 导出
    handleExport() {
      const formInline = this.formInline;
      this.$confirm("是否确认导出数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return insEmpCustomApplyManageExportEmpCustomApply(formInline);
        })
        .then(response => {
          this.download(response.msg);
        })
        .catch(function() {});
    },
    // 查看
    see(row) {
      const obj = {
        id: row.id
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
        id: row.id,
        state:row.state
      };
      this.$emit("changePage", "REPLACE", obj);
    },
    // 保单
    policy(row) {
      // POLICY
      const obj = {
        id: row.id
      };
      this.$emit("changePage", "POLICY", obj);
    },
    // 续保
    renewal() {
      this.$confirm("目前在保数据是否续保?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$emit("changePage", "RENEWAL");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    // 确认付款
    confirm(row) {
      // console.log(row);
      const insData = {
        id: row.id,
        isTrue: true
      };
      // this.$router.push({name:'/prop/public/declare',query: {id:'1'}})
      this.$router.push({ name: "CustomizedDeclare", query: { insData } });
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
    handleState(state) {
      if (state == "0") {
        return (state = "申报中");
      } else if (state == "1") {
        return (state = "待付款");
      } else if (state == "2") {
        return (state = "在保");
      } else if (state == "3") {
        return (state = "已过期");
      }
    },
    handleCycle(cycle) {
      if (cycle == "Y") {
        return (cycle = "年");
      }
    },
    // 开票信息
    seeInvoice(row) {
      this.reduction();
      // 不存在
      if (row.invoiceId == null) return;
      this.dialogVisible1 = true;

      // 根据发票id查询信息
      getInvoiceById(row.invoiceId).then(xhrData => {
        if (xhrData.code === 200) {
          this.objFun(this.ruleForm, xhrData.data);
        }
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
        radio: "1",
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
    }
  }
};
</script>

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
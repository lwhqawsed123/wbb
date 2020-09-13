<template>
  <!-- 充值审核 -->
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
            <el-form-item label="所属物业:">
              <el-input
                @keyup.enter.native="query"
                v-model.trim="formInline.companyName"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
            <el-form-item label="充值账户:">
              <el-input
                @keyup.enter.native="query"
                v-model.trim="formInline.pName"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
            <el-form-item label="审核状态:">
              <el-select @change="query" clearable v-model="formInline.payStatus" placeholder="请选择">
                <el-option label="审核通过" value="1"></el-option>
                <el-option label="审核不通过" value="2"></el-option>
                <el-option label="审核中" value="3"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="充值方式:">
              <el-select @change="query" clearable v-model="formInline.payType" placeholder="请选择">
                <el-option label="线下转账" value="1"></el-option>
                <el-option label="微信支付" value="2"></el-option>
                <el-option label="支付宝支付" value="3"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="申请时间:">
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
              <el-button type="warning" plain @click="handleExport">导出</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <!-- 审核列表 -->
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="index" label="序号" width="80"></el-table-column>
        <el-table-column prop="orderId" show-overflow-tooltip label="订单号" min-width="280px"></el-table-column>
        <el-table-column prop="companyName" show-overflow-tooltip label="所属物业" min-width="200px"></el-table-column>
        <el-table-column prop="pName" show-overflow-tooltip label="充值账号" min-width="200px"></el-table-column>
        <el-table-column prop="beforeBalance" show-overflow-tooltip label="充值前余额" min-width="120px">
          <template slot-scope="scope">
            {{scope.row.beforeBalance.toFixed(2)}}
          </template>
        </el-table-column>
        <el-table-column prop="amount" show-overflow-tooltip label="充值余额" min-width="120px">
          <template slot-scope="scope">
            {{scope.row.amount.toFixed(2)}}
          </template>
        </el-table-column>
        <el-table-column prop="payType" show-overflow-tooltip label="充值方式" min-width="120px">
           <template slot-scope="scope">
             {{handleType(scope.row.payType)}}
           </template>
        </el-table-column>
        <el-table-column prop="payStatus" show-overflow-tooltip label="审核状态" min-width="100px">
          <template slot-scope="scope">
            {{handleStatus(scope.row.payStatus)}}
          </template>
        </el-table-column>
        <el-table-column prop="operatorName" show-overflow-tooltip label="申请人" min-width="100px"></el-table-column>
        <el-table-column prop="createTime" show-overflow-tooltip label="申请时间" min-width="180px"></el-table-column>
        <el-table-column show-overflow-tooltip label="操作" min-width="140px">
          <template slot-scope="scope">
            <a
              v-if="scope.row.payStatus == '3' && !(scope.row.payType == '2' || scope.row.payType == '3')"
              href="javascript:;"
              style="margin-right:3px; color: #1890ff;"
              @click="examine(scope.row)"
            >审核</a>
            <a
              v-else-if="scope.row.payStatus == '1' || scope.row.payStatus == '2' "
              href="javascript:;"
              style="margin-right:3px; color: #1890ff;"
              @click="see(scope.row)"
            >查看</a>
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
      <!-- 审核 对话框 -->
      <el-dialog
        :title="dialogText"
        id="seeDialog"
        class="seeDialog"
        :visible.sync="dialogVisible"
        @close="closeDialog"
        width="700px"
      >
        <el-form ref="form" :rules="rules" :model="form" label-width="120px" label-position="left">
          <el-form-item label="订单号:">
            <el-input :disabled="true" v-model="dataForm.orderId"></el-input>
          </el-form-item>
          <el-form-item label="所属物业:">
            <el-input :disabled="true" v-model="dataForm.companyName"></el-input>
          </el-form-item>
          <el-form-item label="充值账户:">
            <el-input :disabled="true" v-model="dataForm.pName"></el-input>
          </el-form-item>
          <el-form-item label="充值前余额:">
            <el-input :disabled="true" v-model="dataForm.beforeBalance"></el-input>
          </el-form-item>
          <el-form-item label="充值金额:">
            <el-input :disabled="true" v-model="dataForm.amount"></el-input>
          </el-form-item>
          <el-form-item label="充值方式:">
            <el-input :disabled="true" v-model="dataForm.payType"></el-input>
          </el-form-item>
          <el-form-item label="申请人:">
            <el-input :disabled="true" v-model="dataForm.operatorName"></el-input>
          </el-form-item>
          <el-form-item label="申请人手机号:">
            <el-input :disabled="true" v-model="dataForm.phone"></el-input>
          </el-form-item>
          <el-form-item label="申请时间:">
            <el-input :disabled="true" v-model="dataForm.createTime"></el-input>
          </el-form-item>
          <el-form-item v-if="isSee" label="审核状态:" prop="status">
            <el-radio-group @change="triggerExamine" v-model="form.status">
              <el-radio label="1">审核通过</el-radio>
              <el-radio label="2">审核不通过</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="isSee" v-show="isHide" label="被拒原因:" prop="cause">
            <el-input type="textarea" v-model="form.cause"></el-input>
          </el-form-item>
        </el-form>
        <span v-if="isSee" slot="footer" class="dialog-footer">
          <a href="javascript:;" class="btn btn1" @click="confirm('form')">提 交</a>
          <a href="javascript:;" class="btn btn2" @click="dialogVisible=false">取 消</a>
        </span>
        <span v-else-if="!isSee" slot="footer" class="dialog-footer">
          <a href="javascript:;" class="btn btn2" @click="dialogVisible=false">返 回</a>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import "../../../../assets/styles/publicStyle.css";
// 请求
import {
  financeAuditList,
  financeGetById,
  financeAudit,
  financeExport
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
      // 审核表单数据保存
      form: {
        // 审核状态 默认 审核通过
        status: "1",
        // 被拒原因
        cause: ""
      },
      dataForm: {},
      // 审核表单数据验证
      rules: {},
      // 占位
      value1: "",
      // 审核列表数据
      tableData: [],
      // 总条数
      totalNum: 1,
      // 显示条数
      pageSize: 10,
      // 显示页数
      // 分页
      pageNum: 1,
      // 审核对话框
      dialogVisible: false,
      // 审核对话框标题
      dialogText: "",
      // 默认隐藏被拒原因
      isHide: false,
      // 控制操作为查看情况
      isSee: true
    };
  },
  created() {
    this.getAuditList();
  },
  methods: {
    // 获取充值列表信息
    getAuditList() {
      let page;
      if (
        this.formInline.createTime == "" ||
        this.formInline.createTime == null
      ) {
        page = {
          pageSize: this.pageSize,
          pageNum: this.pageNum,
          companyName: this.formInline.companyName,
          orderId: this.formInline.orderId,
          pName: this.formInline.pName,
          payStatus: this.formInline.payStatus,
          payType: this.formInline.payType,
          // 开始时间
          startTime: "",
          // 结束时间
          endTime: ""
        };
      } else {
        page = {
          pageSize: this.pageSize,
          pageNum: this.pageNum,
          companyName: this.formInline.companyName,
          orderId: this.formInline.orderId,
          pName: this.formInline.pName,
          payStatus: this.formInline.payStatus,
          payType: this.formInline.payType,
          // 开始时间
          startTime: this.formInline.createTime[0] + " 00:00:00",
          // 结束时间
          endTime: this.formInline.createTime[1] + " 23:59:59"
        };
      }

      // console.log(page);

      financeAuditList(page).then(xhrData => {
        // console.log(xhrData);
        if (xhrData.code === 200) {
          this.tableData = xhrData.rows;
          // this.tableData.forEach(item => {
          //   if (item.payType == "1") {
          //     item.payType = "线下转账";
          //   } else if (item.payType == "2") {
          //     item.payType = "微信支付";
          //   }
          //   if (item.payStatus == "1") {
          //     item.payStatus = "审核通过";
          //   } else if (item.payStatus == "2") {
          //     item.payStatus = "审核不通过";
          //   } else if (item.payStatus == "3") {
          //     item.payStatus = "审核中";
          //   }
          //   item.amount = item.amount.toFixed(2);
          //   item.beforeBalance = item.beforeBalance.toFixed(2);
          // });
          // 总条数
          this.totalNum = xhrData.total;
        }
      });
    },
    // 查询
    query() {
      // console.log(this.formInline);
      this.getAuditList();
    },
    // 关闭对话框
    closeDialog() {
      // 恢复表单
      this.form = {
        // 审核状态 默认 审核通过
        status: "1",
        // 被拒原因
        cause: ""
      };
      // 默认隐藏被拒原因
      this.isHide = false;
    },
    // 操作 审核按钮
    examine(row) {
      this.isSee = true;
      // console.log(row.id);
      // 恢复表单
      this.form = {
        // 审核状态 默认 审核通过
        status: "1",
        // 被拒原因
        cause: ""
      };
      // 默认隐藏被拒原因
      this.isHide = false;
      // 赋值id
      this.form.id = row.id;
      // 打开对话框
      this.dialogVisible = true;
      // 修改审核对话框标题
      this.dialogText = "审核详情";
      // 请求获取当前信息
      financeGetById(row.id).then(xhrData => {
        // console.log(xhrData);
        if (xhrData.code === 200) {
          this.dataForm = xhrData.data;
          if (this.dataForm.payType == "1") {
            this.dataForm.payType = "线下转账";
          } else if (this.dataForm.payType == "2") {
            this.dataForm.payType = "微信支付";
          }
          this.dataForm.amount = this.dataForm.amount.toFixed(2);
        }
      });
    },
    // 操作 查看按钮
    see(row) {
      this.isSee = false;
      // 恢复表单
      this.form = {
        // 审核状态 默认 审核通过
        status: "1",
        // 被拒原因
        cause: ""
      };
      // 打开对话框
      this.dialogVisible = true;
      // 赋值id
      this.form.id = row.id;
      // 修改审核对话框标题
      this.dialogText = "查看";
      // 请求获取当前信息
      financeGetById(row.id).then(xhrData => {
        // console.log(xhrData);
        if (xhrData.code === 200) {
          this.dataForm = xhrData.data;
          if (this.dataForm.payType == "1") {
            this.dataForm.payType = "线下转账";
          } else if (this.dataForm.payType == "2") {
            this.dataForm.payType = "微信支付";
          }
          this.dataForm.amount = this.dataForm.amount.toFixed(2);
        }
      });
    },
    // 审核 提交
    confirm() {
      // console.log(this.form);
      // 提交审核
      financeAudit(this.form).then(xhrData => {
        // console.log(xhrData);
        if (xhrData.code === 200) {
          this.$message({
            type: "success",
            message: "提交成功!"
          });
          // 关闭对话框
          this.dialogVisible = false;
          // 更新列表
          this.getAuditList();
        }
      });
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
          return financeExport(formInline);
        })
        .then(response => {
          this.download(response.msg);
        })
        .catch(function() {});
    },
    //在改变每页显示的条数
    // 判断审核不通过时候 触发
    triggerExamine(val) {
      // console.log(val);
      if (val == "2") {
        this.isHide = true;
      } else {
        this.isHide = false;
      }
    },
    handleSizeChange(val) {
      // 注意：在改变每页显示的条数时，要将页码显示到第一页
      this.pageNum = 1;
      // 改变每页显示的条数
      this.pageSize = val;
      // 更新列表
      this.getAuditList();
    },
    // 页数
    handleCurrentChange(val) {
      // 改变默认的页数
      this.pageNum = val;
      // 更新列表
      this.getAuditList();
    },
    // 处理状态
    handleStatus(status){
      if(status == '1'){
        return status = '审核通过'
      }else if(status == '2'){
        return status = '审核不通过'
      }else if(status == '3'){
        return status = '审核中'
      }
    },
    handleType(type){
      if(type == '1'){
        return type = '线下转账'
      }else if(type == '2'){
        return type = '微信支付'
      }else if(type == '3'){
        return type = '支付宝支付'
      }

    }
  }
};
</script>
<style>
.el-range-editor--medium .el-range-separator {
  width: 20px;
}
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
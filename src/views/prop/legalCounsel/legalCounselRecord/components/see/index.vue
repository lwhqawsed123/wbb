<template>
  <div class="see-table-box">
    <el-row :gutter="20" class="record-top" style="margin-left: 0px; margin-right: 0px;">
      <el-col :span="24">
        <el-form
          id="companyForm"
          :inline="true"
          @submit.native.prevent
          :model="formInline"
          class="demo-form-inline"
        >
          <el-form-item label="业主姓名:">
            <el-input
              @keyup.enter.native="query"
              v-model.trim="formInline.proprName"
              placeholder="请输入"
              @clear="query"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item
            label="委托状态:"
            v-if="obj.entrustStatus!==1&&obj.entrustStatus!==7&&obj.entrustStatus!==3"
          >
            <el-select @clear="query" @change="query" clearable v-model="formInline.examineStatus" placeholder="请选择">
              <el-option
                v-for="(item) in examineStatus"
                :key="item.examineStatus"
                :label="item.label"
                :value="item.examineStatus"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="info" plain @click="query">查询</el-button>
            <el-button type="warning" plain @click="handleExport">导出</el-button>
            <el-button type="info" plain @click="revert">返回</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!-- 审核列表 -->
    <el-table :data="tableData" style="width: 100%">
      <!-- <el-table-column label="委托编号" min-width="100px" v-if="obj.entrustStatus!==1&&obj.entrustStatus!==7">
         <template>{{obj.orderNo}}</template>
      </el-table-column> -->
      <el-table-column prop="id" label="委托编号">
      </el-table-column>
      <el-table-column prop="proprName" label="欠费业主姓名" min-width="100px"></el-table-column>
      <el-table-column prop="proprMobile" show-overflow-tooltip label="联系方式" min-width="200px"></el-table-column>
      <el-table-column prop="proprAddress" show-overflow-tooltip label="欠费房屋详细地址" min-width="200px"></el-table-column>
      <el-table-column prop="arrearage" show-overflow-tooltip label="欠费金额(不含滞纳金)" min-width="200px"></el-table-column>
      <el-table-column show-overflow-tooltip label="欠费时间段" min-width="200px">
        <template
          slot-scope="scope"
        >{{scope.row.arrearageStartTime.slice(0,10)+' - '+scope.row.arrearageEndTime.slice(0,10)}}</template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="委托状态">
        <template slot-scope="scope">{{examineStatus.filter(item=>item.examineStatus===scope.row.examineStatus)[0].label}}</template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="操作" min-width="200px">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            v-hasPermi="['info:invoice:edit']"
            @click="editOwner(scope.row)"
            v-if="scope.row.examineStatus===0"
          >编辑</el-button>
          <el-button
            size="mini"
            type="text"
            v-hasPermi="['info:invoice:edit']"
            @click="downloadPDF(scope.row.id)"
            v-if="scope.row.examineStatus===2&&obj.lawyerType===1"
          >下载pdf</el-button>
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

    <!-- 修改弹框 -->
    <el-dialog
      @close="resetForm('ownerForm')"
      id="owner-dialog"
      title="修改信息"
      :visible.sync="dialogVisible"
      width="600px"
    >
      <el-form
        :rules="rules"
        :model="ownerForm"
        label-width="170px"
        label-position="left"
        ref="ownerForm"
      >
        <el-form-item label="欠费业主姓名" prop="proprName">
          <el-input v-model="ownerForm.proprName" maxlength="10" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="proprMobile">
          <el-input v-model="ownerForm.proprMobile" maxlength="11" show-word-limit></el-input>
        </el-form-item>
        <el-form-item prop="proprAddress" label="欠费房屋详细地址">
          <el-input v-model="ownerForm.proprAddress" placeholder show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="欠费金额(不含滞纳金)" prop="arrearage">
          <el-input v-model="ownerForm.arrearage" maxlength="10" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="欠费时间段" prop="arrearageDate">
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="ownerForm.arrearageDate"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="owner-dialog-footer">
        <a href="javascript:;" class="owner-btn btn1" @click="submitForm('ownerForm')">保存</a>
        <a href="javascript:;" class="owner-btn btn2" @click="dialogVisible=false">关闭</a>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { recordDetailList,downloadPDFById,onlineOwnerEdit } from "@/api/legal/legal_record";
export default {
  name: "insurance-added-list",
  props: ["obj"],
  data() {
    return {
      formInline: {
        proprName: "",
        examineStatus: "",
        isAsc:'desc'
      },
      tableData: [],
      // 总条数
      totalNum: 1,
      // 显示条数
      pageSize: 10,
      // 显示页数
      // 分页
      pageNum: 1,
      //====新增/修改=====
      dialogVisible: false,
      // 添加表单数据
      // 添加表单数据
      ownerForm: {
        // 业主名称
        proprName: "",
        // 联系方式
        proprMobile: "",
        // 详细地址
        proprAddress: "",
        // 欠费金额
        arrearage: "",
        // 欠费开始时间
        arrearageStartTime: "",
        // 欠费截止时间
        arrearageEndTime: "",
        arrearageDate: []
      },

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
      // 律师审核状态
      examineStatus: [
        { examineStatus: 0, label: "待付款" },
        { examineStatus: 1, label: "未审核" },
        { examineStatus: 2, label: "审核通过" },
        { examineStatus: 3, label: "已作废" },
        { examineStatus: 4, label: "待处理" },
        { examineStatus: 5, label: "已完成" }
      ],
      // 表单验证
      rules: {
        // 项目名
        name: [{ required: true, message: "请输入业主名称", trigger: "blur" }],
        // 项目地址
        address: [
          { required: true, message: "请输入业主地址", trigger: "blur" }
        ],

        price: [
          { required: true, message: "请输入欠费金额", trigger: "blur" },
          {
            // pattern: /^0{0,1}(13[0-9]|15[7-9]|153|156|18[7-9])[0-9]{8}$/,
            pattern: /^(\d+)(.\d{0,2})?$/,
            message: "金额格式错误,最多保留两位小数",
            trigger: "blur"
          }
        ],
        // 联系电话
        phoneNumber: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            // pattern: /^0{0,1}(13[0-9]|15[7-9]|153|156|18[7-9])[0-9]{8}$/,
            pattern: /^1(3|4|5|6|7|8|9)\d{9}$/,
            message: "手机号格式不对",
            trigger: "blur"
          }
        ],
        // 请选择合同时间
        date: [{ required: true, message: "请选择合同时间", trigger: "change" }]
      }
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
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        proprName: this.formInline.proprName,
        examineStatus: this.formInline.examineStatus
      };
      recordDetailList(page).then(xhrData => {
        if (xhrData.code === 200) {
          this.tableData = xhrData.rows;
          this.totalNum = xhrData.total;
        }
      });
    },
    // 修改
    editOwner(row) {
      let ownerForm = JSON.parse(JSON.stringify(row));
      let arr = [];
      arr.push(ownerForm.arrearageStartTime.slice(0,10));
      arr.push(ownerForm.arrearageEndTime.slice(0,10));
      // this.$set(ownerForm,"arrearageDate",arr)
      ownerForm.arrearageDate = arr;
      this.ownerForm = ownerForm;
      this.dialogVisible = true;
    },
    // 确认变更申请
    submitForm(changeForm) {
      // 表单验证
      this.$refs[changeForm].validate(valid => {
        // 通过验证
        if (valid) {
          let ownerForm = {
            arrearage: this.ownerForm.arrearage,
            arrearageEndTime: this.ownerForm.arrearageDate[1]+' 00:00:00',
            arrearageStartTime: this.ownerForm.arrearageDate[0]+' 23:59:59',
            examineStatus: this.ownerForm.examineStatus,
            proprAddress: this.ownerForm.proprAddress,
            proprMobile: this.ownerForm.proprMobile,
            proprName: this.ownerForm.proprName,
            id: this.ownerForm.id
          };
          // 修改业主信息
          onlineOwnerEdit(ownerForm)
            .then(xhrData => {
              if (xhrData.code === 200) {
                this.$message.success({
                  message: "变更成功!"
                });
                // 关闭对话框
                this.dialogVisible = false;
                this.getList();
              } else if (xhrData.code === 500) {
                this.$message.error({
                  message: xhrData.msg
                });
                // 关闭对话框
                this.dialogVisible = false;
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
    // 关闭按钮
    closeForm() {
      // 清空表单
      this.$nextTick(() => {
        this.$refs["ownerForm"].resetFields();
      });
      this.dialogVisible = false;
    },
    // 关闭对话框
    resetForm(formName) {
      // 清空表单
      this.$nextTick(() => {
        this.$refs["ownerForm"].resetFields();
      });
      this.dialogVisible = false;
    },
    // 查询
    query() {
      this.getList();
    },
    // 导出
    handleExport() {
      const formInline = this.formInline;
      (formInline.applyId = this.obj.id), (formInline.pageSize = this.pageSize);
      formInline.pageNum = this.pageNum;
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
    // 下载pdf
    downloadPDF(id) {
      this.$confirm("是否确认下载pdf文件?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          downloadPDFById(id)
            .then(res => {
              // 必传后缀
              this.downloadBlob(res, "律师函.zip");
            })
        })
        .catch(function() {});
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
.see-table-box {
  padding: 0 10px;
}
.el-pagination {
  position: absolute;
  bottom: 40px;
  left: 20px;
  right: 0;
}
</style>
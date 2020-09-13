<template>
  <div class>
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
            <el-form-item label="业主姓名:">
              <el-input
                @keyup.enter.native="query"
                @clear="query"
                v-model.trim="formInline.proprName"
                placeholder="请输入"
                clearable
              ></el-input>
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
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        row-key="proprId"
      >
        <el-table-column type="index" min-width="50" label="序号"></el-table-column>
        <el-table-column prop="proprId" show-overflow-tooltip label="委托编号" min-width="120px">
        </el-table-column>
        <el-table-column prop="proprName" label="欠费业主姓名" show-overflow-tooltip></el-table-column>
        <el-table-column show-overflow-tooltip prop="proprMobile" label="联系方式"></el-table-column>
        <el-table-column
          show-overflow-tooltip
          label="欠费业主详细地址"
          prop="proprAddress"
          min-width="120px"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          label="欠费金额（不含滞纳金)"
          prop="arrearage"
          min-width="120px"
        ></el-table-column>
        <el-table-column show-overflow-tooltip label="欠费时间段" min-width="120px">
          <template
            slot-scope="scope"
          >{{scope.row.arrearageStartTime+" - "+scope.row.arrearageEndTime}}</template>
        </el-table-column>
        <el-table-column label="委托状态">
          <template
            slot-scope="scope"
          >{{examineStatus.filter((item)=>item.examineStatus===scope.row.examineStatus)[0].label}}</template>
        </el-table-column>
        <el-table-column label="操作" min-width="120px">
          <template slot-scope="scope">
            <!-- 律师审核状态(0:待付款 1:未审核、2:审核通过、3:已作废、4：待处理、5：已完成) -->
            <a
              href="javascript:;"
              style="margin-right:3px; color: rgb(24, 144, 255);"
              v-if="scope.row.examineStatus===4"
              @click="auditById(scope.row,3)"
            >作废</a>
            <a
              href="javascript:;"
              style="margin-right:3px; color: rgb(24, 144, 255);"
              @click="openOwner(scope.row)"
              v-if="scope.row.examineStatus===4"
            >编辑</a>
            <a
              href="javascript:;"
              style="margin-right:3px; color: rgb(24, 144, 255);"
              v-if="scope.row.examineStatus===4||scope.row.examineStatus===3||scope.row.examineStatus===5"
              @click="downloadPDF(scope.row.proprId)"
            >下载pdf</a>
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
    </div>
    <!-- 修改弹框 -->
    <el-dialog
      @close="resetForm('ownerForm')"
      id="owner-dialog"
      :title="ownerDialog.dalogText"
      :visible.sync="ownerDialog.dialogVisible"
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
          <el-input
            type="textarea"
            v-model="ownerForm.proprAddress"
            placeholder
            resize="none"
            maxlength="50"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="欠费金额(不含滞纳金)" prop="arrearage">
          <el-input v-model="ownerForm.arrearage" maxlength="13"></el-input>
        </el-form-item>
        <el-form-item label="欠费时间段" prop="date">
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="ownerForm.date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="owner-dialog-footer">
        <a href="javascript:;" class="owner-btn btn1" @click="submitForm('ownerForm')">保存</a>
        <a href="javascript:;" class="owner-btn btn2" @click="ownerDialog.dialogVisible = false">关闭</a>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  proprList,
  offlineExport,
  offlineDownloadPDF,
  editProprExamineStatus,
  editOwner
} from "@/api/legal/expressToProperty.js";
export default {
  name: "insurance-added-list",
  props: ["obj"],
  data() {
    return {
      formInline: {
        proprName: ""
      },
      tableData: [],
      // 总条数
      totalNum: 1,
      // 显示条数
      pageSize: 10,
      // 显示页数
      // 分页
      pageNum: 1,
      // 弹框
      ownerDialog: {
        dialogVisible: false,
        dalogText: ""
      },
      // 表单数据
      ownerForm: {
        // 业主名称
        proprName: "",
        // 联系方式
        proprMobile: "",
        // 详细地址
        proprAddress: "",
        // 欠费金额
        arrearage: "",
        // 欠费时间段
        date: []
      },
      // 表单验证
      rules: {
        // 项目名
        proprName: [
          { required: true, message: "请输入业主名称", trigger: "blur" }
        ],
        // 项目地址
        proprAddress: [
          { required: true, message: "请输入业主地址", trigger: "blur" }
        ],
        arrearage: [
          { required: true, message: "请输入欠费金额", trigger: "blur" },
          {
            // pattern: /^0{0,1}(13[0-9]|15[7-9]|153|156|18[7-9])[0-9]{8}$/,
            pattern: /^(\d+)(.\d{0,2})?$/,
            message: "金额格式错误,最多保留两位小数",
            trigger: "blur"
          }
        ],
        // 联系电话
        proprMobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            // pattern: /^0{0,1}(13[0-9]|15[7-9]|153|156|18[7-9])[0-9]{8}$/,
            pattern: /^1(3|4|5|6|7|8|9)\d{9}$/,
            message: "手机号格式不对",
            trigger: "blur"
          }
        ],
        // 请选择合同时间
        date: [{ required: true, message: "请选择欠费时间", trigger: "blur" }]
      },
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
          proprName: this.formInline.proprName,
          pageSize: this.pageSize,
          pageNum: this.pageNum
        }
      };
      proprList(page).then(xhrData => {
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
    // 打开编辑弹框
    openOwner(row) {
      // 打开对话框
      this.ownerDialog.dalogText = "添加业主信息";
      this.ownerForm = JSON.parse(JSON.stringify(row));
      let arr = [];
      arr.push(row.arrearageStartTime);
      arr.push(row.arrearageEndTime);
      this.$set(this.ownerForm, "date", arr);
      this.ownerDialog.dialogVisible = true;
      // 还原时间
    },
    // 关闭对话框
    resetForm(formName) {
      // 清空表单
      this.$nextTick(() => {
        this.$refs["ownerForm"].resetFields();
      });
      this.ownerDialog.dialogVisible = false;
    },
    // 对话框 确认 按钮
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        // 验证成功
        if (valid) {
          let ownerForm = JSON.parse(JSON.stringify(this.ownerForm));
          ownerForm.proprAddress = ownerForm.proprAddress.replace(/；/g, ";");
          ownerForm.arrearageStartTime = ownerForm.date[0] + " 00:00:00";
          ownerForm.arrearageEndTime = ownerForm.date[1] + " 23:59:59";
          delete ownerForm.date;
          editOwner(ownerForm).then(res => {
            if (res.code === 200) {
              this.$message.success({
                message: "变更成功!"
              });
              this.ownerDialog.dialogVisible = false;
              this.getList();
            } else if (res.code === 500) {
              this.$message.error({
                message: res.msg
              });
            }
          });
          // this.ownerDialog.dialogVisible = false;
        } else {
          // console.log("error submit!!");
          this.$message.warning({
            message: "请完善信息!"
          });
          return false;
        }
      });
    },
    // 根据id单个审核
    auditById(row, status) {
      this.$confirm(
        "审核通过后无法再更改审核状态，是否确定审核通过？",
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          let data = {
            id: this.obj.id,
            proprId: row.proprId,
            data: {
              examineStatus: status
            }
          };
          console.log(data);

          editProprExamineStatus(data).then(res => {
            if (res.code === 200) {
              this.$message.success({
                message: "变更成功!"
              });
              this.getList();
            } else if (res.code === 500) {
              this.$message.error({
                message: res.msg
              });
            }
          });
        })
        .catch(function() {});
    },
    // 导出
    handleExport() {
      this.$confirm("是否确认导出数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return offlineExport(this.obj.id);
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
          offlineDownloadPDF(id)
            .then(res => {
              // 必传后缀
              this.downloadBlob(res, "律师函.zip");
            })
            .catch(err => {
              console.log(err);
            });
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
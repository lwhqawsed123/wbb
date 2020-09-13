<template>
  <!-- 家财保障申报记录 -->
  <div class="record">
    <div class="record-conter">
      <el-row :gutter="20" class="record-top" style="margin-left: 0px; margin-right: 0px;">
        <el-col :span="24">
          <el-form :inline="true" :model="formInline" class="demo-form-inline" @submit.native.prevent>
            <el-form-item>
              <el-input
                style="width:200px"
                @keyup.enter.native="onSubmit"
                v-model.trim="formInline.questionsTitle "
                placeholder="请输入关键词搜索"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="info" plain @click="onSubmit">查看</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" plain @click="toAdd" v-hasPermi="['info:invoice:add']">添加</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%">
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <el-table-column
          prop="questionsTitle"
          :show-overflow-tooltip="true"
          label="问题标题"
          min-width="200px"
        ></el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          prop="questionsText"
          label="回复内容"
          min-width="200px"
        ></el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          prop="questionsWeight"
          label="排序"
          min-width="150px"
        ></el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          prop="createTime"
          label="创建时间"
          min-width="200px"
        >
          <!-- <template slot-scope="scope">{{scope.row.createTime.slice(0,10)}}</template> -->
        </el-table-column>

        <el-table-column label="保单状态" min-width="180px">
          <template slot-scope="scope">
            <a href="javascript:;" style="color: #1890ff;" @click="toEdit(scope.row)">编辑</a>
            <a
              href="javascript:;"
              style="margin-left:3px;color: #ff0000;"
              @click="toDelete(scope.row)"
            >删除</a>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="formInline.pageNum"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="formInline.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNum"
      ></el-pagination>
    </div>
    <!-- 完善 对话框 -->
    <el-dialog
      @close="closeDialog"
      id="company-dialog"
      :title="titleName"
      width="600px"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        :model="formData"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
        :rules="rules"
        label-position="left"
        id="InformationModificationForm"
      >
        <el-form-item label="问题标题" prop="questionsTitle">
          <el-input
            maxlength="50"
            v-model="formData.questionsTitle"
            placeholder="请输入"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="回答内容" prop="questionsText">
          <el-input
            maxlength="100"
            type="textarea"
            resize="none"
            class="company-input"
            v-model="formData.questionsText"
            placeholder="请输入"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="questionsWeight">
          <el-input
            maxlength="20"
            v-model.number="formData.questionsWeight"
            placeholder="数字越小排序越靠前"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="addAndEdit('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  queryApplyHouseInsureList,
  getProjectRoleList,
  insRuleGetProduct,
  changeApplyAddressInfo,
  exportApplyRecord
} from "@/api/information/information";
import {
  questionList,
  questionAdd,
  questionEdit,
  questionDelete
} from "@/api/legal/question";
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
        questionsTitle: "",
        // 搜索内容
        searchValue: "",
        // 当前显示条数
        pageSize: 10,
        // 当前显示页数
        pageNum: 1
      },
      // 表格数据
      tableData: [],
      // 保险信息
      productList: [],
      //===============
      titleName: "",
      // 变更申请 对话框
      dialogFormVisible: false,
      // 项目用户当前信息
      userData: {},
      // 对话框内表单数据
      formData: {
        // 排序
        questionsWeight: 0,
        // 问题标题
        questionsTitle: "",
        // 回复内容
        questionsText: ""
      },
      // 表单验证
      rules: {
        // 标题
        questionsTitle: [
          { required: true, message: "请输入新地址", trigger: "blur" }
        ],
        // 内容
        questionsText: [
          { required: true, message: "请输入新地址", trigger: "blur" }
        ],
        // 排序
        questionsWeight: [
          { required: true, message: "不能为空", trigger: "blur" },
          { type: "number", message: "必须为数字值", trigger: "blur" }
        ]
      },
      // 保单号
      insuranceNo: "",
      // 原地址
      houseAddress: "",
      // 手机
      mobileNo: ""
    };
  },
  filters: {
    readMore: function(value) {
      return value.split("+")[0];
    }
  },
  created() {
    // 调用 获取常见问题 方法
    this.getQuestionList();
  },
  methods: {
    // 获取常见问题
    getQuestionList() {
      const page = this.formInline;
      questionList(page).then(res => {
        if (res.code === 200) {
          // 赋值到表格数据
          this.tableData = res.rows;
          // 总条数
          this.totalNum = res.total;
        }
      });
    },

    // 打开新增弹框
    toAdd() {
      this.formData = {
        // 排序
        questionsWeight: 0,
        // 问题标题
        questionsTitle: "",
        // 回复内容
        questionsText: ""
      };
      // 打开对话框
      this.dialogFormVisible = true;
      // 修改对话框标题
      this.titleName = "添加";
    },
    closeDialog() {
      // this.getProp();// 获取列表
      this.$refs["ruleForm"].resetFields();
    },
    // 打开修改弹框
    toEdit(row) {
      this.$nextTick(() => {
        let formData = JSON.parse(JSON.stringify(row));
        this.titleName = "修改";
        this.formData = {
          id: formData.id,
          // 排序
          questionsWeight: formData.questionsWeight,
          // 问题标题
          questionsTitle: formData.questionsTitle,
          // 回复内容
          questionsText: formData.questionsText
        };
      });
      // 打开对话框
      this.dialogFormVisible = true;
    },
    // 对话框取消按钮
    cancel() {
      this.dialogFormVisible = false;
    },
    // 确认变更申请
    addAndEdit(changeForm) {
      // 表单验证
      this.$refs[changeForm].validate(valid => {
        // 通过验证
        if (valid) {
          let data = JSON.parse(JSON.stringify(this.formData));
          if (data.id) {
            this.editQuestion(data);
          } else {
            this.addNewQuestion(data);
          }
        } else {
          this.$message.warning({
            message: "请完善信息~!"
          });
          return false;
        }
      });
    },

    // 修改的请求
    editQuestion(form) {
      // 请求变更申请
      questionEdit(form)
        .then(res => {
          if (res.code === 200) {
            this.$message.success({
              message: "变更成功!"
            });
            // 更新列表
            this.getQuestionList();
            // 关闭对话框
            this.dialogFormVisible = false;
            // 清空表单
            this.$refs["changeForm"].resetFields();
          } else if (res.code === 500) {
            this.$message.error({
              message: res.msg
            });
            // 关闭对话框
            this.dialogFormVisible = false;
          }
        })
        .catch(() => {
          // 关闭对话框
          // this.dialogFormVisible = false;
        });
    },
    // 新增的请求
    addNewQuestion(form) {
      console.log(form);

      // 请求变更申请
      questionAdd(form)
        .then(res => {
          if (res.code === 200) {
            this.$message.success({
              message: "新增成功!"
            });
            // 更新列表
            this.getQuestionList();
            // 关闭对话框
            this.dialogFormVisible = false;
            // 清空表单
            this.$refs["changeForm"].resetFields();
          } else if (res.code === 500) {
            this.$message.error({
              message: res.msg
            });
            // 关闭对话框
            this.dialogFormVisible = false;
          }
        })
        .catch(() => {
          // 关闭对话框
          // this.dialogFormVisible = false;
        });
    },
    // 点击删除
    toDelete(row) {
      this.$confirm("此操作将永久删除该内容, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          questionDelete(row.id).then(res => {
            if (res.code === 200) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              // 更新列表
              this.getQuestionList();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 关闭对话框
    resetForm() {
      // 清空表单
      this.$refs["changeForm"].resetFields();
    },
    // 查询
    onSubmit() {
      this.getQuestionList();
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleSizeChange(val) {
      // 注意：在改变每页显示的条数时，要将页码显示到第一页
      this.formInline.pageNum = 1;
      // 改变每页显示的条数
      this.formInline.pageSize = val;
      // 点击每页显示的条数时，显示第一页
      this.getQuestionList();
    },
    handleCurrentChange(val) {
      // 改变默认的页数
      this.formInline.pageNum = val;
      // 切换页码时，要获取每页显示的条数
      this.getQuestionList();
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
</style>
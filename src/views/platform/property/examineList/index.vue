<template>
  <!-- 物业公司审核 -->
  <div class="publicStyle">
    <div class="publicStyle-conter">
      <el-row :gutter="20" class="record-top" style="margin-left: 0px; margin-right: 0px;">
        <el-col :span="24">
          <el-form id="companyForm" :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="公司名称:">
              <el-input
                @keyup.enter.native="query"
                v-model.trim="formInline.name"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
            <el-form-item label="联系电话:">
              <el-input
                @keyup.enter.native="query"
                v-model.trim="formInline.contact_no"
                placeholder="请输入"
                :maxlength='11'
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="info" plain @click="query">查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <!-- 列表 -->
      <el-table :data="tableData" style="width: 100%">
        <el-table-column show-overflow-tooltip  type="index" label="序号" width="80"></el-table-column>
        <el-table-column show-overflow-tooltip  prop="name" label="公司名称" min-width="200px"></el-table-column>
        <el-table-column show-overflow-tooltip  prop="contact" label="联系人" min-width="100px"></el-table-column>
        <el-table-column show-overflow-tooltip  prop="status" label="审核状态" min-width="100px"></el-table-column>
        <el-table-column show-overflow-tooltip  prop="createTime" label="申请时间" min-width="160px"></el-table-column>
        <el-table-column show-overflow-tooltip  prop="address" label="操作" min-width="120px">
          <!-- eslint-disable-next-line -->
          <template slot-scope="scope">
            <a
              href="javascript:;"
              style="margin-right:3px; color: #1890ff;"
              @click="examine(scope.row)"
            >审核</a>
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
      <el-dialog title="审核详情" class="seeDialog" :visible.sync="dialogVisible1" width="40%">
        <el-form
          ref="form"
          class="demo-ruleForm"
          :model="form"
          label-width="100px"
          label-position="left"
        >
          <el-form-item label="公司名称:" style="width:100%">
            <!-- <el-input v-model="form.name" :disabled="true"></el-input> -->
            <span>{{form.name}}</span>
          </el-form-item>
          <el-form-item label="登录账号:" style="width:100%">
            <el-input v-model="form.name" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="联系人:" style="width:100%">
            <el-input v-model="form.contact" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="手机号:" style="width:100%">
            <el-input v-model="form.contact_no" :disabled="true"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <a href="javascript:;" class="btn btn1" @click="preservation('form')">审核通过</a>
          <a href="javascript:;" class="btn btn2" @click="dialogVisible1=false">取 消</a>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import "../../../../assets/styles/publicStyle.css";
// insCompanyList
// 请求
import {
  propCompanyWaitList,
  myCenterSaveRegisterAudit
} from "@/api/information/information";
export default {
  name: "",
  data() {
    return {
      // 搜索查询表单
      formInline: {
        // 公司名称
        name: "",
        // 联系电话
        contact_no: ""
      },
      // 审核对话框 表单数据
      form: {},
      // 审核对话框 默认隐藏
      dialogVisible1: false,
      // 列表数据
      tableData: [],
      // 总条数
      totalNum: 1,
      // 显示条数
      pageSize: 10,
      // 显示页数
      // 分页
      pageNum: 1,
      // 对话框
      dialogVisible: false,
      // 保存审核id
      id: Number
    };
  },
  created() {
    this.getListData();
  },
  methods: {
    // 获取列表信息
    getListData() {
      const page = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        name: this.formInline.name,
        contact_no: this.formInline.contact_no
      };
      propCompanyWaitList(page).then(xhrData => {
        // console.log(xhrData);
        if (xhrData.code === 200) {
          this.tableData = xhrData.rows;
          this.tableData.forEach(item => {
            if (item.status == "2") {
              item.status = "待审核";
            }
          });
          this.totalNum = xhrData.total;
        }
      });
    },
    //在改变每页显示的条数
    handleSizeChange(val) {
      // 注意：在改变每页显示的条数时，要将页码显示到第一页
      this.pageNum = 1;
      // 改变每页显示的条数
      this.pageSize = val;
      // 更新列表
      this.getListData();
    },
    // 页数
    handleCurrentChange(val) {
      // 改变默认的页数
      this.pageNum = val;
      // 更新列表
      this.getListData();
    },
    // 查询
    query() {
      this.getListData();
    },
    // 操作 审核按钮
    examine(row) {
      // console.log(row.id);
      this.id = Number;
      this.form = row;
      // 打开审核详情对话框
      this.dialogVisible1 = true;
      // 赋值当前id
      this.id = row.id;
    },
    // 审核通过按钮
    preservation() {
      const data = {
        id: this.id,
        status: "0"
      };
      // console.log(data);
      // 请求审核
      myCenterSaveRegisterAudit(data).then(xhrData => {
        // console.log(xhrData);
        if (xhrData.code === 200) {
          // 提示
          this.$message({
            type: "success",
            message: "审核成功!"
          });
          // 关闭对话框
          this.dialogVisible1 = false;
          // 更新列表
          this.getListData();
        }
      });
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
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
<style lang="scss" scoped>
.record-top {
  margin-left: 0;
  margin-right: 0;
  min-height: 60px;
  border-bottom: 1px solid #d6d6d6;
  .el-form--inline .el-form-item {
    margin-top: 10px;
    margin-bottom: 0;
    .el-input {
      width: 200px;
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
  bottom: 40px;
  left: 20px;
  right: 0;
}
#seeDialog {
  .dialog-from {
    h3 {
      font-size: 18px;
      padding-bottom: 20px;
    }
  }
}
</style>
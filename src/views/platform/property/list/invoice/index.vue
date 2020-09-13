<template>
  <div class="publicStyle">
    <!-- 发票抬头详情 -->
    <div class="publicStyle-conter">
      <el-row :gutter="20" class="record-top" style="margin-left: 0px; margin-right: 0px;">
        <el-col :span="24">
          <el-form id="companyForm" :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="发票抬头:">
              <el-input
                @keyup.enter.native="query"
                v-model.trim="formInline.title"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
            <el-form-item label="发票类型:">
              <el-select @change="query" clearable v-model="formInline.type" placeholder="请选择">
                <el-option label=" 增值税专票" value="1"></el-option>
                <el-option label="增值税普票" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="info" plain @click="query">查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <!-- 列表 -->
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="title" label="发票抬头" min-width="20%"></el-table-column>
        <el-table-column prop="type" label="发票类型" min-width="20%"></el-table-column>
        <el-table-column show-overflow-tooltip prop="dizi" label="快递/邮箱地址" min-width="20%"></el-table-column>
        <el-table-column prop="createTime" label="添加时间" min-width="20%"></el-table-column>
        <el-table-column prop="address" label="操作" min-width="20%">
          <!-- eslint-disable-next-line -->
          <template slot-scope="scope">
            <a
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
      <!-- 查看 对话框 -->
      <el-dialog title="发票抬头信息" class="seeDialog" :visible.sync="dialogVisible1" width="40%">
        <el-form
          ref="form"
          class="demo-ruleForm"
          :model="form"
          label-width="100px"
          label-position="left"
        >
          <h4>发票抬头信息</h4>
          <div class="invioice-form-wrap">
            <el-form-item label="公司名称:" style="width:100%">
              <!-- <el-input v-model="form.name" :disabled="true"></el-input> -->
              <span>{{form.pcName}}</span>
            </el-form-item>
            <el-form-item label="发票类型:" style="width:100%">
              <el-input v-model="form.type" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="发票抬头:" style="width:100%">
              <el-input v-model="form.title" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="税号:" style="width:100%">
              <el-input v-model="form.einNo" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item v-if="isShow" label="单位地址:" style="width:100%">
              <el-input v-model="form.address" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item v-if="isShow" label="电话号码:" style="width:100%">
              <el-input v-model="form.telphoneNo" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item v-if="isShow" label="开户银行:" style="width:100%">
              <el-input v-model="form.openingBank" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item v-if="isShow" label="公司账号:" style="width:100%">
              <el-input v-model="form.companyAccount" :disabled="true"></el-input>
            </el-form-item>
          </div>
          <h4>发票快递信息</h4>
          <div class="invioice-form-wrap">
            <el-form-item label="收件人:" style="width:100%">
              <el-input v-model="form.recipient" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="手机号:" style="width:100%">
              <el-input v-model="form.mobileNo" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="邮编:" style="width:100%">
              <el-input v-model="form.emailAddress" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item v-if="isShow" label="区域:" style="width:100%">
              <el-input v-model="form.area" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item v-if="isShow" label="详细地址:" style="width:100%">
              <el-input v-model="form.detailAddress" :disabled="true"></el-input>
            </el-form-item>
          </div>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <a href="javascript:;" class="btn btn2" @click="dialogVisible1=false">取 消</a>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
// 请求
import { financeInvoiceGetByCompanyId } from "@/api/information/information";
export default {
  name: "",
  data() {
    return {
      // 查询表单数据
      formInline: {
        title: "",
        type: ""
      },
      // 表格数据
      tableData: [],
      // 查看信息
      form: {},
      // 查看 对话框
      dialogVisible1: false,
      // 总条数
      totalNum: 1,
      // 显示条数
      pageSize: 10,
      // 显示页数
      // 分页
      pageNum: 1,
      //
      isShow: false
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 获取发票抬头列表信息
    getList() {
      const data = {
        // this.$route.query.id
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        compId: this.$route.query.id,
        title: this.formInline.title,
        type: this.formInline.type
      };
      financeInvoiceGetByCompanyId(data).then(xhrData => {
        // console.log(xhrData);
        if (xhrData.code === 200) {
          this.tableData = xhrData.rows;
          this.tableData.forEach(item => {
            if (item.type == "1") {
              item.type = "增值税专票";
              item.dizi = item.area + item.detailAddress;
            } else if (item.type == "2") {
              item.type = "增值税普票";
              item.dizi = item.emailAddress;
            }
          });
          this.totalNum = xhrData.total;
        }
      });
    },
    // 查询
    query() {
      this.getList();
    },
    // 操作 查看
    see(row) {
      // console.log(row);
      // 打开 查看发票抬头信息 对话框
      this.dialogVisible1 = true;
      // 赋值到表单
      this.form = row;
      if (this.form.type == "增值税普票") {
        this.isShow = false;
      } else if (this.form.type == "增值税专票") {
        this.isShow = true;
      }
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
.invioice-form-wrap {
  padding: 0 50px;
  box-sizing: border-box;
}
.el-pagination {
  position: absolute;
  bottom: 40px;
  left: 20px;
  right: 0;
}
</style>
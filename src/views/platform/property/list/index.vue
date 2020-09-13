<template>
  <!-- 物业公司列表 -->
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
              ></el-input>
            </el-form-item>
            <el-form-item label="创建时间:">
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
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <!-- 列表 -->
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="index" label="序号" width="80"></el-table-column>
        <el-table-column show-overflow-tooltip  prop="name" label="公司名称" min-width="200px"></el-table-column>
        <el-table-column show-overflow-tooltip  prop="name" label="账号" min-width="200px"></el-table-column>
        <el-table-column show-overflow-tooltip  prop="contact" label="联系人" min-width="100px"></el-table-column>
        <el-table-column show-overflow-tooltip  prop="contact_no" label="联系电话" min-width="120px"></el-table-column>
        <el-table-column show-overflow-tooltip  prop="createTime" label="创建时间" min-width="180px"></el-table-column>
        <el-table-column show-overflow-tooltip  label="操作" min-width="200px">
          <!-- eslint-disable-next-line -->
          <template slot-scope="scope">
            <a
              href="javascript:;"
              style="margin-right:3px; color: #1890ff;"
              @click="details(scope.row)"
            >详情</a>
            |
            <a
              href="javascript:;"
              style="margin-right:3px; color: #1890ff;"
              @click="invoice(scope.row)"
            >发票抬头</a>
            |
            <a
              href="javascript:;"
              style="margin-right:3px; color: #1890ff;"
              v-if="scope.row.status == '0'"
              @click="normal(scope.row)"
            >正常</a>
            <a
              href="javascript:;"
              style="margin-right:3px; color: red;"
              v-else-if="scope.row.status == '1'"
              @click="prohibit(scope.row)"
            >禁用</a>
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
  </div>
</template>

<script>
import "../../../../assets/styles/publicStyle.css";
// insCompanyList
// 请求
import {
  propCompanyList,
  propCompanyUpdateStatusByCompId
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
        contact_no: "",
        // 时间
        createTime: ""
      },
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
      dialogVisible: false
    };
  },
  created() {
    this.getListData();
  },
  methods: {
    // 获取列表信息
    getListData() {
      let page;
      if (
        this.formInline.createTime == "" ||
        this.formInline.createTime == null
      ) {
        page = {
          name: this.formInline.name,
          contact_no: this.formInline.contact_no,
          pageSize: this.pageSize,
          pageNum: this.pageNum,
          startTime: "",
          endTime: ""
        };
      } else {
        page = {
          name: this.formInline.name,
          contact_no: this.formInline.contact_no,
          pageSize: this.pageSize,
          pageNum: this.pageNum,
          // // 开始时间
          startTime: this.formInline.createTime[0] + " 00:00:00",
          // 结束时间
          endTime: this.formInline.createTime[1] + " 23:59:59"
        };
      }
      propCompanyList(page).then(xhrData => {
        // console.log(xhrData);
        if (xhrData.code === 200) {
          this.tableData = xhrData.rows;
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
    // 操作 详情
    details(row) {
      // console.log(row);
      // 跳转页面
      this.$router.push({ path: "/details", query: { id: row.id } });
    },
    // 操作 发票抬头
    invoice(row) {
      // // 跳转页面
      this.$router.push({ path: "/invoice", query: { id: row.id } });
    },
    // 操作 正常按钮
    normal(row) {
      // console.log(row);
      this.$confirm("此操作将会受到影响, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const data = {
            compId: row.id,
            status: "1" // 状态 0正常 1禁用
          };
          // console.log(data);
          propCompanyUpdateStatusByCompId(data).then(xhrData => {
            // console.log(xhrData);
            if (xhrData.code === 200) {
              this.$message({
                type: "success",
                message: "禁用成功!"
              });
              // 更新列表
              this.getListData();
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
    // 操作 禁用按钮
    prohibit(row) {
      this.$confirm("此操作将会受到影响, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const data = {
            compId: row.id,
            status: "0" // 状态 0正常 1禁用
          };
          // console.log(data);
          propCompanyUpdateStatusByCompId(data).then(xhrData => {
            // console.log(xhrData);
            if (xhrData.code === 200) {
              this.$message({
                type: "success",
                message: "恢复成功!"
              });
              // 更新列表
              this.getListData();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    }
  }
};
</script>
<style>
.el-range-editor--medium .el-range-separator {
  width: 20px;
}
#seeDialog .el-dialog__header {
  background-color: #e6e8eb;
}
#seeDialog .el-dialog__title {
  font-size: 20px;
  font-weight: bold;
}
#seeDialog .el-dialog__footer {
  background-color: #e6e8eb;
}
#seeDialog .el-dialog__body {
  padding-left: 30px;
  padding-right: 30px;
  padding-bottom: 30px;
  box-sizing: border-box;
}
#seeDialog .el-dialog__footer {
  padding-bottom: 10px;
}
#seeDialog .btn {
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
#seeDialog .btn.btn1 {
  background: rgba(239, 130, 0, 1);
  border: 1px solid rgba(206, 112, 0, 1);
  color: #fff;
}
#seeDialog .btn.btn2 {
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
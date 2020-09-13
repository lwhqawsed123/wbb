<template>
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
          <el-form-item label="业主姓名:">
            <el-input @keyup.enter.native="query" v-model.trim="formInline.name" placeholder="请输入"></el-input>
          </el-form-item>
          <!-- <el-form-item label="项目名称:">
            <el-input
              @keyup.enter.native="query"
              v-model.trim="formInline.projectName"
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
          </el-form-item>-->
          <el-form-item>
            <el-button type="info" plain @click="query">查询</el-button>
            <el-button type="warning" plain @click="handleExport">导出</el-button>
            <el-button type="info" plain @click="revert">返回</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!-- 审核列表 -->
    <!-- <el-table :data="tableData" style="width: 100%"> -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="index" label="欠费业主姓名" width="50"></el-table-column>
      <el-table-column prop="projectName" show-overflow-tooltip label="联系方式" width="200px"></el-table-column>
      <el-table-column prop="name" show-overflow-tooltip label="欠费房屋详细地址" width="200px"></el-table-column>
      <el-table-column prop="idCard" show-overflow-tooltip label="欠费金额(不含滞纳金)" width="200px"></el-table-column>
      <el-table-column prop="phone" show-overflow-tooltip label="欠费时间段" width="200px"></el-table-column>
      <el-table-column prop="jobName" show-overflow-tooltip label="操作" width="200px">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            v-hasPermi="['info:invoice:edit']"
          >编辑</el-button>
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
</template>

<script>
import {
  insEmpApplyManageDetail,
  insEmpApplyManageDetailExport
} from "@/api/information/information";
export default {
  name: "insurance-added-list",
  props: ["obj"],
  data() {
    return {
      formInline: {
        name: "",
        projectName: ""
      },
      tableData: [],
      // 总条数
      totalNum: 1,
      // 显示条数
      pageSize: 10,
      // 显示页数
      // 分页
      pageNum: 1
    };
  },
  created() {
    console.log(this.obj);

    this.getList();
  },
  methods: {
    // 列表
    getList() {
      let page;
      // applyId 获取携带过来的当前id 或者 新增成功后返回的id
      if (
        this.formInline.createTime == "" ||
        this.formInline.createTime == null
      ) {
        page = {
          applyId: this.obj.id,
          pageSize: this.pageSize,
          pageNum: this.pageNum,
          name: this.formInline.name,
          projectName: this.formInline.projectName,
          beginTime: "",
          endTime: ""
        };
      } else {
        page = {
          applyId: this.obj.id,
          pageSize: this.pageSize,
          pageNum: this.pageNum,
          name: this.formInline.name,
          projectName: this.formInline.projectName,
          // // 开始时间
          beginTime: this.formInline.createTime[0] + " 00:00:00",
          // 结束时间
          endTime: this.formInline.createTime[1] + " 23:59:59"
        };
      }
      console.log(page);

      insEmpApplyManageDetail(page).then(xhrData => {
        console.log(xhrData);
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
.el-pagination {
  position: absolute;
  bottom: 40px;
  left: 20px;
  right: 0;
}
</style>
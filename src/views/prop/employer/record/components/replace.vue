<template>
  <!-- 雇主险批单 替换记录 -->
  <div class="publicStyle">
    <div class="publicStyle-conter">
      <el-row :gutter="20" class="record-top" style="margin-left: 0px; margin-right: 0px;">
        <el-col :span="24">
          <el-form id="companyForm" :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="保单号:">
              <el-input
                @keyup.enter.native="query"
                v-model.trim="formInline.name"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
            <el-form-item label="姓名:">
              <el-input
                @keyup.enter.native="query"
                v-model.trim="formInline.contact_no"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
            <el-form-item label="身份证号:">
              <el-input
                @keyup.enter.native="query"
                v-model.trim="formInline.contact_no"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
            <el-form-item label="操作时间:">
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
            <el-form-item>
              <el-button type="info" plain @click="revert">返回</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <!-- 列表 -->
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="name" label="保单号" min-width="14%" show-overflow-tooltip></el-table-column>
        <el-table-column prop="name" label="变更前姓名" min-width="10%" show-overflow-tooltip></el-table-column>
        <el-table-column prop="contact" label="变更前身份证" min-width="13%" show-overflow-tooltip></el-table-column>
        <el-table-column prop="contact_no" label="变更前手机号" min-width="10%" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" label="变更后姓名" min-width="10%" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" label="变更后身份证" min-width="13%" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" label="变更后手机号" min-width="10%" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" label="操作用户" min-width="10%" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" label="操作时间" min-width="10%" show-overflow-tooltip></el-table-column>
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
// insCompanyList
// 请求
import {
//   propCompanyList
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
      pageNum: 1
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
    //   propCompanyList(page).then(xhrData => {
    //     console.log(xhrData);
    //     if (xhrData.code === 200) {
    //       this.tableData = xhrData.rows;
    //       this.totalNum = xhrData.total;
    //     }
    //   });
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
    // 返回
    revert(){
        this.$emit("changePage", "LIST");
    }
  }
};
</script>
<style>
.el-range-editor--medium .el-range-separator {
  width: 20px;
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
.el-pagination {
  position: absolute;
  bottom: 40px;
  left: 20px;
  right: 0;
}
</style>
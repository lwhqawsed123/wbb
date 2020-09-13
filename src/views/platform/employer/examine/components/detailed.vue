<template>
  <!-- 雇主险批改-> 查看明细 -->
  <div>
    <el-row :gutter="20" class="record-top" style="margin-left: 0px; margin-right: 0px;">
      <el-col :span="24">
        <el-form id="companyForm" :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="物业公司">
            <el-input v-model="formInline.name"></el-input>
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
      <el-table-column type="index" label="序号" width="80"></el-table-column>
      <el-table-column prop="name" label="物业公司" min-width="30%"></el-table-column>
      <el-table-column prop="name" label="新增数量" min-width="30%"></el-table-column>
      <el-table-column prop="name" label="退保数量" min-width="30%"></el-table-column>
      <el-table-column prop="name" label="操作" min-width="10%">
        <template slot-scope="scope">
          <a
            href="javascript:;"
            style="margin-right:3px; color: #1890ff;"
            @click="examine(scope.ros)"
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
  </div>
</template>

<script>
export default {
  name: "extend",
  data() {
    return {
      formInline: {},
      // 保存保单日期
      options: ["2020-2-1", "2020-2-2"],
      // 列表数据
      tableData: [
        {
          name: "213"
        }
      ],
      // 总条数
      totalNum: 1,
      // 显示条数
      pageSize: 10,
      // 显示页数
      // 分页
      pageNum: 1
    };
  },
  methods: {
    // 查询
    query() {},
    // 返回
    revert() {
      this.$emit("changePage", "LIST");
    },
    // 操作 审核
    examine(row) {
      this.$emit("changePage", "EXAMINE");
    },
    //在改变每页显示的条数
    handleSizeChange(val) {
      // 注意：在改变每页显示的条数时，要将页码显示到第一页
      this.pageNum = 1;
      // 改变每页显示的条数
      this.pageSize = val;
      // 更新列表
    },
    // 页数
    handleCurrentChange(val) {
      // 改变默认的页数
      this.pageNum = val;
      // 更新列表
    }
  }
};
</script>

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
</style>
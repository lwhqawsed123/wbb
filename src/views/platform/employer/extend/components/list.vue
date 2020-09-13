<template>
  <!-- 雇主险扩展24小时 -->
  <div>
    <el-row :gutter="20" class="record-top" style="margin-left: 0px; margin-right: 0px;">
      <el-col :span="24">
        <el-form id="companyForm" :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="保单日期:">
            <el-select clearable v-model="formInline.value" placeholder="请选择">
              <el-option v-for="(item,index) in options" :key="index" :label="item" :value="item"></el-option>
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
      <el-table-column type="index" label="序号" width="80"></el-table-column>
      <el-table-column prop="name" label="批改日期" min-width="20%"></el-table-column>
      <el-table-column prop="name" label="投保公司" min-width="20%"></el-table-column>
      <el-table-column prop="name" label="承保公司" min-width="20%"></el-table-column>
      <el-table-column prop="name" label="新增人数" min-width="15%"></el-table-column>
      <el-table-column prop="name" label="退保人数" min-width="15%"></el-table-column>
      <el-table-column prop="name" label="操作" min-width="10%">
        <template slot-scope="scope">
          <a
            href="javascript:;"
            style="margin-right:3px; color: #1890ff;"
            @click="declare(scope.ros)"
          >申报</a>
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
    // 操作 申报按钮
    declare(row) {
        this.$emit('changePage', 'DECLARE')
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
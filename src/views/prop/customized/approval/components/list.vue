<template>
  <div>
    <el-row :gutter="20" class="record-top" style="margin-left: 0px; margin-right: 0px;">
      <el-col :span="24">
        <el-form :inline="true" @submit.native.prevent :model="formInline" class="demo-form-inline">
          <el-form-item label="批单日期:">
            <el-date-picker
              value-format="yyyy-M"
              v-model="formInline.time"
              type="month"
              placeholder="请选择日期"
              @change="query"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="批单号:">
            <el-input @keyup.enter.native="query" v-model.trim="formInline.policyNo" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="info" plain @click="query">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!-- 列表 -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="index" label="序号" width="80px"></el-table-column>
      <el-table-column prop="reviseTime" show-overflow-tooltip label="批改日期" width="120px">
          <template slot-scope="scope">
              {{scope.row.reviseYear}}-{{scope.row.reviseMonth}}
          </template>
      </el-table-column>
      <el-table-column prop="policyNo" show-overflow-tooltip label="批单号" min-width="200px"></el-table-column>
      <el-table-column prop="applyPolicyNo" show-overflow-tooltip label="保单号" min-width="200px"></el-table-column>
      <el-table-column prop="newNum" show-overflow-tooltip label="新增人数" min-width="90px"></el-table-column>
      <el-table-column prop="returnNum" show-overflow-tooltip label="退保人数" min-width="90px"></el-table-column>
      <el-table-column prop="type" show-overflow-tooltip label="结算类型" min-width="100px"></el-table-column>
      <el-table-column prop="amount" show-overflow-tooltip label="结算金额" min-width="100px"></el-table-column>
      <el-table-column prop="state" show-overflow-tooltip label="申报状态" min-width="100px"></el-table-column>
      <el-table-column label="操作" min-width="150px">
        <template slot-scope="scope">
          <el-button v-if="scope.row.state != '待申报'" size="mini" type="text" icon="el-icon-view" @click="see(scope.row)">查看</el-button>
          <el-button v-if="scope.row.state == '待申报'" size="mini" type="text" icon="el-icon-view" @click="declare(scope.row)">申报</el-button>
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
// insEmpCustomReviseList
import { insEmpCustomReviseList } from "@/api/information/information";
export default {
  name: "approval-list",
  data() {
    return {
      formInline: {
          policyNo:null,
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
    this.getList();
  },
  methods: {
    getList() {
      const page = {
        reviseMonth:this.formInline.time == undefined ? null : this.formInline.time.split("-")[1],
        reviseYear:this.formInline.time == undefined ? null : this.formInline.time.split("-")[0],
        policyNo:this.formInline.policyNo,
        pageSize: this.pageSize,
        pageNum: this.pageNum
      };
      // console.log(page);
      insEmpCustomReviseList(page).then(xhrData => {
        // console.log(xhrData, "列表");
        if (xhrData.code === 200) {
          this.tableData = xhrData.rows;
          this.totalNum = xhrData.total;
          this.tableData.forEach(item => {
            if (item.state == "0") {
                item.state = '待申报'
            } else if (item.state == "1") {
                item.state = '申报中'
            }else if(item.state == '2'){
                item.state = '申报成功'
            }
            if (item.type == "0") {
                item.type = '支出'
            } else if (item.type == "1") {
                item.type = '收入'
            }
          });
        }
      });
    },
    // 查询
    query() {
      this.getList();
    },
    // 查看
    see(row) {
      const obj = {
        id: row.id
      };
      this.$emit("changePage", "SEE", obj);
    },
    // 申报
    declare(row) {
      // console.log(row);
      const obj = {
        id: row.id
      };
      this.$emit("changePage", "DECLARE", obj);
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
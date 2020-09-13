<template>
  <div>
    <el-row :gutter="20" class="record-top" style="margin-left: 0px; margin-right: 0px;">
      <el-col :span="24">
        <el-form
          id="companyForm"
          :inline="true"
          @submit.native.prevent
          :model="formInline"
          class="demo-form-inline"
        >
          <!-- <el-form-item label="雇员姓名:">
            <el-input
              @keyup.enter.native="query"
              v-model.trim="formInline.userName"
              placeholder="请输入"
            ></el-input>
          </el-form-item>-->
          <el-form-item label="审核状态:">
            <el-select @change="query" clearable v-model="formInline.state" placeholder="请选择">
              <el-option label="申报中" value="0"></el-option>
              <el-option label="批改成功" value="1"></el-option>
            </el-select>
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
            <el-button v-if="obj.state =='在保'" type="primary" plain @click="addedDeclare" v-hasPermi="['ins:emp:custom:manage:new:add']">新增</el-button>
            <el-button type="info" plain @click="revert">返回</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!-- 审核列表 -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="index" label="序号" min-width="50px"></el-table-column>
      <el-table-column prop="orderNo" show-overflow-tooltip label="订单号" min-width="200px"></el-table-column>
      <el-table-column prop="totalNum" show-overflow-tooltip label="新增人数" min-width="100px"></el-table-column>
      <el-table-column prop="state" show-overflow-tooltip label="审核状态" min-width="150px"></el-table-column>
      <el-table-column prop="createTime" show-overflow-tooltip label="创建时间" min-width="200px"></el-table-column>
      <el-table-column label="操作" min-width="200px">
        <template slot-scope="scope">
          <div>
            <a
              href="javascript:;"
              style="margin-right:3px; color: #1890ff;"
              @click="see(scope.row)"
              v-hasPermi="['ins:emp:custom:manage:new:detail:list']"
            >查看</a>
          </div>
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
    <el-dialog
      id="added-seeDialog"
      title="查看"
      class="seeDialog"
      :visible.sync="dialogVisible"
      width="1000px"
    >
      <el-table :data="dialogData" style="width: 100%;padding-bottom:20px">
        <el-table-column type="index" label="序号" min-width="50px"></el-table-column>
        <el-table-column prop="compProjectName" show-overflow-tooltip label="所属项目" min-width="180px"></el-table-column>
        <el-table-column prop="name" show-overflow-tooltip label="被保险人" min-width="80px"></el-table-column>
        <el-table-column prop="idCard" show-overflow-tooltip label="身份证号" min-width="170px"></el-table-column>
        <el-table-column prop="phone" show-overflow-tooltip label="手机号" min-width="120px"></el-table-column>
        <el-table-column
          prop="isSocialSecurity"
          show-overflow-tooltip
          label="有/无社保"
          min-width="80px"
        ></el-table-column>
        <el-table-column prop="startTime" show-overflow-tooltip label="投保日期" min-width="180px"></el-table-column>
        <el-table-column prop="endTime" show-overflow-tooltip label="投保结束日期" min-width="180px"></el-table-column>
        <el-table-column prop="premium" show-overflow-tooltip label="保费" min-width="100px"></el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange2"
        @current-change="handleCurrentChange2"
        :current-page="pageNum2"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="pageSize2"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNum2"
      ></el-pagination>
      <span slot="footer" class="dialog-footer">
        <a href="javascript:;" class="btn btn2" @click="dialogVisible=false">取 消</a>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// insEmpCustomApplyManageNewList
import {
  insEmpCustomApplyManageNewList,
  insEmpCustomApplyManageNewDetail
} from "@/api/information/information";
export default {
  name: "insurance-added-list",
  props: ["obj2", "id",'obj'],
  data() {
    return {
      dialogVisible: false,
      formInline: {},
      tableData: [{ certNo: "123" }],
      // 总条数
      totalNum: 1,
      // 显示条数
      pageSize: 10,
      // 显示页数
      // 分页
      pageNum: 1,
      // 总条数
      totalNum2: 1,
      // 显示条数
      pageSize2: 10,
      // 显示页数
      // 分页
      pageNum2: 1,
      dialogData: [],
      // 保留查看的id
      seeId:'',
    };
  },
  created() {
    // console.log(this.obj2, this.id);
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
          applyId: this.id,
          pageSize: this.pageSize,
          pageNum: this.pageNum,
          state:
            this.formInline.state == ""
              ? (this.formInline.state = null)
              : this.formInline.state,
          beginTime: "",
          endTime: ""
        };
      } else {
        page = {
          applyId: this.id,
          pageSize: this.pageSize,
          pageNum: this.pageNum,
          state:
            this.formInline.state == ""
              ? (this.formInline.state = null)
              : this.formInline.state,
          // 开始时间
          beginTime: this.formInline.createTime[0] + " 00:00:00",
          // // 结束时间
          endTime: this.formInline.createTime[1] + " 23:59:59"
        };
      }
      // console.log(page);

      insEmpCustomApplyManageNewList(page).then(xhrData => {
        // console.log(xhrData);
        if (xhrData.code === 200) {
          this.tableData = xhrData.rows;
          this.totalNum = xhrData.total;
          this.tableData.forEach(item => {
            if (item.state == "0") {
              item.state = "申报中";
            } else if (item.state == "1") {
              item.state = "批改成功";
            }
          });
        }
      });
    },
    // 查询
    query() {
      this.getList();
    },
    // 返回
    revert() {
      this.$emit("changePage2", "REVERT");
    },
    // 新增
    addedDeclare() {
      this.obj2.applyId = this.id;
      this.$emit("changePage2", "ADD", this.obj2);
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
    },
    //在改变每页显示的条数
    handleSizeChange2(val) {
      // 注意：在改变每页显示的条数时，要将页码显示到第一页
      this.pageNum2 = 1;
      // 改变每页显示的条数
      this.pageSize2 = val;
      // 更新列表
      this.getSeeList()
    },
    // 页数
    handleCurrentChange2(val) {
      // 改变默认的页数
      this.pageNum2 = val;
      // 更新列表
      this.getSeeList()
    },
    // 查看
    see(row) {
      this.dialogVisible = true;
      this.seeId = row.id
      this.getSeeList()
    },
    // 查看当前详情
    getSeeList(){
      const page = {
          pageSize: this.pageSize2,
          pageNum: this.pageNum2,
        }
      insEmpCustomApplyManageNewDetail(this.seeId,page).then(xhrData => {
        // console.log(xhrData);
        if (xhrData.code === 200) {
          this.dialogData = xhrData.rows;
          this.totalNum2 = xhrData.total
          this.dialogData.forEach(item => {
            if (item.isSocialSecurity == "0") {
              item.isSocialSecurity = "无";
            } else if (item.isSocialSecurity == "1") {
              item.isSocialSecurity = "有";
            }
          });
        }
      });
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
  padding-bottom: 50px;
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
 .el-table--scrollable-x .el-table__body-wrapper{
    min-height: calc(25vh);
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
#added-seeDialog {
  // padding-bottom: 30px;
  .el-pagination {
    position: absolute;
    bottom: 60px;
  left: 20px;
  right: 0;
  }
}
</style>
<template>
  <!-- 查看 列表 -->
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
          <el-form-item label="项目类型:">
            <el-select @change="query" clearable v-model="formInline.type" placeholder="请选择">
              <!-- <el-option label="审核通过" value="1"></el-option> -->
              <el-option label="居住类型" value="0"></el-option>
              <el-option label="非居住类型" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="项目名称:">
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
          </el-form-item>
          <el-form-item>
            <el-button type="info" plain @click="query">查询</el-button>
            <el-button type="warning" plain @click="handleExport" v-hasPermi="['ins:prop:record:detail:export']">导出</el-button>
            <el-button type="info" plain @click="revert">返回</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!-- 审核列表 -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column prop="projectName" show-overflow-tooltip label="项目名称" width="200px"></el-table-column>
      <el-table-column prop="type" show-overflow-tooltip label="项目类型" width="200px"></el-table-column>
      <el-table-column prop="insureNum" show-overflow-tooltip label="投保份数" width="100px"></el-table-column>
      <el-table-column prop="areaSize" show-overflow-tooltip label="占地面积" width="100px"></el-table-column>
      <el-table-column prop="address" show-overflow-tooltip label="项目地址" width="220px"></el-table-column>
      <el-table-column prop="swimmingPool" show-overflow-tooltip label="有/无游泳池" width="100px"></el-table-column>
      <el-table-column prop="startTime" show-overflow-tooltip label="投保起始日期" width="200px"></el-table-column>
      <el-table-column prop="endTime" show-overflow-tooltip label="投保结束日期" width="200px"></el-table-column>
      <el-table-column prop="createTime" show-overflow-tooltip label="创建时间" min-width="200px"></el-table-column>
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
// 请求
import {
  insPropGetInsPubApplyDetailList,
  insPropExportInsPubDetailApply
} from "@/api/information/information";
export default {
  name: "",
  props: ["idData"],
  data() {
    return {
      // 查询表单数据保存
      formInline: {
        projectName: "",
        type: "",
        createTime: ""
      },
      // 审核列表数据
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
    // console.log(this.idData);
  },
  methods: {
    // 获取家财豆使用列表
    getList() {
      let page;
      if (
        this.formInline.createTime == "" ||
        this.formInline.createTime == null
      ) {
        page = {
          applyId: this.idData.id,
          pageSize: this.pageSize,
          pageNum: this.pageNum,
          type: this.formInline.type == "" ? null : this.formInline.type,
          projectName: this.formInline.projectName,
          beginTime: "",
          endTime: ""
        };
      } else {
        page = {
          applyId: this.idData.id,
          pageSize: this.pageSize,
          pageNum: this.pageNum,
          type: this.formInline.type == "" ? null : this.formInline.type,
          projectName: this.formInline.projectName,
          // 开始时间
          beginTime: this.formInline.createTime[0] + " 00:00:00",
          // 结束时间
          endTime: this.formInline.createTime[1] + " 23:59:59"
        };
      }
      // console.log(page);

      insPropGetInsPubApplyDetailList(page).then(xhrData => {
        // console.log(xhrData);
        if (xhrData.code === 200) {
          this.tableData = xhrData.rows;
          this.tableData.forEach(item => {
            if (item.swimmingPool == "0") {
              item.swimmingPool = "有";
            } else if (item.swimmingPool == "1") {
              item.swimmingPool = "无";
            }
            if (item.type == "0") {
              item.type = "居住类型";
            } else if (item.type == "1") {
              item.type = "非居住类型";
            }
            item.startTime = item.startTime.split(" ")[0];
            item.endTime = item.endTime.split(" ")[0];
            item.createTime = item.createTime.split(" ")[0];
          });
        }
      });
    },
    // 查询
    query() {
      this.getList();
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
    },
    // 导出按钮操作
    handleExport() {
      const formInline = this.formInline;
      if (formInline.type == "") {
        formInline.type = null;
      }
      // console.log(formInline);
      formInline.applyId = this.idData.id;
      this.$confirm("是否确认导出数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return insPropExportInsPubDetailApply(formInline);
        })
        .then(response => {
          this.download(response.msg);
        })
        .catch(function() {});
    },
    // 返回
    revert(){
      this.$emit("changePage", "LIST");
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
<style>
.el-range-editor--medium .el-range-separator {
  width: 20px;
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
<template>
  <!-- 家财豆使用记录 -->
  <div class="publicStyle">
    <div class="publicStyle-conter">
      <el-row :gutter="20" class="record-top" style="margin-left: 0px; margin-right: 0px;">
        <el-col :span="24">
          <el-form
            id="companyForm"
            :inline="true"
            @submit.native.prevent
            :model="formInline"
            class="demo-form-inline"
          >
            <el-form-item label="项目名称:">
              <el-select
                @change="query"
                clearable
                v-model="formInline.projectName"
                placeholder="请选择"
              >
                <!-- <el-option label="审核通过" value="1"></el-option> -->
                <el-option
                  v-for="(item,index) in allProject"
                  :key="index"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="使用人:">
              <el-input
                @keyup.enter.native="query"
                v-model.trim="formInline.userName"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
            <el-form-item label="申请时间:">
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
              <el-button type="info" plain @click="query" >查询</el-button>
              <el-button type="warning" plain @click="handleExport" v-hasPermi="['bean:use:export']">导出</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <!-- 审核列表 -->
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="index" label="序号" width="80"></el-table-column>
        <el-table-column prop="projectName" show-overflow-tooltip label="项目名称" min-width="150px"></el-table-column>
        <el-table-column prop="number" show-overflow-tooltip label="使用数量" min-width="100px"></el-table-column>
        <el-table-column prop="type" show-overflow-tooltip label="使用用途" min-width="120px"></el-table-column>
        <el-table-column prop="userName" show-overflow-tooltip label="使用人" min-width="100px"></el-table-column>
        <el-table-column prop="phoneNumber" show-overflow-tooltip label="使用人联系方式" min-width="120px"></el-table-column>
        <el-table-column prop="createTime" show-overflow-tooltip label="使用时间" min-width="200px"></el-table-column>
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

// 请求
import {
  financeBeanGetUseRecord,
  financeBeanExportUseRecord
} from "@/api/information/information";
export default {
  name: "",
  data() {
    return {
      // 查询表单数据保存
      formInline: {
        projectName: "",
        userName: "",
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
      pageNum: 1,
      // 控制操作为查看情况
      isSee: true,
      // 保存所有项目名称
      allProject: []
    };
  },
  created() {
    this.getBeanList();
    this.getAllProject();
  },
  methods: {
    // 获取家财豆使用列表
    getBeanList() {
      let page;
      if (
        this.formInline.createTime == "" ||
        this.formInline.createTime == null
      ) {
        page = {
          projectName: this.formInline.projectName,
          userName: this.formInline.userName,
          pageSize: this.pageSize,
          pageNum: this.pageNum,
          beginTime: "",
          endTime: ""
        };
      } else {
        page = {
          projectName: this.formInline.projectName,
          userName: this.formInline.userName,
          pageSize: this.pageSize,
          pageNum: this.pageNum,
          // // 开始时间
          beginTime: this.formInline.createTime[0] + " 00:00:00",
          // 结束时间
          endTime: this.formInline.createTime[1] + " 23:59:59"
        };
      }
      financeBeanGetUseRecord(page).then(xhrData => {
        if (xhrData.code === 200) {
          this.tableData = xhrData.rows;
          this.tableData.forEach(item => {
            if (item.type == "1") {
              item.type = "购买家财险";
            }
          });
          this.totalNum = xhrData.total;
        }
      });
    },
    // 获取家财豆列表中全部项目名称
    getAllProject() {
      const page = {
        pageNum: 1,
        pageSize: 999999
      };
      financeBeanGetUseRecord(page).then(xhrData => {
        if (xhrData.code === 200) {
          // this.allProject = xhrData.rows
          var obj = {};
          // 去除重复项目名称
          for (let i = 0; i < xhrData.rows.length; i++) {
            if (!obj[xhrData.rows[i].projectName]) {
              this.allProject.push(xhrData.rows[i].projectName);
              obj[xhrData.rows[i].projectName] = true;
            }
          }
        }
      });
    },
    // 查询
    query() {
      this.getBeanList();
    },
    // 导出按钮操作
    handleExport() {
      const formInline = {}
      //  = this.formInline;
      formInline.projectName = this.formInline.projectName
      formInline.userName = this.formInline.userName

      this.$confirm("是否确认导出数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return financeBeanExportUseRecord(formInline);
        })
        .then(response => {
          this.download(response.msg);
        })
        .catch(function() {});
    },
    //在改变每页显示的条数
    handleSizeChange(val) {
      // 注意：在改变每页显示的条数时，要将页码显示到第一页
      this.pageNum = 1;
      // 改变每页显示的条数
      this.pageSize = val;
      // 更新列表
      this.getBeanList();
    },
    // 页数
    handleCurrentChange(val) {
      // 改变默认的页数
      this.pageNum = val;
      // 更新列表
      this.getBeanList();
    }
  }
};
</script>
<style>
.el-range-editor--medium .el-range-separator {
  width: 20px;
}
</style>
<style lang='scss' scoped>
@import "../../../../assets/styles/publicStyle.css";
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
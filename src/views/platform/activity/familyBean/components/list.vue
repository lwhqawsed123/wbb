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
          <el-form-item label="活动名称:">
            <el-input @keyup.enter.native="query" v-model.trim="formInline.name" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="活动类型:">
            <el-select @change="query" clearable v-model="formInline.type" placeholder="请选择">
              <el-option label="充值赠送" value="1"></el-option>
              <el-option label="拉新推广" value="2"></el-option>
              <el-option label="促销活动" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="活动状态:">
            <el-select @change="query" clearable v-model="formInline.status" placeholder="请选择">
              <el-option label="未开始" value="1"></el-option>
              <el-option label="进行中" value="2"></el-option>
              <el-option label="已结束" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="活动时间:">
            <el-date-picker
              @change="query"
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
            <el-button type="primary" plain @click="addedDeclare">添加活动</el-button>
            <!-- <el-button type="info" plain @click="revert">返回</el-button> -->
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!-- 审核列表 -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="index" label="序号" width="80"></el-table-column>
      <el-table-column prop="name" show-overflow-tooltip label="活动名称" min-width="160px"></el-table-column>
      <el-table-column prop="type" show-overflow-tooltip label="活动类型" min-width="140px">
        <template slot-scope="scope">{{handleType(scope.row.type)}}</template>
      </el-table-column>
      <el-table-column prop="fortune_bean" show-overflow-tooltip label="赠送数量" min-width="100px"></el-table-column>
      <!-- <el-table-column prop="premium" show-overflow-tooltip label="赠送区域" width="200px">
        <template slot-scope="scope">{{scope.row.region_name == '' ? '全部' : scope.row.region_name}}</template>
      </el-table-column> -->
      <el-table-column prop="premium" show-overflow-tooltip label="活动时间" min-width="200px">
        <template
          slot-scope="scope"
        >{{scope.row.activity_start_date.split(' ')[0] + '至' + scope.row.activity_end_date.split(' ')[0]}}</template>
      </el-table-column>
      <el-table-column prop="create_user_name" show-overflow-tooltip label="创建人" min-width="100px"></el-table-column>
      <el-table-column prop="create_user_date" show-overflow-tooltip label="创建时间" min-width="120px"></el-table-column>
      <el-table-column show-overflow-tooltip label="活动状态" min-width="100px">
        <template slot-scope="scope">{{handleState(scope.row.status)}}</template>
      </el-table-column>
      <el-table-column label="操作" min-width="150px">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-view" @click="see(scope.row)" v-if="scope.row.status == '2' || scope.row.status == '3'">查看</el-button>
          <el-button type="text" icon="el-icon-edit" size="mini" v-if="scope.row.status == '1'" @click="modify(scope.row) ">修改</el-button>
          <!-- <div>
            <a
              href="javascript:;"
              style="margin-right:3px; color: #1890ff;"
              @click="see(scope.row)"
            >查看</a>
          </div>-->
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
import { systemActivityList } from "@/api/information/information";
export default {
  name: "familyBean-list",
  data() {
    return {
      formInline: {},
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
      // const page = {
      //   pageSize: this.pageSize,
      //   pageNum: this.pageNum,
      //   name:this.formInline.name,
      //   type:this.formInline.type == '' ? null : this.formInline.type,
      //   status:this.formInline.status == '' ? null : this.formInline.status,
      // };
      // console.log(page);
      let page;
      // applyId 获取携带过来的当前id 或者 新增成功后返回的id
      if (
        this.formInline.createTime == "" ||
        this.formInline.createTime == null
      ) {
        page = {
          pageSize: this.pageSize,
          pageNum: this.pageNum,
          name: this.formInline.name,
          type: this.formInline.type == "" ? null : this.formInline.type,
          status: this.formInline.status == "" ? null : this.formInline.status,
          activity_start_date: "",
          activity_end_date: ""
        };
      } else {
        page = {
          pageSize: this.pageSize,
          pageNum: this.pageNum,
          name: this.formInline.name,
          type: this.formInline.type == "" ? null : this.formInline.type,
          status: this.formInline.status == "" ? null : this.formInline.status,
          // 开始时间
          activity_start_date: this.formInline.createTime[0] + " 00:00:00",
          // 结束时间
          activity_end_date: this.formInline.createTime[1] + " 23:59:59"
        };
      }

      systemActivityList(page).then(xhrData => {
        // console.log(xhrData);
        if (xhrData.code === 200) {
          this.tableData = xhrData.rows;
          this.totalNum = xhrData.total;
        }
      });
    },
    query() {
      this.getList();
    },
    // 添加活动
    addedDeclare() {
      this.$emit("changePage", "ADD");
    },
    // 查看
    see(row) {
      // console.log(row);
      const obj = {
        id:row.id
      }
      // console.log(obj);
      
      this.$emit("changePage","SEE",obj);
    },
    // 修改
    modify(row){
      // console.log(row);
      const obj = {
        id:row.id
      }
       this.$emit("changePage", "MODIFY",obj);
    },
    handleState(status) {
      if (status == "1") {
        return (status = "未开始");
      } else if (status == "2") {
        return (status = "进行中");
      } else if (status == "3") {
        return (status = "已结束");
      }
    },
    handleType(type) {
      if (type == "1") {
        return (type = "充值赠送");
      } else if (type == "2") {
        return (type = "拉新推广");
      } else if (type == "3") {
        return (type = "促销活动");
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

<style lang="scss" scopde>
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
</style>
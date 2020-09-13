<template>
  <div class="publicStyle">
    <div class="publicStyle-conter">
      <!-- <div class="app-container"> -->
      <!-- <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
          <el-form-item label="赠送类型" prop="give_type">
            <el-select @change="handleQuery" v-model="queryParams.give_type" placeholder="请选择赠送类型" clearable size="small">
              <el-option label="活动赠送" value="1"></el-option>
              <el-option label="直接赠送" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="活动类型" prop="activity_type">
            <el-select
             @change="handleQuery"
              v-model="queryParams.activity_type"
              placeholder="请选择活动赠送类型"
              clearable
              size="small"
            >
              <el-option label="免费赠送" value="0"></el-option>
              <el-option label="充值赠送" value="1"></el-option>
              <el-option label="拉新推广" value="2"></el-option>
              <el-option label="促销活动" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
      </el-form>-->

      <!-- <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="handleDelete"
              v-hasPermi="['system:record:remove']"
            >删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
              v-hasPermi="['system:record:export']"
            >导出</el-button>
          </el-col>
      </el-row>-->
      <el-row :gutter="20" class="record-top" style="margin-left: 0px; margin-right: 0px;">
        <el-col :span="24">
          <el-form
            id="companyForm"
            :inline="true"
            @submit.native.prevent
            :model="queryParams"
            class="demo-form-inline"
          >
            <el-form-item label="活动名称:">
              <el-input
                @keyup.enter.native="handleQuery"
                v-model.trim="queryParams.activity_name"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
            <el-form-item label="物业公司名称:">
              <el-input
                @keyup.enter.native="handleQuery"
                v-model.trim="queryParams.prop_name"
                placeholder="请输入"
              ></el-input>
            </el-form-item>

            <el-form-item label="活动时间:">
              <el-date-picker
                @change="handleQuery"
                value-format="yyyy-MM-dd"
                v-model="queryParams.createTimeName"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="info" plain @click="handleQuery">查询</el-button>
              <!-- <el-button type="info" plain @click="revert">返回</el-button> -->
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>

      <el-table v-loading="loading" :data="recordList" @selection-change="handleSelectionChange">
        <el-table-column type="index" label="序号" width="80" align="center" />
        <el-table-column show-overflow-tooltip label="活动名称" prop="activity_name" min-width="120px">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          label="活动类型"
          prop="activity_type"
          min-width="120px"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.activity_type === 0">免费赠送</span>
            <span v-if="scope.row.activity_type === 1">充值赠送</span>
            <span v-if="scope.row.activity_type === 2">拉新推广</span>
            <span v-if="scope.row.activity_type === 3">促销活动</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="物业公司名称" prop="prop_name" min-width="200px" />
        <el-table-column show-overflow-tooltip label="活动时间" prop="create_date" min-width="180px">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.create_date) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          label="赠送金额"
          prop="fortune_bean"
          min-width="120px"
        />
        <el-table-column show-overflow-tooltip label="创建时间" prop="create_date" min-width="200px" />
      </el-table>
      <!-- <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
      />-->
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryParams.pageNum"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="queryParams.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>

      <!-- 添加或修改【请填写功能名称】对话框 -->
      <el-dialog :title="title" :visible.sync="open" width="500px">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-form-item label="赠送类型">
            <el-select v-model="form.give_type" placeholder="请选择赠送类型">
              <el-option label="请选择字典生成" value />
            </el-select>
          </el-form-item>
          <el-form-item label="活动赠送类型">
            <el-select
              v-model="form.activity_type"
              placeholder="请选择活动赠送类型(0.直接赠送为、1.充值赠送、2.拉新推广、3.促销活动)"
            >
              <el-option label="请选择字典生成" value />
            </el-select>
          </el-form-item>
          <el-form-item label="赠送公司ID" prop="prop_id">
            <el-input v-model="form.prop_id" placeholder="请输入赠送公司ID" />
          </el-form-item>
          <el-form-item label="赠送时间" prop="create_date">
            <el-date-picker
              clearable
              size="small"
              style="width: 200px"
              v-model="form.create_date"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择赠送时间"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="赠送家财豆数量" prop="fortune_bean">
            <el-input v-model="form.fortune_bean" placeholder="请输入赠送家财豆数量" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </el-dialog>
      <!-- </div> -->
    </div>
  </div>
</template>

<script>
import {
  listRecord,
  getRecord,
  delRecord,
  addRecord,
  updateRecord,
  exportRecord
} from "@/api/system/record";

export default {
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 【请填写功能名称】表格数据
      recordList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        activity_name:undefined,
        prop_name:undefined,
        give_type: undefined,
        activity_type: undefined,
        prop_id: undefined,
        create_date: undefined,
        fortune_bean: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询【请填写功能名称】列表 */
    getList() {
      this.loading = true;
      
      if(this.queryParams.createTimeName == undefined){
        this.queryParams.startDate = undefined
        this.queryParams.endDate = undefined
      }else{
        this.queryParams.startDate = this.queryParams.createTimeName[0] + ' 00:00:00'
        this.queryParams.endDate = this.queryParams.createTimeName[1] + ' 23:59:59'
      }
      console.log(this.queryParams);
      listRecord(this.queryParams).then(response => {
        this.recordList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        give_type: undefined,
        activity_type: undefined,
        prop_id: undefined,
        create_date: undefined,
        fortune_bean: undefined
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加【请填写功能名称】";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getRecord(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改【请填写功能名称】";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateRecord(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addRecord(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm("是否确认删除此条家财豆记录?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return delRecord(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有家财豆赠送记录数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return exportRecord(queryParams);
        })
        .then(response => {
          this.download(response.msg);
        })
        .catch(function() {});
    },
    //在改变每页显示的条数
    handleSizeChange(val) {
      // 注意：在改变每页显示的条数时，要将页码显示到第一页
      this.queryParams.pageNum = 1;
      // 改变每页显示的条数
      this.queryParams.pageSize = val;
      // 更新列表
      this.getList();
    },
    // 页数
    handleCurrentChange(val) {
      // 改变默认的页数
      this.queryParams.pageNum = val;
      // 更新列表
      this.getList();
    },
  }
};
</script>
<style lang="scss" scopde>
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
</style>

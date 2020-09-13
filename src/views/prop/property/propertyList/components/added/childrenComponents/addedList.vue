<template>
  <!-- 新增 列表 -->
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
          <!-- <el-form-item label="项目名称:">
            <el-input
              @keyup.enter.native="query"
              v-model.trim="formInline.userName"
              placeholder="请输入"
            ></el-input>
          </el-form-item> -->
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
            <el-button v-if="idData.state == '在保'" type="primary" plain @click="addedDeclare" v-hasPermi="['ins:prop:new:add']">新增</el-button>
            <el-button type="info" plain @click="revert">返回</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!-- 审核列表 -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column prop="certNo" show-overflow-tooltip label="凭证号" min-width="200px"></el-table-column>
      <el-table-column prop="newNum" show-overflow-tooltip label="新增项目" min-width="80px"></el-table-column>
      <el-table-column prop="insureNum" show-overflow-tooltip label="投保份数" min-width="80px"></el-table-column>
      <el-table-column prop="totalPremium" show-overflow-tooltip label="应付保费" min-width="100px"></el-table-column>
      <el-table-column prop="state" show-overflow-tooltip label="审核状态" min-width="100px"></el-table-column>
      <el-table-column prop="createTime" show-overflow-tooltip label="创建时间" min-width="170px"></el-table-column>
      <el-table-column label="操作" min-width="150px">
        <template slot-scope="scope">
          <div>
            <a
              href="javascript:;"
              style="margin-right:3px; color: #1890ff;"
              @click="see(scope.row)"
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
      :title="dialogText"
      id="seeDialog"
      class="seeDialog"
      :visible.sync="dialogVisible"
      @close="closeDialog"
      width="1000px"
    >
      <el-table :data="dialogData" style="width: 100%;padding-bottom:30px">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="projectName" show-overflow-tooltip label="项目名称" width="150px"></el-table-column>
        <el-table-column prop="address" show-overflow-tooltip label="项目地址" width="150px"></el-table-column>
        <el-table-column prop="type" show-overflow-tooltip label="小区类型" width="100px">
         <template slot-scope="scope">
            {{handleType(scope.row.type)}}
         </template>
        </el-table-column>
        <el-table-column prop="insureNum" show-overflow-tooltip label="投保份数" width="80px"></el-table-column>
        <el-table-column prop="areaSize" show-overflow-tooltip label="占地面积" width="80px"></el-table-column>
        <el-table-column prop="swimmingPool" show-overflow-tooltip label="是否有游泳池" width="80px">
          <template slot-scope="scope">
            {{handleSwimmingPool(scope.row.swimmingPool)}}
          </template>
        </el-table-column>
        <el-table-column prop="startTime" show-overflow-tooltip label="投保开始日期" width="120px">
          <template slot-scope="scope">
            {{scope.row.startTime.split(' ')[0]}}
          </template>
        </el-table-column>
        <el-table-column prop="endTime" show-overflow-tooltip label="投保结束日期" min-width="120px">
           <template slot-scope="scope">
            {{scope.row.endTime.split(' ')[0]}}
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <a href="javascript:;" class="btn btn2" @click="dialogVisible=false">取 消</a>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 请求
import {
  insPropGetNewApplyList,
  insPropGetNewApplyDetail
} from "@/api/information/information";
export default {
  name: "",
  props: ["addedId", "idData"],
  data() {
    return {
      dialogText: "查看详情",
      dialogVisible: false,
      // 查询表单数据保存
      formInline: {
        // 审核状态
        state: "",
        userName: "",
        createTime: ""
      },
      // 审核列表数据
      tableData: [],
      // 对话框列表数据
      dialogData: [],
      // 总条数
      totalNum: 1,
      // 显示条数
      pageSize: 10,
      // 显示页数
      // 分页
      pageNum: 1,
      // 对话框总条数
      totalNum2: 1,
      // 对话框显示条数
      pageSize2: 10,
      // 显示页数
      // 对话框分页
      pageNum2: 1,
      // 控制操作为查看情况
      isSee: true,
      // 保存所有项目名称
      allProject: [],
    };
  },
  created() {
    this.getBeanList();
  },
  methods: {
    // 获取列表
    getBeanList() {
      let page;
      // applyId 获取携带过来的当前id 或者 新增成功后返回的id
      if (
        this.formInline.createTime == "" ||
        this.formInline.createTime == null
      ) {
        page = {
          applyId: this.addedId || this.obj.id,
          pageSize: this.pageSize,
          pageNum: this.pageNum,
          state:this.formInline.state == '' ? this.formInline.state = null:this.formInline.state,
          beginTime: "",
          endTime: ""
        };
      } else {
        page = {
          applyId: this.addedId || this.obj.id,
          pageSize: this.pageSize,
          pageNum: this.pageNum,
          state:this.formInline.state == '' ? this.formInline.state = null:this.formInline.state,
          // 开始时间
          beginTime: this.formInline.createTime[0] + " 00:00:00",
          // 结束时间
          endTime: this.formInline.createTime[1] + " 23:59:59"
        };
      }

      insPropGetNewApplyList(page).then(xhrData => {
        // console.log(xhrData);
        // 申报状态 0申报中 1批改成功
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
      this.getBeanList();
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
    },
    // 查看
    see(row) {
      this.dialogVisible = true;
      // 根据当前id查看详情
      insPropGetNewApplyDetail(row.id).then(xhrData => {
        // console.log(xhrData, "当前保单详情");
        this.dialogData = []
        if (xhrData.code === 200) {
          this.dialogData = xhrData.rows;
          this.totalNum2 = this.total;
          // this.dialogData.forEach(item => {
          //   if (item.type == "0") {
          //     item.type = "居住类型";
          //   } else if (item.type == "1") {
          //     item.type = "非居住类型";
          //   }
          //   if (item.swimmingPool == "0") {
          //     item.swimmingPool = "有";
          //   } else if (item.swimmingPool == "1") {
          //     item.swimmingPool = "无";
          //   }
          // });
        }
      });
    },
    // 关闭对话框
    closeDialog() {},
    // 新增按钮
    addedDeclare() {
      const objData = {
        id: this.addedId
      };
      this.$emit("changePage2", "ADDED_DECLARE", objData);
    },
    // 返回
    revert(){
      this.$emit("changePage2", "REVERT");
    },
    // 处理是否有游泳池
    handleSwimmingPool(val){
      if(val == '0'){
        return val = '有'
      }else if(val ==  '1'){
        return val = '无'
      }
    },
    handleType(val){
       if(val == '0'){
        return val = '居住类型'
      }else if(val ==  '1'){
        return val = '非居住类型'
      }
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
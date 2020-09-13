<template>
  <!-- 公众责任险保单管理 -->
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
          <el-form-item label="保单号:">
            <el-input
              @keyup.enter.native="query"
              v-model.trim="formInline.orderNo"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item label="保单状态:">
            <el-select @change="query" clearable v-model="formInline.state" placeholder="请选择">
              <!-- <el-option label="审核通过" value="1"></el-option> -->
              <el-option
                v-for="(item,index) in allProject"
                :key="index"
                :label="item.name"
                :value="item.state"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="承保公司:">
            <el-input
              @keyup.enter.native="query"
              v-model.trim="formInline.insCompanyName"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="info" plain @click="query">查询</el-button>
            <el-button
              type="warning"
              plain
              @click="handleExport"
              v-hasPermi="['ins:pub:record:export']"
            >导出</el-button>
            <el-button
              type="primary"
              v-if="Prohibit"
              @click="renewal"
              plain
              v-hasPermi="['ins:pub:renewal:add']"
            >续保</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!-- 审核列表 -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column prop="orderNo" show-overflow-tooltip label="保单号" width="200px"></el-table-column>
      <el-table-column prop="companyName" show-overflow-tooltip label="物业公司" width="200px"></el-table-column>
      <el-table-column prop="insCompanyName" show-overflow-tooltip label="承保公司" width="200px"></el-table-column>
      <el-table-column prop="projectNum" show-overflow-tooltip label="在保项目" width="100px"></el-table-column>
      <el-table-column prop="insureNum" show-overflow-tooltip label="投保份数" width="100px"></el-table-column>
      <el-table-column prop="time" show-overflow-tooltip label="保单有效期" width="200px"></el-table-column>
      <el-table-column prop="state" show-overflow-tooltip label="保单状态" width="200px"></el-table-column>
      <el-table-column label="操作" min-width="350px">
        <template slot-scope="scope">
          <div style="display: flex;">
            <!-- <div > -->
            <!-- <a
                href="javascript:;"
                style="margin-right:3px; color: #1890ff;"
                @click="added(scope.row)"
                v-hasPermi="['ins:pub:new:list']"
              >新增</a>
            <span style="margin-right:2px">|</span>-->
            <el-button
              size="mini"
              type="text"
              icon="el-icon-view"
              @click="see(scope.row)"
              v-hasPermi="['ins:pub:record:list']"
            >查看</el-button>
            <el-button
              v-if="scope.row.state == '在保' || scope.row.state == '已过期'"
              size="mini"
              type="text"
              icon="el-icon-plus"
              @click="added(scope.row)"
              v-hasPermi="['ins:pub:new:list']"
            >新增</el-button>
            <el-button
              v-if="scope.row.state == '在保'|| scope.row.state == '已过期'"
              size="mini"
              type="text"
              icon="el-icon-close"
              @click="surrender(scope.row)"
              v-hasPermi="['ins:pub:return:list']"
            >退保</el-button>
            <el-button
              v-if="scope.row.state == '在保'|| scope.row.state == '已过期'"
              size="mini"
              type="text"
              icon="el-icon-tickets"
              @click="policy(scope.row)"
            >保单</el-button>
            <el-button
              v-if="scope.row.state == '待付款'"
              size="mini"
              type="text"
              icon="el-icon-coin"
              @click="confirm(scope.row)"
            >确认付款</el-button>
            <!-- </div> -->
            <!-- <div > -->
            <!-- <a
                href="javascript:;"
                style="margin-right:3px; color: #1890ff;"
                @click="surrender(scope.row)"
                v-hasPermi="['ins:pub:return:list']"
              >退保</a>
            <span style="margin-right:2px">|</span>-->

            <!-- </div> -->
            <!-- <div> -->
            <!-- <a
                href="javascript:;"
                style="margin-right:3px; color: #1890ff;"
                @click="see(scope.row)"
                v-hasPermi="['ins:pub:record:list']"
            >查看</a>-->

            <!-- </div> -->
            <!-- <div v-if="scope.row.state == '在保'">
              <span style="margin-left:2px">|</span>
              <a href="javascript:;" style="margin-right:3px; color: #1890ff;" @click="policy(scope.row)">保单</a>
            </div>-->
            <!-- <div v-if="scope.row.state == '在保'">
              <span style="margin-left:2px">|</span>
              <a href="javascript:;" style="margin-right:3px; color: #1890ff;" @click="renewal(scope.row)">续保</a>
            </div>-->
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
  </div>
</template>

<script>
// 请求
import {
  getInsPub,
  insPubExportInsPubApply,
  insPubAllowRenewal
} from "@/api/information/information";
export default {
  name: "",
  data() {
    return {
      // 查询表单数据保存
      formInline: {
        orderNo: "",
        state: null,
        insCompanyName: ""
      },
      // 列表数据
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
      allProject: [
        {
          name: "在保",
          state: "2"
        },
        {
          name: "已过期",
          state: "3"
        },
        {
          name: "申报中",
          state: "0"
        },
        {
          name: "待付款",
          state: "1"
        }
      ],
      // 控制显示隐藏
      isShow: false,
      // 控制是否可续保
      isRenewal: false,
      Prohibit:false
    };
  },
  created() {
    this.getList();
    // 判断是否存在待付款状态
    // 查询是否可续保
    insPubAllowRenewal().then(xhrData=>{
      if(xhrData.code === 200){
        this.Prohibit = xhrData.data.allowRenewal // false:不可续保 true:可续保
      }
    })
  },
  methods: {
    // 获取列表信息
    getList() {
      const page = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        orderNo: this.formInline.orderNo,
        state: this.formInline.state == "" ? null : this.formInline.state,
        insCompanyName: this.formInline.insCompanyName
      };
      getInsPub(page).then(xhrData => {
        this.tableData = xhrData.rows;
        this.tableData.forEach(item => {
          if (item.state == "0") {
            item.state = "申报中";
          } else if (item.state == "1") {
            item.state = "待付款";
          } else if (item.state == "2") {
            item.state = "在保";
            this.isShow = true;
          } else if (item.state == "3") {
            item.state = "已过期";
          }
          item.time =
            item.startTime.split(" ")[0] + " 至 " + item.endTime.split(" ")[0];
        });
        // 总条数
        this.totalNum = xhrData.total;
      });
    },
    // 查询
    query() {
      this.getList();
    },
    // 导出按钮操作
    handleExport() {
      const formInline = this.formInline;
      this.$confirm("是否确认导出数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return insPubExportInsPubApply(formInline);
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
      this.getList();
    },
    // 页数
    handleCurrentChange(val) {
      // 改变默认的页数
      this.pageNum = val;
      // 更新列表
      this.getList();
    },
    // 新增按钮
    added(row) {
      // console.log(row);
      const idData = {
        id: row.id,
        state:row.state
      };
      this.$emit("changePage", "ADDED", idData);
    },
    //  查看
    see(row) {
      const idData = {
        id: row.id
      };
      this.$emit("changePage", "SEE", idData);
    },
    // 退保
    surrender(row) {
      const idData = {
        id: row.id,
        state:row.state
      };
      this.$emit("changePage", "SURRENDER", idData);
    },
    // 保单
    policy(row) {
      const idData = {
        id: row.id
      };
      this.$emit("changePage", "POLICY", idData);
    },
    // 确认付款
    confirm(row){
      // console.log(row);
      const insData = {
        id:row.id,
        totalPremium:row.totalPremium,
        isTrue:true
      }
      // this.$router.push({name:'/prop/public/declare',query: {id:'1'}})
      this.$router.push({name:"PublicDeclare",query:{insData}})
    },
    renewal() {
      // const idData = {
      //   id: row.id
      // };
      // console.log(idData,'idData');
      this.$confirm('目前在保数据是否续保?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$emit("changePage", "RENEWAL");
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });          
        });
      
    }
  }
};
</script>
<style>
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
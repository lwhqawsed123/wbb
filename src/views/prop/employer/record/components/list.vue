<template>
  <!-- 雇主险批单记录 -->
  <div class="rechargeRecord">
    <div class="rechargeRecord-conter">
      <el-row :gutter="20" class="rechargeRecord-top" style="margin-left: 0px; margin-right: 0px;">
        <el-col :span="21">
          <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="手机：" prop="phone">
              <el-input :maxlength="11" @keyup.enter.native="onSubmit" v-model.trim="formInline.phone"></el-input>
            </el-form-item>
            <el-form-item label="姓名：" prop="name">
              <el-input @keyup.enter.native="onSubmit" v-model.trim="formInline.name"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="info" plain @click="onSubmit">查询</el-button>
            </el-form-item>
            <el-form-item>
              <div class="addproject2" @click="replace">替换记录</div>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="3">
          <div class="addproject" @click="handleExport">导出 EXCEL</div>
        </el-col>
      </el-row>
      <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%">
        <el-table-column prop="name" label="雇员姓名" min-width="10%" show-overflow-tooltip></el-table-column>
        <el-table-column prop="phone" label="雇员手机" min-width="10%" show-overflow-tooltip></el-table-column>
        <el-table-column prop="certNo" label="雇员身份证" min-width="15%" show-overflow-tooltip></el-table-column>
        <el-table-column prop="validity" label="原保单有效期" min-width="15%" show-overflow-tooltip></el-table-column>
        <el-table-column prop="platformFee" label="增减金额" min-width="10%" show-overflow-tooltip></el-table-column>
        <el-table-column prop="endoreType" label="批单类型" min-width="10%" show-overflow-tooltip></el-table-column>
        <el-table-column prop="endoreTime" label="批单时间" min-width="10%" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" min-width="10%">
          <template slot-scope="scope">
            <a href="javascript:;" style="margin-left:3px;color: #1890ff;" @click="voucher(scope.row)">电子凭证</a>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="formInline.pageNum"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="formInline.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNum"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import {
  queryFillingRecordList,
  insEmpEndorseDetails,
  insEmpEndorseExport
} from "@/api/information/information";
export default {
  name: "rechargeRecord",
  data() {
    return {
      // 表格数据
      tableData: [],
      // 总条数
      totalNum: 1,
      formInline: {
        // 姓名
        name: "",
        // 手机
        phone: "",
        // 显示条数
        pageSize: 10,
        // 显示页数
        // 分页
        pageNum: 1
      },
      // 充值单位数据
      companyName: []
    };
  },
  created() {
    // 调用获取 雇主批改记录
    this.getDetailsData();
  },
  methods: {
    // 获取 雇主险批改记录
    getDetailsData() {
      // 调用获取雇主险批改记录 请求
      const page = {
        pageSize: this.formInline.pageSize,
        pageNum: this.formInline.pageNum,
        name: this.formInline.name,
        phone: this.formInline.phone
      };
      insEmpEndorseDetails(page).then(xhrData => {
        // const
        if (xhrData.code === 200) {
          // 保存 表格数据
          this.tableData = xhrData.rows;
          // 总条数
          this.totalNum = xhrData.total;

          // 开始时间

          for (let i = 0; i < this.tableData.length; i++) {
            // 处理 批单时间(去除时分秒)
            if (this.tableData[i].endoreTime != null) {
              this.tableData[i].endoreTime = this.tableData[i].endoreTime.split(
                " "
              )[0];
            }
            // 处理 原保单有效期(拼接开始到结束时间)
            this.tableData[i].validity =
              this.tableData[i].beginDate.split(" ")[0] +
              " 至 " +
              this.tableData[i].endDate.split(" ")[0];
            // 处理 增减金额(转换为小数点俩位)
            this.tableData[i].platformFee = Number(
              this.tableData[i].platformFee
            ).toFixed(2);
            if (this.tableData[i].endoreType == "1") {
              this.tableData[i].endoreType = "新增";
            } else if (this.tableData[i].endoreType == "2") {
              this.tableData[i].endoreType = "退保";
            } else if (this.tableData[i].endoreType == "3") {
              this.tableData[i].endoreType = "修改";
            } else {
              this.tableData[i].endoreType = "未知";
            }
          }
        }
      });
    },
    // 查询
    onSubmit() {
      // console.log(this.formInline);
      this.getDetailsData();
    },
    handleSizeChange(val) {
      // 注意：在改变每页显示的条数时，要将页码显示到第一页
      this.formInline.pageNum = 1;
      // 改变每页显示的条数
      this.formInline.pageSize = val;
      this.getDetailsData();
    },
    handleCurrentChange(val) {
      // 改变默认的页数
      this.formInline.pageNum = val;
      this.getDetailsData();
    },
    // 导出按钮操作
    handleExport() {
      const formInline = this.formInline;
      this.$confirm("是否确认导出所以批单记录?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return insEmpEndorseExport(formInline);
        })
        .then(response => {
          this.download(response.msg);
        })
        .catch(function() {});
    },
    // 查看凭证
    voucher(row){
      // console.log(row);
      
       this.$router.push({path:'/voucher3'})
      //  this.$router.push({path:'/voucher3',query: {id:row.credentialId,type:row.insureAmount}})
    },
    // 替换记录
    replace(){
      this.$emit("changePage", "REPLACE");
    }
  }
};
</script>

<style lang="scss" scoped>
.rechargeRecord {
  width: 100%;
  padding: 15px;
  min-height: calc(88vh);
  box-sizing: border-box;
  background-color: #e6e8eb;
  padding-bottom: 30px;

  .rechargeRecord-conter {
    min-height: calc(88vh);
    background-color: #fff;
    border-radius: 5px;
    position: relative;
    padding-bottom: 100px;
    .rechargeRecord-top {
      margin-left: 0;
      margin-right: 0;
      min-height: 60px;
      border-bottom: 1px solid #d6d6d6;
      .addproject {
        width: 120px;
        height: 36px;
        margin-top: 10px;
        background-color: #ef8200;
        border: 1px solid #d1780f;
        text-align: center;
        line-height: 36px;
        color: #fff;
        font-size: 14px;
        cursor: pointer;
      }
      .addproject2 {
        width: 120px;
        height: 36px;
        background-color: #609add;
        border: 1px solid #609add;
        text-align: center;
        line-height: 36px;
        color: #fff;
        font-size: 14px;
        cursor: pointer;
      }
      .el-form--inline .el-form-item {
        margin-top: 10px;
        margin-bottom: 0;
        .el-input {
          width: 140px;
        }
      }
    }
    .addrechargeRecord {
      width: 120px;
      height: 36px;
      margin-top: 10px;
      background-color: #ef8200;
      border: 1px solid #d1780f;
      text-align: center;
      line-height: 36px;
      color: #fff;
      font-size: 14px;
      cursor: pointer;
    }
    .el-pagination {
      position: absolute;
      bottom: 20px;
      left: 20px;
      right: 0;
    }
  }
}
</style>
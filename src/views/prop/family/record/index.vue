<template>
  <!-- 家财保障申报记录 -->
  <div class="record">
    <div class="record-conter">
      <el-row :gutter="20" class="record-top" style="margin-left: 0px; margin-right: 0px;">
        <el-col :span="21">
          <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="所属项目：">
              <el-select @change="onSubmit" clearable v-model="formInline.pId" placeholder="请选择">
                <el-option
                  v-for="(item) in villageData"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="被保人手机号：">
              <el-input @keyup.enter.native="onSubmit" maxlength="11" v-model.trim="formInline.mobileNo" placeholder="请输入"></el-input>
            </el-form-item>
            <!-- <el-form-item>
              <el-select @change="onSubmit" clearable v-model="formInline.productId" placeholder="请选择">
                <el-option
                  v-for="(item) in productList"
                  :key="item.id"
                  :label="item.listTitle | readMore"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item>
              <el-button type="info" plain @click="onSubmit">查询</el-button>
              <el-button
              type="warning"
              plain
              @click="handleExport"
              v-hasPermi="['ins:house:export']"
            >导出</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <!-- <el-col :span="3">
          <div class="addrecord" @click="handleExport">导出 EXCEL</div>
        </el-col> -->
      </el-row>
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
      <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column
          prop="credentialId"
          :show-overflow-tooltip="true"
          label="订单号"
          min-width="200px"
        ></el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          label="房屋地址"
          min-width="200px"
        >
        <template slot-scope="scope">
          {{scope.row.houseAddress}}{{scope.row.houseNumber}}
        </template>
        </el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          prop="projectName"
          label="所属项目"
          min-width="150px"
        ></el-table-column>
        <el-table-column prop="insureAmount" label="保额(万)" min-width="80px" show-overflow-tooltip></el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          prop="effective"
          label="保单有效期"
          min-width="200px"
        >
        <!-- <template slot-scope="scope">
          {{scope.row.startDate | filterData}} 至 {{scope.row.endDate | filterData}}
        </template> -->
        </el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          prop="applyDate"
          label="申报时间"
          min-width="160px"
        >
        <template slot-scope="scope">
          {{scope.row.applyDate | filterData}}
        </template>
        </el-table-column>
        <el-table-column prop="mobileNo" label="被保人手机" min-width="120px"></el-table-column>
        <el-table-column label="保单状态" min-width="180px">
          <template slot-scope="scope">
            <a href="javascript:;">{{scope.row.status}}</a> 
            <!-- ins:house:edit -->
            <div style="display: inline-block;" v-hasPermi="['ins:house:edit']">
              |
               <a
              href="javascript:;"
              style="margin-left:3px;color: #1890ff;"
              @click="changeApplication(scope.row)"
               
            >变更申请</a>
            </div>
           
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
    <!-- 变更申请对话框 -->
    <el-dialog
      @close="resetForm('changeForm')"
      class="record-dialog"
      title="保单信息变更申请"
      :visible.sync="dialogFormVisible"
      width="600px"
    >
      <p>
        <!-- 订单号 -->
        <span>订单号</span>
        <b>{{changeForm.credentialId}}</b>
      </p>
      <p>
        <span>保单号</span>
        <b>{{insuranceNo}}</b>
      </p>
      <p>
        <span>原地址</span>
        <b>{{houseAddress}}</b>
        <!-- <span>{{houseAddress}}{{houseNumber}}</span> -->
      </p>
      <p>
        <span>原门牌号</span>
        <b>{{houseNumber}}</b>
      </p>
      <p>
        <span>手机号</span>
        <b>{{mobileNo}}</b>
      </p>
      <el-form
        ref="changeForm"
        :rules="rules"
        :model="changeForm"
        label-position="left"
        label-width="120px"
      >
        <el-form-item label="变更后地址" prop="houseAddress">
          <el-input style="margin-left:-20px;" v-model.trim="changeForm.houseAddress"></el-input>
        </el-form-item>
        <el-form-item label="变更后门牌号" prop="houseNumber">
          <el-input style="margin-left:-20px;" v-model.trim="changeForm.houseNumber"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobileNo">
          <el-input :maxlength="11" style="margin-left:-20px;" v-model.trim="changeForm.mobileNo"></el-input>
        </el-form-item>
      </el-form>
      <p class="record-zhu">注：一个保单信息变更只能申请1次，请确认变更的信息的正确性；此申请流程一般需要5工作日；敬请谅解！</p>
      <div slot="footer" class="dialog-footer" prop="changeApply">
        <el-button class="record-true" type="primary" @click="changeApply('changeForm')">变更申请</el-button>
        <el-button @click="dialogFormVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  queryApplyHouseInsureList,
  getProjectRoleList,
  insRuleGetProduct,
  changeApplyAddressInfo,
  exportApplyRecord
} from "@/api/information/information";
export default {
  name: "record",
  data() {
    return {
      // 默认不开启select清空
      isClearable:true,
      // 总条数
      totalNum: 0,
      // 查询数据
      formInline: {
        // 项目id
        pId: "",
        // 手机号
        mobileNo: "",
        // 产品id
        productId: "",
        // 当前显示条数
        pageSize: 10,
        // 当前显示页数
        pageNum: 1
      },
      // 表格数据
      tableData: [],
      // 小区信息
      villageData: [],
      // 保险信息
      productList: [],
      // 变更申请 对话框
      dialogFormVisible: false,
      // 项目用户当前信息
      userData: {},
      // 对话框内表单数据
      changeForm: {
        // 新地址
        houseAddress: "",
        //  手机号
        mobileNo: "",
        //  门牌号 
        houseNumber:'',
        // 凭证号
        credentialId: ""
      },
      // 表单验证
      rules: {
        // 新地址
        houseAddress: [
          // required: true,
          {  message: "请输入新地址", trigger: "blur" }
        ],
        // 门牌号 -> 手机号
        mobileNo: [
          {  message: "请输入 手机号", trigger: "blur" },
          {
            pattern: /^1(3|4|5|6|7|8|9)\d{9}$/,
            message: "手机号格式不对",
            trigger: "blur"
          }
        ]
      },
      // 保单号
      insuranceNo: "",
      // 原地址
      houseAddress: "",
      // 手机
      mobileNo:'',
      // 门牌号
      houseNumber:''
    };
  },
  filters:{
    readMore:function(value){
      return value.split('+')[0]
    },
    filterData:function(val){
      if(val == null){
        return val = '-'
      }else{
        return val
      }
    }
  },
  created() {
    // 调用 获取小区信息 方法
    this.getPropRoleList();
    // 调用 家财申报记录 方法
    // this.getPropertyData();
    // 调用 获取保险信息 方法
    // this.getProduct();
  },
  methods: {
    // 获取小区信息
    getPropRoleList() {
      getProjectRoleList().then(xhrData => {
        if (xhrData.code === 200) {
          this.villageData = xhrData.rows;
          // this.getPropertyData(xhrData.rows[0].id)
        }
      });
      this.getPropertyData()
    },
    // 家财申报记录数据
    getPropertyData(id) {
      // if (this.$store.state.user.userType == "02") {
      //   this.formInline.pId = id;
      //   this.isClearable = false;
      // }
      const page = {
        pageNum: this.formInline.pageNum,
        pageSize: this.formInline.pageSize,
        pId: this.formInline.pId,
        mobileNo: this.formInline.mobileNo,
        productId: this.formInline.productId
      };
      queryApplyHouseInsureList(page).then(xhrData => {
        if (xhrData.code === 200) {
          for (let i = 0; i < xhrData.rows.length; i++) {
            if(xhrData.rows[i].startDate == null || xhrData.rows[i].endDate == null){
              xhrData.rows[i].effective = '-'
            }else{
              xhrData.rows[i].effective =
              xhrData.rows[i].startDate + " 至 " + xhrData.rows[i].endDate;
            }
            
            if (xhrData.rows[i].status == "0") {
              xhrData.rows[i].status = "待生成";
            } else if (xhrData.rows[i].status == "1") {
              xhrData.rows[i].status = "已生成";
            }
          }
          // 赋值到表格数据
          this.tableData = xhrData.rows;
          // 总条数
          this.totalNum = xhrData.total;
        }
      });
    },
    // 获取保险类型
    getProduct() {
      const data = {
        insType: "1"
      };
      insRuleGetProduct(data)
        .then(xhrData => {
          if (xhrData.code === 200) {
            // console.log(xhrData,'asdas');
            
            this.productList = xhrData.data.productList;
          }
        })
        .catch(() => {});
    },
    // 变更申请
    changeApplication(row) {
      // console.log(row);
      
      // 打开对话框
      this.dialogFormVisible = true;
      // 凭证号
      this.changeForm.credentialId = row.credentialId;
      // 保单号
      this.insuranceNo = row.insuranceNo;
      // 原住址
      this.houseAddress = row.houseAddress;
      // 手机号
      this.mobileNo = row.mobileNo;
      // 门牌号
      this.houseNumber = row.houseNumber
    },
    // 确认变更申请
    changeApply(changeForm) {
      // 表单验证
      this.$refs[changeForm].validate(valid => {
        // 通过验证
        if (valid) {
          // 请求变更申请
          // console.log(this.changeForm);
          changeApplyAddressInfo(this.changeForm)
            .then(xhrData => {
              if (xhrData.code === 200) {
                this.$message.success({
                  message: "变更成功!"
                });
                // 更新列表
                this.getPropRoleList()
                // 关闭对话框
                this.dialogFormVisible = false;
                // 清空表单
                this.$refs["changeForm"].resetFields();
              } else if (xhrData.code === 500) {
                this.$message.error({
                  message: xhrData.msg
                });
                // 关闭对话框
                this.dialogFormVisible = false;
              }
            })
            .catch(() => {
              // 关闭对话框
              // this.dialogFormVisible = false;
            });
        } else {
          this.$message.warning({
            message: "请完善信息~!"
          });
          return false;
        }
      });
    },
    // 关闭对话框
    resetForm() {
      // 清空表单
      this.$refs["changeForm"].resetFields();
    },
    // 查询
    onSubmit() {
      this.getPropRoleList();
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleSizeChange(val) {
      // 注意：在改变每页显示的条数时，要将页码显示到第一页
      this.formInline.pageNum = 1;
      // 改变每页显示的条数
      this.formInline.pageSize = val;
      // 点击每页显示的条数时，显示第一页
      this.getPropertyData();
    },
    handleCurrentChange(val) {
      // 改变默认的页数
      this.formInline.pageNum = val;
      // 切换页码时，要获取每页显示的条数
      this.getPropertyData();
    },
    // 导出按钮操作
    handleExport() {
      const formInline = this.formInline;
      this.$confirm("是否确认导出所有数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return exportApplyRecord(formInline);
        })
        .then(response => {
          this.download(response.msg);
        })
        .catch(function() {});
    }
  }
};
</script>
<style>
/* 修改变更按钮 */
/* .el-button--primary {
  background-color: #ef8200 !important;
  border: 1px solid #ce7000;
  color: #fff;
  font-size: 14px;
  font-weight: bold;
} */
/* 修改关闭按钮 */
/* .el-button--default {
  background-color: #f1f2f3;
  border: 1px solid #cacbcc;
  font-size: 14px;
  font-weight: bold;
} */
/* 修改变更鼠标经过 */
/* .el-button--primary:hover {
  border: 1px solid #ce7000;
} */
/* 修改对话框整体 */
.el-dialog {
  border-radius: 5px;
}
/* 修改对话框中间部分 */
.el-dialog__body {
  padding-bottom: 0;
}
/* 修改对话框头部 */
.el-dialog__header {
  background-color: #e6e8eb;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}
/* 修改对话框底部 */
.el-dialog__footer {
  padding: 10px;
  background-color: #e6e8eb;
}
/* 修改对话框标题 */
.el-dialog__title {
  font-size: 20px;
  font-weight: bold;
}
</style>
<style lang="scss" scoped>
.record {
  width: 100%;
  padding: 15px;
  min-height: calc(88vh);
  box-sizing: border-box;
  background-color: #e6e8eb;
  padding-bottom: 30px;
  .record-conter {
    min-height: calc(88vh);
    background-color: #fff;
    border-radius: 5px;
    position: relative;
    padding-bottom: 100px;

    .record-top {
      margin-left: 0;
      margin-right: 0;
      min-height: 60px;
      border-bottom: 1px solid #d6d6d6;
      .el-form--inline .el-form-item {
        margin-top: 10px;
        margin-bottom: 0;
        .el-input {
          width: 140px;
        }
      }
    }
    .addrecord {
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
  .record-dialog {
    p {
      font-size: 14px;
      color: #656565;
      min-height: 40px;
      font-weight: bold;
      display: flex;
      span {
        // margin-left: 60px;
        display: inline-block;
        width: 100px;
      }
      b{
        font-weight: bold;
        display: inline-block;
        width: 435px;
      }
    }
    label {
      font-weight: normal;
    }
    p.record-zhu {
      font-size: 12px;
      color: #b0b0b0;
      letter-spacing:1px
    }
  }
}
</style>
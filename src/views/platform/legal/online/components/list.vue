<template>
  <!-- 家财凭证管理 -->
  <div class="record">
    <div class="record-conter">
      <el-row :gutter="20" class="record-top" style="margin-left: 0px; margin-right: 0px;">
        <el-col :span="24">
          <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="订单号：">
              <el-input
                v-model.trim="formInline.orderNo"
                @keyup.enter.native="onSubmit"
                @clear="onSubmit"
                placeholder="请输入"
                
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="物业公司：">
              <el-select
                @change="onSubmit"
                clearable
                v-model="formInline.propId"
                placeholder="请选择"
                
              >
                <el-option
                  v-for="(item,index) in companyOptions"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="审核状态：">
              <el-select
                @change="onSubmit"
                clearable
                v-model="formInline.examineStatus"
                placeholder="请选择"
                style="width:120px"
              >
                <el-option
                  v-for="(item,index) in examineStatus"
                  :key="index"
                  :label="item.label"
                  :value="item.examineStatus"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="委托时间：">
              <el-date-picker
                @change="onSubmit"
                clearable
                v-model="formInline.beginTime"
                type="date"
                placeholder="选择日期"
                
                value-format="yyyy-MM-dd"
                :picker-options="startOptions"
              ></el-date-picker>
            </el-form-item>
            <el-form-item>-</el-form-item>
            <el-form-item>
              <el-date-picker
                @change="onSubmit"
                clearable
                v-model="formInline.endTime"
                type="date"
                placeholder="选择日期"
                
                value-format="yyyy-MM-dd"
                :picker-options="endOptions"
              ></el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary"  @click="onSubmit">查询</el-button>
              <el-button type="primary"  @click="handleExport">导出</el-button>
              <el-button type="primary"  @click="auditAll(2)">一键审核</el-button>
              <el-button type="warning"  @click="auditAll(3)">一键作废</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        row-key="proprId"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          min-width="20"
          reserve-selection
          :selectable="row=>(row.examineStatus===1&&row.entrustStatus===2)||(row.examineStatus===1&&row.entrustStatus===4)"
        ></el-table-column>
        <el-table-column type="index" min-width="50" label="序号"></el-table-column>
        <el-table-column prop="orderNo" :show-overflow-tooltip="true" label="订单号" min-width="170px"></el-table-column>
        <el-table-column prop="proprId" :show-overflow-tooltip="true" label="委托编号"></el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          prop="propName"
          label="物业公司"
          min-width="120px"
        ></el-table-column>
        <el-table-column prop="orderMoney" label="订单金额" show-overflow-tooltip></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="orderPaymentMoney" label="实付金额"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="proprName" label="欠费业主姓名"></el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          prop="proprMobile"
          label="联系方式"
          min-width="120px"
        ></el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          prop="proprAddress"
          label="欠费业主详细地址"
          min-width="120px"
        ></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="arrearage" label="欠费金额(不含滞纳金)"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" label="欠费时间段" min-width="120px">
          <template
            slot-scope="scope"
          >{{scope.row.arrearageStartTime?scope.row.arrearageStartTime.slice(0,10) +" - "+ scope.row.arrearageEndTime.slice(0,10):''}}</template>
        </el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          prop="entrustDate"
          label="委托时间"
          min-width="120px"
        ></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="entrustClient" label="委托人"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="entrustClientPhone" label="委托人联系方式"></el-table-column>
        <!-- <el-table-column label="委托状态">
          <template
            slot-scope="scope"
          >{{productList.filter((item)=>item.entrustStatus===scope.row.entrustStatus)[0].label}}</template>
        </el-table-column>-->
        <el-table-column label="委托状态">
          <template
            slot-scope="scope"
          >{{examineStatus.filter((item)=>item.examineStatus===scope.row.examineStatus)[0].label}}</template>
        </el-table-column>
        <el-table-column label="操作" min-width="120px">
          <template slot-scope="scope">
            <!-- 律师审核状态(0:待付款 1:未审核、2:审核通过、3:已作废、4：待处理、5：已完成) -->
            <a
              href="javascript:;"
              style="margin-right:3px; color: rgb(24, 144, 255);"
              @click="openEdit(scope.row)"
              v-if="scope.row.examineStatus===1"
            >编辑</a>
            <a
              href="javascript:;"
              style="margin-right:3px; color: rgb(24, 144, 255);"
              @click="auditById(scope.row,2)"
              v-if="scope.row.examineStatus===1"
            >审核</a>
            <a
              href="javascript:;"
              style="margin-right:3px; color: rgb(24, 144, 255);"
              @click="auditById(scope.row,3)"
              v-if="scope.row.examineStatus===1"
            >作废</a>
            <a
              href="javascript:;"
              style="margin-right:3px; color: rgb(24, 144, 255);"
              @click="downloadPDF(scope.row.proprId)"
              v-if="scope.row.examineStatus===2"
            >下载pdf</a>
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
    <!-- 修改弹框 -->
    <el-dialog
      @close="resetForm('ruleForm')"
      id="owner-dialog"
      title="修改信息"
      :visible.sync="dialogVisible"
      width="600px"
    >
      <el-form
        :rules="rules"
        :model="ownerForm"
        label-width="170px"
        label-position="left"
        ref="ruleForm"
      >
        <el-form-item label="欠费业主姓名" prop="proprName">
          <el-input v-model="ownerForm.proprName" maxlength="10" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="proprMobile">
          <el-input v-model="ownerForm.proprMobile" maxlength="11" show-word-limit></el-input>
        </el-form-item>
        <el-form-item prop="proprAddress" label="欠费房屋详细地址">
          <el-input v-model="ownerForm.proprAddress" placeholder show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="欠费金额(不含滞纳金)" prop="arrearage">
          <el-input v-model="ownerForm.arrearage" maxlength="10" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="欠费时间段" prop="arrearageDate">
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="ownerForm.arrearageDate"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="owner-dialog-footer">
        <a href="javascript:;" class="owner-btn btn1" @click="submitForm('ruleForm')">保存</a>
        <a href="javascript:;" class="owner-btn btn2" @click="dialogVisible=false">关闭</a>
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
import {
  onlineList,
  onlineOwnerEdit,
  examineStatusEdit,
  onlineExport,
  allExamineStatusEdit,
  onlineDownloadPDF,
  getCompany
} from "@/api/legal/online.js";
export default {
  name: "record",
  data() {
    return {
      // 默认不开启select清空
      isClearable: true,
      // 总条数
      totalNum: 0,
      // 查询数据
      formInline: {
        // 物业公司
        propId: "",
        // 订单编号
        orderNo: "",
        // 审核状态
        examineStatus: "",
        // 排序列
        orderByColumn:'id',
        // 排序方式
        isAsc:'desc',
        // 开始时间
        beginTime: "",
        //结束时间
        endTime: "",
        // 当前显示条数
        pageSize: 10,
        // 当前显示页数
        pageNum: 1
      },
      // 日期禁用项 禁用大于结束日期
      startOptions: {
        disabledDate: false
      },
      // 日期禁用项 禁用小于开始日期
      endOptions: {
        disabledDate: false
      },
      // 表格数据
      tableData: [],
      // 物业公司列表
      companyOptions: [],
      // 委托状态
      productList: [
        { entrustStatus: 1, label: "待付款" },
        { entrustStatus: 2, label: "待审核" },
        { entrustStatus: 3, label: "待处理" },
        { entrustStatus: 4, label: "部分审核" },
        { entrustStatus: 5, label: "审核通过" },
        { entrustStatus: 6, label: "已完成" },
        { entrustStatus: 7, label: "已失效" }
      ],
      // 律师审核状态
      examineStatus: [
        { examineStatus: 0, label: "待付款" },
        { examineStatus: 1, label: "待审核" },
        { examineStatus: 2, label: "审核通过" },
        { examineStatus: 3, label: "已作废" }
      ],
      // 变更申请 对话框
      dialogVisible: false,
      // 项目用户当前信息
      userData: {},
      //====新增/修改=====
      // 添加表单数据
      ownerForm: {
        // 业主名称
        proprName: "",
        // 联系方式
        proprMobile: "",
        // 详细地址
        proprAddress: "",
        // 欠费金额
        arrearage: "",
        // 欠费开始时间
        arrearageStartTime: "",
        // 欠费截止时间
        arrearageEndTime: "",
        arrearageDate: []
      },
      // 表单验证
      rules: {
        // 新地址
        houseAddress: [
          { required: true, message: "请输入新地址", trigger: "blur" }
        ],
        // 门牌号
        houseNumber: [
          { required: true, message: "请输入门牌号", trigger: "blur" }
        ]
      },
      // 保单号
      insuranceNo: "",
      // 原地址
      houseAddress: "",
      // 多选框被选中的内容
      multipleSelection: []
    };
  },
  created() {
    // 调用 获取在线委托列表 方法
    this.getOnlineList();
    // 获取公司列表
    this.getAllCompany();
  },
  watch: {
    ["formInline.beginTime"](val) {
      this.endOptions = {
        disabledDate(date) {
          if(!val){
            return false
          }else if(new Date(date).getTime() === new Date(val+' 00:00:00').getTime()){
            return false
          }
          return date.getTime() < new Date(val).getTime()
        }
      };
    },
    ["formInline.endTime"](val) {
      this.startOptions = {
        disabledDate(date) {
          if(!val){
            return false
          }else if(new Date(date).getTime() === new Date(val+' 00:00:00').getTime()){
            return false
          }
          return date.getTime() > new Date(val).getTime()
        }
      };
    }
  },
  methods: {
    // 查看
    see(row) {
      // console.log(row);
      const obj = {
        id: row.id
      };
      this.$emit("changePage", "SEE", obj);
    },
    onSubmit() {
      this.getOnlineList();
    },
    // 获取所有物业公司
    getAllCompany() {
      getCompany().then(res => {
        if (res.code === 200) {
          this.companyOptions = res.rows;
        }
      });
    },
    // 打开编辑弹框
    openEdit(row) {
      let ownerForm = JSON.parse(JSON.stringify(row));
      let arr = [];
      arr.push(ownerForm.arrearageStartTime);
      arr.push(ownerForm.arrearageEndTime);
      // this.$set(ownerForm,"arrearageDate",arr)
      ownerForm.arrearageDate = arr;
      this.ownerForm = ownerForm;
      this.dialogVisible = true;
    },
    // 获取列表
    getOnlineList() {

      let data = JSON.parse(JSON.stringify(this.formInline));
      if (!data.beginTime) {
        delete data.beginTime;
      }else{
        data.beginTime+=" 00:00:00"
      }
      if (!data.endTime) {
        delete data.endTime;
      }else{
        data.endTime+=" 23:59:59"
      }
      onlineList(data).then(xhrData => {
        if (xhrData.code === 200) {
          this.$refs["multipleTable"].clearSelection();
          this.tableData = xhrData.rows;
          this.totalNum = xhrData.total;
        }
      });
    },

    // 变更申请
    changeApplication(row) {
      // 打开对话框
      this.dialogFormVisible = true;
      // 凭证号
      this.changeForm.credentialId = row.credentialId;
      // 保单号
      this.insuranceNo = row.insuranceNo;
      // 原住址
      this.houseAddress = row.houseAddress;
    },
    // 确认变更申请
    submitForm(changeForm) {
      // 表单验证
      this.$refs[changeForm].validate(valid => {
        // 通过验证
        if (valid) {
          let ownerForm = {
            arrearage: this.ownerForm.arrearage,
            arrearageEndTime: this.ownerForm.arrearageDate[1],
            arrearageStartTime: this.ownerForm.arrearageDate[0],
            examineStatus: this.ownerForm.examineStatus,
            proprAddress: this.ownerForm.proprAddress,
            proprMobile: this.ownerForm.proprMobile,
            proprName: this.ownerForm.proprName,
            proprId: this.ownerForm.proprId
          };
          let data = {
            id: this.ownerForm.id,
            proprId: this.ownerForm.proprId,
            data: ownerForm
          };
          // 请求变更申请
          onlineOwnerEdit(data)
            .then(xhrData => {
              if (xhrData.code === 200) {
                this.$message.success({
                  message: "变更成功!"
                });
                // 关闭对话框
                this.dialogVisible = false;
                this.getOnlineList();
              } else if (xhrData.code === 500) {
                this.$message.error({
                  message: xhrData.msg
                });
                // 关闭对话框
                this.dialogVisible = false;
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
      this.$refs["ruleForm"].resetFields();
    },
    handleSizeChange(val) {
      // 注意：在改变每页显示的条数时，要将页码显示到第一页
      this.formInline.pageNum = 1;
      // 改变每页显示的条数
      this.formInline.pageSize = val;
      // 点击每页显示的条数时，显示第一页
      this.getOnlineList();
    },
    handleCurrentChange(val) {
      // 改变默认的页数
      this.formInline.pageNum = val;
      // 切换页码时，要获取每页显示的条数
      this.getOnlineList();
    },
    // 勾选/取消勾选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 一键审核
    auditAll(status) {
      if (!this.multipleSelection.length) {
        this.$message.warning("最少选择一项记录");
        return;
      }
      let tips='审核通过后无法再更改审核状态，是否确定审核通过'
      if(status===3){
        tips="作废后无法再更改审核状态，是否确定作废"
      }
      this.$confirm(
        tips,
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          // 数组去重
          let arr = this.unique(
            JSON.parse(JSON.stringify(this.multipleSelection))
          );
          let data = {
            examineStatus: status,
            dataArr: []
          };
          arr.forEach(item => {
            let obj = {
              id: item.id,
              proprIds: []
            };
            this.multipleSelection.forEach(list => {
              if (list.id === item.id) {
                obj.proprIds.push(list.proprId);
              }
            });
            data.dataArr.push(obj);
          });
          allExamineStatusEdit(data).then(xhrData => {
            if (xhrData.code === 200) {
              this.$message.success({
                message: "变更成功!"
              });
              this.getOnlineList();
            } else if (xhrData.code === 500) {
              this.$message.error({
                message: xhrData.msg
              });
            }
          });
        })
        .catch(function() {});
    },
    // 对象数组去重的方法
    unique(arr) {
      const res = new Map();
      return arr.filter(arr => !res.has(arr.id) && res.set(arr.id, 1));
    },
    // 根据id单个审核
    auditById(row, status) {
      let text = "审核通过后无法再更改审核状态，是否确定审核通过？";
      if (status === 3) {
        text = "作废后无法再更改审核状态，是否确定作废？";
      }
      this.$confirm(text, "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let formData = new FormData();
          formData.append("examineStatus", status);
          let data = {
            id: row.id,
            proprId: row.proprId,
            data: formData
          };
          examineStatusEdit(data).then(res => {
            if (res.code === 200) {
              this.$message.success({
                message: "变更成功!"
              });
              this.getOnlineList();
            } else if (res.code === 500) {
              this.$message.error({
                message: res.msg
              });
            }
          });
        })
        .catch(function() {});
    },
    // 导出按钮操作
    handleExport() {
      const formInline = JSON.parse(JSON.stringify(this.formInline));
      if (!formInline.beginTime) {
        delete formInline.beginTime;
      }
      if (!formInline.endTime) {
        delete formInline.endTime;
      }
      formInline.pageSize = 9999999999;
      this.$confirm("是否确认导出所有数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return onlineExport(formInline);
        })
        .then(response => {
          this.download(response.msg);
        })
        .catch(function() {});
    },
    downloadPDF(id) {
      this.$confirm("是否确认下载pdf文件?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          onlineDownloadPDF(id)
            .then(res => {
              // 必传后缀
              this.downloadBlob(res, "律师函.zip");
            })
            .catch(err => {
              console.log(err);
            });
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
      padding-bottom: 10px;
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
  .owner-dialog-footer {
    .owner-btn {
      width: 82px;
      height: 32px;
      border-radius: 2px;
      text-align: center;
      line-height: 32px;
      font-weight: bold;
      display: inline-block;
      font-size: 14px;
    }
    .btn,
    .btn1 {
      background: #169bd5;
      border: 1px solid #169bd5;
      color: #fff;
    }
    .btn2 {
      border: 1px solid #cccccc;
      color: #000000;
    }
  }
  .record-dialog {
    p {
      font-size: 14px;
      color: #656565;
      height: 40px;
      span {
        margin-left: 60px;
      }
    }
    label {
      font-weight: normal;
    }
    p.record-zhu {
      font-size: 12px;
      color: #b0b0b0;
    }
  }
}
</style>

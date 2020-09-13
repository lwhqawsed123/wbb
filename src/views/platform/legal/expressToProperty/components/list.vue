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
            <el-form-item label="委托状态：">
              <el-select
                @change="onSubmit"
                clearable
                v-model="formInline.entrustStatus"
                placeholder="请选择"
                style="width:120px"
              >
                <el-option
                  v-for="(item,index) in productList"
                  :key="index"
                  :label="item.label"
                  :value="item.entrustStatus"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="开票状态：">
              <el-select
                @change="onSubmit"
                clearable
                v-model="formInline.billingStatus"
                placeholder="请选择"
                style="width:120px"
              >
                <el-option
                  v-for="(item,index) in billingStatusList"
                  :key="index"
                  :label="item.label"
                  :value="item.billingStatus"
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
      >
        <el-table-column type="index" min-width="50" label="序号"></el-table-column>
        <el-table-column prop="orderNo" :show-overflow-tooltip="true" label="订单号" min-width="120px"></el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          prop="propName"
          label="物业公司"
          min-width="120px"
        ></el-table-column>
        <el-table-column prop="entrustNumber" label="委托数量" show-overflow-tooltip></el-table-column>
        <el-table-column prop="orderMoney" label="订单金额" show-overflow-tooltip></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="orderPaymentMoney" label="实付金额"></el-table-column>

        <el-table-column :show-overflow-tooltip="true" prop="entrustClient" label="委托人"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="entrustClientPhone" label="委托人联系方式"></el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          prop="entrustDate"
          label="委托时间"
          min-width="120px"
        ></el-table-column>
        <el-table-column label="开票状态">
          <template slot-scope="scope">
            <span v-if="scope.row.entrustStatus!==6">-</span>
            <span v-else-if="scope.row.billingStatus===0">待开票</span>
            <span v-else-if="scope.row.billingStatus===1">开票中</span>
            <span v-else-if="scope.row.billingStatus===2">已开票</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" label="收件信息" min-width="120px">
          <template
            slot-scope="scope"
          >{{scope.row.addresseeName+' '+ scope.row.addresseeMobile+' '+scope.row.addresseeAddress}}</template>
        </el-table-column>
        <el-table-column label="委托状态">
          <template
            slot-scope="scope"
          >{{productList.filter((item)=>item.entrustStatus===scope.row.entrustStatus)[0].label}}</template>
        </el-table-column>
        <el-table-column label="操作" min-width="120px">
          <template slot-scope="scope">
            <!-- 律师审核状态(0:待付款 1:未审核、2:审核通过、3:审核不通过) -->
            <a
              href="javascript:;"
              style="margin-right:3px; color: rgb(24, 144, 255);"
              @click="see(scope.row)"
            >查看明细</a>
            <a
              href="javascript:;"
              style="margin-right:3px; color: rgb(24, 144, 255);"
              @click="auditById(scope.row,6)"
              v-if="scope.row.entrustStatus===3"
            >确认完成</a>
            <a
              href="javascript:;"
              style="margin-right:3px; color: rgb(24, 144, 255);"
              @click="downloadPDF(scope.row.id)"
              v-if="scope.row.entrustStatus!==1&&scope.row.entrustStatus!==7"
            >下载全部</a>
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
  list,
  getCompany,
  examineStatusEdit,
  onlineExport,
  onlineDownloadPDF
} from "@/api/legal/expressToProperty.js";
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
        // 催收函类型（1:在线、2:快递到物业、3:快递到业主）
        lawyerType: 2,
        // 物业公司
        propId: "",
        // 订单编号
        orderNo: "",
        // 审核状态
        entrustStatus: "",
        // 排序列
        orderByColumn: "id",
        // 排序方式
        isAsc: "desc",
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
        // { entrustStatus: 2, label: "待审核" },
        { entrustStatus: 3, label: "待处理" },
        // { entrustStatus: 4, label: "部分审核" },
        // { entrustStatus: 5, label: "审核通过" },
        { entrustStatus: 6, label: "已完成" },
        { entrustStatus: 7, label: "已失效" }
      ],

      // 开票状态
      billingStatusList: [
        { billingStatus: 0, label: "未开票" },
        { billingStatus: 1, label: "开票中" },
        { billingStatus: 2, label: "已开票" }
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
    // 获取物业公司列表
    this.getAllCompany();
  },
  watch: {
    ["formInline.beginTime"](val) {
      this.endOptions = {
        disabledDate(date) {
          if (!val) {
            return false;
          } else if (
            new Date(date).getTime() === new Date(val + " 00:00:00").getTime()
          ) {
            return false;
          }
          return date.getTime() < new Date(val).getTime();
        }
      };
    },
    ["formInline.endTime"](val) {
      this.startOptions = {
        disabledDate(date) {
          if (!val) {
            return false;
          } else if (
            new Date(date).getTime() === new Date(val + " 00:00:00").getTime()
          ) {
            return false;
          }
          return date.getTime() > new Date(val).getTime();
        }
      };
    }
  },
  methods: {
    // 查看
    see(row) {
      const obj = {
        id: row.id,
        orderNo: row.orderNo
      };
      this.$emit("changePage", "SEE", obj);
    },
    onSubmit() {
      this.getOnlineList();
    },
    // 获取列表
    getOnlineList() {
      let data = JSON.parse(JSON.stringify(this.formInline));
      if (!data.beginTime) {
        delete data.beginTime;
      } else {
        data.beginTime += " 00:00:00";
      }
      if (!data.endTime) {
        delete data.endTime;
      } else {
        data.endTime += " 23:59:59";
      }
      list(data).then(xhrData => {
        if (xhrData.code === 200) {
          this.tableData = xhrData.rows;
          this.totalNum = xhrData.total;
        }
      });
    },
    // 获取所有物业公司
    getAllCompany() {
      getCompany().then(res => {
        if (res.code === 200) {
          this.companyOptions = res.rows;
        }
      });
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
    // 根据id单个审核
    auditById(row, status) {
      this.$confirm(
        "审核通过后无法再更改审核状态，是否确定审核通过？",
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          let data = {
            id: row.id,
            data: {
              entrustStatus: status
            }
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
        .then(() => {
          return onlineExport(formInline);
        })
        .then(response => {
          this.download(response.msg);
        })
        .catch(function() {});
    },
    // 批量下载(.zip格式)
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
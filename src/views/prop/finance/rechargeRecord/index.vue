<template>
  <!-- 充值记录 -->
  <div class="rechargeRecord">
    <div class="rechargeRecord-conter">
      <el-row :gutter="20" class="rechargeRecord-top" style="margin-left: 0px; margin-right: 0px;">
        <el-col :span="21">
          <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="支付状态：">
              <el-select @change="onSubmit" clearable v-model="formInline.payStatus">
                <el-option label="充值成功" :value="1"></el-option>
                <el-option label="审核不通过" :value="2"></el-option>
                <el-option label="待审核" :value="3"></el-option>
                <el-option label="未支付" :value="4"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="充值单位：">
              <!-- <el-select
                @change="onSubmit"
                clearable
                value-key="id"
                v-model="formInline.companyName"
              >
                <el-option
                  v-for="(item,index) in Pname"
                  :key="index"
                  :label="item.name"
                  :value="item.name"
                ></el-option>
              </el-select> -->
              <el-select
              @change="onSubmit"
              clearable
              value-key="name"
              placeholder="请选择"
               v-model="formInline.companyName"
            >
              <el-option-group v-for="item in projectData" :key="item.name" :label="item.name">
                <el-option
                  v-for="item2 in item.arr"
                  :key="item2.name"
                  :label="item2.name"
                  :value="item2.name"
                ></el-option>
              </el-option-group>
            </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="info" plain @click="onSubmit">查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%">
        <el-table-column label="订单号" show-overflow-tooltip min-width="200px">
          <template slot-scope="scope">{{ scope.row.orderId }}</template>
        </el-table-column>
        <el-table-column prop="pName" label="充值单位" min-width="200px" show-overflow-tooltip></el-table-column>
        <el-table-column prop="type" label="交易类型" min-width="120px" show-overflow-tooltip></el-table-column>
        <el-table-column prop="amount" label="订单金额" min-width="120px" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" label="操作时间" min-width="180px" show-overflow-tooltip></el-table-column>
        <el-table-column prop="operatorName" label="操作用户" min-width="120px" show-overflow-tooltip></el-table-column>
        <el-table-column prop="payType" label="支付方式" min-width="100px" show-overflow-tooltip></el-table-column>
        <el-table-column prop="payStatus" label="支付状态" min-width="100px" show-overflow-tooltip></el-table-column>
        <el-table-column prop="caoZuo" label="操作" min-width="150px">
          <template slot-scope="scope">
            <a
              href="javascript:;"
              v-if="scope.row.payStatus == '充值成功' && scope.row.type != '购买家财豆'"
              style="color:#1890FF"
              @click="voucher(scope.row)"
            >充值凭证</a>
            <a
              href="javascript:;"
              v-else-if="!scope.row.payStatus == '充值成功' && !scope.row.type != '购买家财豆'"
              style="color:#1890FF"
              @click="seeInformation(scope.row)"
            >查看</a>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNum"
      ></el-pagination>
      <!-- 查看信息对话框 -->
      <el-dialog
        :title="dialogText"
        id="seeDialog"
        class="seeDialog"
        :visible.sync="dialogVisible"
        @close="closeDialog"
        width="600px"
      >
        <el-form ref="form" :model="form" label-width="120px" label-position="left">
          <el-form-item label="订单号:">
            <el-input :disabled="true" v-model="form.orderId"></el-input>
          </el-form-item>
          <el-form-item label="所属物业:">
            <el-input :disabled="true" v-model="form.companyName"></el-input>
          </el-form-item>
          <el-form-item label="充值账户:">
            <el-input :disabled="true" v-model="form.pName"></el-input>
          </el-form-item>
          <el-form-item label="充值前余额:">
            <el-input :disabled="true" v-model="form.beforeBalance"></el-input>
          </el-form-item>
          <el-form-item label="充值金额:">
            <el-input :disabled="true" v-model="form.amount"></el-input>
          </el-form-item>
          <el-form-item label="充值方式:">
            <el-input :disabled="true" v-model="form.payType"></el-input>
          </el-form-item>
          <el-form-item label="申请人:">
            <el-input :disabled="true" v-model="form.operatorName"></el-input>
          </el-form-item>
          <el-form-item label="申请人手机号:">
            <el-input :disabled="true" v-model="form.phonenumber"></el-input>
          </el-form-item>
          <el-form-item label="申请时间:">
            <el-input :disabled="true" v-model="form.createTime"></el-input>
          </el-form-item>
          <el-form-item v-if="isWait" label="审核时间:">
            <el-input :disabled="true" v-model="form.auditTime"></el-input>
          </el-form-item>
          <el-form-item v-if="isShow" label="被拒原因:" prop="cause">
            <el-input :disabled="true" type="textarea" v-model="form.cause"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <a href="javascript:;" class="btn btn2" @click="dialogVisible=false">返 回</a>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  queryFillingRecordList,
  getProjectRoleList,
  getPropCompany,
  // queryProjectList,
} from "@/api/information/information";
export default {
  name: "rechargeRecord",
  data() {
    return {
      // 表格数据
      tableData: [],
      // 总条数
      totalNum: 1,
      // 显示条数
      pageSize: 10,
      // 显示页数
      // 分页
      pageNum: 1,
      formInline: {
        // 支付状态
        payStatus: "",
        // 充值单位
        companyName: ""
      },
      // 充值单位数据
      companyName: [],
      // 充值单位
      Pname: [],
      // 下拉框选择的数据
      companyNameData: "",
      // 查看审核信息对话框标题
      dialogText: "",
      // 查看审核信息对话框 默认隐藏
      dialogVisible: false,
      // 查看审核信息表单信息
      form: {
        // 之前余额
        beforeBalance: 0
      },
      // 被拒原因隐藏显示
      isShow: false,
      // 待审核隐藏显示
      isWait: false,
      // 物业信息
      companyData: {},
      projectData:[]
    };
  },
  created() {
    // 获取充值信息
    // this.getPropCompanyData()
    this.getRecordList();
    // this.getProjecData();
    this.getProjectList()
  },
  methods: {
    // 提取公用 获取充值记录列表信息
    getRecordList() {
      if (this.formInline.companyName == undefined) {
        this.formInline.companyName = "";
      }
      if (this.formInline.payStatus == undefined) {
        this.formInline.payStatus = "";
      }
      const page = {
        pcName: this.formInline.companyName,
        payStatus: this.formInline.payStatus,
        pageSize: this.pageSize,
        pageNum: this.pageNum
      };
      // console.log(page);

      queryFillingRecordList(page).then(xhrData => {
        if (xhrData.code === 200) {
          this.tableData = xhrData.data;
          this.totalNum = xhrData.totalRecord;
          const data = this.tableData;
          // 3 审核
          // 2 待审核
          // 1 充值成功
          for (var i = 0; i < data.length; i++) {
            // this.companyName[i].id = xhrData.data[i].id;

            // 支付状况
            if (data[i].payStatus == 1 && data[i].type == 1) {
              data[i].payStatus = "充值成功";
            } else if (data[i].payStatus == 1 && data[i].type == 0) {
              data[i].payStatus = "购买成功";
            } else if (data[i].payStatus == 2) {
              data[i].payStatus = "审核不通过";
            } else if (data[i].payStatus == 3) {
              data[i].payStatus = "待审核";
            }else if (data[i].payStatus == 4) {
              data[i].payStatus = "未支付";
            }
            // 交易类型
            if (data[i].type == 0) {
              data[i].type = "购买家财豆";
            } else if (data[i].type == 1) {
              data[i].type = "充值";
              // data[i].amount = Number(data[i].lowercaseAmount).toFixed(2);
              data[i].amount = Number(data[i].lowercaseAmount);
            }
            // 支付方式 payType 1 线下转账 2 微信支付 3 支付宝支付
            if (data[i].payType == 1) {
              data[i].payType = "线下转账";
            } else if (data[i].payType == 2) {
              data[i].payType = "微信支付";
            }else if (data[i].payType == 3) {
              data[i].payType = "支付宝支付";
            }
          }
          this.companyName = xhrData.data.map(obj => {
            return {
              name: obj.companyName,
              id: obj.id
            };
          });
        }
      });
    },
    // // 获取小区信息
    // getProjecData() {
    //   getProjectRoleList().then(xhrData => {
    //     if (xhrData.code === 200) {
    //       this.Pname = xhrData.rows;
    //       this.$nextTick(() => {
    //         this.Pname.unshift({
    //           name: this.companyData.name
    //         });
    //       });
    //     }
    //   });
    // },
    // // 获取物业信息
    // getPropCompanyData() {
    //   getPropCompany().then(xhrData => {
    //     if (xhrData.code === 200) {
    //       this.companyData = xhrData.data;
    //     }
    //   });
    // },
    // 获取物业公司信息与项目公司信息
    async getProjectList() {
      const _this = this;
      const page = {
        pageNum: 1,
        pageSize: 99999
      };
      const userResp = await getPropCompany();
      const reposResp = await getProjectRoleList(page);
      if (userResp.code === 200) {
        let arr1 = [];
        arr1.push(userResp.data);
        _this.projectData[0] = {
          name: "物业类型",
          arr: arr1
        };
      }
      if (reposResp.code === 200) {
        _this.projectData[1] = {
          name: "项目类型",
          arr: reposResp.rows
        };
      }
      
      this.$forceUpdate();
    },

    // 查询
    onSubmit() {
      this.getRecordList();
    },
    // 关闭查看审核对话框
    closeDialog() {
      // 清空表单信息
      this.form = {};
    },
    // 查看当前信息
    seeInformation(row) {
      // 清空表单信息 默认进来之前没有表单信息
      this.form = {};
      // console.log(row);
      // 打开查看审核对话框
      this.dialogVisible = true;
      // 赋值到标题
      this.dialogText = row.payStatus;
      // 赋值到表单
      this.form = row;
      // if (this.form.type == "充值") {
      //   this.form.beforeBalance = this.form.beforeBalance.toFixed(2);
      // }

      // 判断查看状态
      if (row.payStatus == "待审核") {
        // 隐藏审核时间
        this.isWait = false;
      } else {
        // 显示审核时间
        this.isWait = true;
      }
      if (row.payStatus == "审核不通过") {
        // 显示被拒原因
        this.isShow = true;
      } else {
        // 隐藏被拒原因
        this.isShow = false;
      }
    },
    handleSizeChange(val) {
      // 注意：在改变每页显示的条数时，要将页码显示到第一页
      this.pageNum = 1;
      // 改变每页显示的条数
      this.pageSize = val;
      this.getRecordList();
    },
    handleCurrentChange(val) {
      // 改变默认的页数
      this.pageNum = val;
      this.getRecordList();
    },
    // 下拉框选择触发
    currentSel(val) {
      // this.formInline.companyName = val.name;
      // this.getPropCompanyData();
      this.getRecordList();
    },
    // 充值凭证
    voucher(row) {
      this.$router.push({ path: "/voucher", query: { id: row.id } });
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
<template>
  <!-- 我的 -->
  <div class="my">
    <div class="my-conter">
      <div class="my-conter-wrap">
        <!-- <div class="my-conter-top">
          <div class="my-conter-left">
            <div class="my-conter-left-img"></div>
            <div class="my-conter-left-title">
              <h2>用户名</h2>
              <h3>管理员</h3>
              <p>
                <span>姓名</span>
                <span>张倪</span>
              </p>
              <p>
                <span>手机</span>
                <span>13788889999</span>
              </p>
              <p>
                <span>所属物业</span>
                <span>广州碧桂园物业管理有限公司</span>
              </p>
              <p>
                <span>所管项目</span>
                <span>广州碧桂园物业管理</span>
              </p>
            </div>
          </div>
          <a href="javascript:;" class="my-conter-right">修改</a>
        </div>-->
        <div class="my-conter-main">
          <!-- 我的待办 -->
          <div class="my-agency">
            <h2>我的待办</h2>
            <el-table :data="agencyData" style="width: 100%">
              <el-table-column type="index" prop="date" label="序号" width="80" align='center'></el-table-column>
              <el-table-column prop="title" label="标题" min-width="120px"></el-table-column>
              <el-table-column prop="createTime" label="申报时间" min-width="180px"></el-table-column>
              <el-table-column prop="nickName" label="申请人" min-width="120px"></el-table-column>
              <el-table-column prop="status" label="状态" min-width="80px"></el-table-column>
              <el-table-column label="操作" min-width="100px">
                <template slot-scope="scope">
                  <a href="javascript:;" @click="openSee(scope.row)">查看</a>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              class="pagination1"
              @size-change="handleSizeChange1"
              @current-change="handleCurrentChange1"
              :current-page="pageNum1"
              :page-sizes="[5, 10, 15, 20]"
              :page-size="pageSize1"
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalNum1"
            ></el-pagination>
          </div>
          <!-- 我的申请 -->
          <!-- <div class="my-apply">
            <h2>我的申请</h2>
            <el-table  style="width: 100%">
              <el-table-column type="index" prop="date" label="序号" width="100"></el-table-column>
              <el-table-column prop="title" label="标题" min-width="50%"></el-table-column>
              <el-table-column prop="createTime" label="申报时间" min-width="30%"></el-table-column>
              <el-table-column prop="status" label="状态" min-width="20%"></el-table-column>
            </el-table>
          </div>-->
        </div>
      </div>
      <!-- 对话框 -->
      <el-dialog width="70%" id="my-dialog" :title="titleName" :visible.sync="dialogFormVisible">
        <!-- 充值 -->
        <div v-if="isShow1">
          <el-table id="dialogData" :data="dialogData" style="width: 100%">
            <el-table-column prop="orderId" label="订单号" min-width="20%"></el-table-column>
            <el-table-column prop="pName" label="充值单位" min-width="15%"></el-table-column>
            <el-table-column prop="amount" label="充值金额" min-width="10%"></el-table-column>
            <el-table-column prop="createTime" label="操作时间" min-width="15%"></el-table-column>
            <el-table-column prop="username" label="操作用户" min-width="10%"></el-table-column>
            <el-table-column prop="phonenumber" label="联系方式" min-width="10%"></el-table-column>
            <el-table-column prop="payTypeName" label="支付方式" min-width="10%"></el-table-column>
          </el-table>
          <p>充值总额:{{totalAmount}}元</p>
        </div>
        <!-- 注册 -->
        <div v-if="isShow2" class="my-register">
          <p>
            <span>公司名称</span>
            <span>{{registerData.name}}</span>
          </p>
          <!-- <p>
            <span>公司电话</span>
            <span>{{registerData.contactNo}}</span>
          </p>-->
          <p>
            <span>登录账号</span>
            <span>{{registerData.userName}}</span>
          </p>
          <p>
            <span>联系人</span>
            <span>{{registerData.contact}}</span>
          </p>
          <p>
            <span>手机号</span>
            <span>{{registerData.contactNo}}</span>
          </p>
        </div>
        <div slot="footer" class="dialog-footer">
          <a href="javascript:;" class="my-btn btn1" @click="adopt">审核通过</a>
          <a href="javascript:;" class="my-btn btn3" @click="pass">审核不通过</a>
          <a href="javascript:;" class="my-btn btn2" @click="dialogFormVisible = false;">返 回</a>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  myCenterQueryWaitAuditList,
  myCenterQueryWaitAuditDetail,
  financeAuditFilling,
  myCenterSaveRegisterAudit,
  myCenterQueryMyApplyList
} from "@/api/information/information";
export default {
  name: "my",
  data() {
    return {
      // 待办信息
      agencyData: [],
      // 待办信息 分页
      pageNum1: 1,
      pageSize1: 10,
      totalNum1: 0,
      // 对话框展示
      dialogFormVisible: false,
      // 标题名字
      titleName: "",
      // 对话框 充值表格数据
      dialogData: [],
      // 对话框 注册信息
      registerData: {},
      // 充值总额
      totalAmount: "",
      // 充值申请id
      rechargeId: "",
      // 是否显示
      // 充值
      isShow1: false,
      // 注册
      isShow2: false,
      // 注册id
      registerId: ""
    };
  },
  created() {
    // 获取待办信息
    this.getMyCenter();
    // 获取我的申请
    this.getMyApplyList();
  },
  methods: {
    // 获取我的申请
    getMyApplyList() {
      myCenterQueryMyApplyList().then(xhrData => {
        if (xhrData.code === 200) {
        }
      });
    },
    // 获取我的待办信息
    getMyCenter() {
      const page = {
        pageNum: this.pageNum1,
        pageSize: this.pageSize1
      };
      myCenterQueryWaitAuditList(page).then(xhrData => {
        if (xhrData.code === 200) {
          this.agencyData = xhrData.rows;
          this.totalNum1 = xhrData.total;
        }
      });
    },
    // 查看
    openSee(row) {
      // 显示对话框
      this.dialogFormVisible = true;
      this.titleName = row.title;
      // type = 2 充值申请接口
      // type = 1 注册申请
      if (row.type == "2") {
        this.isShow1 = true;
        this.isShow2 = false;
        const data = {
          userId: row.userId,
          type: row.type
        };
        const arr = [];
        myCenterQueryWaitAuditDetail(data).then(xhrData => {
          if (xhrData.code === 200) {
            for (let i = 0; i < xhrData.data.list.length; i++) {
              arr.push(xhrData.data.list[i].id);
            }
            this.rechargeId = arr.join(",");
            this.dialogData = xhrData.data.list;
            this.totalAmount = Number(xhrData.data.totalAmount).toFixed(2);
          }
        });
      } else if (row.type == "1") {
        this.isShow1 = false;
        this.isShow2 = true;
        this.registerId = row.id;
        const data = {
          userId: row.userId,
          type: row.type
        };
        myCenterQueryWaitAuditDetail(data).then(xhrData => {
          if (xhrData.code === 200) {
            this.registerData = xhrData.data;
          }
        });
      }
    },
    // 通过按钮
    adopt() {
      if (this.titleName == "充值申请") {
        const data = {
          ids: this.rechargeId,
          status: 1
        };
        // 请求 充值审核
        financeAuditFilling(data).then(xhrData => {
          if (xhrData.code === 200) {
            this.$message.success({
              message: "审核成功!"
            });
          }
          // 更新页面
          this.getMyCenter();
          // 关闭对话框
          this.dialogFormVisible = false;
        });
      } else if (this.titleName == "注册申请") {
        const data = {
          id: this.registerId,
          status: 0
        };
        myCenterSaveRegisterAudit(data).then(xhrData => {
          if (xhrData.code === 200) {
            this.$message.success({
              message: "审核成功!"
            });
          }
          // 更新页面
          this.getMyCenter();
          // 关闭对话框
          this.dialogFormVisible = false;
        });
      }
    },
    // 不通过按钮
    pass() {
      if (this.titleName == "充值申请") {
        const data = {
          ids: this.rechargeId,
          status: 2
        };
        // 请求 充值审核
        financeAuditFilling(data).then(xhrData => {
          if (xhrData.code === 200) {
            this.$message.success({
              message: "审核不通过成功!"
            });
          }
          // 更新页面
          this.getMyCenter();
          // 关闭对话框
          this.dialogFormVisible = false;
        });
      } else if (this.titleName == "注册申请") {
        const data = {
          id: this.registerId,
          status: 1
        };
        myCenterSaveRegisterAudit(data).then(xhrData => {
          if (xhrData.code === 200) {
            this.$message.success({
              message: "审核不通过成功!"
            });
          }
          // 更新页面
          this.getMyCenter();
          // 关闭对话框
          this.dialogFormVisible = false;
        });
      }
    },
    // 每页显示的条数
    handleSizeChange1(val) {
      // 注意：在改变每页显示的条数时，要将页码显示到第一页
      this.pageNum1 = 1;
      // 改变每页显示的条数
      this.pageSize1 = val;
      // 点击每页显示的条数时，显示第一页
      this.getMyCenter();
    },
    handleCurrentChange1(val) {
      // 改变默认的页数
      this.pageNum1 = val;
      // 切换页码时，要获取每页显示的条数
      this.getMyCenter();
    }
  }
};
</script>
<style>
#my-dialog .el-dialog__header {
  background-color: #e6e8eb;
}
#my-dialog .my-btn {
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
#my-dialog .my-btn.btn1 {
  background: rgba(239, 130, 0, 1);
  border: 1px solid rgba(206, 112, 0, 1);
  color: #fff;
}
#my-dialog .my-btn.btn2 {
  border: 1px solid rgba(0, 0, 0, 0.25);
}
#my-dialog .my-btn.btn3 {
  background: #f56c6c;
  border: 1px solid #f56c6c;
  color: #fff;
}
#my-dialog .el-dialog__title {
  font-size: 20px;
  font-weight: bold;
}
#my-dialog .el-dialog__body {
  padding-left: 40px;
  padding-right: 40px;
  padding-bottom: 0;
  box-sizing: border-box;
}
#my-dialog .el-dialog__footer {
  background-color: #e6e8eb;
}
#my-dialog p {
  padding-bottom: 20px;
  padding-top: 20px;
  font-size: 14px;
  font-weight: bold;
  /* text-align: center;   */
}
#my-dialog .my-register {
  width: 50%;
  margin: 0 auto;
  padding-bottom: 25px;
}
#my-dialog .my-register p {
  font-size: 16px;
  color: #6c6c6c;
  display: flex;
}
#my-dialog .my-register p span {
  display: inline-block;
  text-align: center;
}
#my-dialog .my-register p span:nth-child(1) {
  width: 200px;
}
#my-dialog .my-register p span:nth-child(2) {
  width: 400px;
}
</style>
<style>
</style>
<style lang="scss" scoped>
* {
  padding: 0;
  margin: 0;
}
.my {
  width: 100%;
  padding: 15px;
  min-height: calc(88vh);
  box-sizing: border-box;
  background-color: #e6e8eb;
  padding-bottom: 30px;
  .my-conter {
    min-height: calc(88vh);
    background-color: #fff;
    padding: 50px;
    box-sizing: border-box;
    border-radius: 5px;
    .my-conter-wrap {
      .my-conter-top {
        display: flex;
        justify-content: space-between;
        padding-bottom: 30px;
        border-bottom: 1px solid #ddd;
        .my-conter-left {
          display: flex;
          .my-conter-left-img {
            width: 56px;
            height: 56px;
            background-color: #666;
            img {
              width: 100%;
              height: 100%;
            }
          }
          .my-conter-left-title {
            margin-left: 30px;
            h2 {
              font-size: 18px;
            }
            h3 {
              font-size: 16px;
              font-weight: normal;
              margin-top: 20px;
              color: #888888;
              padding-bottom: 20px;
            }
            p {
              display: flex;
              color: #888888;
              margin-top: 25px;
              // span {
              // }
              // span:nth-child(1) {
              //   width: 100px;
              // }
              // span:nth-child(2) {
              // }
            }
          }
        }
        .my-conter-right {
          color: #359eff;
          display: block;
          height: 20px;
        }
      }
      .my-conter-main {
        .my-agency,
        .my-apply {
          h2 {
            font-size: 18px;
            // margin-top: 50px;
            padding-bottom: 20px;
          }
          .pagination1 {
            margin-top: 20px;
          }
        }
        // .my-apply {
        // }
      }
    }
    #dialogData {
      padding-bottom: 40px;
    }
  }
}
</style>
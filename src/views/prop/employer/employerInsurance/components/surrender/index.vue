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
          <el-form-item label="雇员姓名:">
            <el-input @keyup.enter.native="query" v-model.trim="formInline.name" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="审核状态:">
            <el-select @change="query" clearable v-model="formInline.state" placeholder="请选择">
              <el-option label="退保中" value="0"></el-option>
              <el-option label="已退保" value="1"></el-option>
              <el-option label="退保失败" value="2"></el-option>
              <el-option label="已重新提交" value="4"></el-option>
              <!-- <el-option label="已过期" value="3"></el-option> -->
            </el-select>
          </el-form-item>
          <el-form-item label="项目名称:">
            <el-input
              @keyup.enter.native="query"
              v-model.trim="formInline.projectName"
              placeholder="请输入"
            ></el-input>
            <!-- <el-select @change="query" clearable v-model="formInline.state" placeholder="请选择">
              <el-option label="申报中" value="0"></el-option>
              <el-option label="批改成功" value="1"></el-option>
            </el-select>-->
            <!-- projectName -->
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
            <el-button
            v-if="obj.state == '1'"
              type="primary"
              plain
              @click="replaceBtn"
              v-hasPermi="['ins:emp:manage:return:add']"
            >退保</el-button>
            <el-button type="info" plain @click="revert">返回</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!-- 审核列表 -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="index" label="序号" width="80"></el-table-column>
      <el-table-column prop="orderNo" show-overflow-tooltip label="订单号" min-width="200px"></el-table-column>
      <el-table-column prop="projectName" show-overflow-tooltip label="项目名称" min-width="180px"></el-table-column>
      <el-table-column prop="name" show-overflow-tooltip label="雇员姓名" min-width="80px"></el-table-column>
      <el-table-column prop="idCard" show-overflow-tooltip label="雇员身份证" min-width="180px"></el-table-column>
      <el-table-column prop="phone" show-overflow-tooltip label="雇员手机号" min-width="120px"></el-table-column>
      <el-table-column prop="state" show-overflow-tooltip label="审核状态" min-width="100px">
        <template slot-scope="scope">{{handleState(scope.row.state)}}</template>
      </el-table-column>
      <el-table-column prop="createTime" show-overflow-tooltip label="创建时间" min-width="180px"></el-table-column>
      <el-table-column label="操作" min-width="180px">
        <template slot-scope="scope">
          <!-- <div>
            <a
              href="javascript:;"
              style="margin-right:3px; color: #1890ff;"
              @click="see(scope.row)"
            >查看</a>
          </div>-->
          <el-button size="mini" type="text" icon="el-icon-view" @click="see(scope.row)">查看</el-button>
          <el-button
            v-if="scope.row.state == '2'|| scope.row.state == '4'"
            size="mini"
            type="text"
            icon="el-icon-folder-delete"
            @click="failure(scope.row)"
          >失败原因</el-button>
          <!-- <el-button
              size="mini"
              type="text"
              icon="el-icon-tickets"
              @click="policy(scope.row)"
          >电子保单</el-button>-->
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
    <!--  对话框 -->
    <el-dialog
      :title="titleName"
      class="seeDialog"
      :visible.sync="dialogVisible"
      width="600px"
      @close="closeDialog"
    >
      <p style="padding-bottom:15px">说明：请仔细核对信息后提交申请</p>
      <el-form ref="form" :rules="rules" :model="form" label-width="100px">
        <el-form-item prop="name" label="姓名：">
          <el-select
            v-model="form.name"
            filterable
            remote
            placeholder="请输入关键词"
            @change="getNameData"
            :remote-method="remoteMethod"
            :loading="loading"
            value-key="id"
          >
            <el-option v-for="item in options" :key="item.value" :label="item.name" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属项目：">
          <el-input disabled v-model="projectName"></el-input>
        </el-form-item>
        <el-form-item label="身份证：">
          <el-input disabled v-model="idCard"></el-input>
        </el-form-item>
        <el-form-item label="手机：">
          <el-input disabled v-model="phone"></el-input>
        </el-form-item>
        <el-form-item label="工种：">
          <el-input disabled v-model="jobName"></el-input>
        </el-form-item>
        <!-- <el-form-item prop="startTime" label="退保期限：">
          <el-date-picker
            style="width:45%"
            @change="validityTerm"
            v-model="form.startTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            :picker-options="expireTimeOption"
          ></el-date-picker>
          <span>至</span>
          <el-input style="width:45%" disabled v-model="time.endTime"></el-input>
        </el-form-item>-->
        <!--  -->
        <el-form-item prop="startTime" label="退保期限：">
          <el-input style="width:45%" disabled v-model="lkStartTime"></el-input>
          <span>至</span>
          <el-input style="width:45%" disabled v-model="time.endTime"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <a href="javascript:;" class="btn btn1" style="width:110px" @click="surrender">提交退保申请</a>
        <a href="javascript:;" class="btn btn2" @click="dialogVisible=false">取 消</a>
      </span>
    </el-dialog>
    <!-- 查看 对话框 -->
    <el-dialog title="查看详情" class="seeDialog" :visible.sync="dialogVisible2" width="600px">
      <p style="padding-bottom:15px">审核时间：{{seeForm.time}}</p>
      <el-form ref="seeForm" :model="seeForm" label-width="100px">
        <el-form-item label="姓名：">
          <el-input disabled v-model="seeForm.name"></el-input>
        </el-form-item>
        <el-form-item label="所属项目：">
          <el-input disabled v-model="seeForm.projectName"></el-input>
        </el-form-item>
        <el-form-item label="身份证：">
          <el-input disabled v-model="seeForm.idCard"></el-input>
        </el-form-item>
        <el-form-item label="手机：">
          <el-input disabled v-model="seeForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="工种：">
          <el-input disabled v-model="seeForm.jobName"></el-input>
        </el-form-item>
        <el-form-item label="退保期限：">
          <el-input style="width:45%" disabled v-model="seeForm.startTime"></el-input>
          <span>至</span>
          <el-input style="width:45%" disabled v-model="seeForm.endTime"></el-input>
        </el-form-item>
        <!--  -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <a href="javascript:;" class="btn btn2" @click="dialogVisible2=false">取 消</a>
      </span>
    </el-dialog>
    <!-- <printf-template1 style="display: none"></printf-template1>
    <printf-template2 style="display: none"></printf-template2>-->
    <printf-template1 :printData="printData" :list="list" style="display: none"></printf-template1>
    <printf-template2 :printData="printData" :list="list" style="display: none"></printf-template2>
    <!-- 失败原因对话框 -->
    <el-dialog title="失败原因" id="failureDialog" :visible.sync="dialogFormVisible" width="400px">
      <h3>{{failureTitle}}</h3>
      <span slot="footer" class="dialog-footer">
        <a href="javascript:;" class="btn btn1" @click="again" v-if="!isShowBtn">重新提交</a>
        <a href="javascript:;" class="btn btn2" @click="dialogFormVisible = false">取 消</a>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  insEmpApplyManageReturnList,
  insEmpApplyManageReturnAllow,
  insEmpApplyManageReturn,
  getPropCompany,
  insEmpApplyManageReturnAgain
} from "@/api/information/information";
import PrintfTemplate1 from "./print/template1";
import PrintfTemplate2 from "./print/template2";
export default {
  name: "insurance-added-list",
  props: ["obj"],
  components: { PrintfTemplate1, PrintfTemplate2 },
  data() {
    return {
      // 失败原因
      failureTitle: "",
      // 失败原因对话框
      dialogFormVisible: false,
      lkStartTime: "",
      dialogVisible2: false,
      expireTimeOption: this.disabledDate1(),
      dialogVisible: false,
      formInline: {},
      tableData: [{ certNo: "123" }],
      // 总条数
      totalNum: 1,
      // 显示条数
      pageSize: 10,
      // 显示页数
      // 分页
      pageNum: 1,
      dialogData: [],
      titleName: "",
      form: {
        startTime: "",
        name: ""
      },
      // 表单验证
      rules: {
        name: [{ required: true, message: "请选择名字", trigger: "change" }]
        // startTime: [
        //   {
        //     required: true,
        //     message: "请选择日期",
        //     trigger: "change"
        //   }
        // ]
      },
      options: [],
      list: [],
      loading: false,
      states: [],
      // 所属项目
      projectName: "",
      // 身份证
      idCard: "",
      // 手机
      phone: "",
      // 工种
      jobName: "",
      time: {
        // 结束时间
        endTime: "",
        // 开始时间
        startTime: ""
      },
      // 保存 投保规则时间段内可投保时间戳开始
      startTimeStamp: "",
      // 保存 投保规则时间段内可投保时间戳结束
      endTimeStamp: "",
      seeForm: {
        name: "",
        projectName: "",
        idCard: "",
        phone: "",
        jobName: "",
        startTime: "",
        endTime: "",
        time: ""
      },
      // 打印数据
      printData: {},
      list: [],
      // 保存当前行id
      applyId: "",
      // 已重新提交隐藏
      isShowBtn:false
    };
  },
  created() {
    // console.log(this.obj, "id");
    this.getList();
  },
  mounted() {},
  methods: {
    // 列表
    getList() {
      let page;
      // applyId 获取携带过来的当前id 或者 新增成功后返回的id
      if (
        this.formInline.createTime == "" ||
        this.formInline.createTime == null
      ) {
        page = {
          applyId: this.obj.id,
          pageSize: this.pageSize,
          pageNum: this.pageNum,
          name: this.formInline.name,
          projectName: this.formInline.projectName,
          state:
            this.formInline.state == ""
              ? (this.formInline.state = null)
              : this.formInline.state,
          beginTime: "",
          endTime: ""
        };
      } else {
        page = {
          applyId: this.obj.id,
          pageSize: this.pageSize,
          pageNum: this.pageNum,
          name: this.formInline.name,
          projectName: this.formInline.projectName,
          state:
            this.formInline.state == ""
              ? (this.formInline.state = null)
              : this.formInline.state,
          // 开始时间
          beginTime: this.formInline.createTime[0] + " 00:00:00",
          // 结束时间
          endTime: this.formInline.createTime[1] + " 23:59:59"
        };
      }
      insEmpApplyManageReturnList(page).then(xhrData => {
        if (xhrData.code === 200) {
          this.tableData = xhrData.rows;
          // this.tableData.forEach(item=>{
          //   console.log(item);
            
          // })
          this.totalNum = xhrData.total;
        }
      });
    },
    // 查询
    query() {
      this.getList();
    },
    // 返回
    revert() {
      this.$emit("changePage", "LIST");
    },
    // 退保申请
    surrender() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          // const data = {
          //   id: this.form.name.id,
          //   // startTime: this.form.startTime + " 00:00:00",
          //   // endTime: this.time.endTime + " 23:59:59"
          // };
          // console.log(data);
          // 开启加载动画
          const loading = this.$loading({
            lock: true,
            text: "退保中,请等待...",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)"
          });
          insEmpApplyManageReturn(this.form.name.id)
            .then(xhrData => {
              if (xhrData.code === 200) {
                this.$message({
                  message: "退保成功！",
                  type: "success"
                });
                // 关闭加载动画
                loading.close();
                // 更新页面
                this.getList();
                // 还原
                this.reduction();
                this.remoteMethod();
                this.lkStartTime = "";
                // 关闭对话框
                this.dialogVisible = false;
                // 清空表单验证
                this.$refs["form"].resetFields();
              }
            })
            .catch(() => {
              // 关闭加载动画
              loading.close();
            });
        } else {
          // console.log("error submit!!");
          this.$message({
            message: "请完善信息！",
            type: "warning"
          });
          return false;
        }
      });
    },
    // 退保按钮
    replaceBtn() {
      this.form.startTime = "";
      this.time.endTime = "";
      this.reduction();
      //   this.$emit("changePage2", "ADD");
      this.dialogVisible = true;
      // 标题
      this.titleName = "人员退保";
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
    // 查看
    see(row) {
      // console.log(row);
      this.dialogVisible2 = true;
      this.seeForm.name = row.name;
      this.seeForm.projectName = row.projectName;
      this.seeForm.idCard = row.idCard;
      this.seeForm.phone = row.phone;
      this.seeForm.jobName = row.jobName;
      if (row.startTime == undefined) {
        row.startTime = "";
      }
      if (row.endTime == undefined) {
        row.endTime = "";
      }
      this.seeForm.startTime = row.startTime.split(" ")[0];
      this.seeForm.endTime = row.endTime.split(" ")[0];
      this.seeForm.time = row.createTime;
    },
    // 失败原因 按钮
    failure(row) {
      // console.log(row);
      if(row.state == 4){
        this.isShowBtn = true
      }else{
        this.isShowBtn = false
      }
      
      this.dialogFormVisible = true;
      // 失败原因
      this.failureTitle = row.message;
      // 保存当前id
      this.applyId = row.id;
    },
    // 重新提交
    again() {
      insEmpApplyManageReturnAgain(this.applyId).then(xhrData => {
        if (xhrData.code === 200) {
          this.$message.success("提交成功");
          // 更新列表数据
          this.getList();
          // 关闭对话框
          this.dialogFormVisible = false;
        }
      });
    },
    // 搜索查询下拉框
    async remoteMethod(query) {
      // console.log(query);
      this.loading = true;
      this.options = [];
      if (query !== "") {
        const page = {
          applyId: this.addedId || this.obj.id,
          pageNum: 1,
          pageSize: 99999,
          name: query
        };

        let xhrData = await insEmpApplyManageReturnAllow(page);
        if (xhrData.code === 200) {
          this.states = xhrData.rows;
        }

        
        this.list = this.states.map(item => {
          return { value: `${item.id}`, label: `${item.name}` };
        });

        setTimeout(() => {
          this.loading = false;
          this.options = this.states;
        }, 200);
      } else {
        this.options = [];
      }
    },
    // 根据时间
    // 保障周期时间
    validityTerm(val) {
      var date = new Date(val);
      date.setFullYear(date.getFullYear() + 1);
      date.setDate(date.getDate() + 1);
      // console.log(date);
      const d = new Date(date);
      const resDate =
        d.getFullYear() +
        "-" +
        this.p(d.getMonth() + 1) +
        "-" +
        this.p(d.getDate());
      return resDate;
    },
    // 提取公用
    p(s) {
      return s < 10 ? "0" + s : s;
    },
    // 下拉选择名字获取信息
    getNameData(val) {
      // console.log(val);
      this.projectName = val.projectName;
      this.idCard = val.idCard;
      this.phone = val.phone;
      this.jobName = val.jobName;
      if (val.endTime != null) {
        this.time.endTime = val.endTime.split(" ")[0];
      }
      if (val.startTime != null) {
        this.time.startTime = val.startTime.split(" ")[0];
      }
      let startTime = new Date(this.time.startTime);
      let endTime = new Date(this.time.endTime);
      let startTimeStamp = startTime.getTime(startTime);
      let endTimeStamp = endTime.getTime(endTime);
      // this.startTimeStamp = startTimeStamp;
      this.endTimeStamp = endTimeStamp;
      // 当前时间1
      const start1 = new Date(new Date().toLocaleDateString()).getTime();
      // 例 2020-05-06 转换为 2020/5/6
      let nueStartTime = this.time.startTime.replace(/-0*/g,'\/')
      const start2 = new Date(nueStartTime).getTime()
      // 当前时间 yyyymmdd  当前时间第二天起
      let current = this.validityTerm(start1);
      // 在保期间 若 当前时间大于在保期间起始时间 使用当前时间
      if (start1 >= start2) {
        // this.startTimeStamp = start
        this.lkStartTime = current;
      } else {
        // this.startTimeStamp = startTimeStamp
        this.lkStartTime = this.time.startTime;
      }
    },
    // 时间控件规则 指定某天内开始选择
    disabledDate1() {
      let _this = this;
      return {
        disabledDate(date) {
          return (
            date.getTime() <= _this.startTimeStamp ||
            date.getTime() >= _this.endTimeStamp
          );
        }
      };
    },
    // 还原
    reduction() {
      // 所属项目
      (this.projectName = ""),
        // 身份证
        (this.idCard = ""),
        // 手机
        (this.phone = ""),
        // 工种
        (this.jobName = ""),
        (this.time = {
          // 结束时间
          endTime: "",
          // 开始时间
          startTime: ""
        });
      // 保存 投保规则时间段内可投保时间戳开始
      (this.startTimeStamp = ""),
        // 保存 投保规则时间段内可投保时间戳结束
        (this.endTimeStamp = "");
      this.form = {
        startTime: "",
        name: ""
      };
    },
    // 关闭对话框
    closeDialog() {
      // 清空表单验证
      this.$refs["form"].resetFields();
      this.form.name = "";
      this.options = [];
      this.lkStartTime = "";
    },
    handleState(state) {
      // 状态 0：退保中  1：已退保 2：退保失败 3：已过期
      if (state == "0") {
        return (state = "退保中");
      } else if (state == "1") {
        return (state = "已退保");
      } else if (state == "2") {
        return (state = "退保失败");
      } else if (state == "3") {
        return (state = "已过期");
      }else if (state == "4") {
        return (state = "已重新提交");
      }
    },
    async policy(row) {
      let PropCompany = await getPropCompany();
      if (PropCompany.code === 200) {
        this.printData.PropCompanyName = PropCompany.data.name;
      }
      this.orderNo = row.orderNo;
      this.printData.policyNo = row.policyNo; // 保单号
      this.printData.reviseNo = row.reviseNo; // 批单号
      this.printData.startTime = row.startTime; // 投保开始时间
      this.printData.endTime = row.endTime; // 投保结束时间
      this.printData.beforeNum = row.beforeNum; // 变更前
      this.printData.afterNum = row.afterNum; // 变更后
      this.list.push({
        name: row.name,
        idCard: row.idCard,
        jobName: row.jobName,
        startTime: row.startTime,
        endTime: row.endTime
      });
      // 保险公司code
      // 富德
      if (row.insCompCode == "CNFD") {
        setTimeout(() => {
          this.htmlToPrint1();
        }, 100);
      }
      // 国寿财
      else if (row.insCompCode == "CNGC") {
        setTimeout(() => {
          this.htmlToPrint2();
        }, 100);
      }
      // this.htmlToPrint1()
    },
    // 打印投保明细
    htmlToPrint1() {
      // console.log(document.getElementById("abc").innerHTML);
      let CSS_PRINT =
        "<style>" +
        document.getElementById("CSS_PRINT1").innerHTML +
        "</style>";
      let HTML_PRINT = document.getElementById("printf-box1").outerHTML;
      // SCRIPT_PRINT1
      let SCRIPT_PRINT =
        "<script>" +
        document.getElementById("SCRIPT_PRINT1").innerHTML +
        "</" +
        "script>";
      let HTML = CSS_PRINT + HTML_PRINT + SCRIPT_PRINT;
      var win = window.open("");
      win.document.write(HTML);
    },
    // 打印投保明细
    htmlToPrint2() {
      // console.log(document.getElementById("abc").innerHTML);
      let CSS_PRINT =
        "<style>" +
        document.getElementById("CSS_PRINT2").innerHTML +
        "</style>";
      let HTML_PRINT = document.getElementById("printf-box2").outerHTML;
      // SCRIPT_PRINT1
      let SCRIPT_PRINT =
        "<script>" +
        document.getElementById("SCRIPT_PRINT2").innerHTML +
        "</" +
        "script>";
      let HTML = CSS_PRINT + HTML_PRINT + SCRIPT_PRINT;
      var win = window.open("");
      win.document.write(HTML);
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
  /* padding: 0 15px; */
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
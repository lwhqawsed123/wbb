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
              <el-option label="申报中" value="0"></el-option>
              <el-option label="批改成功" value="1"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="创建时间:">
            <el-date-picker
              @change="query"
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
            <!-- ins:emp:custom:manage:replace:add -->
            <el-button
            v-if="obj.state =='在保'"
              type="primary"
              plain
              @click="replaceBtn"
              v-hasPermi="['ins:emp:custom:manage:replace:add']"
            >替换</el-button>
            <el-button type="info" plain @click="revert">返回</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!-- 审核列表 -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column prop="orderNo" show-overflow-tooltip label="订单号" min-width="200px"></el-table-column>
      <el-table-column prop="oldName" show-overflow-tooltip label="原雇员姓名" min-width="100px"></el-table-column>
      <el-table-column prop="oldIdCard" show-overflow-tooltip label="原雇员身份证" min-width="180px"></el-table-column>
      <el-table-column prop="oldPhone" show-overflow-tooltip label="原雇员手机号" min-width="150px"></el-table-column>
      <el-table-column prop="name" show-overflow-tooltip label="雇员姓名" min-width="100px"></el-table-column>
      <el-table-column prop="idCard" show-overflow-tooltip label="雇员身份证" min-width="180px"></el-table-column>
      <el-table-column prop="state" show-overflow-tooltip label="审核状态" min-width="100px"></el-table-column>
      <el-table-column prop="createTime" show-overflow-tooltip label="创建时间" min-width="200px"></el-table-column>
      <el-table-column label="操作" min-width="200px">
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
      @close="closeDialog"
      :title="titleName"
      class="seeDialog"
      :visible.sync="dialogVisible"
      width="600px"
    >
      <p>说明：请仔细核对信息后提交申请</p>
      <el-form ref="form" :rules="rules" :model="form" label-width="100px">
        <h3 style="padding:10px 0;">变更前</h3>
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
          <el-input disabled v-model="compProjectName"></el-input>
        </el-form-item>
        <el-form-item label="身份证：">
          <el-input disabled v-model="idCard"></el-input>
        </el-form-item>
        <el-form-item label="手机：">
          <el-input disabled v-model="phone"></el-input>
        </el-form-item>
        <el-form-item label="社保：">
          <el-input disabled v-model="isSocialSecurity"></el-input>
        </el-form-item>
        <h3 style="padding:10px 0;">变更后</h3>
        <el-form-item prop="afterName" label="姓名：">
          <el-input v-model.trim="form.afterName"></el-input>
        </el-form-item>
        <el-form-item prop="afterProject" label="所属项目:">
          <!-- <el-select v-model="form.afterProject" placeholder="请选择" value-key="id">
            <el-option v-for="item in projectData" :key="item.id" :label="item.name" :value="item"></el-option>
          </el-select>-->
          <el-select
            value-key="name"
            style="width:250px"
            v-model="form.afterProject"
            placeholder="请选择"
          >
            <el-option-group v-for="item in projectData" :key="item.name" :label="item.name">
              <el-option
                v-for="item2 in item.arr"
                :key="item2.name"
                :label="item2.name"
                :value="item2"
              ></el-option>
            </el-option-group>
          </el-select>
        </el-form-item>
        <el-form-item prop="afterIdCard" label="身份证：">
          <el-input maxlength="18" v-model.trim="form.afterIdCard"></el-input>
        </el-form-item>
        <el-form-item prop="afterPhone" label="手机：">
          <el-input maxlength="11" v-model.trim="form.afterPhone"></el-input>
        </el-form-item>
        <el-form-item prop="afterIsSocialSecurity" label="社保：">
          <!-- <el-select style="width:100%" v-model="form.afterIsSocialSecurity" placeholder="请选择社保">
            <el-option label="无" value="0"></el-option>
            <el-option label="有" value="1"></el-option>
          </el-select>-->
          <el-switch
            class="switchStyle"
            v-model="form.afterIsSocialSecurity"
            active-color="#1890ff"
            active-text="有"
            inactive-color="#ddd"
            inactive-text="无"
          ></el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <a href="javascript:;" class="btn btn1" @click="apply">批单申请</a>
        <a href="javascript:;" class="btn btn2" @click="dialogVisible=false">取 消</a>
      </span>
    </el-dialog>
    <!-- 查看 对话框 -->
    <el-dialog title="查看详情" class="seeDialog" :visible.sync="dialogVisible2" width="600px">
      <el-form ref="seeForm" :model="seeForm" label-width="100px">
        <h3 style="padding:10px 0;">变更前</h3>
        <el-form-item label="姓名：">
          <el-input disabled v-model="seeForm.oldName"></el-input>
        </el-form-item>
        <el-form-item label="所属项目：">
          <el-input disabled v-model="seeForm.oldCompProjectName"></el-input>
        </el-form-item>
        <el-form-item label="身份证：">
          <el-input disabled v-model="seeForm.oldIdCard"></el-input>
        </el-form-item>
        <el-form-item label="手机：">
          <el-input disabled v-model="seeForm.oldPhone"></el-input>
        </el-form-item>
        <el-form-item label="社保：">
          <el-input disabled v-model="seeForm.oldIsSocialSecurity"></el-input>
        </el-form-item>
        <h3 style="padding:10px 0;">变更后</h3>
        <el-form-item label="姓名：">
          <el-input disabled v-model="seeForm.name"></el-input>
        </el-form-item>
        <el-form-item label="所属项目：">
          <el-input disabled v-model="seeForm.compProjectName"></el-input>
        </el-form-item>
        <el-form-item label="身份证：">
          <el-input disabled v-model="seeForm.idCard"></el-input>
        </el-form-item>
        <el-form-item label="手机：">
          <el-input disabled v-model="seeForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="社保：">
          <el-input disabled v-model="seeForm.isSocialSecurity"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <a href="javascript:;" class="btn btn2" @click="dialogVisible2=false">返 回</a>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 验证
import { ShiFanManShiBaSui, Identity, IdCard } from "@/validate/validate.js";
import {
  insEmpCustomApplyManageReplaceList,
  insEmpCustomApplyManageDetailList,
  // queryProjectList,
  getPropCompany,
  insEmpCustomApplyManageReplace,
  getProjectRoleList
} from "@/api/information/information";
export default {
  name: "insurance-added-list",
  props: ["obj2", "id",'obj'],
  data() {
    // 根据身份证判断是否成年
    var isAdult = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入身份证"));
      } else if (!Identity(value)) {
        callback(new Error("证件号码格式有误"));
      } else if (!ShiFanManShiBaSui(value)) {
        callback(new Error("未成年"));
      } else if (IdCard(value)) {
        callback(new Error("已超过70岁"));
      } else {
        callback();
      }
    };
    return {
      dialogVisible: false,
      dialogVisible2: false,
      formInline: {
        name: "",
        state: null,
        createTime: ""
      },
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
        name: ""
      },
      // 表单验证
      rules: {
        // 姓名 变更前
        name: [{ required: true, message: "请输入雇员姓名", trigger: "blur" }],
        // 被保险人
        afterName: [
          { required: true, message: "请输入雇员姓名", trigger: "blur" }
        ],
        // 身份证
        afterIdCard: [{ required: true, validator: isAdult, trigger: "blur" }],
        // 手机号
        afterPhone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            pattern: /^1(3|4|5|6|7|8|9)\d{9}$/,
            message: "手机号格式不对",
            trigger: "blur"
          }
        ],
        // // 社保
        // afterIsSocialSecurity: [
        //   { required: true, message: "请选择社保", trigger: "change" }
        // ],
        // 项目
        afterProject: [
          { required: true, message: "请选择项目", trigger: "change" }
        ]
      },
      options: [],
      list: [],
      loading: false,
      states: [],
      // 所属项目
      compProjectName: "",
      // 身份证
      idCard: "",
      // 手机
      phone: "",
      // 社保
      isSocialSecurity: "",
      projectData: [],
      seeForm: {}
    };
  },
  created() {
    this.getList();
    this.getProjectList();
  },
  methods: {
    // // 获取物业公司信息与项目公司信息
    // getProjectList() {
    //   const _this = this;
    //   const page = {
    //     pageNum: 1,
    //     pageSize: 99999
    //   };
    //   _this.$axios.all([queryProjectList(page), getPropCompany()]).then(
    //     _this.$axios.spread(function(userResp, reposResp) {
    //       // 上面两个请求都完成后，才执行这个回调方法
    //       if (userResp.code === 200 && reposResp.code === 200) {
    //         _this.projectData = userResp.data;
    //         _this.projectData.unshift(reposResp.data);
    //       }
    //     })
    //   );
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
    // 列表
    getList() {
      let page;
      // applyId 获取携带过来的当前id 或者 新增成功后返回的id
      if (
        this.formInline.createTime == "" ||
        this.formInline.createTime == null
      ) {
        page = {
          applyId: this.id,
          pageSize: this.pageSize,
          pageNum: this.pageNum,
          name: this.formInline.name,
          state:
            this.formInline.state == ""
              ? (this.formInline.state = null)
              : this.formInline.state,
          beginTime: "",
          endTime: ""
        };
      } else {
        page = {
          applyId: this.id,
          pageSize: this.pageSize,
          pageNum: this.pageNum,
          name: this.formInline.name,
          state:
            this.formInline.state == ""
              ? (this.formInline.state = null)
              : this.formInline.state,
          // // 开始时间
          beginTime: this.formInline.createTime[0] + " 00:00:00",
          // // 结束时间
          endTime: this.formInline.createTime[1] + " 23:59:59"
        };
      }
      // console.log(page);

      insEmpCustomApplyManageReplaceList(page).then(xhrData => {
        // console.log(xhrData);
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
      this.getList();
    },
    // 返回
    revert() {
      this.$emit("changePage2", "REVERT");
    },
    // 批单申请
    apply() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          const data = {};
          if (this.form.afterProject.remark == "物业用户") {
            data.projectType = "0";
          } else {
            data.projectType = "1";
          }
          data.applyId = this.id; // 主键id
          data.returnId = this.form.name.id; // 变更姓名id
          data.name = this.form.afterName; // 姓名
          data.idCard = this.form.afterIdCard; // 身份证
          data.phone = this.form.afterPhone; // 手机
          data.isSocialSecurity = this.form.afterIsSocialSecurity ? "1" : "0"; // 社保
          data.name = this.form.afterName; // 所属项目id
          data.compProjectId = this.form.afterProject.id;
          data.compProjectName = this.form.afterProject.name;
          // console.log(data);
          // 请求
          insEmpCustomApplyManageReplace(data).then(xhrData => {
            if (xhrData.code === 200) {
              this.$message({
                message: "提交成功！",
                type: "success"
              });
              // 更新列表
              this.getList();
              // 关闭对话框
              this.dialogVisible = false;
              // 清除表单验证
              this.$refs["form"].resetFields();
              // 还原表单
              this.reduction();
              // 更新时间
              this.remoteMethod();
            }
          });
        } else {
          // console.log("error submit!!");
          this.$message.error("请完善信息");
          return false;
        }
      });
    },
    // 替换
    replaceBtn() {
      //   this.$emit("changePage2", "ADD");
      this.dialogVisible = true;
      // 标题
      this.titleName = "人员替换";
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
      this.dialogVisible2 = true;
      // 标题
      this.titleName = "查看详情";
      // console.log(row);
      this.seeForm = {};
      this.seeForm.oldCompProjectName = row.oldCompProjectName;
      this.seeForm.oldIdCard = row.oldIdCard;
      this.seeForm.oldIsSocialSecurity =
        row.oldIsSocialSecurity == "0" ? "无" : "有";
      this.seeForm.oldName = row.oldName;
      this.seeForm.oldPhone = row.oldPhone;
      this.seeForm.idCard = row.idCard;
      this.seeForm.name = row.name;
      this.seeForm.isSocialSecurity = row.isSocialSecurity == "0" ? "无" : "有";
      this.seeForm.phone = row.phone;
      this.seeForm.compProjectName = row.compProjectName;
    },
    // 搜索查询下拉框
    async remoteMethod(query) {
      // console.log(query);
      this.options = [];
      if (query !== "") {
        // await this.getInsList(query)
        const page = {
          applyId: this.id,
          pageNum: 1,
          pageSize: 9999,
          name: query,
          userType: this.$store.state.user.userType
        };
        await insEmpCustomApplyManageDetailList(page).then(xhrData => {
          if (xhrData.code === 200) {
            this.states = xhrData.rows;
          }
        });
        this.loading = true;
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
    // 下拉选择名字获取信息
    getNameData(val) {
      // console.log(val);
      this.compProjectName = val.compProjectName;
      this.idCard = val.idCard;
      this.phone = val.phone;
      this.isSocialSecurity = val.isSocialSecurity == "0" ? "无" : "有";
    },
    // 还原
    reduction() {
      // 所属项目
      (this.compProjectName = ""),
        // 身份证
        (this.idCard = ""),
        // 手机
        (this.phone = ""),
        // 社保
        (this.isSocialSecurity = ""),
        (this.form = {
          name: ""
        });
    },
    // 关闭对话框
    closeDialog() {
      this.options = [];
      this.form.name = "";
      // 清除表单验证
      this.$refs["form"].resetFields();
      // 还原表单
      this.reduction();
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
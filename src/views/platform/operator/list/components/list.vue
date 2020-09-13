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
          <el-form-item label="经办人姓名:">
            <el-input @keyup.enter.native="query" v-model.trim="formInline.name" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="从属机构:">
            <el-input
              @keyup.enter.native="query"
              v-model.trim="formInline.insCompName"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item label="账号状态:">
            <el-select @change="query" clearable v-model="formInline.state" placeholder="请选择">
              <el-option label="正常" value="0"></el-option>
              <el-option label="禁用" value="1"></el-option>
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
              @change="query"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="info" plain @click="query">查询</el-button>
            <el-button type="primary" plain @click="add">新增经办人</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!-- 审核列表 -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="index" label="序号" width="80" align='center'></el-table-column>
      <el-table-column prop="name" show-overflow-tooltip label="经办人姓名" min-width="100px"></el-table-column>
      <el-table-column prop="insCompName" show-overflow-tooltip label="从属机构" min-width="200px"></el-table-column>
      <el-table-column prop="phone" show-overflow-tooltip label="联系方式" min-width="120px"></el-table-column>
      <el-table-column prop="emailAddress" show-overflow-tooltip label="邮箱地址" min-width="160px"></el-table-column>
      <el-table-column prop="state" show-overflow-tooltip label="账号状态" min-width="100px"></el-table-column>
      <el-table-column prop="createTime" show-overflow-tooltip label="创建时间" min-width="180px"></el-table-column>
      <el-table-column label="操作" min-width="140px">
        <template slot-scope="scope">
          <!-- <div>
            <a
              href="javascript:;"
              style="margin-right:3px; color: #1890ff;"
              @click="see(scope.row)"
            >查看</a>
          </div>-->
          <el-button size="mini" type="text" icon="el-icon-edit" @click="modify(scope.row)">修改</el-button>
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
    <!-- 添加/修改 对话框 -->
    <el-dialog
      :title="dialogText"
      id="seeDialog"
      class="seeDialog"
      :visible.sync="dialogVisible"
      @close="closeDialog"
      width="40%"
    >
      <el-form
        id="operator-form"
        ref="form"
        :model="form"
        :rules="rules"
        label-width="120px"
        label-position="right"
      >
        <h3>基本信息</h3>
        <el-form-item prop="userName" :required="valType" label="登录账户：">
          <el-input v-model.trim="form.userName"></el-input>
        </el-form-item>
        <el-form-item
          prop="password"
          v-show="isPassword != '0'"
          :required="isPassword == '1' ? true : false"
          label="登陆密码："
        >
          <el-input type="password" v-model.trim="form.password"></el-input>
        </el-form-item>
        <el-form-item prop="insCompId" :required="valType" label="保险机构：">
          <el-select style="width:100%" v-model="form.insCompId" placeholder="请选择">
            <el-option
              v-for="item in insCompData"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="name" :required="valType" label="姓名：">
          <el-input v-model.trim="form.name"></el-input>
        </el-form-item>
        <el-form-item prop="phone" :required="valType" label="联系方式：">
          <el-input :maxlength="11" v-model.trim="form.phone"></el-input>
        </el-form-item>
        <el-form-item prop="emailAddress" :required="valType" label="邮箱地址：">
          <el-input v-model.trim="form.emailAddress"></el-input>
        </el-form-item>
        <el-form-item prop="didian" :required="valType" label="办公地点：">
          <el-cascader
            style="width:100%"
            ref="cascaderAddr"
            v-model="form.didian"
            :options="options"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item prop="address" :required="valType" label="详细地址：">
          <el-input v-model.trim="form.address"></el-input>
        </el-form-item>
        <h3>账户状态</h3>
        <el-form-item prop="state" :required="valType" label="账户状态：">
          <el-select v-model="form.state" placeholder="请选择">
            <el-option label="正常" value="0"></el-option>
            <el-option label="禁用" value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <a href="javascript:;" class="btn btn1" @click="submission">提 交</a>
        <a href="javascript:;" class="btn btn2" @click="dialogVisible=false">返 回</a>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 正则验证
import {
  isvalidPhone,
  isvalidEmailAddress,
  isvalidUserName
} from "@/validate/validate.js";
// 请求
import {
  insCompanyList,
  sysRegion,
  sysInsUser,
  sysInsUserList,
  sysInsUserPut
} from "@/api/information/information";
export default {
  name: "operator-components-list",
  data() {
    // 验证账号
    let validateAccount = (rule, value, callback) => {
      if (this.form.userName === "") {
        callback(new Error("请输入账号"));
      }
      //    else if(!isvalidUserName(this.form.userName)){
      //       callback(new Error("只能输入字母与数字"));
      //   }
      else {
        callback();
      }
    };
    // 验证密码
    let validatePassword = (rule, value, callback) => {
      if (this.form.password === "") {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };
    // 验证保险公司
    let validateInsCompId = (rule, value, callback) => {
      if (this.form.insCompId === "") {
        callback(new Error("请选择保险公司"));
      } else {
        callback();
      }
    };
    // 验证姓名
    let validateName = (rule, value, callback) => {
      if (this.form.name === "") {
        callback(new Error("请输入姓名"));
      } else {
        callback();
      }
    };
    // 验证手机号
    let validatePhone = (rule, value, callback) => {
      if (this.form.phone === "") {
        callback(new Error("请输入手机号"));
      } else if (!isvalidPhone(this.form.phone)) {
        callback(new Error("手机号格式不正确"));
      } else {
        callback();
      }
    };
    // 验证邮箱
    let validateEmailAddress = (rule, value, callback) => {
      if (this.form.emailAddress === "") {
        callback(new Error("请输入邮箱"));
      } else if (!isvalidEmailAddress(this.form.emailAddress)) {
        callback(new Error("邮箱格式不正确"));
      } else {
        callback();
      }
    };
    // 验证详细地址
    let validateAddress = (rule, value, callback) => {
      if (this.form.address === "") {
        callback(new Error("请输入详细地址"));
      } else {
        callback();
      }
    };
    // 验证办公地址
    let validateDiDian = (rule, value, callback) => {
      if (this.form.didian.length <= 0) {
        callback(new Error("请选择地点"));
      } else {
        callback();
      }
    };
    // 验证状态
    let validateState = (rule, value, callback) => {
      if (this.form.state === "") {
        callback(new Error("请选择状态"));
      } else {
        callback();
      }
    };
    return {
      // 查询表单数据
      formInline: {
        name: "",
        state: "",
        insCompName: "",
        createTime: ""
      },
      // 对话框表单数据
      form: {
        // 账户
        userName: "",
        // 密码
        password: "",
        // 保险公司id
        insCompId: "",
        // 姓名
        name: "",
        // 手机号
        phone: "",
        // 邮箱地址
        emailAddress: "",
        // 地址(省市区)
        didian: [],
        // 详细地址
        address: "",
        // 状态
        state: "",
        // 省
        province: "",
        // 市
        city: "",
        // 区
        county: ""
      },
      // from表单验证
      rules: {
        userName: [{ validator: validateAccount, trigger: "blur" }],
        password: [{ validator: validatePassword },{ min: 6, max: 20, message: "长度在 6 到 20 个字符", trigger: "blur" }],
        insCompId: [{ validator: validateInsCompId }],
        name: [{ validator: validateName }],
        phone: [{ validator: validatePhone, trigger: "blur" }],
        didian: [{ validator: validateDiDian }],
        emailAddress: [{ validator: validateEmailAddress, trigger: "blur" }],
        address: [{ validator: validateAddress }],
        state: [{ validator: validateState }]
      },
      // 是否必填
      valType: false,
      // 表单密码是否必填
      isPassword: true,
      //  表格数据
      tableData: [
        {
          name: "123"
        }
      ],
      // 总条数
      totalNum: 1,
      // 显示条数
      pageSize: 10,
      // 显示页数
      // 分页
      pageNum: 1,
      // 对话框
      dialogVisible: false,
      // 添加/修改对话框
      dialogText: "",
      //
      options: [
        {
          value: "zhinan",
          label: "指南",
          children: [
            {
              value: "shejiyuanze",
              label: "设计原则",
              children: [
                {
                  value: "yizhi",
                  label: "一致"
                }
              ]
            }
          ]
        },
        {
          value: "zhinan2",
          label: "指南2",
          children: [
            {
              value: "shejiyuanze2",
              label: "设计原则2",
              children: [
                {
                  value: "yizhi2",
                  label: "一致2"
                }
              ]
            }
          ]
        }
      ],
      // 保存保险公司信息
      insCompData: []
    };
  },
  created() {
    this.getList();
    this.getInsList();
    this.getRegion();
  },
  methods: {
    // 获取列表信息
    getList() {
      let page;
      if (
        this.formInline.createTime == "" ||
        this.formInline.createTime == null
      ) {
        page = {
          pageSize: this.pageSize,
          pageNum: this.pageNum,
          name: this.formInline.name,
          insCompName: this.formInline.insCompName,
          state:
            this.formInline.state == ""
              ? (this.formInline.state = null)
              : this.formInline.state,
          beginTime: "",
          endTime: ""
        };
      } else {
        page = {
          pageSize: this.pageSize,
          pageNum: this.pageNum,
          name: this.formInline.name,
          insCompName: this.formInline.insCompName,
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
    //   console.log(page);

      sysInsUserList(page).then(xhrData => {
        // console.log(xhrData, "列表");
        if (xhrData.code === 200) {
          this.tableData = xhrData.rows;
          this.tableData.forEach(item => {
            if (item.state == "0") {
              item.state = "正常";
            } else if (item.state == "1") {
              item.state = "禁用";
            }
          });
          this.totalNum = xhrData.total;
        }
      });
    },
    // 获取保险公司信息
    getInsList() {
      const page = {
        pageNum: 1,
        pageSize: 99999
      };
      insCompanyList(page).then(xhrData => {
        // console.log(xhrData, "保险公司");
        if (xhrData.code === 200) {
          this.insCompData = xhrData.rows;
        }
      });
    },
    //获取省市区
    getRegion() {
      sysRegion().then(xhrData => {
        // console.log(xhrData);
        if (xhrData.code === 200) {
          this.options = xhrData.data;
        }
      });
    },
    // 查询
    query() {
      this.getList();
    },
    // 新增
    add() {
      // 打开新增对话框
      this.dialogVisible = true;
      // 修改对话框标题
      this.dialogText = "新增经办人";
      // 表单必填
      this.valType = true;
      // 表单密码必填
      this.isPassword = "1";
      // 还原表单
      this.reduction();
      // 还原表单验证
      // this.$refs["form"].resetFields();
    },
    // 还原表单
    reduction() {
      this.form = {
        userName: "",
        password: "",
        insCompId: "",
        name: "",
        phone: "",
        emailAddress: "",
        // 地址(省市区)
        didian: [],
        address: "",
        state: "",
        province: "",
        city: "",
        county: ""
      };
    },
    // 修改
    modify(row) {
        // console.log(row);
        
      this.reduction();
      // 打开对话框
      this.dialogVisible = true;
      // 修改对话框标题
      this.dialogText = "修改";
      // 表单必填
      this.valType = true;
      // 表单密码非必填必填
      this.isPassword = "0";
      this.objFun(this.form, row);
      this.form = this.objFun(this.form, row);
      //   this.$nextTick(() => {
      delete this.form.password;
      this.form.didian[0] = row.province;
      this.form.didian[1] = row.city;
      this.form.didian[2] = row.county;
      this.form.userId = row.userId
      //   });
      //   this.$forceUpdate()
    //   console.log(this.form, "form");
    },
    // 提交表单
    submission() {
      if (this.dialogText == "新增经办人") {
        this.$refs["form"].validate(valid => {
          if (valid) {
            // 请求 新增用户
            sysInsUser(this.form).then(xhrData => {
              if (xhrData.code === 200) {
                this.$message({
                  message: "提交成功！",
                  type: "success"
                });
                // 关闭对话框
                this.dialogVisible = false;
                // 还原表单
                this.reduction();
                // 还原表单验证
                this.$refs["form"].resetFields();
                // 更新列表
                this.getList()
              }
            });
          } else {
            this.$message({
              message: "请完善信息！",
              type: "warning"
            });
            return false;
          }
        });
      } else if (this.dialogText == "修改") {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.state == "正常") {
              this.form.state = "0";
            } else if (this.form.state == "禁用") {
              this.form.state = "1";
            }
            sysInsUserPut(this.form).then(xhrData => {
              if (xhrData.code === 200) {
                this.$message({
                  message: "提交成功！",
                  type: "success"
                });
                // 关闭对话框
                this.dialogVisible = false;
                // 还原表单
                this.reduction();
                // 还原表单验证
                this.$refs["form"].resetFields();
                // 更新列表
                this.getList()
              }
            });
          } else {
            this.$message({
              message: "请完善信息！",
              type: "warning"
            });
            return false;
          }
        });
      }
    },
    // 关闭对话框
    closeDialog() {
      // 还原表单验证
      this.$refs["form"].resetFields();
    },
    // 地区选择触发
    handleChange(val) {
      // 获取 value值
    //   console.log(val);
      // 获取label值
      let label = this.$refs["cascaderAddr"].getCheckedNodes()[0].pathLabels;
    //   console.log(label);
      // 赋值 省
      this.form.province = label[0];
      // 赋值 市
      this.form.city = label[1];
      // 赋值 区
      this.form.county = label[2];
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
    objFun(objA, objB) {
      Object.keys(objA).forEach(key => {
        objA[key] = objB[key] || objA[key];
      });
      return objA;
      // console.log(objA);
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
/* ---- */
#operator-form h3 {
  padding-bottom: 15px;
  box-sizing: border-box;
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
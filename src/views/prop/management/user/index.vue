<template>
  <!-- 用户管理 -->
  <div class="user">
    <div class="user-conter">
      <el-row :gutter="20" class="user-top" style="margin-left: 0px; margin-right: 0px;">
        <el-col :span="21">
          <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="登陆账号：">
              <el-input @keyup.enter.native="onSubmit" v-model="formInline.userName"></el-input>
            </el-form-item>
            <el-form-item label="状态：">
              <el-select
                clearable
                @change="onSubmit"
                v-model="formInline.status"
                placeholder="请选择状态"
              >
                <el-option label="正常" value="0"></el-option>
                <el-option label="禁用" value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="info" plain @click="onSubmit">查询</el-button>
              <el-button @click="AddUser" type="primary" plain v-hasPermi="['prop:user:add']">新增用户</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="3">
          <!-- <div class="adduser" @click="AddUser" v-hasPermi="['prop:user:add']">新添用户</div> -->
          <!-- <el-button @click="AddUser" type="primary" plain v-hasPermi="['prop:user:add']">新增用户</el-button> -->
        </el-col>
      </el-row>
      <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%">
        <el-table-column type="index" label="序号" width="80"></el-table-column>
        <el-table-column label="登陆账号" min-width="200px" prop="account">
          <template slot-scope="scope">{{ scope.row.userName }}</template>
        </el-table-column>
        <el-table-column prop="nickName" label="真实姓名" min-width="200px"></el-table-column>
        <el-table-column prop="phonenumber" label="手机" min-width="200px" show-overflow-tooltip></el-table-column>
        <el-table-column prop="status" label="状态" min-width="200px" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              @change="modifyState(scope.row)"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :disabled="scope.row.userType == '01'"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="200px">
          <template slot-scope="scope">
            <!-- <a
              href="javascript:;"
              style="margin-right:3px; color: #1890ff;"
              @click="delUser(scope.row)"
              v-if="scope.row.userType != '01'"
            >删除</a>|-->
            <!-- <a
              href="javascript:;"
              style="margin-left:3px;color: #1890ff;"
              @click="modifyUser(scope.row)"
            >修改</a>-->
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              v-hasPermi="['prop:user:edit']"
              @click="modifyUser(scope.row)"
            >修改</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="delUser(scope.row)"
              v-if="scope.row.userType != '01'"
              v-hasPermi="['prop:user:remove']"
            >删除</el-button>
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
    </div>
    <!-- 新添用户 对话框 -->
    <el-dialog
      @close="resetForm('form')"
      id="user-dialog"
      :title="titleName"
      :visible.sync="dialogFormVisible"
      width="600px"
    >
      <el-form ref="form" :rules="rules" :model="form" label-width="120px" label-position="left">
        <div v-if="Prohibit">
          <h2>账号信息</h2>
          <el-form-item label="登陆账号" prop="userName" :required="Prohibit">
            <el-input v-model.trim="form.userName"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password" :required="Prohibit">
            <el-input minlength="6" type="password" v-model.trim="form.password"></el-input>
          </el-form-item>
          <el-form-item label="再次确认密码" prop="checkPass" :required="Prohibit">
            <el-input minlength="6" type="password" v-model.trim="form.checkPass"></el-input>
          </el-form-item>
        </div>
        <h2>联系方式</h2>
        <el-form-item label="姓名" prop="nickName">
          <el-input v-model.trim="form.nickName"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phonenumber">
          <el-input maxlength="11" v-model.number.trim="form.phonenumber"></el-input>
        </el-form-item>
        <el-form-item label="email" prop="email">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <!-- <el-form-item label="职位" prop="zhiwei">
          <el-select v-model="form.zhiwei">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
        </el-select>-->
        <!-- </el-form-item> -->
        <!-- <el-form-item  label="用户类型" prop="userType">
          <el-select :disabled="isAvailable" v-model="form.userType">
            <el-option label="小区用户" value="02"></el-option>
          </el-select>
        </el-form-item>-->
        <!-- 菜单权限 -->
        <!-- <div :v-if="isShowRoleName">
          <h2 style="margin-bottom:15px">菜单设置</h2>
          <el-form-item style="margin-left:-120px" prop="roleIds">
            <el-checkbox-group v-model="form.roleIds">
              <el-checkbox
                v-for="(item,index) in userRole.roleName"
                :key="item.index"
                :label="item.roleId"
                name="roleIds"
                :isCheckbox="isCheckbox"
              >{{item.roleName}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </div>-->
        <div v-if="isShowName">
          <h2 style="margin-bottom:15px">所属角色</h2>
          <el-form-item prop="roleIds" label="角色" :required="Prohibit2">
            <el-select v-model="form.roleIds" multiple placeholder="请选择角色">
              <el-option
                v-for="(item) in roleData"
                :key="item.id"
                :label="item.roleName"
                :value="item.roleId"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div v-if="isShowName">
          <h2 style="margin-bottom:15px">项目权限</h2>
          <div>
            <el-form-item style="margin-left:-120px" prop="propProjectIds">
              <el-checkbox-group class="zwy-maxHeight" v-model="form.propProjectIds">
                <el-checkbox
                  v-for="(item) in userRole.name"
                  :key="item.id"
                  :label="item.id"
                  name="propProjectIds"
                >{{item.name}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <!-- <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>-->
        <a href="javascript:;" class="user-btn btn1" @click="addUserConfirm('form')">{{titleBtn}}</a>
        <a href="javascript:;" class="user-btn btn2" @click="revert">返 回</a>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUserList,
  // getUserRoleList,
  getProjectList,
  propUserAdd,
  propUserResetPwd,
  propUserDel,
  propUserEdit,
  getProjectRoleList,
  propUserUpdateUserStatus,
  sysPropRoleGetListIngoreAdmin
} from "@/api/information/information";
import { listRole } from "@/api/system/role2";
import { log } from "util";
export default {
  name: "user",
  inject: ["reload"],
  data() {
    // 验证密码
    var validatePass = (rule, value, callback) => {
      if (this.form.password === "") {
        callback(new Error("请输入密码"));
      } else if (this.form.password.length < 6) {
        callback(new Error("不能低于6位数"));
      } else {
        callback();
      }
    };
    // 再次验证密码
    var validateCheckPass = (rule, value, callback) => {
      if (this.form.checkPass === "") {
        callback(new Error("请再次输入密码"));
      } else if (this.form.checkPass.length < 6) {
        callback(new Error("不能低于6位数"));
      } else if (this.form.checkPass !== this.form.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    // 验证账号
    var validateUserName = (rule, value, callback) => {
      if (this.form.userName === "") {
        callback(new Error("请输入账号"));
      } else {
        callback();
      }
    };
    // 验证角色
    var validateRoleIds = (rule, value, callback) => {
      if (this.form.roleIds.length <= 0) {
        callback(new Error("请选择角色"));
      } else {
        callback();
      }
    };
    return {
      // 获取用户类型
      getUserType: "",
      // 用户状态
      userStateType: true,
      // 是否可选
      isAvailable: false,
      // 总条数
      totalNum: 0,
      // 当前显示条数
      pageSize: 10,
      // 当前显示页数
      pageNum: 1,
      // 是否显示
      isShowRoleName: false,
      isShowName: false,
      isCheckbox: false,
      isDisabled: false,
      // 对话框
      dialogFormVisible: false,
      // 对话框title
      titleName: "",
      // 对话框 按钮
      titleBtn: "",
      formInline: {
        // 登陆账号
        userName: "",
        // 状态
        status: ""
      },
      // 表格数据
      tableData: [],
      // 表单数据
      form: {
        // 登陆账号
        userName: "",
        // 密码
        password: "",
        // 确认密码
        checkPass: "",
        // 姓名
        nickName: "",
        // 手机
        phonenumber: "",
        // 邮箱
        email: "",
        // 类型
        userType: "",
        // 状态
        // status: "",
        // 角色
        roleIds: [],
        // 权限设置
        propProjectIds: [],
        userId: ""
      },
      // 表单验证
      rules: {
        password: [{ validator: validatePass }],
        userName: [
          { validator: validateUserName },
          { min: 6, max: 20, message: "长度在 6 到 20 个字符", trigger: "blur" }
        ],
        checkPass: [{ validator: validateCheckPass }],
        // roleIds: [{ required: true, message: "请选择角色", trigger: "change" }],
        roleIds: [{ validator: validateRoleIds }],
        nickName: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        phonenumber: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            pattern: /^1(3|4|5|6|7|8|9)\d{9}$/,
            message: "手机号格式不对",
            trigger: "blur"
          }
        ],
        // 邮箱
        email: [
          {
            pattern: /^([a-zA-Z0-9_\.\-]+)@([a-zA-Z0-9_\.\-]+)\.([a-zA-Z]{2,4})$/,
            message: "请输入正确的邮箱",
            trigger: "blur"
          }
        ]
      },
      // 物业能设置权限
      userRole: {
        // 菜单设置
        roleName: {},
        // 权限设置
        name: {}
      },
      // 角色数据
      roleData: [],
      // 是否开启禁用
      Prohibit: false,
      Prohibit2: false
    };
  },
  created() {
    // 获取 用户列表
    this.getUser();
    // 获取 物业能设置权限
    // this.getUserRole();
    // 获取 项目小区列表权限
    this.getProject();
    // 获取用户类型
    this.getUserType = this.$store.state.user.userType;
    // this.form.userType = this.$store.state.user.userType;
    this.form.userType = "02";
    this.judge();
    this.getListMenu();
  },
  methods: {
    // 获取角色列表
    getListMenu() {
      sysPropRoleGetListIngoreAdmin().then(xhrData => {
        // console.log(xhrData,'角色列表');
        if (xhrData.code === 200) {
          this.roleData = xhrData.data;
        }
      });
    },
    // 判断用户类型
    judge() {
      // console.log(this. getUserType);

      if (this.getUserType == "01") {
        this.isAvailable = false;
      } else if (this.getUserType == "02") {
        this.isAvailable = true;
      }
    },
    // 提取公用 获取用户列表
    getUser() {
      let page = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        userName: this.formInline.userName,
        status: this.formInline.status == "" ? null : this.formInline.status
      };
      getUserList(page).then(xhrData => {
        // console.log(xhrData, "用户列表");
        if (xhrData.code === 200) {
          for (var i = 0; i < xhrData.rows.length; i++) {
            if (xhrData.rows[i].status == 1) {
              xhrData.rows[i].status = false;
            } else if (xhrData.rows[i].status == 0) {
              xhrData.rows[i].status = true;
            }
          }
          this.tableData = xhrData.rows;
          this.totalNum = xhrData.total;
        }
      });
    },
    getProject() {
      // 提取公用 获取项目小区列表权限
      getProjectRoleList().then(xhrData => {
        if (xhrData.code === 200) {
          this.userRole.name = xhrData.rows;
          // console.log(this.userRole.name, "小区");
        }
      });
    },
    // 查询
    onSubmit() {
      this.getUser();
    },
    // 修改用户状态(正常或禁用)
    modifyState(row) {
      // console.log(row);

      // console.log(row.status);
      // 确认变更
      // 禁用变更
      if (!row.status) {
        this.$confirm("此操作将变更状态, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            // 参数：userId (0:正常 ；1：停用)
            const data = {
              userId: row.userId,
              status: 1
            };
            // 请求变更用户状态
            propUserUpdateUserStatus(data)
              .then(xhrData => {
                // console.log(xhrData);
                if (xhrData.code === 200) {
                  this.$message({
                    type: "success",
                    message: "变更成功!"
                  });
                  // 获取 用户列表
                  this.getUser();
                }
              })
              .catch(() => {
                // 请求失败时候还原
                row.status = !row.status;
              });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "取消变更!"
            });
            row.status = true;
          });
      }
      // 开放禁用
      else {
        this.$confirm("此操作将变更状态, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            // 参数：userId (0:正常 ；1：停用)
            const data = {
              userId: row.userId,
              status: 0
            };
            // 请求变更用户状态
            propUserUpdateUserStatus(data).then(xhrData => {
              // console.log(xhrData);
              if (xhrData.code === 200) {
                this.$message({
                  type: "success",
                  message: "变更成功!"
                });
                // 获取 用户列表
                this.getUser();
              }
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "取消变更!"
            });
            row.status = false;
          });
      }
    },
    // 每页显示的条数
    handleSizeChange(val) {
      // 注意：在改变每页显示的条数时，要将页码显示到第一页
      this.pageNum = 1;
      // 改变每页显示的条数
      this.pageSize = val;
      // 点击每页显示的条数时，显示第一页
      this.getUser();
    },
    handleCurrentChange(val) {
      // 改变默认的页数
      this.pageNum = val;
      // 切换页码时，要获取每页显示的条数
      this.getUser();
    },
    // 关闭对话框
    resetForm(form) {
      // 清空表单
      this.$nextTick(() => {
        this.$refs["form"].resetFields();
        this.form.roleIds = [];
        this.form.propProjectIds = [];
      });
    },
    // 还原表单
    reduction() {
      // 还原表单
      this.form = {
        // 登陆账号
        userName: "",
        // 密码
        password: "",
        // 确认密码
        checkPass: "",
        // 姓名
        nickName: "",
        // 手机
        phonenumber: "",
        // 邮箱
        email: "",
        // 类型
        userType: "",
        // 状态
        // status: "",
        // 角色
        roleIds: [],
        // 权限设置
        propProjectIds: [],
        userId: ""
      };
    },
    // 添加用户
    AddUser() {
      // 还原表单
      this.reduction();
      this.titleBtn = "新 增";
      // 打开对话框
      this.dialogFormVisible = true;
      // 赋值title名称
      this.titleName = "添加用户";
      this.isShowName = true;
      this.isShowRoleName = true;
      this.isDisabled = false;
      // 开启必填验证
      this.Prohibit = true;
      this.Prohibit2 = true;
    },
    // 确认 新增
    addUserConfirm(form) {
      // 判断是新增还是修改
      if (this.titleName == "添加用户") {
        this.$refs[form].validate(valid => {
          if (valid) {
            const loading = this.$loading({
              lock: true,
              text: "添加中，请等待...",
              spinner: "el-icon-loading",
              background: "rgba(0, 0, 0, 0.7)"
            });
            propUserAdd(this.form)
              .then(xhrData => {
                this.$message.success({
                  message: "添加成功!"
                });
                // 更新用户列表
                this.getUser();
                // 关闭对话框
                this.dialogFormVisible = false;
                // 清空表单
                this.$refs["form"].resetFields();
                // 关闭动画
                loading.close();
              })
              .catch(() => {
                // 关闭动画
                loading.close();
              });
          } else {
            // console.log("error submit!!");
            return false;
          }
        });
      } else if (this.titleName == "修改") {
        const _this = this;
        // console.log(this.form.roleIds);

        this.$refs["form"].validate(valid => {
          if (valid) {
            // console.log(this.form, "修改");
            const loading = this.$loading({
              lock: true,
              text: "修改中，请等待...",
              spinner: "el-icon-loading",
              background: "rgba(0, 0, 0, 0.7)"
            });
            propUserEdit(this.form)
              .then(xhrData => {
                if (xhrData.code === 200) {
                  this.$message.success({
                    message: "修改成功!"
                  });
                  this.isDisabled = false;
                  // 更新用户列表
                  this.getUser();
                  // 关闭对话框
                  this.dialogFormVisible = false;
                  // 清空表单
                  this.$refs["form"].resetFields();
                  // 关闭动画
                  loading.close();
                } else {
                  _this.$message.error({
                    message: "修改失败!"
                  });
                }
              })
              .catch(() => {
                // 关闭动画
                loading.close();
              });
          } else {
            this.$message.warning({
              message: "请输入完全~!"
            });
            return false;
          }
        });
      }
    },
    // 返回 按钮
    revert(form) {
      // 清空表单
      this.$refs["form"].resetFields();
      // 关闭对话框
      this.dialogFormVisible = false;
    },
    // 修改
    modifyUser(row) {
      // 开启非必填验证
      this.Prohibit = false;

      console.log(row);
      if (this.getUserType == "01") {
        if (row.userType == "01") {
          this.Prohibit2 = false;
          this.isShowName = false;
        } else {
          this.Prohibit2 = true;
          this.isShowName = true;
        }
      } else if (this.getUserType == "02") {
        this.isShowName = false;
      }

      // 获取
      // console.log(row, row.userId);
      this.titleBtn = "修 改";
      this.form.userType = row.userType;
      this.form.userId = row.userId;
      // this.isDisabled = true;
      // 打开对话框
      this.dialogFormVisible = true;
      // 赋值title名称
      this.titleName = "修改";
      if (row.roleIds == null) {
        row.roleIds = [];
      }
      // 项目用户可选择角色
      if (row.userType == "02") {
        // 显示角色可选
        this.isShowName = true;
        // 当前角色id赋值到表单内(回显)
        if (row.roleIds.length > 0) {
          this.isShowRoleName = true;
          for (var i = 0; i < row.roleIds.length; i++) {
            this.form.roleIds.push(row.roleIds[i]);
          }
        } else {
          this.isShow = false;
        }
      }
      // 物业用户不可选择角色
      else if (row.userType == "01") {
        this.isShowName = false;
        // console.log(123);
      }
      //
      if (row.propProjects.length >= 0) {
        // this.isShowName = true;
        for (var i = 0; i < row.propProjects.length; i++) {
          this.form.propProjectIds.push(row.propProjects[i].id);
        }
      } else {
        // this.isShowName = false;
      }
      // console.log(this.isShowName);

      this.$nextTick(() => {
        this.form.userName = row.userName;
        this.form.nickName = row.nickName;
        this.form.phonenumber = row.phonenumber;
        this.form.email = row.email;
      });
    },
    // 删除
    delUser(row) {
      // console.log(row.userId);
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          propUserDel(row.userId).then(xhrData => {
            if (xhrData.code === 200) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              // 更新用户列表
              this.getUser();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>
<style>
#user-dialog .el-dialog__header {
  background-color: #e6e8eb;
}
#user-dialog .user-btn {
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
#user-dialog .user-btn.btn1 {
  background: rgba(239, 130, 0, 1);
  border: 1px solid rgba(206, 112, 0, 1);
  color: #fff;
}
#user-dialog .user-btn.btn2 {
  border: 1px solid rgba(0, 0, 0, 0.25);
}
#user-dialog .el-dialog__title {
  font-size: 20px;
  font-weight: bold;
}
#user-dialog .el-dialog__body {
  padding-left: 40px;
  padding-right: 40px;
  padding-bottom: 0;
  box-sizing: border-box;
}
#user-dialog .el-dialog__footer {
  background-color: #e6e8eb;
}

#user-dialog .el-cascader {
  width: 100%;
}
#user-dialog .el-select {
  width: 100%;
}
#user-dialog .el-form-item__label {
  color: #686868;
}
</style>
<style lang="scss" scoped>
.user {
  width: 100%;
  padding: 15px;
  min-height: calc(88vh);
  box-sizing: border-box;
  background-color: #e6e8eb;
  padding-bottom: 30px;

  .user-conter {
    min-height: calc(88vh);
    background-color: #fff;
    border-radius: 5px;
    position: relative;
    padding-bottom: 100px;
    .user-top {
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
    .adduser {
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
  #user-dialog {
    h2 {
      font-size: 16px;
      // margin-top: 0;
      color: #000;
      margin-bottom: 30px;
    }
  }
}
.zwy-maxHeight {
  // width: 500px;
  max-height: 300px;
  overflow: auto;
  // display: flex;
  // flex-wrap: wrap;
}
</style>
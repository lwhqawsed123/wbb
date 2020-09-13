<template>
  <!-- 项目管理 -->
  <div class="project">
    <div class="project-conter">
      <el-row :gutter="20" class="project-top" style="margin-left: 0px; margin-right: 0px;">
        <el-col :span="21">
          <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="小区名字：">
              <el-input @keyup.enter.native="onSubmit" v-model.trim="formInline.name" placeholder></el-input>
            </el-form-item>
            <el-form-item label="开票抬头：">
              <el-input  @keyup.enter.native="onSubmit" v-model.trim="formInline.invoiceTitle" placeholder></el-input>
            </el-form-item>
            <el-form-item style="width:120px">
              <el-select
                clearable
                @change="onSubmit"
                v-model="formInline.is_manage"
                placeholder="是否在管"
              >
                <el-option label="在管" value="1"></el-option>
                <el-option label="合同终止" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="info" plain @click="onSubmit">查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="3">
          <div class="addproject" @click="AddProject" v-hasPermi="['prop:project:add']">添加项目</div>
        </el-col>
      </el-row>
      <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%">
        <el-table-column type="index" label="序号" width="80"></el-table-column>
        <el-table-column prop="name" label="小区名字" min-width="200px" show-overflow-tooltip></el-table-column>
        <el-table-column prop="invoiceTitle" label="开票抬头" min-width="200px" show-overflow-tooltip></el-table-column>
        <el-table-column prop="is_manage" label="是否在管" min-width="100px" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" label="添加时间" min-width="180px" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" min-width="200px">
          <template slot-scope="scope">
            <!-- <a
              href="javascript:;"
              style="margin-right:3px; color: #1890ff;"
              @click="projectSee(scope.row)"
            >查看</a>|
            <a
              href="javascript:;"
              style="margin-right:3px; color: #1890ff;"
              @click="projectModify(scope.row)"
            >修改</a>|
            <a
              href="javascript:;"
              style="margin-left:3px;color: #1890ff;"
              @click="projectDelete(scope.row)"
            >删除</a>-->
            <el-button
              size="mini"
              type="text"
              icon="el-icon-view"
              @click="projectSee(scope.row)"
              v-hasPermi="['prop:project:query']"
            >查看</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="projectModify(scope.row)"
              v-hasPermi="['prop:project:edit']"
            >修改</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="projectDelete(scope.row)"
              v-hasPermi="['prop:project:remove']"
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
    <!-- 添加 修改 对话框 -->
    <!-- :title="titleMap[dialogStatus]" -->
    <el-dialog
      @close="resetForm('projectForm')"
      id="project-dialog"
      :title="titleName"
      :visible.sync="dialogFormVisible"
      width="600px"
    >
      <el-form
        :rules="rules"
        :model="projectForm"
        label-width="110px"
        label-position="left"
        ref="projectForm"
      >
        <el-form-item label="项目名称" prop="name">
          <el-input v-model="projectForm.name"></el-input>
        </el-form-item>
        <el-form-item prop="selectedOptions" label="地址">
          <!-- <el-input v-model="projectForm.province"></el-input> -->
          <!-- <el-cascader
            size="large"
            :options="options"
            ref="cascaderAddr"
            v-model="projectForm.selectedOptions"
            @change="handleChange"
          ></el-cascader>-->
          <el-cascader
            style="width:100%"
            ref="cascaderAddr"
            v-model="projectForm.selectedOptions"
            :options="options"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细门牌" prop="address">
          <el-input type="textarea" v-model="projectForm.address" placeholder="注！项目地址用;号隔开多个地址"></el-input>
        </el-form-item>
        <!-- <el-form-item label="发票抬头" prop="invoiceTitle">
          <el-input v-model="projectForm.invoiceTitle"></el-input>
        </el-form-item>-->
        <el-form-item label="发票抬头" prop="invoiceTitle">
          <!-- <el-select class="select" value-key="id" @change="currentSel" v-model="invoice.title"> -->
          <!-- <el-select class="select" value-key="id" @change="currentSel" v-model="invoice.title"> -->
          <el-select
            class="select"
            value-key="id"
            @change="currentSel"
            v-model="projectForm.invoiceTitle"
          >
            <el-option
              v-for="(item) in invoiceData"
              :key="item.id"
              :label="item.title"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="是否在管" prop="is_manage">
          <el-select v-model.number="projectForm.is_manage">
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>-->
        <el-form-item v-if="isShow" label="小区总户数" prop="buildingNum">
          <el-input v-model.number="projectForm.buildingNum"></el-input>
        </el-form-item>
        <el-form-item v-if="!isShow" label="入驻企业数" prop="buildingNum">
          <el-input v-model.number="projectForm.buildingNum"></el-input>
        </el-form-item>
        <!-- <el-form-item label="门栋总数" prop="resident_no">
          <el-input v-model.number="projectForm.resident_no"></el-input>
        </el-form-item>-->
        <el-form-item label="车位数" prop="park_no">
          <el-input v-model.number="projectForm.park_no"></el-input>
        </el-form-item>
        <el-form-item label="项目经理" prop="project_manager">
          <el-input v-model="projectForm.project_manager"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="telphone_no">
          <el-input :maxlength="11" v-model="projectForm.telphone_no"></el-input>
        </el-form-item>
        <el-form-item label="项目类型" prop="type">
          <el-select @change="getType" v-model.number="projectForm.type">
            <el-option label="居住" :value="0"></el-option>
            <el-option label="非居住" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item prop="createTime" label="合同期限"> -->
        <el-form-item label="合同期限">
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="projectForm.createTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <a href="javascript:;" class="project-btn btn1" @click="submitForm('projectForm')">确定</a>
        <a href="javascript:;" class="project-btn btn2" @click="closeForm('projectForm')">关闭</a>
      </div>
    </el-dialog>
    <!-- 查看 对话框 -->
    <el-dialog title="查看信息" id="seeDialog" :visible.sync="dialogVisible" width="30%">
      <p>
        <span>项目名称</span>
        <span>{{companyData.name}}</span>
      </p>
      <p>
        <span>地址</span>
        <!-- <span>{{quyu}}</span> -->
        <span>{{companyData.area}}</span>
      </p>
      <p>
        <span>详细门牌</span>
        <span>{{companyData.address}}</span>
      </p>
      <p>
        <span>发票抬头</span>
        <span>{{companyData.invoiceTitle}}</span>
      </p>
      <p>
        <span>是否在管</span>
        <span>{{companyData.is_manage}}</span>
      </p>
      <p>
        <span>{{isShow ? '小区总户数' : '入驻企业数'}}</span>
        <span>{{companyData.buildingNum}}</span>
      </p>
      <!-- <p>
        <span>门栋总数</span>
        <span>{{companyData.resident_no}}</span>
      </p>-->
      <p>
        <span>车位数</span>
        <span>{{companyData.park_no}}</span>
      </p>
      <p>
        <span>项目经理</span>
        <span>{{companyData.project_manager}}</span>
      </p>
      <p>
        <span>联系电话</span>
        <span>{{companyData.telphone_no}}</span>
      </p>
      <p>
        <span>居住类型</span>
        <span>{{companyData.type}}</span>
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { regionDataPlus, CodeToText } from "element-china-area-data";
import {
  getProjectRoleListAll,
  projectAdd,
  getProjectInformation,
  projectEdit,
  projectDel,
  projecLookup,
  getUserListTotal,
  queryInvoiceList,
  sysRegion
} from "@/api/information/information";
// 处理省市区相同
import { handleRepeat } from '@/validate/handle'
export default {
  name: "project",
  data() {
    return {
      // 小区数据列表
      tableData: [],
      // 总条数
      totalNum: 1,
      // 显示条数
      pageSize: 10,
      // 显示页数
      // 分页
      pageNum: 1,
      // 查看信息 对话框
      dialogVisible: false,
      // 添加 修改 对话框
      dialogFormVisible: false,
      formInline: {
        // 小区名字
        name: "",
        // 开票抬头
        invoiceTitle: "",
        // 是否在管
        is_manage: ""
      },
      // 添加和编辑对话框标题
      titleMap: {
        addEquipment: "添加项目",
        editEquipment: "修改"
      },
      //新增和编辑弹框标题
      dialogStatus: "",
      titleName: "",
      quyu: "",
      // 省市区数据
      options: [],
      // options: regionDataPlus,
      // selectedOptions: [],
      // 添加表单数据
      projectForm: {
        // 项目名
        name: "",
        // 区域
        // 省
        province: "",
        // 市
        city: "",
        // 区
        county: "",
        // 项目地址
        address: "",
        // 发票抬头
        // taitou: "",
        // 是否在管
        is_manage: "",
        // 小区总户数
        buildingNum: "",
        // 门栋总数
        resident_no: "",
        // 常停车辆数
        park_no: "",
        // 项目经理
        project_manager: "",
        // 联系电话
        telphone_no: "",
        // 发票抬头
        invoiceTitle: "",
        // 发票抬头id
        invoiceTitleId: "",
        selectedOptions: [],
        // 项目类型
        type: 0,
        // 合同时间
        // createTime: ["", ""],
        createTime: []
      },
      // 验证
      rules: {
        // 项目名
        name: [{ required: true, message: "请输入项目名称", trigger: "blur" }],
        // 项目地址
        address: [
          { required: true, message: "请输入项目地址", trigger: "blur" }
        ],
        // 发票抬头
        invoiceTitle: [
          { required: true, message: "请输入发票抬头", trigger: "blur" }
        ],
        // 小区总户数
        buildingNum: [
          { required: true, message: "请输入数量", trigger: "blur" }
        ],
        // 地址
        selectedOptions: [
          { required: true, message: "请选择地址", trigger: "blur" }
        ],
        // 项目经理
        project_manager: [
          { required: true, message: "请输入项目经理", trigger: "blur" }
        ],
        // 项目类型
        type: [{ required: true, message: "请选择项目类型", trigger: "blur" }],
        // 联系电话
        telphone_no: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            // pattern: /^0{0,1}(13[0-9]|15[7-9]|153|156|18[7-9])[0-9]{8}$/,
            pattern: /^1(3|4|5|6|7|8|9)\d{9}$/,
            message: "手机号格式不对",
            trigger: "blur"
          }
        ],
        // 请选择合同时间
        createTime: [
          { required: true, message: "请选择合同时间", trigger: "change" }
        ]
      },
      // 查看
      companyData: {
        // 项目名
        name: "",
        // 区域
        // 省
        province: "",
        // 市
        city: "",
        // 区
        county: "",
        // 项目地址
        address: "",
        // 发票抬头
        taitou: "暂无",
        // 是否在管
        is_manage: "",
        // 小区总户数
        buildingNum: "暂无",
        // 门栋总数
        resident_no: "",
        // 常停车辆数
        park_no: "",
        // 项目经理
        project_manager: "",
        // 联系电话
        telphone_no: ""
      },
      // 发票抬头
      invoiceData: [],
      //
      invoice: {
        title: "",
        id: ""
      },
      // 区域保存
      regionData: {
        // 所在区域
        // 省
        province: "",
        // 市
        city: "",
        // 区
        county: ""
      },
      // 当前物业id
      compId:'',
      // 当前主键id
      applyId:'',
      isShow:true
    };
  },
  created() {
    // 获取小区列表信息
    this.getProje();
    // 获取发票抬头
    this.getInvoiceList();
    this.getRegion();
  },
  methods: {
    // 项目类型
    getType(val){
      // console.log(val);
      if(val == '0'){
        this.isShow =true
      }else if(val == '1'){
        this.isShow =false
      }
      
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
    // 获取项目（小区）列表方法
    getProje() {
      let page = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        name: this.formInline.name,
        is_manage: this.formInline.is_manage,
        invoiceTitle:this.formInline.invoiceTitle
      };
      // 获取项目（小区）列表
      getProjectRoleListAll(page).then(xhrData => {
        if (xhrData.code === 200) {
          for (var i = 0; i < xhrData.rows.length; i++) {
            if (xhrData.rows[i].is_manage == 1) {
              xhrData.rows[i].is_manage = "在管";
            } else if (xhrData.rows[i].is_manage == 2) {
              xhrData.rows[i].is_manage = "合同终止";
            }
          }
          this.tableData = xhrData.rows;
          this.totalNum = xhrData.total;
        }
      });
    },
    // 获取发票抬头信息
    getInvoiceList() {
      // 请求 发票抬头信息
      const page = {
        title: "",
        recipient: ""
      };
      queryInvoiceList(page).then(xhrData => {
        if (xhrData.code === 200) {
          this.invoiceData = xhrData.rows;
        }
      });
    },
    // 查询
    onSubmit() {
      this.getProje();
    },
    handleSizeChange(val) {
      // 注意：在改变每页显示的条数时，要将页码显示到第一页
      this.pageNum = 1;
      // 改变每页显示的条数
      this.pageSize = val;
      this.getProje();
    },
    handleCurrentChange(val) {
      // 改变默认的页数
      this.pageNum = val;
      this.getProje();
    },
    // 查看
    projectSee(row) {
      // console.log(row);
      
      this.dialogVisible = true;
      this.quyu = row.province + row.city + row.county;
      this.companyData = row;
      if(this.companyData.type == '0'){
        this.companyData.type = '居住'
        this.isShow = true
      }else if(this.companyData.type == '1'){
        this.companyData.type = '非居住'
        this.isShow = false
      }
    },
    // 对话框 确认 按钮
    submitForm(formName) {
      this.projectForm.address = this.projectForm.address.replace(/；/g, ";");
      if (this.titleName == "添加项目") {
        // if (this.regionData.city == undefined) {
        //   this.projectForm.city = " ";
        // } else {
        //   this.projectForm.city = this.regionData.city;
        //   // this.companyData.city = this.regionData.city;
        // }
        // if (this.regionData.county == undefined) {
        //   this.projectForm.county = " ";
        // } else {
        //   this.projectForm.county = this.regionData.county;
        //   // this.companyData.county = this.regionData.county;
        // }
        // if (this.regionData.province == "全部") {
        //   this.$message.warning({
        //     message: "所在区域不能为全部!"
        //   });
        //   // 更新数据
        //   this.getProje();
        // }
        // else if (this.regionData.province == "") {
        //   this.$message.warning({
        //     message: "请选择活动区域!"
        //   });
        // }
        // else {
        this.projectForm.province = this.regionData.province;
        // this.projectForm.address=

        this.$refs["projectForm"].validate(valid => {
          // console.log();
          // if (
          //   this.projectForm.createTime[0] == "" ||
          //   this.projectForm.createTime[1] == ""
          // ) {
          //   this.$message.warning({
          //     message: "请选择合同期限!"
          //   });
          //   return;
          // }

          // 验证成功
          if (valid) {
            // if()
            // 开始时间
            // console.log(this.projectForm.createTime);
            if (this.projectForm.createTime == null) {
              this.projectForm.createTime = ["", ""];
            }
            if (
              this.projectForm.createTime[0] == "" ||
              this.projectForm.createTime[1] == ""
            ) {
              this.projectForm.startTime = null;
              this.projectForm.endTime = null;
            } else {
              this.projectForm.startTime =
                this.projectForm.createTime[0] + " 00:00:00";
              this.projectForm.endTime =
                this.projectForm.createTime[1] + " 23:59:59";
            }
            // console.log(this.projectForm);
            // alert("submit!");
            // 请求添加
            if (this.projectForm.invoiceTitle == "") {
              this.$message.warning({
                message: "请选择发票抬头!"
              });
            }
            delete this.projectForm.createTime;
            // console.log(this.projectForm);
            const data = {
              address: this.projectForm.address,
              buildingNum: this.projectForm.buildingNum,
              province: this.projectForm.selectedOptions[0],
              city: this.projectForm.selectedOptions[1],
              county: this.projectForm.selectedOptions[2],
              endTime: this.projectForm.endTime,
              startTime: this.projectForm.startTime,
              invoiceTitle: this.projectForm.invoiceTitle.title,
              invoiceTitleId: this.projectForm.invoiceTitle.id,
              name: this.projectForm.name,
              park_no: this.projectForm.park_no,
              project_manager: this.projectForm.project_manager,
              telphone_no: this.projectForm.telphone_no,
              type: this.projectForm.type
            };
            data.area = handleRepeat(data.province,data.city,data.county)
            // console.log(data);
            projectAdd(data).then(xhrData => {
              if (xhrData.code === 200) {
                this.$message.success({
                  message: "添加成功!"
                });
                // 更新小区列表信息
                this.getProje();
                // 清空表单
                this.$nextTick(() => {
                  this.$refs["projectForm"].resetFields();
                  this.projectForm.selectedOptions = [];
                });
                // 关闭 对话框
                this.dialogFormVisible = false;
              } else {
                this.$message.error({
                  message: "添加失败!"
                });
              }
            });
          } else {
            // console.log("error submit!!");
            this.$message.warning({
              message: "请完善信息!"
            });
            return false;
          }
        });
        // }
      } else if (this.titleName == "修改") {
        // 请求修改
        if (this.regionData.city == undefined) {
          this.projectForm.city = " ";
        } else {
          this.projectForm.city = this.regionData.city;
          // this.companyData.city = this.regionData.city;
        }
        if (this.regionData.county == undefined) {
          this.projectForm.county = " ";
        } else {
          this.projectForm.county = this.regionData.county;
          // this.companyData.county = this.regionData.county;
        }
        if (this.regionData.province == "全部") {
          this.$message.warning({
            message: "所在区域不能为全部!"
          });
          // 更新数据
          this.getProje();
        } else {
          // this.projectForm.province = this.regionData.province;
          // 开始时间
          // this.projectForm.startTime =
          //   this.projectForm.createTime[0] + " 00:00:00";
          // this.projectForm.endTime =
          //   this.projectForm.createTime[1] + " 23:59:59";
          if (this.projectForm.createTime == null) {
            this.projectForm.createTime = ["", ""];
          }
          if (
            this.projectForm.createTime[0] == "" ||
            this.projectForm.createTime[1] == ""
          ) {
            this.projectForm.startTime = null;
            this.projectForm.endTime = null;
          } else {
            this.projectForm.startTime =
              this.projectForm.createTime[0] + " 00:00:00";
            this.projectForm.endTime =
              this.projectForm.createTime[1] + " 23:59:59";
          }

          const data = {};
          this.$refs["projectForm"].validate(valid => {
            if (valid) {
              data.compId = this.compId  
              data.id = this.applyId
              data.name = this.projectForm.name; // 项目名称
              data.address = this.projectForm.address; // 项目地址
              data.province = this.projectForm.selectedOptions[0]; // 省
              data.city = this.projectForm.selectedOptions[1]; // 市
              data.county = this.projectForm.selectedOptions[2]; // 区
              data.invoiceTitleId = this.projectForm.invoiceTitle.id; // 发票抬头
              data.buildingNum = this.projectForm.buildingNum; // 小区总户数
              data.project_manager = this.projectForm.project_manager; // 项目经理
              data.park_no = this.projectForm.park_no; // 车辆数
              data.telphone_no = this.projectForm.telphone_no; // 联系电话
              data.type = this.projectForm.type; // 项目类型
              data.startTime = this.projectForm.startTime; // 合同开始时间
              data.endTime = this.projectForm.endTime; // 合同结束时间
              data.area = handleRepeat(data.province,data.city,data.county)
              // console.log(data);
              projectEdit(data).then(xhrData => {
                if (xhrData.code === 200) {
                  this.$message.success({
                    message: "修改成功!"
                  });
                  // 更新小区列表信息
                  this.getProje();
                  // 清空表单
                  this.$nextTick(() => {
                    this.$refs["projectForm"].resetFields();
                    this.projectForm.selectedOptions = [];
                  });
                  // 关闭 对话框
                  this.dialogFormVisible = false;
                }
              });
            } else {
              this.$message.warning({
                message: "请完善信息!"
              });
              return false;
            }
          });
        }
      }
    },
    // 关闭按钮
    closeForm() {
      // 清空表单
      this.$nextTick(() => {
        this.$refs["projectForm"].resetFields();
        this.projectForm.selectedOptions = [];
      });
      this.dialogFormVisible = false;
    },
    // 关闭对话框
    resetForm(formName) {
      // 清空表单
      this.$nextTick(() => {
        this.$refs["projectForm"].resetFields();
        this.projectForm.selectedOptions = [];
      });
    },
    // 修改
    projectModify(row) {
      // 还原时间
      this.projectForm.createTime = ["", ""];
      // 打开对话框
      this.dialogFormVisible = true;
      this.titleName = "修改";
      //  this.dialogStatus = "editEquipment"
      // 获取小区信息
      getProjectInformation(row.id).then(xhrData => {
        // console.log(xhrData);
        if (xhrData.code === 200) {
          let data = xhrData.data;
          // 居住类型 显示小区总户数
          if(data.type == 0){
            this.isShow = true
          }else if(data.type == 1){
            this.isShow = false
          }
          this.compId = data.compId
          this.applyId = data.id
          let arr = [];
          let form = this.projectForm;
          arr[0] = data.province;
          arr[1] = data.city;
          arr[2] = data.county;
          this.$set(form, "selectedOptions", arr);
          form.name = data.name;
          form.address = data.address;
          // form.invoiceTitle = data.invoiceTitle
          form.invoiceTitle = {};
          form.invoiceTitle.id = data.invoiceTitleId;
          form.invoiceTitle.title = data.invoiceTitle;
          form.buildingNum = data.buildingNum;
          form.park_no = data.park_no;
          form.project_manager = data.project_manager;
          form.type = data.type;
          form.telphone_no = data.telphone_no;
          if (data.startTime == null || data.endTime == null) {
            data.startTime = ''+' '
            data.endTime = ''+' '
          }
          // projectForm.createTime
          let createTime = [];
          createTime[0] = data.startTime.split(" ")[0];
          createTime[1] = data.endTime.split(" ")[0];
          this.$set(form, "createTime", createTime);
        }
      });
    },
    // 删除
    projectDelete(row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          projectDel(row.id).then(xhrData => {
            if (xhrData.code === 200) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              // 更新小区信息
              this.getProje();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 添加项目
    AddProject() {
      // 默认显示小区总户数
      this.isShow = true
      // 打开对话框
      this.dialogFormVisible = true;
      this.titleName = "添加项目";
      // this.dialogStatus = "addEquipment";
      // 还原发票抬头
      this.invoice.title = "";
      // 还原时间
      this.projectForm.createTime = ["", ""];
    },
    // 获取省市区信息
    // 选择公司所在省、市、区
    handleChange() {
      // 处理 省市级 数据
      this.regionData.province = this.projectForm.selectedOptions[0];
      this.regionData.city = this.projectForm.selectedOptions[1];
      this.regionData.county = this.projectForm.selectedOptions[2];
      if (this.regionData.province !== undefined) {
        this.regionData.province = CodeToText[this.regionData.province];
        // this.projectForm.province =  CodeToText[this.regionData.province]
      }
      if (this.regionData.city !== undefined) {
        this.regionData.city = CodeToText[this.regionData.city];
        // this.projectForm.city =  CodeToText[this.regionData.city]
      }
      if (this.regionData.county !== undefined) {
        this.regionData.county = CodeToText[this.regionData.county];
        // this.projectForm.county =  CodeToText[this.regionData.county]
      }
    },
    //
    currentSel(val) {
      // console.log(val);
      
      // this.projectForm.invoiceTitle = val.title;
      // this.projectForm.invoiceTitleId = val.id;
    }
  }
};
</script>
<style>
.el-range-editor--medium .el-range-separator {
  width: 20px;
}
#project-dialog .el-dialog__header,
#seeDialog .el-dialog__header {
  background-color: #e6e8eb;
}
#project-dialog .project-btn {
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
#project-dialog .project-btn.btn1 {
  background: rgba(239, 130, 0, 1);
  border: 1px solid rgba(206, 112, 0, 1);
  color: #fff;
}
#project-dialog .project-btn.btn2 {
  border: 1px solid rgba(0, 0, 0, 0.25);
}
#project-dialog .el-dialog__title,
#seeDialog .el-dialog__title {
  font-size: 20px;
  font-weight: bold;
}
#project-dialog .el-dialog__body {
  padding-left: 40px;
  padding-right: 40px;
  padding-bottom: 0;
  box-sizing: border-box;
}
#project-dialog .el-dialog__footer,
#seeDialog .el-dialog__footer {
  background-color: #e6e8eb;
}
#seeDialog .el-dialog__body {
  padding-left: 30px;
  padding-right: 30px;
  padding-bottom: 30px;
  box-sizing: border-box;
}
#seeDialog .el-dialog__footer {
  padding-bottom: 10px;
}
#project-dialog .el-cascader {
  width: 100%;
}
#project-dialog .el-select.select {
  width: 100%;
}
</style>
<style lang="scss" scoped>
.project {
  width: 100%;
  padding: 15px;
  min-height: calc(88vh);
  box-sizing: border-box;
  background-color: #e6e8eb;
  padding-bottom: 30px;

  .project-conter {
    min-height: calc(88vh);
    background-color: #fff;
    border-radius: 5px;
    position: relative;
    padding-bottom: 100px;
    .project-top {
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
    .el-pagination {
      position: absolute;
      bottom: 20px;
      left: 20px;
      right: 0;
    }
  }
  #seeDialog {
    p {
      font-size: 14px;
      // color: #686868;
      color: #666;
      display: flex;
      margin-top: 20px;
      span:nth-child(1) {
        display: block;
        min-width: 110px;
        text-align: right;
      }
      span:nth-child(2) {
        display: block;
        margin-left: 50px;
      }
    }
  }
}
</style>
<template>
  <!-- 合作产品 -->
  <div class="publicStyle">
    <div class="publicStyle-conter">
      <!-- 列表 -->
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="index" label="序号" width="80"></el-table-column>
        <el-table-column prop="prodTypeName" label="产品名称" min-width="30%"></el-table-column>
        <el-table-column prop="state" label="状态" min-width="30%"></el-table-column>
        <el-table-column label="操作" min-width="40%">
          <template slot-scope="scope">
            <!-- v-if="!(scope.row.code == 'HOUSE' || scope.row.code == 'EMP')" -->
            <a
              href="javascript:;"
              style="margin-right:3px; color: #1890ff;"
              @click="modify(scope.row)"
              v-if="!(scope.row.code == 'HOUSE' || scope.row.code == 'EMP_CUSTOM')"
            >修改方案</a>
            <span v-if="!(scope.row.code == 'HOUSE' || scope.row.code == 'EMP_CUSTOM')">|</span>
            <a
              href="javascript:;"
              style="margin-right:3px; color: #1890ff;"
              @click="setCheckedKeys(scope.row)"
            >合作地域</a>|
            <a
              href="javascript:;"
              style="margin-right:3px; color: #1890ff;"
              @click="clause(scope.row)"
            >保险条款</a>
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
      <!-- 保险条款对话框 -->
      <el-dialog
        title="保险条款"
        id="seeDialog"
        class="seeDialog"
        :visible.sync="dialogVisible1"
        width="50%"
      >
        <el-form
          ref="form"
          class="demo-ruleForm"
          :model="form"
          label-width="100px"
          label-position="left"
        >
          <el-form-item label="保险条款:" style="width:100%">
            <el-input
              placeholder="请输入内容"
              type="textarea"
              :rows="10"
              maxlength="30000"
              show-word-limit
              v-model="form.insClause"
            ></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <a href="javascript:;" class="btn btn1" @click="preservation('form')">保 存</a>
          <a href="javascript:;" class="btn btn2" @click="dialogVisible1=false">取 消</a>
        </span>
      </el-dialog>
      <!-- 合作地域对话框 -->
      <el-dialog title="合作地域" class="seeDialog" :visible.sync="dialogVisible2" width="550px">
        <h3>规则设置</h3>
        <div class="seeDialog-tree">
          <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="区域选择:">
              <el-tree
                :data="treeData"
                show-checkbox
                node-key="id"
                ref="tree"
                :props="defaultProps"
                :default-expanded-keys="citySelectIdList"
                :default-checked-keys="citySelectIdList"
              ></el-tree>
            </el-form-item>
            <el-form-item label="合作时间:">
              <el-date-picker
                v-model="timeIntegration"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <a href="javascript:;" class="btn btn1" @click="getCheckedKeys">提 交</a>
          <a href="javascript:;" class="btn btn2" @click="dialogVisible2=false">取 消</a>
        </span>
      </el-dialog>
      <!-- 公众责任险修改方案 -->
      <el-dialog title="公众责任险方案" class="seeDialog" :visible.sync="dialogVisible3" width="800px">
        <p style="padding-bottom:15px">保险产品保障内容(保障范围以保险公司保单文本为准)</p>
        <div class="seeDialog-tree">
          <el-form
            :model="publicForm"
            :rules="publicRules"
            ref="publicForm"
            label-position="left"
            label-width="120px"
            class="demo-ruleForm"
          >
            <el-form-item prop="name" label="方案名称：">
              <el-input maxlength="10" show-word-limit v-model="publicForm.name"></el-input>
            </el-form-item>
            <el-form-item prop="riskRange" label="适用风险范围：">
              <el-input
              :autosize="{ minRows: 9, maxRows: 4}"
                maxlength="300"
                show-word-limit
                type="textarea"
                v-model="publicForm.riskRange"
              ></el-input>
            </el-form-item>
            <el-form-item style="margin-bottom:0px" label="保费（元）:"></el-form-item>
            <el-table :data="publicData" style="width: 100%">
              <el-table-column prop="projectType" label="项目类型" min-width="25%"></el-table-column>
              <el-table-column prop="name" label="保额" min-width="25%">
                <template slot-scope="scope" style="display:flex">
                  <el-col :span="19">
                    <el-input v-model="scope.row.amount"></el-input>
                  </el-col>
                  <el-col :span="4" :offset="1">
                    <span style="line-height: 36px;">元</span>
                  </el-col>
                </template>
              </el-table-column>
              <el-table-column prop="address" label="结算价" min-width="25%">
                <template slot-scope="scope" style="display:flex">
                  <el-col :span="19">
                    <el-input v-model="scope.row.settlement"></el-input>
                  </el-col>
                  <el-col :span="4" :offset="1">
                    <span style="line-height: 36px;">元</span>
                  </el-col>
                </template>
              </el-table-column>
              <el-table-column prop="address" label="保费" min-width="25%">
                <template slot-scope="scope" style="display:flex">
                  <el-col :span="19">
                    <el-input v-model="scope.row.premium"></el-input>
                  </el-col>
                  <el-col :span="4" :offset="1">
                    <span style="line-height: 36px;">元</span>
                  </el-col>
                </template>
              </el-table-column>
            </el-table>
            <el-form-item style="padding-top:20px" label="备注：">
              <el-input maxlength="300" show-word-limit type="textarea" v-model="publicForm.remake"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <a href="javascript:;" class="btn btn1" @click="publicSubmission">提 交</a>
          <a href="javascript:;" class="btn btn2" @click="dialogVisible3=false">取 消</a>
        </span>
      </el-dialog>
      <!-- 雇主险修改方案 -->
      <el-dialog title="雇主责任险方案" class="seeDialog" :visible.sync="dialogVisible4" width="800px">
        <p style="padding-bottom:15px">保险产品保障内容(保障范围以保险公司保单文本为准)</p>
        <el-form ref="employerForm" :model="employerForm" label-width="120px">
          <h4 style="padding:10px 0;font-size: 15px">方案名称： 70万+2万</h4>
          <div style="display:flex;justify-content: space-between">
            <el-form-item label="结算价格(天)：">
              <el-input
                @blur="getInput($event)"
                oninput="value=value.replace(/[^\d]/g,'')"
                style="width:220px;flex:1"
                v-model.number.trim="employerForm.oneAccountDay"
              ></el-input>
              <span>元</span>
            </el-form-item>
            <el-form-item label="保费金额(天)：">
              <el-input
                @blur="getInput($event)"
                oninput="value=value.replace(/[^\d]/g,'')"
                style="width:220px;flex:1"
                v-model.number.trim="employerForm.oneAmountDay"
              ></el-input>
              <span>元</span>
            </el-form-item>
          </div>
          <div style="display:flex;justify-content: space-between">
            <el-form-item label="结算价格(月)：">
              <el-input
                @blur="getInput($event)"
                oninput="value=value.replace(/[^\d]/g,'')"
                style="width:220px;flex:1"
                v-model.number.trim="employerForm.oneAccountMonth"
              ></el-input>
              <span>元</span>
            </el-form-item>
            <el-form-item label="保费金额(月)：">
              <el-input
                @blur="getInput($event)"
                oninput="value=value.replace(/[^\d]/g,'')"
                style="width:220px;flex:1"
                v-model.number.trim="employerForm.oneAmountMonth"
              ></el-input>
              <span>元</span>
            </el-form-item>
          </div>
          <div style="display:flex;justify-content: space-between">
            <el-form-item label="结算价格(年)：">
              <el-input
                @blur="getInput($event)"
                oninput="value=value.replace(/[^\d]/g,'')"
                style="width:220px;flex:1"
                v-model.number.trim="employerForm.oneAccountYear"
              ></el-input>
              <span>元</span>
            </el-form-item>
            <el-form-item label="保费金额(年)：">
              <el-input
                @blur="getInput($event)"
                oninput="value=value.replace(/[^\d]/g,'')"
                style="width:220px;flex:1"
                v-model.number.trim="employerForm.oneAmountYear"
              ></el-input>
              <span>元</span>
            </el-form-item>
          </div>
          <h4 style="padding:10px 0;font-size: 15px">方案名称： 70万+4万</h4>
          <div style="display:flex;justify-content: space-between">
            <el-form-item label="结算价格(天)：">
              <el-input
                @blur="getInput($event)"
                oninput="value=value.replace(/[^\d]/g,'')"
                style="width:220px;flex:1"
                v-model.number.trim="employerForm.twoAccountDay"
              ></el-input>
              <span>元</span>
            </el-form-item>
            <el-form-item label="保费金额(天)：">
              <el-input
                @blur="getInput($event)"
                oninput="value=value.replace(/[^\d]/g,'')"
                style="width:220px;flex:1"
                v-model.number.trim="employerForm.twoAmountDay"
              ></el-input>
              <span>元</span>
            </el-form-item>
          </div>
          <div style="display:flex;justify-content: space-between">
            <el-form-item label="结算价格(月)：">
              <el-input
                @blur="getInput($event)"
                oninput="value=value.replace(/[^\d]/g,'')"
                style="width:220px;flex:1"
                v-model.number.trim="employerForm.twoAccountMonth"
              ></el-input>
              <span>元</span>
            </el-form-item>
            <el-form-item label="保费金额(月)：">
              <el-input
                @blur="getInput($event)"
                oninput="value=value.replace(/[^\d]/g,'')"
                style="width:220px;flex:1"
                v-model.number.trim="employerForm.twoAmountMonth"
              ></el-input>
              <span>元</span>
            </el-form-item>
          </div>
          <div style="display:flex;justify-content: space-between">
            <el-form-item label="结算价格(年)：">
              <el-input
                @blur="getInput($event)"
                oninput="value=value.replace(/[^\d]/g,'')"
                style="width:220px;flex:1"
                v-model.number.trim="employerForm.twoAccountYear"
              ></el-input>
              <span>元</span>
            </el-form-item>
            <el-form-item label="保费金额(年)：">
              <el-input
                @blur="getInput($event)"
                oninput="value=value.replace(/[^\d]/g,'')"
                style="width:220px;flex:1"
                v-model.number.trim="employerForm.twoAmountYear"
              ></el-input>
              <span>元</span>
            </el-form-item>
          </div>
          <h4 style="padding:10px 0;font-size: 15px">方案名称： 50万+2万</h4>
          <div style="display:flex;justify-content: space-between">
            <el-form-item label="结算价格(天)：">
              <el-input
                @blur="getInput($event)"
                oninput="value=value.replace(/[^\d]/g,'')"
                style="width:220px;flex:1"
                v-model.number.trim="employerForm.threeAccountDay"
              ></el-input>
              <span>元</span>
            </el-form-item>
            <el-form-item label="保费金额(天)：">
              <el-input
                @blur="getInput($event)"
                oninput="value=value.replace(/[^\d]/g,'')"
                style="width:220px;flex:1"
                v-model.number.trim="employerForm.threeAmountDay"
              ></el-input>
              <span>元</span>
            </el-form-item>
          </div>
          <div style="display:flex;justify-content: space-between">
            <el-form-item label="结算价格(月)：">
              <el-input
                @blur="getInput($event)"
                oninput="value=value.replace(/[^\d]/g,'')"
                style="width:220px;flex:1"
                v-model.number.trim="employerForm.threeAccountMonth"
              ></el-input>
              <span>元</span>
            </el-form-item>
            <el-form-item label="保费金额(月)：">
              <el-input
                @blur="getInput($event)"
                oninput="value=value.replace(/[^\d]/g,'')"
                style="width:220px;flex:1"
                v-model.number.trim="employerForm.threeAmountMonth"
              ></el-input>
              <span>元</span>
            </el-form-item>
          </div>
          <div style="display:flex;justify-content: space-between">
            <el-form-item label="结算价格(年)：">
              <el-input
                @blur="getInput($event)"
                oninput="value=value.replace(/[^\d]/g,'')"
                style="width:220px;flex:1"
                v-model.number.trim="employerForm.threeAccountYear"
              ></el-input>
              <span>元</span>
            </el-form-item>
            <el-form-item label="保费金额(年)：">
              <el-input
                @blur="getInput($event)"
                oninput="value=value.replace(/[^\d]/g,'')"
                style="width:220px;flex:1"
                v-model.number.trim="employerForm.threeAmountYear"
              ></el-input>
              <span>元</span>
            </el-form-item>
          </div>
          <h4 style="padding:10px 0;font-size: 15px">方案名称： 50万+4万</h4>
          <div style="display:flex;justify-content: space-between">
            <el-form-item label="结算价格(天)：">
              <el-input
                @blur="getInput($event)"
                oninput="value=value.replace(/[^\d]/g,'')"
                style="width:220px;flex:1"
                v-model.number.trim="employerForm.fourAccountDay"
              ></el-input>
              <span>元</span>
            </el-form-item>
            <el-form-item label="保费金额(天)：">
              <el-input
                @blur="getInput($event)"
                oninput="value=value.replace(/[^\d]/g,'')"
                style="width:220px;flex:1"
                v-model.number.trim="employerForm.fourAmountDay"
              ></el-input>
              <span>元</span>
            </el-form-item>
          </div>
          <div style="display:flex;justify-content: space-between">
            <el-form-item label="结算价格(月)：">
              <el-input
                @blur="getInput($event)"
                oninput="value=value.replace(/[^\d]/g,'')"
                style="width:220px;flex:1"
                v-model.number.trim="employerForm.fourAccountMonth"
              ></el-input>
              <span>元</span>
            </el-form-item>
            <el-form-item label="保费金额(月)：">
              <el-input
                @blur="getInput($event)"
                oninput="value=value.replace(/[^\d]/g,'')"
                style="width:220px;flex:1"
                v-model.number.trim="employerForm.fourAmountMonth"
              ></el-input>
              <span>元</span>
            </el-form-item>
          </div>
          <div style="display:flex;justify-content: space-between">
            <el-form-item label="结算价格(年)：">
              <el-input
                @blur="getInput($event)"
                oninput="value=value.replace(/[^\d]/g,'')"
                style="width:220px;flex:1"
                v-model.number.trim="employerForm.fourAccountYear"
              ></el-input>
              <span>元</span>
            </el-form-item>
            <el-form-item label="保费金额(年)：">
              <el-input
                @blur="getInput($event)"
                oninput="value=value.replace(/[^\d]/g,'')"
                style="width:220px;flex:1"
                v-model.number.trim="employerForm.fourAmountYear"
              ></el-input>
              <span>元</span>
            </el-form-item>
          </div>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <a href="javascript:;" class="btn btn1" @click="employerSubmission">提 交</a>
          <a href="javascript:;" class="btn btn2" @click="dialogVisible4=false">取 消</a>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import "../../../../assets/styles/publicStyle.css";
// insCompanyProductGetList
// 请求
import {
  insCompanyProductGetList,
  insCompanyProductAddInsClause,
  insCooperationRuleGetList,
  insCooperationRuleUpdateRule,
  insPlanGet,
  insPlanPost,
  insPlanPut
} from "@/api/information/information";
export default {
  name: "",
  data() {
    return {
      // 保险条款对话框
      dialogVisible1: false,
      // 合作地域对话框
      dialogVisible2: false,
      // 公众责任险方案对话框
      dialogVisible3: false,
      // 雇主险修改方案对话框
      dialogVisible4: false,
      // 公众责任险表单数据
      publicForm: {},
      // 雇主责任险表单数据
      employerForm: {},
      // 公众责任险表格数据
      publicData: [
        {
          projectType: "居住项目",
          type: "0"
        },
        {
          projectType: "商用项目",
          type: "1"
        }
      ],
      // 公众责任险表单验证
      publicRules: {
        //
        name: [{ required: true, message: "请输入方案名称", trigger: "blur" }],
        riskRange: [
          { required: true, message: "请输入适用风险范围", trigger: "blur" }
        ]
      },
      // 列表数据
      tableData: [],
      // 总条数
      totalNum: 1,
      // 显示条数
      pageSize: 10,
      // 显示页数
      // 分页
      pageNum: 1,
      // 表单
      form: {
        insClause: ""
      },
      //
      ruleForm: {},
      // 树形控件
      treeData: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 保存默认选中省市
      citySelectIdList: [],
      // 合作地域表单
      treeForm: {},
      // 时间表数据
      timeIntegration: ["", ""],
      // 修改或新增
      isAdded: Boolean,
      // 修改方案的id
      modifyId1: "",
      modifyId2: "",
      insCode:''
    };
  },
  created() {
    // console.log(this.$route.query.id);
    this.getListData();
  },
  methods: {
    // 获取列表信息
    getListData() {
      // 当前项目id
      // this.$route.query.id
      // 请求获取列表
      insCompanyProductGetList(this.$route.query.id).then(xhrData => {
        // console.log(xhrData);

        if (xhrData.code === 200) {
          this.tableData = xhrData.rows;
          for (let i = 0; i < this.tableData.length; i++) {
            if (this.tableData[i].state == "0") {
              this.tableData[i].state = "合作中";
            } else if (this.tableData[i].state == "1") {
              this.tableData[i].state = "终止合作";
            }
          }
          // 总条数
          this.totalNum = xhrData.total;
        }
      });
    },

    // 保险条款
    clause(row) {
      // 打开保险条款对话框
      this.dialogVisible1 = true;
      // console.log(row);
      this.form.id = row.id;
      this.form.insClause = row.insClause;
    },
    // 修改方案
    modify(row) {
      this.insCode = row.code
      // console.log(row);
      this.modifyId = row.id;
      // 公众责任险
      if (row.code == "PUB") {
        this.dialogVisible3 = true;
        this.publicForm = {
          name: "",
          riskRange: "",
          remake: ""
        };
        this.publicData = [
          {
            projectType: "居住项目",
            type: "0",
            amount: "",
            settlement: "",
            premium: ""
          },
          {
            projectType: "商用项目",
            type: "1",
            amount: "",
            settlement: "",
            premium: ""
          }
        ];
        const data = {
          insCompId: this.$route.query.id,
          insType: "0"
        };
        insPlanGet(data).then(xhrData => {
          if (xhrData.code === 200) {
            if (xhrData.data <= 0 || xhrData.data == undefined) {
              // 调用新增
              this.isAdded = true;
            } else {
              // 调用修改
              this.isAdded = false;
              // console.log(xhrData.data, "xhr");
              this.publicForm.name = xhrData.data[0].name;
              this.publicForm.riskRange = xhrData.data[0].riskRange;
              this.publicForm.remake = xhrData.data[0].remake;
              this.publicData[0].amount = xhrData.data[0].insuredAmount;
              this.publicData[0].settlement = xhrData.data[0].realPremium;
              this.publicData[0].premium = xhrData.data[0].yearPremium;
              this.publicData[1].amount = xhrData.data[1].insuredAmount;
              this.publicData[1].settlement = xhrData.data[1].realPremium;
              this.publicData[1].premium = xhrData.data[1].yearPremium;
              this.modifyId1 = xhrData.data[0].id;
              this.modifyId2 = xhrData.data[1].id;
              // console.log(this.publicData);
            }
          }
        });
      }
      //
      else if (row.code == "PROP") {
        this.dialogVisible3 = true;
        this.publicForm = {
          name: "",
          riskRange: "",
          remake: ""
        };
        this.publicData = [
          {
            projectType: "居住项目",
            type: "0",
            amount: "",
            settlement: "",
            premium: ""
          },
          {
            projectType: "商用项目",
            type: "1",
            amount: "",
            settlement: "",
            premium: ""
          }
        ];
        const data = {
          insCompId: this.$route.query.id,
          insType: "1"
        };
        insPlanGet(data).then(xhrData => {
          if (xhrData.code === 200) {
            if (xhrData.data <= 0 || xhrData.data == undefined) {
              // 调用新增
              this.isAdded = true;
            } else {
              // 调用修改
              this.isAdded = false;
              // console.log(xhrData.data, "xhr");
              this.publicForm.name = xhrData.data[0].name;
              this.publicForm.riskRange = xhrData.data[0].riskRange;
              this.publicForm.remake = xhrData.data[0].remake;
              this.publicData[0].amount = xhrData.data[0].insuredAmount;
              this.publicData[0].settlement = xhrData.data[0].realPremium;
              this.publicData[0].premium = xhrData.data[0].yearPremium;
              this.publicData[1].amount = xhrData.data[1].insuredAmount;
              this.publicData[1].settlement = xhrData.data[1].realPremium;
              this.publicData[1].premium = xhrData.data[1].yearPremium;
              this.modifyId1 = xhrData.data[0].id;
              this.modifyId2 = xhrData.data[1].id;
              // console.log(this.publicData);
            }
          }
        });
      }
      // 雇主责任险
      else if (row.code == "EMP") {
        this.dialogVisible4 = true;
      }
    },
    //在改变每页显示的条数
    handleSizeChange(val) {
      // 注意：在改变每页显示的条数时，要将页码显示到第一页
      this.pageNum = 1;
      // 改变每页显示的条数
      this.pageSize = val;
      // 更新列表
    },
    // 页数
    handleCurrentChange(val) {
      // 改变默认的页数
      this.pageNum = val;
      // 更新列表
    },
    // 保险条款对话框 保存按钮
    preservation() {
      // 请求 保险条款
      insCompanyProductAddInsClause(this.form).then(xhrData => {
        // console.log(xhrData);
        if (xhrData.code === 200) {
          this.$message.success({
            message: "保存成功!"
          });
          // 关闭保险条款对话框
          this.dialogVisible1 = false;
          // 更新数据
          this.getListData();
        }
      });
    },
    // 合作地域
    setCheckedKeys(row) {
      // 打开合作地域对话框
      this.dialogVisible2 = true;
      // 清空时间
      this.timeIntegration = ["", ""];
      // 赋值当前项 id
      this.treeForm.companyProductId = row.id;
      // 请求 获取数据
      insCooperationRuleGetList(row.id).then(xhrData => {
        // console.log(xhrData);

        if (xhrData.code === 200) {
          // 赋值默认选中的值
          this.$nextTick(() => {
            this.citySelectIdList = xhrData.data.citySelectIdList;
            // console.log(this.citySelectIdList);
          });
          // 赋值数据
          this.treeData = xhrData.data.totalList;
          if (xhrData.data.startTime != null || xhrData.data.endTime != null) {
            const startTime = xhrData.data.startTime.split(" ")[0];
            const endTime = xhrData.data.endTime.split(" ")[0];
            // console.log(startTime, endTime);
            this.timeIntegration = [startTime, endTime];
          }
        }
      });
    },
    // 合作地域 提交按钮
    getCheckedKeys() {
      // 赋值 选中的地域 id
      // console.log(this.timeIntegration);

      this.treeForm.citySelectIdList = this.$refs.tree.getCheckedKeys();
      // 判断 是否有选中地域
      if (this.treeForm.citySelectIdList.length <= 0) {
        this.$message({
          type: "warning",
          message: "请选择地域!"
        });
        // 判断 是否有选择时间
      } else if (this.timeIntegration == null) {
        this.$message({
          type: "warning",
          message: "请选择时间!"
        });
      } else {
        // 处理地域
        for (var i = 0; i < this.treeForm.citySelectIdList.length; i++) {
          if (this.treeForm.citySelectIdList[i] == undefined) {
            this.treeForm.citySelectIdList.splice(i, 1);
            // break;
          }
        }
        // 开始时间
        this.treeForm.startTime = this.timeIntegration[0] + " 00:00:00";
        // 结束时间
        this.treeForm.endTime = this.timeIntegration[1] + " 23:59:59";
        // console.log(this.treeForm);
        // 请求 修改合作地域
        insCooperationRuleUpdateRule(this.treeForm).then(xhrData => {
          // console.log(xhrData);
          if (xhrData.code === 200) {
            // 提示
            this.$message({
              type: "success",
              message: " 提交成功!"
            });
            // 关闭 合作地域对话框
            this.dialogVisible2 = false;
            // 清空时间
            this.timeIntegration = ["", ""];
          }
        });
      }
    },
    // 公众责任险方案 提交按钮
    publicSubmission() {
      let insType = ''
      if(this.insCode == 'PUB'){
        insType = '0'
      }else if(this.insCode == 'PROP'){
        insType = '1'
      }
      const arr = [];
      this.publicData.forEach(item => {
        arr.push({
          insCompId: this.$route.query.id,
          name: this.publicForm.name,
          riskRange: this.publicForm.riskRange,
          remake: this.publicForm.remake,
          insuredAmount: item.amount,
          realPremium: item.settlement,
          yearPremium: item.premium,
          type: item.type,
          insType:insType
        });
      });
      // console.log(arr);
      // 新增
      if (this.isAdded) {
        insPlanPost(arr).then(xhrData => {
          if (xhrData.code === 200) {
            this.$message.success("提交成功！");
            //
            this.dialogVisible3 = false;
            //更新列表
            this.getListData();
          }
        });
      }
      // 修改
      else {
        arr[0].id = this.modifyId1;
        arr[1].id = this.modifyId2;
        insPlanPut(arr).then(xhrData => {
          if (xhrData.code === 200) {
            this.$message.success("修改成功！");
            //
            this.dialogVisible3 = false;
            //更新列表
            this.getListData();
          }
        });
      }
    },
    // 雇主险方案 按钮提交
    employerSubmission() {
      // console.log(this.employerForm);
    },
    getInput(e) {
      if (e.target.value == "0") {
        e.target.value = "";
      }
    }
  }
};
</script>
<style>
.el-checkbox__input.is-disabled .el-checkbox__inner {
  background-color: #ddd;
  border-color: rgb(196, 196, 196);
}
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
.seeDialog .seeDialog-tree {
  /* margin-left: 100px; */
  padding: 10px 0;
  /* margin-left: 50px; */
}
</style>
<style lang="scss" scoped>
.el-pagination {
  position: absolute;
  bottom: 40px;
  left: 20px;
  right: 0;
}
</style>
<template>
  <div class="legal-content">
    <div class="legal-instructions">
      <div class="instructions-title title">说明:</div>
      <div class="instructions-list">
        <div class="instructions-item" v-for="(item,index) in instructions" :key="index">
          <span>{{index+1}}、</span>
          <span>{{item.title}}</span>
          <span class="instructions-phone">{{item.phone}}</span>
        </div>
      </div>
    </div>
    <div class="legal-content-box">
      <!-- <div class="legal-counsel-content">
        <div class="legal-counsel-type">
          <div class="legal-counsel-type-title">
            <span class="title">律师函类型</span>
            <span class="legal-counsel-type-link cursor">【律师函模板】</span>
            <span class="legal-counsel-type-link cursor" @click="openQuestions">【常见问题】</span>
          </div>
          <div class="legal-counsel-radiobox">
            <span style="color:red;margin-left:-10px;margin-right:10px">*</span>
            <el-radio-group v-model="legalCounselType">
              <el-radio :label="item.id" v-for="(item,index) in legalCounselTypeList" :key="index">
                {{item.productName}}
                <span class="radiobox-red">¥{{item.productCharge}}/户</span>
              </el-radio>
            </el-radio-group>
          </div>
        </div>
        <div class="payment-account">
          <div class="legal-counsel-type-title">
            <span class="title">扣款账户</span>
          </div>
          <div class="payment-account-choose">
            <span class="payment-account-choose-left">扣费账户:</span>
            <el-select
              style="width:300px"
              value-key="name"
              v-model="paymentAccount"
              placeholder="请选择"
              @change="choice"
            >
              <el-option-group v-for="group in projectData" :key="group.name" :label="group.name">
                <el-option
                  v-for="item in group.options"
                  :key="item.name"
                  :label="item.name"
                  :value="item"
                ></el-option>
              </el-option-group>
            </el-select>
            <span style="color:red;margin-left:3px">*</span>
          </div>
          <div class="payment-account-choose payment-account-choose2">
            <span class="payment-account-choose-left">当前余额:</span>
            <span class="payment-account-choose-right">{{WYBalance}}</span>
          </div>
        </div>
        <div class="legal-counsel-contact-information">
          <el-divider></el-divider>
          <div class="legal-counsel-contact-information-title">
            <span class="title">物业公司收件人</span>
          </div>
          <div class="legal-counsel-input">
            <el-form label-position="left" label-width="120px">
              <el-form-item label="联系人:">
                <el-input
                  class="legal-counsel-input-style"
                  v-model.trim="legalCounsel.addresseeName "
                  maxlength="10"
                  show-word-limit
                  placeholder
                ></el-input>
                <span style="color:red">*</span>
              </el-form-item>
              <el-form-item label="联系人手机号:">
                <el-input
                  class="legal-counsel-input-style"
                  v-model.trim="legalCounsel.addresseeMobile "
                  maxlength="11"
                  show-word-limit
                  placeholder
                ></el-input>
                <span style="color:red">*</span>
              </el-form-item>
              <el-form-item label="详细地址:">
                <el-input
                  class="legal-counsel-input-style"
                  type="textarea"
                  resize="none"
                  v-model.trim="legalCounsel.addresseeAddress"
                  maxlength="50"
                  show-word-limit
                  placeholder
                ></el-input>
                <span style="color:red">*</span>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>-->
      <el-form
        :rules="rules1"
        id="recharge-form"
        ref="recharge-form"
        :model="legalForm"
        label-width="120px"
      >
        <div class="legal-counsel-content">
          <div class="legal-counsel-type">
            <div class="legal-counsel-type-title">
              <span class="title">律师函类型</span>
              <span class="legal-counsel-type-link cursor" @click="lawyerDialog=true">【律师函模板】</span>
              <span class="legal-counsel-type-link cursor" @click="openQuestions">【常见问题】</span>
            </div>
          </div>
        </div>
        <el-form-item prop="legalCounselType" label="律师函类型:">
          <el-radio-group v-model="legalForm.legalCounselType">
            <el-radio :label="item.id" v-for="(item,index) in legalCounselTypeList" :key="index">
              {{item.productName}}
              <span class="radiobox-red">¥{{item.productCharge}}/户</span>
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <div class="payment-account">
          <div class="legal-counsel-type-title">
            <span class="title">扣款账户</span>
          </div>
        </div>
        <el-form-item prop="paymentAccount" label="扣款账户:">
          <el-select
            style="width:300px"
            value-key="name"
            v-model="legalForm.paymentAccount"
            placeholder="请选择"
            @change="choice"
          >
            <el-option-group v-for="group in projectData" :key="group.name" :label="group.name">
              <el-option
                v-for="item in group.options"
                :key="item.name"
                :label="item.name"
                :value="item"
              ></el-option>
            </el-option-group>
          </el-select>
        </el-form-item>
        <el-form-item label="当前余额:">
          <el-input
            class="payment-account-choose"
            style="width:300px;"
            v-model="legalForm.WYBalance"
            disabled
          ></el-input>
        </el-form-item>
        <div class="legal-counsel-contact-information">
          <el-divider></el-divider>
          <div class="legal-counsel-contact-information-title">
            <span class="title">物业公司收件人</span>
          </div>
        </div>
        <el-form-item label="联系人:" prop="addresseeName">
          <el-input
            style="width:300px"
            v-model.trim="legalForm.addresseeName "
            maxlength="10"
            show-word-limit
            placeholder
          ></el-input>
        </el-form-item>
        <el-form-item label="联系人手机号:" prop="addresseeMobile">
          <el-input
            style="width:300px"
            v-model.trim="legalForm.addresseeMobile "
            maxlength="11"
            show-word-limit
            placeholder
          ></el-input>
        </el-form-item>
        <el-form-item label="详细地址:" prop="addresseeAddress">
          <el-input
            style="width:300px"
            type="textarea"
            resize="none"
            v-model.trim="legalForm.addresseeAddress"
            maxlength="50"
            show-word-limit
            placeholder
          ></el-input>
        </el-form-item>
      </el-form>
      <!-- 业主列表 -->
      <div class="owner-list1" style="box-shadow: 2px 2px 5px #cccccc">
        <el-divider></el-divider>
        <div class="legal-counsel-contact-information-title" style="margin:10px 0">
          <span class="title">业主列表</span>
        </div>
        <div class="owner-conter">
          <el-row :gutter="20" class="owner-top" style="margin-left: 0px; margin-right: 0px;">
            <el-col :span="15">
              <el-form
                :inline="true"
                :model="formInline"
                class="demo-form-inline"
                @submit.native.prevent
              >
                <el-form-item label="业主姓名：">
                  <el-input @keyup.enter.native="query" v-model.trim="proprName" placeholder></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="info" plain @click="query">查询</el-button>
                </el-form-item>
                <el-form-item>
                  <el-button class="addowner" type="primary" plain @click="openOwnerList">添加业主信息</el-button>
                </el-form-item>
                <el-form-item>
                  <el-button
                    class="addowner deleteowneO"
                    type="danger"
                    plain
                    @click="deleteOwner('ownerListTable')"
                  >删除</el-button>
                </el-form-item>
              </el-form>
            </el-col>

            <el-col :span="9" class="owner-import-and-export owner-import-and-export1">
              <el-button type="info" plain @click="downEmptyExcel">批量模板下载</el-button>
              <el-upload
                action
                ref="rebateUpload"
                :before-upload="beforeUpload"
                :show-file-list="false"
                :multiple="false"
                :limit="1"
                :file-list="upload_fileList"
                :http-request="handleUpload"
              >
                <el-button class="export-button" type="warning">文件上传</el-button>
              </el-upload>
            </el-col>
          </el-row>
          <el-row>
            <!-- 表格 -->
            <el-table
              ref="ownerListTable"
              :data="ownerListPage"
              tooltip-effect="dark"
              style="width: 100%"
              @selection-change="handleOwnerChange"
              row-key="id"
            >
              <el-table-column type="selection" min-width="55" reserve-selection></el-table-column>
              <el-table-column type="index" width="50" label="序号"></el-table-column>
              <el-table-column label="欠费业主姓名" min-width="120">
                <template slot-scope="scope">{{ scope.row.proprName }}</template>
              </el-table-column>
              <el-table-column prop="proprMobile" label="联系电话" min-width="120"></el-table-column>
              <el-table-column
                prop="proprAddress"
                label="欠费房屋详细地址"
                min-width="120"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                prop="arrearage"
                label="欠费金额(不含滞纳金)"
                min-width="120"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column label="欠费时间段" min-width="120" show-overflow-tooltip>
                <template
                  slot-scope="scope"
                >{{ scope.row.arrearageStartTime?scope.row.arrearageStartTime.slice(0,10):scope.row.arrearageStartTime }}至{{scope.row.arrearageEndTime?scope.row.arrearageEndTime.slice(0,10):scope.row.arrearageEndTime}}</template>
              </el-table-column>
            </el-table>
          </el-row>

          <el-row>
            <el-col class="pagination_box">
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
            </el-col>
          </el-row>
        </div>
      </div>
    </div>

    <div class="submit-btton">
      <el-button class="submit-btton-style" type="info" plain @click="onSubmit">申 请</el-button>
    </div>
    <!-- 查看业主信息列表弹框 -->
    <el-dialog
      :title="listDialog.dalogText"
      id="seeDialog"
      class="seeDialog"
      :visible.sync="listDialog.dialogVisible"
      width="80%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
    >
      <!-- <div class="owner-list">
        <div class="owner-conter">
          <el-row class="owner-top" style="margin-left: 0px; margin-right: 0px;">
            <el-col :span="12" style="padding: 20px 0 0 20px">业主信息</el-col>
            <el-col :span="12" class="owner-import-and-export" style="padding: 0 20px 0 0">
              <span style="margin-right:10px">已选择{{ListOwnerSelection.length}}项记录</span>
              <el-button type="info" plain @click="deleteOwner('innerOwnerTable')">删除</el-button>
              <el-button type="info" plain @click="deleteOwner('innerOwnerTable')">新增</el-button>
            </el-col>
          </el-row>
          <el-table
            ref="innerOwnerTable"
            :data="ownerDialogListPage"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="ListHandleOwnerChange"
          >
            <el-table-column type="selection" min-width="55"></el-table-column>
            <el-table-column type="index" width="50" label="序号"></el-table-column>
            <el-table-column label="欠费业主姓名" min-width="120">
              <template slot-scope="scope">{{ scope.row.proprName }}</template>
            </el-table-column>
            <el-table-column prop="proprMobile" label="联系电话" min-width="120"></el-table-column>
            <el-table-column
              prop="proprAddress"
              label="欠费房屋详细地址"
              min-width="120"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="arrearage"
              label="欠费金额(不含滞纳金)"
              min-width="120"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column label="欠费时间段" min-width="120" show-overflow-tooltip>
              <template
                slot-scope="scope"
              >{{ scope.row.arrearageStartTime.slice(0,10) }}至{{scope.row.arrearageEndTime.slice(0,10) }}</template>
            </el-table-column>
          </el-table>
          <div class="add-owner-box">
            <el-button class="add-owner-box-button" style="width:100%" @click="openAddOwner">+ 添加</el-button>
          </div>
          <el-pagination
            @size-change="listHandleSizeChange"
            @current-change="listHandleCurrentChange"
            :current-page="listDialog.pageNum"
            :page-sizes="[5, 10, 20, 30]"
            :page-size="listDialog.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="listDialogTotalNum"
          ></el-pagination>
        </div>
      </div>-->
      <el-form :model="fromData" ref="ownerForm">
        <div class="page-table">
          <div class="page-table-title">
            <div>
              <p>保单列表</p>
            </div>
            <div style="display: flex;align-items: center;">
              <!-- <p>已选择2项记录</p> -->
              <a class="page-table-btn" @click="deleteProject">删除</a>
              <a class="page-table-btn" @click="addProject">添加</a>
            </div>
          </div>
          <el-table
            :row-class-name="tableRowClassName"
            @selection-change="handleSelectionChange"
            id="fromDateTable"
            ref="fromDateTable"
            :data="fromData.tableData"
            style="width: 100%"
            row-key="id"
          >
            <el-table-column type="selection" width="50" reserve-selection></el-table-column>
            <el-table-column type="index" label="序号" width="50"></el-table-column>
            <el-table-column prop="proprName" label="欠费业主姓名" min-width="120px">
              <template slot-scope="scope">
                <el-form-item
                  :prop=" 'tableData.'+scope.$index+'.proprName'"
                  :rules="fromData.fromaDataRules.proprName"
                >
                  <el-input :maxlength="10" style="width:100%" v-model="scope.row.proprName"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="proprMobile" label="联系方式" min-width="200px">
              <template slot-scope="scope">
                <el-form-item
                  :prop=" 'tableData.'+scope.$index+'.proprMobile'"
                  :rules="fromData.fromaDataRules.proprMobile"
                >
                  <el-input :maxlength="11" style="width:100%" v-model="scope.row.proprMobile"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="proprAddress" label="欠费房屋详细地址" min-width="200px">
              <template slot-scope="scope">
                <el-form-item
                  :prop=" 'tableData.'+scope.$index+'.proprAddress'"
                  :rules="fromData.fromaDataRules.proprAddress"
                >
                  <el-input :maxlength="200" style="width:100%" v-model="scope.row.proprAddress"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="arrearage" label="欠费金额（不含滞纳金）" min-width="200px">
              <template slot-scope="scope">
                <el-form-item
                  :prop=" 'tableData.'+scope.$index+'.arrearage'"
                  :rules="fromData.fromaDataRules.arrearage"
                >
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="欠费金额最多9位正整数,小数点后最多保留2位"
                    placement="top"
                  >
                    <el-input :maxlength="12" style="width:100%" v-model="scope.row.arrearage"></el-input>
                  </el-tooltip>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="date" label="欠费时间段" min-width="260px">
              <template slot-scope="scope">
                <el-form-item
                  :prop=" 'tableData.'+scope.$index+'.date'"
                  :rules="fromData.fromaDataRules.date"
                >
                  <el-date-picker
                    value-format="yyyy-MM-dd"
                    v-model="scope.row.date"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    style="width:100%"
                  ></el-date-picker>
                </el-form-item>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form>
      <span slot="footer" class="owner-dialog-footer">
        <a href="javascript:;" class="owner-btn btn2" @click="saveToOwner('ownerForm')">保 存</a>
        <a href="javascript:;" class="owner-btn btn2" @click="closeOwnerDialog">返 回</a>
      </span>
    </el-dialog>
    <!-- 新增/查看/修改弹框 -->
    <!-- <el-dialog
      @close="resetForm('ownerForm')"
      id="owner-dialog"
      :title="ownerDialog.dalogText"
      :visible.sync="ownerDialog.dialogVisible"
      width="600px"
    >
      <el-form
        :rules="rules"
        :model="ownerForm"
        label-width="170px"
        label-position="left"
        ref="ownerForm"
      >
        <el-form-item label="欠费业主姓名" prop="proprName">
          <el-input v-model="ownerForm.proprName" maxlength="10" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="proprMobile">
          <el-input v-model="ownerForm.proprMobile" maxlength="11" show-word-limit></el-input>
        </el-form-item>

        <el-form-item prop="proprAddress" label="欠费房屋详细地址">
          <el-input
            type="textarea"
            v-model="ownerForm.proprAddress"
            placeholder
            resize="none"
            maxlength="50"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="欠费金额(不含滞纳金)" prop="arrearage">
          <el-input v-model="ownerForm.arrearage" maxlength="13"></el-input>
        </el-form-item>
        <el-form-item label="欠费时间段" prop="date">
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="ownerForm.date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="owner-dialog-footer">
        <a href="javascript:;" class="owner-btn btn1" @click="submitForm('ownerForm')">保存</a>
        <a href="javascript:;" class="owner-btn btn2" @click="closeForm('ownerForm')">关闭</a>
      </div>
    </el-dialog>-->
    <!-- 常见问题弹框 -->
    <el-dialog
      id="questions-dialog"
      title="常见问题"
      :visible.sync="questions.dialogVisible"
      width="600px"
    >
      <div class="questions-box">
        <el-row v-for="item in questions.list" :key="item.id">
          <el-col class="questions-item">
            <el-row>
              <el-col class="questions-title">Q:{{item.questionsTitle}}</el-col>
            </el-row>
            <el-row>
              <el-col class="questions-text">A:{{item.questionsText}}</el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
      <div class="questions-pagination">
        <el-pagination
          @current-change="questionsHandleCurrentChange"
          :current-page="questions.pageNum"
          :page-size="questions.pageSize"
          layout="total, prev, pager, next, jumper"
          :total="questions.totalNum"
        ></el-pagination>
      </div>

      <div slot="footer" class="owner-dialog-footer">
        <a href="javascript:;" class="owner-btn btn2" @click="questions.dialogVisible=false">关闭</a>
      </div>
    </el-dialog>
    <!-- 支付余额不足弹框 -->
    <el-dialog
      id="insufficient-fund-dialog"
      :visible.sync="insufficientDialog"
      center
      top="50vh"
      width="500px"
      custom-class="insufficient-fund-dialog"
    >
      <div style="text-align:center">账户余额不足，请先充值</div>
      <div slot="footer" class="owner-dialog-footer">
        <a href="javascript:;" class="owner-btn btn3" @click="showQRCode(2)">微信支付</a>
        <a href="javascript:;" class="owner-btn btn4" @click="showQRCode(3)">支付宝支付</a>
        <a href="javascript:;" class="owner-btn btn5" @click="cancelPayment">取消</a>
      </div>
    </el-dialog>
    <!-- 支付弹框 -->
    <el-dialog
      @close="closeDialog2"
      id="paymentDialog"
      title="支付页面"
      :visible.sync="dialogVisible4"
      width="400px"
    >
      <div class="paymentDialog-box">
        <div class="paymentDialog-box-wrap">
          <img class="paymentDialog-box-img1" :src="is_ZFB_and_WX ? ZFB_img : WX_img" alt />
        </div>
        <div class="paymentDialog-box-wrap">
          <img class="paymentDialog-box-img2" :src="'data:image/png;base64,'+qrcode" alt />
        </div>
        <div class="paymentDialog-box-wrap">
          <img class="paymentDialog-box-img3" :src="is_ZFB_and_WX ? ZFB_SAO_img : WX_SAO_img" alt />
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button type="primary" @click="dialogVisible4 = false">确 定</el-button> -->
      </span>
    </el-dialog>
    <!-- 预览律师函demo图片 -->
    <el-dialog id="lawyerDialog" :visible.sync="lawyerDialog">
      <div>
        <img src="@/assets/image/lawyerDemo.png" width="100%" alt />
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import PrintfTemplate1 from "./template1";
// import PrintfTemplate1 from "./print/template1";
// import PrintfTemplate2 from "./print/template2";
import {
  chargeList,
  upLoadExcel,
  submitApply,
  applyPay,
  exportEmptyExcel
} from "@/api/legal/legal.js";
import { questionList } from "@/api/legal/question.js";
import {
  getPropCompany,
  getProjectRoleList,
  userRegister,
  financeQueryPayOrderResult
} from "@/api/information/information";
// import ZFB_img from '@/assets/image/zfb_zf.jpg'
// import ZFB_SAO_img from '@/assets/image/zfb_sao.png'
// import WX_img from '@/assets/image/wx_zf.png'
// import WX_SAO_img from '@/assets/image/wx_sao.png'
export default {
  name: "insurance-list",
  // components: { PrintfTemplate1 ,PrintfTemplate2},
  props: ["obj"],
  data() {
    return {
      proprName: "", // 输入框绑定值
      formInline: {
        proprName: ""
      },
      // 显示条数
      pageSize: 10,
      // 显示页数
      // 分页
      pageNum: 1,
      totalNum: 0, // 外列表总条数
      ownerSelection: [], // 外列表勾选中的用户
      ListOwnerSelection: [], // 内列表勾选中的用户
      listDialog: {
        // 总条数
        totalNum: 1,
        // 显示条数
        pageSize: 10,
        // 显示页数
        // 分页
        pageNum: 1,
        dialogVisible: false,
        dalogText: ""
      },
      ownerDialog: {
        dialogVisible: false,
        dalogText: ""
      },
      // 扣款账户列表
      projectData: [],
      instructions: [
        { title: "五户以上建议批量上传" },
        { title: "业务咨询刘律师:", phone: "158 2117 7559" },
        { title: "快递给物业公司邮资顺丰到付" }
      ],
      legalCounselTypeList: [],
      // 律师函信息
      legalForm: {
        paymentAccount: "", // 扣款账户
        legalCounselType: 1, // 律师函类型
        addresseeName: "", // 联系人
        addresseeMobile: "", // 电话
        addresseeAddress: "", // 地址
        WYBalance: "0.00" //当前账户余额
      },
      // 业主列表
      ownerList: [],
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
        // 欠费时间段
        date: []
      },
      // 表单验证
      rules1: {
        // 扣费账户
        paymentAccount: [
          { required: true, message: "请选择扣费账户", trigger: "change" }
        ],
        // 律师函类型
        legalCounselType: [
          { required: true, message: "请选择律师函类型", trigger: "change" }
        ],
        // 物业联系人名称
        addresseeName: [
          { required: true, message: "请输入联系人名称", trigger: "blur" }
        ],
        // 物业地址
        addresseeAddress: [
          { required: true, message: "请输入物业公司地址", trigger: "blur" }
        ],
        // 联系电话
        addresseeMobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            // pattern: /^0{0,1}(13[0-9]|15[7-9]|153|156|18[7-9])[0-9]{8}$/,
            pattern: /^1(3|4|5|6|7|8|9)\d{9}$/,
            message: "手机号格式不对",
            trigger: "blur"
          }
        ]
      },
      // 表单验证
      rules: {
        // 项目名
        proprName: [
          { required: true, message: "请输入业主名称", trigger: "blur" }
        ],
        // 项目地址
        proprAddress: [
          { required: true, message: "请输入业主地址", trigger: "blur" }
        ],
        arrearage: [
          { required: true, message: "请输入欠费金额", trigger: "blur" },
          {
            // pattern: /^0{0,1}(13[0-9]|15[7-9]|153|156|18[7-9])[0-9]{8}$/,
            pattern: /^(\d+)(.\d{0,2})?$/,
            message: "金额格式错误,最多保留两位小数",
            trigger: "blur"
          }
        ],
        // 联系电话
        proprMobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            // pattern: /^0{0,1}(13[0-9]|15[7-9]|153|156|18[7-9])[0-9]{8}$/,
            pattern: /^1(3|4|5|6|7|8|9)\d{9}$/,
            message: "手机号格式不对",
            trigger: "blur"
          }
        ],
        // 请选择合同时间
        date: [{ required: true, message: "请选择欠费时间", trigger: "blur" }]
      },
      // 常见问题
      questions: {
        dialogVisible: false,
        questionsTitle: "",
        list: [],
        pageNum: 1,
        pageSize: 5,
        totalNum: 0
      },
      // 上传文件列表
      upload_fileList: [],
      downloadLoading: "",
      insufficientDialog: false, // 余额不足弹框
      payment: {
        // 支付清单
      },
      dialogVisible4: false,
      // 支付宝图片
      ZFB_img: require("@/assets/image/zfb_zf.jpg"),
      ZFB_SAO_img: require("@/assets/image/zfb_sao.png"),
      // 微信图片
      WX_img: require("@/assets/image/wx_zf.png"),
      WX_SAO_img: require("@/assets/image/wx_sao.png"),
      // 显示支付宝还是微信
      is_ZFB_and_WX: true,
      // 定时器
      timing: "",
      qrcode: "",
      payProjectId: "", // 扣费目标id
      payProjectType: "", // 0:从物业公司扣款;1:从指定项目扣款
      payForm: {
        pId: "",
        pName: "",
        type: "",
        aId: "",
        amount: ""
      },
      paymentData: {}, // 提交申请返回的临时参数
      applyData: {}, // 临时存储委托申请参数
      payLoading: "", // 委托申请loading
      lawyerDialog: false,
      selectionItemIndexes: [], // 新增业主弹框-被选中项
      fromData: {
        // 表单验证
        fromaDataRules: {
          proprName: [{ required: true, message: "请输入", trigger: "blur" }],
          proprMobile: [
            { required: true, message: "请输入手机号", trigger: "blur" },
            {
              // pattern: /^0{0,1}(13[0-9]|15[7-9]|153|156|18[7-9])[0-9]{8}$/,
              pattern: /^1(3|4|5|6|7|8|9)\d{9}$/,
              message: "手机号格式不对",
              trigger: "blur"
            }
          ],
          proprAddress: [
            { required: true, message: "请输入", trigger: "blur" }
          ],
          arrearage: [
            { required: true, message: "请输入", trigger: "blur" },
            {
              pattern: /^\d{1,9}(\.\d{1,2})?$/,
              message: "格式错误",
              trigger: "blur"
            }
          ],
          date: [{ required: true, message: "请选择", trigger: "change" }]
        },
        // 表格数据
        tableData: [
          {
            id: "",
            proprName: "",
            proprMobile: "",
            proprAddress: "",
            arrearage: "",
            date: []
          }
        ]
      }
    };
  },
  computed: {
    // 外列表
    ownerListPage() {
      let arr = [];
      let ownerList = JSON.parse(JSON.stringify(this.ownerList));
      ownerList = ownerList.filter(item => {
          return item.proprName.indexOf(this.formInline.proprName) !== -1;
      });
      this.totalNum = ownerList.length;
      ownerList=ownerList.slice(
        (this.pageNum - 1) * this.pageSize,
        this.pageNum * this.pageSize
      );
      return ownerList;
    },
  },
  created() {
    this.getChargeList(); // 获取在线/快递业务价格
    this.getProjectList(); // 获取账户信息
    this.fromData.tableData[0].id = this.guid();
  },
  methods: {
    // 获取物业公司信息与项目公司信息
    getProjectList() {
      const page = {
        is_manage: "1",
        pageNum: 1,
        pageSize: 99999
      };
      // const userResp = await getPropCompany();
      getPropCompany().then(res => {
        if (res.code === 200) {
          let obj1 = { name: "物业类型", options: [] };
          obj1.options.push(res.data);
          getProjectRoleList(page).then(callback => {
            if (callback.code === 200) {
              let obj2 = { name: "项目类型", options: callback.rows };
              let projectData = [];
              // 判断 是物业用户 还是 项目用户 所看到页面
              if (this.$store.state.user.userType == "01") {
                projectData.push(obj1);
              }
              projectData.push(obj2);
              this.projectData = projectData;
            }
          });
        }
      });
    },
    // 选择扣款账户(从公司/从项目 扣款)
    choice(item) {
      this.payForm.pId = "" + item.id;
      this.payForm.aId = "" + item.accountId;
      this.payForm.pName = item.name;
      this.legalForm.WYBalance = item.balance.toFixed(2);
      if (item.remark === "物业用户") {
        // 支付扣款类型(从物业公司)
        this.payForm.isProject = "0";
      } else {
        // 支付扣款类型(从项目)
        this.payForm.isProject = "1";
      }
    },
    //用户列表选中
    handleOwnerChange(val) {
      this.ownerSelection = val;
    },
    //list用户列表选中
    ListHandleOwnerChange(val) {
      this.ListOwnerSelection = val;
    },
    // 清楚所有选中
    clearSelection() {},
    // 查询
    searchOwner() {
      this.$refs["ownerListTable"].clearSelection(); // 搜索前清空选中项
      this.formInline.proprName = this.proprName;
    },
    query() {
      this.searchOwner();
    },
    // 提交申请
    onSubmit() {
      this.applyData = {
        reminderProduId: this.legalForm.legalCounselType,
        accountId: this.legalForm.paymentAccount.accountId,
        isProject: this.payForm.isProject,
        addresseeName: this.legalForm.addresseeName,
        addresseeMobile: this.legalForm.addresseeMobile,
        addresseeAddress: this.legalForm.addresseeAddress,
        reminderArrearageProprietors: this.ownerList
      };
      this.$refs["recharge-form"].validate(valid => {
        // 通过表单验证
        if (valid) {
          // 业主不能为空
          if (!this.ownerList.length) {
            this.$message({
              type: "warning",
              message: "请录入业主信息"
            });
            return;
          }
          // 计算总价
          let totalPrice = 0;
          this.legalCounselTypeList.forEach(item => {
            if (item.id === this.legalForm.legalCounselType) {
              totalPrice = this.ownerList.length * item.productCharge;
            }
          });
          this.ownerList.forEach(item => {
            delete item.id;
            item.arrearageStartTime += " 00:00:00";
            item.arrearageEndTime += " 23:59:59";
          });
          this.$confirm(
            `本次申报将会扣除余额${totalPrice}元，是否要申请？`,
            "警告",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }
          )
            .then(() => {
              this.payLoading = this.$loading({
                lock: true,
                text: "Loading",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)"
              });
              this.startPay(this.applyData);
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "订单已取消"
              });
            });
        } else {
          this.$message({
            message: "请完善信息~！",
            type: "warning"
          });
          return false;
        }
      });
    },
    // 点击微信/支付支付
    showQRCode(type) {
      // 微信支付
      if (type === 2) {
        this.WX_img = require("@/assets/image/wx_zf.png");
        this.WX_SAO_img = require("@/assets/image/wx_sao.png");
        this.is_ZFB_and_WX = false;
      }
      // 支付宝支付
      else if (type == 3) {
        this.ZFB_img = require("@/assets/image/zfb_zf.jpg");
        this.ZFB_SAO_img = require("@/assets/image/zfb_sao.png");
        this.is_ZFB_and_WX = true;
      }
      this.payForm.type = type;
      this.getQRcode();
    },
    // 获取支付二维码
    getQRcode() {
      let arr = [];
      arr.push(this.payForm);
      // 请求充值
      userRegister(arr)
        .then(xhrData => {
          if (xhrData.code === 200) {
            this.$nextTick(() => {
              // this.qrCode = 'data:image/png;base64,' + xhrData.data;
              this.qrcode = xhrData.data.qrCodeBase64Img;
              // 打开支付框
              this.dialogVisible4 = true;
            });
            const arr2 = [];
            let type = "";
            if (arr[0].type == "2") {
              type = "1";
            } else if (arr[0].type == "3") {
              type = "2";
            }
            arr2.push({
              payProductType: type,
              orderNo: xhrData.data.orderNo
            });
            return arr2;
          }
        })
        .then(arr2 => {
          // console.log(arr2, "arr");
          let _this = this;
          _this.timing = setInterval(() => {
            financeQueryPayOrderResult(arr2).then(xhrData2 => {
              // console.log(xhrData2);
              if (xhrData2.code === 200) {
                // 待支付
                if (xhrData2.data.showQrCodeFlag == "TRUE") {
                  setTimeout(() => {
                    // _this.$message({
                    //   message: "重新充值~！",
                    //   type: "warning"
                    // });
                    // 关闭定时器
                    clearInterval(_this.timing);
                    // 关闭支付二维码弹窗
                    this.dialogVisible4 = false;
                  }, 60000 * 3);
                }
                // 已支付
                else if (xhrData2.data.showQrCodeFlag == "FALSE") {
                  // 提示
                  this.$message({
                    message: "充值成功~！",
                    type: "success"
                  });
                  // 关闭定时器
                  clearInterval(_this.timing);
                  // 关闭支付二维码弹窗
                  this.dialogVisible4 = false;
                  // 关闭支付选择弹框
                  this.insufficientDialog = false;
                  this.payLoading = this.$loading({
                    lock: true,
                    text: "Loading",
                    spinner: "el-icon-loading",
                    background: "rgba(0, 0, 0, 0.7)"
                  });
                  // 再次发起扣款
                  this.toApplyPay();
                  return;
                }
              }
            });
            // console.log(1);
          }, 2000);
        });
    },
    // 拉起委托申请支付接口
    startPay(data) {
      // 提交委托申请
      submitApply(data).then(res => {
        if (res.code === 200) {
          this.paymentData = res.data;
          // 从余额扣款
          this.toApplyPay();
        }
      });
    },
    // 从余额扣款
    toApplyPay() {
      this.paymentData.accountId = this.legalForm.paymentAccount.accountId;
      // 从余额扣费
      applyPay(this.paymentData)
        .then(res => {
          // 1为扣款成功
          if (res.code === 200) {
            this.payLoading.close();
            if (res.data.status === "1") {
              this.insufficientDialog = false;
              this.openSuccessBox();
            } else {
              // 设置充值金额
              this.payForm.amount = res.data.needAmount;
              this.insufficientDialog = true;
            }
          } else {
            this.$message({
              type: "error",
              message: "扣款失败,请稍后再试,即将跳转至委托记录页面!",
              duration: 5000
            });
            // 跳到列表
            setTimeout(() => {
              this.payLoading.close();
              this.$router.push({ name: "LegalCounselRecord" });
            }, 5000);
          }
        })
        .catch(err => {
          this.$message({
            type: "error",
            message: "拉起支付失败,请稍后再试,即将跳转至委托记录页面!",
            duration: 5000
          });
          // 跳到列表
          setTimeout(() => {
            this.payLoading.close();
            this.$router.push({ name: "LegalCounselRecord" });
          }, 5000);
        });
    },
    // 支付成功弹框
    openSuccessBox() {
      let msgBox = this.$msgbox({
        title: "支付成功",
        message: "申请成功，请耐心等候，48个小时内将会处理您的委托",
        type: "success",
        showCancelButton: false,
        showConfirmButton: false,
        closeOnClickModal: false,
        distinguishCancelAndClose: true,
        showClose: true,
        center: true,
        beforeClose: (action, instance, done) => {
          this.payLoading.close();
          this.$router.push({ name: "LegalCounselRecord" });
          done();
        }
      }).then(action => {
        this.$message({
          type: "info",
          message: "action: " + action
        });
      });
      setTimeout(() => {
        this.payLoading.close();
        this.$msgbox.close();
        this.$router.push({ name: "LegalCounselRecord" });
      }, 5000);
    },
    // 取消支付
    cancelPayment() {
      this.insufficientDialog = false;
      this.$msgbox({
        title: "订单已生成",
        message: "已取消支付，请在7个工作内完成支付!",
        type: "info",
        showCancelButton: false,
        showConfirmButton: false,
        closeOnClickModal: false,
        distinguishCancelAndClose: true,
        showClose: true,
        center: true,
        beforeClose: (action, instance, done) => {
          this.$router.push({ name: "LegalCounselRecord" });
          done();
        }
      }).then(action => {
        this.$message({
          type: "info",
          message: "action: " + action
        });
      });
      setTimeout(() => {
        this.payLoading.close();
        this.$msgbox.close();
        this.$router.push({ name: "LegalCounselRecord" });
      }, 5000);
    },
    // 关闭 支付弹出框
    closeDialog2() {
      // 关闭定时器
      clearInterval(this.timing);
      // 关闭支付二维码弹窗
      this.dialogVisible4 = false;
    },
    // 新增业主弹框(列表)
    openOwnerList() {
      // 打开对话框
      this.listDialog.dialogVisible = true;
      // 赋值到标题
      this.listDialog.dalogText = "添加业主信息";
    },
    // 查询在线/快递业务价格
    async getChargeList() {
      let res = await chargeList();
      if (res.code === 200) {
        this.legalCounselTypeList = res.rows;
      }
    },
    // =====新增/修改业主信息=======
    // 添加新业主
    openAddOwner() {
      // 打开对话框
      this.ownerDialog.dialogVisible = true;
      this.ownerDialog.dalogText = "添加业主信息";
      // 还原时间
    },
    // 删除
    deleteOwner(formName) {
      if (formName === "ownerListTable") {
        if (!this.ownerSelection.length) {
          this.$message({
            type: "warning",
            message: "未选择任何内容!"
          });
          return false;
        }
      } else {
        if (!this.ListOwnerSelection.length) {
          this.$message({
            type: "warning",
            message: "未选择任何内容!"
          });
          return false;
        }
      }

      this.$confirm("是否删除选中项?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (formName === "ownerListTable") {
            this.ownerSelection.forEach(item => {
              this.ownerList.forEach((list, index) => {
                if (list.id === item.id) {
                  this.ownerList.splice(index, 1);
                }
              });
            });
          } else if (formName === "innerOwnerTable") {
            this.ListOwnerSelection.forEach(item => {
              this.ownerList.forEach((list, index) => {
                if (list.id === item.id) {
                  this.ownerList.splice(index, 1);
                }
              });
            });
          }
          this.$refs[formName].clearSelection();
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 对话框 确认 按钮
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        // 验证成功
        if (valid) {
          let ownerForm = JSON.parse(JSON.stringify(this.ownerForm));
          ownerForm.proprAddress = ownerForm.proprAddress.replace(/；/g, ";");
          ownerForm.arrearageStartTime = ownerForm.date[0] + " 00:00:00";
          ownerForm.arrearageEndTime = ownerForm.date[1] + " 23:59:59";
          delete ownerForm.date;
          ownerForm.id = this.guid();
          this.ownerList.push(ownerForm);
          this.ownerDialog.dialogVisible = false;
        } else {
          this.$message.warning({
            message: "请完善信息!"
          });
          return false;
        }
      });
    },
    saveToOwner(formName) {
      this.$refs[formName].validate(valid => {
        // 验证成功
        if (valid) {
          let tableData = JSON.parse(JSON.stringify(this.fromData.tableData));
          tableData.forEach(ownerForm => {
            ownerForm.proprAddress = ownerForm.proprAddress.replace(/；/g, ";");
            ownerForm.arrearageStartTime = ownerForm.date[0] + " 00:00:00";
            ownerForm.arrearageEndTime = ownerForm.date[1] + " 23:59:59";
            delete ownerForm.date;
            // ownerForm.id = this.guid();
            this.ownerList.push(ownerForm);
          });
          this.fromData.tableData = [
            {
              id: this.guid(),
              proprName: "",
              proprMobile: "",
              proprAddress: "",
              arrearage: "",
              date: []
            }
          ];
          this.$nextTick(() => {
            this.$refs[formName].resetFields();
          });
          this.listDialog.dialogVisible = false;
        } else {
          this.$message.warning({
            message: "请完善信息!"
          });
          return false;
        }
      });
    },
    closeOwnerDialog() {
      if (this.fromData.tableData.length > 1) {
        this.$confirm("尚有未保存的数据,确定关闭吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            // 清空表单
            this.$nextTick(() => {
              this.$refs["ownerForm"].resetFields();
            });
            this.listDialog.dialogVisible = false;
            this.fromData.tableData = [
              {
                id: this.guid(),
                proprName: "",
                proprMobile: "",
                proprAddress: "",
                arrearage: "",
                date: []
              }
            ];
          })
          .catch(function() {});
      } else {
        // 清空表单
        this.$nextTick(() => {
          this.$refs["ownerForm"].resetFields();
        });
        this.listDialog.dialogVisible = false;
        this.fromData.tableData = [
          {
            id: this.guid(),
            proprName: "",
            proprMobile: "",
            proprAddress: "",
            arrearage: "",
            date: []
          }
        ];
      }
    },
    // 关闭按钮
    closeForm() {
      // 清空表单
      this.$nextTick(() => {
        this.$refs["ownerForm"].resetFields();
      });
      this.ownerDialog.dialogVisible = false;
    },
    // 关闭对话框
    resetForm(formName) {
      // 清空表单
      this.$nextTick(() => {
        this.$refs["ownerForm"].resetFields();
      });
      this.ownerDialog.dialogVisible = false;
    },
    // ===========新增业主弹框===============
    // 设置table class
    tableRowClassName(row) {
      row.row.index = row.rowIndex;
    },
    // 添加业主
    addProject() {
      this.isShow = false;
      this.$refs["ownerForm"].validate(valid => {
        if (valid) {
          this.fromData.tableData.push({
            proprName: "",
            proprMobile: "",
            proprAddress: "",
            arrearage: "",
            date: []
          });
        } else {
          this.$message({
            message: "请完善信息！",
            type: "warning"
          });
          return false;
        }
      });
    },
    // 删除被选中项
    deleteProject() {
      if (
        !this.selectionItemIndexes.length ||
        !this.fromData.tableData.length
      ) {
        this.$message({
          message: "请最少选择一项！",
          type: "warning"
        });
        return false;
      }
      this.selectionItemIndexes.forEach(item => {
        this.fromData.tableData.forEach((list, index) => {
          if (item.id === list.id) {
            this.fromData.tableData.splice(index, 1);
          }
        });
      });
      this.$refs["fromDateTable"].clearSelection();
    },
    // 当列表被勾选时
    handleSelectionChange(val) {
      this.selectionItemIndexes = val;
    },
    // =====新增/修改业主信息结束=======
    //在改变每页显示的条数
    handleSizeChange(val) {
      // 注意：在改变每页显示的条数时，要将页码显示到第一页
      this.pageNum = 1;
      // 改变每页显示的条数
      this.pageSize = val;
    },
    // 页数
    handleCurrentChange(val) {
      // 改变默认的页数
      this.pageNum = val;
    },
    // ===常见问题===
    openQuestions() {
      this.getQuestionsList();
      this.questions.dialogVisible = true;
    },
    // 获取常见问题列表
    async getQuestionsList() {
      let res = await questionList(this.questions);
      if (res.code === 200) {
        this.questions.list = res.rows;
        this.questions.totalNum = res.total;
      }
    },
    questionsHandleCurrentChange(val) {
      this.questions.pageNum = val;
      // 更新列表
      this.getQuestionsList();
    },
    //在改变每页显示的条数
    listHandleSizeChange(val) {
      // 注意：在改变每页显示的条数时，要将页码显示到第一页
      this.listDialog.pageNum = 1;
      // 改变每页显示的条数
      this.listDialog.pageSize = val;
    },
    // 页数
    listHandleCurrentChange(val) {
      // 改变默认的页数
      this.listDialog.pageNum = val;
    },
    // 导出空模板
    downEmptyExcel() {
      // const formInline = this.formInline;
      this.$confirm("是否确认下载批量模板?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return exportEmptyExcel();
        })
        .then(response => {
          this.download(response.msg);
        })
        .catch(function() {});
    },
    // ===上传====
    handleUpload(file) {
      let fd = new FormData();
      fd.append("file", file.file);
      return upLoadExcel(fd)
        .then(res => {
          this.downloadLoading.close();
          this.$refs["rebateUpload"].clearFiles(); //清除文件
          if (res.code === 200) {
            if (res.data.length) {
              res.data.forEach(item => {
                item.id = this.guid();
                this.ownerList.push(item);
              });
            }

            this.$message({
              type: "success",
              message: "上传成功"
            });
          } else {
            this.downloadLoading.close();
            this.$message({
              type: "error",
              showClose: true,
              message: "请求失败! error:" + error
            });
          }
        })
        .catch(err => {
          this.downloadLoading.close();
          this.$message({
            type: "error",
            showClose: true,
            message: "请求失败! error:" + error
          });
        });
    },
    beforeUpload(file) {
      //文件类型
      var fileName = file.name.substring(file.name.lastIndexOf(".") + 1);
      if (fileName !== "xls") {
        if (fileName !== "xlsx") {
          this.uploadTemplateDialog = false;
          this.$message({
            type: "error",
            showClose: true,
            duration: 3000,
            message: "文件类型不是.xls或者.xlsx文件!"
          });
          return false;
        }
      }
      this.downloadLoading = this.$loading({
        lock: true,
        text: "数据导入中...",
        spinner: "el-icon-loading",
        background: "rgba(0,0,0,0.7)"
      });
    },
    guid() {
      return Number(
        Math.random()
          .toString()
          .substr(3, 3) + Date.now()
      ).toString(36);
    }
  }
};
</script>
<style lang="scss">
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
.page-table {
  .page-table-title {
    display: flex;
    justify-content: space-between;
    padding-bottom: 10px;
    .page-table-btn {
      width: 60px;
      height: 30px;
      border: 1px solid #ddd;
      line-height: 30px;
      text-align: center;
      display: block;
      margin-top: 10px;
      font-size: 14px;
      margin-left: 15px;
    }
  }
  .el-form-item {
    margin-bottom: unset;
  }
}
.legal-content {
  font-size: 14px;
  // margin: 10px 10px;
  padding: 10px;

  .export-button {
    margin-left: 10px;
  }
  .title {
    font-weight: 600;
  }
  .cursor {
    cursor: pointer;
  }
  .legal-content-box {
    padding-left: 40px;
  }

  .legal-instructions {
    display: flex;
    .instructions-title {
      margin-right: 20px;
    }
    .instructions-list {
      font-size: 12px;
      line-height: 14px;
      display: flex;
      flex-direction: column;
      .instructions-item {
        margin-bottom: 5px;
        .instructions-phone {
          text-decoration: underline;
          cursor: pointer;
          color: #0066cc;
        }
      }
    }
  }
  .legal-counsel-content {
    margin-top: 60px;
    padding-bottom: 10px;
    .legal-counsel-type {
      .legal-counsel-type-title {
        .legal-counsel-type-link {
          color: #0000bf;
        }
      }
      .legal-counsel-radiobox {
        margin-top: 20px;
        padding-left: 100px;
        .radiobox-red {
          margin-left: 8px;
          color: #ff0000;
        }
      }
    }
  }
  .legal-counsel-contact-information {
    margin-top: 20px;
    .legal-counsel-contact-information-title {
    }
    .legal-counsel-input {
      padding-top: 30px;
      padding-left: 100px;
      font-size: 12px;
      .el-form-item__label {
        font-size: 12px;
      }
      .legal-counsel-input-style {
        font-size: 12px;
        width: 300px;
        height: 24px;
      }
    }
  }
  .owner-list1 {
    margin-top: 5px;
    width: 100%;
    // min-height: calc(88vh);
    box-sizing: border-box;
    // background-color: #e6e8eb;
    padding-bottom: 15px;
  }
  .owner-list {
    margin-top: 5px;
    width: 100%;
    padding: 15px;
    // min-height: calc(88vh);
    box-sizing: border-box;
    background-color: #e6e8eb;
    padding-bottom: 30px;
  }
  .owner-conter {
    // min-height: calc(88vh);
    background-color: #fff;
    border-radius: 5px;
    position: relative;
    padding-bottom: 100px;
    .owner-top {
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
    .addowner {
      // width: 120px;
      // height: 24px;
      // margin-top: 10px;
      background-color: #8080ff;
      border: 1px solid #a0a0fa;
      text-align: center;
      // line-height: 24px;
      color: #fff;
      font-size: 12px;
    }
    .deleteowneO {
      background-color: #ff0000;
      border: 1px solid #f88888;
    }
    .pagination_box {
      position: relative;
      .el-pagination {
        position: absolute;
        top: 20px;
        left: 20px;
        right: 0;
      }
    }

    .owner-import-and-export {
      margin-top: 20px;
      text-align: right;
      color: #000;
      .owner-export-execl {
        color: #fff;
        background-color: #f59a23;
        border: 1px solid #fab458;
      }
    }
    .owner-import-and-export1 {
      display: flex;
      justify-content: flex-end;
    }
    .add-owner-box {
      margin-top: 20px;
      padding: 0 10%;
      text-align: center;
      .add-owner-box-button {
        width: 80%;
        border: 1px dashed #cccccc;
      }
    }
  }
  .submit-btton {
    padding-top: 20px;
    padding-left: 100px;
    .submit-btton-style {
      font-size: 14px;
      width: 140px;
      height: 38px;
      background-color: #169bd5;
      border: 1px solid #34b9f1;
      font-size: 12px;
      color: #fff;
      &:hover {
        background-color: #74cdf3;
      }
    }
  }
  .owner-list-title {
    margin: 10px 0;
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
    .btn3 {
      width: 108px;
      height: 28px;
      background: #2bad13;
      border: 1px solid #2bad13;
      color: #fff;
      font-weight: 500;
      margin-right: 10px;
      line-height: 28px;
    }
    .btn4 {
      width: 108px;
      height: 28px;
      background: #1476fe;
      border: 1px solid #1476fe;
      color: #fff;
      font-weight: 500;
      margin-right: 10px;
      line-height: 28px;
    }
    .btn5 {
      width: 108px;
      height: 28px;
      border: 1px solid #cccccc;
      color: #000000;
      font-weight: 500;
      margin-right: 10px;
      line-height: 28px;
    }
  }
  .questions-box {
    min-height: calc(50vh);
    padding-bottom: 5px;
    .questions-item {
      margin-bottom: 20px;
      .questions-title {
        color: #0000ff;
        font-weight: 600;
      }
      .questions-text {
        margin-top: 5px;
        text-indent: 1em;
      }
    }
  }
}
#paymentDialog .paymentDialog-box {
  /* display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap; */
}
#paymentDialog .paymentDialog-box img {
  display: block;
}
#paymentDialog .paymentDialog-box .paymentDialog-box-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
}
/* #paymentDialog .paymentDialog-box img:nth-child(1) {
  width: 150px;
}
#paymentDialog .paymentDialog-box img:nth-child(2){
width: 220px;
} */
.paymentDialog-box-img1 {
  width: 160px;
}
.paymentDialog-box-img2 {
  width: 220px;
}
.paymentDialog-box-img3 {
  width: 180px;
}
</style>
<style lang="scss">
.owner-import-and-export1 .el-upload {
  display: inline-block !important;
}

.insufficient-fund-dialog {
  overflow: hidden;
  margin-top: 30vh !important;
}
.insufficient-fund-dialog .el-dialog__header {
  background-color: #ffffff;
}
.insufficient-fund-dialog .el-dialog__footer {
  background-color: #ffffff;
}
.payment-account-choose .el-input__inner {
  color: #ff0000 !important;
  background-color: #e0e0e0 !important;
  border-color: #bbbcbd !important;
}
.questions-pagination {
  padding: 10px 0;
  position: relative;
  .el-pagination {
    position: relative;
    bottom: unset;
    left: unset;
    right: unset;
    padding-top: unset;
  }
}
</style>
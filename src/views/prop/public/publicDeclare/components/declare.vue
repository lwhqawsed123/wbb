<template>
  <!-- 公众责任险申报页面 -->
  <div class="page-content">
    <div class="process">
      <div class="process-content">
        <div class="process-box" v-for="(item,index) in processBoxList" :key="index">
          <div class="process-box-left">{{index+1}}</div>
          <div class="process-box-right">
            <h5>{{item.name}}</h5>
            <p>{{item.cName}}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="page-top">
      <h4>申报信息</h4>
    </div>
    <el-row>
      <el-col :span="3">
        <p class="name">被保险人</p>
      </el-col>
      <el-col :span="9">
        <p class="label">{{propertyData.name || ''}}</p>
      </el-col>
      <el-col :span="3">
        <p class="name">纳税人识别号</p>
      </el-col>
      <el-col :span="9">
        <p class="label">{{propertyData.certNo || ''}}</p>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="3">
        <p class="name">营业性质</p>
      </el-col>
      <el-col :span="9">
        <p class="label">物业管理</p>
      </el-col>
      <el-col :span="3">
        <p class="name">联系人</p>
      </el-col>
      <el-col :span="9">
        <p class="label">{{propertyData.contact || ''}}</p>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="3">
        <p class="name">营业所在地址</p>
      </el-col>
      <el-col :span="9">
        <p class="label">{{propertyData.address || ''}}</p>
      </el-col>
      <el-col :span="3">
        <p class="name">手机</p>
      </el-col>
      <el-col :span="9">
        <p class="label">{{propertyData.contact_no || ''}}</p>
      </el-col>
    </el-row>
    <div class="page-top">
      <h4>产品说明</h4>
      <span @click="openExplain">【产品介绍】</span>
    </div>
    <el-row>
      <el-col :span="24">
        <p>投保起始日期为保费到账次日生效,可选次日之后的日期，最多可选60天,离上一个保单剩余2个月到期时可重新申报</p>
      </el-col>
      <el-col :span="21">
        <p>居住小区&nbsp;&nbsp;&nbsp;&nbsp;保额：RMB{{liveInsuredAmount }}万元/居住小区*1份&nbsp;&nbsp;&nbsp;&nbsp;保费：RMB{{livePremium }}元/居住小区*1份</p>
      </el-col>
      <el-col :span="20">
        <p>非居住小区&nbsp;&nbsp;&nbsp;&nbsp;保额：RMB{{NonLiveInsuredAmount }}万元/非居住小区*1份&nbsp;&nbsp;&nbsp;&nbsp;保费：RMB{{NonLivePremium }}元/非居住小区*1份</p>
      </el-col>
    </el-row>
    <div class="page-top">
      <h4>投保项目列表</h4>
    </div>
    <!-- 列表 -->
    <el-form :model="fromData" ref="from">
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
          :data="fromData.tableData"
          style="width: 100%"
        >
          <el-table-column type="selection" label="日期" width="50"></el-table-column>
          <el-table-column type="index" label="序号" width="50"></el-table-column>
          <el-table-column show-overflow-tooltip prop="date" label="项目名称" width="200px">
            <template slot-scope="scope">
              <el-form-item
                :prop=" 'tableData.'+scope.$index+'.name'"
                :rules="fromData.fromaDataRules.name"
              >
                <el-select
                  value-key="id"
                  @change="getProjeName($event,scope.$index)"
                  v-model="scope.row.name"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="(item) in nameData"
                    :key="item.id"
                    :label="item.name"
                    :value="item"
                    :disabled="item.disabled"
                  ></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="address" show-overflow-tooltip label="项目地址" width="200px">
            <template slot-scope="scope">{{scope.row.diziData}}</template>
            <!-- <template slot-scope="scope">
              <el-select value-key="id" v-model="scope.row.dizi" placeholder="请选择">
                <el-option
                  v-for="(item,index) in diziData"
                  :key="index"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
            </template>-->
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="date" label="小区类型" width="200px">
            <!-- <template slot-scope="scope">
              <el-form-item
                :prop=" 'tableData.'+scope.$index+'.type'"
                :rules="fromData.fromaDataRules.type"
              >
                <el-select v-model="scope.row.type" placeholder :disabled="true">
                  <el-option label="居住类型" value="居住类型"></el-option>
                  <el-option label="非居住类型" value="非居住类型"></el-option>
                </el-select>
              </el-form-item>
            </template>-->
            <template slot-scope="scope">{{scope.row.type}}</template>
          </el-table-column>
          <el-table-column prop="date" label="投保份数" width="80px">
            <template slot-scope="scope">
              <el-form-item
                :prop=" 'tableData.'+scope.$index+'.share'"
                :rules="fromData.fromaDataRules.share"
              >
                <el-input
                  :maxlength="2"
                  @blur="handleNumber($event)"
                  oninput="value=value.replace(/[^\d]/g,'')"
                  style="width:100%"
                  v-model.number="scope.row.share"
                  @input="calculate($event,scope.$index)"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="date" label="投保起始日期" width="200px">
            <template slot-scope="scope">
              <el-form-item
                :prop=" 'tableData.'+scope.$index+'.startTime'"
                :rules="fromData.fromaDataRules.startTime"
              >
                <el-date-picker
                  style="width:100%"
                  v-model="scope.row.startTime"
                  type="date"
                  placeholder="选择日期"
                  :clearable="false"
                  @change="validityTerm($event,scope.$index)"
                  value-format="yyyy-MM-dd"
                  :picker-options="scope.$index == 0 ? expireTimeOption : expireTimeOption2"
                ></el-date-picker>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="date" label="投保结束日期" width="200px">
            <template>
              <el-input :disabled="true" style="width:100%" v-model="fromData.endTime"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="date" label="项目占地面积(万平方米)" width="100px">
            <template slot-scope="scope">
              <el-form-item
                :prop=" 'tableData.'+scope.$index+'.mj'"
                :rules="fromData.fromaDataRules.mj"
              >
                <el-input style="width:100%" v-model="scope.row.mj"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="date" label="是否有游泳池" min-width="180px">
            <template slot-scope="scope">
              <el-form-item
                :prop=" 'tableData.'+scope.$index+'.yc'"
                :rules="fromData.fromaDataRules.yc"
              >
                <el-select
                  @change="swimming($event,scope.$index)"
                  v-model="scope.row.yc"
                  placeholder="请选择"
                >
                  <el-option label="有" value="有"></el-option>
                  <el-option label="无" value="无"></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
           <el-table-column show-overflow-tooltip label="保费" min-width="150px">
            <template slot-scope="scope">{{scope.row.bf}}</template>
          </el-table-column>
        </el-table>
      </div>
    </el-form>
    <div class="tableList">
      <el-button style="margin-top:30px" @click="calculation">计算总保额与总保费</el-button>
      <el-row v-show="isShow">
        <el-col :span="12">
          <p class="money">
            总保额：
            <span>{{totalInsuredAmount}}</span>万
          </p>
        </el-col>
        <el-col :span="12">
          <p class="money">
            总保费：
            <span>{{totalPremium}}</span>元
          </p>
        </el-col>
      </el-row>
    </div>
    <!-- 公众责任险产品 对话框 -->
    <el-dialog id="guarantee-dialog" title="产品介绍" :visible.sync="dialogTableVisible">
      <div class="guarantee-dialog-main">
        <h3 style="padding:15px 0">投保方案</h3>
        <el-table :data="tableData1" border style="width: 1000px;">
          <el-table-column prop="programme1" label="项目类型" min-width="20%"></el-table-column>
          <el-table-column prop="programme2" label="保额" min-width="20%"></el-table-column>
          <el-table-column prop="programme3" label="保费" min-width="20%"></el-table-column>
        </el-table>
      </div>
      <h3 style="padding:15px 0">适合风险范围</h3>
      <el-input type="textarea" :autosize="{ maxRows: 4}" v-model="additionalClause"></el-input>
      <h3 style="padding:15px 0">保险条款</h3>
      <el-input type="textarea" :autosize="{ minRows: 15, maxRows: 10}" v-model="insuranceClause"></el-input>
      <div slot="footer" class="dialog-footer">
        <a href="javascript:;" class="guarantee-btn btn2" @click="dialogTableVisible=false">返 回</a>
      </div>
    </el-dialog>
    <!-- <div class="apply-page-bot"> -->
      <div class="declare-btn-wrap">
      <!-- <a class="apply-page-btn" href="javascript:;" @click="next">下一步</a> -->
      <el-button v-hasPermi="['ins:pub:add']" :disabled="isDisabledBtn" class="declare-btn btn1" href="javascript:;" @click="next">下一步</el-button>
      <!--<a class="apply-page-btn apply-page-btn-default" href="javascript:;" @click="goBack()">上一步</a>-->
    </div>
  </div>
</template>

<script>
// getProjectRoleList
import {
  getProjectRoleList,
  getProjectInformation,
  insNonOnlineProd,
  insPubCheckDate,
  insRuleGetProduct,
  insPubGetTotalPremiumGet
} from "@/api/information/information";
// 保险条款
import { publicClause,publicRisk} from "@/validate/programme"
export default {
  name: "apply-page",
  props: ["propertyData"],
  data() {
    return {
      insuranceClause:'',
      additionalClause:'',
      expireTimeOption: {
        disabledDate(date) {
          //   return date.getTime() <= Date.now();
          return date.getTime() <= Date.now() - 8.64e7;
        }
      },
      expireTimeOption2: this.disabledDate2(),
      processBoxList: [
        { name: "资料录入", cName: "投保资料填写" },
        { name: "打印盖章", cName: "投保单打印盖章" },
        { name: "资料上传", cName: "资料上传" },
        { name: "确认付款", cName: "确认付款" }
      ],
      tableData1:[
        {
          programme1:"居住项目",
          programme2:'万元',
          programme3:'元',
        },
        {
          programme1:"非居住项目",
          programme2:'万元',
          programme3:'元',
        },
      ],
      nameData: [],
      diziData: [],
      time: 0,
      time2: 0,
      dialogTableVisible:false,
      // 表单数据
      fromData: {
        // 表单验证
        fromaDataRules: {
          name: [{ required: true, message: "请选择", trigger: "change" }],
          type: [{ required: true, message: "请选择", trigger: "change" }],
          share: [{ required: true, message: "请输入", trigger: "blur" }],
          startTime: [{ required: true, message: "请选择", trigger: "change" }],
          mj: [{ required: true, message: "请选择", trigger: "blur" }],
          yc: [{ required: true, message: "请选择", trigger: "blur" }]
        },
        // 表格数据
        tableData: [
          {
            type: "",
            dizi: "",
            share: "",
            yc: "",
            bf: "",
            startTime: ""
          }
        ],
        // 投保结束时间
        endTime: ""
      },
      isShow: false,
      // 物业公司信息数据
      // propertyData: {}
      // 居住小区保费
      livePremium: Number,
      // 居住小区天保费
      liveDayPremium: Number,
      // 居住小区保额
      liveInsuredAmount: Number,
      // 非居住小区保费
      NonLivePremium: Number,
      // 非居住小区天保费
      NonLiveDayPremium: Number,
      // 非居住小区保额
      NonLiveInsuredAmount: Number,
      // 是否有泳池
      isSwimming: false,
      // 保存选中的index
      selectionItemIndexes: [],
      // 总保费
      totalPremium: 0,
      // 总保额
      totalInsuredAmount: 0,
      // 是否显示页面
      // isShowPage:true
      insCompany:'',
      // 控制结束时间
      endTimesjz:'',
      insCompanyId:'',
      isDisabledBtn:false
    };
  },
  created() {
    this.additionalClause = publicRisk()
    this.insuranceClause = publicClause()
    this.getProjecData();
    // this.getMoney();
    this.isPubGetWaitPay();
    // console.log(this.$route.query.insData,'取参数');
    this.getRuleGetProduct()
    
  },
  methods: {
    getRuleGetProduct() {
      const data = {
        insType: "3"
      };
      insRuleGetProduct(data).then(xhrData => {
        // console.log(xhrData, "保险");
        if (xhrData.code == 200) {
          this.isDisabledBtn = false
          // 保险id
          this.insCompanyId = xhrData.data.insCompany.id
          this.insCompany = xhrData.data.productList[0].insCompId;
          // 居住小区保费
          // this.livePremium = xhrData.rows[0].yearPremium;
          this.livePremium = xhrData.data.productList[0].yearPremium;
          this.tableData1[0].programme3 = this.livePremium + ' 元'
          // 居住小区天保费
          this.liveDayPremium = xhrData.data.productList[0].dayPremium;
          // 居住小区保额
          this.liveInsuredAmount = xhrData.data.productList[0].insuredAmount / 10000;
          this.tableData1[0].programme2 = this.liveInsuredAmount + ' 万元'
          // 非居住小区保费
          this.NonLivePremium = xhrData.data.productList[1].yearPremium;
          this.tableData1[1].programme3 = this.NonLivePremium + ' 元'
          // 非居住小区天保费
          this.NonLiveDayPremium = xhrData.data.productList[1].dayPremium;
          // 非居住小区保额
          this.NonLiveInsuredAmount = xhrData.data.productList[1].insuredAmount / 10000;
          this.tableData1[1].programme2 = this.NonLiveInsuredAmount + ' 万元'
        }
      }).catch(()=>{
        // 未分配保险公司 禁止操作
        this.isDisabledBtn = true
        this.livePremium = '0'
        this.liveInsuredAmount = '0'
        this.NonLivePremium = '0'
        this.NonLiveInsuredAmount = '0'
      })
    },
    // 判断 是否付款(未付款跳到付款页面)
    async isPubGetWaitPay() {
      if(this.$route.query.insData == undefined) return
      if(this.$route.query.insData.isTrue && this.$route.query.insData != undefined){
        let insData = {}
        insData = {
          id:this.$route.query.insData.id,
        }
        await insPubGetTotalPremiumGet(insData.id).then(xhrData=>{
          // console.log(xhrData,'保费');
          if(xhrData.code === 200){
            insData.totalPremium = xhrData.data
          }
        })
        
        this.$emit("changePage", "PAYMENT", insData);
      }
    },
    // 获取公众责任险保费与保额
    // getMoney() {
    //   // 0 公众 1 物业
    //   const insType = 0;
    //   insNonOnlineProd(insType).then(xhrData => {
    //     console.log(xhrData);
    //     if (xhrData.code === 200) {
    //       // 居住小区保费
    //       this.livePremium = xhrData.rows[0].yearPremium;
    //       // 居住小区天保费
    //       this.liveDayPremium = xhrData.rows[0].dayPremium;
    //       // 居住小区保额
    //       this.liveInsuredAmount = xhrData.rows[0].insuredAmount;
    //       // 非居住小区保费
    //       this.NonLivePremium = xhrData.rows[1].yearPremium;
    //       // 非居住小区天保费
    //       this.NonLiveDayPremium = xhrData.rows[1].dayPremium;
    //       // 非居住小区保额
    //       this.NonLiveInsuredAmount = xhrData.rows[1].insuredAmount;
    //     }
    //   });
    // },
    // 获取项目信息
    getProjecData() {
      getProjectRoleList().then(xhrData => {
        // console.log(xhrData, "项目信息");
        let arr = [];
        if (xhrData.code == 200) {
          this.nameData = xhrData.rows;
        }
      });
    },
    // 保险有效期时间处理
    validityTerm(val, index) {
      this.isShow = false;
      // console.log(val, index);
      // console.log("是否有泳池", this.isSwimming);


      

      let time = new Date(val).getTime();
      if (val == null && index == 0) {
        this.fromData.endTime = "";
      } else if (index == 0) {
        // 恢复空值
        this.fromData.tableData.forEach(item => {
          item.startTime = "";
        });

        var date = new Date(val);
        date.setFullYear(date.getFullYear() + 1);
        date.setDate(date.getDate() - 1);
        // console.log(date);
        const d = new Date(date);
        const resDate =
          d.getFullYear() +
          "-" +
          this.p(d.getMonth() + 1) +
          "-" +
          this.p(d.getDate());
        // console.log(val, resDate, "时间有效期");
        const timeData = {
          startTime: val + " 00:00:00",
          endTime: resDate + " 23:59:59"
        };
        let dateTime = new Date(timeData.endTime)
          this.endTimesjz = dateTime.getTime()
          // console.log(dateTime.getTime(),'1321312');
        
        // 请求 获取选择时间是否合法
        insPubCheckDate(timeData)
          .then(xhrData => {
            if (xhrData.code === 200) {
              // 赋值投保起始时间
              this.fromData.tableData[index].startTime = val;
              // 赋值投保结束时间
              this.$set(this.fromData, "endTime", resDate);
            }
          })
          // .catch(() => {
          //   this.$message.error(`在此${val}时间段内已申报过项目`);
          //   this.fromData.tableData[index].startTime = "";
          //   // this.$set(this.fromData, "endTime", "");
          //   this.fromData.endTime = "";
          // });

        this.time = time;
        this.time2 = new Date(this.fromData.endTime).getTime();
      } else if (index > 0) {
        if (this.fromData.tableData[index].type == "居住类型") {
          if (val == this.fromData.tableData[0].startTime) {
            // 是否有泳池
            if (this.fromData.tableData[index].yc == "有") {
              this.fromData.tableData[index].bf = (
                Number(this.livePremium) +
                500 * this.fromData.tableData[index].share
              ).toFixed(2);
            } else {
              this.fromData.tableData[index].bf = (
                Number(this.livePremium) * this.fromData.tableData[index].share
              ).toFixed(2);
            }
          } else {
            // console.log(this.fromData.tableData[index].yc,'1');
            // 赋值时间
            this.fromData.tableData[index].startTime = val;
            const day = this.DateDiff(val, this.fromData.endTime);
            // console.log(day);
            // 是否有泳池
            if (this.fromData.tableData[index].yc == "有") {
              // console.log(
              //   day,
              //   this.liveDayPremium,
              //   this.fromData.tableData[index].share,
              //   "总计",
              //   day * this.liveDayPremium * this.fromData.tableData[index].share
              // );

              // 居住小区 天费用计算
              this.fromData.tableData[index].bf = (
                Number(day * this.liveDayPremium) *
                  this.fromData.tableData[index].share +
                500
              ).toFixed(2);
            } else {
              // console.log(this.liveDayPremium,'this.liveDayPremium');
              
              this.fromData.tableData[index].bf = Number(
                day * this.liveDayPremium * this.fromData.tableData[index].share
              ).toFixed(2);
            }

            // console.log(this.fromData.tableData[index].bf, "居住类型 最终保费");
          }
        } else if (this.fromData.tableData[index].type == "非居住类型") {
          if (val == this.fromData.tableData[0].startTime) {
            // 是否有游泳池
            if (this.fromData.tableData[index].yc == "有") {
              this.fromData.tableData[index].bf = (
                Number(this.NonLivePremium) *
                  this.fromData.tableData[index].share +
                500
              ).toFixed(2);
            } else {
              this.fromData.tableData[index].bf = Number(
                this.NonLivePremium * this.fromData.tableData[index].share
              ).toFixed(2);
            }
          } else {
            // console.log(this.fromData.tableData[index].yc);
            // 赋值时间
            this.fromData.tableData[index].startTime = val;
            const day = this.DateDiff(val, this.fromData.endTime);
            // console.log(day);
            // 是否有泳池
            if (this.fromData.tableData[index].yc == "有") {
              // 非居住小区 天费用计算
              this.fromData.tableData[index].bf = (
                Number(day * this.NonLiveDayPremium) *
                  this.fromData.tableData[index].share +
                500
              ).toFixed(2);
            } else {
              this.fromData.tableData[index].bf = Number(
                day *
                  this.NonLiveDayPremium *
                  this.fromData.tableData[index].share
              ).toFixed(2);
            }
            // console.log(
            //   this.fromData.tableData[index].bf,
            //   "非居住类型 最终保费"
            // );
          }
        }
      }
    },
    // 提取公用
    p(s) {
      return s < 10 ? "0" + s : s;
    },
    // 规则时间控件在第一次选择之后时间段内选择
    disabledDate2() {
      let _this = this;
      return {
        disabledDate(date) {
          let curDate = new Date().getTime();
          let three = 12 * 31 * 24 * 3600 * 1000;
          let threeMonths = curDate + three;
          return (
            // date.getTime() < _this.time - 8.64e7 || date.getTime() > threeMonths
            date.getTime() < _this.time - 8.64e7  || date.getTime() > _this.endTimesjz  - 8.64e7 
          );
        }
      };
    },
    // 下一步
    next() {
      this.$refs["from"].validate(valid => {
        if (valid) {
          // alert("submit!");
          // console.log(this.endTime);
          const _this = this;
          const arr = [];
          this.fromData.tableData.forEach(item => {
            item.endTime = _this.fromData.endTime;
            item.insCompany = _this.insCompany
            arr.push(item);
          });
          // this.insCompanyId
          arr[0].insCompanyId = this.insCompanyId
          // arr 当前输入数据 propertyData 物业公司信息
          this.$emit("changePage", "PRINTING", arr);
        } else {
          this.$message({
            message: "请完善信息！",
            type: "warning"
          });
          return false;
        }
      });
    },
    // 添加项目
    addProject() {
      this.isShow = false;
      this.$refs["from"].validate(valid => {
        if (valid) {
          this.fromData.tableData.forEach(item1 => {
            // console.log(item1.name.name,'item1');
            this.nameData.forEach(item2 => {
              // console.log(item2.name, "item2");
              if (item1.name.name == item2.name) {
                // console.log(item1.name.name);
                item2.disabled = true;
              }
            });
          });
          this.fromData.tableData.push({
            type: "",
            dizi: "",
            share: "",
            yc: "",
            bf: "",
            startTime: ""
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
    // 删除项目
    deleteProject() {
      this.isShow = false;
      // console.log(this.selectionItemIndexes);
      // console.log(this.fromData.tableData);
      this.selectionItemIndexes.forEach(index => {
        if (index == 0) {
          return;
        }
        this.nameData.forEach(item => {
          item.disabled = false;
        });
        // console.log(this.fromData.tableData[index], "删除");
        this.fromData.tableData.splice(index, 1);
        this.fromData.tableData.forEach(item1 => {
          // console.log(item1.name.name,'item1');
          this.nameData.forEach(item2 => {
            // console.log(item2.name, "item2");
            if (item1.name.name == item2.name) {
              // console.log(item1.name.name);
              item2.disabled = true;
            } else {
              item2.disabled = false;
            }
          });
        });
      });
    },
    // 选择项目名称触发
    getProjeName(row, index) {
      this.isShow = false;
      // console.log(row.name, index);
      // 还原 份数
      this.fromData.tableData[index].share = "";
      // 还原 是否有泳池
      this.fromData.tableData[index].yc = "";
      this.isSwimming = false;
      // 还原 保费
      this.fromData.tableData[index].bf = "";
      this.fromData.tableData[index].diziData = row.address;
      // this.diziData = row.address.split(";");
      // this.fromData.tableData[index].dizi = this.diziData[0];
      if (row.type == "0") {
        row.type = "居住类型";
      } else if (row.type == "1") {
        row.type = "非居住类型";
      }
      this.fromData.tableData[index].type = row.type;
    },
    // 投保份数
    calculate(val, index) {
      this.isShow = false;
      // console.log(val, index);
      // console.log("是否有泳池", this.isSwimming);
      this.isSwimming = false;
      this.fromData.tableData[index].yc = "";
      this.fromData.tableData[index].bf = "";
      if (index > 0) {
        this.fromData.tableData[index].startTime = "";
      }
      if (val < 0) {
        this.fromData.tableData[index].share = "0";
        val = 0;
      } else if (val > 10) {
        this.fromData.tableData[index].share = "10";
        val = 10;
      }
      const num = parseInt(val);

      if (val == "" || val == NaN) {
        this.fromData.tableData[index].bf = "";
        return;
      }
      if (this.fromData.tableData[index].type == "居住类型") {
        // this.fromData.tableData[index].bf = num * this.livePremium;
        this.fromData.tableData[index].bf = Number(
          num * this.livePremium
        ).toFixed(2);
        // 有游泳池
        if (this.isSwimming) {
          this.fromData.tableData[index].bf = Number(
            this.fromData.tableData[index].bf + 500
          ).toFixed(2);
          this.isSwimming = false;
        }
      } else if (this.fromData.tableData[index].type == "非居住类型") {
        // this.fromData.tableData[index].bf = num * this.NonLivePremium;
        this.fromData.tableData[index].bf = Number(
          num * this.NonLivePremium
        ).toFixed(2);
        if (this.isSwimming) {
          this.fromData.tableData[index].bf = (
            Number(this.fromData.tableData[index].bf) + 500
          ).toFixed(2);
        }
      }
    },
    // 是否有泳池
    swimming(val, index) {
      this.isShow = false;
      // console.log(val, index);
      if (this.fromData.tableData[index].type == "") return;
      if (val == "有") {
        this.fromData.tableData[index].bf = (
          Number(this.fromData.tableData[index].bf) + 500
        ).toFixed(2);
        this.isSwimming = true;
      } else if (val == "无") {
        if (this.isSwimming) {
          this.fromData.tableData[index].bf = (
            Number(this.fromData.tableData[index].bf) - 500
          ).toFixed(2);
          this.isSwimming = false;
        } else {
          this.fromData.tableData[index].bf = Number(
            this.fromData.tableData[index].bf
          ).toFixed(2);
          this.isSwimming = false;
        }
      }
    },
    //计算天数差的函数，通用
    DateDiff(sDate1, sDate2) {
      //sDate1和sDate2是2006-12-18格式
      var aDate, oDate1, oDate2, iDays;
      // aDate = sDate1.split("-");
      // oDate1 = new Date(aDate[1] + "-" + aDate[2] + "-" + aDate[0]); //转换为12-18-2006格式
      // aDate = sDate2.split("-");
      // oDate2 = new Date(aDate[1] + "-" + aDate[2] + "-" + aDate[0]);
      // iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24); //把相差的毫秒数转换为天数
      
       let sDateOne = new Date(sDate1);
      let sDateTwo = new Date(sDate2);
      let sDate1TimeStamp = sDateOne.getTime(sDateOne);
      let sDate2TimeStamp = sDateTwo.getTime(sDateTwo);
      iDays = parseInt(Math.abs(sDate1TimeStamp - sDate2TimeStamp) / 1000 / 60 / 60 / 24) + 1; //把相差的毫秒数转换为天数
      return iDays;
    },
    //
    handleSelectionChange(val) {
      // console.log(val);
      this.selectionItemIndexes = [];
      val.forEach(item => {
        this.selectionItemIndexes.push(item.index);
      });
      // console.log(this.selectionItemIndexes);
    },
    tableRowClassName(row) {
      row.row.index = row.rowIndex;
    },
    // 计算总保额总保费
    calculation() {
      this.$refs["from"].validate(valid => {
        if (valid) {
          this.isShow = true;
          var num1 = 0;
          var num2 = 0;
          var bf1 = 0;
          var totalInsuredAmount1 = 0;
          var totalInsuredAmount2 = 0;
          for (let i = 0; i < this.fromData.tableData.length; i++) {
            if (this.fromData.tableData[i].type == "居住类型") {
              num1 += this.fromData.tableData[i].share;
            } else if (this.fromData.tableData[i].type == "非居住类型") {
              num2 += this.fromData.tableData[i].share;
            }
            bf1 += Number(this.fromData.tableData[i].bf);
            // console.log(bf1);
          }
          totalInsuredAmount1 = parseInt(num1 * this.liveInsuredAmount);
          totalInsuredAmount2 = parseInt(num2 * this.NonLiveInsuredAmount);
          // 总保额
          this.totalInsuredAmount = totalInsuredAmount1 + totalInsuredAmount2;
          // 总保费
          // this.totalPremium = bf1;
          this.totalPremium = Math.ceil(bf1);
        } else {
          this.$message({
            message: "请完善信息！",
            type: "warning"
          });
          return false;
        }
      });
    },
    // 处理输入最少为1
    handleNumber(e){
      if(e.target.value == '0'){
        e.target.value = ''
      }
    },
    // 打开产品说明
    openExplain(){
      this.dialogTableVisible = true
    }
  }
};
</script>
<style>
 .el-table--scrollable-x .el-table__body-wrapper{
    min-height: calc(20vh);

  }
  
</style>
<style>
#fromDateTable .el-form-item {
  margin-bottom: 0;
}
#guarantee-dialog .el-dialog__header {
  background-color: #e6e8eb;
}
#guarantee-dialog .guarantee-btn {
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
#guarantee-dialog .guarantee-btn.btn1 {
  background: rgba(239, 130, 0, 1);
  border: 1px solid rgba(206, 112, 0, 1);
  color: #fff;
}
#guarantee-dialog .guarantee-btn.btn2 {
  border: 1px solid rgba(0, 0, 0, 0.25);
}
#guarantee-dialog .el-dialog__title {
  font-size: 20px;
  font-weight: bold;
}
#guarantee-dialog .el-dialog__body {
  padding-left: 40px;
  padding-right: 40px;
  padding-bottom: 40px;
  box-sizing: border-box;
}
#guarantee-dialog .el-dialog__footer {
  background-color: #e6e8eb;
}

.declare-btn-wrap {
  margin-top: 40px;
  padding-top: 15px;
  border-top: 1px solid #dbdbdb;
}
.declare-btn {
  display: inline-block;
  width: 130px;
  height: 44px;
  text-align: center;
  font-size: 16px;
  font-weight: bold;
}
.declare-btn.btn1 {
  background: linear-gradient(
    270deg,
    rgba(248, 184, 0, 1) 0%,
    rgba(239, 130, 0, 1) 100%
  );
  border-radius: 4px;
  border: 1px solid rgba(248, 184, 0, 1);
  color: #fff;
}
.declare-btn.btn1.disabled {
  opacity: 0.5;
}
.declare-btn.btn2 {
  border-radius: 4px;
  border: 1px solid #dbdbdb;
  color: #999;
}
</style>
<style lang="scss" scoped>
.page-content {
  padding: 50px 20px;
  box-sizing: border-box;
  .process {
    margin-bottom: 5px;
    .process-content {
      display: flex;

      :first-child {
        ::after {
          display: none !important;
        }
      }

      .process-box {
        margin-right: 110px;
        display: flex;
        position: relative;

        ::after {
          content: "";
          position: absolute;
          left: -90px;
          top: 15px;
          width: 80px;
          height: 1px;
          background-color: #eaeaea;
        }

        .process-box-left {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background-color: #ef8200;
          font-size: 12px;
          text-align: center;
          line-height: 30px;
          color: #fff;
        }

        .process-box-right {
          margin-left: 10px;

          h5 {
            margin-top: 8px;
            margin-bottom: 8px;
            font-size: 16px;
            letter-spacing: 2px;
          }

          p {
            margin-top: 5px;
            color: #818181;
            font-size: 14px;
          }
        }
      }
    }
  }
  p {
    font-size: 14px;
    color: #828282;
    margin-top: 25px;
    word-break: break-all;
  }

  p.name {
    padding-right: 10px;
  }

  p.label {
    padding-right: 50px;
  }
  p.money {
    margin-top: 30px;
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: rgba(0, 0, 0, 1);
  }
  .page-top {
    margin-top: 45px;
    margin-bottom: 10px;
    display: flex;
    span {
      color: rgb(1, 121, 254);
      margin-left: 15px;
      font-size: 14px;
      cursor: pointer;
    }
    h4 {
      span {
        display: inline-block;
        width: 13px;
        height: 13px;
        border-radius: 50%;
        border: 1px solid #6b6b6b;
        font-size: 10px;
        text-align: center;
        line-height: 13px;
        color: #929292;
        margin-left: 10px;
      }
    }
  }
  .apply-page-bot {
    border-top: 1px solid #dddddd;
    box-sizing: border-box;
    margin-top: 40px;

    .el-form-item__content {
      margin-left: 0px !important;
    }

    a.apply-page-btn {
      margin-top: 25px;
      display: inline-block;
      width: 130px;
      height: 44px;
      background: linear-gradient(
        270deg,
        rgba(248, 184, 0, 1) 0%,
        rgba(239, 130, 0, 1) 100%
      );
      border-radius: 4px;
      text-align: center;
      line-height: 44px;
      font-size: 16px;
      color: #fff;
    }

    a.apply-page-btn + a.apply-page-btn {
      margin-left: 10px;
    }

    a.apply-page-btn-default {
      background: #f1f2f3 !important;
      color: #606266 !important;
      border: 1px solid #cacbcc;
    }
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
  }
}
</style>
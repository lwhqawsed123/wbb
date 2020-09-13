<template>
  <div class="familyBean-add">
    <p style="padding:2px 0">说明：充值赠送，充值家财豆赠送家财豆</p>
    <p style="margin-left:43px;padding:2px 0">拉新推广，新注册用户赠送家财豆</p>
    <p style="margin-left:43px;padding:2px 0">促销活动，购买在线雇主，申报一个员工赠送家财豆</p>
    <el-form
      id="familyBean-form"
      ref="form"
      :model="form"
      label-width="100px"
      label-position="left"
    >
      <el-form-item label="活动名称：">
        <el-input disabled style="width:320px" maxlength="20" v-model.trim="form.name"></el-input>
      </el-form-item>
      <el-form-item label="活动类型：">
        <el-radio-group @change="getType1" v-model="form.type1">
          <el-radio disabled label="1">充值赠送</el-radio>
          <el-radio disabled label="2">拉新推广</el-radio>
          <el-radio disabled label="3">促销活动</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="活动区域：">
        <el-radio-group v-model.trim="form.type2">
          <el-radio disabled class="declare-radio" label="1">
            <span>全国</span>
          </el-radio>
          <el-radio disabled class="declare-radio" label="2">
            <span>部分</span>
            <el-button
            :disabled="isShowRegion"
              @click="choice"
              style="margin-left:15px"
              type="primary"
              plain
              size="mini"
            >选择区域</el-button>
          </el-radio>
          <el-radio disabled v-show="activityType2" class="declare-radio" label="3">
            <span>单一物业</span>
            <!-- <el-form-item prop="name" label="姓名："> -->
            <el-select
              disabled
              style="display:block;margin-top:10px;width:320px"
              v-model="form.propertyName"
              filterable
              multiple
              remote
              reserve-keyword
              @change="getNameData"
              :remote-method="remoteMethod"
              :loading="loading"
              value-key="value"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <!-- </el-form-item> -->
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-show="activityType1" label="赠送类型：">
        <el-radio-group @change="getType2" v-model="form.type3">
          <el-radio disabled label="1">充值赠送</el-radio>
          <!-- <el-radio disabled label="2">免费赠送</el-radio> -->
        </el-radio-group>
      </el-form-item>
      <el-form-item v-show="isShow1&&activityType1" label="购买金额：">
        <el-input
          disabled
          @blur="limit($event)"
          style="width:320px"
          oninput="value=value.replace(/[^\d]/g,'')"
          v-model.trim="form.money"
        ></el-input>
      </el-form-item>
      <el-form-item label="赠送数量：">
        <el-input
          disabled
          @blur="limit($event)"
          style="width:320px"
          oninput="value=value.replace(/[^\d]/g,'')"
          v-model.trim="form.number"
        ></el-input>
      </el-form-item>
      <el-form-item v-if="activityType2" v-show="isShow1" label="活动图片：">
        <!-- <el-upload
          action="123"
          list-type="picture-card"
          :class="{ disabled: uploadDisabled1 }"
          :on-change="handleChange1"
          :multiple="false"
          :limit="limitcount1"
          :http-request="httpRequest"
          :on-remove="handleRemove1"
          :on-preview="handlePictureCardPreview1"
        >
          <i class="el-icon-plus"></i>
        </el-upload>-->
        <el-image
          style="width: 150px; height: 150px;cursor: pointer;"
          :src="imgUrl"
          :preview-src-list="srcList1"
        ></el-image>
      </el-form-item>
      <el-form-item v-show="isShow1" label="活动时间：">
        <el-date-picker
          disabled
          value-format="yyyy-MM-dd"
          v-model="form.createTimeList"
          type="daterange"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
    </el-form>
    <!-- 省市区 对话框 -->
    <el-dialog title="选择区域" class="seeDialog" :visible.sync="dialogVisible" width="600px">
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
      </el-form>
      <span slot="footer" class="dialog-footer">
        <!-- <a href="javascript:;" class="btn btn1" @click="getCheckedKeys">保 存</a> -->
        <a href="javascript:;" class="btn btn2" @click="dialogVisible=false">取 消</a>
      </span>
    </el-dialog>
    <!-- 查看大图 -->
    <el-dialog :visible.sync="dialogVisible1">
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>
    <div class="declare-btn-wrap">
      <!-- <el-button ref="disabledBtn" class="declare-btn btn1" @click="submission">提 交</el-button> -->
      <el-button class="declare-btn" @click="btnchReturn">返 回</el-button>
    </div>
  </div>
</template>

<script>
import {
  filePolicy,
  sysRegion,
  systemActivity,
  systemActivityGetProperty,
  systemActivityGetProvinces,
  //
  systemActivityId,
  systemActivityGetCompany
} from "@/api/information/information";
import $ from "jquery";
export default {
  name: "familyBean-add",
  props: ["obj"],
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          // let curDate = new Date().getTime();
          // let three = 31 * 24 * 3600 * 1000;
          // let threeMonths = curDate + three;
          return time.getTime() < Date.now();
        }
      },
      dialogImageUrl: "",
      ruleForm: {},
      citySelectIdList: [],
      dialogVisible: false,
      dialogVisible1: false,
      uploadDisabled1: false,
      limitcount1: 1,
      form: {
        name: "",
        type1: "1",
        type2: "1",
        type3: "1",
        createTimeList: undefined,
        number: "",
        money: ""
      },
      isShow1: true,
      activityType1: true,
      activityType2: true,
      activityType3: false,
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 树形控件
      treeData: [],
      // 保存上传图片
      imgData: undefined,
      options: [],
      list: [],
      loading: false,
      states: [],
      // 保存选择的物业
      propertyStr: undefined,
      // 保存活动区域
      regionStr: undefined,
      // 保存图片
      imgUrl: "",
      srcList1: [],
      isShowRegion:false
    };
  },
  mounted() {
    //   this.list = this.states.map(item => {
    //       return { value: `${item.id}`, label: `${item.name}` };
    //     });
    // console.log(this.obj);
    this.getSee();
  },
  methods: {
    async getSee() {
      let system = await systemActivityGetCompany(this.obj.id);
      //   console.log(system, "system");
      if (system.code === 200) {
        this.states = system.data.data;
      }
      let xhrData = await systemActivityId(this.obj.id);
      if (xhrData.code === 200) {
        this.form.createTimeList = ["", ""];
        this.form.name = xhrData.data.name;
        this.form.type1 = "" + xhrData.data.type;
        // 充值赠送
        if (this.form.type1 == "1") {
          this.activityType1 = true;
          this.activityType2 = true;
          this.form.type3 = "1";
        }
        // 拉新推广
        else if (this.form.type1 == "2") {
          this.activityType2 = false;
          this.activityType1 = false;
          this.isShow1 = true;
          this.form.type3 = null;
        }
        // 促销活动
        else if (this.form.type1 == "3") {
          // this.activityType3 = true
          this.activityType2 = true;
          this.activityType1 = false;
          this.form.type3 = null;
        }
        this.form.createTimeList[0] = xhrData.data.activity_start_date.split(
          " "
        )[0];
        this.form.createTimeList[1] = xhrData.data.activity_end_date.split(
          " "
        )[0];
        if (xhrData.data.company_id == "0" && xhrData.data.region_id != "0") {
          this.form.type2 = "2";
        } else if (
          xhrData.data.company_id != "0" &&
          xhrData.data.region_id == "0"
        ) {
          this.form.type2 = "3";
          this.isShowRegion = true
        } else {
          this.form.type2 = "1";
          this.isShowRegion = true
        }
        // 表示未选择物业公司
        if (xhrData.data.company_id == "0") {
          //   this.citySelectIdList = [];
        } else {
          this.propertyStr = xhrData.data.company_id;
          this.form.propertyName = this.propertyStr.split(",");
        }
        // 表示未选择区域
        if (xhrData.data.region_id == "0") {
          //   this.form.propertyName = "";
        } else {
          this.regionStr = xhrData.data.region_id.split(",");
          this.citySelectIdList = this.regionStr;
        }
        // console.log(this.form.createTimeList);
        this.form.number = xhrData.data.fortune_bean;
        this.form.money = xhrData.data.start_number;
        this.imgUrl = xhrData.data.image;
        this.srcList1.push(this.imgUrl);
        let newArrId = xhrData.data.company_id.split(',')
        let newArrName = xhrData.data.company_name.split(',')
        newArrId.forEach((item,index) =>{
          this.options.push({
            value:item,
            label:newArrName[index]
          })
        })
        
        

      }
    },
    // 保存省市区数据
    getCheckedKeys() {
      this.regionStr = this.$refs.tree.getCheckedKeys().join(",");
      this.citySelectIdList = this.regionStr.split(",");
      // console.log(this.citySelectIdList);

      // console.log(this.regionStr);
      this.dialogVisible = false;
      this.$message.success("保存成功");
    },
    // 打开省市区
    choice() {
      this.dialogVisible = true;
      // 请求 获取数据
      systemActivityGetProvinces().then(xhrData => {
        // console.log(xhrData);
        if (xhrData.code === 200) {
          // 赋值默认选中的值
          this.$nextTick(() => {
            this.treeData = xhrData.data;
            // console.log(this.citySelectIdList);
          });
        }
      });
    },
    // 搜索物业信息
    getNameData(val) {
      // console.log(val);
      this.propertyStr = val.join(",");
    },
    httpRequest(file) {
      // console.log(file);
    },
    handleRemove1(file, fileList) {
      this.uploadDisabled1 = fileList.length >= this.limitcount1;
      this.imgData = "";
    },
    handlePictureCardPreview1(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible1 = true;
    },
    btnchReturn() {
      this.$emit("changePage", "LIST");
    },
    // 获取活动类型
    getType1(val) {
      // console.log(val);
      // 充值赠送
      if (val == "1") {
        this.activityType1 = true;
        this.activityType2 = true;
        this.form.type3 = "1";
      }
      // 拉新推广
      else if (val == "2") {
        this.activityType2 = false;
        this.activityType1 = false;
        this.isShow1 = true;
      }
      // 促销活动
      else if (val == "3") {
        // this.activityType3 = true
        this.activityType2 = true;
        this.activityType1 = false;
      }
    },
    // 获取赠送类型
    getType2(val) {
      // console.log(val);
      if (val == "1") {
        this.isShow1 = true;
      } else if (val == "2") {
        this.isShow1 = false;
      }
    },
    // 提交资料
    submission() {
      if (this.form.type2 == "2") {
        if (this.regionStr == undefined) {
          this.$message.warning("请选择区域！");
          return;
        }
      } else if (this.form.type2 == "3") {
        if (this.propertyStr == undefined) {
          this.$message.warning("请选择物业公司！");
          return;
        }
      }
      if (this.form.createTimeList == undefined) {
        // return
        this.form.createTimeList = [];
      }
      // 免费活动
      if (this.form.type3 == "2") {
        const data = {};
      } else {
        const data = {
          name: this.form.name, // 活动名称
          activity_start_date:
            this.form.createTimeList[0] == undefined
              ? undefined
              : this.form.createTimeList[0] + " 00:00:00", // 活动开始时间
          activity_end_date:
            this.form.createTimeList[1] == undefined
              ? undefined
              : this.form.createTimeList[1] + " 23:59:59", // 活动结束时间
          company_id: this.propertyStr, // 活动开启物业区域(支持多选择,逗号隔开)
          fortune_bean: this.form.number, // 赠送家财豆数量
          image: this.imgData, // 图片路劲
          region_id: this.regionStr, // 活动区域(支持多选择,逗号隔开)
          type: this.form.type1, // 活动类型
          start_number: this.form.money // 金额
        };
        // console.log(data);
        // 请求 提交
        const loading = this.$loading({
          lock: true,
          text: "提交中...",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        systemActivity(data)
          .then(xhrData => {
            // console.log(xhrData);
            if (xhrData.code === 200) {
              this.$message({
                message: "提交成功",
                type: "success"
              });
              loading.close();
            }
          })
          .catch(() => {
            loading.close();
          });
      }
    },
    // 搜索查询下拉框
    async remoteMethod(query) {
      this.options = [];
      if (query !== "") {
        const page = {
          pageNum: 1,
          pageSize: 99999,
          name: query
        };
        await systemActivityGetProperty(page).then(xhrData => {
          if (xhrData.code === 200) {
            this.states = xhrData.data;
          }
        });
        this.loading = true;
        this.list = this.states.map(item => {
          return { value: `${item.id}`, label: `${item.name}` };
        });
        setTimeout(() => {
          this.loading = false;
          this.options = this.list.filter(item => {
            return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1;
          });
        }, 200);
      } else {
        this.options = [];
      }
    },
    // 输入框限制
    limit(val) {
      // console.log(val.target.value);

      if (val.target.value == 0) {
        val.target.value = "1";
      }
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
  padding-bottom: 50px;
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
.declare-btn-wrap {
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
.familyBean-add {
  padding: 0 30px;
  padding-top: 30px;
  box-sizing: border-box;
  p {
    color: #333;
    font-size: 14px;
  }
  #familyBean-form {
    padding: 20px 0;
    box-sizing: border-box;
  }
  .declare-radio {
    display: block;
    margin-top: 15px;
  }
}
</style>
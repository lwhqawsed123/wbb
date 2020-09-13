<template>
  <div class="familyBean-add">
    <p style="padding:2px 0">说明：充值赠送，充值家财豆赠送家财豆</p>
    <p style="margin-left:43px;padding:2px 0">拉新推广，新注册用户赠送家财豆</p>
    <p style="margin-left:43px;padding:2px 0">促销活动，购买在线雇主，申报一个员工赠送家财豆</p>
    <el-form
      id="familyBean-form"
      ref="form"
      :rules="rules"
      :model="form"
      label-width="100px"
      label-position="left"
    >
      <el-form-item :required="valType1" prop="name" label="活动名称：">
        <el-input style="width:320px" maxlength="20" v-model.trim="form.name"></el-input>
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
          <el-radio class="declare-radio" label="1">
            <span>全国</span>
          </el-radio>
          <el-radio class="declare-radio" label="2">
            <span>部分</span>
            <el-button
              @click="choice"
              style="margin-left:15px"
              type="primary"
              plain
              size="mini"
            >选择区域</el-button>
          </el-radio>
          <el-radio v-show="activityType2" class="declare-radio" label="3">
            <span>单一物业</span>
            <!-- <el-form-item prop="name" label="姓名："> -->
            <el-select
              style="display:block;margin-top:10px;width:320px"
              v-model="form.propertyName"
              filterable
              multiple
              remote
              reserve-keyword
              placeholder="请输入关键词"
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
          <el-radio label="1">充值赠送</el-radio>
          <!-- <el-radio label="2">免费赠送</el-radio> -->
        </el-radio-group>
      </el-form-item>
      <el-form-item :required="valType2" prop="money" v-show="isShow1&&activityType1" label="购买金额：">
        <el-input
          @blur="limit($event)"
          style="width:320px"
          oninput="value=value.replace(/[^\d]/g,'')"
          v-model.trim="form.money"
        ></el-input>
      </el-form-item>
      <el-form-item :required="valType3" prop="number" label="赠送数量：">
        <el-input
          @blur="limit($event)"
          style="width:320px"
          oninput="value=value.replace(/[^\d]/g,'')"
          v-model.trim="form.number"
        ></el-input>
      </el-form-item>
      <el-form-item
        prop="img"
        :required="valType4"
        v-if="activityType2"
        v-show="isShow1"
        label="活动图片："
      >
        <el-upload
          v-model="form.img"
          action="123"
          list-type="picture-card"
          :class="{ disabled: uploadDisabled1 }"
          :on-change="handleChange1"
          :file-list="photoList"
          :multiple="false"
          :limit="limitcount1"
          :http-request="httpRequest"
          :on-remove="handleRemove1"
          :on-preview="handlePictureCardPreview1"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>
      <el-form-item :required="valType5" prop="createTimeList" v-show="isShow1" label="活动时间：">
        <el-date-picker
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
        <a href="javascript:;" class="btn btn1" @click="getCheckedKeys">保 存</a>
        <a href="javascript:;" class="btn btn2" @click="dialogVisible=false">取 消</a>
      </span>
    </el-dialog>
    <!-- 查看大图 -->
    <el-dialog :visible.sync="dialogVisible1">
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>
    <div class="declare-btn-wrap">
      <el-button ref="disabledBtn" class="declare-btn btn1" @click="submission">提 交</el-button>
      <el-button class="declare-btn" @click="btnchReturn">返 回</el-button>
    </div>
  </div>
</template>

<script>
import {
  filePolicy,
  sysRegion,
  systemActivityGetProperty,
  systemActivityGetProvinces,
  systemActivitySetActivity,
  systemActivityId,
  systemActivityGetCompany,
  systemActivityPut
} from "@/api/information/information";
import $ from "jquery";
export default {
  name: "familyBean-add",
  props: ["obj"],
  data() {
    // 验证活动名称
    let validateName = (rule, value, callback) => {
      if (this.form.name === "" && this.valType1) {
        callback(new Error("请输入活动名称"));
      } else {
        callback();
      }
      // callback();
    };
    // 验证购买金额
    let validateMoney = (rule, value, callback) => {
      if (this.form.money === "" && this.valType2) {
        callback(new Error("请输入购买金额"));
      } else {
        callback();
      }
      //  callback();
    };
    // 验证赠送数量
    let validateNumber = (rule, value, callback) => {
      if (this.form.number === "" && this.valType3) {
        callback(new Error("请输入赠送数量"));
      } else {
        callback();
      }
      // callback();
    };
    // 验证活动时间
    let validateCreateTimeList = (rule, value, callback) => {
      if (
        this.form.createTimeList.length < 0 ||
        this.form.createTimeList[0] == undefined
      ) {
        callback(new Error("请选择活动时间"));
      } else {
        callback();
      }
      // callback();
    };
    // 验证活动图片
    let validateImg = (rule, value, callback) => {
      if (this.form.img.length <= 0) {
        callback(new Error("请选择活动图片"));
      } else {
        callback();
      }
      // callback();
    };
    return {
      pickerOptions: {
        disabledDate(time) {
          // let curDate = new Date().getTime();
          // let three = 31 * 24 * 3600 * 1000;
          // let threeMonths = curDate + three;
          return time.getTime() < Date.now();
        }
      },
      photoList: [],
      dialogImageUrl: "",
      ruleForm: {},
      citySelectIdList: [],
      dialogVisible: false,
      dialogVisible1: false,
      uploadDisabled1: false,
      limitcount1: 1,
      form: {
        type1: "1",
        type2: "1",
        type3: "1",
        createTimeList: undefined,
        name: "",
        money: "",
        number: "",
        propertyName: [],
        img: "1"
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
      valType1: true,
      valType2: true,
      valType3: true,
      valType4: true,
      valType5: true,
      // 表单验证
      rules: {
        name: [{ validator: validateName, trigger: "blur" }],
        money: [{ validator: validateMoney, trigger: "blur" }],
        number: [{ validator: validateNumber, trigger: "blur" }],
        createTimeList: [
          { validator: validateCreateTimeList, trigger: "change" }
        ],
        img: [{ validator: validateImg, trigger: "blur" }]
      }
    };
  },
  mounted() {
    //
    this.list = this.states.map(item => {
      return { value: `${item.id}`, label: `${item.name}` };
    });
    this.getData();
  },
  methods: {
    async getData() {
      let system = await systemActivityGetCompany(this.obj.id);
      //   console.log(system, "system");
      if (system.code === 200) {
        this.states = system.data.data;
      }

      this.remoteMethod(".(*)-.", this.states);

      let activityId = await systemActivityId(this.obj.id);
      if (activityId.code === 200) {
        this.form.createTimeList = ["", ""];
        this.form.name = activityId.data.name;
        this.form.type1 = "" + activityId.data.type;
        // 充值赠送
      if (this.form.type1 == "1") {
        this.activityType1 = true;
        this.activityType2 = true;
        this.form.type3 = "1";
        this.valType1 = true
        this.valType2 = true
        this.valType3 = true
        this.valType4 = true
      }
      // 拉新推广
      else if (this.form.type1 == "2") {
        this.activityType2 = false;
        this.activityType1 = false;
        this.isShow1 = true;
        this.form.type3 = null;
        this.valType1 = true
        this.valType2 = false
        this.valType3 = true
        this.valType4 = false
      }
      // 促销活动
      else if (this.form.type1 == "3") {
        // this.activityType3 = true
        this.activityType2 = true;
        this.activityType1 = false;
        this.form.type3 = null;
        this.valType1 = true
        this.valType2 = false
        this.valType3 = true
        this.valType4 = true
      }
        this.form.createTimeList[0] = activityId.data.activity_start_date.split(
          " "
        )[0];
        this.form.createTimeList[1] = activityId.data.activity_end_date.split(
          " "
        )[0];
        this.form.number = activityId.data.fortune_bean;
        this.form.money = activityId.data.start_number;
        // console.log(activityId.data.image);
        let imgObj = {};
        imgObj.name = "file";
        imgObj.url = activityId.data.image;
        this.photoList.push(imgObj);
        this.imgData = imgObj.url;
        if (
          activityId.data.company_id == "0" &&
          activityId.data.region_id != "0"
        ) {
          this.form.type2 = "2";
        } else if (
          activityId.data.company_id != "0" &&
          activityId.data.region_id == "0"
        ) {
          this.form.type2 = "3";
        } else {
          this.form.type2 = "1";
        }
        // 表示未选择物业公司
        if (activityId.data.company_id == "0") {
          //   this.citySelectIdList = [];
        } else {
          this.propertyStr = activityId.data.company_id;
          this.form.propertyName = this.propertyStr.split(",");
        }
        // 表示未选择区域
        if (activityId.data.region_id == "0") {
          //   this.form.propertyName = "";
        } else {
          this.regionStr = activityId.data.region_id.split(",");
          this.citySelectIdList = this.regionStr;
        }
      }

      //   const data = {
      //       company_id:this.propertyStr
      //   }
      //   console.log(data);

      //   let system= await systemActivityGetCompany(this.propertyStr)
      //   if(system.code === 200){
      //       this.form.propertyName = this.propertyStr.split(",");
      //       this.states  = system.data
      //   }
    },
    // 保存省市区数据
    getCheckedKeys() {
      this.regionStr = this.$refs.tree.getCheckedKeys().join(",");
      this.citySelectIdList = this.regionStr.split(",");
      //   console.log(this.citySelectIdList);

      //   console.log(this.regionStr);
      this.dialogVisible = false;
      this.$message.success("保存成功");
    },
    //
    async handleChange1(file1, fileList) {
      //   console.log(file1);
      var _self = this;
      //获取上传通行证
      const res = await filePolicy();
      if (res.code === 200) {
        _self.aliyunOssToken = res.data;
      } else {
        _self.$message.error(res.data.message);
      }

      this.uploadDisabled1 = fileList.length >= this.limitcount1;
      var getSuffix = function(fileName) {
        var pos = fileName.lastIndexOf(".");
        var suffix = "";
        if (pos != -1) {
          suffix = fileName.substring(pos);
        }
        return suffix;
      };
      var filename = new Date().getTime() + getSuffix(file1.name);
      var formData = new FormData();
      //注意formData里append添加的键的大小写
      formData.append("key", _self.aliyunOssToken.dir + filename); //存储在oss的文件路径
      formData.append("OSSAccessKeyId", _self.aliyunOssToken.accessKeyId); //accessKeyId
      formData.append("policy", _self.aliyunOssToken.policy); //policy
      formData.append("Signature", _self.aliyunOssToken.signature); //签名
      //如果是base64文件，那么直接把base64字符串转成blob对象进行上传就可以了

      formData.append("file", file1.raw);
      formData.append("success_action_status", 200); //成功后返回的操作码
      var url = _self.aliyunOssToken.action;

      var fileUrl =
        _self.aliyunOssToken.action + "/" + _self.aliyunOssToken.dir + filename;

      $.ajax({
        url: url,
        type: "POST",
        data: formData,
        // async: false,
        cache: false,
        contentType: false,
        processData: false,
        success: function(data) {
          // 请求成功 返回路径
          //   console.log(fileUrl, "成功");
          _self.imgData = fileUrl;
        },
        error: function(data) {
          //   console.log(data, "失败");
        }
      });
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
      //   console.log(val);
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
      this.imgData = undefined;
      this.$refs['form'].resetFields();
      this.photoList = []
      this.form.type2 = '1'
      this.reduction(val)
      // 充值赠送
      if (val == "1") {
        this.activityType1 = true;
        this.activityType2 = true;
        this.form.type3 = "1";
         this.valType1 = true
        this.valType2 = true
        this.valType3 = true
        this.valType4 = true
      }
      // 拉新推广
      else if (val == "2") {
        this.activityType2 = false;
        this.activityType1 = false;
        this.isShow1 = true;
         this.valType1 = true
        this.valType2 = false
        this.valType3 = true
        this.valType4 = false
      }
      // 促销活动
      else if (val == "3") {
        // this.activityType3 = true
        this.activityType2 = true;
        this.activityType1 = false;
        this.valType1 = true
        this.valType2 = false
        this.valType3 = true
        this.valType4 = true
      }
    },
    // 获取赠送类型
    getType2(val) {
      //   console.log(val);
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
        } else {
          let regionStr = this.regionStr.split(",");
          let newArr = [];
          regionStr.forEach(item => {
            // console.log(item);
            if (item.indexOf("_") <= -1) {
              newArr.push(item);
            }
          });
          this.regionStr = newArr.join(",");
        }
        this.propertyStr = undefined;
      } else if (this.form.type2 == "3") {
        this.propertyStr = this.form.propertyName.join(",");
        if (this.propertyStr == undefined) {
          this.$message.warning("请选择物业公司！");
          return;
        }
        this.regionStr = undefined;
      }
      if (this.form.createTimeList == undefined) {
        // return
        this.form.createTimeList = [];
      }
      // 免费活动
      if (this.form.type3 == "2") {
        const data = {
          name: this.form.name, // 活动名称
          region_id: this.regionStr, // 活动区域(支持多选择,逗号隔开)
          company_id: this.propertyStr, // 活动开启物业区域(支持多选择,逗号隔开)
          count: this.form.number // 赠送家财豆数量
        };
        // console.log(data);
        // const loading = this.$loading({
        //   lock: true,
        //   text: "提交中...",
        //   spinner: "el-icon-loading",
        //   background: "rgba(0, 0, 0, 0.7)"
        // });
        // systemActivitySetActivity(data)
        //   .then(xhrData => {
        //     if (xhrData.code === 200) {
        //       this.$message({
        //         message: "提交成功",
        //         type: "success"
        //       });
        //       loading.close();
        //     }
        //   })
        //   .catch(() => {
        //     loading.close();
        //   });
      } else {
        const data = {
          id: this.obj.id,
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

        // 请求 提交
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.type1 == "1" || this.form.type1 == "3") {
              if (data.image == undefined || data.image == '') {
                this.$message.warning("请上传活动图片");
                return;
              }
            }
            // console.log(data);
            const loading = this.$loading({
              lock: true,
              text: "提交中...",
              spinner: "el-icon-loading",
              background: "rgba(0, 0, 0, 0.7)"
            });
            systemActivityPut(data)
              .then(xhrData => {
                // console.log(xhrData);
                if (xhrData.code === 200) {
                  this.$message({
                    message: "提交成功",
                    type: "success"
                  });
                  loading.close();
                  this.$emit("changePage", "LIST");
                }
              })
              .catch(() => {
                loading.close();
              });
          } else {
            // console.log("error submit!!");
            return false;
          }
        });
      }
    },
    // 搜索查询下拉框
    async remoteMethod(query, ret, type) {
      if (type == 1) {
      }
      this.options = [];
      if (query !== "") {
        const page = {
          pageNum: 1,
          pageSize: 99999,
          name: query
        };

        if (ret != null) {
          this.states = ret;
          this.loading = false;
          return (this.options = this.states.map(item => {
            return { value: `${item.id}`, label: `${item.name}` };
          }));
        } else {
          await systemActivityGetProperty(page).then(xhrData => {
            if (xhrData.code === 200) {
              this.states = xhrData.data;
            }
          });
        }
        this.loading = true;
        // console.log(this.states,'states');

        this.list = this.states.map(item => {
          return { value: `${item.id}`, label: `${item.name}` };
        });
        // console.log(this.list);

        setTimeout(() => {
          this.loading = false;
          this.options = this.list.filter(item => {
            return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1;
          });
          //   console.log(this.options);
        }, 200);
      } else {
        this.options = [];
      }
    },
    // 输入框限制
    limit(val) {
      console.log(val.target.value);

      if (val.target.value == 0) {
        val.target.value = "1";
      }
    },
    // 还原
    reduction(val){
      this.form= {
        type1: val,
        type2: "1",
        type3: "1",
        createTimeList: undefined,
        name: "",
        money: "",
        number: "",
        propertyName: [],
        img: "1"
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
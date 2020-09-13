<template>
  <!-- 公司信息修改 -->
  <div class="company">
    <div class="company-conter">
      <div class="company-wrap">
        <div class="company-ewm">
          <div class="company-ewm-conter"></div>
        </div>
        <div class="company-title">
          <div class="company-title-conter">
            <h1>深圳市物保宝科技有限公司</h1>
            <el-form
              :model="ruleForm"
              ref="ruleForm"
              label-width="100px"
              class="demo-ruleForm"
              label-position="left"
              id="InformationModificationForm"
            >
              <el-form-item label="所在区域">
                <el-cascader
                  class="cascader"
                  :options="options"
                  v-model="selectedOptions"
                  @change="handleChange"
                ></el-cascader>
              </el-form-item>
              <el-form-item label="详细地址">
                <el-input style="width:70%" v-model="ruleForm.address"></el-input>
              </el-form-item>
              <el-form-item label="社会信用代码">
                <el-input class="company-input" v-model="ruleForm.daima"></el-input>
              </el-form-item>
              <el-form-item label="联系人">
                <el-input class="company-input" v-model="ruleForm.contact"></el-input>
              </el-form-item>
              <el-form-item label="手机号">
                <el-input class="company-input" v-model="ruleForm.contact_on"></el-input>
              </el-form-item>
              <el-form-item class="company-input" label="联系人邮箱">
                <el-input v-model="ruleForm.contact_email"></el-input>
              </el-form-item>
              <el-form-item label="公司电话">
                <div style="width:250px">
                  <el-col :span="7">
                    <el-input :maxlength="5" v-model.number="ruleForm.area_code" autocomplete="off"></el-input>
                  </el-col>
                  <el-col class="line" style="text-align: center" :span="1">-</el-col>
                  <el-col :span="16">
                    <el-form-item style="display: inline-block;width:100%">
                      <el-input
                        :maxlength="8"
                        v-model.number="ruleForm.company_no"
                        autocomplete="off"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </div>
              </el-form-item>
              <div class="company-bottom">
                <!-- <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                <el-button @click="resetForm('ruleForm')">重置</el-button>-->
                <a href="javascript:;" class="company-btn company-modify">修改</a>
                <a href="javascript:;" class="company-btn company-return">返回</a>
              </div>
            </el-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { regionDataPlus, CodeToText } from "element-china-area-data";
export default {
  name: "InformationModification",
  data() {
    return {
      // 区域数据
      options: regionDataPlus,
      selectedOptions: [],
      ruleForm: {
        // 社会信用代码
        daima: "",
        // 详细地址
        address: "",
        // 省
        province: "",
        // 市
        city: "",
        // 区
        county: "",
        // 联系人
        contact: "",
        // 手机号
        contact_on: "",
        // 邮箱
        contact_email: "",
        // 公司电话
        // 区号
        area_code: "",
        // 固定电话
        company_no: ""
      }
    };
  },
  methods: {
    // 获取省市区信息
    // 选择公司所在省、市、区
    handleChange() {
      // 处理 省市级 数据
      this.projectForm.province = this.selectedOptions[0];
      this.projectForm.city = this.selectedOptions[1];
      this.projectForm.county = this.selectedOptions[2];
      if (this.projectForm.province !== undefined) {
        this.projectForm.province = CodeToText[this.projectForm.province];
      }
      if (this.projectForm.city !== undefined) {
        this.projectForm.city = CodeToText[this.projectForm.city];
      }
      if (this.projectForm.county !== undefined) {
        this.projectForm.county = CodeToText[this.projectForm.county];
      }
    }
  }
};
</script>
<style>
#InformationModificationForm .el-form-item__label {
  color: #6d6d6d;
}
#InformationModificationForm .company-input {
  width: 250px;
}
#InformationModificationForm .company-input .el-input {
  width: 250px;
}
#InformationModificationForm .cascader {
  width: 70%;
}
#InformationModificationForm .cascader > .el-input {
  width: 100%;
}
#InformationModificationForm a.company-btn {
  display: inline-block;
  width: 130px;
  height: 44px;
  border-radius: 4px;
  font-size: 16px;
  text-align: center;
  line-height: 44px;
}
#InformationModificationForm a.company-modify {
  background: linear-gradient(
    270deg,
    rgba(248, 184, 0, 1) 0%,
    rgba(239, 130, 0, 1) 100%
  );
  color: #fff;
}
#InformationModificationForm a.company-return {
  border: 1px solid #d9d9d9;
  color: #707070;
}
#InformationModificationForm .company-bottom {
  padding-top: 25px;
  box-sizing: border-box;
  border-top: 1px solid #d9d9d9;
}
</style>
<style lang="scss" scoped>
.company {
  width: 100%;
  padding: 15px;
  min-height: calc(88vh);
  box-sizing: border-box;
  background-color: #e6e8eb;
  padding-bottom: 30px;

  .company-conter {
    min-height: calc(88vh);
    background-color: #fff;
    padding: 25px;
    box-sizing: border-box;
    border-radius: 5px;
    .company-wrap {
      display: flex;
      .company-ewm {
        width: 15%;
        .company-ewm-conter {
          width: 96px;
          height: 96px;
          background-color: #999;
        }
      }
      .company-title {
        display: flex;
        justify-content: space-between;
        width: 85%;
        .company-title-conter {
          width: 100%;
          h1 {
            font-size: 16px;
            margin-top: 0;
            padding-bottom: 20px;
          }
        }
      }
    }
  }
}
</style>
<template>
  <!-- 伤亡互助 -->
  <div class="Property" id="mutual">
    <div class="Property-conter">
      <div class="Property-wrap">
        <h4>意向参与工亡互助人数:{{peopleNumber}}人</h4>
        <h2>物管行业工亡互助计划征集通道</h2>
        <p>物业管理行业从业人员高达一千余万人。中老年人群占比较大。心脑猝死案件不断发生，给物管企业造成重大经济损失。物保宝平台联合中国人保等多家财险机构发起物管行业工亡互助计划。</p>
        <p>工亡互助内容：每人每年100元，工亡互助金100万元/每人。互助承保方与服务方共收取10%管理费，并出具专票其余所有款项均用于行业工亡互助金的支出。</p>
        <p>该工亡互助计划覆盖人群为18 - 65岁物业从业人员，且须物业公司全员参保。现面向国内所有物业服务企业征集互助参与方。</p>
        <div class="Property-form">
          <el-form
            :rules="rules"
            ref="form"
            label-position="left"
            label-width="150px"
            :model="form"
            id="form"
          >
            <el-form-item label="参与互助意向单位:" prop="participant">
              <el-input v-model.trim="form.participant"></el-input>
            </el-form-item>
            <el-form-item label="统一社会信用代码:" prop="cerNo">
              <el-input v-model.trim="form.cerNo"></el-input>
            </el-form-item>
            <el-form-item label="互助计划人数:" prop="aidNumber">
              <el-input v-model.number.trim="form.aidNumber"></el-input>
            </el-form-item>
            <el-form-item label="联系人:" prop="contacts">
              <el-input v-model.trim="form.contacts"></el-input>
            </el-form-item>
            <el-form-item label="手机号:" prop="phoneNumber">
              <el-input :maxlength="11" v-model.trim="form.phoneNumber"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="contact-btn">
          <a href="javascript:;" @click="submit">提 交</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { intentionGetTotal , intentionAddUnit} from "@/api/information/information";
export default {
  name: "Property",
  data() {
    return {
      // 人数
      peopleNumber: "",
      form: {
        // 参与互助意向单位
        participant: "",
        // 统一社会信用代码
        cerNo: "",
        // 互助计划人数
        aidNumber: "",
        // 联系人
        contacts: "",
        // 手机号
        phoneNumber: ""
      },
      // 验证
      rules: {
        // 参与互助意向单位
        participant: [
          // required: true,
          { required: true, message: "请输入参与互助意向单位", trigger: "blur" }
        ],
        // 统一社会信用代码
        cerNo: [
          { required: true, message: "请输入统一社会信用代码", trigger: "blur" }
        ],
        // 互助计划人数
        aidNumber: [
          { required: true, message: "请输入互助计划人数", trigger: "blur" }
        ],
        // 联系人
        contacts: [{ required: true, message: "请输入联系人", trigger: "blur" }],
        // 手机号
        phoneNumber: [
          {required: true,  message: "请输入手机号", trigger: "blur" },
          {
            pattern: /^1(3|4|5|6|7|8|9)\d{9}$/,
            message: "手机号格式不对",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created(){
      // 获取总人数
      this.getTotal()
  },
  methods: {
    // 获取总人数
    getTotal() {
      intentionGetTotal().then(xhrData => {
          if(xhrData.code === 200){
            this.peopleNumber = xhrData.data.total
          }
      });
    },
    // 提交按钮
    submit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          // 请求 提交数据
          intentionAddUnit(this.form).then(xhrData => {
            if (xhrData.code === 200) {
              this.$message.success("提交成功!");
              // 清空表单
              this.$refs["form"].resetFields();
              // 更新
              this.getTotal()
            } else {
              this.$message.error("提交失败!");
            }
          });
          // 验证通过
          //   alert("submit!");
        } else {
          this.$message.warning("请完善信息!");
          return false;
        }
      });
    }
  }
};
</script>
<style>
#mutual .el-form-item{
  margin-bottom: 22px;
}
</style>
<style lang="scss" scoped>
*{
  padding: 0;
  margin: 0;
}
.Property {
  width: 100%;
  min-height: calc(88vh);
  padding: 15px;
  box-sizing: border-box;
  background-color: #e6e8eb;
  .Property-conter {
    background-color: #fff;
    height: 100%;
    padding: 25px;
    box-sizing: border-box;
    border-radius: 5px;
    min-height: calc(88vh);
    display: flex;
    justify-content: center;
    .Property-wrap {
      width: 1100px;
      color: #444;
      h4 {
        text-align: right;
      }
      h2 {
        text-align: center;
        padding: 30px 0;
        box-sizing: border-box;
      }
      p {
        padding: 0;
        margin: 0;
        font-size: 16px;
        line-height: 35px;
        letter-spacing: 1px;
      }
      .Property-form {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        margin-top: 50px;
        #form {
          width: 500px;
        }
      }
      .contact-btn {
        display: flex;
        justify-content: center;
        a {
          width: 200px;
          height: 44px;
          line-height: 44px;
          color: #fff;
          font-size: 18px;
          font-weight: bold;
          display: inline-block;
          text-align: center;
          background: linear-gradient(
            270deg,
            rgba(248, 184, 0, 1) 0%,
            rgba(239, 130, 0, 1) 100%
          );
          border-radius: 4px;
        }
      }
    }
  }
}
</style>
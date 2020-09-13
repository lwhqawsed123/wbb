<template>
  <!-- 配置律师函收费标准 -->
  <div class="publicStyle">
    <div class="publicStyle-conter">
      <div class="charge-form">
        <div class="charge-form-title">配置律师函收费标准</div>
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
          label-position="right"
          width="300px"
        >
          <el-form-item label="在线" prop="online.productCharge">
            <el-input
              style="width:160px;height:24px"
              v-model.number="ruleForm.online.productCharge"
            ></el-input>
            <span>元/户</span>
          </el-form-item>
          <el-form-item label="快递到物业" prop="expressToProperty.productCharge">
            <el-input
              style="width:160px;height:24px"
              v-model.number="ruleForm.expressToProperty.productCharge"
            ></el-input>
            <span>元/户</span>
          </el-form-item>
          <el-form-item label="快递到业主" prop="expressToOwner.productCharge">
            <el-input
              style="width:160px;height:24px"
              v-model.number="ruleForm.expressToOwner.productCharge"
            ></el-input>
            <span>元/户</span>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
            <!-- <el-button @click="resetForm('ruleForm')">重置</el-button> -->
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import "../../../../assets/styles/publicStyle.css";
import { chargeList, chargeAdd, chargeEdit } from "@/api/legal/charge";
export default {
  name: "examine",
  data() {
    return {
      ruleForm: {
        online: { productId: 1, productName: "在线", productCharge: "" },
        expressToProperty: {
          productId: 2,
          productName: "快递到物业",
          productCharge: ""
        },
        expressToOwner: {
          productId: 3,
          productName: "快递到业主",
          productCharge: ""
        }
      },
      chargeList: [],
      rules: {
        "online.productCharge": [
          { required: true, message: "不能为空", trigger: "blur" },
          { type: "number", message: "必须为数字值", trigger: "blur" }
        ],
        "expressToProperty.productCharge": [
          { required: true, message: "不能为空", trigger: "blur" },
          { type: "number", message: "必须为数字值", trigger: "blur" }
        ],
        "expressToOwner.productCharge": [
          { required: true, message: "不能为空", trigger: "blur" },
          { type: "number", message: "必须为数字值", trigger: "blur" }
        ]
      },
      isEmpty: false, // 判断是否从未创建价格
      Loading:''
    };
  },
  mounted() {
    this.getChargeList();
  },
  methods: {
    // 获取收费配置
    getChargeList() {
      chargeList().then(res => {
        console.log(res);

        if (res.code === 200) {
          if (res.rows.length === 0) {
            this.isEmpty = true;
          }
          this.chargeList = res.rows;
          res.rows.forEach(item => {
            if (item.productId === 1) {
              this.ruleForm.online.productCharge = item.productCharge;
              // this.ruleForm.online.productId = item.productId;
            } else if (item.productId === 2) {
              this.ruleForm.expressToProperty.productCharge =
                item.productCharge;
              // this.ruleForm.expressToProperty.productId = item.productId;
            } else if (item.productId === 3) {
              this.ruleForm.expressToOwner.productCharge = item.productCharge;
              // this.ruleForm.expressToOwner.productId = item.productId;
            }
          });
        }
      });
    },
    submitForm() {
      // 表单验证
      this.$refs.ruleForm.validate(valid => {
        // 通过验证
        if (valid) {
          // 循环创建
          let ruleForm = JSON.parse(JSON.stringify(this.ruleForm));
          this.Loading = this.$loading({
            lock: true,
            text: "Loading",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)"
          });
          let ruleList=[]
          ruleList.push(ruleForm.online)
          ruleList.push(ruleForm.expressToProperty)
          ruleList.push(ruleForm.expressToOwner)
          ruleList.forEach((item, index) => {
            let data = {
              id: item.productId,
              data: {
                productId:item.productId,
                productName: item.productName,
                productCharge: item.productCharge
              }
            };
            chargeEdit(data)
              .then(res => {
                if (index === ruleList.length - 1) {
                  this.Loading.close()
                  if (res.code === 200) {
                    this.$message.success({
                      message: "变更成功!"
                    });
                    // 更新列表
                    this.getChargeList();
                  } else{
                    this.Loading.close()
                    this.$message.error({
                      message: res.msg
                    });
                    // 关闭对话框
                  }
                }
              })
              .catch(() => {
                // 关闭对话框
                this.Loading.close()
                // this.dialogFormVisible = false;
              });
          });
        } else {
          this.$message.warning({
            message: "请完善信息~!"
          });
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.charge-form {
  width: 300px;
  margin-left: 30px;
  padding-top: 20px;
  .charge-form-title {
    color: #46a6ff;
    margin: 5px 0;
  }
}
</style>
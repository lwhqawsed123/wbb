<template>
  <!-- 个人法律服务信息维护 -->
  <div class="publicStyle">
    <div class="publicStyle-conter">
      <div class="structure-form">
        <el-form ref="form" :model="form" label-width="100px" label-position="left">
          <el-form-item label="服务内容:" prop="content">
            <el-input
              placeholder="请输入内容"
              type="textarea"
              :rows="20"
              maxlength="10000"
              show-word-limit
              v-model="form.content"
            ></el-input>
          </el-form-item>
          <el-form-item label="服务年费:" prop="cost" placeholder="请输入">
            <el-row>
              <el-col :span="10">
                <el-input v-model="form.cost"></el-input>
              </el-col>
              <el-col :span="1" :offset="1">
                <span>元</span>
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
      </div>
      <div class="structure-btn">
        <div class="structure-btn-wrap">
          <el-button @click="submission">确定</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../../../../assets/styles/publicStyle.css";
export default {
  name: "law",
  data() {
    return {
      // 表单
      form: {
        // 服务内容
        content: "",
        //  服务年费
        cost: ""
      }
    };
  },
  methods: {
    // 提交按钮
    submission() {
      // console.log(this.form);
    }
  }
};
</script>

<style lang="scss" scoped>
.structure-form {
  padding: 30px;
  width: 50%;
}
.structure-btn {
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  padding-top: 30px;
  border-top: 1px solid #ddd;
  .structure-btn-wrap {
    padding: 0px 20px;
  }
}
</style>
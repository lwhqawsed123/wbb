<template>
  <!-- 灵活用工 -->
  <div class="Property" id="introduce">
    <div class="Property-conter">
      <div class="Property-conter-wrap">
        <!-- 灵活用工产品介绍 -->
        <div class="introduce">
          <img src="../../assets/image/linghuo.png" alt="">
        </div>
        <!-- 联系我们 -->
        <div class="contact">
          <h3>如您有兴趣,请联系我们:</h3>
          <p>
            <span>联系人:</span>
            <span>xxx</span>
          </p>
          <p>
            <span>联系电话:</span>
            <span>xxx</span>
          </p>
          <h3>或请留下您的联系方式,我们会有专人联系您:</h3>
          <el-form
            ref="form"
            :rules="rules"
            label-position="left"
            label-width="120px"
            :model="form"
          >
            <el-form-item label="联系人:" prop="name">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="联系电话:" prop="phone">
              <el-input :maxlength="11" v-model="form.phone"></el-input>
            </el-form-item>
          </el-form>
          <div class="contact-btn">
            <a href="javascript:;" @click="submit">提 交</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  systemToolAdd
} from "@/api/information/information";
export default {
  name: "Property",
  data() {
    return {
      form: {
        // 联系人
        name: "",
        // 电话
        phone: ""
      },
      // 验证
      rules: {
        name: [{ required: true, message: "请输入联系人", trigger: "blur" }],
        phone: [
          { required: true, message: "请输入联系人电话", trigger: "blur" },
          {
            pattern: /^1(3|4|5|6|7|8|9)\d{9}$/,
            message: "手机号格式不对",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    // 提交
    submit() {
      // console.log(this.form);
      this.$refs['form'].validate(valid => {
        if (valid) {
          // alert("submit!");
          const data={
            contactName:this.form.name,
            contactPhone:this.form.phone,
            type:'1'
          }
          // 调用新增灵活用工
          systemToolAdd(data).then(xhrData=>{
            // console.log(xhrData);
            if(xhrData.code === 200){
               this.$message.success('提交成功!');
               //清空表单
               this.$refs['form'].resetFields()
            }else{
              this.$message.error('提交失败');
            }
          })
        } else {
          // console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>
<style>
/* .el-form-item */
#introduce .el-form-item {
  padding-left: 100px;
  box-sizing: border-box;
}
#introduce .el-input--medium {
  width: 60%;
}
#introduce .el-form-item{
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
    .Property-conter-wrap {
      width: 50%;
      .introduce {
        width: 100%;
        height: auto;
        img{
          width: 100%;
          height: auto;
        }
      }
      .contact {
        h3 {
          color: #444;
          margin-top: 30px;
          padding-bottom: 20px;
          box-sizing: border-box;
        }
        p {
          color: #444;
          margin-top: 30px;
          // margin-left: 100px;
          padding-left: 100px;
          box-sizing: border-box;
          span:nth-child(1) {
            width: 120px;
            display: inline-block;
          }
        }
        .contact-btn {
          display: flex;
          justify-content: center;
          a {
            width: 50%;
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
}
</style>
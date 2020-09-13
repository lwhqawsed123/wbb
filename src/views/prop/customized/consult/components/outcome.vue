<template>
  <!-- 定制询价结果页 -->
  <div class="components-box">
    <p style="color:red">说明：48小时内受理定制方案报价（节假日除外），每家公司只允许申请两次</p>
    <el-form ref="form" :rules="rules" :model="form" label-width="100px" label-position="left">
      <el-form-item prop="company" label="保险公司：">
        <el-select style="width:300px" v-model="form.company" placeholder="请选择">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
        <a href="javascript:;" style="color:#0179FE;font-size:14px;margin-left:30px;">条款详情</a>
      </el-form-item>
      <h4>保障内容列表</h4>
      <el-table
        id="inquiry-table"
        :data="tableData"
        border
        :span-method="objectSpanMethod"
        style="width: 100%"
      >
        <el-table-column type="index" label="序号" width="80"></el-table-column>
        <el-table-column
          align="center"
          show-overflow-tooltip
          prop="name"
          label="保障内容"
          min-width="30%"
        ></el-table-column>
        <el-table-column align="center" prop="name1" label="保障金额(方案一)" min-width="35%">
          <template slot-scope="scope" style="display:flex;">
            <el-form-item v-if="!scope.row.type" style="margin-left:-100px">
              <el-input
                ref="input"
                oninput="value=value.replace(/[^\d]/g,'')"
                v-model.number.trim="scope.row.amount1"
                style="width:90%"
              ></el-input>
              <span style="width:8%">元</span>
            </el-form-item>
            <div class="cell el-tooltip" v-else-if="scope.row.type">{{scope.row.title}}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="name2" label="保障金额(方案二)" min-width="35%">
          <template slot-scope="scope" style="display:flex;">
            <el-form-item style="margin-left:-100px" v-if="!scope.row.type">
              <el-input
                ref="input"
                oninput="value=value.replace(/[^\d]/g,'')"
                v-model.number.trim="scope.row.amount2"
                style="width:90%"
              ></el-input>
              <span style="width:8%">元</span>
            </el-form-item>
            <div class="cell el-tooltip" v-else-if="scope.row.type">{{scope.row.title}}</div>
          </template>
        </el-table-column>
      </el-table>
      <el-checkbox-group @change="getCheckbox1" class="inquiry-box" v-model="form.type1">
        <el-checkbox label="1">扩展24小时（死亡伤残10万意外医疗1万）</el-checkbox>
      </el-checkbox-group>
      <el-checkbox-group class="inquiry-box" v-model="form.type2">
        <el-checkbox label="2">伤残赔付特约（伤残赔付比例按等比赔付）</el-checkbox>
      </el-checkbox-group>
      <div style="margin-top:30px">
        <el-form-item prop="number" label="参保人数：">
          <el-input
            oninput="value=value.replace(/[^\d]/g,'')"
            style="width:250px"
            v-model.number.trim="form.number"
          ></el-input>
          <span style="margin-left:10px">人</span>
        </el-form-item>
        <el-form-item prop="apply" label="申请人：">
          <el-input style="width:250px" v-model.trim="form.apply"></el-input>
        </el-form-item>
        <el-form-item prop="phone" label="申请人电话：">
          <el-input maxlength="11" style="width:250px" v-model.trim="form.phone"></el-input>
        </el-form-item>
        <el-form-item label="方案一报价：">
          <el-input disabled style="width:250px" v-model.trim="form.offer1"></el-input>
          <span style="margin-left:10px">元/年</span>
        </el-form-item>
        <el-form-item label="方案二报价：">
          <el-input disabled style="width:250px" v-model.trim="form.offer2"></el-input>
          <span style="margin-left:10px">元/年</span>
        </el-form-item>
      </div>
    </el-form>
    <div class="apply-page-bot">
      <a class="apply-page-btn" href="javascript:;" @click="submission">提交申请</a>
    </div>
  </div>
</template>

<script>
export default {
  name: "consult-inquiry",
  data() {
    return {
      form: {
        // 保险公司
        company: "",
        type1: ["1"],
        type2: ["2"],
        number: "",
        apply: "",
        phone: "",
        code: ""
      },
      tableData: [
        {
          name: "死亡伤残（退休年龄保额50万）",
          type: false
        },
        {
          name: "意外医疗",
          type: false
        },
        {
          name: "住院补贴",
          type: true,
          title: "100元/天，最多60天"
        },
        {
          name: "误工费",
          type: true,
          title: "100元/天，免赔5天，最多180天"
        }
      ],
      // 表单验证
      rules: {
        company: [
          { required: true, message: "请选择保险公司", trigger: "change" }
        ],
        number: [
          { required: true, message: "请输入承保人数", trigger: "blur" }
        ],
        apply: [{ required: true, message: "请输入申请人", trigger: "blur" }],
        code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
        // 手机号
        phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
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
    // 提交申请
    submission() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          const arr = [];
          this.tableData.forEach((item, index) => {
            if (item.amount1 != undefined && item.amount1 != "") {
              arr.push(item.amount1);
            }
            if (item.amount2 != undefined && item.amount2 != "") {
              arr.push(item.amount2);
            }
          });
          if (arr.length < 4) {
            this.$message({
              message: "保障金额必须输入完整！",
              type: "warning"
            });
            return;
          }
          console.log(this.form);

          //   console.log(arr);
          //   const objData = {

          //   };
          //   // 返回objData
          //   this.objFun(objData, this.form);
          //   console.log(objData);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    getCheckbox1(val) {
      console.log(val);
    },

    // 表格控制
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      // 设置要合并的行和要合并的列
      if (
        (rowIndex === 2 && columnIndex === 2) ||
        (rowIndex === 3 && columnIndex === 2)
      ) {
        // 分别代表合并的行数和列数
        return [1, 2];
      }
    },
    // 按需赋值给另一个对象
    objFun(objA, objB) {
      Object.keys(objA).forEach(key => {
        objA[key] = objB[key] || objA[key];
      });
      return objA;
      // console.log(objA);
    }
  }
};
</script>
<style lang="scss" scoped>
#inquiry-table .el-table td,
.el-table th {
  text-align: center !important;
}
#inquiry-table .el-form-item__error {
  left: 25px;
}
.components-box {
  padding: 20px;
  box-sizing: border-box;
  p {
    font-size: 14px;
    color: #666;
    padding-bottom: 40px;
    box-sizing: border-box;
  }
  h4 {
    color: #666;
    padding-bottom: 40px;
    padding-top: 20px;
  }
  .inquiry-box {
    padding-top: 20px;
    box-sizing: border-box;
  }
  .components-box-btn {
    display: inline-block;
    padding: 0 5px;
    border-radius: 4px;
    border: 1px solid #f59a23;
    height: 36px;
    line-height: 36px;
    font-size: 12px;
    background-color: #f59a23;
    color: #fff;
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
}
</style>
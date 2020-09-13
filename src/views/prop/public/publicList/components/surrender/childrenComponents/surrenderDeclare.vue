<template>
  <div class="surrenderDeclare">
    <p>说明：请仔细核对信息后提交申请， 此操作将永久退保</p>
    <el-form
      :rules="rules"
      class="surrenderDeclare-form"
      ref="form"
      :model="form"
      label-width="120px"
    >
      <el-form-item prop="projectName" label="项目名称：">
        <el-select @change="select" value-key="id" v-model="form.projectName" placeholder="请选择项目名称">
          <el-option
            v-for="item in optionData"
            :key="item.id"
            :label="item.projectName"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="项目类型：">
        <el-input disabled v-model="form.type"></el-input>
      </el-form-item>
      <el-form-item label="项目地址：">
        <el-input disabled v-model="form.address"></el-input>
      </el-form-item>
      <el-form-item label="占地面积：">
        <el-input disabled v-model="form.areaSize"></el-input>
      </el-form-item>
      <el-form-item label="投保份数：">
        <el-input disabled v-model="form.insureNum"></el-input>
      </el-form-item>
      <el-form-item label="是否有游泳池：">
        <el-input disabled v-model="form.swimmingPool"></el-input>
      </el-form-item>
      <el-form-item prop="startTime" label="退保期限:">
        <div style="display:flex">
          <el-date-picker
            style="width:45%"
            v-model="form.startTime"
            type="date"
            placeholder="选择日期"
            :picker-options="expireTimeOption"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
          <span style="width:10%;text-align: center;">至</span>
          <el-input style="width:45%" disabled v-model="form.endTime"></el-input>
        </div>
      </el-form-item>
    </el-form>
    <div class="apply-page-bot">
      <a class="apply-page-btn" href="javascript:;" @click="next">下一步</a>
      <a class="apply-page-btn apply-page-btn-default" href="javascript:;" @click="goBack">取消</a>
    </div>
  </div>
</template>

<script>
import { insPubGetAllowReturn ,getPropCompany} from "@/api/information/information";
export default {
  name: "surrenderDeclare",
  props: ["obj"],
  data() {
    return {
      form: {
        projectName: "",
        startTime: ""
      },
      rules: {
        projectName: [
          { required: true, message: "请选择项目", trigger: "change" }
        ],
        startTime: [
          { required: true, message: "请选择日期", trigger: "change" }
        ]
      },
      optionData: [],
      expireTimeOption: this.disabledDate(),
      time1: "",
      time2: "",
      // 选中项目id
      projectNameId: "",
      // 当前项目之前时间
      beforeTime:'',
      // 保存选中项目名称
      projectName:'',
      name:'',
      id:''
    };
  },
  created() {
    // console.log(this.obj.id, "idididi");
    this.getDetailList();
    this.getProt()
  },
  methods: {
    // 根据id查询当前项目信息

    getDetailList() {
      const data = {
        applyId: this.obj.id
      };
      insPubGetAllowReturn(data).then(xhrData => {
        // console.log(xhrData, "当前项目信息");
        if (xhrData.code === 200) {
          this.optionData = xhrData.rows;
          this.optionData.forEach(item => {
            if (item.type == "0") {
              item.type = "居住类型";
            } else if (item.type == "1") {
              item.type = "非居住类型";
            }
            if (item.swimmingPool == "0") {
              item.swimmingPool = "有";
            } else if (item.swimmingPool == "1") {
              item.swimmingPool = "无";
            }
            item.endTime = item.endTime.split(" ")[0];
          });
        }
      });
    },
    // 选择项目
    select(val) {
      // console.log(val);
      this.form.type = val.type;
      this.form.address = val.address;
      this.form.areaSize = val.areaSize;
      this.form.insureNum = val.insureNum;
      this.form.swimmingPool = val.swimmingPool;
      this.form.endTime = val.endTime;
      this.projectId = val.projectId;
      this.id = val.id;
      this.projectNameId = val.projectId;
      this.projectName = val.projectName
      this.beforeTime = val.startTime.split(" ")[0]
      val.startTime = val.startTime.split(" ")[0];
      this.time1 = new Date(val.startTime).getTime();
      this.time2 = new Date(val.endTime).getTime();
    },
    // 规则时间控件在第一次选择之后时间段内选择
    disabledDate() {
      let _this = this;
      return {
        disabledDate(date) {
          let curDate = new Date().getTime();
          let three = 12 * 31 * 24 * 3600 * 1000;
          let threeMonths = curDate + three;
          return (
            // date.getTime() < _this.time - 8.64e7 || date.getTime() > threeMonths
            date.getTime() < _this.time1 - 8.64e7 ||
            date.getTime() > _this.time2
          );
        }
      };
    },
    // 获取物业公司信息
    getProt(){
        getPropCompany().then(xhrData=>{
            // console.log(xhrData,'w物业公司信息');
            if(xhrData.code === 200){
                this.name = xhrData.data.name
            }
        })
    },
    // 下一步
    next() {
      // console.log(this.projectNameId,this.form.startTime);
      this.obj.form = {
        projectNameId: this.projectNameId,
        startTime: this.form.startTime,
        beforeTime:this.beforeTime ,
        projectName:this.projectName,
        name:this.name,
        id:this.id
      };
      // console.log(this.obj);
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$emit("changePage2", "UPLOAD", this.obj);
        } else {
          this.$message({
            message: "请完善信息!",
            type: "warning"
          });
          return false;
        }
      });
    },
    // 取消
    goBack() {
      this.$emit("changePage2", "LIST",);
    }
  }
};
</script>
<style>
.el-select {
  width: 100%;
}
</style>
<style lang='scss' scoped>
.surrenderDeclare {
  padding: 30px;
  box-sizing: border-box;
  p {
    padding: 10px 0;
    padding-bottom: 20px;
    box-sizing: border-box;
    font-size: 14px;
    color: #666;
  }
  .surrenderDeclare-form {
    width: 40%;
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
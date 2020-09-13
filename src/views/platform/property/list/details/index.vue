<template>
  <div class="publicStyle">
    <!-- 物业公司列表 -》 公司详情 -->
    <div class="publicStyle-conter">
      <div class="publicStyle-conter-wrap">
        <h4>公司基本信息</h4>
        <el-form
          ref="form"
          class="demo-ruleForm detailsForm"
          :model="form"
          label-width="120px"
          label-position="left"
        >
          <el-form-item label="公司二维码:" style="width:100%">
            <!-- <el-input v-model="form.name" :disabled="true"></el-input> -->
            <!-- <span>{{form.name}}</span> -->
          </el-form-item>
          <el-form-item label="公司名称:" style="width:100%">
            <!-- <el-input v-model="form.name" :disabled="true"></el-input> -->
            <span>{{form.name}}</span>
          </el-form-item>
          <el-form-item label="所在区域:" style="width:100%">
            <el-input v-model="form.quyu" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="详细地址:" style="width:100%">
            <el-input v-model="form.address" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="社会信用代码:" style="width:100%">
            <el-input v-model="form.certNo" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="发票抬头:" style="width:100%">
            <el-input v-model="form.invoiceTitle" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="联系人:" style="width:100%">
            <el-input v-model="form.contact" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="手机号:" style="width:100%">
            <el-input v-model="form.contact_no" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="联系人邮箱:" style="width:100%">
            <el-input v-model="form.contact_email" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="公司电话:" style="width:100%">
            <el-input v-model="form.dianhua" :disabled="true"></el-input>
          </el-form-item>
        </el-form>
        <h4>所属项目</h4>
        <!-- 列表 -->
        <div class="detailsTableData">
          <el-table class :data="tableData" style="width: 100%">
            <el-table-column type="index" label="序号" width="80"></el-table-column>
            <el-table-column show-overflow-tooltip prop="name" label="项目名称" min-width="200px"></el-table-column>
            <el-table-column show-overflow-tooltip prop="invoiceTitle" label="开票抬头" min-width="200px"></el-table-column>
            <el-table-column show-overflow-tooltip prop="buildingNum" label="小区总户数" min-width="200px"></el-table-column>
            <el-table-column show-overflow-tooltip prop="resident_no" label="门栋总数" min-width="200px"></el-table-column>
            <el-table-column show-overflow-tooltip prop="park_no" label="车位数" min-width="200px"></el-table-column>
            <el-table-column show-overflow-tooltip prop="address" label="详细地址" min-width="200px"></el-table-column>
            <el-table-column show-overflow-tooltip prop="project_manager" label="联系人" min-width="200px"></el-table-column>
            <el-table-column show-overflow-tooltip prop="telphone_no" label="联系人手机号" min-width="200px"></el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../../../../../assets/styles/publicStyle.css";
// 请求
import {
  propCompanyInfo,
  propProjectGetListByCompanyId
} from "@/api/information/information";
export default {
  name: "",
  data() {
    return {
      // 表单信息
      form: {},
      // 列表数据
      tableData: []
    };
  },
  created() {
    this.getDetailsData();
    this.getProjeData();
  },
  methods: {
    // 请求公司详情
    getDetailsData() {
      // 请求
      propCompanyInfo(this.$route.query.id).then(xhrData => {
        // console.log(xhrData);
        if (xhrData.code === 200) {
          this.form = xhrData.data;
          this.form.quyu =
            this.form.province + this.form.city + this.form.county;
          this.form.dianhua = this.form.area_code + "-" + this.form.company_no;
        }
      });
    },
    // 请求项目信息
    getProjeData() {
      propProjectGetListByCompanyId(this.$route.query.id).then(xhrData => {
        // console.log(xhrData);
        if (xhrData.code === 200) {
          this.tableData = xhrData.data;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.publicStyle-conter-wrap {
  padding: 20px;
  h4 {
    padding-bottom: 20px;
  }
  .detailsForm {
    width: 35%;
    padding: 30px 60px;
    padding-bottom: 20px;
    box-sizing: border-box;
  }
  .detailsTableData {
    padding: 0 60px;
    box-sizing: border-box;
  }
}
</style>
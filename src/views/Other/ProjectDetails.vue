<template>
  <!-- 项目详细信息 -->
  <div class="company">
    <div class="company-conter">
      <div class="company-wrap">
        <div class="company-ewm">
          <div class="company-ewm-conter"></div>
        </div>
        <div class="company-title">
          <div class="company-title-conter">
            <p>
              <span>项目名称</span>
              <span>{{companyData.name}}</span>
            </p>
            <p>
              <span>所在区域</span>
              <span>{{quyu}}</span>
            </p>
            <p>
              <span>项目地址</span>
              <span>{{companyData.address}}</span>
            </p>
            <p>
              <span>发票抬头</span>
              <span>{{companyData.taitou}}</span>
            </p>
            <p>
              <span>是否在管</span>
              <span>{{companyData.is_manage}}</span>
            </p>
            <p>
              <span>小区总户数</span>
              <span>{{companyData.total}}</span>
            </p>
            <p>
              <span>门栋总数</span>
              <span>{{companyData.resident_no}}</span>
            </p>
            <p>
              <span>常停车辆数</span>
              <span>{{companyData.park_no}}</span>
            </p>
            <p>
              <span>项目经理</span>
              <span>{{companyData.project_manager}}</span>
            </p>
            <p>
              <span>联系电话</span>
              <span>{{companyData.telphone_no}}</span>
            </p>
          </div>
          <!-- <a href="javascript:;" class="company-title-xiugai" @click="toInformationModification">修改</a> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getProjectInformation } from "@/api/information/information";
export default {
  name: "company",
  data() {
    return {
      // 所在区域
      quyu: "",
      companyData: {
        // 项目名
        name: "",
        // 区域
        // 省
        province: "",
        // 市
        city: "",
        // 区
        county: "",
        // 项目地址
        address: "",
        // 发票抬头
        taitou: "暂无",
        // 是否在管
        is_manage: "",
        // 小区总户数
        total: "暂无",
        // 门栋总数
        resident_no: "",
        // 常停车辆数
        park_no: "",
        // 项目经理
        project_manager: "",
        // 联系电话
        telphone_no: ""
      }
    };
  },
  created() {
    // 获取当前项目详细信息
    getProjectInformation(this.$route.params.id).then(xhrData => {
      if (xhrData.code === 200) {
        if (xhrData.data.is_manage == 1) {
          xhrData.data.is_manage = "是";
        } else if (xhrData.data.is_manage == 0) {
          xhrData.data.is_manage = "否";
        }
        this.companyData = xhrData.data;
        this.quyu =
          xhrData.data.province + xhrData.data.city + xhrData.data.county;
      }
    });
  },
  methods: {
    // 跳转到修改页面
    toInformationModification() {
      this.$router.push("/InformationModification");
    }
  }
};
</script>

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
          h1 {
            font-size: 16px;
            margin-top: 0;
          }
          p {
            font-size: 14px;
            // color: #686868;
            color: #666;
            display: flex;
            margin-top: 20px;
            span:nth-child(1) {
              display: block;
              min-width: 140px;
            }
          }
        }
        .company-title-xiugai {
          font-size: 16px;
          height: 30px;
          color: #1890ff;
        }
      }
    }
  }
}
</style>
<template>
  <!-- 雇主电子凭证 -->
  <div class="voucher" id="voucher">
    <div class="voucher-main">
      <div class="voucher-img">
        <p class="voucher-serial">{{voucherData.orderNo}}</p>
        <p class="voucher-address">{{voucherData.name}}</p>
        <p class="voucher-policy">{{voucherData.insCompName}}</p>
        <p class="voucher-policyNo">{{voucherData.policyNo}}</p>
        <p class="voucher-effect">{{voucherData.startAndEndTime}}</p>
        <img v-if="isImg1" src="../assets/image/GZDZ_50_2.png" alt />
        <img v-if="isImg2" src="../assets/image/GZDZ_50_4.png" alt />
        <img v-if="isImg3" src="../assets/image/GZDZ_70_2.png" alt />
        <img v-if="isImg4" src="../assets/image/GZDZ_70_4.png" alt />
        <!-- <img v-if="isImg1" src="../assets/image/family1.jpg" alt />
        <img v-if="isImg2" src="../assets/image/family2.jpg" alt />
        <img v-if="isImg3" src="../assets/image/family3.jpg" alt />
        <img v-if="isImg4" src="../assets/image/family3.jpg" alt />-->
      </div>
      <div class="voucher-a">
        <!-- <a href="javascript:;" v-if="isShow"  v-print="'#print'">打印</a> -->
        <a href="javascript:;" v-if="isShow" @click="pritn">打印</a>
      </div>
    </div>
  </div>
</template>
<script>
import { insEmpApplyManageGetCertInfo } from "@/api/information/information";
export default {
  name: "voucher",
  data() {
    return {
      // 凭证数据
      voucherData: {},
      // 是否显示
      isShow: true,
      // 图片1
      isImg1: false,
      // 图片2
      isImg2: false,
      // 图片3
      isImg3: false,
      // 图片4
      isImg4: false
    };
  },
  created() {
    // console.log(this.$route.query.id);

    this.getCard(this.$route.query.id);
  },
  methods: {
    // 查看电子凭证
    getCard(id) {
      insEmpApplyManageGetCertInfo(id).then(xhrData => {
        if (xhrData.code === 200) {
          let data = xhrData.data;
          this.voucherData = data;
          // 70-2
          if (data.planCode == "PLAN_ONE") {
            this.isImg3 = true;
          }
          // 70-4
          else if (data.planCode == "PLAN_TWO") {
            this.isImg4 = true;
          }
          // 50-2 1
          else if (data.planCode == "PLAN_THREE") {
            this.isImg1 = true;
          }
          // 50-4
          else if (data.planCode == "PLAN_FOUR") {
            this.isImg2 = true;
          }
        }
      });
    },
    pritn() {
      this.isShow = false;
      const _this = this;
      this.$nextTick(() => {
        window.print();
        _this.isShow = true;
      });
    }
  }
};
</script>
<style lang="scss" scoped>
* {
  padding: 0;
  margin: 0;
}
body {
  margin: 0;
}
#voucher {
  // display: flex;
  // justify-content: center;
  // padding-top: 50px;
  // background-color: rgb(243, 243, 243);
  // width: 100%;
  // height: 100%;
  width: 1000px;
  // overflow: hidden;
  .voucher-main {
    .voucher-img {
      position: relative;
      img {
        display: block;
        width: 100%;
      }
      p {
        position: absolute;
        color: #555;
        font-weight: bold;
        font-size: 12px;
      }
      p.voucher-serial {
        left: 112px;
        top: 69px;
      }
      p.voucher-address {
        left: 86px;
        top: 83px;
      }
      p.voucher-policy {
        left: 85px;
        top: 98px;
      }
      p.voucher-policyNo {
        left: 86px;
        top: 112px;
      }
      p.voucher-effect {
        left: 104px;
        top: 126px;
      }
    }
    .voucher-a {
      margin-top: 50px;
      text-align: center;
      a {
        display: inline-block;
        text-align: center;
        width: 50px;
        height: 50px;
        line-height: 50px;
        border-radius: 50%;
        border: 1px solid #333;
        background-color: #ddd;
        color: #333;
        font-weight: bold;
      }
    }
  }
}
</style>
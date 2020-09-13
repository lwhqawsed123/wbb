<template>
  <div class="voucher" id="voucher">
    <div class="voucher-main">
      <div class="voucher-img">
        <p class="voucher-serial">{{voucherData.credentialId}}</p>
        <p class="voucher-address">{{voucherData.houseAddress}}{{voucherData.houseNumber}}</p>
        <p class="voucher-policy">{{voucherData.insuranceNo}}</p>
        <p class="voucher-effect">{{voucherData.startDate}} 至 {{voucherData.endDate}}</p>
        <img v-if="isImg1" src="../assets/image/JCBZ1.png" alt />
        <img v-if="isImg2" src="../assets/image/JCBZ2.png" alt />
        <img v-if="isImg3" src="../assets/image/JCBZ3.png" alt />
        <img v-if="isImg4" src="../assets/image/JCBZ4.png" alt />
        <!-- <img v-if="isImg1" src="../assets/image/family1.jpg" alt />
        <img v-if="isImg2" src="../assets/image/family2.jpg" alt />
        <img v-if="isImg3" src="../assets/image/family3.jpg" alt />
        <img v-if="isImg4" src="../assets/image/family3.jpg" alt /> -->
      </div>
      <div class="voucher-a">
        <!-- <a href="javascript:;" v-if="isShow"  v-print="'#print'">打印</a> -->
        <a href="javascript:;" v-if="isShow" @click="pritn">打印</a>
      </div>
    </div>
  </div>
</template>
<script>
// queryHouseInsureCard
import { queryHouseInsureCard } from "@/api/information/information";
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
    this.getCard(this.$route.query.id);
    if (this.$route.query.type == "5.0万") {
      this.isImg1 = true;
    } else if (this.$route.query.type == "6.0万") {
      this.isImg2 = true;
    } else if (this.$route.query.type == "11.0万") {
      this.isImg3 = true;
    } else if (this.$route.query.type == "20.0万") {
      this.isImg4 = true;
    }
  },
  methods: {
    // 查看电子凭证
    getCard(credentialId) {
      const data = {
        credentialId
      };
      queryHouseInsureCard(data).then(xhrData => {
        // console.log(xhrData);
        if (xhrData.code === 200) {
          this.voucherData = xhrData.data;
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
        left: 115px;
        top: 62px;
      }
      p.voucher-address {
        left: 95px;
        top: 76px;
      }
      p.voucher-policy {
        left: 87px;
        top: 90px;
      }
      p.voucher-effect {
        left: 105px;
        top: 102px;
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
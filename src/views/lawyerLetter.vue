<template>
  <div class="voucher" id="voucher">
    <div class="voucher-main">
      <div class="voucher-img">
        <p class="voucher-name">律师函</p>
        <!-- <p class="voucher-name">{{voucherData.pName}}</p> -->
        <!-- <p class="voucher-user">{{voucherData.username}}</p>
        <p class="voucher-Property">{{voucherData.companyName}}</p>
        <p class="voucher-order">{{voucherData.orderId}}</p>
        <p class="voucher-time">{{voucherData.createTime}}</p>
        <p class="voucher-state">{{voucherData.payStatus}}</p>
        <p class="voucher-project">{{voucherData.pName}}</p>
        <p class="voucher-money">{{voucherData.amount}}</p>
        <p class="voucher-large">{{voucherData.capitalAmount}}</p>
        <p class="voucher-small">{{voucherData.lowercaseAmount}}</p>
        <p class="voucher-No">{{voucherData.orderId}}</p>
        <img src="../assets/image/pingzheng.jpg" alt /> -->
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
import { queryFillingRecordDetail } from "@/api/information/information";
export default {
  name: "voucher",
  data() {
    return {
      // 凭证数据
      voucherData: {},
      // 是否显示
      isShow: true
    };
  },
  created() {
    this.getCard(this.$route.query.id);
  },
  methods: {
    // 查看电子凭证
    getCard(id) {
      const data = {
        id
      };
      queryFillingRecordDetail(data).then(xhrData => {
        // console.log(xhrData);
        if (xhrData.code === 200) {
          // 支付状态(1充值成功 2未支付 3审核中)
          this.voucherData = xhrData.data;
          if (this.voucherData.payStatus == "1") {
            this.voucherData.payStatus = "充值成功";
          } else if (this.voucherData.payStatus == "2") {
            this.voucherData.payStatus = "未支付";
          } else if (this.voucherData.payStatus == "3") {
            this.voucherData.payStatus = "审核中";
          }
          this.voucherData.lowercaseAmount = Number(
            this.voucherData.lowercaseAmount
          ).toFixed(2);
          this.voucherData.amount = Number(this.voucherData.amount).toFixed(2);
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
*{
  padding: 0;
  margin: 0;
}
body {
  margin: 0;
}
#voucher {
  // width: 706px;
  // display: flex;
  // justify-content: center;
  // padding-top: 50px;
  // background-color: rgb(243, 243, 243);
  // width: 100%;
  // height: 100%;
  // margin: 0 auto;

  .voucher-main {
    
    .voucher-img {
      position: relative;
      img {
        display: block;
      }
      p {
        position: absolute;
        color: #3540c0;
        font-weight: bold;
        font-size: 15px;
      }
      p.voucher-name {
        left: 150px;
        top: 90px;
      }
      p.voucher-user {
        left: 150px;
        top: 116px;
      }
      p.voucher-Property {
        left: 150px;
        top: 140px;
      }
      p.voucher-order {
        left: 88px;
        top: 213px;
      }
      p.voucher-time {
        left: 429px;
        top: 212px;
      }
      p.voucher-state {
        left: 726px;
        top: 212px;
      }
      p.voucher-project {
        left: 145px;
        top: 261px;
      }
      p.voucher-money {
        left: 569px;
        top: 261px;
      }
      p.voucher-large {
        left: 190px;
        top: 342px;
      }
      p.voucher-small {
        left: 583px;
        top: 342px;
      }
      p.voucher-No {
        left: 607px;
        top: 51px;
        font-size: 14px;
        color: #000;
      }
    }
    .voucher-a {
      margin-top: 50px;
      // text-align: center;
      margin-left: 400px;
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
<template>
  <div class="dashboard-editor-container">
    <!-- <router-link to="/employe">跳转</router-link>
    <panel-group @handleSetLineChartData="handleSetLineChartData" />
    
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData" />
    </el-row>

    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <raddar-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <bar-chart />
        </div>
      </el-col>
    </el-row>-->
    <div class="process">
      <h4>操作流程</h4>
      <div class="process-conter">
        <div class="process-box" v-for="(item,index) in boxLength" :key="index">
          <div class="process-box-left">{{index+1}}</div>
          <div class="process-box-right">
            <h5>{{item.name}}</h5>
            <p>{{item.cName}}</p>
          </div>
        </div>
        <div class="process-img">
          <img src="../assets/image/fengxian.png" alt />
          <p>物业风险转嫁咨询</p>
        </div>
      </div>
    </div>
    <div class="guarantee-img" v-if="imgList.length">
      <!-- <img style="height:100%" src="../assets/image/fengxian.png" alt /> -->
      <el-carousel height="500px" :interval="5000" arrow="always">
        <el-carousel-item class="index-banner-box" v-for="(item,index) in imgList" :key="index">
          <img class="index-banner" :src="item" alt />
        </el-carousel-item>
      </el-carousel>
    </div>

    <div class="guarantee">
      <h4>保障服务</h4>
      <div class="guarantee-conter">
        <div
          @click="goToShow(index)"
          :class="getBJ(item)"
          v-for="(item,index) in guarantee"
          :key="index"
        >
          <div class="guarantee-box-main"></div>
          <p>{{item.name}}</p>
          <p>{{item.cName}}</p>
        </div>
        <div class="guarantee-box2">
          <div @click="toFlexible" class="guarantee-box2-left">
            <div class="guarantee-box-main"></div>
            <p>灵活用工</p>
            <p>用工规范解决方案</p>
          </div>
          <div @click="toMutual" class="guarantee-box2-right">
            <div class="guarantee-box-main"></div>
            <p>工亡互助</p>
            <p>物管行业工亡互助计划征集通道</p>
          </div>
        </div>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import { systemActivityListImg } from "@/api/information/information";

export default {
  name: "Index",
  //   }
  data() {
    return {
      boxLength: [
        {
          name: "添加发票",
          cName: "添加/管理发票抬头"
        },
        {
          name: "完善信息",
          cName: "完善公司信息 / 添加项目"
        },
        // {
        //   name: "添加小区",
        //   cName: "添加/管理小区项目"
        // },
        {
          name: "充值",
          cName: "选择充值方式"
        },
        {
          name: "申报",
          cName: "保障在线申报"
        }
      ],
      guarantee: [
        {
          name: "家财险",
          cName: "预交物业费解决方案",
          type: "1"
        },
        {
          name: "雇主责任险",
          cName: "企业工伤赔偿责任的在线解决方案",
          type: "2"
        },
        {
          name: "物业险",
          cName: "物业场所，职业，设施设备，3大风险转嫁方案",
          type: "3"
        }
      ],
      imgList: []
    };
  },
  created() {
    this.getImgList();
  },
  methods: {
    // 获取轮播图图片信息
    getImgList() {
      const page = {
        status: "2"
      };
      systemActivityListImg(page).then(xhrData => {
        if (xhrData.code === 200) {
          // console.log(xhrData);
          this.imgList = xhrData.data;
        }
      });
    },
    goToShow(value) {
      if (value == 0) {
        this.$router.push("/family");
      } else if (value == 1) {
        this.$router.push("/employer");
      } else if (value == 2) {
        this.$router.push("/Property");
      }
    },
    // 跳转到灵活用工界面
    toFlexible() {
      this.$router.push("/flexible");
    },
    // 跳转到伤亡互助
    toMutual() {
      this.$router.push("/mutual");
    },
    getBJ(val) {
      // console.log(val);
      if (val.type == "1") {
        return "guarantee-box bj1";
      } else if (val.type == "2") {
        return "guarantee-box bj2";
      } else if (val.type == "3") {
        return "guarantee-box bj3";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
* {
  padding: 0;
  margin: 0;
}
.app-main {
  height: 100%;
}
.dashboard-editor-container {
  // width: 100%;
  height: 100%;
  background-color: #e6e8eb;
  padding: 10px;
  box-sizing: border-box;
  // min-width: 1100px;
  // overflow:auto;
  .process {
    padding: 15px 25px 35px 25px;
    box-sizing: border-box;
    background-color: #fff;
    border-radius: 4px;
    h4 {
      letter-spacing: 1px;
    }
    .process-conter {
      // margin-top: 25px;
      display: flex;
      align-items: center;

      :first-child {
        ::after {
          display: none !important;
        }
      }
      .process-box {
        flex: 1;
        display: flex;
        position: relative;
        ::after {
          content: "";
          position: absolute;
          left: -40%;
          top: 15px;
          width: 60px;
          height: 1px;
          background-color: #eaeaea;
        }
        .process-box-left {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background-color: #ef8200;
          font-size: 12px;
          text-align: center;
          line-height: 30px;
          color: #fff;
        }
        .process-box-right {
          margin-left: 10px;
          h5 {
            margin-top: 8px;
            font-size: 16px;
            letter-spacing: 2px;
          }
          p {
            margin-top: 5px;
            color: #818181;
            font-size: 14px;
          }
        }
      }

      .process-img {
        width: 80px;
        img {
          width: 100%;
        }
        p {
          text-align: center;
          color: #818181;
          font-size: 14px;
        }
      }
    }
  }
  .guarantee {
    margin-top: 20px;
    padding: 15px 25px 35px 25px;
    box-sizing: border-box;
    background-color: #fff;
    border-radius: 4px;

    .guarantee-conter {
      margin-top: 10px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      .guarantee-box {
        margin-top: 15px;
        width: 48%;
        height: 250px;
        // background-color: #f5f6f7;
        text-align: center;
        cursor: pointer;
        .guarantee-box-main {
          width: 40px;
          height: 180px;
          // background-color: #666;
          margin: 0 auto;
          visibility: hidden;
          img {
            width: 100%;
            height: 100%;
          }
        }
        p {
          text-shadow: 0px 0px 4px #fff;
        }
        p:nth-child(2) {
          font-size: 16px;
          margin-top: 10px;
          font-weight: bold;
        }
        p:nth-child(3) {
          font-size: 14px;
          margin-top: 10px;
        }
      }
      .guarantee-box.bj1 {
        background: url("../assets/image/jc.jpg") no-repeat center center;
        background-size: auto 100%;
      }
      .guarantee-box.bj2 {
        background: url("../assets/image/guzhu.jpg") no-repeat center center;
        background-size: 100% 100%;
      }
      .guarantee-box.bj3 {
        background: url("../assets/image/wuye.jpg") no-repeat center center;
        background-size: auto 100%;
      }
      .guarantee-box2 {
        margin-top: 15px;
        width: 48%;
        height: 250px;
        display: flex;
        justify-content: space-between;
        .guarantee-box2-left {
          background: url("../assets/image/lh.jpg") no-repeat center;
          background-size: 100% 100%;
        }
        .guarantee-box2-right {
          background: url("../assets/image/gw.jpg") no-repeat center;
          background-size: 100% 100%;
        }
        .guarantee-box2-left,
        .guarantee-box2-right {
          cursor: pointer;
          width: 48%;
          background-color: #f5f6f7;
          text-align: center;
          .guarantee-box-main {
            width: 40px;
            height: 180px;
            background-color: #666;
            margin: 0 auto;
            visibility: hidden;
          }
          p:nth-child(2) {
            font-size: 16px;
            margin-top: 10px;
            font-weight: bold;
          }
          p:nth-child(3) {
            font-size: 14px;
            margin-top: 10px;
          }
        }
      }
    }
  }
  .guarantee-img {
    margin-top: 20px;
    box-sizing: border-box;
    background-color: #fff;
    border-radius: 4px;
    overflow: hidden;
  }
  .index-banner-box{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .index-banner {
      height: 100%;
      // width: 100%;
    }
  // @media screen and (min-width: 1201px) {
  //   .index-banner {
  //     height: 300px;
  //   }
  // }
}
</style>

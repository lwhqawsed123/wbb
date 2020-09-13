<template>
  <div class="employer">
    <div class="employer-conter">
      <div class="employer-top">
        <h4>
          01 灵活方便，纯线上操作
          <!-- <span>?</span> -->
        </h4>
      </div>
      <div class="employer-bottom">
        <h4>
          02 整合物业、业主及到家服务,为物业增值
          <!-- <span>?</span> -->
        </h4>
        <div class="employer-bottom-chart">
          <div id="myChart1" :style="{width: '450px', height: '450px'}"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "employer",
  data() {
    return {};
  },
  mounted() {
    this.drawLine();
  },
  methods: {
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart1 = this.$echarts.init(document.getElementById("myChart1"));
      // 绘制图表
      myChart1.setOption({
        color: ["#73a0fa", "#73deb3", "#7585a2"],
        graphic: [
          {
            //环形图中间添加文字
            type: "text", //通过不同top值可以设置上下显示
            left: "center",
            top: "48%",
            style: {
              text: "到家服务",
              textAlign: "center",
              fill: "#000", //文字的颜色
              width: 30,
              height: 30,
              fontSize: 18,
              color: "#4d4f5c",
              fontFamily: "Microsoft YaHei"
            }
          }
        ],
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          x: "right",
          data: ["业主", "访问人员", "物业公司"]
        },
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: ["35%", "70%"],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: true,
                position: "inner"
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: "16",
                  fontWeight: "bold"
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              { value: 335, name: "业主" },
              { value: 335, name: "访问人员" },
              { value: 335, name: "物业公司" }
            ]
          }
        ]
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.employer {
  width: 100%;
  padding: 15px;
  min-height: calc(88vh);
  box-sizing: border-box;
  background-color: #e6e8eb;
  .employer-conter {
    background-color: #fff;
    padding: 25px;
    box-sizing: border-box;
    border-radius: 5px;
   min-height: calc(88vh);
    .employer-top,
    .employer-bottom {
      h4 {
        span {
          display: inline-block;
          width: 13px;
          height: 13px;
          border-radius: 50%;
          border: 1px solid #6b6b6b;
          font-size: 10px;
          text-align: center;
          line-height: 13px;
          color: #929292;
          margin-left: 10px;
        }
      }
    }
    .employer-bottom {
      margin-top: 15px;
      .employer-bottom-chart {
        margin-top: 30px;
        display: flex;
        justify-content: space-between;
      }
      p {
        text-align: center;
        font-size: 14px;
        font-weight: bold;
      }
    }
  }
}
</style>
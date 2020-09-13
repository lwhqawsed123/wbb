<template>
  <div class="family">
    <div class="family-conter">
      <div class="family-top">
        <h4>
          预交物业解决方案
          <!-- <span>?</span> -->
        </h4>
      </div>
      <div class="family-bottom">
        <h4>
          效果（十三年物业推广数据总结）
          <!-- <span>?</span> -->
        </h4>
        <div class="family-bottom-chart">
          <div id="myChart1" :style="{width: '48%', height: '400px'}"></div>
          <div id="myChart2" :style="{width: '48%', height: '400px'}"></div>
        </div>
        <p>预收物业费支出节省：{{save}}%</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "family",
  data() {
    return {
      save:50,
    };
  },
  mounted() {
    this.drawLine();
  },
  methods: {
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart1 = this.$echarts.init(document.getElementById("myChart1"));
      // 绘制图表
      this.setChart(myChart1, "预交物业费", "上升35%");
      // 基于准备好的dom，初始化echarts实例
      let myChart2 = this.$echarts.init(document.getElementById("myChart2"));
      // 绘制图表
      this.setChart(myChart2, "物业满意度", "上升28%");
    },
    setChart(item, name, title) {
      item.setOption({
        legend: {
          left: "left"
        },
        tooltip: {
          show: false
        },
        color: ["#73a0fa", "#73deb3"],
        dataset: {
          source: [["product", "推广前", "推广后"], [name, 10, 27]]
        },
        xAxis: { type: "category" },
        yAxis: {
          min: 0,
          max: 30,
          splitNumber: 3,
          boundaryGap: [1, 1],
          axisLine: {
            //y轴
            show: false
          },
          axisLabel: {
            show: false
          }
        },
        series: [
          { type: "bar" },
          {
            type: "bar",
            itemStyle: {
              normal: {
                label: {
                  show: true, //开启显示
                  position: "top", //在上方显示
                  formatter: title,
                  textStyle: {
                    //数值样式
                    color: "black",
                    fontSize: 14
                  }
                }
              }
            }
          }
        ]
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
.family {
  width: 100%;
  padding: 15px;
  min-height: calc(88vh);
  box-sizing: border-box;
  background-color: #e6e8eb;
  padding-bottom: 30px;
  .family-conter {
    background-color: #fff;
    padding: 25px;
    box-sizing: border-box;
    border-radius: 5px;
    min-height: calc(88vh);
    .family-top,
    .family-bottom {
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
    .family-bottom {
      margin-top: 15px;
      .family-bottom-chart {
        margin-top: 30px;
        display: flex;
        justify-content: space-between;
      }
      p{
        text-align: center;
        font-size: 14px;
        font-weight: bold;

      }
    }
  }
}
</style>
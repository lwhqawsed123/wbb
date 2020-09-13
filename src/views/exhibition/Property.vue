<template>
  <div class="Property">
    <div class="Property-conter">
      <div class="Property-top">
        <h3>物业险</h3>
        <h4>
          物业场所，职业，设施设备3大风险转嫁方案
          <!-- <span>?</span> -->
        </h4>
        <table>
          <tr style="font-size:14px;height:50px;">
            <th style="width:15%;text-align: left">产品</th>
            <th style="width:85%;text-align: left">适用范围</th>
          </tr>
          <tr
            style="height: 50px;font-size:13px;line-height: 20px;color:#646464"
            v-for="item in tableValue"
          >
            <td>{{item.product}}</td>
            <td>{{item.range}}</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Property",
  data() {
    return {
      tableValue: [
        {
          product: "公众责任险（物管场所责任）",
          range:
            "物业项目公共区域内：火灾；水箱意外溢出；公共管道破裂；停车场机动车辆失窃；外墙贴砖剥落伤人；道路、河流管理不善致他人等"
        },
        {
          product: "物业责任险（物管执业责任）",
          range:
            "物业管理与经营过程中因疏忽或过失导致他人及财产损失；水管返水、道闸伤人、保安过失伤人以及第三方证明物业服务不善导致的民事赔偿责任等"
        },
        {
          product: "财产-切险",
          range:
            "管理项目中财产及公用设施设备因意外事故、自然灾害、火灾、水损，盗窃和恶意破坏导致财产损失"
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
.Property {
  width: 100%;
  min-height: calc(88vh);
  padding: 15px;
  box-sizing: border-box;
  background-color: #e6e8eb;
  .Property-conter {
    background-color: #fff;
    height: 100%;
    padding: 25px;
    box-sizing: border-box;
    border-radius: 5px;
    min-height: calc(88vh);
    .Property-top {
      h3 {
        text-align: center;
      }
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
      table {
        border-collapse: collapse;
        border: none;
        border-radius: 5px;
        -moz-border-radius: 5px;
        -webkit-border-radius: 5px;
        th {
          background-color: #fafafa;
        }
        td,
        th {
          padding: 15px;
          box-sizing: border-box;
          border: solid#ececec 1px;
        }
      }
    }
  }
}
</style>
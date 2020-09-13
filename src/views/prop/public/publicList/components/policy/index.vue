<template>
  <div class="added-addedUpload">
    <h3>保单</h3>
    <div class="components-box">
      <div class="demo-image__preview">
        <div class="demo-image__preview-box" v-for="(item,index) in imgData" :key="index">
          <el-image
            v-if="item.url != ''"
            style="width: 150px; height: 150px;cursor: pointer;"
            :src="item.url"
            :preview-src-list="srcList1"
            @click="getImgUrl1(index)"
          ></el-image>
          <el-image
            style="width: 150px; height: 150px;background-color: #f5f7fa;display: flex; justify-content: center; align-items: center;"
            v-if="item.url == ''"
          >
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
        </div>
      </div>
    </div>
    <h3 v-if="isShow">批改单</h3>
    <div class="components-box">
      <div class="demo-image__preview">
        <div class="demo-image__preview-box" v-for="(item,index) in orderNoImg" :key="index">
          <el-image
            v-if="item.url != ''"
            style="width: 150px; height: 150px;cursor: pointer;"
            :src="item.url"
            :preview-src-list="srcList2"
            @click="getImgUrl2(index)"
          ></el-image>
          <el-image
            style="width: 150px; height: 150px;background-color: #f5f7fa;display: flex; justify-content: center; align-items: center;"
            v-if="item.url == ''"
          >
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
        </div>
      </div>
    </div>
    <div class="apply-page-bot">
      <a class="apply-page-btn apply-page-btn-default" href="javascript:;" @click="goBack()">返回</a>
    </div>
  </div>
</template>

<script>
// insPubApplyFile
// 请求
import {
  insPubApplyFile
} from "@/api/information/information";
export default {
  name: "",
  props: ["idData"],
  data() {
    return {
      imgData: [],
      orderNoImg: [],
      srcList1: [],
      srcList2: [],
      isShow:true
    };
  },
  created() {
    // console.log(this.idData);
    this.getData()
  },
  methods: {
    getData(){
      insPubApplyFile(this.idData.id).then(xhrData=>{
        // console.log(xhrData);
        if(xhrData.code === 200){
          let  arr1 = []
          let arr2 = []
          arr1 = xhrData.data.insApplyPubAttachList
          arr2 = xhrData.data.insRevisePubAttachList
          if(arr2.length <= 0){
            this.isShow = false
          }
          arr1.forEach(item=>{
            this.imgData.push({
              url:item.url
            })
          })
          arr2.forEach(item=>{
            this.orderNoImg.push({
              url: item.url
            })
          })
        }
        
      })
    },
    getImgUrl1(index) {
      // 先还原
      this.srcList1 = [];
      // 后添加
      this.srcList1.push(this.imgData[index].url);
    },
    getImgUrl2(index) {
      // 先还原
      this.srcList2 = [];
      // 后添加
      this.srcList2.push(this.orderNoImg[index].url);
    },
    goBack(){
        this.$emit("changePage", "LIST");
    }
  }
};
</script>

<style lang="scss" scopde>
.added-addedUpload {
  padding: 20px;
  box-sizing: border-box;
  .components-box {
    margin-left: 40px;
    display: flex;
    padding: 20px 0;
    box-sizing: border-box;
    .demo-image__preview {
      display: flex;
      flex-wrap: wrap;
      .demo-image__preview-box {
        margin-right: 30px;
        p {
          text-align: center;
          padding-top: 5px;
        }
      }
    }
    .components-btn {
      padding: 0 15px;
      box-sizing: border-box;
      text-align: center;
      height: 40px;
      line-height: 40px;
      border-radius: 4px;
      font-size: 14px;
    }
    .components-btn.btn1 {
      color: #fff;
      background-color: #169bd5;
      margin-right: 50px;
    }
    .components-btn.btn2 {
      color: #fff;
      background-color: #f59a23;
    }
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
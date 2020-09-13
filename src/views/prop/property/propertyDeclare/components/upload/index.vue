<template>
  <div class="declare-upload">
    <!-- <p style="color:red;padding-bottom:10px">说明：请按照需求上传资料，多张投保单明细时盖骑缝章即可</p> -->
    <div class="declare-upload-wrap">
      <h4>资料样例</h4>
      <div style="display: flex;">
        <div class="demo-image__preview-box" v-for="(item,index) in imgData" :key="index">
          <el-image
            style="width: 150px; height: 150px;cursor: pointer;"
            :src="item.url"
            :preview-src-list="srcList1"
            @click="getImgUrl1(index)"
          ></el-image>
          <p>{{item.title}}</p>
        </div>
      </div>
    </div>
    <div class="declare-upload-wrap">
      <h4>资料上传</h4>
      <div style="display: flex;">
        <div class="declare-upload-box">
          <el-upload
            action="123"
            list-type="picture-card"
            :class="{ disabled: uploadDisabled1 }"
            :on-change="handleChange1"
            :multiple="false"
            :limit="limitcount1"
            :http-request="httpRequest"
            :on-remove="handleRemove1"
            :on-preview="handlePictureCardPreview1"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <p>投保单(盖章)</p>
        </div>
        <!-- <div class="declare-upload-box">
          <el-upload
            action="123"
            list-type="picture-card"
            :class="{ disabled: uploadDisabled2 }"
            :on-change="handleChange2"
            :multiple="false"
            :limit="limitcount2"
            :http-request="httpRequest"
            :on-remove="handleRemove2"
            :on-preview="handlePictureCardPreview2"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <p>投保单(盖章)</p>
        </div> -->
        <!-- <div class="declare-upload-box">
          <el-upload
            action="123"
            list-type="picture-card"
            :class="{ disabled: uploadDisabled3 }"
            :on-change="handleChange3"
            :multiple="false"
            :limit="limitcount3"
            :http-request="httpRequest"
            :on-remove="handleRemove3"
            :on-preview="handlePictureCardPreview3"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <p>投保明细(骑缝章)</p>
        </div> -->
        <div class="declare-upload-box">
          <el-upload
            action="123"
            list-type="picture-card"
            :class="{ disabled: uploadDisabled4 }"
            :on-change="handleChange4"
            :multiple="false"
            :limit="limitcount4"
            :http-request="httpRequest"
            :on-remove="handleRemove4"
            :on-preview="handlePictureCardPreview4"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <p>营业执照</p>
        </div>
      </div>
    </div>
    <!-- 查看大图 -->
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>
    <div class="apply-page-bot">
      <a class="apply-page-btn" href="javascript:;" @click="submission">提交</a>
      <!-- <a class="apply-page-btn apply-page-btn-default" href="javascript:;" @click="goBack">上一步</a> -->
    </div>
  </div>
</template>

<script>
import { filePolicy, insProp } from "@/api/information/information";
import $ from "jquery";
export default {
  name: "declare-upload",
  props: ["arrData", "propertyData", "insData"],
  data() {
    return {
      dialogVisible: false,
      dialogImageUrl: "",
      uploadDisabled1: false,
      uploadDisabled2: false,
      uploadDisabled3: false,
      uploadDisabled4: false,
      limitcount1: 1,
      limitcount2: 1,
      limitcount3: 1,
      limitcount4: 1,
      files: [],
      aliyunOssToken: {},
      // 保存图片路径
      imgUrl1: "",
      uploadUrl: {
        // 投保单第一个文件
        policyHeadFile: "",
        // 投保单第二个文件
        policyEndFile: "",
        // 投保单明细(骑缝章)
        policyDetailFile: "",
        // 营业执照
        businessFile: ""
      },
      imgData: [
        {
          url: require("../../../../../../assets/image/zw.png"),
          title:'投保单(盖章)'
        },
        // {
        //   url: require("../../../../../../assets/image/zw.png"),
        //   title:'投保单(盖章)'
        // },
        // {
        //   url: require("../../../../../../assets/image/zw.png"),
        //   title:'投保明细(骑缝章)'
        // },
        {
          url: require("../../../../../../assets/image/zw.png"),
          title:'营业执照'
        },
      ],
      srcList1: []
    };
  },
  mounted() {
    // this.getOssToken();
    // console.log(this.arrData, "保单信息");
    // console.log(this.propertyData, "物业公司信息");
    // console.log(this.insData, "保单号");
  },
  methods: {
    // //获取上传通行证
    // getOssToken() {
    //   var _self = this;
    //   filePolicy()
    //     .then(function(res) {
    //       // console.log(res);

    //       if (res.code == 200) {
    //         _self.aliyunOssToken = res.data;
    //       } else {
    //         _self.$message.error(res.data.message);
    //       }
    //     })
    //     .catch(function(error) {
    //       console.log(error);
    //     });
    // },

    async handleChange1(file1, fileList) {
      // console.log(file1);

      var _self = this;
      // 加载动画
      const loading = this.$loading({
        lock: true,
        text: "上传中，请等待...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      //获取上传通行证
      const res = await filePolicy();
      if (res.code === 200) {
        _self.aliyunOssToken = res.data;
      } else {
        _self.$message.error(res.data.message);
      }

      this.uploadDisabled1 = fileList.length >= this.limitcount1;
      var getSuffix = function(fileName) {
        var pos = fileName.lastIndexOf(".");
        var suffix = "";
        if (pos != -1) {
          suffix = fileName.substring(pos);
        }
        return suffix;
      };
      var filename = new Date().getTime() + getSuffix(file1.name);
      var formData = new FormData();
      //注意formData里append添加的键的大小写
      formData.append("key", _self.aliyunOssToken.dir + filename); //存储在oss的文件路径
      formData.append("OSSAccessKeyId", _self.aliyunOssToken.accessKeyId); //accessKeyId
      formData.append("policy", _self.aliyunOssToken.policy); //policy
      formData.append("Signature", _self.aliyunOssToken.signature); //签名
      //如果是base64文件，那么直接把base64字符串转成blob对象进行上传就可以了

      formData.append("file", file1.raw);
      formData.append("success_action_status", 200); //成功后返回的操作码
      var url = _self.aliyunOssToken.action;

      var fileUrl =
        _self.aliyunOssToken.action + "/" + _self.aliyunOssToken.dir + filename;

      $.ajax({
        url: url,
        type: "POST",
        data: formData,
        // async: false,
        cache: false,
        contentType: false,
        processData: false,
        success: function(data) {
          // 请求成功 返回路径
          // console.log(fileUrl, "成功");
          _self.uploadUrl.policyHeadFile = fileUrl;
          // 关闭加载动画
          loading.close();
        },
        error: function(data) {
          // console.log(data, "失败");
          // 关闭加载动画
          loading.close();
        }
      });
    },
    async handleChange2(file1, fileList) {
      var _self = this;
       // 加载动画
      const loading = this.$loading({
        lock: true,
        text: "上传中，请等待...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      //获取上传通行证
      const res = await filePolicy();
      if (res.code === 200) {
        _self.aliyunOssToken = res.data;
      } else {
        _self.$message.error(res.data.message);
      }
      this.uploadDisabled2 = fileList.length >= this.limitcount2;
      var getSuffix = function(fileName) {
        var pos = fileName.lastIndexOf(".");
        var suffix = "";
        if (pos != -1) {
          suffix = fileName.substring(pos);
        }
        return suffix;
      };

      var filename = new Date().getTime() + getSuffix(file1.name);
      var formData = new FormData();

      //注意formData里append添加的键的大小写
      formData.append("key", _self.aliyunOssToken.dir + filename); //存储在oss的文件路径
      formData.append("OSSAccessKeyId", _self.aliyunOssToken.accessKeyId); //accessKeyId
      formData.append("policy", _self.aliyunOssToken.policy); //policy
      formData.append("Signature", _self.aliyunOssToken.signature); //签名
      //如果是base64文件，那么直接把base64字符串转成blob对象进行上传就可以了

      formData.append("file", file1.raw);
      formData.append("success_action_status", 200); //成功后返回的操作码
      var url = _self.aliyunOssToken.action;

      var fileUrl =
        _self.aliyunOssToken.action + "/" + _self.aliyunOssToken.dir + filename;

      $.ajax({
        url: url,
        type: "POST",
        data: formData,
        // async: false,
        cache: false,
        contentType: false,
        processData: false,
        success: function(data) {
          // 请求成功 返回路径
          // console.log(fileUrl, "成功");
          _self.uploadUrl.policyEndFile = fileUrl;
          // 关闭加载动画
          loading.close();
        },
        error: function(data) {
          // console.log(data, "失败");
          // 关闭加载动画
          loading.close();
        }
      });
    },
    async handleChange3(file1, fileList) {
      var _self = this;
       // 加载动画
      const loading = this.$loading({
        lock: true,
        text: "上传中，请等待...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      //获取上传通行证
      const res = await filePolicy();
      if (res.code === 200) {
        _self.aliyunOssToken = res.data;
      } else {
        _self.$message.error(res.data.message);
      }
      this.uploadDisabled3 = fileList.length >= this.limitcount2;
      var getSuffix = function(fileName) {
        var pos = fileName.lastIndexOf(".");
        var suffix = "";
        if (pos != -1) {
          suffix = fileName.substring(pos);
        }
        return suffix;
      };

      var filename = new Date().getTime() + getSuffix(file1.name);
      var formData = new FormData();

      //注意formData里append添加的键的大小写
      formData.append("key", _self.aliyunOssToken.dir + filename); //存储在oss的文件路径
      formData.append("OSSAccessKeyId", _self.aliyunOssToken.accessKeyId); //accessKeyId
      formData.append("policy", _self.aliyunOssToken.policy); //policy
      formData.append("Signature", _self.aliyunOssToken.signature); //签名
      //如果是base64文件，那么直接把base64字符串转成blob对象进行上传就可以了

      formData.append("file", file1.raw);
      formData.append("success_action_status", 200); //成功后返回的操作码
      var url = _self.aliyunOssToken.action;

      var fileUrl =
        _self.aliyunOssToken.action + "/" + _self.aliyunOssToken.dir + filename;

      $.ajax({
        url: url,
        type: "POST",
        data: formData,
        // async: false,
        cache: false,
        contentType: false,
        processData: false,
        success: function(data) {
          // 请求成功 返回路径
          // console.log(fileUrl, "成功");
          _self.uploadUrl.policyDetailFile = fileUrl;
          // 关闭加载动画
          loading.close();
        },
        error: function(data) {
          // console.log(data, "失败");
          // 关闭加载动画
          loading.close();
        }
      });
    },
    async handleChange4(file1, fileList) {
      var _self = this;
       // 加载动画
      const loading = this.$loading({
        lock: true,
        text: "上传中，请等待...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      //获取上传通行证
      const res = await filePolicy();
      if (res.code === 200) {
        _self.aliyunOssToken = res.data;
      } else {
        _self.$message.error(res.data.message);
      }
      this.uploadDisabled4 = fileList.length >= this.limitcount2;
      var getSuffix = function(fileName) {
        var pos = fileName.lastIndexOf(".");
        var suffix = "";
        if (pos != -1) {
          suffix = fileName.substring(pos);
        }
        return suffix;
      };

      var filename = new Date().getTime() + getSuffix(file1.name);
      var formData = new FormData();

      //注意formData里append添加的键的大小写
      formData.append("key", _self.aliyunOssToken.dir + filename); //存储在oss的文件路径
      formData.append("OSSAccessKeyId", _self.aliyunOssToken.accessKeyId); //accessKeyId
      formData.append("policy", _self.aliyunOssToken.policy); //policy
      formData.append("Signature", _self.aliyunOssToken.signature); //签名
      //如果是base64文件，那么直接把base64字符串转成blob对象进行上传就可以了

      formData.append("file", file1.raw);
      formData.append("success_action_status", 200); //成功后返回的操作码
      var url = _self.aliyunOssToken.action;

      var fileUrl =
        _self.aliyunOssToken.action + "/" + _self.aliyunOssToken.dir + filename;

      $.ajax({
        url: url,
        type: "POST",
        data: formData,
        // async: false,
        cache: false,
        contentType: false,
        processData: false,
        success: function(data) {
          // 请求成功 返回路径
          // console.log(fileUrl, "成功");
          _self.uploadUrl.businessFile = fileUrl;
           // 关闭加载动画
          loading.close();
        },
        error: function(data) {
          // console.log(data, "失败");
           // 关闭加载动画
          loading.close();
        }
      });
    },
    // 上一步
    goBack() {
      this.$emit("changePage", "PRINTING");
    },
    httpRequest(file) {
      // console.log(file);
    },
    handlePictureCardPreview1(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handlePictureCardPreview2(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handlePictureCardPreview3(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handlePictureCardPreview4(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleRemove1(file, fileList) {
      this.uploadDisabled1 = fileList.length >= this.limitcount1;
      this.uploadUrl.policyHeadFile = "";
    },
    handleRemove2(file, fileList) {
      this.uploadDisabled2 = fileList.length >= this.limitcount2;
      this.uploadUrl.policyEndFile = "";
    },
    handleRemove3(file, fileList) {
      this.uploadDisabled3 = fileList.length >= this.limitcount3;
      this.uploadUrl.policyDetailFile = "";
    },
    handleRemove4(file, fileList) {
      this.uploadDisabled4 = fileList.length >= this.limitcount4;
      this.uploadUrl.businessFile = "";
    },
    // 提交
    submission() {
      // console.log(this.uploadUrl);
      // this.arrData
      // console.log(this.arrData);
      const objData = {
        // 项目id
        projectId: "",
        // 投保份数
        insureNum: "",
        // 投保开始时间
        startTime: "",
        // 投保结束时间
        endTime: "",
        // 面积
        areaSize: "",
        // 是否有游泳池
        swimmingPool: ""
      };
      const insPropDetailList = [];
      this.arrData.forEach((item, index) => {
        // console.log(item);
        insPropDetailList.push({
          projectId: item.name.id,
          insureNum: item.share,
          startTime: item.startTime + " 00:00:00",
          endTime: item.endTime + " 23:59:59",
          areaSize: item.mj
        });
        if (item.yc == "有") {
          insPropDetailList[index].swimmingPool = "0";
        } else if (item.yc == "无") {
          insPropDetailList[index].swimmingPool = "1";
        }
        // objData.projectId = item.name.id
        // objData.insureNum = item.share
        // objData.startTime = item.startTime
        // objData.endTime = item.endTime
        // if(item.yc == '有'){
        //   objData.swimmingPool = '0'
        // }else if(item.yc == '无'){
        //   objData.swimmingPool = '1'
        // }
        // objData.areaSize = item.mj
      });
      const jsonData = {
        insPropDetailList,
        policyHeadFile: this.uploadUrl.policyHeadFile,
        policyEndFile: this.uploadUrl.policyEndFile,
        policyDetailFile: this.uploadUrl.policyDetailFile,
        businessFile: this.uploadUrl.businessFile,
        certNo: this.propertyData.insureNum,
        insCompId: this.arrData[0].insCompany,
        policyFile: this.propertyData.policyFile,
        businessType: "0"
      };
      if (
        jsonData.policyHeadFile == "" ||
        // jsonData.policyEndFile == "" ||
        // jsonData.policyDetailFile == "" ||
        jsonData.businessFile == ""
      ) {
        this.$message({
          message: "请上传文件后提交！",
          type: "warning"
        });
      } else {
        // console.log(jsonData);
        insProp(jsonData).then(xhrData => {
          // console.log(xhrData, "json");
          if (xhrData.code === 200) {
            let insData = {};
            insData = {
              id: xhrData.data.id,
              totalPremium: xhrData.data.totalPremium
              // insCompId:this.arrData[0].insCompany
            };
            this.$emit("changePage", "PAYMENT", insData);
          }
        });
      }
    },
    // 资料样例
    getImgUrl1(index) {
      // 先还原
      this.srcList1 = [];
      // 后添加
      this.srcList1.push(this.imgData[index].url);
    }
  }
};
</script>
<style>
.disabled .el-upload--picture-card {
  display: none;
}
</style>
<style lang="scss" scoped>
.declare-upload {
  padding: 50px;
  box-sizing: border-box;
  .declare-upload-wrap {
    padding-bottom: 30px;
    box-sizing: border-box;
    h4 {
      padding-bottom: 15px;
    }
    .declare-upload-box {
      width: 150px;
      margin-right: 40px;
      p {
        text-align: center;
        padding-top: 15px;
      }
    }
    .demo-image__preview-box {
        margin-right: 40px;
        p {
          text-align: center;
          padding-top: 5px;
        }
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
<template>
  <!-- 产品列表 -->
  <div class="publicStyle">
    <div class="publicStyle-conter">
      <el-row :gutter="20" class="record-top" style="margin-left: 0px; margin-right: 0px;">
        <el-col :span="21">
          <el-form
            id="companyForm"
            :inline="true"
            @submit.native.prevent
            :model="formInline"
            class="demo-form-inline"
          >
            <el-form-item label="产品名称:">
              <el-input
                @keyup.enter.native="query"
                v-model.trim="formInline.prodName"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="info" plain @click="query">查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="3">
          <div class="addrecord" @click="addProduct">添加产品</div>
        </el-col>
      </el-row>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="index" label="序号" width="80"></el-table-column>
        <el-table-column prop="prodName" label="产品名称" min-width="200px"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="200px"></el-table-column>
        <el-table-column prop="address" label="操作" min-width="200px">
          <template slot-scope="scope">
            <a
              href="javascript:;"
              style="margin-right:3px; color: #1890ff;"
              @click="modifyCurrent(scope.row)"
            >修改</a>
            <div
              v-if="!(scope.row.code =='EMP' || scope.row.code =='HOUSE')"
              style=" display: inline-block"
            >
              |
              <a
                href="javascript:;"
                style="margin-right:3px; color: #1890ff;"
                @click="deleteCurrent(scope.row)"
              >删除</a>
            </div>
            <div v-else-if="scope.row.prodName == '家财保障险'" style=" display: inline-block">
              |
              <a
                href="javascript:;"
                style="margin-right:3px; color: #1890ff;"
                @click="upload(scope.row)"
              >上传海报</a>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNum"
      ></el-pagination>
    </div>
    <!-- 查看 对话框 -->
    <el-dialog :title="dialogText" class="seeDialog" :visible.sync="dialogVisible" width="40%">
      <el-form ref="form" :rules="rules" :model="form" label-width="100px" label-position="left">
        <el-form-item label="产品名称:" prop="prodName">
          <el-input v-model="form.prodName"></el-input>
        </el-form-item>
        <el-form-item label="产品备注:" prop="remark">
          <el-input type="textarea" v-model="form.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <a href="javascript:;" class="btn btn1" @click="confirm('form')">确 定</a>
        <a href="javascript:;" class="btn btn2" @click="dialogVisible=false">取 消</a>
      </span>
    </el-dialog>
    <!-- v-for="(item,index) in uploadForm.insEmpApplyUsers"
    :key="index"-->
    <!-- 上传海报对话框 -->
    <el-dialog title="上传海报" class="seeDialog" :visible.sync="dialogVisible2" width="40%">
      <el-form
        class="uploadForm"
        ref="uploadForm"
        :model="uploadForm"
        label-width="100px"
        label-position="left"
      >
        <!-- <div></div> -->
        <el-form-item label="模板名称:">
          <el-input v-model="uploadForm.name"></el-input>
          
          <!-- <el-button v-if="index > 0" @click.prevent="removeDomain(item)">删除</el-button> -->
        </el-form-item>
        <el-form-item label="标准模板:">
          <el-upload
            action="123"
            :limit="1"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-change="handleChangeTemplate"
            ref="doctypeCrfile"
            :auto-upload="false"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="上传源文件:" id="formUpload">
          <el-upload :on-change="handleChangeSource" action="123" :limit="1" :auto-upload="false">
            <el-button size="small">点击上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <el-button size="small" @click="addTemplate">添加模板</el-button>
      <span slot="footer" class="dialog-footer">
        <a href="javascript:;" class="btn btn1" @click="Preservation">保 存</a>
        <a href="javascript:;" class="btn btn2" @click="dialogVisible2=false">取 消</a>
      </span>
    </el-dialog>
    <!-- 浏览图片对话框 -->
    <el-dialog :visible.sync="dialogVisible3">
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>
  </div>
</template>

<script>
import "../../../../assets/styles/publicStyle.css";
// 请求
import {
  systemProdTypeGetListByQuery,
  systemProdType,
  systemProdTypeAdd,
  systemProdTypeUpdate,
  systemProdTypeGte,
  systemProdTypeUploadPoster
} from "@/api/information/information";
export default {
  name: "",
  data() {
    return {
      // 对话框
      dialogVisible: false,
      // 上传海报对话框
      dialogVisible2: false,
      dialogVisible3: false,
      dialogImageUrl: "",
      formInline: {
        prodName: ""
      },
      // 对话框标题
      dialogText: "",
      // 表单
      form: {
        // 产品名称
        prodName: "",
        // 产品备注
        remark: ""
      },
      // 上传文件表单
      uploadForm: {
        // 产品名称
        name: "",
        // 上传模板
        picFile: [],
        // 上传源文件
        sourceFile: []
      },
      //
      // 表单验证
      rules: {
        // 产品名称
        prodName: [
          { required: true, message: "请输入产品名称", trigger: "blur" }
        ]
      },
      // 产品列表数据
      tableData: [],
      // 总条数
      totalNum: 1,
      // 显示条数
      pageSize: 10,
      // 显示页数
      // 分页
      pageNum: 1,
      // 上传海报按钮显示隐藏
      isShow: false,
      names:[],
      files:[]
    };
  },
  created() {
    // 调用获取列表信息方法
    this.getListData();
  },
  methods: {
    // 查询
    query() {
      this.getListData();
    },
    // 获取列表信息
    getListData() {
      // 请求获取列表
      let page = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        prodName: this.formInline.prodName
        // invoiceTitle:this.formInline.invoiceTitle
      };
      systemProdTypeGetListByQuery(page).then(xhrData => {
        // console.log(xhrData);

        if (xhrData.code === 200) {
          this.tableData = xhrData.rows;
          // 总条数
          this.totalNum = xhrData.total;
        }
      });
    },
    //在改变每页显示的条数
    handleSizeChange(val) {
      // 注意：在改变每页显示的条数时，要将页码显示到第一页
      this.pageNum = 1;
      // 改变每页显示的条数
      this.pageSize = val;
      // 更新列表
      this.getListData();
    },
    // 页数
    handleCurrentChange(val) {
      // 改变默认的页数
      this.pageNum = val;
      // 更新列表
      this.getListData();
    },
    // 修改按钮
    modifyCurrent(row) {
      // 赋值标题
      this.dialogText = "修改";
      // 请求获取当前数据
      systemProdTypeGte(row.id).then(xhrData => {
        // 打开对话框
        this.dialogVisible = true;
        // 赋值数据到表单
        if (xhrData.code === 200) {
          this.form.prodName = xhrData.data.prodName;
          this.form.remark = xhrData.data.remark;
          this.form.id = xhrData.data.id;
        }
      });
    },
    // 删除按钮
    deleteCurrent(row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 请求删除产品
          systemProdType(row.id)
            .then(xhrData => {
              if (xhrData.code === 200) {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
              }
              // 更新列表
              this.getListData();
            })
            .catch(() => {
              this.$message({
                type: "error",
                message: "删除失败!"
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 添加产品按钮
    addProduct() {
      // 赋值标题
      this.dialogText = "添加产品";
      // 打开对话框
      this.dialogVisible = true;
      // 复原表单
      this.form = {
        prodName: "",
        remark: ""
      };
    },
    // 确定按钮
    confirm(form) {
      // 通过表单验证
      this.$refs[form].validate(valid => {
        if (valid) {
          if (this.dialogText == "添加产品") {
            // 请求 新增产品
            systemProdTypeAdd(this.form)
              .then(xhrData => {
                if (xhrData.code === 200) {
                  this.$message({
                    type: "success",
                    message: "添加成功!"
                  });
                  // 清空表单
                  this.$refs[form].resetFields();
                  // 关闭对话框
                  this.dialogVisible = false;
                  // 更新列表
                  this.getListData();
                }
              })
              .catch(() => {
                this.$message({
                  type: "error",
                  message: "添加失败!"
                });
              });
          } else if (this.dialogText == "修改") {
            // console.log(this.form);
            // 请求修改产品
            systemProdTypeUpdate(this.form).then(xhrData => {
              // console.log(xhrData);
              if (xhrData.code === 200) {
                this.$message({
                  type: "success",
                  message: "修改成功!"
                });
                // 关闭对话框
                this.dialogVisible = false;
                // 更新列表
                this.getListData();
              }
            });
          }
        } else {
          this.$message({
            type: "warning",
            message: "请输入完成!"
          });
          return false;
        }
      });
    },
    // 上传海报按钮
    upload(row) {
      // console.log(row);
      // 打开上传海报对话框
      this.dialogVisible2 = true;
    },
    handleRemove(file, fileList) {
      // console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      // console.log(file);
      this.dialogImageUrl = file.url;
      this.dialogVisible3 = true;
    },
    // 确定上传保存
    Preservation() {
      // console.log(this.files);
      this.name = '123'
      let param = new FormData();
      let arr = []
      for(let i = 0;i <this.files.length;i++){
        
         param.append("files", this.files[i])
      }
      param.append("names", this.name)
      // let data = {
      //   names:['123'],
      //   files:param
      // }
      // console.log(param);
      
      systemProdTypeUploadPoster(param).then(xhrData=>{
        // console.log(xhrData);
        
      })
      
    },
    // 上传模板
    handleChangeTemplate(file, fileList) {
      // console.log(file.raw);
      this.files.push(file.raw)
      // const param = new FormData();
      // param.append("file", file.raw);
    },
    // 上传源文件
    handleChangeSource(file, fileList) {
      this.files.push(file.raw)
      // const param = new FormData();
      // param.append("file", file.raw);
    },
    //  添加模板
    addTemplate() {
      this.uploadForm.insEmpApplyUsers.push({
        // 产品名称
        prodName: "",
        // 上传模板
        template: "",
        // 上传源文件
        source: ""
      });
    },
    // 删除地址
    removeDomain(item) {
      var index = this.uploadForm.insEmpApplyUsers.indexOf(item);
      if (index !== -1) {
        this.uploadForm.insEmpApplyUsers.splice(index, 1);
      }
    },
  }
};
</script>
<style>
.uploadForm {
  border: 1px solid #ddd;
  padding: 20px;
  box-sizing: border-box;
  margin-bottom: 30px;
}
#formUpload div {
  display: flex;
}
#formUpload div > ul {
  margin-left: 15px;
}
.seeDialog .el-dialog__header {
  background-color: #e6e8eb;
}
.seeDialog .el-dialog__title {
  font-size: 20px;
  font-weight: bold;
}
.seeDialog .el-dialog__footer {
  background-color: #e6e8eb;
}
.seeDialog .el-dialog__body {
  padding-left: 30px;
  padding-right: 30px;
  box-sizing: border-box;
}
.seeDialog .el-dialog__footer {
  padding-bottom: 10px;
}
.seeDialog .btn {
  /* background-color: #e6e8eb; */
  width: 82px;
  height: 32px;
  border-radius: 2px;
  text-align: center;
  line-height: 32px;
  font-weight: bold;
  display: inline-block;
  font-size: 14px;
}
.seeDialog .btn.btn1 {
  background: rgba(239, 130, 0, 1);
  border: 1px solid rgba(206, 112, 0, 1);
  color: #fff;
}
.seeDialog .btn.btn2 {
  border: 1px solid rgba(0, 0, 0, 0.25);
}
</style>
<style lang="scss" scoped>
.record-top {
  margin-left: 0;
  margin-right: 0;
  min-height: 60px;
  border-bottom: 1px solid #d6d6d6;
  .el-form--inline .el-form-item {
    margin-top: 10px;
    margin-bottom: 0;
    .el-input {
      width: 200px;
    }
  }
}
.addrecord {
  width: 120px;
  height: 36px;
  margin-top: 10px;
  background-color: #ef8200;
  border: 1px solid #d1780f;
  text-align: center;
  line-height: 36px;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
}
.el-pagination {
  position: absolute;
  bottom: 40px;
  left: 20px;
  right: 0;
}
</style>
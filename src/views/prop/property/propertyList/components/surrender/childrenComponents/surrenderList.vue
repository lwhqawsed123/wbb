<template>
  <!-- 退保 列表 -->
  <div>
    <el-row :gutter="20" class="record-top" style="margin-left: 0px; margin-right: 0px;">
      <el-col :span="24">
        <el-form
          id="companyForm"
          :inline="true"
          @submit.native.prevent
          :model="formInline"
          class="demo-form-inline"
        >
          <el-form-item label="项目名称:">
            <el-input
              @keyup.enter.native="query"
              v-model.trim="formInline.projectName"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item label="审核状态:">
            <el-select @change="query" clearable v-model="formInline.state" placeholder="请选择">
              <!-- <el-option label="审核通过" value="1"></el-option> -->
              <el-option label="申报中" value="0"></el-option>
              <el-option label="批改成功" value="1"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="创建时间:">
            <el-date-picker
              value-format="yyyy-MM-dd"
              v-model="formInline.createTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="info" plain @click="query">查询</el-button>
            <el-button v-if="obj.state == '在保'" type="primary" plain @click="surrender" v-hasPermi="['ins:prop:return:add']">申请退保</el-button>
            <el-button type="info" plain @click="revert">返回</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!-- 审核列表 -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column prop="certNo" show-overflow-tooltip label="凭证号" width="200px"></el-table-column>
      <el-table-column prop="projectName" show-overflow-tooltip label="项目名称" width="250px"></el-table-column>
      <el-table-column prop="type" show-overflow-tooltip label="项目类型" width="150px"></el-table-column>
      <el-table-column prop="insureNum" show-overflow-tooltip label="投保份数" width="100px"></el-table-column>
      <el-table-column prop="returnPremium" show-overflow-tooltip label="应退保费" width="100px"></el-table-column>
      <el-table-column prop="state" show-overflow-tooltip label="审核状态" width="100px"></el-table-column>
      <el-table-column prop="validity" show-overflow-tooltip label="保单有效期" width="200px"></el-table-column>
      <el-table-column prop="createTime" show-overflow-tooltip label="创建时间" width="200px"></el-table-column>
      <el-table-column label="操作" min-width="200px">
        <template slot-scope="scope">
          <div style="display: flex;">
            <div>
              <a
                href="javascript:;"
                style="margin-right:3px; color: #1890ff;"
                @click="see(scope.row)"
              >查看</a>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageNum"
      :page-sizes="[5, 10, 20, 30]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalNum"
    ></el-pagination>
    <!-- 审核 对话框 -->
    <el-dialog
      title="查看"
      id="seeDialog"
      class="seeDialog"
      :visible.sync="dialogVisible"
      @close="closeDialog"
      width="600px"
    >
      <p>说明：请仔细核对信息后提交申请， 此操作将永久退保</p>
      <el-form ref="form" :model="form" label-width="155px">
        <el-form-item label="项目名称：">
          <el-input disabled v-model="form.projectName"></el-input>
        </el-form-item>
        <el-form-item label="项目类型：">
          <el-input disabled v-model="form.type"></el-input>
        </el-form-item>
        <el-form-item label="项目地址：">
          <el-input disabled v-model="form.address"></el-input>
        </el-form-item>
        <el-form-item label="占地面积：">
          <el-input disabled v-model="form.areaSize"></el-input>
        </el-form-item>
        <el-form-item label="投保份数： ">
          <el-input disabled v-model="form.insureNum"></el-input>
        </el-form-item>
        <el-form-item label="是否有游泳池： ">
          <el-input disabled v-model="form.swimmingPool"></el-input>
        </el-form-item>
        <el-form-item label="退保期限： ">
          <div style="display:flex">
            <el-input style="width:45%" disabled v-model="form.startTime"></el-input>
            <span style="width:10%;text-align: center;">至</span>
            <el-input style="width:45%" disabled v-model="form.endTime"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="保险事项变更申请书：">
          <!-- <el-input disabled v-model="form.swimmingPool"></el-input> -->
          <el-image
            style="width: 100px; height: auto;border: 1px solid #ddd;"
            :src="form.formImgUrl"
            :preview-src-list="form.formImgUrlSrcList"
          ></el-image>

        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <a href="javascript:;" class="btn btn2" @click="dialogVisible=false">返 回</a>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 请求
import {
  insPropGetReturnApplyList,
  insPropGetReturnApplyDetail
} from "@/api/information/information";
export default {
  name: "",
  props: ["obj"],
  data() {
    return {
      // 查看表单
      form: {
        // 保险事项变更申请书：
        formImgUrl: "",
        formImgUrlSrcList: []
      },
      // 查询表单数据保存
      formInline: {
        projectName: "",
        state: "",
        createTime: ""
      },
      // 审核列表数据
      tableData: [],
      // 总条数
      totalNum: 1,
      // 显示条数
      pageSize: 10,
      // 显示页数
      // 分页
      pageNum: 1,
      // 查看对话框
      dialogVisible: false
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 获取列表
    getList() {
      let page;
      if (
        this.formInline.createTime == "" ||
        this.formInline.createTime == null
      ) {
        page = {
          applyId: this.obj.id,
          pageSize: this.pageSize,
          pageNum: this.pageNum,
          state: this.formInline.state == "" ? null : this.formInline.state,
          projectName: this.formInline.projectName,
          beginTime: "",
          endTime: ""
        };
      } else {
        page = {
          applyId: this.obj.id,
          pageSize: this.pageSize,
          pageNum: this.pageNum,
          state: this.formInline.state == "" ? null : this.formInline.state,
          projectName: this.formInline.projectName,
          // 开始时间
          beginTime: this.formInline.createTime[0] + " 00:00:00",
          // 结束时间
          endTime: this.formInline.createTime[1] + " 23:59:59"
        };
      }
      // console.log(page);
      insPropGetReturnApplyList(page).then(xhrData => {
        // console.log(xhrData, "退保列表");
        if (xhrData.code === 200) {
          this.tableData = xhrData.rows;
          this.totalNum = xhrData.total;
          this.tableData.forEach(item => {
            if (item.type == "0") {
              item.type = "居住类型";
            } else if (item.type == "1") {
              item.type = "非居住类型";
            }
            if (item.swimmingPool == "0") {
              item.swimmingPool = "有";
            } else if (item.swimmingPool == "1") {
              item.swimmingPool = "无";
            }
            if (item.state == "0") {
              item.state = "申报中";
            } else if (item.state == "1") {
              item.state = "批改成功";
            }
            item.validity =
              item.startTime.split(" ")[0] +
              " 至 " +
              item.endTime.split(" ")[0];
          });
        }
      });
    },
    // 查询
    query() {
      this.getList();
    },
    //在改变每页显示的条数
    handleSizeChange(val) {
      // 注意：在改变每页显示的条数时，要将页码显示到第一页
      this.pageNum = 1;
      // 改变每页显示的条数
      this.pageSize = val;
      // 更新列表
      this.getList();
    },
    // 页数
    handleCurrentChange(val) {
      // 改变默认的页数
      this.pageNum = val;
      // 更新列表
      this.getList();
    },
    // 关闭查看对话框
    closeDialog() {},
    // 返回
    revert() {
      this.$emit("changePage2", "REVERT");
    },
    // 退保
    surrender() {
      // const obj = {
      //     id:this.addedId
      // }
      // console.log(this.obj);

      this.$emit("changePage2", "DECLARE", this.obj);
    },
    // 查看
    see(row) {
      // console.log(row);
      // 每次进来清空
      this.form.formImgUrlSrcList = []
      // 打开查看对话框
      this.dialogVisible = true;
      this.form.address = row.address;
      this.form.areaSize = row.areaSize;
      this.form.type = row.type;
      this.form.projectName = row.projectName;
      this.form.swimmingPool = row.swimmingPool;
      this.form.insureNum = row.insureNum;
      this.form.startTime = row.startTime.split(" ")[0];
      this.form.endTime = row.endTime.split(" ")[0];
      this.form.formImgUrl = row.applyFile || "";

      this.form.formImgUrlSrcList.push(row.applyFile);
      
    }
  }
};
</script>
<style>
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
<style>
.el-range-editor--medium .el-range-separator {
  width: 20px;
}
</style>
<style lang='scss' scoped>
.record-top {
  margin-left: 0;
  margin-right: 0;
  min-height: 60px;
  border-bottom: 1px solid #d6d6d6;
  padding-bottom: 20px;
  .el-form--inline .el-form-item {
    margin-top: 10px;
    margin-bottom: 0;
    .el-input {
      width: 200px;
    }
  }
}
.seeDialog {
  p {
    padding-bottom: 20px;
    box-sizing: border-box;
  }
}
.el-pagination {
  position: absolute;
  bottom: 40px;
  left: 20px;
  right: 0;
}
</style>
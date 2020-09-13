<template>
  <!-- 灵活用工数据 -->
  <div class="Property">
    <div class="Property-conter">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="compName" label="物业公司" min-width="200px" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column
          prop="contactName"
          label="联系人"
          min-width="100px"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          prop="contactPhone"
          label="手机"
          min-width="120px"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column prop="createDate" label="日期" min-width="180px" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="status" label="状态" min-width="100px" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column
          prop="talkResult"
          label="沟通结果"
          min-width="100px"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column prop="address" label="操作" min-width="120px">
          <template slot-scope="scope">
            <el-button @click="update(scope.row)">更新</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNum"
      ></el-pagination>
    </div>
    <!-- 对话框 -->
    <el-dialog width="30%" id="viewdata-dialog" title="更新" :visible.sync="dialogTableVisible">
      <el-form
        label-position="left"
        :model="ruleForm"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="状态" prop="status">
          <el-select v-model="ruleForm.status" placeholder="请选择活动区域">
            <el-option label="待沟通" value="1"></el-option>
            <el-option label="已沟通完成" value="2"></el-option>
            <el-option label="需再次沟通" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="沟通结果" prop="talkResult">
          <el-input type="textarea" v-model="ruleForm.talkResult"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <!-- <el-button type="primary" @click="dialogTableVisible = false">更 新</el-button> -->
        <a href="javascript:;" class="user-btn btn1" @click="determine">确 定</a>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// systemTooLlist
import { systemTooLlist, systemToolEdit } from "@/api/information/information";
export default {
  name: "Property",
  data() {
    return {
      // 对话框
      dialogTableVisible: false,
      // 分页
      pageNum: 1,
      pageSize: 10,
      totalNum: 1,
      tableData: [],
      ruleForm: {
        status: "",
        talkResult: "",
        id: ""
      }
    };
  },
  created() {
    this.getLlist();
  },
  methods: {
    // 获取灵活用工列表
    getLlist() {
      const page = {
        pageSize:this.pageSize,
        pageNum:this.pageNum,
      }
      systemTooLlist(page).then(xhrData => {
        if (xhrData.code === 200) {
          for (let i = 0; i < xhrData.rows.length; i++) {
            if (xhrData.rows[i].status == "1") {
              xhrData.rows[i].status = "待沟通";
            } else if (xhrData.rows[i].status == "2") {
              xhrData.rows[i].status = "已沟通完成";
            } else if (xhrData.rows[i].status == "3") {
              xhrData.rows[i].status = "需再次沟通";
            }
          }
          this.tableData = xhrData.rows;
          this.totalNum = xhrData.total
        }
      });
    },
    // 更新按钮
    update(row) {
      // 打开对话框
      this.dialogTableVisible = true;
      this.ruleForm.id = ''+row.id;
    },
    // 确定按钮
    determine() {
      const data = {
        id:this.ruleForm.id,
        status:this.ruleForm.status,
        talkResult:this.ruleForm.talkResult,
      }
      systemToolEdit(data).then(xhrData => {
        if (xhrData.code === 200) {
          this.$message.success("更新成功!");
          // 更新列表
          this.getLlist();
          // 清空表单
          this.$refs["ruleForm"].resetFields();
          // 关闭对话框
          this.dialogTableVisible = false;
        }
      });
    },
    // 每页显示的条数
    handleSizeChange(val) {
      // 注意：在改变每页显示的条数时，要将页码显示到第一页
      this.pageNum = 1;
      // 改变每页显示的条数
      this.pageSize = val;
      // 点击每页显示的条数时，显示第一页
      this.getLlist();
    },
    handleCurrentChange(val) {
      // 改变默认的页数
      this.pageNum = val;
      // 切换页码时，要获取每页显示的条数
      this.getLlist();
    }
  }
};
</script>
<style>
#viewdata-dialog .el-select {
  width: 100%;
}
#viewdata-dialog .el-dialog__header {
  background-color: #e6e8eb;
}
#viewdata-dialog .user-btn {
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
#viewdata-dialog .user-btn.btn1 {
  background: rgba(239, 130, 0, 1);
  border: 1px solid rgba(206, 112, 0, 1);
  color: #fff;
}
#viewdata-dialog .user-btn.btn2 {
  border: 1px solid rgba(0, 0, 0, 0.25);
}
#viewdata-dialog .el-dialog__title {
  font-size: 20px;
  font-weight: bold;
}
#viewdata-dialog .el-dialog__body {
  padding-left: 40px;
  padding-right: 40px;
  padding-bottom: 0;
  box-sizing: border-box;
}
#viewdata-dialog .el-dialog__footer {
  background-color: #e6e8eb;
}
</style>
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
    .pagination {
      padding-top: 30px;
    }
  }
}
</style>
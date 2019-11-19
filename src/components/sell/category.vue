<template>
  <div>
    <el-button type="primary" @click="addCategory" size="mini">添加产品类别</el-button>

    <!-- 添加弹窗 -->
    <el-dialog :title="title" :visible.sync="dialogVisible" width="60%" :before-close="handleClose">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm demo-form-inline"
        :inline="true"
      >
        <el-form-item label="产品分类编号" prop="categoryId">
          <el-input v-model="ruleForm.categoryId" disabled></el-input>
        </el-form-item>

        <el-form-item label="分类名称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>

        <el-form-item label="描述" prop="remark">
          <el-input v-model="ruleForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="isAddorUpdate">确 定</el-button>
      </span>
    </el-dialog>

    <el-table :data="categoryList" stripe style="width: 100%" size="mini" border>
      <el-table-column label="序号" type="index"></el-table-column>
      <el-table-column
        v-for="col in tableColum"
        :width="col.width"
        :key="col.prop"
        :label="col.lable"
        :prop="col.prop"
      ></el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      @current-change="changePage"
    ></el-pagination>
  </div>
</template>
<script>
import axios from "axios";
import { mapState } from "vuex";
import qs from "querystring";
export default {
  data() {
    return {
      total: 0,
      page: 1,
      title: "",
      isAddorUpdate: this.addConfirm,
      dialogVisible: false,
      categoryList: [],
      tableColum: [
        { prop: "categoryId", lable: "产品分类编号" },
        { prop: "name", lable: "产品类别名称" },
        { prop: "remark", lable: "描述" }
      ],
      ruleForm: {
        remark: "",
        name: "",
        categoryId: ""
      },
      rules: {
        name: [
          { required: true, message: "请输入产品类别名称", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    getList() {
      axios({
        url: "api/main/sell/category/show",
        method: "get",
        params: { page: this.page },

        headers: {
          Authorization: this.token
        }
      }).then(resp => {
        console.log(resp);
        this.categoryList = resp.data.list;
        this.total = resp.data.total;
        // console.log(this.total);
      });
    },
    // 分页
    changePage(p) {
      this.page = p;
      this.getList();
    },
    addCategory() {
      this.dialogVisible = true;
    this.ruleForm.categoryId='';
      this.ruleForm.name='';
      this.ruleForm.remark='';
      this.title = "新产品类别";
    },
    addConfirm() {
      this.dialogVisible = false;
      axios({
        url: "api/main/sell/category/add",
        method: "post",
        data: qs.stringify({
          name: this.ruleForm.name,
          remark: this.ruleForm.remark
        })
      }).then(resp => {
        // console.log(resp);
        if (resp.data.code == 2) {
          this.getList();
        }
      });
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    handleDelete(index, row) {
      this.$confirm("确认删除么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          axios({
            url: "api/main/sell/category/delete",
            method: "post",
            data: qs.stringify({
              categoryId: row.categoryId
            })
          }).then(resp => {
            // console.log(resp);
            this.getList();
          });
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 编辑用户
    handleEdit(index, row) {
      // 获得用户原本信息
      console.log(index, row);
      this.dialogVisible = true;
      this.title = "修改供应商信息";
      this.ruleForm.categoryId = row.categoryId;
      this.ruleForm.name = row.name;
      this.ruleForm.remark = row.remark;
      this.isAddorUpdate = this.updateCategory;
    },
    // 修改信息后发送请求
    updateCategory() {
      this.dialogVisible = false;
      axios({
        url: "api/main/sell/category/update",
        method: "post",
        data: qs.stringify(this.ruleForm)
      }).then(resp => {
         console.log(resp);
        if (resp.data.code == 2) {
          this.getList();
          this.$message({
            type: "success",
            message: "修改成功!"
          });
        }
      });
    }
  },
  mounted() {
    this.getList();
  }
};
</script>
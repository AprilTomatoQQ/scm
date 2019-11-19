<template>
  <div>
    <el-button type="primary" @click="addProduct" size="mini">添加产品</el-button>

    <!-- 添加弹窗 -->
    <el-dialog :title="title" :visible.sync="dialogVisible" width="60%" :before-close="handleClose">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="120px"
        class="demo-ruleForm demo-form-inline"
        :inline="true"
      >
        <el-form-item label="产品编号" prop="productCode">
          <el-input v-model="ruleForm.productCode"></el-input>
        </el-form-item>

        <el-form-item label="产品名称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>

        <el-form-item label="产品分类编号" prop="categoryId">
          <el-select v-model="ruleForm.categoryId" placeholder="请选择产品类别">
            <el-option
              v-for="(item,index) in categoryList"
              :key="index"
              :value="item.categoryId"
              :label="item.name"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="产品销售价" prop="price">
          <el-input v-model="ruleForm.price"></el-input>
        </el-form-item>

        <el-form-item label="数量单位" prop="unitName">
          <el-input v-model="ruleForm.unitName"></el-input>
        </el-form-item>

        <el-form-item label="创建时间" prop="createDate">
          <el-input v-model="ruleForm.createDate" disabled></el-input>
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
<!-- 产品列表 -->
    <el-table :data="productList" stripe style="width: 100%" size="mini" border loading>
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
      categoryList: [],
      count: 1,
      total: 0,
      page: 1,
      title: "",
      loading: true,
      isAddorUpdate: this.addConfirm,
      dialogVisible: false,
      productList: [],
      tableColum: [
        { prop: "productCode", lable: "产品编号" },
        { prop: "name", lable: "产品名称" },
        { prop: "price", lable: "销售价" },
        { prop: "unitName", lable: "数量单位" },
        { prop: "categoryId", lable: "产品分类编号" },
        { prop: "createDate", lable: "创建时间" },
        { prop: "remark", lable: "描述" }
      ],
      ruleForm: {
        productCode: "",
        price: "",
        unitName: "",
        createDate: "",
        remark: "",
        name: "",
        categoryId: ""
      },
      rules: {
        name: [{ required: true, message: "请输入产品名称", trigger: "blur" }],
        productCode: [
          { required: true, message: "请输入产品编号", trigger: "blur" }
        ],
        unitName: [
          { required: true, message: "请输入数量单位", trigger: "blur" }
        ],
        categoryId: [
          { required: true, message: "请输入产品分类编号", trigger: "blur" }
        ],
        price: [
          { required: true, message: "请输入产品销售价", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    getTime() {
      let date = new Date();
      let y = date.getFullYear();
      let m = date.getMonth() + 1;
      let d = date.getDate();
      let h = date.getHours();
      let mm = date.getMinutes();
      let s = date.getSeconds();
      this.ruleForm.createDate = `${y}-${m < 10 ? "0" + m : m}-${
        d < 10 ? "0" + d : d
      } ${h < 10 ? "0" + h : h}:${mm < 10 ? "0" + mm : mm}:${
        s < 10 ? "0" + s : s
      }`;
    },
    getList(page, productCode, name, categoryId) {
      axios({
        url: "api/main/sell/product/show",
        method: "get",
        params: { page, productCode, name, categoryId },

        headers: {
          Authorization: this.token
        }
      }).then(resp => {
        console.log(resp);
        this.productList = resp.data.list;
        this.total = resp.data.total;
        this.loading = false;
        // console.log(this.total);
      });
    },
    // 分页
    changePage(p) {
      this.page = p;
      this.getList(p);
    },
    addProduct() {
      this.dialogVisible = true;
      this.title = "新产品信息";
      this.getTime();
      this.getCategoryList();
    },
    // 获得后台所有产品类别
    getCategoryList(page = 1) {
      axios({
        url: "api/main/sell/category/show",
        method: "get",
        params: { page },
        headers: {
          Authorization: this.token
        }
      }).then(resp => {
        console.log(resp);
        if (resp.data.list.length !== 0) {
          let arr = resp.data.list.reduce((prev, cur) => {
            prev.push({ categoryId: cur.categoryId, name: cur.name });
            return prev;
          }, []);

          this.categoryList = this.categoryList.concat(arr);
          this.count++;
          this.getCategoryList(this.count);
        }
      });
    },

    addConfirm() {
      this.dialogVisible = false;
      axios({
        url: "api/main/sell/product/add",
        method: "post",
        data: qs.stringify(this.ruleForm)
      }).then(resp => {
        // console.log(resp);
        if (resp.data.code == 2) {
          this.getList();
          this.$message({
            type: "success",
            message: "添加成功!"
          });
        } else {
          this.$message({
            type: "info",
            message: "添加失败"
          });
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
    // 删除产品
    handleDelete(index, row) {
      this.$confirm("确认删除么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          axios({
            url: "api/main/sell/product/delete",
            method: "post",
            data: qs.stringify({
              productCode: row.productCode
            })
          }).then(resp => {
            console.log(resp);
            if (resp.data.code == 2) {
              this.getList();
              this.$message({
                type: "success",
                message: "删除成功!"
              });
            } else {
              this.$message({
                type: "info",
                message: "删除失败"
              });
            }
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
      //   console.log(index, row);
      this.dialogVisible = true;
      this.title = "修改产品信息";
      this.ruleForm = row;

      this.isAddorUpdate = this.updateProduct;
    },
    // 修改信息后发送请求
    updateProduct() {
      this.dialogVisible = false;
      axios({
        url: "api/main/sell/product/update",
        method: "post",
        data: qs.stringify(this.ruleForm)
      }).then(resp => {
        // console.log(resp);
        if (resp.data.code == 2) {
          this.getList();
          this.$message({
            type: "success",
            message: "修改成功!"
          });
        } else {
          this.$message({
            type: "info",
            message: resp.data.message
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

<style lang="less">
</style>
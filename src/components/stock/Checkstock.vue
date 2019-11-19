<template>
  <div>
    <el-table :data="stockList" stripe style="width: 100%" size="mini" border loading>
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
          <el-button size="mini" @click="handleCheck(scope.row)">盘点</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      @current-change="changePage"
    ></el-pagination>
    <!-- 盘点弹窗 -->
    <el-dialog title="基本信息" :visible.sync="dialogVisible" width="60%">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm demo-form-inline"
        :inline="true"
      >
        <el-form-item label="产品编号">
          <el-input v-model="ruleForm.productCode" disabled></el-input>
        </el-form-item>

        <el-form-item label="产品原始数量">
          <el-input v-model="ruleForm.originNum" disabled></el-input>
        </el-form-item>

        <el-form-item label="变化数量" prop="num">
          <el-input v-model="ruleForm.num"></el-input>
        </el-form-item>

        <el-form-item label="变化类型" prop="type">
          <el-select v-model="ruleForm.type">
            <el-option label="损耗" value="损耗"></el-option>
            <el-option label="盘余" value="盘余"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="变化原因" prop="description">
          <el-input v-model="ruleForm.description"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmCheck">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";
import { mapState } from "vuex";
export default {
  data() {
    return {
      dialogVisible: false,
      stockList: [],
      ruleForm: {
        productCode: "",
        originNum: "",
        num: 0,
        type: "",
        description: "",
        page: ""
      },
      tableColum: [
        { prop: "productCode", lable: "产品编号" },
        { prop: "name", lable: "产品名称" },
        { prop: "num", lable: "当前库存" },
        { prop: "poNum", lable: "采购在途数" },
        { prop: "soNum", lable: "预销售数" }
      ],

      total: 0,
      page: 1,
      rules: {
        num: [{ required: true, message: "请输入变化数量", trigger: "blur" }],
        type: [{ required: true, message: "请输入变化类型", trigger: "blur" }],
        description: [
          { required: true, message: "请输入损益原因", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    // 分页
    changePage(p) {
      this.page = p;
      this.getList();
    },
    // 获得所有库存
    getList() {
      axios({
        url: "/api/main/stock/query",
        method: "get",
        params: { page: this.page }
      }).then(resp => {
        console.log(resp);
        this.stockList = resp.data.list;
        this.total = resp.data.total;
        this.loading = false;
      });
    },
    handleCheck({ productCode, num }) {
      this.ruleForm = {} 
      this.dialogVisible = true
      this.ruleForm.productCode = productCode;
      this.ruleForm.originNum = num;
    },
    confirmCheck() {
      axios({
        url: "/api/main/stock/checkstock",
        method: "get",
        params: this.ruleForm
      })
        .then(resp => {
          console.log(resp);
          this.getList();
          this.$message({
            type: "success",
            message: resp.data.message
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: resp.data.message
          });
        });
      this.dialogVisible = false;
    }
  },
  mounted() {
    this.getList();
  }
};
</script>
<style lang="less">
</style>
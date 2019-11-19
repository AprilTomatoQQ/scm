<template>
  <div>
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-button type="primary" plain size="mini" @click="addPomain">添加</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="pomainList" stripe style="width: 100%" size="mini" border loading>
      <el-table-column label="序号" type="index"></el-table-column>
      <el-table-column
        v-for="col in tableColum"
        :width="col.width"
        :key="col.prop"
        :label="col.lable"
        :prop="col.prop"
      ></el-table-column>

      <el-table-column label="付款方式">
        <template
          slot-scope="scope"
        >{{scope.row.payType == 1 ? "货到付款":scope.row.payType == 2?"款到发货":'预付款到发货'}}</template>
      </el-table-column>

      <el-table-column label="处理状态">
        <template
          slot-scope="scope"
        >{{scope.row.status == 1 ? "新增":scope.row.status == 2?"已收货":scope.row.status == 3?'已付款':cope.row.status == 4?'已了结':'已预付'}}</template>
      </el-table-column>
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
  computed:{
    ...mapState(['loginUser'])
  },
  data() {
    return {
      editPo: {},
      radio: 1,
      page: 1,
      total: 0,
      pomainList: [],
      ruleForm: {
        poId: "",
        venderCode: "",
        account: "",
        tipFee: "",
        productTotal: "",
        poTotal: "",
        payType: "",
        createTime: "",
        prePayFee: 0,
        remark: "",
        status: "1",
        poitems: [
          /* {
            productCode: "",
            unitPrice: "",
            num: "",
            unitName: "",
            itemPrice: ""
          } */
        ]
      },
      tableColum: [
        { prop: "poId", lable: "采购单编号" },
        { prop: "venderCode", lable: "供应商编号" },
        { prop: "tipFee", lable: "附加费用" },
        { prop: "productTotal", lable: "产品总价" },
        { prop: "poTotal", lable: "采购总价" },
        // { prop: "payType", lable: "付款方式" },
        { prop: "prePayFee", lable: "最低预付款金额" },
        { prop: "account", lable: "创建用户" },
        { prop: "createTime", lable: "创建时间" }
      ]
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
      this.ruleForm.createTime = `${y}-${m < 10 ? "0" + m : m}-${
        d < 10 ? "0" + d : d
      } ${h < 10 ? "0" + h : h}:${mm < 10 ? "0" + mm : mm}:${
        s < 10 ? "0" + s : s
      }`;
    },
    addPomain() {
      location.href = "http://localhost:8080/#/purchase/pomain";
      this.$store.commit("reset", {});

      this.ruleForm.poId = new Date().getTime();
      this.getTime();
      this.ruleForm.account = this.loginUser;

      this.$store.commit('reset',this.ruleForm)
    },
    // 分页
    changePage(p) {
      this.page = p;
      this.getList();
    },

    getList() {
      axios({
        url: "/api/main/purchase/pomain/show",
        method: "get",
        params: { type: this.ruleForm.status }
      }).then(resp => {
        console.log(resp);
        this.pomainList = resp.data.list;
        this.total = resp.data.total;
        this.loading = false;
      });
    },
    // 删除新增状态的采购单
    handleDelete(index, row) {
      this.$confirm("确认删除么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          axios({
            url: "/api/main/purchase/pomain/delete",
            method: "post",
            data: qs.stringify({
              poId: row.poId
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

    // 获取要修改的采购单的产品信息
    getEditQueryItem() {
      axios({
        url: "/api/main/purchase/pomain/queryItem",
        method: "get",
        params: { poId: this.ruleForm.poId }
      }).then(resp => {
        console.log(resp);
        this.ruleForm.poitems = resp.data;
        this.$store.commit("addDetail", this.ruleForm);
        location.href = "http://localhost:8080/#/purchase/pomain";
      });
    },
    // 修改新增状态的采购单
    handleEdit(index, row) {
      this.$store.commit("addDetail", index);

      axios({
        url: "/api/main/purchase/pomain/show",
        method: "get",
        params: { type: "1" }
      }).then(resp => {
        //  console.log(resp);

        this.editPo = resp.data.list[index];
        this.ruleForm = this.editPo;
        this.getEditQueryItem();
        this.loading = false;
        console.log(this.ruleForm);
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
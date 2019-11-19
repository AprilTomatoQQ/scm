<template>
  <div>
    <el-form ref="form" :model="form" label-width="80px" :inline="true" size="mini">
      <el-form-item label="选择年月">
        <el-date-picker v-model="form.time" type="month" placeholder="选择月" value-format="yyyy-MM"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <!-- 报表 -->
    <p>产品总库存数:{{totalnum}}</p>

    <!-- 详情 -->

    <el-table :data="stockList" stripe style="width: 100%" size="mini" border>
      <el-table-column
        v-for="col in tableDetail"
        :width="col.width"
        :key="col.prop"
        :label="col.label"
        :prop="col.prop"
      ></el-table-column>
    </el-table>
    <el-pagination
      background
      :current-page='form.page'
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
import { log } from "util";

export default {
  data() {
    return {
        curPage:1,
    totalnum:0,
      stockList: [],
      total: 0,
      form: { time: "" },
      value2: "",
      tableDetail: [
        { prop: "ProductCode", label: "产品编号" },
        { prop: "name", label: "产品名称" },
        { prop: "num", label: "产品库存" },
      
      ]
    };
  },
  methods: {
    changePage(p) {
      this.form.page = p;
      this.getReport();
    },
    onSubmit() {
        this.form.page=1
      this.getReport();
    
    },
    // 获得report
    getReport() {
      axios({
        url: "/api/main/report/stock/main",
        method: "get",
        params: this.form
      }).then(resp => {
        console.log(resp);
        this.totalnum=resp.data.totalNum
        this.stockList=resp.data.details.list
        this.total=resp.data.details.total
      });
    }
  }
};
</script>


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

    <el-table :data="financeReport" stripe style="width: 100%" size="mini" border>
      <el-table-column
        v-for="col in tableColum"
        :key="col.prop"
        :label="col.label"
        :prop="col.prop"
      ></el-table-column>
    </el-table>

    <!-- 详情 -->

    <el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
      <el-tab-pane label="收款明细" name="first">
        <el-table :data="receList" stripe style="width: 100%" size="mini" border loading>
          <el-table-column label="序号" type="index"></el-table-column>
          <el-table-column
            v-for="col in receTable"
            :width="col.width"
            :key="col.prop"
            :label="col.label"
            :prop="col.prop"
          ></el-table-column>

          <el-table-column label="处理状态">
            <template
              slot-scope="scope"
            >{{scope.row.status == 1 ? "新增":scope.row.status == 2?"已发货":scope.row.status == 3?'已收款':scope.row.status == 4?'已了结':'已预付'}}</template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          :current-page='form.page'
          layout="prev, pager, next"
          :total="total"
          @current-change="RchangePage"
        ></el-pagination>
      </el-tab-pane>

      <el-tab-pane label="付款明细" name="second">
        <el-table :data="receList" stripe style="width: 100%" size="mini" border loading>
          <el-table-column label="序号" type="index"></el-table-column>
          <el-table-column
            v-for="col in payTable"
            :width="col.width"
            :key="col.prop"
            :label="col.label"
            :prop="col.prop"
          ></el-table-column>

          <el-table-column label="处理状态">
            <template
              slot-scope="scope"
            >{{scope.row.status == 1 ? "新增":scope.row.status == 2?"已收货":scope.row.status == 3?'已付款':scope.row.status == 4?'已了结':'已预付'}}</template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          :current-page='form.page'
          layout="prev, pager, next"
          :total="total"
          @current-change="PchangePage"
        ></el-pagination>
      </el-tab-pane>
    </el-tabs>

    <!-- <el-table :data="soList" stripe style="width: 100%" size="mini" border>
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
      layout="prev, pager, next"
      :total="total"
      @current-change="changePage"
    ></el-pagination>-->
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
      receList: [],
      activeName2: "first",
      soList: [],
      total: 0,
      financeReport: [],
      form: { time: "" },
      value2: "",
      tableColum: [
        { prop: "payCount", label: "付款交易次数" },
        { prop: "payPrice", label: "付款总金额" },
        { prop: "receCount", label: "收款交易次数" },
        { prop: "recePrice", label: "收款总金额" }
      ],
      payTable: [
        { prop: "poid", label: "采购单号" },
        { prop: "createTime", label: "创建日期" },
        { prop: "pay_time", label: "付款日期" },
        { prop: "pay_price", label: "付款金额" },
        { prop: "account", label: "经手人" }
      ],
      receTable: [
        { prop: "soid", label: "销售单号" },
        { prop: "createTime", label: "创建日期" },
        { prop: "pay_time", label: "收款日期" },
        { prop: "pay_price", label: "收款金额" },
        { prop: "account", label: "经手人" }
      ]
    };
  },
  methods: {
    RchangePage(p) {
      this.form.page = p;
      this.getReceList();
    },
    PchangePage(p) {
      this.form.page = p;
      this.getPayList();
    },

    onSubmit() {
      this.getReport();
      this.getReceList();
    },
    // 获得report
    getReport() {
      axios({
        url: "/api/main/report/payment/main",
        method: "get",
        params: this.form
      }).then(resp => {
        console.log(resp);
        this.financeReport[0] = resp.data;
        this.financeReport = Array.from(this.financeReport);
      });
    },
    // 获取收款明细
    getReceList() {
      axios({
        url: "/api/main/report/payment/detail/receipt",
        method: "get",
        params: this.form
      }).then(resp => {
        console.log(resp);
        this.total = resp.data.total;
        this.receList = resp.data.list;
      });
    },
    // 获取付款明细
    getPayList() {
      axios({
        url: "/api/main/report/payment/detail/pay",
        method: "get",
        params: this.form
      }).then(resp => {
        console.log(resp);
        this.total = resp.data.total;
        this.receList = resp.data.list;
      });
    },

    handleClick(tab, event) {
      if (tab.name == "first") {
        this.form.page = 1;
        this.getReceList();
      } else {
        this.form.page = 1;
        this.getPayList();
      }
    }
  }
};
</script>


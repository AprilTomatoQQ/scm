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

     <el-table :data="soreport" stripe style="width: 100%" size="mini" border>
      <el-table-column
        v-for="col in tableColum"
        :key="col.prop"
        :label="col.label"
        :prop="col.prop"
      ></el-table-column>
    </el-table> 

    <!-- 详情 -->

     <el-table :data="soList" stripe style="width: 100%" size="mini" border>
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
        soList:[],
        total:0,
      soreport: [],
      form: { time: ""},
      value2: "",
      tableColum: [
        { prop: "productTotal", label: "出库产品总金额" },
        { prop: "total", label: "出库单据数" },
        { prop: "totalNum", label: "产品总数量" }
      ],
      tableDetail: [
        { prop: "soId", label: "销售单编号" },
        { prop: "stockTime", label: "入库日期" },
        { prop: "productCode", label: "产品编号" },
        { prop: "name", label: "产品名称" },
        { prop: "stockNum", label: "产品数"},
        { prop: "productTotal", label: "产品总金额" }

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
        url: "/api/main/report/outstock/main",
        method: "get",
        params: this.form
      }).then(resp => {
        console.log(resp);
        this.soreport[0] = resp.data
        this.total=resp.data.total
        this.soList=resp.data.details.list
        this.soreport = Array.from(this.soreport)
         console.log(this.soreport);
         
         })
    
    }
  }
};
</script>


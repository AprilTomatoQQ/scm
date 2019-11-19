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

    <el-table :data="poreport" stripe style="width: 100%" size="mini" border>
      <el-table-column
        v-for="col in tableColum"
        :key="col.prop"
        :label="col.label"
        :prop="col.prop"
      ></el-table-column>
    </el-table>

    <!-- 详情 -->

     <el-table :data="poList" stripe style="width: 100%" size="mini" border>
      <el-table-column
        v-for="col in tableDetail"
        :width="col.width"
        :key="col.prop"
        :label="col.label"
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
        >{{scope.row.status == 1 ? "新增":scope.row.status == 2?"已发货":scope.row.status == 3?'已收款':scope.row.status == 4?'已了结':'已预付'}}</template>
      </el-table-column>
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
        poList:[],
        total:0,
      poreport: [],
      form: { time: ""},
      value2: "",
      tableColum: [
        { prop: "endtotalnum", label: "已了结数" },
        { prop: "totalnum", label: "销售单总数" },
        { prop: "sototal", label: "销售单总金额" },
        { prop: "totalpay", label: "已付款金额" }
      ],
      tableDetail: [
        { prop: "soId", label: "销售单编号" },
        { prop: "customerCode", label: "客户编号" },
        { prop: "createTime", label: "创建日期" },
        { prop: "account", label: "创建用户" },
        { prop: "soTotal", label: "销售单总金额" },
        { prop: "prePayFee", label: "最低预付款金额" },
        { prop: "unpaid", label: "未收款金额" }

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
        url: "/api/main/report/somain/main",
        method: "get",
        params: this.form
      }).then(resp => {
        console.log(resp);
        this.poreport[0] = resp.data
        this.total=resp.data.totalnum
        this.poList=resp.data.details.list
        this.poreport = Array.from(this.poreport)
         console.log(this.poreport);
         this.poList.map(item=>{
             if(item.payType==1){
                 if(item.status==1||item.status==2){item.unpaid=item.poTotal}
                 else{item.unpaid=0}
             }else if(item.payType==2){
                 if(item.status==1){item.unpaid=item.poTotal}
                 else{item.unpaid=0}
             }else{
                 if(item.status==1){item.unpaid=item.poTotal}
                 else if(item.status==5){item.unpaid==item.poTotal-item.prePayFee}
                 else{item.unpaid=0}
             }
         })
         })
    
    }
  }
};
</script>


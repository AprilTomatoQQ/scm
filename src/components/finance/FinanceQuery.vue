<template>
  <div>
    <el-form :inline="true" :model="formInline" class="demo-form-inline" size="mini">
      <el-form-item label="收支类型">
        <el-select v-model="formInline.type">
          <el-option label="收入" value="收入"></el-option>
          <el-option label="支出" value="支出"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="相关单据号">
        <el-input v-model="formInline.no"></el-input>
      </el-form-item>
      <el-form-item label="日期范围">
        <div class="block">
          <span class="demonstration"></span>
          <el-date-picker
            v-model="value7"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions2"
            @change="pickDate"
          ></el-date-picker>
        </div>
      </el-form-item>

      <el-form-item label="付款方式">
        <el-select v-model="formInline.payType">
          <el-option label="货到付款" :value="1"></el-option>
          <el-option label="款到发货" :value="2"></el-option>
          <el-option label="预付款到发货" :value="3"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>

    <!-- 查询结果 -->
    <el-table :data="Flist" stripe style="width: 100%" size="mini" border loading>
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
    </el-table>

    <el-pagination
      background
      :current-page="formInline.page"
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
      Flist: [],
      total: 0,
      formInline: {
        type: "",
        payType: "",
        startDate: "",
        endDate: "",
        no: "",
        page: 1
      },
      tableColum: [
        { prop: "ordercode", lable: "相关单据号" },
        { prop: "account", lable: "创建用户" },

        { prop: "payTime", lable: "日期" },
        { prop: "payPrice", lable: "金额" }
      ],
      // 日期选择器
      pickerOptions2: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      value7: ""
    };
  },
  methods: {
    changePage(p) {
      this.formInline.page = p;
      this.getList();
    },
    pickDate() {
      let sdate = new Date(this.value7[0]);
      let y = sdate.getFullYear();
      let m = sdate.getMonth() + 1;
      let d = sdate.getDate();
      this.formInline.startDate = `${y}-${m < 10 ? "0" + m : m}-${
        d < 10 ? "0" + d : d
      }`;

      let edate = new Date(this.value7[1]);
      let ey = edate.getFullYear();
      let em = edate.getMonth() + 1;
      let ed = edate.getDate();
      this.formInline.endDate = `${ey}-${em < 10 ? "0" + em : em}-${
        ed < 10 ? "0" + ed : ed
      }`;
      console.log(this.formInline.startDate);
    },
    getList() {
      axios({
        url: "/api/main/finance/query",
        method: "get",
        params: this.formInline
      }).then(resp => {
        console.log(resp);

        this.Flist = resp.data.list;
        this.total = resp.data.total;
      });
    },
    // 发送请求
    onSubmit() {
      console.log(this.value7);
      this.formInline.page=1;
            this.getList();
    }
  }
};
</script>
<style lang="less">
</style>
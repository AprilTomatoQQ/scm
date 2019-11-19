<template>
  <div>
    <el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
      <el-tab-pane label="货到付款" name="first">
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
            >{{scope.row.status == 1 ? "新增":scope.row.status == 2?"已收货":scope.row.status == 3?'已付款':scope.row.status == 4?'已了结':'已预付'}}</template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleInstock(scope.$index, scope.row)">确认入库</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          layout="prev, pager, next"
          :total="total"
          @current-change="changePage"
        ></el-pagination>
      </el-tab-pane>
      <el-tab-pane label="款到发货" name="second">
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
            >{{scope.row.status == 1 ? "新增":scope.row.status == 2?"已收货":scope.row.status == 3?'已付款':scope.row.status == 4?'已了结':'已预付'}}</template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleInstock(scope.$index, scope.row)">确认入库</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          layout="prev, pager, next"
          :total="total"
          @current-change="changePage"
        ></el-pagination>
      </el-tab-pane>

      <el-tab-pane label="预付款到发货" name="third">
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
            >{{scope.row.status == 1 ? "新增":scope.row.status == 2?"已收货":scope.row.status == 3?'已付款':scope.row.status == 4?'已了结':'已预付'}}</template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleInstock(scope.$index, scope.row)">确认入库</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          background
          layout="prev, pager, next"
          :total="total"
          @current-change="changePage"
        ></el-pagination>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";
import qs from "querystring";
export default {
  computed: {
    ...mapState(["loginUser"])
  },
  data() {
    return {
      activeName2: "first",
      page: 1,
      total: 0,
      pomainList: [],
      tableColum: [
        { prop: "poId", lable: "采购单编号" },
        { prop: "venderCode", lable: "供应商编号" },
        { prop: "tipFee", lable: "附加费用" },
        { prop: "productTotal", lable: "产品总价" },
        { prop: "poTotal", lable: "采购总价" },
        { prop: "prePayFee", lable: "最低预付款金额" },
        { prop: "account", lable: "创建用户" },
        { prop: "createTime", lable: "创建时间" }
      ]
    };
  },

  methods: {
    // 分页
    changePage(p) {
      this.page = p;
      this.getList();
    },

    getList(payCode, statusCode) {
      axios({
        url: "/api/main/purchase/pomain/query",
        method: "get",
        params: { payType: payCode, status: statusCode }
      }).then(resp => {
        console.log(resp);
        this.pomainList = resp.data.list;
        this.total = resp.data.total;
        this.loading = false;
      });
    },
    handleClick(tab, event) {
      console.log(tab);

      if (tab.$el.id == "pane-second") {
        this.getList("2", "3");
      } else if (tab.$el.id == "pane-first") {
        this.getList("1", "1");
      } else {
        this.getList("3", "5");
      }
    },

    handleInstock(index, row) {
      this.$confirm("确认入库么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          axios({
            url: "/api/main/stock/instock",
            method: "get",
            params: { payType: row.payType, poId: row.poId }
          }).then(resp => {
            console.log(resp);
            this.getList(row.payType,row.status);
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
        })
    }
  },
  mounted() {
    this.getList("1", "1");
  }
};
</script>
<style lang="less">
</style>
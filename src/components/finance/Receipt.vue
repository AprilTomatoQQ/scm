<template>
  <div>
    <el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
      <el-tab-pane label="货到付款" name="first">
        <el-table :data="somainList" stripe style="width: 100%" size="mini" border loading>
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
            >{{scope.row.status == 1 ? "新增":scope.row.status == 2?"已发货":scope.row.status == 3?'已收款':scope.row.status == 4?'已了结':'已预付'}}</template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-button size="mini" @click="handlePay(scope.$index, scope.row)" type="primary">收款</el-button>
              <el-button size="mini" @click="detail(scope.row)">详情</el-button>
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
        <el-table :data="somainList" stripe style="width: 100%" size="mini" border loading>
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
            >{{scope.row.status == 1 ? "新增":scope.row.status == 2?"已发货":scope.row.status == 3?'已收款':scope.row.status == 4?'已了结':'已预付'}}</template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-button size="mini" @click="handlePay(scope.$index, scope.row)" type="primary">收款</el-button>
              <el-button size="mini" @click="detail(scope.row)">详情</el-button>
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
        <el-table :data="somainList" stripe style="width: 100%" size="mini" border loading>
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
            >{{scope.row.status == 1 ? "新增":scope.row.status == 2?"已发货":scope.row.status == 3?'已收款':scope.row.status == 4?'已了结':'已预付'}}</template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-button size="mini" @click="handlePay(scope.$index, scope.row)" type="primary">收款</el-button>
              <el-button size="mini" @click="detail(scope.row)">详情</el-button>
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

    <!-- 详情弹窗 -->

    <el-dialog title="销售单详情" :visible.sync="dialogVisible" width="80%">
      <el-table :data="soDetail" border style="width: 100%" size="mini">
        <el-table-column prop="productCode" label="产品编号" width="180">
          <template slot-scope="scope">
            <el-input size="mini" v-model="scope.row.productCode" disabled></el-input>
          </template>
        </el-table-column>

        <el-table-column prop="productName" label="产品名称" width="180">
          <template slot-scope="scope">
            <el-input size="mini" v-model="scope.row.productName" disabled></el-input>
          </template>
        </el-table-column>

        <el-table-column prop="unitName" label="数量单位" width="180">
          <template slot-scope="scope">
            <el-input size="mini" v-model="scope.row.unitName" disabled></el-input>
          </template>
        </el-table-column>

        <el-table-column prop="unitPrice" label="产品单价" width="180">
          <template slot-scope="scope">
            <el-input size="mini" v-model="scope.row.unitPrice" disabled></el-input>
          </template>
        </el-table-column>

        <el-table-column prop="num" label="产品数量" width="180">
          <template slot-scope="scope">
            <el-input size="mini" v-model="scope.row.num" disabled></el-input>
          </template>
        </el-table-column>

        <el-table-column prop="itemPrice" label="明细总价" width="180">
          <template slot-scope="scope">
            <el-input size="mini" v-model="scope.row.itemPrice" disabled></el-input>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>


<script>
import axios from "axios";
import { mapState } from "vuex";
import qs from "querystring";
export default {
  data() {
    return {
      soDetail:[],
      dialogVisible:false,
      activeName2: "first",
      payCode: "1",
      typeCode: "3",
      total: 0,
      type: "1",
      somainList: [],
      tableColum: [
        { prop: "soId", lable: "采购单编号" },
        { prop: "CustomerCode", lable: "供应商编号" },
        { prop: "tipFee", lable: "附加费用" },
        { prop: "productTotal", lable: "产品总价" },
        { prop: "soTotal", lable: "采购总价" },
        { prop: "prePayFee", lable: "最低预付款金额" },
        { prop: "account", lable: "创建用户" },
        { prop: "createTime", lable: "创建时间" }
      ]
    };
  },

  methods: {
    // 分页
    changePage(p) {
      this.getList(p);
    },
    // 获取销售单详情

    detail(row){
      console.log(row);
      
this.dialogVisible=true
  axios({
        url: "/api/main/sell/somain/queryItem",
        method: "get",
        params: { soId:row.soId }
      }).then(resp => {
        console.log(resp);
        this.soDetail=resp.data
        
      });
    },

    // 获取销售单列表
    getList(page = 1) {
      axios({
        url: "/api/main/sell/somain/show",
        method: "get",
        params: { payType: this.payCode, type: this.typeCode, page }
      }).then(resp => {
        console.log(resp);
        this.somainList = resp.data.list;
        this.total = resp.data.total;
        this.loading = false;
      });
    },
    handleClick(tab, event) {
      console.log(tab);

      if (tab.$el.id == "pane-second") {
        this.payCode = "2";
        this.typeCode = "3";
        this.getList();
      } else if (tab.$el.id == "pane-first") {
        this.payCode = "1";
        this.typeCode = "3";
        this.getList();
      } else {
        this.payCode = "3";
        this.typeCode = "3";
        this.getList();
      }
    },
    // 点击收款
    handlePay(index, row) {
      this.$confirm("确认收款么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
          if(row.payType=='3'&&row.status=='1'){
              this.type='2'
          }
        axios({
          url: "/api/main/finance/receipt",
          method: "get",
          params: { type: this.type, soId: row.soId }
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
      }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消确认'
          });          
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
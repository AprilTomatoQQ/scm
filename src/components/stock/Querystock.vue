<template>
  <div>
    <el-form :inline="true" :model="formInline" class="demo-form-inline" size="mini" >
      <el-form-item label="产品编号" prop="productCode">
        <el-input v-model="formInline.productCode"></el-input>
      </el-form-item>
      <el-form-item label="产品名称" >
        <el-input v-model="formInline.name"></el-input>
      </el-form-item>
      <el-form-item label="库存数量最小值" prop="min">
        <el-input v-model="formInline.min"></el-input>
      </el-form-item>
      <el-form-item label="库存数量最大值" prop="max">
        <el-input v-model="formInline.max"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>

    <!-- 查询结果 -->

    <el-table :data="stockList" stripe style="width: 100%" size="mini" border loading>
      <el-table-column label="序号" type="index"></el-table-column>
      <el-table-column
        v-for="col in tableColum"
        :width="col.width"
        :key="col.prop"
        :label="col.label"
        :prop="col.prop"
      ></el-table-column>

      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button size="mini" @click="checkList(scope.row)">库存变更记录</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      @current-change="changePage"
    ></el-pagination>

    <!-- 弹窗显示库存变更记录 -->
    <el-dialog title="采购单详情" :visible.sync="dialogVisible" width="80%">
      <el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
        <el-tab-pane label="入库记录信息" name="first">
           <el-table :data="instockList" stripe style="width: 100%" size="mini" border loading>
            <el-table-column label="序号" type="index"></el-table-column>
            <el-table-column
              v-for="col in instockTable"
              :width="col.width"
              :key="col.prop"
              :label="col.label"
              :prop="col.prop"
            ></el-table-column>
            <el-table-column label="入库类型">
            <template slot-scope="scope">
                {{scope.row.stockType == 1 ? "采购入库":"盘点入库"}}
                </template>
            </el-table-column>
          </el-table>
          <el-pagination
            background
            layout="prev, pager, next"
            :total="total"
            @current-change="DchangePage"
          ></el-pagination>
        </el-tab-pane>

        <el-tab-pane label="出库记录信息" name="second">

            <el-table :data="instockList" stripe style="width: 100%" size="mini" border loading>
            <el-table-column label="序号" type="index"></el-table-column>
            <el-table-column
              v-for="col in outstockTable"
              :width="col.width"
              :key="col.prop"
              :label="col.label"
              :prop="col.prop"
            ></el-table-column>
            <el-table-column label="出库类型">
            <template slot-scope="scope">
                {{scope.row.stockType == 1 ? "销售出库":"盘点出库"}}
                </template>
            </el-table-column>
          </el-table>
          <el-pagination
            background
            layout="prev, pager, next"
            :total="total"
            @current-change="DchangePage"
          ></el-pagination>
        </el-tab-pane>
      </el-tabs>
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
      total: 0,
      stockType: 1,
      productCode: "",
      stockList: [],
      activeName2: "first",
      instockTable: [
        { prop: "createUser", label: "入库经手人" },
        { prop: "orderCode", label: "相关采购单号" },
        { prop: "stockNum", label: "入库数量" },
        { prop: "stockTime", label: "入库时间" },
        // { prop: stockType, label: "入库类型" }
      ],
      outstockTable: [
        { prop: "createUser", label: "出库经手人" },
        { prop: "orderCode", label: "相关销售单号" },
        { prop: "stockNum", label: "出库数量" },
        { prop: "stockTime", label: "出库时间" },
        // { prop: stockType, label: "出库类型" }
      ],
      instockList: [],
      dialogVisible: false,
      formInline: {
        productCode: "",
        name: "",
        min: 0,
        max: 0,
        page: 1
      },
      tableColum: [
        { prop: "productCode", label: "产品编号" },
        { prop: "name", label: "产品名称" },
        { prop: "num", label: "当前库存" },
        { prop: "poNum", label: "采购在途数" },
        { prop: "soNum", label: "预销售数" }
      ],
      
    /*   rules: {
        productCode: [{ type: 'number', message: '必须为数字值' },],
        min: [{ type: 'number', message: '必须为数字值'}],
        max: [{ type: 'number', message: '必须为数字值' }],
      } */
    };
  },
  methods: {
    changePage(p) {
      this.formInline.page = p;
      this.getList();
    },
    DchangePage(p){
        this.getCheckList(p)
    },

    handleClick(tab, event) {
      console.log(tab);
      if (tab.name == "first") {
        this.stockType = 1;
        this.getCheckList();
      } else {
        this.stockType = 2;
        this.getCheckList();
      }
    },
    // 获取库存数据
    getList() {
      axios({
        url: "/api/main/stock/query",
        method: "get",
        params: this.formInline
      }).then(resp => {
        console.log(resp);
        this.stockList = resp.data.list;
        this.total=resp.data.total
      });
    },
    // 获取库存变更记录
    getCheckList(page) {
      axios({
        url: "/api/main/stock/alterRecord",
        method: "get",
        params: {page, productCode: this.productCode, stockType: this.stockType}
      }).then(resp => {
        console.log(resp);
        this.instockList = resp.data.data.list;
        this.total=resp.data.data.total
        console.log(this.instockList);
        
      });
    },

    onSubmit() {
      this.getList();
    },
    checkList(row) {
      this.dialogVisible = true;
      this.productCode = row.productCode;
      this.getCheckList(1)
    }
  }
};
</script>
<style lang="less">
</style>
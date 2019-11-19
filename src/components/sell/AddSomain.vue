<template>
  <div>
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-button type="primary" plain size="mini" @click="addSoitems">新增明细</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="success" plain size="mini" @click="save('ruleForm')">保存</el-button>
      </el-form-item>
    </el-form>
    <!-- 添加采购单 -->
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="140px"
      class="demo-ruleForm demo-form-inline"
      :inline="true"
      size="mini"
    >
      <el-form-item label="销售单编号">
        <el-input v-model="ruleForm.soId" disabled></el-input>
      </el-form-item>

      <el-form-item label="客户编号" prop="customerCode">
        <el-select v-model="ruleForm.customerCode" placeholder="请选择客户编号">
          <el-option
            v-for="(item,index) in customerList"
            :key="index"
            :value="item.customerCode"
            :label="item.name"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="创建用户" prop="account">
        <el-input v-model="ruleForm.account" disabled></el-input>
      </el-form-item>

      <el-form-item label="附加费用" prop="tipFee">
        <el-input v-model="ruleForm.tipFee" @change="getItemPrice"></el-input>
      </el-form-item>

      <el-form-item label="产品总价" prop="productTotal">
        <el-input v-model="ruleForm.productTotal" disabled></el-input>
      </el-form-item>

      <el-form-item label="销售总价">
        <el-input v-model="ruleForm.soTotal" disabled></el-input>
      </el-form-item>

      <el-form-item label="付款方式" prop="payType">
        <el-select v-model="ruleForm.payType" placeholder="请选择付款方式">
          <el-option label="货到付款" :value="1"></el-option>
          <el-option label="款到发货" :value="2"></el-option>
          <el-option label="预付款到发货" :value="3"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="最低预付款金额" prop="prePayFee" v-if="ruleForm.payType==3">
        <el-input v-model="ruleForm.prePayFee"></el-input>
      </el-form-item>

      <el-form-item label="销售单状态" prop="status">
        <el-select v-model="ruleForm.status" placeholder="请选择状态" disabled>
          <el-option label="新增" value="1" selected></el-option>
          <el-option label="已发货" value="2"></el-option>
          <el-option label="已收款" value="3"></el-option>
          <el-option label="已了结" value="4"></el-option>
          <el-option label="已预付" value="5"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="创建时间" prop="createTime">
        <el-input v-model="ruleForm.createTime" disabled></el-input>
      </el-form-item>

      <el-form-item label="备注" prop="remark">
        <el-input v-model="ruleForm.remark"></el-input>
      </el-form-item>
    </el-form>

    <!-- 产品明细表 -->

    <el-table :data="ruleForm.soitems" border style="width: 100%" size="mini">
      <el-table-column prop="productCode" label="产品编号" width="180">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.productCode" disabled>
            <template slot="append">
              <i class="el-icon-edit-outline" @click="showList(scope.$index)"></i>
            </template>
          </el-input>
        </template>
      </el-table-column>

      <el-table-column prop="unitName" label="数量单位" width="180">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.unitName" disabled></el-input>
        </template>
      </el-table-column>

      <el-table-column prop="unitPrice" label="产品单价" width="180" >
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.unitPrice" @change="getItemPrice" oninput='value=value.replace(/[^\d]/, "")'></el-input>
        </template>
      </el-table-column>

      <el-table-column label="产品数量" width="180">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.num" @change="getItemPrice" oninput='value=value.replace(/[^\d]/)'></el-input>
        </template>
      </el-table-column>

      <el-table-column prop="itemPrice" label="明细总价" width="180">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.itemPrice" disabled ></el-input>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 选择产品弹窗 -->

    <el-dialog title="产品列表" :visible.sync="dialogTableVisible">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item>
          <el-button type="primary" plain size="mini" @click="confirm">确定</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" plain size="mini">取消</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="productList" stripe style="width: 100%" size="mini" border loading>
        <el-table-column width="100">
          <template slot-scope="scope">
            <el-radio v-model="radio" :label="scope.$index"></el-radio>
          </template>
        </el-table-column>
        <el-table-column
          v-for="col in tableColum"
          :width="col.width"
          :key="col.prop"
          :label="col.lable"
          :prop="col.prop"
        ></el-table-column>
      </el-table>
      <!-- 弹窗分页 -->
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        @current-change="changePage"
      ></el-pagination>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";
import { mapState } from "vuex";
import qs from "querystring";
export default {
  computed: {
    ...mapState(["addSomain", "isAddorUpdate"])
  },
  data() {
    return {
      soitemsIndex: 0,
      radio: 1,
      page: 1,
      total: 0,
      productList: [],
      customerList: [],
      tableColum: [
        { prop: "productCode", lable: "产品编号" },
        { prop: "name", lable: "产品名称" },
        { prop: "unitName", lable: "数量单位" }
      ],

      dialogTableVisible: false,
      itemList: [],
      ruleForm: {
        soId: "",
        customerCode: "",
        account: "",
        tipFee: "",
        productTotal: "",
        soTotal: "",
        paytype: "",
        createTime: "",
        prePayFee: 0,
        remark: "",
        status: "",
        soitems: [
          {
            productCode: "",
            unitPrice: "",
            num: "",
            unitName: "",
            itemPrice: ""
          }
        ]
      },
      rules: {
        customerCode: [
          { required: true, message: "请选择供应商编号", trigger: "blur" }
        ],
        tipFee: [
          {
            required: true,
            pattern: /^[0-9]+\.[0-9]{2}$/,
            message: "请输入附加费用(保留2位小数)",
            trigger: "blur"
          }
        ],
        prePayFee: [
          { required: true, message: "请输入最低预付金额", trigger: "blur" }
        ],
        payType: [
          { required: true, message: "请选择付款方式", trigger: "blur" }
        ],
        status: [
          { required: true, message: "请选择采购单状态", trigger: "blur" }
        ]
      }
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
    addSoitems() {
      console.log("111");

      this.ruleForm.soitems.push({
        productCode: "",
        unitPrice: "",
        num: "",
        unitName: "",
        itemPrice: ""
      });
    },

    // 获取客户编号
    getCustomerList() {
      axios({
        url: "api/main/sell/customer/all",
        method: "get"
      }).then(resp => {
        // console.log(resp);
        this.customerList = resp.data;
      });
    },

    // 获取产品总价
    getItemPrice() {
      // const n = this.ruleForm.soitems[this.soitemsIndex];
      // n.num = Number(this.ruleForm.soitems[this.soitemsIndex].num);
      // this.ruleForm.soitems[this.soitemsIndex].unitPrice = Number(
      //   this.ruleForm.soitems[this.soitemsIndex].unitPrice
      // );
      this.ruleForm.soitems[this.soitemsIndex].itemPrice =
        this.ruleForm.soitems[this.soitemsIndex].num *
        this.ruleForm.soitems[this.soitemsIndex].unitPrice;
      this.ruleForm.productTotal = this.ruleForm.soitems.reduce((pre, cur) => {
        pre += cur.itemPrice;
        return pre;
      }, 0);
      this.ruleForm.soTotal =
        Number(this.ruleForm.productTotal) + Number(this.ruleForm.tipFee);
    },

    showList(index) {
      this.dialogTableVisible = true;
      this.getList();
      this.soitemsIndex = index;
    },
    // 产品明细删除按钮
    handleDelete(index) {
      this.$confirm("确认删除么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
          this.ruleForm.soitems.splice(index, 1);
          this.ruleForm.productTotal = this.ruleForm.soitems.reduce((pre, cur) => {
        pre += cur.itemPrice;
        return pre;
      }, 0);
      this.ruleForm.soTotal =
        Number(this.ruleForm.productTotal) + Number(this.ruleForm.tipFee);
          
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        }).catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    // 弹窗分页
    changePage(p) {
      this.page = p;
      this.getList(p);
    },

    // 获得产品列表
    getList(page, productCode, name, categoryId) {
      axios({
        url: "api/main/sell/product/show",
        method: "get",
        params: { page, productCode, name, categoryId },

        headers: {
          Authorization: this.token
        }
      }).then(resp => {
        // console.log(resp);
        this.productList = resp.data.list;
        this.total = resp.data.total;
        this.loading = false;
      });
    },
    // 确认选择产品按钮
    confirm() {
      const selected = this.productList[this.radio];
      this.ruleForm.soitems[this.soitemsIndex].productCode =
        selected.productCode;
      this.ruleForm.soitems[this.soitemsIndex].unitName = selected.unitName;
      this.dialogTableVisible = false;
      // console.log(selected);
    },

    save(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          axios({
            url: `/api/main/sell/somain/${this.isAddorUpdate}`,
            method: "post",
            headers: { "Content-Type": "application/json" },
            data: JSON.stringify(this.ruleForm)
          }).then(resp => {
            console.log(resp);
            if (resp.data.code == 2) {
              this.$message({
                type: "success",
                message: resp.data.message
              });
            } else {
              this.$message({
                type: "info",
                message: resp.data.message
              });
            }
          });setTimeout(()=>{ location.href = "http://localhost:8080/#/sell/newsomain"},1000)
         
        }else{
          return false
        }
      });
    }
  },

  mounted() {
    this.getCustomerList();

    this.ruleForm = this.addSomain;
  }
};
</script>
<style lang="less">
.buttonGroup {
  margin-left: 0;
}
</style>
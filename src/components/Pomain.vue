<template>
  <div>
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-button type="primary" plain size="mini" @click="addPoitems">新增明细</el-button>
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
      <el-form-item label="采购单编号" prop="poId">
        <el-input v-model="ruleForm.poId" disabled></el-input>
      </el-form-item>

      <el-form-item label="供应商编号" prop="venderCode">
        <el-select v-model="ruleForm.venderCode" placeholder="请选择供应商编号">
          <el-option
            v-for="(item,index) in venderList"
            :key="index"
            :value="item.venderCode"
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

      <el-form-item label="采购总价" prop="poTotal">
        <el-input v-model="ruleForm.poTotal" disabled></el-input>
      </el-form-item>

      <el-form-item label="付款方式" prop="payType">
        <el-select v-model="ruleForm.payType" placeholder="请选择付款方式">
          <el-option label="货到付款" :value="1"></el-option>
          <el-option label="款到发货" :value="2"></el-option>
          <el-option label="预付款到发货" :value="3"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="最低预付款金额" v-if="ruleForm.payType==3">
        <el-input v-model="ruleForm.prePayFee"></el-input>
      </el-form-item>

      <el-form-item label="采购单状态" prop="status">
        <el-select v-model="ruleForm.status" placeholder="请选择状态" disabled>
          <el-option label="新增" value="1" selected></el-option>
          <el-option label="已收货" value="2"></el-option>
          <el-option label="已付款" value="3"></el-option>
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

    <el-table :data="ruleForm.poitems" border style="width: 100%" size="mini">
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

      <el-table-column prop="unitPrice" label="产品单价" width="180">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.unitPrice" @change="getItemPrice" :rules="rules"></el-input>
        </template>
      </el-table-column>

      <el-table-column prop="num" label="产品数量" width="180">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.num" @change="getItemPrice" :rules="rules"></el-input>
        </template>
      </el-table-column>

      <el-table-column prop="itemPrice" label="明细总价" width="180">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.itemPrice" disabled></el-input>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
        :current-page='page'
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
    ...mapState(["addProduct", "isAddorUpdate"])
  },
  data() {
    return {
      poitemsIndex: 0,
      radio: 1,
      page: 1,
      total: 0,
      productList: [],
      venderList: [],
      tableColum: [
        { prop: "productCode", lable: "产品编号" },
        { prop: "name", lable: "产品名称" },
        { prop: "unitName", lable: "数量单位" }
      ],

      dialogTableVisible: false,
      itemList: [],
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
        status: "",
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
      rules: {
        venderCode: [
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
        /* unitPrice: [
          {
            required: true,
            pattern: /^[0-9]+\.[0-9]{2}$/,
            message: "请输入产品单价(保留2位小数)",
            trigger: "blur"
          }
        ],
        num: [
          {
            required: true,
            pattern: /^[1-9]+$/,
            message: "请输入正确的产品数量",
            trigger: "blur"
          }
        ], */
        // prePayFee: [{ required: true, message: "请输入最低预付金额", trigger: "blur" }],
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
    addPoitems() {
      this.ruleForm.poitems.push({
        productCode: "",
        unitPrice: "",
        num: "",
        unitName: "",
        itemPrice: ""
      });
    },

    // 获取供应商编号
    getVenderList() {
      axios({
        url: "api/main/purchase/vender/all",
        method: "get"
      }).then(resp => {
        // console.log(resp);
        this.venderList = resp.data;
        // console.log(this.venderList);
      });
    },

    // 获取产品总价
    getItemPrice() {
      this.ruleForm.poitems[this.poitemsIndex].itemPrice =
        this.ruleForm.poitems[this.poitemsIndex].num *
        this.ruleForm.poitems[this.poitemsIndex].unitPrice;
      this.ruleForm.productTotal = this.ruleForm.poitems.reduce((pre, cur) => {
        pre += cur.itemPrice;
        return pre;
      }, 0);
      this.ruleForm.poTotal =
        Number(this.ruleForm.productTotal) + Number(this.ruleForm.tipFee);
    },

    showList(index) {
      this.dialogTableVisible = true;
      this.page=1
      this.getList();
      this.poitemsIndex = index;
    },
    // 产品明细删除按钮
    handleDelete(index, row) {
      this.$confirm("确认删除么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.ruleForm.poitems.splice(index, 1);
          this.ruleForm.productTotal = this.ruleForm.poitems.reduce(
            (pre, cur) => {
              pre += cur.itemPrice;
              return pre;
            },
            0
          );
          this.ruleForm.poTotal =
            Number(this.ruleForm.productTotal) + Number(this.ruleForm.tipFee);
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
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
      this.ruleForm.poitems[this.poitemsIndex].productCode =
        selected.productCode;
      this.ruleForm.poitems[this.poitemsIndex].unitName = selected.unitName;
      this.dialogTableVisible = false;
      // console.log(selected);
    },
    // 保存按钮，表单验证
    save(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(this.ruleForm);
          axios({
            url: `/api/main/purchase/pomain/${this.isAddorUpdate}`,
            method: "post",
            headers: { "Content-Type": "application/json" },
            data: JSON.stringify(this.ruleForm)
          }).then(resp => {
            // console.log(resp);
            location.href = "http://localhost:8080/#/purchase/items";
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
          });
        } else {
          return false;
        }
      });
    }
  },

  mounted() {
    this.getVenderList();

    this.ruleForm = this.addProduct;
  }
};
</script>
<style lang="less">
.buttonGroup {
  margin-left: 0;
}
</style>
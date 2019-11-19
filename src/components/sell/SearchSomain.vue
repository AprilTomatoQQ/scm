<template>
  <div>
    <el-form :inline="true" :model="formInline" class="demo-form-inline" size="mini">
      <el-form-item label="销售单编号">
        <el-input v-model="formInline.soId"></el-input>
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
      <el-form-item label="处理状态">
        <el-select v-model="formInline.status">
          <el-option label="新增" value="1"></el-option>
          <el-option label="已发货" value="2"></el-option>
          <el-option label="已收款" value="3"></el-option>
          <el-option label="已了结" value="4"></el-option>
          <el-option label="已预付" value="5"></el-option>
          <el-option label="全部" value=""></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="付款方式" >
        <el-select v-model="formInline.payType">
          <el-option label="货到付款" :value="1"></el-option>
          <el-option label="款到发货" :value="2"></el-option>
          <el-option label="预付款到发货" :value="3"></el-option>
          <el-option label="全部" value=""></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="客户编号" >
        <el-select v-model="formInline.customerCode" placeholder="请选择客户编号">
          <el-option
            v-for="(item,index) in customerList"
            :key="index"
            :value="item.customerCode"
            :label="item.name"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <!-- 销售单查询结果 -->
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
        >{{scope.row.status == 1 ? "新增":scope.row.status == 2?"已发货":scope.row.status == 3?"已收款":scope.row.status == 4?"已了结":'已预付'}}</template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleDetail(scope.$index, scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加详情弹窗 -->
    <el-dialog title="销售单详情" :visible.sync="dialogVisible" width="80%">
      <!-- 销售单明细 -->
    
    

      <el-form
        :model="ruleForm"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm demo-form-inline"
        :inline="true"
        size="mini"
      >
        <el-form-item label="创建用户" prop="account">
          <el-input v-model="ruleForm.account" disabled></el-input>
        </el-form-item>

        <el-form-item label="附加费用" prop="tipFee">
          <el-input v-model="ruleForm.tipFee" disabled></el-input>
        </el-form-item>

        <el-form-item label="产品总价" prop="productTotal">
          <el-input v-model="ruleForm.productTotal" disabled></el-input>
        </el-form-item>

        <el-form-item label="采购总价" prop="soTotal">
          <el-input v-model="ruleForm.soTotal" disabled></el-input>
        </el-form-item>

        <el-form-item label="付款方式" prop="payType">
         <el-input :value="ruleForm.payType== 1 ? '货到付款':ruleForm.payType == 2?'款到发货':'预付款到发货'" disabled>
          
        </el-input>
          
        </el-form-item>

        <el-form-item label="最低预付款金额" prop="prePayFee">
          <el-input v-model="ruleForm.prePayFee" disabled></el-input>
        </el-form-item>

        <el-form-item label="销售单状态" prop="status">
          
          <el-input :value="ruleForm.status== 1 ? '新增':ruleForm.status == 2?'已发货':ruleForm.status == 3?'已收款':ruleForm.status == 4?'已了结':'已预付'" disabled >

          </el-input>
        </el-form-item>

        <el-form-item label="创建时间" prop="createTime">
          <el-input v-model="ruleForm.createTime" disabled></el-input>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input v-model="ruleForm.remark" disabled></el-input>
        </el-form-item>
      </el-form>
      <!-- 产品明细 -->
      <el-table :data="ruleForm.soitems" border style="width: 100%" size="mini">
        <el-table-column prop="productCode" label="产品编号" width="180">
          <template slot-scope="scope">
            <el-input size="mini" v-model="scope.row.productCode" disabled></el-input>
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

    <el-pagination
      background
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
import { format } from "path";
export default {
  data() {
    return {
        total:0,
        dialogVisible: false,
        loading:true,
      ruleForm: {
        soId: "",
        customerCode: "",
        account: "",
        tipFee: "",
        productTotal: "",
        soTotal: "",
        payType: "",
        createTime: "",
        prePayFee: "",
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
      somainList: [],
      customerList: [],
      formInline: {
        soId: "",
        customerCode: "",
        payType: "",
        createTime: "",
        startDate: "",
        endDate: "",
        status: "",
        page:1,
      },
      tableColum: [
        { prop: "soId", lable: "销售单编号" },
        { prop: "customerCode", lable: "客户编号" },
        { prop: "tipFee", lable: "附加费用" },
        { prop: "productTotal", lable: "产品总价" },
        { prop: "soTotal", lable: "采购总价" },
        { prop: "prePayFee", lable: "最低预付款金额" },
        { prop: "account", lable: "创建用户" },
        { prop: "createTime", lable: "创建时间" }
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
    }
  },
  methods: {

       changePage(p) {
      this.formInline.page = p;
      this.onSubmit();
    },
    //   时间选择
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

    //   获取客户编号
    getCustomerList() {
      axios({
        url: "/api/main/sell/customer/show",
        method: "get"
      }).then(resp => {
         console.log(resp);
        this.customerList = resp.data.list;
        // console.log(this.customerList);
      });
    },
    // 发送请求
    onSubmit() {
      // console.log(this.value7);

      axios({
        url: "/api/main/sell/somain/query",
        method: "get",
        params: this.formInline
      }).then(resp => {
         console.log(resp);
        this.somainList=resp.data.list
        this.total = resp.data.total;
        this.loading=false
      });
    },
    // 查看详情
    handleDetail(index,row){
axios({
        url: "/api/main/sell/somain/queryItem",
        method: "get",
        params: {soId:row.soId}
      }).then(resp => {
     console.log(resp);
     
         this.ruleForm=row
         this.ruleForm.soitems=resp.data
         this.dialogVisible=true
         })
      }
    },
  
  mounted() {
    this.getCustomerList();
  }
};
</script>
<style lang="less">
</style>
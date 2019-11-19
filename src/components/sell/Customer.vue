<template>
  <div>
    <el-button type="primary" @click="addCustomer" size="mini">添加新客户</el-button>

    <!-- 添加弹窗 -->
    <el-dialog :title="title" :visible.sync="dialogVisible" width="60%" :before-close="handleClose">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm demo-form-inline"
        :inline="true"
      >
        <el-form-item label="客户编号" prop="customerCode">
          <el-input v-model="ruleForm.customerCode"></el-input>
        </el-form-item>

        <el-form-item label="客户名称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="passWord">
          <el-input v-model="ruleForm.passWord"></el-input>
        </el-form-item>

        <el-form-item label="联系人" prop="contactor">
          <el-input v-model="ruleForm.contactor"></el-input>
        </el-form-item>

        <el-form-item label="电话" prop="tel">
          <el-input v-model="ruleForm.tel"></el-input>
        </el-form-item>

        <el-form-item label="地址" prop="address">
          <el-input v-model="ruleForm.address"></el-input>
        </el-form-item>

        <el-form-item label="邮编" prop="postCode">
          <el-input v-model="ruleForm.postCode"></el-input>
        </el-form-item>

        <el-form-item label="传真" prop="fax">
          <el-input v-model="ruleForm.fax"></el-input>
        </el-form-item>

        <el-form-item label="创建时间" prop="createDate">
          <el-input v-model="ruleForm.createDate" disabled></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="isAddorUpdate">确 定</el-button>
      </span>
    </el-dialog>

    <el-table :data="customerList" stripe style="width: 100%" size="mini" border loading>
      <el-table-column label="序号" type="index"></el-table-column>
      <el-table-column
        v-for="col in tableColum"
        :width="col.width"
        :key="col.prop"
        :label="col.lable"
        :prop="col.prop"
      ></el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
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
export default {
  data() {
    return {
      total: 0,
      page: 1,
      title: "",
      loading: true,
      isAddorUpdate: this.addConfirm,
      dialogVisible: false,
      customerList: [],
      tableColum: [
        { prop: "customerCode", lable: "客户编号" },
        { prop: "name", lable: "客户名称" },
        { prop: "passWord", lable: "客户密码" },
        { prop: "contactor", lable: "联系人" },
        { prop: "address", lable: "地址" },
        { prop: "postCode", lable: "邮编" },
        { prop: "createDate", lable: "注册日期" },
        { prop: "tel", lable: "电话" },
        { prop: "fax", lable: "传真" }
      ],
      ruleForm: {
        customerCode: "",
        passWord: "",
        name: "",
        address: "",
        tel: "",
        fax: "",
        contactor: "",
        createDate: "",
        postCode: ""
      },

      rules: {
        customerCode: [
          { required: true, message: "请输入客户编号", trigger: "blur" }
        ],
        passWord: [{ required: true, message: "请输入密码", trigger: "blur" }],
        name: [{ required: true, message: "请输入客户名称", trigger: "blur" }],
        contactor: [
          { required: true, message: "请输入联系人", trigger: "blur" }
        ],
        tel: [{ required: true, message: "请输入联系电话", trigger: "blur" }]
      }
    };
  },
  methods: {

    
    getTime() {
      let date = new Date();
      let y = date.getFullYear();
      let m = date.getMonth() + 1;
      let d = date.getDate();
      
      this.ruleForm.createDate = `${y}-${m < 10 ? "0" + m : m}-${
        d < 10 ? "0" + d : d
      }`;
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },

    getList() {
      axios({
        url: "/api/main/sell/customer/show",
        method: "get",
        params: { page: this.page },

        headers: {
          Authorization: this.token
        }
      }).then(resp => {
        console.log(resp);
        this.customerList = resp.data.list;
        this.total = resp.data.total;
      });
    },
    // 分页
    changePage(p) {
      this.page = p;
      this.getList();
    },
    addCustomer() {
      this.dialogVisible = true;
      this.title = "新客户信息";
      this.getTime();
    },
    addConfirm() {
      this.dialogVisible = false;
      axios({
        url: "/api/main/sell/customer/add",
        method: "post",
        data: qs.stringify(this.ruleForm)
      }).then(resp => {
        console.log(resp);
        if (resp.data.code == 2) {
          this.getList();
          this.$message({
            type: "success",
            message: "添加成功!"
          });
        } else {
          this.$message({
            type: "info",
            message: resp.data.message
          });
        }
      });
    },
    handleDelete(index, row) {
      this.$confirm("确认删除么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          axios({
            url: "/api/main/sell/customer/delete",
            method: "post",
            data: qs.stringify({
              customerCode: row.customerCode
            })
          }).then(resp => {
            // console.log(resp);
            this.getList();
          this.$message({
            type: "success",
            message: resp.data.message
          })
          })
        .catch(() => {
          this.$message({
            type: "info",
            message: resp.data.message
          });
        })
        });
    },
    // 编辑用户
    handleEdit(index, row) {
      // 获得用户原本信息
      // console.log(index, row);
      this.dialogVisible = true;
      this.ruleForm = row;
      this.title = "修改客户信息";
      this.isAddorUpdate = this.updateCustomer;
    },
    // 修改信息后发送请求
    updateCustomer() {
      this.dialogVisible = false;
      axios({
        url: "/api/main/sell/customer/update",
        method: "post",
        data: qs.stringify(this.ruleForm)
      }).then(resp => {
         console.log(resp);
        if (resp.data.code == 2) {
          this.getList();
          this.$message({
            type: "success",
            message: resp.data.message
          });
        }
      });
    }
  },
 mounted(){
     this.getList();
 }
};
</script>
<style lang="less">
</style>
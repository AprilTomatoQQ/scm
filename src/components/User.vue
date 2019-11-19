<template>
  <div>
    <!-- 添加用户 -->
    <el-button type="primary" @click="addUser" size="mini">添加新用户</el-button>
    <el-dialog :title="title" :visible.sync="dialogVisible" width="40%" :before-close="handleClose">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="80px"
        class="demo-ruleForm demo-form-inline"
        :inline="true"
      >
        <el-form-item label="账号" prop="account">
          <el-input v-model="ruleForm.account"></el-input>
        </el-form-item>

        <el-form-item label="姓名" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="passWord">
          <el-input v-model="ruleForm.passWord"></el-input>
        </el-form-item>
        <el-form-item label="创建时间" prop="createDate">
          <el-input v-model="ruleForm.createDate" disabled></el-input>
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="ruleForm.status">
            <el-radio :label="1">锁定</el-radio>
            <el-radio :label="0">未锁定</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="用户权限" prop="modelcodes">
          <el-checkbox-group v-model="ruleForm.modelcodes">
            <el-checkbox :label="1" name="modelcodes">采购管理</el-checkbox>
            <el-checkbox :label="2" name="modelcodes">销售管理</el-checkbox>
            <el-checkbox :label="3" name="modelcodes">系统管理</el-checkbox>
            <el-checkbox :label="4" name="modelcodes">财务管理</el-checkbox>
            <el-checkbox :label="5" name="modelcodes">仓库管理</el-checkbox>
            <el-checkbox :label="6" name="modelcodes">业务报表</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="isAddorUpdate('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 用户列表 -->
    <el-table :data="userList" stripe style="width: 100%" size="mini" border>
      <el-table-column label="序号" type="index"></el-table-column>
      <el-table-column
        v-for="col in tableColum"
        :width="col.width"
        :key="col.prop"
        :label="col.lable"
        :prop="col.prop"
      ></el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">{{scope.row.status?'锁定':'未锁定'}}</template>
      </el-table-column>
      <el-table-column label="用户权限">
        <template slot-scope="scope">{{scope.row.models.map(item=>item.modelName).toString()}}</template>
      </el-table-column>
      <el-table-column label="操作">
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
import { log } from "util";
import { mapState } from "vuex";
import { format } from "path";
import qs from "querystring";
export default {
  data() {
    return {
      total: 0,
      page: 1,
      isAddorUpdate: this.addConfirm,
      title: "",
      dialogVisible: false,
      ruleForm: {
        account: "",
        passWord: "",
        name: "",
        status: "",
        modelcodes: [],
        createDate: ""
      },
      rules: {
        account: [{ required: true, message: "请输入账户名", trigger: "blur" }],
        passWord: [{ required: true, message: "请输入密码", trigger: "blur" }],
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }]
      },
      tableColum: [
        { prop: "account", lable: "账号", width: "120" },
        { prop: "name", lable: "姓名", width: "120" },
        { prop: "createDate", lable: "创建时间" }
      ],
      userList: []
    };
  },
  computed: {
    ...mapState(["token"]),
    right: {
      get() {
        return this.userList.models.map(item => item.modelName);
      }
    }
  },
  mounted() {
    this.getList();
  },
  watch:{
    dialogVisible:{
      handler(val){
        val||this.$refs['ruleForm'].resetFields()
      }
    }
  },
  methods: {
    getList() {
      axios({
        url: "api/main/system/user/show",
        method: "get",
        params: { page: this.page },
        headers: {
          Authorization: this.token
        }
      }).then(resp => {
        // console.log(resp);
        this.userList = resp.data.list;
        this.total = resp.data.total;
      });
    },
    // 分页
    changePage(p) {
      this.page = p;
      console.log(this.page);
      this.getList();
    },
    // 新增用户
    addUser() {
      this.dialogVisible = true;
      this.ruleForm.account='',
      this.ruleForm.passWord='',
      this.ruleForm.name='',
       this.ruleForm.modelcodes=[],
      this.title = "新用户信息";
      this.getTime();
    },
    addConfirm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dialogVisible = false;
          axios({
            url: "api/main/system/user/add",
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
            } else {
              this.$message({
                type: "info",
                message: "添加失败"
              });
            }
          });
        }else{
          return false
        }
      });
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    getTime() {
      let date = new Date();
      let y = date.getFullYear();
      let m = date.getMonth() + 1;
      let d = date.getDate();
      let h = date.getHours();
      let mm = date.getMinutes();
      let s = date.getSeconds();
      this.ruleForm.createDate = `${y}-${m < 10 ? "0" + m : m}-${
        d < 10 ? "0" + d : d
      } ${h < 10 ? "0" + h : h}:${mm < 10 ? "0" + mm : mm}:${
        s < 10 ? "0" + s : s
      }`;
    },
    // 删除用户
    handleDelete(index, row) {
      this.$confirm("确认删除么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(()=>{
         axios({
        url: "api/main/system/user/delete",
        method: "post",
        data: qs.stringify({
          account: row.account
        })
      }).then(resp => {
        console.log(resp);
        if (resp.data.code == 2) {
          this.getList();
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        } else {
          this.$message({
            type: "info",
            message: resp.data.message
          });
        }
      })
      }).catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
     
    },
    // 编辑用户
    handleEdit(index, row) {
      // 获得用户原本信息
      console.log(index, row);
      this.dialogVisible = true;
      this.title = "修改用户信息";
      this.ruleForm.account = row.account;
      this.ruleForm.name = row.name;
      this.ruleForm.passWord = row.passWord;
      this.ruleForm.createDate = row.createDate;
      this.ruleForm.status = row.status;
      this.ruleForm.modelcodes = row.models.map(item => item.modelCode);
      this.isAddorUpdate = this.updateUser;
    },
    // 修改信息后发送请求
    updateUser() {
      this.dialogVisible = false;
      axios({
        url: "api/main/system/user/update",
        method: "post",
        data: qs.stringify(this.ruleForm)
      }).then(resp => {
        console.log(resp);
        if (resp.data.code == 2) {
          this.getList();
          this.$message({
            type: "success",
            message: "修改成功!"
          });
        }else{
          this.$message({
            type: "info",
            message: "修改失败"
          });
        }
      }).catch(error=>{
        this.$message({
            type: "info",
            message: "修改失败"
          });
      })
    }
  }
};
</script>

<style scoped lang='less'>
.el-main {
  padding: 16px;
}
.addUser {
  text-align: left;
  position: relative;
  left: -455px;
}
</style>>


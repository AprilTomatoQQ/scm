<template>
  <div>
    <el-button type="primary" @click="addVender" class="addVender" size="mini">添加新供应商</el-button>
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
        <el-form-item label="供应商编号" prop="venderCode">
          <el-input v-model="ruleForm.venderCode"></el-input>
        </el-form-item>

        <el-form-item label="供应商名称" prop="name">
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
        <el-button type="primary" @click="isAddorUpdate('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>

    <el-table :data="venderList" stripe style="width: 100%" size="mini" border>
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
      isAddorUpdate: this.addConfirm,
      dialogVisible: false,
      ruleForm: {
        venderCode: "",
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
        venderCode: [
          { required: true, message: "请输入供应商编号", trigger: "blur" }
        ],
        passWord: [{ required: true, message: "请输入密码", trigger: "blur" }],
        name: [
          { required: true, message: "请输入供应商名称", trigger: "blur" }
        ],
        contactor: [
          { required: true, message: "请输入联系人", trigger: "blur" }
        ],
        tel: [{ required: true, message: "请输入联系电话", trigger: "blur" }],
        address: [{ required: true, message: "请输入地址", trigger: "blur" }]
      },
      
      venderList: [],
      tableColum: [
        { prop: "venderCode", label: "供应商编号" },
        { prop: "name", label: "供应商名称" },
        { prop: "contactor", label: "联系人" },
        { prop: "address", label: "地址" },
        { prop: "postCode", label: "邮编" },
        { prop: "createDate", label: "注册日期" },
        { prop: "tel", label: "电话" },
        { prop: "fax", label: "传真" }
      ]
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
      this.ruleForm.createDate = `${y}-${m < 10 ? "0" + m : m}-${
        d < 10 ? "0" + d : d
      } ${h < 10 ? "0" + h : h}:${mm < 10 ? "0" + mm : mm}:${
        s < 10 ? "0" + s : s
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
        url: "api/main/purchase/vender/show",
        method: "get",
        params: { page: this.page },

        headers: {
          Authorization: this.token
        }
      }).then(resp => {
        // console.log(resp);
        this.venderList = resp.data.list;
        this.total = resp.data.total;
        // console.log(this.total);
      });
    },
    // 分页
    changePage(p) {
      this.page = p;
      this.getList();
    },
    addVender() {
      this.dialogVisible = true;
      this.title = "新供应商信息";
      this.getTime();
    },
    addConfirm(formName) {
       this.$refs[formName].validate(valid => {
        if (valid) {
      this.dialogVisible = false;
      axios({
        url: "api/main/purchase/vender/add",
        method: "post",
        data: qs.stringify(this.ruleForm)
      }).then(resp => {
        // console.log(resp);
        if (resp.data.code == 2) {
          this.getList();
           this.$message({
            type: 'success',
            message: '添加成功!'
          });
        }else{
          this.$message({
            type: "info",
            message: '添加失败'
          });

        }
      });
        }else{
          return false
        }
       })
    },
    // 删除供应商
    handleDelete(index,row){
        this.$confirm('确认删除么?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

            axios({
        url: "api/main/purchase/vender/delete",
        method: "post",
        data:qs.stringify({
          venderCode:row.venderCode
        })
      }).then(resp => {
         console.log(resp);
         this.getList()
      });


          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    // 编辑用户
    handleEdit(index,row){

      // 获得用户原本信息
       console.log(index,row);
      this.dialogVisible = true;
      this.title='修改供应商信息';
      this.ruleForm.venderCode=row.venderCode;
      this.ruleForm.name=row.name;
      this.ruleForm.passWord=row.passWord;
      this.ruleForm.createDate=row.createDate;
      this.ruleForm.contactor=row.contactor;
      this.ruleForm.address=row.address;
      this.ruleForm.tel=row.tel;
      this.ruleForm.fax=row.fax;
      this.ruleForm.postCode=row.postCode;
      this.isAddorUpdate=this.updateVender
      
    },
     // 修改信息后发送请求
updateVender() {
  this.dialogVisible = false;
      axios({
        url: "api/main/purchase/vender/update",
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
        } else {
          this.$message({
            type: "info",
            message: '修改失败'
          });
        }
      });
}, 
  },
  mounted() {
    this.getList();
  }
};
</script>
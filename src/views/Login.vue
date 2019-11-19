<template>
  <div >
    <div class="demo-input-suffix">
      <h3>用户登录</h3>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
        <el-form-item prop="username">
          <el-input v-model="ruleForm.username" prefix-icon="el-icon-user"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="ruleForm.password" prefix-icon="el-icon-lock"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
const qs = require("querystring");
import axios from "axios";
export default {
  name: "Login",
  data() {
    
    return {
      
      ruleForm: {
        username: "",
        password: "",
        role:'member'
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
         
          let pro=this.$store.dispatch('login',this.ruleForm)
          pro.then(result=>{
            console.log(result);
            
             this.$router.push('/')
          }).catch(error=>{
           
            this.$message({
            type: "error",
            message: error
          });
          })
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  },
  
};
</script>

<style lang="less">
.demo-input-suffix {
  width: 400px;
  height: 300px;
  margin: auto;
  border: 1px solid #dddddd;
  text-align: center;
  margin-top: 8%;
  border-radius: 6%;
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  background-color: #d9ecff;
  .el-input--prefix {
    width: 300px;
  }
  h3 {
    color: #979595;
    font-size: 22px;
  }
  .el-form-item__error{
     margin-left:12%
  }
}
</style>
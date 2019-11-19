<template>
    <div>
        <p>是否选择退出系统</p>
         <el-button type="primary" @click="gotoLogin">确定</el-button>
    </div>
</template>

<script>
export default {
    methods:{
        gotoLogin(){
            location.href='http://localhost:8080/#/login'
        }
    }
}
</script>
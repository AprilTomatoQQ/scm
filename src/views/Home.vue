<template>
  <el-container>
    <el-header class="nav" style="height: 100px;">
      <h2>信息管理系统界面</h2>
      <ul>
        <li>
          <i class="el-icon-coordinate"></i>
          {{loginUser}}
        </li>
        <li>
          <i class="el-icon-time"></i>
          系统时间:{{nowTime}}
        </li>
      </ul>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <p style="font-weight:700;text-align:center">菜单管理</p>
        <el-menu default-active="2" class="el-menu-vertical-demo" unique-opened router>
          <el-submenu index="1">
            <template slot="title">系统管理</template>
            <el-menu-item index="/user/userManage">用户管理</el-menu-item>
            <el-menu-item index="/login">重新登录</el-menu-item>
            <el-menu-item index="/user/logout">退出系统</el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">采购管理</template>
            <el-menu-item index="/purchase/vender">供应商管理</el-menu-item>
            <el-menu-item index="/purchase/items">新添采购单</el-menu-item>
            <el-menu-item index="/purchase/end">采购单了结</el-menu-item>
            <el-menu-item index="/purchase/pomainSearch">采购单查询</el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">仓储管理</template>
            <el-menu-item index="/stock/instock">入库登记</el-menu-item>
            <el-menu-item index="/stock/outstock">出库登记</el-menu-item>
            <el-menu-item index="/stock/checkstock">库存盘点</el-menu-item>
            <el-menu-item index="/stock/querystock">库存查询</el-menu-item>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title">财务收支</template>
            <el-menu-item index="/finance/receipt">收款登记</el-menu-item>
            <el-menu-item index="/finance/pay">付款登记</el-menu-item>
            <el-menu-item index="/finance/financequery">收支查询</el-menu-item>
          </el-submenu>
          <el-submenu index="5">
            <template slot="title">销售管理</template>
            <el-menu-item index="/sell/category">产品分类管理</el-menu-item>
            <el-menu-item index="/sell/product">产品管理</el-menu-item>
            <el-menu-item index="/sell/customer">客户管理</el-menu-item>
            <el-menu-item index="/sell/newsomain">新添销售单</el-menu-item>
            <el-menu-item index="/sell/endsomain">销售单了结</el-menu-item>
            <el-menu-item index="/sell/searchsomain">销售单查询</el-menu-item>
          </el-submenu>
          <el-submenu index="6">
            <template slot="title">业务报表</template>
            <el-menu-item index="/report/poreport">月度采购报表</el-menu-item>
            <el-menu-item index="/report/financereport">月度收支登记表</el-menu-item>
            <el-menu-item index="/report/instockreport">月度入库报表</el-menu-item>
            <el-menu-item index="/report/outstockreport">月度出库报表</el-menu-item>
            <el-menu-item index="/report/stockreport">产品库存报表</el-menu-item>
            <el-menu-item index="/report/soreport">月度销售报表</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <div class="location">
          <label for>位置:</label>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>{{part | location}}</el-breadcrumb-item>
            <el-breadcrumb-item>{{tit | locationD}}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
// @ is an alias to /src
import Nav from "@/components/Nav.vue";
import { mapState } from "vuex";
import { setInterval } from "timers";

export default {
  filters: {
    location: function(value) {
      if (value == "purchase") {
        return "采购管理";
      }
      if (value == "user") {
        return "系统管理";
      }
      if (value == "sell") {
        return "销售管理";
      }
      if (value == "stock") {
        return "仓储管理";
      }
      if (value == "finance") {
        return "财务收支";
      }
      if (value == "report") {
        return "业务报表";
      }
    },
    locationD: function(value) {
      if (value == "vender") {
        return "供应商管理";
      }
      if (value == "pomain") {
        return "新添采购单";
      }
        if (value == "end") {
         return "采购单了结";
       };
      if (value == "pomainSearch") {
        return "采购单查询";
      }
      if (value == "userManage") {
        return "用户管理";
      }
      if (value == "logout") {
        return "退出系统";
      }
      if (value == "category") {
        return "产品分类管理";
      };
      if (value == "product") {
        return "产品管理";
      };
      if (value == "customer") {
        return "客户管理";
      };
      if (value == "newsomain") {
        return "新添销售单";
      };
      if (value == "endsomain") {
        return "销售单了结";
      };
      if (value == "searchsomain") {
        return "销售单查询";
      }
      if (value == "instock") {
        return "入库登记";
      }
      if (value == "outstock") {
        return "出库登记";
      }
      if (value == "checkstock") {
        return "库存盘点";
      }
      if (value == "querystock") {
        return "库存查询";
      }
      if (value == "pay") {
        return "付款登记";
      }
      if (value == "receipt") {
        return "收款登记";
      }
      if (value == "financequery") {
        return "收支查询";
      }
      if (value == "financereport") {
        return "月度收支报表";
      }
      if (value == "stockreport") {
        return "月度库存报表";
      }
      if (value == "poreport") {
        return "月度采购报表";
      }
      if (value == "soreport") {
        return "月度销售报表";
      }
      if (value == "instockreport") {
        return "月度入库报表";
      }
      if (value == "outstockreport") {
        return "月度出库报表";
      }
    }
  },
  name: "home",
  components: {
    Nav
  },
  computed: {
    ...mapState(["loginUser"])
  },
  data() {
    return {
      nowTime: "",
      part: "",
      tit: ""
    };
  },
  mounted() {
    setInterval(this.getTime, 1000);
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
      this.nowTime = `${y}-${m < 10 ? "0" + m : m}-${d < 10 ? "0" + d : d} ${
        h < 10 ? "0" + h : h
      }:${mm < 10 ? "0" + mm : mm}:${s < 10 ? "0" + s : s}`;
    }
  },
  watch: {
    // 监听当前路由的变化
    $route: {
      handler: function() {
        this.part = this.$route.fullPath.split("/")[1];
        this.tit = this.$route.fullPath.split("/")[2];
        console.log(this.part);

        // 执行异步任务，比如后端接口中的数据
      },
      immediate: true
    }
  }
};
</script>

<style lang="less">
li {
  list-style: none;
}
.nav {
  background-color: #d9ecff;

  ul {
    display: flex;
    float: right;
    font-size: 14px;
    margin-top: 0;
  }
}
.el-menu-vertical-demo {
  .el-submenu {
    .el-menu-item {
      height: 30px;
      line-height: 30px;
    }
    .el-submenu__title {
      height: 45px;
      line-height: 45px;
      font-weight: 550;
    }
  }
}

.el-main {
  .location {
    display: flex;
    label {
      font-size: 16px;
      line-height: 27px;
      padding-right: 10px;
    }

    .el-breadcrumb {
      line-height: 27px;
    }
  }
}
</style>

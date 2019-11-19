import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Nav from '@/components/Nav.vue'
import Cookies from 'js-cookie'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect:"/user/userManage",
    component: Home,
    meta:{
      requireLogin: true
    },
    children:[{
      path:'/user/userManage',
      component: () => import('../components/User.vue')
    },{
    path:'/user/logout',
      component: () => import('../components/logout.vue')
    },
    {
      path:'/purchase/vender',
      component: () => import('../components/Purchase.vue')
    },{
      path:'/purchase/pomain',
      component: () => import('../components/Pomain.vue')
    },{
      path:'/purchase/items',
      component: () => import('../components/Items.vue')
    },
    {
      path:'/purchase/end',
      component: () => import('../components/PomainEnd.vue')
    },

    {
      path:'/purchase/pomainSearch',
      component: () => import('../components/PomainSearch.vue')
    },
    {
      path:'/sell/category',
      component: () => import('../components/sell/category.vue')
    },
    {
      path:'/sell/product',
      component: () => import('../components/sell/Product.vue')
    },
    {
      path:'/sell/customer',
      component: () => import('../components/sell/Customer.vue')
    },
    {
      path:'/stock/instock',
      component: () => import('../components/stock/Instock.vue')
    },
    {
      path:'/stock/outstock',
      component: () => import('../components/stock/Outstock.vue')
    },
    {
      path:'/stock/checkstock',
      component: () => import('../components/stock/Checkstock.vue')
    },
    {
      path:'/stock/querystock',
      component: () => import('../components/stock/Querystock.vue')
    },
    {
      path:'/finance/pay',
      component: () => import('../components/finance/Pay.vue')
    },
    {
      path:'/finance/receipt',
      component: () => import('../components/finance/Receipt.vue')
    },
    {
      path:'/sell/addsomain',
      component: () => import('../components/sell/AddSomain.vue')
    },
    {
      path:'/sell/newsomain',
      component: () => import('../components/sell/NewSomain.vue')
    },
    {
      path:'/sell/endsomain',
      component: () => import('../components/sell/EndSomain.vue')
    },
    {
      path:'/sell/searchsomain',
      component: () => import('../components/sell/SearchSomain.vue')
    },
    {
      path:'/finance/financequery',
      component: () => import('../components/finance/FinanceQuery.vue')
    },
    {
      path:'/report/poreport',
      component: () => import('../components/report/Poreport.vue')
    },
    {
      path:'/report/soreport',
      component: () => import('../components/report/Soreport.vue')
    },
    {
      path:'/report/instockreport',
      component: () => import('../components/report/InstockReport.vue')
    },
    {
      path:'/report/outstockreport',
      component: () => import('../components/report/OutstockReport.vue')
    },
    {
      path:'/report/financereport',
      component: () => import('../components/report/FinanceReport.vue')
    },
    {
      path:'/report/stockreport',
      component: () => import('../components/report/StockReport.vue')
    },
    
    
  
]
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/nav',
    name: 'Nav',
    component:Nav
  },
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  console.log('当前正要离开的路由：', from, ', 即将进入的目标：', to);
  // 判断即将进入的目标是否需要登录才能访问（根据路由元信息判断）
  if (to.meta.requireLogin) { // 有requireLogin元信息，则说明需要先登录
    // 判断是否已登录
    let username = Cookies.get('loginUser');
    if (username) { // 登录了
      next();
    } else { // 未登录
      next('/login')
    }
  } else { // 如果没有，则不需要先登录，直接进入目录路由
    next();
  }

})
export default router

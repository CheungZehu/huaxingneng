// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import VueRouter from 'vue-router'
import util from './assets/js/util'
import App from './App'
import Vuex from 'vuex'

// axios.defaults.baseURL = '/api'

Vue.prototype.util = util;
Vue.use(Vuex)
//引入components starting...
// const index = resolve => require(['./components/index/index.vue'], resolve)
// const login = resolve => require(['./components/login/login.vue'], resolve)
// const check = resolve => require(['./components/login/check.vue'], resolve)
// const industryPrice = resolve => require(['./components/index/industryPrice.vue'], resolve)
// const addPrice = resolve => require(['./components/index/addPrice.vue'], resolve)
// const chengePrice = resolve => require(['./components/index/chengePrice.vue'], resolve)
// const sureChengePrice = resolve => require(['./components/index/sureChengePrice.vue'], resolve)
// const allPrice = resolve => require(['./components/index/allPrice.vue'], resolve)
// const myCode = resolve => require(['./components/index/myCode.vue'], resolve)
// const myData = resolve => require(['./components/index/myData.vue'], resolve)
// const myOrder = resolve => require(['./components/index/myOrder.vue'], resolve)
// const placeOrder = resolve => require(['./components/placeOrder/placeOrder.vue'], resolve)
// const sureOrder = resolve => require(['./components/placeOrder/sureOrder.vue'], resolve)
// const successOrder = resolve => require(['./components/placeOrder/successOrder.vue'], resolve)
// const changeOrder = resolve => require(['./components/placeOrder/changeOrder.vue'], resolve)
// const updateOrder = resolve => require(['./components/placeOrder/updateOrder.vue'], resolve)
// const chengeSuccess = resolve => require(['./components/placeOrder/chengeSuccess.vue'], resolve)
// const pay = resolve => require(['./components/placeOrder/pay.vue'], resolve)
// const todayIncome = resolve => require(['./components/tody_income/todayIncome.vue'], resolve)
// const detail = resolve => require(['./components/tody_income/detail.vue'], resolve)
// const waitRelation = resolve => require(['./components/tody_income/waitRelation.vue'], resolve)
// const pay1 = resolve => require(['./pay1.vue'], resolve)
// const updatePrice = resolve => require(['./components/index/updatePrice.vue'], resolve)


import login from './components/login/login' // 登录
import check from './components/login/check' //输入验证码
import index from './components/index/index' //首页
import industryPrice from './components/index/industryPrice' //行业网价
import addPrice from './components/index/addPrice' //修改行业网价
import chengePrice from './components/index/chengePrice' //修改行业网价修改页
import sureChengePrice from './components/index/sureChengePrice' //确认修改行业网价
import allPrice from './components/index/allPrice' //确认修改行业网价
import myCode from './components/index/myCode' //我的二维码
import myData from './components/index/myData' // 我的资料
import myOrder from './components/index/myOrder' // 我的订单
import placeOrder from './components/placeOrder/placeOrder' //下单
import sureOrder from './components/placeOrder/sureOrder' //确认订单
import successOrder from './components/placeOrder/successOrder' // 下单成功
import changeOrder from './components/placeOrder/changeOrder' // 修改订单（确认订单信息）
import updateOrder from './components/placeOrder/updateOrder' //修改订单的页面
import chengeSuccess from './components/placeOrder/chengeSuccess' // 修改订单成功
import pay from './components/placeOrder/pay' // 支付页面
import todayIncome from './components/tody_income/todayIncome' //今日收款
import detail from './components/tody_income/detail' //明细
import payChangeHistory from './components/tody_income/payChangeHistory' //价格变更历史
import waitRelation from './components/tody_income/waitRelation' // 待关联
import pay1 from './pay1.vue'
import paysuccess from './components/placeOrder/paysuccess' //支付成功页面
import updatePrice from './components/index/updatePrice'//修改网价（修改）
import person from './components/Person/index'
import data from './components/Person/data'
import address from './components/Person/address'
import recond from './components/Person/recond'
import recondOrder from './components/Person/recondOrder'
//=========end

import  { ToastPlugin, WechatPlugin } from 'vux'
Vue.use(ToastPlugin)
Vue.use(WechatPlugin)

//路由 starting...
Vue.use(VueRouter)
const routes = [{
  path: '/',
  component: login
},
{
  path: '/check',
  component: check
},
{
  path: '/index',
  component: index
},
{
  path: '/membercenter',
  component: person
},
{
  path: '/membercenter/data',
  component: data
},
{
  path: '/membercenter/address',
  component: address
},
{
  path: '/membercenter/recond',
  component: recond
},
{
  path: '/membercenter/recond/recondOrder',
  component: recondOrder
},
{
  path: '/placeOrder',
  component: placeOrder
},
{
  path: '/sureOrder',
  component: sureOrder
},
{
  path: '/successOrder',
  component: successOrder
},
{
  path: '/todayIncome',
  component: todayIncome
},
{
  path: '/detail',
  component: detail
},
{
  path: '/payChangeHistory',
  component: payChangeHistory
},
{
  path: '/waitRelation',
  component: waitRelation
},
{
  path: '/industryPrice',
  component: industryPrice
},
{
  path: '/myCode',
  component: myCode
},
{
  path: '/myData',
  component: myData
},
{
  path: '/myOrder',
  component: myOrder
},
{
  path: '/chengeSuccess',
  component: chengeSuccess
},
{
  path: '/addPrice',
  component: addPrice
},
{
  path: '/chengePrice',
  component: chengePrice
},
{
  path: '/sureChengePrice',
  component: sureChengePrice
},
{
  path: '/pay',
  component: pay
},
{
  path: '/allPrice',
  component: allPrice
},{
  path:'/changeOrder',
  component: changeOrder
},{
  path:'/orderpay',
  component:pay1
},{
  path:'/updateOrder',
  component:updateOrder
},{
  path:'/updatePrice',
  component:updatePrice
},{
  path:'/paysuccess',
  component:paysuccess
}]

const router = new VueRouter({
  routes
})
//end

// 首先，注册一个module来保存状态
//过度效果
const store = new Vuex.Store({}) // 这里你可能已经有其他 module

store.registerModule('vux', { // 名字自己定义
  state: {
    isLoading: false,
    host:'/api'
  },
  mutations: {
    updateLoadingStatus (state, payload) {
      state.isLoading = payload.isLoading
    },
    // //根据id查询关联商铺名称
    getStoreName(list,callback){
      let nameList = '';
      for(var i = 0 ; i < list.length ; i++){
        if(i == list.length-1){
          nameList += list[i].custCode;
        }else{
          nameList += list[i].custCode + '@';
        }
      }
      console.log(nameList)
      axios.get('/api/custom/getCustName',{
        params:{
          custCode:nameList
        }
      }).then( data =>{
        callback(data)
      })
    },
  }
})
router.beforeEach(function (to, from, next) {
  store.commit('updateLoadingStatus', {isLoading: true})
  next()
})

router.afterEach(function (to) {
  setTimeout(function(){
    store.commit('updateLoadingStatus', {isLoading: false})
  },50)
})


// FastClick.attach(document.body)

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

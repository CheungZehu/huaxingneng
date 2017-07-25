<template>
 <div class="index_main">
   <div class="index_top_box">
     <div class="index_portrait_box">
       <div class="index_img_box">
         <img :src="salesman.src" alt="" style="width:80px;height:80px">
       </div>
       <span>{{salesman.name}}</span>
     </div>
     <div class="index_income_box">
       <div class="index_incom_today"  @click="router('todayIncome')">
         <span class="index_incom_today_num index_color"><span class="money">￥</span>{{salesman.today_income}}</span>
         <span>今日收款</span>
       </div>
       <div class="index_relation_box" @click="router('waitRelation')">
         <span class="index_relation_num index_color">{{salesman.tody_relation}}</span>
         <div class="border"></div>
         <span>待关联/单</span>
       </div>
       <div class="index_myorder_box" @click="router('myOrder')">
         <span class="index_myorder_num index_color">{{salesman.myorder}}</span>
         <span>我的订单/单</span>
       </div>
     </div>
     <div class="enter_btn">
       <button type="button" name="button" @click="router('placeOrder')">下单</button>
     </div>
   </div>
   <div class="index_list_box">
     <ul>
       <li @click="router('myCode')">
         <i class="icon iconfont icon-erweima"></i>
         <span class="index_list_text">我的收款码</span>
       </li>
       <li @click="router('detail')">
        <i class="mingxi" ></i>
         <span class="index_list_text">收款明细</span>
       </li>
       <li @click="router('industryPrice')">
        <i class="icon iconfont icon-wangjia" ></i>
         <span class="index_list_text">行业网价</span>
       </li>
       <li class="index_list_li3" @click="router('payChangeHistory')">
         <i class="icon iconfont icon-wangjia" ></i>
         <span class="index_list_text">价格变更历史</span>
       </li>
       <li class="index_list_li4" @click="router('myData')">
         <i class="icon iconfont icon-wodeziliao" ></i>
         <span class="index_list_text">我的资料</span>
       </li>
       <li class="index_list_li4" @click="router('addPrice')">
         <i class="icon iconfont icon-wodeziliao" ></i>
         <span class="index_list_text">录入网价</span>
       </li>
       <!-- <li class="index_list_li4" @click="router('addPrice')">
         <i class="icon iconfont icon-wodeziliao"></i>
         <span class="index_list_text">添加行业网价</span>
       </li> -->
     </ul>
   </div>
   <loading v-model="loading"></loading>
 </div>
 </template>
 <script>
 import axios from 'axios'
 import { mapState } from 'vuex'
 import { Loading } from 'vux'
 export default {
   name:"index",
   components:{ Loading },
   data () {
     return {
       salesman: {
         src:'',
         name:'业务员',
         today_income: '0',
         tody_relation: '0',
         myorder: '0'
       },
       host:'/huaxinneng/',
       loading:false
     }
   },
   methods:{
     router(r){
       this.$router.push(r)// 路由跳转的方法
       localStorage.clear()
     }
   },
   mounted(){
     //获取今日收款的数额
     this.loading = true;
     let self = this;
     console.log('123')
     setTimeout(function() {
       if(self.loading == true){
         self.loading = false;
         self.$vux.toast.show({
         text: '获取超时，请检查您的网络设置',
         type:'warn'
       })
       }
     }, 10000);

     let params = {
       params:{
         operater:''
       }
     }
     console.log(this.host)
      //获取个人资料
     axios.get(''+this.host+'/userInfo/getMyInfoExternal').then(data => {
      self.show = false;
      console.log(data)
      if(data.data.error=='0'){
          let content = data.data.errMsg;
          self.salesman.name = content.name;
          self.salesman.src = content.headimgurl;
          params.params.operater=content.id;
          console.log(params)
          //  let self = this;
          axios.get(''+this.host+'custom/getMoneyInfo?day=1').then(data => {
            self.salesman.today_income = data.data.money;
            self.loading = false;
            
          })
          //获取今日待关联单数
          axios.get(''+this.host+'/userInfo/getTodayRelation').then(data => {
            self.salesman.tody_relation = data.data.count;
            self.loading = false;
            
          })
          //获取 我的订单 数量
          //  axios.get(''+this.host+'/userInfo/getTodayOrder',params).then( data => {
          //    self.salesman.myorder = data.data.order;
          //    self.loading = false;
          //  })
          axios.post( this.host + '/custOrder/getMyOrderList').then( data => {
            self.show = false;
            let list = JSON.parse(data.data.errMsg);
            self.salesman.myorder = list.length;
          })
      }
     })
    
   }
 }
 </script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
$color = #eb942d
@font_family="Microsoft Yahei"
.index_main
  position:absolute
  top:0
  left:0
  right:0
  bottom:0
  background:#f2f3f8
.index_top_box
  width:100%
  background:#fff
  display:flex
  flex-direction: column

  .index_portrait_box
    flex:0 0 150px
    display:flex
    flex-direction: column
    text-align:center
    .index_img_box
      width:80px
      height:80px
      margin:0 auto
      margin-top:15px
      border-radius:80px
      border:none
      background:#f2f3f8
      overflow:hidden
    span
      margin:15px
      font-family:@font_family
  .index_income_box
    flex:0 0 40px
    margin:10px 0
    display:flex
    .index_incom_today,.index_relation_box,.index_myorder_box
      display:flex
      flex:1
      flex-direction: column
      text-align:center
      font-family:@font_family
      // border-right:1px solid #cccc
      span:first-child{
        font-size:20px
        // margin-bottom:6px
      }
      span:last-child
        font-size:12px
        color:#969696
    .index_myorder_box
      border:none
  .enter_btn
    margin:0 auto
    flex:1
    display:inline-block
    width:100%
    text-align:center
    button
      width:150px
      height:35px
      font-size: 18px
      margin:25px 0
      border:none
      border-radius:18px
      color:#fff
      background:$color
      outline:none
.index_list_box
  width:100%
  margin-top:15px
  background:#fff
  ul
    padding:0
    background:#f2f3f8
  li
    list-style:none
    height:55px
    display:flex
    background:#fff
    line-height:55px
    i
      font-size: 46px;
      line-height: 60px;
      color:$color
      flex:0 0 65px
    .index_list_text
      width:100%
      border-bottom:1px solid #ccc
  .index_list_li3,.index_list_li4
    .index_list_text
      border:none
  .index_list_li4
    margin-top:15px
.index_color
  color:$color
.money
  color:$color !important
//修改中间的两条框线长度
.index_relation_box
  position:relative
.border
  position:absolute
  width:100%
  height:55%
  top:38%
  border-left:1px solid #e9e9e9
  border-right:1px solid #e9e9e9
.mingxi:before
  content:'\e607'
  font-family:"iconfont" !important;
  font-size:43px;
  font-style:normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  left: -1px;
  position: absolute;
 
</style>

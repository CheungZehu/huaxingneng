<template lang="html">
  <div class="main">
    <ul class="main_input_box">
      <li>
        <span class="order_title">商户选择</span>
        <!--<select class="order_select merchant " name="merchant" v-model="merchant" @change="searchStore">
          <option value="" class="placeholder">{{merchant.placeholder}}</option>
          <option v-for="n in merchant.options" v-bind:value="n">{{n.custname}}</option>
        </select>--> 
        <selectbox class="searchBox" v-on:search="search" :name="this.merchant.custname"></selectbox>
    <!--     <selectbox class="searchBox" v-on:search="search" v-if="!merchant.custname"></selectbox>
        <input type="text" v-model="merchant.custname" :placeholder="merchant.placeholder" @click="isShow"> -->
      </li>
      <li>
        <span class="order_title">{{store.title}}</span>
        {{merchant.deptNoName!=''?merchant.deptNoName:showSearchStore()}}
        <storebox class="searchBox" v-on:search="searchStore" v-show="store.show" :store="this.merchant.deptNoName"></storebox>
        
      </li>
      <li>
        <span class="order_title">{{size.title}}</span>
        <checker v-model="size.value" default-item-class="size-default" selected-item-class="size-selected">
          <checker-item v-for="n in size.options" v-model="n.ctype">{{ n.ctype }}</checker-item>
        </checker>
      </li>
      <li>
        <span class="order_title">{{metering.title}}</span>
        <!-- <div class="metering_box" v-for="n in metering.options">
          <label for="metering" :class="n.value">{{n.key}}</label>
          <input type="radio" name="metering" v-model="n.value">
        </div> -->
        <checker v-model="metering.value" default-item-class="metering-default" selected-item-class="metering-selected">
          <checker-item v-for="n in metering.options" v-model="n.value">{{ n.key }}</checker-item>
        </checker>
      </li>
      <!--<li v-show="price.value">-->
      <li>
        <span class="order_title">{{price.title}}</span>
        <span v-if="price.value">￥{{price.value}}</span>
        <div v-else >
          <span class="pricebox"></span>
          <input v-model="price.value1" class="pricebox" placeholder="请输入单价">
        </div>
      </li>
      <li>
        <span class="order_title">{{number.title}}</span>
        <input type="number" v-model="number.value" :placeholder="number.placeholder">
      </li>
      <li  v-show="metering.value=='1'">
        <span class="order_title">{{weight.title}}</span>
        <span>{{weight.value}}kg</span>
      </li>
      <li>
        <span class="order_title">{{time.title}}</span>
        <div class="select-div arrow">
          <select class="time_day" name="day" v-model="time.day" @change="hoursPick">
            <option v-for="n in time.days" v-model="n.value" v-bind:disabled="n.disabled">{{n.key}}</option>
          </select>

        </div>
        <div class="select-div arrow">
          <select class="time_hour" name="hour" v-model="time.hour">
            <option v-for="n in time.hours" v-model="n.value" v-bind:disabled="n.disabled">{{n.key}}</option>
          </select>
        </div>
      </li>
      <li>
        <span>{{remark.title}}</span>
        <textarea name="name" rows="3" cols="50" :placeholder="remark.placeholder" v-model="remark.value"></textarea>
      </li>
    </ul>
    <ul class="merchantBox">
      <li class="merchan_title">{{merchantInfo.title}}</li>
      <li>
        <ul>
          <li>
            <span>{{merchantInfo.customerKind.title}}</span>：
            <span>{{merchantInfo.customerKind.value}}</span>
          </li>
          <li>
            <span>{{merchantInfo.saleKind.title}}</span>：
            <span>{{merchantInfo.saleKind.value}}</span>
          </li>
          <li>
            <span>{{merchantInfo.contact.title}}</span>：
            <span>{{merchantInfo.contact.value}}</span>
          </li>
          <li>
            <span>{{merchantInfo.phoneNumber.title}}</span>：
            <span>{{merchantInfo.phoneNumber.value}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="order_address">
      <span>{{address.title}}</span>
      <checker v-model="address.value" default-item-class="address-default" selected-item-class="address-selected">
        <checker-item v-for="n in address.options" v-model="n.address">{{ n.address }}</checker-item>
      </checker>
      <!--<textarea type="text" class="address_input" v-model="address.value1" placeholder="系统中没有您的地址信息，请手动输入收货地址" v-else></textarea>-->
    </div>
    <div class="tatol">
      <p>总价：<span class="tatol_price" v-if="tatol_price">￥{{tatol_price}}</span><span v-else>暂无总价</span></p>
      <p v-if="metering.value=='1'">(总净重*单价)</p>
      <p v-else>（单价*瓶数）</p>
    </div>
    <div class="btn">
      <button type="button" name="button" class="button" @click="submit" :disabled="isenabled">提交订单</button>
    </div>
    <loading v-model="show" :text="showtext"></loading>
  </div>
</template>
<style lang="stylus" rel="stylesheet/stylus" scoped>
@import './../libs/icon/iconfont.css'
@import './../libs/stylus/same.styl'
half()
  return (arguments/2)px
.main
  overflow-x:hidden
  background:#f2f3f8
.main_input_box
  display:flex
  flex-direction:column
  padding:0 half(30)
  background:#fff
  li
    border-bottom:1px solid #ccc
    display:flex
    flex: 0 0  half(100)
    line-height:half(100)
    position:relative
    span:first-child
      flex:0 0 half(200)
      font-size:half(32)
      color:$fontColor
    &:nth-child(1) select,&:nth-child(2) select
      flex:1
      border:none
      outline:none
      appearance:none;
      background:#fff
      z-index:9
      background:transparent
  // li:first-child:after,li:nth-child(2):after
  li:nth-child(2):after
    // content:'\e615'
    font-family:"iconfont" !important;
    font-size:52px;
    font-style:normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    line-height:67px
    color:$color
    position:absolute
    right: 56px;
    width: 1px;
    height: 1px;
  li:nth-child(3)
    flex:1
    div.vux-checker-box
      line-height:29.5px
      margin-top:12.5px
      div
        margin-bottom:12.5px
      div:first-child
        margin-top:0
      div:last-child
        margin-bottom:12.5px

  li:nth-child(5)
    position:relative
  li:nth-child(6)
    input
      border:none
      outline:none
      font-size: 16px
  li:nth-child(1)
    input
      border:none
      outline:none
      width:100%
  li:nth-child(8)
    align-items:center
    display:flex
    background:transparent
    .select-div
      height:half(64)
      padding:0 15px 
      flex:0 0 53px
      border:1px solid $borderColor
      border-radius:5px
      line-height:30px
      outline:none
      background:#fff
      overflow:hidden
      position:relative
      background:transparent
    .select-div:last-child
      flex:1
      margin-left:10px
    select
      width:100%
      height:100%
      font-size:16px
      border:none
      outline:none
      appearance:none
      background:transparent
      position:relative
      // z-index:2
    .arrow:before
      color:$color
      font-size:30px
      width:1px
      height:1px
      content: '\E615'
      font-family: "iconfont"
      position:absolute
      top: 15%;
      right: 45px;
      font-size: 45px;


  li:nth-child(9)
    flex:0 0 half(220)
    align-items:center
    border-bottom:none
    span
      align-self:flex-start
    textarea
      resize:none
      height:half(145)
      outline:none
      padding:5px
      font-size:half(32)
      border-radius:8px
// 商户信息
.merchantBox
  margin-top:half(22)
  padding:0 half(30)
  background:#fff
  padding-bottom:half(60)
  .merchan_title
    color:$fontColor
    font-size:half(32)
    display:inline-block
    height:half(90)
    line-height:half(90)
  ul
    border:1px solid $borderColor
    border-radius:5px
    display:flex
    flex-direction:column
    li
      list-style:none
      flex:0 0 half(58)
      line-height:half(58)
      margin-left:15px
      text-align:justify
      overflow:hidden
      span:first-child
        color:$fontColor
        display:inline-block
        width:half(146)
        text-align-last:justify
      span:last-child
        margin-left:5px
    li:first-child
      margin-top:10px
    li:last-child
      margin-bottom:10px
.order_address
  margin-top:half(21)
  padding:0 half(30)
  background:#fff
  span:first-child
    display:block
    height:half(100)
    line-height:half(100)
  .address-default
    height:half(130)
    width:93.5%
    padding:10px
    border:1px solid $borderColor
    border-radius:8px
    margin-bottom:10px
    font-size:15px
    position:relative
    overflow:hidden
  .address-selected
    border:1px solid $color
  .address-selected:after
    font-family:"iconfont" !important;
    font-size:70px;
    font-style:normal;
    color:$color
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    content: "\e61d"
    position:absolute
    right: -43px;
    bottom: -51px !important;
.tatol
  height:half(205)
  text-align:center
  p:first-child
    margin-top:half(50)
    font-size:half(32)
    color:#666
    vertical-align: sub;
    .tatol_price
      font-size:half(46)
      color:$fontColor
  p:last-child
    margin-top:half(30)
    font-size:half(28)
    color:#666
.searchBox
  
.btn
  width:100%
  .button
    width:100%
    height:half(80)
    line-height:half(80)
    margin:0 auto
    display:block
    border:none
    border-radius:half(80)
    background:$color
    color:#fff
    font-size:half(35)
    margin-bottom:half(108)





.size-default
  width:half(115)
  height:half(55)
  line-height:29.5px
  margin-right:half(11)
  border:1px solid $borderColor
  font-size:half(28)
  text-align:center
  color:$borderColor
.size-selected
  color:$color
  border:1px solid $color
.metering-default
  margin-right:10px
  color:$borderColor
.metering-default:before
  font-family:"iconfont" !important;
  font-size:26px;
  font-style:normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  content: "\e61c";
  vertical-align: middle
  color:$borderColor
.metering-selected
  color:$fontColor
.metering-selected:before
  color:$color
.pricebox
  border:none
  outline:none
  font-size: 16px
  &:before
    content:'￥'
    // position:absolute
    


.address_input
  height: 65px;
  width: 93.5%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-bottom: 10px;
  font-size: 16px;
  position: relative;
  overflow: hidden;
  outline:none
.button[disabled="disabled"]
  background:#ccc !important
  color:#fff !important

</style>

<script>
import { Checker , CheckerItem ,Selector, Group ,ToastPlugin , Loading} from 'vux'
import axios from 'axios'
import qs from 'qs'
import selectbox from './selectbox.vue'
import storebox from './storebox.vue'

export default {
components:{ Checker , CheckerItem ,Selector ,Group ,ToastPlugin ,Loading ,storebox ,selectbox},
methods:{
  submit(){
    let data_obj={
      appSer: this.list.appSer,
      company:this.merchant.custname,//商户名
      // custNo:this.merchant.custcode,//商户代码
      custNo:this.merchant.custNo,//商户代码  
      // custNo:this.merchant.custNo != '' ? this.merchant.custNo : this.list.custNo,//商户代码  
      deptNo:this.merchant.deptno,//门店编号
      deptNoName:this.merchant.deptNoName,//门店名
      // deptNoName:this.merchant.deptNoName,//门店名

      bottType:this.size.value,//规格
      cType:this.metering.value,//计量单位
      unitPrice:this.price.value?this.price.value:this.price.value1,//单价
      bottleNum:this.number.value,//瓶数
      bottleNum2:this.weight.value,//重量
      appDate: this.getDate(this.time.day),//配送日期
      time:this.time.hour,//时间段
      // memo:this.remark.value,//备注
      memo:this.remark.value,//备注
      // custType:this.merchant.custtype.substr(0,2),//客户类型
      custType:this.merchant.custtype,//客户类型
      // name:this.merchant.linkman,//联系人
      name:this.merchantInfo.contact.value,//联系人
      // telePhone:this.merchant.mobiletel,//手机号
      telePhone:this.merchantInfo.phoneNumber.value,//手机号
      address:this.address.value,//地址
      // selltype:this.merchant.selltype.substr(0,2),//销售类型
      selltype:this.merchant.selltype,//销售类型
      // selltype:this.list.selltype,
      totalprice:this.tatol_price //总价
    }

    if (!data_obj.custNo) {
      data_obj.custNo = this.list.custNo
      // console.log('还没有？' + data_obj.custNo)
    } 
    // 校验数据
    let self = this;
    if(!data_obj.company){
      self.$vux.toast.show({
        text:'请选择商户',
        type:'text'
      })
      return
    }else if(!data_obj.bottType){
      self.$vux.toast.show({
        text:'请选择规格',
        type:'text'
      })
      return
    }else if (!data_obj.bottleNum) {
      self.$vux.toast.show({
        text:'请选择瓶数',
        type:'text'
      })
      return
    }else if(!data_obj.time){
      self.$vux.toast.show({
        text:'请选择送气的时段',
        type:'text'
      })
      return
    }else if(!data_obj.address){
      self.$vux.toast.show({
        text:'请选择送气的地址',
        type:'text'
      })
      return
    }
    
    localStorage.setItem('order_list',JSON.stringify(data_obj));
    // console.log('placeOrder提交订单')
    // console.log(data_obj)
    // console.log(this.merchant.custtype)
    // console.log(this.list.custType)
    // console.log(data_obj.custType)
    // console.log(data_obj.selltype)
    // console.log(this.list.selltype)
    this.$router.push('sureOrder');


  },

  isShow() {
    this.store.show = !this.store.show
  },
  //根据商户获取门店
  // searchStore(){
  //   console.log('==========================')
  //   this.getCustData();
  //   if(this.merchant){
  //     //如果选择的商户 有 department，就直接赋值给门店
  //     this.store.value = this.merchant.deptname;
  //     // console.log(this.store.value)
  //     this.store.options = [{department:this.merchant.department}]
  //   }else{
      
  //   }
    
  // },
    //获取单价
  getPrice(number){
    let self = this;
    self.show = true;//显示loading
    self.showtext = '正在获取单价...';
    let _data = {
      //组合数据
      unit:this.metering.value,//计量单位（1：公斤，0：瓶）
      custNo:!this.merchant.custNo ? this.list.custNo : this.merchant.custNo,//客户号
      // custNo:this.merchant.custcode,//客户号
      custBottype:this.size.value,//规格
      dayNum: number
    }
    _data = qs.stringify(_data)
    // console.log(_data)
    axios.post(''+this.host+'/custOrder/getKiloOrVasePrice',_data,{
      headers:{
          'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then( data => {
      //单价
      self.show = false;
      // console.log(data.data)
      if(data.data.error == '0'){
        this.price.value = data.data.errMsg;
        console.log('有没有')
        console.log(data.data.errMsg)
      }else {
        self.price.value = '';
        self.$vux.toast.show({
             text: '获取单价为空，请手动输入',
             type:'text'
           })
      }



      // else{
      //   self.price.value = '';
      //   self.$vux.toast.show({
      //        text: '获取单价为空，请手动输入',
      //        type:'text'
      //      })
      // }
    })
    
  },
  //获取总净重
  getToatalWeight(){
    let self = this;
    self.show = true;
    self.showtext = '正在获取总净重...'
    let _data = qs.stringify({
      ctype:self.size.value,
      vaseNum:self.number.value
    });

    axios.post(''+this.host+'/custOrder/getAllWeigth',_data,{
        headers:{
          'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then( data => {
      self.show = false;
      if(data.data.error == '0'){
        self.weight.value = data.data.errMsg
      }
    })
  },
  //获取总价
  getTotalPrice(number){
    let self = this;
    let _data;
    if(self.price.value1){
       _data = qs.stringify({
        unit:self.metering.value,//计量单位
        custNo:self.merchant.custNo,//用户号
        // custNo:self.merchant.custcode,//用户号
        custBottype:self.size.value,//规格
        vaseNum:self.number.value,//瓶数
        price:self.price.value1, // 单价
        dayNum: number
      })
    }else{
       _data = qs.stringify({
        unit:self.metering.value,//计量单位
        // custNo:self.merchant.custcode,//用户号
        // custNo:self.merchant.custcode,//用户号
        custNo:self.merchant.custNo,//用户号
        custBottype:self.size.value,//规格
        vaseNum:self.number.value,//瓶数
        dayNum: number
      })
    }
    
    axios.post(''+this.host+'/custOrder/getPrice',_data,{
       headers:{
          'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(data => {
      console.log('zongjia')
      console.log(data.data)
      if(data.data.error == '0'&& data.data.errMsg){
        this.tatol_price = data.data.errMsg
        // 将总价设置成本地存储
        // this.tatol_price = self.metering.value + self.number.value
        localStorage.setItem('total',data.data.errMsg)

        return data.data.errMsg
      }else if(data.data.error == '4004'){
        this.tatol_price = '';
        self.$vux.toast.show({
          text:'获取总价出现问题，请联系管理员',
          type:'text'
        })
      } else if (data.data.error == '-1') {
        console.log('获取失败')
      }
    })
  },
//日期转换
 getDate(str){
    if(str == '今天'){
      let  date_ = new Date();
      return date_.toLocaleDateString()
    }else if(str == '明天'){
      let date__ = new Date().setDate(new Date().getDate() +1 )
      return new Date(date__).toLocaleDateString()
    }else if( str == '后天'){
      let date___ = new Date().setDate(new Date().getDate() +2 )
      return new Date(date___).toLocaleDateString()
    }
  },
//禁止此刻之前的时间段选择
  hoursPick(){
   // this.time.hour = null;
    let hour = new Date().getHours();
    // console.log(hour,this.time.hours)
    if( this.time.day == '今天'){
      for(var i = 0; i < this.time.hours.length; i ++){
      if(parseInt( this.time.hours[i].value ) < hour){
        // console.log(parseInt( this.time.hours[i].value ))
        this.time.hours[i].disabled = true;
      }
    }
    }else{
      for(var i = 0; i < this.time.hours.length ; i ++){
      if(parseInt( this.time.hours[i].value ) < hour){
        // console.log(parseInt( this.time.hours[i].value ))
        this.time.hours[i].disabled = false;
      }
    }
  }
 },

 // 将数据放入
 search(val){
   this.merchant = val;
   this.merchant.custtype = this.merchant.custtype.replace(/\s+/g,"")
   this.merchant.custNo = this.merchant.custcode
   console.log('客户号')
   console.log(this.merchant)
 },
 //如果没有门店，显示搜索框
  showSearchStore(){
    this.store.show = true;
    return ''
 },
 // 门店搜索结果
 searchStore(val){
  this.merchant.deptnoname = val.deptnoname;
  this.store.show = false;
 }
},
created(){
  // console.log('有没有merchant')
  // console.log(this.merchant)
  // console.log('this.list.custNo。。。')
  // console.log(this.list.custNo == '' ? this.merchant.custNo : this.list.custNo)

  let nowDate = new Date()
  let hour = nowDate.getHours();
  if (hour > 16) {
    this.time.day = '明天'
    // this.getPrice(-1)
    // this.getTotalPrice(-1)
    this.time.days[0].disabled = true; 
  } else {
    this.time.days[0].disabled = false; 
  }
  
  if (localStorage.getItem('order_list')) {
    this.list = JSON.parse(localStorage.getItem('order_list'))

    this.merchant.deptNoName = this.list.deptNoName
    // console.log(this.list.deptNoName)
    this.merchant.custname = this.list.company

    this.merchant.deptno = this.list.deptNo
    // console.log(this.list.deptNoName)
    // console.log(this.merchant.deptnoname)
    let bottType = this.list.bottType
    if (bottType.indexOf(" ") >= 0) {
      this.size.value = bottType.replace(/\s+/g,"")
    } else {
      this.size.value = bottType
    }
    
    // console.log(this.size.value)
    if (this.list.cType != '') {
      this.metering.value = this.list.cType
    }
    
    // if (this.time.day == '今天') {
    //   // console.log('今天')
    //   this.getPrice(0)
    //   console.log('kankan')
    //   this.getTotalPrice(0)
    //   let nowDate = new Date()
    //   let hour = nowDate.getHours();
    //   let ohour = this.time.hour.split(':')[0]
    //   if (hour > ohour) {
    //     this.time.hour = ''
    //   }
    // } else if (this.time.day == '明天') {
    //   // console.log('明天')
    //   this.getPrice(-1)
    //   this.getTotalPrice(-1)
    // } else {
    //   // console.log('后天')
    //   this.getPrice(-2)
    //   this.getTotalPrice(-2)
    // }
    // this.price.value1 = this.list.unitPrice
    this.number.value = this.list.bottleNum

    // if (this.list.appDate.indexOf)
    let dates = this.list.appDate
    if (dates.indexOf('/') > 0) {
      dates = dates.split('/')
    } else {
      let str = dates.split(' ')[0]
      dates = str.split('-')
    }
    // dates[1] = dates[1] - 1
    // console.log(this.list.time)
    let nowDate = new Date()
    let hour = nowDate.getHours();
    // console.log(nowDate.dates())
    let day = parseInt(dates[2]) - nowDate.getDate()
    // console.log(parseInt(dates[2]))
    // console.log(nowDate.getDate())
    // console.log(day)
    
    if (day == 2) {
      this.time.day = '后天'
    } else if (day == 1) {
      this.time.day = '明天'
    } else if (day == 0 && hour > 16) {
      this.time.day = '明天'
    } else {
      this.time.day = '今天'
      this.getPrice(0)
      console.log('kankan')
    }
    // console.log(this.list.time)
    // console.log('hour' + this.list.time.split(':')[0])
    // this.list.time.split(':')[0]
    if (this.time.day == '今天') {
      
      // console.log('hour' + hour)
      for(var i = 0; i < this.time.hours.length ; i ++){
        if (parseInt(this.time.hours[i].value) >= hour) {
          this.time.hour = this.time.hours[i].key
        }
      }
    } else {
      this.time.hour = this.list.time
    }
    
    // console.log(this.time.hours)

    this.remark.value = this.list.memo

    
    // this.merchantInfo.customerKind.value = this.list.custType.replace(/\s+/g,"") == '01' ? '工商业客户' : '工业客户'
    let custType = this.list.custType

  
    this.merchantInfo.customerKind.value = this.list.custType == '01' ? '工商业客户' : '工业客户'
    this.merchant.custtype = this.list.custType

    // debugger
    // let selltype = this.list.selltype.toString()
    // if (selltype.indexOf(" ") >= 0) {
    //   this.list.selltype = selltype.replace(/\s+/g,"")
    // } else {
    //   this.list.selltype
    // }
    // switch (this.list.selltype.replace(/\s+/g,"")) {
    switch (this.list.selltype) {
      case '01':
        this.merchant.selltype = '01'
        this.merchantInfo.saleKind.value = '结算客户'
        break;
      case '02':
        this.merchant.selltype = '02'
        this.merchantInfo.saleKind.value = '月票客户'
        break;
      case '03':
        this.merchant.selltype = '03'
        this.merchantInfo.saleKind.value = '现金客户'
        break;
      case '04':
        this.merchant.selltype = '04'
        this.merchantInfo.saleKind.value = '其他'
        break;
      default:
        this.merchantInfo.saleKind.value = ''
    }
    this.merchantInfo.contact.value = this.list.name
    this.merchantInfo.phoneNumber.value = this.list.telePhone

    // console.log('客户号。。。')
    // console.log(this.list.custNo == '' ? this.merchant.custNo : this.list.custNo)
    // console.log(this.merchant.custNo != '')
    // console.log('搜索' + this.merchant.custNo)
    // console.log('缓存' + this.list.custNo)
    axios.post(this.host + '/custOrder/getAddress',qs.stringify({
        // custCode:this.list.custNo == '' ? this.merchant.custNo : this.list.custNo
        custCode:this.list.custNo
      }),{
        headers:{
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then( data => {
        if(data.data.error == '0'){
          // console.log(data.data.errMsg)
          let address = JSON.parse(data.data.errMsg);
          // console.log('huancun')
          // console.log(address)
          address.map((item, key) => {
            if (item.address == '') {
              // console.log(key)
              address.splice(key, 1)
            }
          })
          if(address.length == 2 && address[1].address==''){
            this.address.options[0] = address[0];
            this.address.options.splice(1,1);
          }else{
            this.address.options = address;
          }
          // console.log(this.address.options[0].address)
          this.address.value = this.address.options[0].address;
        }
      })
    

    document.body.scrollTop = 0
  }


  //获取规格
  this.show = true;
  axios.post(''+this.host+'/custOrder/getStandard').then(data =>{
    // console.log('规格')
    // console.log(data.data)
    this.show = false;
    if(data.data.error == '0'){
      this.size.options = data.data.errMsg;

      this.size.options.map(item => {
        if (item.ctype === this.list.bottType) {
          this.list.bottType = item
        }
      })
      // console.log(this.list.bottType)
    }else if(data.data.error == '-1'){
      this.$vux.toast.show({
        text:'获取数据失败，请稍后重试',
        type:'text'
      })
    }
  })
  //禁止此刻之前的时间段选择
  this.hoursPick();
  
  

},
watch:{
  merchant:{
    handler:function(){
      // console.log("获取工商客户资料")
      // console.log(this.merchant,'获取工商客户资料')
      let self = this;
      //客户资料
     
      
      self.merchantInfo.contact.value = self.merchant.linkman;
      //客户性质
      // console.log('hahaha')
      // console.log(this.merchant)
      switch (this.merchant.custtype.substr(0,2)) {
        case '01':
          self.merchantInfo.customerKind.value = '工商业客户';
          break;
         case '02':
          self.merchantInfo.customerKind.value = '工业客户';
          break;
      } 

      this.merchantInfo.phoneNumber.value = this.merchant.mobiletel;
      //销售类型
      // switch (this.merchant.selltype.substr(0,2)) {
      let selltype = this.merchant.selltype.toString()
      if (selltype.indexOf(" ") >= 0) {
        this.merchant.selltype = selltype.replace(/\s+/g,"")
      } else {
        this.merchant.selltype
      }
      switch (this.merchant.selltype) {
        case '01':
          self.merchantInfo.saleKind.value = '结算客户'
          break;
        case '02':
          self.merchantInfo.saleKind.value = '月票客户'
          break;
        case '03':
          self.merchantInfo.saleKind.value = '现金客户'
          break;
        case '04':
          self.merchantInfo.saleKind.value = '其他'
          break;
      }

      //获取地址
      // if (this.list.address.length == 2 && this.list.address
      axios.post(self.host + '/custOrder/getAddress',qs.stringify({
        // custCode:self.merchant.custcode
        custCode:self.merchant.custNo
      }),{
        headers:{
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then( data => {
        if(data.data.error == '0'){
          // console.log(data.data.errMsg)
            let address = JSON.parse(data.data.errMsg);
            // console.log('搜索出来的')
            // console.log(JSON.parse(data.data.errMsg))
            address.map((item, key) => {
              if (item.address == '') {
                // console.log(key)
                address.splice(key, 1)
              }
            })
            // console.log(address)
            // self.address.options = address;
            // console.log( self.address.options)
            // if(self.address.options[1].address!=undefined && self.address.options[1].address==''){
            //   self.address.options.splice(1,1)
            // }
            if(address.length == 2 && address[1].address==''){
              self.address.options[0] = address[0];
              self.address.options.splice(1,1);
            }else{
              self.address.options = address;
            }
            
            self.address.value = self.address.options[0].address;
            // console.log(self.address.value)
            // self.address.options[0].value = self.merchant.linkaddr1;
            // if(self.address.options.length == 2 && self.address.options[1]==''){
            //   self.address.options[1].value = self.merchant.linkaddr2;              
            // }
        }
      })

      if(this.size.value && this.merchant && this.metering){
        // if (!this.list) {
          if (this.time.day == '今天') {
            // console.log('今天')
            this.getPrice(0)
            let nowDate = new Date()
            let hour = nowDate.getHours();
            let ohour = this.time.hour.split(':')[0]
            if (hour > ohour) {
              this.time.hour = ''
            }
          } else if (this.time.day == '明天') {
            // console.log('明天')
            this.getPrice(-1)
          } else {
            // console.log('后天')
            this.getPrice(-2)
          }
        // }
      }
      this.store.show = false;
      //是否有web_code，有默认公斤，没有默认瓶
      if(this.merchant.web_code!=''){
        self.metering.value = '1'
      }else{
        self.metering.value = '0'        
      }
      this.size.value = 'YSP118';// 更改默认的规格

      this.price.value = '';
      this.price.value1 = '';
      this.number.value = '';
      this.weight.value = '';
        // }
    },
    deep:true    
  },
  metering:{
    handler(){
      if(this.size.value && this.merchant){
        // if (this.list) {
          if (this.time.day == '今天') {
            // console.log('今天')
            this.getPrice(0)
            this.getTotalPrice(0)
            let nowDate = new Date()
            let hour = nowDate.getHours();
            let ohour = this.time.hour.split(':')[0]
            if (hour > ohour) {
              this.time.hour = ''
            }
          } else if (this.time.day == '明天') {
            // console.log('明天')
            this.getPrice(-1)
            this.getTotalPrice(-1)
          } else {
            // console.log('后天')
            this.getPrice(-2)
            this.getTotalPrice(-2)
          }
        // }
          
      }
    },
    deep:true
  },
  price:{
    handler(){
      if(this.metering.value && this.merchant && this.size.value){
        // if (this.list) {
          if (this.time.day == '今天') {
            // console.log('今天')
            this.getPrice(0)
            let nowDate = new Date()
            let hour = nowDate.getHours();
            let ohour = this.time.hour.split(':')[0]
            if (hour > ohour) {
              this.time.hour = ''
            }
          } else if (this.time.day == '明天') {
            // console.log('明天')
            this.getPrice(-1)
          } else {
            // console.log('后天')
            this.getPrice(-2)
          }
        // }
          
      }
    },
    deep:true
  },
  size:{
    handler(){
      if(this.metering.value && this.merchant && this.size.value){
        // if (this.list) {
          if (this.time.day == '今天') {
            // console.log('今天')
            this.getPrice(0)
            let nowDate = new Date()
            let hour = nowDate.getHours();
            let ohour = this.time.hour.split(':')[0]
            if (hour > ohour) {
              this.time.hour = ''
            }
          } else if (this.time.day == '明天') {
            // console.log('明天')
            this.getPrice(-1)
          } else {
            // console.log('后天')
            this.getPrice(-2)
          }
        // }
          
      }
      
    },
    deep:true
  },
  number:{
    handler(a,b){
      // 获取总净重
      // console.log(a,b)
      if( this.size.value && this.number.value && this.metering.value == '1'){
        this.getToatalWeight()
      }
      if(this.size.value && this.metering.value && this.merchant && this.number.value){
        this.getTotalPrice();
        if (this.time.day == '今天') {
          // console.log('今天')
          this.getTotalPrice(0)
          let nowDate = new Date()
          let hour = nowDate.getHours();
          let ohour = this.time.hour.split(':')[0]
          if (hour > ohour) {
            this.time.hour = ''
          }
        } else if (this.time.day == '明天') {
          // console.log('明天')
          this.getTotalPrice(-1)
        } else {
          // console.log('后天')
          this.getTotalPrice(-2)
        }
      }
    },
    deep:true
  },
  time: {
    handler(curVal, oldVal) {
      if (this.merchant.custname) {
        if (this.time.day == '今天') {
          // console.log('今天')
          this.getPrice(0)
          this.getTotalPrice(0)
          let nowDate = new Date()
          let hour = nowDate.getHours();
          let ohour = this.time.hour.split(':')[0]
          if (hour > ohour) {
            this.time.hour = ''
          }
        } else if (this.time.day == '明天') {
          // console.log('明天')
          this.getPrice(-1)
          this.getTotalPrice(-1)
        } else {
          // console.log('后天')
          this.getPrice(-2)
          this.getTotalPrice(-2)
        }
      }
        
    },
    deep: true
  }

},
  data(){
    return {
      host:'/huaxinneng/',
      list: {},
      custcode: '',
      merchant:{
        title:'商户选择',
        placeholder:'请选择商户',
        options:[{
            "areaid": "01  ", 
            "bank": "", 
            "bankno": "", 
            "busidate": "", 
            "closedate": "", 
            // "custcode": "230919", 
            "custdegree": "", 
            "custname": "东方彩制衣厂", 
            "custtype": "1", 
            "department": "新风", 
            "electrograph": "", 
            "favdate": "", 
            "favorable": 0, 
            "invoicetitle": "04", 
            "invoicetype": "1", 
            "linkaddr1": "", 
            "linkaddr2": "", 
            "linkman": "黎燕清", 
            "memo": "", 
            "mobiletel": "", 
            "openacc": "2", 
            "opendate": "2017-05-09 00:00:00", 
            "priceview": "", 
            "regaddr": "文华制衣城3座3楼东方彩制衣厂", 
            "selltype": "", 
            "staff": "杨彩谊", 
            "stoptype": "", 
            "usetype": "1   ", 
            "webcode": "", 
            "webupprice": 0, 
            "worktel": "83279783"
        }],
        value:''
      },
      store:{
        title:'门店选择',
        show:false,
        value:''
      },
      size:{
        title:'规格',
        options:[{
            "ctype": "", 
            "descrip": "", 
            "spectype": "", 
            "weight": "14.5"
        }],
        value:''
      },
      metering:{
        title:'计量单位',
        value:'1',
        options:[{key:'瓶',value:'0'},{key:'公斤',value:'1'}]
      },
      price:{
        title:'单价',
        value:'',
        value1:''
      },
      number:{
        title:'瓶数',
        placeholder:'请填写所需数量',
        value:''
      },
      weight:{
        title:'总净重',
        value:0
      },
      time:{
        title:'配送时间',
        value:'',
        day:'今天',
        hour:'',
        days:[{key:'今天',value:'today',disabled:false},{key:'明天',value:'tomorrow',disabled:false},{key:'后天',value:'aftertomorrow',disabled:false}],
        hours:[{key:'09:00-11:00',value:'9',disabled:false},{key:'10:00-12:00',value:'10',disabled:false},{key:'11:00-13:00',value:'11',disabled:false},{key:'14:00-16:00',value:'14',disabled:false},{key:'15:00-17:00',value:'15',disabled:false},{key:'16:00-18:00',value:'16',disabled:false}]
      },
      remark:{
        title:'备注',
        value:'',
        placeholder:'说点什么吧...'
      },
      merchantInfo:{ // 商户信息
        title:'商户信息',
        customerKind:{
          title:'客户性质',
          value:''
        },
        saleKind:{
          title:'销售类型',
          value:''
        },
        contact:{
          title:'联系人',
          value:''
        },
        phoneNumber:{
          title:'联系电话',
          value:''
        }
      },
      // 配送地址
      address:{
        title:'配送地址',
        value:'',
        value1:'',
        show:false,
        options:[{address:'地址1'},{address:'地址2'}]
      },
      tatol_price:'',
      show:false,
      showtext:'',
      searchName:'',
      // isenabled:true//按钮是否可按
    }
  },
  computed:{
    isenabled(){
      if(this.merchant.custname && this.price.value && this.number.value){
        return false
      }
    }
  }
}
</script>

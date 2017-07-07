<template lang="html">
  <div class="main">
    <ul class="main_input_box">
      <li>
        <span class="order_title">商户选择</span>
        <!--<select class="order_select merchant " name="merchant" v-model="merchant" @change="searchStore">
          <option value="" class="placeholder">{{merchant.placeholder}}</option>
          <option v-for="n in merchant.options" v-bind:value="n">{{n.custname}}</option>
        </select>-->
        <selectbox class="searchBox" v-on:search="search" v-bind:title="merchant.custname"></selectbox>
      </li>
      <li>
        <span class="order_title">{{store.title}}</span>
        {{merchant.department!=''?merchant.department:showSearchStore()}}
        <storebox class="searchBox" v-on:search="searchStore" v-show="store.show" v-bind:title="merchant.department"></storebox>
        
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
        <input v-else v-model="price.value1" class="pricebox" placeholder="请输入单价">
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
            <option v-for="n in time.days" v-model="n.value">{{n.key}}</option>
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
      <p>总价：<span class="tatol_price">￥{{tatol_price}}</span></p>
      <p>(总净重*单价)</p>
    </div>
    <div class="btn">
      <button type="button" name="button" class="button" @click="submit">提交订单</button>
    </div>
    <loading v-model="show" :text="showtext"></loading>
  </div>
</template>

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
      company:this.merchant.custname,
      custNo:this.merchant.custcode,
      deptNo:this.merchant.department,
      bottType:this.size.value,
      cType:this.metering.value,
      unitPrice:this.price.value?this.price.value:this.price.value1,
      bottleNum:this.number.value,
      bottleNum2:this.weight.value,
      appDate: this.getDate(this.time.day),
      time:this.time.hour,
      memo:this.remark.value,
      custType:parseInt( this.merchant.custtype ) + '',
      name:this.merchant.linkman,
      telePhone:this.merchant.mobiletel,
      address:this.address.value,
      selltype:this.merchant.selltype.substr(0,2),
      totalprice:this.tatol_price
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
    console.log(this.store.value)
    localStorage.setItem('order_list',JSON.stringify(data_obj));
    this.$router.push('sureOrder');


  },
  //根据商户获取门店
  searchStore(){
    this.getCustData();
    if(this.merchant){
      //如果选择的商户 有 department，就直接赋值给门店
      this.store.value = this.merchant.department;
      // console.log(this.store.value)
      this.store.options = [{department:this.merchant.department}]
    }else{
      
    }
    
  },
    //获取单价
  getPrice(){
    let self = this;
    self.show = true;//显示loading
    self.showtext = '正在获取单价...';
    let _data = {
      //组合数据
      unit:this.metering.value,//计量单位（1：公斤，0：瓶）
      custNo:this.merchant.custcode,//客户号
      custBottype:this.size.value//规格
    }
    _data = qs.stringify(_data)
    console.log(_data)
    axios.post(''+this.host+'/custOrder/getKiloOrVasePrice',_data,{
      headers:{
          'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then( data => {
      //单价
      self.show = false;
      console.log(data.data)
      if(data.data.error == '0'){
        this.price.value = data.data.errMsg;
      }else{
        self.price.value = '';
        self.$vux.toast.show({
             text: '获取单价失败，请手动输入',
             type:'warn'
           })
      }
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
  getTotalPrice(){
    let self = this;
    let _data;
    if(self.price.value1){
       _data = qs.stringify({
        unit:self.metering.value,//计量单位
        custNo:self.merchant.custcode,//用户号
        custBottype:self.size.value,//规格
        vaseNum:self.number.value,//瓶数
        price:self.price.value1 // 单价
      })
    }else{
       _data = qs.stringify({
        unit:self.metering.value,//计量单位
        custNo:self.merchant.custcode,//用户号
        custBottype:self.size.value,//规格
        vaseNum:self.number.value//瓶数
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
        localStorage.setItem('total',data.data.errMsg)

        return data.data.errMsg
      }else if(data.data.error == '4004'){
        this.tatol_price = '';
        self.$vux.toast.show({
          text:'获取总价出现问题，请联系管理员',
          type:'text'
        })
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
   this.time.hour = null;
    let hour = new Date().getHours();
    // console.log(hour,this.time.hours)
    if( this.time.day == '今天'){
      for(var i = 0; i < this.time.hours.length ; i ++){
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
 search(val){
   this.merchant = val;
 },
 //如果没有门店，显示搜索框
  showSearchStore(){
    this.store.show = true;
    return ''
 },
 // 门店搜索结果
 searchStore(val){
  this.merchant.department = val.deptName;
  this.store.show = false;
 }
  
},
 
mounted(){
    //获取要修改的订单的信息
    let list = JSON.parse(localStorage.getItem('order_list'));
    console.log(list)
    this.merchant.custname = list.company;//商户名
    this.merchant.custcode = list.
    this.merchant.department = list.deptNoName;//门店
    this.size.value = list.bottType.value;//规格
    this.metering.value = list.cType;// 公斤、瓶
    
    

  //获取规格
  this.show = true;
  axios.post(''+this.host+'/custOrder/getStandard').then(data =>{
    console.log(data.data)
    this.show = false;
    if(data.data.error == '0'){
      this.size.options = data.data.errMsg;
      this.size.value = this.size.options[0].deptNo;
    }
  })
  //禁止此刻之前的时间段选择
  this.hoursPick();
  
  //   console.log(name)
  // })
},
watch:{
  merchant:{
    handler:function(){
      console.log("获取工商客户资料")
      console.log(this.merchant)
      let self = this;
      //客户资料
      this.address.options[0].value = this.merchant.linkaddr1;
      this.address.options[1].value = this.merchant.linkaddr2;
      this.merchantInfo.contact.value = this.merchant.linkman;
      //客户性质
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
      switch (this.merchant.selltype.substr(0,2)) {
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
      axios.post(self.host + '/custOrder/getAddress',qs.stringify({
        custCode:self.merchant.custcode
      }),{
        headers:{
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then( data => {
        if(data.data.error == '0'){
            let address = JSON.parse(data.data.errMsg);
            self.address.options = address;
        }
      })

      if(this.size.value && this.merchant && this.metering){
        this.getPrice()
      }
      console.log(self.merchant)
      this.store.show = false;
    },
    deep:true    
  },
  metering:{
    handler(){
      if(this.size.value && this.merchant){
        this.getPrice()
        console.log(2)
      }
    },
    deep:true
  },
  price:{
    handler(){
      if(this.metering.value && this.merchant && this.size.value){
        this.getTotalPrice()
        console.log(3)
      }
    },
    deep:true
  },
  size:{
    handler(){
      if(this.metering.value && this.merchant && this.size.value){
        this.getPrice()
        console.log(3)
      }
      
    },
    deep:true
  },
  number:{
    handler(a,b){
      // 获取总净重
      console.log(a,b)
      if( this.size.value && this.number.value && this.metering.value == '1'){
        this.getToatalWeight()
      }
      if(this.size.value && this.metering.value && this.merchant && this.number.value){
        this.getTotalPrice();
      }
    },
    deep:true
  },
  address:{
    handler(){
      if(this.address.options[0].value=='' && this.address.options[1].value == ''){
        this.address.show = true;
        this.address.value = ''
      }
    },
    deep:true
  }
}
,
  data(){
    return {
      host:'/huaxinneng/',
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
            "custtype": "1   ", 
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
        value:'YSP35.5'
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
        days:[{key:'今天',value:'today'},{key:'明天',value:'tomorrow'},{key:'后天',value:'aftertomorrow'}],
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
          value:'月结/现付'
        },
        contact:{
          title:'联系人',
          value:'老王'
        },
        phoneNumber:{
          title:'联系电话',
          value:'15012345678'
        }
      },
      // 配送地址
      address:{
        title:'配送地址',
        value:'',
        value1:'',
        show:false,
        options:[{address:'广东省广州市天河区棠安路金豪商户大厦4033号4楼'},{address:'广东省广州市天河区棠安路金豪商户大厦4033号3楼'}]
      },
      tatol_price:'',
      show:false,
      showtext:'',
      searchName:''
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" >
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
      font-size:half(27)
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
    div
      line-height:29.5px
      div
        margin-bottom:12.5px
      div:first-child
        margin-top:12.5px
      div:last-child
        margin-bottom:12.5px

  li:nth-child(6)
    input
      border:none
      outline:none
  li:nth-child(8)
    align-items:center
    display:flex
    background:transparent
    .select-div
      height:half(64)
      padding-left:15px
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
      font-size:half(26)
      border-radius:8px
// 商户信息
.merchantBox
  margin-top:half(22)
  padding:0 half(30)
  background:#fff
  padding-bottom:half(60)
  .merchan_title
    color:$fontColor
    font-size:half(35)
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
    bottom: -49px;
.tatol
  height:half(205)
  text-align:center
  p:first-child
    margin-top:half(50)
    font-size:half(28)
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
  line-height:29.5pxW
  margin-right:half(11)
  border:1px solid $borderColor
  font-size:half(23)
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

.address_input
  height: 65px;
  width: 93.5%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-bottom: 10px;
  font-size: 15px;
  position: relative;
  overflow: hidden;
  outline:none






</style>
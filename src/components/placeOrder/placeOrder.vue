<template lang="html">
  <div class="main">
    <ul class="main_input_box">
      <li>
        <span class="order_title">商户选择</span>
        <!--<select class="order_select merchant " name="merchant" v-model="merchant" @change="searchStore">
          <option value="" class="placeholder">{{merchant.placeholder}}</option>
          <option v-for="n in merchant.options" v-bind:value="n">{{n.custname}}</option>
        </select>--> 
        <selectbox class="searchBox" v-on:search="search" :name="this.merchant.custname" ></selectbox>
    <!--     <selectbox class="searchBox" v-on:search="search" v-if="!merchant.custname"></selectbox>
        <input type="text" v-model="merchant.custname" :placeholder="merchant.placeholder" @click="isShow"> -->
      </li>
      <li>
        <span class="order_title">{{store.title}}</span>
        <!-- {{merchant.deptNoName!=''?merchant.deptNoName:showSearchStore()}} -->
        <!-- <storebox class="searchBox" v-on:search="searchStore" v-show="store.show" :store="this.merchant.deptNoName"></storebox> -->
        <storebox class="searchBox" v-on:searchStore="searchStore" :store="merchant.deptNoName"></storebox>
        
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
      <li>
        <span class="order_title">{{price.title}}</span>
        <span v-if="!priceValue">￥{{price.value}}</span>
        <div v-if="priceValue" class="box">
          <span class="pricebox"></span>
          <input v-model="price.value" class="pricebox" placeholder="请输入单价" type="number">
          <button class="price_btn" @click="priceBtn">确定</button>
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
            <span>{{merchantInfo.custcode.title}}</span>：
            <span>{{merchantInfo.custcode.value}}</span>
          </li>
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
      cardNo:!this.merchant.custNo ? this.list.cardNo : this.merchant.custNo,//商户代码  
      deptNo:this.merchant.deptno,//门店编号
      deptNoName:this.merchant.deptNoName,//门店名
      // deptNoName:this.merchant.deptNoName,//门店名
      // botttype:this.size.value,//规格
      bottType: this.size.spectype,
      // cType:this.metering.value,//计量单位
      unit:this.metering.value,//计量单位
      unitPrice:this.price.value?this.price.value:this.price.value1,//单价
      bottleNum:this.number.value,//瓶数
      // sumWeight:parseInt(this.weight.value),//重量
      sumWeight:this.weight.value,//重量
      appDate: this.getDate(this.time.day),//配送日期
      time:this.time.hour,//时间段
      memo:this.remark.value,//备注
      // custType:this.merchant.custtype.substr(0,2),//客户类型
      custType:this.merchant.custtype,//客户类型
      name:this.merchantInfo.contact.value,//联系人
      // telePhone:this.merchant.mobiletel,//手机号
      telePhone:this.merchantInfo.phoneNumber.value,//手机号
      address:this.address.value,//地址
      addrser:this.address.addrser,
      // selltype:this.merchant.selltype.substr(0,2),//销售类型
      selltype:this.merchant.selltype,//销售类型
      // selltype:this.list.selltype,
      totalprice:this.tatol_price, //总价
      web_code: this.merchant.web_code,
      dayNum: 0
    }

    if (this.metering.value == '0') {
      data_obj.sumWeight = ''
    }
    if (this.time.day == '今天') {
      data_obj.dayNum = 0
    } else if (this.time.day == '明天') {
      data_obj.dayNum = -1
    } else if (this.time.day == '后天') {
      data_obj.dayNum  = -2
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
    } else if (!data_obj.deptNoName) {
      self.$vux.toast.show({
        text:'请选择门店',
        type:'text'
      })
      return
    }else if(!data_obj.bottType){
      self.$vux.toast.show({
        text:'请选择规格',
        type:'text'
      })
      return
    } else if (!data_obj.unitPrice) {
      self.$vux.toast.show({
        text:'请填写单价',
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
    // } else if (this.metering.value === '1' && this.unitStatus) {
    } else if (this.metering.value === '1') {
      console.log('web_code')
      console.log(this.merchant.web_code)
      if (this.merchant.web_code) {
        let params = { webCode: this.merchant.web_code, dayNum: data_obj.dayNum }
        axios.post(this.host + '/custOrder/getWebPrice', qs.stringify(params)).then(res => {
          console.log('web_code')
          console.log(res.data)
          if (res.data.error == '-1') {
              self.$vux.toast.show({
              text:'网价未出，不能下单',
              type:'text'
            })
          } else {
            console.log('list' + this.list.cardNo)
            console.log('merchant' + this.merchant.custNo)
            localStorage.setItem('order_list',JSON.stringify(data_obj));
            console.log('placeOrder提交订单')
            console.log(data_obj)
            this.$router.push('sureOrder');
          }
        })
          
      } else {
        self.$vux.toast.show({
          text:'获取不到网站代码，不能下单',
          type:'text'
        })
      }
    } else if (this.metering.value === '0') {
      console.log('list' + this.list.cardNo)
      console.log('merchant' + this.merchant.custNo)
      localStorage.setItem('order_list',JSON.stringify(data_obj));
      console.log('placeOrder提交订单')
      console.log(data_obj)
      this.$router.push('sureOrder');
    }
    

    // this.list.cardNo : this.merchant.custNo
    // console.log('list' + this.list.cardNo)
    // console.log('merchant' + this.merchant.custNo)
    // localStorage.setItem('order_list',JSON.stringify(data_obj));
    // console.log('placeOrder提交订单')
    // console.log(data_obj)
    // this.$router.push('sureOrder');
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
  priceBtn () {
    this.priceValue = false
  },
  
  //获取单价
  getPrice(number){
    let self = this;
    self.show = true;//显示loading
    self.showtext = '正在获取单价...';
    let _data = {
      //组合数据
      unit:this.metering.value,//计量单位（1：公斤，0：瓶）
      cardNo:!this.merchant.custNo ? this.list.cardNo : this.merchant.custNo,//客户号
      // custNo:this.merchant.custcode,//客户号
      custBottype:this.size.value,//规格
      dayNum: number,
      floor: this.address.floor
    }
    // let isTrue = false
    // if (_data.unit && _data.cardNo && _data.custBottype && _data.dayNum && _data.floor) {
    //   isTrue = true
    // }
    // if (isTrue) {
    _data = qs.stringify(_data)
    // console.log(_data)
    axios.post(''+this.host+'/custOrder/getKiloOrVasePrice',_data,{
      headers:{
          'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then( data => {
      //单价
      self.show = false;
      console.log('调用单价')
      console.log(data.data)
      if(data.data.error == '0'){
        this.price.value = data.data.errMsg;
        this.priceValue = false
        this.unitStatus = false
        if (data.data.errMsg == 0) {
          this.priceValue = true
        }
      }else if (data.data.error == '4004' || data.data.error == '4003') {
        this.unitStatus = true
        this.priceValue = true
          self.price.value = '';
          self.$vux.toast.show({
             text: '获取单价为空，请手动输入',
             type:'text'
           })   
      }
    })
    // }
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
      } else {
        self.$vux.toast.show({
          text:'获取总净重失败，请稍后重试',
          type:'text'
        })
        this.metering.value = ''
      }
    })
  },
  //获取总价
  getTotalPrice(number){
    let self = this;
    let _data;

    _data = qs.stringify({
      unit:self.metering.value,//计量单位
      // cardNo:self.merchant.custNo,//用户号
      cardNo:!self.merchant.custNo ? self.list.cardNo : self.merchant.custNo,//用户号
      // custNo:self.merchant.custcode,//用户号
      custBottype:self.size.value,//规格
      vaseNum:self.number.value,//瓶数
      price:self.price.value, // 单价
      dayNum: number,
      floor: this.address.floor
    })

    
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
  // if (this.merchant) {
  //   this.merchant = null
  // }
  // this.merchant = {}
   this.merchant = val;
   this.merchant.custtype = this.merchant.custtype.replace(/\s+/g,"")
   this.merchant.custNo = this.merchant.custcode
   console.log('客户号')
   console.log(this.merchant)
 },
 //如果没有门店，显示搜索框
 //  showSearchStore(){
 //    this.store.show = true;
 //    return ''
 // },
 
 // 门店搜索结果
 searchStore(val){
  console.log('门店')
  // debugger
  // this.merchant.deptNoName = ''
  this.merchant.deptNoName = val.deptName;
  this.merchant.deptno = val.deptNo
  // this.store.show = false;
  console.log(this.merchant)
  // this.depo.name = val.deptName;
  // this.depo.no = val.deptNo
 },

 searchname (val) {
  console.log('searchname')
  console.log(val.deptNoName)
  // this.merchant.deptNoName = val.deptNoName;
  // this.merchant.deptno = val.deptno
 },
},
created(){
  // console.log('merchant')
  // console.log(this.merchant)

  //获取规格
  this.show = true;
  axios.post(''+this.host+'/custOrder/getStandard').then(data =>{
    this.show = false;
    if(data.data.error == '0'){
      this.size.options = data.data.errMsg;
      this.size.options.map(item => {
        if (item.ctype === this.list.bottType) {
          this.list.bottType = item
        }
      })
      if (this.list.bottType) {
        let bottType = this.list.bottType
        if (bottType.indexOf(" ") >= 0) {
          this.size.options.map(item => {
            if (bottType.replace(/\s+/g,"") === item.spectype) {
              this.size.value = item.ctype
            }
          })
        } else {
          this.size.options.map(item => {
            if (bottType === item.spectype) {
              this.size.value = item.ctype
            }
          })
        }
      }
    }else if(data.data.error == '-1'){
      this.$vux.toast.show({
        text:'获取数据失败，请稍后重试',
        type:'text'
      })
    }
  })

  // 时间
  let nowDate = new Date()
  let hour = nowDate.getHours();
  if (hour > 16) {
    this.time.day = '明天'
    this.time.days[0].disabled = true; 
  } else {
    this.time.days[0].disabled = false; 
  }
  
  if (localStorage.getItem('order_list')) {
    this.list = JSON.parse(localStorage.getItem('order_list'))
    console.log('list')
    console.log(this.list)
    
    this.merchant.custname = this.list.company

    this.merchant.deptNoName = this.list.deptNoName
    this.merchant.deptno = this.list.deptNo
    this.merchant.web_code = this.list.web_code

    // this.merchant.deptNoName = this.merchant.deptNoName || this.list.deptNoName
    // this.merchant.deptno = this.merchant.deptno || this.list.deptNo

    console.log('merchant')
    console.log(this.merchant)
    
    this.price.value = this.unitPrice

    if (this.list.unit != '') {
      this.metering.value = this.list.unit
    }
    
    if (this.list.sumWeight !== 0 || this.list.sumWeight !== '' || this.list.sumWeight !== null) {
      this.weight.value = this.list.sumWeight
    }

    this.number.value = this.list.bottleNum

    let dates = this.list.appDate
    if (dates.indexOf('/') > 0) {
      dates = dates.split('/')
    } else {
      let str = dates.split(' ')[0]
      dates = str.split('-')
    }

    let nowDate = new Date()
    let hour = nowDate.getHours();
    let day = parseInt(dates[2]) - nowDate.getDate()
    
    if (day == 2) {
      this.time.day = '后天'
    } else if (day == 1) {
      this.time.day = '明天'
    } else if (day == 0 && hour > 16) {
      this.time.day = '明天'
    } else {
      this.time.day = '今天'
      console.log('kankan')
    }


    this.remark.value = this.list.memo

    let custType = this.list.custType
    // this.merchantInfo.customerKind.value = this.list.custType == '01' ? '工商业客户' : '工业客户'
    this.merchant.custtype = this.list.custType
    this.merchantInfo.custcode.value = this.list.cardNo
    console.log(this.list.custType)
    if (typeof(this.list.custType) === 'number') {
      switch (this.list.custType) {
        case 0:
          this.merchantInfo.customerKind.value = '民用';
          break;
        case 1:
          this.merchantInfo.customerKind.value = '商用';
          break;
        case 2:
          this.merchantInfo.customerKind.value = '工业';
          break;
        case 3:
          this.merchantInfo.customerKind.value = '批发';
          break;
      } 
    } else {
      switch (this.list.custType) {
        case '0':
          this.merchantInfo.customerKind.value = '民用';
          break;
        case '1':
          this.merchantInfo.customerKind.value = '商用';
          break;
        case '2':
          this.merchantInfo.customerKind.value = '工业';
          break;
        case '3':
          this.merchantInfo.customerKind.value = '批发';
          break;
      } 
    }

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

    // 地址
    console.log('号')
    console.log(!this.list.cardNo ? this.list.custNo : this.list.cardNo)
    axios.post(this.host + '/custOrder/getAddress',qs.stringify({
        custCode:!this.list.cardNo ? this.list.custNo : this.list.cardNo
      }),{
        headers:{
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then( data => {
        if(data.data.error == '0'){
          let address = JSON.parse(data.data.errMsg);
          console.log(address)
          address.map((item, key) => {
            if (item.address == '') {
              address.splice(key, 1)
            }
          })
          this.address.options = address
          let index = 0
          address.map((item, key) => {
            if (item.address == this.list.address) {
              index = key
            }
          })
          console.log(address[index].address)
          this.address.value = this.address.options[index].address;
          this.address.floor = this.address.options[index].floor
          this.address.addrser = this.address.options[index].addrser
          console.log(this.address.floor)
          console.log(this.address.addrser)
        }
      })
    
    document.body.scrollTop = 0
  }

  
  //禁止此刻之前的时间段选择
  setTimeout(() => {
    this.hoursPick();
  }, 0)
  // this.hoursPick();

  // this.merchant.deptNoName = this.deptNoName1
  // this.merchant.deptno = this.deptno1
  console.log('merchant_local')
  console.log(this.merchant)

  if (this.list.time) {
    let time = this.list.time.split(':')[0]
    if (time < hour) {
      if (this.time.day == '今天') {
        for(var i = 0; i < this.time.hours.length; i++){
          if (parseInt(this.time.hours[i].value) == hour) {
            this.time.hour = this.time.hours[i].key
            // console.log(parseInt(this.time.hours[i].value))
            return false
          }
        }
      } else {
        this.time.hour = this.list.time
      }   
    } else {
      this.time.hour = this.list.time
    }
  } else {
    if (this.time.day == '今天') {
      if (hour < 16) {
        for (var i = 0; i < this.time.hours.length; i++) {
          if (parseInt(this.time.hours[i].value) == hour) {
            this.time.hour = this.time.hours[i].key
            // console.log(parseInt(this.time.hours[i].value))
            return false
          }
        }
      } else {
        this.time.day = '明天'
        this.time.hour = this.time.hours[0].key
      }
    }
  }
  
  console.log(this.time.hour)
  console.log('merchant_local')
  console.log(this.merchant)

},
watch:{
  'merchant.deptNoName' (val) {
    console.log('deptNoName')
    console.log(val)
  },
  'merchant.custname' (val) {
  // merchant:{
  //   handler:function(){
      let self = this;
      //客户资料
      self.merchantInfo.custcode.value = self.merchant.custcode
      self.merchantInfo.contact.value = self.merchant.linkman;
      //客户性质
      // switch (this.merchant.custtype.substr(0,2)) {
      switch (this.merchant.custtype) {
        case '0':
          self.merchantInfo.customerKind.value = '民用';
          break;
        case '1':
          self.merchantInfo.customerKind.value = '商用';
          break;
        case '2':
          self.merchantInfo.customerKind.value = '工业';
          break;
        case '3':
          self.merchantInfo.customerKind.value = '批发';
          break;
      } 

      this.merchantInfo.phoneNumber.value = this.merchant.mobiletel;
      //销售类型
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
      axios.post(self.host + '/custOrder/getAddress',qs.stringify({
        custCode:self.merchant.custNo
      }),{
        headers:{
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then( data => {
        if(data.data.error == '0'){
            let address = JSON.parse(data.data.errMsg);
            console.log('搜索出来的')
            console.log(address)
            address.map((item, key) => {
              if (item.address == '') {
                address.splice(key, 1)
              }
            })
            this.address.options = address
            this.address.value = this.address.options[0].address;
            this.address.floor = this.address.options[0].floor
            this.address.addrser = this.address.options[0].addrser
            console.log(this.address.floor)
            console.log(this.address.addrser)
        }
      })

      if(this.size.value && this.merchant.custname && this.metering){
          if (this.time.day == '今天') {
            console.log('资料')
            this.getPrice(0)
          } else if (this.time.day == '明天') {
            console.log('资料')
            this.getPrice(-1)
          } else {
            console.log('资料')
            this.getPrice(-2)
          }
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
    // },
    // deep:true    
  },
  metering:{
    handler(nVal, oVal){
      // if (nVal !== oVal) {
        if(this.size.value && this.merchant.custname){
            if (this.time.day == '今天') {
              console.log('计量单位')
              if (this.metering.value === '1') {
                this.getPrice(0)
                if (this.number.value) {
                  this.getToatalWeight()
                 
                } 
                // else {
                  // this.getPrice(0)
                // }
                
              } else if (this.metering.value === '0') {
                this.getPrice(0)
              }
              // this.getPrice(0)
              // if (this.price.value) {
              if (this.price.value && this.number.value) {
                this.getTotalPrice(0)
              }
            } else if (this.time.day == '明天') {
              console.log('计量单位')
              if (this.metering.value === '1') {
                // this.getToatalWeight()
                this.getPrice(-1)
                if (this.number.value) {
                  this.getToatalWeight()
                 
                } 
              } else if (this.metering.value === '0') {
                this.getPrice(-1)
              }
              // this.getPrice(-1)
              // if (this.price.value) {
              if (this.price.value && this.number.value) {
                this.getTotalPrice(-1)
              }
              // this.getTotalPrice(-1)
            } else {
              console.log('计量单位')
              if (this.metering.value === '1') {
                this.getPrice(-2)
                if (this.number.value) {
                  this.getToatalWeight()
                }
                this.getToatalWeight()
              } else if (this.metering.value === '0') {
                this.getPrice(-2)
              }
              // this.getPrice(-2)
              // if (this.price.value) {
              if (this.price.value && this.number.value) {
                this.getTotalPrice(-2)
              }
              // this.getTotalPrice(-2)
            }
          // }
            
        // }
      }
    },
    deep:true
  },

  'price.value' (val) {
    console.log(val)

    if (val !== '') {
      // if (this.metering.value && this.merchant && this.size.value) {
      if (this.metering.value && this.merchant && this.size.value && this.address.value) {
        // setTimeout(() => {
          if (this.time.day == '今天') {
            // console.log('单价')
            // this.getPrice(0)
            this.getTotalPrice(0)
            // let nowDate = new Date()
            // let hour = nowDate.getHours();
            // let ohour = this.time.hour.split(':')[0]
            // if (hour > ohour) {
            //   this.time.hour = ''
            // }
          } else if (this.time.day == '明天') {
            // console.log('单价')
            // this.getPrice(-1)
            this.getTotalPrice(-1)
          } else {
            // console.log('单价')
            // this.getPrice(-2)
            this.getTotalPrice(-2)
          }
        // }, 300)
          
      // }
      }  
    } else {
      this.tatol_price = ''
    }
  },
  size:{
    handler(val){
      console.log(val)
      this.size.options.map(item => {
        if (item.ctype === val.value) {
          this.size.spectype = item.spectype
        }
      })
      console.log(this.size.spectype)
      // if(this.metering.value && this.merchant && this.size.value){
      if(this.metering.value && this.merchant && this.size.value && this.address.value){
        // if (this.list) {
          if (this.time.day == '今天') {
            console.log('规格')
            // if (this.metering.value === '1' && this.number.value) {
            if (this.metering.value === '1') {
              if (this.number.value) {
                this.getToatalWeight()
              }
              // this.getToatalWeight()
              if (this.price.value === '' || this.price.value === null || this.price.value === undefined) {
                this.getPrice(0)
              }
              // this.getPrice(0)
            } else if (this.metering.value === '0') {
              this.getPrice(0)
            }
            // this.getPrice(0)
            if (this.price.value) {
              this.getTotalPrice(0)
            }
            // this.getTotalPrice(0)
            // let nowDate = new Date()
            // let hour = nowDate.getHours();
            // let ohour = this.time.hour.split(':')[0]
            // if (hour > ohour) {
            //   this.time.hour = ''
            // }
          } else if (this.time.day == '明天') {
            console.log('规格')
            // if (this.metering.value === '1' && this.number.value) {
            if (this.metering.value === '1') {
              if (this.number.value) {
                this.getToatalWeight()
              }
              if (this.price.value === '' || this.price.value === null || this.price.value === undefined) {
                this.getPrice(-1)
              }
            } else if (this.metering.value === '0') {
              this.getPrice(-1)
            }
            if (this.price.value) {
              this.getTotalPrice(-1)
            }
            // this.getTotalPrice(-1)
          } else {
            console.log('规格')
            if (this.metering.value === '1' && this.number.value) {
              if (this.number.value) {
                this.getToatalWeight()
              }
              // this.getToatalWeight()
              if (this.price.value === '' || this.price.value === null || this.price.value === undefined) {
                this.getPrice(-2)
              }
            } else if (this.metering.value === '0') {
              this.getPrice(-2)
            }
            if (this.price.value) {
              this.getTotalPrice(-2)
            }
            // this.getTotalPrice(-2)
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
      if(this.size.value && this.metering.value && this.merchant && this.number.value && this.price.value){
        // this.getTotalPrice();
        if (this.time.day == '今天') {
          console.log('数量')
           // if(this.metering.value == '1'){
           //    this.getToatalWeight()
           //  }

          this.getTotalPrice(0)
          // let nowDate = new Date()
          // let hour = nowDate.getHours();
          // let ohour = this.time.hour.split(':')[0]
          // if (hour > ohour) {
          //   this.time.hour = ''
          // }
        } else if (this.time.day == '明天') {
          console.log('数量')
          this.getTotalPrice(-1)
        } else {
          console.log('数量')
          this.getTotalPrice(-2)
        }
      }
      if (this.number.value === '') {
        this.weight.value = null
      }
    },
    deep:true
  },
  // address: {
  //   handler(val) {
  //     console.log(val)
  //     if(this.metering.value && this.merchant && this.size.value){
  //       // if (this.list) {
  //       if (this.time.day == '今天') {
  //         console.log('地址')
  //         this.getPrice(0)
  //         this.getTotalPrice(0)
  //         let nowDate = new Date()
  //         let hour = nowDate.getHours();
  //         let ohour = this.time.hour.split(':')[0]
  //         if (hour > ohour) {
  //           this.time.hour = ''
  //         }
  //       } else if (this.time.day == '明天') {
  //         console.log('地址')
  //         this.getPrice(-1)
  //         this.getTotalPrice(-1)
  //       } else {
  //         console.log('地址')
  //         this.getPrice(-2)
  //         this.getTotalPrice(-2)
  //       }    
  //     }
  //   }, 
  //   deep: true
  // },
  'address.value' (val) {
    console.log(val)
    console.log(this.address.options)
    this.address.options.map(item => {
      if (item.address === val) {
        this.address.addrser = item.addrser
      }
    })
    if (val) {
      if(this.metering.value && this.merchant && this.size.value){
        // if (this.list) {
        if (this.time.day == '今天') {
          console.log('地址')
          // if ()
          this.getPrice(0)
          if (this.price.value) {
            this.getTotalPrice(0)
          }
          // this.getTotalPrice(0)
          // let nowDate = new Date()
          // let hour = nowDate.getHours();
          // let ohour = this.time.hour.split(':')[0]
          // if (hour > ohour) {
          //   this.time.hour = ''
          // }
        } else if (this.time.day == '明天') {
          console.log('地址')
          this.getPrice(-1)
          if (this.price.value) {
            this.getTotalPrice(-1)
          }
          // this.getTotalPrice(-1)
        } else {
          console.log('地址')
          this.getPrice(-2)
          if (this.price.value) {
            this.getTotalPrice(-2)
          }
          // this.getTotalPrice(-2)
        }    
      }
    }
  },
  'time.day' () {
    // if (this.merchant.custname) {
        if (this.time.day == '今天') {
          if (this.metering.value && this.size.value && this.merchant.custname) {
            console.log('时间')
            this.getPrice(0)
            if (this.price.value) {
              // this.getPrice(0)
              this.getTotalPrice(0)
            }
            // this.getTotalPrice(0)
          }
          
          let nowDate = new Date()
          let hour = nowDate.getHours();
          let ohour = this.time.hour.split(':')[0]
          if (hour > ohour) {
            // this.time.hour = ''
            if (hour < 16) {
              for (var i = 0; i < this.time.hours.length; i++) {
                if (parseInt(this.time.hours[i].value) == hour) {
                  this.time.hour = this.time.hours[i].key
                  // console.log(parseInt(this.time.hours[i].value))
                  return false
                }
              }
            }
            //  else {
            //   this.$vux.toast.show({
            //     text:'今天送气时间已过，请重新选择',
            //     type:'text'
            //   })
            //   // return false
            //   this.time.day = '明天'
            //   this.time.hour = this.time.hours[0].key
            // }
          }
        } else if (this.time.day == '明天') {
          // console.log('明天')
          if (this.metering.value && this.size.value && this.merchant.custname) {
            console.log('时间')
            this.getPrice(-1)
            if (this.price.value) {
              // this.getPrice(-1)
              this.getTotalPrice(-1)
            }
            // this.getTotalPrice(0)
          }
          if (!this.list.time) {
            this.time.hour = this.time.hours[0].key
          }
        } else {
          // console.log('后天')
          if (this.metering.value && this.size.value && this.merchant.custname) {
            console.log('时间')
            this.getPrice(-2)
            if (this.price.value) {
              // this.getPrice(-2)
              this.getTotalPrice(-2)
            }
            // this.getTotalPrice(-2)
          }
          if (!this.list.time) {
            this.time.hour = this.time.hours[0].key
          }
        }
      // }
  },
  'time.hour' () {
    // console.log(this.time.hour)
    // alert(val)
    if (this.time.day == '今天') {

      let nowDate = new Date()
      let hour = nowDate.getHours();
      let ohour = this.time.hour.split(':')[0]
      // console.log(hour)
      // console.log(hour >= parseInt(ohour))
      if (hour > ohour) {
        // this.time.hour = ''
        if (hour < 16) {
          for (var i = 0; i < this.time.hours.length; i++) {
            if (parseInt(this.time.hours[i].value) == hour) {
              this.time.hour = this.time.hours[i].key
              // console.log(parseInt(this.time.hours[i].value))
              return false
            }
          }
        }
      }
    }
    if (this.time.day == '明天') {

    }
  },


  // if (this.time.day == '今天') {
  //     if (hour < 17) {
  //       for (var i = 0; i < this.time.hours.length; i++) {
  //         if (parseInt(this.time.hours[i].value) == hour) {
  //           this.time.hour = this.time.hours[i].key
  //           // console.log(parseInt(this.time.hours[i].value))
  //           return false
  //         }
  //       }
  //     } else {
  //       this.time.day = '明天'
  //       this.time.hour = this.time.hours[0].key
  //     }
  //   }
  // time: {
  //   handler(a, b) {
  //     if (this.merchant.custname) {
  //       // if (curVal.hour !== oldVal.hour)
  //       // console.log(a.hour)
  //       // console.log(b.hour)
  //       if (this.time.day == '今天') {
  //         // console.log('今天')
  //         this.getPrice(0)
  //         this.getTotalPrice(0)
  //         let nowDate = new Date()
  //         let hour = nowDate.getHours();
  //         let ohour = this.time.hour.split(':')[0]
  //         if (hour > ohour) {
  //           this.time.hour = ''
  //         }
  //       } else if (this.time.day == '明天') {
  //         // console.log('明天')
  //         this.getPrice(-1)
  //         this.getTotalPrice(-1)
  //       } else {
  //         // console.log('后天')
  //         this.getPrice(-2)
  //         this.getTotalPrice(-2)
  //       }
  //     }
        
  //   },
  //   deep: true
  // }

},
  data(){
    return {
      
      unitStatus: false,
      sizes: [],
      priceValue: true,
      host:'/huaxinneng/',
      list: {},
      custcode: '',
      // merchant:{
      //   title:'商户选择',
      //   placeholder:'请选择商户',
      //   options:[{
      //       "areaid": "01  ", 
      //       "bank": "", 
      //       "bankno": "", 
      //       "busidate": "", 
      //       "closedate": "", 
      //       // "custcode": "230919", 
      //       "custdegree": "", 
      //       "custname": "东方彩制衣厂", 
      //       "custtype": "1", 
      //       "department": "新风", 
      //       "electrograph": "", 
      //       "favdate": "", 
      //       "favorable": 0, 
      //       "invoicetitle": "04", 
      //       "invoicetype": "1", 
      //       "linkaddr1": "", 
      //       "linkaddr2": "", 
      //       "linkman": "黎燕清", 
      //       "memo": "", 
      //       "mobiletel": "", 
      //       "openacc": "2", 
      //       "opendate": "2017-05-09 00:00:00", 
      //       "priceview": "", 
      //       "regaddr": "文华制衣城3座3楼东方彩制衣厂", 
      //       "selltype": "", 
      //       "staff": "杨彩谊", 
      //       "stoptype": "", 
      //       "usetype": "1   ", 
      //       "webcode": "", 
      //       "webupprice": 0, 
      //       "worktel": "83279783"
      //   }],
      //   value:''
      // },
      merchant: {},
      store:{
        title:'门店选择',
        show:false,
        value:''
      },
      size:{
        title:'规格',
        spectype: '',
        options:[{
            "ctype": "", 
            "descrip": "", 
            "spectype": "", 
            "weight": ""
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
        hours:[{key:'07:00-09:00',value:'7',disabled:false},{key:'09:00-11:00',value:'9',disabled:false},{key:'10:00-12:00',value:'10',disabled:false},{key:'11:00-13:00',value:'11',disabled:false},{key:'13:00-15:00',value:'13',disabled:false},{key:'14:00-16:00',value:'14',disabled:false},{key:'15:00-17:00',value:'15',disabled:false},{key:'16:00-18:00',value:'16',disabled:false}]
        // hours:[{key:'09:00-11:00',value:'9',disabled:false},{key:'10:00-12:00',value:'10',disabled:false},{key:'11:00-13:00',value:'11',disabled:false},{key:'14:00-16:00',value:'14',disabled:false},{key:'15:00-17:00',value:'15',disabled:false},{key:'16:00-18:00',value:'16',disabled:false}]
      },
      remark:{
        title:'备注',
        value:'',
        placeholder:'说点什么吧...'
      },
      merchantInfo:{ // 商户信息
        title:'商户信息',
        custcode: {
          title: '客户编号',
          value: ''
        },
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
        floor: 0,
        addrser: 1,
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

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import './../libs/icon/iconfont.css'
@import './../libs/stylus/same.styl'
half()
  return (arguments/2)px
.main
  overflow-x:hidden
  background:#f2f3f8
.price_btn
  background:#eb942d
  border: none
  margin:10px 0
  padding:5px 10px
  border-radius:2px
  color:#fff
  position: absolute;
  right: 0;
  top: 0;
.box {
  position: relative;
  width: 100%;
}
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
    font-size:half(26)
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
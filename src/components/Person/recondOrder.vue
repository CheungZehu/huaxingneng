<template lang="html">
  <div class="main">
    <div class="step">
      <p>订单状态</p>
      <ul class="step-box">
        <li>
          <span class="xiadan-icon" :class="order_status=='0'?'active-icon':''"></span>
          <span>下单</span>
        </li>
        <li>
          <span class="dayin-icon" :class="order_status=='1'||order_status=='2'?'active-icon':''"></span>
          <span>打印</span>
        </li>
        <li>
          <span class="wancheng-icon" :class="order_status=='4'?'active-icon':''"></span>
          <span>完成</span>
        </li>
      </ul>
      <p>注：订单打印后将不允许修改</p>
    </div>
    <group title="配送信息">
      <cell v-for="n in sendInfo" :title="n.key"  :value="n.value" primary="content"></cell>
    </group>
    <group title="商户信息">
      <cell v-for="n in merchantInfo" :title="n.key"  :value="n.value" ></cell>
    </group>
    <div class="tatol">
      <p>总价<span>￥{{tatol}}</span></p>
      <!-- <p>(总净重*单价)</p> -->
      <p>{{ list.unit == '0' ? '(瓶数*单价)' : '(总净重*单价)' }}</p>
    </div>
<!--     <div class="btn-box">
      <button class="btn"  :disabled="order_status=='0'?false:true" @click="getChange">{{order_status!='0'?'已打印，不可修改':'修改'}}</button>
      <button class="btn"   v-if="order_status=='0'?true:false" @click="showConfirm=true">取消订单</button>
    </div> -->
        <loading v-model="show"></loading>
              
    <!-- 弹窗<confirm v-model="showConfirm"
        title=" "
        @on-cancel="onCancel"
        @on-confirm="onConfirm"
        @on-show="onShow"
        @on-hide="onHide">
        <input type="number" placeholder="请输入修改的单价" class="inputBox" v-model="pricevalue">
        <p>总价:￥{{tatol}}</p>
    </confirm>
    -->
       <confirm v-model="showConfirm"
      title="确认取消订单？"
      @on-cancel="onCancel"
      @on-confirm="delOrder">
      </confirm>
      <confirm v-model="showUpdate" @on-confirm="updatePrice">
        <group title="修改订单">
        <x-input v-model="update_price" title="单价：￥" placeholder="请输入修改后的单价"></x-input>
        <x-input v-model="sendInfo[2].value" title="原单价：￥" disabled="disabled"></x-input>
      
        <x-input v-model="update_total" title="总价：￥" disabled="disabled"></x-input>
        <x-input v-model="tatol" title="原总价：￥" disabled="disabled"></x-input>
        <p style="font-size:12px;color: #eb942d;">修改订单只支持修改单价</p>
        </group>
      </confirm>
  </div>
</template>

<script>
import { Checker , CheckerItem ,Selector, Group ,CellBox ,Step, StepItem , Cell , Loading , Confirm ,XInput} from 'vux'
import axios from 'axios'
import qs from 'qs'
export default {
  components:{ Checker , CheckerItem ,Selector ,Group , CellBox,Step, StepItem ,Cell , Loading , Confirm , XInput},
  data(){
    return {
      host:'/huaxinneng/',
      sendInfo:[
        {key:'规格',value:'YSP35.5'},
        {key:'计量单位',value:'公斤'},
        {key:'单价',value:'￥0'},
        {key:'瓶数',value:'2'},
        {key:'总净重',value:'0kg'},
        {key:'配送门店',value:'大学城店'},
        {key:'配送地址',value:'广州市天河区棠下商务大厦3303号3楼'},
        {key:'配送时间',value:'2017-04-19 17:00-17:00'},
        {key:'联系人',value:'张三'},
        {key:'联系电话',value:'15012345678'},
        {key:'备注',value:'暂无'}
      ],
      merchantInfo:[
        {key:'商户名称',value:''},
        {key:'商户编号',value:''},
        {key:'商户性质',value:''},
        {key:'销售类型',value:''}
      ],
      list:[],
      tatol:'100',
      showConfirm:false,//显示确认弹窗
      order_status:true, //订单打印状态，已打印true未打印false
      show:false,
      update_total:'',
      showUpdate:false,
      update_price:'',
      isClick:false, // 修改弹窗的确定按钮能否点击
      botttype: []
    }
  },
  methods:{
      showConfirm:function(){
        this.$router.push({path: '/placeOrder'})
      },
      //弹窗点击取消
      onCancel(){
        this.showConfirm = false;
      },
      getChange(){
        this.$router.push('/placeOrder')
        // this.$router.push({path: '/placeOrder/:id', params: {id: '456'}})
      },
      //弹窗点击确认，取消订单
      delOrder(){
        let self = this;
        let list = qs.stringify({
          appser:JSON.parse(localStorage.getItem('order_list')).appSer,
          status:JSON.parse(localStorage.getItem('order_list')).status,
        });
        // console.log(self.list)
        axios.post(this.host + 'custOrder/updateMyOrderStatus',list,{
          headers:{
              'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then( data => {
          // console.log( data.data)
          if(data.data.error == '0'){
            self.$vux.toast.show({
              text:'取消成功'
            })
            setTimeout(()=>{
              self.$router.push('myOrder')
            },1500)
          }else{
            self.$vux.toast.show({
              type:'warn',
              text:'取消失败，请联系管理员'
            })
          }
        })
      },
      //修改订单
      update(){
        this.showUpdate = true;
      },
      //获取总价的方法
      getTotalprice(){
        let self = this;
         //判断是不是小数
        if(self.update_price.split('.').length >= 2){
          self.$vux.toast.show({
            text:'不能输入小数',
            type:'text'  
          })
          return
        }
        let data_ = JSON.parse(localStorage.getItem('order_list'));
        let list = qs.stringify({
          unit:data_.orderunit,
          custNo:data_.custNo,
          custBottype:data_.bottType,
          vaseNum:data_.bottleNum,
          price:this.update_price
        });
        axios.post(this.host + '/custOrder/getPrice',list,{
          headers:{
              'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then( data => {
            self.update_total = data.data.errMsg;
        })
      },
      //上传修改的单价
      updatePrice(){
        // console.log(this.update_price)
        let self = this;
        //判断是否获取了总价
        if( /[.]/.test(self.update_price)){
          self.$vux.toast.show({
            text:'订单未修改，输入金额不合法',
            type:'text'
          })
          return
        }else if( !self.update_total || self.update_total == '0.00'){
          self.$vux.toast.show({
            text:'订单未修改，总价不能为空',
            type:'text'
          })
          return
        }
        let list = qs.stringify({
          appser:JSON.parse(localStorage.getItem('order_list')).appSer,
          unitPrice:this.update_price,
          totalprice:this.update_total
        });
        axios.post(this.host + 'custOrder/amendPayByAppser',list,{
          headers:{
            'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then( data => {
          // console.log( data.data)
          if(data.data.error == '0'){
            self.$vux.toast.show({
              text:'修改成功'
            });
            setTimeout(()=>{
              self.$router.push('myOrder')
            },1500);
          }
        })
      }

  },
  watch:{
    update_price:function(){
      this.getTotalprice();
    }
  },
  mounted(){
  	document.body.scrollTop = 0
    // axios.post(''+this.host+'/custOrder/getStandard').then(data =>{
    //   if(data.data.error == '0'){
    //     this.botttype = data.data.errMsg;
    //     // console.log(this.botttype)
    //   } else if(data.data.error == '-1'){
    //     this.$vux.toast.show({
    //       text:'获取规格数据失败，请稍后重试',
    //       type:'text'
    //     })
    //   }
    // })

    let self = this;
    this.list = JSON.parse(localStorage.getItem('recond_order'));
    console.log('change')
    console.log(this.list)
    // self.sendInfo[0].value = list.bottType;
    //获取规格
    axios.post(''+this.host+'/custOrder/getStandard').then(data =>{
      if(data.data.error == '0'){
        this.botttype = data.data.errMsg;
        this.botttype.map(item => {
          // this.list.botttype
          if (item.spectype === this.list.bottType.replace(/\s+/g,"")) {
            self.sendInfo[0].value = item.ctype
          }
        })
        console.log(this.botttype)
      } else if(data.data.error == '-1'){
        this.$vux.toast.show({
          text:'获取规格数据失败，请稍后重试',
          type:'text'
        })
      }
    })
    self.sendInfo[1].value = this.list.unit=='1'?'公斤':'瓶';
    self.sendInfo[2].value = this.list.unitPrice;
    self.sendInfo[3].value = this.list.bottleNum;
    self.sendInfo[4].value = this.list.sumWeight + 'kg';
    // if (list.sumWeight === 0) {
    //   self.sendInfo.splice(4, 1)
    // }
    self.sendInfo[5].value = this.list.deptNoName;
    self.sendInfo[6].value = this.list.address;
    self.sendInfo[7].value = this.list.appDate.substr(0,10) + '  ' + this.list.time;
    self.sendInfo[8].value = this.list.name;
    self.sendInfo[9].value = this.list.telePhone;
    self.sendInfo[10].value = this.list.memo;

    if (this.list.sumWeight === 0 || this.list.sumWeight === '' || this.list.sumWeight === null) {
      self.sendInfo.splice(4, 1)
    }

    self.merchantInfo[0].value = this.list.company;
    self.merchantInfo[1].value = this.list.cardNo
    // self.merchantInfo[1].value = this.list.custType=='01'?'工商业客户':'工业客户';
    if (typeof(this.list.custType) === 'number') {
      switch (this.list.custType) {
        case 0:
          self.merchantInfo[2].value = '民用';
          break;
        case 1:
          self.merchantInfo[2].value = '商用';
          break;
        case 2:
          self.merchantInfo[2].value = '工业';
          break;
        case 3:
          self.merchantInfo[2].value = '批发';
          break;
      } 
    } else {
      switch (this.list.custType) {
        case '0':
          self.merchantInfo[2].value = '民用';
          break;
        case '1':
          self.merchantInfo[2].value = '商用';
          break;
        case '2':
          self.merchantInfo[2].value = '工业';
          break;
        case '3':
          self.merchantInfo[2].value = '批发';
          break;
      } 
    }

    switch (this.list.selltype.substr(0,2)) {
        case '01':
          self.merchantInfo[3].value = '结算客户'
          break;
        case '02':
          self.merchantInfo[3].value = '月票客户'
          break;
        case '03':
         self.merchantInfo[3].value = '现金客户'
          break;
        case '04':
          self.merchantInfo[3].value = '其他'
          break;
      }
    //总价
    // self.tatol =  localStorage.getItem('total');
    self.tatol = this.list.totalprice;
    // 订单状态
    self.order_status = this.list.status;
    // console.log(list.status)
    
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import './../libs/stylus/same.styl'
.main
  background:#f2f3f8
  overflow-x:hidden
.step
  width:100%
  height:half(357)
  display:flex
  flex-direction:column
  p:first-child
    flex: 0 0 half(63)
    color:#999
    line-height:half(63)
    margin-left:15px
    font-size:14px
    font-family: -apple-system-font, "Helvetica Neue", sans-serif;
  .step-box
    flex:0 0 half(207)
    background:#fff
    border-bottom:1px solid $borderColor
    display:flex
    li
      flex:1
      display:flex
      flex-direction:column
      span:first-child
        flex:1
        position:relative
        &:before
          content: "\e614"
          font-family:"iconfont" !important;
          font-size:85px;
          font-style:normal;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          position:absolute
          top:-38%
          color:$borderColor
      span:last-child
        flex:0 0 half(68)
        text-align:center
    li:nth-child(2)
      span:first-child:before
        content:"\e60d"
      span:first-child:after
        content:''
        height:1px
        width:half(96)
        border-top:1px solid $borderColor
        position:absolute
        top: 65%;
        left: -16%;
    li:nth-child(3)
      span:first-child:before
        content:"\e610"
      span:first-child:after
        content:''
        height:1px
        width:half(96)
        border-top:1px solid $borderColor
        position:absolute
        top: 65%;
        left: -16%;
  p:last-child
    flex:0 0 half(86)
    line-height:half(86)
    text-align:center
    background:#fff
    color:$color
.active-icon:before
  color:$color !important
.tatol
  text-align:center
  margin-top:half(110)
  color:#999
  p:first-child
    span:first-child
      font-size:half(48)
      color:#333
.btn-box
  width:100%
  display:flex

  .btn
    flex:1
    height:half(88)
    margin:half(37) auto half(100)
    display:block
    border:none
    background:$color
    border-radius:half(88)
    font-size:half(34)
    color:#fff
    line-height:half(88)
    outline:none
  .btn:nth-child(1)
    margin-left:20px
    margin-right:20px
  .btn:nth-child(2)
    background:#fff
    color:$color
    border:1px solid $color
    margin-right:20px
   
.btn[disabled="disabled"]
  background:#d4d4d4
.btn[delete="delete"][disabled="disabled"]
  border-color:#d4d4d4 !important
  color:#d4d4d4 !important
.inputBox
    height:30px
    border-radius:5px
    outline:none
    border:none

</style>

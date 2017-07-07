<template lang="html">
  <div class="main">
    <div class="step">
      <p>订单状态</p>
      <ul class="step-box">
        <li>
          <span class="xiadan-icon" :class="order_status?'':'active-icon'"></span>
          <span>下单</span>
        </li>
        <li>
          <span class="dayin-icon" :class="order_status?'active-icon':''"></span>
          <span>打印</span>
        </li>
        <li>
          <span class="wancheng-icon"></span>
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
      <p>{{list.orderunit!='1'?'(瓶数*单价)':'(总净重*单价)'}}</p>
    </div>
    <div class="btn-box">
      <button class="btn"  :disabled="order_status" @click="submit">{{order_status?'已打印，不可修改':'确定'}}</button>
    </div>
        <loading v-model="show"></loading>

  </div>
</template>

<script>
import { Checker , CheckerItem ,Selector, Group ,CellBox ,Step, StepItem , Cell , Loading} from 'vux'
import axios from 'axios'
import qs from 'qs'
export default {
  components:{ Checker , CheckerItem ,Selector ,Group , CellBox,Step, StepItem ,Cell , Loading},
  data(){
    return {
      host:'/huaxinneng/',
      sendInfo:[
        {key:'规格',value:'YSP35.5'},
        {key:'计量单位',value:'公斤'},
        {key:'单价',value:'￥0'},
        {key:'瓶数',value:'2'},
        {key:'总净重',value:'4kg'},
        {key:'配送门店',value:'大学城店'},
        {key:'配送地址',value:'广州市天河区棠下商务大厦3303号3楼'},
        {key:'配送时间',value:'2017-04-19 17:00-17:00'},
        {key:'联系人',value:'张三'},
        {key:'联系电话',value:'15012345678'},
        {key:'备注',value:'暂无'}
      ],
      merchantInfo:[
        {key:'商户名称',value:'广州企成信息科技有限公司'},
        {key:'商户性质',value:''},
        {key:'销售类型',value:''}
      ],
      list:[],
      tatol:'100',
      order_status:false, //订单打印状态，已打印true未打印false
      show:false
    }
  },
  methods:{
      submit(){
        let self = this;
      this.show = true;
      console.log(JSON.parse(localStorage.getItem('order_list')).appDate.replace(/-/g,'/'))
      let list = JSON.parse(localStorage.getItem('order_list'));
      // list.address = ''
      // list.name = ''
      list.appDate = list.appDate.replace(/-/g,'/');
      // list.deptNoName = list.deptnoname;
      // delete list.deptnoname;
      list = qs.stringify(list);
      // console.log('sure')
      // console.log(JSON.parse(localStorage.getItem('order_list')))
      let lists = JSON.parse(localStorage.getItem('order_list'))
      let url = ''
      if (lists.appSer) {
        url = '/custOrder/amendPayByAppser'
      } else {
        url = '/custOrder/saveCustOrder'
      }
      axios.post( this.host + url,list,{
        headers:{
            'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then( data => {
        this.show = false;
        console.log(data.data)
        if(data.data.error == '0'){
          self.$vux.toast.show({
              text:'下单成功'
          })
          setTimeout(function() {
            self.$router.push('successOrder')
          }, 1500);
        }else{
          self.$vux.toast.show({
            text:'下单失败，请稍后重试',
            type:'text'
          })
        }
      })
    }
  },
  mounted(){
    let self = this;
    let list = JSON.parse(localStorage.getItem('order_list'));
    // console.log('localStorage')
    // console.log(list)
    self.sendInfo[0].value = list.bottType;
    self.sendInfo[1].value = list.orderunit=='1'?'公斤':'瓶';
    self.sendInfo[2].value = list.unitPrice;
    self.sendInfo[3].value = list.bottleNum;
    self.sendInfo[4].value = list.bottleNum2 + 'kg';
    self.sendInfo[5].value = list.deptNoName;
    self.sendInfo[6].value = list.address;
    self.sendInfo[7].value = list.appDate.substr(0,10) + '  ' + list.time;
    self.sendInfo[8].value = list.name;
    self.sendInfo[9].value = list.telePhone;
    self.sendInfo[10].value = list.memo;

    self.merchantInfo[0].value = list.company;
    self.merchantInfo[1].value = list.custType=='01'?'工商业客户':'工业客户';
    // self.merchantInfo[2].value = list.selltype;
    // console.log('数字？' + !isNaN(list.selltype))

    // let selltype = !isNaN(list.selltype) ? list.selltype.toString() : list.selltype
    // console.log(list.selltype.toString())
    // let selltype = list.selltype
    // if (selltype.indexOf(" ") >= 0) {
    //   list.selltype = selltype.replace(/\s+/g,"")
    // } else {
    //   list.selltype
    // }
    switch (list.selltype) {
        case '01':
          self.merchantInfo[2].value = '结算客户'
          break;
        case '02':
          self.merchantInfo[2].value = '月票客户'
          break;
        case '03':
         self.merchantInfo[2].value = '现金客户'
          break;
        case '04':
          self.merchantInfo[2].value = '其他'
          break;
      }
    //总价
    // self.tatol =  localStorage.getItem('total');
    self.tatol = list.totalprice;
    // 订单状态
    // self.order_status = list.status;
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
  .btn
    width:100%
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
.btn[disabled="disabled"]
  background:#d4d4d4


</style>

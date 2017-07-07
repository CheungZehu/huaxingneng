<template>
    <div class="main">
        <div class="header">
            <img src="./assets/logo.png" alt="">
        </div>
        <group>
            <cell title="待付金额" class="title"><span slot="default" class="moneyIcon">{{money}}</span></cell>
            <cell-form-preview :list="list"></cell-form-preview>
        </group>
        <group>
            <x-button type="primary" @click.native="submit">确认支付</x-button>
        </group>
        <loading v-model="loading"></loading>
    </div>
</template>
<script>
import { CellFormPreview, Group, Cell, XButton ,Loading } from 'vux'
import axios from 'axios'
import qs from 'qs'
export default {
  components:{ CellFormPreview, Group, Cell,XButton  ,Loading},
  data () {
    return {
        host:'/huaxinneng/',
        money:'',
         list: [{
            label: '订单编号',
            value: ''
        }, {
            label: '商户名称',
            value: ''
        }, {
            label: '联系人',
            value: ''
        }, {
            label: '单价',
            value: ''
        }, {
            label: '瓶数',
            value: ''
        }],
        loading:true,
        data:''
    };
  },
  mounted(){
        let self = this;
        self.loading = true;
        let orderId = location.hash.split('?')[1].split('=')[1];
        console.log(orderId)// axios
        axios.post( this.host + '/custOrder/getMyorderByAppser',qs.stringify({
           appser: orderId
        }),{//发起请求
        headers:{
            'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then( data => {
          console.log(data.data)
          self.loading = false
          if(data.data.error == '0'){
              data = JSON.parse(data.data.errMsg);
              self.data = data;
              console.log(self.data,'self.data')
              self.money = data.totalprice;//待付金额
              self.list[0].value = data.appSer;//订单编号
              self.list[1].value = data.company;//商户名称
              self.list[2].value = data.name//联系人
              self.list[3].value = data.unitPrice//单价
              self.list[4].value = data.bottleNum//瓶数
          }else{
              self.$vux.toast.show({
                  text:'获取信息失败，请稍后重试',
                  type:'warn'
              })
          }
          
      })
  },
  methods:{
      submit(){
         let self = this; 
         let list = qs.stringify({
             activityId:self.data.appSer,
             operater:self.data.operater,
             num:(Number(self.data.totalprice)*100).toString()
         });
         axios.post(this.host + '/custOrder/pay',list,{
             headers:{
                 'Content-Type': 'application/x-www-form-urlencoded'
             }
         }).then(data => {
             console.log(data.data)
             if(data.data.error == '0'){
                 window.location.href = data.data.errMsg;
             }
         })
         
      }
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
.header
    img
        height: 82.5px;
        margin: 0 auto;
        margin-top: 34px;
        display: block;
        margin-bottom: 34px;
.moneyIcon:before
    content:'￥'
.moneyIcon
    color:#eb942d
    font-size:32px


</style>
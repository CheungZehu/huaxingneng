<template lang="html">
  <div class="main">
    <div class="header">
      <span>执行日期</span>
      <!--<div class="datetime" @click="isUpdateWebPrice?'':(tvisibility=true)">-->
      <div class="datetime">
          <!--<datetime :readonly="'true'" title=" " :start-date="startDate" :end-date="endDate" v-model="dateValue"></datetime>-->
          {{datetime}}
           <!--<x-button type="primary" plain @click.native="visibility=true">{{doTime}}</x-button>-->
      </div>

    </div>
    <div class="title">
      <span>网站名称</span>
      <span>网站报价</span>
    </div>
    <div class="dataBox">
      <ul>
        <li v-for="n in list">
          <span>{{n.web_name}}</span>
          <div>
            <input type="text" v-model="n.web_price">
          </div>
        </li>
      </ul>
    </div>
    <div class="bottomBox">
      <button type="button" name="button" @click="router('sureChengePrice')">保存</button>
    </div>
  </div>
</template>

<script>
import  { ToastPlugin ,dateFormat } from 'vux'
import { mapState } from 'vuex'
import { Datetime ,XButton ,Group} from 'vux'
import qs from 'qs'
import axios from 'axios'
export default {
  components:{Datetime , ToastPlugin,XButton ,Group},
  methods:{
    router(r){
      localStorage.setItem('update_webprice',JSON.stringify(this.list))
      this.$router.push('sureChengePrice');
    //   console.log(JSON.parse(localStorage.getItem('web_price')))
    
    },
    change(val){
      console.log(val)
      let self  = this;
      let today = dateFormat(new Date(),'YYYY-MM-DD');
      for(let i = 0; i < self.list.length ; i ++){
        // console.log(self.list[i].executedate)
        self.list[i].executedate = self.datetime;
        self.list[i].pricedate = today;

      }
    }
  },
  data () {
    return {
      host:'/huaxinneng/',
      doTime:'',

      
      list:[{executedate:''}]
            ,
      dateList:[],
      visibility:false,
      datetime:'',
      isUpdateWebPrice:''
      }

  },
  mounted(){
    //  从本地存储获取网价记录
    let self = this;
    self.list = JSON.parse(localStorage.getItem('update_webprice'));
    self.datetime = self.list[0].executedate.substr(0,10);
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import './../libs/stylus/same.styl'
.main
  position:absolute
  top:0
  left:0
  right:0
  bottom:0
  .header
    position:absolute
    top:0
    right:0
    left:0
    height:half(90)
    line-height:45px
    display:flex
    padding:0 15px
    background:#fff
    align-items:center
    >span:first-child
      flex:0 0 half(170)
    .datetime
      flex:1
      height:30px
      border-radius:6px
      border:1px solid #ccc
      line-height:30px
      padding-left:15px
      >a
        height:100% !important
        padding:0 !important
        text-align:left !important
      &:after
        content:'\e61e'
        font-family:"iconfont" !important;
        font-size:39px;
        font-style:normal;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color:$color
        position:absolute
        right:8px
        

  .title
    position:absolute
    top:half(90+15)
    // padding:0 15px
    // width:100px
    right:0
    left:0
    height:40px
    line-height:40px
    display:flex
    align-items:center
    position:relative
    span
      flex:1
      background:#fefbf0
      color:$color
      line-height:40px
      font-size:13.5px
      text-align:center
    span:first-child:after//中间那条线
      content:''
      width:0
      height:25px
      border-left:1px solid #ddd
      position:absolute
      top: 7px;
      left: 50%;
  .dataBox
    position:absolute
    top:half(90+15+80+2)
    right:0
    left:0
    bottom:half(122)
    background:#f2f3f8
    ul
      background:#fff
      padding:0 15px
      margin-bottom:61px
      display:flex
      flex-direction:column
      li
        display:flex
        align-items:center
        border-bottom:1px solid #ccc
        >span:first-child
          position:relative
          font-size:15px
          flex:50%
          margin:10px
          
        >div
          flex:50%
          height:half(55)
          border-radius:8px
          position:relative
          width:100%
          border:1px solid #ccc
          padding-left:20px
          input
            outline:none
            border:none
          &:after
            content:'￥'
            position:absolute
            left:7px
          
      // li:last-child
      //   border:none
  .bottomBox
    position:fixed
    bottom:0
    left:0
    right:0
    height:half(122)
    background:#fff
    text-align:center
    line-height:61px
    >button
      width:90%
      height:40px
      border:none
      outline:none
      background:$color
      color:#fff
      font-size:18px
      border-radius:20px
.weui-cell_access .weui-cell__ft:after
  display:none !important
.weui-cell_access .weui-cell__ft
  text-align:left !important
  padding-left:10px !important

</style>
<style lang="stylus" rel="stylesheet/stylus">
.weui-cell_access .weui-cell__ft:after
  display:none !important
.weui-cell_access .weui-cell__ft
  text-align:left !important
  padding-left:10px !important

</style>
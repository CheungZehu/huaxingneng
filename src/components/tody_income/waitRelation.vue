<template lang="html">
  <div class="main">
    <div class="header">
      <span @click="back"></span>
      <span>待关联</span>
      <!--<select class="search_day" name="" v-model="search_day">
        <option value="3">近三天</option>
        <option value="7">近七天</option>
        <option value="30">近一个月</option>
      </select>
      <span></span>-->
    </div>
    <!--<p class="title">今日收入<span>￥{{total}}</span></p>-->
    <ul class="list">
      <li v-for='(n,k) in list'>
        <div class="time">
          <span>{{transformationDate(n.updateTime)[0]}}</span>
          <span>{{transformationDate(n.updateTime)[1]}}</span>
        </div>
        <div class="touxiang">
          <img :src="n.headImg" alt="">
        </div>
        <div class="infoBox">
          <span>￥{{n.num / 100}} <span v-if="n.verifyStatus==2||n.verifyStatus==4" :class="{'restart':(n.verifyStatus==4?true:false),'audit':(n.verifyStatus==2?true:false)}">{{n.verifyStatus==2?'待审核':'未通过'}}</span></span>
          <span>{{n.nickname}}——{{n.verifyStatus?n.custName:'商户昵称'}}</span>
        </div>
        <div class="btn" v-if="n.verifyStatus==3?(transformationDate(n.updateTime)[0]=='今天'?true:false):true">
          <button type="button" name="button" :class="{'active-btn':(n.verifyStatus==2?true:(n.verifyStatus==3?(transformationDate(n.updateTime)[0]=='今天'?true:false):false)), 'restartBtn':(n.verifyStatus==4?true:false)}" @click="toggleShow(k,n)">{{(n.verifyStatus==4?'重来':(n.verifyStatus==3?(transformationDate(n.updateTime)[0]=='今天'?'修改':''):(n.verifyStatus==2?'修改':(n.verifyStatus==1?'关联':''))))}}</button>
        </div>
      </li>
    </ul>
    <div class="msk" v-show="isShow">

        <search class="search" v-on:search="search" :order="chengeData" v-on:shutdown="shutdown">
        </search>

      <div class="msk1" @click="toggleShow"></div>
    </div>
    <loading v-model="showLoading"></loading>
  </div>
</template>
<style lang="stylus" rel="stylesheet/stylus" scoped>
@import './../libs/stylus/same.styl'
.main
  position:absolute
  top:0
  left:0
  right:0
  bottom:0  
  .header
    width:100%
    height:50px
    background:#fff
    line-height:50px
    position:relative
    border-bottom:1px solid #e4e4e9
    span:first-child
      padding:10px 0
    span:first-child:after
      content:'\e619'
      font-family:"iconfont" !important;
      font-size:26px;
      font-style:normal;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      color:$color
      position:relative
      top:3px
      line-height:30px
    span:nth-child(2)
      border-left:1px solid #ccc
      padding-left:8px
.title
  display:inline-block
  width:100%
  height:38px
  line-height:38px
  text-align:center
  font-size:17.5px
  color:#999
  span
    color:$color
.list
  display:flex
  flex-direction:column
  padding:0 10px
  background:#fff
  li
    flex:1
    display:flex
    border-bottom:1px solid $borderColor
    // align-items:center
    .time
      flex:0 0 42px
      display:flex
      flex-direction:column
      align-self:center
      font-size:13px
      text-align-self:justify
    .touxiang
      flex:0 0 60px
      img
        width:41px
        height:41px
        padding:12px
    .infoBox
      flex:1
      display:flex
      flex-direction:column
      span:first-child
        flex:0 0 15px
        margin-top:10px
      span:last-child
        flex:1
        align-self:start
        margin-bottom:15px
        font-size:13px
  li:last-child
    border-bottom:none
.btn
  flex:0 0 half(100)
  align-self:center
  margin-left:20px
  button
    width:100%
    height:25px
    border-radius:25px
    background:$color
    border:none
    outline:none
    color:#fff
.active-btn
  background-color:#c5da84 !important
.msk
  position:fixed
  top:0
  bottom:0
  left:0
  right:0
  z-index:9999
  .msk1
    background:#000
    width:100%
    height:100%
    opacity:0.68
    position:absolute


//重来
.restart
  display:inline-block
  background:#c80000
  color:#fff
  height:12px
  line-height:14px
  font-size:10px
  padding:2px 3px
  border-radius:3px
.audit
  display:inline-block
  background:$color
  color:#fff
  height:12px
  line-height:14px
  font-size:10px
  padding:2px 3px
  border-radius:3px
.restartBtn
  background:#c80000 !important
//左上角的选项
.search_day
  position:absolute
  right:0
  top:0
  height:50px
  border:none
  outline:none
  appearance:none
  z-index:3
  padding-right:25px
  background:transparent
  font-size:17px
.header
  z-index:1
</style>

<script>
import  { ToastPlugin ,Loading } from 'vux'
import search from './search.vue'
import axios from 'axios'
import qs from 'qs'
import { mapMutations } from 'vuex'
export default {
  components:{ search , ToastPlugin ,Loading},
  data(){
    return{
      host:'/huaxinneng/',
      total:'5000',
      count:5,
      search_day:'1',
      list:[
        
      ],
      isShow:false,
      results: [],
      value: '',
      chengeData:'',
      chengeDataIndex:'',
      search_:'',
      showLoading:false
    }
  },
  methods:{
    toggleShow(k,n){//点击 关联 执行的
      if(!this.isShow){
        console.log(n);
        this.chengeDataIndex = k;// 要修改的是第几条数据
        this.chengeData = n;// 要修改的数据
      }
      this.isShow = !this.isShow;
    },
    back(){
      this.$router.go(-1)
    },
    show_res(val){
      this.results = val;
      console.log(val,'组件传值');
      // console.log(this.results);
    },
    //请求信息
    getDetail(){
      let self = this;
      this.showLoading = true;
      setTimeout(function() { // 超时处理
        if(self.showLoading == true){
          self.showLoading = false;
          self.$vux.toast({
            text:'获取超时，请稍后重试',
            type:'warn'
          })
        }
      }, 12000);
      axios.get(''+this.host+'/userInfo/getTodayRelationList',{
        params:{
          operater:'80566'
        }
      }).then( data => {
        this.showLoading = false
         if(data.data.errcode == '0'){
           self.list = data.data.list;
         }else{
           self.$vux.toast.show({
             text:'获取信息失败，请稍后重试',
             type:'warn'
           })
         }
      })
    },
    //转化时间格式
    transformationDate(date){
      let d = new Date(date);
      let str_date = '';
      let str_time = '';
      if(d.getMonth() == new Date().getMonth() && d.getDate() == new Date().getDate()){
        str_date = '今天';
        str_time = d.toLocaleTimeString().substring(0,d.toLocaleTimeString().length-3);
      }else if( d.getMonth() == new Date().getMonth() && d.getDate() == (new Date().getDate()-1) ){
        str_date = '昨天' ;
        str_time =  d.toLocaleTimeString().substring(0,d.toLocaleTimeString().length-3);   
      }else{
        str_date = (d.getMonth()+1) + '-' + d.getDate() ;
        str_time = d.toLocaleTimeString().substring(0,d.toLocaleTimeString().length-3);
      }
      return [str_date,str_time];
    },
    //从search组件传过来的值
    search(val){
      console.log(val)
      this.isShow = false;
      let self = this;
      self.list[self.chengeDataIndex].custName = val.custname;
      if( self.list[self.chengeDataIndex].verifyStatus == 1 || self.list[self.chengeDataIndex].verifyStatus == 4 ){
        self.list[self.chengeDataIndex].verifyStatus = 2;
      }
      
    
      
    },
    shutdown(){
      this.isShow = false;
    }
  },
  mounted(){
    let self = this;
    self.showLoading = true;
    this.getDetail();
  }
}

</script>

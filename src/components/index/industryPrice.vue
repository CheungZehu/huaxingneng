<template lang="html">
  <div class="main">
    <div class="header">
      <span @click="back"></span>
      <span>行业网价</span>
    </div>
    <p class="title" v-if="!none">执行日期：<span>{{doTime}}</span></p>
<!--     <ul class="list">
      <li v-for="n in list">
        <div class="icon_box">
          <span></span>
        </div>
        <div>
          <p>￥{{n.web_price}}</p>
          <p>{{n.web_name}}</p>
        </div>
      </li>
      <span style="display:block;text-align:center;padding:10px 0;color:#ccc" v-if="none">暂无数据</span>
    </ul> -->
    <group v-if="list" class="list">
      <x-switch class="icon_box" v-for="n in list" :key="n" :title="n.web_price" :inline-desc="n.web_name" v-model="n.status" disabled>
      </x-switch>
    </group>
  <loading v-model="loading"></loading>
  </div>

</template>
<style lang="stylus" rel="stylesheet/stylus" scoped>
@import './../libs/stylus/same.styl'
.main
  position:absolute
  top:0
  left:0
  bottom:0
  right:0
  .header
    width:100%
    height:50px
    background:#fff
    line-height:50px
    position:fixed
    z-index:9
    top:0
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
    span:last-child
      border-left:1px solid #ccc
      padding-left:8px
.title
  position:fixed
  top:50px
  z-index:98
  background:#f2f3f8
  display:inline-block
  width:100%
  height:38px
  line-height:38px
  text-align:center
  font-size:17.5px
  color:#999
.list
  position:relative
  top:88px
  background:#fff
  display:flex
  flex-direction:column

.vux-x-switch.weui-cell_switch
  padding-left:50px
.icon_box:after
    content:"\e616"
    font-family:"iconfont" !important;
    font-size:23px;
    font-style:normal;
    color:$color
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    line-height:70px
    position:absolute
    left:10px
  li
    flex:1
    display:flex
    border-bottom:1px solid $borderColor
    &:last-child
      border:none
    .icon_box
      flex:0 0 42px
      line-height:42px
      span:first-child:after
         content:"\e616"
         font-family:"iconfont" !important;
         font-size:23px;
         font-style:normal;
         color:$color
         -webkit-font-smoothing: antialiased;
         -moz-osx-font-smoothing: grayscale;
         line-height:70px

    div:last-child
      flex:1
      display:flex
      flex-direction:column
      line-height:20px
      p:first-child
        margin-top:15px
        font-size:15px
        color:#333
      p:last-child
        flex:1
        width:100%
        font-size:13.5px
        color:#666
        margin-bottom:15px


</style>

<script>
import { Search , Loading, Group, XSwitch } from 'vux'
import axios from 'axios'
export default {
  components:{ Search , Loading, Group, XSwitch},
  data(){
    return{
      host:'/huaxinneng/',
      doTime:'',
      list:[],
      loading: false,
      none:false
    }
    
  },
  methods:{
    back(){
      this.$router.go(-1)
    },
    // 
  },
  mounted(){
    this.loading = true;
    let self = this;
    setTimeout(function() {
      if(self.loading == true){
        self.loading = false;
         self.$vux.toast.show({
         text: '获取超时，请检查您的网络设置',
         type:'warn'
       })
      }
    }, 10000);
    axios.post(this.host + '/userInfo/admin/getPrice').then( data=>{
      if(data.data.errcode == '0'){
        // console.log(data.data)
        
        //  this.doTome = JSON.parse(data.data.data[0].executedate);
        let errMsg = JSON.parse(data.data.errMsg);
        this.doTime = errMsg[0].executedate.substr(0,10);
         this.list = errMsg;
         console.log(this.list)
         this.list.map(item => {
          item.status = item.auditflag == '1' ? true : false
         })
         self.loading = false;
      }else if(data.data.errcode == '-4'){
        self.none = true;
        self.loading = false;
      }else{
        self.loading = false;
         self.$vux.toast.show({
         text: '获取数据失败，请联系客服',
         type:'warn'
       })
      }
    })
  }
}
</script>

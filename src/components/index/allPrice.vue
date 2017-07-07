<template lang="html">
  <div class="main">
    <p class="title">执行日期：<span>{{doTime}}</span></p>
    <div class="middleBox">
      <ul class="list">
        <li v-for="n in list">
          <div class="icon_box">
            <span></span>
          </div>
          <div>
            <p>￥{{n.web_price}}</p>
            <p>{{n.web_name}}</p>
          </div>
        </li>
      </ul>
    </div>
    <!--<div class="bottomBox">
      <button @click="router('chengePrice')">录入</button>
      <button @click="router('chengePrice')">修改</button>
    </div>-->
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
.title
  position:fixed
  top:0
  z-index:98
  background:#fefbf0
  display:inline-block
  width:100%
  height:38px
  line-height:38px
  text-align:center
  font-size:17.5px
  color:$color
  border-bottom:1px solid #ddd
.middleBox
  position:absolute
  top:39px
  right:0
  left:0
  bottom:half(118)
  overflow:auto
  background:#f2f3f8
.list
  position:absolute
  top:0
  left:0
  right:0
  background:#fff
  display:flex
  flex-direction:column
  padding:0 15px
  li
    flex:0 0 half(140)
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
        font-size:13.5px
        color:#666
// 底部按钮
.bottomBox
  position:absolute
  left:0
  right:0
  bottom:0
  height:half(118)
  background:#fff
  display:flex
  align-items:center
  button
    height:half(76)
    background:$color
    color:#fff
    border-radius:half(76)
    border:none
    outline:none
  button:first-child
    flex:1
    margin:0 10px
  button:last-child
    flex:0 0 40%
    margin-right:10px
    border:1px solid $color
    color:$color
    background:#fff
</style>

<script>
import { Search} from 'vux'
import { mapState } from 'vuex'
import axios from 'axios'
export default {
  components:{ Search},
  data(){
    return{
      host:'/huaxinneng/',
      doTime:new Date().getFullYear().toString() + '-'+(new Date().getMonth() +1)+ '-'+new Date().getDay(),
      list:[{name:'广东油气商会——广石化挂牌价',price:'900.00'},
            {name:'广东油气商会——广石化挂牌价',price:'900.00'},
            {name:'广东油气商会——广石化挂牌价',price:'900.00'}]
    }
  },
  methods:{
    back(){
      this.$router.go(-1)
    },
    router(r){
      this.$router.push(r)
      // console.log(this.list_);
    }
  },
  mounted(){
    // console.log(this.$store);
    let self = this
    axios.post(''+this.host+'/userInfo/admin/getPrice').then( data =>{
      // console.log(data.data)
      if(data.data.errcode == '0'){
        let data_ = data.data.errMsg;
        data_ = JSON.parse(data_);
        self.list = data_;
        localStorage.setItem('web_price',JSON.stringify(data_))
        // console.log(localStorage.getItem('web_price'))
      }
    })
  }
}

</script>

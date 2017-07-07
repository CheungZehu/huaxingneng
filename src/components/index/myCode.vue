<template lang="html">
  <div class="main">
    <div class="header">
      <span @click="back"></span>
      <span>我的收款码</span>
    </div>
    <div class="box">
      <div class="title">
        <span>扫码支付</span>
      </div>
      <div class="code">
        <div>
        <img :src="src" alt="">
        <span class="tip" @click="getCode">收不到二维码？请手动点击获取</span>
        </div>
        
      </div>
      <div class="tipBox">
        <span ></span>
        <p>让顾客扫一扫收款码，向我付款</p>
      </div>
    </div>
  </div>
</template>
<style lang="stylus" rel="stylesheet/stylus" scoped>
@import './../libs/stylus/same.styl'
html,body
  height:100%
  div:first-child
    height:100%
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
  .box
    position:absolute
    top:66px
    left:15px
    right:15px
    bottom:15px
    background:#fff
    display:flex
    flex-direction:column
    .title
      width:100%
      height:half(163)
      line-height:half(163)
      text-align:center
      border-bottom:1px solid #ccc
      font-size:half(41)
    .code      
      flex:1
      width:100%
      display: table-cell;
      text-align:center
      vertical-align:middle;
      position:relative
      >div
        position: absolute;
        top: 50%;
        left: 50%;
        width: 190px;
        height: 190px;        
        img
          position:absolute
          display:inline-block
          width:190px
          height:190px
          top:-50%
          left:-50%

    .tipBox
      width:100%
      height:100px
      text-align:center
      position:relative
      span:first-child
        width:1px
        height:1px
      span:first-child:after
        font-family:"iconfont" !important;
        font-size:70px;
        font-style:normal;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        content: "\e613"
        color:#68c000
        position:relative
        top:-55px
      p
        display:block
        position:relative
        top:-95px

.tip
  font-size:10px
  width:190px
  position:absolute
  top:50%
  left:-50%
  color:$color
  text-dection:line
  text-decoration: underline $color;
</style>

<script>
import axios from 'axios'
export default {
  methods:{
    back(){
      this.$router.go(-1);
    },
    getCode(){
      let self = this;
      axios.post(this.host + 'user/myInfo/addQRcode').then( data => {
        if(data.data.errcode == '0'){
          let str = data.data.errMsg;
          self.scr =  str ;
          // console.log(str)
          // console.log(data.data)
          // let data_ = JSON.parse(data.data.errMsg);
          // self.src = data_.imgurl;
          console.log(self.src)
        }
        window.location.reload();
      })
    }
  },
  data(){
    return {
      src:'',
      host:'/huaxinneng/'
    }
  },
  mounted(){
    let self = this;
    axios.post( this.host + '/user/ifregister').then( data => {
      console.log(data.data)
      if(data.data.error == '0'){
          // let str = data.data.errMsg.replace(/@/g,'/')+'.png';
          // self.scr =  str ;
          // console.log(str)
          // console.log(data.data)
          let data_ = JSON.parse(data.data.errMsg);
          console.log(data_.imgurl)
          self.src = data_.imgurl;
          
        }
    })
  }
}

</script>

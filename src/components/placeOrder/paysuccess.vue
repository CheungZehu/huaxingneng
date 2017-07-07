<template lang="html">
  <div class="main">
    <div class="box">
      <div class="iconBox">
        <div class="icon-box">
          <span></span>
        </div>
      </div>
      <p class="tip">支付成功</p>
      <div class="ok">
        <button @click="router">好的</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    methods:{
        router(){
            window.location.href = 'http://hxn.wego168.com/exhuaxinneng/wechat/customize/huaxinneng/Huaxinneng!go.action?boxUrl=/customize/huaxinneng/Huaxinneng!index.action';
        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import './../libs/stylus/same.styl'
body,html
  height:100%
.main
  // background:#f2f3f8
  overflow-x:hidden
  height:100%
  padding:half(33) half(42)
  .box
    position:relative
    background:#fff
    display:flex
    flex-direction:column
    padding:0 half(61)
    min-height:half(900)
    border-radius:15px
    box-shadow:0 0 20px #ddd
    .iconBox
      position:absolute
      flex:0 0 half(300)
      position:relative
      text-align:center
      overflow:hidden
      .icon-box
        width:100%
        height:100%
 
    .icon-box
      margin-top: 50px;
      span:before
        content: "\e61a"
        font-family:"iconfont" !important;
        font-size:60px;
        font-style:normal;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color:#5dc71d
    .tip
      flex:0 0 half(220)
      font-size:half(30)
      // text-indent:30px
      display:block
      text-align:center
      font-size:20px
      
    .ok
      flex:0 0 half(150)
      button
        width:100%
        height:half(80)
        background:$color
        border:none
        border-radius:40px
        outline:none
        color:#fff
        font-size:half(35)
    .click
      flex:1
      text-align:center
      p
        margin-top:40px
        color:#5dc71d
        position:relative
        display:inline-block
        span:first-child:after
          content: "\e606"
          font-family:"iconfont" !important;
          font-size:35px;
          font-style:normal;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          position:absolute
          top: -50%;
          left: -36px;
          color:#5dc71d
        span:last-child
          text-decoration:underline


</style>

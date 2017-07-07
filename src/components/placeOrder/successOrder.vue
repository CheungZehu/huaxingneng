<template lang="html">
  <div class="main">
    <div class="box">
      <div class="icon-box">
        <span></span>
      </div>
      <p class="tip">您已成功下单，敬请关注订单后续动态，如需收款，请点击下方我的收款码</p>
      <div class="ok">
        <button @click="router('index')">好的</button>
      </div>
      <div class="click">
        <p @click="router('myCode')"><span></span><span>我的收款码</span></p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods:{
    router(a){
      this.$router.push(a)
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
    background:#fff
    display:flex
    flex-direction:column
    padding:0 half(61)
    min-height:half(900)
    border-radius:15px
    box-shadow:0 0 20px #ddd
    .icon-box
      flex:0 0 half(300)
      position:relative
      text-align:center
      overflow:hidden
      padding:120px 0 0 0
      span:before
        content: "\e61a"
        font-family:"iconfont" !important;
        font-size:90px;
        font-style:normal;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        position:relative
        color:#5dc71d
        top: -32px
    .tip
      flex:0 0 half(220)
      font-size:half(30)
      text-indent:30px
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
      margin-bottom:40px
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

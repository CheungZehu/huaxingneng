<template lang="html">
  <div class="login_box">
    <div class="login_main">
      <div class="login_logo">
        <img src="./../libs/img/logo.png" alt="">
      </div>
      <div class="login_input_box">
        <span class="login_input_icon icon iconfont icon-shouji"></span>
        <input type="Number" v-model="phoneNumber" name="phoneNumber" value="" placeholder="请输入手机号验证身份">
      </div>
      <div class="login_btn_box">
        <div class="login_btn">
          <button type="button"  @click="check" name="button" class="icon iconfont icon-youjiantou"></button>
        </div>
      </div>
    </div>
    <div class="login_bg">
    </div>
    <loading v-model="show" text="正在发送，请稍等"></loading>
  </div>
</template>

<script>
import './../libs/common.js'
import  { ToastPlugin ,Loading } from 'vux'
// axios.defaults.baseURL = '';
import axios from 'axios'
import qs from 'qs'
export default {
  components:{ Loading },
  data(){
    return {
      host:'/huaxinneng/',
      phoneNumber:Number,
      show:false
    }
  },
  mounted(){
    // console.log(document.getElementsByClassName('login_box')[0].offsetHeight)
    document.getElementsByClassName('login_box')[0].style.height = document.getElementsByClassName('login_box')[0].offsetHeight + 'px';
  },
  methods:{
    check(){
      let reg =  /^1[34578]\d{9}$/;
      let self = this
      if(reg.test(this.phoneNumber.toString())){
        self.show = true //显示loading
        setTimeout(()=>{
          if(self.show == true){
            self.show = false;
            self.$vux.toast.show({
             text: '网络超时',
             type:'warn'
           })
          }
        },10000)
        let data_ = {mobile:this.phoneNumber.toString()}
        axios.post(''+this.host+'/user/registerUser',qs.stringify(data_),{
          headers: {
                       'Content-Type': 'application/x-www-form-urlencoded'
                   }
        }).then(data =>{
          console.log(data.data);
          self.show = false // 关闭loading
          if(data.data.error == '0'){
            localStorage.setItem('id',data.data.errMsg.smsId)
            localStorage.setItem('phone',self.phoneNumber)
            localStorage.setItem('operater',data.data.errMsg.operater)

            self.$vux.toast.show({
             text: '验证码已成功发送，请注意查收'
           })
           setTimeout(function(){
             self.$router.push('/check')
           },1000)
         }else if(data.data.error == '4001'){
           self.$vux.toast.show({
            text: '抱歉，您不是业务员',
            type:'warn'
          })
        }else if (data.data.error == '4002') {
          self.$vux.toast.show({
           text: '抱歉，您的手机号码已经绑定过了',
           type:'warn'
         })
       }else if (data.data.error == '4003') {
         self.$vux.toast.show({
          text: '抱歉，验证码发送失败，请稍后重试',
          type:'warn'
        })
       }else if (data.data.error == '4004') {
         self.$vux.toast.show({
          text: '抱歉，获取不到您的openID，请您联系客服人员',
          type:'warn'
        })
       }else if(data.data.error == '-2'){
         self.$vux.toast.show({
          text: '抱歉，服务器异常，请您联系客服人员',
          type:'warn'
        })
       }
        })
      }else{
        this.$vux.toast.show({
         text: '请输入正确的手机号码',
         type:'warn'
        })
      }
    }
  }
}
</script>
<style lang="css">
  html,body{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
</style>

<style lang="stylus" rel="stylesheet/stylus" scoped>
half()
  return (arguments*0.50)px
html,body,.login_box
    width:100%
    height:100%
.login_bg
  position:absolute
  top:0
  bottom:0
  right:0
  left:0
  background:#000
  opacity:0.68
  z-index:1
.login_box
  background:url('./bg.jpg')
  background-size:100% 100%
  width:100%
  height:100%
  position:absolute
  .login_main
    width:100%
    height:100%
    position:absolute
    bottom:0
    z-index:2
    display:flex
    flex-direction:column
    .login_logo
      text-align:center
      flex:0 0 half(471)
      img
        margin:0 auto
        margin-top:half(104)
        width:half(187.5)
        height:half(281.1)
    .login_input_box
      width:half(598)
      height:half(96)
      margin:0 auto
      line-height:half(96)
      border-radius:half(96)
      background:#fff
      flex:0 0 half(96)
      display:flex
      span
        flex:0 0 half(55)
        font-size:half(75)
        line-height:half(100)
        color:#eb942d
      input
        border-radius:half(96)
        flex:auto
        border:none
        outline:none
        font-size:half(34)
        line-height:half(96)
        z-index:999
        padding-left:10px
    .login_btn_box
      flex:1
      text-align:center
      position:relative
      .login_btn
        width:half(148)
        height:half(148)
        border:none
        background:#eb942d
        border-radius:half(148)
        outline:none
        position:absolute
        top:50%
        left:50%
        transform:translateY(-50%) translateX(-50%)
        button
          width:101%
          height:101%
          margin:0
          position:absolute
          top:0
          left:0
          background:#eb942d
          border-radius:half(148)
          border:none
          outline:none
          font-size:45px
          color:#fff
          text-align:center
.icon-youjiantou:before
  vertical-align: text-top



</style>

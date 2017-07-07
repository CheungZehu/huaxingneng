<template lang="html">
  <div class="check_main">
    <span class="check_title">
      验证通过，请输入您收到的短信验证码
    </span>
    <div class="check_input_box">
      <span class="icon iconfont icon-yanzhengma"></span>
      <input type="number" name="checkNumber" v-model="check" placeholder="请输入验证码">
    </div>
    <div class="check_btn_box">
      <button class="check_btn" @click="ok">确定</button>
    </div>
    <loading v-model="show" :text="text" time="999"></loading>
  </div>
</template>

<script>
import axios from 'axios'
import qs from 'qs'
import  { ToastPlugin ,Loading} from 'vux'
export default {
  components:{ Loading },
  methods:{
    ok(){
      let self = this;
      
      setTimeout(()=>{
                  if(self.show == true){
                    self.show = false;
                    self.$vux.toast.show({
                      text: '网络超时',
                      type:'warn'
                    })
                  }
                },10000)
      if(this.check.length > 0){
        self.show = true;
        let data_ = {
          verifieCode:this.check,
          mobile:this.phone,
          Id:this.id
        }
        // console.log(this.id + this.phone);
        data_ = qs.stringify(data_)
        console.log(data_);
        // 发送验证码到货后端校验
        axios.post(''+this.host+'/user/ifcorrect',data_,{
          headers: {
                       'Content-Type': 'application/x-www-form-urlencoded'
                   }
        }).then( data => {
          console.log(data.data);
          if (data.data.errcode == '-2') {// -2为不正确或超时了
            self.$vux.toast.show({
             text: '抱歉，您的验证码不正确或已过时，请重新登录',
             type:'warn'
           })
         }else if (data.data.errcode == '0') {
           self.show = false;
           self.$vux.toast.show({
            text: '恭喜您，验证通过',
            type:'success'
          })
            setTimeout(function(){
                self.show = true;
                self.text = '正在绑定您的手机号...'
                let data__ = qs.stringify({
                  operater:self.operater
                })
                
                // 验证通过就继续调另一个接口进行绑定手机号
                axios.post(''+self.host + '/user/bindUser',data__,{
                  headers: {
                               'Content-Type': 'application/x-www-form-urlencoded'
                           }
                }).then( _data =>{
                  console.log(_data.data);
                  if(_data.data.errcode == '0'){
                    self.show = false;
                    self.$vux.toast.show({
                     text: '恭喜您，绑定成功,即将跳转到首页',
                     type:'success'
                   })
                  //  绑定成功跳转到主页
                   setTimeout(()=>{
                     self.$router.push('index');
                   },1000)
                  }else if(_data.data.errcode == '4008'|| _data.data.errcode == '3000'){
                     self.show = false;
                    self.$vux.toast.show({
                     text: '恭喜您，绑定成功,即将跳转到首页',
                     type:'success'
                   })
                   setTimeout(()=>{
                     self.$router.push('index');
                   },1000)
                  }
                })
            },1000)
         }
        })
      }else {
        self.$vux.toast.show({
         text: '请输入验证码',
         type:'warn'
       })
      }

    }
  },
  data(){
    return {
      host:'/huaxinneng/',
      check:'',
      phone:localStorage.getItem('phone'),
      id:localStorage.getItem('id'),
      operater:localStorage.getItem('operater'),
      show:false,
      text:'正在发送，请稍等'
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import './../libs/icon/iconfont.css'
half()
  return (arguments*0.50)px
body
  overflow: hidden
.check_main
  width:90%
  height:half(911)
  margin:0 auto
  margin-top:half(43)
  border-radius:8px
  box-shadow:0px 2px 10px #ececf1
  background:#fff
  text-align:center
  .check_title
    display:inline-block
    margin:0 auto
    margin-top:half(110)
    margin-bottom:half(85)
    color:#333
    font-size:half(33)
  .check_input_box
    width:half(518)
    height:half(88)
    display:flex
    margin:0 auto
    border:1px solid #eb942d
    border-radius:half(88)
    overflow:hidden
    span:first-child
      display:inline-block
      flex:0 0 half(85)
      font-size:half(75)
      line-height:half(95)
      margin-left:10px
      color:#eb942d
    input
      flex:1
      line-height:half(95)
      border:none
      outline:none
      font-size:half(34)
    input::placeholder
      color:#bfbfbf
  .check_btn_box
    margin:0 auto
    margin-top:half(230)
    .check_btn
      width:half(530)
      height:half(90)
      border:none
      outline:none
      background:#eb942d
      color:#fff
      border-radius:half(88)
      font-size:half(38)



</style>

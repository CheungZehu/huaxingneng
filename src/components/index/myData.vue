<template lang="html">
  <div class="main">
    <!-- 最上面的头像那一栏 -->
    <div class="header">
      <span @click="back"></span>
      <span>我的资料</span>
    </div>
    <!-- 中间的部分 -->
    <div class="middleBox">
      <div class="imgBox">
        <img :src="headimgurl" alt="">
      </div>
      <div class="nameBox">
        <span>{{name}}</span>
        <span>{{list[1].value}}</span>
      </div>
      <div class="btnBox">
        <button type="button" name="button" @click="show=true">解除绑定</button>
      </div>
    </div>
    <!-- 底部的按钮 -->
    <div class="bottomBox">
      <ul>
        <li v-for="n in list">
          <span class="iconBox"></span>
          <span>{{n.title}}</span>
          <span>{{n.value}}</span>
        </li>
      </ul>
    </div>
    <!-- 弹窗 -->
    <confirm v-model="show"
title=" "
@on-cancel="onCancel"
@on-confirm="onConfirm"
@on-show="onShow"
@on-hide="onHide">
  <p style="text-align:center;">{{ '解除绑定后，您下次登录时将需要重新输入手机号和验证码，确认解除绑定吗?' }}</p>
</confirm>
<!-- loading -->
  <loading v-model="isloding" :text="loadingText"></loading>
  </div>
</template>


<script>
import { Confirm ,Loading , ToastPlugin} from 'vux'
import axios from 'axios'
import qs from 'qs'
export default {
  components:{ Confirm ,Loading ,ToastPlugin},
  methods:{
    back(){
      this.$router.go(-1);
    },
    onCancel () { // 点击取消
      console.log('on cancel ')

    },
    onConfirm () { // 点击确定
      console.log('on confirm')
      let self = this;
      // 发送到接口进行解绑
      axios.post( this.host + '/userInfo/myInfo/unbind' ).then( data =>{
        console.log(data.data);
        if(data.data.errcode == 0){
          self.$vux.toast.show({
            text:'解除绑定成功!',
            type:'seuucess'
          })
          setTimeout(  ()=>{ // 解绑成功跳转到登录页面
            self.$router.push('/')
          },1000)
        }else{
          self.$vux.toast.show({
            text:'解除绑定失败，请稍后重试',
            type:'warn'
          })
        }
      })
    },
    onHide () {
      console.log('on hide')
    },
    onShow () {
      console.log('on show')
    }
  },
  data(){
    return {
      host:'/huaxinneng/',
      name:'',
      sex:'',
      deptcode:'',
      otype:'',
      headimgurl:'',
      list:[{
        title:'绑定手机',
        value:''
      },{
        title:'用户类型',
        value:''
      }
      // ,{
      //   title:'所属部门',
      //   value:'略略略'
      // }
      ],
      show:false,
      isloding:false,
      loadingText:'正在获取数据，请稍等...'
    }
  },
  mounted(){
    let self = this;
    self.isloding = true;
    setTimeout(function() {
      if(self.isloding == true){
        self.isloding = false;
        self.$vux.toast.show({
          text:'获取超时，请稍后重试',
          type:'warn'
        })
      }
    }, 12000);
    axios.post(''+this.host+'/userInfo/getMyInfoExternal').then(data => {
      console.log(data.data);
      // self.isloading = false;
        self.isloding = false;
      if(data.data.error == '0'){
        self.name = data.data.errMsg.name;
        // self.list[2].value = data.data.errMsg.deptcode;
        self.list[0].value = data.data.errMsg.mobile;
        if(data.data.errMsg.otype.substr(0,1) == '1'){
          self.list[1].value = '操作员'
        }else if (data.data.errMsg.otype.substr(0,1) == '0') {
          self.list[1].value = '管理员'
        }
        // self.list[0].value = localStorage.getItem('phone');
        self.headimgurl = data.data.errMsg.headimgurl;
      }else if (data.data.error == '4001') {
          self.$vux.toast.show({
           text: '抱歉，您还不是业务员或还没绑定，请登录绑定',
           type:'warn'
         })
       }else{
         self.$vux.toast.show({
          text: '抱歉，数据获取异常，请联系管理员',
          type:'warn'
        })
       }
    })
  }
}

</script>





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
.middleBox
  position:absolute
  top:65px
  left:0
  right:0
  height:80px
  background:#fff
  display:flex
  .imgBox
    flex:0 0 half(120)
    height:60px
    overflow:hidden
    margin-left:15px
    align-self: center;
    border-radius:half(120)
    img
      height:half(120)
      width:half(120)
      border:none
      background:#ccc
  .nameBox
    flex:1
    display:flex
    flex-direction:column
    margin-left:15px
    span:first-child
      margin-top:15px
  .btnBox
    flex:0 0 half(165)
    padding-right:15px
    button
      margin-top:15px
      width:100%
      height:half(56)
      border-radius:half(56)
      border:none
      background:#c5da84
      outline:none
      color:#fff

.bottomBox
  position:absolute
  left:0
  right:0
  top:65+80+15 px
  padding:0 15px
  background:#fff
  ul
    display:flex
    font-size:17px
    flex-direction:column
    li
      padding: 18px 0
      display:flex
      border-bottom:1px solid #ccc
      .iconBox
        flex:0 0 40px
        height:28px
        position:relative
        &:after
          content: "\e60e"
          font-family:"iconfont" !important;
          font-size:32px;
          font-style:normal;
          color:$color
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          position:absolute
          top:-12px
          left:-12px
      span:nth-child(2)
        flex:1
      span:nth-child(3)
        flex:1
        color:#999
        text-align:right
    li:nth-child(2)
      .iconBox:after
        content:'\e60a'
    li:nth-child(3)
      .iconBox:after
        content:'\e61b'
    li:last-child
      border:none




</style>

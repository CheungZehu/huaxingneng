
<template lang="html">
  <div class="inputBox" @touchmove="preventDefault">
    <div class="main">
      <input type="text" name="" v-model="value" placeholder="请输入公司名称">
      <span class="icon_" @click="search"></span>
    </div>
    <div class="list" v-if="list">
      <ul>
        <li v-for="n in list">
          <div>
            <span>{{n.custname}}</span>
            <span><span>联系人</span>:<span>{{n.linkman}}</span></span>
            <span><span>电话</span>:<span>{{n.mobiletel}}</span></span>
          </div>
          <button type="button" name="button" @click="submit(n)">确定</button>
        </li>
      </ul>
    </div>
    <loading v-model="showloading"></loading>
    <span class="shutdown" @click="shutdown"></span>
  </div>
  
</template>
<style lang="stylus" rel="stylesheet/stylus" scoped>
@import './../libs/stylus/same.styl'
@import './../libs/icon/iconfont.css'
.inputBox
  position:absolute
  top:50px
  left:15px
  right:15px
  height:72px
  z-index:9
  background:#fff
  .main
    width:90%
    height:half(80)
    margin:0 auto
    margin-top:half(34)
    border:1px solid $color
    border-radius:40px
    text-align:center
    display:flex
    overflow: hidden;
    input
      flex:1
      height:40px
      width:250px
      padding-left:25px
      border:none
      outline:none
      float:left
    .icon_
      position:relative
      flex:0 0 52px
      background:#fff
      &:after
        content:''
        height:25px
        width:0
        border-left:1px solid #ccc
        position:absolute
        left:0
        top:7px
      &:before
        content: '\E60B';
        font-family: "iconfont" !important;
        font-size: 41px;
        font-style: normal;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #eb942d;
        position: absolute;
        left: -5px;
        top: -9px;

.list
  padding-top:25px
  width:100%
  background:#fff
  padding-bottom:40px
  max-height: 352px;
  overflow:scroll
  ul
    display:flex
    flex-direction:column
    background:#f2f3f8
    li
      flex:1
      display:flex
      align-items:center
      border-bottom:1px solid #fff
      >div
        flex:1
        display:flex
        flex-direction:column
        padding-left:20px
        span
          flex:1
          color:#666666
        span:first-child
          font-size:17px
          color:#333333
        span:nth-child(2),span:nth-child(3)
          display:flex
          text-align-last: justify;
          span:first-child
            flex:0 0 60px
            margin-right:5px
          span:last-child
            margin-left:5px
            flex:1
      button
        flex:0 0 half(114)
        height:half(60)
        margin-right:20px
        background:$color
        color:#fff
        border-radius:30px
        font-size:15px
        outline:none
        border:none
    li:last-child
      border:none
.shutdown:after
    content:'\e61f'
    font-family:"iconfont" !important;
    font-size:16px;
    font-style:normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    position:absolute
    right: -25px;
    top: -38px;
    font-size: 70px;
    color: #ccc;
    width: 67px;
    height: 63px;





</style>


<script>
import axios from 'axios'
import qs from 'qs'
import { Loading } from 'vux'
export default {
  components:{ Loading },
  props:['order'],
  data(){
    return{
      host:'/huaxinneng/',
      resoult :'',
      list:'',
  //     [{custname:'张三',linkman:'tom',phone:'15011112222',custcode:''},
  //   {custname:'张三',linkman:'tom',phone:'15011112222',custcode:''},
  // {custname:'张三',linkman:'tom',phone:'15011112222',custcode:''}],
      value:'',
      showloading:false

    }
  },
  methods:{
    search(){
      let self = this;
      self.showloading = true;
      axios.get(''+this.host+'/custom/getCustom',{
        params:{
          companyName:this.value
          }
        }).then(data => {
          self.showloading = false;
          if(data.data.error == '0'){
          let n = JSON.parse(data.data.errMsg);
          console.log(n)
          self.list = n;
          
          }else{
            console.log('调用接口失败')
          }
        })

    },
    submit(n){
      // console.log(n)
      ///wego168-huaxinneng-wechat/custom/relation
      console.log(n)
      let self = this;
      self.showloading = true;
      let list = qs.stringify({//组合数据
        id:self.order.id,
        custCode:n.custcode,
        verify:self.order.verifyStatus
      })
      axios.post( this.host + '/custom/relation',list,{//发起请求
        headers:{
            'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then( data => {
        self.showloading = false;
        console.log(data.data)
        if(data.data.errcode == '1'){
         self.$vux.toast.show({
           text:'关联成功'
         }) 
         self.$emit('search',n);
         
        }else{
          self.$vux.toast.show({
            text:'关联失败，请稍后重试',
            type:'text'
          })
        }
      })

      // this.$emit('search',n);
    },
    shutdown(){
      this.$emit('shutdown')
    },
    preventDefault(event){
      event.preventDefault()
    }
  }



}
</script>

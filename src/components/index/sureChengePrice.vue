<template lang="html">
  <div class="main">
    <p class="title">执行日期：<span>{{doTime}}</span></p>
    <div class="middleBox">
      <ul class="list">
        <div class="bottomBox">
          <button @click="state=='false'?create():update()">确认无误,上传</button>
          <button @click="back">修改</button>
        </div>
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
    <loading v-model="loading" text="上传中..."></loading>
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
  bottom:0
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
    flex:1
    display:flex
    border-bottom:1px solid $borderColor
    // &:last-child
    //   border:none
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
        margin-bottom:15px
        font-size:13.5px
        color:#666
  li:last-child
    border-bottom:none
// 底部按钮
.bottomBox
  position:absolute
  left:0
  right:0
  bottom:-85px
  height:half(118)
  // background:#fff
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
import { Search , Loading} from 'vux'
import axios from 'axios'
import qs from 'qs'
export default {
  components:{ Search , Loading},
  data(){
    return{
      host:'/huaxinneng/',
      doTime:'',
      list:[{name:'广东油气商会——广石化挂牌价',price:'900.00'},
            {name:'广东油气商会——广石化挂牌价',price:'900.00'},
            {name:'广东油气商会——广石化挂牌价',price:'900.00'}],
      state:'',
      loading:false
    }
  },
  methods:{
    back(){
      this.$router.go(-1)
    },
    update(){
      //显示loading
      this.loading = true;
        //组合数据
        let self = this
      let str = '';
      for(var i = 0;i < this.list.length; i ++){
        let data_ = {
          auditflag:this.list[i].auditflag,
          executedate:this.list[i].executedate.substr(0,10),
          pricedate:this.list[i].pricedate.substr(0,10),
          web_code:this.list[i].web_code,
          web_name:this.list[i].web_name,
          web_price:this.list[i].web_price
        }
        str += '&'+qs.stringify(data_)
      }
      console.log(str)
      
      axios.post(''+this.host+'/userInfo/admin/updatePrice',str,{
         headers: {
                       'Content-Type': 'application/x-www-form-urlencoded'
                   }
      }).then( data =>{
        //结束loading
        self.loading =false;
        console.log(data.data)
        if(data.data.errcode == '0'){
          self.$vux.toast.show({
            text:'修改网价成功'
          })
          setTimeout(function() {
            self.$router.push('index')
          }, 1500);
        }else{
          self.$vux.toast.show({
            text:'录入网价失败，请联系管理员',
            type:'warn'
          })
          // setTimeout(function() {
          //   self.$router.push('addPrice')
          // }, 1500);
        }
      })

    },
    create(){
        //组合数据
      this.loading = true;
      let self = this;
      let str = '';
      for(var i = 0;i < this.list.length; i ++){
        let data_ = {
          auditflag:this.list[i].auditflag,
          executedate:this.list[i].executedate,
          pricedate:this.list[i].pricedate,
          web_code:this.list[i].web_code,
          web_name:this.list[i].web_name,
          web_price:this.list[i].web_price
        }
        str += '&'+qs.stringify(data_)
      }
      console.log(str)
      
      axios.post(''+this.host+'/userInfo/admin/savePrice',str,{
         headers: {
                       'Content-Type': 'application/x-www-form-urlencoded'
                   }
      }).then( data =>{
        self.loading = false;
        console.log(data.data)
        if(data.data.errcode == '0'){
          self.$vux.toast.show({
            text:'录入网价成功'
          })
          setTimeout(function() {
            self.$router.push('index')
          }, 1500);
        }else{
          self.$vux.toast.show({
            text:'录入网价失败，请联系管理员',
            type:'warn'
          })
          // setTimeout(function() {
          //   self.$router.push('addPrice')
          // }, 1500);
        }
      })
    }

  },
  mounted(){
    console.log(localStorage.getItem('isUpdateWebPrice')=='true')
    if(localStorage.getItem('isUpdateWebPrice')=='true'){
      this.list = JSON.parse( localStorage.getItem('update_webprice'))
      this.doTime = this.list[0].executedate.substr(0,10);      
    }else{
      this.list = JSON.parse( localStorage.getItem('web_price') );
      // this.doTime = localStorage.getItem('updateTime');
      this.doTime = this.list[0].executedate.substr(0,10);
      console.log(111)
    }
    
    console.log(this.doTime )

    // console.log(localStorage.getItem('state'))
    this.state = localStorage.getItem('isUpdateWebPrice');
  }
}

</script>

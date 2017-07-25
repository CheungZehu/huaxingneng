<template lang="html">
  <div class="main">
    <div class="viewBox">
      <img src="./../../assets/logo.png" alt="">
      <div class="inputBox">
        <span>￥</span>
        <input readOnly type="text" name="" v-model="num" placeholder="请输入支付金额">
      </div>
    </div>
    <div class="keyboard">
      <ul @click="key" @touchstart="keydown" @touchend="keyup">
        <li>
          <span v-for="n in row1" :data="n.value">{{n.value}}</span>
          <span data="-1"></span>
        </li>
        <li>
          <span v-for="n in row2" :data="n.value">{{n.value}}</span>
        </li>
        <li>
          <span v-for="n in row3" :data="n.value">{{n.value}}</span>
        </li>
        <li>
          <span v-for="n in row4" :data="n.value">{{n.value}}</span>
        </li>
      </ul>
    </div>
    <Loading v-model="loading"></Loading>
  </div>
</template>

<script>
import { Grid, GridItem, GroupTitle ,Loading} from 'vux'
import axios from 'axios'
import qs from 'qs'
export default {
  components:{ Grid, GridItem, GroupTitle ,Loading},
  created(){
    this.form.operater =this.util.getUrlParam("operater");
    // this.form.notify_url =this.util.getUrlParam("operater");
    this.openId =this.util.getUrlParam("operater");
    // alert(this.openId)
    this.getName()
  },
  data(){
    return{
      openId: '',
      form:{
        num:"",
        operaterName: "",
        operater:"",
        // notify_url: ''
        // operaterName: ''
      },
      

      row1:[{value:'1'},{value:'2'},{value:'3'}],
      
      row2:[{value:'4'},{value:'5'},{value:'6'}],
      row3:[{value:'7'},{value:'8'},{value:'9'}],
      row4:[{value:'00'},{value:'0'},{value:'.'},{value:'付款'}],
      int:'',
      flow:'',
      xiaoshu:false,
      loading:false,
      name: ''
    }
  },
  methods:{
    getName () {
      // axios.post('' + '/huaxinneng/user/ifregister').then(res => {
      axios.post('' + '/huaxinneng/user/getSalesmanByOpenId', qs.stringify({openId: this.openId})).then(res => {
        let a = JSON.parse(res.data.errMsg)
        this.form.operaterName = a.oname
        console.log(a)
        // alert(this.form.operaterName)
      })
    },
    key(event){
      let self = this;
      //获取点击区域的字符串
      let data = event.target.getAttribute('data');
      //点击过小数点后才执行这段代码
      if(this.xiaoshu)
      {
          if(data != '付款' && data != '-1'&& data != '.')
          {
             //如果小数点有两位就什么都不执行
              if(this.flow.length >= 2)
              {
                return
              }
              else{
                this.flow += data
              }
          }
          else if (data == '-1')
          {
              this.flow = this.flow.substr(0,this.flow.length-1)
              if(this.flow.length <=0)
              {
                this.xiaoshu = false
              }
          }
          else if (data == '.')
          {
             console.log(this.flow.lengt);
          }
          else if(data == '付款')
          {
            //alert('小数点付款成功');
            self.loading = true;
            this.form.num  = this.num*100;
            axios.post(''+'/huaxinneng/custOrder/pay',qs.stringify(this.form)).then(data=>{
              // console.log(data.data)
              // alert(this.form.operaterName)
              let content = data.data.errMsg;
              window.location.href=content;
            }).catch(data =>{
              alert(data);
            });
          }
      }
      else
      {
        //如果点击的不是付款按钮，也不是-1，也不是.  也不是00.那么就执行
        if(data != '付款' && data != '-1'&& data != '.'&& data!='00')
        {
          if(this.int=='0'){
            return;
          }
          else{
            this.int=this.int+ data;
          }
        }
        //若点击的是-1
        else if (data == '-1')
         {
           //截取左边字符串，去掉最右边的数字
           this.int = this.int.substr(0,this.int.length-1)
        }
        else if (data == '.')
        {
          if(this.int.length<1){
            this.int='0';
          }
          this.xiaoshu = true
        }
        else if(data == '00')
        {
          if(this.int!='0')
          {
            //如果当前输入的字符串长度大于0
            if(this.int.length>0)
            {
              this.int += data
            }
          }

        }
        else if(data == '付款')
        {
            // alert('整数付款成功');
          //如果没有
          if(this.int.length<1){
            alert('请先输入付款金额');
          }
          else{
            self.loading = true;
            this.form.num  = this.num*100;
            axios.post(''+'/huaxinneng/custOrder/pay',qs.stringify(this.form)).then(data=>{
              // console.log(data.data)
              // alert(this.form.operaterName)
              let content = data.data.errMsg;
              window.location.href=content;
            }).catch(data =>{
              alert(data);
            });
          }

        }
      }
    },
    keydown(event){
      console.log(event.target)
      event.target.style['background-color'] = '#ccc';
    },
    keyup(event){
      if(event.target.getAttribute('data') == '付款'){
        event.target.style['background-color'] = '#eb942d';
      }else{
        event.target.style['background-color'] = '#fff';
      }
    }
  },
  computed:{
      num()
      {
        if(this.xiaoshu)
        {
          if(this.flow.length >= 2)
          {
            return this.int + '.' +this.flow.substr(0,2)
          }
          else
          {
            return this.int + '.' +this.flow
          }
        }
        else
        {
          return this.int
        }
      },
      test(){

      }
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
@import './../libs/stylus/same.styl'
.main
  position:absolute
  top:0
  left:0
  bottom:0
  right:0
  .keyboard
    position:absolute
    right:0
    left:0
    bottom:0
    height:50%
    background:#fff
    overflow:hidden
    ul
      width:100%
      height:100%
      display:flex
      flex-direction:column
      li
        flex:1
        border-bottom:1px solid #dbdbdb
        display:flex
        align-items:center
        span
          flex:1
          border-left:1px solid #dbdbdb
          text-align:center
          height:100%
          line-height:65 px
          font-size:25px
          color:#666
        span:first-child
          border:none
        span[data='-1']
          background:url('./../../assets/jian.png') no-repeat center
          width:80px
          height:80px
          background-size:30%
          position:relative
          // z-index:2
      li:nth-child(2),li:nth-child(3)
        width:75%
      li:last-child
        border:none
        span:last-child
          align-self: flex-end;
          height:303%
          line-height:203px
          background:$color
          color:#fff
          position:relative
          z-index:1
  .viewBox
    position:absolute
    top:0
    left:0
    right:0
    bottom:300px
    img
      height:half(165)
      margin:0 auto
      margin-top:half(68)
      display:block
      margin-bottom:half(68)
    .inputBox
      width:90%
      margin:0 auto
      height:half(140)
      border:1px solid $color
      background:#fff
      border-radius:10px
      display:flex
      overflow:hidden
      span
        flex:0 0 half(78)
        line-height:70px
        text-align:center
        color:#666
        font-size:30px
        margin-left:10px
      input
        flex:1
        height:100%
        float:right
        border:none
        outline:none
        border-radius:10px
        font-size:21px
        &::placeholder
          color:#cccccc




</style>

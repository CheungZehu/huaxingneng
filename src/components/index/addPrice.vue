<template lang="html">
  <div class="main">
    <div>
    <p class="title">执行日期：<span>{{doTime}}</span>
    

    </p>
    <div class="middleBox">
    <!--   <ul class="list">
        <li v-for="n in list">
          <div class="icon_box">
            <span></span>
          </div>
          <div>
            <p>￥{{n.web_price}}</p>
            <p>{{n.web_name}}</p>
          </div>
        </li>
      </ul> -->
      <group v-if="list" class="list">
        <x-switch class="icon_box" v-for="n in list" :key="n" :title="n.web_price" :inline-desc="n.web_name" v-model="n.status" disabled>
        </x-switch>
      </group>
    </div>
    <div v-for="(m,k) in list2">
       <p class="title">执行日期：<span>{{m[0].executedate.substr(0,10)}}</span>
       <span class="radio" v-bind:class="{active:(k == clickIndex)}" @click="click(m,k)"></span>
       <input type="radio"  name="radio" hidden="hidden" :value="doTime" v-model="radio">
       </p>
        <div class="middleBox">
          <!-- <ul class="list">
            <li v-for="n in m">
              <div class="icon_box">
                <span></span>
              </div>
              <div>
                <p>￥{{n.web_price}}</p>
                <p>{{n.web_name}}</p>
              </div>
            </li>
          </ul> -->
          <group class="list">
            <x-switch class="icon_box" v-for="n in m" :key="n" :title="n.web_price" :inline-desc="n.web_name" v-model="n.status" disabled>
            </x-switch>
          </group>
        </div> 
     </div>     
    </div>
    <div class="bottomBox">
      <button @click="routerToChengePrice" >录入</button>
      <button @click="routerTochengePrice2" :disabled="isdisabled">修改</button>
    </div>
    <loading v-model="loading"></loading>
  </div>
</template>


<script>
import { Search , Checker , Loading, Group, XSwitch} from 'vux'
import { mapState } from 'vuex'
import axios from 'axios'
export default {
  components:{ Search , Checker , Loading, Group, XSwitch},
  data(){
    return{
      host:'/huaxinneng/',
      doTime:'',
      list:[{name:'广东油气商会——广石化挂牌价',price:'900.00'},
            {name:'广东油气商会——广石化挂牌价',price:'900.00'},
            {name:'广东油气商会——广石化挂牌价',price:'900.00'}],
      doTime2:'',
      getTomorrowPrice:[],
      isUpdate:false,
      radio:'',
      list2:[],
      loading:false,
      clickIndex:'',//控制高亮的变量
      isdisabled:false
    }
  },
  methods:{
    back(){
      this.$router.go(-1)
    },
    router(r){
      this.$router.push(r)
    },
    routerToChengePrice(){
      let self = this;
        console.log(self.list)
        // isUpdateWebPrice
        
        localStorage.setItem('web_price',JSON.stringify(self.list))        
        localStorage.setItem('isUpdateWebPrice',false)
        this.$router.push('chengePrice') 
    },
    routerTochengePrice2(){
      // let self = this;
      // if(!this.isUpdate){
      //    this.$router.push('chengePrice')
      //    localStorage.setItem('web_price',JSON.stringify(self.getTomorrowPrice))
      //   localStorage.setItem('state','update')//存一个状态，update是录入的
         
      // }else{
      //   self.$vux.toast.show({
      //       text:'明日网价不存在，只允许录入',
      //       type:'text'
      //     })    
      // }
      let update_webprice =localStorage.getItem('update_webprice');
      let self = this;
      if(!update_webprice){ //如果没有选择，提示，不跳转
        self.$vux.toast.show({
          text:'未选择要修改的网价',
          type:'text'
        })
        return
      }
      localStorage.setItem('isUpdateWebPrice',true);
      self.$router.push('updatePrice');
      
        
    },
    click(val,index){
      console.log(val,index)
      this.clickIndex = index;//点击的是哪一个，让哪一个高亮
      localStorage.setItem('update_webprice',JSON.stringify(val));
    }
  },
  mounted(){
    this.loading = true;
    console.log(this.isUpdate)
    // console.log(this.$store);
    let self = this
    axios.post(''+this.host+'/userInfo/admin/getPrice').then( data =>{
      // console.log(data.data)
      if(data.data.errcode == '0'){
        let data_ = data.data.errMsg;
        data_ = JSON.parse(data_);
        self.list = data_;
        console.log(self.list)
        self.list.map(item => {
          item.status = item.auditflag == '1' ? true : false
        })
        // console.log(data_[0].executedate)
        // let dotime = new Date(data_[0].executedate);
        this.doTime = data_[0].executedate.substr(0,10);
        
      }
    });

    axios.post(this.host + '/userInfo/admin/getWebPrice').then( data => {
      self.loading = false;
      if(data.data.errcode == '0'){
        // console.log('999')
        let _date = JSON.parse(data.data.errMsg);
        // console.log(_date)
        let k={};
        let t = 0;// 有多少天的数据
        for(let i = 0; i < _date.length ; i ++){
          k[_date[i].executedate] = 1
        }
        for(let i in k){
          
          self.list2[t]=[];
          for(let j = 0; j < _date.length; j ++){
            if(i == _date[j].executedate){
              self.list2[t].push(_date[j])
            }
          }
          t++;
        }
        self.list2.map(item => {
          item.map(item => {
            item.status = item.auditflag == '1' ? true : false
          })
        })
        // console.log('list2')
        // console.log(self.list2)
        localStorage.setItem('update_webprice',JSON.stringify(self.list2[0]))
      }else if(data.data.errcode == '-4'){
        self.isdisabled = true;

      }
    })
  }
}

</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import './../libs/stylus/same.styl'
@import './../libs/icon/iconfont.css'
.main
  position:absolute
  top:0
  left:0
  bottom:0
  right:0
  >div:first-child
    overflow: auto
    position: absolute
    top: 0
    left: 0
    right: 0
    bottom: half(118)
.title
  background:#fefbf0
  display:inline-block
  width:100%
  height:38px
  line-height:38px
  text-align:center
  font-size:17.5px
  color:$color
  border-bottom:1px solid #ddd
  position:relative

    
.middleBox
  // position:absolute
  // top:39px
  // right:0
  // left:0
  // bottom:half(118)
  overflow:auto
  background:#f2f3f8
  margin-bottom:15px
.list
  // position:absolute
  // top:0
  // left:0
  // right:0
  background:#fff
  display:flex
  flex-direction:column
.vux-x-switch.weui-cell_switch
  padding-left:50px
.icon_box:after
    content:"\e616"
    font-family:"iconfont" !important;
    font-size:23px;
    font-style:normal;
    color:$color
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    line-height:70px
    position:absolute
    left:10px
  li
    flex:1
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
        margin-bottom:15px
// 底部按钮
.bottomBox
  position:fixed
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
.radio
  position:absolute
  right:0
  top:3px
  height:39px
  &:after
    content:'\e61c'
    font-family:"iconfont" !important;
    font-size:16px;
    font-style:normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-size:35px
    color:#ccc  
.active:after
  color:$color
button[disabled="disabled"]
  color:#ccc !important
  border-color:#ccc !important
</style>
<template>
    <div class="main" @touchmove="preventDefault"> 
<!--        <p @click="isshow = true">{{title==''?'请输入门店名称':title}}</p>
       <p @click="isshow = true" v-if="store === ''">请输入门店名称</p> -->
       <!-- <p @click="isshow = true" v-else>{{store}}</p> -->
       <p @click="isshow = true">{{store != '' ? store : '请输入门店名称'}}</p>
       <div class="msk" v-show="isshow">

            <div class="inputBox">
                <div class="main">
                <input type="text" name="" v-model="value" placeholder="请输入门店名称">
                <span class="icon_" @click="search"></span>
                </div>
                <div class="list" v-if="list">
                <ul>
                    <li v-for="n in list">
                    <div>
                        <span>{{n.deptName}}</span>
                    </div>
                    <button type="button" name="button" @click="submit(n)">确定</button>
                    </li>
                </ul>
                </div>        
             <span class="shutdown" @click="isshow=false"></span>                

            </div>

             <div class="msk1" @click="isshow = false"></div>
         </div>
             <loading v-model="showloading"></loading>
    </div>
</template>
<script>
import { Loading } from 'vux'
import search from './../tody_income/search.vue'
import axios from 'axios'
import qs from 'qs'
export default {
    components:{ search , Loading },
    props: ['store'],
  data () {
    return {
      host:'/huaxinneng/',
      isshow:false,
      list:[
          ],
      value:'',
      title: this.store,
      // title: this.store ? this.store : '请输入门店名称',
      showloading:false,
    };
  },
  mounted () {
    // this.title = this.store
    // this.store = this.store != '' ? this.store : '请输入门店名称'
  },
  computed: {
    // title () {
    //   // return this.store == undefined ? '请输入门店名称' : this.store
    //   return this.store
    // }
    // this.title = this.store == undefined ? '请输入门店名称' : this.store
  },
  watch: {
    store (val) {
      console.log('store')
      console.log(val)
    }
  },
  methods:{
      search(){
        localStorage.clear()
          this.showloading = true;
          let self = this;
          self.list = [];
          let list = qs.stringify({
              name:self.value,
              // custCode: this.custcode
          })
          axios.post(this.host + '/custOrder/deptnameList',list,{
              headers:{
                'Content-Type': 'application/x-www-form-urlencoded'
              }
          }).then( data => {
              console.log(data.data)
             
          this.showloading = false;
          if(data.data.error == '0'){
             self.list = data.data.errMsg
          }else if (data.data.error == '4001') {
            this.$vux.toast.show({
              text:'获取不到数据，请换其它词语搜索',
              type:'text'
            })
          } else {
            self.list = null
          }
              
          })
      },
      submit(name){
        // debugger
          console.log('name')
          console.log(name)
          // this.title = name.deptName;
          this.store = name.deptName;
          this.$emit('searchStore',name);
          this.isshow = false
          // localStorage.clear()
      },
       preventDefault(event){//阻止滑动底层跟着动
      event.preventDefault()
    }
      
  },
  watch:{
    isshow:function(){
        if(this.isshow){
            document.body.style.overflow='hidden'
        }else{
            document.body.style.overflow='auto'
        }
    }
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
.main
    width:100%
    background:#fff
    p
        font-size:14px
        width:100%
.msk
  position:fixed
  top:0
  bottom:0
  left:0
  right:0
  z-index:99
  .msk1
    background:#000
    width:100%
    height:100%
    opacity:0.68
    position:absolute

@import './../libs/stylus/same.styl'
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
        top: -4px;

.list
  padding-top:25px
  width:100%
  background:#fff
  // padding-bottom:40px
  max-height:350px
  overflow:auto
  ul
    display:flex
    flex-direction:column
    background:#f2f3f8
    li
      flex:0 0 half(191)
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
    li:nth-child(2):after
        content:''
        
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
.shutdown
    position: absolute;
    right: -21px;
    top: -21px;
    width: 43px;
    height: 43px;
    overflow: hidden;
.shutdown:after
    content:'\e61f'
    font-family:"iconfont" !important;
    font-size:16px;
    font-style:normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    position:absolute
    right: 3px;
    top: 14px;
    font-size: 70px;
    color: #ccc;
    width: 59px;
    height: 33px;
</style>
<template lang="html">
  <div class="main">
	<div class="header">
		<i class="iconfont icon-zuojiantou" @click="back"></i>
		<span>送气记录</span>
	</div>
	<div v-if="!show">
		<div v-if="status">
			<div class="top">
		      <p>未打印</p>
		      <ul class="ok">
		        <li v-for="n in list_not" @click="toOrder(n)">
		          <div>
		            <img :src="n.headurl" alt="" style="width:100%">
		          </div>
		          <div>
		            <p>{{n.company}} <span class="tip">待打印</span> </p>
		            <span class="price">￥{{n.totalprice}}</span>
		            <span>配送：{{n.appDate.substr(0,10) + '    ' +n.time}}</span>
		          </div>
		        </li>
		         <span class="noOrder" v-if="list_not.length==0">暂无待打印订单</span>
		      </ul>
		    </div>
		    <div class="bottom" v-show="list_ok.length>0">
		      <p>已打印</p>
		      <ul class="ok">
		        <li v-for="n in list_ok" @click="toOrder(n)">
		          <div>
		            <img :src="n.src" alt="">
		          </div>
		          <div>
		            <p>{{n.company}}</p>
		            <span class="price">￥{{n.totalprice}}</span>
		            <span>配送：{{n.appDate.substr(0,10) + '    ' +n.time}}</span>
		          </div>
		        </li>
		         <span class="noOrder" v-if="list_ok.length==0">暂无已打印订单</span>        
		      </ul>
		    </div>
		</div>
		<div class="more" v-else>
			暂无数据
		</div>
	</div>
    <loading v-model="show"></loading>
  </div>
</template>
<style lang="stylus" rel="stylesheet/stylus" scoped>
@import './../libs/stylus/same.styl'
.main
  .header {
		width: 100%;
	    height: 20px;
	    background: #fff;
	    line-height: 20px;
	    position: fixed;
	    z-index: 9;
	    top: 0;
	    border-bottom: 1px solid #e4e4e9;
	    display: flex;
	    padding: 15px 0;
	    .iconfont {
	    	color: #eb942d;
	    	&:before {
	    		font-size: 26px;
	    	}
	    }
	    span {
	    	border-left: 1px solid #ccc;
    		padding-left: 10px;
	    }
		}
  .top
    >p:first-child
      width:100%
      display:inline-block
      padding:0 15px
      height:half(55)
      line-height:half(55)
      color:#999
      margin-top:55px
    ul
      padding:0 15px
      background:#fff
      li
        display:flex
        border-bottom:1px solid #ccc
        div:first-child
          flex:0 0 half(85)
          height:half(85)
          margin:15px 15px 0 0
          background:#ccc
        div:last-child
          flex:1
          display:flex
          flex-direction:column
          >p:first-child
            margin-top:15px
            font-size:15px
            >span
              margin-left:6px
              padding:0 4px
              display:inline-block
              background:#f5c996
              font-size:12px
              color:#fff
              border-radius:3px
        .price
          // margin-top:15px
          font-size:20px
          color:$color
        span:last-child
          color:#999
          font-size:13px
          margin-bottom:10px
      li:last-child
          border:none
  .bottom
    >p:first-child
      width:100%
      display:inline-block
      padding:0 15px
      height:half(55)
      line-height:half(55)
      color:#999
    ul
      padding:0 15px
      background:#fff
      li
        display:flex
        border-bottom:1px solid #ccc
        div:first-child
          flex:0 0 half(85)
          height:half(85)
          margin:15px 15px 0 0
          background:#ccc
        div:last-child
          flex:1
          display:flex
          flex-direction:column
          >p:first-child
            margin-top:15px
            font-size:15px
            >span
              margin-left:6px
              padding:0 4px
              display:inline-block
              background:#f5c996
              font-size:12px
              color:#fff
              border-radius:3px
        .price
          margin-top:8px
          font-size:20px
          color:$color
        span:last-child
          color:#999
          font-size:13px
          margin-bottom:10px
      li:last-child
          border:none
.noOrder
  display:block
  text-align:center
  padding:10px 0
  color:#ccc

.more 
  margin-top:60px
  text-align:center
  color: #333

</style>
<script>
import { Loading } from 'vux'
import axios from 'axios'
import qs from 'qs'
export default {
  components:{ Loading },
  data(){
    return {
      host:'/huaxinneng/',
      show:false,
      list_not:[],
      list_ok:[],
      status: false
    }
  },
  methods:{
    toOrder(n){
      console.log('setItem')
      console.log(n);
      console.log(n.deptNoName)
      localStorage.setItem('recond_order',JSON.stringify(n))

      this.$router.push('/membercenter/recond/recondOrder')
    },
    back () {
		this.$router.go(-1)
	},
  },
  mounted(){
    let self = this;
    self.show = true;
    axios.post( this.host + '/custOrder/getMyOrderList').then( data => {
      self.show = false;
      let list = JSON.parse(data.data.errMsg);
      if (data.data.errMsg) {
      	this.status = true
      } else {
      	this.status = false
      }
      // console.log(list[1].status)
      console.log('myOrder')
      console.log(list)
      for(var i = 0 ; i < list.length ; i ++){
        // console.log(list[i].status)
        if(list[i].status == '1'){
          self.list_ok.push(list[i])
        }else{
          self.list_not.push(list[i])
        }
      }
    })
    // axios.post()
  }
}
</script>

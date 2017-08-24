<template>
	<div class="person">
		<div class="person_box">
	    <div class="person_img_box">
       	<img :src="salesman.src" alt="" style="width:80px;height:80px">
     	</div>
	    <span>{{salesman.name}}</span>
	  </div>
<!--     <div class="person_income_box">
      <div class="index_incom_today"  @click="router('todayIncome')">
        <span class="index_incom_today_num index_color"><span class="money">￥</span>{{salesman.today_income}}</span>
        <span>今日收款</span>
      </div>
      <div class="index_relation_box" @click="router('waitRelation')">
        <span class="index_relation_num index_color">{{salesman.tody_relation}}</span>
        <div class="border"></div>
        <span>待关联/单</span>
      </div>
      <div class="index_myorder_box" @click="router('myOrder')">
        <span class="index_myorder_num index_color">{{salesman.myorder}}</span>
        <span>我的订单/单</span>
      </div>
    </div> -->
<!--     <div class="enter_btn">
      <button type="button" name="button" @click="router('placeOrder')">下单</button>
    </div> -->
    <div class="list">
    	<ul>
    		<li>a</li>
    	</ul>
    </div>
  </div>
</template>

<script>
	import axios from 'axios'
	import qs from 'qs'
	import { mapState } from 'vuex'
 	import { Loading } from 'vux'

 	export default {
 		components:{ Loading },
 		data () {
 			return {
 				salesman: {
	        src:'',
	        name:'业务员',
	        // today_income: '0',
	        // tody_relation: '0',
	        // myorder: '0'
      	},
      	host:'/huaxinneng/',
 			}
 		},
 		created () {
 			this.getPerson()
 		},
 		methods: {
 			getPerson () {
 				axios.get('' + this.host + '/userInfo/getMyInfoExternal').then(res => {
 					console.log(res.data)
 					if (res.data.error == 0) {
 						let data = res.data.errMsg
 						this.salesman.name = data.name
 						this.salesman.src = data.headimgurl
 					}
 				})
 			}
 		}
 	}
</script>

<style lang="less" scoped>

	.person {
	  background:#f2f3f8;
		.person_box {
			width:100%;
		  background:#fff;
		  display:flex;
		  flex-direction: column;
		  .person_img_box {
		  	width: 80px;
		    height: 80px;
		    margin: 0 auto;
		    margin-top: 15px;
		    border-radius: 50%;
		    border: none;
		    background: #f2f3f8;
		    overflow: hidden;
		  }
		  span {
	    	margin: 15px;
				text-align:center;
	    }
		}		
	}
		
</style>
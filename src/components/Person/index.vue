<template>
	<div class="person">
		<div class="person_box">
	    <div class="person_img_box">
       	<img :src="salesman.src" alt="" style="width:80px;height:80px">
     	</div>
	    <span>{{salesman.name}}</span>
	  </div>
    <div class="list">
    	<ul>
    		<router-link tag="li" to="/membercenter/data">
    			<i class="icon iconfont icon-wodeziliao"></i>
    			<span>我的资料</span>
    		</router-link>
    		<router-link tag="li" to="/membercenter/address">
    			<i class="icon iconfont icon-wangjia"></i>
    			<span>送气地址</span>
    		</router-link>
    		<!-- <router-link tag="li" to="/membercenter/recond" v-if="otype">
    			<i class="icon iconfont icon-wangjia"></i>
    			<span>送气记录</span>
    		</router-link>
    		<li @click="jilu" v-else>
    			<i class="icon iconfont icon-wangjia"></i>
    			<span>送气记录</span>
    		</li> -->
    		<li @click="jilu">
    			<i class="icon iconfont icon-wangjia"></i>
    			<span>送气记录</span>
    		</li>
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
	        name:'',
	        // today_income: '0',
	        // tody_relation: '0',
	        // myorder: '0'
      	},
      	host:'/huaxinneng/',
      	otype: false,
 			}
 		},
 		created () {
 			this.getPerson()
 			this.type()
 		},
 		methods: {
 			getPerson () {
 				// axios.get('' + this.host + '/userInfo/getMyInfoExternal').then(res => {
 				axios.post('' + this.host + '/memberCenter/index').then(res => {
 					// console.log(res.data)
 					if (res.data) {
 						let data = res.data
 						// if (data.name) {
 						// 	this.salesman.name = data.name ? data.name : data.nickname
 						// } else {
 						// 	this.salesman.name = data.nickname
 						// }
 						this.salesman.name = data.name ? data.name : data.nickname
 						this.salesman.src = data.headimgurl
 					}
 				})
 			},
 			jilu () {
 				// axios.get(this.host + '/wechat/customize/huaxinneng/Huaxinneng!go.action?boxUrl=/customize/huaxinneng/Huaxinneng!myorders.action').then(res => {
 				// 	console.log(res.data)
 				// })
 				location.href = 'http://hxn.wego168.com/exhuaxinneng/wechat/customize/huaxinneng/Huaxinneng!go.action?boxUrl=/customize/huaxinneng/Huaxinneng!myorders.action'
 			},
 			type () {
 				axios.post(this.host + '/user/ifregister').then(res => {
 					console.log(res.data)
 					if (res.data.error == 0) {
 						let data = JSON.parse(res.data.errMsg)
 						// this.otype = data.otype
 						// console.log(this.otype)
 						if (data.otype == 0) {
 							this.otype = true
 						} else {
 							this.otype = false
 						}
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
		.list {
			width: 100%;
    	margin-top: 15px;
   		background: #fff;
   		ul {
   			li {
   				line-height: 55px;
   				display: flex;
   				i {
   					font-size: 46px;
				    line-height: 60px;
				    color: #eb942d;
   				}
   				span {
   					width: 100%;
    				border-bottom: 1px solid #ccc;
   				}
   				&:last-child {
   					span {
   						border-bottom: none;
   					}
   				}
   			}
   		}
		}	
	}
		
</style>
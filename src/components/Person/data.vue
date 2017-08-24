<template>
	<div class="data">
		<!-- <x-header style="background-color:#eb942d;">This is the page title.</x-header> -->
		<div class="header">
      <i class="iconfont icon-zuojiantou" @click="back"></i>
      <span>我的资料</span>
    </div>
    <div v-if="status">
    	<div class="name">
	    	<div class="img-box">
	    		<img :src="user.headimgurl" alt="">
	    	</div>
	    	<div class="text">
	    		<span>{{user.name ? user.name : user.nickname}}</span>
	    	</div>
	    </div>
	    <div class="list">
	    	<group>
	    		<cell title="性质" :value="user.type" v-if="user.type">
	    		</cell>
	    		<cell title="手机" :value="user.movible" v-if="user.movible">
	    		</cell>
	    		<cell title="编号" :value="user.cardno" v-if="user.cardno">
	    		</cell>
	    		<cell title="类型" :value="user.custtype" v-if="user.custtype">
	    		</cell>
	    	</group>
	    </div>
    </div>
    <div class="more" v-else>
    	暂无数据
    </div>
	</div>
</template>

<script>
	import axios from 'axios'
	import qs from 'qs'
	import { Group, Cell } from 'vux'

	export default {
		components: {
			Group, Cell
		},
		data () {
			return {
				host:'/huaxinneng/',
				user: {},
				status: true,
			}
		},
		created () {
			this.getUser()
		},
		methods: {
			back () {
				this.$router.go(-1)
			},
			getUser () {
				axios.post(this.host + '/memberCenter/getMyInfoByOpenId').then(res => {
					console.log(res.data)
					if (res.data.error == 0) {
						this.user = res.data.errMsg
						if (this.user.littlePhone == 0) {
							this.user.type = '民用'
						} else if (this.user.littlePhone == 1) {
							this.user.type = '商用'
						} else if (this.user.littlePhone == 2) {
							this.user.type = '工业'
						} else if (this.user.littlePhone == 3) {
							this.user.type = '批发'
						}
						console.log(this.user.type)
						this.status = true
						// if (this.user.otype == 0) {
						// 	this.user.type = '管理员'
						// } else if (this.user.otype == 1) {
						// 	this.user.type = '操作员'
						// }
					} else {
						this.status = false
					}
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.data {
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
		.name {
			margin-top: 70px;
			height: 80px;
    	background: #fff;
    	display: flex;
    	align-items: center;
    	.img-box {
    		height: 60px;
    		width: 60px;
    		border-radius: 50%;
    		overflow: hidden;
    		margin-left:15px;
    		img {
    			width: 100%;
    		}
    	}
    	.text {
    		margin-left:15px;
    	}
		}
		.list {
			.iconfont {
				font-size: 30px;
				color: #eb942d;
			}
		}
		.more {
			margin-top:60px;
			text-align:center;
			color: #333;
		}
	}
</style>
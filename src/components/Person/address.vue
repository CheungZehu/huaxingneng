<template>
	<div class="address">
		<div class="header">
	    <i class="iconfont icon-zuojiantou" @click="back"></i>
	    <span>送气地址</span>
	  </div>

	  <div class="list" v-if="address.length > 0">
	  	<group v-for="item in address" :key="item">
	  		<cell  title="客户姓名" :value="item.name"></cell>
	  		<cell  title="送气地址" :value="item.address"></cell>
	  		<cell  title="地址楼层" :value="item.floor"></cell>
	  		<cell  title="信息代码" :value="item.custNo"></cell>
	  	</group>
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
				host: '/huaxinneng/',
				address: [],
			}
		},
		created () {
			this.getAddress()
		},
		methods: {
			back () {
				this.$router.go(-1)
			},
			getAddress () {
				axios.post(this.host + '/memberCenter/getAddress').then(res => {
					console.log(res.data)
					if (res.data.error == 0) {
						console.log(res.data.errMsg.length)
						res.data.errMsg.map(item => {
							console.log('aa')
							if (item.address) {
								this.address.push(item)
							}
						})
					}
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.address {
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
		.list {
			margin-top: 70px;
			.iconfont {
				color: #eb942d;
				&:before {
					font-size: 30px;
				}
			}
		}
		.more {
			margin-top:60px;
			text-align:center;
			color: #333;
		}
	}
</style>
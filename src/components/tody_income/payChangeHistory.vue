<template>
	<div>
		<group v-for="item in Data" :key="item.id">
			<!-- <cell title="业务员" :value="item"></cell> -->
			<cell title="订单号" :value="item.id"></cell>
			<cell title="原单价" :value="item.oldpay | currency"></cell>
			<cell title="现单价" :value="item.newpay | currency"></cell>
			<cell title="原数量" :value="item.oldnum"></cell>
			<cell title="现数量" :value="item.newnum"></cell>
			<cell title="原总价" :value="item.oldtotal | currency"></cell>
			<cell title="现总价" :value="item.newtotal | currency"></cell>
			<cell title="修改时间" :value="item.createTime"></cell>
		</group>
		<load-more v-if="show" :show-loading="false" tip="暂无数据" background-color="#f2f2f2"></load-more>
	</div>
</template>

<script>
	import { Group, Cell, Loading, LoadMore } from 'vux'
	import axios from 'axios'

	export default {
		components: {
			Group, Cell, Loading, LoadMore
		},
		data () {
			return {
				host:'/huaxinneng/',
				Data: [],
				show: false
			}
		},
		filters: {
			currency (val) {
				return val + '元'
			}
		},
		created () {
			this.getData()
		},
		methods: {
			getData () {
				this.showLoading = true
				axios.post(this.host + '/custOrder/getChangeOrderList').then(res => {
					if (res.data) {
						
						this.Data = JSON.parse(res.data.errMsg)
						console.log(this.Data)
						this.showLoading = false
					} else {
						this.show = true
					}
				})
			}
		}
	}
</script>
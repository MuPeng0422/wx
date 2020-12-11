<template>
	<view class="content">
		<view class="goods-address">
			<u-card title="收货地址" title-color="#333" title-size="36" @body-click="goSettingAddress">
				<view class="" slot="body">
					<view class="u-body-item u-flex">
						<view class="u-left u-flex-1">
							<view class="cell goods-person">
								<span>收货人</span> {{ data.name }}
							</view>
							<view class="cell address">
								{{ data.address }}
							</view>
						</view>
						<view class="u-right-icon">
							<u-icon name="arrow-right"></u-icon>
						</view>
					</view>
				</view>
			</u-card>
		</view>
		
		<view class="goods-list">
			<u-card title="进货列表" title-color="#333" title-size="36">
				<view class="" slot="body">
					<view v-for="(item, index) in orderList" :key="index" class="u-body-item u-flex u-col-between u-p-t-0" :class="[index < orderList.length - 1 ? 'u-border-bottom': '']">
						<image :src="item.pic_url" mode="aspectFill"></image>
						<view class="cell">
							<view class="cell-name">
								<view class="cell-name-title">
									名称
								</view>
								<view class="cell-name-name">
									{{ item.name }}
								</view>
							</view>
							<view class="cell-num">
								<view class="cell-num-title">
									数量
								</view>
								<view class="cell-num-num">
									{{ item.num }}
								</view>
							</view>
						</view>
					</view>
				</view>
			</u-card>
		</view>
		
		<view class="navigation">
			<view class="left">
				共计: <span> {{ total }} </span>斤
			</view>
			<view class="right">
				<view class="buy btn u-line-1" @click="submitBuy">立即进货</view>
			</view>
		</view>
		
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	export default {
		name: 'index',
		data() {
			return {
				total: 0,
				orderList: [],
				data: {
					name: '',
					address: ''
				},
				addressId: ''
			}
		},
		onLoad(option) {
			this.getAddress()
			
			if (option !== undefined) {
				if (option.data !== undefined) {
					this.orderList = JSON.parse(option.data)
					for (var i = 0; i < this.orderList.length; i++) {
						this.total += this.orderList[i].num
					}
				}
			}
		},
		onShow: function () {
			var that = this;
			var pages = getCurrentPages();
			var currPage = pages[pages.length - 1]; //当前页面
			let res = currPage.data.data;
			if (res.address !== 'null' && res.name !== '') {
				this.data = {
					name: res.name,
					address: res.province + res.city + res.county + res.addressDetail
				}
			} else {
				this.data.address = '请填写收货人及收货地址'
			}
			
			this.addressId = res.id
		},
		methods: {
			submitBuy() {
				if (this.addressId === '' || this.addressId === undefined) {
					this.$refs.uToast.show({
						title: '请填写默认收货地址',
						position: 'top',
						type: 'warning',
						duration: 3000,
						icon: true,
						url: '/pages/address/index',
						params: {
							type: 0
						}
					})
					return false
				}
				const data = {
					addressId: this.addressId,
					userGoodsOrderDetailList: []
				}
				for (var i = 0; i < this.orderList.length; i++) {
					let row = {
						goodPic: '',
						goodName: '',
						goodId: '',
						total: '',
						counterPrice: '',
						yield: ''
					}
					row.counterPrice = this.orderList[i].counter_price
					row.yield = this.orderList[i].yield
					row.retailPrice = this.orderList[i].retail_price
					row.goodPic = this.orderList[i].pic_url
					row.goodName = this.orderList[i].name
					row.goodId = this.orderList[i].id
					row.total = this.orderList[i].num
					data.userGoodsOrderDetailList.push(row)
				}
				this.$u.post('/wx/userGoods/addOrder', data).then((res) => {
					if (res.errno === 0) {
						uni.showToast({
							title: '进货成功',
							icon: 'success',
							mask: true,
							success() {
								setTimeout(() => {
									// 返回刷新
									let pages = getCurrentPages(); // 当前页面
									let beforePage = pages[pages.length - 2]; // 前一个页面
									uni.navigateBack({
									    success: function() {
									        beforePage.onTabItemTap(); // 执行前一个页面的onLoad方法
									    }
									})
								}, 1000)
							}
						})
					}
				})
			},
			getAddress() {
				this.$u.get('/wx/address/list').then((res) => {
					if (res.data.list.length > 0) {
						this.data.name = res.data.list[0].name
						this.addressId = res.data.list[0].id
						this.data.address = res.data.list[0].province + res.data.list[0].city + res.data.list[0].county + res.data.list[0].addressDetail
					} else {
						this.data.address = '请填写收货人及收货地址'
					}
				})
			},
			goSettingAddress(index) {
				this.$u.route('/pages/address/index', { 
					type: 0
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.content{
		position: relative;
		
		.goods-address{
			.u-body-item {
				font-size: 32rpx;
				color: #333;
				
				.u-left{
					display: flex;
					flex-direction: column;
					
					.goods-person{
						color: #666;
						
						span{
							padding-right: 20rpx;
						}
					}
					
					.address{
						color: #C0C0C0
					}
				}
			}
		}
		.goods-list{
			.u-body-item {
				font-size: 32rpx;
				color: #333;
				padding: 20rpx 10rpx;
				
				image {
					width: 120rpx;
					flex: 0 0 120rpx;
					height: 120rpx;
					border-radius: 8rpx;
					margin-right: 12rpx;
				}
				
				.cell{
					flex: 1;
					display: flex;
					justify-content: space-around;
					
					.cell-name{
						flex: 1;
						display: flex;
						flex-direction: column;
						justify-content: space-between;
					}
					
					.cell-num{
						width: 100rpx;
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						
						.cell-num-title{
							text-align: center;
						}
						
						.cell-num-num{
							text-align: center;
						}
					}
				}
			}
		}
		
		.navigation {
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;
			display: flex;
			margin-top: 100rpx;
			border: solid 2rpx #f2f2f2;
			background-color: #ffffff;
			padding: 16rpx 0;
			justify-content: space-between;
			z-index: 999;
			
			.left {
				flex: 1;
				display: flex;
				align-items: center;
				padding-left: 20rpx;
				font-size: 36rpx;
				
				span{
					padding: 0 10rpx;
					color: #ed3f14;
				}
			}
			.right {
				width: 200rpx;
				display: flex;
				font-size: 28rpx;
				align-items: center;
				.btn {
					line-height: 66rpx;
					padding: 0 30rpx;
					border-radius: 36rpx;
					color: #ffffff;
				}
				.cart {
					background-color: #ed3f14;
					margin-right: 30rpx;
				}
				.buy {
					background-color: #ff7900;
				}
			}
		}
	}
	
</style>

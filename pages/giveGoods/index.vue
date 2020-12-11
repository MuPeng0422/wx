<template>
	<view class="content">
		<view class="bg">
			<u-image width="100%" height="250rpx" src="http://atx.plus/static/images/givegoods.jpg"></u-image>
		</view>
		<view v-if="orderList.length === 0" class="no-order-list">
			<u-empty text="暂无订单" mode="list"></u-empty>
		</view>
		<view v-else class="order-list">
			<view v-for="(item, i) in orderList" :key="i" class="order-list-item">
				<view class="order-list-goodslist">
					<view v-for="(goods, j) in item.userGoodsOrderDetailList" :key="j" class="order-list-goodslist-item u-border-bottom">
						<view class="goods-pic">
							<image :src="goods.goodPic" mode="aspectFill"></image>
						</view>
						<view class="goods-info">
							<view class="goods-info-name">
								<view class="cell-name-title">
									名称
								</view>
								<view class="cell-name-name">
									{{ goods.goodName }}
								</view>
							</view>
							<view class="goods-info-num">
								<view class="cell-num-title">
									数量
								</view>
								<view class="cell-num-num">
									{{ goods.total }}
								</view>
							</view>
						</view>
					</view>
					<view class="order-list-goodslist-total">
						共 {{ item.userGoodsOrderDetailList.length }} 种
					</view>
				</view>
			</view>
			
			<view class="loadmore">
				<u-loadmore v-if="pages >= 1" :status="status" />
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'index',
		data() {
			return {
				orderList: [],
				status: 'loadmore',
				page: 1,
				limit: 10,
				pages: 1
			}
		},
		onLoad() {
			if (this.page === this.pages) {
				this.status = 'nomore'
			}
			this.getData(this.page, this.limit)
		},
		onReachBottom() {
			if (this.page < this.pages) {
				this.page ++
				this.status = 'loading'
				setTimeout(() => {
					this.getData(this.page, this.limit)
				}, 1000)
			} else {
				this.status = 'nomore'
				this.page = this.pages
			}
		},
		methods: {
			getData(page, limit) {
				this.$u.get('/wx/userGoods/orderList', { status: 1, page: page, limit: limit }).then((res) => {
					if (res.errno === 0) {
						if (this.page === this.pages) {
							this.status = 'nomore'
						} else if(this.page <= this.pages) {
							this.status = 'loadmore'
						}
						this.pages = res.data.pages
						for (var i = 0; i < res.data.list.length; i++) {
							this.orderList.push(res.data.list[i])
						}
					}
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.content{
		height: 100%;
		position: relative;
		background-color: #eaf2fd;
		overflow-y: auto;
		
		.no-order-list{
			position: absolute;
			padding: 100rpx;
			top: 200rpx;
			left: 20rpx;
			width: calc(100% - 40rpx);
			background-color: #FFFFFF;
			border-radius: 10rpx;
		}
		
		.order-list{
			padding: 10rpx;
			position: absolute;
			top: 200rpx;
			left: 20rpx;
			width: calc(100% - 40rpx);
			
			.order-list-item{
				padding: 10rpx;
				margin-bottom: 10rpx;
				background-color: #FFFFFF;
				border-radius: 10rpx;
				
				.order-number{
					height: 50rpx;
					line-height: 50rpx;
				}
				
				.order-list-goodslist{
					.order-list-goodslist-item{
						padding: 20rpx 0rpx;
						display: flex;
						justify-content: space-between;
						
						.goods-pic{
							width: 120rpx;
							
							image{
								width: 120rpx;
								flex: 0 0 120rpx;
								height: 120rpx;
								border-radius: 8rpx;
								margin-right: 12rpx;
							}
						}
						
						.goods-info{
							padding-left: 20rpx;
							flex: 1;
							display: flex;
							align-items: center;
							justify-content: space-between;
							
							.goods-info-name{
								height: 80%;
								display: flex;
								flex-direction: column;
								justify-content: space-around;
								flex: 1;
								
								.cell-name-title{
									color: #848484;
								}
								
								.cell-name-number{
									color: #353535;
								}
							}
							.goods-info-num{
								width: 100rpx;
								height: 80%;
								display: flex;
								flex-direction: column;
								justify-content: space-around;
								
								.cell-num-title{
									color: #353535;
								}
								
								.cell-num-num{
									font-size: 48rpx;
									font-weight: 900;
									color: #03440c;
								}
								.cell-num-title,
								.cell-num-num{
									text-align: center;
								}
							}
						}
					}
					
					.order-list-goodslist-total{
						padding-top: 20rpx;
						font-size: 36rpx;
						color: #353535;
						display: flex;
						align-items: center;
						justify-content: flex-end;
					}
				}
			}
		}
	}
	
</style>

<template>
	<view class="content">
		<view v-if="loading === true" class="goods-list">
			<u-loading mode="flower"></u-loading>
		</view>
		<view v-else-if="goodsList.length === 0" class="goods-list">
			<u-empty text="暂无进货商品" mode="list"></u-empty>
		</view>
		<view v-else class="goods-list">
			<view class="goods-list-content">
				<view class="goods-list-container">
					<view v-for="(item, index) in goodsList" :key="index" class="goods-list-item">
						<view class="select">
							<u-checkbox-group @change="isCheckbox(item)">
								<u-checkbox active-color="#95d575" size="48" v-model="item.checked"></u-checkbox>
							</u-checkbox-group>
						</view>
						<view class="picYield">
							<view class="pic">
								<u-image width="100%" border-radius="10" height="150rpx" :src="item.pic_url"></u-image>
							</view>
						</view>
						<view class="namePrice">
							<view class="name">
								{{ item.name }}
							</view>
							<view class="yield">
								收益率：<span>{{ item.yield }}</span>%
							</view>
							<view class="totalPrice">
								<view class="price">
									售货价：<span>{{ item.counter_price }}元</span>
								</view>
							</view>
							<view class="sales">
								<label for="">进货量</label>
								<view class="input">
									<u-input v-model="item.num" type="digit" height="40" :border="true" placeholder="请输入进货量" />
								</view>
								<view class="unit">
									{{ item.unit }}
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			
			<view class="salesBtn">
				<view class="btn">
					<u-button shape="circle" :custom-style="customStyle" @click="handleClickSales" type="primary">立即进货</u-button>
				</view>
			</view>
		</view>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
export default {
	data() {
		return {
			loading: false,
			goodsList: [],
			purchaseList: [],
			customStyle: {
				fontSize: '36rpx',
				color: '#079334',
				backgroundColor: '#fff'
			}
		};
	},
	onLoad() {
	},
	onTabItemTap(e) {
		this.goodsList = []
		this.purchaseList = []
		this.getGoodsList()
	},
	methods: {
		getGoodsList() {
			this.loading = true
			this.$u.get('/wx/userGoods/goodsList').then((res) => {
				if (res.errno === 0) {
					this.loading = false
					for(let i = 0; i < res.data.list.length; i++) {
						res.data.list[i].counter_price = res.data.list[i].counter_price
						res.data.list[i].num = 10
						if (res.data.list[i].yield === undefined) {
							res.data.list[i].yield =  '无'
						} else {
							res.data.list[i].yield =  res.data.list[i].yield
						}
						res.data.list[i].checked = false
						this.goodsList.push(res.data.list[i])
					}
				} else {
					this.logout()
					if (res.errno !== 0) {
						uni.reLaunch({
							url: '/pages/login/login'
						})
					}
				}
			}).catch((err) => {
				this.logout()
				if (err.errno !== 0) {
					uni.reLaunch({
						url: '/pages/login/login'
					})
				}
			})
		},
		isCheckbox(item) {
			if (item.checked === false) {
				for (var i = 0; i < this.purchaseList.length; i++) {
					if (item.id === this.purchaseList[i].id) {
						this.purchaseList.splice(i, 1)
					}
				}
			} else {
				this.purchaseList.push(item)
			}
		},
		handleClickSales() {
			this.purchaseList = []
			for (var i = 0; i < this.goodsList.length; i++) {
				if (this.goodsList[i].checked === true) {
					if (this.goodsList[i].num === 0) {
						this.$refs.uToast.show({
							title: '进货量必须大于0',
							position: 'top',
							type: 'warning',
							icon: true
						})
						return false
					} else {
						this.goodsList[i].num = Number(this.goodsList[i].num)
					}
					this.purchaseList.push(this.goodsList[i])
				}
			}
			
			if (this.purchaseList.length === 0) {
				this.$refs.uToast.show({
					title: '请选择进货种类',
					position: 'top',
					type: 'error',
					icon: true
				})
			} else {
				const data = JSON.stringify(this.purchaseList)
				this.$u.route('/pages/order/index', { data: data })
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.content {
		height: 100%;
		background-image: url('http://atx.plus/static/images/loginbg.jpg');
		background-size: contain;
		
		.goods-list{
			height: 100%;
			
			height: 100%;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			
			.goods-list-content{
				flex: 1;
				border-radius: 5rpx;
				padding: 20rpx;
				overflow-y: auto;
				
				.goods-list-container{
					height: 100%;
					background-color: #FFFFFF;
					
					.goods-list-item{
						padding: 0rpx 20rpx;
						display: flex;
						justify-content: space-between;
						border-bottom: 1px dashed #d0ddff;
						background-color: #FFFFFF;
						
						.select{
							width: 100rpx;
							display: flex;
							justify-content: center;
							align-items: center;
						}
						
						.picYield{
							width: 150rpx;
							display: flex;
							align-items: center;
							justify-content: center;
							
							.pic{
								width: 150rpx;
								height: 150rpx;
								margin: 0 auto;
							}
						}
						
						.namePrice{
							flex: 1;
							display: flex;
							flex-direction: column;
							justify-content: center;
							padding-left: 20rpx;
							
							.name{
								padding: 10rpx 0;
								font-size: 32rpx;
								font-weight: 900;
								display: flex;
								align-items: center;
								justify-content: space-between;
								color: #013f0c;
							}
							
							.totalPrice{
								display: flex;
								
								.price{
									width: 100%;
									display: flex;
									align-items: flex-end;
									
									span{
										font-size: 36rpx;
										font-weight: 900;
										color: #fe5a4f;
									}
								}
							}
							
							.sales{
								padding: 10rpx 0;
								display: flex;
								justify-content: space-between;
								align-items: center;
								
								label{
									width: 100rpx;
								}
								
								.input{
									flex: 1;
								}
								
								.unit{
									width: 180rpx;
									text-align: center;
								}
							}
						}
					}
				}
			}
			
			.salesBtn{
				width: 100%;
				height: 200rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				background-color: #079334;
				
				.btn{
					width: 50%;
				}
			}
		}
	}
</style>

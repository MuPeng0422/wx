<template>
	<view class="content">
		<view v-if="loading === true" class="goods-list">
			<u-loading mode="flower"></u-loading>
		</view>
		<view v-else-if="goodsList.length === 0" class="no-goods-list">
			<u-empty text="暂无销货商品" mode="list"></u-empty>
		</view>
		<view v-else class="goods-list">
			<view class="goods-list-content">
				<view class="goods-list-container">
					<view v-for="(item, index) in goodsList" :key="index" class="goods-list-item">
						<view class="select">
							<u-checkbox-group @change="changeCheckbox(item)">
								<u-checkbox active-color="#95d575" size="48" v-model="item.checked"></u-checkbox>
							</u-checkbox-group>
						</view>
						<view class="picYield" @click="isCheckbox(item)">
							<view class="pic">
								<u-image width="100%" border-radius="10" height="150rpx" :src="item.picUrl"></u-image>
							</view>
						</view>
						<view class="namePrice" @click="isCheckbox(item)">
							<view class="name">
								{{ item.name }}
							</view>
							<view class="yield">
								收益率：<span>{{ item.yield }}</span>%
							</view>
							<view class="counterPrice">
								售货价：<span>{{ item.counterPrice }}元</span>
							</view>
							<view class="totalPrice">
								<view class="total">
									库存量：<span>{{ item.total }}</span>
								</view>
								<!-- <view class="price">
									售价：<span>{{ item.counterPrice }}元</span>
								</view> -->
							</view>
							<view class="sales">
								<label for="">销货量</label>
								<view class="input">
									<u-input v-model="item.num" type="digit" height="40" :border="true" placeholder="请输入销货数量" />
								</view>
								<view class="unit">{{ item.unit }}</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			
			<view class="salesBtn">
				<view class="btn">
					<u-button shape="circle" :custom-style="customStyle" @click="handleClickSales" type="primary">立即销货</u-button>
				</view>
			</view>
		</view>
		<u-modal v-model="modelShow" :content="content" :show-title="false" @confirm="confirm" @cancel="cancel" :show-cancel-button="true"></u-modal>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
	data() {
		return {
			title: '',
			modelShow: false,
			content: '',
			loading: false,
			goodsList: [],
			compareList: [],
			salesList: [],
			salesProfit: 0,
			saleQuota: 0,
			customStyle: {
				fontSize: '36rpx',
				color: '#079334',
				backgroundColor: '#fff'
			}
		};
	},
	onLoad() {
		this.goodsList = []
		this.compareList = []
		this.salesList = []
		this.getGoodsList()
	},
	onTabItemTap(e) {
		let pages = getCurrentPages(); // 当前页面
		let beforePage = pages[pages.length - 1]; // 前一个页面
		beforePage.onLoad(); // 执行前一个页面的onLoad方法
	},
	methods: {
		...mapMutations(['logout']),
		getGoodsList() {
			this.goodsList = []
			this.loading = true
			this.$u.get('/wx/userGoods/userGoodsList').then((res) => {
				if (res.errno === 0) {
					this.loading = false
					for(let i = 0; i < res.data.length; i++) {
						if(res.data[i].total < 0) {
							res.data[i].total = 0
						}
						
						if(res.data[i].yield === undefined) {
							res.data[i].yield = 0
						}
						
						if (res.data[i].name === undefined) {
							res.data[i].name = ''
						}
						res.data[i].num = ''
						res.data[i].total = res.data[i].total + '斤'
						if (res.data[i].unit === undefined) {
							res.data[i].unit === ''
						}
						res.data[i].checked = false
						this.goodsList.push(res.data[i])
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
			item.checked = !item.checked
			if (item.checked === false) {
				for (var i = 0; i < this.salesList.length; i++) {
					if (item.id === this.salesList[i].id) {
						this.salesList.splice(i, 1)
					}
				}
			} else {
				this.salesList.push(item)
			}
		},
		changeCheckbox(item) {
			if (item.checked === false) {
				for (var i = 0; i < this.salesList.length; i++) {
					if (item.id === this.salesList[i].id) {
						this.salesList.splice(i, 1)
					}
				}
			} else {
				this.salesList.push(item)
			}
		},
		handleClickSales() {
			if (this.salesList.length > 0) {
				for (var i = 0; i < this.salesList.length; i++) {
					if (this.salesList[i].num === '') {
						this.salesList[i].num = 0
						
						this.$refs.uToast.show({
							title: '销货量不能为空',
							position: 'top',
							type: 'error',
							icon: true
						})
						return false
					}
					var total = this.salesList[i].total.replace('斤', '')
					if (Number(this.salesList[i].num) > Number(total) ) {
						this.$refs.uToast.show({
							title: '销货量不能大于库存量',
							position: 'top',
							type: 'error',
							icon: true
						})
						return false
					} else {
						this.salesProfit += Number(this.salesList[i].num) * Number(this.salesList[i].counterPrice) * Number(this.salesList[i].yield) / 100
						this.saleQuota += Number(this.salesList[i].counterPrice) * Number(this.salesList[i].num)
						
						let row = {
							id: this.salesList[i].id,
							total: this.salesList[i].num
						}
						this.compareList.push(row)
					}
				}
				this.modelShow = true
				this.content = '总销售额: ' + this.saleQuota.toFixed(2) + '；我的收益: ' + this.salesProfit.toFixed(2)
			} else {
				this.$refs.uToast.show({
					title: '请选择销货商品',
					position: 'top',
					type: 'error',
					icon: true
				})
			}
			
		},
		confirm() {
			if (this.compareList.length > 0) {
				this.$u.post('/wx/userGoods/saleGoods', this.compareList).then((res) => {
					if(res.errno === 0) {
						this.$refs.uToast.show({
							title: '销货成功',
							position: 'top',
							type: 'success',
							icon: true
						})
						
						this.salesList = []
						this.saleQuota = 0
						this.salesProfit = 0
						
						let pages = getCurrentPages(); // 当前页面
						let beforePage = pages[pages.length - 1]; // 前一个页面
						beforePage.onLoad(); // 执行前一个页面的onLoad方法
					} else {
						this.$refs.uToast.show({
							title: '销货失败',
							position: 'top',
							type: 'error',
							icon: true
						})
						
						this.getGoodsList()
					}
				})
			} else {
				this.$refs.uToast.show({
					title: '请选择销货的种类',
					position: 'top',
					type: 'warning',
					icon: true
				})
			}
		},
		cancel() {
			this.salesList = []
			this.saleQuota = 0
			this.salesProfit = 0
			
			let pages = getCurrentPages(); // 当前页面
			let beforePage = pages[pages.length - 1]; // 前一个页面
			beforePage.onLoad(); // 执行前一个页面的onLoad方法
		}
	}
};
</script>

<style lang="scss" scoped>
.content {
	height: 100%;
	background-image: url('http://atx.plus/static/images/loginbg.jpg');
	background-size: contain;
	
	.no-goods-list{
		width: 90%;
		margin: 0 auto;
		padding: 100rpx;
		background-color: #FFFFFF;
		border-radius: 10rpx;
	}
	
	.goods-list{
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
						flex-direction: column;
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
						
						.yield{
							font-size: 28rpx;
							// font-weight: 900;
						}
						
						.counterPrice{
							font-size: 28rpx;
							// font-weight: 900;
							
							span{
								font-size: 36rpx;
								font-weight: 900;
								color: #fe5a4f;
							}
						}
						
						.totalPrice{
							display: flex;
							
							.total{
								width: 60%;
								font-size: 28rpx;
								// font-weight: 900;
								display: flex;
								align-items: flex-end;
							}
							
							.price{
								width: 40%;
								display: flex;
								align-items: flex-end;
								color: #fe5a4f;
								
								span{
									font-size: 28rpx;
									// font-weight: 900;
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

<template>
	<view class="content">
		<view class="banner">
			<u-image width="100%" height="300rpx" border-radius="10" src="http://atx.plus/static/images/user.jpg"></u-image>
		</view>
		<u-gap height="20"></u-gap>
		<view class="salesvolume">
			<view class="item sales" @click="goReflectList">
				<view class="number">
					{{ salesvolume }}
				</view>
				<view class="name">
					<u-icon name="rmb" color="#7088a0" :size="36"></u-icon>
					<span>总销售额</span>
				</view>
			</view>
			<view class="item volume" @click="goReflect">
				<view class="number">
					{{ profit }}
				</view>
				<view class="name">
					<u-icon name="red-packet" color="#7088a0" :size="36"></u-icon>
					<span>我的收益</span>
				</view>
			</view>
		</view>
		<u-gap height="20"></u-gap>
		<view class="myorder">
			我的订单
		</view>
		<u-gap height="20"></u-gap>
		<view class="navList">
			<view class="giveGoods" @click="click(0)">
				<u-badge type="error" :count="badge.one" overflow-count="99" :absolute="true" :offset="[50, 100]"></u-badge>
			</view>
			<view class="collectGoods" @click="click(1)">
				<u-badge type="error" :count="badge.two" overflow-count="99" :absolute="true" :offset="[50, 100]"></u-badge>
			</view>
		</view>
		<u-gap height="20"></u-gap>
		<view class="myaddress">
			<view class="title">
				我的地址
			</view>
			<view class="cell">
				<u-cell-group>
						<u-cell-item icon="map" title="地址管理" @click="openPage"></u-cell-item>
					</u-cell-group>
			</view>
		</view>
		<view class="logoutBtn">
			<u-button shape="circle" :custom-style="customStyle" type="primary" @click="clickLogout">退出登录</u-button>
		</view>
		<u-modal v-model="show" :content="content" :show-cancel-button="true" @confirm="confirm"></u-modal>
	</view>
</template>

<script>
	import { mapMutations } from 'vuex';
	export default {
		data() {
			return{
				src: 'https://cdn.uviewui.com/uview/swiper/2.jpg',
				salesvolume: 0,
				profit: 0,
				badge: {
					one: 0,
					two: 0
				},
				content: '确认要退出吗？',
				show: false,
				customStyle: {
					fontSize: '36rpx',
					color: '#fff',
					backgroundColor: '#079334'
				}
			}
		},
		onLoad() {
			this.getOrderList()
		},
		onTabItemTap(e) {
			let pages = getCurrentPages(); // 当前页面
			let beforePage = pages[pages.length - 1]; // 前一个页面
			beforePage.onLoad(); // 执行前一个页面的onLoad方法
		},
		methods: {
			...mapMutations(['logout']),
			getOrderList() {
				// 获取带配送列表
				this.$u.get('/wx/userGoods/orderList', { status: 1 }).then((res) => {
					if (res.errno === 0) {
						this.badge.one = res.data.total
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
				// 获取待收货列表
				this.$u.get('/wx/userGoods/orderList', { status: 2 }).then((res) => {
					if (res.errno === 0) {
						this.badge.two = res.data.total
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
				
				// 获取总销售额
				this.$u.get('/wx/userGoods/userSalesVolume').then((res) => {
					this.salesvolume = res.data
				})
				
				// 我的利益
				this.$u.get('/wx/userGoods/profit').then((res) => {
					this.profit = res.data
				})
			},
			openPage() {
				this.$u.route('/pages/address/index', {
					type: 1
				})
			},
			goReflectList() {
				this.$u.route('/pages/profit/index');
			},
			goReflect() {
				this.$u.route('/pages/reflect/index', {
					profit: this.profit
				});
			},
			click(e) {
				if (e === 0) {
					this.$u.route('/pages/giveGoods/index');
				} else {
					this.$u.route('/pages/collectGoods/index');
				}
			},
			clickLogout() {
				this.show = true;
			},
			confirm() {
				this.logout()
				uni.reLaunch({
					url: '/pages/login/login'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content{
		height: 100%;
		padding: 20rpx;
		overflow-y: auto;
		background-color: #D5E2F3;
		
		.salesvolume{
			height: 150rpx;
			padding: 20rpx;
			border-radius: 10rpx;
			background-color: #FFFFFF;
			display: flex;
			justify-content: space-between;
			
			.item{
				width: 50%;
				display: flex;
				flex-direction: column;
				justify-content: center;
				
				.number{
					font-size: 48rpx;
					font-weight: 900;
					text-align: center;
				}
				
				.name{
					display: flex;
					align-items: center;
					justify-content: center;
					
					span{
						font-size: 36rpx;
						color: #7088a0;
					}
				}
			}
			
			.sales{
				.number{
					color: #fd5c50;
				}
			}
			
			.volume{
				.number{
					color: #06963a;
				}
			}
		}
		
		.myorder{
			font-size: 36rpx;
			padding: 20rpx;
			border-radius: 10rpx;
			font-weight: 900;
			color: #00823c;
			background-color: #FFFFFF;
		}
		
		.navList{
			height: 250rpx;
			display: flex;
			justify-content: space-between;
			
			.giveGoods{
				width: 49%;
				background: url('http://atx.plus/static/images/usergive.jpg');
				background-size: contain;
				background-repeat: no-repeat;
				position: relative;
			}
			
			.collectGoods{
				width: 49%;
				background: url('http://atx.plus/static/images/usercollect.jpg');
				background-size: contain;
				background-repeat: no-repeat;
				position: relative;
			}
		}
		
		.myaddress{
			padding: 20rpx;
			border-radius: 10rpx;
			background-color: #FFFFFF;
			
			.title{
				padding-bottom: 20rpx;
				font-size: 36rpx;
				font-weight: 900;
				color: #00823c;
			}
		}
		
		.logoutBtn{
			width: 50%;
			margin: 100rpx auto;
		}
	}
</style>

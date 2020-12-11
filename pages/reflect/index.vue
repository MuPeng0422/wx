<template>
	<view class="content">
		<view class="reflect-container">
			<view class="reflect-name">
				可提现金额
			</view>
			<view class="reflect-input">
				<view class="icon">
					<u-icon name="rmb" color="#000000" size="60"></u-icon>
				</view>
				<view class="input">
					<u-input v-model="money" type="number" :height="200" :custom-style="customStyle"/>
				</view>
			</view>
		</view>
		<view class="btn">
			<u-button type="primary" :custom-style="btnCustomStyle" @click="open">立即提现</u-button>
		</view>
		
		<u-modal v-model="show" :content="content"></u-modal>
	</view>
</template>

<script>
	export default {
		data() {	
			return {
				show: false,
				money: '',
				customStyle: {
					height: '100rpx',
					fontSize: '60rpx',
					color: '#9a9a9a'
				},
				btnCustomStyle: {
					fontSize: '36rpx',
					color: '#079334',
					backgroundColor: '#fff'
				},
				content: '该功能开发中...'
			}
		},
		onLoad(option) {
			this.money = option.profit
		},
		methods: {
			open() {
				this.show = true;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content{
		padding: 20rpx;
		height: 100%;
		background-image: url('http://atx.plus/static/images/loginbg.jpg');
		background-size: contain;
		
		.reflect-container{
			width: 100%;
			padding: 30rpx;
			background-color: #FFFFFF;
			border-radius: 10rpx;
			
			.reflect-name{
				font-size: 36rpx;
				padding-bottom: 20rpx;
			}
			
			.reflect-input{
				height: 100rpx;
				padding: 20rpx 0;
				display: flex;
				align-items: center;
				border-bottom: 1rpx dashed #9a9a9a;
				
				.icon{
					width: 100rpx;
					display: flex;
					align-items: center;
					justify-content: center;
				}
				
				.input{
					width: calc(100% - 100rpx);
				}
			}
		}
		
		
		.btn{
			width: 60%;
			margin: 100rpx auto;
		}
	}
</style>

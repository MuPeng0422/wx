<template>
	<view class="wrap">
		<view class="top">
			<view class="item">
				<view class="left">收货人</view>
				<input v-model="addressObj.name" type="text" placeholder-class="line" placeholder="请填写收货人姓名" />
			</view>
			<view class="item">
				<view class="left">手机号码</view>
				<input v-model="addressObj.tel" type="number" maxlength="11" placeholder-class="line" placeholder="请填写收货人手机号" />
			</view>
			<view class="item" @tap="showRegionPicker">
				<view class="left">所在地区</view>
				<input v-model="address" disabled type="text" placeholder-class="line" placeholder="省市区县、乡镇等" />
			</view>
			<view class="item address">
				<view class="left">详细地址</view>
				<textarea v-model="addressObj.addressDetail" type="text" placeholder-class="line" placeholder="街道、楼牌等" />
			</view>
		</view>
		<!-- <view class="bottom">
			<view class="default">
				<view class="left">
					<view class="set">设置默认地址</view>
					<view class="tips">提醒：每次下单会默认推荐该地址</view>
				</view>
				<view class="right"><u-switch v-model="addressObj.isDefault" active-color="red" inactive-color="#eee" @change="setDefault" /></u-switch></view>
			</view>
		</view> -->
		<u-picker mode="region" ref="uPicker" v-model="show" @confirm="confirm" />
		<view class="addSite" @tap="toAddSite">
			<view class="add">
				<u-icon name="checkbox-mark" color="#ffffff" class="icon" :size="30"></u-icon>保存
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			show: false,
			address: '',
			addressObj: {
				name: '',
				tel: '',
				province: '',
				city: '',
				county: '',
				areaCode: '',
				addressDetail: '',
				isDefault: false
			}
		};
	},
	onLoad(option) {
		if (Object.keys(option).length > 0) {
			this.addressObj = option
			this.address = option.province + option.city + option.county
		} else {
			this.address = '陕西省西安市未央区'
		}
	},
	methods: {
		toAddSite() {
			this.$u.post('/wx/address/save', this.addressObj).then((res) => {
				if (res.errno === 0) {
					// 返回刷新
					let pages = getCurrentPages(); // 当前页面
					let beforePage = pages[pages.length - 2]; // 前一个页面
					uni.navigateBack({
					    success: function() {
					        beforePage.onLoad(); // 执行前一个页面的onLoad方法
					    }
					})
				}
			})
		},
		setDefault(e) {
			this.addressObj.isDefault = e
		},
		showRegionPicker() {
			this.show = true;
		},
		confirm(e) {
			this.addressObj.province = e.province.label
			this.addressObj.city = e.city.label
			this.addressObj.county = e.area.label
			this.addressObj.areaCode = e.area.value
			this.address = e.province.label + e.city.label + e.area.label
		}
	}
};
</script>

<style lang="scss" scoped>
/deep/ .line {
	color: $u-light-color;
	font-size: 28rpx;
}
.wrap {
	background-color: #f2f2f2;
	.top {
		background-color: #ffffff;
		border-top: solid 2rpx $u-border-color;
		padding: 22rpx;
		.item {
			display: flex;
			font-size: 32rpx;
			line-height: 100rpx;
			align-items: center;
			border-bottom: solid 2rpx $u-border-color;
			.left {
				width: 180rpx;
			}
			input {
				text-align: left;
			}
		}
		
		.address {
			padding: 20rpx 0;
			textarea {
				// width: 100%;
				height: 150rpx;
				background-color: #f7f7f7;
				line-height: 60rpx;
				margin: 40rpx auto;
				padding: 20rpx;
			}
		}
		.site-clipboard {
			padding-right: 40rpx;
			textarea {
				// width: 100%;
				height: 150rpx;
				background-color: #f7f7f7;
				line-height: 60rpx;
				margin: 40rpx auto;
				padding: 20rpx;
			}
			.clipboard {
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 26rpx;
				color: $u-tips-color;
				height: 80rpx;
				.icon {
					margin-top: 6rpx;
					margin-left: 10rpx;
				}
			}
		}
	}
	
	.bottom {
		padding: 40rpx;
		padding-right: 0;
		background-color: #ffffff;
		font-size: 28rpx;
		
		.default {
			display: flex;
			justify-content: space-between;
			border-bottom: solid 2rpx $u-border-color;
			line-height: 64rpx;
			.tips {
				font-size: 24rpx;
			}
			.right {
			}
		}
	}
	
	.addSite {
	    display: flex;
	    justify-content: space-around;
	    width: 600rpx;
	    line-height: 100rpx;
	    position: absolute;
	    bottom: 30rpx;
	    left: 80rpx;
	    background: linear-gradient(to right, #ff6034, #ee0a24);
	    border-radius: 60rpx;
	    font-size: 30rpx;
		
	    .add {
			display: flex;
			align-items: center;
			color: #ffffff;
	      
			.icon {
				margin-right: 10rpx;
			}
	    }
	}
}
</style>

<template>
	<view class="content">
		<view v-if="siteList.length === 0" class="addresNo">
			<u-empty text="未填写收货地址" mode="order"></u-empty>
		</view>
		<u-swipe-action v-else :show="item.show" :index="index" 
			v-for="(item, index) in siteList" :key="item.id" 
			@click="click" @open="open"
			:options="options"
		>
			<view class="item u-border-top" @click="submitAddress(item)">
				<view class="top">
					<view class="name">{{ item.name }}</view>
					<view class="phone">{{ item.tel }}</view>
					<!-- <view class="tag" v-if="item.isDefault">
						<text class="red">默认</text>
					</view> -->
				</view>
				<view class="bottom">
					{{ item.province }} {{ item.city }} {{ item.county }} {{ item.addressDetail }}
					<u-icon name="edit-pen" :size="40" color="#999999" @click="editAddress(item)"></u-icon>
				</view>
			</view>
		</u-swipe-action>
		<view class="addSite" @tap="toAddSite">
			<view class="add">
				<u-icon name="plus" color="#ffffff" class="icon" :size="30"></u-icon>新建收货地址
			</view>
		</view>
		<u-modal v-model="show" @confirm="confirm" :content="content" ref="uModal" :show-cancel-button="true"></u-modal>
	</view>
</template>

<script>
export default {
	data() {
		return {
			activeIndex: 0,
			show: false,
			type: null,
			siteList: [],
			content: '确认删除吗？',
			options: [
				{
					text: '删除',
					style: {
						backgroundColor: '#dd524d'
					}
				}
			]
		};
	},
	onLoad(option) {
		if(option !== undefined) {
			this.type = option.type
		}
		this.getData();
	},
	methods: {
		getData() {
			this.$u.get('/wx/address/list').then((res) => {
				for (var i = 0; i < res.data.list.length; i++) {
					res.data.list[i].show = false
				}
				this.siteList = res.data.list
			})
		},
		editAddress(data) {
			this.$u.route('/pages/address/addsite', data);
		},
		toAddSite(){
			uni.navigateTo({
			    url: '/pages/address/addsite'
			});
		},
		click(index) {
			this.show = true
			this.activeIndex = index
		},
		confirm() {
			this.$u.post('/wx/address/delete', { id: this.siteList[this.activeIndex].id }).then((res) => {
				if(res.errno === 0) {
					this.siteList.splice(this.activeIndex, 1)
				}
			})
		},
		open(index) {
			// 先将正在被操作的swipeAction标记为打开状态，否则由于props的特性限制，
			// 原本为'false'，再次设置为'false'会无效
			this.siteList[index].show = true;
			this.siteList.map((val, idx) => {
				if(index != idx) this.siteList[idx].show = false;
			})
		},
		submitAddress(item) {
			if(this.type === '0') {
				var pages = getCurrentPages()
				var prevPage = pages[pages.length - 2]
				prevPage.$vm.data = item
				uni.navigateBack({
					delta: 1
				})
			}
		}
	}
};
</script>

<style lang="scss" scoped>
	.content{
		.addresNo{
			padding: 50rpx;
		}
	}
	.item {
		padding: 40rpx 20rpx;
		background-color: #FFFFFF;
		.top {
			display: flex;
			font-weight: bold;
			font-size: 34rpx;
			.phone {
				margin-left: 60rpx;
			}
			.tag {
				display: flex;
				font-weight: normal;
				align-items: center;
				text {
					display: block;
					width: 60rpx;
					height: 34rpx;
					line-height: 34rpx;
					color: #ffffff;
					font-size: 20rpx;
					border-radius: 6rpx;
					text-align: center;
					margin-left: 30rpx;
					background-color:rgb(49, 145, 253);
				}
				.red{
					background-color:red
				}
			}
		}
		.bottom {
			display: flex;
			margin-top: 20rpx;
			font-size: 28rpx;
			justify-content: space-between;
			color: #999999;
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
		background-color: red;
		border-radius: 60rpx;
		font-size: 30rpx;
		.add{
			display: flex;
			align-items: center;
			color: #ffffff;
			.icon{
				margin-right: 10rpx;
			}
		}
	}
</style>

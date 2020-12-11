<template>
	<view class="content">
		<view class="bg">
			<u-image width="100%" height="250rpx" src="http://atx.plus/static/images/sales.jpg"></u-image>
		</view>
		
		<view class="search">
			<view class="searchbox">
				<u-search v-model="searchTime" placeholder="请选择搜索日期" :show-action="true" action-text="搜索" :animation="false" :disabled="true" :input-style="inputStyle" :clearabled="true" bg-color="#fff" :action-style="actionStyle" @click="showTime" @custom="searchInput"></u-search>
			</view>
		</view>
		<view class="todayData">
			<view class="todaydate">
				<view class="date">
					日期
				</view>
				<view class="time">
					{{$u.timeFormat(todayTime, 'yyyy年mm月dd日')}}
				</view>
			</view>
			<view class="title">
				<view class="date">
					总销售额
				</view>
				<view class="total">
					数量
				</view>
				<view class="price">
					我的利益
				</view>
			</view>
			<view class="data">
				<view class="date">
					<span>{{ numTotal }}</span>斤
				</view>
				<view class="total">
					<span>{{ salesTotal }}</span>元
				</view>
				<view class="price">
					<span>{{ profitTotal }}</span>元
				</view>
			</view>
		</view>
		<view v-if="dataList.length === 0" class="no-order-list">
			<view class="empty">
				<u-empty text="暂无记录" mode="list"></u-empty>
			</view>
		</view>
		<view v-else class="profit-list">
			<view v-for="(item, index) in dataList" :key="index" class="profit-list-item">
				<view class="profit-list-item-total">
					<view class="title">
						<view class="date">
							日期
						</view>
						<view class="total">
							数量
						</view>
						<view class="price">
							总售价
						</view>
					</view>
					<view class="data">
						<view class="date">
							{{ item.createTime }}
						</view>
						<view class="total">
							{{ item.total }}斤
						</view>
						<view class="price">
							{{ item.salesTotal }}元
						</view>
					</view>
					<view class="itemBtn">
						<u-button type="success" shape="circle" :throttle-time="0" @click="showChild(item)">
							<span>点击查看详情</span>
							<u-icon :name="[item.show ? 'arrow-up': 'arrow-down']" color="#ffffff" size="28"></u-icon>
						</u-button>
					</view>
				</view>
				<view v-show="item.show" class="profit-list-item-detailsList">
					<view class="title">
						<view class="name">
							商品
						</view>
						<view class="price">
							售价
						</view>
						<view class="number">
							数量
						</view>
						<view class="yield">
							收益率
						</view>
						<view class="interests">
							我的利益
						</view>
					</view>
					<view v-for="(row, x) in item.userGoodsSalesRecordList" :key="x" class="data">
						<view class="name">
							{{ row.goodName }}
						</view>
						<view class="price">
							{{ row.counterPrice }}元
						</view>
						<view class="number">
							{{ row.total }}斤
						</view>
						<view class="yield">
							{{ row.yield }}%
						</view>
						<view class="interests">
							{{ row.profit }}元
						</view>
					</view>
				</view>
			</view>
			<u-loadmore v-if="pages >= 1" :status="status" />
		</view>
		<u-calendar v-model="showCalendar" :mode="mode" @change="changeTime"></u-calendar>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				dataList: [],
				status: 'loadmore',
				page: 1,
				limit: 10,
				pages: 1,
				showCalendar: false,
				mode: 'range',
				startDate: '',
				endDate: '',
				searchTime: '',
				actionStyle: {
					color: '#fff',
					height: '64rpx',
					lineHeight: '64rpx',
					borderRadius: '32rpx',
					backgroundColor: '#19BE6B'
				},
				todayTime: '',
				numTotal: 0,
				salesTotal: 0,
				profitTotal: 0
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
			getData(page, limit){
				this.$u.get('/wx/userGoods/saleRecordList', {page: page, limit: limit}).then((res) => {
					this.pages = res.data.pages
					if (this.page === this.pages) {
						this.status = 'nomore'
					} else if(this.page <= this.pages) {
						this.status = 'loadmore'
					}
					
					// this.todayTime = (new Date().toLocaleDateString()).replace(new RegExp('/','g'), '-')
					this.todayTime = Date.parse(new Date())
					this.salesTotal = res.data.salesTotal
					this.numTotal = res.data.numTotal
					this.profitTotal = res.data.profitTotal
					
					for (var i = 0; i < res.data.list.length; i++) {
						res.data.list[i].createTime = res.data.list[i].createTime.slice(0, 10)
						res.data.list[i].show = false
					}
					this.dataList = res.data.list
				})
			},
			showChild(e) {
				e.show = !e.show
			},
			showTime() {
				this.showCalendar = true
			},
			changeTime(e) {
				this.startDate = e.startDate
				this.endDate = e.endDate
				this.searchTime = this.startDate + '至' + this.endDate
			},
			searchInput() {
				let startDate = this.startDate + ' 00:00:00'
				let endDate = this.endDate + ' 00:00:00'
				this.$u.get('/wx/userGoods/saleRecordList', {page: this.page, limit: this.limit, startTime: startDate, endTime: endDate}).then((res) => {
					this.pages = res.data.pages
					if (this.page === this.pages) {
						this.status = 'nomore'
					} else if(this.page <= this.pages) {
						this.status = 'loadmore'
					}
					
					this.todayTime = this.startDate + '至' + this.endDate
					this.salesTotal = res.data.salesTotal
					this.numTotal = res.data.numTotal
					this.profitTotal = res.data.profitTotal
					
					
					for (var i = 0; i < res.data.list.length; i++) {
						res.data.list[i].createTime = res.data.list[i].createTime.slice(0, 10)
						res.data.list[i].show = false
					}
					this.dataList = res.data.list
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content{
		padding: 20rpx;
		
		.search{
			width: 100%;
			height: 100rpx;
			display: flex;
			align-items: center;
			
			.searchbox{
				width: 100%;
			}
		}
		
		.todayData{
			width: 100%;
			background-color: #71D5A1;
			padding: 20rpx;
			box-shadow: 0 10px 15px 0 rgba(4,40,60,.18);
			border-radius: 10rpx;
			margin-bottom: 20rpx;
			
			.todaydate{
				padding: 20rpx 0;
				display: flex;
				align-items: center;
				
				.date{
					width: 30%;
					font-size: 36rpx;
					font-weight: 600;
					color: #000000;
					text-align: center;
				}
				
				.time{
					flex: 1;
					font-size: 36rpx;
					border-radius: 5rpx;
					padding: 5rpx 10rpx;
					background-color: #ededed;
				}
			}
			
			.title{
				font-size: 36rpx;
				font-weight: 600;
				margin-bottom: 20rpx;
				color: #000000;
				display: flex;
				justify-content: space-between;
				
				.date{
					width: 30%;
					text-align: center;
				}
				
				.total{
					width: 30%;
					text-align: center;
				}
				
				.price{
					width: 30%;
					text-align: center;
				}
			}
			
			.data{
				margin-bottom: 20rpx;
				display: flex;
				justify-content: space-between;
				
				.date{
					width: 30%;
					text-align: center;
					border-radius: 5rpx;
					padding: 5rpx 10rpx;
					background-color: #ededed;
					
					span{
						font-size: 36rpx;
						font-weight: 900;
						color: #ff0000;
					}
				}
				
				.total{
					width: 30%;
					padding: 5rpx 10rpx;
					border-radius: 5rpx;
					text-align: center;
					background-color: #ededed;
					
					span{
						font-size: 36rpx;
						font-weight: 900;
						color: #ff0000;
					}
				}
				
				.price{
					width: 30%;
					padding: 5rpx 10rpx;
					border-radius: 5rpx;
					text-align: center;
					background-color: #ededed;
					
					span{
						font-size: 36rpx;
						font-weight: 900;
						color: #ff0000;
					}
				}
			}
		}
		
		.no-order-list{
			width: 100%;
			
			// .search{
			// 	width: 100%;
			// 	height: 100rpx;
			// }
			
			.empty{
				width: 100%;
				padding: 100rpx;
				background-color: #FFFFFF;
				border-radius: 10rpx;
			}
		}
		
		.profit-list{
			width: 100%;
			
			// .search{
			// 	width: 100%;
			// 	height: 100rpx;
			// }
			
			.profit-list-item{
				margin-bottom: 20rpx;
				
				.profit-list-item-total{
					width: 100%;
					padding: 20rpx;
					background-color: #FFFFFF;
					box-shadow: 0 10px 15px 0 rgba(4,40,60,.18);
					border-radius: 10rpx;
					position: relative;
					
					.title{
						font-size: 36rpx;
						font-weight: 600;
						margin-bottom: 20rpx;
						color: #003e11;
						display: flex;
						justify-content: space-between;
						
						.date{
							width: 30%;
							text-align: center;
						}
						
						.total{
							width: 30%;
							text-align: center;
						}
						
						.price{
							width: 30%;
							text-align: center;
						}
					}
					
					.data{
						margin-bottom: 20rpx;
						display: flex;
						justify-content: space-between;
						
						.date{
							width: 30%;
							text-align: center;
							border-radius: 5rpx;
							padding: 5rpx 10rpx;
							background-color: #ededed;
						}
						
						.total{
							width: 30%;
							padding: 5rpx 10rpx;
							border-radius: 5rpx;
							text-align: center;
							background-color: #ededed;
						}
						
						.price{
							width: 30%;
							padding: 5rpx 10rpx;
							border-radius: 5rpx;
							text-align: center;
							background-color: #ededed;
						}
					}
					
					.itemBtn{
						width: 50%;
						margin: 0 auto;
						
						span{
							padding-right: 10rpx;
						}
					}
				}
				
				.profit-list-item-detailsList{
					padding: 30rpx 10rpx;
					background-color: #eeffe5;
					
					.title{
						font-size: 30rpx;
						line-height: 50rpx;
						color: #003e11;
						display: flex;
						justify-content: space-around;
						
						.name{
							width: 19%;
							text-align: center;
						}
						
						.price{
							width: 19%;
							text-align: center;
						}
						
						.number{
							width: 19%;
							text-align: center;
						}
						
						.yield{
							width: 19%;
							text-align: center;
						}
						
						.interests{
							width: 19%;
							text-align: center;
						}
					}
					
					.data{
						line-height: 40rpx;
						margin-bottom: 10rpx;
						display: flex;
						justify-content: space-around;
						
						.name{
							width: 19%;
							padding: 5rpx 10rpx;
							border-radius: 5rpx;
							text-align: center;
							background-color: #ededed;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
						}
						
						.price{
							width: 19%;
							padding: 5rpx 10rpx;
							border-radius: 5rpx;
							text-align: center;
							background-color: #ededed;
						}
						
						.number{
							width: 19%;
							padding: 5rpx 10rpx;
							border-radius: 5rpx;
							text-align: center;
							background-color: #ededed;
						}
						
						.yield{
							width: 14%;
							padding: 5rpx 10rpx;
							border-radius: 5rpx;
							text-align: center;
							background-color: #ededed;
						}
						
						.interests{
							width: 19%;
							padding: 5rpx 10rpx;
							border-radius: 5rpx;
							text-align: center;
							background-color: #ededed;
						}
					}
				}
			}
		}
	}
</style>

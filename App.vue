<script>
export default {
	onLaunch: function() {
		console.log('App Launch');
		uni.getStorage({
			key: 'userInfo',
			success:(res) => {
				if(res.data.token === '') {
					uni.reLaunch({
						url: '/pages/login/login'
					})
				} else {
					uni.reLaunch({
						url: '/pages/tabbar/sales/index'
					})
				}
			},
			fail: (err) => {
				uni.reLaunch({
					url: '/pages/login/login'
				})
			}
		})
	},
	onShow: function() {
		console.log('App Show');
	},
	onHide: function() {
		console.log('App Hide');
	}
};
</script>

<style lang="scss">
/*每个页面公共css */ 
@import "uview-ui/index.scss";
page{
	height: 100%;
	background-color: #F1F1F1;
}
</style>

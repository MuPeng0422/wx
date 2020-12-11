<template>
	<view class="content">
		<view class="title">
			<u-image width="300rpx" height="300rpx" border-radius="10" :src="logo"></u-image>
		</view>
		<u-form :model="model" :rules="rules" ref="uForm" :errorType="errorType">
			<u-form-item :leftIconStyle="{color: '#fff', fontSize: '32rpx'}" left-icon="account" :label-style="{color: '#fff'}" label-width="150" :label-position="labelPosition" label="用户名" prop="username">
				<u-input :border="border" placeholder="请输入用户名" :clearable="false" placeholder-style="color: #c9ffbe" maxlength="11" v-model="model.username" type="text"></u-input>
			</u-form-item>
			<u-form-item :leftIconStyle="{color: '#fff', fontSize: '32rpx'}" left-icon="lock" :label-style="{color: '#fff'}" label-width="150" :label-position="labelPosition" label="密码" prop="password">
				<u-input :border="border" placeholder="请输入密码" :clearable="false" placeholder-style="color: #c9ffbe" :password-icon="false" v-model="model.password" type="password"></u-input>
			</u-form-item>
		</u-form>
		<view class="submitBtn">
			<u-button type="primary" shape="circle" :custom-style="customStyle" @click="submit">提交</u-button>
		</view>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	import {mapMutations} from 'vuex'
	export default {
		name: 'login',
		data() {
			return {
				logo: '',
				title: '五月春华',
				model: {
					username: '',
					password: ''
				},
				customStyle: {
					width: '80%',
					background: '#fff',
					color: '#079334'
				},
				rules: {
					username: [
						{
							required: true,
							message: '请输入账号',
							trigger: 'blur'
						}
					],
					password: [
						{
							required: true,
							message: '请输入密码',
							trigger: 'blur'
						}
					]
				},
				border: false,
				labelPosition: 'left',
				errorType: ['message']
			}
		},
		onLoad() {
			this.getLogo()
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		methods: {
			...mapMutations(['login']),
			getLogo() {
				let wallpaperPath = 'static/img/logo.jpg'
				uni.getFileSystemManager().readFile({
					filePath: wallpaperPath,
					encoding: 'base64',
					success: (r) => {
						this.logo = 'data:image/jpeg;base64,' + r.data
					}
				})
			},
			submit() {
				this.$refs.uForm.validate(valid => {
					if (valid) {
						this.$u.post('/wx/auth/login', this.model).then(res => {
							if (res.errno === 0) {
								uni.showToast({
									title: '登录成功',
									icon: 'success',
									mask: true,
									position: 'top'
								})
								// this.$refs.uToast.show({
								// 	title: '登录成功',
								// 	position: 'top',
								// 	type: 'success',
								// 	icon: true
								// })
								this.login(res.data)
								setTimeout(() => {
									uni.switchTab({
										url: '../tabbar/sales/index'
									})
								}, 1000)
								
							} else {
								this.$refs.uToast.show({
									title: res.errmsg,
									position: 'top',
									type: 'error',
									icon: true
								})
							}
						});
					} else {
						this.$refs.uToast.show({
							title: '登录失败',
							position: 'top',
							type: 'error',
							icon: true
						})
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content{
		height: 100%;
		padding: 50rpx;
		background-image: url('http://atx.plus/static/images/loginbg.jpg');
		background-size: contain;
		
		.title{
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 60rpx;
			padding: 50rpx;
			text-align: center;
			color: $u-type-primary;
		}
		
		.submitBtn{
			margin-top: 100rpx;
		}
	}
</style>

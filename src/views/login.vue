<template>
	<div class="flex-y login-container">
    <!--背景-->
		<div class="login-bg">
      <!-- 可以设置图片 -->
			<!-- <img src="@/assets/login_bg.png" /> -->
		</div>

    <!--标题-->
    <div class="title-container">
      <h3 class="title">{{title}}</h3>
    </div>

    <!--登陆框-->
		<el-form
			ref="loginForm"
			:model="loginForm"
			:rules="loginRules"
			class="login-form"
			auto-complete="on"
			label-position="left"
		>
			<el-form-item prop="username">
				<el-input
					ref="username"
					v-model="loginForm.username"
					placeholder="请输入用户名"
					name="username"
					type="text"
					tabindex="1"
				/>
			</el-form-item>

			<el-form-item prop="password">
				<el-input
					:key="passwordType"
					ref="password"
					v-model="loginForm.password"
					:type="passwordType"
					placeholder="请输入密码"
					name="password"
					tabindex="2"
					@keyup.enter.native="handleLogin"
				/>
				<span class="show-pwd" @click="showPwd">
					<svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
				</span>
			</el-form-item>

			<el-button
				class="btn"
				:loading="loading"
				type="primary"
				@click.native.prevent="handleLogin"
			>登&nbsp;&nbsp;录</el-button>
		</el-form>
	</div>
</template>

<script>
	import defaultSettings from "@/settings.js";

	export default {
		name: "Login",
		data() {
			return {
				title: defaultSettings.title,
				loginForm: {
					username: "",
					password: ""
				},
				loginRules: {
					username: [
						{
							required: true,
							trigger: "blur",
							message: "请输入用户名"
						}
					],
					password: [
						{
							required: true,
							trigger: "blur",
							message: "请输入密码"
						}
					]
				},
				loading: false,
				passwordType: "password",
				redirect: undefined
			};
		},
		watch: {
			$route: {
				handler: function(route) {
					this.redirect = route.query && route.query.redirect;
				},
				immediate: true
			}
		},
		methods: {
			showPwd() {
				if (this.passwordType === "password") {
					this.passwordType = "";
				} else {
					this.passwordType = "password";
				}
				this.$nextTick(() => {
					this.$refs.password.focus();
				});
			},
			handleLogin() {
				this.$refs.loginForm.validate(valid => {
					if (valid) {
						this.loading = true;
						this.$store
							.dispatch("user/login", this.loginForm)
							.then(() => {
								this.$router.push({
									path: this.redirect || "/"
								});
								this.loading = false;
							})
							.catch(() => {
								this.loading = false;
							});
					} else {
						console.log("error submit!!");
						return false;
					}
				});
			}
		}
	};
</script>

<style lang="scss">
	/* 修复input 背景不协调 和光标变色 */
	/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

	$bg: #fff;
	$light_gray: #d0d0d0;
	$cursor: #43425d;

	@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
		.login-container .el-input input {
			color: $cursor;
		}
	}

	/* reset element-ui css */
	.login-container {
		.el-input {
			display: inline-block;
			height: 47px;
			width: 85%;

			input {
				background: transparent;
				border: 0;
				border-bottom: 1px solid $light_gray;
				-webkit-appearance: none;
				border-radius: 0px;
				padding: 12px 5px 12px 15px;
				color: $cursor;
				height: 55px;
				caret-color: $cursor;

				&:-webkit-autofill {
					box-shadow: 0 0 0px 1000px $bg inset !important;
					-webkit-text-fill-color: $cursor !important;
				}
			}
		}

		.el-form-item__error {
			left: 44px;
			top: 112%;
		}
	}
</style>

<style lang="scss" scoped>
  $bg_color: #409EFF;//背景色
  $title_color:#fff;//标题色
  
	.login-container {
		height: 100%;
		width: 100%;
		overflow: auto;
		justify-content: center;

		.login-bg {
			position: absolute;
			width: 100%;
			height: 55%;
			top: 0;
      left: 0;
      background: $bg_color;

			img {
				width: 100%;
				height: 100%;
			}
		}

		.login-form {
			width: 500px;
			text-align: center;
			position: relative;
			background: #fff;
			padding: 50px 20px;
			box-shadow: 3px 3px 8px 1px #c4b9b9;
		}

		.title-container {
			position: relative;
			text-align: center;

			.title {
				font-size: 28px;
				color: $title_color;
				margin: 0px auto;
				font-weight: bold;
				letter-spacing: 5px;
				padding-bottom: 15px;
			}
		}

		.show-pwd {
			position: absolute;
			right: 10px;
			top: 7px;
			font-size: 16px;
			color: #889aa4;
			cursor: pointer;
			user-select: none;
		}

		.btn {
			width: 85%;
			height: 40px;
			background: $bg_color;
			border: 0;
			border-radius: 2px;
			margin-top: 20px;
		}
	}
</style>

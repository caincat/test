<template>
	<div class="navbar">
		<!--头部的插槽-->
		<slot name="head">
			<!--插槽默认内容-->
			<span class="head">{{title}}</span>
		</slot>

		<div class="right-menu">
			<el-dropdown class="avatar-container sub-menu" trigger="click">
				<div class="avatar-wrapper">
					<p class="user-name">{{name}}</p>
					<i class="el-icon-caret-bottom" />
				</div>
				<el-dropdown-menu slot="dropdown" class="user-dropdown">
					<router-link to="/">
						<el-dropdown-item @click.native="logout">退出</el-dropdown-item>
					</router-link>
					<!--下拉菜单的插槽-->
					<slot name="dropdownItem"></slot>
				</el-dropdown-menu>
			</el-dropdown>
			<div class="user-avatar sub-menu">
				<i class="el-icon-user"></i>
			</div>
		</div>
	</div>
</template>

<script>
	import { mapGetters } from "vuex";
	import defaultSettings from "@/settings.js";
	export default {
		data() {
			return {
				title: defaultSettings.title
			};
		},
		computed: {
			...mapGetters(["name"])
		},
		methods: {
			async logout() {
				await this.$store.dispatch("user/logout");
				this.$router.push(`/login?redirect=${this.$route.fullPath}`);
			}
		}
	};
</script>

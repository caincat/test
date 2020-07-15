<template>
	<div :class="classObj" class="app-wrapper">
		<div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
		<sidebar class="sidebar-container" />
		<div class="main-container">
			<div :class="{'fixed-header':fixedHeader}">
				<navbar @updatePassword="passwordForm.visible = true" />
			</div>
			<app-main />
			<base-form
				v-model="passwordForm.visible"
				:model="passwordForm.model"
				:api="passwordForm.api"
				:title="passwordForm.title"
				:items="passwordForm.items"
				:event="passwordForm.event"
				:showSave="false"
				:operationList="passwordForm.operationList"
				@changePassword="changePassword"
			></base-form>
		</div>
	</div>
</template>

<script>
	import { Navbar, Sidebar, AppMain } from "./components";
	import ResizeMixin from "./mixin/ResizeHandler";

	export default {
		name: "Layout",
		components: {
			Navbar,
			Sidebar,
			AppMain
		},
		mixins: [ResizeMixin],
		data() {
			return {
				passwordForm: {
					title: "修改密码",
					visible: false,
					model: {},
					api: "/user/self",
					event: "edit",
					items: [
						{
							prop: "oldPwd",
							label: "原密码",
							rule: "required",
							attrs: {
								type: "password"
							}
						},
						{
							prop: "newPwd",
							label: "新密码",
							rule: "required",
							attrs: {
								type: "password"
							}
						}
					],
					operationList: [
						{
							name: "修改",
              event: "changePassword",
              isValidate: true
						}
					]
				}
			};
		},
		computed: {
			sidebar() {
				return this.$store.state.app.sidebar;
			},
			device() {
				return this.$store.state.app.device;
			},
			fixedHeader() {
				return this.$store.state.settings.fixedHeader;
			},
			classObj() {
				return {
					hideSidebar: !this.sidebar.opened,
					openSidebar: this.sidebar.opened,
					withoutAnimation: this.sidebar.withoutAnimation,
					mobile: this.device === "mobile"
				};
			}
		},
		methods: {
			handleClickOutside() {
				this.$store.dispatch("app/closeSideBar", {
					withoutAnimation: false
				});
			},
			changePassword(obj) {
				//点击修改
				this.API.patch(
					`/user/self?oldPwd=${obj.oldPwd}&newPwd=${obj.newPwd}`
				).then(res => {
					if (res) {
						this.passwordForm.visible = false;
						this.TOOL.message("success", "修改成功");
					}
				});
			}
		}
	};
</script>

<style lang="scss" scoped>
	@import "~@/styles/mixin.scss";
	@import "~@/styles/variables.scss";

	.app-wrapper {
		@include clearfix;
		position: relative;
		height: 100%;
		width: 100%;

		&.mobile.openSidebar {
			position: fixed;
			top: 0;
		}
	}

	.drawer-bg {
		background: #000;
		opacity: 0.3;
		width: 100%;
		top: 0;
		height: 100%;
		position: absolute;
		z-index: 999;
	}

	.fixed-header {
		position: fixed;
		top: 0;
		right: 0;
		z-index: 9;
		width: calc(100% - #{$sideBarWidth});
		transition: width 0.28s;
	}

	.hideSidebar .fixed-header {
		width: calc(100% - 54px);
	}

	.mobile .fixed-header {
		width: 100%;
	}
</style>

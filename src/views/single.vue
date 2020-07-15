<template>
	<div>
		<div class="fixed-header">
			<!--可引入页头-->
			<navWrap></navWrap>
		</div>
		<div class="page">
			<h1>独立页面内容</h1>
		</div>
	</div>
</template>

<script>
	import NavWrap from "@/layout/components/NavWrap";

	export default {
		components: {
			NavWrap
		},
		data() {
			return {};
		},
		computed: {},
		methods: {}
	};
</script>

<style lang="scss" scoped>
	.page {
		padding-top: 50px;
		min-height: 100vh;
		width: 100%;
		position: relative;
	}
	.fixed-header {
		position: fixed;
		top: 0;
		right: 0;
		z-index: 9;
		width: 100%;
	}
</style>

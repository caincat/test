<template>
	<div class="base-dialog">
		<el-dialog
			:visible.sync="_visible"
			:title="title"
			:close-on-click-modal="closeOnClickModal"
			:fullscreen="fullscreen"
			:modal="!fullscreen"
			:class="{'full-dialog':fullscreen}"
			:show-close="showClose"
			:width="width"
			top="5vh"
			v-dialogDrag:[fullscreen]
		>
			<!--内部自定义-->
			<slot></slot>

			<!--底部按钮-->
			<div slot="footer" class="dialog-footer">
				<template v-for="(operation,index) in operationList">
					<el-button
						:key="index"
						:type="operation.type||'primary'"
						@click="$emit(operation.event)"
						size="small"
					>{{operation.name}}</el-button>
				</template>
				<!--提供默认的关闭按钮，可通过showClose来控制隐藏-->
				<el-button v-show="showClose" @click="close" size="small">关 闭</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		name: "base-dialog",
		props: {
			visible: {
				//是否可见
				type: Boolean,
				default: false
			},
			title: {
				//标题
				type: String,
				default: ""
			},
			operationList: {
				// 操作按钮组
				type: Array,
				default: () => []
			}
		},
		data() {
			return {};
		},
		model: {
			prop: "visible",
			event: "on-model-change"
		},
		computed: {
			fullscreen() {
				//是否全屏
				return !!this.$attrs["fullscreen"];
			},
			showClose() {
				//是否可关闭
				return this.$attrs["showClose"] !== false;
			},
			closeOnClickModal() {
				//点击蒙层是否关闭
				return !!this.$attrs["close-on-click-modal"];
			},
			width() {
				//宽度
				return this.$attrs.width || "70%";
			},
			_visible: {
				get() {
					return this.visible;
				},
				set() {
					this.close();
				}
			}
		},
		methods: {
			close() {
				this.$emit("on-model-change", false);
			}
		}
	};
</script>

<style lang="scss">
	.base-dialog {
		.el-dialog {
			min-width: 400px;
			overflow: auto;

			.el-dialog__body {
				padding: 10px 20px 0px 20px;
			}
		}

		.el-dialog__wrapper.full-dialog {
			position: absolute;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			z-index: 1000 !important;
		}
	}
</style>

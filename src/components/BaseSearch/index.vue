<template>
	<div class="base-search">
		<ValidationObserver ref="observer">
			<div class="flex-x base-form">
				<div
					v-show="item.prop"
					:class="`base-form-item ${item.tag||''}`"
					v-for="(item, index) in _items"
					:key="index"
				>
					<base-form-item :labelWidth="labelWidth" :item="item" v-model="model[item.prop]"></base-form-item>
				</div>
				<!-- 使用：<template v-slot:exSearch="{ Model }"></template> -->
				<slot name="exSearch" v-bind:Model="model"></slot>
				<div class="operations">
					<el-button size="mini" class="btn" @click="handleReset">重置</el-button>
					<el-button size="mini" class="btn" @click="handleSearch" type="primary">查询</el-button>
				</div>
			</div>
		</ValidationObserver>
	</div>
</template>

<script>
	export default {
		name: "base-search",
		props: {
			labelWidth:{//标签文字宽度
				type:Number,
				default:70
			},
			model: {//绑定值
				type: Object,
				default: () => {}
			},
			items: {//数据项
				type: Array,
				required: true
			}
		},
		data() {
			return {};
		},
		computed: {
			_items() {
				return this.items;
			}
		},
		methods: {
			handleReset() {
				if(this.$listeners.clickReset){
					//如果有重置事件，则触发事件
					this.$emit("clickReset", this.model);
				}else{
					//默认清空所有值
					Object.keys(this.model).map(prop => {
						this.model[prop]=""
					})
				}
			},
			async handleSearch() {
				//点击查询按钮
				const isValid = await this.$refs.observer.validate();
				if (isValid) {
					//克隆一个新对象
					let model = this.TOOL.clone(this.model);
					//如果参数的值为空，则删掉该参数
					Object.keys(model).map(prop => {
						if (
							model[prop] === undefined ||
							model[prop] === null ||
							model[prop] === ""
						) {
							delete model[prop];
						} else if (prop.indexOf(",") != -1) {
							//处理中间有逗号分隔的选项
							if (model[prop].length) {
								let props = prop.split(",");
								model[props[0]] = model[prop][0];
								model[props[1]] = model[prop][1];
							}
							delete model[prop];
						}
					});
					//触发点击查询按钮事件，返回处理后的值
					this.$emit("clickSearch", model);
				}
			}
		}
	};
</script>

<style lang="scss">
	.base-search {
		margin: 0 10px 5px 0;

		.el-form-item__error {
			top: 85%;
		}

		.base-form {
			justify-content: flex-start;
			flex-wrap: wrap;

			& > .base-form-item {
				flex: 0 0 25%;
			}

			.operations {
				flex: 1 1 25%;
				text-align: right;

				.btn {
					margin-top: 6px;
				}
			}
		}

		.el-form-item {
			margin-bottom: 4px;
		}
	}
</style>
